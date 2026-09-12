import { apiClient } from './config';
import { ManuscriptItem, SearchFilters } from '../types';
import { SAMPLE_MANUSCRIPTS } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const manuscriptApi = {
  async getAll(filters?: SearchFilters): Promise<ManuscriptItem[]> {
    if (getDemoMode()) {
      let results = [...SAMPLE_MANUSCRIPTS];
      if (filters?.keyword) {
        const kw = filters.keyword.toLowerCase();
        results = results.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) ||
            (item.author && item.author.toLowerCase().includes(kw)) ||
            item.description.toLowerCase().includes(kw) ||
            item.script.toLowerCase().includes(kw)
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
    const res = await apiClient.get<ManuscriptItem[]>('/manuscripts', { params: filters });
    return res.data;
  },

  async getById(id: string): Promise<ManuscriptItem> {
    if (getDemoMode()) {
      const found = SAMPLE_MANUSCRIPTS.find((m) => m.id === id);
      if (!found) throw new Error('Manuscript record not found');
      return found;
    }
    const res = await apiClient.get<ManuscriptItem>(`/manuscripts/${id}`);
    return res.data;
  },

  // Supports multipart/form-data with file upload up to 20MB
  async create(formData: FormData | Partial<ManuscriptItem>): Promise<ManuscriptItem> {
    if (getDemoMode()) {
      let title = 'Registered Ancient Manuscript';
      let language = "Ge'ez";
      let script = "Ethiopic Calligraphy";
      let description = '';
      let fileName = 'manuscript_digitization.pdf';

      if (formData instanceof FormData) {
        title = (formData.get('title') as string) || title;
        language = (formData.get('language') as string) || language;
        script = (formData.get('script') as string) || script;
        description = (formData.get('description') as string) || description;
        const file = formData.get('file') as File | null;
        if (file) {
          fileName = file.name;
        }
      } else {
        title = formData.title || title;
        language = formData.language || language;
        script = formData.script || script;
        description = formData.description || description;
      }

      const newItem: ManuscriptItem = {
        id: 'ms-' + Math.random().toString(36).substring(2, 7),
        title,
        language,
        script,
        description,
        estimatedDate: 'c. 15th Century',
        historicalSignificance: 'High preservation priority Ethiopian cultural heritage codex.',
        physicalCondition: 'Good',
        currentLocation: 'National Manuscript Repository',
        regionId: 'reg-tigray',
        zoneId: 'zone-axum',
        status: 'SUBMITTED',
        fileName,
        fileSize: '8.5 MB',
        fileUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        createdAt: new Date().toISOString(),
      };
      SAMPLE_MANUSCRIPTS.unshift(newItem);
      return newItem;
    }

    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await apiClient.post<ManuscriptItem>('/manuscripts', formData, { headers });
    return res.data;
  },

  async update(id: string, data: Partial<ManuscriptItem>): Promise<ManuscriptItem> {
    if (getDemoMode()) {
      const index = SAMPLE_MANUSCRIPTS.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Manuscript record not found');
      SAMPLE_MANUSCRIPTS[index] = { ...SAMPLE_MANUSCRIPTS[index], ...data };
      return SAMPLE_MANUSCRIPTS[index];
    }
    const res = await apiClient.patch<ManuscriptItem>(`/manuscripts/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    if (getDemoMode()) {
      const index = SAMPLE_MANUSCRIPTS.findIndex((m) => m.id === id);
      if (index !== -1) SAMPLE_MANUSCRIPTS.splice(index, 1);
      return;
    }
    await apiClient.delete(`/manuscripts/${id}`);
  },
};
