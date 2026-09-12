import { apiClient } from './config';
import { Region } from '../types';
import { SAMPLE_REGIONS } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const regionApi = {
  async getAll(): Promise<Region[]> {
    if (getDemoMode()) {
      return SAMPLE_REGIONS;
    }
    const res = await apiClient.get<Region[]>('/regions');
    return res.data;
  },

  async getById(id: string): Promise<Region> {
    if (getDemoMode()) {
      const found = SAMPLE_REGIONS.find((r) => r.id === id);
      if (!found) throw new Error('Region not found');
      return found;
    }
    const res = await apiClient.get<Region>(`/regions/${id}`);
    return res.data;
  },

  async create(data: Partial<Region>): Promise<Region> {
    if (getDemoMode()) {
      const newRegion: Region = {
        id: 'reg-' + Math.random().toString(36).substring(2, 7),
        name: data.name || 'New Region',
        amharicName: data.amharicName,
        code: data.code || 'REG',
        capital: data.capital || 'Capital',
        description: data.description || '',
        zonesCount: 0,
        recordsCount: 0,
      };
      SAMPLE_REGIONS.push(newRegion);
      return newRegion;
    }
    const res = await apiClient.post<Region>('/regions', data);
    return res.data;
  },

  async update(id: string, data: Partial<Region>): Promise<Region> {
    if (getDemoMode()) {
      const index = SAMPLE_REGIONS.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Region not found');
      SAMPLE_REGIONS[index] = { ...SAMPLE_REGIONS[index], ...data };
      return SAMPLE_REGIONS[index];
    }
    const res = await apiClient.patch<Region>(`/regions/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    if (getDemoMode()) {
      const index = SAMPLE_REGIONS.findIndex((r) => r.id === id);
      if (index !== -1) SAMPLE_REGIONS.splice(index, 1);
      return;
    }
    await apiClient.delete(`/regions/${id}`);
  },

  async getZones(regionId: string): Promise<any[]> {
    if (getDemoMode()) {
      const { SAMPLE_ZONES } = await import('../utils/sampleData');
      return SAMPLE_ZONES.filter((z) => z.regionId === regionId);
    }
    const res = await apiClient.get<any[]>(`/regions/${regionId}/zones`);
    return res.data;
  },
};
