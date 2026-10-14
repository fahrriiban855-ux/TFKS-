import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { MapComponent } from '../common/MapComponent';
import { PhoneFrame } from '../common/PhoneFrame';
import {
  Bike,
  Power,
  Navigation,
  CheckCircle2,
  DollarSign,
  Shield,
  FileCheck,
  Camera,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle,
  Phone,
  Maximize2,
  Minimize2,
  Delete,
  Check,
  Zap,
  TrendingUp,
  Award,
  Settings,
  Flame,
  FileText,
  Sliders,
  Compass,
  Wallet,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  X,
  Mic,
  Star,
  Heart,
  Users,
  Handshake,
  Coins,
  Rocket,
  Package,
  ShoppingBag,
  Store,
  Calendar,
  Hourglass,
  AlertTriangle,
  Target,
  Copy,
} from 'lucide-react';
import { PerformanceSummary } from './PerformanceSummary';
import { LaunchStrategyMatrix } from '../common/LaunchStrategyMatrix';
import { DeliveryPackageItem } from '../../types/platform';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { BatchRoutePlanRecord } from '../../services/motopilotEngines';

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
    dismissCompletedRide,
    chatMessages,
    sendChatMessage,
    helmetTtsActive,
    toggleHelmetTts,
    favoriteCourierIds,
    directChats,
    sendDirectMessageToCourier,
    acceptBargainOffer,
    counterBargainOffer,
    declineBargainOffer,
    courierShift,
    startCourierShift,
    endCourierShift,
    courierCashInHand,
    courierPenalties,
    payCourierPenalty,
    setCourierEquipmentMode,
    reportRideIssue,
    reportEmergencyIncident,
    showNotification,
    updateDeliveryPackageStatus,
    driverQuests,
    claimDriverQuestBonus,
    referralCodes,
    generateReferralCode,
    recordAuditLog,
  } = usePlatform();

  const [batchRoutes, setBatchRoutes] = useLocalStorageState<BatchRoutePlanRecord[]>(
    'mp_batch_routes_v1',
    []
  );

  const [useDeviceFrame, setUseDeviceFrame] = useState(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'zimmet_vardiya' | 'ceza_kasa' | 'earnings' | 'trips' | 'passengers' | 'documents' | 'settings'>('cockpit');
  const [driverDirectReply, setDriverDirectReply] = useState('');
  const [showDriverIssueModal, setShowDriverIssueModal] = useState(false);
  const [driverIssueSuccess, setDriverIssueSuccess] = useState<string | null>(null);

  // TFKS Modals State
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showPenaltiesModal, setShowPenaltiesModal] = useState(false);
  const [showCashHandinModal, setShowCashHandinModal] = useState(false);
  const [reportedKm, setReportedKm] = useState(24890);
  const [cashHandinSuccess, setCashHandinSuccess] = useState(false);
  const [showLaunchMatrixModal, setShowLaunchMatrixModal] = useState(false);

  // Sürücü Masası (Apple Bottom Drawer) State
  const [showDriverDeskDrawer, setShowDriverDeskDrawer] = useState(false);
  const [deskDrawerTab, setDeskDrawerTab] = useState<'earnings' | 'quests' | 'shift' | 'cash' | 'penalties' | 'profile'>('earnings');

  const driverReferralCode =
    referralCodes.find((c) => c.ownerId === activeCourier.id && c.programType === 'driver_to_driver')?.code ||
    `MOTO-${activeCourier.plate.replace(/\s+/g, '')}`;

  // Tek Seferlik Vardiya & Görev Seçimi Modali (Getir / Martı TAG Stili)
  const [showDutySelectionModal, setShowDutySelectionModal] = useState(false);
  const [selectedDutyCandidate, setSelectedDutyCandidate] = useState<'courier_only' | 'passenger_and_courier'>(
    activeCourier.equipmentMode || 'courier_only'
  );

  // Interactive controls
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [homeBoundMode, setHomeBoundMode] = useState(false);
  const [homeAddress, setHomeAddress] = useState('Kadıköy Moda Cd. No: 14/B');
  const [selectedNav, setSelectedNav] = useState<'internal' | 'external'>('internal');
  const [cashoutSuccess, setCashoutSuccess] = useState(false);
  const [showDriverChatModal, setShowDriverChatModal] = useState(false);
  const [showDriverVoipModal, setShowDriverVoipModal] = useState(false);
  const [driverCallDuration, setDriverCallDuration] = useState(0);
  const [driverMicMuted, setDriverMicMuted] = useState(false);
  const [driverAudioRoute, setDriverAudioRoute] = useState<'helmet' | 'speaker'>('helmet');
  const [driverChatMessage, setDriverChatMessage] = useState('');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [manualTypingAllowed, setManualTypingAllowed] = useState(false);

  // VoIP Timer effect for driver
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showDriverVoipModal) {
      setDriverCallDuration(0);
      timer = setInterval(() => {
        setDriverCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showDriverVoipModal]);

  // Driver glove-friendly quick response cards
  const TACTICAL_GLOVE_REPLIES = [
    { title: '2 Dk İçinde Oradayım', desc: 'Trafik akıcı seyrediyor', emoji: '🛵', text: 'Yoldayım, yaklaşık 2 dakika içinde alış noktasındayım.' },
    { title: 'Konuma Vardım', desc: 'Dörtlüler açık bekliyorum', emoji: '📍', text: 'Alış noktasına vardım, dörtlülerimi yaktım bekliyorum.' },
    { title: 'Kaskınız Hazır', desc: 'Hijyen bonesi mevcut', emoji: '🪖', text: 'Kaskınız ve dezenfekte edilmiş hijyen bonesi hazırdır.' },
    { title: 'Kapı Önündeyim', desc: 'Bina girişindeyim', emoji: '🏢', text: 'Bina kapısının önündeyim, güvenle binebilirsiniz.' },
    { title: 'Sağ Kaldırımda Bekleyin', desc: 'Trafik emniyeti için', emoji: '⚠️', text: 'Lütfen sağ kaldırım tarafında bekleyiniz, yanaşıyorum.' },
    { title: 'Trafik Yoğun (1-2 Dk)', desc: 'Işıklara takıldım', emoji: '🚥', text: 'Kırmızı ışık ve trafik sebebiyle 1-2 dakika gecikmeli ulaşıyorum.' },
  ];

  const isAssigned = currentRide?.courierId === activeCourier.id;

  // 15s Countdown timer for incoming offer
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
  }, [isAssigned, currentRide?.status]);

  const handleKeypadPress = (val: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + val;
      setEnteredPin(next);
      if (next.length === 4) {
        const ok = startTrip(next);
        if (!ok) {
          setPinError(true);
          setTimeout(() => {
            setEnteredPin('');
            setPinError(false);
          }, 1600);
        }
      }
    }
  };

  const handleDeletePin = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  const handlePttWalkieTalkie = () => {
    sendChatMessage('courier', '🎤 Telsiz Sesli Notu (0:04) - "Yoldayım, 2 dk içinde alış noktasındayım."', {
      isVoiceNote: true,
      voiceDurationSec: 4,
    });
  };

  // Multi-Drop Paket Yönetim Durumu (Kural 5)
  const [selectedPkgForAction, setSelectedPkgForAction] = useState<DeliveryPackageItem | null>(null);
  const [pkgActionModalType, setPkgActionModalType] = useState<'deliver' | 'fail' | 'return' | null>(null);
  const [pkgRecipientNameInput, setPkgRecipientNameInput] = useState('');
  const [pkgCodeInput, setPkgCodeInput] = useState('');
  const [pkgFailReasonInput, setPkgFailReasonInput] = useState('Alıcı adreste bulunamadı');
  const [pkgReturnReasonInput, setPkgReturnReasonInput] = useState('Gönderici işletmeye iade edilecek');

  const handleCompleteDelivery = () => {
    if (currentRide?.packagesList && currentRide.packagesList.length > 0) {
      const unfinished = currentRide.packagesList.filter(
        (p) => p.status === 'pending' || p.status === 'in_transit'
      );
      if (unfinished.length > 0) {
        showNotification({
          title: 'Teslimat Kapatılamaz',
          message: `Dağıtımı sonuçlandırılmamış ${unfinished.length} paket mevcut (${unfinished.map((p) => p.trackingCode).join(', ')}). Lütfen tüm paketleri Teslim Edildi, Teslim Edilemedi veya İade olarak işleyiniz!`,
          type: 'error',
          isCritical: true,
        });
        return;
      }
    }
    completeTrip('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80');
    setPhotoTaken(false);
    setEnteredPin('');
  };

  const handleCashout = () => {
    setCashoutSuccess(true);
    setTimeout(() => setCashoutSuccess(false), 3000);
  };

  const appContent = (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-black select-none">
      {/* Return to Cockpit Header for non-cockpit tabs */}
      {activeTab !== 'cockpit' && (
        <div className="z-30 p-2.5 bg-[#16161A]/95 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between shrink-0 animate-in fade-in duration-150">
          <button
            onClick={() => setActiveTab('cockpit')}
            className="min-h-[44px] min-w-[48px] px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>← Canlı Radar & Kokpit</span>
          </button>
          <span className="text-[11px] font-mono text-[#8E8E93] pr-2">
            {activeCourier.plate} · {courierShift.bikePlate}
          </span>
        </div>
      )}

      {/* TAB 1: COCKPIT (Map & Order Radar) */}
      {activeTab === 'cockpit' && (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Full Bleed Map */}
          <div className="absolute inset-0 z-0">
            <MapComponent couriers={couriers} currentRide={currentRide} heightClass="h-full" />
          </div>

          {/* Top Driver Status Ribbon - Apple iOS Style */}
          <div className="relative z-20 p-3 space-y-2 pointer-events-auto">
            {/* Top Driver Status Ribbon - Apple iOS Style (Glove-Friendly) */}
            {/* Top Driver Status Ribbon - Apple & Uber Driver Clean Style (Single Minimal Ribbon) */}
            <div className="p-3 bg-[#1C1C1E]/90 backdrop-blur-2xl rounded-[26px] border border-white/[0.1] shadow-2xl flex items-center justify-between gap-2 text-xs">
              {/* Online / Offline Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (!activeCourier.isOnline) {
                    setShowDutySelectionModal(true);
                  } else {
                    toggleCourierOnline(activeCourier.id);
                  }
                }}
                className={`min-h-[48px] px-3.5 py-2 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                  activeCourier.isOnline
                    ? 'bg-[#30D158]/15 border-[#30D158]/40 text-[#30D158]'
                    : 'bg-white/[0.06] border-white/[0.1] text-[#8E8E93]'
                }`}
                title="Çevrim Durumu"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all shadow-sm ${
                    activeCourier.isOnline ? 'bg-[#30D158] shadow-[0_0_12px_#30D158] animate-pulse' : 'bg-[#636366]'
                  }`}
                />
                <div className="text-left">
                  <span className="font-bold text-[11px] block leading-tight">
                    {activeCourier.isOnline ? 'GÖREVE HAZIR' : 'MOLADA'}
                  </span>
                  <span className="text-[10px] text-[#8E8E93] font-mono block">
                    {courierShift.bikePlate || activeCourier.plate}
                  </span>
                </div>
              </button>

              {/* Top status indicator (Clean & subtle) */}
              <div className="flex-1 text-center">
                <span className="text-[11px] font-semibold text-zinc-300">
                  {activeCourier.equipmentMode === 'passenger_and_courier' ? 'Yolcu & Paket' : 'Paket Kurye'}
                </span>
              </div>

              {/* Right: Desk Drawer & Demand Indicator */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setDeskDrawerTab('earnings');
                    setShowDriverDeskDrawer(true);
                  }}
                  className="min-h-[48px] px-3.5 py-2 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  title="Sürücü Masasını Aç (Zimmet, Kasa, Cezalar)"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Masa ▴</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`min-h-[48px] px-2.5 py-2 rounded-2xl text-[11px] font-semibold flex items-center gap-1 border transition-all ${
                    showHeatmap ? 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/40' : 'bg-white/[0.06] text-[#8E8E93] border-white/[0.08]'
                  }`}
                  title="Yoğun Talep Bölgeleri"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>1.4x</span>
                </button>
              </div>
            </div>

            {/* Turn-by-Turn Instruction Banner if on route - Apple Maps Style */}
            {isAssigned && currentRide && currentRide.status !== 'completed' && (
              <div className="p-3.5 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[24px] text-xs shadow-2xl flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center shrink-0 shadow-md font-bold text-base">
                  ↱
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-[#0A84FF] font-semibold block uppercase tracking-wider">
                    {currentRide.status === 'accepted' ? 'Alış Noktasına Yönlenin (250m)' : 'Varış Noktasına İlerleyin (1.8km)'}
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {currentRide.status === 'accepted' ? currentRide.pickup.address : currentRide.dropoff.address}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 pointer-events-none" />

          {/* Bottom Floating Cockpit Sheet - Apple iOS Style */}
          <div className="relative z-20 p-3 pb-16 pointer-events-auto">
            {!activeCourier.isOnline ? (
              <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 text-center space-y-4 shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-white/[0.08] border border-white/[0.1] text-[#8E8E93] mx-auto flex items-center justify-center">
                  <Power className="w-7 h-7 text-white stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Şu Anda Dinleniyorsunuz</h3>
                  <p className="text-xs text-[#8E8E93] mt-1 max-w-xs mx-auto">
                    Motosiklet yolcusu veya kurye paketi çağrısı alabilmek için çevrim içi olun.
                  </p>
                </div>
                <button
                  onClick={() => setShowDutySelectionModal(true)}
                  className="w-full py-4 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-2xl shadow-[0_4px_20px_rgba(48,209,88,0.3)] transition-all active:scale-[0.98]"
                >
                  Görevi Seç & Çevrim İçi Ol
                </button>
              </div>
            ) : isAssigned && currentRide?.status === 'offered' ? (
              /* INCOMING 15S DISPATCH OFFER - Apple iOS Incoming Call Sheet */
              <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-[#0A84FF]/40 rounded-[32px] p-4.5 space-y-3.5 shadow-[0_12px_45px_rgba(0,113,227,0.3)] animate-in slide-in-from-bottom-6 duration-300 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1.5 bg-[#0071E3] text-white shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{currentRide.isDirectBooking ? 'VIP ÇAĞRI' : currentRide.bargainStatus === 'proposed' ? 'FİYAT TEKLİFİ' : 'YENİ ÇAĞRI'}</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF9F0A] bg-[#FF9F0A]/15 px-3 py-1 rounded-full border border-[#FF9F0A]/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{secondsRemaining}s</span>
                  </div>
                </div>

                {/* Sünnet Pazarlığı / Fiyat Teklifi Alert Banner if proposed */}
                {currentRide.bargainStatus === 'proposed' && (
                  <div className="p-3 bg-[#2C2C2E]/70 rounded-2xl border border-white/[0.08] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span className="flex items-center gap-1.5 text-[#FF9F0A]">
                        <Handshake className="w-4 h-4" />
                        <span>Yolcu Teklifi (Esnek Fiyat)</span>
                      </span>
                      <span className="font-mono text-white font-bold text-sm">
                        {currentRide.totalFare} ₺ Teklif
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E8E93] italic">
                      "{currentRide.bargainReason || 'Maksat sünnet olsun: Düz hesap olsun ustam 🤝'}"
                    </p>
                    <div className="text-[10px] text-[#8E8E93] flex justify-between pt-1 border-t border-white/[0.06] font-mono">
                      <span>Liste Fiyatı: <strong className="line-through text-zinc-500">{currentRide.originalFare} ₺</strong></span>
                      <span className="text-[#30D158] font-semibold">Net Kazanç</span>
                    </div>
                  </div>
                )}

                {currentRide.isDirectBooking && (
                  <div className="p-2.5 bg-[#BF5AF2]/15 rounded-xl border border-[#BF5AF2]/30 text-[11px] text-[#BF5AF2] font-semibold flex items-center justify-between">
                    <span>👑 {currentRide.customerName} sizi favori sürücüsü seçti.</span>
                    <span className="font-mono text-white font-bold">+%5 VIP Primi</span>
                  </div>
                )}

                <div className="p-3.5 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#30D158] font-semibold block uppercase">
                      Sürücü / Kurye Net Hakedişi (%100 — %0 Komisyon)
                    </span>
                    <span className="text-2xl font-bold font-mono text-[#30D158]">{currentRide.courierEarnings} ₺</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8E8E93] block font-medium">Mesafe / Süre</span>
                    <span className="text-xs font-mono font-semibold text-white">
                      {currentRide.distanceKm} km · {currentRide.durationMin} dk
                    </span>
                  </div>
                </div>

                {/* Service Type & Operational Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2.5 py-1 rounded-full font-semibold bg-[#0071E3]/20 text-[#0A84FF] border border-[#0071E3]/30">
                    {currentRide.serviceType === 'motosiklet'
                      ? '🚕 1. Taksi (TAXI_RIDE)'
                      : currentRide.serviceType === 'kurye'
                      ? '📦 2. Bireysel Kurye (PERSONAL_DELIVERY)'
                      : currentRide.serviceType === 'al_getir'
                      ? '🛍️ Alıp Bana Getir'
                      : '🏪 İşletme Teslimatı (MERCHANT_DELIVERY)'}
                  </span>

                  {currentRide.timing === 'scheduled' && (
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/[0.08] font-mono font-medium">
                      📅 Randevulu: {currentRide.scheduledTime || 'Belirtilen Saat'}
                    </span>
                  )}

                  {currentRide.waitMinutes && currentRide.waitMinutes > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-[#FF9F0A]/15 text-[#FF9F0A] border border-[#FF9F0A]/30 font-mono font-medium">
                      ⏳ +{currentRide.waitMinutes} Dk Bekleme
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="truncate"><span className="text-[#8E8E93] font-medium">Alış:</span> <span className="text-white font-semibold">{currentRide.pickup.name}</span></div>
                  <div className="truncate"><span className="text-[#8E8E93] font-medium">Varış:</span> <span className="text-white font-semibold">{currentRide.dropoff.name}</span></div>
                  {currentRide.packageNote && (
                    <div className="text-[11px] text-[#8E8E93] bg-[#2C2C2E]/60 p-2 rounded-xl border border-white/[0.06]">
                      <span className="text-white font-semibold">Not:</span> {currentRide.packageNote}
                    </div>
                  )}
                </div>

                {/* Dispatch Action Buttons - Min 48px Touch Target */}
                {currentRide.bargainStatus === 'proposed' ? (
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        acceptBargainOffer(currentRide.totalFare);
                        acceptRide();
                      }}
                      className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Handshake className="w-4 h-4" />
                      <span>Teklifi Kabul Et ({currentRide.totalFare} ₺)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const base = currentRide.originalFare || currentRide.totalFare;
                          const mid = Math.round((base + currentRide.totalFare) / 2);
                          counterBargainOffer(mid, 'Ortasını bulalım usta, iki tarafın da gönlü hoş olsun.');
                        }}
                        className="min-h-[44px] py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-[11px] rounded-xl border border-white/[0.1] flex items-center justify-center active:scale-95 transition-all"
                      >
                        Ortasını Bul ({Math.round(((currentRide.originalFare || currentRide.totalFare) + currentRide.totalFare) / 2)} ₺)
                      </button>

                      <button
                        onClick={rejectRide}
                        className="min-h-[44px] py-2.5 bg-[#FF453A]/15 hover:bg-[#FF453A]/25 text-[#FF453A] font-semibold text-[11px] rounded-xl border border-[#FF453A]/25 flex items-center justify-center active:scale-95 transition-all"
                      >
                        Pas Geç
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={rejectRide}
                      className="min-h-[48px] min-w-[48px] py-3.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-[#8E8E93] hover:text-white font-semibold text-xs rounded-2xl transition-all flex items-center justify-center active:scale-95"
                    >
                      Pas Geç
                    </button>
                    <button
                      onClick={acceptRide}
                      className="min-h-[48px] min-w-[48px] py-3.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-2xl shadow-[0_4px_16px_rgba(48,209,88,0.35)] transition-all flex items-center justify-center active:scale-[0.98]"
                    >
                      KABUL ET
                    </button>
                  </div>
                )}
              </div>
            ) : isAssigned && currentRide && currentRide.status !== 'completed' ? (
              /* ACTIVE TRIP WORKFLOW - Apple Glass Card */
              <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-4.5 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    {currentRide.serviceType.toUpperCase()} · {currentRide.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowDriverChatModal(true)}
                      className="p-2 bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F5F7] border border-white/[0.08] rounded-xl flex items-center gap-1 text-[11px] font-semibold relative active:scale-95 transition-all"
                      title="Yolcu ile Mesajlaş"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Mesaj</span>
                      <span className="w-2 h-2 rounded-full bg-[#0A84FF] absolute -top-0.5 -right-0.5 animate-pulse" />
                    </button>
                    <button
                      onClick={() => setShowDriverVoipModal(true)}
                      className="p-2 bg-[#30D158]/20 hover:bg-[#30D158]/30 text-[#30D158] border border-[#30D158]/30 rounded-xl flex items-center gap-1 text-[11px] font-semibold active:scale-95 transition-all"
                      title="Maskeli Güvenli Arama"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ara</span>
                    </button>
                  </div>
                </div>

                {currentRide.status === 'accepted' && (
                  <div className="space-y-2.5">
                    <button
                      onClick={arriveAtPickup}
                      className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-2xl shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all flex items-center justify-center active:scale-[0.98]"
                    >
                      Alış Noktasına Vardım
                    </button>
                  </div>
                )}

                {currentRide.status === 'arrived' && currentRide.serviceType === 'motosiklet' && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-xs text-[#8E8E93] font-medium block">
                        Yolcunun Biniş Kodunu Girin:
                      </span>
                      <div className="flex justify-center gap-2.5 my-2">
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-2xl bg-[#2C2C2E]/60 border flex items-center justify-center font-mono font-bold text-white text-base transition-all ${
                              pinError
                                ? 'border-[#FF453A] bg-[#FF453A]/10 text-[#FF453A] animate-shake'
                                : 'border-white/[0.12]'
                            }`}
                          >
                            {enteredPin[idx] || '•'}
                          </div>
                        ))}
                      </div>
                      {pinError && (
                        <span className="text-[10px] text-[#FF453A] font-semibold block animate-bounce">
                          Hatalı Kod! Yolcunun ekranındaki 4 haneli kodu isteyiniz.
                        </span>
                      )}
                    </div>

                    {/* Apple iOS Passcode Keypad */}
                    <div className="grid grid-cols-3 gap-2 p-2 bg-[#2C2C2E]/40 rounded-2xl border border-white/[0.06] text-sm font-semibold text-white">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                        <button key={digit} onClick={() => handleKeypadPress(digit)} className="min-h-[44px] py-2.5 hover:bg-white/[0.1] rounded-xl transition-all flex items-center justify-center active:scale-95">
                          {digit}
                        </button>
                      ))}
                      <div />
                      <button onClick={() => handleKeypadPress('0')} className="min-h-[44px] py-2.5 hover:bg-white/[0.1] rounded-xl transition-all flex items-center justify-center active:scale-95">0</button>
                      <button onClick={handleDeletePin} className="min-h-[44px] py-2.5 text-[#8E8E93] hover:text-white flex items-center justify-center active:scale-95">⌫</button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => startTrip(currentRide.boardingCode || '1234')}
                        className="flex-1 min-h-[44px] py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-[#F5F5F7] text-[11px] font-mono font-semibold rounded-xl border border-white/[0.08] flex items-center justify-center"
                      >
                        Otomatik Kodu Gir ({currentRide.boardingCode})
                      </button>
                      <button
                        onClick={handleCompleteDelivery}
                        className="min-h-[44px] py-2.5 px-3 bg-[#30D158]/20 hover:bg-[#30D158]/30 text-[#30D158] text-[11px] font-semibold rounded-xl border border-[#30D158]/30 flex items-center justify-center"
                      >
                        Tamamla
                      </button>
                    </div>
                  </div>
                )}

                {currentRide.status === 'arrived' && currentRide.serviceType !== 'motosiklet' && (
                  <div className="space-y-2.5">
                    <button
                      onClick={() => startTrip('0000')}
                      className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-2xl shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all flex items-center justify-center active:scale-[0.98]"
                    >
                      Paketi Aldım, Yola Çık
                    </button>
                    <p className="text-[10px] text-[#8E8E93] text-center">
                      ℹ️ Çoklu ve tekli teslimatlarda işleme başlamadan önce yola çıkış onayı verilir; tamamlanmamış paket varken görev kapatılamaz.
                    </p>
                  </div>
                )}

                {currentRide.status === 'in_progress' && (
                  <div className="space-y-2.5">
                    {/* Multi-Drop Parcels Delivery Checklist (Apple Grouped List) */}
                    {currentRide.packagesList && currentRide.packagesList.length > 0 && (
                      <div className="p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.08] space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-[#0A84FF]" />
                            <span>
                              Teslimat Noktaları (
                              {currentRide.packagesList.filter((p) => p.status === 'delivered').length}/
                              {currentRide.packagesList.length} Teslim Edildi)
                            </span>
                          </span>
                          <span className="text-[10px] text-[#A1A1A6] font-mono">Çoklu Dağıtım Denetimi</span>
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                          {currentRide.packagesList.map((pkg, pIdx) => (
                            <div
                              key={pkg.id || pIdx}
                              className={`p-2.5 rounded-xl border space-y-1.5 text-xs transition-all ${
                                pkg.status === 'delivered'
                                  ? 'bg-[#30D158]/10 border-[#30D158]/25 text-[#30D158]'
                                  : pkg.status === 'failed'
                                  ? 'bg-[#FF453A]/10 border-[#FF453A]/25 text-[#FF453A]'
                                  : pkg.status === 'returned'
                                  ? 'bg-[#FF9F0A]/10 border-[#FF9F0A]/25 text-[#FF9F0A]'
                                  : 'bg-white/[0.04] border-white/[0.06] text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1 pr-2">
                                  <div className="flex items-center gap-1.5 font-semibold text-[11px] truncate">
                                    <span className="text-white">{pkg.recipientName}</span>
                                    <span className="font-mono text-[10px] text-[#8E8E93]">({pkg.trackingCode})</span>
                                  </div>
                                  <span className="text-[10px] text-[#8E8E93] truncate block">{pkg.dropoffAddress}</span>
                                </div>

                                {pkg.status === 'delivered' && (
                                  <span className="text-[10px] font-semibold text-[#30D158] flex items-center gap-1 shrink-0 bg-[#30D158]/15 px-2 py-0.5 rounded-full border border-[#30D158]/30">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Teslim Edildi</span>
                                  </span>
                                )}
                                {pkg.status === 'failed' && (
                                  <span className="text-[10px] font-semibold text-[#FF453A] flex items-center gap-1 shrink-0 bg-[#FF453A]/15 px-2 py-0.5 rounded-full border border-[#FF453A]/30">
                                    <X className="w-3 h-3" />
                                    <span>Teslim Edilemedi</span>
                                  </span>
                                )}
                                {pkg.status === 'returned' && (
                                  <span className="text-[10px] font-semibold text-[#FF9F0A] flex items-center gap-1 shrink-0 bg-[#FF9F0A]/15 px-2 py-0.5 rounded-full border border-[#FF9F0A]/30">
                                    <RotateCcw className="w-3 h-3" />
                                    <span>İadeye Alındı</span>
                                  </span>
                                )}
                              </div>

                              {(pkg.failureReason || pkg.returnReason) && (
                                <div className="text-[10px] font-mono opacity-80 pl-1 border-l border-white/20">
                                  Kayıt: {pkg.failureReason || pkg.returnReason}
                                </div>
                              )}

                              {(pkg.status === 'pending' || pkg.status === 'in_transit') && (
                                <div className="flex items-center gap-1.5 pt-1 border-t border-white/[0.06]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateDeliveryPackageStatus(currentRide.id, pkg.id, 'delivered', {
                                        verifiedRecipientName: pkg.recipientName,
                                        verificationMethod: 'code',
                                      });
                                      showNotification({
                                        title: 'Paket Teslim Edildi',
                                        message: `${pkg.recipientName} alıcısına ${pkg.trackingCode} kodlu paket teslim edildi.`,
                                        type: 'success',
                                      });
                                    }}
                                    className="flex-1 py-1 px-2 rounded-lg bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-[10px] active:scale-95 transition-all text-center"
                                  >
                                    ✓ Teslim Et
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateDeliveryPackageStatus(currentRide.id, pkg.id, 'failed', {
                                        failureReason: 'Alıcı adreste bulunamadı / ulaşılamadı',
                                      });
                                      showNotification({
                                        title: 'Paket Teslim Edilemedi',
                                        message: `${pkg.trackingCode} kodlu paket 'Alıcı adreste bulunamadı' olarak işaretlendi.`,
                                        type: 'warning',
                                      });
                                    }}
                                    className="py-1 px-2 rounded-lg bg-[#FF453A]/20 hover:bg-[#FF453A]/30 text-[#FF453A] border border-[#FF453A]/40 font-semibold text-[10px] active:scale-95 transition-all"
                                  >
                                    ✕ Edilemedi
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateDeliveryPackageStatus(currentRide.id, pkg.id, 'returned', {
                                        returnReason: 'Gönderici işletmeye geri iade süreci',
                                      });
                                      showNotification({
                                        title: 'İade Süreci Başlatıldı',
                                        message: `${pkg.trackingCode} kodlu paket gönderici işletmeye iade edilmek üzere zimmetlendi.`,
                                        type: 'info',
                                      });
                                    }}
                                    className="py-1 px-2 rounded-lg bg-[#FF9F0A]/20 hover:bg-[#FF9F0A]/30 text-[#FF9F0A] border border-[#FF9F0A]/40 font-semibold text-[10px] active:scale-95 transition-all"
                                  >
                                    ↺ İade
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentRide.serviceType !== 'motosiklet' && (
                      <button
                        onClick={() => setPhotoTaken(true)}
                        className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          photoTaken ? 'bg-[#30D158]/20 border-[#30D158]/40 text-[#30D158]' : 'bg-white/[0.08] border-white/[0.1] text-[#8E8E93] hover:text-white'
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                        <span>{photoTaken ? 'Fotoğraf Kaydedildi ✓' : 'Teslimat Fotoğrafı Çek (PoD)'}</span>
                      </button>
                    )}
                    <button
                      onClick={handleCompleteDelivery}
                      className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-2xl shadow-[0_4px_20px_rgba(48,209,88,0.35)] transition-all flex items-center justify-center active:scale-[0.98]"
                    >
                      {currentRide.serviceType === 'motosiklet'
                        ? `Yolculuğu Bitir (+${currentRide.courierEarnings} ₺)`
                        : `Görevi / Teslimatı Tamamla (+${currentRide.courierEarnings} ₺)`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDriverIssueModal(true)}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      <span>Seferde Sorun Bildir (Kural 3.4)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.1] rounded-[28px] p-4 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#30D158] animate-ping" />
                    <span className="text-[#30D158]">ÇEVRİM İÇİ — BÖLGE TARANIYOR</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0A84FF]">
                    {activeCourier.equipmentMode === 'passenger_and_courier' ? 'Hibrit: Taksi & Kurye (%0 Komisyon)' : 'Kurye & Paket (%0 Komisyon)'}
                  </span>
                </div>

                {/* GAP-03: Sürücü ve Kurye Hibrit Kapasite Dengeleme Algoritması (HybridCapacityEngine) */}
                <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.08] flex items-center justify-between gap-2 text-left">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#30D158]" />
                      <span className="text-[11px] font-bold text-white">
                        Hibrit Kapasite Modu (Yolcu ⇄ Paket)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#30D158]/20 text-[#30D158] font-mono text-[9px] font-bold">
                        +%38 Doluluk
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5">
                      Beşiktaş/Levent paket yoğunluğu %91 · Atıl süreyi sıfırlar
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode =
                        activeCourier.equipmentMode === 'passenger_and_courier'
                          ? 'courier_only'
                          : 'passenger_and_courier';
                      setCourierEquipmentMode(activeCourier.id, nextMode);
                      recordAuditLog({
                        actionType: 'UPDATE',
                        screenName: 'CourierApp/HybridCapacityEngine',
                        recordId: activeCourier.id,
                        previousValue: activeCourier.equipmentMode,
                        newValue: nextMode,
                        justification:
                          'Hibrit Kapasite Dengeleme Algoritması ile yolcu ve paket görevi geçişi yapıldı.',
                      });
                      showNotification({
                        title:
                          nextMode === 'passenger_and_courier'
                            ? 'Hibrit Kapasite Modu Aktif (+%38 Doluluk)'
                            : 'Yalnızca Kurye/Paket Modu Aktif',
                        message:
                          nextMode === 'passenger_and_courier'
                            ? 'Hem Taksi/Yolcu hem de İşletme Paket çağrıları otonom dengeleniyor.'
                            : 'Yalnızca bireysel ve kurumsal paket teslimatı çağrıları alınacak.',
                        type: 'success',
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 cursor-pointer transition-all ${
                      activeCourier.equipmentMode === 'passenger_and_courier'
                        ? 'bg-[#30D158] text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {activeCourier.equipmentMode === 'passenger_and_courier'
                      ? 'Hibrit Açık'
                      : 'Sadece Paket'}
                  </button>
                </div>

                {/* GAP-04: Çok Duraklı (Multi-Drop) Paket Rota Navigasyon Kartı */}
                {batchRoutes.filter((b) => b.status !== 'COMPLETED').length > 0 && (() => {
                  const activeBatch = batchRoutes.find((b) => b.status !== 'COMPLETED')!;
                  return (
                    <div className="p-3 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/30 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#0A84FF]" />
                          Çoklu Paket Rotası ({activeBatch.batchId})
                        </span>
                        <span className="font-mono text-[10px] text-[#30D158] font-bold">
                          Net: {activeBatch.courierNetPayoutTl} ₺ (-%{activeBatch.kmSavedPercent} KM)
                        </span>
                      </div>
                      <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                        {activeBatch.stops.map((st) => (
                          <div
                            key={st.packageId}
                            className="flex items-center justify-between text-[10px] bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/[0.06]"
                          >
                            <span className="text-zinc-200 truncate">
                              #{st.stopOrder} {st.recipientName} (PIN: <strong>{st.pinCode}</strong>)
                            </span>
                            {st.status === 'DELIVERED' ? (
                              <span className="text-[#30D158] font-mono font-bold">Teslim ✓</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setBatchRoutes((prev) =>
                                    prev.map((b) => {
                                      if (b.batchId !== activeBatch.batchId) return b;
                                      const nextStops = b.stops.map((s) =>
                                        s.packageId === st.packageId
                                          ? { ...s, status: 'DELIVERED' as const, podVerified: true }
                                          : s
                                      );
                                      const allDone = nextStops.every((s) => s.status === 'DELIVERED');
                                      return {
                                        ...b,
                                        stops: nextStops,
                                        status: allDone ? 'COMPLETED' : 'DISPATCHED',
                                      };
                                    })
                                  );
                                  showNotification({
                                    title: `Durak #${st.stopOrder} Teslim Edildi (PIN: ${st.pinCode})`,
                                    message: `${st.recipientName} paketi PoD onayı ile tamamlandı.`,
                                    type: 'success',
                                  });
                                }}
                                className="px-2 py-0.5 rounded bg-[#30D158] text-black font-bold cursor-pointer"
                              >
                                PIN Onayla
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDeskDrawerTab('earnings');
                      setShowDriverDeskDrawer(true);
                    }}
                    className="w-full min-h-[48px] py-3 px-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Sürücü Masasını Aç</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TFKS ZİMMET, DEVİR-TESLİM & TELEMETRİ MASASI (Apple Style) */}
      {activeTab === 'zimmet_vardiya' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold text-[#0A84FF] uppercase tracking-wider flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5" />
                <span>TFKS Sınıf 1 & 9: Araç ve Zimmet</span>
              </span>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                courierShift.isShiftActive
                  ? 'bg-[#30D158]/15 border-[#30D158]/30 text-[#30D158]'
                  : 'bg-white/[0.08] border-white/[0.1] text-[#8E8E93]'
              }`}>
                {courierShift.isShiftActive ? '● Aktif Sevk' : '○ Garajda'}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Zimmetli Araç & Vardiya</h2>
            <p className="text-[#8E8E93] text-[11px] leading-relaxed">
              Kural 047-051 uyarınca araç zimmetsiz sahaya çıkamaz; teslim ve iade km/fotoğraf teyidi ile mühürlenir.
            </p>
          </div>

          {/* Assigned Bike Identity Card - Apple Card */}
          <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/15 text-[#0A84FF] border border-[#0071E3]/25 flex items-center justify-center text-xl font-bold">
                  🛵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono text-white tracking-tight">{courierShift.bikePlate}</span>
                    <span className="text-[10px] font-semibold bg-white/[0.08] text-[#F5F5F7] border border-white/[0.1] px-2 py-0.5 rounded-full">
                      Honda PCX 125
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8E8E93] font-mono">
                    Şasi: VN41-88942 · Garaj: Beşiktaş Filo Merkezi
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-3 bg-[#2C2C2E]/50 rounded-2xl border border-white/[0.06]">
                <span className="text-[10px] text-[#8E8E93] block">Zimmet Başlangıç Km</span>
                <span className="text-sm font-bold text-white">{courierShift.startKm} km</span>
              </div>
              <div className="p-3 bg-[#2C2C2E]/50 rounded-2xl border border-white/[0.06]">
                <span className="text-[10px] text-[#8E8E93] block">Güncel Tahmini Km</span>
                <span className="text-sm font-bold text-[#30D158]">{reportedKm} km</span>
              </div>
            </div>

            {/* IoT & Telemetry Sensors */}
            <div className="p-3.5 bg-[#2C2C2E]/40 rounded-2xl border border-white/[0.06] space-y-2">
              <span className="text-[10px] font-semibold text-[#8E8E93] block uppercase tracking-wider">
                Canlı Araç Telemetrisi (CAN-Bus & GPS)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 rounded-xl bg-[#1C1C1E] border border-white/[0.06]">
                  <span className="text-[#8E8E93] block">GPS Sinyali</span>
                  <span className="text-[#30D158] font-semibold">● 14 Uydu</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1C1C1E] border border-white/[0.06]">
                  <span className="text-[#8E8E93] block">ECU / OBD-II</span>
                  <span className="text-white font-semibold">Hatasız</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1C1C1E] border border-white/[0.06]">
                  <span className="text-[#8E8E93] block">Batarya</span>
                  <span className="text-[#0A84FF] font-semibold">%85 Dolu</span>
                </div>
              </div>
            </div>

            {/* Shift Action Control */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E93]">Sayaç Kilometre Güncelle:</span>
                <span className="text-white font-semibold font-mono">+{Math.max(0, reportedKm - courierShift.startKm)} km yapıldı</span>
              </div>
              <input
                type="number"
                value={reportedKm}
                onChange={(e) => setReportedKm(Number(e.target.value))}
                className="w-full p-3 bg-[#2C2C2E]/60 border border-white/[0.1] rounded-2xl text-white font-mono font-bold text-sm focus:outline-none focus:border-[#0A84FF]"
              />

              <div className="p-2.5 bg-[#30D158]/10 border border-[#30D158]/20 rounded-2xl text-[10px] text-[#30D158] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#30D158]" />
                <span>4 Açıdan Hasar & Ekipman Fotoğrafı Sistem Tarafından Doğrulandı (Kural 050)</span>
              </div>

              {courierShift.isShiftActive ? (
                <button
                  onClick={() => {
                    endCourierShift();
                    showNotification({
                      title: 'Vardiya Kapatıldı',
                      message: `Kat edilen mesafe: ${reportedKm - courierShift.startKm} km. Garaj teslim tutanağı audit loga mühürlendi.`,
                      type: 'success',
                    });
                  }}
                  className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-white/[0.1] hover:bg-white/[0.16] border border-white/[0.1] text-white font-bold text-xs rounded-2xl active:scale-[0.98] transition-all shadow-md flex items-center justify-center"
                >
                  Aracı Garaja Teslim Et & Zimmeti Kapat
                </button>
              ) : (
                <button
                  onClick={() => {
                    startCourierShift({ bikePlate: '34 BLY 717', startKm: reportedKm, photosApproved: true });
                    showNotification({
                      title: 'Zimmet Devralındı',
                      message: 'Araç sevk onayı tamamlandı, çağrı radarınız aktif hale getirildi.',
                      type: 'success',
                    });
                  }}
                  className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  Aracı Teslim Al & Göreve Başla (Sevk Onayı)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: TFKS KASA MUTABAKATI & TRAFİK CEZASI YÖNETİMİ (Apple HIG) */}
      {activeTab === 'ceza_kasa' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          {/* Sub Navigation Bar - Apple Segmented Control */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl font-medium text-center">
            <button
              onClick={() => setActiveTab('earnings')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Hakediş
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Seferler
            </button>
            <button
              onClick={() => setActiveTab('ceza_kasa')}
              className="py-1.5 rounded-xl text-[11px] transition-all bg-white text-black font-semibold shadow-sm"
            >
              Kasa & Ceza
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Kasa & Trafik Cezaları</h2>
            <p className="text-[#8E8E93] text-[11px] leading-relaxed">
              Motosiklet yolcularından elden alınan nakit tahsilatın garaj kasasına devri ve tebliğ edilen trafik cezaları.
            </p>
          </div>

          {/* Section 1: Cash in Hand & Vault Delivery */}
          <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#30D158]" />
                <span className="font-semibold text-white text-xs">Eldeki Nakit Yolcu Tahsilatı</span>
              </div>
              <span className="text-[10px] font-mono text-[#FF9F0A] font-semibold bg-[#FF9F0A]/15 px-2.5 py-0.5 rounded-full border border-[#FF9F0A]/30">
                Günlük Kapanış Zorunlu
              </span>
            </div>

            <div className="p-4 bg-[#2C2C2E]/50 rounded-2xl border border-white/[0.06] text-center space-y-1">
              <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Devredilecek Nakit Bakiye</span>
              <div className="text-3xl font-bold font-mono text-[#30D158]">{courierCashInHand} ₺</div>
              <span className="text-[10px] text-[#8E8E93] block">Beşiktaş Garaj Kasasına elden teslim edilmelidir.</span>
            </div>

            <div className="p-3 bg-[#2C2C2E]/40 rounded-2xl border border-white/[0.06] font-mono text-[10px] space-y-1.5">
              <div className="flex justify-between text-[#8E8E93]">
                <span>Teslim Edilecek Kasa:</span>
                <strong className="text-white">Beşiktaş Operasyon Kasası (KASA-02)</strong>
              </div>
              <div className="flex justify-between text-[#8E8E93]">
                <span>Kasa Sorumlusu:</span>
                <span className="text-white">Ahmet Şen (Vardiya Amiri)</span>
              </div>
            </div>

            {cashHandinSuccess ? (
              <div className="p-3 bg-[#30D158]/15 border border-[#30D158]/30 rounded-2xl text-[#30D158] text-center font-semibold text-xs">
                Nakit Teslim Fişi Oluşturuldu! Kasa Yetkilisi Onayı Bekleniyor.
              </div>
            ) : (
              <button
                onClick={() => {
                  setCashHandinSuccess(true);
                  setTimeout(() => setCashHandinSuccess(false), 3000);
                }}
                className="w-full py-3 bg-[#30D158] hover:bg-[#34C759] text-black font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all text-xs"
              >
                {courierCashInHand} ₺ Kasaya Devret & Mühürlü Tutanak Üret
              </button>
            )}
          </div>

          {/* Section 2: Traffic Penalties */}
          <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FF453A]" />
                <span className="font-semibold text-white text-xs">Tebliğ Edilen Trafik Cezaları</span>
              </div>
              <span className="text-[10px] font-mono text-[#FF453A] font-semibold bg-[#FF453A]/15 px-2.5 py-0.5 rounded-full border border-[#FF453A]/30">
                {courierPenalties.filter(p => p.status === 'unpaid').length} Açık Ceza
              </span>
            </div>

            <p className="text-[10px] text-[#8E8E93]">
              Kural 057-059: Tebliğ tarihi sistemde kayıtlıdır; 15 gün içinde ödenirse %25 indirim uygulanır.
            </p>

            <div className="space-y-2">
              {courierPenalties.map((pen) => (
                <div key={pen.id} className="p-3 bg-[#2C2C2E]/50 rounded-2xl border border-white/[0.06] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-white">{pen.code}</span>
                    <span className="text-[9px] text-[#FF9F0A] font-mono font-semibold bg-[#FF9F0A]/15 px-2 py-0.5 rounded-full border border-[#FF9F0A]/30">
                      11 Gün Kalan İndirim
                    </span>
                  </div>
                  <div className="text-[11px] text-[#F5F5F7] font-medium">{pen.title}</div>
                  <div className="text-[10px] text-[#8E8E93] font-mono">
                    Plaka: {pen.plate} · Tebliğ: EGM-{pen.id}
                  </div>
                  <div className="flex justify-between items-center font-mono pt-1 border-t border-white/[0.06]">
                    <span className="line-through text-[#636366] text-[11px]">{pen.fullAmount} ₺</span>
                    <span className="text-[#30D158] font-bold text-xs">{pen.discountedAmount} ₺ (%25 İndirimli)</span>
                  </div>

                  {pen.status === 'unpaid' ? (
                    <button
                      onClick={() => {
                        payCourierPenalty(pen.id);
                        showNotification({
                          title: 'Trafik Cezası Ödendi',
                          message: 'Ceza %25 erken ödeme indirimi uygulanarak kurye hakediş bakiyenizden tahsil edildi.',
                          type: 'success',
                        });
                      }}
                      className="w-full py-2 bg-white/[0.1] hover:bg-white/[0.16] border border-white/[0.1] text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
                    >
                      İndirimli Hakedişten Öde ({pen.discountedAmount} ₺)
                    </button>
                  ) : (
                    <div className="p-1.5 bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] text-center font-semibold text-[10px] rounded-xl">
                      Tahsil Edildi & Ödendi ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EARNINGS & SHIFT (Apple HIG) */}
      {activeTab === 'earnings' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          {/* Sub Navigation Bar */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl font-medium text-center">
            <button
              onClick={() => setActiveTab('earnings')}
              className="py-1.5 rounded-xl text-[11px] transition-all bg-white text-black font-semibold shadow-sm"
            >
              Hakediş
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Seferler
            </button>
            <button
              onClick={() => setActiveTab('ceza_kasa')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Kasa & Ceza
            </button>
          </div>

          <PerformanceSummary />

          {/* Cashout IBAN trigger - Apple Pay Sheet look */}
          <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-[28px] border border-white/[0.08] space-y-2 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-white block">Kayıtlı IBAN Hesabı</span>
                <span className="font-mono text-[#8E8E93] text-[11px]">TR42 0006 2000 0001 2345 6789 01</span>
              </div>
              <button
                onClick={handleCashout}
                className="min-h-[48px] min-w-[48px] px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center"
              >
                Hemen Çek
              </button>
            </div>
            {cashoutSuccess && (
              <div className="p-2.5 bg-[#30D158]/15 border border-[#30D158]/30 rounded-xl text-[11px] text-[#30D158] font-medium">
                Transfer talebi alındı. FAST ile 15 dakika içinde hesabınıza geçecektir.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TRIPS MANIFEST (Apple HIG) */}
      {activeTab === 'trips' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-3 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          {/* Sub Navigation Bar */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl font-medium text-center">
            <button
              onClick={() => setActiveTab('earnings')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Hakediş
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className="py-1.5 rounded-xl text-[11px] transition-all bg-white text-black font-semibold shadow-sm"
            >
              Seferler
            </button>
            <button
              onClick={() => setActiveTab('ceza_kasa')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Kasa & Ceza
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono font-semibold text-[#0A84FF] uppercase tracking-wider">
              Sefer Kayıtları
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Tamamlanan İşler</h2>
          </div>

          <div className="space-y-2">
            {[
              { id: 'BLS-9481', type: 'Motosiklet', from: 'Beşiktaş', to: 'Levent', net: '202.72 ₺', time: '14:20' },
              { id: 'BLS-9479', type: 'Motokurye', from: 'Kadıköy', to: 'Moda', net: '113.76 ₺', time: '12:45' },
              { id: 'BLS-9475', type: 'Motosiklet', from: 'Şişli', to: 'Maslak', net: '185.00 ₺', time: '10:15' },
              { id: 'BLS-9470', type: 'Motosiklet', from: 'Üsküdar', to: 'Kadıköy', net: '130.40 ₺', time: '09:00' },
            ].map((item) => (
              <div key={item.id} className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] flex justify-between items-center shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white">{item.type}</span>
                    <span className="text-[#8E8E93] font-mono text-[10px]">· {item.id}</span>
                  </div>
                  <div className="text-[#8E8E93] text-[11px]">{item.from} → {item.to} ({item.time})</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-[#30D158] text-sm">{item.net}</div>
                  <span className="text-[9px] text-[#8E8E93]">Hesaba Geçti</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VIP PASSENGERS (Apple HIG) */}
      {activeTab === 'passengers' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          {/* Sub Navigation Bar */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl font-medium text-center">
            <button
              onClick={() => setActiveTab('documents')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Belgeler
            </button>
            <button
              onClick={() => setActiveTab('passengers')}
              className="py-1.5 rounded-xl text-[11px] transition-all bg-white text-black font-semibold shadow-sm"
            >
              Yolcularım
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Ayarlar
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold text-[#FF9F0A] uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-[#FF9F0A]" />
                <span>VIP Sadakat Kulübü</span>
              </span>
              <span className="text-[9px] font-mono text-[#30D158] bg-[#30D158]/15 px-2.5 py-0.5 rounded-full border border-[#30D158]/30 font-semibold">
                +%5 Sürücü Primi
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Yolcularım & Doğrudan İletişim</h2>
            <p className="text-[#8E8E93] text-[11px] leading-relaxed">
              Sizi favori sürücü seçen yolcularla doğrudan iletişim kurabilir, randevuları teyit edebilirsiniz.
            </p>
          </div>

          {/* Passenger Card & Direct Thread */}
          {(() => {
            const chatMessagesList = directChats[activeCourier.id] || [];

            return (
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/20 border border-[#0071E3]/30 text-[#0A84FF] font-bold text-sm flex items-center justify-center shadow-sm">
                      BI
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white">Bedirhan İbanoğlu</span>
                        <span className="text-[9px] text-[#FF453A] font-medium bg-[#FF453A]/15 px-2 py-0.5 rounded-full border border-[#FF453A]/25 flex items-center gap-0.5">
                          <Heart className="w-2.5 h-2.5 fill-current text-[#FF453A]" />
                          <span>Düzenli Yolcunuz</span>
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8E8E93] font-mono">
                        18 Tamamlanan Sefer · ★ 5.0 Puan
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#0A84FF] font-semibold bg-[#0071E3]/15 px-2.5 py-1 rounded-full border border-[#0071E3]/30">
                    Öncelikli Hat
                  </span>
                </div>

                <div className="h-44 overflow-y-auto space-y-2 p-2.5 bg-[#2C2C2E]/40 rounded-2xl border border-white/[0.06] text-[11px]">
                  {chatMessagesList.length === 0 ? (
                    <div className="text-center py-6 text-[#8E8E93]">
                      Henüz mesajlaşma geçmişi bulunmuyor.
                    </div>
                  ) : (
                    chatMessagesList.map((msg) => {
                      const isDriver = msg.sender === 'courier';
                      return (
                        <div key={msg.id} className={`flex flex-col ${isDriver ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-[9px] text-[#8E8E93] font-medium">{msg.senderName}</span>
                            <span className="text-[8px] text-[#636366] font-mono">{msg.timestamp}</span>
                          </div>

                          <div
                            className={`max-w-[85%] px-3 py-1.5 rounded-2xl text-xs shadow-sm ${
                              isDriver
                                ? 'bg-[#0071E3] text-white font-medium rounded-tr-none'
                                : 'bg-[#2C2C2E] text-white border border-white/[0.08] rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>

                          {isDriver && (
                            <span className="text-[8px] text-[#8E8E93] mt-0.5 font-mono">
                              {msg.status === 'read' ? 'Okundu ✓✓' : 'İletildi ✓'}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!driverDirectReply.trim()) return;
                    sendDirectMessageToCourier(activeCourier.id, driverDirectReply.trim(), { sender: 'courier' });
                    setDriverDirectReply('');
                  }}
                  className="flex gap-2 pt-1 border-t border-white/[0.06]"
                >
                  <input
                    type="text"
                    value={driverDirectReply}
                    onChange={(e) => setDriverDirectReply(e.target.value)}
                    placeholder="Yolcuya doğrudan mesaj yazın..."
                    className="flex-1 bg-[#2C2C2E]/60 border border-white/[0.1] rounded-2xl px-3 py-2 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#0A84FF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-2xl shadow-md active:scale-95 transition-all"
                  >
                    Gönder
                  </button>
                </form>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: KYC DOCUMENTS (Apple HIG) */}
      {activeTab === 'documents' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          {/* Sub Navigation Bar */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl font-medium text-center">
            <button
              onClick={() => setActiveTab('documents')}
              className="py-1.5 rounded-xl text-[11px] transition-all bg-white text-black font-semibold shadow-sm"
            >
              Belgeler
            </button>
            <button
              onClick={() => setActiveTab('passengers')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Yolcularım
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Ayarlar
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Sürücü Belgelerim</h2>
          </div>

          <div className="space-y-2">
            {[
              { title: 'A Sınıfı Ehliyet', sub: 'Ön ve Arka Yüz Taraması' },
              { title: `Motosiklet Ruhsatı (${activeCourier.plate})`, sub: activeCourier.motorcycle },
              { title: 'Zorunlu Mali Mesuliyet Sigortası', sub: 'Poliçe Bitiş: 15.08.2027' },
              { title: 'Adli Sicil Kaydı (e-Devlet)', sub: 'Barkodlu Resmi Belge' },
            ].map((doc, idx) => (
              <div key={idx} className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] flex justify-between items-center shadow-sm">
                <div>
                  <span className="font-semibold text-white block">{doc.title}</span>
                  <span className="text-[10px] text-[#8E8E93]">{doc.sub}</span>
                </div>
                <span className="px-2.5 py-1 bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] text-[10px] font-semibold rounded-full">
                  Onaylı ✓
                </span>
              </div>
            ))}

            {/* Kural 3.1: Hizmet Yetkileri */}
            <div className="pt-3 space-y-2 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono font-semibold text-[#8E8E93] uppercase tracking-wider block">
                Hizmet Yetkisi & Güvenlik Onayları (Kural 3.1)
              </span>

              <div className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] flex justify-between items-center shadow-sm">
                <div>
                  <span className="font-semibold text-white block">Yolcu Hizmeti Yetkisi (Beni Götür)</span>
                  <span className="text-[10px] text-[#8E8E93]">Yolcu kaskı ve onaylı ehliyet gereklidir</span>
                </div>
                <span className={`px-2.5 py-1 border text-[10px] font-semibold rounded-full ${
                  activeCourier.permissions.passengerServiceApproved
                    ? 'bg-[#30D158]/15 border-[#30D158]/30 text-[#30D158]'
                    : 'bg-white/[0.08] border-white/[0.1] text-[#8E8E93]'
                }`}>
                  {activeCourier.permissions.passengerServiceApproved ? 'Yolcu Yetkisi Aktif ✓' : 'İncelemede'}
                </span>
              </div>

              <div className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] flex justify-between items-center shadow-sm">
                <div>
                  <span className="font-semibold text-white block">Kurye Hizmeti Yetkisi (Paket Gönderimi)</span>
                  <span className="text-[10px] text-[#8E8E93]">Çanta/kutu ve taşıma standartları onayı</span>
                </div>
                <span className="px-2.5 py-1 bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] text-[10px] font-semibold rounded-full">
                  Kurye Yetkisi Aktif ✓
                </span>
              </div>

              <div className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] flex justify-between items-center shadow-sm">
                <div>
                  <span className="font-semibold text-white block">TFKS / İBB Resmi Doğrulaması</span>
                  <span className="text-[10px] text-[#8E8E93]">Resmi belediye/bakanlık sistem entegrasyonu</span>
                </div>
                <span className="px-2.5 py-1 bg-white/[0.08] border border-white/[0.1] text-[#8E8E93] text-[10px] font-mono rounded-full">
                  [Faz 2 Entegrasyon]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS (Apple HIG) */}
      {activeTab === 'settings' && (
        <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 bg-[#0A0A0C] text-[#F5F5F7] text-xs">
          {/* Sub Navigation Bar */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl font-medium text-center">
            <button
              onClick={() => setActiveTab('documents')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Belgeler
            </button>
            <button
              onClick={() => setActiveTab('passengers')}
              className="py-1.5 rounded-xl text-[11px] transition-all text-[#8E8E93] hover:text-white"
            >
              Yolcularım
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="py-1.5 rounded-xl text-[11px] transition-all bg-white text-black font-semibold shadow-sm"
            >
              Ayarlar
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Çalışma Tercihleri</h2>
          </div>

          <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-[28px] border border-white/[0.08] space-y-3 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-white block">Eve Dönüş Modu</span>
                <span className="text-[10px] text-[#8E8E93]">Yalnızca evime doğru giden çağrıları eşle</span>
              </div>
              <button
                type="button"
                onClick={() => setHomeBoundMode(!homeBoundMode)}
                className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                  homeBoundMode ? 'bg-[#30D158]' : 'bg-[#39393D]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    homeBoundMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {homeBoundMode && (
              <div className="pt-2 border-t border-white/[0.06]">
                <label className="text-[10px] text-[#8E8E93] font-medium mb-1 block">Kayıtlı Ev Adresiniz</label>
                <input
                  type="text"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full bg-[#2C2C2E]/60 border border-white/[0.1] rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none focus:border-[#0A84FF]"
                />
              </div>
            )}
          </div>

          <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-[28px] border border-white/[0.08] space-y-3 shadow-xl">
            <span className="font-semibold text-white block">Varsayılan Navigasyon</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedNav('internal')}
                className={`p-3 rounded-2xl text-center font-semibold transition-all border ${
                  selectedNav === 'internal'
                    ? 'bg-white border-white text-black shadow-md'
                    : 'bg-[#2C2C2E]/40 border-white/[0.08] text-[#8E8E93]'
                }`}
              >
                Dahili Vektörel Harita
              </button>
              <button
                type="button"
                onClick={() => setSelectedNav('external')}
                className={`p-3 rounded-2xl text-center font-semibold transition-all border ${
                  selectedNav === 'external'
                    ? 'bg-white border-white text-black shadow-md'
                    : 'bg-[#2C2C2E]/40 border-white/[0.08] text-[#8E8E93]'
                }`}
              >
                Apple Maps / Google
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SÜRÜCÜ MASASI - SLIDE-UP APPLE BOTTOM DRAWER (HERO RADAR COMPANION)        */}
      {/* ========================================================================= */}
      {showDriverDeskDrawer && (
        <div className="absolute inset-x-0 bottom-0 z-50 flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 animate-in fade-in duration-200"
            onClick={() => setShowDriverDeskDrawer(false)}
          />

          {/* Drawer Container */}
          <div className="bg-[#161618]/98 backdrop-blur-2xl border-t border-white/[0.12] rounded-t-[32px] p-4 pb-20 shadow-2xl max-h-[82vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 text-xs">
            {/* Drag Pill Handle */}
            <div
              className="w-12 h-1.5 bg-white/25 rounded-full mx-auto mb-3 cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => setShowDriverDeskDrawer(false)}
            />

            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/15 border border-[#0071E3]/30 text-[#0A84FF] flex items-center justify-center font-bold text-base shadow-sm">
                  <Wallet className="w-5 h-5 text-[#0A84FF]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Sürücü Masası</h3>
                  <span className="text-[11px] text-[#8E8E93] font-mono">
                    {activeCourier.plate} · {courierShift.bikePlate}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDriverDeskDrawer(false)}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors active:scale-95"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tab Switcher - Clean Icons & Text */}
            <div className="grid grid-cols-6 gap-1 p-1 my-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] text-[10px] font-semibold">
              {[
                { id: 'earnings', label: 'Kazanç', icon: Coins },
                { id: 'quests', label: 'Görev', icon: Target },
                { id: 'shift', label: 'Zimmet', icon: Bike },
                { id: 'cash', label: 'Nakit', icon: DollarSign },
                { id: 'penalties', label: 'Cezalar', icon: AlertTriangle },
                { id: 'profile', label: 'Profil', icon: Settings },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDeskDrawerTab(tab.id as any)}
                    className={`py-2 rounded-xl text-center transition-all flex flex-col items-center gap-1 ${
                      deskDrawerTab === tab.id
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="text-[10px] truncate max-w-full">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: KAZANÇ */}
            {deskDrawerTab === 'earnings' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#8E8E93]">
                    <span>Bugünkü Net Hakediş</span>
                    <span className="text-[#30D158] font-bold">14 Görev Tamamlandı</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-display">2,840 ₺</span>
                    <span className="text-xs font-semibold text-[#30D158]">+180 ₺ Bahşiş Dahil</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCashout}
                  className="w-full min-h-[48px] py-3.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{cashoutSuccess ? 'Hesabınıza Aktarıldı' : 'Hakedişi Banka Hesabıma Aktar (Anında Çek)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('earnings');
                    setShowDriverDeskDrawer(false);
                  }}
                  className="w-full py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-[#0A84FF] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Tüm Detaylı Kazanç ve Rapor Sayfasını Aç →</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: GÖREVLER & TEŞVİKLER (QUESTS & REFERRALS) */}
            {deskDrawerTab === 'quests' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Active Quests */}
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#30D158]" />
                      <span>Aktif Sefer Hedefleri (Quests)</span>
                    </span>
                    <span className="text-[10px] text-[#8E8E93]">Haftalık Prim</span>
                  </div>

                  <div className="space-y-2.5">
                    {driverQuests.map((quest) => {
                      const completed = quest.currentCompletedTrips || 0;
                      const isDone = completed >= quest.targetTrips;
                      const progressPct = Math.min(100, Math.round((completed / quest.targetTrips) * 100));

                      return (
                        <div
                          key={quest.id}
                          className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{quest.title}</span>
                            <span className="font-mono font-bold text-[#30D158]">
                              +{quest.bonusAmountLira} ₺
                            </span>
                          </div>

                          <p className="text-[11px] text-[#8E8E93] leading-relaxed">{quest.description}</p>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-[#8E8E93]">
                              <span>İlerleme: {completed} / {quest.targetTrips} Sefer</span>
                              <span>%{progressPct}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                              <div
                                className="h-full bg-[#30D158] transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>

                          {isDone && !quest.isClaimed && (
                            <button
                              type="button"
                              onClick={() => {
                                claimDriverQuestBonus(quest.id);
                                showNotification({
                                  title: 'Görev Primi Cüzdanınıza Yüklendi',
                                  message: `${quest.bonusAmountLira} ₺ başarı primi hakedişinize aktarıldı!`,
                                  type: 'success',
                                });
                              }}
                              className="w-full py-2 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                            >
                              +{quest.bonusAmountLira} ₺ Bonusu Cüzdana Aktar
                            </button>
                          )}

                          {quest.isClaimed && (
                            <span className="text-[10px] text-[#30D158] font-bold block text-center">
                              Ödül Cüzdana Eklendi
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Driver-to-Driver Referral */}
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0A84FF]" />
                    <h4 className="font-bold text-white text-xs">Kurye Arkadaşını Davet Et (300 ₺ Kazan)</h4>
                  </div>
                  <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                    Referans kodunla MotoPilot ailesine katılan her yeni kurye ilk 10 seferini tamamladığında,
                    300 ₺ anında cüzdanına eklenir.
                  </p>

                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8E8E93] block">Özel Sürücü Davet Kodun:</span>
                      <span className="text-sm font-mono font-bold text-[#0A84FF]">
                        {driverReferralCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(driverReferralCode);
                        showNotification({
                          title: 'Davet Kodu Kopyalandı',
                          message: `'${driverReferralCode}' kopyalandı. Sürücü arkadaşlarınla paylaşabilirsin!`,
                          type: 'success',
                        });
                      }}
                      className="px-3 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopyala</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ZİMMET & VARDİYA */}
            {deskDrawerTab === 'shift' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white font-mono block">{courierShift.bikePlate}</span>
                      <span className="text-[11px] text-[#8E8E93]">Honda PCX 125 · Zimmetli Araç</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      courierShift.isShiftActive
                        ? 'bg-[#30D158]/15 border-[#30D158]/30 text-[#30D158]'
                        : 'bg-white/[0.08] border-white/[0.1] text-[#8E8E93]'
                    }`}>
                      {courierShift.isShiftActive ? '● Aktif Vardiya' : '○ Mola / Kapalı'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/[0.06]">
                    <div>
                      <span className="text-[#8E8E93] text-[10px] block">Başlangıç Km</span>
                      <span className="font-mono text-white font-bold">{courierShift.startKm.toLocaleString()} km</span>
                    </div>
                    <div>
                      <span className="text-[#8E8E93] text-[10px] block">Depo / Şarj Seviyesi</span>
                      <span className="font-mono text-[#30D158] font-bold">%85 (OBD Telemetri)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowShiftModal(true)}
                    className="min-h-[48px] py-3 px-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Zimmet İşlemi Yap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (courierShift.isShiftActive) {
                        endCourierShift();
                      } else {
                        startCourierShift({
                          bikePlate: courierShift.bikePlate,
                          startKm: reportedKm,
                          photosApproved: true,
                        });
                      }
                    }}
                    className={`min-h-[48px] py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
                      courierShift.isShiftActive
                        ? 'bg-[#FF453A]/15 border-[#FF453A]/30 text-[#FF453A] hover:bg-[#FF453A]/25'
                        : 'bg-[#30D158]/15 border-[#30D158]/30 text-[#30D158] hover:bg-[#30D158]/25'
                    }`}
                  >
                    <span>{courierShift.isShiftActive ? 'Vardiyayı Kapat' : 'Vardiya Başlat'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: KASA & NAKİT */}
            {deskDrawerTab === 'cash' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#8E8E93]">
                    <span>Kuryede Biriken Nakit</span>
                    <span className="font-mono text-zinc-400">Limit: 3,000 ₺</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#30D158] font-display">{courierCashInHand} ₺</span>
                    <span className="text-xs text-[#8E8E93]">Devir bekleniyor</span>
                  </div>
                  <p className="text-[10px] text-[#8E8E93] leading-relaxed pt-1">
                    Nakit tahsil edilen siparişlerin bedeli gün sonunda şirket kasasına veya anlaşmalı banka ATM'sine teslim edilir.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCashHandinModal(true)}
                  className="w-full min-h-[48px] py-3.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Coins className="w-4 h-4" />
                  <span>Şube Kasasına Nakit Devir Et</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: CEZALAR & PUAN */}
            {deskDrawerTab === 'penalties' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8E8E93] uppercase font-bold block">Güvenlik Skoru</span>
                    <span className="text-2xl font-extrabold text-[#30D158] font-display">98 / 100</span>
                    <span className="text-[10px] text-zinc-400 block">Kusursuz Sürüş Rozeti Sahibi</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8E8E93] block">Ödenmemiş Ceza</span>
                    <span className="text-xl font-bold font-mono text-[#FF453A]">
                      {courierPenalties.filter(p => p.status === 'unpaid').length} Adet
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {courierPenalties.map((pen) => (
                    <div
                      key={pen.id}
                      className="p-3 bg-[#2C2C2E]/40 border border-white/[0.06] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-white text-xs block">{pen.title}</span>
                        <span className="text-[10px] text-[#8E8E93]">{pen.date} · {pen.discountedAmount} ₺</span>
                      </div>
                      {pen.status === 'unpaid' ? (
                        <button
                          type="button"
                          onClick={() => payCourierPenalty(pen.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#FF453A]/20 hover:bg-[#FF453A]/30 text-[#FF453A] border border-[#FF453A]/30 font-bold text-xs active:scale-95 transition-all"
                        >
                          Öde ({pen.discountedAmount} ₺)
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-[#30D158] px-2 py-0.5 bg-[#30D158]/15 rounded">
                          Ödendi ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROFİL & YETKİLER */}
            {deskDrawerTab === 'profile' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-xl">
                      <Bike className="w-6 h-6 text-[#0A84FF]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{activeCourier.name}</h4>
                      <span className="text-[11px] text-[#8E8E93] flex items-center gap-1">
                        <span>{activeCourier.phone}</span>
                        <span>·</span>
                        <Star className="w-3 h-3 text-[#FF9F0A] fill-[#FF9F0A]" />
                        <span className="text-white font-bold">{activeCourier.rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Duty Mode Box */}
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8E8E93] block">Aktif Görev Modu</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        {activeCourier.equipmentMode === 'passenger_and_courier' ? (
                          <>
                            <Bike className="w-3.5 h-3.5 text-[#30D158]" />
                            <span>Taksi & Paket (%0 Komisyon)</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-3.5 h-3.5 text-[#0A84FF]" />
                            <span>Kurye & Paket (%0 Komisyon)</span>
                          </>
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDriverDeskDrawer(false);
                        setShowDutySelectionModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-xs font-semibold text-white transition-all active:scale-95"
                    >
                      Değiştir
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[#8E8E93] text-[10px] block">Yolcu Kaskı</span>
                      <span className="font-bold text-white">
                        {activeCourier.permissions.hasPassengerHelmet ? 'Mevcut' : 'Eksik'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-[#8E8E93] text-[10px] block">A Sınıfı Yetki</span>
                      <span className="font-bold text-[#30D158]">Onaylı</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLaunchMatrixModal(true)}
                  className="w-full min-h-[44px] py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-[#F5F5F7] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Rocket className="w-4 h-4 text-[#0A84FF]" />
                  <span>Lansman & Faz Stratejisi</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SADE VE GÖZ YORMAYAN SÜRÜCÜ DOKU (APPLE HIG & GETİR/UBER STİLİ) */}
      <nav className="absolute inset-x-0 bottom-0 h-16 bg-[#161618]/95 backdrop-blur-2xl border-t border-white/[0.08] z-30 grid grid-cols-3 items-center px-4 pb-2 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('cockpit');
            setShowDriverDeskDrawer(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-all ${
            activeTab === 'cockpit' && !showDriverDeskDrawer ? 'text-[#0A84FF] font-bold scale-105' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">Kokpit</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDeskDrawerTab('quests');
            setShowDriverDeskDrawer(true);
          }}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-all ${
            showDriverDeskDrawer && deskDrawerTab === 'quests' ? 'text-[#0A84FF] font-bold scale-105' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <Target className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">Hedef & Teşvik</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowDriverDeskDrawer(!showDriverDeskDrawer);
          }}
          className={`flex flex-col items-center justify-center gap-1 h-full transition-all ${
            showDriverDeskDrawer && deskDrawerTab !== 'quests' ? 'text-[#0A84FF] font-bold scale-105' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <div className="relative">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
            <span className="w-2 h-2 rounded-full bg-[#0A84FF] absolute -top-0.5 -right-1 animate-pulse" />
          </div>
          <span className="text-[10px]">Sürücü Masası</span>
        </button>
      </nav>

      {/* Driver In-App Live Shared Chat Modal (Apple iOS Messages Style) */}
      {showDriverChatModal && currentRide && (
        <div className="absolute inset-x-2 bottom-16 top-12 z-50 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/20 border border-[#0071E3]/30 flex items-center justify-center text-lg text-[#0A84FF] font-bold shadow-sm">
                👤
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-white">{currentRide.customerName}</h4>
                  <span className="text-[9px] text-[#0A84FF] font-semibold bg-[#0071E3]/15 px-2 py-0.5 rounded-full border border-[#0071E3]/25">
                    Yolcu
                  </span>
                </div>
                <span className="text-[10px] text-[#8E8E93] font-mono">Biniş Kodu: {currentRide.boardingCode}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setShowDriverChatModal(false);
                  setShowDriverVoipModal(true);
                }}
                className="px-3 py-1.5 bg-[#30D158]/20 hover:bg-[#30D158]/30 text-[#30D158] border border-[#30D158]/30 rounded-xl flex items-center gap-1 text-[11px] font-semibold transition-all active:scale-95"
                title="Maskeli Santral Arama"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ara</span>
              </button>
              <button onClick={() => setShowDriverChatModal(false)} className="p-2 text-[#8E8E93] hover:text-white rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Helmet Intercom Toggle Strip */}
          <div className="mt-2 p-2.5 bg-[#2C2C2E]/50 border border-white/[0.06] rounded-2xl flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 text-[#F5F5F7]">
              <span className={`w-2 h-2 rounded-full ${helmetTtsActive ? 'bg-[#30D158] animate-pulse' : 'bg-[#636366]'}`} />
              <span className="font-medium">Kask İnterkomu (Cardo/Sena TTS)</span>
            </div>
            <button
              onClick={toggleHelmetTts}
              className={`px-3 py-1 rounded-xl font-semibold font-mono text-[9px] transition-colors ${
                helmetTtsActive
                  ? 'bg-[#30D158] text-black shadow-sm'
                  : 'bg-white/[0.08] text-[#8E8E93] hover:text-white border border-white/[0.08]'
              }`}
            >
              {helmetTtsActive ? '🔊 Aktif (Sesli Oku)' : '🔇 Kapalı'}
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-2.5 p-2.5 my-1.5 bg-[#2C2C2E]/30 rounded-2xl text-xs border border-white/[0.06]">
            {chatMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-1.5">
                    <div className="px-3 py-1 bg-white/[0.06] border border-white/[0.06] rounded-full text-[10px] text-[#8E8E93] font-mono text-center max-w-[90%]">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              const isCourier = msg.sender === 'courier';
              return (
                <div key={msg.id} className={`flex flex-col ${isCourier ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9px] text-[#8E8E93] font-medium">{msg.senderName}</span>
                    <span className="text-[8px] text-[#636366] font-mono">{msg.timestamp}</span>
                  </div>

                  {msg.isVoiceNote ? (
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-xs shadow-md flex items-center gap-3 border ${
                        isCourier
                          ? 'bg-[#0071E3] text-white rounded-tr-none border-[#0071E3]'
                          : 'bg-[#2C2C2E] text-[#F5F5F7] border-white/[0.08] rounded-tl-none'
                      }`}
                    >
                      <button
                        onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCourier ? 'bg-white text-black' : 'bg-[#0071E3] text-white'
                        }`}
                      >
                        {playingVoiceId === msg.id ? '⏸' : '▶'}
                      </button>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <div className={`w-1 h-3 rounded-full ${playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/40'}`} />
                          <div className={`w-1 h-5 rounded-full ${playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/40'}`} />
                          <div className={`w-1 h-2 rounded-full ${playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/40'}`} />
                          <div className={`w-1 h-4 rounded-full ${playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/40'}`} />
                          <div className={`w-1 h-2.5 rounded-full ${playingVoiceId === msg.id ? 'bg-white animate-pulse' : 'bg-white/40'}`} />
                        </div>
                        <span className="text-[9px] font-mono opacity-80">
                          {isCourier ? 'Telsiz Sesli Notu (0:04)' : 'Yolcu Sesli Notu (0:04)'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs shadow-sm ${
                        isCourier
                          ? 'bg-[#0071E3] text-white font-medium rounded-tr-none'
                          : 'bg-[#2C2C2E] text-[#F5F5F7] border border-white/[0.08] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {isCourier && (
                    <span className="text-[8px] text-[#8E8E93] mt-0.5 font-medium">
                      {msg.status === 'read' ? 'Okundu ✓✓' : 'İletildi ✓'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Glove-Friendly Quick Cards */}
          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between text-[10px] text-[#8E8E93] px-1 font-medium">
              <span>Eldivenle Tek Dokunuşlu Hızlı Yanıtlar:</span>
              <button
                type="button"
                onClick={() => setManualTypingAllowed(!manualTypingAllowed)}
                className="text-[#0A84FF] hover:underline font-mono text-[9px]"
              >
                {manualTypingAllowed ? 'Eldiven Moduna Dön' : '🅿️ Park Ettim (Klavyeyi Aç)'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
              {TACTICAL_GLOVE_REPLIES.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendChatMessage('courier', item.text)}
                  className="p-2 bg-[#2C2C2E]/60 hover:bg-[#2C2C2E] border border-white/[0.08] hover:border-white/[0.14] rounded-xl text-left text-white transition-all flex items-center gap-2 group active:scale-95"
                >
                  <span className="text-sm shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold truncate leading-tight">{item.title}</span>
                    <span className="block text-[8px] text-[#8E8E93] truncate">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

            {/* PTT Walkie Talkie & Safety Strip - Min 48px Touch Target */}
            <div className="pt-2 border-t border-white/[0.08] space-y-2">
              <button
                type="button"
                onClick={handlePttWalkieTalkie}
                className="w-full min-h-[48px] min-w-[48px] py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Bas-Konuş Telsiz Mesajı Gönder (PTT)</span>
              </button>

            {manualTypingAllowed ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!driverChatMessage.trim()) return;
                  sendChatMessage('courier', driverChatMessage.trim());
                  setDriverChatMessage('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={driverChatMessage}
                  onChange={(e) => setDriverChatMessage(e.target.value)}
                  placeholder="Yolcuya serbest mesaj yazın..."
                  className="flex-1 bg-[#2C2C2E]/60 border border-white/[0.1] rounded-2xl px-3 py-2 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#0A84FF]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-2xl hover:bg-zinc-200"
                >
                  Gönder
                </button>
              </form>
            ) : (
              <div className="p-2 bg-[#2C2C2E]/40 border border-white/[0.06] rounded-xl text-[9px] text-[#8E8E93] flex items-center justify-between font-mono">
                <span>🛡️ Sürüş Emniyeti: Klavye kilitlidir (ECE 22.06)</span>
                <span className="text-[#30D158] font-semibold">Tek Dokunuş Aktif</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Masked VoIP Call Modal (Apple Call Screen Style) */}
      {showDriverVoipModal && currentRide && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[36px] p-6 text-center space-y-4 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 flex items-center justify-center mx-auto ring-4 ring-[#30D158]/20 animate-pulse">
                <Phone className="w-8 h-8 text-[#30D158]" />
              </div>
              <span className="absolute bottom-0 right-1/3 w-4 h-4 rounded-full bg-[#30D158] ring-2 ring-[#1C1C1E]" />
            </div>

            <div>
              <span className="text-[10px] text-[#0A84FF] font-mono font-semibold tracking-wider block uppercase">
                Maskeli Güvenli Santral (VoIP)
              </span>
              <h3 className="text-base font-bold text-white mt-1">{currentRide.customerName}</h3>
              <p className="text-[11px] text-[#8E8E93] mt-0.5">
                Yolcu ile Güvenli Bağlantı (GSM Gizli)
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-white/[0.08] border border-white/[0.08] rounded-full text-xs font-mono font-semibold text-white">
                00:{String(driverCallDuration).padStart(2, '0')} · Aktif Görüşme
              </div>
            </div>

            {/* Audio Waveform visualizer */}
            <div className="flex items-center justify-center gap-1 py-1">
              {[6, 18, 12, 22, 16, 8, 20, 10, 14, 4].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#30D158] rounded-full animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>

            <div className="p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] font-mono text-[11px] space-y-1.5 text-left">
              <div className="text-[#8E8E93] flex justify-between">
                <span>Santral Proxy:</span>
                <strong className="text-white">0850 885 94 81</strong>
              </div>
              <div className="text-[#8E8E93] flex justify-between">
                <span>Dahili Sefer:</span>
                <strong className="text-[#0A84FF]">{currentRide.boardingCode}</strong>
              </div>
              <div className="text-[10px] text-[#636366] pt-1 border-t border-white/[0.06]">
                Kişisel numaranız gizlenir; arama kask kulaklığına aktarılır.
              </div>
            </div>

            {/* Driver Audio Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDriverMicMuted(!driverMicMuted)}
                className={`py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                  driverMicMuted ? 'bg-[#FF453A]/15 border-[#FF453A]/30 text-[#FF453A]' : 'bg-white/[0.1] border-white/[0.1] text-white'
                }`}
              >
                {driverMicMuted ? 'Mikrofon Kapalı' : 'Mikrofon Açık'}
              </button>
              <button
                onClick={() => setDriverAudioRoute(driverAudioRoute === 'helmet' ? 'speaker' : 'helmet')}
                className={`py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                  driverAudioRoute === 'helmet' ? 'bg-[#0071E3] border-[#0071E3] text-white' : 'bg-white/[0.1] border-white/[0.1] text-[#8E8E93]'
                }`}
              >
                {driverAudioRoute === 'helmet' ? '🎧 Kask Bluetooth' : '📢 Hoparlör'}
              </button>
            </div>

            <button
              onClick={() => setShowDriverVoipModal(false)}
              className="w-full min-h-[48px] min-w-[48px] py-3 bg-[#FF453A] hover:bg-[#FF3B30] text-white font-bold text-xs rounded-2xl active:scale-95 transition-all shadow-md flex items-center justify-center"
            >
              Aramayı Sonlandır
            </button>
          </div>
        </div>
      )}

      {/* VARDİYA & GÖREV BAŞLANGICI SEÇİM MODALİ (Getir / Martı TAG / Uber Tarzı Tek Seferlik) */}
      {showDutySelectionModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5 w-full max-w-sm space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div>
                <h3 className="font-bold text-white text-sm">Görevinizi Belirleyin</h3>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">Vardiyanızda hangi çağrıları kabul edeceksiniz?</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDutySelectionModal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duty Cards */}
            <div className="space-y-2.5">
              {/* Option 1: Paket Kurye */}
              <button
                type="button"
                onClick={() => setSelectedDutyCandidate('courier_only')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-[0.99] ${
                  selectedDutyCandidate === 'courier_only'
                    ? 'bg-[#0071E3]/15 border-[#0071E3] ring-1 ring-[#0071E3]'
                    : 'bg-[#2C2C2E]/50 border-white/[0.06] hover:bg-[#2C2C2E]/80'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedDutyCandidate === 'courier_only' ? 'bg-[#0071E3] text-white' : 'bg-white/[0.08] text-[#8E8E93]'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Paket Dağıtımı</span>
                    <span className="text-[10px] text-[#0A84FF] font-medium">Getir & Uber Eats</span>
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5 leading-snug">
                    Yemek, market ve kurye paketleri. Yolcu kaskı şartı aranmaz.
                  </p>
                </div>
              </button>

              {/* Option 2: Karma (Paket + Yolcu) */}
              <button
                type="button"
                onClick={() => {
                  if (
                    !activeCourier.permissions.passengerServiceApproved ||
                    !activeCourier.permissions.hasPassengerHelmet
                  ) {
                    showNotification({
                      title: 'Yolcu Ekipmanı Eksik',
                      message: 'Yolcu taşımak için 2. kask ve A sınıfı yetki gereklidir.',
                      type: 'warning',
                    });
                    return;
                  }
                  setSelectedDutyCandidate('passenger_and_courier');
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-[0.99] ${
                  selectedDutyCandidate === 'passenger_and_courier'
                    ? 'bg-[#30D158]/15 border-[#30D158] ring-1 ring-[#30D158]'
                    : 'bg-[#2C2C2E]/50 border-white/[0.06] hover:bg-[#2C2C2E]/80'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedDutyCandidate === 'passenger_and_courier' ? 'bg-[#30D158] text-black' : 'bg-white/[0.08] text-[#8E8E93]'
                }`}>
                  <Bike className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Taksi + Kurye (M0 %0 Komisyon)</span>
                    <span className="text-[10px] text-[#30D158] font-medium">%100 Net Hakediş</span>
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5 leading-snug">
                    Taksi ve paket teslimat çağrılarını %0 komisyonla kabul edin. (Not: MOTO_PASSENGER_RIDE UKOME onayı bekleyen gelecek hizmettir).
                  </p>
                </div>
              </button>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={() => {
                setCourierEquipmentMode(activeCourier.id, selectedDutyCandidate);
                setShowDutySelectionModal(false);
                if (!activeCourier.isOnline) {
                  toggleCourierOnline(activeCourier.id);
                }
                showNotification({
                  title: 'Göreviniz Başlatıldı',
                  message: `Aktif Mod: ${
                    selectedDutyCandidate === 'courier_only' ? 'Paket Dağıtımı' : 'Yolcu ve Paket'
                  }. Çağrılar taranıyor.`,
                  type: 'success',
                });
              }}
              className="w-full min-h-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Görevi Başlat & Çevrim İçi Ol</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TFKS MODAL 1: ZİMMET & VARDİYA (Apple Style) */}
      {showShiftModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5 w-full max-w-xs space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#0A84FF]" />
                <h3 className="font-bold text-white text-sm">Zimmet & Vardiya Masası</h3>
              </div>
              <button onClick={() => setShowShiftModal(false)} className="text-[#8E8E93] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Atanan Motosiklet:</span>
                <span className="font-mono font-bold text-white">{courierShift.bikePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Başlangıç Saati:</span>
                <span className="font-mono text-[#F5F5F7]">{courierShift.startedAt || 'Bugün 08:30'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Başlangıç Kilometresi:</span>
                <span className="font-mono text-white font-bold">{courierShift.startKm} km</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#8E8E93] block">Güncel / Dönüş Kilometresi Girişi:</label>
              <input
                type="number"
                value={reportedKm}
                onChange={(e) => setReportedKm(Number(e.target.value))}
                className="w-full p-2.5 bg-[#2C2C2E]/60 border border-white/[0.1] rounded-2xl text-white font-mono font-bold focus:outline-none focus:border-[#0A84FF]"
              />
            </div>

            <div className="p-2.5 bg-[#30D158]/10 border border-[#30D158]/20 rounded-2xl text-[10px] text-[#30D158] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#30D158]" />
              <span>4 Yönlü Hasar Fotoğrafı & Ekipman Teyidi Mühürlü</span>
            </div>

            {courierShift.isShiftActive ? (
              <button
                onClick={() => {
                  endCourierShift();
                  showNotification({
                    title: 'Vardiya Kapatıldı',
                    message: `Toplam kat edilen mesafe: ${reportedKm - courierShift.startKm} km. Araç teslim tutanağı oluşturuldu.`,
                    type: 'success',
                  });
                  setShowShiftModal(false);
                }}
                className="w-full min-h-[48px] min-w-[48px] py-3 bg-white/[0.1] hover:bg-white/[0.16] border border-white/[0.1] text-white font-semibold rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Vardiyayı Tamamla ve Aracı İade Et
              </button>
            ) : (
              <button
                onClick={() => {
                  startCourierShift({ bikePlate: '34 BLY 717', startKm: reportedKm, photosApproved: true });
                  setShowShiftModal(false);
                }}
                className="w-full min-h-[48px] min-w-[48px] py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Zimmeti Başlat & Sevk Al
              </button>
            )}
          </div>
        </div>
      )}

      {/* TFKS MODAL 2: TRAFİK CEZALARI (Apple Style) */}
      {showPenaltiesModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5 w-full max-w-xs space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF453A]" />
                <h3 className="font-bold text-white text-sm">Trafik Cezalarım</h3>
              </div>
              <button onClick={() => setShowPenaltiesModal(false)} className="text-[#8E8E93] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
              {courierPenalties.map((pen) => (
                <div key={pen.id} className="p-3 bg-[#2C2C2E]/50 rounded-2xl border border-white/[0.06] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-white">{pen.code}</span>
                    <span className="text-[10px] text-[#FF9F0A] font-mono font-semibold bg-[#FF9F0A]/15 px-2 py-0.5 rounded-full border border-[#FF9F0A]/30">
                      11 Gün İndirimli
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F5F5F7] font-medium">{pen.title}</p>
                  <div className="flex justify-between items-center font-mono pt-1 border-t border-white/[0.06]">
                    <span className="line-through text-[#636366]">{pen.fullAmount} ₺</span>
                    <span className="text-[#30D158] font-bold">{pen.discountedAmount} ₺ (%25 İndirim)</span>
                  </div>

                  {pen.status === 'unpaid' ? (
                    <button
                      onClick={() => {
                        payCourierPenalty(pen.id);
                        showNotification({
                          title: 'Trafik Cezası Ödendi',
                          message: 'Ceza %25 erken ödeme indirimi uygulanarak hakediş bakiyenizden tahsil edildi.',
                          type: 'success',
                        });
                      }}
                      className="w-full py-2 bg-white/[0.1] hover:bg-white/[0.16] border border-white/[0.1] text-white rounded-xl text-[11px] font-semibold active:scale-[0.98] transition-all"
                    >
                      İndirimli Öde ({pen.discountedAmount} ₺)
                    </button>
                  ) : (
                    <div className="text-[10px] text-[#30D158] text-center font-semibold font-mono">Ödendi ✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TFKS MODAL 3: GÜNLÜK NAKİT TESLİMİ (Apple Style) */}
      {showCashHandinModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5 w-full max-w-xs space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#30D158]" />
                <h3 className="font-bold text-white text-sm">Nakit Kasa Teslimi</h3>
              </div>
              <button onClick={() => setShowCashHandinModal(false)} className="text-[#8E8E93] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#2C2C2E]/50 rounded-2xl border border-white/[0.06] text-center space-y-1">
              <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Elinizdeki Nakit Tahsilat</span>
              <div className="text-3xl font-bold font-mono text-[#30D158]">{courierCashInHand} ₺</div>
              <span className="text-[10px] text-[#8E8E93]">Motosiklet Yolcu Nakit Ödemeleri</span>
            </div>

            <div className="text-[11px] text-[#8E8E93] space-y-1.5">
              <p>
                Garaj veya operasyon amirine elden teslim edeceğiniz tutar için dijital teslim tutanağı üretilir.
              </p>
              <div className="p-2.5 bg-[#2C2C2E]/40 rounded-xl border border-white/[0.06] flex justify-between font-mono text-[10px]">
                <span className="text-[#8E8E93]">Teslim Alan Kasa:</span>
                <span className="text-white font-semibold">Beşiktaş Garaj Kasası</span>
              </div>
            </div>

            {cashHandinSuccess ? (
              <div className="p-3 bg-[#30D158]/15 border border-[#30D158]/30 rounded-2xl text-[#30D158] text-center font-semibold text-xs">
                Nakit Teslim Fişi Oluşturuldu! Kasa Yetkilisi Onayı Bekleniyor.
              </div>
            ) : (
              <button
                onClick={() => {
                  setCashHandinSuccess(true);
                  setTimeout(() => {
                    setCashHandinSuccess(false);
                    setShowCashHandinModal(false);
                  }, 2500);
                }}
                className="w-full min-h-[48px] min-w-[48px] py-3 bg-[#30D158] hover:bg-[#34C759] text-black font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Teslimat Fişi Oluştur ve Kasaya Devret
              </button>
            )}
          </div>
        </div>
      )}

      {/* Launch Strategy Matrix Modal in Courier App */}
      {showLaunchMatrixModal && (
        <div className="absolute inset-2 z-50 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-4 sm:p-6 flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto">
          <LaunchStrategyMatrix
            isModal
            onClose={() => setShowLaunchMatrixModal(false)}
          />
        </div>
      )}

      {/* Kural 3.4: Sürücü Sorun Bildir Menüsü (Apple Sheet) */}
      {showDriverIssueModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5 w-full max-w-sm space-y-3.5 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FF9F0A]" />
                <h3 className="font-bold text-white text-xs">Seferde Sorun Bildir (Kural 3.4)</h3>
              </div>
              <button
                onClick={() => {
                  setShowDriverIssueModal(false);
                  setDriverIssueSuccess(null);
                }}
                className="text-[#8E8E93] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-[#8E8E93]">
              Bildirilen sorun mevcut seferle ({currentRide?.id}) ilişkilendirilir ve komuta merkezine aktarılır.
            </p>

            {driverIssueSuccess && (
              <div className="p-2.5 bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-[#30D158]" />
                <span>{driverIssueSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5">
              {[
                'Müşteri Yok / Buluşma Noktasına Gelmedi',
                'Paket Hazır Değil',
                'Kapasite Uygun Değil (Aşırı Yük / Hacim)',
                'Adres Yanlış / Erişilemez Nokta',
                'Alıcıya Ulaşılamıyor',
                'Motosiklet Arızası / Kaza',
                'GPS / Bağlantı Kaybı',
              ].map((issueText) => (
                <button
                  key={issueText}
                  onClick={() => {
                    if (currentRide) {
                      reportRideIssue(currentRide.id, issueText);
                    }
                    setDriverIssueSuccess(`Sorun iletildi: ${issueText}. Komuta merkezi durumdan haberdar edildi.`);
                    setTimeout(() => {
                      setShowDriverIssueModal(false);
                      setDriverIssueSuccess(null);
                    }, 1800);
                  }}
                  className="w-full p-3 bg-[#2C2C2E]/60 hover:bg-[#2C2C2E] border border-white/[0.06] rounded-2xl text-left text-white transition-all text-[11px] active:scale-[0.99]"
                >
                  ⚠️ {issueText}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return (
      <PhoneFrame
        dynamicIslandContent={
          isAssigned && currentRide ? (
            <span className="text-[#30D158] font-mono font-bold text-[9px]">
              {currentRide.status === 'offered' ? 'Çağrı!' : 'Görevde'}
            </span>
          ) : undefined
        }
      >
        {appContent}
      </PhoneFrame>
    );
  }

  return (
    <div className="max-w-xl sm:max-w-2xl mx-auto px-2 py-4 space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#30D158] animate-pulse" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Kurye Terminali · Sürücü Kokpiti
          </h2>
        </div>

        <button
          onClick={() => setUseDeviceFrame(!useDeviceFrame)}
          className="px-3 py-1.5 rounded-full bg-[#1C1C1E]/80 border border-white/[0.08] hover:border-white/[0.14] text-xs font-semibold text-[#8E8E93] hover:text-white flex items-center gap-1.5 transition-all"
        >
          {useDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          <span>{useDeviceFrame ? 'Geniş Görünüm' : 'iPhone Çerçevesi'}</span>
        </button>
      </div>

      {useDeviceFrame ? (
        <PhoneFrame
          dynamicIslandContent={
            isAssigned && currentRide ? (
              <span className="text-[#30D158] font-mono font-bold text-[9px]">
                {currentRide.status === 'offered' ? 'Çağrı!' : 'Görevde'}
              </span>
            ) : undefined
          }
        >
          {appContent}
        </PhoneFrame>
      ) : (
        <div className="w-full h-[820px] rounded-[36px] overflow-hidden border border-white/[0.08] shadow-2xl relative bg-[#0A0A0C]">
          {appContent}
        </div>
      )}
    </div>
  );
};
