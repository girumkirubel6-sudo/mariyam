import React, { useState, useEffect, useMemo } from 'react';
import { archiveApi } from '../api/archiveApi';
import { regionApi } from '../api/regionApi';
import { zoneApi } from '../api/zoneApi';
import { ArchiveItem, SearchFilters, Region, Zone } from '../types';
import { ArchiveCard } from '../components/ArchiveCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { parseApiError } from '../api/config';
import { Archive, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ArchivesPage: React.FC = () => {
  const [items, setItems] = useState<ArchiveItem[]>([]);
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
      const [arcs, regs, zns] = await Promise.all([
        archiveApi.getAll(filters),
        regionApi.getAll(),
        zoneApi.getAll(),
      ]);
      setItems(arcs);
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
        const matchType = item.archiveType.toLowerCase().includes(kw);
        const matchDesc = item.description.toLowerCase().includes(kw);
        if (!matchTitle && !matchType && !matchDesc) return false;
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
            State Records & Treaties
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3">
            Historical Archives of Ethiopia
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mt-1">
            Diplomatic treaties, imperial field orders, colonial resistance telegrams, and historical administrative ledgers.
          </p>
        </div>

        <Link
          to="/register-heritage"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-900 text-white font-bold text-xs hover:bg-amber-950 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Archival Record</span>
        </Link>
      </div>

      <SearchBar
        value={keyword}
        onChange={(val) => {
          setKeyword(val);
          setCurrentPage(1);
        }}
        placeholder="Search archives by treaty name, imperial proclamation, or ledger document number..."
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
        <LoadingSpinner label="Accessing national historical archive catalog..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Archival Records Found"
          description="No state records or treaties matched your filter criteria."
          actionLabel="Register Historical Document"
          actionLink="/register-heritage"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <ArchiveCard key={item.id} item={item} />
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
