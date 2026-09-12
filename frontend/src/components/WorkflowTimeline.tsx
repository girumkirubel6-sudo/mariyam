import React from 'react';
import { SubmissionStatus } from '../types';
import { Check, Clock, ShieldCheck, Archive, Package, XCircle } from 'lucide-react';

interface WorkflowTimelineProps {
  currentStatus: SubmissionStatus;
  notes?: string;
}

interface Step {
  key: SubmissionStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ currentStatus, notes }) => {
  const steps: Step[] = [
    {
      key: 'SUBMITTED',
      label: '1. Registered',
      description: 'Submitted by zonal/regional registrar',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: 'UNDER_REVIEW',
      label: '2. Under Review',
      description: 'Paleographic & archival verification',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      key: 'APPROVED',
      label: '3. Approved',
      description: 'Cleared by National Heritage Board',
      icon: <Check className="w-4 h-4" />,
    },
    {
      key: 'COLLECTED',
      label: '4. Collected',
      description: 'Physical ingestion or high-res digitization',
      icon: <Package className="w-4 h-4" />,
    },
    {
      key: 'ARCHIVED',
      label: '5. Archived',
      description: 'Permanently cataloged in Wemezekr Vault',
      icon: <Archive className="w-4 h-4" />,
    },
  ];

  const statusOrder: Record<SubmissionStatus, number> = {
    SUBMITTED: 1,
    UNDER_REVIEW: 2,
    APPROVED: 3,
    REJECTED: 3,
    COLLECTED: 4,
    ARCHIVED: 5,
  };

  const currentLevel = statusOrder[currentStatus] || 1;
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-lg">National Preservation Lifecycle</h3>
          <p className="text-xs text-stone-500">Official multi-stage verification and conservation pipeline</p>
        </div>
        {isRejected ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-4 h-4" /> Registration Rejected
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#0C3823] bg-[#0C3823]/10 px-3 py-1 rounded-full border border-[#0C3823]/20">
            Stage {currentLevel} of 5
          </span>
        )}
      </div>

      <div className="relative">
        {/* Progress Bar Line */}
        <div className="hidden md:block absolute top-5 left-6 right-6 h-1 bg-stone-100 -z-0">
          <div
            className={`h-full transition-all duration-500 ${isRejected ? 'bg-red-500' : 'bg-[#0C3823]'}`}
            style={{ width: `${Math.min(100, Math.max(0, ((currentLevel - 1) / (steps.length - 1)) * 100))}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentLevel > stepNum;
            const isCurrent = currentLevel === stepNum && !isRejected;

            return (
              <div key={step.key} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-3 md:gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCompleted
                      ? 'bg-[#0C3823] text-[#D4AF37] border-[#D4AF37]'
                      : isCurrent
                      ? 'bg-[#D4AF37] text-[#0C3823] border-[#0C3823] shadow-md ring-4 ring-[#D4AF37]/20 font-bold'
                      : 'bg-white text-stone-400 border-stone-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.icon}
                </div>
                <div>
                  <h4
                    className={`text-sm font-medium ${
                      isCurrent ? 'font-bold text-[#0C3823]' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-stone-500 leading-tight hidden md:block mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {notes && (
        <div className="mt-5 pt-4 border-t border-stone-100 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg flex items-start gap-2">
          <span className="font-semibold text-stone-800 shrink-0">Registrar / Curatorial Notes:</span>
          <span>{notes}</span>
        </div>
      )}
    </div>
  );
};
