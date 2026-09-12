import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { literatureApi } from '../api/literatureApi';
import { LiteratureItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { parseApiError } from '../api/config';
import {
  BookOpen,
  User,
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  Building,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const LiteratureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<LiteratureItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const loadItem = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await literatureApi.getById(id);
      setItem(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Record URL copied to clipboard');
  };

  if (loading) return <LoadingSpinner fullHeight label="Retrieving literature registry record..." />;
  if (error || !item) return <div className="py-12"><ErrorMessage message={error || 'Literature not found'} onRetry={loadItem} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/literature"
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#0C3823] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Literature Catalog
      </Link>

      {/* Main detail card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
        {/* Banner header */}
        <div className="bg-[#0C3823] text-white p-8 lg:p-10 border-b-2 border-[#D4AF37]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#F4E7BE] border border-[#D4AF37]/30">
              {item.category}
            </span>
            <StatusBadge status={item.status} size="lg" />
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl text-white tracking-tight mb-3">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-200">
            <div className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>{item.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Published {item.publicationYear}</span>
            </div>
            <span>•</span>
            <span className="bg-[#D4AF37] text-[#0C3823] px-2.5 py-0.5 rounded text-xs font-bold">
              {item.language}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-8 lg:p-10 space-y-8">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Work Overview & Synopsis</h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Physical Custody & Provenance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0C3823]" /> Physical Depository
              </h4>
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">{item.location || 'Central Archival Repository'}</p>
                <p>Location ID: {item.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0C3823]" /> Regional Custody
              </h4>
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">
                  {item.zoneName || 'Zonal Authority'}, {item.regionName || 'Regional State'}
                </p>
                <p>National Heritage System Classification: Level A</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-200">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Citation
            </button>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs"
            >
              Explore Related Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
