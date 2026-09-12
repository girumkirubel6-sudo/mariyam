import { apiClient } from './config';
import { CollectionRecord } from '../types';
import { SAMPLE_COLLECTIONS, SAMPLE_SUBMISSIONS } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const collectionApi = {
  async getAll(): Promise<CollectionRecord[]> {
    if (getDemoMode()) {
      return SAMPLE_COLLECTIONS;
    }
    const res = await apiClient.get<CollectionRecord[]>('/collections');
    return res.data;
  },

  async getById(id: string): Promise<CollectionRecord> {
    if (getDemoMode()) {
      const found = SAMPLE_COLLECTIONS.find((c) => c.id === id);
      if (!found) throw new Error('Collection record not found');
      return found;
    }
    const res = await apiClient.get<CollectionRecord>(`/collections/${id}`);
    return res.data;
  },

  async create(data: Partial<CollectionRecord>): Promise<CollectionRecord> {
    if (getDemoMode()) {
      const newCol: CollectionRecord = {
        id: 'col-' + Math.random().toString(36).substring(2, 7),
        submissionId: data.submissionId || '',
        submissionTitle: data.submissionTitle || 'Collected Heritage Asset',
        itemType: data.itemType || 'MANUSCRIPT',
        collectorId: data.collectorId || 'usr-collector',
        collectorName: data.collectorName || 'National Preservation Field Unit',
        collectionDate: data.collectionDate || new Date().toISOString().split('T')[0],
        collectionLocation: data.collectionLocation || 'Regional Vault',
        notes: data.notes || '',
        status: 'COLLECTED',
        createdAt: new Date().toISOString(),
      };
      SAMPLE_COLLECTIONS.unshift(newCol);

      // update submission
      const sub = SAMPLE_SUBMISSIONS.find((s) => s.id === data.submissionId);
      if (sub) {
        sub.status = 'COLLECTED';
      }

      return newCol;
    }
    const res = await apiClient.post<CollectionRecord>('/collections', data);
    return res.data;
  },

  async archiveSubmission(submissionId: string, notes?: string): Promise<CollectionRecord> {
    if (getDemoMode()) {
      const col = SAMPLE_COLLECTIONS.find((c) => c.submissionId === submissionId);
      if (col) {
        col.status = 'ARCHIVED';
        if (notes) col.notes = `${col.notes} | Archive Note: ${notes}`;
      }
      const sub = SAMPLE_SUBMISSIONS.find((s) => s.id === submissionId);
      if (sub) {
        sub.status = 'ARCHIVED';
      }
      if (!col) throw new Error('Collection record for this submission not found');
      return col;
    }
    const res = await apiClient.patch<CollectionRecord>(`/collections/archive/${submissionId}`, { notes });
    return res.data;
  },
};
