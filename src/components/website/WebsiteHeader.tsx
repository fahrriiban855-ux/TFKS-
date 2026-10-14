import React from 'react';
import { Phone, ArrowRight, ShieldCheck, Bike, Menu, X } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface WebsiteHeaderProps {
  onOpenEstimator: () => void;
  onOpenDriverModal: () => void;
  onOpenMerchantModal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({
  onOpenEstimator,
  onOpenDriverModal,
  onOpenMerchantModal,
  onScrollToSection,
}) => {
  const { setActiveView } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <header className="sticky top-16 z-30 w-full border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-lg font-bold tracking-tight text-[#F5F5F7] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            MotoPilot
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links (5 Single-Line Links, Unboxed Text) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#8E8E93]">
          <button
            onClick={() => handleNavClick('services')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Hizmetler
          </button>
          <button
            onClick={onOpenEstimator}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-[#0A84FF] font-semibold"
          >
            Ücret Hesapla
          </button>
          <button
            onClick={() => handleNavClick('districts')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Hizmet Bölgeleri
          </button>
          <button
            onClick={onOpenDriverModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Sürücü Ol
          </button>
          <button
            onClick={onOpenMerchantModal}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            İşletmeler İçin
          </button>
        </nav>

        {/* Zone 3: 1 Primary Conversion Action */}
        <div className="hidden sm:flex items-center shrink-0">
          <button
            onClick={() => setActiveView('customer')}
            className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-xl shadow-[0_2px_12px_rgba(0,113,227,0.35)] transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
          >
            <span>Hemen Çağır</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setActiveView('customer')}
            className="px-3 py-1.5 bg-[#0071E3] text-white text-xs font-bold rounded-xl"
          >
            Çağır
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-white/[0.08] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#161618] p-4 space-y-3 animate-in slide-in-from-top-2 duration-150 text-xs">
          <button
            onClick={() => handleNavClick('services')}
            className="w-full text-left py-2 text-zinc-300 hover:text-white font-medium"
          >
            Hizmetlerimiz (Moto TAG & Express Paket)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEstimator();
            }}
            className="w-full text-left py-2 text-[#0A84FF] font-semibold"
          >
            Ücret ve Süre Simülatörü
          </button>
          <button
            onClick={() => handleNavClick('districts')}
            className="w-full text-left py-2 text-zinc-300 hover:text-white font-medium"
          >
            Hizmet Verilen İstanbul İlçeleri
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDriverModal();
            }}
            className="w-full text-left py-2 text-white font-semibold"
          >
            Sürücü / Kurye Başvurusu Yap
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenMerchantModal();
            }}
            className="w-full text-left py-2 text-[#BF5AF2] font-semibold"
          >
            İşletme & Restoran Teslimat Talebi
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left py-2 text-zinc-300 hover:text-white font-medium"
          >
            Sık Sorulan Sorular & Güvence
          </button>
        </div>
      )}
    </header>
  );
};
