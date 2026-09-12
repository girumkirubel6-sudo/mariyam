import React from 'react';
import { Link } from 'react-router-dom';
import { Region } from '../types';
import { MapPin, Layers, FileText, ArrowRight } from 'lucide-react';

interface RegionCardProps {
  region: Region;
}

export const RegionCard: React.FC<RegionCardProps> = ({ region }) => {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#0C3823] p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center font-serif font-bold text-sm border border-[#0C3823]/20">
            {region.code}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
            Capital: {region.capital}
          </span>
        </div>

        <div className="mb-2">
          <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-[#0C3823] transition-colors">
            {region.name}
          </h3>
          {region.amharicName && (
            <p className="text-xs font-ethiopic text-[#0C3823] font-semibold">{region.amharicName}</p>
          )}
        </div>

        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
          {region.description}
        </p>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs mb-4">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{region.zonesCount || 0} Zones</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-600">
            <FileText className="w-3.5 h-3.5 text-[#0C3823]" />
            <span>{region.recordsCount || 0} Registered</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Regional State
        </span>
        <Link
          to={`/regions/${region.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3823] group-hover:text-[#D4AF37] transition-colors"
        >
          Explore Zones & Heritage <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
