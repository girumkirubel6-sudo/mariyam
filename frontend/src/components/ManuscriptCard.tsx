import React from 'react';
import { Link } from 'react-router-dom';
import { ManuscriptItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { Scroll, MapPin, Calendar, FileText, ArrowRight } from 'lucide-react';
import { truncateText } from '../utils/helpers';

interface ManuscriptCardProps {
  manuscript: ManuscriptItem;
}

export const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ manuscript }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#D4AF37]/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Visual Header / Cover preview */}
      <div className="relative h-48 bg-stone-900 overflow-hidden">
        {manuscript.fileUrl ? (
          <img
            src={manuscript.fileUrl}
            alt={manuscript.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-ethiopic-pattern flex flex-col items-center justify-center text-center p-4">
            <Scroll className="w-10 h-10 text-[#D4AF37] mb-2" />
            <span className="text-xs text-[#F4E7BE] font-serif tracking-widest uppercase">Illuminated Codex</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={manuscript.status} size="sm" />
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#D4AF37] text-[#0C3823] mb-1">
            {manuscript.language}
          </span>
          <h3 className="font-serif font-bold text-base line-clamp-1 leading-snug drop-shadow-sm">
            {manuscript.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mb-3 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">{manuscript.estimatedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#0C3823] shrink-0" />
              <span className="truncate">{manuscript.regionName || manuscript.currentLocation}</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
            {manuscript.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-mono">
              Script: {truncateText(manuscript.script, 22)}
            </span>
            <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
              Condition: {manuscript.physicalCondition}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {manuscript.fileName ? 'Digitized Facsimile' : 'Vault Cataloged'}
          </span>
          <Link
            to={`/manuscripts/${manuscript.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3823] group-hover:text-[#D4AF37] transition-colors"
          >
            Inspect Manuscript <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
