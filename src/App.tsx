import React, { Suspense, lazy } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { PlatformNavbar } from './components/common/PlatformNavbar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OfflineIndicator } from './components/common/PWAAndStoreCenter';

const WebsiteMainView = lazy(() =>
  import('./components/website/WebsiteMainView').then((m) => ({ default: m.WebsiteMainView }))
);
const CustomerApp = lazy(() =>
  import('./components/customer/CustomerApp').then((m) => ({ default: m.CustomerApp }))
);
const BusinessPortal = lazy(() =>
  import('./components/business/BusinessPortal').then((m) => ({ default: m.BusinessPortal }))
);
const CourierApp = lazy(() =>
  import('./components/courier/CourierApp').then((m) => ({ default: m.CourierApp }))
);
const AdminDashboard = lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const SplitSimulationView = lazy(() =>
  import('./components/split/SplitSimulationView').then((m) => ({ default: m.SplitSimulationView }))
);

const ViewLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-[var(--text-secondary)]"
  >
    <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
    <span className="text-xs font-medium">Yükleniyor...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { activeView } = usePlatform();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[#2563EB] selection:text-white transition-colors duration-200">
      <PlatformNavbar />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<ViewLoadingFallback />}>
            {activeView === 'website' && <WebsiteMainView />}
            {activeView === 'customer' && <CustomerApp />}
            {activeView === 'business' && <BusinessPortal />}
            {activeView === 'courier' && <CourierApp />}
            {activeView === 'admin' && <AdminDashboard />}
            {activeView === 'split' && <SplitSimulationView />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <OfflineIndicator />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <PlatformProvider>
        <MainContent />
      </PlatformProvider>
    </ErrorBoundary>
  );
}

export default App;

