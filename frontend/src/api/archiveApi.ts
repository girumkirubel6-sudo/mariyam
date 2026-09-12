import { apiClient } from './config';
import { ArchiveItem, SearchFilters } from '../types';
import { SAMPLE_ARCHIVES } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const archiveApi = {
  async getAll(filters?: SearchFilters): Promise<ArchiveItem[]> {
    if (getDemoMode()) {
      let results = [...SAMPLE_ARCHIVES];
      if (filters?.keyword) {
        const kw = filters.keyword.toLowerCase();
        results = results.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) ||
            item.archiveType.toLowerCase().includes(kw) ||
            item.description.toLowerCase().includes(kw)
        );
      }
      if (filters?.regionId) {
        results = results.filter((item) => item.regionId === filters.regionId);
      }
      if (filters?.zoneId) {
        results = results.filter((item) => item.zoneId === filters.zoneId);
      }
      if (filters?.language) {
        results = results.filter((item) => item.language.toLowerCase().includes(filters.language!.toLowerCase()));
      }
      if (filters?.status) {
        results = results.filter((item) => item.status === filters.status);
      }
      return results;
    }
    const res = await apiClient.get<ArchiveItem[]>('/archives', { params: filters });
    return res.data;
  },

  async getById(id: string): Promise<ArchiveItem> {
    if (getDemoMode()) {
      const found = SAMPLE_ARCHIVES.find((a) => a.id === id);
      if (!found) throw new Error('Archive record not found');
      return found;
    }
    const res = await apiClient.get<ArchiveItem>(`/archives/${id}`);
    return res.data;
  },

  async create(data: Partial<ArchiveItem>): Promise<ArchiveItem> {
    if (getDemoMode()) {
      const newItem: ArchiveItem = {
        id: 'arc-' + Math.random().toString(36).substring(2, 7),
        title: data.title || '',
        archiveType: data.archiveType || 'Document',
        description: data.description || '',
        date: data.date || new Date().getFullYear().toString(),
        language: data.language || 'Amharic',
        location: data.location || '',
        regionId: data.regionId || 'reg-addis-ababa',
        zoneId: data.zoneId || 'zone-arada',
        status: data.status || 'SUBMITTED',
        createdAt: new Date().toISOString(),
      };
      SAMPLE_ARCHIVES.unshift(newItem);
      return newItem;
    }
    const res = await apiClient.post<ArchiveItem>('/archives', data);
    return res.data;
  },

  async update(id: string, data: Partial<ArchiveItem>): Promise<ArchiveItem> {
    if (getDemoMode()) {
      const index = SAMPLE_ARCHIVES.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Archive record not found');
      SAMPLE_ARCHIVES[index] = { ...SAMPLE_ARCHIVES[index], ...data };
      return SAMPLE_ARCHIVES[index];
    }
    const res = await apiClient.patch<ArchiveItem>(`/archives/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    if (getDemoMode()) {
      const index = SAMPLE_ARCHIVES.findIndex((a) => a.id === id);
      if (index !== -1) SAMPLE_ARCHIVES.splice(index, 1);
      return;
    }
    await apiClient.delete(`/archives/${id}`);
  },
};
