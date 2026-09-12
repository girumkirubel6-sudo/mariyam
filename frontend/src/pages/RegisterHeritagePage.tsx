import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regionApi } from '../api/regionApi';
import { zoneApi } from '../api/zoneApi';
import { manuscriptApi } from '../api/manuscriptApi';
import { literatureApi } from '../api/literatureApi';
import { archiveApi } from '../api/archiveApi';
import { Region, Zone } from '../types';
import { FileUpload } from '../components/FileUpload';
import { WorkflowTimeline } from '../components/WorkflowTimeline';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../api/config';
import { Scroll, BookOpen, Archive, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterHeritagePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [type, setType] = useState<'MANUSCRIPT' | 'LITERATURE' | 'ARCHIVE'>('MANUSCRIPT');
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState("Ge'ez");
  const [regionId, setRegionId] = useState('');
  const [zoneId, setZoneId] = useState('');

  // Manuscript Specific
  const [script, setScript] = useState("Ge'ez Uncial (የግዕዝ ቁም ፊደል)");
  const [estimatedDate, setEstimatedDate] = useState('14th Century');
  const [currentLocation, setCurrentLocation] = useState('');
  const [physicalCondition, setPhysicalCondition] = useState('Good');

  // Literature Specific
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(1958);
  const [category, setCategory] = useState('Classical Novel');
  const [literatureLocation, setLiteratureLocation] = useState('');

  // Archive Specific
  const [archiveType, setArchiveType] = useState('State Treaty / Imperial Dispatch');
  const [archiveDate, setArchiveDate] = useState('1896-03-01');
  const [documentNumber, setDocumentNumber] = useState('');
  const [archiveLocation, setArchiveLocation] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [rList, zList] = await Promise.all([regionApi.getAll(), zoneApi.getAll()]);
        setRegions(rList);
        setZones(zList);
        if (rList.length > 0) setRegionId(rList[0].id);
      } catch (err) {
        toast.error('Failed to load regions. Please check server connection.');
      }
    };
    fetchLocations();
  }, []);

  const filteredZones = regionId ? zones.filter((z) => z.regionId === regionId) : zones;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Please provide a title for the heritage asset');
      return;
    }

    setIsSubmitting(true);
    try {
      if (type === 'MANUSCRIPT') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('language', language);
        formData.append('script', script);
        formData.append('estimatedDate', estimatedDate);
        formData.append('currentLocation', currentLocation || 'National Scriptorium');
        formData.append('physicalCondition', physicalCondition);
        if (regionId) formData.append('regionId', regionId);
        if (zoneId) formData.append('zoneId', zoneId);
        if (selectedFile) formData.append('file', selectedFile);

        const res = await manuscriptApi.create(formData);
        toast.success(`Manuscript registered successfully with ID: ${res.id}`);
        navigate(`/manuscripts/${res.id}`);
      } else if (type === 'LITERATURE') {
        const payload = {
          title,
          author: author || 'Anonymous',
          language,
          publicationYear: Number(publicationYear) || 1900,
          category,
          description,
          location: literatureLocation || 'National Library',
          regionId: regionId || undefined,
          zoneId: zoneId || undefined,
        };
        const res = await literatureApi.create(payload);
        toast.success(`Literature record registered with ID: ${res.id}`);
        navigate(`/literature/${res.id}`);
      } else {
        const payload = {
          title,
          archiveType,
          description,
          date: archiveDate,
          language,
          location: archiveLocation || 'National Central Vault',
          documentNumber: documentNumber || undefined,
          regionId: regionId || undefined,
          zoneId: zoneId || undefined,
        };
        const res = await archiveApi.create(payload);
        toast.success(`Historical archive registered with ID: ${res.id}`);
        navigate(`/archives/${res.id}`);
      }
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Registration failed: ${parsed.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
          National Accession Registry
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3">
          Register Heritage Asset
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mt-1">
          Catalog an ancient manuscript codex, historical state archive, or classical literary work into the Ethiopian national registry.
        </p>
      </div>

      {/* Lifecycle preview */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
          Lifecycle Verification Path
        </h3>
        <WorkflowTimeline currentStatus="SUBMITTED" />
      </div>

      {/* Type Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 'MANUSCRIPT',
            label: 'Ancient Manuscript',
            desc: 'Parchment codices, scrolls, illuminated folios',
            icon: Scroll,
          },
          {
            id: 'LITERATURE',
            label: 'Classical Literature',
            desc: 'Novels, poetry, philosophical treatises',
            icon: BookOpen,
          },
          {
            id: 'ARCHIVE',
            label: 'Historical Archive',
            desc: 'State treaties, imperial orders, ledgers',
            icon: Archive,
          },
        ].map((t) => {
          const Icon = t.icon;
          const active = type === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id as any)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                active
                  ? 'border-[#0C3823] bg-[#0C3823]/5 shadow-xs ring-2 ring-[#0C3823]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    active ? 'bg-[#0C3823] text-[#D4AF37]' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {active && <CheckCircle2 className="w-4 h-4 text-[#0C3823]" />}
              </div>
              <p className="text-sm font-bold text-stone-900">{t.label}</p>
              <p className="text-xs text-stone-500 mt-1">{t.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-stone-200/90 p-8 lg:p-10 shadow-xs space-y-6"
      >
        <div className="border-b border-stone-100 pb-4">
          <h2 className="font-serif font-bold text-xl text-stone-900">
            {type === 'MANUSCRIPT'
              ? 'Ancient Manuscript Registration Details'
              : type === 'LITERATURE'
              ? 'Literature Record Details'
              : 'Historical Archival Record Details'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Ensure all metadata adheres to NALA cataloging standards.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Asset Title / Codex Name *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === 'MANUSCRIPT'
                ? "e.g., Illuminated Ge'ez Gospels of Abba Garima"
                : type === 'LITERATURE'
                ? 'e.g., Fikir Eske Meqabir (Love Unto the Grave)'
                : 'e.g., The Treaty of Wuchale (State Record No. 1889-01)'
            }
            className="w-full text-sm py-2.5 px-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
          />
        </div>

        {/* Language & Primary Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Language / Tongue
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
            >
              <option value="Ge'ez">Ge'ez (ግዕዝ)</option>
              <option value="Amharic">Amharic (አማርኛ)</option>
              <option value="Afaan Oromoo">Afaan Oromoo</option>
              <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
              <option value="Arabic">Arabic / Ajami (العربية)</option>
              <option value="Harari">Harari (ሐረሪ)</option>
              <option value="Somali">Somali (Af-Soomaali)</option>
              <option value="Italian">Italian (Colonial Period)</option>
              <option value="French">French (Diplomatic)</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Type-specific 2nd column */}
          {type === 'MANUSCRIPT' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Paleographic Script
              </label>
              <input
                type="text"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="e.g., Early Ge'ez Uncial, Serto, or Ajami"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
              />
            </div>
          )}

          {type === 'LITERATURE' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Author / Compiler
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., Haddis Alemayehu"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
              />
            </div>
          )}

          {type === 'ARCHIVE' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Archive Classification
              </label>
              <input
                type="text"
                value={archiveType}
                onChange={(e) => setArchiveType(e.target.value)}
                placeholder="e.g., Imperial Accord, Battle Dispatch, Tax Ledger"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
              />
            </div>
          )}
        </div>

        {/* Third Row: Dates & Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {type === 'MANUSCRIPT' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Estimated Era / Century
                </label>
                <input
                  type="text"
                  value={estimatedDate}
                  onChange={(e) => setEstimatedDate(e.target.value)}
                  placeholder="e.g., 5th Century AD or 14th Century Solomonic"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Physical Condition
                </label>
                <select
                  value={physicalCondition}
                  onChange={(e) => setPhysicalCondition(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
                >
                  <option value="Pristine">Pristine (Fully Intact)</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good (Minor Patina)</option>
                  <option value="Fair">Fair (Wear on Margins)</option>
                  <option value="Fragile">Fragile (Requires Stabilization)</option>
                  <option value="Critical">Critical (Inert Nitrogen Vault Required)</option>
                </select>
              </div>
            </>
          ) : type === 'LITERATURE' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Year of Publication
                </label>
                <input
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(Number(e.target.value))}
                  placeholder="e.g., 1968"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Literary Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Philosophy, Historical Fiction, Poetry"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Record Date
                </label>
                <input
                  type="text"
                  value={archiveDate}
                  onChange={(e) => setArchiveDate(e.target.value)}
                  placeholder="e.g., 1889-05-02"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  State Document / Ledger Number
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="e.g., ETH-DOC-1896-ADWA-01"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
                />
              </div>
            </>
          )}
        </div>

        {/* Regional Hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Origin Regional State
            </label>
            <select
              value={regionId}
              onChange={(e) => {
                setRegionId(e.target.value);
                setZoneId('');
              }}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
            >
              <option value="">Select Region...</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.amharicName ? `(${r.amharicName})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Administrative Zone
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              disabled={filteredZones.length === 0}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0C3823] disabled:opacity-50"
            >
              <option value="">Select Zone...</option>
              {filteredZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Physical Location */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Physical Repository / Monastery / Archive Room
          </label>
          <input
            type="text"
            value={
              type === 'MANUSCRIPT'
                ? currentLocation
                : type === 'LITERATURE'
                ? literatureLocation
                : archiveLocation
            }
            onChange={(e) => {
              if (type === 'MANUSCRIPT') setCurrentLocation(e.target.value);
              else if (type === 'LITERATURE') setLiteratureLocation(e.target.value);
              else setArchiveLocation(e.target.value);
            }}
            placeholder="e.g., Abba Garima Monastery, Debre Damo, Harar Amirate Vault, or NALA Central"
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Description & Curatorial Notes
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the historical provenance, text contents, parchment illumination, seals, and binding..."
            className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0C3823]"
          />
        </div>

        {/* File Upload (Multi-spectral scan, PDF, JPG, PNG, WEBP, up to 20MB) */}
        {type === 'MANUSCRIPT' && (
          <div className="pt-2">
            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={(file) => setSelectedFile(file)}
              maxSizeMB={20}
              allowedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.webp']}
            />
          </div>
        )}

        {/* Submit action */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Registering Material...' : 'Submit to National Registry'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
