import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Archive,
  Scroll,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Database,
  Search,
  Compass,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { regionApi } from '../api/regionApi';
import { manuscriptApi } from '../api/manuscriptApi';
import { DashboardStats, Region, ManuscriptItem } from '../types';
import { parseApiError } from '../api/config';
import { ErrorMessage } from '../components/ErrorMessage';
import { ManuscriptCard } from '../components/ManuscriptCard';
import { RegionCard } from '../components/RegionCard';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [featuredManuscripts, setFeaturedManuscripts] = useState<ManuscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, regionsData, manuscriptsData] = await Promise.all([
        adminApi.getDashboardStats(),
        regionApi.getAll(),
        manuscriptApi.getAll(),
      ]);
      setStats(statsData);
      setRegions(regionsData);
      setFeaturedManuscripts(manuscriptsData.slice(0, 3));
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

  return (
    <div className="space-y-20 pb-20">
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <ErrorMessage message={error} onRetry={loadData} />
        </div>
      )}

      {/* HERO SECTION */}
     <section
  className="relative overflow-hidden text-white py-24 lg:py-32 border-b-4 border-[#D4AF37] bg-cover bg-center"
  style={{ backgroundImage: "url('/images/wemezekr-brand.png')" }}
>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#0C3823]/80 to-black/75 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/50 text-[#F4E7BE] text-xs font-semibold backdrop-blur-md">
              <span className="font-ethiopic text-[#D4AF37]">ወመዘክር</span>
              <span>•</span>
              <span>The National Digital Heritage Registry of Ethiopia</span>
            </div>

            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-white">
              Preserving Ethiopia's Heritage for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4E7BE] to-[#D4AF37]">
                Future Generations
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-light">
              Register, discover, preserve, and explore Ethiopia's literature, historical archives, and ancient manuscripts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#D4AF37] text-[#0C3823] font-bold text-sm hover:bg-[#c29c29] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4" />
                <span>Explore Heritage</span>
              </Link>
              <Link
                to="/register-heritage"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 text-white hover:bg-white/20 font-bold text-sm transition-all border border-white/20 backdrop-blur-sm"
              >
                <span>Register a Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom stats banner */}
        <div className="relative mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                label: 'Registered Literature',
                value: stats ? stats.totalLiterature : 1240,
                icon: BookOpen,
              },
              {
                label: 'Historical Archives',
                value: stats ? stats.totalArchives : 3820,
                icon: Archive,
              },
              {
                label: 'Ancient Manuscripts',
                value: stats ? stats.totalManuscripts : 2450,
                icon: Scroll,
              },
              {
                label: 'Regional States',
                value: stats ? stats.totalRegions : 12,
                icon: MapPin,
              },
              {
                label: 'Administrative Zones',
                value: stats ? stats.totalZones : 78,
                icon: Layers,
              },
              {
                label: 'Digitized Collections',
                value: stats ? stats.collectedSubmissions : 240,
                icon: Database,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/30 text-center"
                >
                  <Icon className="w-5 h-5 mx-auto mb-2 text-[#D4AF37]" />
                  <div className="text-2xl font-serif font-bold text-white mb-1">
                    {typeof st.value === 'number' ? st.value.toLocaleString() : st.value}
                  </div>
                  <div className="text-[11px] font-medium text-stone-300 uppercase tracking-wider leading-tight">
                    {st.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPLORE ETHIOPIA'S HERITAGE (THREE LARGE CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
            National Repositories
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3 mb-4">
            Explore Ethiopia's Heritage
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Three foundational pillars preserving three millennia of Ge'ez codices, classical literary novels, and diplomatic statehood archives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Literature */}
          <div className="group rounded-3xl bg-white border border-stone-200/90 p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-[#0C3823]">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center mb-6 group-hover:bg-[#0C3823] group-hover:text-[#D4AF37] transition-all">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">
                Module 01
              </span>
              <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1 mb-3">Literature</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Classical and modern Ethiopian publications, pioneering novels (Tobbya, Fikir Eske Meqabir), Oromo oral historiography, and philosophical treatises (Hatata of Zera Yacob).
              </p>
            </div>
            <Link
              to="/literature"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0C3823] group-hover:text-[#D4AF37] transition-colors"
            >
              <span>Explore Literature Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Historical Archives */}
          <div className="group rounded-3xl bg-white border border-stone-200/90 p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-amber-600">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6 group-hover:bg-amber-900 group-hover:text-[#D4AF37] transition-all">
                <Archive className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">
                Module 02
              </span>
              <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1 mb-3">Historical Archives</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Diplomatic accords (Treaty of Wuchale), Battle of Adwa military dispatches, imperial seals of Menelik II and Taytu Betul, League of Nations memoranda, and Harar commercial ledgers.
              </p>
            </div>
            <Link
              to="/archives"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-900 group-hover:text-amber-700 transition-colors"
            >
              <span>Explore Historical Archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Ancient Manuscripts */}
          <div className="group rounded-3xl bg-white border border-[#D4AF37]/40 p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-[#D4AF37] ring-1 ring-[#D4AF37]/20">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/30 flex items-center justify-center mb-6 group-hover:bg-[#0C3823] group-hover:text-[#D4AF37] transition-all">
                <Scroll className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#856404] uppercase tracking-wider">
                Module 03 • Core Vault
              </span>
              <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1 mb-3">Ancient Manuscripts</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                World-renowned vellum codices: the 5th-century Abba Garima Gospels, Kebra Nagast, complete Ge'ez Book of Enoch (Metsehafe Henok), and gold-illuminated Harari Quranic codices.
              </p>
            </div>
            <Link
              to="/manuscripts"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0C3823] group-hover:text-[#D4AF37] transition-colors"
            >
              <span>Explore Ancient Manuscripts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MANUSCRIPT / LIBRARY HERITAGE SECTION */}
      <section className="bg-[#FAF6EB] border-y border-[#D4AF37]/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
                Curatorial Showcase
              </span>
              <h2 className="font-serif font-black text-3xl text-stone-900 mt-3">
                Masterworks of the Ethiopian Scriptorium
              </h2>
              <p className="text-sm text-stone-600 max-w-xl mt-2">
                Parchment folios digitized with multi-spectral photography, preserving uncial calligraphy, mineral pigments, and ancient bindings.
              </p>
            </div>
            <Link
              to="/manuscripts"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C3823] text-white font-bold text-xs hover:bg-[#124f33] transition-colors shrink-0 shadow-xs"
            >
              <span>View All 2,450+ Manuscripts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredManuscripts.map((m) => (
              <ManuscriptCard key={m.id} manuscript={m} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW WEMEZEKR WORKS (STEPS 1 - 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
            Standard Operating Procedure
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-3 mb-4">
            How Wemezekr Works
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            The national 6-step conservation and registration cycle mandated by the National Archives and Library Agency of Ethiopia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: 'Step 1',
              name: 'Register',
              desc: 'Zonal and regional registrars catalog the physical artifact, script, language, and provenance.',
              icon: BookOpen,
            },
            {
              step: 'Step 2',
              name: 'Review',
              desc: 'Preliminary screening by regional heritage coordinators for authenticity and completeness.',
              icon: Search,
            },
            {
              step: 'Step 3',
              name: 'Verify',
              desc: 'Expert paleographers and philologists score the item on historical provenance and condition.',
              icon: ShieldCheck,
            },
            {
              step: 'Step 4',
              name: 'Collect',
              desc: 'Physical stabilization, safe conservation transfer, or ultra-high resolution digitizing.',
              icon: Compass,
            },
            {
              step: 'Step 5',
              name: 'Preserve',
              desc: 'Climate-controlled inert containment, deacidification, and digital redundant backup.',
              icon: CheckCircle2,
            },
            {
              step: 'Step 6',
              name: 'Archive',
              desc: 'Permanent accession into the National Central Vault for scholarly and public access.',
              icon: Archive,
            },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:border-[#D4AF37] transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#0C3823] bg-[#0C3823]/10 px-2.5 py-1 rounded-lg">
                    {s.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#0C3823]" />
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">{s.name}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* REGIONAL EXPLORATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full">
              Geographic Registry
            </span>
            <h2 className="font-serif font-black text-3xl text-stone-900 mt-3">
              Regional States of Ethiopia
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Explore manuscripts, archives, and literature cataloged across each regional state and zone.
            </p>
          </div>
          <Link
            to="/regions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors shrink-0"
          >
            <span>Explore All Regions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.slice(0, 4).map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </section>
    </div>
  );
};
