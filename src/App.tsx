import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PublicLayout } from '@/components/public/PublicLayout';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { AdminRoute } from '@/components/app/AdminRoute';

// Public pages
import { HomePage } from '@/pages/public/HomePage';
import { FeaturesPage } from '@/pages/public/FeaturesPage';
import { FeatureDetailPage } from '@/pages/public/FeatureDetailPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { PricingPage } from '@/pages/public/PricingPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { GetStartedPage } from '@/pages/public/GetStartedPage';
import { PrivacyPage } from '@/pages/public/PrivacyPage';
import { TermsPage } from '@/pages/public/TermsPage';
import { DataDeletionPage } from '@/pages/public/DataDeletionPage';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// App pages
import { DashboardPage } from '@/pages/app/DashboardPage';
import { LeadsPage } from '@/pages/app/LeadsPage';
import { LeadDetailPage } from '@/pages/app/LeadDetailPage';
import { AppointmentsPage } from '@/pages/app/AppointmentsPage';
import { MessagesPage } from '@/pages/app/MessagesPage';
import { AnalyticsPage } from '@/pages/app/AnalyticsPage';
import { TeamPage } from '@/pages/app/TeamPage';
import { NotificationsPage } from '@/pages/app/NotificationsPage';
import { SettingsPage } from '@/pages/app/SettingsPage';
import { OnboardingPage } from '@/pages/app/OnboardingPage';
import { AdminDashboardPage } from '@/pages/app/AdminDashboardPage';
import { AdminClientsPage } from '@/pages/app/AdminClientsPage';
import { AdminUsersPage } from '@/pages/app/AdminUsersPage';
import { AdminSubscriptionsPage } from '@/pages/app/AdminSubscriptionsPage';
import { AdminLeadsPage } from '@/pages/app/AdminLeadsPage';
import { AdminSettingsPage } from '@/pages/app/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/features/:slug" element={<FeatureDetailPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/data-deletion" element={<DataDeletionPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Authenticated app */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Super Admin */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="clients" element={<AdminClientsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
