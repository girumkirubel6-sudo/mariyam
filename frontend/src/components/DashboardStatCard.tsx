import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  colorScheme?: 'green' | 'gold' | 'charcoal' | 'amber' | 'emerald';
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'green',
}) => {
  const schemeStyles = {
    green: {
      border: 'border-[#0C3823]/20',
      iconBg: 'bg-[#0C3823]/10 text-[#0C3823]',
      accent: 'border-t-4 border-t-[#0C3823]',
    },
    gold: {
      border: 'border-[#D4AF37]/30',
      iconBg: 'bg-[#D4AF37]/15 text-[#916B15]',
      accent: 'border-t-4 border-t-[#D4AF37]',
    },
    charcoal: {
      border: 'border-stone-200',
      iconBg: 'bg-stone-100 text-stone-700',
      accent: 'border-t-4 border-t-stone-800',
    },
    amber: {
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
      accent: 'border-t-4 border-t-amber-500',
    },
    emerald: {
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      accent: 'border-t-4 border-t-emerald-600',
    },
  }[colorScheme];

  return (
    <div
      className={`bg-white rounded-2xl p-5 border shadow-xs transition-all duration-200 hover:shadow-md ${schemeStyles.border} ${schemeStyles.accent}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${schemeStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && <span className="text-xs font-semibold text-emerald-600">{trend}</span>}
      </div>
      {subtitle && <p className="text-xs text-stone-500 mt-1.5 leading-snug">{subtitle}</p>}
    </div>
  );
};
