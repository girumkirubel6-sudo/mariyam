import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Heritage Records Found',
  description = 'There are currently no items matching the requested criteria or filter parameters in the registry.',
  actionLabel,
  actionLink,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center mb-4 border border-[#0C3823]/20">
        {icon || <BookOpen className="w-8 h-8" />}
      </div>
      <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLink && actionLabel && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C3823] text-white font-medium text-sm hover:bg-[#124f33] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}

      {onAction && actionLabel && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C3823] text-white font-medium text-sm hover:bg-[#124f33] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
