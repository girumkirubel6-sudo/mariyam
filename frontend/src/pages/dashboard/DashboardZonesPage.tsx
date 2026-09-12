import React, { useState, useEffect } from 'react';
import { zoneApi } from '../../api/zoneApi';
import { regionApi } from '../../api/regionApi';
import { Zone, Region } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../api/config';
import { Layers, Plus, MapPin } from 'lucide-react';

export const DashboardZonesPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('');
  const toast = useToast();

  // New zone form
  const [name, setName] = useState('');
  const [regionId, setRegionId] = useState('');
  const [capital, setCapital] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [zList, rList] = await Promise.all([zoneApi.getAll(), regionApi.getAll()]);
      setZones(zList);
      setRegions(rList);
      if (rList.length > 0) setRegionId(rList[0].id);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await zoneApi.create({
        name,
        regionId,
        capital,
      });
      toast.success(`Zone ${created.name} established successfully`);
      setZones((prev) => [...prev, created]);
      setIsModalOpen(false);
      setName('');
      setCapital('');
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Failed to create zone: ${parsed.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredZones = selectedRegionFilter
    ? zones.filter((z) => z.regionId === selectedRegionFilter)
    : zones;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
            Administrative Zonal Registries
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Zonal heritage bureaus, local monastic repositories, and field accession stations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Administrative Zone</span>
        </button>
      </div>

      {/* Filter by Region */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Filter by Region:
        </span>
        <select
          value={selectedRegionFilter}
          onChange={(e) => setSelectedRegionFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none max-w-xs"
        >
          <option value="">All Regions ({zones.length} Zones)</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading ? (
        <LoadingSpinner label="Loading administrative zones..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredZones.map((z) => {
            const reg = regions.find((r) => r.id === z.regionId);
            return (
              <div
                key={z.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs hover:border-[#0C3823] transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">{z.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Region: <strong className="text-stone-700">{reg?.name || 'Assigned'}</strong>
                  </p>
                  {z.capital && (
                    <p className="text-[11px] text-stone-400 mt-1">Seat: {z.capital}</p>
                  )}
                </div>
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-[#0C3823]" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Establish Administrative Zone"
      >
        <form onSubmit={handleCreateZone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Parent Regional State
            </label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Zone Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Central Tigray Zone"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Zonal Seat / Administrative City
            </label>
            <input
              type="text"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              placeholder="e.g., Axum"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Establishing...' : 'Establish Zone'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
