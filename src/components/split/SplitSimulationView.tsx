import React, { useState } from 'react';
import { CustomerApp } from '../customer/CustomerApp';
import { CourierApp } from '../courier/CourierApp';
import { AdminDashboard } from '../admin/AdminDashboard';
import { usePlatform } from '../../context/PlatformContext';
import { ISTANBUL_LOCATIONS } from '../../data/platformData';
import {
  Smartphone,
  Bike,
  LayoutDashboard,
  RotateCcw,
  Play,
  Handshake,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SplitSimulationView: React.FC = () => {
  const { currentRide, requestRide, cancelRide, completeTrip, dismissCompletedRide } = usePlatform();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isRideActive = !!currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';

  const handleQuickMotoScenario = () => {
    requestRide({
      serviceType: 'motosiklet',
      pickup: ISTANBUL_LOCATIONS[0], // Beşiktaş
      dropoff: ISTANBUL_LOCATIONS[2], // Levent
    });
  };

  const handleQuickCourierScenario = () => {
    requestRide({
      serviceType: 'kurye',
      pickup: ISTANBUL_LOCATIONS[1], // Kadıköy
      dropoff: ISTANBUL_LOCATIONS[7], // Moda
      packageNote: 'Mühürlü Hukuk Dosyası ve Tapu Senetleri (Acil)',
      recipientContact: {
        name: 'Av. Kemal Erdem',
        phone: '+90 542 998 10 20',
      },
    });
  };

  const handleQuickShopScenario = () => {
    requestRide({
      serviceType: 'al_getir',
      pickup: ISTANBUL_LOCATIONS[3], // Nişantaşı
      dropoff: ISTANBUL_LOCATIONS[0], // Beşiktaş
      purchaseItemList: 'Reçeteli Ağrı Kesici ve 2 Adet Vitamin C',
      estimatedItemCost: 180,
    });
  };

  const handleQuickBargainScenario = () => {
    requestRide({
      serviceType: 'motosiklet',
      pickup: ISTANBUL_LOCATIONS[0], // Beşiktaş
      dropoff: ISTANBUL_LOCATIONS[2], // Levent
      bargainOfferedFare: 175,
      bargainReason: 'Maksat sünnet olsun, düz hesap 175 ₺ yapalım ustam 🤝',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Apple Glass Control Bar */}
      <div className="p-5 sm:p-6 bg-[#16161A]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse shadow-[0_0_8px_#30D158]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0A84FF]">
              Canlı Eşzamanlı Simülasyon
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F7] tracking-tight">
            Müşteri Çağırır · Kurye Kabul Eder · Haritada Canlı Eşleşir
          </h1>
          <p className="text-xs text-[#8E8E93] max-w-2xl leading-relaxed">
            Sol ekranda talep oluşturulduğunda sağdaki kurye terminali anında çalar ve çağrıyı teslim alır.
          </p>
        </div>

        {/* Apple HIG Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleQuickMotoScenario}
            disabled={isRideActive}
            className="px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-30 disabled:hover:bg-[#0071E3] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_rgba(0,113,227,0.35)] active:scale-95 transition-all"
          >
            <Bike className="w-3.5 h-3.5" />
            <span>1. Beni Götür (Yolcu)</span>
          </button>

          <button
            onClick={handleQuickCourierScenario}
            disabled={isRideActive}
            className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] disabled:opacity-30 text-[#F5F5F7] text-xs font-semibold flex items-center gap-1.5 border border-white/[0.08] active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#F5F5F7]" />
            <span>2. Paketimi Götür</span>
          </button>

          <button
            onClick={handleQuickShopScenario}
            disabled={isRideActive}
            className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] disabled:opacity-30 text-[#F5F5F7] text-xs font-semibold flex items-center gap-1.5 border border-white/[0.08] active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span>3. Alıp Getir</span>
          </button>

          <button
            onClick={handleQuickBargainScenario}
            disabled={isRideActive}
            className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] disabled:opacity-30 text-[#F5F5F7] text-xs font-semibold flex items-center gap-1.5 border border-white/[0.08] active:scale-95 transition-all"
          >
            <Handshake className="w-3.5 h-3.5 text-[#FF9F0A]" />
            <span>Fiyat Teklifi Testi</span>
          </button>

          {isRideActive && (
            <button
              onClick={() => {
                completeTrip();
              }}
              className="px-4 py-2 rounded-full bg-[#30D158] hover:bg-[#34C759] text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_2px_12px_rgba(48,209,88,0.3)] active:scale-95 transition-all animate-bounce"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Yolculuğu Bitir</span>
            </button>
          )}

          {currentRide && (
            <button
              onClick={() => {
                dismissCompletedRide();
                cancelRide();
              }}
              className="px-3.5 py-2 rounded-full bg-[#FF453A]/10 hover:bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/20 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>
      </div>

      {/* 2 iPhones Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
        {/* Left: Customer App */}
        <div className="w-full max-w-[420px] space-y-2.5">
          <div className="flex items-center justify-between px-3 text-xs">
            <span className="font-semibold text-[#F5F5F7] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#0071E3]/20 text-[#0A84FF] flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5" />
              </span>
              <span>Müşteri Mobil Uygulaması</span>
            </span>
            <span className="text-[#8E8E93] text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.06]">
              iPhone 16 Pro · iOS 18
            </span>
          </div>

          <CustomerApp isEmbedded={true} />
        </div>

        {/* Right: Courier App */}
        <div className="w-full max-w-[420px] space-y-2.5">
          <div className="flex items-center justify-between px-3 text-xs">
            <span className="font-semibold text-[#F5F5F7] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#30D158]/20 text-[#30D158] flex items-center justify-center">
                <Bike className="w-3.5 h-3.5" />
              </span>
              <span>Kurye Terminali</span>
            </span>
            <span className="text-[#8E8E93] text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.06]">
              iPhone 16 Pro · Sürücü Kokpiti
            </span>
          </div>

          <CourierApp isEmbedded={true} />
        </div>
      </div>

      {/* Apple Glass Admin Console */}
      <div className="pt-4 border-t border-white/[0.06]">
        <div className="p-4 sm:p-5 bg-[#16161A]/70 backdrop-blur-xl border border-white/[0.08] rounded-[24px] flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/[0.08] text-[#0A84FF] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F7]">Operasyon & Komuta Merkezi</h3>
              <p className="text-xs text-[#8E8E93]">Canlı filo radarı, kasa mutabakatı ve operasyon kayıtları</p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F5F7] text-xs font-semibold rounded-full border border-white/[0.08] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>{showAdminPanel ? 'Paneli Gizle' : 'Paneli Göster'}</span>
            {showAdminPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAdminPanel && (
          <div className="mt-4 animate-in fade-in-50 duration-200">
            <AdminDashboard />
          </div>
        )}
      </div>
    </div>
  );
};
