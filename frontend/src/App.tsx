/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleGuard } from './components/RoleGuard';

// Public & Catalog Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { LiteraturePage } from './pages/LiteraturePage';
import { LiteratureDetailPage } from './pages/LiteratureDetailPage';
import { ArchivesPage } from './pages/ArchivesPage';
import { ArchiveDetailPage } from './pages/ArchiveDetailPage';
import { ManuscriptsPage } from './pages/ManuscriptsPage';
import { ManuscriptDetailPage } from './pages/ManuscriptDetailPage';
import { RegionsPage } from './pages/RegionsPage';
import { RegionDetailPage } from './pages/RegionDetailPage';
import { AboutPage } from './pages/AboutPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { RegisterHeritagePage } from './pages/RegisterHeritagePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { SubmissionsPage } from './pages/dashboard/SubmissionsPage';
import { AssessmentsPage } from './pages/dashboard/AssessmentsPage';
import { CollectionsPage } from './pages/dashboard/CollectionsPage';
import { UsersPage } from './pages/dashboard/UsersPage';
import { DashboardRegionsPage } from './pages/dashboard/DashboardRegionsPage';
import { DashboardZonesPage } from './pages/dashboard/DashboardZonesPage';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public and Catalog Routes under MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/literature" element={<LiteraturePage />} />
              <Route path="/literature/:id" element={<LiteratureDetailPage />} />
              <Route path="/archives" element={<ArchivesPage />} />
              <Route path="/archives/:id" element={<ArchiveDetailPage />} />
              <Route path="/manuscripts" element={<ManuscriptsPage />} />
              <Route path="/manuscripts/:id" element={<ManuscriptDetailPage />} />
              <Route path="/regions" element={<RegionsPage />} />
              <Route path="/regions/:id" element={<RegionDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/ai-assistant" element={<AiAssistantPage />} />
              <Route path="/register-heritage" element={<RegisterHeritagePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Protected Dashboard Routes under DashboardLayout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverviewPage />} />
              <Route
                path="submissions"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'REGIONAL_ADMIN', 'ZONE_ADMIN']}>
                    <SubmissionsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="assessments"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'REGIONAL_ADMIN']}>
                    <AssessmentsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="collections"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'REGIONAL_ADMIN']}>
                    <CollectionsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="users"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <UsersPage />
                  </RoleGuard>
                }
              />
              <Route
                path="regions"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <DashboardRegionsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="zones"
                element={
                  <RoleGuard allowedRoles={['ADMIN', 'REGIONAL_ADMIN']}>
                    <DashboardZonesPage />
                  </RoleGuard>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

