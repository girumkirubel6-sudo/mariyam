import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { Shield, Key, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, quickLoginAsRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    quickLoginAsRole(role);
    toast.success(`Switched active session to ${role.replace('_', ' ')}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0C3823] text-[#D4AF37] flex items-center justify-center mx-auto border-2 border-[#D4AF37]/50 shadow-md font-ethiopic font-bold text-2xl">
            ወ
          </div>
          <h1 className="font-serif font-black text-3xl text-stone-900 tracking-tight">
            Sign In to WEMEZEKR
          </h1>
          <p className="text-xs text-stone-600">
            Access curatorial registry, zonal assessments, and codex digitization vaults.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@wemezekr.gov.et"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-stone-400">Default: password123</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Key className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Role Switcher / Demo Accounts */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Quick Login Demo Roles
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                1-Click Testing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { role: 'ADMIN' as const, label: 'Central Admin', desc: 'Full system control' },
                { role: 'REGIONAL_ADMIN' as const, label: 'Regional Admin', desc: 'Tigray / Amhara' },
                { role: 'ZONE_ADMIN' as const, label: 'Zonal Registrar', desc: 'Axum / Gondar' },
                { role: 'RESEARCHER' as const, label: 'Philologist', desc: 'Scholarly research' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleQuickLogin(item.role)}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-[#0C3823] hover:bg-[#FAF8F5] text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-stone-800 group-hover:text-[#0C3823]">
                      {item.label}
                    </strong>
                    <UserCheck className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#0C3823]" />
                  </div>
                  <span className="text-[10px] text-stone-500 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-xs text-stone-500">
              Need a registrar staff account?{' '}
              <Link to="/register" className="font-bold text-[#0C3823] hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
