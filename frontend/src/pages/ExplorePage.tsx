import React, { useState, useEffect, useMemo } from 'react';
import { literatureApi } from '../api/literatureApi';
import { archiveApi } from '../api/archiveApi';
import { manuscriptApi } from '../api/manuscriptApi';
import { regionApi } from '../api/regionApi';
import { zoneApi } from '../api/zoneApi';
import { SearchFilters, Region, Zone } from '../types';
import { GenericHeritageItem, HeritageCard } from '../components/HeritageCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { parseApiError } from '../api/config';
import { LayoutGrid, Table as TableIcon, Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExplorePage: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [items, setItems] = useState<GenericHeritageItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [regs, zns, lits, arcs, mss] = await Promise.all([
        regionApi.getAll(),
        zoneApi.getAll(),
        literatureApi.getAll(filters),
        archiveApi.getAll(filters),
        manuscriptApi.getAll(filters),
      ]);

      setRegions(regs);
      setZones(zns);

      const genericList: GenericHeritageItem[] = [
        ...mss.map((m) => ({
          id: m.id,
          title: m.title,
          author: m.author,
          type: 'MANUSCRIPT' as const,
          regionName: m.regionName,
          zoneName: m.zoneName,
          language: m.language,
          status: m.status,
          date: m.estimatedDate,
          description: m.description,
        })),
        ...lits.map((l) => ({
          id: l.id,
          title: l.title,
          author: l.author,
          type: 'LITERATURE' as const,
          regionName: l.regionName,
          zoneName: l.zoneName,
          language: l.language,
          status: l.status,
          date: l.publicationYear?.toString(),
          description: l.description,
        })),
        ...arcs.map((a) => ({
          id: a.id,
          title: a.title,
          author: 'Official State/Amirate Record',
          type: 'ARCHIVE' as const,
          regionName: a.regionName,
          zoneName: a.zoneName,
          language: a.language,
          status: a.status,
          date: a.date,
          description: a.description,
        })),
      ];

      setItems(genericList);
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

  // Client-side keyword & type filtering
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (keyword) {
        const kw = keyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(kw);
        const matchAuthor = item.author ? item.author.toLowerCase().includes(kw) : false;
        const matchDesc = item.description.toLowerCase().includes(kw);
        const matchLang = item.language.toLowerCase().includes(kw);
        if (!matchTitle && !matchAuthor && !matchDesc && !matchLang) return false;
      }
      if (filters.type && item.type !== filters.type) {
        return false;
      }
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [items, keyword, filters]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
          National Discovery
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3">
          Explore Ethiopia's Heritage Registry
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-1">
          Search across ancient Ge'ez manuscripts, rare imperial archives, and classical literature preserved in the Wemezekr national vaults.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={keyword}
        onChange={(val) => {
          setKeyword(val);
          setCurrentPage(1);
        }}
        placeholder="Search by manuscript codex, author, title, historical period, or language..."
      />

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        regions={regions}
        zones={zones}
        showTypeFilter={true}
      />

      {/* Controls / View Mode */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-200">
        <p className="text-xs text-stone-500 font-medium">
          Showing <span className="font-bold text-stone-900">{filteredItems.length}</span> registered heritage records
        </p>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-[#0C3823] text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-[#0C3823] text-white'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Table view"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading ? (
        <LoadingSpinner label="Searching across Ethiopian literature, archives, and manuscript repositories..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Matching Heritage Records"
          description="Try adjusting your keywords, selecting 'All Categories', or clearing regional filters."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setKeyword('');
            setFilters({});
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <HeritageCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Title & Author</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">Region / Zone</th>
                  <th className="px-4 py-3.5">Date / Era</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedItems.map((item) => {
                  const targetUrl =
                    item.type === 'MANUSCRIPT'
                      ? `/manuscripts/${item.id}`
                      : item.type === 'LITERATURE'
                      ? `/literature/${item.id}`
                      : `/archives/${item.id}`;

                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-stone-900 max-w-xs">
                        <p className="font-serif font-bold text-sm truncate">{item.title}</p>
                        {item.author && <p className="text-stone-500 text-[11px] truncate">By {item.author}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-stone-700">{item.language}</td>
                      <td className="px-4 py-4 text-stone-600 truncate max-w-[140px]">
                        {item.zoneName || item.regionName || 'National'}
                      </td>
                      <td className="px-4 py-4 text-stone-600">{item.date || '—'}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          to={targetUrl}
                          className="inline-flex items-center gap-1 font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors"
                        >
                          <span>Inspect</span> <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  );
};
