import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { BookOpen, Archive, Scroll, MapPin, Calendar, ArrowRight } from 'lucide-react';

export interface GenericHeritageItem {
  id: string;
  title: string;
  author?: string;
  type: 'LITERATURE' | 'ARCHIVE' | 'MANUSCRIPT';
  regionName?: string;
  zoneName?: string;
  language: string;
  status: any;
  date?: string;
  description: string;
}

interface HeritageCardProps {
  item: GenericHeritageItem;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({ item }) => {
  const typeConfig = {
    MANUSCRIPT: {
      label: 'Ancient Manuscript',
      badgeBg: 'bg-[#D4AF37]/20 text-[#7D5B08] border-[#D4AF37]/50',
      icon: <Scroll className="w-4 h-4 text-[#D4AF37]" />,
      route: `/manuscripts/${item.id}`,
    },
    LITERATURE: {
      label: 'Literature',
      badgeBg: 'bg-[#0C3823]/10 text-[#0C3823] border-[#0C3823]/20',
      icon: <BookOpen className="w-4 h-4 text-[#0C3823]" />,
      route: `/literature/${item.id}`,
    },
    ARCHIVE: {
      label: 'Historical Archive',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: <Archive className="w-4 h-4 text-amber-800" />,
      route: `/archives/${item.id}`,
    },
  }[item.type];

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#0C3823]/60 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeConfig.badgeBg}`}
          >
            {typeConfig.icon}
            {typeConfig.label}
          </span>
          <StatusBadge status={item.status} size="sm" />
        </div>

        <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-[#0C3823] transition-colors line-clamp-1 mb-1">
          {item.title}
        </h3>

        {item.author && (
          <p className="text-xs font-medium text-stone-600 mb-2">
            By <span className="text-stone-800 font-semibold">{item.author}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-3">
          {item.date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{item.date}</span>
            </div>
          )}
          <span>•</span>
          <span>{item.language}</span>
          {(item.regionName || item.zoneName) && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{item.zoneName || item.regionName}</span>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
        <Link
          to={typeConfig.route}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3823] group-hover:text-[#D4AF37] transition-colors"
        >
          View Full Heritage Record <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
