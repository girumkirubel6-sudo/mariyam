import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileCheck,
  ClipboardList,
  Archive,
  Map,
  Layers,
  Users,
  PlusCircle,
  Sparkles,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role = user.role;

  const navigationItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'REGIONAL_ADMIN', 'ZONE_ADMIN', 'RESEARCHER', 'PUBLIC'],
    },
    {
      name: 'Submissions',
      path: '/dashboard/submissions',
      icon: FileCheck,
      roles: ['ADMIN', 'REGIONAL_ADMIN', 'ZONE_ADMIN'],
    },
    {
      name: 'Assessments',
      path: '/dashboard/assessments',
      icon: ClipboardList,
      roles: ['ADMIN', 'REGIONAL_ADMIN'],
    },
    {
      name: 'Collections & Vault',
      path: '/dashboard/collections',
      icon: Archive,
      roles: ['ADMIN', 'REGIONAL_ADMIN'],
    },
    {
      name: 'Regional States',
      path: '/dashboard/regions',
      icon: Map,
      roles: ['ADMIN'],
    },
    {
      name: 'Administrative Zones',
      path: '/dashboard/zones',
      icon: Layers,
      roles: ['ADMIN', 'REGIONAL_ADMIN'],
    },
    {
      name: 'User Management',
      path: '/dashboard/users',
      icon: Users,
      roles: ['ADMIN'],
    },
  ];

  const allowedItems = navigationItems.filter((item) => item.roles.includes(role));

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-stone-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-81px)]">
      <div className="p-5">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0C3823] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-stone-900 truncate">{user.name}</h4>
              <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
            </div>
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#0C3823]/10 text-[#0C3823] uppercase">
            {user.role.replace('_', ' ')}
          </span>
        </div>

        {/* Quick Action */}
        {(role === 'ADMIN' || role === 'ZONE_ADMIN' || role === 'REGIONAL_ADMIN') && (
          <Link
            to="/register-heritage"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs mb-6"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Heritage Asset</span>
          </Link>
        )}

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold tracking-wider uppercase text-stone-400 px-3 mb-2">
            Registry Administration
          </p>
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#0C3823] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100/80 hover:text-[#0C3823]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom links */}
      <div className="p-5 border-t border-stone-100 space-y-2">
        <Link
          to="/ai-assistant"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF6EB] text-[#856404] hover:bg-[#F4E7BE] transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Heritage AI Assistant</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-[#0C3823] hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
};
