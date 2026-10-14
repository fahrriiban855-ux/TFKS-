import React, { useState } from 'react';
import {
  Bike,
  User,
  ShieldCheck,
  Columns,
  Radio,
  Building2,
  Type,
  Check,
  Volume2,
  Eye,
  RotateCcw,
  Sun,
  Moon,
  Bell,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Lock,
  History,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PlatformView } from '../../types/platform';
import { PWAInstallAndStoreControls } from './PWAAndStoreCenter';

type DynamicTypePresetOption = 'small' | 'standard' | 'large' | 'accessibility1' | 'accessibility2';

const PRESET_OPTIONS: {
  id: DynamicTypePresetOption;
  label: string;
  scaleLabel: string;
  description: string;
}[] = [
  {
    id: 'small',
    label: 'Kompakt',
    scaleLabel: '%90',
    description: 'Yüksek veri yoğunluğu, geniş tablolar için ideal',
  },
  {
    id: 'standard',
    label: 'Standart (Apple HIG)',
    scaleLabel: '%100',
    description: '17pt gövde referanslı dengeli okuma ölçeği',
  },
  {
    id: 'large',
    label: 'Konforlu / Büyük',
    scaleLabel: '%110',
    description: 'Ferah satır aralığı ve büyütülmüş metin hiyerarşisi',
  },
  {
    id: 'accessibility1',
    label: 'Erişilebilirlik L',
    scaleLabel: '%120',
    description: 'Sürüş esnasında veya uzaktan hızlı okuma modu',
  },
  {
    id: 'accessibility2',
    label: 'Erişilebilirlik XL',
    scaleLabel: '%130',
    description: 'WCAG AAA yüksek görünürlük ve maksimum punto',
  },
];

export const PlatformNavbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRide,
    couriers,
    dynamicTypeScale,
    dynamicTypePreset,
    setDynamicTypeScale,
    setDynamicTypePreset,
    helmetTtsActive,
    toggleHelmetTts,
    themeMode,
    toggleThemeMode,
    notificationHistory,
    clearNotificationHistory,
    verifyAuditChain,
    verifyLedgerBalance,
    snapshots,
    createSnapshot,
    syncWithServer,
    showNotification,
  } = usePlatform();

  const [showTypographyMenu, setShowTypographyMenu] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const onlineCouriers = couriers.filter((c) => c.isOnline).length;
  const auditStatus = verifyAuditChain();
  const ledgerStatus = verifyLedgerBalance();

  const navItems: {
    id: PlatformView;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'website',
      label: 'Web & Tanıtım',
      shortLabel: 'Web',
      icon: <Radio className="w-4 h-4" />,
    },
    {
      id: 'customer',
      label: 'Müşteri Uygulaması',
      shortLabel: 'Müşteri',
      icon: <User className="w-4 h-4" />,
      badge: currentRide ? 'Aktif' : undefined,
    },
    {
      id: 'business',
      label: 'İşletme Paneli',
      shortLabel: 'İşletme',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'courier',
      label: 'Sürücü / Kurye',
      shortLabel: 'Kurye',
      icon: <Bike className="w-4 h-4" />,
      badge: currentRide?.status === 'offered' ? 'Yeni Çağrı!' : undefined,
    },
    {
      id: 'split',
      label: 'Canlı Simülasyon',
      shortLabel: 'Simülasyon',
      icon: <Columns className="w-4 h-4" />,
    },
    {
      id: 'admin',
      label: 'Komuta Merkezi',
      shortLabel: 'Yönetim',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'wireframes',
      label: '42 Ekran Kataloğu',
      shortLabel: 'Katalog',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const handleServerSync = async () => {
    setIsSyncing(true);
    const res = await syncWithServer();
    setIsSyncing(false);
    showNotification({
      title: res.synced ? 'Hibrit Sunucu Senkronize Edildi' : 'Yerel Depolama & Outbox Koruması Aktif',
      message: res.synced
        ? `Express API (/api/state/sync) ve yerel depolama senkronize edildi. (${res.outboxFlushed} kuyruk işlemi aktarıldı).`
        : 'İş/finans yazma uçları güvenli sunucu doğrulaması yapılandırılana kadar kapalıdır (503). Verileriniz yerel depolama (localStorage) ve Outbox kuyruğunda korundu.',
      type: res.synced ? 'success' : 'info',
    });
  };

  const handleQuickSnapshot = () => {
    createSnapshot(`Hızlı Anlık Görüntü (${new Date().toLocaleTimeString('tr-TR')})`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-canvas)]/90 backdrop-blur-2xl border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-[1640px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* BÖLGE 1 (SOL): Tek Satır Marka Başlığı */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('website')}
            className="flex items-center gap-2.5 text-left group focus:outline-none min-h-[44px] whitespace-nowrap shrink-0"
            aria-label="MotoPilot Ana Sayfasına Dön"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_2px_12px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <span className="font-bold text-base tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0">
              Moto<span className="text-[#2563EB]">Pilot</span>
            </span>
          </button>
        </div>

        {/* BÖLGE 2 (ORTA): 6 Görünüm Segmented Control (Min 44x44px Dokunma Alanı) */}
        <nav
          role="tablist"
          aria-label="Platform Görünüm Seçici"
          className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-subtle)] overflow-x-auto max-w-full shadow-inner"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-1.5 px-3 min-h-[40px] rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_2px_10px_rgba(37,99,235,0.35)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/60'
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.shortLabel}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-md ${
                      isActive ? 'bg-white text-[#2563EB]' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BÖLGE 3 (SAĞ): 1-Tıkla Tema (Obsidian / Daylight), Time-Travel Snapshot, Bildirim Çekmecesi & AA Erişilebilirlik */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          {/* Firebase Bulut Giriş + PWA Yükleme & App Store / Play Store Yayın Merkezi */}
          <PWAInstallAndStoreControls onNotify={showNotification} />

          {/* Canlı Kurye Göstergesi (Sade Metin, Dekoratif Nokta Yok) */}
          <div
            className="hidden 2xl:flex items-center gap-1.5 px-3 min-h-[40px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs whitespace-nowrap shrink-0"
            title="Çevrimiçi Kurye ve Sunucu Senkronizasyonu"
          >
            <span className="text-[var(--text-secondary)]">Aktif:</span>
            <span className="text-[var(--text-primary)] font-semibold tabular-nums">{onlineCouriers} Kurye</span>
          </div>

          {/* Hızlı Time-Travel Snapshot Butonu */}
          <button
            type="button"
            onClick={handleQuickSnapshot}
            aria-label="Sistem Anlık Görüntüsü (Snapshot) Al"
            title={`Time-Travel Snapshot Al (${snapshots.length} kayıtlı)`}
            className="hidden md:flex items-center gap-1.5 px-2.5 min-h-[44px] min-w-[44px] justify-center rounded-xl border bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-xs font-semibold transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-[#2563EB]" />
            <span className="hidden xl:inline tabular-nums">{snapshots.length}</span>
          </button>

          {/* Hibrit Sunucu Senkronizasyon Butonu */}
          <button
            type="button"
            onClick={handleServerSync}
            aria-label="Hibrit Express Sunucusu İle Senkronize Et"
            title="Express Backend & Outbox Senkronizasyonu"
            className="hidden md:flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>

          {/* 1-Tıkla Tema Seçici: Mod 1 (Obsidian Koyu) <-> Mod 3 (Daylight Açık) */}
          <button
            type="button"
            onClick={toggleThemeMode}
            aria-label={themeMode === 'dark' ? 'Kurumsal SaaS Açık Temaya (Daylight) Geç' : 'Apple HIG Koyu Temaya (Obsidian) Geç'}
            title={themeMode === 'dark' ? 'Mod 1: Obsidian Koyu (Açık Temaya Geçmek İçin Tıklayın)' : 'Mod 3: Daylight Açık (Koyu Temaya Geçmek İçin Tıklayın)'}
            className="flex items-center gap-1.5 px-3 min-h-[44px] min-w-[44px] justify-center rounded-xl border bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] text-xs font-semibold transition-all cursor-pointer"
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden xl:inline">Daylight</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#1D4ED8]" />
                <span className="hidden xl:inline">Obsidian</span>
              </>
            )}
          </button>

          {/* Bildirim Geçmişi Çekmecesi (Notification History Drawer) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotificationDrawer((prev) => !prev);
                setShowTypographyMenu(false);
              }}
              aria-label="Bildirim Geçmişini Aç"
              aria-expanded={showNotificationDrawer}
              title="Bildirim Geçmişi (Maks 5 Kuyruk + Tam Arşiv)"
              className={`relative flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border transition-all cursor-pointer ${
                showNotificationDrawer
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notificationHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-[#2563EB] text-white border border-[var(--bg-canvas)] tabular-nums">
                  {notificationHistory.length}
                </span>
              )}
            </button>

            {showNotificationDrawer && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotificationDrawer(false)}
                />
                <div
                  role="dialog"
                  aria-label="Bildirim Geçmişi"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-4 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#2563EB]" />
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] text-sm">Bildirim &amp; Uyarı Arşivi</h4>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          FIFO Rate-Limit: Maks 5 aktif kuyruk (B2 Bellek Korumalı)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {notificationHistory.length > 0 && (
                        <button
                          type="button"
                          onClick={clearNotificationHistory}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Geçmişi Temizle"
                          aria-label="Bildirim geçmişini temizle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowNotificationDrawer(false)}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        aria-label="Kapat"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)] my-2">
                    {notificationHistory.length === 0 ? (
                      <div className="py-8 text-center text-[var(--text-secondary)]">
                        Henüz kaydedilmiş bir bildirim bulunmuyor.
                      </div>
                    ) : (
                      notificationHistory.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {item.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                            {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                            {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {item.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-primary)] truncate">
                                {item.title}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--text-secondary)] shrink-0">
                                {item.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] leading-snug mt-0.5">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Apple HIG Dynamic Type & Accessibility Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTypographyMenu((prev) => !prev);
                setShowNotificationDrawer(false);
              }}
              aria-label="Tipografi ve Erişilebilirlik Ayarları"
              aria-expanded={showTypographyMenu}
              className={`flex items-center gap-1.5 px-3 min-h-[44px] min-w-[44px] justify-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showTypographyMenu || dynamicTypeScale !== 1
                  ? 'bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/40'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]'
              }`}
              title="Apple HIG Tipografi & Erişilebilirlik Ayarları"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-[11px]">
                %{Math.round(dynamicTypeScale * 100)}
              </span>
            </button>

            {showTypographyMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTypographyMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-4 z-50 text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB]">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] text-sm">
                          Görünüm &amp; Tipografi
                        </h4>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          6 Tipografik Ölçek &bull; WCAG 2.2 AA Kontrast
                        </p>
                      </div>
                    </div>
                    {dynamicTypeScale !== 1 && (
                      <button
                        type="button"
                        onClick={() => setDynamicTypePreset('standard')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] hover:opacity-90 text-[var(--text-primary)] text-[11px] font-medium transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Sıfırla
                      </button>
                    )}
                  </div>

                  {/* Continuous Aa Scale Slider */}
                  <div className="bg-[var(--bg-elevated)]/60 rounded-xl p-3 border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                      <span>Metin Boyutu Ölçeği</span>
                      <span className="font-mono font-bold text-[#2563EB]">
                        %{Math.round(dynamicTypeScale * 100)} ({Math.round(16 * dynamicTypeScale)}px baz)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[var(--text-secondary)]">Aa</span>
                      <input
                        type="range"
                        min={0.9}
                        max={1.25}
                        step={0.01}
                        value={dynamicTypeScale}
                        onChange={(e) => setDynamicTypeScale(parseFloat(e.target.value))}
                        aria-label="Metin Boyutu Ölçeği Kaydırıcısı"
                        className="flex-1 accent-[#2563EB] cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <span className="text-base font-extrabold text-[var(--text-primary)]">Aa</span>
                    </div>
                  </div>

                  {/* Preset Options */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] px-1">
                      Hazır Okuma Profilleri
                    </label>
                    <div className="space-y-1">
                      {PRESET_OPTIONS.map((opt) => {
                        const isSelected = dynamicTypePreset === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setDynamicTypePreset(opt.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#2563EB]/15 border-[#2563EB]/50 text-[var(--text-primary)]'
                                : 'bg-[var(--bg-elevated)]/40 border-transparent hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                            }`}
                          >
                            <div className="pr-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-[var(--text-primary)]">
                                  {opt.label}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[11px] font-mono text-[#2563EB]">
                                  {opt.scaleLabel}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                                {opt.description}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kask İçi Sesli Okuma (TTS) Kısayolu */}
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          helmetTtsActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] text-xs">
                          Kask İçi Sesli Okuma (TTS)
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)]">
                          Sürüşte ekrana bakmadan bildirim dinleme
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={toggleHelmetTts}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        helmetTtsActive
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {helmetTtsActive ? 'Açık' : 'Kapalı'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
