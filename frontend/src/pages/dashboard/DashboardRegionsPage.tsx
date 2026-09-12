import React, { useState, useEffect } from 'react';
import { regionApi } from '../../api/regionApi';
import { Region } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../api/config';
import { Map, Plus, MapPin, Layers, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardRegionsPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toast = useToast();

  // New region form
  const [name, setName] = useState('');
  const [amharicName, setAmharicName] = useState('');
  const [code, setCode] = useState('');
  const [capital, setCapital] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreateRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await regionApi.create({
        name,
        amharicName,
        code,
        capital,
        description,
      });
      toast.success(`Region ${created.name} registered successfully`);
      setRegions((prev) => [...prev, created]);
      setIsModalOpen(false);
      setName('');
      setAmharicName('');
      setCode('');
      setCapital('');
      setDescription('');
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Failed to register region: ${parsed.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
            Regional State Registries
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage regional territories, administrative capitals, and zonal branches across the federation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Regional State</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadRegions} />}

      {loading ? (
        <LoadingSpinner label="Loading regional states..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regions.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs hover:border-[#0C3823] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="w-9 h-9 rounded-xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center font-bold text-xs">
                    {reg.code}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full">
                    Cap: {reg.capital}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 text-lg">{reg.name}</h3>
                {reg.amharicName && (
                  <p className="text-xs font-ethiopic text-[#0C3823] font-semibold mb-2">
                    {reg.amharicName}
                  </p>
                )}

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                  {reg.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">{reg.zonesCount || 0} Zones</span>
                <Link
                  to={`/regions/${reg.id}`}
                  className="font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors"
                >
                  View Dossier →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Regional State"
      >
        <form onSubmit={handleCreateRegion} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Region Name (Latin)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sidama"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Amharic / Ethiopic Script
              </label>
              <input
                type="text"
                value={amharicName}
                onChange={(e) => setAmharicName(e.target.value)}
                placeholder="e.g., ሲዳማ"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Territory Code (2-3 Chars)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., SD"
                maxLength={4}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Regional Capital
              </label>
              <input
                type="text"
                required
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="e.g., Hawassa"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Historical & Cultural Description
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of cultural archives, heritage sites, and historical documentation..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
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
              {isSubmitting ? 'Registering...' : 'Register Region'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
