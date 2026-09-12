import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';
import { AuthResponse, User, UserRole } from '../types';
import { getDemoMode } from '../utils/helpers';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  regionId?: string;
  zoneId?: string;
}

export const authApi = {
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    if (getDemoMode()) {
      // Demo authentication simulation
      const simulatedRole: UserRole = credentials.email.includes('admin')
        ? 'ADMIN'
        : credentials.email.includes('regional')
        ? 'REGIONAL_ADMIN'
        : credentials.email.includes('research')
        ? 'RESEARCHER'
        : 'ZONE_ADMIN';

      const demoUser: User = {
        id: 'usr-demo-' + Math.random().toString(36).substring(2, 7),
        name: credentials.email.split('@')[0].toUpperCase(),
        email: credentials.email,
        role: simulatedRole,
        regionId: 'reg-amhara',
        zoneId: 'zone-north-gondar',
      };
      const response: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: demoUser,
        message: 'Authenticated in interactive preview mode',
      };
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      return response;
    }

    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    if (getDemoMode()) {
      const demoUser: User = {
        id: 'usr-new-' + Math.random().toString(36).substring(2, 7),
        name: data.name,
        email: data.email,
        role: data.role || 'ZONE_ADMIN',
        regionId: data.regionId,
        zoneId: data.zoneId,
      };
      const response: AuthResponse = {
        token: 'mock-jwt-token-registered-' + Date.now(),
        user: demoUser,
        message: 'Registered successfully in interactive preview mode',
      };
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      return response;
    }

    const payload = {
      ...data,
      role: data.role || 'ZONE_ADMIN',
    };
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    if (res.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
};
