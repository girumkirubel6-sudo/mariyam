import React from 'react';
import { BookOpen, Scroll, Archive, Shield, Award, MapPin, Phone, Mail, Globe, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0C3823]/10 text-[#0C3823]">
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>National Heritage Preservation Mandate</span>
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
          About WEMEZEKR
        </h1>
        <p className="text-sm font-ethiopic text-[#0C3823] font-semibold text-base">
          የኢትዮጵያ ብሔራዊ ቤተ-መዛግብትና ቤተ-መጻሕፍት ኤጀንሲ (ወመዘክር)
        </p>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
          The official digital preservation, paleographic registration, and archival access platform of the National Archives and Library Agency of Ethiopia (NALA).
        </p>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">National Mission</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            To register, authenticate, catalog, and preserve Ethiopia’s written intellectual treasures—from early Axumite parchment codices to 20th-century state treaties and modern literary classics—safeguarding cultural sovereignty and enabling global scholarly research.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/40 flex items-center justify-center font-bold">
            <Scroll className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">Archival Vision</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Establishing a unified, secure, federated repository that interconnects monastery libraries, regional archives, and university collections across Ethiopia’s 12 regional states and 2 chartered cities.
          </p>
        </div>
      </div>

      {/* History & Legal Mandate */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 lg:p-10 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-2xl text-stone-900">Institutional Heritage & History</h2>
        <div className="text-xs text-stone-700 leading-relaxed space-y-4">
          <p>
            Established under Imperial proclamation in 1944 in Addis Ababa, <strong>Wemezekr</strong> (the National Archives and Library of Ethiopia) holds the oldest continuous documentation of sub-Saharan statecraft, diplomacy, and religious literature. Ethiopia is one of only two African nations with an indigenous, ancient alphabetic writing system—the <em>Ge'ez script (ፊደል)</em>.
          </p>
          <p>
            The national vaults house priceless codices including the 5th-century Abba Garima Gospels (the world’s earliest surviving illustrated Christian gospel books), complete ancient Enochian manuscripts preserved exclusively in Ge'ez, and the royal chronicles of Emperors Amda Seyon, Zara Yaqob, Tewodros II, and Menelik II.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
          {[
            {
              title: 'Multi-Spectral Scanning',
              desc: 'Ultra-high resolution RAW digital imaging revealing faded inks and palimpsest layers.',
            },
            {
              title: 'Climate Vaults',
              desc: 'Inert gas micro-climate storage controlled at 18°C and 45% relative humidity.',
            },
            {
              title: 'Decentralized Zonal Registry',
              desc: 'Field verification teams operating directly across 78 administrative zones.',
            },
            {
              title: 'Open Scholarly Access',
              desc: 'Public and academic research APIs supporting philologists worldwide.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
              <CheckCircle2 className="w-4 h-4 text-[#0C3823] mb-2" />
              <h4 className="font-serif font-bold text-stone-900 text-xs mb-1">{item.title}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Central Office & Inquiries */}
      <div className="bg-[#0C3823] text-white rounded-3xl p-8 lg:p-10 border-2 border-[#D4AF37] space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            Secretariat & Registry Inquiries
          </span>
          <h2 className="font-serif font-bold text-2xl">National Archives and Library Agency (NALA)</h2>
          <p className="text-xs text-stone-200 leading-relaxed">
            For academic reproduction permissions, artifact donations, or zonal registrar credentials:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>Arada Sub-City, Next to Ministry of Education, Addis Ababa, Ethiopia</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>+251 (0) 11 155 3800</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>contact@wemezekr.gov.et</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-stone-300">
            Have a manuscript or archival record to document?
          </span>
          <Link
            to="/register-heritage"
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0C3823] font-bold text-xs hover:bg-[#c29c29] transition-colors shadow-xs"
          >
            Submit Material for Registration
          </Link>
        </div>
      </div>
    </div>
  );
};
