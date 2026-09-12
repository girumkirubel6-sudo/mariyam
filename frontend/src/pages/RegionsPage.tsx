import React, { useState, useEffect } from 'react';
import { regionApi } from '../api/regionApi';
import { Region } from '../types';
import { RegionCard } from '../components/RegionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { parseApiError } from '../api/config';
import { MapPin, Search } from 'lucide-react';

export const RegionsPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await regionApi.getAll();
      setRegions(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  const filteredRegions = regions.filter((r) => {
    if (!keyword) return true;
    const kw = keyword.toLowerCase();
    return (
      r.name.toLowerCase().includes(kw) ||
      (r.amharicName && r.amharicName.includes(kw)) ||
      (r.capital && r.capital.toLowerCase().includes(kw)) ||
      r.description.toLowerCase().includes(kw)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
          Geographic Registry Hierarchy
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3">
          Regional States & Autonomous Cities
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-1">
          Explore historical custody, administrative zonal offices, and registered manuscripts located within each regional state of Ethiopia.
        </p>
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4 text-[#0C3823]" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Filter regions (e.g. Tigray, Amhara, Oromia, Harari, Addis Ababa)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
        />
      </div>

      {error && <ErrorMessage message={error} onRetry={loadRegions} />}

      {loading ? (
        <LoadingSpinner label="Loading regional state registries..." />
      ) : filteredRegions.length === 0 ? (
        <EmptyState
          title="No Regional States Found"
          description="No regional state matched your search term."
          actionLabel="Clear Filter"
          onAction={() => setKeyword('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      )}
    </div>
  );
};
