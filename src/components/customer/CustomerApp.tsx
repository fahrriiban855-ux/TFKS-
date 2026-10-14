import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  ServiceType,
  LocationPoint,
  RideOrder,
  MultiDropStop,
  OrderTimingOption,
  UserProfileMode,
  DeliveryPackageItem,
} from '../../types/platform';
import { ISTANBUL_LOCATIONS } from '../../data/platformData';
import { MapComponent } from '../common/MapComponent';
import { PhoneFrame } from '../common/PhoneFrame';
import { LaunchStrategyMatrix } from '../common/LaunchStrategyMatrix';
import {
  Bike,
  Car,
  Package,
  ShoppingBag,
  Store,
  MapPin,
  CreditCard,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Home,
  FileText,
  Wallet,
  User,
  Plus,
  Minus,
  Coins,
  Trash2,
  Key,
  Radio,
  Info,
  Calendar,
  Hourglass,
  Rocket,
  Heart,
  Mic,
  Download,
  Share2,
  ChevronRight,
  Check,
  Building2,
  Truck,
  Layers,
  Briefcase,
  HelpCircle,
  Menu,
  ChevronDown,
  ChevronUp,
  Award,
  Ticket,
  Percent,
  Gift,
} from 'lucide-react';
import { CustomerLoyaltyView } from './CustomerLoyaltyView';

interface CustomerAppProps {
  isEmbedded?: boolean;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ isEmbedded = false }) => {
  const {
    activeView,
    setActiveView,
    customerProfileMode,
    setCustomerProfileMode,
    currentRide,
    couriers,
    requestRide,
    cancelRide,
    calculateFare,
    completeTrip,
    rateCompletedRide,
    dismissCompletedRide,
    allRides,
    chatMessages,
    sendChatMessage,
    favoriteCourierIds,
    toggleFavoriteCourier,
    directBookCourier,
    directChats,
    sendDirectMessageToCourier,
    acceptBargainOffer,
    counterBargainOffer,
    declineBargainOffer,
    reportRideIssue,
    reportEmergencyIncident,
    updateDeliveryPackageStatus,
    showNotification,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    customerWalletBalance,
    topUpCustomerWallet,
    tariffs,
    pendingPolicyProposals,
    detectedUnapprovedRecords,
    loyaltyAccount,
    loyaltyTiers,
    loyaltySettings,
    campaigns,
    activeCoupon,
    applyCouponCode,
    removeCouponCode,
    redeemLoyaltyPoints,
    appliedPointsDiscount,
    appliedPointsCount,
    clearPointsDiscount,
    resolveLocationFromCoords,
    searchLocations,
    turkeyLocations,
  } = usePlatform();

  const [useDeviceFrame, setUseDeviceFrame] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Vazgeçtim');

  // Tabs for Individual: 'ride' (Beni Götür) | 'package' (Paket Gönder) | 'loyalty' (Sadakat & Fırsatlar) | 'history' (Geçmiş İşler) | 'profile' (Destek & Hesabım)
  // Tabs for Business: 'create_delivery' | 'active_deliveries' | 'completed' | 'billing' | 'management'
  const [personalTab, setPersonalTab] = useState<'ride' | 'package' | 'loyalty' | 'history' | 'profile'>('ride');
  const [businessTab, setBusinessTab] = useState<'create_delivery' | 'active_deliveries' | 'completed' | 'billing' | 'management'>('create_delivery');
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showFareDetailSheet, setShowFareDetailSheet] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');

  // Service & Route (Bölge Sınırlaması Yok)
  const [serviceType, setServiceType] = useState<ServiceType>('motosiklet');
  const [pickup, setPickup] = useState<LocationPoint>(turkeyLocations[0]); // Beşiktaş
  const [dropoff, setDropoff] = useState<LocationPoint>(turkeyLocations[1]); // Levent
  const [locationPickerTarget, setLocationPickerTarget] = useState<'pickup' | 'dropoff'>('dropoff');
  const [locationSearchInput, setLocationSearchInput] = useState('');

  // Buluşma Açıklaması & Adres Doğrulama (Kural 2.3)
  const [pickupDescription, setPickupDescription] = useState('Bina Girişi, Cadde Tarafı Kaldırım');
  const [pickupConfirmedByUser, setPickupConfirmedByUser] = useState(true);

  // Interactive Options Drawer
  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
  const [timing, setTiming] = useState<OrderTimingOption>('immediate');
  const [scheduledTime, setScheduledTime] = useState<string>('20:00');
  const [waitMinutes, setWaitMinutes] = useState<number>(0);
  const [extraStops, setExtraStops] = useState<MultiDropStop[]>([]);

  // Paket Gönderimi State'leri (Kural 2.4)
  const [senderName, setSenderName] = useState('Bedirhan İbanoğlu');
  const [senderPhone, setSenderPhone] = useState('+90 505 677 93 79');
  const [recipientName, setRecipientName] = useState('Av. Kemal Erdem');
  const [recipientPhone, setRecipientPhone] = useState('+90 542 998 10 20');
  const [packageSize, setPackageSize] = useState<'zarf' | 'kucuk' | 'orta' | 'buyuk'>('zarf');
  const [packageWeightKg, setPackageWeightKg] = useState<number>(2.5);
  const [isPackageReady, setIsPackageReady] = useState<boolean>(true);
  const [deliveryInstructions, setDeliveryInstructions] = useState('Güvenliğe veya bina görevlisine teslim edilebilir');
  const [packageNote, setPackageNote] = useState('Hukuk evrakı, ıslanmaması rica olunur');

  // İşletme Çoklu Teslimat State'leri (Kural 2.5)
  const [businessPickupAddress, setBusinessPickupAddress] = useState('Nişantaşı Butik & Mutfak Şube 1 (Teşvikiye Cd. No:42)');
  const [businessPackageList, setBusinessPackageList] = useState<DeliveryPackageItem[]>([
    {
      id: 'pkg-1',
      trackingCode: 'MP-PK-01',
      recipientName: 'Selin Karaca',
      recipientPhone: '+90 532 110 22 33',
      dropoffAddress: 'Bebek Cevdetpaşa Cd. No: 18/B',
      dropoffLocation: ISTANBUL_LOCATIONS[4],
      weightKg: 2.0,
      size: 'kucuk',
      status: 'pending',
      deliveryCode: '4821',
    },
    {
      id: 'pkg-2',
      trackingCode: 'MP-PK-02',
      recipientName: 'Murat Arslan',
      recipientPhone: '+90 544 887 66 11',
      dropoffAddress: 'Levent Kanyon Residance A Blok',
      dropoffLocation: ISTANBUL_LOCATIONS[2],
      weightKg: 3.5,
      size: 'orta',
      status: 'pending',
      deliveryCode: '7192',
    },
    {
      id: 'pkg-3',
      trackingCode: 'MP-PK-03',
      recipientName: 'Zeynep Aktaş',
      recipientPhone: '+90 555 432 10 99',
      dropoffAddress: 'Maslak Maslak 1453 No: 8',
      dropoffLocation: ISTANBUL_LOCATIONS[3],
      weightKg: 1.8,
      size: 'kucuk',
      status: 'pending',
      deliveryCode: '3341',
    },
  ]);

  // Modals & Popups
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVoipModal, setShowVoipModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showInvoiceModal, setShowInvoiceModal] = useState<RideOrder | null>(null);
  const [showIssueReportModal, setShowIssueReportModal] = useState(false);
  const [showUnapprovedNotice, setShowUnapprovedNotice] = useState<string | null>(null);
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  const [tripLinkCopied, setTripLinkCopied] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [mapSelectMode, setMapSelectMode] = useState<'pickup' | 'dropoff' | null>(null);

  // Fiyat Hesaplama Motoru (Kural 2.6 - Sunucuda %10 + 20 TL sabit hizmet bedeli)
  const fareEstimate = calculateFare(
    customerProfileMode === 'business' ? 'isletme_siparis' : serviceType,
    pickup,
    dropoff,
    extraStops.length,
    waitMinutes
  );

  const isRideActive = !!currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';
  const isRideCompleted = currentRide?.status === 'completed';

  const assignedCourier = currentRide?.courierId
    ? couriers.find((c) => c.id === currentRide.courierId)
    : null;

  // VoIP Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVoipModal) {
      setCallDuration(0);
      timer = setInterval(() => setCallDuration((p) => p + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showVoipModal]);

  // Kişisel Yolculuk / Paket Talebi Gönder (Kural 2.3 & 2.4 & 2.6)
  const handlePersonalBooking = (sType: ServiceType) => {
    if (sType === 'kurye' && !isPackageReady) {
      showNotification({
        title: 'Paket Hazır Değil',
        message: 'Paket henüz hazır değil olarak işaretlenmiş. Kurye çağırmak için lütfen paketin hazır olduğunu onaylayın.',
        type: 'warning',
      });
      return;
    }

    requestRide({
      serviceType: sType,
      pickup,
      dropoff,
      pickupDescription,
      pickupConfirmedByUser,
      packageNote: sType === 'kurye' ? packageNote : undefined,
      packageWeightKg: sType === 'kurye' ? packageWeightKg : undefined,
      packageSize: sType === 'kurye' ? packageSize : undefined,
      isPackageReady: sType === 'kurye' ? isPackageReady : true,
      deliveryInstructions: sType === 'kurye' ? deliveryInstructions : undefined,
      recipientContact: sType === 'kurye' ? { name: recipientName, phone: recipientPhone } : undefined,
      timing,
      scheduledTime: timing === 'scheduled' ? scheduledTime : undefined,
      extraStops,
      waitMinutes,
      paymentMethod: selectedPaymentMethod,
    });
    setShowOptionsDrawer(false);
  };

  // İşletme Çoklu Teslimat Talebi Gönder (Kural 2.5)
  const handleBusinessMultiDropBooking = () => {
    if (businessPackageList.length === 0) {
      showNotification({
        title: 'Eksik Paket Listesi',
        message: 'Çoklu teslimat başlatabilmek için en az 1 paket eklemelisiniz.',
        type: 'warning',
      });
      return;
    }

    requestRide({
      serviceType: 'isletme_siparis',
      pickup,
      dropoff: businessPackageList[0].dropoffLocation,
      pickupDescription: businessPickupAddress,
      pickupConfirmedByUser: true,
      packagesList: businessPackageList,
      multiPackageCount: businessPackageList.length,
      packageNote: `İşletme Çoklu Paket Dağıtımı (${businessPackageList.length} Nokta)`,
      deliveryInstructions: 'Her teslimatta alıcı kodu kontrol edilerek teslim edilir',
      paymentMethod: selectedPaymentMethod,
    });
    setBusinessTab('active_deliveries');
  };

  // Haritadan serbest lokasyon seçimi (Bölge Sınırlaması Yok!)
  const handleMapLocationSelect = (lat: number, lng: number) => {
    if (!mapSelectMode) return;
    const newPoint = resolveLocationFromCoords(lat, lng);
    if (mapSelectMode === 'pickup') {
      setPickup(newPoint);
      setPickupConfirmedByUser(true);
      setMapSelectMode(null);
      showNotification({
        title: 'Alış Noktası Güncellendi',
        message: `${newPoint.name} seçildi.`,
        type: 'success',
      });
    } else {
      setDropoff(newPoint);
      setMapSelectMode(null);
      showNotification({
        title: 'Varış Noktası Güncellendi',
        message: `${newPoint.name} seçildi.`,
        type: 'success',
      });
    }
  };

  // Yeni Paket Satırı Ekle (İşletme için)
  const handleAddBusinessPackage = () => {
    if (businessPackageList.length >= 5) {
      showNotification({
        title: 'Maksimum Kapasite Sınırı',
        message: 'Kural 2.5: Motosiklet taşıma güvenliği ve denge kısıtları nedeniyle tek seferde en fazla 5 paket kabul edilir.',
        type: 'warning',
      });
      return;
    }
    const nextIdx = businessPackageList.length + 1;
    const randomLoc = ISTANBUL_LOCATIONS[nextIdx % ISTANBUL_LOCATIONS.length];
    const newPkg: DeliveryPackageItem = {
      id: `pkg-${Date.now()}`,
      trackingCode: `MP-PK-0${nextIdx}`,
      recipientName: `Müşteri ${nextIdx}`,
      recipientPhone: `+90 530 000 ${nextIdx}0 ${nextIdx}0`,
      dropoffAddress: randomLoc.address,
      dropoffLocation: randomLoc,
      weightKg: 2.0,
      size: 'kucuk',
      status: 'pending',
      deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    setBusinessPackageList([...businessPackageList, newPkg]);
  };

  // Toplam Kurumsal Paket Yükü
  const totalBusinessWeight = businessPackageList.reduce((acc, p) => acc + p.weightKg, 0);

  // App Content
  const appContent = (
    <div className="w-full h-full bg-[#0A0A0C] text-[#F5F5F7] flex flex-col font-sans select-none relative overflow-hidden">
      {/* 2.2 Apple iOS Navigation & Profile Switcher */}
      <div className="p-3 bg-[#16161A]/85 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between gap-2 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-[#0A84FF] to-[#0071E3] text-white font-bold flex items-center justify-center text-xs shadow-[0_2px_8px_rgba(0,113,227,0.4)]">
            M
          </div>
          <span className="font-bold text-xs text-[#F5F5F7]">MotoPilot</span>
        </div>

        {/* Bireysel Hesap Göstergesi & Kurumsal Portala Geçiş */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Kişisel Hesap</span>
          </span>
          <span className="text-zinc-600" aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setActiveView('business')}
            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#BF5AF2]/15 hover:bg-[#BF5AF2]/25 border border-[#BF5AF2]/30 text-[#BF5AF2] text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95"
            title="Kurumsal İşletme Portalı'na Geç"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">İşletme Portalı</span>
            <span>➔</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sadakat Puan & Fırsatlar Butonu */}
          <button
            type="button"
            onClick={() => {
              setCustomerProfileMode('individual');
              setPersonalTab('loyalty');
            }}
            className="min-h-[36px] px-3 py-1.5 bg-[#FFD60A]/10 hover:bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/30 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 tabular-nums"
            title="Sadakat Puanlarım & Kuponlarım"
          >
            <Award className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>{loyaltyAccount.availablePoints} P</span>
          </button>

          {/* Acil Yardım (SOS) Butonu */}
          <button
            type="button"
            onClick={() => {
              setEmergencyAlertSent(false);
              setTripLinkCopied(false);
              setShowSosModal(true);
            }}
            className="min-h-[36px] px-3 py-1.5 bg-[#FF453A]/15 hover:bg-[#FF453A]/25 text-[#FF453A] border border-[#FF453A]/30 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
            title="Acil Yardım & Olay Bildirimi"
          >
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>SOS</span>
          </button>

          {/* Kompakt Menü Butonu */}
          <button
            type="button"
            onClick={() => setShowMenuDrawer(true)}
            className="min-h-[36px] px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F5F7] border border-white/[0.1] rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            title="Cüzdan, Geçmiş ve Hesap Menüsü"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Menü</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.2 MOD A: KİŞİSEL PROFİL                                                 */}
      {/* ========================================================================= */}
      {customerProfileMode === 'individual' && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* TAB 1: BENİ GÖTÜR (YOLCULUK) */}
          {personalTab === 'ride' && (
            <div className="relative w-full h-full flex flex-col overflow-hidden">
              {/* Full-bleed Map */}
              <div className="absolute inset-0 z-0">
                <MapComponent
                  couriers={couriers}
                  currentRide={currentRide}
                  heightClass="h-full"
                  onSelectLocation={handleMapLocationSelect}
                />
              </div>

              {/* Pin Selection Banner */}
              {mapSelectMode && (
                <div className="absolute top-4 inset-x-4 z-30 p-3 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] animate-ping" />
                    <span className="font-semibold text-white">
                      {mapSelectMode === 'pickup' ? 'Alış Noktasını Seçin' : 'Varış Noktasını Seçin'}
                    </span>
                  </div>
                  <button
                    onClick={() => setMapSelectMode(null)}
                    className="px-3 py-1 bg-white/[0.1] hover:bg-white/[0.15] text-[#F5F5F7] rounded-full text-[11px] font-medium"
                  >
                    Vazgeç
                  </button>
                </div>
              )}

              {/* Compact Floating Route Pill - Apple Glass Style */}
              {!isRideActive && !isRideCompleted && (
                <div className="absolute top-3 inset-x-3 z-20 pointer-events-auto">
                  <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLocationPickerTarget('pickup');
                          setShowLocationPicker(true);
                        }}
                        className="flex items-center gap-1.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                        title="Alış Noktasını Değiştir"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 flex items-center justify-center shrink-0">
                          <MapPin className="w-3 h-3 stroke-[2.2]" />
                        </div>
                        <span className="text-[#F5F5F7] font-semibold truncate text-[11px]">{pickup.name}</span>
                      </button>

                      <span className="text-[#8E8E93] text-[10px] shrink-0">➔</span>

                      <button
                        type="button"
                        onClick={() => {
                          setLocationPickerTarget('dropoff');
                          setShowLocationPicker(true);
                        }}
                        className="flex items-center gap-1.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                        title="Varış Noktasını Değiştir"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30 flex items-center justify-center shrink-0">
                          <MapPin className="w-3 h-3 stroke-[2.2]" />
                        </div>
                        <span className="text-[#0A84FF] font-semibold truncate text-[11px]">{dropoff.name}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLocationPickerTarget('dropoff');
                        setShowLocationPicker(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-[11px] font-semibold shrink-0"
                    >
                      Konum Ara
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 pointer-events-none" />

              {/* Bottom Floating Action Dock (FAB / Quick Booking) */}
              <div className="absolute bottom-3 inset-x-3 z-30 pointer-events-auto">
                {!isRideActive && !isRideCompleted ? (
                  <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.14] rounded-[28px] p-3.5 shadow-[0_12px_45px_rgba(0,0,0,0.65)] space-y-2.5 ring-1 ring-white/10">
                    {/* Segmented Mode Selector & Quick Fare Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-1 bg-white/[0.06] border border-white/[0.08] rounded-full flex items-center text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setServiceType('motosiklet')}
                          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                            serviceType === 'motosiklet'
                              ? 'bg-[#0071E3] text-white shadow-sm'
                              : 'text-[#8E8E93] hover:text-white'
                          }`}
                        >
                          <Car className="w-3.5 h-3.5" />
                          <span>1. Taksi</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceType('kurye')}
                          className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                            serviceType === 'kurye'
                              ? 'bg-[#0071E3] text-white shadow-sm'
                              : 'text-[#8E8E93] hover:text-white'
                          }`}
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>2. Kurye</span>
                        </button>
                      </div>

                      {/* Tutar & Detay Açılır Tetikleyici */}
                      <button
                        type="button"
                        onClick={() => setShowFareDetailSheet(true)}
                        className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-white flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        {activeCoupon || appliedPointsDiscount > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-[#8E8E93] line-through font-mono">
                              {fareEstimate.totalFare} ₺
                            </span>
                            <span className="font-mono text-sm text-[#30D158]">
                              {Math.max(
                                20,
                                fareEstimate.totalFare -
                                  (activeCoupon
                                    ? activeCoupon.discountType === 'percentage'
                                      ? Math.min(
                                          activeCoupon.maxDiscountAmount,
                                          Math.round((fareEstimate.totalFare * activeCoupon.discountValue) / 100)
                                        )
                                      : activeCoupon.discountValue
                                    : 0) -
                                  appliedPointsDiscount
                              )}{' '}
                              ₺
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-sm text-[#30D158]">{fareEstimate.totalFare} ₺</span>
                        )}
                        <span className="text-[10px] text-[#8E8E93]">Detay ▾</span>
                      </button>
                    </div>

                    {/* Kupon & Sadakat İndirim Satırı (Getir & Uber Tarzı) */}
                    <div className="flex items-center justify-between p-2 bg-white/[0.04] rounded-2xl border border-white/[0.06] text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Ticket className="w-3.5 h-3.5 text-[#0A84FF] shrink-0" />
                        {activeCoupon ? (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-mono font-bold text-[#30D158] truncate">{activeCoupon.code}</span>
                            <span className="text-[10px] text-[#8E8E93]">
                              (-{activeCoupon.discountType === 'percentage' ? `%${activeCoupon.discountValue}` : `${activeCoupon.discountValue} ₺`})
                            </span>
                          </div>
                        ) : appliedPointsDiscount > 0 ? (
                          <span className="text-[#30D158] font-bold text-xs truncate">
                            {appliedPointsCount} Puan (-{appliedPointsDiscount} ₺)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowCouponModal(true)}
                            className="text-[#8E8E93] hover:text-white transition-colors truncate text-[11px]"
                          >
                            Kupon Kodu veya Puan Ekle
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {activeCoupon ? (
                          <button
                            type="button"
                            onClick={removeCouponCode}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-[10px] text-[#FF453A]"
                          >
                            Kaldır
                          </button>
                        ) : appliedPointsDiscount > 0 ? (
                          <button
                            type="button"
                            onClick={clearPointsDiscount}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-[10px] text-[#FF453A]"
                          >
                            Kaldır
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowCouponModal(true)}
                            className="px-2.5 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-[10px] font-bold"
                          >
                            Fırsatlar
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Apple System Blue CTA Button - Min 48px Touch Target */}
                    <button
                      onClick={() => handlePersonalBooking(serviceType)}
                      className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm rounded-2xl shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span>
                        {serviceType === 'motosiklet'
                          ? 'Taksi Çağır (%0 Komisyon)'
                          : 'Paket Kuryesini Çağır (%0 Komisyon)'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : isRideCompleted && currentRide ? (
                  /* Tamamlama & Puanlama (Kural 2.11) - Apple Card */
                  <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-4.5 shadow-2xl space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#30D158] text-black font-bold text-xs flex items-center justify-center shadow-sm">
                          ✓
                        </span>
                        <h4 className="font-bold text-sm text-white">Yolculuk Tamamlandı</h4>
                      </div>
                      <span className="font-bold text-lg text-white">{currentRide.totalFare} ₺</span>
                    </div>

                    {/* Fiyat Ayrıştırması (%0 Komisyon) */}
                    <div className="p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] text-xs space-y-1.5">
                      <div className="flex justify-between text-[#8E8E93]">
                        <span>Sürücü / Kurye Net Hakedişi (%100):</span>
                        <span className="text-[#30D158] font-bold">{currentRide.courierEarnings} ₺</span>
                      </div>
                      <div className="flex justify-between text-[#8E8E93]">
                        <span>Platform Sipariş Komisyonu (%0):</span>
                        <span className="text-white font-medium">0 ₺ (Sıfır Komisyon)</span>
                      </div>
                    </div>

                    {/* Puanlama */}
                    <div className="text-center space-y-2">
                      <span className="text-xs text-[#8E8E93] font-medium block">Sürücüyü Değerlendirin</span>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setRating(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-6 h-6 ${s <= rating ? 'text-[#FF9F0A] fill-[#FF9F0A]' : 'text-zinc-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => setShowInvoiceModal(currentRide)}
                        className="min-h-[48px] min-w-[48px] py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-[#F5F5F7] rounded-xl text-xs font-semibold transition-all flex items-center justify-center active:scale-95"
                      >
                        E-Fatura & Makbuz
                      </button>
                      <button
                        onClick={() => {
                          rateCompletedRide(rating, review || 'Yolculuk tamamlandı');
                          dismissCompletedRide();
                        }}
                        className="min-h-[48px] min-w-[48px] py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs transition-all flex items-center justify-center active:scale-95 shadow-md"
                      >
                        Tamamla & Kapat
                      </button>
                    </div>
                  </div>
                ) : currentRide ? (
                  /* Aktif Sefer - Apple iOS Live Activity Card */
                  <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-4.5 shadow-2xl space-y-3.5">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                      <span className="text-xs font-semibold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] animate-pulse shadow-[0_0_8px_#0A84FF]" />
                        <span>
                          {currentRide.status === 'in_progress'
                            ? 'Yolculuk Sürüyor'
                            : currentRide.status === 'arrived'
                            ? 'Sürücü Alış Noktasında'
                            : currentRide.status === 'accepted'
                            ? 'Sürücü Alış Noktasına Geliyor'
                            : 'Uygun Sürücü Aranıyor (Radar)...'}
                        </span>
                      </span>
                      <span className="font-bold text-sm text-[#30D158]">{currentRide.totalFare} ₺</span>
                    </div>

                    {/* Sürücü Bilgisi */}
                    {assignedCourier && (
                      <div className="flex items-center justify-between p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-white/[0.1] border border-white/[0.1] flex items-center justify-center text-2xl shadow-inner">
                            {assignedCourier.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{assignedCourier.name}</span>
                              <span className="text-[#FF9F0A] text-[11px] font-medium flex items-center gap-0.5">
                                ★ {assignedCourier.rating}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8E8E93] block">
                              {assignedCourier.motorcycle} · <strong className="text-[#F5F5F7] font-mono">{assignedCourier.plate}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowChatModal(true)}
                            className="p-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-[#F5F5F7] rounded-xl border border-white/[0.08] transition-all"
                            title="Mesajlaş"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowVoipModal(true)}
                            className="p-2.5 bg-[#30D158]/20 hover:bg-[#30D158]/30 text-[#30D158] rounded-xl border border-[#30D158]/30 transition-all"
                            title="Arama"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Biniş / Teslimat PIN Kodu */}
                    {currentRide.status !== 'in_progress' ? (
                      <div className="p-3.5 bg-[#2C2C2E]/70 rounded-2xl border border-white/[0.08] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-[#8E8E93] block font-semibold uppercase tracking-wider">
                            Güvenli Başlatma PIN Kodu:
                          </span>
                          <span className="text-2xl font-bold tracking-widest text-white font-mono">
                            {currentRide.boardingCode}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8E8E93] max-w-[140px] text-right leading-tight">
                          Araca binerken veya paketi teslim ederken bu 4 haneli kodu iletiniz.
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#30D158]/15 rounded-2xl border border-[#30D158]/25 flex items-center justify-between text-xs">
                        <span className="text-[#30D158] font-semibold flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#30D158]" />
                          <span>Biniş Kodu Doğrulandı ✓</span>
                        </span>
                        <span className="font-mono text-[#8E8E93] text-[11px]">PIN: {currentRide.boardingCode}</span>
                      </div>
                    )}

                    {/* Aksiyonlar - 3 Kolonlu Ergonomik Dokunma Çubuğu (Min 48px) */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => setShowIssueReportModal(true)}
                        className="min-h-[48px] min-w-[48px] py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-[#F5F5F7] rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 active:scale-95"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F0A]" />
                        <span>Sorun</span>
                      </button>

                      <button
                        onClick={async () => {
                          const shareUrl = `https://motopilot.app/track/${currentRide.id}`;
                          reportEmergencyIncident(currentRide.id, 'share_trip');

                          if (navigator.share) {
                            try {
                              await navigator.share({
                                title: 'MotoPilot Canlı Sefer Takibi',
                                text: `${assignedCourier ? assignedCourier.name + ' ile ' : ''}MotoPilot yolculuğumu anlık olarak buradan canlı takip edebilirsin:`,
                                url: shareUrl,
                              });
                              showNotification({
                                title: 'Sefer Paylaşıldı',
                                message: 'Canlı takip bağlantısı cihazın yerel paylaşım menüsü üzerinden iletildi.',
                                type: 'success',
                              });
                              return;
                            } catch (err: any) {
                              if (err.name === 'AbortError') return;
                            }
                          }

                          if (navigator.clipboard) {
                            await navigator.clipboard.writeText(shareUrl);
                            showNotification({
                              title: 'Sefer Takip Linki Kopyalandı',
                              message: `${shareUrl} panoya kopyalandı. Dilediğiniz kişiye SMS veya mesaj ile iletebilirsiniz.`,
                              type: 'success',
                            });
                          }
                        }}
                        className="min-h-[48px] min-w-[48px] py-3 bg-[#0A84FF]/20 hover:bg-[#0A84FF]/30 border border-[#0A84FF]/30 text-[#0A84FF] rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 active:scale-95"
                        title="Seferi Yakınlarınla Paylaş (Share Trip)"
                      >
                        <Share2 className="w-4 h-4 stroke-[2]" />
                        <span>Paylaş</span>
                      </button>

                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="min-h-[48px] min-w-[48px] py-3 bg-[#FF453A]/15 hover:bg-[#FF453A]/25 border border-[#FF453A]/25 text-[#FF453A] rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>İptal</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 2: PAKET GÖNDER (KURAL 2.4) - Apple Style */}
          {personalTab === 'package' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 text-xs">
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-[#0A84FF] uppercase tracking-wider">KURAL 2.4</span>
                <h2 className="text-xl font-bold text-[#F5F5F7]">Paket Gönderimi Oluştur</h2>
                <p className="text-[#8E8E93] text-xs">
                  Uygun kurye ekipmanı ve taşıma kapasitesiyle anında eşleşin.
                </p>
              </div>

              {/* Paket Gönderici & Alıcı Bilgileri */}
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-3">
                <span className="font-bold text-white text-xs block">İletişim & Adres Bilgileri</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] font-medium">Gönderici Adı:</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-[#2C2C2E]/70 border border-white/[0.08] focus:border-[#0A84FF] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] font-medium">Gönderici Tel:</label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full bg-[#2C2C2E]/70 border border-white/[0.08] focus:border-[#0A84FF] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] font-medium">Alıcı Adı:</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-[#2C2C2E]/70 border border-white/[0.08] focus:border-[#0A84FF] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] font-medium">Alıcı Tel:</label>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full bg-[#2C2C2E]/70 border border-white/[0.08] focus:border-[#0A84FF] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Paket Boyutu & Ağırlığı */}
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-3">
                <span className="font-bold text-white text-xs block">Paket Boyutu & Ağırlık</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { id: 'zarf', label: 'Zarf / Evrak', icon: '📄' },
                    { id: 'kucuk', label: 'Küçük Koli', icon: '📦' },
                    { id: 'orta', label: 'Orta Koli', icon: '🧳' },
                    { id: 'buyuk', label: 'Büyük Koli', icon: '📦+' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPackageSize(s.id as any)}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        packageSize === s.id
                          ? 'bg-[#0071E3]/20 border-[#0A84FF] text-white font-semibold shadow-sm'
                          : 'bg-[#2C2C2E]/50 border-white/[0.06] text-[#8E8E93] hover:text-white'
                      }`}
                    >
                      <div className="text-base">{s.icon}</div>
                      <div className="text-[9px] mt-1 font-medium">{s.label}</div>
                    </button>
                  ))}
                </div>

                {/* Ağırlık Stepper */}
                <div className="flex items-center justify-between p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06]">
                  <span className="text-[11px] text-[#8E8E93] font-medium">Tahmini Ağırlık (kg):</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPackageWeightKg((prev) => Math.max(0.5, prev - 1))}
                      className="w-8 h-8 rounded-full bg-white/[0.1] hover:bg-white/[0.15] text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white w-12 text-center text-xs">{packageWeightKg} kg</span>
                    <button
                      onClick={() => setPackageWeightKg((prev) => prev + 1)}
                      className="w-8 h-8 rounded-full bg-white/[0.1] hover:bg-white/[0.15] text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {packageWeightKg > 15 && (
                  <div className="p-2.5 bg-[#FF9F0A]/15 border border-[#FF9F0A]/30 rounded-xl text-[10px] text-[#FF9F0A] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Motosiklet kapasite sınırı 15 kg'dır. Güvenlik için lütfen koli ağırlığını düşürünüz.</span>
                  </div>
                )}
              </div>

              {/* Paket Hazır mı? & Teslimat Talimatı */}
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">Paket Şu An Hazır mı?</span>
                    <span className="text-[10px] text-[#8E8E93]">Kurye gelene kadar bekleme süresi başlamaz</span>
                  </div>
                  <button
                    onClick={() => setIsPackageReady(!isPackageReady)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isPackageReady
                        ? 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/40 shadow-sm'
                        : 'bg-white/[0.08] text-[#8E8E93] border-white/[0.08]'
                    }`}
                  >
                    {isPackageReady ? 'Evet, Hazır ✓' : 'Henüz Değil ⏳'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] font-medium">Teslimat Talimatı (Ayrı Talimat):</label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Örn: Güvenliğe bırakın / Bizzat alıcıya verin"
                    className="w-full bg-[#2C2C2E]/70 border border-white/[0.08] focus:border-[#0A84FF] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Fiyat ve Kurye Çağır (%0 Komisyon) */}
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-2 text-xs">
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Mesafe & Paket Ücreti (Kurye Net %100):</span>
                  <span className="text-[#30D158] font-bold">{fareEstimate.subtotal} ₺</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Platform Sipariş Komisyonu (%0):</span>
                  <span className="text-white font-semibold">0 ₺ (M0 Sıfır Komisyon)</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-white/[0.08]">
                  <span>Toplam Ödeme:</span>
                  <span className="text-lg text-white font-bold">{fareEstimate.totalFare} ₺</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setServiceType('kurye');
                  handlePersonalBooking('kurye');
                  setPersonalTab('ride');
                }}
                className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-2xl shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all flex items-center justify-center active:scale-[0.98]"
              >
                Paket Kuryesini Çağır
              </button>
            </div>
          )}

          {/* TAB 3: GEÇMİŞ İŞLER */}
          {personalTab === 'history' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-3.5 text-xs">
              <div className="space-y-1 pt-1">
                <h2 className="text-xl font-bold text-[#F5F5F7]">Geçmiş İşler</h2>
                <p className="text-[#8E8E93] text-xs">Tamamlanan yolculuk ve paket teslimatları.</p>
              </div>

              <div className="space-y-2.5">
                {allRides.map((ride) => (
                  <div key={ride.id} className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[20px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-xs">{ride.id}</span>
                      <span className="font-bold text-white text-sm">{ride.totalFare} ₺</span>
                    </div>
                    <div className="text-[11px] text-[#8E8E93]">
                      {ride.pickup.name} ➔ {ride.dropoff.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.06]">
                      <span className="text-[#8E8E93] font-medium">Hizmet bedeli dâhil</span>
                      <button
                        onClick={() => setShowInvoiceModal(ride)}
                        className="text-[#0A84FF] hover:underline font-semibold"
                      >
                        Makbuz Görüntüle ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SADAKAT, KUPON & FIRSATLAR */}
          {personalTab === 'loyalty' && (
            <div className="w-full h-full overflow-hidden">
              <CustomerLoyaltyView onClose={() => setPersonalTab('ride')} />
            </div>
          )}

          {/* TAB 5: DESTEK VE HESABIM */}
          {personalTab === 'profile' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 text-xs">
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] flex items-center gap-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#0A84FF] text-white font-bold flex items-center justify-center text-sm shadow-md">
                  Bİ
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Bedirhan İbanoğlu</h3>
                  <p className="text-[11px] text-[#8E8E93] font-mono mt-0.5">+90 505 677 93 79 · Bireysel Profil</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Sadakat & Puanlarım Kartı */}
                <button
                  onClick={() => setPersonalTab('loyalty')}
                  className="w-full p-3.5 bg-[#1C1C1E]/80 hover:bg-[#2C2C2E]/80 border border-white/[0.08] rounded-[20px] flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFD60A]/15 text-[#FFD60A] flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white block">Sadakat & Fırsatlar</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD60A]/20 text-[#FFD60A] font-bold">
                          {loyaltyAccount.currentTier === 'gold' ? 'Altın VIP' : loyaltyAccount.currentTier === 'silver' ? 'Gümüş' : 'Bronz'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8E8E93]">
                        {loyaltyAccount.availablePoints} Puan · Kuponlar & Davet Et Kazan
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                </button>

                <button
                  onClick={() => setShowSosModal(true)}
                  className="w-full p-3.5 bg-[#1C1C1E]/80 hover:bg-[#2C2C2E]/80 border border-white/[0.08] rounded-[20px] flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FF453A]/15 text-[#FF453A] flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Acil Yardım & Güvenlik</span>
                      <span className="text-[10px] text-[#8E8E93]">112 Arama, Güvenlik Masası Bildirimi</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                </button>

                <div className="p-3.5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-[20px] space-y-2">
                  <span className="font-semibold text-white block">Kayıtlı Ödeme Yöntemi</span>
                  <div className="flex items-center justify-between p-2.5 bg-[#2C2C2E]/60 rounded-xl border border-white/[0.06] text-[11px]">
                    <span className="text-white font-medium">Mastercard •••• 4821</span>
                    <span className="text-[#30D158] font-semibold">Varsayılan ✓</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-[20px] text-[11px] text-[#8E8E93] space-y-1">
                  <span className="font-semibold text-white block">M0 Sıfır Komisyon & Adil Hakediş Modeli</span>
                  <p>Taksi ve kurye çağrılarında yolcudan, göndericiden ve sürücüden %0 platform komisyonu alınır; ödenen tutarın %100'ü doğrudan sürücüye/kuryeye aktarılır.</p>
                </div>
              </div>
            </div>
          )}

          {/* Alt Gezinme Barı yerine Temiz Haritaya Dönüş Butonu */}
          {personalTab !== 'ride' && (
            <div className="absolute top-3 right-3 z-30 pointer-events-auto">
              <button
                onClick={() => setPersonalTab('ride')}
                className="px-3 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-xs font-semibold shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>← Haritaya Dön</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2.2 MOD B: İŞLETME PROFİLİ (APPLE HIG BUSINESS)                          */}
      {/* ========================================================================= */}
      {customerProfileMode === 'business' && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Business Mode Clean Top Segmented Bar */}
          <div className="p-2.5 bg-[#16161A]/85 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between gap-2 z-20 shrink-0">
            <div className="p-1 bg-white/[0.06] border border-white/[0.08] rounded-full flex items-center text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setBusinessTab('create_delivery')}
                className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                  businessTab === 'create_delivery' ? 'bg-[#BF5AF2] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                + Yeni Teslimat
              </button>
              <button
                onClick={() => setBusinessTab('active_deliveries')}
                className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                  businessTab === 'active_deliveries' ? 'bg-[#BF5AF2] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Aktif ({businessPackageList.length})
              </button>
              <button
                onClick={() => setBusinessTab('completed')}
                className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                  businessTab === 'completed' ? 'bg-[#BF5AF2] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Geçmiş
              </button>
              <button
                onClick={() => setBusinessTab('billing')}
                className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                  businessTab === 'billing' ? 'bg-[#BF5AF2] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Cari & Fatura
              </button>
            </div>
            <button
              onClick={() => {
                setCustomerProfileMode('individual');
                setServiceType('motosiklet');
              }}
              className="px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-[#8E8E93] hover:text-white transition-all whitespace-nowrap"
            >
              ← Bireysel
            </button>
          </div>

          {/* 1. TESLİMAT OLUŞTUR (ÇOKLU TESLİMAT / MULTI-DROP - KURAL 2.5) */}
          {businessTab === 'create_delivery' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-4 text-xs">
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-[#BF5AF2] uppercase tracking-wider">
                  KURAL 2.5: ÇOKLU TESLİMAT
                </span>
                <h2 className="text-xl font-bold text-[#F5F5F7]">İşletme Teslimatı Oluştur</h2>
                <p className="text-[#8E8E93] text-xs">
                  Tek işletmeden çıkan paketler kapasiteye göre tek kuryeye atanır.
                </p>
              </div>

              {/* İşletme Alım Noktası */}
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-2">
                <span className="text-[11px] text-[#8E8E93] font-medium block">İşletme Alım Adresi:</span>
                <input
                  type="text"
                  value={businessPickupAddress}
                  onChange={(e) => setBusinessPickupAddress(e.target.value)}
                  className="w-full bg-[#2C2C2E]/70 border border-white/[0.08] focus:border-[#BF5AF2] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Paket Satırları */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">
                    Dağıtılacak Paketler ({businessPackageList.length} / 5 Kapasite)
                  </span>
                  <button
                    onClick={handleAddBusinessPackage}
                    className="px-3 py-1 bg-[#BF5AF2]/20 hover:bg-[#BF5AF2]/30 text-[#BF5AF2] border border-[#BF5AF2]/30 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>Paket Ekle</span>
                  </button>
                </div>

                {businessPackageList.map((pkg, idx) => (
                  <div key={pkg.id} className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[20px] space-y-2">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#BF5AF2]/20 text-[#BF5AF2] text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-mono font-bold text-white text-xs">{pkg.trackingCode}</span>
                      </div>
                      <button
                        onClick={() => setBusinessPackageList(businessPackageList.filter((p) => p.id !== pkg.id))}
                        className="text-[#8E8E93] hover:text-[#FF453A] p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-[#8E8E93] block">Alıcı:</span>
                        <span className="text-white font-medium">{pkg.recipientName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E8E93] block">Telefon:</span>
                        <span className="text-white font-mono">{pkg.recipientPhone}</span>
                      </div>
                    </div>

                    <div className="text-[11px]">
                      <span className="text-[10px] text-[#8E8E93] block">Teslimat Adresi:</span>
                      <span className="text-[#F5F5F7] truncate block">{pkg.dropoffAddress}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8E8E93] pt-1.5 border-t border-white/[0.06]">
                      <span>Ağırlık: <strong className="text-white">{pkg.weightKg} kg</strong></span>
                      <span className="font-mono">PIN Kodu: <strong className="text-white">{pkg.deliveryCode}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kapasite & Fiyat Kontrolü */}
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-2 text-xs">
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Toplam Yük Ağırlığı:</span>
                  <span className="text-[#30D158] font-semibold">{totalBusinessWeight.toFixed(1)} kg / 15 kg (Uygun ✓)</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Önerilen Teslimat Sırası:</span>
                  <span className="text-white font-medium">Optimum Rota Hesaplandı</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Tahmini Toplam Süre:</span>
                  <span className="text-white font-medium">~38 dk</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-white/[0.08]">
                  <span>İşletme Toplu Fiyatı:</span>
                  <span className="text-lg text-white font-bold">{businessPackageList.length * 65} ₺</span>
                </div>
              </div>

              <button
                onClick={handleBusinessMultiDropBooking}
                className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#BF5AF2] hover:bg-[#A84FE0] text-white font-semibold text-xs rounded-2xl shadow-[0_4px_16px_rgba(191,90,242,0.35)] transition-all flex items-center justify-center active:scale-[0.98]"
              >
                Çoklu Teslimatı Onayla & Kurye Çağır
              </button>
            </div>
          )}

          {/* 2. AKTİF TESLİMATLAR */}
          {businessTab === 'active_deliveries' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-3.5 text-xs">
              <div className="space-y-1 pt-1">
                <h2 className="text-xl font-bold text-[#F5F5F7]">Aktif Teslimatlar</h2>
                <p className="text-[#8E8E93] text-xs">
                  Her paketin teslimat adımı bağımsız izlenir; bir paketin sorunu diğerlerini etkilemez.
                </p>
              </div>

              <div className="space-y-2.5">
                {businessPackageList.map((pkg) => (
                  <div key={pkg.id} className="p-3.5 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[20px] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-xs">{pkg.trackingCode}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        pkg.status === 'delivered'
                          ? 'bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30'
                          : pkg.status === 'in_transit'
                          ? 'bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30'
                          : 'bg-white/[0.06] text-[#8E8E93] border-white/[0.08]'
                      }`}>
                        {pkg.status === 'delivered' ? '✓ Teslim Edildi' : pkg.status === 'in_transit' ? '● Kuryede / Yolda' : '○ Alım Bekliyor'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#8E8E93]">
                      <strong className="text-white">Alıcı:</strong> {pkg.recipientName} ({pkg.dropoffAddress})
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06] text-[11px]">
                      <span className="font-mono text-[#8E8E93]">PIN: <strong className="text-white">{pkg.deliveryCode}</strong></span>
                      <button
                        onClick={() => {
                          const updated = businessPackageList.map((p) =>
                            p.id === pkg.id ? { ...p, status: 'delivered' as const } : p
                          );
                          setBusinessPackageList(updated);
                        }}
                        className="px-3 py-1 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white rounded-full text-[10px] font-semibold transition-all active:scale-95"
                      >
                        Teslim Edildi İşaretle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TAMAMLANAN İŞLER */}
          {businessTab === 'completed' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-3.5 text-xs">
              <h2 className="text-xl font-bold text-[#F5F5F7]">Tamamlanan İşletme Siparişleri</h2>
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[20px] space-y-1">
                <div className="flex justify-between font-bold text-white text-sm">
                  <span>Dün: 12 Paket Dağıtımı</span>
                  <span>780,00 ₺</span>
                </div>
                <p className="text-[11px] text-[#8E8E93]">Tüm teslimatlar PIN kodu ile başarıyla tamamlandı.</p>
              </div>
            </div>
          )}

          {/* 4. HESAP HAREKETLERİ */}
          {businessTab === 'billing' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-3.5 text-xs">
              <h2 className="text-xl font-bold text-[#F5F5F7]">Hesap Hareketleri & Cari Bakiye</h2>
              <div className="p-4.5 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] space-y-2">
                <span className="text-[11px] text-[#8E8E93] font-medium block">Cari Açık Bakiye (30 Gün Vadeli):</span>
                <span className="text-2xl font-bold text-white tracking-tight font-mono">4.250,00 ₺</span>
                <span className="text-[11px] text-[#8E8E93] block">Toplu E-Fatura Kesim Günü: Her Ayın 1'i</span>
              </div>
            </div>
          )}

          {/* 5. İŞLETME YÖNETİMİ */}
          {businessTab === 'management' && (
            <div className="w-full h-full p-4 overflow-y-auto pb-24 space-y-3.5 text-xs">
              <h2 className="text-xl font-bold text-[#F5F5F7]">İşletme Yönetimi</h2>
              <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[20px] space-y-2">
                <span className="font-bold text-white text-xs block">Şube & Yetkili Bilgileri</span>
                <div className="text-[11px] text-[#8E8E93] space-y-1.5">
                  <div><strong className="text-white">Firma:</strong> Nişantaşı Gurme Mutfak Ltd. Şti.</div>
                  <div><strong className="text-white">Vergi No:</strong> 3489201940 (Şişli VD)</div>
                  <div><strong className="text-white">Yetkili Personel:</strong> 3 Aktif Çalışan Tanımlı</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ACİL YARDIM MODALI (KURAL 2.10 - APPLE EMERGENCY SOS)                     */}
      {/* ========================================================================= */}
      {showSosModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5.5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF453A]/20 text-[#FF453A] flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-sm font-bold text-white">Acil Durum & Güvenlik</h3>
              </div>
              <button onClick={() => setShowSosModal(false)} className="text-[#8E8E93] hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-[#8E8E93] leading-relaxed">
              Kural 2.10: Acil arama, platforma olay bildirme ve yolculuk paylaşma seçenekleri ayrık tutulmuştur.
            </p>

            {emergencyAlertSent && (
              <div className="p-3 bg-[#FF9F0A]/15 border border-[#FF9F0A]/30 text-[#FF9F0A] rounded-2xl text-xs flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 stroke-[2.5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Simülasyon Test Bildirimi Kaydedildi</span>
                  <span className="text-[10px] text-white/80 leading-relaxed block mt-0.5">
                    İstemci ortamında yerel test kaydı açıldı. Gerçek sunucu, polis veya kamu 112 sevk altyapısı bulunmamaktadır. Hayati tehlike anında lütfen doğrudan telefonunuzdan 112 Acil Çağrı Merkezini arayınız.
                  </span>
                </div>
              </div>
            )}

            {tripLinkCopied && (
              <div className="p-3 bg-[#0A84FF]/15 border border-[#0A84FF]/30 text-[#0A84FF] rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
                <Share2 className="w-4 h-4 stroke-[2.5]" />
                <span>Canlı konum takip linki panoya kopyalandı!</span>
              </div>
            )}

            {/* 3 Ayrık Seçenek - Min 48px Touch Target */}
            <div className="space-y-2.5">
              {/* Seçenek 1: 112 Acil Arama */}
              <a
                href="tel:112"
                onClick={() => reportEmergencyIncident(currentRide?.id || 'GENEL', 'call_112')}
                className="w-full min-h-[48px] min-w-[48px] p-3.5 bg-[#FF453A] hover:bg-[#FF3B30] text-white rounded-2xl flex items-center justify-between font-bold text-xs shadow-lg transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 stroke-[2.2]" />
                  <span>1. 112 Acil Çağrı Merkezini Ara</span>
                </div>
                <span className="font-mono text-[11px] bg-black/30 px-2.5 py-0.5 rounded-full font-bold">112</span>
              </a>

              {/* Seçenek 2: Platforma Olay Bildir */}
              <button
                onClick={() => {
                  reportEmergencyIncident(currentRide?.id || 'SEC-ALERT', 'platform_incident');
                  setEmergencyAlertSent(true);
                }}
                className="w-full min-h-[48px] min-w-[48px] p-3.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white rounded-2xl flex items-center justify-between font-semibold text-xs transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0A84FF]" />
                  <span>2. Platform Güvenlik Masasına Bildir (Simülasyon)</span>
                </div>
                <span className="text-[11px] text-[#8E8E93]">Test Kaydı ➔</span>
              </button>

              {/* Seçenek 3: Canlı Yolculuğu Paylaş */}
              <button
                onClick={() => {
                  reportEmergencyIncident(currentRide?.id || 'SEC-SHARE', 'share_trip');
                  setTripLinkCopied(true);
                }}
                className="w-full min-h-[48px] min-w-[48px] p-3.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white rounded-2xl flex items-center justify-between font-semibold text-xs transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-[#30D158]" />
                  <span>3. Canlı Seferi Yakınlarınla Paylaş</span>
                </div>
                <span className="text-[11px] text-[#8E8E93]">Link ➔</span>
              </button>
            </div>

            {/* Kamu Entegrasyon Uyarısı */}
            <div className="p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] text-[10px] text-[#8E8E93] leading-relaxed">
              ℹ️ <strong>Kamu Entegrasyon Sınırı:</strong> 112 Acil Çağrı sistemlerine otomatik konum aktarımı resmi protokoller gerektirir; bu prototipte canlı kamu sevk garantisi verilmez.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEFER İPTALİ TEYİT VE CEZA BİLDİRİM MODALI (APPLE DIALOG)                */}
      {/* ========================================================================= */}
      {showCancelModal && currentRide && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5.5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF453A]" />
                <h4 className="font-bold text-sm text-white">Seferi İptal Et</h4>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-[#8E8E93] hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const isPolicyApproved = pendingPolicyProposals.some(
                (p) => p.id === 'prop-cancel-fee-25' && p.status === 'approved'
              );
              const feeAmount = isPolicyApproved ? 25 : 0;
              return (
                <div className={`p-3.5 rounded-2xl border space-y-1.5 text-xs ${
                  feeAmount > 0 ? 'bg-[#FF9F0A]/10 border-[#FF9F0A]/25' : 'bg-[#30D158]/10 border-[#30D158]/25'
                }`}>
                  <span className={`font-semibold block flex items-center gap-1.5 ${
                    feeAmount > 0 ? 'text-[#FF9F0A]' : 'text-[#30D158]'
                  }`}>
                    {feeAmount > 0 ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-[#FF9F0A]" />
                        <span>Onaylı İptal Tazminatı ({feeAmount} ₺)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#30D158]" />
                        <span>Masrafsız ve Cezasız İptal (0 ₺)</span>
                      </>
                    )}
                  </span>
                  <p className="text-[#A1A1A6] text-[11px] leading-relaxed">
                    {feeAmount > 0
                      ? 'Yönetici onaylı politika gereği sürücü yola çıktığı için 25 ₺ iptal bedeli (20 ₺ kurye, 5 ₺ platform) yansıtılır.'
                      : 'Talebiniz cezasız olarak iptal edilir. Müşteri cüzdanından veya kartından hiçbir tutar tahsil edilmez.'}
                  </p>
                  {feeAmount === 0 && (
                    <div className="mt-2 pt-2 border-t border-white/[0.08] text-[10px] text-[#FF9F0A] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Onaysız Politika: 25 ₺ geç iptal kesintisi onay bekleyen taslak statüsünde olduğundan 0 ₺ uygulanır.</span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="space-y-1.5">
              <span className="text-[11px] text-[#8E8E93] font-medium block">İptal Nedeni Seçiniz:</span>
              {[
                'Yanlış adres girdim',
                'Sürücü çok uzakta',
                'Planlarım değişti / vazgeçtim',
                'Farklı bir araç buldum',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    cancelReason === reason
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/[0.04] text-[#A1A1A6] hover:text-white'
                  }`}
                >
                  <span>{reason}</span>
                  {cancelReason === reason && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowCancelModal(false)}
                className="min-h-[48px] min-w-[48px] py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center active:scale-95"
              >
                Vazgeç (Sürdür)
              </button>
              <button
                onClick={() => {
                  cancelRide(cancelReason);
                  setShowCancelModal(false);
                }}
                className="min-h-[48px] min-w-[48px] py-3 bg-[#FF453A] hover:bg-[#FF3B30] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center active:scale-95"
              >
                İptali Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONAYLANMAMIŞ KURALLAR & ÖNERİ BİLDİRİMİ MODALI (APPLE DIALOG)             */}
      {/* ========================================================================= */}
      {showUnapprovedNotice && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-6 w-full max-w-xs space-y-3.5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/20 border border-[#0071E3]/30 flex items-center justify-center mx-auto text-[#0A84FF]">
              <Info className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h4 className="font-bold text-base text-white">Öneri ve Kapsam Kuralı</h4>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              {showUnapprovedNotice}
            </p>
            <button
              onClick={() => setShowUnapprovedNotice(null)}
              className="w-full min-h-[48px] min-w-[48px] py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SORUN BİLDİR MODALI (APPLE GROUPED SELECTION)                             */}
      {/* ========================================================================= */}
      {showIssueReportModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5.5 w-full max-w-sm space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-bold text-sm text-white">Mevcut Seferde Sorun Bildir</h3>
              <button onClick={() => setShowIssueReportModal(false)} className="text-[#8E8E93] hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {[
                'Sürücüye Ulaşılamıyor',
                'Yanlış Buluşma Noktası',
                'Sürücü Çok Gecikti',
                'Ücret Uyuşmazlığı',
                'Güvenlik / Şüpheli Durum',
              ].map((issue) => (
                <button
                  key={issue}
                  onClick={() => {
                    reportRideIssue(currentRide?.id || 'RIDE', issue);
                    showNotification({
                      title: 'Sorun Kaydı Oluşturuldu',
                      message: `Bildiriminiz (${issue}) operasyon komuta merkezine iletildi. Sorumlu operatör seferi takip ediyor.`,
                      type: 'info',
                    });
                    setShowIssueReportModal(false);
                  }}
                  className="w-full p-3 bg-[#2C2C2E]/60 hover:bg-[#2C2C2E] border border-white/[0.06] rounded-2xl text-left text-[#F5F5F7] text-xs font-medium transition-all active:scale-[0.99] flex items-center justify-between"
                >
                  <span>{issue}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* E-ARŞİV FATURA / MAKBUZ MODALI (APPLE RECEIPT)                            */}
      {/* ========================================================================= */}
      {showInvoiceModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[32px] p-5.5 w-full max-w-xs space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <h3 className="font-bold text-sm text-white">E-Arşiv Fatura & Makbuz</h3>
              <button onClick={() => setShowInvoiceModal(null)} className="text-[#8E8E93] hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3.5 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-[#8E8E93]"><span>Belge No:</span><strong className="text-white">MP-2026-00941</strong></div>
              <div className="flex justify-between text-[#8E8E93]"><span>Hizmet Türü:</span><span className="text-white">{showInvoiceModal.serviceType}</span></div>
              <div className="flex justify-between text-[#8E8E93]"><span>Hizmet Bedeli:</span><span className="text-white">{showInvoiceModal.platformCommission} ₺</span></div>
              <div className="flex justify-between text-[#8E8E93] pt-1 border-t border-white/[0.06]"><span>Toplam Tutar:</span><strong className="text-[#30D158] text-sm">{showInvoiceModal.totalFare} ₺</strong></div>
            </div>
            <button
              onClick={() => {
                showNotification({
                  title: 'E-Arşiv Fatura İndirildi',
                  message: 'Faturanız (MP-2026-00941) PDF formatında cihazınıza başarıyla indirildi.',
                  type: 'success',
                });
                setShowInvoiceModal(null);
              }}
              className="w-full min-h-[48px] min-w-[48px] py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center"
            >
              PDF İndir
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOKASYON SEÇİM MODALI (SERBEST ARAMA & HARİTADAN SEÇİM - BÖLGE SINIRLAMASI YOK) */}
      {/* ========================================================================= */}
      {showLocationPicker && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.14] rounded-[32px] p-5 w-full max-w-md space-y-3.5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${locationPickerTarget === "pickup" ? "bg-[#30D158]" : "bg-[#0A84FF]"}`} />
                <h3 className="font-bold text-sm text-white">
                  {locationPickerTarget === "pickup" ? "Alış (Kalkış) Noktası" : "Varış Noktası"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowLocationPicker(false);
                  setLocationSearchInput("");
                }}
                className="text-[#8E8E93] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hedef Değiştirme Segmenti (Alış vs Varış) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.06] rounded-xl text-xs font-semibold shrink-0">
              <button
                onClick={() => setLocationPickerTarget("pickup")}
                className={`py-1.5 rounded-lg transition-all ${
                  locationPickerTarget === "pickup" ? "bg-[#30D158] text-black font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Alış: {pickup.name.slice(0, 14)}...
              </button>
              <button
                onClick={() => setLocationPickerTarget("dropoff")}
                className={`py-1.5 rounded-lg transition-all ${
                  locationPickerTarget === "dropoff" ? "bg-[#0A84FF] text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Varış: {dropoff.name.slice(0, 14)}...
              </button>
            </div>

            {/* Arama Girişi */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                placeholder="İlçe, semt, cadde, AVM veya özel adres yazın..."
                className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0A84FF]"
                autoFocus
              />
            </div>

            {/* Haritadan Serbest Pinleme Butonu */}
            <button
              onClick={() => {
                setShowLocationPicker(false);
                setMapSelectMode(locationPickerTarget);
                showNotification({
                  title: "Haritada Pinleyin",
                  message: "Haritada gitmek istediğiniz herhangi bir noktaya dokunun.",
                  type: "info",
                });
              }}
              className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <MapPin className="w-4 h-4 text-[#FF9F0A]" />
              <span>Haritada Serbest Dokunarak / Pin Bırakarak Seç</span>
            </button>

            {/* Sonuç & Lokasyon Listesi (Tüm Türkiye & İstanbul) */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-[180px]">
              {searchLocations(locationSearchInput).map((loc) => (
                <button
                  key={`${loc.name}-${loc.lat}`}
                  onClick={() => {
                    if (locationPickerTarget === "pickup") {
                      setPickup(loc);
                      setPickupConfirmedByUser(true);
                    } else {
                      setDropoff(loc);
                    }
                    setShowLocationPicker(false);
                    setLocationSearchInput("");
                    showNotification({
                      title: locationPickerTarget === "pickup" ? "Alış Noktası Seçildi" : "Varış Noktası Seçildi",
                      message: `${loc.name} olarak güncellendi.`,
                      type: "success",
                    });
                  }}
                  className="w-full p-2.5 bg-[#2C2C2E]/60 hover:bg-[#2C2C2E] border border-white/[0.06] rounded-2xl text-left flex items-center justify-between text-xs transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-full bg-[#0071E3]/20 text-[#0A84FF] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-white block truncate">{loc.name}</span>
                      <span className="text-[11px] text-zinc-400 block truncate">{loc.address}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#0A84FF] font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                    Seç ➔
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SÜRÜCÜ İLE MESAJLAŞMA MODALI (APPLE iMESSAGE STYLE)                       */}
      {/* ========================================================================= */}
      {showChatModal && assignedCourier && (
        <div className="absolute inset-x-2 bottom-16 top-12 z-50 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-4.5 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/[0.1] border border-white/[0.1] text-white flex items-center justify-center text-base font-bold shadow-sm">
                {assignedCourier.avatar}
              </div>
              <div>
                <span className="font-bold text-white text-xs block">{assignedCourier.name}</span>
                <span className="text-[10px] text-[#8E8E93] font-mono">{assignedCourier.plate}</span>
              </div>
            </div>
            <button onClick={() => setShowChatModal(false)} className="text-[#8E8E93] hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 p-2 my-2 rounded-2xl text-xs">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-xs shadow-sm ${
                  msg.sender === 'customer'
                    ? 'bg-[#0071E3] text-white font-medium rounded-br-xs'
                    : 'bg-[#2C2C2E] text-white border border-white/[0.06] rounded-bl-xs'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              sendChatMessage('customer', chatInput.trim());
              setChatInput('');
            }}
            className="flex gap-2 pt-1"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="iMessage / Sürücüye ilet..."
              className="flex-1 bg-[#2C2C2E]/80 border border-white/[0.08] focus:border-[#0071E3] rounded-full px-4 py-2 text-xs text-white placeholder-[#8E8E93] focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-[#0071E3] text-white font-semibold text-xs rounded-full hover:bg-[#0077ED] transition-all active:scale-95 shadow-sm">
              Gönder
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VOIP MASKELİ ARAMA MODALI (APPLE CALL SCREEN)                             */}
      {/* ========================================================================= */}
      {showVoipModal && assignedCourier && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E]/95 border border-white/[0.12] rounded-[36px] p-7 text-center space-y-5 w-full max-w-xs shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#0A84FF] text-white flex items-center justify-center mx-auto shadow-[0_4px_20px_rgba(0,113,227,0.4)]">
              <Phone className="w-8 h-8 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] text-[#0A84FF] font-semibold uppercase tracking-wider block">
                MotoPilot Maskeli Arama
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{assignedCourier.name}</h3>
              <p className="text-xs text-[#8E8E93] font-mono mt-0.5">00:{String(callDuration).padStart(2, '0')}</p>
            </div>
            <div className="p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] text-[10px] text-[#8E8E93] leading-relaxed">
              Kişisel telefon numaranız maskelenmiştir.
            </div>
            <button
              onClick={() => setShowVoipModal(false)}
              className="w-full min-h-[48px] min-w-[48px] py-3.5 bg-[#FF453A] hover:bg-[#FF3B30] text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center active:scale-95"
            >
              Aramayı Sonlandır
            </button>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* ÜCRET VE ROTA DETAY BOTTOM SHEET (APPLE IOS BOTTOM SHEET)                 */}
      {/* ========================================================================= */}
      {showFareDetailSheet && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#1C1C1E]/98 border-t border-white/[0.14] rounded-t-[32px] p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto ring-1 ring-white/10 animate-in slide-in-from-bottom duration-250">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 cursor-pointer" onClick={() => setShowFareDetailSheet(false)} />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#0071E3]/20 text-[#0A84FF]">
                  <Coins className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">Ücret & Sefer Detayları</h3>
              </div>
              <button
                onClick={() => setShowFareDetailSheet(false)}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rota Özeti */}
            <div className="p-3 bg-[#2C2C2E]/60 rounded-2xl border border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8E8E93] text-[11px]">
                <span>Seçili Rota Özeti</span>
                <span className="font-mono text-white font-semibold">{fareEstimate.distanceKm} km · ~{fareEstimate.durationMin} dk</span>
              </div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                <span className="truncate">{pickup.name}</span>
                <span className="text-[#8E8E93]">➔</span>
                <span className="text-[#0A84FF] truncate">{dropoff.name}</span>
              </div>
            </div>

            {/* Kalem Kalem Fiyat Ayrıştırması (%0 Komisyon) */}
            <div className="p-3.5 bg-[#2C2C2E]/40 rounded-2xl border border-white/[0.06] space-y-2 text-xs">
              <span className="text-[10px] text-[#30D158] font-semibold uppercase tracking-wider block">
                M0 Sıfır Komisyonlu Tarife Dökümü (M0-ZERO-COMMISSION-2026-V1)
              </span>

              <div className="flex justify-between text-[#A1A1A6]">
                <span>Taban Açılış Ücreti:</span>
                <span className="font-mono text-white">
                  {serviceType === 'motosiklet' ? tariffs.motorcycleBaseFare : tariffs.courierBaseFare} ₺
                </span>
              </div>

              <div className="flex justify-between text-[#A1A1A6]">
                <span>Mesafe & Seyahat Ücreti:</span>
                <span className="font-mono text-white">
                  {Math.round((fareEstimate.subtotal - (serviceType === 'motosiklet' ? tariffs.motorcycleBaseFare : tariffs.courierBaseFare)) * 10) / 10} ₺
                </span>
              </div>

              <div className="flex justify-between text-[#A1A1A6]">
                <span>Platform Sipariş Komisyonu (%0):</span>
                <span className="font-mono text-[#30D158] font-bold">0 ₺</span>
              </div>

              <div className="flex justify-between text-[#A1A1A6]">
                <span>Sabit Platform Hizmet Bedeli:</span>
                <span className="font-mono text-[#30D158] font-bold">0 ₺</span>
              </div>

              <div className="flex justify-between text-[#A1A1A6]">
                <span>Sürücü / Kurye Net Hakedişi (%100):</span>
                <span className="font-mono text-[#30D158] font-bold">{fareEstimate.courierEarnings} ₺</span>
              </div>

              {tariffs.surgeMultiplier > 1 && (
                <div className="flex justify-between text-[#FF9F0A] font-semibold">
                  <span>Talep Yoğunluğu (Surge):</span>
                  <span className="font-mono">{tariffs.surgeMultiplier}x</span>
                </div>
              )}

              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-sm">
                <span className="font-bold text-white">Net Toplam Tutar:</span>
                <span className="font-mono font-bold text-base text-[#30D158]">{fareEstimate.totalFare} ₺</span>
              </div>
            </div>

            {/* Ödeme Yöntemi Seçici */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#8E8E93] font-medium block">Ödeme Yöntemi:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'credit_card', label: 'Kredi Kartı', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  { id: 'wallet', label: `Cüzdan (${customerWalletBalance}₺)`, icon: <Wallet className="w-3.5 h-3.5" /> },
                  { id: 'cash', label: 'Nakit', icon: <Coins className="w-3.5 h-3.5" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(m.id as any)}
                    className={`min-h-[44px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                      selectedPaymentMethod === m.id
                        ? 'bg-[#0071E3]/20 border-[#0A84FF] text-white font-semibold'
                        : 'bg-white/[0.04] border-white/[0.06] text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {m.icon}
                    <span className="text-[10px] leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aksiyon Butonları (Min 48px) */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFareDetailSheet(false)}
                className="min-h-[48px] min-w-[48px] py-3.5 bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs rounded-2xl transition-all flex items-center justify-center active:scale-95"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFareDetailSheet(false);
                  handlePersonalBooking(serviceType);
                }}
                className="min-h-[48px] min-w-[48px] py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl shadow-[0_4px_16px_rgba(0,113,227,0.4)] transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Hemen Çağır</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KULLANICI & İŞLETME MENÜ ÇEKMECESİ (APPLE HIG SIDE DRAWER)                 */}
      {/* ========================================================================= */}
      {showMenuDrawer && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-[#16161A] border-l border-white/[0.12] h-full p-4 flex flex-col space-y-4 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#0A84FF] text-white font-bold text-xs flex items-center justify-center shadow-md">
                  Bİ
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Bedirhan İbanoğlu</h3>
                  <span className="text-[10px] text-[#8E8E93] font-mono">ID: MP-CUST-3401</span>
                </div>
              </div>
              <button
                onClick={() => setShowMenuDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bakiye & Hızlı Yükleme Kartı */}
            <div className="p-3.5 bg-[#1C1C1E] rounded-2xl border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E8E93] text-[11px]">MotoPilot Cüzdan</span>
                <span className="font-mono font-bold text-white text-sm">{customerWalletBalance} ₺</span>
              </div>
              <button
                onClick={() => {
                  topUpCustomerWallet(100);
                  showNotification({
                    title: 'Bakiye Yüklendi',
                    message: '+100 ₺ cüzdanınıza başarıyla eklendi.',
                    type: 'success',
                  });
                }}
                className="w-full min-h-[38px] py-2 bg-[#0071E3]/20 hover:bg-[#0071E3]/30 border border-[#0A84FF]/30 text-[#0A84FF] rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+100 ₺ Hızlı Yükle</span>
              </button>
            </div>

            {/* Hızlı Menü Bağlantıları */}
            <div className="space-y-1.5 text-xs flex-1">
              <span className="text-[10px] text-[#8E8E93] font-semibold uppercase tracking-wider block px-1">
                Gezinme
              </span>

              <button
                onClick={() => {
                  setCustomerProfileMode('individual');
                  setPersonalTab('ride');
                  setShowMenuDrawer(false);
                }}
                className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  customerProfileMode === 'individual' && personalTab === 'ride'
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#A1A1A6] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-[#0A84FF]" />
                  <span>Taksi & Kurye Çağır (Harita)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setCustomerProfileMode('individual');
                  setPersonalTab('package');
                  setShowMenuDrawer(false);
                }}
                className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  customerProfileMode === 'individual' && personalTab === 'package'
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#A1A1A6] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#30D158]" />
                  <span>Paket Kuryesi Çağır</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setCustomerProfileMode('individual');
                  setPersonalTab('history');
                  setShowMenuDrawer(false);
                }}
                className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  customerProfileMode === 'individual' && personalTab === 'history'
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#A1A1A6] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#FF9F0A]" />
                  <span>Geçmiş Seferlerim</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setCustomerProfileMode('individual');
                  setPersonalTab('loyalty');
                  setShowMenuDrawer(false);
                }}
                className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  customerProfileMode === 'individual' && personalTab === 'loyalty'
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#A1A1A6] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#FFD60A]" />
                  <span>Sadakat, Kupon & Fırsatlar</span>
                </div>
                <span className="text-[10px] font-mono text-[#30D158] font-bold">
                  {loyaltyAccount.availablePoints} P
                </span>
              </button>

              <button
                onClick={() => {
                  setShowMenuDrawer(false);
                  setActiveView('business');
                }}
                className="w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-center justify-between transition-all bg-[#BF5AF2]/15 hover:bg-[#BF5AF2]/25 border border-[#BF5AF2]/30 text-[#BF5AF2] text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#BF5AF2]" />
                  <span>Kurumsal İşletme Portalı'na Geç</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

            {/* Güvenlik & Destek */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setShowMenuDrawer(false);
                  setShowSosModal(true);
                }}
                className="w-full min-h-[44px] p-2.5 bg-[#FF453A]/15 hover:bg-[#FF453A]/25 border border-[#FF453A]/30 text-[#FF453A] rounded-xl text-xs font-semibold flex items-center justify-between transition-all active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
                  <span>Acil Durum (SOS / 112)</span>
                </div>
                <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded-full">112</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuDrawer(false);
                  setShowIssueReportModal(true);
                }}
                className="w-full min-h-[44px] p-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-[#F5F5F7] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <HelpCircle className="w-4 h-4 text-[#8E8E93]" />
                <span>Destek Masası & Geri Bildirim</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KUPON & SADAKAT PUANI UYGULAMA MODALİ (GETİR & UBER TARZI) */}
      {showCouponModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-[32px] p-5 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#0A84FF]" />
                <h3 className="font-bold text-sm text-white">Kupon & Puan İndirimi</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kupon Kodu Girişi */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#8E8E93] block font-medium">Kupon Kodu Gir:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="Örn: HOŞGELDİN, YAZ50"
                  className="flex-1 bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono uppercase text-xs focus:outline-none focus:border-[#0071E3]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!couponCodeInput.trim()) return;
                    const res = applyCouponCode(couponCodeInput.trim(), fareEstimate.totalFare, serviceType);
                    if (res.success) {
                      setShowCouponModal(false);
                      setCouponCodeInput('');
                    }
                  }}
                  className="px-3.5 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold rounded-xl active:scale-95 transition-all"
                >
                  Uygula
                </button>
              </div>
            </div>

            {/* Sadakat Puanı Harcama */}
            <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8E8E93]">Sadakat Bakiyeniz:</span>
                <span className="font-mono font-bold text-[#FFD60A]">
                  {loyaltyAccount.availablePoints} Puan ({Math.round(loyaltyAccount.availablePoints * loyaltySettings.pointRedeemRateLira)} ₺)
                </span>
              </div>
              {loyaltyAccount.availablePoints >= loyaltySettings.minRedeemPoints ? (
                <button
                  type="button"
                  onClick={() => {
                    const res = redeemLoyaltyPoints(
                      Math.min(loyaltyAccount.availablePoints, 100),
                      fareEstimate.totalFare
                    );
                    if (res.success) {
                      setShowCouponModal(false);
                    }
                  }}
                  className="w-full py-2 bg-[#30D158]/20 hover:bg-[#30D158]/30 border border-[#30D158]/40 text-[#30D158] font-bold rounded-xl transition-all active:scale-95 text-xs"
                >
                  {Math.min(loyaltyAccount.availablePoints, 100)} Puan Harca (-{Math.round(Math.min(loyaltyAccount.availablePoints, 100) * loyaltySettings.pointRedeemRateLira)} ₺ İndirim)
                </button>
              ) : (
                <span className="text-[10px] text-[#8E8E93] block text-center">
                  En az {loyaltySettings.minRedeemPoints} puan ile indirim kullanılabilir.
                </span>
              )}
            </div>

            {/* Mevcut Aktif Kampanyalar */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#8E8E93] font-semibold uppercase tracking-wider block">
                Kullanabileceğiniz Fırsatlar
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {campaigns
                  .filter((c) => c.status === 'active')
                  .slice(0, 3)
                  .map((cmp) => (
                    <div
                      key={cmp.id}
                      className="p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#0A84FF] text-xs block">{cmp.code}</span>
                        <span className="text-[10px] text-[#8E8E93] block">{cmp.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const res = applyCouponCode(cmp.code, fareEstimate.totalFare, serviceType);
                          if (res.success) {
                            setShowCouponModal(false);
                          }
                        }}
                        className="px-2.5 py-1 bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-[10px] rounded-lg"
                      >
                        Seç
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowCouponModal(false);
                  setPersonalTab('loyalty');
                }}
                className="text-xs text-[#0A84FF] hover:underline font-semibold"
              >
                Tüm Sadakat & Ödül Merkezini Aç →
              </button>
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
          isRideActive ? (
            <span className="text-white font-mono text-[9px]">
              {currentRide?.status === 'in_progress'
                ? 'Yolda'
                : currentRide?.status === 'arrived'
                ? 'Kapıda'
                : 'Kurye 2dk'}
            </span>
          ) : isRideCompleted ? (
            <span className="text-white font-mono text-[9px] font-bold">✓ Bitti</span>
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
          <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3] shadow-[0_0_8px_#0071E3]" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            MotoPilot Müşteri & İşletme Uygulaması
          </h2>
        </div>

        <button
          onClick={() => setUseDeviceFrame(!useDeviceFrame)}
          className="px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.12] text-xs font-semibold text-[#F5F5F7] flex items-center gap-1.5 transition-all active:scale-95"
        >
          {useDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          <span>{useDeviceFrame ? 'Geniş Görünüm' : 'iPhone Çerçevesi'}</span>
        </button>
      </div>

      {useDeviceFrame ? (
        <PhoneFrame
          dynamicIslandContent={
            isRideActive ? (
              <span className="text-white font-mono text-[9px]">
                {currentRide?.status === 'in_progress'
                  ? 'Yolda'
                  : currentRide?.status === 'arrived'
                  ? 'Kapıda'
                  : 'Kurye 2dk'}
              </span>
            ) : isRideCompleted ? (
              <span className="text-white font-mono text-[9px] font-bold">✓ Bitti</span>
            ) : undefined
          }
        >
          {appContent}
        </PhoneFrame>
      ) : (
        <div className="w-full h-[840px] rounded-[36px] overflow-hidden border border-white/[0.1] shadow-2xl relative bg-[#0A0A0C]">
          {appContent}
        </div>
      )}
    </div>
  );
};
