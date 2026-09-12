import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { Shield, Key, Mail, User, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('RESEARCHER');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.warning('Please complete all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, role });
      toast.success('Registration successful. Welcome to Wemezekr.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0C3823] text-[#D4AF37] flex items-center justify-center mx-auto border-2 border-[#D4AF37]/50 shadow-md font-ethiopic font-bold text-2xl">
            ወ
          </div>
          <h1 className="font-serif font-black text-3xl text-stone-900 tracking-tight">
            Register for Wemezekr
          </h1>
          <p className="text-xs text-stone-600">
            Create an academic researcher, zonal registrar, or public scholarly account.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Berhanu Gebre"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Institutional Email
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
                  placeholder="name@university.edu.et"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Key className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Requested Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              >
                <option value="RESEARCHER">Researcher / Philologist</option>
                <option value="ZONE_ADMIN">Zonal Registrar / Field Officer</option>
                <option value="REGIONAL_ADMIN">Regional Heritage Bureau Admin</option>
                <option value="PUBLIC">Public User / Cultural Enthusiast</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-xs text-stone-500">
              Already have an authorized account?{' '}
              <Link to="/login" className="font-bold text-[#0C3823] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
