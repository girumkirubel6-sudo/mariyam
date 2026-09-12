import React from 'react';
import { Link } from 'react-router-dom';
import { ArchiveItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { Archive, Calendar, MapPin, ArrowRight, Hash } from 'lucide-react';

interface ArchiveCardProps {
  item: ArchiveItem;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ item }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-600/50 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            {item.archiveType}
          </span>
          <StatusBadge status={item.status} size="sm" />
        </div>

        <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-amber-900 transition-colors line-clamp-1 mb-1">
          {item.title}
        </h3>

        {item.documentNumber && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 mb-2">
            <Hash className="w-3 h-3 text-[#D4AF37]" />
            <span>{item.documentNumber}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-stone-600 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{item.date}</span>
          </div>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">{item.language}</span>
        </div>

        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5 truncate max-w-[180px]">
          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>
        <Link
          to={`/archives/${item.id}`}
          className="inline-flex items-center gap-1 font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors"
        >
          Inspect Archive <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
