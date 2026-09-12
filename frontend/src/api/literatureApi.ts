import { apiClient } from './config';
import { LiteratureItem, SearchFilters } from '../types';
import { SAMPLE_LITERATURE } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const literatureApi = {
  async getAll(filters?: SearchFilters): Promise<LiteratureItem[]> {
    if (getDemoMode()) {
      let results = [...SAMPLE_LITERATURE];
      if (filters?.keyword) {
        const kw = filters.keyword.toLowerCase();
        results = results.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) ||
            item.author.toLowerCase().includes(kw) ||
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
        results = results.filter((item) => item.language.toLowerCase() === filters.language?.toLowerCase());
      }
      if (filters?.status) {
        results = results.filter((item) => item.status === filters.status);
      }
      return results;
    }
    const res = await apiClient.get<LiteratureItem[]>('/literature', { params: filters });
    return res.data;
  },

  async getById(id: string): Promise<LiteratureItem> {
    if (getDemoMode()) {
      const found = SAMPLE_LITERATURE.find((l) => l.id === id);
      if (!found) throw new Error('Literature record not found');
      return found;
    }
    const res = await apiClient.get<LiteratureItem>(`/literature/${id}`);
    return res.data;
  },

  async create(data: Partial<LiteratureItem>): Promise<LiteratureItem> {
    if (getDemoMode()) {
      const newItem: LiteratureItem = {
        id: 'lit-' + Math.random().toString(36).substring(2, 7),
        title: data.title || '',
        author: data.author || '',
        language: data.language || 'Amharic',
        publicationYear: data.publicationYear || new Date().getFullYear(),
        category: data.category || 'General',
        description: data.description || '',
        location: data.location || '',
        regionId: data.regionId || 'reg-addis-ababa',
        zoneId: data.zoneId || 'zone-arada',
        status: data.status || 'SUBMITTED',
        createdAt: new Date().toISOString(),
      };
      SAMPLE_LITERATURE.unshift(newItem);
      return newItem;
    }
    const res = await apiClient.post<LiteratureItem>('/literature', data);
    return res.data;
  },

  async update(id: string, data: Partial<LiteratureItem>): Promise<LiteratureItem> {
    if (getDemoMode()) {
      const index = SAMPLE_LITERATURE.findIndex((l) => l.id === id);
      if (index === -1) throw new Error('Literature record not found');
      SAMPLE_LITERATURE[index] = { ...SAMPLE_LITERATURE[index], ...data };
      return SAMPLE_LITERATURE[index];
    }
    const res = await apiClient.patch<LiteratureItem>(`/literature/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    if (getDemoMode()) {
      const index = SAMPLE_LITERATURE.findIndex((l) => l.id === id);
      if (index !== -1) SAMPLE_LITERATURE.splice(index, 1);
      return;
    }
    await apiClient.delete(`/literature/${id}`);
  },
};
