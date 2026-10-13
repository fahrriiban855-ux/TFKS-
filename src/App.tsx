/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { PlatformNavbar } from './components/common/PlatformNavbar';
import { PresentationView } from './components/presentation/PresentationView';
import { CustomerApp } from './components/customer/CustomerApp';
import { CourierApp } from './components/courier/CourierApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SplitSimulationView } from './components/split/SplitSimulationView';
import { TypographyStyleGuide } from './components/common/TypographyStyleGuide';
import { WebsiteMainView } from './components/website/WebsiteMainView';
import { BusinessPortal } from './components/business/BusinessPortal';

const MainAppContent: React.FC = () => {
  const { activeView } = usePlatform();

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#0071E3] selection:text-white">
      <PlatformNavbar />

      <main className="flex-1 pb-12">
        {activeView === 'website' && <WebsiteMainView />}
        {activeView === 'split' && <SplitSimulationView />}
        {activeView === 'customer' && <CustomerApp />}
        {activeView === 'business' && <BusinessPortal />}
        {activeView === 'courier' && <CourierApp />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'presentation' && <PresentationView />}
        {activeView === 'typography' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <TypographyStyleGuide />
          </div>
        )}
      </main>

      {/* Apple Human Interface Minimalist Footer */}
      <footer className="border-t border-white/[0.08] bg-[#000000]/80 backdrop-blur-xl py-6 text-center text-xs text-[#8E8E93]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-tight">MotoPilot</span>
            <span>·</span>
            <span className="text-[#8E8E93]">Yeni Nesil Kentsel Mobilite ve Hızlı Kurye</span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[11px] text-[#A1A1A6] font-medium border border-white/[0.06]">
              iOS Human Interface Tasarımı
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#8E8E93] text-xs">
            <span className="hover:text-white transition-colors cursor-pointer">Müşteri / İşletme</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sürücü / Kurye</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Komuta Merkezi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <MainAppContent />
    </PlatformProvider>
  );
}
