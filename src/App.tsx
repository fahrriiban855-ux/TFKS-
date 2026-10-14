import React, { Suspense, lazy } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { PlatformNavbar } from './components/common/PlatformNavbar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OfflineIndicator } from './components/common/PWAAndStoreCenter';

// BÖLÜM D5: Route-Based Code Splitting & Lazy Loading
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
const PresentationView = lazy(() =>
  import('./components/presentation/PresentationView').then((m) => ({ default: m.PresentationView }))
);
const TypographyStyleGuide = lazy(() =>
  import('./components/common/TypographyStyleGuide').then((m) => ({
    default: m.TypographyStyleGuide,
  }))
);
const ScreenDesignSystem = lazy(() =>
  import('./components/wireframes/ScreenDesignSystem').then((m) => ({
    default: m.ScreenDesignSystem,
  }))
);

const ViewLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-[var(--text-secondary)]"
  >
    <div className="w-9 h-9 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
    <span className="text-xs font-medium tracking-tight">Modül yükleniyor...</span>
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
            {activeView === 'presentation' && <PresentationView />}
            {activeView === 'typography' && <TypographyStyleGuide />}
            {activeView === 'wireframes' && <ScreenDesignSystem />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <OfflineIndicator />

      {/* Kurumsal Alt Bilgi Çubuğu (Obsidian & Daylight Uyumlu) */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-xl py-4 px-6 text-xs text-[var(--text-secondary)]">
        <div className="max-w-[1640px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text-primary)]">MotoPilot</span>
            <span aria-hidden="true">·</span>
            <span>Türkiye Kurye &amp; Motosikletli Ulaşım Ağı</span>
          </div>
          <div className="font-mono text-[11px] text-[var(--text-secondary)] flex items-center gap-3 flex-wrap tabular-nums">
            <span>TFKS 18 Operasyon Sınıfı</span>
            <span aria-hidden="true">·</span>
            <span>SHA-256 Mühür Zinciri &amp; Çift Taraflı Defter</span>
            <span aria-hidden="true">·</span>
            <span>WCAG 2.2 AA (Obsidian &amp; Daylight)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
