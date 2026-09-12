import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authApi, LoginPayload, RegisterPayload } from '../api/authApi';
import { getDemoMode, setDemoMode as setDemoModeHelper } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  quickLoginAsRole: (role: UserRole) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoMode, setDemoModeState] = useState<boolean>(getDemoMode());

  useEffect(() => {
    const storedUser = authApi.getCurrentUser();
    const storedToken = authApi.getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsLoading(false);

    const handleDemoChange = () => {
      setDemoModeState(getDemoMode());
    };
    window.addEventListener('wemezekr_demo_mode_change', handleDemoChange);
    return () => window.removeEventListener('wemezekr_demo_mode_change', handleDemoChange);
  }, []);

  const setDemoMode = (enabled: boolean) => {
    setDemoModeHelper(enabled);
    setDemoModeState(enabled);
    // If enabling demo mode and not logged in, auto-provide an admin profile for seamless test navigation
    if (enabled && !user) {
      const demoAdmin: User = {
        id: 'usr-admin-demo',
        name: 'Dr. Berhanu Wolde (National Director)',
        email: 'director@wemezekr.gov.et',
        role: 'ADMIN',
      };
      setUser(demoAdmin);
      setToken('demo-jwt-admin-token');
    }
  };

  const login = async (credentials: LoginPayload) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
    setToken(res.token);
  };

  const register = async (data: RegisterPayload) => {
    const res = await authApi.register(data);
    setUser(res.user);
    setToken(res.token);
  };

  const quickLoginAsRole = (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      ADMIN: 'Dr. Berhanu Wolde (National Director)',
      REGIONAL_ADMIN: 'Almaz Tefera (Amhara Regional Director)',
      ZONE_ADMIN: 'Teklehaimanot Gebre (Axum Zonal Registrar)',
      RESEARCHER: 'Prof. Rita Pankhurst Fellow',
      PUBLIC: 'Yared Hailu (Public Researcher)',
    };
    const newUser: User = {
      id: `usr-${role.toLowerCase()}-quick`,
      name: roleNames[role] || 'Wemezekr Official',
      email: `${role.toLowerCase()}@wemezekr.gov.et`,
      role,
    };
    localStorage.setItem('wemezekr_auth_user', JSON.stringify(newUser));
    localStorage.setItem('wemezekr_auth_token', `quick-token-${role.toLowerCase()}`);
    setUser(newUser);
    setToken(`quick-token-${role.toLowerCase()}`);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        demoMode,
        setDemoMode,
        login,
        register,
        quickLoginAsRole,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
