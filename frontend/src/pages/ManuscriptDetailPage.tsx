import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { manuscriptApi } from '../api/manuscriptApi';
import { ManuscriptItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { parseApiError } from '../api/config';
import {
  Scroll,
  Calendar,
  MapPin,
  FileText,
  Shield,
  ArrowLeft,
  Share2,
  Sparkles,
  Maximize2,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ManuscriptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [manuscript, setManuscript] = useState<ManuscriptItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<boolean>(false);
  const toast = useToast();

  const loadManuscript = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await manuscriptApi.getById(id);
      setManuscript(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManuscript();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Manuscript permalink copied to clipboard');
  };

  if (loading) return <LoadingSpinner fullHeight label="Retrieving ancient parchment codex dossier..." />;
  if (error || !manuscript) return <div className="py-12"><ErrorMessage message={error || 'Manuscript not found'} onRetry={loadManuscript} /></div>;

  const conditionColors: Record<string, string> = {
    Pristine: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Good: 'bg-blue-50 text-blue-700 border-blue-200',
    Fair: 'bg-amber-50 text-amber-800 border-amber-200',
    Fragile: 'bg-orange-100 text-orange-800 border-orange-300',
    Critical: 'bg-red-100 text-red-800 border-red-300',
  };

  const conditionBadgeClass =
    conditionColors[manuscript.physicalCondition] ||
    'bg-stone-100 text-stone-700 border-stone-200';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          to="/manuscripts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#0C3823] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Manuscript Vault
        </Link>
        <Link
          to={`/ai-assistant?q=${encodeURIComponent(
            `Analyze the historical and theological significance of the Ethiopian manuscript titled "${manuscript.title}" (${manuscript.estimatedDate}).`
          )}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/40 text-xs font-bold hover:bg-[#F4E7BE] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Ask AI About this Codex</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
        {/* Banner Header */}
        <div className="bg-[#0C3823] text-white p-8 lg:p-10 border-b-2 border-[#D4AF37] relative">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0C3823]">
                {manuscript.language}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#F4E7BE] border border-white/20">
                {manuscript.script}
              </span>
            </div>
            <StatusBadge status={manuscript.status} size="lg" />
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl text-white tracking-tight mb-3">
            {manuscript.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-200">
            {manuscript.author && (
              <>
                <span>Attributed: <strong className="text-white">{manuscript.author}</strong></span>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>{manuscript.estimatedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{manuscript.currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Layout: Digital Viewer / Image + Metadata */}
        <div className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Facsimile Image or Digital Viewer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-stone-300 bg-stone-900 group min-h-[400px] flex items-center justify-center">
              {manuscript.fileUrl ? (
                <>
                  <img
                    src={manuscript.fileUrl}
                    alt={manuscript.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[560px] object-contain cursor-pointer"
                    onClick={() => setFullscreenImage(true)}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => setFullscreenImage(true)}
                      className="p-2 rounded-xl bg-black/70 text-white hover:bg-black text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors"
                      title="Inspect high resolution facsimile"
                    >
                      <Maximize2 className="w-4 h-4" /> Fullscreen Codex Viewer
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-stone-400 space-y-3">
                  <Scroll className="w-12 h-12 text-[#D4AF37] mx-auto opacity-70" />
                  <p className="text-sm font-serif text-[#F4E7BE]">Manuscript Cataloged in Physical Vault</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Multi-spectral digital facsimile scheduled for accession under NALA Preservation Protocol.
                  </p>
                </div>
              )}
            </div>

            {manuscript.fileName && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                <span className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#0C3823]" />
                  <span className="truncate">{manuscript.fileName}</span>
                </span>
                <span className="text-[11px] text-stone-400 shrink-0 font-mono">Digital Facsimile</span>
              </div>
            )}
          </div>

          {/* Right: Philological & Curatorial Metadata (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Physical Condition Card */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                Conservation & Condition Status
              </span>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${conditionBadgeClass}`}>
                  Condition: {manuscript.physicalCondition}
                </span>
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Climate Monitored
                </span>
              </div>
            </div>

            {/* Curatorial Details */}
            <div className="space-y-3 text-xs">
              <h3 className="font-serif font-bold text-stone-900 text-base">Philological Metadata</h3>
              <div className="divide-y divide-stone-100 border-t border-b border-stone-100">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500">Language / Dialect</span>
                  <span className="font-semibold text-stone-900">{manuscript.language}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500">Paleographic Script</span>
                  <span className="font-semibold text-stone-900">{manuscript.script}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500">Estimated Era</span>
                  <span className="font-semibold text-stone-900">{manuscript.estimatedDate}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500">Regional State</span>
                  <span className="font-semibold text-stone-900">{manuscript.regionName || 'National'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500">Administrative Zone</span>
                  <span className="font-semibold text-stone-900">{manuscript.zoneName || 'Monastic Vault'}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-stone-500">Custodial Institution</span>
                  <span className="font-semibold text-stone-900 truncate max-w-[200px]">
                    {manuscript.currentLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-2">Parchment Description</h3>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {manuscript.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Record
              </button>
              <Link
                to={`/ai-assistant?q=${encodeURIComponent(
                  `Provide a detailed scholarly breakdown of the text, historical context, and paleography of the Ethiopian manuscript "${manuscript.title}".`
                )}`}
                className="flex-1 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> AI Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Facsimile Modal */}
      {fullscreenImage && manuscript.fileUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setFullscreenImage(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-4 text-white">
            <span className="text-xs text-stone-400">Click anywhere to close</span>
            <button
              onClick={() => setFullscreenImage(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              Close Viewer ✕
            </button>
          </div>
          <img
            src={manuscript.fileUrl}
            alt={manuscript.title}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg border border-stone-800 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
