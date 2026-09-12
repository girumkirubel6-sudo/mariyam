import React, { ReactNode } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback,
}) => {
  const { user, hasRole } = useAuth();

  if (!user || !hasRole(allowedRoles)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="p-8 max-w-lg mx-auto my-12 text-center bg-white rounded-2xl border border-red-200 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Restricted Heritage Access</h3>
        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Your current account role ({user?.role || 'Guest'}) does not have administrative privileges to manage this module.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C3823] text-white font-medium text-xs hover:bg-[#124f33] transition-colors"
        >
          Return to User Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
