import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Mail, Phone, MapPin, Globe, Award, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0C3823] text-stone-300 border-t-4 border-[#D4AF37]">
      {/* Heritage Motif Ribbon */}
      <div className="bg-[#072416] py-3 px-4 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#F4E7BE]">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-semibold tracking-wide">
              Official Digital Preservation Platform of the National Archives and Library of Ethiopia (NALA)
            </span>
          </div>
          <div className="font-ethiopic text-[#D4AF37] tracking-wider text-[11px]">
            የኢትዮጵያ ብሔራዊ ቤተ-መዛግብትና ቤተ-መጻሕፍት ኤጀንሲ
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Platform Overview */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/40 font-ethiopic font-bold text-lg">
                ወ
              </div>
              <div>
                <span className="font-serif font-black text-xl text-white tracking-tight">WEMEZEKR</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  National Heritage Digital Registry
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-md mb-6">
              Dedicated to the systematic registration, multi-spectral digitization, physical conservation, and global scholarly access of Ethiopia's rich literary masterworks, imperial state archives, and ancient Ge'ez illuminated parchment manuscripts.
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F4E7BE] italic leading-relaxed">
              "Preserving Ethiopia's ancient parchment wisdom, royal chronicles, and diverse linguistic legacy for future generations."
            </div>
          </div>

          {/* Col 2: Exploration */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Exploration
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/explore" className="hover:text-[#D4AF37] transition-colors">
                  Integrated Heritage Search
                </Link>
              </li>
              <li>
                <Link to="/manuscripts" className="hover:text-[#D4AF37] transition-colors">
                  Ancient Manuscripts Vault
                </Link>
              </li>
              <li>
                <Link to="/literature" className="hover:text-[#D4AF37] transition-colors">
                  Classical Literature Catalog
                </Link>
              </li>
              <li>
                <Link to="/archives" className="hover:text-[#D4AF37] transition-colors">
                  Imperial & State Archives
                </Link>
              </li>
              <li>
                <Link to="/regions" className="hover:text-[#D4AF37] transition-colors">
                  Regional States & Zones
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-[#F4E7BE]">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Heritage AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional & Workflow */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Registry Workflow
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/register-heritage" className="hover:text-[#D4AF37] transition-colors">
                  Register New Manuscript / Item
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4AF37] transition-colors">
                  Preservation Standards & Criteria
                </Link>
              </li>
              <li>
                <Link to="/dashboard/submissions" className="hover:text-[#D4AF37] transition-colors">
                  Submission Verification Pipeline
                </Link>
              </li>
              <li>
                <Link to="/dashboard/collections" className="hover:text-[#D4AF37] transition-colors">
                  Archival Ingestion & Conservation
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#D4AF37] transition-colors">
                  Curator & Registrar Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Secretariat */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Contact & Bureau
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Wemezekr Central, Arada Sub-City, P.O. Box 1907, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+251 (0) 11 155 3800</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>registry@wemezekr.gov.et</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>www.wemezekr.gov.et</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Ethiopian Heritage Message */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} WEMEZEKR. Federal Democratic Republic of Ethiopia. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">About Wemezekr</Link>
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Custody</Link>
            <span className="text-[#D4AF37] font-semibold">Ethiopia 🇪🇹</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
