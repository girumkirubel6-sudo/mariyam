import React from 'react';
import { AlertTriangle, RefreshCw, Sparkles, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
  isConnectionError?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Unable to connect to the Wemezekr server. Please make sure the backend is running on port 5000.',
  onRetry,
  title = 'Connection Alert',
  isConnectionError = true,
}) => {
  const { demoMode, setDemoMode } = useAuth();

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-6 text-stone-800 shadow-xs max-w-2xl mx-auto my-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-800 shrink-0 border border-amber-200">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">{title}</h3>
          <p className="text-sm text-stone-700 leading-relaxed mb-4">{message}</p>

          {isConnectionError && (
            <div className="bg-stone-900 text-stone-200 rounded-xl p-3.5 mb-4 font-mono text-xs border border-stone-700">
              <div className="flex items-center gap-2 text-stone-400 mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Backend Startup Command (Terminal):</span>
              </div>
              <p className="text-emerald-400 select-all font-semibold">cd backend && npm run dev</p>
              <p className="text-stone-400 text-[11px] mt-1">
                Ensures Express + Prisma is listening at <span className="text-[#F4E7BE]">http://localhost:5000/api</span>
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0C3823] text-white font-medium text-xs hover:bg-[#124f33] transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            )}

            {!demoMode && (
              <button
                onClick={() => setDemoMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0C3823] font-bold text-xs hover:bg-[#c49f2b] transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explore with Verified Ethiopian Heritage Dataset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
