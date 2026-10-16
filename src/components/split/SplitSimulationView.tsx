import React from 'react';
import { CustomerApp } from '../customer/CustomerApp';
import { CourierApp } from '../courier/CourierApp';
import { usePlatform } from '../../context/PlatformContext';
import { ISTANBUL_LOCATIONS } from '../../data/platformData';
import {
  Smartphone,
  Bike,
  RotateCcw,
  Play,
  Handshake,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';

export const SplitSimulationView: React.FC = () => {
  const { currentRide, requestRide, cancelRide, completeTrip, dismissCompletedRide } = usePlatform();

  const isRideActive = !!currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';

  const handleQuickMotoScenario = () => {
    requestRide({
      serviceType: 'motosiklet',
      pickup: ISTANBUL_LOCATIONS[0],
      dropoff: ISTANBUL_LOCATIONS[2],
    });
  };

  const handleQuickCourierScenario = () => {
    requestRide({
      serviceType: 'kurye',
      pickup: ISTANBUL_LOCATIONS[1],
      dropoff: ISTANBUL_LOCATIONS[7],
      packageNote: 'Evrak Paketi',
      recipientContact: {
        name: 'Kemal Erdem',
        phone: '+90 542 998 10 20',
      },
    });
  };

  const handleQuickShopScenario = () => {
    requestRide({
      serviceType: 'al_getir',
      pickup: ISTANBUL_LOCATIONS[3],
      dropoff: ISTANBUL_LOCATIONS[0],
      purchaseItemList: 'Market Siparişi',
      estimatedItemCost: 180,
    });
  };

  const handleQuickBargainScenario = () => {
    requestRide({
      serviceType: 'motosiklet',
      pickup: ISTANBUL_LOCATIONS[0],
      dropoff: ISTANBUL_LOCATIONS[2],
      bargainOfferedFare: 175,
      bargainReason: '175 ₺ fiyat teklifi',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hızlı Test Çubuğu */}
      <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)]">
            Canlı Eşleşme Testi (Müşteri &amp; Kurye)
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Soldan çağrı başlatın, sağdaki kurye ekranından kabul edip süreci yönetin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleQuickMotoScenario}
            disabled={isRideActive}
            className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Yolcu Çağrısı</span>
          </button>

          <button
            onClick={handleQuickCourierScenario}
            disabled={isRideActive}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:opacity-90 disabled:opacity-40 text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 border border-[var(--border-subtle)] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Paket Gönder</span>
          </button>

          <button
            onClick={handleQuickShopScenario}
            disabled={isRideActive}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:opacity-90 disabled:opacity-40 text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 border border-[var(--border-subtle)] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Al-Getir</span>
          </button>

          <button
            onClick={handleQuickBargainScenario}
            disabled={isRideActive}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:opacity-90 disabled:opacity-40 text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 border border-[var(--border-subtle)] cursor-pointer"
          >
            <Handshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Teklifli Çağrı</span>
          </button>

          {isRideActive && (
            <button
              onClick={() => completeTrip()}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tamamla</span>
            </button>
          )}

          {currentRide && (
            <button
              onClick={() => {
                dismissCompletedRide();
                cancelRide();
              }}
              className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>
      </div>

      {/* Yan Yana Müşteri ve Kurye Ekranları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
        <div className="w-full max-w-[420px] space-y-2">
          <div className="flex items-center gap-2 px-2 text-xs font-bold text-[var(--text-primary)]">
            <Smartphone className="w-4 h-4 text-[#2563EB]" />
            <span>Müşteri Ekranı</span>
          </div>
          <CustomerApp isEmbedded={true} />
        </div>

        <div className="w-full max-w-[420px] space-y-2">
          <div className="flex items-center gap-2 px-2 text-xs font-bold text-[var(--text-primary)]">
            <Bike className="w-4 h-4 text-emerald-500" />
            <span>Kurye Ekranı</span>
          </div>
          <CourierApp isEmbedded={true} />
        </div>
      </div>
    </div>
  );
};

