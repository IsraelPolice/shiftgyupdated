import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { useUpgrade } from './contexts/UpgradeContext';
import PremiumFeatureModal from './components/upgrade/PremiumFeatureModal';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import EmployeesSimple from './pages/Employees';
import DepartmentsSimple from './pages/Departments';
import Schedules from './pages/Schedules';
import Templates from './pages/Templates';
import TemplateBuilder from './pages/TemplateBuilder';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import Surveys from './pages/Surveys';
import Settings from './pages/Settings';
import Support from './pages/Support';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ProtectedRoute from './components/common/ProtectedRoute';
import PresenceReports from './components/presence/PresenceReports';
import BreakManagement from './components/breaks/BreakManagement';
import ScheduledReports from './components/reports/ScheduledReports';
import PresenceSettings from './components/presence/PresenceSettings';
import BreakSettings from './components/breaks/BreakSettings';
import NotificationSettings from './pages/settings/NotificationSettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import ReportsConfiguration from './pages/settings/ReportsConfiguration';
import AdminRoutes from './routes/AdminRoutes';
import AccessibilityManager from './components/accessibility/AccessibilityManager';
import MobileEmployees from './pages/MobileEmployees';
import TutorialOverlay from './components/tutorials/TutorialOverlay';
import AdminTutorialDashboard from './components/tutorials/AdminTutorialDashboard';
import PredictiveAnalyticsPanel from './components/ai/PredictiveAnalyticsPanel';
import { ModernLayoutWrapper } from './components/layout/ModernLayoutWrapper';
import HowToAddEmployee from './pages/support/HowToAddEmployee';

// Feature Access Guard Component
function FeatureGuard({ featureId, children }: { featureId: string; children: React.ReactNode }) {
  const { hasFeatureAccess } = useUpgrade();
  const { t } = useLanguage();
  
  if (!hasFeatureAccess(featureId)) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 text-gray-400">🔒</div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('upgrade.feature_not_available')}</h3>
        <p className="text-gray-500">{t('upgrade.requires_subscription')}</p>
      </div>
    );
  }
  
  return <>{children}</>;
}

function App() {
  const { user, loading, isSuperAdmin } = useAuth();
  const { isRTL, direction } = useLanguage();
  const { activeModal, hideFeatureModal } = useUpgrade();

  // Set HTML dir attribute for RTL support
  useEffect(() => {
    document.documentElement.dir = direction;
    // Keep sidebar on left side regardless of language direction
    document.documentElement.classList.toggle('sidebar-left', true);
  }, [direction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ModernLayoutWrapper showFloatingActions={false}>
    <div className={`min-h-screen ${isRTL ? 'rtl' : ''}`}>
      {/* Wrapped existing content in ModernLayoutWrapper */}
      <AccessibilityManager />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        
        {/* Admin Routes - Only for Super Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<EmployeesSimple />} />
          <Route path="departments" element={<DepartmentsSimple />} />
          <Route path="mobile-employees" element={<MobileEmployees />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="admin/tutorials" element={<AdminTutorialDashboard />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/new" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />
          <Route path="templates/builder" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />
          <Route path="templates/builder/:templateId" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />
          <Route path="templates/edit/:templateId" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/scheduled" element={<ScheduledReports />} />
          <Route path="presence" element={
            <FeatureGuard featureId="presence">
              <PresenceReports />
            </FeatureGuard>
          } />
          <Route path="breaks" element={
            <FeatureGuard featureId="breaks">
              <BreakManagement />
            </FeatureGuard>
          } />
          <Route path="tasks" element={
            <FeatureGuard featureId="tasks">
              <Tasks />
            </FeatureGuard>
          } />
          <Route path="surveys" element={
            <FeatureGuard featureId="surveys">
              <Surveys />
            </FeatureGuard>
          } />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/presence" element={<PresenceSettings />} />
          <Route path="settings/breaks" element={<BreakSettings />} />
          <Route path="settings/notifications" element={<NotificationSettings />} />
          <Route path="settings/security" element={<SecuritySettings />} />
          <Route path="settings/reports" element={<ReportsConfiguration />} />
          <Route path="support" element={<Support />} />
          <Route path="support/how-to-add-employee" element={<HowToAddEmployee />} />
          <Route path="terms" element={<TermsOfServicePage />} />
        </Route>
      </Routes>
      
      {/* Premium Feature Modal */}
      {activeModal && (
        <PremiumFeatureModal
          featureId={activeModal}
          onClose={hideFeatureModal}
        />
      )}
      
      <Suspense fallback={null}>
        <PredictiveAnalyticsPanel />
        <TutorialOverlay />
      </Suspense>
    </div>
    </ModernLayoutWrapper>
  );
}

export default App;