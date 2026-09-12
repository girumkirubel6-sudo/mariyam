import React from 'react';
import { SubmissionStatus } from '../types';

interface StatusBadgeProps {
  status: SubmissionStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let bg = 'bg-stone-100 text-stone-700 border-stone-300';
  let label = status;

  switch (status) {
    case 'SUBMITTED':
      bg = 'bg-blue-50 text-blue-800 border-blue-200';
      label = 'Submitted';
      break;
    case 'UNDER_REVIEW':
      bg = 'bg-amber-50 text-amber-800 border-amber-300';
      label = 'Under Review';
      break;
    case 'APPROVED':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      label = 'Approved';
      break;
    case 'REJECTED':
      bg = 'bg-red-50 text-red-800 border-red-200';
      label = 'Rejected';
      break;
    case 'COLLECTED':
      bg = 'bg-purple-50 text-purple-800 border-purple-200';
      label = 'Collected';
      break;
    case 'ARCHIVED':
      bg = 'bg-[#0C3823]/10 text-[#0C3823] border-[#0C3823]/30 font-semibold';
      label = 'Archived in Vault';
      break;
    default:
      bg = 'bg-stone-100 text-stone-700 border-stone-200';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wider ${sizeClasses[size]} ${bg}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {label}
    </span>
  );
};
