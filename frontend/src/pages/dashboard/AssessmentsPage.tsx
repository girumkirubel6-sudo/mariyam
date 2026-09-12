import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../../api/assessmentApi';
import { AssessmentItem } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../api/config';
import { ClipboardList, Plus, Star, Calendar, User, ShieldCheck } from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toast = useToast();

  // New assessment form state
  const [submissionId, setSubmissionId] = useState('sub-1');
  const [score, setScore] = useState<number>(92);
  const [condition, setCondition] = useState('Good');
  const [historicalValue, setHistoricalValue] = useState('Exceptional');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assessmentApi.getAll();
      setAssessments(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await assessmentApi.create({
        submissionId,
        score: Number(score),
        condition,
        historicalValue,
        comments,
      });
      toast.success('Assessment scored and registered successfully');
      setAssessments((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setComments('');
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Failed to submit assessment: ${parsed.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
            Curatorial & Philological Assessments
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Historical value scoring, physical condition audit, and authenticity reports by authorized heritage scholars.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Assessment</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadAssessments} />}

      {loading ? (
        <LoadingSpinner label="Retrieving assessment dossiers..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs hover:border-[#D4AF37] transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center font-serif font-bold text-sm">
                    {a.score}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                      Score / 100
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      Audit Ref: {a.id}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/30">
                  {a.historicalValue}
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-stone-100">
                "{a.comments}"
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0C3823]" />
                  <span>Auditor: {a.assessorName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{a.assessedAt?.split('T')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Assessment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Curatorial Assessment"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Heritage Submission ID
            </label>
            <input
              type="text"
              required
              value={submissionId}
              onChange={(e) => setSubmissionId(e.target.value)}
              placeholder="e.g., sub-1"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Authenticity Score (0–100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Historical Value
              </label>
              <select
                value={historicalValue}
                onChange={(e) => setHistoricalValue(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
              >
                <option value="Exceptional">Exceptional (World Heritage Grade)</option>
                <option value="High">High (National Significance)</option>
                <option value="Moderate">Moderate (Regional Significance)</option>
                <option value="Low">Low (Local Significance)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Physical Condition
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., Stable, Intact Binding, Minor Water Stain"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Philological Assessment Commentary
            </label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Record findings on ink composition, script style, codex illuminations, and dating..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Assessment...' : 'Submit Assessment Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
