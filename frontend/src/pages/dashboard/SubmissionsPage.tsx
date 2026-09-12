import React, { useState, useEffect } from 'react';
import { submissionApi } from '../../api/submissionApi';
import { SubmissionItem, WorkflowStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { WorkflowTimeline } from '../../components/WorkflowTimeline';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../api/config';
import {
  FileCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Archive,
  Compass,
} from 'lucide-react';

export const SubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null);
  const [newStatus, setNewStatus] = useState<WorkflowStatus>('UNDER_REVIEW');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const toast = useToast();

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await submissionApi.getAll();
      setSubmissions(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleOpenReview = (sub: SubmissionItem) => {
    setSelectedSub(sub);
    setNewStatus(sub.status);
    setReviewNotes(sub.notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedSub) return;
    setIsUpdating(true);
    try {
      const updated = await submissionApi.updateStatus(selectedSub.id, newStatus, reviewNotes);
      toast.success(`Workflow status updated to ${newStatus}`);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === selectedSub.id ? updated : s))
      );
      setSelectedSub(null);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Update failed: ${parsed.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter && sub.status !== statusFilter) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      return (
        sub.itemTitle.toLowerCase().includes(kw) ||
        sub.submitterName.toLowerCase().includes(kw) ||
        sub.itemType.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
          Submissions Verification Pipeline
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Review, authenticate, verify, and progress cultural artifacts through the 6-stage national preservation lifecycle.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4 text-[#0C3823]" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title, submitter, or category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto text-xs py-2 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">1. Submitted</option>
            <option value="UNDER_REVIEW">2. Under Review</option>
            <option value="APPROVED">3. Approved</option>
            <option value="REJECTED">3. Rejected</option>
            <option value="COLLECTED">4. Collected</option>
            <option value="ARCHIVED">5. Archived</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadSubmissions} />}

      {loading ? (
        <LoadingSpinner label="Loading submissions pipeline..." />
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Submission Item</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Submitted By</th>
                  <th className="px-4 py-3.5">Submission Date</th>
                  <th className="px-4 py-3.5">Current Lifecycle</th>
                  <th className="px-6 py-3.5 text-right">Review & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-serif font-bold text-stone-900 max-w-xs">
                      <p className="truncate text-sm">{sub.itemTitle}</p>
                      {sub.notes && (
                        <p className="text-[11px] text-stone-500 font-sans font-normal truncate mt-0.5">
                          Notes: {sub.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                        {sub.itemType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-stone-700">{sub.submitterName}</td>
                    <td className="px-4 py-4 text-stone-500">{sub.submittedAt.split('T')[0]}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={sub.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenReview(sub)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0C3823]/10 text-[#0C3823] hover:bg-[#0C3823] hover:text-white transition-colors text-xs font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Review Submission: ${selectedSub.itemTitle}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Timeline component */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                Current Preservation Stage
              </h4>
              <WorkflowTimeline currentStatus={selectedSub.status} />
            </div>

            {/* Submission Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block">Heritage Category</span>
                <strong className="text-stone-800">{selectedSub.itemType}</strong>
              </div>
              <div>
                <span className="text-stone-400 block">Submitted By</span>
                <strong className="text-stone-800">{selectedSub.submitterName}</strong>
              </div>
            </div>

            {/* Change Status Form */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Update Lifecycle Verification Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as WorkflowStatus)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                >
                  <option value="SUBMITTED">1. SUBMITTED – New Accession</option>
                  <option value="UNDER_REVIEW">2. UNDER_REVIEW – Paleographic Review</option>
                  <option value="APPROVED">3. APPROVED – Authenticity Confirmed</option>
                  <option value="REJECTED">3. REJECTED – Does Not Meet Criteria</option>
                  <option value="COLLECTED">4. COLLECTED – Vault Ingestion</option>
                  <option value="ARCHIVED">5. ARCHIVED – Permanent Preservation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Curatorial Assessment Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Provide philological notes, physical condition assessment, or reason for status advance..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleUpdateStatus}
                className="px-5 py-2 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50"
              >
                {isUpdating ? 'Updating Pipeline...' : 'Apply Status Transition'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
