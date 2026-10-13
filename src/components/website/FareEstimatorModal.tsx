import React, { useState, useId } from 'react';
import { X, Navigation, Clock, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';
import { ISTANBUL_LOCATIONS } from '../../data/platformData';
import { LocationPoint } from '../../types/platform';
import { usePlatform } from '../../context/PlatformContext';

interface FareEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (pickupName: string, dropoffName: string) => void;
}

export const FareEstimatorModal: React.FC<FareEstimatorModalProps> = ({
  isOpen,
  onClose,
  onBookNow,
}) => {
  const { setActiveView } = usePlatform();
  const [pickupIndex, setPickupIndex] = useState<number>(0); // Beşiktaş
  const [dropoffIndex, setDropoffIndex] = useState<number>(1); // Kadıköy
  const [isRushHour, setIsRushHour] = useState<boolean>(true);
  const pickupId = useId();
  const dropoffId = useId();

  if (!isOpen) return null;

  const pickup = ISTANBUL_LOCATIONS[pickupIndex] || ISTANBUL_LOCATIONS[0];
  const dropoff = ISTANBUL_LOCATIONS[dropoffIndex] || ISTANBUL_LOCATIONS[1];

  // Calculate distance approx
  const distKm = Math.max(
    2.5,
    parseFloat((Math.hypot(pickup.lat - dropoff.lat, pickup.lng - dropoff.lng) * 111).toFixed(1))
  );

  // Time & Fare calculations
  // Motorcycle filters through traffic: avg speed 32 km/h rush hour vs car taxi 11 km/h
  const motoMinutes = Math.round((distKm / 32) * 60) + 4;
  const carMinutes = Math.round((distKm / (isRushHour ? 11 : 22)) * 60) + 8;
  const timeSavedMinutes = Math.max(8, carMinutes - motoMinutes);

  // Fare: Moto açılış 45 TL + km başı 18 TL. Car taxi: açılış 60 TL + km başı 28 TL + trafik bekleme
  const motoFare = Math.round(45 + distKm * 18);
  const carTaxiFare = Math.round(60 + distKm * 28 + (isRushHour ? 55 : 15));
  const moneySaved = Math.max(25, carTaxiFare - motoFare);

  const handleStartBooking = () => {
    onClose();
    if (onBookNow) {
      onBookNow(pickup.name, dropoff.name);
    } else {
      setActiveView('customer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#161618] border border-white/[0.12] rounded-[32px] w-full max-w-lg p-6 sm:p-7 shadow-2xl relative text-[#F5F5F7] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0A84FF]" />
              <h3 className="text-base font-bold tracking-tight text-white">
                Şeffaf Ücret ve Süre Simülatörü
              </h3>
            </div>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              İstanbul trafiğinde motosiklet vs. standart sarı taksi karşılaştırması
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Route Selectors */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={pickupId} className="block text-[11px] font-semibold text-[#8E8E93] mb-1.5">
                BAŞLANGIÇ NOKTASI (ALIŞ)
              </label>
              <select
                id={pickupId}
                value={pickupIndex}
                onChange={(e) => setPickupIndex(Number(e.target.value))}
                className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] transition-colors"
              >
                {ISTANBUL_LOCATIONS.map((loc, idx) => (
                  <option key={loc.name} value={idx}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={dropoffId} className="block text-[11px] font-semibold text-[#8E8E93] mb-1.5">
                VARIŞ NOKTASI (İNİŞ)
              </label>
              <select
                id={dropoffId}
                value={dropoffIndex}
                onChange={(e) => setDropoffIndex(Number(e.target.value))}
                className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] transition-colors"
              >
                {ISTANBUL_LOCATIONS.map((loc, idx) => (
                  <option key={loc.name} value={idx}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rush Hour Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-xs">
            <span className="text-[#8E8E93]">Trafik Durumu Simülasyonu</span>
            <button
              type="button"
              onClick={() => setIsRushHour(!isRushHour)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isRushHour
                  ? 'bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/40'
                  : 'bg-white/[0.08] text-[#8E8E93]'
              }`}
            >
              {isRushHour ? 'Yoğun Zirve Trafiği (17:00-20:00)' : 'Akıcı Trafik'}
            </button>
          </div>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* MotoPilot Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0A84FF]/20 to-[#0071E3]/10 border border-[#0A84FF]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A84FF]">
                MotoPilot TAG
              </span>
              <span className="text-[10px] font-mono text-[#30D158] font-semibold">Trafikten Muaf</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{motoFare} ₺</div>
            <div className="flex items-center gap-1.5 text-xs text-white font-medium">
              <Clock className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span>Yaklaşık {motoMinutes} Dk</span>
            </div>
            <p className="text-[10px] text-[#8E8E93] leading-snug">
              2. Kask & Bone temin edilir, mesafe bazlı net tarife.
            </p>
          </div>

          {/* Standard Taxi Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">
                Standart Taksi
              </span>
              <span className="text-[10px] font-mono text-[#FF453A]">Sıkışık Trafik</span>
            </div>
            <div className="text-2xl font-bold text-[#8E8E93] font-mono line-through">
              {carTaxiFare} ₺
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8E8E93]">
              <Clock className="w-3.5 h-3.5" />
              <span>Yaklaşık {carMinutes} Dk</span>
            </div>
            <p className="text-[10px] text-[#8E8E93] leading-snug">
              Köprü ve boğaz trafiğinde bekleme sayacı işler.
            </p>
          </div>
        </div>

        {/* Advantage Banner */}
        <div className="p-3 bg-[#30D158]/10 border border-[#30D158]/25 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#30D158] font-bold">
            <Zap className="w-4 h-4 shrink-0" />
            <span>Kazanım: {timeSavedMinutes} Dakika Daha Hızlı</span>
          </div>
          <span className="text-xs font-mono font-bold text-white">
            {moneySaved} ₺ Tasarruf
          </span>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={handleStartBooking}
            className="w-full py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl shadow-[0_4px_20px_rgba(0,113,227,0.4)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Bu Güzergahta Hemen Çağır</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
