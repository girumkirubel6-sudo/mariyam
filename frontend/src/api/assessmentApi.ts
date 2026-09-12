import { apiClient } from './config';
import { Assessment } from '../types';
import { SAMPLE_ASSESSMENTS, SAMPLE_SUBMISSIONS } from '../utils/sampleData';
import { getDemoMode } from '../utils/helpers';

export const assessmentApi = {
  async getAll(): Promise<Assessment[]> {
    if (getDemoMode()) {
      return SAMPLE_ASSESSMENTS;
    }
    const res = await apiClient.get<Assessment[]>('/assessments');
    return res.data;
  },

  async getBySubmission(submissionId: string): Promise<Assessment[]> {
    if (getDemoMode()) {
      return SAMPLE_ASSESSMENTS.filter((a) => a.submissionId === submissionId);
    }
    const res = await apiClient.get<Assessment[]>(`/assessments/submission/${submissionId}`);
    return res.data;
  },

  async create(data: Partial<Assessment>): Promise<Assessment> {
    if (getDemoMode()) {
      const newAssessment: Assessment = {
        id: 'ass-' + Math.random().toString(36).substring(2, 7),
        submissionId: data.submissionId || '',
        submissionTitle: data.submissionTitle || 'Submission Assessment',
        reviewerId: data.reviewerId || 'usr-admin-current',
        reviewerName: data.reviewerName || 'Senior Heritage Reviewer',
        decision: data.decision || 'APPROVED',
        score: data.score || 85,
        comments: data.comments || 'Evaluated against National Digital Registry criteria.',
        createdAt: new Date().toISOString(),
      };
      SAMPLE_ASSESSMENTS.unshift(newAssessment);

      // Auto update submission status in preview
      const sub = SAMPLE_SUBMISSIONS.find((s) => s.id === data.submissionId);
      if (sub) {
        if (data.decision === 'APPROVED') {
          sub.status = 'APPROVED';
        } else if (data.decision === 'REJECTED') {
          sub.status = 'REJECTED';
        } else {
          sub.status = 'UNDER_REVIEW';
        }
      }

      return newAssessment;
    }
    const res = await apiClient.post<Assessment>('/assessments', data);
    return res.data;
  },
};
