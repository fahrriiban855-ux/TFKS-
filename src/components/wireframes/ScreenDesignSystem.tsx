import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Smartphone,
  Bike,
  LayoutDashboard,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  AlertTriangle,
  Camera,
  FileCheck,
  DollarSign,
  Star,
  Search,
  Sliders,
  Sparkles,
  ChevronRight,
  Eye,
  Grid,
  Ruler,
  Terminal,
  Code,
  Cpu,
  Activity,
  Zap,
  Compass,
  Download,
  Copy,
  Check,
  Box,
  Palette,
  Maximize2,
  Building2,
  X,
} from 'lucide-react';

import {
  CUSTOMER_WIREFRAME_SCREENS,
  COURIER_WIREFRAME_SCREENS,
  BUSINESS_WIREFRAME_SCREENS,
  ADMIN_WIREFRAME_SCREENS,
  ALL_WIREFRAME_SCREENS,
  WireframeScreen,
} from './index';
import { TFKS_OPERATIONAL_CLASSES, getScreenTfksSpec } from './tfksSpecs';
import {
  END_TO_END_22_FLOWS,
  VERIFICATION_71_CHECKS,
  DECISION_REQUIRED_6_ITEMS,
} from './masterAuditSpecs';

export const ScreenDesignSystem: React.FC = () => {
  const { setActiveView } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState<'customer' | 'courier' | 'business' | 'admin'>('customer');
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<
    'blueprint' | 'matrix' | 'flows22' | 'checks71' | 'decisions6' | 'tokens'
  >('blueprint');
  const [checkCategoryFilter, setCheckCategoryFilter] = useState<string>('ALL');

  // Figma Inspection Toggles
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(false);
  const [showRedlines, setShowRedlines] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'ux' | 'tfks' | 'tokens' | 'api' | 'edges'>('ux');
  const [copiedApi, setCopiedApi] = useState<boolean>(false);
  const [showTfksDrawer, setShowTfksDrawer] = useState<boolean>(false);
  const [tfksSearch, setTfksSearch] = useState<string>('');

  const customerScreens = CUSTOMER_WIREFRAME_SCREENS;
  const courierScreens = COURIER_WIREFRAME_SCREENS;
  const businessScreens = BUSINESS_WIREFRAME_SCREENS;
  const adminScreens = ADMIN_WIREFRAME_SCREENS;

  const currentScreens =
    selectedCategory === 'customer'
      ? customerScreens
      : selectedCategory === 'courier'
      ? courierScreens
      : selectedCategory === 'business'
      ? businessScreens
      : adminScreens;

  const currentScreen = currentScreens[activeScreenIndex] || currentScreens[0];

  const handleNext = () => {
    if (activeScreenIndex < currentScreens.length - 1) {
      setActiveScreenIndex(activeScreenIndex + 1);
    } else {
      setActiveScreenIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeScreenIndex > 0) {
      setActiveScreenIndex(activeScreenIndex - 1);
    } else {
      setActiveScreenIndex(currentScreens.length - 1);
    }
  };

  const handleCopyApi = () => {
    navigator.clipboard.writeText(currentScreen.apiPayload);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. CLEAN DESIGN SYSTEM HEADER - Luxury Monochrome */}
      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-1 font-mono">
            <span>Mobil & Web Arayüz Şemaları</span>
            <span>·</span>
            <span>{ALL_WIREFRAME_SCREENS.length} Tasarım Şablonu (15+15+6+6)</span>
            <span>·</span>
            <span>22 Uçtan Uca Akış</span>
            <span>·</span>
            <span>71 Doğrulama Kontrolü</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Ekran Tasarımları & 42 Hi-Fi Arayüz Mimarisi
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl mt-0.5">
            Müşteri (15), Kurye (15), İşletme SaaS (6) ve Yönetici (6) ekranlarının interaktif wireframe şemalarını, 22 uçtan uca akışı ve 71 kontrol matrisini inceleyin.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black border border-zinc-800 rounded-2xl text-xs font-semibold shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setViewMode('blueprint')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              viewMode === 'blueprint'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Detaylı Görünüm</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              viewMode === 'matrix'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Tüm Ekranlar ({ALL_WIREFRAME_SCREENS.length})</span>
          </button>
          <button
            onClick={() => setViewMode('flows22')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              viewMode === 'flows22'
                ? 'bg-[#0071E3] text-white shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>22 Uçtan Uca Akış</span>
          </button>
          <button
            onClick={() => setViewMode('checks71')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              viewMode === 'checks71'
                ? 'bg-[#30D158] text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>71 Kontrol Matrisi</span>
          </button>
          <button
            onClick={() => setViewMode('decisions6')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              viewMode === 'decisions6'
                ? 'bg-[#FF9F0A] text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>6 Karar Kaydı</span>
          </button>
          <button
            onClick={() => setViewMode('tokens')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              viewMode === 'tokens'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Renk & Tipografi</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR PLATFORM SELECTOR TABS - Monochrome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setSelectedCategory('customer');
            setActiveScreenIndex(0);
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            selectedCategory === 'customer'
              ? 'bg-zinc-900 border-white text-white shadow-xl ring-1 ring-white/20'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-colors ${
              selectedCategory === 'customer' ? 'bg-white text-black' : 'bg-zinc-900 text-white border border-zinc-800'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Müşteri Uygulaması</h3>
              <p className="text-xs text-zinc-400">iOS & Android · {customerScreens.length} Hi-Fi Ekran (C-01..C-15)</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${selectedCategory === 'customer' ? 'text-white' : 'text-zinc-500'}`} />
        </button>

        <button
          onClick={() => {
            setSelectedCategory('courier');
            setActiveScreenIndex(0);
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            selectedCategory === 'courier'
              ? 'bg-zinc-900 border-white text-white shadow-xl ring-1 ring-white/20'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-colors ${
              selectedCategory === 'courier' ? 'bg-white text-black' : 'bg-zinc-900 text-white border border-zinc-800'
            }`}>
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Kurye Kokpit Terminali</h3>
              <p className="text-xs text-zinc-400">iOS & Android · {courierScreens.length} Hi-Fi Ekran (K-01..K-15)</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${selectedCategory === 'courier' ? 'text-white' : 'text-zinc-500'}`} />
        </button>

        <button
          onClick={() => {
            setSelectedCategory('business');
            setActiveScreenIndex(0);
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            selectedCategory === 'business'
              ? 'bg-zinc-900 border-white text-white shadow-xl ring-1 ring-white/20'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-colors ${
              selectedCategory === 'business' ? 'bg-white text-black' : 'bg-zinc-900 text-white border border-zinc-800'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">İşletme SaaS Portalı</h3>
              <p className="text-xs text-zinc-400">Web & Tablet · {businessScreens.length} Hi-Fi Ekran (B-01..B-06)</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${selectedCategory === 'business' ? 'text-white' : 'text-zinc-500'}`} />
        </button>

        <button
          onClick={() => {
            setSelectedCategory('admin');
            setActiveScreenIndex(0);
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
            selectedCategory === 'admin'
              ? 'bg-zinc-900 border-white text-white shadow-xl ring-1 ring-white/20'
              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-colors ${
              selectedCategory === 'admin' ? 'bg-white text-black' : 'bg-zinc-900 text-white border border-zinc-800'
            }`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Web Yönetici Paneli</h3>
              <p className="text-xs text-zinc-400">Web · {adminScreens.length} Hi-Fi Ekran (Y-01..Y-06)</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${selectedCategory === 'admin' ? 'text-white' : 'text-zinc-500'}`} />
        </button>
      </div>

      {/* 3. VIEW MODE: BLUEPRINT (FIGMA DEV MODE) */}
      {viewMode === 'blueprint' && (
        <div className="space-y-6">
          {/* Screen Steps Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            {currentScreens.map((screen, idx) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreenIndex(idx)}
                className={`px-4 py-2.5 rounded-xl whitespace-nowrap font-mono font-bold transition-all flex items-center gap-2 border ${
                  activeScreenIndex === idx
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                <span>{screen.id}</span>
                <span className="font-sans font-normal text-zinc-300">{screen.title.split('&')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Active Screen Figma Studio Viewport */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Device Mockup with Architectural Overlays */}
            <div className="lg:col-span-5 space-y-3">
              {/* Inspection Bar Overlays */}
              <div className="flex items-center justify-between px-2 text-xs bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRedlines(!showRedlines)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                      showRedlines ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Redlines ({showRedlines ? 'Açık' : 'Kapalı'})</span>
                  </button>

                  <button
                    onClick={() => setShowGridOverlay(!showGridOverlay)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                      showGridOverlay ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>8pt Izgara ({showGridOverlay ? 'Açık' : 'Kapalı'})</span>
                  </button>
                </div>

                <span className="text-[10px] text-zinc-400 font-mono font-bold">
                  {currentScreen.stepNumber}
                </span>
              </div>

              {/* iPhone 16 Pro Device Frame */}
              <div className="w-full max-w-[360px] mx-auto h-[640px] rounded-[48px] bg-black p-2.5 shadow-2xl border-4 border-zinc-800 relative overflow-hidden flex flex-col">
                {/* Dynamic Island */}
                <div className="w-24 h-6 bg-black rounded-full mx-auto my-1 border border-zinc-850 shrink-0 flex items-center justify-between px-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="text-[8px] font-mono text-zinc-400 font-bold">5G</span>
                </div>

                {/* Viewport with Optional 8pt Grid Overlay and Redlines */}
                <div className="flex-1 w-full rounded-[34px] overflow-hidden bg-zinc-950 relative">
                  {currentScreen.screenVisual}

                  {/* 8pt Grid Overlay */}
                  {showGridOverlay && (
                    <div
                      className="absolute inset-0 pointer-events-none z-30 opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                      }}
                    />
                  )}

                  {/* Architectural Redline Specs */}
                  {showRedlines && (
                    <div className="absolute inset-0 pointer-events-none z-40">
                      {/* Top spacing tag */}
                      <div className="absolute top-2 left-2 bg-white text-black font-mono text-[9px] px-1.5 py-0.5 rounded shadow font-bold">
                        pad: 16px
                      </div>
                      {/* Touch target height tag */}
                      <div className="absolute bottom-4 right-2 bg-white text-black font-mono text-[9px] px-1.5 py-0.5 rounded shadow font-bold">
                        H: 56px (44pt AAA)
                      </div>
                      {/* Left border line */}
                      <div className="absolute left-4 inset-y-0 w-px border-l border-dashed border-zinc-500" />
                      <div className="absolute right-4 inset-y-0 w-px border-r border-dashed border-zinc-500" />
                    </div>
                  )}
                </div>

                {/* Bottom Home Indicator */}
                <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1.5 shrink-0" />
              </div>

              {/* Prev / Next Screen Controls */}
              <div className="flex justify-between items-center max-w-[360px] mx-auto pt-1">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Önceki Ekran</span>
                </button>
                <span className="text-xs text-zinc-500 font-mono font-bold">
                  {activeScreenIndex + 1} / {currentScreens.length}
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>Sonraki Ekran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Comprehensive Figma Dev Mode Inspector */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-white font-mono text-xs font-bold">
                    {currentScreen.id} · {currentScreen.stepNumber}
                  </span>
                  <span className="text-xs font-mono text-white font-bold bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-700">
                    APPROVED SPEC ✓
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                  {currentScreen.title}
                </h2>
                <p className="text-sm text-zinc-300 font-medium">
                  {currentScreen.subtitle}
                </p>
              </div>

              {/* Inspector Tab Bar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2 text-xs font-semibold">
                <button
                  onClick={() => setActiveInspectorTab('ux')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeInspectorTab === 'ux' ? 'bg-white text-black shadow-sm font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  UX & Kullanıcı Akışı
                </button>
                <button
                  onClick={() => setActiveInspectorTab('tokens')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeInspectorTab === 'tokens' ? 'bg-white text-black shadow-sm font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Tasarım Tokenleri
                </button>
                <button
                  onClick={() => setActiveInspectorTab('tfks')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeInspectorTab === 'tfks'
                      ? 'bg-white text-black shadow-sm font-bold'
                      : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sistem Standartları</span>
                </button>
                <button
                  onClick={() => setActiveInspectorTab('api')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeInspectorTab === 'api' ? 'bg-white text-black shadow-sm font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Spring Boot 3.4 OpenAPI 3.1
                </button>
                <button
                  onClick={() => setActiveInspectorTab('edges')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeInspectorTab === 'edges' ? 'bg-white text-black shadow-sm font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Edge Cases
                </button>
              </div>

              {/* TAB 0: TFKS MASTER SPEC (4-LÜ SİSTEM STANDARDI) */}
              {activeInspectorTab === 'tfks' && (() => {
                const spec = currentScreen.tfksMasterSpec || getScreenTfksSpec(currentScreen.id, currentScreen.title, selectedCategory);
                return (
                  <div className="space-y-6 animate-in fade-in duration-200 text-xs">
                    {/* 4-LÜ ANA TALİMAT BLOKLARI */}
                    <div className="p-4 bg-black border border-zinc-800 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                        <span className="font-mono text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>BAŞLIK ALTI ZORUNLU 4'LÜ TALİMAT PROTOKOLÜ</span>
                        </span>
                        <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                          UYGULANABİLİR DİSİPLİN ✓
                        </span>
                      </div>

                      {/* 1. BU BÖLÜMÜN AMACI */}
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-zinc-300 uppercase block text-[11px]">
                          1. BU BÖLÜMÜN AMACI (Bu bölüm ne işe yarar?):
                        </span>
                        <p className="text-zinc-200 leading-relaxed pl-2 border-l-2 border-zinc-600">
                          {spec.purpose}
                        </p>
                      </div>

                      {/* 2. NE YAPACAK */}
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-zinc-300 uppercase block text-[11px]">
                          2. NE YAPACAK (Yapay zekâ ve sistem bu bölümde hangi işi yapacak?):
                        </span>
                        <p className="text-zinc-200 leading-relaxed pl-2 border-l-2 border-zinc-600">
                          {spec.whatItDoes}
                        </p>
                      </div>

                      {/* 3. NASIL YAPACAK */}
                      <div className="space-y-1.5">
                        <span className="font-mono font-bold text-zinc-300 uppercase block text-[11px]">
                          3. NASIL YAPACAK (Hangi sırayla, hangi mantıkla, hangi kontrolle yapacak?):
                        </span>
                        <div className="space-y-1 pl-2 border-l-2 border-zinc-600">
                          {spec.howItDoes.map((step, idx) => (
                            <div key={idx} className="text-zinc-200">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. ÇIKTI NE OLACAK */}
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-zinc-300 uppercase block text-[11px]">
                          4. ÇIKTI NE OLACAK (Bu bölümün sonunda kullanıcıya ne üretilecek?):
                        </span>
                        <p className="text-zinc-100 font-semibold leading-relaxed pl-2 border-l-2 border-white">
                          {spec.output}
                        </p>
                      </div>
                    </div>

                    {/* ZAYIF CÜMLE VS. GÜÇLÜ CÜMLE STANDARDI */}
                    <div className="space-y-2">
                      <span className="font-mono font-bold text-slate-300 uppercase block text-[11px]">
                        ZAYIF CÜMLE VS. GÜÇLÜ CÜMLE DÖNÜŞÜMÜ (KURAL 004 & 082)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-black border border-zinc-800 rounded-xl space-y-1.5">
                          <span className="font-mono font-bold text-zinc-400 text-[10px] uppercase block">
                            ✗ ZAYIF İFADE (YASAK):
                          </span>
                          <p className="text-zinc-400 italic">"{spec.weakVsStrong.weak}"</p>
                          <span className="text-[10px] text-zinc-500 block pt-1 border-t border-zinc-850">
                            Neden Zayıf: {spec.weakVsStrong.weakReason}
                          </span>
                        </div>

                        <div className="p-3.5 bg-zinc-900 border border-zinc-700 rounded-xl space-y-1.5">
                          <span className="font-mono font-bold text-white text-[10px] uppercase block">
                            ✓ GÜÇLÜ TALİMAT (ZORUNLU STANDART):
                          </span>
                          <p className="text-white font-medium">"{spec.weakVsStrong.strong}"</p>
                          <span className="text-[10px] text-zinc-400 block pt-1 border-t border-zinc-800">
                            Kapatılan Açık: Sorumlu, veri, süre, yetki ve audit kaydı kilitlendi.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BUTON TALİMATLARI */}
                    <div className="space-y-2">
                      <span className="font-mono font-bold text-zinc-300 uppercase block text-[11px]">
                        BUTON VE EYLEM TALİMATLARI (İŞ KURALI & BLOKAJ)
                      </span>
                      <div className="space-y-3">
                        {spec.buttonDirectives.map((btn, i) => (
                          <div key={i} className="p-3.5 bg-black rounded-xl border border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{btn.name}</span>
                              <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                                Rol: {btn.role}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400">
                              <div><strong>Ön Koşul:</strong> {btn.precondition}</div>
                              <div><strong>Eylem:</strong> {btn.action}</div>
                              <div><strong>Validasyon:</strong> {btn.validation}</div>
                              <div><strong>Hata Durumu:</strong> <span className="text-zinc-300 font-mono">{btn.errorMessage}</span></div>
                            </div>
                            <div className="text-[11px] text-zinc-300 pt-1 border-t border-zinc-850">
                              <strong>Başarılı Sonuç & Audit:</strong> {btn.successResult} · <span className="font-mono text-zinc-400">{btn.auditLog}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VERİ & VALİDASYON FRENLERİ */}
                    <div className="space-y-2">
                      <span className="font-mono font-bold text-slate-300 uppercase block text-[11px]">
                        VERİ VE VALİDASYON KURALLARI (SİSTEM FRENLERİ)
                      </span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[9px]">
                            <tr>
                              <th className="p-2">Veri Alanı</th>
                              <th className="p-2">Veri Tipi</th>
                              <th className="p-2">Validasyon Kuralı</th>
                              <th className="p-2">Doğrulanmazsa Oluşacak Risk</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {spec.dataAndValidation.map((dv, i) => (
                              <tr key={i} className="hover:bg-zinc-900/50">
                                <td className="p-2 font-mono text-white font-bold">{dv.field}</td>
                                <td className="p-2 font-mono text-zinc-400">{dv.type}</td>
                                <td className="p-2 text-zinc-300">{dv.rule}</td>
                                <td className="p-2 text-zinc-400">{dv.riskIfNotValidated}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* TEST VE KABUL KRİTERLERİ */}
                    <div className="p-4 bg-zinc-950 border border-zinc-700 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>TEST SENARYOSU & KABUL KRİTERİ (KURAL 079 & 080)</span>
                      </div>
                      <div className="space-y-1 text-zinc-300 text-[11px]">
                        <div><strong>Test Adı:</strong> {spec.testAndAcceptance.testName}</div>
                        <div><strong>Verilen Durum:</strong> {spec.testAndAcceptance.givenCondition}</div>
                        <div><strong>Yapılan İşlem:</strong> {spec.testAndAcceptance.whenAction}</div>
                        <div><strong>Beklenen Sonuç:</strong> {spec.testAndAcceptance.thenExpected}</div>
                        <div className="pt-2 text-white font-semibold border-t border-zinc-800">
                          <strong>Kabul Kriteri:</strong> {spec.testAndAcceptance.acceptanceCriteria}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 1: UX & Architecture */}
              {activeInspectorTab === 'ux' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
                      <span className="text-zinc-200 font-bold uppercase font-mono block">Kullanıcı Amacı (User Goal)</span>
                      <p className="text-zinc-400 leading-relaxed">{currentScreen.userGoal}</p>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
                      <span className="text-zinc-200 font-bold uppercase font-mono block">Tetikleyici (Trigger & Action)</span>
                      <p className="text-zinc-400 leading-relaxed">{currentScreen.triggerAction}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono block">
                      Kritik UX / UI Tasarım Kararları
                    </span>
                    <div className="space-y-2 text-xs">
                      {currentScreen.uxHighlights.map((hl, i) => (
                        <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start gap-2.5 text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 border border-zinc-700 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Güvenlik ve Sunucu Kuralı (Server Authority)</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed pt-1">{currentScreen.securityRule}</p>
                  </div>
                </div>
              )}

              {/* TAB 2: Design Tokens */}
              {activeInspectorTab === 'tokens' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-xs">
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                    <span className="font-mono text-zinc-300 font-bold uppercase block">FIGMA TOKENS & SPECS</span>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1.5 border-b border-zinc-850">
                        <span className="text-zinc-400">Typography Scale:</span>
                        <span className="font-mono font-bold text-white">{currentScreen.designTokens.typography}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-zinc-850">
                        <span className="text-zinc-400">Min Touch Target:</span>
                        <span className="font-mono font-bold text-white">{currentScreen.designTokens.touchTarget}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-zinc-850">
                        <span className="text-zinc-400">Elevation & Shadow:</span>
                        <span className="font-mono text-zinc-300">{currentScreen.designTokens.elevation}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-zinc-400">Color Palette Hex:</span>
                        <div className="flex items-center gap-1.5">
                          {currentScreen.designTokens.colors.map((c) => (
                            <div key={c} className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                              <span className="font-mono text-[10px] text-zinc-300">{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Rust API Schemas */}
              {activeInspectorTab === 'api' && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-zinc-200 font-bold flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-zinc-400" />
                      <span>{currentScreen.apiEndpoint}</span>
                    </span>
                    <button
                      onClick={handleCopyApi}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-mono text-[10px] rounded-lg flex items-center gap-1 border border-zinc-700"
                    >
                      {copiedApi ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedApi ? 'Kopyalandı' : 'JSON Kopyala'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-[11px] text-zinc-200 overflow-x-auto leading-relaxed">
                    {currentScreen.apiPayload}
                  </pre>
                </div>
              )}

              {/* TAB 4: Edge Cases */}
              {activeInspectorTab === 'edges' && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <span className="font-bold text-zinc-200 font-mono uppercase block">
                    KENAR DURUMLAR VE HATA YÖNETİMİ
                  </span>
                  <div className="space-y-2">
                    {currentScreen.edgeCases.map((ec, i) => (
                      <div key={i} className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start gap-2.5 text-zinc-300">
                        <AlertTriangle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{ec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW MODE: PANORAMIC FIGMA / MIRO MATRIX (ALL 25 SCREENS) - Monochrome */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span>
              Panoramik Tasarım Tahtası: <strong>{currentScreens.length} Ekran</strong> sırayla akış oklarıyla listelenmiştir. Detaylı Dev Mode incelemesi için herhangi bir ekrana tıklayınız.
            </span>
            <span className="font-mono text-white font-bold">FIGMA CANVAS 100%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentScreens.map((screen, idx) => (
              <div
                key={screen.id}
                onClick={() => {
                  setActiveScreenIndex(idx);
                  setViewMode('blueprint');
                }}
                className="bg-zinc-950 border border-zinc-800 hover:border-white rounded-3xl p-4 shadow-xl space-y-3 cursor-pointer group transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-white">{screen.id}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{screen.stepNumber}</span>
                </div>

                <div className="w-full h-72 rounded-2xl bg-black border border-zinc-850 overflow-hidden relative group-hover:ring-1 group-hover:ring-white">
                  <div className="scale-[0.55] origin-top-left w-[181%] h-[181%] pointer-events-none">
                    {screen.screenVisual}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs truncate group-hover:text-zinc-300 transition-colors">
                    {screen.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {screen.subtitle}
                  </p>
                </div>

                <div className="text-[10px] text-white font-bold flex items-center gap-1 pt-2 border-t border-zinc-850">
                  <span>Figma Dev Mode'da İncele</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. VIEW MODE: 22 UÇTAN UCA EKRAN AKIŞI (AKIS-01 .. AKIS-22) */}
      {viewMode === 'flows22' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/20 text-[#0A84FF] border border-[#0071E3]/30 font-mono text-[10px] font-bold">
                GAP-07 · 22 UÇTAN UCA EKRAN AKIŞI SPESİFİKASYONU
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                22 Uçtan Uca Operasyonel Ekran Akışı (AKIS-01 — AKIS-22)
              </h2>
              <p className="text-xs text-zinc-400">
                Her akışın aktörü, giriş noktası, başarılı akışı, hata/blokaj yolu, API/Veritabanı etkisi ve denetim izi kaydı.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 font-mono text-xs text-white font-bold self-start sm:self-auto">
              22 / 22 Akış Tamamlandı
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {END_TO_END_22_FLOWS.map((flow) => (
              <div
                key={flow.id}
                className="p-4 bg-black border border-zinc-800 rounded-2xl space-y-2.5 text-xs hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#0071E3]/20 text-[#0A84FF] border border-[#0071E3]/30 font-mono text-[11px] font-bold">
                    {flow.id}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    Aktör: {flow.actor}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{flow.title}</h3>
                <div className="space-y-1.5 text-[11px] pt-1 border-t border-zinc-900">
                  <div>
                    <span className="text-zinc-500 font-mono">Giriş: </span>
                    <span className="text-zinc-300">{flow.entryPoint}</span>
                  </div>
                  <div>
                    <span className="text-[#30D158] font-mono font-bold">Başarılı Akış: </span>
                    <span className="text-zinc-300">{flow.happyPath}</span>
                  </div>
                  <div>
                    <span className="text-[#FF9F0A] font-mono font-bold">Hata / Blokaj: </span>
                    <span className="text-zinc-300">{flow.errorPath}</span>
                  </div>
                  <div>
                    <span className="text-[#0A84FF] font-mono">API & DB: </span>
                    <span className="text-zinc-400 font-mono text-[10px]">{flow.apiAndDbImpact}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Audit Log: </span>
                    <span className="text-zinc-300 font-mono text-[10px]">{flow.auditEvent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. VIEW MODE: 71 MİMARİ, GÜVENLİK VE TEST KONTROL MATRİSİ (CHK-01 .. CHK-71) */}
      {viewMode === 'checks71' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 font-mono text-[10px] font-bold">
                GAP-02 & GAP-07 · 71 KONTROL DOĞRULAMA MATRİSİ
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                71 Mimari, Güvenlik, Finansal ve Test Kontrolü (CHK-01 — CHK-71)
              </h2>
              <p className="text-xs text-zinc-400">
                Her bir kontrol maddesinin kural iddiası, doğrulama yöntemi ve canlı sistem uyumluluk durumu.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'Mimari & Veri', 'Finansal & 0% Komisyon', 'Güvenlik & RBAC', 'Saha & Kapasite', 'PWA & Mağaza'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCheckCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                      checkCategoryFilter === cat
                        ? 'bg-[#30D158] text-black border-[#30D158]'
                        : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? `Tümü (${VERIFICATION_71_CHECKS.length})` : cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-3">Kod</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Kontrol Başlığı & Kural İddiası</th>
                  <th className="p-3">Doğrulama Yeri</th>
                  <th className="p-3 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {VERIFICATION_71_CHECKS.filter(
                  (c) => checkCategoryFilter === 'ALL' || c.category === checkCategoryFilter
                ).map((chk) => (
                  <tr key={chk.id} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-mono font-bold text-white whitespace-nowrap">{chk.id}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                        {chk.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <strong className="text-white block">{chk.title}</strong>
                      <span className="text-[11px] text-zinc-400">{chk.ruleAssertion}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#0A84FF]">{chk.verificationMethod}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] font-mono text-[10px] font-bold">
                        ✓ {chk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. VIEW MODE: 6 RESMİ KARAR_GEREKİYOR MATRİSİ (KR-01 .. KR-06) */}
      {viewMode === 'decisions6' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="border-b border-zinc-800 pb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30 font-mono text-[10px] font-bold">
              RESMİ KARAR KAYITLARI (KARAR_GEREKİYOR)
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Onaysız Varsayımlardan Arındırılmış 6 Ticari & Hukuki Karar Noktası (KR-01 — KR-06)
            </h2>
            <p className="text-xs text-zinc-400">
              Kaynaklarda kesinleşmemiş ticari veya regülatif konular uydurulmamış, M0 güvenli varsayılanlarıyla izole edilmiştir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DECISION_REQUIRED_6_ITEMS.map((kr) => (
              <div key={kr.code} className="p-4 bg-black border border-zinc-800 rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30 font-mono font-bold text-[11px]">
                    {kr.code} · KARAR_GEREKİYOR
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{kr.impactedModules}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{kr.title}</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{kr.conflictingSources}</p>
                <div className="space-y-1 pt-1">
                  {kr.options.map((opt, i) => (
                    <div key={i} className="p-2 rounded-lg bg-zinc-900/70 border border-zinc-800 text-[11px] text-zinc-300">
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-[#30D158]/10 border border-[#30D158]/30 text-[11px] text-[#30D158] font-semibold">
                  Aktif Güvenli M0 Kuralı: {kr.activeSafeDefault}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. VIEW MODE: DESIGN SYSTEM & TOKENS LIBRARY - Monochrome */}
      {viewMode === 'tokens' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs shadow-2xl">
          <div className="space-y-1 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-black font-display text-white">Blesyum Design System Tokens (v3.2)</h2>
            <p className="text-slate-400">iOS 18 Human Interface Guidelines & Material Design 3 Tabanlı Tasarım Standartları</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <span className="font-bold text-zinc-300 uppercase font-mono block">1. Renk Hiyerarşisi</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-lg bg-white border border-zinc-700" /><span>#FFFFFF - Primary White Focus</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-lg bg-zinc-200 border border-zinc-700" /><span>#E4E4E7 - High Surface Accent</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-lg bg-zinc-800 border border-zinc-700" /><span>#27272A - Subtle Borders & Badges</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-lg bg-zinc-900 border border-zinc-700" /><span>#18181B - Elevated Dark Cards</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-lg bg-black border border-zinc-800" /><span>#000000 - Pure OLED Luxury Canvas</span></div>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <span className="font-bold text-zinc-300 uppercase font-mono block">2. Tipografi Skalası</span>
              <div className="space-y-2 font-mono">
                <div>Display H1: <strong>32px Black (SF Pro)</strong></div>
                <div>Title H2: <strong>24px Bold (Inter)</strong></div>
                <div>Subtitle: <strong>16px SemiBold</strong></div>
                <div>Body Text: <strong>13px Regular (1.5 line-height)</strong></div>
                <div>Caption/Meta: <strong>10px Bold Uppercase</strong></div>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
              <span className="font-bold text-zinc-300 uppercase font-mono block">3. Ergonomi & Dokunma</span>
              <div className="space-y-2">
                <div>Min Buton Yüksekliği: <strong>56px (44pt AAA)</strong></div>
                <div>Sürücü Eldiven Tuşları: <strong>64pt Numerik Pad</strong></div>
                <div>Köşe Yuvarlama: <strong>rounded-3xl (24px)</strong></div>
                <div>Haptic Geri Bildirim: <strong>UIImpactFeedbackGenerator</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TFKS 18 OPERASYON SINIFI & 90 KURAL ŞARTNAME DRAWER MODAL */}
      {showTfksDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] flex flex-col space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                    TFKS MASTER ŞARTNAME
                  </span>
                  <h3 className="text-xl font-black font-display text-white">
                    TFKS 18 Operasyon Sınıfı & 90 Kural Denetim Kılavuzu
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Kural 001 - Kural 090: Sorumlu roller, blokaj frenleri, denetim izi ve kabul testleri.
                </p>
              </div>

              <button
                onClick={() => setShowTfksDrawer(false)}
                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-900 border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={tfksSearch}
                onChange={(e) => setTfksSearch(e.target.value)}
                placeholder="Operasyon sınıfı, rol veya kural ara (Örn: Zimmet, Kasa, Ceza, Servis)..."
                className="w-full pl-9 pr-4 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Classes List */}
            <div className="overflow-y-auto space-y-4 pr-1">
              {TFKS_OPERATIONAL_CLASSES.filter(
                (c) =>
                  c.name.toLowerCase().includes(tfksSearch.toLowerCase()) ||
                  c.description.toLowerCase().includes(tfksSearch.toLowerCase()) ||
                  c.responsibleRole.toLowerCase().includes(tfksSearch.toLowerCase()) ||
                  c.code.toLowerCase().includes(tfksSearch.toLowerCase())
              ).map((cls) => (
                <div key={cls.code} className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 text-[10px]">
                        {cls.code}
                      </span>
                      <strong className="text-white text-sm">{cls.name}</strong>
                    </div>
                    <span className="text-[11px] text-zinc-300 font-mono">
                      Sorumlu: {cls.responsibleRole}
                    </span>
                  </div>

                  <p className="text-zinc-300">{cls.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-zinc-850">
                    <div className="p-2 rounded bg-zinc-900/60 text-zinc-300 border border-zinc-850">
                      <span className="font-bold text-zinc-400 block mb-0.5 font-mono text-[9px] uppercase">TEMEL KURAL:</span>
                      {cls.coreRule}
                    </div>
                    <div className="p-2 rounded bg-zinc-900/90 text-zinc-200 border border-zinc-750">
                      <span className="font-bold text-white block mb-0.5 font-mono text-[9px] uppercase">BLOKAJ TETİKLEYİCİSİ:</span>
                      {cls.blockageTrigger}
                    </div>
                    <div className="p-2 rounded bg-zinc-900/60 text-zinc-200 border border-zinc-850">
                      <span className="font-bold text-zinc-300 block mb-0.5 font-mono text-[9px] uppercase">TEST SENARYOSU:</span>
                      {cls.testScenario}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">TFKS Constitution Rev.2026.1</span>
              <button
                onClick={() => setShowTfksDrawer(false)}
                className="px-5 py-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl active:scale-95 transition-all shadow"
              >
                Kılavuzu Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
