import { apiClient } from './config';
import { Zone } from '../types';
import { SAMPLE_ZONES } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const zoneApi = {
  async getAll(regionId?: string): Promise<Zone[]> {
    if (getDemoMode()) {
      if (regionId) {
        return SAMPLE_ZONES.filter((z) => z.regionId === regionId);
      }
      return SAMPLE_ZONES;
    }
    const params = regionId ? { regionId } : undefined;
    const res = await apiClient.get<Zone[]>('/zones', { params });
    return res.data;
  },

  async getById(id: string): Promise<Zone> {
    if (getDemoMode()) {
      const found = SAMPLE_ZONES.find((z) => z.id === id);
      if (!found) throw new Error('Zone not found');
      return found;
    }
    const res = await apiClient.get<Zone>(`/zones/${id}`);
    return res.data;
  },

  async create(data: Partial<Zone>): Promise<Zone> {
    if (getDemoMode()) {
      const newZone: Zone = {
        id: 'zone-' + Math.random().toString(36).substring(2, 7),
        name: data.name || 'New Zone',
        amharicName: data.amharicName,
        code: data.code || 'ZN',
        regionId: data.regionId || 'reg-amhara',
        regionName: data.regionName,
        description: data.description || '',
        recordsCount: 0,
      };
      SAMPLE_ZONES.push(newZone);
      return newZone;
    }
    const res = await apiClient.post<Zone>('/zones', data);
    return res.data;
  },

  async update(id: string, data: Partial<Zone>): Promise<Zone> {
    if (getDemoMode()) {
      const index = SAMPLE_ZONES.findIndex((z) => z.id === id);
      if (index === -1) throw new Error('Zone not found');
      SAMPLE_ZONES[index] = { ...SAMPLE_ZONES[index], ...data };
      return SAMPLE_ZONES[index];
    }
    const res = await apiClient.patch<Zone>(`/zones/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    if (getDemoMode()) {
      const index = SAMPLE_ZONES.findIndex((z) => z.id === id);
      if (index !== -1) SAMPLE_ZONES.splice(index, 1);
      return;
    }
    await apiClient.delete(`/zones/${id}`);
  },
};
