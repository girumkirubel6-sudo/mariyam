import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/adminApi';
import { submissionApi } from '../../api/submissionApi';
import { DashboardStats, SubmissionItem } from '../../types';
import { DashboardStatCard } from '../../components/DashboardStatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { parseApiError } from '../../api/config';
import {
  BookOpen,
  Archive,
  Scroll,
  FileCheck,
  ClipboardList,
  Layers,
  ArrowRight,
  PlusCircle,
  Shield,
  Eye,
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [st, subs] = await Promise.all([
        adminApi.getDashboardStats(),
        submissionApi.getAll(),
      ]);
      setStats(st);
      setRecentSubmissions(subs.slice(0, 5));
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner fullHeight label="Loading registry control panel..." />;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0C3823]/10 text-[#0C3823] mb-2">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Role: {user?.role.replace('_', ' ')}</span>
          </div>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Wemezekr National Digital Registry • Central Heritage Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register-heritage"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Asset</span>
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadDashboardData} />}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <DashboardStatCard
            title="Registered Literature"
            value={stats.totalLiterature}
            subtitle="Cataloged classical publications & novels"
            icon={BookOpen}
            colorScheme="green"
          />
          <DashboardStatCard
            title="Historical Archives"
            value={stats.totalArchives}
            subtitle="Treaties, proclamations, & ledgers"
            icon={Archive}
            colorScheme="amber"
          />
          <DashboardStatCard
            title="Ancient Manuscripts"
            value={stats.totalManuscripts}
            subtitle="Ge'ez vellum codices in vault"
            icon={Scroll}
            colorScheme="gold"
          />
          <DashboardStatCard
            title="Pending Submissions"
            value={stats.pendingSubmissions}
            subtitle="Awaiting preliminary curatorial review"
            icon={FileCheck}
            colorScheme="charcoal"
          />
          <DashboardStatCard
            title="In Assessment"
            value={stats.underReviewSubmissions}
            subtitle="Assigned to expert paleographers"
            icon={ClipboardList}
            colorScheme="green"
          />
          <DashboardStatCard
            title="Archived in Vault"
            value={stats.archivedSubmissions}
            subtitle="Permanent preservation custody"
            icon={Layers}
            colorScheme="emerald"
          />
        </div>
      )}

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Recent Heritage Accession Pipeline
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live status across zonal field offices and review desks.
            </p>
          </div>
          <Link
            to="/dashboard/submissions"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors"
          >
            <span>View All Submissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Asset Title</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Submitter / Officer</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Current Stage</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-serif font-bold text-stone-900 max-w-xs truncate">
                    {sub.itemTitle}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                      {sub.itemType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-600">{sub.submitterName}</td>
                  <td className="px-4 py-4 text-stone-500">{sub.submittedAt.split('T')[0]}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/dashboard/submissions"
                      className="inline-flex items-center gap-1 font-bold text-[#0C3823] hover:text-[#D4AF37] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
