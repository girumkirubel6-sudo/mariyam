import React from 'react';
import { Link } from 'react-router-dom';
import { LiteratureItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { BookOpen, User, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface LiteratureCardProps {
  item: LiteratureItem;
}

export const LiteratureCard: React.FC<LiteratureCardProps> = ({ item }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#0C3823]/60 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0C3823]/10 text-[#0C3823]">
            {item.category}
          </span>
          <StatusBadge status={item.status} size="sm" />
        </div>

        <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-[#0C3823] transition-colors line-clamp-1 mb-1">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-stone-600 mb-3 font-medium">
          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{item.author || 'Anonymous / Assembly'}</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">{item.language}</span>
        </div>

        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{item.publicationYear}</span>
        </div>
        <Link
          to={`/literature/${item.id}`}
          className="inline-flex items-center gap-1 font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors"
        >
          View Record <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
