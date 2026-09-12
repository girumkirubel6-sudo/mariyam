import React from 'react';
import { SearchFilters, Region, Zone } from '../types';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  regions: Region[];
  zones: Zone[];
  showTypeFilter?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  regions,
  zones,
  showTypeFilter = true,
}) => {
  const filteredZones = filters.regionId
    ? zones.filter((z) => z.regionId === filters.regionId)
    : zones;

  const handleFieldChange = (field: keyof SearchFilters, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value || undefined,
      ...(field === 'regionId' ? { zoneId: undefined } : {}),
    });
  };

  const handleReset = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => !!v);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0C3823]" />
          <h3 className="font-semibold text-sm text-stone-900 tracking-tight">Refine Registry Search</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs text-[#0C3823] hover:text-[#D4AF37] font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Type Filter */}
        {showTypeFilter && (
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Heritage Category</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
            >
              <option value="">All Categories</option>
              <option value="MANUSCRIPT">Ancient Manuscripts</option>
              <option value="LITERATURE">Classical Literature</option>
              <option value="ARCHIVE">Historical Archives</option>
            </select>
          </div>
        )}

        {/* Region Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">Regional State</label>
          <select
            value={filters.regionId || ''}
            onChange={(e) => handleFieldChange('regionId', e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
          >
            <option value="">All Regions of Ethiopia</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} {r.amharicName ? `(${r.amharicName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Zone Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">Administrative Zone</label>
          <select
            value={filters.zoneId || ''}
            onChange={(e) => handleFieldChange('zoneId', e.target.value)}
            disabled={filteredZones.length === 0}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0C3823] disabled:opacity-50"
          >
            <option value="">All Administrative Zones</option>
            {filteredZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">Language / Script</label>
          <select
            value={filters.language || ''}
            onChange={(e) => handleFieldChange('language', e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
          >
            <option value="">Any Language</option>
            <option value="Ge'ez">Ge'ez (ግዕዝ)</option>
            <option value="Amharic">Amharic (አማርኛ)</option>
            <option value="Afaan Oromoo">Afaan Oromoo</option>
            <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
            <option value="Arabic">Arabic / Ajami (العربية)</option>
            <option value="Somali">Somali (Af-Soomaali)</option>
            <option value="Italian">Italian / Colonial Records</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">Preservation Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
          >
            <option value="">All Statuses</option>
            <option value="ARCHIVED">Archived in Vault</option>
            <option value="APPROVED">Approved</option>
            <option value="COLLECTED">Collected</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SUBMITTED">Submitted</option>
          </select>
        </div>
      </div>
    </div>
  );
};
