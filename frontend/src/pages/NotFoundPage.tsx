import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center mb-6">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] bg-[#FAF6EB] px-3 py-1 rounded-full mb-3">
        Error 404 • Folio Missing
      </span>
      <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mb-2">
        Heritage Record Not Found
      </h1>
      <p className="text-xs sm:text-sm text-stone-600 max-w-md mb-8 leading-relaxed">
        The manuscript folio, state archive, or registry index you requested does not exist or has been relocated within the national vaults.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Wemezekr Home
      </Link>
    </div>
  );
};
