import { apiClient } from './config';
import { Submission, SubmissionStatus } from '../types';
import { SAMPLE_SUBMISSIONS } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const submissionApi = {
  async getAll(status?: SubmissionStatus): Promise<Submission[]> {
    if (getDemoMode()) {
      if (status) {
        return SAMPLE_SUBMISSIONS.filter((s) => s.status === status);
      }
      return SAMPLE_SUBMISSIONS;
    }
    const params = status ? { status } : undefined;
    const res = await apiClient.get<Submission[]>('/submissions', { params });
    return res.data;
  },

  async getPending(): Promise<Submission[]> {
    if (getDemoMode()) {
      return SAMPLE_SUBMISSIONS.filter((s) => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW');
    }
    const res = await apiClient.get<Submission[]>('/submissions/pending');
    return res.data;
  },

  async getById(id: string): Promise<Submission> {
    if (getDemoMode()) {
      const found = SAMPLE_SUBMISSIONS.find((s) => s.id === id);
      if (!found) throw new Error('Submission not found');
      return found;
    }
    const res = await apiClient.get<Submission>(`/submissions/${id}`);
    return res.data;
  },

  async create(data: Partial<Submission>): Promise<Submission> {
    if (getDemoMode()) {
      const newSub: Submission = {
        id: 'sub-' + Math.random().toString(36).substring(2, 7),
        title: data.title || 'Untitled Submission',
        itemType: data.itemType || 'MANUSCRIPT',
        itemId: data.itemId,
        submitterId: data.submitterId || 'usr-zone-demo',
        submitterName: data.submitterName || 'Zone Heritage Registrar',
        submitterEmail: data.submitterEmail || 'registrar@heritage.et',
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        notes: data.notes || '',
        regionId: data.regionId,
        zoneId: data.zoneId,
        regionName: data.regionName,
        zoneName: data.zoneName,
      };
      SAMPLE_SUBMISSIONS.unshift(newSub);
      return newSub;
    }
    const res = await apiClient.post<Submission>('/submissions', data);
    return res.data;
  },

  async updateStatus(id: string, status: SubmissionStatus, notes?: string): Promise<Submission> {
    if (getDemoMode()) {
      const index = SAMPLE_SUBMISSIONS.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Submission not found');
      SAMPLE_SUBMISSIONS[index].status = status;
      if (notes) {
        SAMPLE_SUBMISSIONS[index].notes = notes;
      }
      return SAMPLE_SUBMISSIONS[index];
    }
    const res = await apiClient.patch<Submission>(`/submissions/${id}/status`, { status, notes });
    return res.data;
  },
};
