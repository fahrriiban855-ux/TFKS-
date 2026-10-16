import React, { useState } from 'react';
import {
  Bike,
  User,
  ShieldCheck,
  Columns,
  Radio,
  Building2,
  Sun,
  Moon,
  Bell,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PlatformView } from '../../types/platform';

export const PlatformNavbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRide,
    couriers,
    themeMode,
    toggleThemeMode,
    notificationHistory,
    clearNotificationHistory,
  } = usePlatform();

  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const onlineCouriers = couriers.filter((c) => c.isOnline).length;

  const navItems: {
    id: PlatformView;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'website',
      label: 'Ana Sayfa',
      shortLabel: 'Ana Sayfa',
      icon: <Radio className="w-3.5 h-3.5" />,
    },
    {
      id: 'customer',
      label: 'Müşteri',
      shortLabel: 'Müşteri',
      icon: <User className="w-3.5 h-3.5" />,
      badge: currentRide ? 'Aktif' : undefined,
    },
    {
      id: 'business',
      label: 'İşletme',
      shortLabel: 'İşletme',
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'courier',
      label: 'Kurye',
      shortLabel: 'Kurye',
      icon: <Bike className="w-3.5 h-3.5" />,
      badge: currentRide?.status === 'offered' ? 'Çağrı' : undefined,
    },
    {
      id: 'split',
      label: 'Canlı Test',
      shortLabel: 'Test',
      icon: <Columns className="w-3.5 h-3.5" />,
    },
    {
      id: 'admin',
      label: 'Yönetim',
      shortLabel: 'Yönetim',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-canvas)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Sol: Marka */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('website')}
            className="flex items-center gap-2 text-left group focus:outline-none whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="MotoPilot Ana Sayfa"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <Bike className="w-4 h-4 stroke-[2.3]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
              MotoPilot
            </span>
          </button>
        </div>

        {/* Orta: Sekmeler */}
        <nav
          role="tablist"
          aria-label="Ekran Seçici"
          className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)] overflow-x-auto max-w-full"
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
                className={`relative flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] font-mono font-bold uppercase ${
                      isActive ? 'text-white' : 'text-amber-400'
                    }`}
                  >
                    · {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sağ: Durum, Tema ve Bildirimler */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 h-8 text-xs whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[var(--text-primary)] font-semibold font-mono tabular-nums">
              {onlineCouriers} Kurye Aktif
            </span>
          </div>

          <button
            type="button"
            onClick={toggleThemeMode}
            aria-label={themeMode === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            title={themeMode === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#2563EB]" />
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationDrawer((prev) => !prev)}
              aria-label="Bildirimler"
              aria-expanded={showNotificationDrawer}
              title="Bildirimler"
              className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer ${
                showNotificationDrawer
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notificationHistory.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold bg-[#2563EB] text-white flex items-center justify-center tabular-nums">
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
                  aria-label="Bildirimler"
                  className="absolute right-0 mt-2 w-80 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-3.5 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                    <span className="font-bold text-[var(--text-primary)]">Bildirimler</span>
                    <div className="flex items-center gap-1">
                      {notificationHistory.length > 0 && (
                        <button
                          type="button"
                          onClick={clearNotificationHistory}
                          className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-red-400 transition-colors cursor-pointer"
                          title="Temizle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowNotificationDrawer(false)}
                        className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                        aria-label="Kapat"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)] mt-1">
                    {notificationHistory.length === 0 ? (
                      <div className="py-6 text-center text-[var(--text-secondary)]">
                        Bildirim yok.
                      </div>
                    ) : (
                      notificationHistory.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-start gap-2">
                          <div className="mt-0.5 shrink-0">
                            {item.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                            {item.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                            {item.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {item.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-[var(--text-primary)] truncate">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-secondary)] shrink-0">
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
        </div>
      </div>
    </header>
  );
};

