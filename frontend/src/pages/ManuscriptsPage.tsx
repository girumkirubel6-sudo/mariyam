import React, { useState, useEffect, useMemo } from 'react';
import { manuscriptApi } from '../api/manuscriptApi';
import { regionApi } from '../api/regionApi';
import { zoneApi } from '../api/zoneApi';
import { ManuscriptItem, SearchFilters, Region, Zone } from '../types';
import { ManuscriptCard } from '../components/ManuscriptCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { parseApiError } from '../api/config';
import { Scroll, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManuscriptsPage: React.FC = () => {
  const [items, setItems] = useState<ManuscriptItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mss, regs, zns] = await Promise.all([
        manuscriptApi.getAll(filters),
        regionApi.getAll(),
        zoneApi.getAll(),
      ]);
      setItems(mss);
      setRegions(regs);
      setZones(zns);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (keyword) {
        const kw = keyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(kw);
        const matchAuthor = item.author?.toLowerCase().includes(kw);
        const matchScript = item.script.toLowerCase().includes(kw);
        const matchDesc = item.description.toLowerCase().includes(kw);
        const matchLoc = item.currentLocation.toLowerCase().includes(kw);
        if (!matchTitle && !matchAuthor && !matchScript && !matchDesc && !matchLoc) return false;
      }
      return true;
    });
  }, [items, keyword]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#856404] bg-[#FAF6EB] border border-[#D4AF37]/30 px-3 py-1 rounded-full">
            Ancient Parchment & Codex Vault
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3">
            Ancient Ethiopian Manuscripts
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mt-1">
            Explore 5th–18th century vellum codices, monastic scriptorium treasures, illuminated Gospels, and Ajami manuscripts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/40 font-bold text-xs hover:bg-[#F4E7BE] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AI Philology Assistant</span>
          </Link>
          <Link
            to="/register-heritage"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0C3823] text-white font-bold text-xs hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Manuscript</span>
          </Link>
        </div>
      </div>

      <SearchBar
        value={keyword}
        onChange={(val) => {
          setKeyword(val);
          setCurrentPage(1);
        }}
        placeholder="Search manuscripts by codex name, script (e.g., Ge'ez Uncial), monastery, or date..."
      />

      <FilterPanel
        filters={filters}
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        regions={regions}
        zones={zones}
        showTypeFilter={false}
      />

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading ? (
        <LoadingSpinner label="Accessing national illuminated manuscript depository..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Ancient Manuscripts Found"
          description="No parchment codices matched your filter options."
          actionLabel="Register Manuscript"
          actionLink="/register-heritage"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <ManuscriptCard key={item.id} manuscript={item} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
};
