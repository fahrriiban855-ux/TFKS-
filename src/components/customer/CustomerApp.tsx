import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ServiceType, LocationPoint } from '../../types/platform';
import { ISTANBUL_LOCATIONS } from '../../data/platformData';
import { MapComponent } from '../common/MapComponent';
import {
  Car,
  Package,
  MapPin,
  ShieldCheck,
  Star,
  MessageCircle,
  ArrowRight,
  X,
  Wallet,
  Send,
  Ticket,
} from 'lucide-react';

interface CustomerAppProps {
  isEmbedded?: boolean;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ isEmbedded = false }) => {
  const {
    currentRide,
    couriers,
    requestRide,
    cancelRide,
    calculateFare,
    rateCompletedRide,
    dismissCompletedRide,
    allRides,
    chatMessages,
    sendChatMessage,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    customerWalletBalance,
    topUpCustomerWallet,
    activeCoupon,
    applyCouponCode,
    removeCouponCode,
    resolveLocationFromCoords,
    turkeyLocations,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'sefer' | 'kasa' | 'gecmis'>('sefer');
  const [serviceType, setServiceType] = useState<ServiceType>('motosiklet');
  const [pickup, setPickup] = useState<LocationPoint>(turkeyLocations[0] || ISTANBUL_LOCATIONS[0]);
  const [dropoff, setDropoff] = useState<LocationPoint>(turkeyLocations[1] || ISTANBUL_LOCATIONS[1]);
  const [mapSelectMode, setMapSelectMode] = useState<'pickup' | 'dropoff' | null>(null);

  const [recipientName, setRecipientName] = useState('Kemal Erdem');
  const [recipientPhone, setRecipientPhone] = useState('+90 542 998 10 20');
  const [packageNote, setPackageNote] = useState('Evrak paketi');

  const [couponInput, setCouponInput] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [rating, setRating] = useState(5);

  const fareEstimate = calculateFare(serviceType, pickup, dropoff, 0, 0);
  const isRideActive = !!currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';
  const isRideCompleted = currentRide?.status === 'completed';

  const assignedCourier = currentRide?.courierId
    ? couriers.find((c) => c.id === currentRide.courierId)
    : null;

  const handleMapLocationSelect = (lat: number, lng: number) => {
    if (!mapSelectMode) return;
    const point = resolveLocationFromCoords(lat, lng);
    if (mapSelectMode === 'pickup') {
      setPickup(point);
    } else {
      setDropoff(point);
    }
    setMapSelectMode(null);
  };

  const handleStartBooking = () => {
    requestRide({
      serviceType,
      pickup,
      dropoff,
      pickupConfirmedByUser: true,
      packageNote: serviceType === 'kurye' ? packageNote : undefined,
      recipientContact:
        serviceType === 'kurye' ? { name: recipientName, phone: recipientPhone } : undefined,
      paymentMethod: selectedPaymentMethod,
    });
  };

  return (
    <div
      className={`w-full ${
        isEmbedded ? 'h-[680px] rounded-3xl border border-[var(--border-subtle)]' : 'min-h-[calc(100vh-3.5rem)]'
      } bg-[#0A0A0C] text-[#F5F5F7] flex flex-col overflow-hidden relative font-sans`}
    >
      {/* Üst Sekme Çubuğu */}
      <div className="p-3 bg-[#141418] border-b border-white/10 flex items-center justify-between gap-2 z-20 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C22] rounded-xl border border-white/10 text-xs font-semibold flex-1">
          <button
            type="button"
            onClick={() => setActiveTab('sefer')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sefer' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sefer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kasa')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'kasa' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cüzdan ({customerWalletBalance} ₺)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gecmis')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'gecmis' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Geçmiş ({allRides.length})
          </button>
        </div>
      </div>

      {/* SEKME 1: SEFER (HARİTA VE ÇAĞRI) */}
      {activeTab === 'sefer' && (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <MapComponent
              couriers={couriers}
              currentRide={currentRide}
              heightClass="h-full"
              onSelectLocation={handleMapLocationSelect}
            />
          </div>

          {/* Üst Rota Seçici */}
          {!isRideActive && !isRideCompleted && (
            <div className="relative z-20 p-3 pointer-events-auto">
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 space-y-2 text-xs shadow-xl">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <select
                    value={pickup.name}
                    onChange={(e) => {
                      const found = turkeyLocations.find((l) => l.name === e.target.value);
                      if (found) setPickup(found);
                    }}
                    aria-label="Alış Noktası"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none"
                  >
                    {turkeyLocations.map((loc) => (
                      <option key={`p-${loc.name}`} value={loc.name} className="bg-[#16161C]">
                        Alış: {loc.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setMapSelectMode(mapSelectMode === 'pickup' ? null : 'pickup')}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                      mapSelectMode === 'pickup' ? 'bg-[#2563EB] text-white' : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    Haritadan
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <select
                    value={dropoff.name}
                    onChange={(e) => {
                      const found = turkeyLocations.find((l) => l.name === e.target.value);
                      if (found) setDropoff(found);
                    }}
                    aria-label="Varış Noktası"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-semibold focus:outline-none"
                  >
                    {turkeyLocations.map((loc) => (
                      <option key={`d-${loc.name}`} value={loc.name} className="bg-[#16161C]">
                        Varış: {loc.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setMapSelectMode(mapSelectMode === 'dropoff' ? null : 'dropoff')}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                      mapSelectMode === 'dropoff' ? 'bg-[#2563EB] text-white' : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    Haritadan
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 pointer-events-none" />

          {/* Alt Çağrı ve Durum Kartı */}
          <div className="relative z-20 p-3 pointer-events-auto">
            {!isRideActive && !isRideCompleted ? (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 space-y-3 shadow-2xl text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setServiceType('motosiklet')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                        serviceType === 'motosiklet' ? 'bg-[#2563EB] text-white' : 'text-zinc-400'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Taksi / Yolcu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceType('kurye')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                        serviceType === 'kurye' ? 'bg-[#2563EB] text-white' : 'text-zinc-400'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Paket Kurye</span>
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">%0 Komisyon</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {fareEstimate.totalFare} ₺
                    </span>
                  </div>
                </div>

                {serviceType === 'kurye' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Alıcı Adı"
                      className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={packageNote}
                      onChange={(e) => setPackageNote(e.target.value)}
                      placeholder="Paket Notu"
                      className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-white focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleStartBooking}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{serviceType === 'motosiklet' ? 'Taksi Çağır' : 'Kurye Çağır'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : isRideCompleted && currentRide ? (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 space-y-3 shadow-2xl text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-bold text-sm text-emerald-400">Sefer Tamamlandı ✓</span>
                  <span className="font-bold font-mono text-base text-white">{currentRide.totalFare} ₺</span>
                </div>

                <div className="flex justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    rateCompletedRide(rating, 'Tamamlandı');
                    dismissCompletedRide();
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Onayla &amp; Kapat
                </button>
              </div>
            ) : currentRide ? (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 space-y-3 shadow-2xl text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white">
                    {currentRide.status === 'in_progress'
                      ? 'Sefer Sürüyor'
                      : currentRide.status === 'arrived'
                      ? 'Sürücü Noktada'
                      : currentRide.status === 'accepted'
                      ? 'Sürücü Yolda'
                      : 'Kurye Eşleştiriliyor...'}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{currentRide.totalFare} ₺</span>
                </div>

                {assignedCourier && (
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-bold text-white">{assignedCourier.name}</div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {currentRide.assignedVehicleId || assignedCourier.plate} · {assignedCourier.motorcycle}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowChatModal(true)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Mesaj</span>
                    </button>
                  </div>
                )}

                {currentRide.status !== 'in_progress' ? (
                  <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                    <span className="text-zinc-400">Biniş / Teslim PIN Kodu:</span>
                    <span className="text-xl font-bold font-mono tracking-widest text-white">
                      {currentRide.boardingCode}
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-500/15 rounded-xl flex items-center justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> PIN Doğrulandı
                    </span>
                    <span className="font-mono">{currentRide.boardingCode}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => cancelRide('Müşteri iptal etti')}
                  className="w-full py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Çağrıyı İptal Et</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SEKME 2: KASA (CÜZDAN & ÖDEME) */}
      {activeTab === 'kasa' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#2563EB]" /> Cüzdan Bakiyesi
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {customerWalletBalance} ₺
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => topUpCustomerWallet(amt)}
                  className="py-2 bg-white/10 hover:bg-white/15 rounded-xl font-mono font-bold text-white cursor-pointer"
                >
                  +{amt} ₺
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-2.5">
            <span className="font-bold text-white block">Ödeme Yöntemi</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Kredi Kartı' },
                { id: 'wallet', label: 'Cüzdan' },
                { id: 'cash', label: 'Nakit' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(m.id as any)}
                  className={`py-2.5 rounded-xl font-semibold border cursor-pointer ${
                    selectedPaymentMethod === m.id
                      ? 'bg-[#2563EB]/20 border-[#2563EB] text-white'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-2.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-[#2563EB]" /> İndirim Kuponu
            </span>
            {activeCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-500/15 rounded-xl">
                <span className="font-mono font-bold text-emerald-400">{activeCoupon.code} aktif</span>
                <button
                  type="button"
                  onClick={removeCouponCode}
                  className="text-red-400 font-semibold cursor-pointer"
                >
                  Kaldır
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Kupon kodu (örn: MOTO50)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (couponInput.trim()) {
                      applyCouponCode(couponInput.trim());
                      setCouponInput('');
                    }
                  }}
                  className="px-4 py-2 bg-[#2563EB] text-white font-semibold rounded-xl cursor-pointer"
                >
                  Uygula
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 3: GEÇMİŞ SEFERLER */}
      {activeTab === 'gecmis' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 text-xs">
          {allRides.map((ride) => (
            <div
              key={ride.id}
              className="p-3.5 bg-[#16161C] border border-white/10 rounded-2xl flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-mono font-bold text-white">{ride.id}</div>
                <div className="text-zinc-400 truncate mt-0.5">
                  {ride.pickup.name} → {ride.dropoff.name}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-emerald-400 text-sm">{ride.totalFare} ₺</div>
                <div className="text-[10px] text-zinc-500">%0 Komisyon</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mesajlaşma Penceresi */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#16161C] border border-white/15 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-bold text-white">Sürücü ile Mesajlaş</span>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 py-1">
              {chatMessages.length === 0 ? (
                <div className="text-center text-zinc-500 py-4">Henüz mesaj yok.</div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl ${
                      msg.sender === 'customer'
                        ? 'bg-[#2563EB] text-white ml-6'
                        : 'bg-white/10 text-white mr-6'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className="text-[10px] opacity-70 text-right mt-0.5">{msg.timestamp}</div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                sendChatMessage('customer', chatInput.trim());
                setChatInput('');
              }}
              className="flex gap-2 pt-2 border-t border-white/10"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Mesaj yazın..."
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#2563EB] text-white rounded-xl font-semibold flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
