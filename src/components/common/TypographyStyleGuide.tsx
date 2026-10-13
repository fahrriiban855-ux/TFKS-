import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Type,
  CheckCircle2,
  Sliders,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Monitor,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Maximize2,
  X,
  CreditCard,
  Layers,
} from 'lucide-react';

interface TypographyStyleGuideProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const TypographyStyleGuide: React.FC<TypographyStyleGuideProps> = ({ isModal, onClose }) => {
  const {
    dynamicTypeScale,
    setDynamicTypeScale,
    dynamicTypePreset,
    setDynamicTypePreset,
    themeMode,
    toggleThemeMode,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'matrix' | 'screens' | 'accessibility' | 'turkish_test'>('matrix');
  const [viewportMode, setViewportMode] = useState<'phone' | 'tablet' | 'desktop'>('desktop');

  // Apple HIG Typography Standard Scale Definitions
  const typographySpecs = [
    {
      style: 'Large Title',
      className: 'apple-large-title',
      font: 'SF Pro Display',
      sizePt: 34,
      lineHeightPx: 41,
      weight: 'Bold (700)',
      tracking: '-0.022em',
      contrast: '15.8:1 (AAA)',
      role: 'Sayfa giriş ve modal ana başlıkları',
      sample: 'MotoPilot Mobilite',
    },
    {
      style: 'Title 1',
      className: 'apple-title-1',
      font: 'SF Pro Display',
      sizePt: 28,
      lineHeightPx: 34,
      weight: 'Semibold (600)',
      tracking: '-0.021em',
      contrast: '15.8:1 (AAA)',
      role: 'Bölüm ana başlıkları ve ekran adları',
      sample: 'İstanbul Kurye Filosu',
    },
    {
      style: 'Title 2',
      className: 'apple-title-2',
      font: 'SF Pro Display',
      sizePt: 22,
      lineHeightPx: 28,
      weight: 'Semibold (600)',
      tracking: '-0.018em',
      contrast: '15.8:1 (AAA)',
      role: 'Alt bölüm ve modül başlıkları',
      sample: 'Canlı Yolculuk Özeti',
    },
    {
      style: 'Title 3',
      className: 'apple-title-3',
      font: 'SF Pro Display',
      sizePt: 20,
      lineHeightPx: 25,
      weight: 'Semibold (600)',
      tracking: '-0.017em',
      contrast: '15.8:1 (AAA)',
      role: 'Kart başlıkları ve panel adları',
      sample: 'Zimmetli Araç Durumu',
    },
    {
      style: 'Headline',
      className: 'apple-headline',
      font: 'SF Pro Text',
      sizePt: 17,
      lineHeightPx: 22,
      weight: 'Semibold (600)',
      tracking: '-0.015em',
      contrast: '15.8:1 (AAA)',
      role: 'Vurgulu liste ve satır başlıkları',
      sample: 'Kask ve Ekipman Onaylandı',
    },
    {
      style: 'Body (Varsayılan)',
      className: 'apple-body',
      font: 'SF Pro Text',
      sizePt: 17,
      lineHeightPx: 22,
      weight: 'Regular (400)',
      tracking: '-0.015em',
      contrast: '15.8:1 (AAA)',
      role: 'Ana metinler (17 pt varsayılan)',
      sample: 'Kurye Kadıköy rıhtımdan hareket etti; tahmini varış 14:35.',
    },
    {
      style: 'Callout',
      className: 'apple-callout',
      font: 'SF Pro Text',
      sizePt: 16,
      lineHeightPx: 21,
      weight: 'Regular (400)',
      tracking: '-0.013em',
      contrast: '15.8:1 (AAA)',
      role: 'Önemli bilgilendirme kutuları',
      sample: 'Yağışlı hava nedeniyle güvenli fren mesafesi uygulanmaktadır.',
    },
    {
      style: 'Subheadline',
      className: 'apple-subheadline',
      font: 'SF Pro Text',
      sizePt: 15,
      lineHeightPx: 20,
      weight: 'Regular / Medium (400/500)',
      tracking: '-0.011em',
      contrast: '12.4:1 (AAA)',
      role: 'İkincil satır açıklamaları ve adresler',
      sample: 'Şişli, Mecidiyeköy Mah. Büyükdere Cad. No:128/A',
    },
    {
      style: 'Footnote',
      className: 'apple-footnote',
      font: 'SF Pro Text',
      sizePt: 13,
      lineHeightPx: 18,
      weight: 'Regular (400)',
      tracking: '-0.006em',
      contrast: '7.2:1 (AA)',
      role: 'Dipnot, zaman damgası ve yasal bilgiler',
      sample: 'Son senkronizasyon: Bugün 14:32:05 (TFKS Güvenli Mühür)',
    },
    {
      style: 'Caption 1',
      className: 'apple-caption-1',
      font: 'SF Pro Text',
      sizePt: 12,
      lineHeightPx: 16,
      weight: 'Medium (500)',
      tracking: '0em',
      contrast: '7.2:1 (AA)',
      role: 'Rozetler, etiketler ve durum pencereleri',
      sample: 'AKTİF GÖREVDE',
    },
    {
      style: 'Caption 2',
      className: 'apple-caption-2',
      font: 'SF Pro Text',
      sizePt: 11,
      lineHeightPx: 13,
      weight: 'Medium (500)',
      tracking: '0.005em',
      contrast: '7.2:1 (AA)',
      role: 'Alt etiketler ve mikro sayaçlar',
      sample: 'TFKS ID #34-88',
    },
    {
      style: 'Buton Metni',
      className: 'apple-button-text',
      font: 'SF Pro Text',
      sizePt: 17,
      lineHeightPx: 22,
      weight: 'Semibold (600)',
      tracking: '-0.015em',
      contrast: '18.2:1 (AAA)',
      role: 'Eyleme çağrı ve form butonları',
      sample: 'Motosiklet Çağır (₺153,10)',
    },
    {
      style: 'Tabüler Rakamlar',
      className: 'apple-tabular text-sm font-semibold',
      font: 'SF Mono / Tabular Num',
      sizePt: 15,
      lineHeightPx: 20,
      weight: 'Semibold (600)',
      tracking: '-0.02em',
      contrast: '15.8:1 (AAA)',
      role: 'Fiyatlar, sayaçlar ve süreler',
      sample: '₺1.845,50 · 24.890 km · 14 dk',
    },
  ];

  return (
    <div
      className={`w-full bg-[#0A0A0C] border border-white/[0.08] rounded-[32px] overflow-hidden text-[#F5F5F7] shadow-2xl transition-all ${
        isModal ? 'max-h-[90vh] flex flex-col' : 'my-4'
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-7 border-b border-white/[0.08] bg-gradient-to-r from-black/80 via-[#1C1C1E]/60 to-black/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center text-white shadow-md">
              <Type className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Apple HIG Tipografi Sistemi</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0A84FF]/15 text-[#0A84FF] border border-[#0A84FF]/25">
                SF Pro Display & SF Pro Text
              </span>
            </div>
          </div>
          <p className="text-xs text-[#8E8E93]">
            17 pt standart gövde, Medium/Semibold başlık hiyerarşisi, Dynamic Type erişilebilirliği ve WCAG AAA/AA kontrast uyumu.
          </p>
        </div>

        {/* Global Controls: Dynamic Type Presets & Theme Switch */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dynamic Type Quick Controls */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <span className="text-[11px] font-semibold text-[#8E8E93]">aA</span>
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'small', label: '85%', scale: 0.85 },
                  { id: 'standard', label: '100% (17pt)', scale: 1.0 },
                  { id: 'large', label: '115%', scale: 1.15 },
                  { id: 'accessibility1', label: '130%', scale: 1.3 },
                  { id: 'accessibility2', label: '150%', scale: 1.5 },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setDynamicTypePreset(preset.id)}
                  className={`px-2 py-0.5 rounded-full text-[11px] transition-all font-medium ${
                    dynamicTypePreset === preset.id
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-[#8E8E93] hover:text-[#F5F5F7]'
                  }`}
                  title={`Yazı Ölçeği: ${preset.label}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode Switch */}
          <button
            onClick={toggleThemeMode}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              themeMode === 'light'
                ? 'bg-white text-black border-zinc-300 shadow-sm'
                : 'bg-white/[0.08] text-[#F5F5F7] border-white/[0.1] hover:bg-white/[0.12]'
            }`}
            title="Açık / Koyu Tema Kontrast Kontrolü"
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

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/[0.08] text-[#8E8E93] hover:text-white transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="px-5 sm:px-7 pt-4 pb-2 border-b border-white/[0.08] bg-[#0A0A0C]/50 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'matrix'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
            }`}
          >
            Tipografi Stil Tablosu
          </button>
          <button
            onClick={() => setActiveTab('screens')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'screens'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
            }`}
          >
            Uygulanmış Ekran Örnekleri
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'accessibility'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
            }`}
          >
            Erişilebilirlik & Kontrast (WCAG)
          </button>
          <button
            onClick={() => setActiveTab('turkish_test')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'turkish_test'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#8E8E93] hover:text-[#F5F5F7] hover:bg-white/[0.04]'
            }`}
          >
            Türkçe Karakter & Sayı Hizası
          </button>
        </div>

        {/* Viewport Width Preview Controls for Screens Tab */}
        {activeTab === 'screens' && (
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06]">
            <button
              onClick={() => setViewportMode('phone')}
              className={`p-1.5 rounded-full transition-all ${
                viewportMode === 'phone' ? 'bg-white text-black' : 'text-[#8E8E93] hover:text-white'
              }`}
              title="Küçük Ekran (iPhone 16 Pro 390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-full transition-all ${
                viewportMode === 'tablet' ? 'bg-white text-black' : 'text-[#8E8E93] hover:text-white'
              }`}
              title="Orta Ekran (iPad 768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-full transition-all ${
                viewportMode === 'desktop' ? 'bg-white text-black' : 'text-[#8E8E93] hover:text-white'
              }`}
              title="Geniş Ekran (Desktop 1200px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`p-5 sm:p-7 space-y-6 ${isModal ? 'overflow-y-auto flex-1' : ''}`}>
        {/* ======================================================== */}
        {/* TAB 1: TIPOGRAFI STIL TABLOSU (STYLE MATRIX) */}
        {/* ======================================================== */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#1C1C1E]/60 border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#0A84FF] tracking-wide uppercase">
                  Apple Human Interface Guidelines (HIG) Standartları
                </span>
                <p className="text-sm text-[#F5F5F7]">
                  Tüm başlıklar <strong>SF Pro Display</strong> (Medium / Semibold), tüm gövde ve etkileşim metinleri{' '}
                  <strong>SF Pro Text</strong> (Regular / 17 pt varsayılan) olarak ölçeklenir.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/25 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  WCAG AAA & AA Uyumlu
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#A1A1A6] border border-white/[0.08] font-mono">
                  Aktif Ölçek: {Math.round(dynamicTypeScale * 100)}%
                </span>
              </div>
            </div>

            {/* Spec Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#16161A]/80 shadow-inner">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.04] text-[#8E8E93]">
                    <th className="py-3.5 px-4 font-semibold">Stil Adı</th>
                    <th className="py-3.5 px-4 font-semibold">Yazı Ailesi</th>
                    <th className="py-3.5 px-4 font-semibold">Ölçü (pt/px)</th>
                    <th className="py-3.5 px-4 font-semibold">Satır Yüksekliği</th>
                    <th className="py-3.5 px-4 font-semibold">Ağırlık</th>
                    <th className="py-3.5 px-4 font-semibold">Aralık (Tracking)</th>
                    <th className="py-3.5 px-4 font-semibold">Kontrast</th>
                    <th className="py-3.5 px-4 font-semibold">Semantik Rol</th>
                    <th className="py-3.5 px-4 font-semibold">Canlı Örnek</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {typographySpecs.map((item, idx) => {
                    const scaledSize = Math.round(item.sizePt * dynamicTypeScale);
                    const scaledLineHeight = Math.round(item.lineHeightPx * dynamicTypeScale);
                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                          {item.style}
                        </td>
                        <td className="py-3 px-4 text-[#A1A1A6] font-mono whitespace-nowrap">
                          {item.font}
                        </td>
                        <td className="py-3 px-4 font-mono text-white whitespace-nowrap">
                          <span className="text-[#0A84FF] font-semibold">{scaledSize} pt</span>
                          {dynamicTypeScale !== 1 && (
                            <span className="text-[#8E8E93] text-[10px] ml-1">({item.sizePt} pt)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#A1A1A6] whitespace-nowrap">
                          {scaledLineHeight} px
                        </td>
                        <td className="py-3 px-4 text-[#A1A1A6] whitespace-nowrap">{item.weight}</td>
                        <td className="py-3 px-4 font-mono text-[#8E8E93] whitespace-nowrap">
                          {item.tracking}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.contrast.includes('AAA')
                                ? 'bg-[#30D158]/15 text-[#30D158]'
                                : 'bg-[#0A84FF]/15 text-[#0A84FF]'
                            }`}
                          >
                            {item.contrast}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#8E8E93] max-w-[200px] truncate" title={item.role}>
                          {item.role}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${item.className} text-[#F5F5F7] block truncate max-w-[280px]`}>
                            {item.sample}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Apple HIG Rules Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#1C1C1E]/50 border border-white/[0.06] space-y-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0A84FF]" />
                  17 pt Varsayılan Gövde Prensibi
                </span>
                <p className="text-[#8E8E93] leading-relaxed">
                  Apple HIG yönergeleri uyarınca tüm ana açıklamalar, yolcu ve adres detayları varsayılan olarak 17 pt (1.0625rem) üzerinden okunabilir satır yüksekliğiyle kurgulanmıştır.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1C1E]/50 border border-white/[0.06] space-y-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#30D158]" />
                  Dynamic Type & Esnek Genişleme
                </span>
                <p className="text-[#8E8E93] leading-relaxed">
                  Metin boyutu büyütüldüğünde butonlar ve kartlar sabit yüksekliklere hapsolmaz; otomatik dikey esneme ve satır kaydırma (flex-wrap / min-h) ile hiçbir içerik kesilmez.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1C1E]/50 border border-white/[0.06] space-y-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#FF9F0A]" />
                  Tabüler Rakam Hizalaması
                </span>
                <p className="text-[#8E8E93] leading-relaxed">
                  Fiyatlar, kilometre sayaçları ve işlem tutarlarında <code>font-variant-numeric: tabular-nums</code> kullanılarak basamakların alt alta milimetrik hizası garanti edilir.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: UYGULANMIŞ EKRAN ÖRNEKLERİ (APPLIED SCREENS) */}
        {/* ======================================================== */}
        {activeTab === 'screens' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#1C1C1E]/40 border border-white/[0.06] flex items-center justify-between text-xs text-[#8E8E93]">
              <span>
                Canlı senaryolar üzerinde 17 pt gövde, Semibold başlıklar ve tabüler rakamların uygulanışını inceleyin:
              </span>
              <span className="font-medium text-white">
                Görünüm: {viewportMode === 'phone' ? 'iPhone (390px)' : viewportMode === 'tablet' ? 'iPad (768px)' : 'Tam Ekran'}
              </span>
            </div>

            <div
              className={`mx-auto transition-all duration-300 space-y-6 ${
                viewportMode === 'phone'
                  ? 'max-w-[390px]'
                  : viewportMode === 'tablet'
                  ? 'max-w-[720px]'
                  : 'w-full'
              }`}
            >
              {/* Örnek 1: Müşteri Rezervasyon & Fiyat Kırılım Kartı */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] shadow-2xl space-y-4 dynamic-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="apple-caption-1 text-[#0A84FF] font-semibold uppercase tracking-wider">
                      Müşteri Deneyimi · VIP Motosiklet
                    </span>
                    <h3 className="apple-title-3 font-semibold text-white">
                      Yolculuk & Hizmet Özeti
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/25 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sabit Fiyat Garantisi
                  </span>
                </div>

                {/* Adresler (17pt gövde ve 15pt alt açıklama) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      A
                    </div>
                    <div className="space-y-0.5">
                      <span className="apple-body font-medium text-white block">
                        Kanyon AVM VIP Vale Girişi
                      </span>
                      <span className="apple-subheadline text-[#8E8E93] block">
                        Şişli, Esentepe Mah. Büyükdere Cad. No:185
                      </span>
                    </div>
                  </div>

                  <div className="border-l-2 border-dashed border-white/20 ml-3 h-4" />

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      B
                    </div>
                    <div className="space-y-0.5">
                      <span className="apple-body font-medium text-white block">
                        Kadıköy Rıhtım İskele Meydanı
                      </span>
                      <span className="apple-subheadline text-[#8E8E93] block">
                        Kadıköy, Caferağa Mah. Rıhtım Cad. No:24/B
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabüler Finansal Kırılım */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="apple-callout text-[#8E8E93]">Taban Açılış Ücreti</span>
                    <span className="apple-tabular text-white font-medium">₺45,00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="apple-callout text-[#8E8E93]">Mesafe Ücreti (8.6 km · ₺14/km)</span>
                    <span className="apple-tabular text-white font-medium">₺120,40</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="apple-callout text-[#8E8E93]">Platform Hizmet Bedeli (%10)</span>
                    <span className="apple-tabular text-white font-medium">₺16,54</span>
                  </div>
                  <div className="border-t border-white/[0.08] pt-2.5 flex items-center justify-between">
                    <span className="apple-headline font-semibold text-white">Toplam Ödenecek Tutar</span>
                    <span className="apple-tabular apple-title-3 font-bold text-[#30D158]">₺181,94</span>
                  </div>
                </div>

                {/* Buton - Apple Semibold Button Text - Min 48px Touch Target */}
                <button className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-white text-black font-semibold apple-button-text hover:bg-neutral-200 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                  <span>Yolculuğu Onayla & Motosiklet Çağır</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Örnek 2: Kurye Güvenlik & Zimmet Kartı */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] shadow-2xl space-y-4 dynamic-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="apple-caption-1 text-[#30D158] font-semibold uppercase tracking-wider">
                      Sürücü Güvenlik Protokolü · TFKS Masası
                    </span>
                    <h3 className="apple-title-3 font-semibold text-white">
                      Aktif Vardiya & Ekipman Kontrolü
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0A84FF]/15 text-[#0A84FF] border border-[#0A84FF]/25 text-xs font-semibold">
                    Vardiya #8812
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
                    <span className="apple-subheadline text-[#8E8E93] block">Zimmetli Araç Plakası</span>
                    <span className="apple-headline font-semibold text-white block">34 BLY 717</span>
                    <span className="apple-caption-1 text-[#30D158] block">Honda PCX 125 · Ruhsat Onaylı</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
                    <span className="apple-subheadline text-[#8E8E93] block">Sayaç Başlangıç Km</span>
                    <span className="apple-tabular apple-headline font-semibold text-white block">24.890 km</span>
                    <span className="apple-caption-1 text-[#8E8E93] block">Görsel Kontrol: Tamamlandı</span>
                  </div>
                </div>

                {/* Önemli Bilgileri Gizlemeyen Güvenlik Bildirimi */}
                <div className="p-4 rounded-2xl bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FF9F0A] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="apple-headline font-semibold text-[#FF9F0A] block">
                      Yolcu Yetkisi: 2. Kask ve Tutamak Zorunludur
                    </span>
                    <p className="apple-body text-white/90">
                      Motosiklet yolcu çağrılarını kabul edebilmek için sterilize edilmiş 2. kask ve yolcu tutamağının takılı olduğu fiziken onaylanmalıdır. Soluk veya küçük yazıya gizlenmez.
                    </p>
                  </div>
                </div>
              </div>

              {/* Örnek 3: Komuta Merkezi Finansal Tablo (Tabular Alignment) */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] shadow-2xl space-y-4 dynamic-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="apple-caption-1 text-[#BF5AF2] font-semibold uppercase tracking-wider">
                      Operasyon & Muhasebe Merkezi
                    </span>
                    <h3 className="apple-title-3 font-semibold text-white">
                      Finansal Mutabakat & Komisyon Tablosu
                    </h3>
                  </div>
                  <span className="apple-caption-1 px-3 py-1 rounded-full bg-white/[0.06] text-[#A1A1A6] font-mono">
                    font-variant-numeric: tabular-nums
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-black/40">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.03] text-[#8E8E93]">
                        <th className="py-3 px-4 font-semibold">İşlem Kodu</th>
                        <th className="py-3 px-4 font-semibold">Sürücü / Kurye</th>
                        <th className="py-3 px-4 font-semibold text-right">Mesafe</th>
                        <th className="py-3 px-4 font-semibold text-right">Süre</th>
                        <th className="py-3 px-4 font-semibold text-right">Komisyon (%10)</th>
                        <th className="py-3 px-4 font-semibold text-right">Kurye Payı</th>
                        <th className="py-3 px-4 font-semibold text-right">Toplam Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {[
                        {
                          code: 'TX-9841',
                          driver: 'Ahmet Yılmaz',
                          dist: '6,4 km',
                          time: '12 dk',
                          fee: '₺14,80',
                          net: '₺133,20',
                          total: '₺148,00',
                        },
                        {
                          code: 'TX-9842',
                          driver: 'Burak Demir',
                          dist: '14,2 km',
                          time: '28 dk',
                          fee: '₺29,50',
                          net: '₺265,50',
                          total: '₺295,00',
                        },
                        {
                          code: 'TX-9843',
                          driver: 'Caner Özkan',
                          dist: '3,1 km',
                          time: '08 dk',
                          fee: '₺09,20',
                          net: '₺082,80',
                          total: '₺092,00',
                        },
                        {
                          code: 'TX-9844',
                          driver: 'Deniz Aydın',
                          dist: '22,8 km',
                          time: '45 dk',
                          fee: '₺46,00',
                          net: '₺414,00',
                          total: '₺460,00',
                        },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-mono font-semibold text-[#0A84FF]">
                            {row.code}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-white">{row.driver}</td>
                          <td className="py-2.5 px-4 text-right apple-tabular text-[#8E8E93]">
                            {row.dist}
                          </td>
                          <td className="py-2.5 px-4 text-right apple-tabular text-[#8E8E93]">
                            {row.time}
                          </td>
                          <td className="py-2.5 px-4 text-right apple-tabular font-semibold text-[#FF9F0A]">
                            {row.fee}
                          </td>
                          <td className="py-2.5 px-4 text-right apple-tabular font-semibold text-[#30D158]">
                            {row.net}
                          </td>
                          <td className="py-2.5 px-4 text-right apple-tabular font-bold text-white">
                            {row.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ERİŞİLEBİLİRLİK & KONTRAST (WCAG) */}
        {/* ======================================================== */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#1C1C1E]/60 border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-[#30D158] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  WCAG 2.2 Seviye AAA / AA Kontrast Oranları
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                    <div>
                      <span className="font-semibold text-white block">Birincil Metin (Primary)</span>
                      <span className="text-[#8E8E93]">#F5F5F7 zemin #000000 üzerinde</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#30D158]/20 text-[#30D158] font-bold">
                      15.8:1 (AAA)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                    <div>
                      <span className="font-semibold text-white block">İkincil Metin (Secondary)</span>
                      <span className="text-[#8E8E93]">#A1A1A6 zemin #1C1C1E üzerinde</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#30D158]/20 text-[#30D158] font-bold">
                      7.2:1 (AAA)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                    <div>
                      <span className="font-semibold text-white block">Üçüncül Metin / Yardımcı</span>
                      <span className="text-[#8E8E93]">#8E8E93 zemin #000000 üzerinde</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] font-bold">
                      5.4:1 (AA)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                    <div>
                      <span className="font-semibold text-white block">Büyük Başlıklar (Title / Large)</span>
                      <span className="text-[#8E8E93]">Hedef: En az 3.0:1</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#30D158]/20 text-[#30D158] font-bold">
                      15.8:1 (Başarılı)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#1C1C1E]/60 border border-white/[0.06] space-y-3">
                <span className="text-xs font-semibold text-[#0A84FF] uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  Dynamic Type & Metin Büyütme Esnekliği
                </span>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  iOS Ayarlar &gt; Erişilebilirlik &gt; Metin Boyutu seçeneklerinde kullanıcı yazıyı büyüttüğünde arayüz bozulmaz. Aşağıdaki canlı test kutusunu inceleyin:
                </p>

                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 dynamic-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="apple-headline font-semibold text-white">
                      Dinamik Büyüyen Kart Örneği
                    </span>
                    <span className="apple-caption-1 px-2.5 py-0.5 rounded-full bg-[#30D158]/15 text-[#30D158]">
                      Auto-Wrap Aktif
                    </span>
                  </div>
                  <p className="apple-body text-[#A1A1A6]">
                    Bu kart içindeki metin %150 ölçeğe çıksa dahi sabit yükseklik kısıtlaması olmadan doğal olarak aşağı doğru genişler ve butonlar üst üste binmez.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button className="apple-button-text min-h-[48px] px-5 py-2.5 rounded-full bg-white text-black font-semibold flex items-center justify-center">
                      Onayla (₺148)
                    </button>
                    <button className="apple-button-text min-h-[48px] px-5 py-2.5 rounded-full bg-white/[0.08] text-white flex items-center justify-center">
                      Detayları Gör
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bilgiyi Yalnızca Renkle Ayırt Etmeme Kuralı */}
            <div className="p-5 rounded-2xl bg-[#1C1C1E]/60 border border-white/[0.06] space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0A84FF]" />
                Bilgiyi Yalnızca Renkle Ayırt Etmeme İlkesi (Color-Blindness & Semantic Signals)
              </span>
              <p className="text-xs text-[#8E8E93]">
                Apple HIG ve WCAG kuralları uyarınca hata, başarı ve uyarı durumları sadece yeşil/kırmızı rengine dayandırılmaz; her durumda açıklayıcı semantik metin ve ayırt edici ikon eşlik eder:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#30D158]/10 border border-[#30D158]/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#30D158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#30D158] block">Başarılı Durum</span>
                    <span className="text-white/80">İkon + "Onaylandı" metin rozeti</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF9F0A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#FF9F0A] block">Dikkat / İnceleme</span>
                    <span className="text-white/80">İkon + "2. Kask Eksik" net uyarısı</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[#FF453A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#FF453A] block">Kritik Hata / Engel</span>
                    <span className="text-white/80">İkon + "Kasa Açığı Blokajı" açıklaması</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TÜRKÇE KARAKTER & RAKAM HİZASI (TURKISH TEST) */}
        {/* ======================================================== */}
        {activeTab === 'turkish_test' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#1C1C1E]/50 border border-white/[0.06] space-y-1">
              <span className="text-xs font-semibold text-[#0A84FF] uppercase tracking-wider">
                Türkçe Tipografi & Glif Uyumluluğu
              </span>
              <p className="text-xs text-[#8E8E93]">
                SF Pro Display ve SF Pro Text sistem fontları; Türkçe noktalı ve yumuşak karakterleri (ğ, ü, ş, ı, ö, ç, İ, Ğ, Ü, Ş, Ö, Ç) kusursuz dikey hizalama ve doğru nokta yüksekliği ile işler.
              </p>
            </div>

            {/* Gerçek Türkçe İçerik Test Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/50 border border-white/[0.06] space-y-3">
                <span className="apple-headline font-semibold text-white block">
                  1. Uzun Adres & Türkçe Semt İsimleri Testi
                </span>
                <div className="p-3.5 rounded-xl bg-white/[0.03] space-y-1.5 text-xs">
                  <span className="apple-body font-medium text-white block">
                    Gümüşsuyu Mah., İnönü Cad., Taksim Gözlem Noktası No:42/C, Beyoğlu / İstanbul
                  </span>
                  <span className="apple-subheadline text-[#8E8E93] block">
                    Özel Not: Kapıcı dairesine bırakılmayacak; doğrudan şahsa teslim edilecek.
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-white/[0.06] space-y-3">
                <span className="apple-headline font-semibold text-white block">
                  2. Türkçe Hata & Sistem Mesajları Testi
                </span>
                <div className="p-3.5 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 space-y-1 text-xs">
                  <span className="font-semibold text-[#FF453A] block">
                    Bağlantı Zaman Aşımı ve Güvenlik Doğrulaması Hatası
                  </span>
                  <span className="text-white/80 block">
                    İnternet bağlantınız koptuğu için kurye çağrısı başlatılamadı. Lütfen hücresel verinizi kontrol edip tekrar deneyiniz.
                  </span>
                </div>
              </div>
            </div>

            {/* Rakamların Dikey Hizası Tablosu */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/[0.06] space-y-3">
              <span className="apple-headline font-semibold text-white block">
                3. Finansal ve Sayaç Tablolarında Rakam Hizası (Tabular Figures)
              </span>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] font-mono text-xs space-y-1">
                <div className="flex justify-between py-1 border-b border-white/[0.06] text-[#8E8E93]">
                  <span>AÇIKLAMA</span>
                  <span className="text-right">TUTAR (TL)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Motosiklet Taksi Taban Açılışı:</span>
                  <span className="apple-tabular font-semibold text-white">₺0.045,00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Köprü / Avrasya Geçiş Ücreti:</span>
                  <span className="apple-tabular font-semibold text-white">₺0.033,00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Mesafe Katkı Payı (12.4 km):</span>
                  <span className="apple-tabular font-semibold text-white">₺0.173,60</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Hafta Sonu Yoğunluk Çarpanı:</span>
                  <span className="apple-tabular font-semibold text-white">₺0.025,18</span>
                </div>
                <div className="flex justify-between py-1.5 border-t border-white/[0.12] text-sm font-bold text-[#30D158]">
                  <span>TOPLAM HESAPLANAN BEDEL:</span>
                  <span className="apple-tabular">₺0.276,78</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
