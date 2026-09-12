import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Accessing Wemezekr registry...',
  size = 'md',
  fullHeight = false,
}) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 gap-3 text-stone-600 ${
        fullHeight ? 'min-h-[60vh]' : ''
      }`}
    >
      <div className="relative">
        <Loader2 className={`${sizeClass} animate-spin text-[#0C3823]`} />
        <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-ping opacity-25"></div>
      </div>
      {label && <p className="text-sm font-medium text-stone-600 tracking-wide">{label}</p>}
    </div>
  );
};
