import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';
import { Database, Server, Sparkles, AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ServerStatusBannerProps {
  connectionError?: string | null;
  onRetry?: () => void;
}

export const ServerStatusBanner: React.FC<ServerStatusBannerProps> = ({ connectionError, onRetry }) => {
  const { demoMode, setDemoMode } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && !connectionError) return null;

  return (
    <div className="w-full bg-[#1A2E22] text-stone-200 border-b border-[#D4AF37]/30 text-xs px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Backend connection info or exact error message */}
        <div className="flex items-center gap-2.5">
          {connectionError ? (
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
              <span>{connectionError}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-300">
              <Server className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Backend API Target:</span>
              <code className="bg-black/30 px-2 py-0.5 rounded text-[#F4E7BE] font-mono text-[11px] border border-white/10">
                {API_BASE_URL}
              </code>
            </div>
          )}
        </div>

        {/* Right: Mode status & toggle */}
        <div className="flex items-center gap-3">
          {onRetry && connectionError && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 px-2 py-1 rounded transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Retry Connection
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full border border-white/10">
            <span className="text-[11px] text-stone-300">Preview Dataset:</span>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                demoMode
                  ? 'bg-[#D4AF37] text-[#0C3823] shadow-xs'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
              title="Toggle interactive Ethiopian cultural heritage sample dataset for local inspection"
            >
              <Sparkles className="w-3 h-3" />
              {demoMode ? 'Active (Explore All)' : 'Live API Only'}
            </button>
          </div>

          {!connectionError && (
            <button
              onClick={() => setDismissed(true)}
              className="text-stone-400 hover:text-white transition-colors"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
