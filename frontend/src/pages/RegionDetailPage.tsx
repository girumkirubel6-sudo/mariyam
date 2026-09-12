import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { regionApi } from '../api/regionApi';
import { literatureApi } from '../api/literatureApi';
import { archiveApi } from '../api/archiveApi';
import { manuscriptApi } from '../api/manuscriptApi';
import { Region, Zone, LiteratureItem, ArchiveItem, ManuscriptItem } from '../types';
import { LiteratureCard } from '../components/LiteratureCard';
import { ArchiveCard } from '../components/ArchiveCard';
import { ManuscriptCard } from '../components/ManuscriptCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { parseApiError } from '../api/config';
import {
  MapPin,
  Layers,
  BookOpen,
  Archive,
  Scroll,
  ArrowLeft,
  Building,
} from 'lucide-react';

export const RegionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [literature, setLiterature] = useState<LiteratureItem[]>([]);
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [manuscripts, setManuscripts] = useState<ManuscriptItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'manuscripts' | 'literature' | 'archives'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRegionData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [reg, zns, lits, arcs, mss] = await Promise.all([
        regionApi.getById(id),
        regionApi.getZones(id),
        literatureApi.getAll({ regionId: id }),
        archiveApi.getAll({ regionId: id }),
        manuscriptApi.getAll({ regionId: id }),
      ]);
      setRegion(reg);
      setZones(zns);
      setLiterature(lits);
      setArchives(arcs);
      setManuscripts(mss);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegionData();
  }, [id]);

  if (loading) return <LoadingSpinner fullHeight label="Loading regional state dossier and zones..." />;
  if (error || !region) return <div className="py-12"><ErrorMessage message={error || 'Region not found'} onRetry={loadRegionData} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/regions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#0C3823] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Regional States
      </Link>

      {/* Region Banner Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 lg:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-[#0C3823] text-[#D4AF37] flex items-center justify-center font-bold font-serif text-sm">
                {region.code}
              </span>
              <div>
                <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
                  {region.name}
                </h1>
                {region.amharicName && (
                  <p className="text-sm font-ethiopic text-[#0C3823] font-semibold">{region.amharicName}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-stone-600 max-w-2xl mt-3 leading-relaxed">
              {region.description}
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Regional Capital</span>
              <strong className="text-stone-800">{region.capital}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Administrative Zones</span>
              <strong className="text-stone-800">{zones.length} Zones Established</strong>
            </div>
          </div>
        </div>

        {/* Administrative Zones Chips */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0C3823]" /> Administrative Zones within {region.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {zones.length === 0 ? (
              <span className="text-xs text-stone-500 italic">No zones listed currently.</span>
            ) : (
              zones.map((zone) => (
                <div
                  key={zone.id}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-800 font-medium"
                >
                  <span className="font-semibold text-[#0C3823]">{zone.name}</span>
                  {zone.capital && <span className="text-stone-400 text-[11px] ml-1">({zone.capital})</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Heritage tabs */}
      <div>
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6">
          {[
            { id: 'all', label: `All Heritage (${manuscripts.length + literature.length + archives.length})` },
            { id: 'manuscripts', label: `Manuscripts (${manuscripts.length})`, icon: Scroll },
            { id: 'literature', label: `Literature (${literature.length})`, icon: BookOpen },
            { id: 'archives', label: `Archives (${archives.length})`, icon: Archive },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#0C3823] text-[#D4AF37] shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="space-y-10">
          {/* Manuscripts */}
          {(activeTab === 'all' || activeTab === 'manuscripts') && manuscripts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scroll className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Ancient Manuscripts in {region.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {manuscripts.map((m) => (
                  <ManuscriptCard key={m.id} manuscript={m} />
                ))}
              </div>
            </div>
          )}

          {/* Literature */}
          {(activeTab === 'all' || activeTab === 'literature') && literature.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-[#0C3823]" />
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Literature of {region.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {literature.map((l) => (
                  <LiteratureCard key={l.id} item={l} />
                ))}
              </div>
            </div>
          )}

          {/* Archives */}
          {(activeTab === 'all' || activeTab === 'archives') && archives.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Archive className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Historical Archives of {region.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archives.map((a) => (
                  <ArchiveCard key={a.id} item={a} />
                ))}
              </div>
            </div>
          )}

          {manuscripts.length === 0 && literature.length === 0 && archives.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
              No registered heritage items found for this region.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
