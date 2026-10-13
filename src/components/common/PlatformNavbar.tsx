import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Smartphone,
  Bike,
  LayoutDashboard,
  SplitSquareVertical,
  FileText,
  Sparkles,
  Type,
  Sun,
  Moon,
  Globe,
  Building2,
} from 'lucide-react';
import { LaunchStrategyMatrix } from './LaunchStrategyMatrix';
import { TypographyStyleGuide } from './TypographyStyleGuide';

export const PlatformNavbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    dynamicTypeScale,
    setDynamicTypePreset,
    dynamicTypePreset,
    themeMode,
    toggleThemeMode,
  } = usePlatform();
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showTypographyModal, setShowTypographyModal] = useState(false);
  const [showDynamicTypePopover, setShowDynamicTypePopover] = useState(false);

  const [showToolsPopover, setShowToolsPopover] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#000000]/70 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Apple Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('customer')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#0A84FF] to-[#0071E3] flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_10px_rgba(0,113,227,0.35)] group-hover:scale-105 transition-all">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#F5F5F7] leading-none">
                  MotoPilot
                </span>
                <span className="text-[10px] text-[#8E8E93] font-medium tracking-wide">
                  Mobilite & Kurye
                </span>
              </div>
            </button>
          </div>

          {/* Apple Segmented Control - 4 Çekirdek Ekran (Web Sitesi, Müşteri, Kurye, Komuta) */}
          <nav className="flex items-center p-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs font-medium backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setActiveView('website')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[36px] ${
                activeView === 'website'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-semibold'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
              }`}
              title="Kurumsal Web Sitesi & Tanıtım Vitrini"
            >
              <Globe className="w-3.5 h-3.5 stroke-[2]" />
              <span>Web Sitesi</span>
            </button>

            <button
              onClick={() => setActiveView('customer')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[36px] ${
                activeView === 'customer'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-semibold'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
              }`}
              title="Bireysel Müşteri Uygulaması (Yolcu & Paket)"
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2]" />
              <span>Kişisel</span>
            </button>

            <button
              onClick={() => setActiveView('business')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[36px] ${
                activeView === 'business'
                  ? 'bg-[#BF5AF2] text-white shadow-[0_2px_8px_rgba(191,90,242,0.3)] font-semibold'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
              }`}
              title="Kurumsal İşletme Portalı (B2B Dağıtım & Alt Kullanıcılar)"
            >
              <Building2 className="w-3.5 h-3.5 stroke-[2]" />
              <span>İşletme</span>
            </button>

            <button
              onClick={() => setActiveView('courier')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[36px] ${
                activeView === 'courier'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-semibold'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
              }`}
              title="Sürücü & Kurye Uygulaması"
            >
              <Bike className="w-3.5 h-3.5 stroke-[2]" />
              <span>Kurye</span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[36px] ${
                activeView === 'admin'
                  ? 'bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-semibold'
                  : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
              }`}
              title="Operasyon / Komuta Merkezi"
            >
              <LayoutDashboard className="w-3.5 h-3.5 stroke-[2]" />
              <span>Komuta</span>
            </button>
          </nav>

          {/* Kompakt Araçlar & Erişilebilirlik */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Kompakt Araçlar Açılır Menüsü */}
            <div className="relative">
              <button
                onClick={() => setShowToolsPopover(!showToolsPopover)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                  ['split', 'typography', 'presentation'].includes(activeView)
                    ? 'bg-[#0071E3] text-white border-[#0A84FF]'
                    : 'bg-white/[0.08] text-[#F5F5F7] border-white/[0.1] hover:bg-white/[0.14]'
                }`}
                title="Simülasyon, Dokümanlar ve Sistem Araçları"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
                <span className="hidden sm:inline">Araçlar</span>
                <span className="text-[10px] text-[#8E8E93]">▾</span>
              </button>

              {showToolsPopover && (
                <div className="absolute right-0 top-11 z-50 w-56 p-2 rounded-2xl bg-[#1C1C1E] border border-white/[0.12] shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <button
                    onClick={() => {
                      setActiveView('split');
                      setShowToolsPopover(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2 transition-all ${
                      activeView === 'split' ? 'bg-[#0071E3] text-white font-semibold' : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <SplitSquareVertical className="w-4 h-4 stroke-[2]" />
                    <span>Canlı İkili Simülasyon</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('typography');
                      setShowToolsPopover(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2 transition-all ${
                      activeView === 'typography' ? 'bg-[#0071E3] text-white font-semibold' : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Type className="w-4 h-4 text-[#0A84FF]" />
                    <span>Tipografi Sistemi</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('presentation');
                      setShowToolsPopover(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2 transition-all ${
                      activeView === 'presentation' ? 'bg-[#0071E3] text-white font-semibold' : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <FileText className="w-4 h-4 stroke-[2]" />
                    <span>Tasarım Şartnamesi</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowLaunchModal(true);
                      setShowToolsPopover(false);
                    }}
                    className="w-full p-2.5 rounded-xl text-left flex items-center gap-2 text-[#8E8E93] hover:text-white hover:bg-white/[0.06] transition-all border-t border-white/[0.06] pt-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF9F0A]" />
                    <span>Lansman Matrisi</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Type aA Button & Quick Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDynamicTypePopover(!showDynamicTypePopover)}
                className={`px-2.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                  dynamicTypeScale !== 1
                    ? 'bg-[#0A84FF]/20 text-[#0A84FF] border-[#0A84FF]/40'
                    : 'bg-white/[0.08] text-[#F5F5F7] border-white/[0.1] hover:bg-white/[0.12]'
                }`}
                title="Apple Dynamic Type Metin Boyutu Ölçekleyici"
              >
                <span className="font-bold tracking-tighter">aA</span>
                <span className="text-[11px] font-mono text-[#A1A1A6]">
                  {Math.round(dynamicTypeScale * 100)}%
                </span>
              </button>

              {/* Dynamic Type Quick Menu Popover */}
              {showDynamicTypePopover && (
                <div className="absolute right-0 top-11 z-50 w-64 p-3 rounded-2xl bg-[#1C1C1E] border border-white/[0.12] shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Apple Dynamic Type</span>
                    <span className="text-[10px] text-[#0A84FF] font-mono">
                      {Math.round(dynamicTypeScale * 100)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {(
                      [
                        { id: 'small', label: '85% Kompakt' },
                        { id: 'standard', label: '100% (17pt Standart)' },
                        { id: 'large', label: '115% Büyük' },
                        { id: 'accessibility1', label: '130% Erişilebilir' },
                        { id: 'accessibility2', label: '150% Ekstra Büyük' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setDynamicTypePreset(item.id);
                          setShowDynamicTypePopover(false);
                        }}
                        className={`p-1.5 rounded-xl text-left transition-all ${
                          dynamicTypePreset === item.id
                            ? 'bg-white text-black font-semibold'
                            : 'bg-white/[0.04] text-[#8E8E93] hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between">
                    <button
                      onClick={toggleThemeMode}
                      className="text-[11px] text-[#8E8E93] hover:text-white flex items-center gap-1.5"
                    >
                      {themeMode === 'light' ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <span>Açık Tema</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-[#0A84FF]" />
                          <span>Koyu Tema</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowDynamicTypePopover(false);
                        setShowTypographyModal(true);
                      }}
                      className="text-[11px] text-[#0A84FF] hover:underline font-medium"
                    >
                      Stil Tablosu &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lansman Matrisi Button */}
            <button
              onClick={() => setShowLaunchModal(true)}
              className="px-3.5 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-[#F5F5F7] border border-white/[0.1] text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span className="hidden sm:inline">Lansman Matrisi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Lansman Matrisi Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200">
            <LaunchStrategyMatrix
              isModal
              onClose={() => setShowLaunchModal(false)}
            />
          </div>
        </div>
      )}

      {/* Tipografi Sistemi Modal */}
      {showTypographyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200">
            <TypographyStyleGuide
              isModal
              onClose={() => setShowTypographyModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

