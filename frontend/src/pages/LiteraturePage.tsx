import React, { useState, useEffect, useMemo } from 'react';
import { literatureApi } from '../api/literatureApi';
import { regionApi } from '../api/regionApi';
import { zoneApi } from '../api/zoneApi';
import { LiteratureItem, SearchFilters, Region, Zone } from '../types';
import { LiteratureCard } from '../components/LiteratureCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { parseApiError } from '../api/config';
import { BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiteraturePage: React.FC = () => {
  const [items, setItems] = useState<LiteratureItem[]>([]);
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
      const [lits, regs, zns] = await Promise.all([
        literatureApi.getAll(filters),
        regionApi.getAll(),
        zoneApi.getAll(),
      ]);
      setItems(lits);
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
        const matchAuthor = item.author.toLowerCase().includes(kw);
        const matchCategory = item.category.toLowerCase().includes(kw);
        if (!matchTitle && !matchAuthor && !matchCategory) return false;
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
          <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
            National Catalog
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3">
            Classical & Modern Ethiopian Literature
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mt-1">
            Browse registered novels, philosophical inquiries, ethnographic chronicles, and poetry preserved across national repositories.
          </p>
        </div>

        <Link
          to="/register-heritage"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0C3823] text-white font-bold text-xs hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Literature</span>
        </Link>
      </div>

      <SearchBar
        value={keyword}
        onChange={(val) => {
          setKeyword(val);
          setCurrentPage(1);
        }}
        placeholder="Search literature by title, author, or literary category..."
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
        <LoadingSpinner label="Loading literature catalog records..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Literature Records Found"
          description="No literary works matched your search filter criteria. Try clearing search fields."
          actionLabel="Register New Literary Work"
          actionLink="/register-heritage"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <LiteratureCard key={item.id} item={item} />
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
