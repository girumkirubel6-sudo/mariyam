import React, { useState, useEffect } from 'react';
import { collectionApi } from '../../api/collectionApi';
import { CollectionItem } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../api/config';
import { Archive, Plus, MapPin, Calendar, Tag, ShieldCheck, Box } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toast = useToast();

  // Form state
  const [submissionId, setSubmissionId] = useState('sub-3');
  const [collectionMethod, setCollectionMethod] = useState('FIELD_COLLECTION');
  const [vaultLocation, setVaultLocation] = useState('Vault Chamber Alpha-3, Box 14');
  const [curatorNotes, setCuratorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await collectionApi.getAll();
      setCollections(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await collectionApi.create({
        submissionId,
        collectionMethod,
        vaultLocation,
        curatorNotes,
      });
      toast.success('Collection item securely registered in vault');
      setCollections((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setCuratorNotes('');
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Ingestion failed: ${parsed.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
            Vault Collections & Ingestion
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Physical custodial inventory, inert preservation storage locations, and acquisition provenance records.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Item into Vault</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadCollections} />}

      {loading ? (
        <LoadingSpinner label="Auditing vault collections inventory..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {collections.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs hover:border-[#0C3823] transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.collectionMethod.replace('_', ' ')}
                  </span>
                  <h3 className="font-serif font-bold text-stone-900 text-base mt-2">
                    Accession ID: {item.id}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <MapPin className="w-4 h-4 text-[#0C3823] shrink-0" />
                  <span>
                    Vault Compartment: <strong>{item.vaultLocation}</strong>
                  </span>
                </div>
                {item.curatorNotes && (
                  <p className="text-stone-500 pt-1 text-[11px] leading-relaxed">
                    Notes: {item.curatorNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Collected: {item.collectedAt?.split('T')[0]}</span>
                </div>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Permanent Custody
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ingestion Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ingest Heritage Item into Vault"
      >
        <form onSubmit={handleCreateCollection} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Verified Submission ID
            </label>
            <input
              type="text"
              required
              value={submissionId}
              onChange={(e) => setSubmissionId(e.target.value)}
              placeholder="e.g., sub-3"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Acquisition / Collection Method
            </label>
            <select
              value={collectionMethod}
              onChange={(e) => setCollectionMethod(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            >
              <option value="FIELD_COLLECTION">Zonal Field Collection & Digitization</option>
              <option value="DONATION">Monastic / Community Donation</option>
              <option value="PURCHASE">National Library Purchase</option>
              <option value="REPATRIATION">International Diplomatic Repatriation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Vault Compartment & Shelf Location
            </label>
            <input
              type="text"
              required
              value={vaultLocation}
              onChange={(e) => setVaultLocation(e.target.value)}
              placeholder="e.g., Vault Chamber Alpha-3, Shelf 2, Box 14"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Curator Ingestion Notes
            </label>
            <textarea
              rows={3}
              value={curatorNotes}
              onChange={(e) => setCuratorNotes(e.target.value)}
              placeholder="Record climate container serial number, deacidification date, or special handling precautions..."
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
              {isSubmitting ? 'Ingesting Item...' : 'Confirm Vault Registration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
