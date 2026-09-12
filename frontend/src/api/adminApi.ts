import { apiClient } from './config';
import { DashboardStats, Submission, User } from '../types';
import { SAMPLE_DASHBOARD_STATS, SAMPLE_SUBMISSIONS } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const adminApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (getDemoMode()) {
      return SAMPLE_DASHBOARD_STATS;
    }
    const res = await apiClient.get<DashboardStats>('/admin/dashboard');
    return res.data;
  },

  async getRecentSubmissions(): Promise<Submission[]> {
    if (getDemoMode()) {
      return SAMPLE_SUBMISSIONS.slice(0, 5);
    }
    const res = await apiClient.get<Submission[]>('/admin/recent-submissions');
    return res.data;
  },

  async getUsers(): Promise<User[]> {
    if (getDemoMode()) {
      return [
        { id: 'u-1', name: 'Dr. Berhanu Wolde', email: 'admin@wemezekr.gov.et', role: 'ADMIN' },
        { id: 'u-2', name: 'Almaz Tefera', email: 'regional.amhara@wemezekr.gov.et', role: 'REGIONAL_ADMIN', regionId: 'reg-amhara' },
        { id: 'u-3', name: 'Teklehaimanot Gebre', email: 'zone.axum@wemezekr.gov.et', role: 'ZONE_ADMIN', regionId: 'reg-tigray', zoneId: 'zone-axum' },
        { id: 'u-4', name: 'Prof. Rita Pankhurst Fellow', email: 'researcher.archive@wemezekr.gov.et', role: 'RESEARCHER' },
        { id: 'u-5', name: 'Yared Hailu', email: 'public.reader@gmail.com', role: 'PUBLIC' },
      ];
    }
    const res = await apiClient.get<User[]>('/admin/users');
    return res.data;
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    if (getDemoMode()) {
      return {
        id,
        name: 'User ' + id,
        email: 'user@wemezekr.gov.et',
        role: role as any,
      };
    }
    const res = await apiClient.patch<User>(`/admin/users/${id}`, { role });
    return res.data;
  },

  async deleteUser(id: string): Promise<void> {
    if (getDemoMode()) return;
    await apiClient.delete(`/admin/users/${id}`);
  },

  async createUser(data: { name: string; email: string; password?: string; role: any }): Promise<User> {
    if (getDemoMode()) {
      const newUser: User = {
        id: 'u-' + Math.random().toString(36).substring(2, 7),
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
      };
      return newUser;
    }
    const res = await apiClient.post<User>('/admin/users', data);
    return res.data;
  },
};
