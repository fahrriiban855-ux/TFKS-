import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { MapComponent } from '../common/MapComponent';
import {
  Bike,
  Power,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  Clock,
  AlertCircle,
  MessageCircle,
  X,
  Package,
  RotateCcw,
  Send,
} from 'lucide-react';

interface CourierAppProps {
  isEmbedded?: boolean;
}

export const CourierApp: React.FC<CourierAppProps> = ({ isEmbedded = false }) => {
  const {
    activeCourier,
    couriers,
    setActiveCourierId,
    toggleCourierOnline,
    currentRide,
    acceptRide,
    rejectRide,
    arriveAtPickup,
    startTrip,
    completeTrip,
    chatMessages,
    sendChatMessage,
    acceptBargainOffer,
    courierShift,
    startCourierShift,
    endCourierShift,
    courierCashInHand,
    courierPenalties,
    payCourierPenalty,
    setCourierEquipmentMode,
    showNotification,
    updateDeliveryPackageStatus,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'sefer' | 'zimmet' | 'kasa'>('sefer');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [reportedKm, setReportedKm] = useState(courierShift.startKm + 42);
  const [cashHandinSuccess, setCashHandinSuccess] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const isAssigned = currentRide?.courierId === activeCourier.id;

  useEffect(() => {
    if (isAssigned && currentRide?.status === 'offered') {
      setSecondsRemaining(15);
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            rejectRide();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAssigned, currentRide?.status, rejectRide]);

  const handleCompleteDelivery = () => {
    if (currentRide?.packagesList && currentRide.packagesList.length > 0) {
      const unfinished = currentRide.packagesList.filter(
        (p) => p.status === 'pending' || p.status === 'in_transit'
      );
      if (unfinished.length > 0) {
        showNotification({
          title: 'Eksik Paket',
          message: `${unfinished.length} paket henüz sonuçlandırılmadı.`,
          type: 'error',
        });
        return;
      }
    }
    completeTrip();
    setEnteredPin('');
  };

  const handlePinVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim().length !== 4) return;
    const ok = startTrip(enteredPin.trim());
    if (!ok) {
      setPinError(true);
    } else {
      setPinError(false);
      setEnteredPin('');
    }
  };

  const canonicalPlate = currentRide?.assignedVehicleId || activeCourier.plate;

  return (
    <div
      className={`w-full ${
        isEmbedded ? 'h-[680px] rounded-3xl border border-[var(--border-subtle)]' : 'min-h-[calc(100vh-3.5rem)]'
      } bg-[#0A0A0C] text-[#F5F5F7] flex flex-col overflow-hidden relative font-sans`}
    >
      {/* Üst Durum ve Sekme Çubuğu */}
      <div className="p-3 bg-[#141418] border-b border-white/10 flex flex-col gap-2.5 z-20 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <select
              value={activeCourier.id}
              onChange={(e) => setActiveCourierId(e.target.value)}
              aria-label="Aktif Kurye Seçimi"
              className="bg-[#1C1C22] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
            >
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.plate})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => toggleCourierOnline(activeCourier.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeCourier.isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-white/10 text-zinc-400 border border-white/10'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeCourier.isOnline ? 'bg-emerald-400' : 'bg-zinc-500'
              }`}
            />
            <span>{activeCourier.isOnline ? 'Çevrimiçi' : 'Molada'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C22] rounded-xl border border-white/10 text-xs font-semibold">
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
            onClick={() => setActiveTab('zimmet')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'zimmet' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Zimmet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kasa')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'kasa' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Kasa
          </button>
        </div>
      </div>

      {/* SEKME 1: SEFER */}
      {activeTab === 'sefer' && (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <MapComponent couriers={couriers} currentRide={currentRide} heightClass="h-full" />
          </div>

          <div className="flex-1 pointer-events-none" />

          <div className="relative z-20 p-3 pointer-events-auto">
            {!activeCourier.isOnline ? (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center space-y-3">
                <Power className="w-6 h-6 text-zinc-400 mx-auto" />
                <div className="text-sm font-bold text-white">Moladasınız</div>
                <p className="text-xs text-zinc-400">Çağrı almak için çevrimiçi olun.</p>
                <button
                  type="button"
                  onClick={() => toggleCourierOnline(activeCourier.id)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Çevrimiçi Ol
                </button>
              </div>
            ) : isAssigned && currentRide?.status === 'offered' ? (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-[#2563EB] rounded-2xl p-4 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-[#2563EB] text-white">
                    Yeni Çağrı
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {secondsRemaining}s
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <span className="text-[11px] text-zinc-400 block">Net Kazanç (%0 Komisyon)</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {currentRide.courierEarnings} ₺
                    </span>
                  </div>
                  <div className="text-right font-mono text-xs text-zinc-300">
                    {currentRide.distanceKm} km · {currentRide.durationMin} dk
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="truncate">
                    <span className="text-zinc-400">Alış: </span>
                    <span className="font-semibold text-white">{currentRide.pickup.name}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-400">Varış: </span>
                    <span className="font-semibold text-white">{currentRide.dropoff.name}</span>
                  </div>
                  {currentRide.packageNote && (
                    <div className="text-[11px] text-zinc-300 bg-white/5 p-2 rounded-lg">
                      Not: {currentRide.packageNote}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={rejectRide}
                    className="py-3 bg-white/10 hover:bg-white/15 text-zinc-300 font-semibold text-xs rounded-xl cursor-pointer"
                  >
                    Reddet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentRide.bargainStatus === 'proposed') {
                        acceptBargainOffer(currentRide.totalFare);
                      }
                      acceptRide();
                    }}
                    className="py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Kabul Et
                  </button>
                </div>
              </div>
            ) : isAssigned && currentRide && currentRide.status !== 'completed' ? (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold font-mono text-white">
                    {currentRide.id} · {canonicalPlate}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowChatModal(true)}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Mesaj ({chatMessages.length})</span>
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <div className="truncate">
                    <span className="text-zinc-400">Alış: </span>
                    <span className="font-semibold">{currentRide.pickup.name}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-400">Varış: </span>
                    <span className="font-semibold">{currentRide.dropoff.name}</span>
                  </div>
                </div>

                {currentRide.status === 'accepted' && (
                  <button
                    type="button"
                    onClick={arriveAtPickup}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Alış Noktasına Vardım
                  </button>
                )}

                {currentRide.status === 'arrived' && currentRide.serviceType === 'motosiklet' && (
                  <form onSubmit={handlePinVerify} className="space-y-2">
                    <label className="text-xs text-zinc-400 block">
                      Yolcunun 4 Haneli Biniş PIN Kodunu Girin:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredPin}
                        onChange={(e) => {
                          setEnteredPin(e.target.value);
                          setPinError(false);
                        }}
                        placeholder="4 Haneli PIN"
                        className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-[#2563EB]"
                      />
                      <button
                        type="submit"
                        disabled={enteredPin.trim().length !== 4}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Başlat
                      </button>
                    </div>
                    {pinError && (
                      <span className="text-[11px] text-red-400 block">
                        Hatalı PIN kodu. Müşteri ekranındaki kodu kontrol edin.
                      </span>
                    )}
                  </form>
                )}

                {currentRide.status === 'arrived' && currentRide.serviceType !== 'motosiklet' && (
                  <button
                    type="button"
                    onClick={() => startTrip('PICKUP_CONFIRMED')}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Paketi Teslim Aldım, Yola Çık
                  </button>
                )}

                {currentRide.status === 'in_progress' && (
                  <div className="space-y-2.5">
                    {currentRide.packagesList && currentRide.packagesList.length > 0 && (
                      <div className="p-2.5 bg-white/5 rounded-xl space-y-2 max-h-44 overflow-y-auto">
                        <div className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Paket Dağıtım Listesi</span>
                        </div>
                        {currentRide.packagesList.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="truncate">
                              <div className="font-semibold text-white truncate">{pkg.recipientName}</div>
                              <div className="text-[10px] text-zinc-400 truncate">{pkg.dropoffAddress}</div>
                            </div>
                            {pkg.status === 'pending' || pkg.status === 'in_transit' ? (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateDeliveryPackageStatus(currentRide.id, pkg.id, 'delivered', {
                                      verifiedRecipientName: pkg.recipientName,
                                      verificationMethod: 'code',
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] cursor-pointer"
                                >
                                  Teslim
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateDeliveryPackageStatus(currentRide.id, pkg.id, 'returned', {
                                      returnReason: 'İade',
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-semibold text-[10px] cursor-pointer"
                                >
                                  İade
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                                {pkg.status === 'delivered' ? 'Teslim ✓' : 'İade ↺'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCompleteDelivery}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Seferi Tamamla (+{currentRide.courierEarnings} ₺)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#16161C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">Çağrı Bekleniyor</span>
                </div>
                <span className="font-mono text-zinc-400">{canonicalPlate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 2: ZİMMET & VARDİYA */}
      {activeTab === 'zimmet' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Bike className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <div className="text-sm font-bold font-mono text-white">{courierShift.bikePlate}</div>
                  <div className="text-[11px] text-zinc-400">{activeCourier.motorcycle}</div>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] ${
                  courierShift.isShiftActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/10 text-zinc-400'
                }`}
              >
                {courierShift.isShiftActive ? 'Zimmet Aktif' : 'Garajda'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 bg-white/5 rounded-xl">
                <span className="text-[11px] text-zinc-400 block">Başlangıç KM</span>
                <span className="text-sm font-bold text-white">{courierShift.startKm} km</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <span className="text-[11px] text-zinc-400 block">Güncel KM</span>
                <span className="text-sm font-bold text-emerald-400">{reportedKm} km</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Kilometre Sayacı Güncelle:</label>
              <input
                type="number"
                value={reportedKm}
                onChange={(e) => setReportedKm(Number(e.target.value))}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Çalışma Modu:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCourierEquipmentMode(activeCourier.id, 'passenger_and_courier')}
                  className={`py-2.5 rounded-xl font-semibold border cursor-pointer ${
                    activeCourier.equipmentMode === 'passenger_and_courier'
                      ? 'bg-[#2563EB]/20 border-[#2563EB] text-white'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  Yolcu &amp; Paket
                </button>
                <button
                  type="button"
                  onClick={() => setCourierEquipmentMode(activeCourier.id, 'courier_only')}
                  className={`py-2.5 rounded-xl font-semibold border cursor-pointer ${
                    activeCourier.equipmentMode === 'courier_only'
                      ? 'bg-[#2563EB]/20 border-[#2563EB] text-white'
                      : 'bg-white/5 border-white/10 text-zinc-400'
                  }`}
                >
                  Sadece Paket
                </button>
              </div>
            </div>

            {courierShift.isShiftActive ? (
              <button
                type="button"
                onClick={() => endCourierShift()}
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl cursor-pointer"
              >
                Aracı Teslim Et &amp; Vardiyayı Kapat
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  startCourierShift({
                    bikePlate: activeCourier.plate,
                    startKm: reportedKm,
                    photosApproved: true,
                  })
                }
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl cursor-pointer"
              >
                Zimmeti Devral &amp; Vardiyayı Başlat
              </button>
            )}
          </div>
        </div>
      )}

      {/* SEKME 3: KASA & CEZA */}
      {activeTab === 'kasa' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {/* Hakediş Özeti */}
          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-medium">Günlük Net Hakediş</span>
              <span className="font-mono text-emerald-400 font-bold text-lg">
                {(activeCourier.wallet?.dailyEarnings ?? 0).toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-zinc-400">Haftalık Toplam</span>
              <span className="font-mono text-white font-semibold">
                {(activeCourier.wallet?.weeklyEarnings ?? 0).toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-zinc-400">Bekleyen Ödeme</span>
              <span className="font-mono text-white font-semibold">
                {(activeCourier.wallet?.pendingPayout ?? 0).toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>

          {/* Eldeki Nakit Devri */}
          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Eldeki Nakit Tahsilat</span>
              </div>
              <span className="font-mono font-bold text-base text-emerald-400">
                {courierCashInHand} ₺
              </span>
            </div>

            {cashHandinSuccess ? (
              <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-center font-semibold">
                Nakit teslim kaydı oluşturuldu ✓
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCashHandinSuccess(true);
                  setTimeout(() => setCashHandinSuccess(false), 2500);
                }}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl cursor-pointer"
              >
                {courierCashInHand} ₺ Kasaya Teslim Et
              </button>
            )}
          </div>

          {/* Trafik Cezaları */}
          <div className="p-4 bg-[#16161C] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white">Trafik Cezaları</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {courierPenalties.filter((p) => p.status === 'unpaid').length} Açık
              </span>
            </div>

            <div className="space-y-2">
              {courierPenalties.map((pen) => (
                <div
                  key={pen.id}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-white">{pen.title}</div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {pen.code} · İndirimli: {pen.discountedAmount} ₺
                    </div>
                  </div>
                  {pen.status === 'paid' ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ödendi
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => payCourierPenalty(pen.id)}
                      className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shrink-0 cursor-pointer"
                    >
                      Öde ({pen.discountedAmount} ₺)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mesajlaşma Penceresi */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#16161C] border border-white/15 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-bold text-white">Sefer Mesajları</span>
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
                      msg.sender === 'courier'
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
                sendChatMessage('courier', chatInput.trim());
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
