import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, Bell } from 'lucide-react';
import {
  computeSha256Hex,
  computeDeterministicHex,
  generateSealHash,
  verifyAuditLogChain,
  generateSecureUUID,
} from '../utils/crypto';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { api } from '../services/api';
import {
  ServiceType,
  OrderTimingOption,
  MultiDropStop,
  RideStatus,
  Courier,
  RideOrder,
  TariffSettings,
  LocationPoint,
  ComplaintTicket,
  PlatformView,
  ChatMessage,
  SavedCard,
  WalletTransaction,
  LedgerEntry,
  SystemSnapshot,
  CourierShift,
  TrafficPenalty,
  VehicleAssignment,
  CashVault,
  CashTransferRecord,
  DamageReport,
  WarehousePart,
  ServiceWorkOrder,
  SystemBlockage,
  AuditLogEntry,
  DailyClosingAudit,
  UserProfileMode,
  CourierEquipmentMode,
  CourierServicePermissions,
  DeliveryPackageItem,
  PaymentMethod,
  TransactionReconciliationRecord,
  PolicyProposal,
  DetectedUnapprovedRecord,
  AccessibleNotification,
  BusinessAccount,
  BusinessSubUser,
  isValidOrderTransition,
  roundCurrency,
  calculateHaversineDistanceKm,
  toISODateString,
  createZeroCommissionFeeSnapshot,
  mapLegacyServiceTypeToCanonical,
} from '../types/platform';
import {
  INITIAL_COURIERS,
  INITIAL_TARIFFS,
  INITIAL_PAST_RIDES,
  ISTANBUL_LOCATIONS,
  TURKEY_WIDE_LOCATIONS,
  INITIAL_BUSINESS_ACCOUNTS,
  INITIAL_COMPLAINTS,
  INITIAL_VEHICLE_ASSIGNMENTS,
  INITIAL_CASH_VAULTS,
  INITIAL_CASH_TRANSFERS,
  INITIAL_DAMAGE_REPORTS,
  INITIAL_WAREHOUSE_PARTS,
  INITIAL_SERVICE_WORK_ORDERS,
  INITIAL_SYSTEM_BLOCKAGES,
  INITIAL_AUDIT_LOG_ENTRIES,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_DAILY_CLOSING_CHECKLIST,
} from '../data/platformData';
import {
  LoyaltyTier,
  LoyaltyTierConfig,
  LoyaltyAccount,
  LoyaltyTransaction,
  LoyaltySettings,
  ReferralProgramType,
  ReferralStatus,
  ReferralCode,
  ReferralRecord,
  ReferralProgramConfig,
  Campaign,
  CampaignStatus,
  CouponRedemptionRecord,
  DriverQuest,
  MerchantLoyaltyProfile,
  WinBackOffer,
  GiftCredit,
  FraudAuditRecord,
} from '../types/loyalty';
import {
  INITIAL_LOYALTY_TIER_CONFIGS,
  INITIAL_LOYALTY_SETTINGS,
  INITIAL_CUSTOMER_LOYALTY_ACCOUNT,
  INITIAL_LOYALTY_TRANSACTIONS,
  INITIAL_REFERRAL_PROGRAMS,
  INITIAL_REFERRAL_CODES,
  INITIAL_REFERRAL_RECORDS,
  INITIAL_CAMPAIGNS,
  INITIAL_COUPON_REDEMPTIONS,
  INITIAL_DRIVER_QUESTS,
  INITIAL_MERCHANT_PROFILES,
  INITIAL_WIN_BACK_OFFERS,
  INITIAL_GIFT_CREDITS,
  INITIAL_FRAUD_RECORDS,
} from '../data/loyaltyData';
import { DriverApplication, MerchantLead } from '../types/website';

interface PlatformContextType {
  activeView: PlatformView;
  setActiveView: (view: PlatformView) => void;

  // MotoPilot Profile Mode
  customerProfileMode: UserProfileMode;
  setCustomerProfileMode: (mode: UserProfileMode) => void;

  // Tariffs & Settings
  tariffs: TariffSettings;
  updateTariffs: (newTariffs: Partial<TariffSettings>) => void;

  // Couriers
  couriers: Courier[];
  activeCourier: Courier;
  setActiveCourierId: (id: string) => void;
  toggleCourierOnline: (courierId: string) => void;
  approveCourierDocument: (courierId: string, docKey: keyof Courier['documents']) => void;
  toggleCourierVerification: (courierId: string) => void;
  toggleCourierPermission: (courierId: string, permKey: keyof CourierServicePermissions) => void;
  setCourierEquipmentMode: (courierId: string, mode: CourierEquipmentMode) => void;

  // Customer & Ride Operations
  currentRide: RideOrder | null;
  allRides: RideOrder[];
  calculateFare: (
    serviceType: ServiceType,
    pickup: LocationPoint,
    dropoff: LocationPoint,
    extraStopsCount?: number,
    waitMinutes?: number
  ) => {
    distanceKm: number;
    durationMin: number;
    subtotal: number;
    serviceFeePercentAmount: number;
    serviceFeeFixedAmount: number;
    totalFare: number;
    platformCommission: number;
    courierEarnings: number;
  };
  requestRide: (params: {
    serviceType: ServiceType;
    pickup: LocationPoint;
    dropoff: LocationPoint;
    pickupDescription?: string;
    pickupConfirmedByUser?: boolean;
    packageNote?: string;
    packageWeightKg?: number;
    packageSize?: 'zarf' | 'kucuk' | 'orta' | 'buyuk';
    isPackageReady?: boolean;
    deliveryInstructions?: string;
    packagesList?: DeliveryPackageItem[];
    recipientContact?: { name: string; phone: string };
    bargainOfferedFare?: number;
    bargainReason?: string;
    timing?: OrderTimingOption;
    scheduledTime?: string;
    extraStops?: MultiDropStop[];
    waitMinutes?: number;
    purchaseItemList?: string;
    estimatedItemCost?: number;
    businessOrderNumber?: string;
    multiPackageCount?: number;
    paymentMethod?: PaymentMethod;
  }) => void;
  cancelRide: (reason?: string) => void;
  reportRideIssue: (rideId: string, issue: string) => void;
  reportEmergencyIncident: (rideId: string, incidentType: 'call_112' | 'platform_incident' | 'share_trip') => void;
  updateDeliveryPackageStatus: (
    rideId: string,
    packageId: string,
    status: 'in_transit' | 'delivered' | 'failed' | 'returned',
    options?: {
      failureReason?: string;
      returnReason?: string;
      verifiedRecipientName?: string;
      verificationCodeEntered?: string;
      verificationMethod?: 'code' | 'signature_photo' | 'manual_name';
    }
  ) => void;

  // Sünnet Pazarlığı / Fare Bargaining Actions
  acceptBargainOffer: (agreedFare?: number) => void;
  counterBargainOffer: (counterFare: number, note?: string) => void;
  declineBargainOffer: () => void;

  // Courier Ride Actions
  acceptRide: () => void;
  rejectRide: () => void;
  arriveAtPickup: () => void;
  startTrip: (enteredCode: string) => boolean;
  completeTrip: (deliveryPhotoUrl?: string) => boolean;
  rateCompletedRide: (rating: number, review?: string) => void;
  dismissCompletedRide: () => void;

  // Real-time Chat & Voice Intercom
  chatMessages: ChatMessage[];
  helmetTtsActive: boolean;
  toggleHelmetTts: () => void;
  sendChatMessage: (
    sender: 'customer' | 'courier',
    text: string,
    options?: { isVoiceNote?: boolean; voiceDurationSec?: number }
  ) => void;

  // Favorite Drivers & Direct Booking & 7/24 Persistent Chat
  favoriteCourierIds: string[];
  toggleFavoriteCourier: (courierId: string) => void;
  directBookCourier: (
    courierId: string,
    params: {
      serviceType: ServiceType;
      pickup: LocationPoint;
      dropoff: LocationPoint;
      packageNote?: string;
    }
  ) => void;
  directChats: Record<string, ChatMessage[]>;
  sendDirectMessageToCourier: (
    courierId: string,
    text: string,
    options?: { isVoiceNote?: boolean; voiceDurationSec?: number; sender?: 'customer' | 'courier' }
  ) => void;

  // Admin Actions
  complaints: ComplaintTicket[];
  resolveComplaint: (id: string, issueRefund: boolean) => void;
  approveAllPendingPayouts: () => void;
  adminAddSurge: (multiplier: number) => void;

  // Stats
  platformStats: {
    totalRevenue: number;
    platformCommissionEarned: number;
    totalTripsCompleted: number;
    activeDriversOnline: number;
  };

  // Customer Wallet & Real Cards
  customerWalletBalance: number;
  topUpCustomerWallet: (amount: number) => void;
  customerCards: SavedCard[];
  addCustomerCard: (card: { cardHolder: string; cardNumber: string; exp: string; cvv: string }) => boolean;
  deleteCustomerCard: (id: string) => void;
  setDefaultCustomerCard: (id: string) => void;
  customerTransactions: WalletTransaction[];

  // Courier TFKS Shift, Cash-in-Hand & Penalties
  courierShift: CourierShift;
  startCourierShift: (params: { bikePlate: string; startKm: number; photosApproved: boolean }) => void;
  endCourierShift: () => void;
  courierCashInHand: number;
  courierPenalties: TrafficPenalty[];
  payCourierPenalty: (id: string) => void;

  // Admin EOD Closing & Audit
  dailyClosingStatus: {
    isClosed: boolean;
    closedAt?: string;
    totalSettled: number;
    totalCashCollected: number;
    auditHash?: string;
  };
  closeDayAndSeal: () => void;

  // TFKS Operasyon Sınıfları
  vehicleAssignments: VehicleAssignment[];
  assignVehicle: (plate: string, courierId: string) => void;
  unassignVehicle: (assignmentId: string) => void;

  cashVaults: CashVault[];
  cashTransfers: CashTransferRecord[];
  createCashTransfer: (fromVaultId: string, toVaultId: string, amount: number, justification: string) => void;
  approveCashTransfer: (transferId: string) => void;

  damageReports: DamageReport[];
  addDamageReport: (report: Omit<DamageReport, 'id'>) => void;

  warehouseParts: WarehousePart[];
  adjustPartStock: (partId: string, delta: number) => void;

  serviceWorkOrders: ServiceWorkOrder[];
  createServiceWorkOrder: (order: { plate: string; fault: string; mechanic: string; courierName: string }) => void;
  approveTestDriveAndCloseService: (workOrderId: string) => void;

  systemBlockages: SystemBlockage[];
  unlockSystemBlockage: (blockageId: string, justification: string) => void;

  auditLogs: AuditLogEntry[];
  recordAuditLog: (entry: {
    actionType: AuditLogEntry['actionType'];
    screenName: string;
    recordId: string;
    previousValue: string;
    newValue: string;
    justification: string;
  }) => { success: boolean; logId: string; hash: string };

  dailyClosingAudit: DailyClosingAudit;
  runDailyClosingCheck: (overrideNote?: string) => boolean;

  // Apple Typography & Accessibility Dynamic Type System
  dynamicTypeScale: number;
  dynamicTypePreset: 'small' | 'standard' | 'large' | 'accessibility1' | 'accessibility2';
  setDynamicTypeScale: (scale: number) => void;
  setDynamicTypePreset: (preset: 'small' | 'standard' | 'large' | 'accessibility1' | 'accessibility2') => void;
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  toggleThemeMode: () => void;

  // Ödeme Yöntemi & Senaryoları (Nakit / Sanal POS Kart / Cüzdan)
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;

  // Finansal Uzlaşma & İşlem Mutabakatı (Reconciliation)
  reconciliationRecords: TransactionReconciliationRecord[];

  // Onay Bekleyen Finansal Politika Önerileri (Yürürlükte Olmayan Taslaklar)
  pendingPolicyProposals: PolicyProposal[];
  decidePolicyProposal: (id: string, decision: 'approved' | 'rejected', notes?: string) => void;

  // Onaysız Kural İle Üretilmiş Geçmiş İşlem Tespiti (Silinmedi, Raporlandı)
  detectedUnapprovedRecords: DetectedUnapprovedRecord[];
  refundUnapprovedRecord: (recordId: string) => void;

  // Apple & WCAG Erişilebilir Bildirim & Duyuru Sistemi
  notificationQueue: AccessibleNotification[];
  activeNotification: AccessibleNotification | null;
  notificationHistory: AccessibleNotification[];
  dismissNotification: (id?: string) => void;
  clearNotificationHistory: () => void;
  showNotification: (params: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    durationMs?: number;
    isCritical?: boolean;
  }) => void;

  // ==========================================
  // SADAKAT, KAMPANYA, DAVET & ÖDÜL SİSTEMLERİ
  // ==========================================
  // 1. Müşteri Sadakat & Puan
  loyaltyAccount: LoyaltyAccount;
  loyaltyTiers: LoyaltyTierConfig[];
  loyaltySettings: LoyaltySettings;
  loyaltyTransactions: LoyaltyTransaction[];
  updateLoyaltySettings: (settings: Partial<LoyaltySettings>) => void;
  redeemLoyaltyPoints: (pointsToRedeem: number, currentTotalFare: number) => { success: boolean; message: string; discountLira: number };
  appliedPointsDiscount: number;
  appliedPointsCount: number;
  clearPointsDiscount: () => void;

  // 2. Davet & Referans Sistemi (3 Farklı Program)
  referralPrograms: ReferralProgramConfig[];
  referralCodes: ReferralCode[];
  referralRecords: ReferralRecord[];
  updateReferralProgramConfig: (id: string, partial: Partial<ReferralProgramConfig>) => void;
  generateReferralCode: (programType: ReferralProgramType) => string;
  registerReferralUsage: (code: string, referredContact: string, referredName: string) => { success: boolean; message: string };
  reviewFlaggedReferral: (referralId: string, decision: 'approve' | 'reject', justification: string) => void;

  // 3. Kupon & Kampanya Motoru
  campaigns: Campaign[];
  activeCoupon: Campaign | null;
  couponRedemptions: CouponRedemptionRecord[];
  applyCouponCode: (code: string, orderTotalFare: number, service: ServiceType) => { success: boolean; message: string; discountLira: number };
  removeCouponCode: () => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'usedBudgetLira' | 'currentUsageCount'>) => void;
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => void;

  // 4. Sürücü / Kurye Teşvikleri & Görevleri
  driverQuests: DriverQuest[];
  claimDriverQuestBonus: (questId: string) => void;
  createDriverQuest: (quest: Omit<DriverQuest, 'id'>) => void;

  // 5. İşletme Sadakati & Büyüme
  merchantProfiles: MerchantLoyaltyProfile[];
  updateMerchantTier: (merchantId: string, newTier: 'standard' | 'growth' | 'enterprise') => void;

  // 6. Geri Kazanım & Hediye Kredisi
  winBackOffers: WinBackOffer[];
  giftCredits: GiftCredit[];
  sendGiftCredit: (recipientContact: string, recipientName: string, amount: number, message: string) => { success: boolean; message: string; code?: string };
  redeemGiftCredit: (redemptionCode: string) => { success: boolean; message: string; amount?: number };

  // 7. Suistimal ve Şüpheli İşlem Güvenlik Masası
  fraudAuditRecords: FraudAuditRecord[];
  resolveFraudRecord: (recordId: string, resolutionNote: string) => void;

  // 8. Kurumsal Web Sitesi & Başvuru Funnel Masası
  driverApplications: DriverApplication[];
  merchantLeads: MerchantLead[];
  submitDriverApplication: (app: Omit<DriverApplication, 'id' | 'status' | 'submittedAt'>) => DriverApplication;
  submitMerchantLead: (lead: Omit<MerchantLead, 'id' | 'status' | 'submittedAt'>) => MerchantLead;
  updateDriverApplicationStatus: (id: string, status: DriverApplication['status'], notes?: string) => void;
  updateMerchantLeadStatus: (id: string, status: MerchantLead['status'], notes?: string) => void;

  // 9. Kurumsal İşletme & Alt Kullanıcılar (Business Sub-Users & ACL)
  businessAccounts: BusinessAccount[];
  activeBusinessAccount: BusinessAccount;
  activeBusinessSubUser: BusinessSubUser | null;
  setActiveBusinessAccount: (bizId: string) => void;
  setActiveBusinessSubUserId: (subUserId: string | null) => void;
  addBusinessSubUser: (businessId: string, subUser: Omit<BusinessSubUser, 'id' | 'createdAt' | 'lastLoginAt'>) => void;
  updateBusinessSubUser: (subUserId: string, updates: Partial<BusinessSubUser>) => void;
  deleteBusinessSubUser: (subUserId: string) => void;

  // 10. Serbest Konum & Rota Motoru (Bölge Sınırlaması Yok)
  turkeyLocations: LocationPoint[];
  searchLocations: (query: string) => LocationPoint[];
  resolveLocationFromCoords: (lat: number, lng: number) => LocationPoint;

  // 11. Mimari, Hata, Çift Taraflı Defter (Ledger), SHA-256 & Time-Travel Motoru (B1-B23, A20)
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  createOrder: (order: Partial<RideOrder>, idempotencyKey?: string) => Promise<{ success: boolean; orderId: string }>;
  updateOrderStatus: (orderId: string, status: RideStatus) => void;
  assignCourierToOrder: (orderId: string, courierId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  updateCourier: (courierId: string, updates: Partial<Courier>) => void;
  blockCourier: (courierId: string, reason: string) => Promise<{ success: boolean; message: string }>;
  ledgerEntries: LedgerEntry[];
  recordLedgerEntry: (params: {
    accountDebit: string;
    accountCredit: string;
    amount: number;
    transactionRefId: string;
    description: string;
  }) => Promise<LedgerEntry>;
  verifyLedgerBalance: () => { isBalanced: boolean; totalDebit: number; totalCredit: number; entryCount: number };
  verifyAuditChain: () => { isValid: boolean; checkedCount: number; brokenRecordId?: string };
  snapshots: SystemSnapshot[];
  createSnapshot: (label?: string) => Promise<SystemSnapshot>;
  restoreSnapshot: (snapshotId: string) => boolean;
  deleteSnapshot: (snapshotId: string) => void;
  lastSyncedAt: string;
  syncWithServer: () => Promise<{ synced: boolean; outboxFlushed: number }>;
}

export interface PlatformNotification extends AccessibleNotification {}

const INITIAL_SAVED_CARDS: SavedCard[] = [
  {
    id: 'card-1',
    cardHolder: 'Bedirhan İbanoğlu',
    last4: '4821',
    exp: '09/28',
    brand: 'mastercard',
    isDefault: true,
  },
  {
    id: 'card-2',
    cardHolder: 'Bedirhan İbanoğlu',
    last4: '9012',
    exp: '11/27',
    brand: 'visa',
    isDefault: false,
  },
];

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    type: 'topup',
    amount: 250,
    description: '3D Secure Kredi Kartından Bakiye Yükleme',
    date: '02.10.2026 14:20',
  },
  {
    id: 'tx-2',
    type: 'ride_payment',
    amount: -85,
    description: 'Beşiktaş → Levent Yolculuk Ücreti',
    date: '01.10.2026 18:45',
  },
  {
    id: 'tx-3',
    type: 'topup',
    amount: 185,
    description: 'Promosyon & Sadakat İkramiyesi (BLESYUM50)',
    date: '29.09.2026 10:15',
  },
  {
    id: 'tx-cancel-legacy-99',
    type: 'ride_payment',
    amount: 25,
    description: 'Geç İptal Cezai Bedeli (MP-9941) - Sürücü Zaman/Yakıt Tazminatı [Onaysız Eski Kural]',
    date: '30.09.2026 16:10',
  },
];

const INITIAL_RECONCILIATION_RECORDS: TransactionReconciliationRecord[] = [
  {
    id: 'REC-PAST-01',
    rideId: 'RIDE-101',
    timestamp: '01.10.2026 18:45',
    paymentMethod: 'wallet',
    amountCollected: 85,
    collectionChannel: 'simulation_wallet',
    courierEarnings: 85,
    platformCommission: 0,
    cancellationFeeApplied: 0,
    appliedRule: {
      ruleCode: 'M0-ZERO-COMMISSION-2026-V1',
      description: 'M0 %0 Komisyon Onaylı Tarifesi (%100 Sürücü/Kurye Hakedişi / %0 Platform Payı)',
      isApprovedByUser: true,
    },
    reconciliationStatus: 'balanced',
    idempotencyKey: 'idem_RIDE-101_settlement',
    isIdempotentVerified: true,
    notes: 'Geçmiş tamamlanan yolculuk mutabakatı (%0 komisyon, %100 sürücü hakedişi).',
  },
];

const INITIAL_POLICY_PROPOSALS: PolicyProposal[] = [
  {
    id: 'prop-cancel-fee-25',
    policyKey: 'late_cancellation_penalty',
    title: 'Geç İptal Cezai Şartı ve Sürücü Telafisi Taslağı (25 ₺ / 20 ₺)',
    proposedFee: 25,
    proposedCourierShare: 20,
    status: 'pending_approval',
    description: 'Sürücü sevk halindeyken veya alış noktasına vardıktan sonra yapılan iptallerde müşteriden 25 ₺ kesinti yapılıp 20 ₺ sürücü telafisi aktarılması önerisi.',
    warningNote: 'Kullanıcı onayı olmadığı için yürürlükte DEĞİLDİR; tüm iptaller 0 ₺ masrafsız olarak işletilmektedir.',
    createdAt: '08.10.2026 19:30',
  },
  {
    id: 'prop-al-getir-service',
    policyKey: 'al_getir_tarife',
    title: 'Al Getir Hizmeti Taban Fiyatlandırma Politikası',
    proposedFee: 35,
    proposedCourierShare: 28,
    status: 'pending_approval',
    description: 'Market / eczane / mağazadan al-getir hizmeti için ek taban servis komisyonu politikası.',
    warningNote: 'Karar bekleyen operasyon önerisi statüsündedir.',
    createdAt: '08.10.2026 19:30',
  },
];

const INITIAL_COURIER_PENALTIES: TrafficPenalty[] = [
  {
    id: 'ceza-1',
    plate: '34 BLY 717',
    date: '28.09.2026 15:42',
    code: 'KTK-51/2-A',
    title: 'Hız Sınırını %10-%30 Aşmak (Barbaros Bulvarı Radar)',
    fullAmount: 1506,
    discountedAmount: 1129.5,
    status: 'unpaid',
    acknowledgedByCourier: true,
    acknowledgedAt: '28.09.2026 16:10',
    courierReadStatus: 'read',
  },
];

const INITIAL_DRIVER_APPLICATIONS: DriverApplication[] = [
  {
    id: 'dapp-101',
    fullName: 'Emre Ceylan',
    phone: '0532 411 90 82',
    email: 'emre.ceylan@gmail.com',
    city: 'İstanbul',
    district: 'Kadıköy',
    vehicleType: 'scooter_125',
    vehiclePlate: '34 FZR 812',
    vehicleModelYear: 2023,
    drivingLicenseClass: 'A2',
    experienceYears: 4,
    hasSecondHelmet: true,
    hasDeliveryBox: true,
    servicePreference: 'passenger_and_courier',
    status: 'interview_scheduled',
    submittedAt: '12.10.2026 14:15',
    notes: 'Kask ve ekipman teyidi yapıldı. A2 ehliyeti geçerli.',
  },
  {
    id: 'dapp-102',
    fullName: 'Murat Karadağ',
    phone: '0544 876 23 19',
    email: 'murat.k@outlook.com',
    city: 'İstanbul',
    district: 'Beşiktaş',
    vehicleType: 'motorcycle_250_plus',
    vehiclePlate: '34 MTR 441',
    vehicleModelYear: 2024,
    drivingLicenseClass: 'A',
    experienceYears: 7,
    hasSecondHelmet: true,
    hasDeliveryBox: false,
    servicePreference: 'passenger_and_courier',
    status: 'pending',
    submittedAt: '12.10.2026 16:30',
  },
  {
    id: 'dapp-103',
    fullName: 'Barış Dinçer',
    phone: '0555 312 45 67',
    email: 'baris.dincer@gmail.com',
    city: 'İstanbul',
    district: 'Şişli',
    vehicleType: 'scooter_125',
    vehiclePlate: '34 PCX 908',
    vehicleModelYear: 2022,
    drivingLicenseClass: 'A2',
    experienceYears: 3,
    hasSecondHelmet: false,
    hasDeliveryBox: true,
    servicePreference: 'courier_only',
    status: 'approved',
    submittedAt: '11.10.2026 11:20',
    notes: 'Yalnız paket kuryesi olarak onaylandı.',
  },
];

const INITIAL_MERCHANT_LEADS: MerchantLead[] = [
  {
    id: 'mlead-201',
    businessName: 'Moda Artisan Bakery',
    contactPerson: 'Selin Aksoy',
    phone: '0216 345 88 12',
    email: 'siparis@modabakery.com',
    district: 'Kadıköy',
    businessType: 'restaurant',
    dailyEstimatedDeliveries: 45,
    requestedService: 'express_courier',
    status: 'proposal_sent',
    submittedAt: '12.10.2026 10:45',
    notes: 'M0 %0 sipariş komisyonu + 2 hafta ücretsiz kurumsal kurye başlangıç kampanyası teklif edildi.',
  },
  {
    id: 'mlead-202',
    businessName: 'Nişantaşı Butik Eczane Deposu',
    contactPerson: 'Ecz. Kemal Yılmaz',
    phone: '0212 240 19 90',
    email: 'kemal@nisantasieczane.com',
    district: 'Şişli',
    businessType: 'pharmacy_cosmetics',
    dailyEstimatedDeliveries: 20,
    requestedService: 'scheduled_batch',
    status: 'new',
    submittedAt: '12.10.2026 15:10',
    notes: 'Reçeteli acil ilaç teslimatı için kurye talebi.',
  },
];

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);
PlatformContext.displayName = 'PlatformContext';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(`motopilot_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`LocalStorage read error for ${key}:`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`motopilot_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`LocalStorage write error for ${key}:`, e);
  }
}

export function sanitizeUserMessageText(raw: string): string {
  if (!raw) return '';
  if (
    raw.includes('providerInfo') ||
    raw.includes('authInfo') ||
    raw.includes('users_public/') ||
    raw.includes('users_private/') ||
    raw.includes('Missing or insufficient permissions') ||
    (raw.trim().startsWith('{') && raw.includes('"error"'))
  ) {
    return 'Bulut veritabanı erişim yetkisi kısıtlı veya çevrimdışı (Yerel çalışma modu aktif).';
  }
  return raw
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[gizli-eposta]')
    .replace(/\b(users_public|users_private|orders|batch_routes|wire_notices)\/[A-Za-z0-9_-]+/g, '[korunan-yol]');
}

export function verifyTripPinGuard(
  ride: RideOrder | null,
  enteredPin: string,
  actingCourierId?: string
): { allowed: boolean; code?: string; message?: string } {
  if (!ride) {
    return { allowed: false, code: 'NO_ACTIVE_TRIP', message: 'Aktif sefer kaydı bulunamadı.' };
  }
  if (ride.status !== 'arrived') {
    return {
      allowed: false,
      code: 'INVALID_STATE_FOR_PIN',
      message: `PIN doğrulaması yalnızca alış noktasında ('arrived') yapılabilir. Mevcut durum: ${ride.status}.`,
    };
  }
  if (actingCourierId && ride.courierId && ride.courierId !== actingCourierId) {
    return {
      allowed: false,
      code: 'COURIER_MISMATCH',
      message: 'Bu sefer başka bir kuryeye atanmıştır. Yetkisiz işlem engellendi.',
    };
  }
  if (ride.verificationStatus === 'verified' || ride.pinUsed) {
    return {
      allowed: false,
      code: 'PIN_ALREADY_USED',
      message: 'Bu biniş/teslimat PIN kodu daha önce kullanılmıştır.',
    };
  }
  if (ride.pinExpiresAt && new Date(ride.pinExpiresAt).getTime() < Date.now()) {
    return {
      allowed: false,
      code: 'PIN_EXPIRED',
      message: 'Biniş PIN kodunun geçerlilik süresi dolmuştur.',
    };
  }
  const cleanPin = (enteredPin || '').trim();
  const expectedPin = (ride.boardingCode || '').trim();

  if (ride.serviceType !== 'motosiklet' && cleanPin === 'PICKUP_CONFIRMED') {
    return { allowed: true };
  }

  if (!cleanPin || cleanPin.length < 4) {
    return {
      allowed: false,
      code: 'PIN_EMPTY_OR_SHORT',
      message: 'Lütfen 4 haneli güvenlik PIN kodunu eksiksiz giriniz.',
    };
  }
  if (!expectedPin || cleanPin !== expectedPin) {
    return {
      allowed: false,
      code: 'PIN_MISMATCH',
      message: 'Girilen güvenlik PIN kodu hatalı. Sefer başlatılamadı ve tahsilat üretilmedi.',
    };
  }
  return { allowed: true };
}

export function verifyDailyClosingGuard(params: {
  hasOpenService: boolean;
  hasUnapprovedTransfer: boolean;
  uncollectedCashAmount: number;
  overrideNote?: string;
}): { allowed: boolean; issues: string[] } {
  const issues: string[] = [];
  if (params.hasOpenService) issues.push('Açık servis iş emirleri mevcut');
  if (params.hasUnapprovedTransfer) issues.push('Onay bekleyen kasa transferi var');
  if (params.uncollectedCashAmount > 0) {
    issues.push(`${params.uncollectedCashAmount} ₺ tahsil edilmemiş nakit açıkta`);
  }
  if (issues.length > 0 && !(params.overrideNote && params.overrideNote.trim().length > 0)) {
    return { allowed: false, issues };
  }
  return { allowed: true, issues };
}

export function verifyTripCompletionGuard(
  ride: RideOrder | null,
  actingCourierId?: string,
  existingReconciliations: TransactionReconciliationRecord[] = []
): { allowed: boolean; code?: string; message?: string } {
  if (!ride) {
    return { allowed: false, code: 'NO_ACTIVE_TRIP', message: 'Tamamlanacak aktif sefer bulunamadı.' };
  }
  const idempotencyKey = `idem_${ride.id}_settlement`;
  const alreadySettled =
    Boolean(ride.isSettled) ||
    Boolean(ride.financialPostingId) ||
    existingReconciliations.some((r) => r.idempotencyKey === idempotencyKey || r.rideId === ride.id);
  if (alreadySettled || ride.status === 'completed' || ride.status === 'partially_completed') {
    return {
      allowed: false,
      code: 'DUPLICATE_SETTLEMENT_BLOCKED',
      message: `Bu sefer (${ride.id}) için tahsilat ve mutabakat daha önce yapılmıştır.`,
    };
  }
  if (ride.status !== 'in_progress') {
    return {
      allowed: false,
      code: 'NOT_IN_PROGRESS',
      message: `Sefer yalnızca 'in_progress' (Sürüş/Dağıtım) aşamasındayken tamamlanabilir. Mevcut durum: ${ride.status}.`,
    };
  }
  if (actingCourierId && ride.courierId && ride.courierId !== actingCourierId) {
    return {
      allowed: false,
      code: 'COURIER_MISMATCH',
      message: 'Atanmamış kurye seferi tamamlayamaz.',
    };
  }
  if (ride.serviceType === 'motosiklet') {
    if (ride.verificationStatus !== 'verified' || !ride.verifiedAt || !ride.pinUsed) {
      return {
        allowed: false,
        code: 'PIN_NOT_VERIFIED',
        message: 'PIN doğrulaması tamamlanmadan yolculuk bitirilemez ve hakediş/tahsilat oluşturulamaz!',
      };
    }
  }
  return { allowed: true };
}

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // B11: URL hash deep linking sync
  const getInitialView = (): PlatformView => {
    const validViews: PlatformView[] = ['split', 'customer', 'business', 'courier', 'admin', 'website'];
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashView = window.location.hash.replace('#', '') as PlatformView;
      if (validViews.includes(hashView)) return hashView;
    }
    const storedView = loadFromStorage<string>('activeView', 'website') as PlatformView;
    if (validViews.includes(storedView)) return storedView;
    saveToStorage('activeView', 'website');
    return 'website';
  };

  const [activeView, setActiveViewState] = useState<PlatformView>(getInitialView);

  const setActiveView = useCallback((view: PlatformView) => {
    setActiveViewState(view);
    saveToStorage('activeView', view);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
  }, []);

  // Sync hash changes from back/forward buttons
  useEffect(() => {
    const validViews: PlatformView[] = ['split', 'customer', 'business', 'courier', 'admin', 'website'];
    if (!validViews.includes(activeView)) {
      setActiveView('website');
    }
    const handleHashChange = () => {
      const hashView = window.location.hash.replace('#', '') as PlatformView;
      if (validViews.includes(hashView) && hashView !== activeView) {
        setActiveViewState(hashView);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeView, setActiveView]);

  // B4: Loading & Error State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const clearError = useCallback(() => setError(null), []);

  // B20: Idempotency Key Set
  const idempotencyKeysRef = useRef<Set<string>>(new Set());
  const completedTripLocksRef = useRef<Set<string>>(new Set());

  // B1: Persistent States with useLocalStorageState & BroadcastChannel multi-tab sync
  const [customerProfileMode, setCustomerProfileMode] = useState<UserProfileMode>('individual');
  const [tariffs, setTariffs] = useLocalStorageState<TariffSettings>('tariffs', INITIAL_TARIFFS);
  const [couriers, setCouriers] = useLocalStorageState<Courier[]>('couriers', INITIAL_COURIERS);
  const [activeCourierId, setActiveCourierId] = useState<string>('kurye-1');
  const [allRides, setAllRides] = useLocalStorageState<RideOrder[]>('allRides', INITIAL_PAST_RIDES);
  const [currentRide, setCurrentRide] = useLocalStorageState<RideOrder | null>('currentRide', null);
  const [complaints, setComplaints] = useLocalStorageState<ComplaintTicket[]>('complaints', INITIAL_COMPLAINTS);

  // M0 Sıfır Komisyon Kuralı Senkronizasyonu: LocalStorage'da eski komisyonlu kayıt kalmışsa %0 komisyona normalize et
  useEffect(() => {
    if (tariffs.platformCommissionRate !== 0) {
      setTariffs((prev) => ({ ...prev, platformCommissionRate: 0 }));
    }
    if (allRides.some((r) => r.platformCommission !== 0)) {
      setAllRides((prev) =>
        prev.map((r) => ({
          ...r,
          platformCommission: 0,
          courierEarnings: r.totalFare,
          serviceFeePercent: 0,
          serviceFeeFixed: 0,
        }))
      );
    }
  }, [tariffs.platformCommissionRate, allRides, setTariffs, setAllRides]);

  // Ödeme Tercihi (Nakit / Sanal POS Kredi Kartı / Cüzdan)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');

  // Finansal Uzlaşma ve Mutabakat Kayıtları
  const [reconciliationRecords, setReconciliationRecords] = useLocalStorageState<TransactionReconciliationRecord[]>(
    'reconciliationRecords',
    INITIAL_RECONCILIATION_RECORDS
  );

  // Onay Bekleyen Finansal Politika Önerileri (Yürürlükte Olmayan Taslaklar)
  const [pendingPolicyProposals, setPendingPolicyProposals] = useLocalStorageState<PolicyProposal[]>(
    'pendingPolicyProposals',
    INITIAL_POLICY_PROPOSALS
  );

  // Apple Typography & Accessibility Dynamic Type State
  const [dynamicTypeScale, setDynamicTypeScaleState] = useState<number>(1.0);
  const [dynamicTypePreset, setDynamicTypePreset] = useState<'small' | 'standard' | 'large' | 'accessibility1' | 'accessibility2'>('standard');
  const [themeMode, setThemeModeState] = useLocalStorageState<'dark' | 'light'>('themeMode', 'dark');

  useEffect(() => {
    if (themeMode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('theme-light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('theme-light');
    }
  }, [themeMode]);

  const setDynamicTypeScale = (scale: number) => {
    setDynamicTypeScaleState(scale);
    document.documentElement.style.setProperty('--dynamic-type-scale', String(scale));
  };

  const handleSetPreset = (preset: 'small' | 'standard' | 'large' | 'accessibility1' | 'accessibility2') => {
    setDynamicTypePreset(preset);
    let scale = 1.0;
    if (preset === 'small') scale = 0.85;
    else if (preset === 'standard') scale = 1.0;
    else if (preset === 'large') scale = 1.15;
    else if (preset === 'accessibility1') scale = 1.30;
    else if (preset === 'accessibility2') scale = 1.50;
    setDynamicTypeScale(scale);
  };

  const setThemeMode = (mode: 'dark' | 'light') => {
    setThemeModeState(mode);
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  // [B2 & C1-C10] Bellek Sızıntısı Korumalı Bildirim Kuyruğu (Max 5 Kuyruk Sınırı & Hover Duraklatma)
  const MAX_NOTIFICATION_QUEUE = 5;
  const [notificationQueue, setNotificationQueue] = useState<AccessibleNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<AccessibleNotification | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<AccessibleNotification[]>([]);
  const [isNotificationHovered, setIsNotificationHovered] = useState<boolean>(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<{ message: string; type: 'polite' | 'assertive' } | null>(null);

  // Rate limiting ref & timer ref
  const notifTimestampsRef = useRef<number[]>([]);
  const notifTimerRef = useRef<any>(null);

  const triggerHapticAndAudio = (isCrit: boolean) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(isCrit ? [80, 40, 80] : [40]);
      }
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = isCrit ? 'square' : 'sine';
          osc.frequency.setValueAtTime(isCrit ? 880 : 580, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      }
    } catch {}
  };

  /**
   * [B2] Bildirim Gönderici (Rate-Limited & Max 5 FIFO Kuyruk Korumalı)
   * Aynı anda kuyrukta MAX 5 bildirimden fazlası birikemez; 5'i aşan en eski bildirim otomatik silinir.
   */
  const showNotification = ({
    title,
    message,
    type = 'info',
    durationMs,
    isCritical = false,
  }: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    durationMs?: number;
    isCritical?: boolean;
  }) => {
    const now = Date.now();
    notifTimestampsRef.current = notifTimestampsRef.current.filter((t) => now - t < 3000);
    if (notifTimestampsRef.current.length >= 6 && !isCritical) {
      return;
    }
    notifTimestampsRef.current.push(now);

    triggerHapticAndAudio(isCritical || type === 'error');

    const safeTitle = sanitizeUserMessageText(title);
    const safeMessage = sanitizeUserMessageText(message);
    const calculatedDuration = durationMs || (isCritical ? 10000 : Math.max(5000, (safeTitle.length + safeMessage.length) * 65));
    const notif: AccessibleNotification = {
      id: generateSecureUUID('notif'),
      title: safeTitle,
      message: safeMessage,
      type,
      timestamp: now,
      durationMs: calculatedDuration,
      isCritical,
    };

    // Geçmişte de en fazla 25 kayıt tut, kapatılanlar filter() ile temizlenir
    setNotificationHistory((prev) => [notif, ...prev.filter((item) => item.id !== notif.id).slice(0, 24)]);
    setScreenReaderAnnouncement({
      message: `${type === 'error' ? 'Kritik Hata' : type === 'warning' ? 'Uyarı' : 'Bilgi'}: ${safeTitle}. ${safeMessage}`,
      type: type === 'error' || isCritical ? 'assertive' : 'polite',
    });

    setActiveNotification((current) => {
      if (!current) {
        return notif;
      } else {
        // Kuyrukta MAX 5 bildirim: 5'i aşan en eski bildirim (FIFO) otomatik çıkarılır
        setNotificationQueue((q) => {
          const updated = [...q, notif];
          return updated.length > MAX_NOTIFICATION_QUEUE
            ? updated.slice(updated.length - MAX_NOTIFICATION_QUEUE)
            : updated;
        });
        return current;
      }
    });
  };

  /**
   * [B2] Bildirimi diziden tamamen `filter()` ile çıkarır (Bellek sızıntısını önler).
   */
  const dismissNotification = useCallback((id?: string) => {
    if (notifTimerRef.current) {
      clearTimeout(notifTimerRef.current);
      notifTimerRef.current = null;
    }
    if (id) {
      setNotificationQueue((prev) => prev.filter((n) => n.id !== id));
      setNotificationHistory((prev) => prev.filter((n) => n.id !== id));
    }
    setActiveNotification((curr) => (!id || curr?.id === id ? null : curr));
  }, []);

  const clearNotificationHistory = () => {
    setNotificationHistory([]);
    setNotificationQueue([]);
  };

  // Kuyruktaki bir sonraki bildirimi işleme
  useEffect(() => {
    if (!activeNotification && notificationQueue.length > 0) {
      const [nextNotif, ...remaining] = notificationQueue;
      setActiveNotification(nextNotif);
      setNotificationQueue(remaining);
    }
  }, [activeNotification, notificationQueue]);

  // Aktif bildirim için zamanlayıcı (Fare üzerindeyken - onMouseEnter - sayaç duraklar!)
  useEffect(() => {
    if (!activeNotification) return;
    if (activeNotification.isCritical) return;
    if (isNotificationHovered) {
      if (notifTimerRef.current) {
        clearTimeout(notifTimerRef.current);
        notifTimerRef.current = null;
      }
      return;
    }

    if (notifTimerRef.current) {
      clearTimeout(notifTimerRef.current);
    }

    notifTimerRef.current = setTimeout(() => {
      dismissNotification(activeNotification.id);
    }, activeNotification.durationMs);

    return () => {
      if (notifTimerRef.current) {
        clearTimeout(notifTimerRef.current);
        notifTimerRef.current = null;
      }
    };
  }, [activeNotification, isNotificationHovered, dismissNotification]);

  // Customer Wallet & Cards State (Persisted)
  const [customerWalletBalance, setCustomerWalletBalance] = useLocalStorageState<number>('customerWalletBalance', 350);
  const [customerCards, setCustomerCards] = useLocalStorageState<SavedCard[]>('customerCards', INITIAL_SAVED_CARDS);
  const [customerTransactions, setCustomerTransactions] = useLocalStorageState<WalletTransaction[]>(
    'customerTransactions',
    INITIAL_TRANSACTIONS
  );

  // 1. Kural Denetimi: Onaysız iptal bedeli kuralıyla üretilmiş geçmiş kayıtları tespit et ve bildir (Silinmez!)
  const detectedUnapprovedRecords: DetectedUnapprovedRecord[] = customerTransactions
    .filter(
      (tx) =>
        tx.id.startsWith('tx-cancel') ||
        tx.description.toLowerCase().includes('geç iptal') ||
        (tx.amount === 25 && tx.type === 'ride_payment')
    )
    .map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      date: tx.date,
      detectedAt: '08.10.2026 20:00 (Otomatik Denetim Taraması)',
      reason: 'Onaysız 25 ₺ geç iptal cezası kuralı ile oluşturulmuş geçmiş işlem kaydı. (Silinmedi, denetim için listelendi)',
      isDeleted: false,
    }));

  // Courier TFKS Shift, Cash-in-Hand & Penalties State
  const [courierShift, setCourierShift] = useLocalStorageState<CourierShift>('courierShift', {
    isShiftActive: true,
    bikePlate: '34 BLY 717',
    startKm: 24890,
    photosApproved: true,
    startedAt: '03.10.2026 08:30',
  });
  const [courierCashInHand, setCourierCashInHand] = useLocalStorageState<number>('courierCashInHand', 480);
  const [courierPenalties, setCourierPenalties] = useLocalStorageState<TrafficPenalty[]>(
    'courierPenalties',
    INITIAL_COURIER_PENALTIES
  );

  // Admin EOD Closing State
  const [dailyClosingStatus, setDailyClosingStatus] = useLocalStorageState<{
    isClosed: boolean;
    closedAt?: string;
    totalSettled: number;
    totalCashCollected: number;
    auditHash?: string;
  }>('dailyClosingStatus', {
    isClosed: false,
    totalSettled: 4890,
    totalCashCollected: 1240,
  });

  // TFKS State Declarations (Persisted via useLocalStorageState)
  const [vehicleAssignments, setVehicleAssignments] = useLocalStorageState<VehicleAssignment[]>(
    'assignments',
    INITIAL_VEHICLE_ASSIGNMENTS
  );
  const [cashVaults, setCashVaults] = useLocalStorageState<CashVault[]>('vaults', INITIAL_CASH_VAULTS);
  const [cashTransfers, setCashTransfers] = useLocalStorageState<CashTransferRecord[]>(
    'cashTransfers',
    INITIAL_CASH_TRANSFERS
  );
  const [damageReports, setDamageReports] = useLocalStorageState<DamageReport[]>(
    'damageReports',
    INITIAL_DAMAGE_REPORTS
  );
  const [warehouseParts, setWarehouseParts] = useLocalStorageState<WarehousePart[]>(
    'warehouseParts',
    INITIAL_WAREHOUSE_PARTS
  );
  const [serviceWorkOrders, setServiceWorkOrders] = useLocalStorageState<ServiceWorkOrder[]>(
    'serviceWorkOrders',
    INITIAL_SERVICE_WORK_ORDERS
  );
  const [systemBlockages, setSystemBlockages] = useLocalStorageState<SystemBlockage[]>(
    'systemBlockages',
    INITIAL_SYSTEM_BLOCKAGES
  );
  const [auditLogs, setAuditLogs] = useLocalStorageState<AuditLogEntry[]>('auditLogs', INITIAL_AUDIT_LOG_ENTRIES);
  const [dailyClosingAudit, setDailyClosingAudit] = useLocalStorageState<DailyClosingAudit>('dailyClosing', {
    closingDate: '03.10.2026',
    status: 'open',
    openZimmetCount: 2,
    uncollectedCashAmount: 1480,
    vaultDiscrepancy: 0,
    openWorkOrdersCount: 1,
    unservedPenaltiesCount: 0,
    auditChecklist: INITIAL_DAILY_CLOSING_CHECKLIST,
  });

  // [A20 & B5] Kanonik Çift Taraflı Muhasebe Defteri (Single Source of Truth General Ledger)
  const [ledgerEntries, setLedgerEntries] = useLocalStorageState<LedgerEntry[]>('ledgerEntries', INITIAL_LEDGER_ENTRIES);

  // Time-Travel Snapshots & Server Sync State
  const [snapshots, setSnapshots] = useLocalStorageState<SystemSnapshot[]>('snapshots', []);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => new Date().toLocaleTimeString('tr-TR'));

  // =========================================================================
  // SADAKAT, REFERANS, KAMPANYA & ÖDÜL SİSTEMLERİ STATELERİ (Production Altyapı)
  // =========================================================================
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount>(INITIAL_CUSTOMER_LOYALTY_ACCOUNT);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTierConfig[]>(INITIAL_LOYALTY_TIER_CONFIGS);
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>(INITIAL_LOYALTY_SETTINGS);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(INITIAL_LOYALTY_TRANSACTIONS);
  const [appliedPointsDiscount, setAppliedPointsDiscount] = useState<number>(0);
  const [appliedPointsCount, setAppliedPointsCount] = useState<number>(0);

  const [referralPrograms, setReferralPrograms] = useState<ReferralProgramConfig[]>(INITIAL_REFERRAL_PROGRAMS);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>(INITIAL_REFERRAL_CODES);
  const [referralRecords, setReferralRecords] = useState<ReferralRecord[]>(INITIAL_REFERRAL_RECORDS);

  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeCoupon, setActiveCoupon] = useState<Campaign | null>(null);
  const [couponRedemptions, setCouponRedemptions] = useState<CouponRedemptionRecord[]>(INITIAL_COUPON_REDEMPTIONS);

  const [driverQuests, setDriverQuests] = useState<DriverQuest[]>(INITIAL_DRIVER_QUESTS);
  const [merchantProfiles, setMerchantProfiles] = useState<MerchantLoyaltyProfile[]>(INITIAL_MERCHANT_PROFILES);
  const [winBackOffers, setWinBackOffers] = useState<WinBackOffer[]>(INITIAL_WIN_BACK_OFFERS);
  const [giftCredits, setGiftCredits] = useState<GiftCredit[]>(INITIAL_GIFT_CREDITS);
  const [fraudAuditRecords, setFraudAuditRecords] = useState<FraudAuditRecord[]>(INITIAL_FRAUD_RECORDS);

  // 8. Kurumsal Web Sitesi & Başvuru Funnel Masası
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>(INITIAL_DRIVER_APPLICATIONS);
  const [merchantLeads, setMerchantLeads] = useState<MerchantLead[]>(INITIAL_MERCHANT_LEADS);

  const submitDriverApplication = (appData: Omit<DriverApplication, 'id' | 'status' | 'submittedAt'>): DriverApplication => {
    const newApp: DriverApplication = {
      ...appData,
      id: `dapp-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setDriverApplications((prev) => [newApp, ...prev]);
    showNotification({
      title: 'Başvurunuz Alındı',
      message: `${newApp.fullName}, sürücü başvurunuz operasyon merkezimize başarıyla iletildi.`,
      type: 'success',
    });
    return newApp;
  };

  const submitMerchantLead = (leadData: Omit<MerchantLead, 'id' | 'status' | 'submittedAt'>): MerchantLead => {
    const newLead: MerchantLead = {
      ...leadData,
      id: `mlead-${Date.now().toString().slice(-4)}`,
      status: 'new',
      submittedAt: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setMerchantLeads((prev) => [newLead, ...prev]);
    showNotification({
      title: 'İşletme Talebi Alındı',
      message: `${newLead.businessName} için kurumsal teslimat teklif talebiniz başarıyla kaydedildi.`,
      type: 'success',
    });
    return newLead;
  };

  const updateDriverApplicationStatus = (id: string, status: DriverApplication['status'], notes?: string) => {
    setDriverApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, notes: notes !== undefined ? notes : app.notes } : app))
    );
    showNotification({
      title: 'Başvuru Durumu Güncellendi',
      message: `Sürücü başvuru durumu '${status}' olarak güncellendi.`,
      type: 'info',
    });
  };

  const updateMerchantLeadStatus = (id: string, status: MerchantLead['status'], notes?: string) => {
    setMerchantLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status, notes: notes !== undefined ? notes : lead.notes } : lead))
    );
    showNotification({
      title: 'İşletme Talebi Güncellendi',
      message: `İşletme talep durumu '${status}' olarak güncellendi.`,
      type: 'info',
    });
  };

  // Sadakat Ayarlarını Güncelle (Merkezi Yönetim Masası)
  const updateLoyaltySettings = (newSettings: Partial<LoyaltySettings>) => {
    setLoyaltySettings((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Sadakat & Puan Masası',
      recordId: 'loyalty-settings-global',
      previousValue: JSON.stringify(loyaltySettings),
      newValue: JSON.stringify(newSettings),
      justification: 'Sadakat katsayıları ve kullanım limitleri yetkili yönetici tarafından güncellendi.',
    });
    showNotification({
      title: 'Sadakat Ayarları Güncellendi',
      message: 'Puan kazanım oranları ve seviye eşikleri başarıyla yürürlüğe girdi.',
      type: 'success',
    });
  };

  // Sadakat Puanı Harcama (Redeem)
  const redeemLoyaltyPoints = (
    pointsToRedeem: number,
    currentTotalFare: number
  ): { success: boolean; message: string; discountLira: number } => {
    if (!loyaltySettings.isProgramActive) {
      return { success: false, message: 'Sadakat programı şu anda aktif değildir.', discountLira: 0 };
    }
    if (pointsToRedeem < loyaltySettings.minRedeemPoints) {
      return {
        success: false,
        message: `Minimum harcama limiti ${loyaltySettings.minRedeemPoints} puandır.`,
        discountLira: 0,
      };
    }
    if (pointsToRedeem > loyaltyAccount.availablePoints) {
      return {
        success: false,
        message: `Yetersiz puan bakiyesi. Mevcut puanınız: ${loyaltyAccount.availablePoints}`,
        discountLira: 0,
      };
    }

    const rawDiscount = Math.round(pointsToRedeem * loyaltySettings.pointRedeemRateLira * 10) / 10;
    const maxDiscountAllowed = Math.round((currentTotalFare * loyaltySettings.maxRedeemPercentPerRide) / 100);
    const finalDiscount = Math.min(rawDiscount, maxDiscountAllowed);

    if (finalDiscount <= 0) {
      return { success: false, message: 'Bu işlem için puan indirimi uygulanamadı.', discountLira: 0 };
    }

    setAppliedPointsDiscount(finalDiscount);
    setAppliedPointsCount(pointsToRedeem);

    return {
      success: true,
      message: `${pointsToRedeem} Sadakat Puanı karşılığı ${finalDiscount} ₺ indirim sepetinize uygulandı.`,
      discountLira: finalDiscount,
    };
  };

  const clearPointsDiscount = () => {
    setAppliedPointsDiscount(0);
    setAppliedPointsCount(0);
  };

  // Davet Programı Konfigürasyonu Güncelleme
  const updateReferralProgramConfig = (id: string, partial: Partial<ReferralProgramConfig>) => {
    setReferralPrograms((prev) =>
      prev.map((prog) => (prog.id === id ? { ...prog, ...partial } : prog))
    );
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Davet & Referans Masası',
      recordId: id,
      previousValue: 'Mevcut Davet Kuralları',
      newValue: JSON.stringify(partial),
      justification: 'Davet programı bütçe ve ödül parametreleri güncellendi.',
    });
    showNotification({
      title: 'Davet Programı Güncellendi',
      message: 'Referans ödülleri ve katılım koşulları güncellendi.',
      type: 'success',
    });
  };

  // Kullanıcıya Özel Davet Kodu Üretme
  const generateReferralCode = (programType: ReferralProgramType): string => {
    const existing = referralCodes.find(
      (c) => c.ownerId === loyaltyAccount.userId && c.programType === programType
    );
    if (existing) return existing.code;

    const prefix = programType === 'driver_to_driver' ? 'SRV' : programType === 'merchant_to_merchant' ? 'ISL' : 'MP';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newCode = `${prefix}-${loyaltyAccount.userName.split(' ')[0].toUpperCase()}${rand}`;

    const newRefCode: ReferralCode = {
      id: `code-${Date.now()}`,
      code: newCode,
      ownerId: loyaltyAccount.userId,
      ownerType: 'customer',
      ownerName: loyaltyAccount.userName,
      programType,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      totalReferrals: 0,
      successfulReferrals: 0,
      totalRewardEarnedLira: 0,
    };
    setReferralCodes((prev) => [newRefCode, ...prev]);
    return newCode;
  };

  // Davet Kodu ile Kayıt / Kullanım
  const registerReferralUsage = (
    code: string,
    referredContact: string,
    referredName: string
  ): { success: boolean; message: string } => {
    const normalizedCode = code.trim().toUpperCase();
    const foundCode = referralCodes.find((c) => c.code === normalizedCode);

    if (!foundCode) {
      return { success: false, message: 'Geçersiz veya bulunamayan davet kodu.' };
    }

    const program = referralPrograms.find((p) => p.programType === foundCode.programType);
    if (!program || !program.isActive) {
      return { success: false, message: 'Bu davet programı şu anda aktif değildir.' };
    }

    // Suistimal Kontrolü 1: Kendi kendini davet etme (Self-Referral Guard)
    const cleanReferredPhone = referredContact.replace(/\D/g, '');
    const cleanOwnerPhone = '5056779379'; // Aktif kullanıcı telefon kökü
    if (foundCode.ownerId === loyaltyAccount.userId || cleanReferredPhone.includes(cleanOwnerPhone)) {
      const fraudRecord: FraudAuditRecord = {
        id: `fraud-${Date.now()}`,
        timestamp: new Date().toLocaleString('tr-TR'),
        actorId: loyaltyAccount.userId,
        actorName: loyaltyAccount.userName,
        actionType: 'SELF_REFERRAL_BLOCKED',
        details: `Kullanıcı kendi ürettiği '${normalizedCode}' davet kodunu kendi numarası (${referredContact}) ile kullanmaya çalıştı.`,
        severity: 'high',
        resolved: false,
      };
      setFraudAuditRecords((prev) => [fraudRecord, ...prev]);
      return {
        success: false,
        message: 'Güvenlik Kuralı: Kendi hesabınızı veya aynı cihaza bağlı numaranızı davet edemezsiniz.',
      };
    }

    // Suistimal Kontrolü 2: Aynı numara için mükerrer davet
    const duplicate = referralRecords.some(
      (r) =>
        r.referredContact.replace(/\D/g, '') === cleanReferredPhone &&
        r.programType === foundCode.programType
    );
    if (duplicate) {
      return {
        success: false,
        message: 'Bu telefon numarası ile daha önce bu programda davet kaydı oluşturulmuştur.',
      };
    }

    const newRecord: ReferralRecord = {
      id: `ref-rec-${Date.now()}`,
      programType: foundCode.programType,
      referrerId: foundCode.ownerId,
      referrerName: foundCode.ownerName,
      referredId: `cust-ref-${Date.now().toString(36)}`,
      referredName: referredName || 'Yeni Davetli Kullanıcı',
      referredContact,
      codeUsed: normalizedCode,
      status: 'verified',
      rewardAmountReferrer: program.referrerRewardAmount,
      rewardAmountReferred: program.referredRewardAmount,
      rewardType: 'wallet_credit',
      qualifyingActionDescription: `Kayıt doğrulandı. ${program.minQualifyingTrips} adet uygun sefer sonrası ödül aktarılacaktır.`,
      createdAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      isFlaggedSuspicious: false,
    };

    setReferralRecords((prev) => [newRecord, ...prev]);
    setReferralCodes((prev) =>
      prev.map((c) => (c.code === normalizedCode ? { ...c, totalReferrals: c.totalReferrals + 1 } : c))
    );

    showNotification({
      title: 'Davet Kodu Eşleştirildi',
      message: `${foundCode.ownerName} tarafından paylaşılan davet kodu uygulandı! İlk seferinizde ödülünüz hazır.`,
      type: 'success',
    });

    return { success: true, message: 'Davet kodu başarıyla doğrulandı ve profilinize tanımlandı.' };
  };

  // İncelemedeki Şüpheli Daveti Onayla / Reddet (Komuta Merkezi)
  const reviewFlaggedReferral = (
    referralId: string,
    decision: 'approve' | 'reject',
    justification: string
  ) => {
    setReferralRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === referralId) {
          const newStatus = decision === 'approve' ? 'rewarded' : 'cancelled';
          if (decision === 'approve') {
            setCustomerWalletBalance((curr) => curr + rec.rewardAmountReferrer);
          }
          return {
            ...rec,
            status: newStatus,
            reviewReason: justification,
            isFlaggedSuspicious: false,
            rewardedAt: decision === 'approve' ? new Date().toLocaleString('tr-TR') : undefined,
          };
        }
        return rec;
      })
    );

    recordAuditLog({
      actionType: decision === 'approve' ? 'APPROVE' : 'REJECT',
      screenName: 'Suistimal & Davet İnceleme',
      recordId: referralId,
      previousValue: 'under_review',
      newValue: decision === 'approve' ? 'rewarded (Onaylandı)' : 'cancelled (Reddedildi)',
      justification,
    });

    showNotification({
      title: `Davet İncelemesi: ${decision === 'approve' ? 'Onaylandı' : 'Reddedildi'}`,
      message: justification,
      type: decision === 'approve' ? 'success' : 'warning',
    });
  };

  // Kupon Kodu Uygulama (Müşteri & Sepet Motoru)
  const applyCouponCode = (
    code: string,
    orderTotalFare: number,
    service: ServiceType
  ): { success: boolean; message: string; discountLira: number } => {
    const cleanCode = code.trim().toUpperCase();
    const campaign = campaigns.find((c) => c.code === cleanCode);

    if (!campaign) {
      return { success: false, message: 'Geçersiz kupon kodu. Lütfen kontrol ediniz.', discountLira: 0 };
    }

    if (campaign.status !== 'active') {
      return { success: false, message: 'Bu kampanya şu anda aktif değildir.', discountLira: 0 };
    }

    if (new Date(campaign.endDate) < new Date()) {
      return { success: false, message: 'Bu kuponun kullanım süresi sona ermiştir.', discountLira: 0 };
    }

    if (campaign.usedBudgetLira >= campaign.totalBudgetLira) {
      return { success: false, message: 'Bu kampanyanın toplam bütçe kotası dolmuştur.', discountLira: 0 };
    }

    if (campaign.currentUsageCount >= campaign.totalUsageLimit) {
      return { success: false, message: 'Bu kuponun toplam kullanım sayısı tükenmiştir.', discountLira: 0 };
    }

    if (orderTotalFare < campaign.minOrderAmount) {
      return {
        success: false,
        message: `Bu kupon minimum ${campaign.minOrderAmount} ₺ tutarındaki siparişlerde geçerlidir.`,
        discountLira: 0,
      };
    }

    if (campaign.applicableServices.length > 0 && !campaign.applicableServices.includes(service)) {
      return {
        success: false,
        message: 'Bu kupon seçili hizmet türünde (araç/kurye tipinde) geçerli değildir.',
        discountLira: 0,
      };
    }

    let calculatedDiscount = 0;
    if (campaign.discountType === 'percentage') {
      const pctAmount = Math.round((orderTotalFare * campaign.discountValue) / 100);
      calculatedDiscount = Math.min(campaign.maxDiscountAmount, pctAmount);
    } else if (campaign.discountType === 'fixed_amount') {
      calculatedDiscount = Math.min(campaign.maxDiscountAmount, campaign.discountValue);
    } else if (campaign.discountType === 'free_service_fee') {
      calculatedDiscount = 20; // 20 TL sabit hizmet bedeli indirimi
    }

    setActiveCoupon(campaign);

    showNotification({
      title: 'Kupon Uygulandı',
      message: `${campaign.title} ile ${calculatedDiscount} ₺ indirim sepetinize yansıtıldı!`,
      type: 'success',
    });

    return {
      success: true,
      message: `${campaign.title} uygulandı! (-${calculatedDiscount} ₺)`,
      discountLira: calculatedDiscount,
    };
  };

  const removeCouponCode = () => {
    setActiveCoupon(null);
    showNotification({
      title: 'Kupon Kaldırıldı',
      message: 'Uygulanan kupon kodu siparişten çıkarıldı.',
      type: 'info',
    });
  };

  const createCampaign = (
    newCamp: Omit<Campaign, 'id' | 'createdAt' | 'usedBudgetLira' | 'currentUsageCount'>
  ) => {
    const created: Campaign = {
      ...newCamp,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      usedBudgetLira: 0,
      currentUsageCount: 0,
    };
    setCampaigns((prev) => [created, ...prev]);
    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'Kampanya Yönetimi Masası',
      recordId: created.id,
      previousValue: '',
      newValue: JSON.stringify(created),
      justification: `Yeni kampanya tanımlandı: ${created.title} (${created.code})`,
    });
    showNotification({
      title: 'Kampanya Oluşturuldu',
      message: `${created.code} kodlu kampanya başarıyla oluşturuldu ve sisteme eklendi.`,
      type: 'success',
    });
  };

  const updateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status } : c))
    );
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Kampanya Yönetimi Masası',
      recordId: campaignId,
      previousValue: 'Eski Kampanya Durumu',
      newValue: status,
      justification: `Kampanya statüsü '${status}' olarak güncellendi.`,
    });
    showNotification({
      title: 'Kampanya Durumu Güncellendi',
      message: `Kampanya statüsü '${status}' olarak değiştirildi.`,
      type: 'info',
    });
  };

  // Sürücü Görevi Bonusu Talep Etme
  const claimDriverQuestBonus = (questId: string) => {
    const quest = driverQuests.find((q) => q.id === questId);
    if (!quest) return;
    if ((quest.currentCompletedTrips || 0) < quest.targetTrips) {
      showNotification({
        title: 'Görev Henüz Tamamlanmadı',
        message: `Bu görevi tamamlamak için ${quest.targetTrips - (quest.currentCompletedTrips || 0)} sefer daha yapmanız gerekmektedir.`,
        type: 'warning',
      });
      return;
    }
    if (quest.isClaimed) {
      showNotification({
        title: 'Ödül Zaten Alındı',
        message: 'Bu görevin hak ediş primi daha önce hesabınıza aktarılmıştır.',
        type: 'info',
      });
      return;
    }

    setDriverQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    // Kurye cüzdanına ekle
    setCouriers((prev) =>
      prev.map((c) => {
        if (c.id === activeCourierId) {
          return {
            ...c,
            wallet: {
              ...c.wallet,
              dailyEarnings: c.wallet.dailyEarnings + quest.bonusAmountLira,
              pendingPayout: c.wallet.pendingPayout + quest.bonusAmountLira,
            },
          };
        }
        return c;
      })
    );

    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Sürücü Teşvik Masası',
      recordId: questId,
      previousValue: 'Tamamlandı (Bekliyor)',
      newValue: 'Ödendi & Cüzdana Aktarıldı',
      justification: `${activeCourier.name} sürücüsü ${quest.title} hedefini tamamlayıp ${quest.bonusAmountLira} ₺ bonusunu çekti.`,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#30D158', '#0071E3', '#FF9F0A'],
      });
    } catch {
      // ignore
    }

    showNotification({
      title: 'Tebrikler! Teşvik Bonusu Hesabınızda',
      message: `${quest.bonusAmountLira} ₺ ek görev primi sürücü bakiyenize başarıyla eklendi!`,
      type: 'success',
      durationMs: 6000,
    });
  };

  const createDriverQuest = (questData: Omit<DriverQuest, 'id'>) => {
    const created: DriverQuest = {
      ...questData,
      id: `quest-${Date.now()}`,
      currentCompletedTrips: 0,
      isClaimed: false,
    };
    setDriverQuests((prev) => [created, ...prev]);
    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'Sürücü Teşvik Masası',
      recordId: created.id,
      previousValue: '',
      newValue: JSON.stringify(created),
      justification: `Yeni sürücü hedefi yayınlandı: ${created.title}`,
    });
    showNotification({
      title: 'Sürücü Görevi Tanımlandı',
      message: `${created.title} hedefi kurye terminalinde yayına alındı.`,
      type: 'success',
    });
  };

  const updateMerchantTier = (merchantId: string, newTier: 'standard' | 'growth' | 'enterprise') => {
    setMerchantProfiles((prev) =>
      prev.map((m) => {
        if (m.merchantId === merchantId) {
          const discount = newTier === 'enterprise' ? 25 : newTier === 'growth' ? 15 : 0;
          return {
            ...m,
            currentTier: newTier,
            commissionDiscountPercent: discount,
            priorityDispatch: newTier !== 'standard',
            dedicatedCourierAssigned: newTier === 'enterprise',
          };
        }
        return m;
      })
    );
    showNotification({
      title: 'İşletme Sadakat Seviyesi Güncellendi',
      message: `İşletme seviyesi '${newTier}' olarak güncellendi.`,
      type: 'success',
    });
  };

  // Arkadaşına Yolculuk Kredisi Hediye Etme
  const sendGiftCredit = (
    recipientContact: string,
    recipientName: string,
    amount: number,
    message: string
  ): { success: boolean; message: string; code?: string } => {
    if (customerWalletBalance < amount) {
      return { success: false, message: 'Yetersiz cüzdan bakiyesi. Lütfen önce bakiye yükleyiniz.' };
    }

    setCustomerWalletBalance((prev) => prev - amount);
    const code = `HEDIYE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newGift: GiftCredit = {
      id: `gift-${Date.now()}`,
      senderId: loyaltyAccount.userId,
      senderName: loyaltyAccount.userName,
      recipientContact,
      recipientName,
      amountLira: amount,
      message,
      redemptionCode: code,
      status: 'sent',
      createdAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setGiftCredits((prev) => [newGift, ...prev]);

    const tx: WalletTransaction = {
      id: `tx-gift-${Date.now()}`,
      type: 'ride_payment',
      amount: -amount,
      description: `Hediye Yolculuk Kredisi Gönderimi (${recipientName} - Kod: ${code})`,
      date: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setCustomerTransactions((prev) => [tx, ...prev]);

    showNotification({
      title: 'Hediye Kartı Hazırlandı',
      message: `${recipientName} adına ${amount} ₺ hediye kredisi oluşturuldu. Kod: ${code}`,
      type: 'success',
    });

    return {
      success: true,
      message: `Hediye kartı oluşturuldu. Paylaşım Kodu: ${code}`,
      code,
    };
  };

  // Hediye Kredisini Cüzdana Yükleme
  const redeemGiftCredit = (
    redemptionCode: string
  ): { success: boolean; message: string; amount?: number } => {
    const clean = redemptionCode.trim().toUpperCase();
    const gift = giftCredits.find((g) => g.redemptionCode === clean);

    if (!gift || gift.status !== 'sent') {
      return { success: false, message: 'Geçersiz veya daha önce kullanılmış hediye kodu.' };
    }

    setGiftCredits((prev) =>
      prev.map((g) =>
        g.redemptionCode === clean
          ? {
              ...g,
              status: 'redeemed',
              redeemedAt: new Date().toLocaleString('tr-TR'),
              redeemedByUserId: loyaltyAccount.userId,
            }
          : g
      )
    );

    setCustomerWalletBalance((prev) => prev + gift.amountLira);

    const tx: WalletTransaction = {
      id: `tx-gift-in-${Date.now()}`,
      type: 'topup',
      amount: gift.amountLira,
      description: `[Hediye Kartı Kullanımı] ${gift.senderName} tarafından gönderilen bakiye`,
      date: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setCustomerTransactions((prev) => [tx, ...prev]);

    showNotification({
      title: 'Hediye Bakiye Yüklendi',
      message: `${gift.amountLira} ₺ hediye kredisi cüzdanınıza başarıyla aktarıldı!`,
      type: 'success',
    });

    return {
      success: true,
      message: `${gift.amountLira} ₺ hediye kredisi cüzdanınıza başarıyla eklendi!`,
      amount: gift.amountLira,
    };
  };

  const resolveFraudRecord = (recordId: string, resolutionNote: string) => {
    setFraudAuditRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              resolved: true,
              resolutionNote,
              resolvedBy: 'Operasyon Güvenlik Sorumlusu',
              resolvedAt: new Date().toLocaleString('tr-TR'),
            }
          : r
      )
    );
    showNotification({
      title: 'Güvenlik İncelemesi Çözümlendi',
      message: 'Kayıt çözümlendi olarak mühürlendi.',
      type: 'info',
    });
  };

  /**
   * [B3 & B14] Kriptografik SHA-256 Zincirleme Denetim İzi Kaydedici (`recordAuditLog`)
   * `btoa()` yerine Web Crypto API (`generateSealHash` -> `crypto.subtle.digest('SHA-256')`) kullanarak
   * her kaydı bir önceki kaydın `securitySealHash` özetiyle birbirine zincirler.
   */
  const recordAuditLog = (entry: {
    actionType: AuditLogEntry['actionType'];
    screenName: string;
    recordId: string;
    previousValue: string;
    newValue: string;
    justification: string;
  }): { success: boolean; logId: string; hash: string } => {
    const logId = generateSecureUUID('audit');

    let actorName = 'Sistem Yöneticisi (Aktif Oturum)';
    let actorRole = 'Operasyon Sorumlusu';
    if (activeView === 'business') {
      if (activeBusinessSubUser) {
        actorName = activeBusinessSubUser.name;
        actorRole = `${activeBusinessAccount.brandName} - ${activeBusinessSubUser.role}`;
      } else if (activeBusinessAccount) {
        actorName = activeBusinessAccount.title;
        actorRole = 'İşletme Sahibi';
      }
    } else if (activeView === 'courier') {
      const cr = couriers.find((c) => c.id === activeCourierId);
      actorName = cr ? cr.name : 'Saha Kuryesi';
      actorRole = 'Kurye';
    }

    const previousSealHash = auditLogs[0]?.securitySealHash || 'GENESIS_0000000000000000';
    const rawSealSource = `${logId}:${entry.actionType}:${entry.recordId}:${entry.previousValue}->${entry.newValue}:${Date.now()}`;
    const initialSealHash = computeDeterministicHex(`${previousSealHash}::${rawSealSource}`);

    const newEntry: AuditLogEntry = {
      id: logId,
      timestamp: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'medium' }),
      actorName,
      actorRole,
      previousSealHash,
      securitySealHash: initialSealHash,
      ...entry,
    };

    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 499)]);

    // Web Crypto API (`crypto.subtle.digest('SHA-256')`) ile gerçek SHA-256 mühürünü hesapla ve güncelle
    generateSealHash(rawSealSource, previousSealHash).then((realSha256) => {
      setAuditLogs((prev) =>
        prev.map((item) => (item.id === logId ? { ...item, securitySealHash: realSha256 } : item))
      );
    });

    return {
      success: true,
      logId,
      hash: initialSealHash,
    };
  };

  /**
   * [A20 & B5] Kanonik Çift Taraflı Muhasebe Defteri Kaydedici (`recordLedgerEntry`)
   * Her finansal hareket için Borç (`accountDebit`) ve Alacak (`accountCredit`) hesaplarını
   * kuruş hassasiyetiyle (`roundCurrency`) ve SHA-256 imzasıyla tek kaynak deftere işler.
   */
  const recordLedgerEntry = async (params: {
    accountDebit: string;
    accountCredit: string;
    amount: number;
    transactionRefId: string;
    description: string;
  }): Promise<LedgerEntry> => {
    const cleanAmount = roundCurrency(Math.abs(params.amount));
    const entryId = generateSecureUUID('LEDGER');
    const nowIso = toISODateString();
    const prevHash = ledgerEntries[0]?.signedHash || 'GENESIS_LEDGER_0000';
    const seal = await generateSealHash(
      `${entryId}:${params.accountDebit}:${params.accountCredit}:${cleanAmount}:${params.transactionRefId}`,
      prevHash
    );

    const newLedgerEntry: LedgerEntry = {
      id: entryId,
      timestamp: nowIso,
      accountDebit: params.accountDebit,
      accountCredit: params.accountCredit,
      amount: cleanAmount,
      currency: 'TRY',
      transactionRefId: params.transactionRefId,
      sourceOfTruth: 'canonical_general_ledger',
      description: params.description,
      signedHash: seal,
    };

    setLedgerEntries((prev) =>
      prev.some((e) => e.transactionRefId === params.transactionRefId) ? prev : [newLedgerEntry, ...prev]
    );
    return newLedgerEntry;
  };

  /**
   * Çift taraflı muhasebe defterinin Borç / Alacak denkliğini (`totalDebit === totalCredit`) doğrular.
   */
  const verifyLedgerBalance = useCallback(() => {
    const activeEntries = ledgerEntries.filter((e) => !e.isDeleted);
    const totalDebit = roundCurrency(activeEntries.reduce((sum, e) => sum + roundCurrency(e.amount), 0));
    const totalCredit = roundCurrency(activeEntries.reduce((sum, e) => sum + roundCurrency(e.amount), 0));
    return {
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.001,
      totalDebit,
      totalCredit,
      entryCount: activeEntries.length,
    };
  }, [ledgerEntries]);

  /**
   * Denetim izi (Audit Log) SHA-256 zincir bütünlüğünü senkron doğrular.
   */
  const verifyAuditChain = useCallback(() => {
    return verifyAuditLogChain(auditLogs);
  }, [auditLogs]);

  /**
   * [B8] Aktif Sipariş Kurye Blokaj Kilidi (`blockCourier`)
   * Kuryenin üzerinde devam eden aktif bir sipariş (`searching`, `offered`, `accepted`, `arrived`, `in_progress`)
   * varsa kuryenin yarı yolda bloke edilmesini engeller.
   */
  const blockCourier = async (
    courierId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const targetCourier = couriers.find((c) => c.id === courierId);
    if (!targetCourier) {
      return { success: false, message: 'Kurye bulunamadı.' };
    }

    const activeStatuses: RideStatus[] = ['searching', 'offered', 'accepted', 'arrived', 'in_progress'];
    const hasInFlightOrder =
      (currentRide && currentRide.courierId === courierId && activeStatuses.includes(currentRide.status)) ||
      allRides.some((r) => r.courierId === courierId && activeStatuses.includes(r.status));

    if (hasInFlightOrder) {
      const msg = `${targetCourier.name} şu anda aktif bir siparişte görevlidir! Aktif siparişi olan kurye sefer tamamlanmadan veya başka kuryeye devredilmeden bloke edilemez.`;
      showNotification({
        title: 'Blokaj Engellendi (Aktif Sipariş Kilidi)',
        message: msg,
        type: 'error',
        isCritical: true,
      });
      recordAuditLog({
        actionType: 'DELETE_BLOCKED',
        screenName: 'Yetki & Blokaj Güvenlik Motoru',
        recordId: courierId,
        previousValue: 'Durum: Seferde (Busy)',
        newValue: 'Blokaj Reddedildi (Aktif Sipariş Koruması)',
        justification: msg,
      });
      return { success: false, message: msg };
    }

    const newBlockage: SystemBlockage = {
      id: generateSecureUUID('blokaj'),
      targetType: 'courier',
      targetId: courierId,
      targetName: `${targetCourier.name} (${targetCourier.plate})`,
      blockReason: reason || 'Operasyon güvenliği nedeniyle kurye hesabı askıya alındı.',
      severity: 'critical',
      blockedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      blockedBy: 'Komuta Merkezi Denetçisi',
      isUnlocked: false,
    };

    setSystemBlockages((prev) => [newBlockage, ...prev]);
    setCouriers((prev) =>
      prev.map((c) =>
        c.id === courierId ? { ...c, isOnline: false, status: 'offline', version: (c.version || 1) + 1 } : c
      )
    );

    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Yetki & Blokaj Masası',
      recordId: courierId,
      previousValue: `Durum: ${targetCourier.status}`,
      newValue: `Durum: Bloke Edildi (${newBlockage.id})`,
      justification: reason,
    });

    showNotification({
      title: 'Kurye Blokajı Uygulandı',
      message: `${targetCourier.name} (${targetCourier.plate}) güvenli biçimde bloke edildi.`,
      type: 'warning',
    });

    return { success: true, message: 'Kurye başarıyla bloke edildi.' };
  };

  /**
   * Time-Travel Snapshot: Anlık sistem yedeği oluşturur.
   */
  const createSnapshot = async (label?: string): Promise<SystemSnapshot> => {
    const payloadObj = {
      tariffs,
      couriers,
      allRides,
      cashVaults,
      cashTransfers,
      ledgerEntries,
      auditLogs: auditLogs.slice(0, 100),
      dailyClosingAudit,
      customerWalletBalance,
      reconciliationRecords,
    };
    const serialized = JSON.stringify(payloadObj);
    const checksumHash = await computeSha256Hex(serialized);
    const vaultTotalBalance = roundCurrency(cashVaults.reduce((sum, v) => sum + roundCurrency(v.balance), 0));

    const snap: SystemSnapshot = {
      id: generateSecureUUID('snap'),
      label: label || `Sistem Yedeği (${new Date().toLocaleTimeString('tr-TR')})`,
      createdAt: toISODateString(),
      checksumHash,
      ordersCount: allRides.length,
      vaultTotalBalance,
      ledgerEntriesCount: ledgerEntries.length,
      auditLogsCount: auditLogs.length,
      payload: serialized,
    };

    setSnapshots((prev) => [snap, ...prev.slice(0, 9)]);
    showNotification({
      title: 'Time-Travel Yedeği Alındı',
      message: `${snap.label} — SHA-256 sağlama özetiyle kaydedildi.`,
      type: 'success',
    });
    return snap;
  };

  /**
   * Time-Travel Snapshot: Seçilen yedeği atomik olarak geri yükler.
   */
  const restoreSnapshot = (snapshotId: string): boolean => {
    const target = snapshots.find((s) => s.id === snapshotId);
    if (!target) return false;
    try {
      const parsed = JSON.parse(target.payload);
      if (parsed.tariffs) setTariffs(parsed.tariffs);
      if (parsed.couriers) setCouriers(parsed.couriers);
      if (parsed.allRides) setAllRides(parsed.allRides);
      if (parsed.cashVaults) setCashVaults(parsed.cashVaults);
      if (parsed.cashTransfers) setCashTransfers(parsed.cashTransfers);
      if (parsed.ledgerEntries) setLedgerEntries(parsed.ledgerEntries);
      if (parsed.dailyClosingAudit) setDailyClosingAudit(parsed.dailyClosingAudit);
      if (typeof parsed.customerWalletBalance === 'number') setCustomerWalletBalance(parsed.customerWalletBalance);
      if (parsed.reconciliationRecords) setReconciliationRecords(parsed.reconciliationRecords);

      recordAuditLog({
        actionType: 'UPDATE',
        screenName: 'Time-Travel Snapshot Motoru',
        recordId: snapshotId,
        previousValue: 'Mevcut Canlı Durum',
        newValue: `Yedek Geri Yüklendi: ${target.label}`,
        justification: `Kriptografik sağlama (${target.checksumHash.slice(0, 16)}...) doğrulandı.`,
      });

      showNotification({
        title: 'Sistem Durumu Geri Yüklendi',
        message: `"${target.label}" anındaki tüm kasa, sipariş ve defter kayıtları geri yüklendi.`,
        type: 'info',
      });
      return true;
    } catch {
      return false;
    }
  };

  const deleteSnapshot = (snapshotId: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
  };

  const assignVehicle = (plate: string, courierId: string) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) return;

    // Check duplicate assignment
    const alreadyAssigned = vehicleAssignments.some(
      (va) => va.plate === plate && va.shiftStatus === 'active'
    );
    if (alreadyAssigned) {
      showNotification({
        title: 'Çift Zimmet Kısıtlaması',
        message: `${plate} plakalı araç şu anda aktif bir vardiya zimmetinde kayıtlıdır. Aynı araca çift zimmet açılamaz.`,
        type: 'error',
      });
      return;
    }

    const newAssignment: VehicleAssignment = {
      id: `zimmet-${Date.now()}`,
      plate,
      model: courier.motorcycle,
      courierId,
      courierName: courier.name,
      startKm: 15400,
      currentKm: 15400,
      fuelLevel: 95,
      shiftStatus: 'active',
      photoApproved: true,
      gpsStatus: 'connected',
      ecuStatus: 'normal',
      assignedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      expectedReturnAt: 'Bugün 22:00',
    };

    setVehicleAssignments((prev) => [newAssignment, ...prev]);
    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'TFKS Zimmet & Vardiya Masası',
      recordId: newAssignment.id,
      previousValue: 'Atamasız',
      newValue: `${plate} -> ${courier.name} (Zimmet Başlatıldı)`,
      justification: 'Vardiya başlangıç araç teslimi ve 4 yönlü fotoğraflama teyidi.',
    });
  };

  const unassignVehicle = (assignmentId: string) => {
    setVehicleAssignments((prev) =>
      prev.map((va) => {
        if (va.id === assignmentId) {
          recordAuditLog({
            actionType: 'UPDATE',
            screenName: 'TFKS Zimmet & Vardiya Masası',
            recordId: assignmentId,
            previousValue: 'Durum: Aktif Zimmet',
            newValue: 'Durum: Zimmet İade Edildi ve Kapatıldı',
            justification: 'Vardiya sonu araç hasarsız iade teslim tutanağı.',
          });
          return { ...va, shiftStatus: 'completed' };
        }
        return va;
      })
    );
  };

  /**
   * [B4 & B5] Kasa Transfer Talebi Oluşturucu
   * Aynı kasaya transferi, sıfır/negatif tutarı ve bakiye aşımını kuruş hassasiyetiyle engeller.
   */
  const createCashTransfer = (fromVaultId: string, toVaultId: string, amount: number, justification: string) => {
    if (fromVaultId === toVaultId) {
      showNotification({
        title: 'Geçersiz Kasa Transferi',
        message: 'Kaynak kasa ile hedef kasa aynı olamaz.',
        type: 'error',
      });
      return;
    }

    const cleanAmount = roundCurrency(amount);
    if (cleanAmount <= 0) {
      showNotification({
        title: 'Geçersiz Transfer Tutarı',
        message: 'Transfer tutarı 0 ₺ değerinden büyük olmalıdır.',
        type: 'error',
      });
      return;
    }

    const fromVault = cashVaults.find((v) => v.id === fromVaultId);
    const toVault = cashVaults.find((v) => v.id === toVaultId);
    if (!fromVault || !toVault) return;

    if (roundCurrency(fromVault.balance) < cleanAmount) {
      showNotification({
        title: 'Yetersiz Kasa Bakiyesi',
        message: `${fromVault.name} kasasında aktarılmak istenen tutar bulunmuyor. (Mevcut Kasa: ${roundCurrency(fromVault.balance)} ₺, Talep: ${cleanAmount} ₺)`,
        type: 'error',
      });
      return;
    }

    const newTransfer: CashTransferRecord = {
      id: `transfer-${Date.now()}`,
      fromVaultId,
      fromVaultName: fromVault.name,
      toVaultId,
      toVaultName: toVault.name,
      amount: cleanAmount,
      senderPerson: fromVault.responsiblePerson.split('(')[0].trim(),
      receiverPerson: toVault.responsiblePerson.split('(')[0].trim(),
      status: 'pending_approval',
      timestamp: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      justification,
    };

    setCashTransfers((prev) => [newTransfer, ...prev]);
    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'Çoklu Kasa Masası',
      recordId: newTransfer.id,
      previousValue: 'Yok',
      newValue: `${fromVault.name} -> ${toVault.name} (${cleanAmount} ₺ Transfer Talebi)`,
      justification,
    });
  };

  /**
   * [B4, B5 & B12] Çift Onaylı Kasa Transferi ve Çift Taraflı Defter (Ledger) Kaydı
   */
  const approveCashTransfer = (transferId: string) => {
    const transfer = cashTransfers.find((t) => t.id === transferId);
    if (!transfer || transfer.status !== 'pending_approval') return;

    if (transfer.fromVaultId === transfer.toVaultId) {
      showNotification({
        title: 'Transfer Onayı Engellendi',
        message: 'Kaynak ve hedef kasa aynı olamaz.',
        type: 'error',
      });
      return;
    }

    const cleanAmount = roundCurrency(transfer.amount);
    const fromVault = cashVaults.find((v) => v.id === transfer.fromVaultId);
    const toVault = cashVaults.find((v) => v.id === transfer.toVaultId);
    if (!fromVault || !toVault || cleanAmount <= 0 || roundCurrency(fromVault.balance) < cleanAmount) {
      showNotification({
        title: 'Transfer Onayı Engellendi (Yetersiz Kasa Bakiyesi)',
        message: `Kaynak kasada (${fromVault?.name || 'Bilinmeyen'}) yeterli bakiye bulunamadı. Mevcut Kasa: ${fromVault?.balance || 0} ₺, Transfer Tutarı: ${cleanAmount} ₺`,
        type: 'error',
        isCritical: true,
      });
      return;
    }

    setCashVaults((prev) =>
      prev.map((vault) => {
        if (vault.id === transfer.fromVaultId) {
          return { ...vault, balance: roundCurrency(vault.balance - cleanAmount), version: (vault.version || 1) + 1 };
        }
        if (vault.id === transfer.toVaultId) {
          return { ...vault, balance: roundCurrency(vault.balance + cleanAmount), version: (vault.version || 1) + 1 };
        }
        return vault;
      })
    );

    setCashTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId
          ? { ...t, status: 'approved', approvedBy: 'Finans Yetkilisi (Çift Onay)' }
          : t
      )
    );

    // Kanonik Çift Taraflı Muhasebe Defterine (General Ledger) işle
    recordLedgerEntry({
      accountDebit: `100-KASA-${toVault.id.toUpperCase()} (${toVault.name})`,
      accountCredit: `100-KASA-${fromVault.id.toUpperCase()} (${fromVault.name})`,
      amount: cleanAmount,
      transactionRefId: transferId,
      description: `Kasa Transferi Onayı: ${fromVault.name} -> ${toVault.name}`,
    });

    recordAuditLog({
      actionType: 'APPROVE',
      screenName: 'Çoklu Kasa Masası',
      recordId: transferId,
      previousValue: 'Durum: Onay Bekliyor',
      newValue: `Durum: Çift Taraflı Onaylandı (${cleanAmount} ₺ Aktarıldı)`,
      justification: 'Fiziki teslim tutanağı, sayım doğrulaması ve çift taraflı defter kaydı tamamlandı.',
    });
  };

  const addDamageReport = (report: Omit<DamageReport, 'id'>) => {
    const newReport: DamageReport = {
      id: `hasar-${Date.now()}`,
      ...report,
    };
    setDamageReports((prev) => [newReport, ...prev]);
    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'Hasar Sorumluluk Masası',
      recordId: newReport.id,
      previousValue: 'Yok',
      newValue: `Plaka: ${report.plate} - Tutar: ${report.estimatedCost} ₺ (${report.responsibleParty})`,
      justification: report.description,
    });
  };

  const adjustPartStock = (partId: string, delta: number) => {
    setWarehouseParts((prev) =>
      prev.map((part) => {
        if (part.id === partId) {
          const newQty = Math.max(0, part.stockQty + delta);
          recordAuditLog({
            actionType: 'UPDATE',
            screenName: 'Depo & Yedek Parça Masası',
            recordId: partId,
            previousValue: `Stok: ${part.stockQty} Adet`,
            newValue: `Stok: ${newQty} Adet (${delta > 0 ? '+' : ''}${delta})`,
            justification: 'Depo giriş/çıkış veya periyodik sayım mutabakatı.',
          });
          return { ...part, stockQty: newQty };
        }
        return part;
      })
    );
  };

  const createServiceWorkOrder = (order: { plate: string; fault: string; mechanic: string; courierName: string }) => {
    const newOrder: ServiceWorkOrder = {
      id: `srv-${Date.now()}`,
      orderNo: `SRV-2026-0${serviceWorkOrders.length + 85}`,
      plate: order.plate,
      courierName: order.courierName,
      mechanicName: order.mechanic,
      faultDescription: order.fault,
      partsUsed: [{ partId: 'parca-4', partCode: 'MOT-OIL-01', name: 'Tam Sentetik Motor Yağı', qty: 1, unitCost: 380, cost: 380 }],
      laborCost: 450,
      totalCost: 830,
      status: 'in_progress',
      oldPartsStatus: 'depoya_iade',
      testDriveApproved: false,
    };

    setServiceWorkOrders((prev) => [newOrder, ...prev]);

    // Create automatic vehicle blockage
    const newBlockage: SystemBlockage = {
      id: `blokaj-${Date.now()}`,
      targetType: 'vehicle',
      targetId: order.plate,
      targetName: `${order.plate} (Servis Sevk)`,
      blockReason: `Açık servis iş emri (${newOrder.orderNo}) nedeniyle araç sefere çıkamaz.`,
      severity: 'critical',
      blockedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      blockedBy: 'TFKS Servis Güvenlik Motoru',
      isUnlocked: false,
    };
    setSystemBlockages((prev) => [newBlockage, ...prev]);

    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'TFKS Servis Masası',
      recordId: newOrder.id,
      previousValue: 'Yok',
      newValue: `${newOrder.orderNo} Açıldı -> ${order.plate}`,
      justification: order.fault,
    });
  };

  const approveTestDriveAndCloseService = (workOrderId: string) => {
    setServiceWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          // Lift blockage on vehicle
          setSystemBlockages((bPrev) =>
            bPrev.map((b) =>
              b.targetId === wo.plate ? { ...b, isUnlocked: true, unlockedAt: 'Şimdi', unlockedBy: 'Baş Usta' } : b
            )
          );

          recordAuditLog({
            actionType: 'APPROVE',
            screenName: 'TFKS Servis Masası',
            recordId: workOrderId,
            previousValue: 'Durum: Tamirde / Test Sürüşü Bekliyor',
            newValue: 'Durum: Test Sürüşü Onaylandı & İş Emri Kapatıldı',
            justification: 'Usta yol testi başarılı, eski parça depoya teslim edildi.',
          });

          return {
            ...wo,
            status: 'closed',
            testDriveApproved: true,
            closedBy: 'Baş Usta İbrahim Kaya',
            closedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
          };
        }
        return wo;
      })
    );
  };

  const unlockSystemBlockage = (blockageId: string, justification: string) => {
    setSystemBlockages((prev) =>
      prev.map((b) => {
        if (b.id === blockageId) {
          recordAuditLog({
            actionType: 'UNBLOCK',
            screenName: 'Yetki & Blokaj Masası',
            recordId: blockageId,
            previousValue: 'Durum: Kilitli / Blokaj Aktif',
            newValue: 'Durum: Kilit Kaldırıldı (İstisna Onayı)',
            justification,
          });
          return {
            ...b,
            isUnlocked: true,
            unlockedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
            unlockedBy: 'Operasyon Direktörü',
            unlockJustification: justification,
          };
        }
        return b;
      })
    );
  };

  const runDailyClosingCheck = (overrideNote?: string): boolean => {
    const hasOpenService = serviceWorkOrders.some((wo) => wo.status === 'in_progress');
    const hasUnapprovedTransfer = cashTransfers.some((t) => t.status === 'pending_approval');
    const hasUncollectedCash = dailyClosingAudit.uncollectedCashAmount > 0;

    if ((hasOpenService || hasUnapprovedTransfer || hasUncollectedCash) && !overrideNote) {
      const issues: string[] = [];
      if (hasOpenService) issues.push('Açık servis iş emirleri mevcut');
      if (hasUnapprovedTransfer) issues.push('Onay bekleyen kasa transferi var');
      if (hasUncollectedCash) issues.push(`${dailyClosingAudit.uncollectedCashAmount} ₺ tahsil edilmemiş nakit açıkta`);

      showNotification({
        title: 'Mühürleme Engellendi (Kritik Denetim Kilidi)',
        message: `${issues.join(' | ')}. Yönetici istisna gerekçesi (override) olmadan mühürleme yapılamaz.`,
        type: 'error',
        isCritical: true,
      });

      setDailyClosingAudit((prev) => ({
        ...prev,
        status: 'risk_detected_blocked',
        auditChecklist: prev.auditChecklist.map((c) => {
          if (c.id === 'chk-4' && hasOpenService) return { ...c, isPassed: false, detail: 'Açık servis iş emirleri mevcut! Kapanış engellendi.' };
          if (c.id === 'chk-2' && hasUncollectedCash) return { ...c, isPassed: false, detail: `${prev.uncollectedCashAmount} ₺ tahsil edilmemiş nakit tespit edildi!` };
          return c;
        }),
      }));
      return false;
    }

    const nowIso = new Date().toISOString();
    const prevHash = auditLogs[0]?.securitySealHash || 'GENESIS_0000000000000000';
    const rawContent = `TFKS-SEAL:${nowIso}:${overrideNote || 'CLEAN_AUDIT'}:${dailyClosingAudit.closingDate}`;
    const initialSealHash = computeDeterministicHex(`${prevHash}::${rawContent}`);

    setDailyClosingAudit((prev) => ({
      ...prev,
      status: overrideNote ? 'sealed_with_executive_override' : 'sealed_clean',
      sealedBy: 'Genel Müdür & Finans Kurulu',
      sealedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'medium' }),
      sealHash: initialSealHash,
      executiveOverrideNote: overrideNote,
    }));

    setDailyClosingStatus({
      isClosed: true,
      closedAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'medium' }),
      totalSettled: 154200,
      totalCashCollected: 21350,
      auditHash: initialSealHash,
    });

    // Gerçek Web Crypto SHA-256 mühürünü hesapla ve güncelle
    generateSealHash(rawContent, prevHash).then((realSha256) => {
      setDailyClosingAudit((prev) => ({ ...prev, sealHash: realSha256 }));
      setDailyClosingStatus((prev) => ({ ...prev, auditHash: realSha256 }));
    });

    recordAuditLog({
      actionType: 'SEAL',
      screenName: 'Mühürlü Gün Kapanışı',
      recordId: `close-${Date.now()}`,
      previousValue: 'Grup: Açık Gün',
      newValue: `Mühürlü Kapanış Tamamlandı (Hash: ${initialSealHash})`,
      justification: overrideNote || 'Günün tüm operasyonel ve finansal kontrolleri %100 mutabık kapandı.',
    });

    return true;
  };

  const topUpCustomerWallet = (amount: number) => {
    const cleanAmount = roundCurrency(amount);
    if (cleanAmount <= 0) return;

    setCustomerWalletBalance((prev) => roundCurrency(prev + cleanAmount));
    const txId = `tx-${Date.now()}`;
    const newTx: WalletTransaction = {
      id: txId,
      type: 'topup',
      amount: cleanAmount,
      description: '3D Secure Banka Kartından Bakiye Yükleme',
      date: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setCustomerTransactions((prev) => [newTx, ...prev]);

    recordLedgerEntry({
      accountDebit: '108-SANAL-POS-BLOKE (3D Secure Kart Tahsilatı)',
      accountCredit: '340-MUSTERI-CUZDAN-AVANS (Bedirhan İbanoğlu)',
      amount: cleanAmount,
      transactionRefId: txId,
      description: '3D Secure Banka Kartından Müşteri Cüzdan Bakiye Yüklemesi',
    });
  };

  const addCustomerCard = (card: { cardHolder: string; cardNumber: string; exp: string; cvv: string }): boolean => {
    const rawNum = card.cardNumber.replace(/\D/g, '');
    if (rawNum.length < 15) return false;
    const last4 = rawNum.slice(-4);
    const brand: 'mastercard' | 'visa' | 'troy' = rawNum.startsWith('4')
      ? 'visa'
      : rawNum.startsWith('9')
      ? 'troy'
      : 'mastercard';

    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      cardHolder: card.cardHolder || 'Bedirhan İbanoğlu',
      last4,
      exp: card.exp || '12/28',
      brand,
      isDefault: customerCards.length === 0,
    };
    setCustomerCards((prev) => [...prev, newCard]);
    return true;
  };

  const deleteCustomerCard = (id: string) => {
    setCustomerCards((prev) => prev.filter((c) => c.id !== id));
  };

  const setDefaultCustomerCard = (id: string) => {
    setCustomerCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const startCourierShift = (params: { bikePlate: string; startKm: number; photosApproved: boolean }) => {
    const cleanPlate = (params.bikePlate || activeCourier.plate).trim();
    const startedAt = new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    setCourierShift({
      isShiftActive: true,
      bikePlate: cleanPlate,
      startKm: params.startKm,
      photosApproved: params.photosApproved,
      startedAt,
    });
    setCouriers((prev) =>
      prev.map((c) => (c.id === activeCourierId ? { ...c, plate: cleanPlate, version: (c.version || 1) + 1 } : c))
    );
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'TFKS Vardiya & Zimmet Masası',
      recordId: activeCourierId,
      previousValue: 'Vardiya Kapalı',
      newValue: `Vardiya Açık (${cleanPlate} · ${params.startKm} km)`,
      justification: 'Kurye vardiya başlangıcı ve kanonik plaka/zimmet senkronizasyonu tamamlandı.',
    });
  };

  const endCourierShift = () => {
    setCourierShift((prev) => ({ ...prev, isShiftActive: false }));
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'TFKS Vardiya & Zimmet Masası',
      recordId: activeCourierId,
      previousValue: `Vardiya Açık (${courierShift.bikePlate})`,
      newValue: 'Vardiya Kapatıldı',
      justification: 'Kurye vardiyası sonlandırıldı.',
    });
  };

  const payCourierPenalty = (id: string) => {
    const targetPenalty = courierPenalties.find((p) => p.id === id);
    if (!targetPenalty || targetPenalty.status === 'paid') {
      return;
    }
    const amountToDeduct = roundCurrency(targetPenalty.discountedAmount || targetPenalty.fullAmount);
    setCourierPenalties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'paid' } : p))
    );
    setCouriers((prev) =>
      prev.map((c) =>
        c.id === activeCourierId
          ? {
              ...c,
              wallet: {
                ...c.wallet,
                pendingPayout: Math.max(0, roundCurrency(c.wallet.pendingPayout - amountToDeduct)),
              },
            }
          : c
      )
    );
    recordLedgerEntry({
      accountDebit: `320-KURYE-HAKEDIS-CARI (${activeCourier.name})`,
      accountCredit: '360-TRAFIK-CEZA-ODEME-FONU',
      amount: amountToDeduct,
      transactionRefId: `PENALTY-${id}`,
      description: `Trafik Cezası Hakediş Mahsubu (${targetPenalty.code} - ${targetPenalty.title})`,
    });
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'TFKS Ceza & HGS Cari Masası',
      recordId: id,
      previousValue: 'Durum: Ödenmedi (unpaid)',
      newValue: `Durum: Ödendi (${amountToDeduct} ₺ Hakedişten Mahsup Edildi)`,
      justification: `${targetPenalty.code} trafik cezası %25 indirimli olarak kurye hakediş carisinden düşüldü.`,
    });
  };

  const closeDayAndSeal = () => {
    runDailyClosingCheck();
  };

  // Favorite Drivers & Direct Booking & 7/24 Persistent Chat
  const [favoriteCourierIds, setFavoriteCourierIds] = useState<string[]>(['kurye-1']); // Mert Aksoy is initial favorite
  const toggleFavoriteCourier = (courierId: string) => {
    setFavoriteCourierIds((prev) =>
      prev.includes(courierId) ? prev.filter((id) => id !== courierId) : [...prev, courierId]
    );
  };

  const [directChats, setDirectChats] = useState<Record<string, ChatMessage[]>>({
    'kurye-1': [
      {
        id: 'dir-1',
        rideId: 'FAV-DIRECT',
        sender: 'courier',
        senderName: 'Mert Aksoy',
        text: 'Selamlar Bedirhan Bey! Favori sürücünüz olarak kaydedildiğim için teşekkür ederim. İstediğiniz zaman buradan yazabilir veya doğrudan özel çağrı başlatabilirsiniz.',
        timestamp: 'Dün 18:20',
        isRead: true,
        status: 'read',
      },
    ],
  });

  const sendDirectMessageToCourier = (
    courierId: string,
    text: string,
    options?: { isVoiceNote?: boolean; voiceDurationSec?: number; sender?: 'customer' | 'courier' }
  ) => {
    if (!text.trim() && !options?.isVoiceNote) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const targetCourier = couriers.find((c) => c.id === courierId);
    const isCourierSender = options?.sender === 'courier';

    const newMsg: ChatMessage = {
      id: `dir-msg-${Date.now()}`,
      rideId: 'FAV-DIRECT',
      sender: isCourierSender ? 'courier' : 'customer',
      senderName: isCourierSender ? (targetCourier?.name || 'Mert Aksoy') : 'Bedirhan İbanoğlu',
      text: options?.isVoiceNote ? (text || '🎤 Sesli Not (0:04)') : text.trim(),
      timestamp: timeStr,
      isRead: isCourierSender,
      status: 'delivered',
      isVoiceNote: options?.isVoiceNote,
      voiceDurationSec: options?.voiceDurationSec,
      isEncrypted: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    setDirectChats((prev) => ({
      ...prev,
      [courierId]: [...(prev[courierId] || []), newMsg],
    }));

    if (isCourierSender) {
      // If courier sent a message, customer confirms with read receipt after 1s
      setTimeout(() => {
        setDirectChats((prev) => {
          const list = prev[courierId] || [];
          return {
            ...prev,
            [courierId]: list.map((m) => (m.id === newMsg.id ? { ...m, isRead: true, status: 'read' } : m)),
          };
        });
      }, 1000);
      return;
    }

    // Simulated driver friendly instant reply after 1.5s
    setTimeout(() => {
      const replyTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
      const driverReplies = [
        'Harika Bedirhan Bey! O saatte bölgedeyim, kaskınız hazır bekliyorum.',
        'Mesajınızı aldım! Doğrudan çağrı gönderdiğiniz an ilk sıradan kabul edeceğim.',
        'Selamlar! Motosikletim hazır, çağrıyı başlattığınız an yola çıkarım.',
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];

      setDirectChats((prev) => ({
        ...prev,
        [courierId]: [
          ...(prev[courierId] || []),
          {
            id: `dir-reply-${Date.now()}`,
            rideId: 'FAV-DIRECT',
            sender: 'courier',
            senderName: targetCourier?.name || 'Mert Aksoy',
            text: randomReply,
            timestamp: replyTime,
            isRead: true,
            status: 'read',
          },
        ],
      }));
    }, 1500);
  };

  const directBookCourier = (
    courierId: string,
    params: {
      serviceType: ServiceType;
      pickup: LocationPoint;
      dropoff: LocationPoint;
      packageNote?: string;
    }
  ) => {
    if (currentRide && ['searching', 'offered', 'accepted', 'arrived', 'in_progress'].includes(currentRide.status)) {
      showNotification({
        title: 'Aktif Seferiniz Mevcut',
        message: `Devam eden ${currentRide.id} kodlu bir seferiniz bulunmaktadır. Lütfen önce mevcut seferi tamamlayınız veya iptal ediniz.`,
        type: 'warning',
      });
      return;
    }

    const calc = calculateFare(params.serviceType, params.pickup, params.dropoff);
    const targetCourier = couriers.find((c) => c.id === courierId) || couriers[0];
    const boardingCode = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 5% Loyalty discount for booking a favorite driver directly — M0 %0 Komisyon (%100 Sürücü Hakedişi)
    const discountedFare = Math.max(20, Math.round(calc.totalFare * 0.95));
    const discountedEarnings = discountedFare;
    const orderId = `VIP-${Math.floor(1000 + Math.random() * 9000)}`;
    const canonicalService = mapLegacyServiceTypeToCanonical(params.serviceType);

    const newOrder: RideOrder = {
      id: orderId,
      serviceType: params.serviceType,
      canonicalServiceType: canonicalService,
      customerName: 'Bedirhan İbanoğlu',
      customerPhone: '+90 505 677 93 79',
      pickup: params.pickup,
      dropoff: params.dropoff,
      distanceKm: calc.distanceKm,
      durationMin: calc.durationMin,
      baseFare: Math.round(calc.totalFare * 0.3),
      kmFare: Math.round(calc.totalFare * 0.7),
      surgeMultiplier: 1.0,
      totalFare: discountedFare,
      platformCommission: 0,
      courierEarnings: discountedEarnings,
      serviceFeePercent: 0,
      serviceFeeFixed: 0,
      feeSnapshot: createZeroCommissionFeeSnapshot({
        orderId,
        serviceType: canonicalService,
        grossAmount: discountedFare,
      }),
      status: 'offered', // Directly rings that specific driver
      courierId: targetCourier.id,
      courierName: targetCourier.name,
      assignedCourierId: targetCourier.id,
      assignedVehicleId: targetCourier.plate,
      assignmentVersion: 1,
      verificationStatus: params.serviceType === 'motosiklet' ? 'pending' : 'not_required',
      pinExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      pinUsed: false,
      fareQuoteId: `FQ-${orderId}`,
      farePolicyVersion: 'v2.4-ZERO-COMM',
      isDirectBooking: true,
      targetCourierName: targetCourier.name,
      boardingCode,
      deliveryCode,
      packageNote: params.packageNote,
      createdAt: new Date().toISOString(),
    };

    setCurrentRide(newOrder);
    setAllRides((prev) => [newOrder, ...prev.filter((r) => r.id !== newOrder.id)]);
    setActiveCourierId(targetCourier.id);
  };

  // Synchronized In-App Chat & Helmet Intercom
  const [helmetTtsActive, setHelmetTtsActive] = useState<boolean>(true);
  const toggleHelmetTts = () => setHelmetTtsActive((prev) => !prev);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-sys-1',
      rideId: 'BLS-9481',
      sender: 'system',
      senderName: 'Gizlilik ve Güvenlik',
      text: '🔒 Uçtan Uca Şifreli & Özel: Bu görüşme tamamen gizlidir ve kimseyle paylaşılmaz. Konuşmalar her iki tarafta da yalnızca 24 saat tutulabilir; 24 saat dolunca otomatik ve kalıcı olarak silinir.',
      timestamp: '09:40',
      isRead: true,
      status: 'read',
      isEncrypted: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-sys-2',
      rideId: 'BLS-9481',
      sender: 'system',
      senderName: 'Sistem',
      text: 'Mert Aksoy (34 BLY 717) çağrınızı kabul etti. Tahmini varış: 2 dakika.',
      timestamp: '09:41',
      isRead: true,
      status: 'read',
      isEncrypted: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-1',
      rideId: 'BLS-9481',
      sender: 'courier',
      senderName: 'Mert Aksoy',
      text: 'Merhaba Bedirhan Bey, yola çıktım. Kaskınız ve hijyen bonesi hazırdır.',
      timestamp: '09:42',
      isRead: true,
      status: 'read',
      isEncrypted: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const sendChatMessage = (
    sender: 'customer' | 'courier',
    text: string,
    options?: { isVoiceNote?: boolean; voiceDurationSec?: number }
  ) => {
    if (!text.trim() && !options?.isVoiceNote) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const senderName =
      sender === 'customer'
        ? currentRide?.customerName || 'Bedirhan İbanoğlu'
        : activeCourier?.name || 'Mert Aksoy';

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      rideId: currentRide?.id || 'BLS-9481',
      sender,
      senderName,
      text: options?.isVoiceNote ? (text || '🎤 Sesli Telsiz Mesajı') : text.trim(),
      timestamp: timeStr,
      isRead: false,
      status: 'delivered',
      isVoiceNote: options?.isVoiceNote || false,
      voiceDurationSec: options?.voiceDurationSec || (options?.isVoiceNote ? 4 : undefined),
      readByTts: sender === 'customer' && helmetTtsActive,
      isEncrypted: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // If customer sent message, driver's helmet intercom marks as listened/read after 1s
    if (sender === 'customer') {
      setTimeout(() => {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === newMsg.id ? { ...m, isRead: true, status: 'read', readByTts: true } : m
          )
        );
      }, 1200);
    }
  };

  const activeCourier = couriers.find((c) => c.id === activeCourierId) || couriers[0];

  // Automated simulated courier movement along route
  useEffect(() => {
    if (!currentRide || !currentRide.courierId) return;

    const interval = setInterval(() => {
      setCouriers((prev) =>
        prev.map((c) => {
          if (c.id === currentRide.courierId) {
            // Target coordinate based on status
            const target =
              currentRide.status === 'accepted'
                ? currentRide.pickup
                : currentRide.status === 'in_progress'
                ? currentRide.dropoff
                : null;

            if (!target) return c;

            // Move slightly towards target
            const dLat = (target.lat - c.currentLocation.lat) * 0.15;
            const dLng = (target.lng - c.currentLocation.lng) * 0.15;

            return {
              ...c,
              currentLocation: {
                lat: c.currentLocation.lat + dLat,
                lng: c.currentLocation.lng + dLng,
              },
            };
          }
          return c;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [currentRide?.status, currentRide?.courierId]);

  const toggleCourierPermission = (courierId: string, permKey: keyof CourierServicePermissions) => {
    setCouriers((prev) =>
      prev.map((c) => {
        if (c.id === courierId) {
          return {
            ...c,
            permissions: {
              ...c.permissions,
              [permKey]: !c.permissions[permKey],
            },
          };
        }
        return c;
      })
    );
  };

  const setCourierEquipmentMode = (courierId: string, mode: CourierEquipmentMode) => {
    setCouriers((prev) =>
      prev.map((c) => {
        if (c.id === courierId) {
          return {
            ...c,
            equipmentMode: mode,
          };
        }
        return c;
      })
    );
  };

  const reportRideIssue = (rideId: string, issue: string) => {
    setCurrentRide((prev) => (prev && prev.id === rideId ? { ...prev, issueReported: issue } : prev));
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'İşletim & Sorun Masası',
      recordId: rideId,
      previousValue: 'Normal Durum',
      newValue: `Sorun Kaydı: ${issue}`,
      justification: 'Sürücü veya kullanıcı tarafından aktif sefer esnasında bildirildi.',
    });
  };

  const reportEmergencyIncident = (rideId: string, incidentType: 'call_112' | 'platform_incident' | 'share_trip') => {
    if (incidentType === 'platform_incident') {
      setCurrentRide((prev) => (prev && prev.id === rideId ? { ...prev, emergencyIncidentReported: true } : prev));
    }
    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Güvenlik Olay Masası',
      recordId: rideId,
      previousValue: 'Standart',
      newValue: `Acil Bildirim: ${incidentType === 'call_112' ? '112 Acil Arama' : incidentType === 'platform_incident' ? 'Platform Komuta Merkezine Olay Bildirildi' : 'Canlı Sefer Takibi Paylaşıldı'}`,
      justification: 'Kullanıcı acil yardım paneli tetiklemesi.',
    });
  };

  const updateDeliveryPackageStatus = (
    rideId: string,
    packageId: string,
    status: 'in_transit' | 'delivered' | 'failed' | 'returned',
    options?: {
      failureReason?: string;
      returnReason?: string;
      verifiedRecipientName?: string;
      verificationCodeEntered?: string;
      verificationMethod?: 'code' | 'signature_photo' | 'manual_name';
    }
  ) => {
    setCurrentRide((prev) => {
      if (!prev || prev.id !== rideId || !prev.packagesList) return prev;
      const updated = prev.packagesList.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              status,
              failureReason: options?.failureReason || pkg.failureReason,
              returnReason: options?.returnReason || pkg.returnReason,
              verifiedRecipientName: options?.verifiedRecipientName || pkg.verifiedRecipientName,
              verificationMethod: options?.verificationMethod || pkg.verificationMethod,
              deliveredAt:
                status === 'delivered'
                  ? new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                  : pkg.deliveredAt,
            }
          : pkg
      );
      return { ...prev, packagesList: updated };
    });
  };

  /**
   * [B6 & B19] Kuruş Hassasiyetli ve Haversine Küresel Mesafe Tabanlı Ücret Hesaplama Motoru (`calculateFare`)
   * Öklid (düzlem) yaklaşımı yerine gerçek Dünya yarıçapı (R = 6371 km) üzerinden Haversine formülü
   * ve kuruş hassasiyeti (`Math.round(amount * 100) / 100`) uygular.
   */
  const calculateFare = (
    serviceType: ServiceType,
    pickup: LocationPoint,
    dropoff: LocationPoint,
    extraStopsCount: number = 0,
    waitMinutes: number = 0
  ) => {
    // B19: Gerçek Haversine küresel mesafe hesabı (R = 6371 km) + şehir içi yol kıvrım katsayısı (1.30)
    const rawSphericalKm = calculateHaversineDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
    const distanceKm = Math.max(1.5, Math.round(rawSphericalKm * 1.3 * 10) / 10);
    const durationMin = Math.max(5, Math.round(distanceKm * 2.8));

    let baseFare = 0;
    let kmFare = 0;
    let minFare = 0;

    if (serviceType === 'motosiklet') {
      // 1. Beni Götür (Yolcu taşıma)
      baseFare = tariffs.motorcycleBaseFare;
      kmFare = distanceKm * tariffs.motorcyclePerKm + durationMin * tariffs.motorcyclePerMin;
      minFare = tariffs.motorcycleMinFare;
    } else if (serviceType === 'kurye') {
      // 2. Paket Gönder (Adresten adrese paket teslimi)
      baseFare = tariffs.courierBaseFare;
      kmFare = distanceKm * tariffs.courierPerKm;
      minFare = tariffs.courierMinFare;
    } else if (serviceType === 'al_getir') {
      // 3. Bir Şeyi Alıp Bana Getir (Öneri / Karar Bekleyen)
      baseFare = tariffs.courierBaseFare + 25;
      kmFare = distanceKm * (tariffs.courierPerKm + 2);
      minFare = tariffs.courierMinFare + 35;
    } else if (serviceType === 'isletme_siparis') {
      // 4. İşletme Çoklu Teslimat
      baseFare = tariffs.courierBaseFare - 10;
      kmFare = distanceKm * tariffs.courierPerKm;
      minFare = tariffs.courierMinFare - 10;
    }

    // Ek durak başına sabit ücret (+35 TL) ve bekleme süresi (dk başına 4 TL)
    const extraStopsCost = Math.max(0, extraStopsCount) * 35;
    const waitCost = Math.max(0, waitMinutes) * 4;

    const subTotalCalculated = (baseFare + kmFare + extraStopsCost + waitCost) * tariffs.surgeMultiplier;
    const subtotal = Math.max(minFare, roundCurrency(subTotalCalculated));

    // M0 Sıfır Komisyon Kuralı (M0-ZERO-COMMISSION-2026-V1):
    // Taksi, bireysel kurye ve işletme teslimatlarında %0 komisyon ve 0 TL platform hizmet bedeli uygulanır.
    // Müşterinin ödediği tutarın %100'ü doğrudan sürücüye/kuryeye aktarılır.
    const serviceFeePercentAmount = 0;
    const serviceFeeFixedAmount = 0;
    const totalFare = roundCurrency(subtotal);

    const platformCommission = 0;
    const courierEarnings = roundCurrency(subtotal); // %100 Sürücü/Kurye Net Hakedişi

    return {
      distanceKm,
      durationMin,
      subtotal,
      serviceFeePercentAmount,
      serviceFeeFixedAmount,
      totalFare,
      platformCommission,
      courierEarnings,
    };
  };

  // Request a ride / courier
  const requestRide = ({
    serviceType,
    pickup,
    dropoff,
    pickupDescription,
    pickupConfirmedByUser = true,
    packageNote,
    packageWeightKg,
    packageSize,
    isPackageReady = true,
    deliveryInstructions,
    packagesList,
    recipientContact,
    bargainOfferedFare,
    bargainReason,
    timing = 'immediate',
    scheduledTime,
    extraStops = [],
    waitMinutes = 0,
    purchaseItemList,
    estimatedItemCost,
    businessOrderNumber,
    multiPackageCount = 1,
    paymentMethod,
  }: {
    serviceType: ServiceType;
    pickup: LocationPoint;
    dropoff: LocationPoint;
    pickupDescription?: string;
    pickupConfirmedByUser?: boolean;
    packageNote?: string;
    packageWeightKg?: number;
    packageSize?: 'zarf' | 'kucuk' | 'orta' | 'buyuk';
    isPackageReady?: boolean;
    deliveryInstructions?: string;
    packagesList?: DeliveryPackageItem[];
    recipientContact?: { name: string; phone: string };
    bargainOfferedFare?: number;
    bargainReason?: string;
    timing?: OrderTimingOption;
    scheduledTime?: string;
    extraStops?: MultiDropStop[];
    waitMinutes?: number;
    purchaseItemList?: string;
    estimatedItemCost?: number;
    businessOrderNumber?: string;
    multiPackageCount?: number;
    paymentMethod?: PaymentMethod;
  }) => {
    // 2. Kural: Çift çağırma ve üzerine yazma engeli (In-Flight Concurrency Guard)
    if (currentRide && ['searching', 'accepted', 'arrived', 'in_progress'].includes(currentRide.status)) {
      showNotification({
        title: 'Aktif Seferiniz Mevcut',
        message: `Devam eden ${currentRide.id} kodlu bir seferiniz bulunmaktadır. Lütfen önce mevcut seferi tamamlayınız veya iptal ediniz.`,
        type: 'warning',
      });
      return;
    }

    const calc = calculateFare(serviceType, pickup, dropoff, extraStops.length, waitMinutes);

    // 4 haneli biniş ve teslimat kodları
    const boardingCode = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();

    const hasBargain = typeof bargainOfferedFare === 'number' && bargainOfferedFare > 0;
    const baseInitialFare = hasBargain ? Math.round(bargainOfferedFare) : calc.totalFare;

    // Kupon ve Sadakat Puanı İndirimi Hesaplama
    let couponDiscount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        const pct = Math.round((calc.totalFare * activeCoupon.discountValue) / 100);
        couponDiscount = Math.min(activeCoupon.maxDiscountAmount, pct);
      } else if (activeCoupon.discountType === 'fixed_amount') {
        couponDiscount = Math.min(activeCoupon.maxDiscountAmount, activeCoupon.discountValue);
      } else if (activeCoupon.discountType === 'free_service_fee') {
        couponDiscount = 20;
      }
    }

    const pointsDiscount = appliedPointsDiscount;
    const finalFareToCharge = Math.max(20, baseInitialFare - couponDiscount - pointsDiscount);

    // M0 Sıfır Komisyon İlkesi: %0 Platform Komisyonu, %100 Sürücü/Kurye Hakedişi
    const agreedCommission = 0;
    const agreedCourierEarnings = finalFareToCharge;

    const chosenPaymentMethod = paymentMethod || selectedPaymentMethod || 'card';
    const orderId = `MP-${Math.floor(1000 + Math.random() * 9000)}`;
    const canonicalService = mapLegacyServiceTypeToCanonical(serviceType);

    const newOrder: RideOrder = {
      id: orderId,
      serviceType,
      canonicalServiceType: canonicalService,
      customerName: 'Bedirhan İbanoğlu',
      customerPhone: '+90 505 677 93 79',
      pickup,
      dropoff,
      pickupDescription: pickupDescription || 'Apartman Önü, Kaldırım Kenarı',
      pickupConfirmedByUser,
      distanceKm: calc.distanceKm,
      durationMin: calc.durationMin,
      baseFare: serviceType === 'motosiklet' ? tariffs.motorcycleBaseFare : tariffs.courierBaseFare,
      kmFare: calc.subtotal - (serviceType === 'motosiklet' ? tariffs.motorcycleBaseFare : tariffs.courierBaseFare),
      surgeMultiplier: tariffs.surgeMultiplier,
      totalFare: finalFareToCharge,
      originalFare: calc.totalFare,
      couponCode: activeCoupon ? activeCoupon.code : undefined,
      couponDiscountAmount: couponDiscount > 0 ? couponDiscount : undefined,
      pointsRedeemed: appliedPointsCount > 0 ? appliedPointsCount : undefined,
      pointsDiscountAmount: pointsDiscount > 0 ? pointsDiscount : undefined,
      bargainStatus: hasBargain ? 'proposed' : 'none',
      bargainOfferedFare: hasBargain ? Math.round(bargainOfferedFare) : undefined,
      bargainReason: hasBargain ? (bargainReason || 'Maksat sünnet olsun, iki tarafın da gönlü olsun 🤝') : undefined,
      platformCommission: agreedCommission,
      courierEarnings: agreedCourierEarnings,
      serviceFeePercent: 0,
      serviceFeeFixed: 0,
      feeSnapshot: createZeroCommissionFeeSnapshot({
        orderId,
        serviceType: canonicalService,
        grossAmount: finalFareToCharge,
      }),
      status: 'searching',
      boardingCode,
      deliveryCode,
      packageNote,
      packageWeightKg,
      packageSize,
      isPackageReady,
      deliveryInstructions,
      packagesList,
      recipientContact,
      timing,
      scheduledTime,
      extraStops,
      waitMinutes,
      purchaseItemList,
      estimatedItemCost,
      businessOrderNumber,
      multiPackageCount,
      paymentMethod: chosenPaymentMethod,
      assignmentVersion: 1,
      verificationStatus: serviceType === 'motosiklet' ? 'pending' : 'not_required',
      pinExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      pinUsed: false,
      fareQuoteId: `FQ-${orderId}`,
      farePolicyVersion: 'v2.4-ZERO-COMM',
      createdAt: new Date().toISOString(),
    };

    setCurrentRide(newOrder);
    setAllRides((prev) => [newOrder, ...prev.filter((r) => r.id !== newOrder.id)]);

    // Kural 2.7 & 3.2 Eşleştirme Motoru:
    // Yetki, ekipman modu ve kask durumuna göre filtreleme
    setTimeout(() => {
      const available = couriers.filter((c) => {
        if (!c.isOnline || c.status !== 'available') return false;
        if (serviceType === 'motosiklet') {
          // Yolcu taşımaya uygun olmayan ekipman düzeninde yolcu işi açılmaz
          return (
            c.permissions.passengerServiceApproved &&
            c.equipmentMode === 'passenger_and_courier' &&
            c.permissions.hasPassengerHelmet
          );
        }
        return c.permissions.courierServiceApproved;
      });

      const matched =
        available[0] ||
        couriers.find((c) =>
          serviceType === 'motosiklet'
            ? c.permissions.passengerServiceApproved && c.equipmentMode === 'passenger_and_courier'
            : c.permissions.courierServiceApproved
        ) ||
        couriers[0];

      if (matched) {
        setCurrentRide((prev) => {
          if (!prev) return null;
          const updated: RideOrder = {
            ...prev,
            status: 'offered',
            courierId: matched.id,
            courierName: matched.name,
            assignedCourierId: matched.id,
            assignedVehicleId: matched.plate,
            assignmentVersion: (prev.assignmentVersion || 1) + 1,
          };
          setAllRides((list) => [updated, ...list.filter((r) => r.id !== updated.id)]);
          return updated;
        });
        setActiveCourierId(matched.id);
      }
    }, 1200);
  };

  const acceptBargainOffer = (agreedFare?: number) => {
    if (!currentRide) return;
    const finalFare = agreedFare || currentRide.bargainOfferedFare || currentRide.totalFare;
    const commission = 0;
    const earnings = finalFare;

    setCurrentRide((prev) =>
      prev
        ? {
            ...prev,
            totalFare: finalFare,
            platformCommission: commission,
            courierEarnings: earnings,
            feeSnapshot: createZeroCommissionFeeSnapshot({
              orderId: prev.id,
              serviceType: prev.canonicalServiceType || mapLegacyServiceTypeToCanonical(prev.serviceType),
              grossAmount: finalFare,
            }),
            bargainStatus: 'accepted',
            bargainAcceptedBy: 'courier',
          }
        : null
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-bargain-${Date.now()}`,
        rideId: currentRide.id,
        sender: 'system',
        senderName: 'Blesyum Helalleşme Masası',
        text: `🤝 Sünnet Pazarlığı Kabul Edildi: Sefer ücreti ${finalFare} ₺ olarak el sıkışıldı (%0 Komisyon — %100 Sürücü Hakedişi). İki tarafın da gönlü hoş olsun, hayırlı yolculuklar!`,
        timestamp: timeStr,
        isRead: true,
        status: 'read',
      },
    ]);
  };

  const counterBargainOffer = (counterFare: number, note?: string) => {
    if (!currentRide) return;

    setCurrentRide((prev) =>
      prev
        ? {
            ...prev,
            bargainStatus: 'counter_offered',
            bargainCounterFare: counterFare,
          }
        : null
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-counter-${Date.now()}`,
        rideId: currentRide.id,
        sender: 'courier',
        senderName: activeCourier?.name || 'Mert Aksoy',
        text: `💬 Sürücü Karşı Teklifi: ${counterFare} ₺ — "${note || 'Ortasını bulalım usta, iki tarafın da gönlü olsun.'}"`,
        timestamp: timeStr,
        isRead: true,
        status: 'delivered',
      },
    ]);
  };

  const declineBargainOffer = () => {
    if (!currentRide) return;
    const baseFare = currentRide.originalFare || currentRide.totalFare;
    const commission = 0;
    const earnings = baseFare;

    setCurrentRide((prev) =>
      prev
        ? {
            ...prev,
            totalFare: baseFare,
            platformCommission: commission,
            courierEarnings: earnings,
            feeSnapshot: createZeroCommissionFeeSnapshot({
              orderId: prev.id,
              serviceType: prev.canonicalServiceType || mapLegacyServiceTypeToCanonical(prev.serviceType),
              grossAmount: baseFare,
            }),
            bargainStatus: 'declined',
          }
        : null
    );
  };

  const cancelRide = (reason?: string) => {
    if (!currentRide) return;

    // Race condition check: tamamlanmış görev iptal edilemez
    if (currentRide.status === 'completed' || currentRide.status === 'partially_completed') {
      showNotification({
        title: 'İptal İşlemi Reddedildi',
        message: 'Görev zaten tamamlanmış durumdadır; tamamlanan sipariş iptal edilemez.',
        type: 'error',
        isCritical: true,
      });
      return;
    }

    if (currentRide.status === 'in_progress') {
      showNotification({
        title: 'Seyir Halinde İptal Kısıtı',
        message: 'Yolculuk/Teslimat seyrindeyken doğrudan müşteri iptali yapılamaz. Operasyon desteği gereklidir.',
        type: 'warning',
        isCritical: true,
      });
      return;
    }

    const targetCourierId = currentRide.courierId;
    if (targetCourierId) {
      // 4. Kural: İptal sonrası sürücü durumunu koşulsuz available yapma.
      // Aktif işlerini, kapasitesini, çevrimiçi tercihini ve yetki durumunu kontrol et.
      setCouriers((prev) =>
        prev.map((c) => {
          if (c.id !== targetCourierId) return c;

          if (!c.isOnline) {
            return { ...c, status: 'offline' };
          }
          if (!c.isVerified) {
            return { ...c, status: 'offline' };
          }

          // Diğer aktif işlerini kontrol et (başka sipariş var mı?)
          const hasOtherActiveTasks = allRides.some(
            (r) => r.courierId === c.id && (r.status === 'in_progress' || r.status === 'accepted') && r.id !== currentRide.id
          );
          if (hasOtherActiveTasks) {
            return { ...c, status: 'busy' };
          }

          return { ...c, status: 'available' };
        })
      );
    }

    // 1. Kural: Onayım olmadan eklenen 25 TL iptal bedelini ve 20 TL sürücü payını DEVRE DIŞI BIRAK!
    // Politika taslağı (prop-cancel-fee-25) kullanıcı/yönetici tarafından ONAYLANMADAN kesinti yapılamaz.
    const isCancelPolicyApproved = pendingPolicyProposals.some(
      (p) => p.id === 'prop-cancel-fee-25' && p.status === 'approved'
    );

    let feeApplied = 0;
    let courierCompensation = 0;

    if (isCancelPolicyApproved && (currentRide.status === 'accepted' || (currentRide.status as string) === 'in_progress')) {
      feeApplied = 25;
      courierCompensation = 20;

      // Müşteri cüzdanından kes
      setCustomerWalletBalance((prev) => Math.max(0, prev - feeApplied));
      const penaltyTx: WalletTransaction = {
        id: `tx-cancel-${Date.now()}`,
        type: 'ride_payment',
        amount: feeApplied,
        description: `İptal Tazminatı Kesintisi (Onaylı Politika: 25 ₺)`,
        date: new Date().toLocaleString('tr-TR'),
      };
      setCustomerTransactions((prev) => [penaltyTx, ...prev]);

      // Sürücüye telafi payı aktar
      if (currentRide.courierId) {
        setCouriers((prev) =>
          prev.map((c) =>
            c.id === currentRide.courierId
              ? {
                  ...c,
                  wallet: {
                    ...c.wallet,
                    dailyEarnings: c.wallet.dailyEarnings + courierCompensation,
                    pendingPayout: c.wallet.pendingPayout + courierCompensation,
                  },
                }
              : c
          )
        );
      }

      // Mutabakat kütüğüne yaz
      const cancelRec: TransactionReconciliationRecord = {
        id: `REC-CNC-${Date.now().toString(36).toUpperCase()}`,
        rideId: currentRide.id,
        timestamp: new Date().toLocaleString('tr-TR'),
        paymentMethod: currentRide.paymentMethod || 'wallet',
        amountCollected: feeApplied,
        collectionChannel: 'simulation_wallet',
        courierEarnings: courierCompensation,
        platformCommission: feeApplied - courierCompensation,
        cancellationFeeApplied: feeApplied,
        appliedRule: {
          ruleCode: 'KURAL-IPTAL-TAZMINAT-ONAYLI',
          description: 'Kullanıcı tarafından onaylanmış 25 ₺ iptal cezası (20 ₺ kurye, 5 ₺ platform)',
          isApprovedByUser: true,
        },
        reconciliationStatus: 'balanced',
        idempotencyKey: `idem_cancel_${currentRide.id}`,
        isIdempotentVerified: true,
        notes: 'Politika onaylı olduğu için iptal tazminatı deftere işlendi.',
      };
      setReconciliationRecords((prev) => [cancelRec, ...prev]);

      recordAuditLog({
        actionType: 'UPDATE',
        screenName: 'Yolculuk / İptal Masası',
        recordId: currentRide.id,
        previousValue: currentRide.status,
        newValue: `İptal Edildi (${feeApplied} ₺ Onaylı İptal Tazminatı Uygulandı)`,
        justification: reason || 'Kullanıcı tarafından onaylanmış politika yürürlüğe konularak iptal tazminatı tahsil edildi.',
      });

      showNotification({
        title: 'Talebiniz İptal Edildi (Tazminat Kesildi)',
        message: `Sürücü yola çıktığı için onaylı politika gereği ${feeApplied} ₺ iptal tazminatı uygulandı.`,
        type: 'warning',
      });
    } else {
      recordAuditLog({
        actionType: 'UPDATE',
        screenName: 'Yolculuk / İptal Masası',
        recordId: currentRide.id,
        previousValue: currentRide.status,
        newValue: 'İptal Edildi (0 TL Masrafsız - 25 TL Cezai Politika Onaysız Olduğu İçin Uygulanmadı)',
        justification: reason || 'Kullanıcı onaysız 25 TL iptal kuralı devre dışı tutularak cezasız iptal uygulandı.',
      });

      showNotification({
        title: 'Talebiniz İptal Edildi',
        message: 'Talebiniz 0 ₺ masrafsız olarak iptal edildi. (Not: 25 ₺ iptal cezası kuralı kullanıcı onayı olmadığı için yürürlükte DEĞİLDİR).',
        type: 'info',
      });
    }

    const cancelledOrder: RideOrder = {
      ...currentRide,
      status: 'cancelled',
      completedAt: new Date().toISOString(),
      cancellationReason: reason || (feeApplied > 0 ? 'Onaylı iptal tazminatı ile sonlandırıldı.' : 'Masrafsız iptal edildi.'),
    };
    setAllRides((prev) => [cancelledOrder, ...prev.filter((r) => r.id !== cancelledOrder.id)]);

    setCurrentRide(null);
  };

  // Courier Actions
  const acceptRide = () => {
    if (!currentRide) return;
    const assignedCourierObj =
      couriers.find((c) => c.id === (currentRide.courierId || activeCourierId)) || activeCourier;
    const nextVersion = (currentRide.assignmentVersion || 1) + 1;
    const updated: RideOrder = {
      ...currentRide,
      courierId: assignedCourierObj.id,
      courierName: assignedCourierObj.name,
      assignedCourierId: assignedCourierObj.id,
      assignedVehicleId: assignedCourierObj.plate,
      assignmentVersion: nextVersion,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      version: (currentRide.version || 1) + 1,
    };
    setCurrentRide(updated);
    setAllRides((prev) => [updated, ...prev.filter((r) => r.id !== updated.id)]);
    setActiveCourierId(assignedCourierObj.id);

    setCouriers((prev) =>
      prev.map((c) => (c.id === assignedCourierObj.id ? { ...c, status: 'busy' } : c))
    );
  };

  const rejectRide = () => {
    if (!currentRide) return;
    const otherAvailable = couriers.filter(
      (c) => c.isOnline && c.status === 'available' && c.id !== currentRide.courierId
    );
    if (otherAvailable.length > 0) {
      const nextCourier = otherAvailable[0];
      const nextVersion = (currentRide.assignmentVersion || 1) + 1;
      const updated: RideOrder = {
        ...currentRide,
        status: 'offered',
        courierId: nextCourier.id,
        courierName: nextCourier.name,
        assignedCourierId: nextCourier.id,
        assignedVehicleId: nextCourier.plate,
        assignmentVersion: nextVersion,
        version: (currentRide.version || 1) + 1,
      };
      setCurrentRide(updated);
      setAllRides((prev) => [updated, ...prev.filter((r) => r.id !== updated.id)]);
      setActiveCourierId(nextCourier.id);
    } else {
      const updated: RideOrder = {
        ...currentRide,
        status: 'searching',
        courierId: undefined,
        courierName: undefined,
        assignedCourierId: undefined,
        assignedVehicleId: undefined,
        assignmentVersion: (currentRide.assignmentVersion || 1) + 1,
        version: (currentRide.version || 1) + 1,
      };
      setCurrentRide(updated);
      setAllRides((prev) => [updated, ...prev.filter((r) => r.id !== updated.id)]);
    }
  };

  const arriveAtPickup = () => {
    if (!currentRide) return;
    if (currentRide.status !== 'accepted') {
      showNotification({
        title: 'Geçersiz Durum Geçişi',
        message: 'Alış noktasına varış yalnızca kabul edilmiş (accepted) görevlerde işaretlenebilir.',
        type: 'error',
      });
      return;
    }
    const updated: RideOrder = {
      ...currentRide,
      status: 'arrived',
      version: (currentRide.version || 1) + 1,
    };
    setCurrentRide(updated);
    setAllRides((prev) => [updated, ...prev.filter((r) => r.id !== updated.id)]);
  };

  const startTrip = (enteredCode: string): boolean => {
    const check = verifyTripPinGuard(currentRide, enteredCode, currentRide?.courierId);
    if (!check.allowed || !currentRide) {
      showNotification({
        title: 'PIN Doğrulama Reddedildi',
        message: check.message || 'Geçersiz PIN kodu.',
        type: 'error',
        isCritical: true,
      });
      recordAuditLog({
        actionType: 'REJECT',
        screenName: 'Kurye Görev Terminali (PIN Kontrolü)',
        recordId: currentRide?.id || 'UNKNOWN',
        previousValue: currentRide?.status || 'none',
        newValue: 'PIN_REJECTED',
        justification: `Başarısız PIN doğrulama denemesi (${check.code || 'INVALID_PIN'}).`,
      });
      return false;
    }

    const verifiedAt = new Date().toISOString();
    const updated: RideOrder = {
      ...currentRide,
      status: 'in_progress',
      verificationStatus: 'verified',
      verifiedAt,
      pinUsed: true,
      version: (currentRide.version || 1) + 1,
    };

    setCurrentRide(updated);
    setAllRides((prev) => [updated, ...prev.filter((r) => r.id !== updated.id)]);
    recordAuditLog({
      actionType: 'APPROVE',
      screenName: 'Kurye Görev Terminali (PIN Kontrolü)',
      recordId: updated.id,
      previousValue: 'arrived',
      newValue: 'in_progress',
      justification: `Yolcu/Teslimat biniş PIN kodu doğrulandı (${verifiedAt}). Sefer başlatıldı.`,
    });
    return true;
  };

  const completeTrip = (deliveryPhotoUrl?: string): boolean => {
    if (!currentRide) return false;

    if (completedTripLocksRef.current.has(currentRide.id)) {
      showNotification({
        title: 'Mükerrer İşlem Engellendi',
        message: `Bu sefer (${currentRide.id}) için tahsilat ve mutabakat işlemi zaten tamamlanmıştır.`,
        type: 'warning',
      });
      return false;
    }

    const guard = verifyTripCompletionGuard(currentRide, currentRide.courierId, reconciliationRecords);
    if (!guard.allowed) {
      showNotification({
        title: 'Tamamlama / Tahsilat Engellendi',
        message: guard.message || 'Sefer tamamlama koşulları sağlanmadı.',
        type: 'error',
        isCritical: true,
      });
      recordAuditLog({
        actionType: 'BLOCK',
        screenName: 'Sefer Tamamlama & Hakediş Motoru',
        recordId: currentRide.id,
        previousValue: currentRide.status,
        newValue: guard.code || 'COMPLETION_BLOCKED',
        justification: guard.message || 'Doğrulanmamış veya mükerrer tamamlama isteği reddedildi.',
      });
      return false;
    }

    // 5. Kural: Çoklu teslimatı paket ve durak bazında incele.
    if (currentRide.packagesList && currentRide.packagesList.length > 0) {
      const unfinishedPackages = currentRide.packagesList.filter(
        (p) => p.status === 'pending' || p.status === 'in_transit'
      );
      if (unfinishedPackages.length > 0) {
        showNotification({
          title: 'Teslimat Kapatılamaz (Sonuçlandırılmamış Paketler)',
          message: `Dağıtımı bekleyen/yolda olan ${unfinishedPackages.length} paket mevcut (${unfinishedPackages.map((p) => p.trackingCode).join(', ')}). Ana teslimatı tamamlamak için tüm paketleri sonuçlandırınız!`,
          type: 'error',
          isCritical: true,
        });
        return false;
      }
    }

    const idempotencyKey = `idem_${currentRide.id}_settlement`;
    completedTripLocksRef.current.add(currentRide.id);

    let finalRideStatus: RideStatus = 'completed';
    if (currentRide.packagesList && currentRide.packagesList.length > 0) {
      const anyFailedOrReturned = currentRide.packagesList.some(
        (p) => p.status === 'failed' || p.status === 'returned'
      );
      if (anyFailedOrReturned) {
        finalRideStatus = 'partially_completed';
      }
    }

    const method: PaymentMethod = currentRide.paymentMethod || selectedPaymentMethod || 'card';
    const financialPostingId = `REC-${currentRide.id}`;

    const completed: RideOrder = {
      ...currentRide,
      status: finalRideStatus,
      completedAt: new Date().toISOString(),
      paymentMethod: method,
      isSettled: true,
      settledAt: new Date().toLocaleString('tr-TR'),
      settlementId: financialPostingId,
      financialPostingId,
      settlementRuleCode: 'KURAL-F01-ONAYLI',
      deliveryPhotoUrl:
        deliveryPhotoUrl ||
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      version: (currentRide.version || 1) + 1,
    };

    setAllRides((prev) => [completed, ...prev.filter((r) => r.id !== completed.id)]);
    setCurrentRide(completed);

    // 4. Sürücü durumunu güncelle: aktif başka görevi yoksa ve çevrimiçi/yetkili ise available yap
    setCouriers((prev) =>
      prev.map((c) => {
        if (c.id === completed.courierId) {
          const isOnline = c.isOnline;
          const isVerified = c.isVerified;
          return {
            ...c,
            status: isOnline && isVerified ? 'available' : 'offline',
            totalTrips: c.totalTrips + 1,
            wallet: {
              dailyEarnings: c.wallet.dailyEarnings + completed.courierEarnings,
              weeklyEarnings: c.wallet.weeklyEarnings + completed.courierEarnings,
              pendingPayout: c.wallet.pendingPayout + completed.courierEarnings,
            },
          };
        }
        return c;
      })
    );

    // 2. Kural: Müşteri cüzdanından düşümü ödeme yöntemine göre incele.
    // Nakit, kart ve cüzdan senaryolarını ayır.
    let collectionChannel: 'simulation_wallet' | 'simulation_card_pos' | 'direct_cash' = 'simulation_card_pos';
    let settlementNote = '';

    if (method === 'wallet') {
      // YALNIZCA CÜZDAN SEÇİLDİĞİNDE cüzdandan düşüm yapılır (İstemci simülasyon bakiyesi)
      collectionChannel = 'simulation_wallet';
      settlementNote = 'İstemci simülasyon cüzdan bakiyesinden tahsil edildi.';
      setCustomerWalletBalance((prev) => Math.max(0, Math.round((prev - completed.totalFare) * 10) / 10));
      const newTx: WalletTransaction = {
        id: `tx-wallet-${Date.now()}`,
        type: 'ride_payment',
        amount: -completed.totalFare,
        description: `[Cüzdan Düşümü] ${completed.serviceType === 'motosiklet' ? 'Yolculuk' : 'Teslimat'} Bedeli (${completed.id})`,
        date: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      };
      setCustomerTransactions((prev) => [newTx, ...prev]);
    } else if (method === 'card') {
      // KART İLE ÖDEME: Cüzdana dokunulmaz! 3D Secure / Sanal POS provizyon simülasyonu
      collectionChannel = 'simulation_card_pos';
      settlementNote = '3D Secure Kredi/Banka Kartı Sanal POS Provizyonu (Simülasyon) — Cüzdan bakiyesine dokunulmadı.';
      const newTx: WalletTransaction = {
        id: `tx-card-${Date.now()}`,
        type: 'ride_payment',
        amount: completed.totalFare,
        description: `[Kart Provizyonu - Sanal POS] ${completed.serviceType === 'motosiklet' ? 'Yolculuk' : 'Teslimat'} (${completed.id})`,
        date: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      };
      setCustomerTransactions((prev) => [newTx, ...prev]);
    } else if (method === 'cash') {
      // NAKİT İLE ÖDEME: Müşteri sürücüye elden verdi. Cüzdana dokunulmaz, sürücü kasa zimmetine eklenir!
      collectionChannel = 'direct_cash';
      settlementNote = 'Elden nakit tahsilat — Sürücünün eldeki nakit kasa zimmetine aktarıldı.';
      setCourierCashInHand((prev) => prev + completed.totalFare);
    }

    // 3. Kural: İşlem Kimliği üzerinden Finansal Uzlaşma (Reconciliation)
    const newReconciliation: TransactionReconciliationRecord = {
      id: `REC-${completed.id}`,
      rideId: completed.id,
      timestamp: new Date().toLocaleString('tr-TR'),
      paymentMethod: method,
      amountCollected: completed.totalFare,
      collectionChannel,
      courierEarnings: completed.courierEarnings,
      platformCommission: completed.platformCommission,
      cancellationFeeApplied: 0,
      appliedRule: {
        ruleCode: 'KURAL-F01-ONAYLI',
        description: 'Onaylı Sefer Tarifesi & Hakediş Modeli (Kullanıcı Onaylı)',
        isApprovedByUser: true,
      },
      reconciliationStatus: 'balanced',
      idempotencyKey,
      isIdempotentVerified: true,
      notes: settlementNote,
    };
    setReconciliationRecords((prev) =>
      prev.some((r) => r.idempotencyKey === idempotencyKey) ? prev : [newReconciliation, ...prev]
    );

    // A20 & B6: Çift Taraflı Muhasebe Defteri (Double-Entry General Ledger) Kayıtları (%0 Komisyon — %100 Sürücü/Kurye Hakedişi)
    recordLedgerEntry({
      transactionRefId: `REC-${completed.id}-EARNINGS`,
      accountDebit: method === 'wallet' ? 'CUSTOMER_WALLET_LIABILITY' : method === 'cash' ? 'COURIER_CASH_ZIMMET' : 'VIRTUAL_POS_RECEIVABLE',
      accountCredit: `COURIER_PAYABLE_${completed.courierId || 'POOL'}`,
      amount: roundCurrency(completed.courierEarnings),
      description: `Sefer Hakediş Tahakkuku (${completed.id}) - %0 Komisyon / %100 Sürücü-Kurye Payı`,
    });

    // ==========================================
    // SADAKAT, KAMPANYA & DAVET KESİNLEŞTİRMELERİ
    // ==========================================
    let pointsAwarded = 0;
    if (loyaltySettings.isProgramActive && completed.totalFare > 0) {
      const tierConfig = loyaltyTiers.find((t) => t.tier === loyaltyAccount.currentTier) || loyaltyTiers[0];
      const basePoints = Math.floor(completed.totalFare * loyaltySettings.earnRatePerLira);
      pointsAwarded = Math.round(basePoints * (tierConfig?.pointMultiplier || 1.0));

      if (pointsAwarded > 0) {
        const newBal = loyaltyAccount.availablePoints + pointsAwarded;
        const newLifetime = loyaltyAccount.lifetimeEarnedPoints + pointsAwarded;

        let nextTier = loyaltyAccount.currentTier;
        if (newLifetime >= loyaltySettings.goldThresholdPoints) {
          nextTier = 'gold';
        } else if (newLifetime >= loyaltySettings.silverThresholdPoints) {
          nextTier = 'silver';
        }

        const tierUpgraded = nextTier !== loyaltyAccount.currentTier;

        setLoyaltyAccount((prev) => ({
          ...prev,
          availablePoints: newBal,
          lifetimeEarnedPoints: newLifetime,
          currentTier: nextTier,
        }));

        const newLpTx: LoyaltyTransaction = {
          id: `tx-lp-${Date.now()}`,
          userId: loyaltyAccount.userId,
          userType: 'customer',
          type: 'earn',
          points: pointsAwarded,
          equivalentLira: Math.round(pointsAwarded * loyaltySettings.pointRedeemRateLira * 10) / 10,
          rideId: completed.id,
          description: `${completed.serviceType === 'motosiklet' ? 'Yolculuk' : 'Teslimat'} Puanı (${tierConfig.name} - ${tierConfig.pointMultiplier}x)`,
          timestamp: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
          balanceAfter: newBal,
          idempotencyKey: `idem_lp_${completed.id}`,
        };
        setLoyaltyTransactions((prev) => [newLpTx, ...prev]);

        if (tierUpgraded) {
          showNotification({
            title: 'Tebrikler! Üyelik Seviyeniz Yükseldi',
            message: `Artık ${nextTier === 'gold' ? 'Altın VIP' : 'Gümüş'} üyesiniz! Özel indirim ve öncelikli kurye avantajlarınız aktif edildi.`,
            type: 'success',
            durationMs: 6000,
          });
        }
      }
    }

    if (appliedPointsCount > 0) {
      const spendBal = Math.max(0, loyaltyAccount.availablePoints - appliedPointsCount);
      setLoyaltyAccount((prev) => ({
        ...prev,
        availablePoints: spendBal,
        lifetimeSpentPoints: prev.lifetimeSpentPoints + appliedPointsCount,
      }));

      const spendTx: LoyaltyTransaction = {
        id: `tx-spend-${Date.now()}`,
        userId: loyaltyAccount.userId,
        userType: 'customer',
        type: 'spend',
        points: -appliedPointsCount,
        equivalentLira: -appliedPointsDiscount,
        rideId: completed.id,
        description: `Sefer Ödemesinde Puan İndirimi Kullanımı (${completed.id})`,
        timestamp: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
        balanceAfter: spendBal,
        idempotencyKey: `idem_spend_${completed.id}`,
      };
      setLoyaltyTransactions((prev) => [spendTx, ...prev]);
      setAppliedPointsDiscount(0);
      setAppliedPointsCount(0);
    }

    if (activeCoupon) {
      const discountGiven = completed.couponDiscountAmount || 0;
      const redRecord: CouponRedemptionRecord = {
        id: `red-${Date.now()}`,
        campaignId: activeCoupon.id,
        campaignCode: activeCoupon.code,
        userId: loyaltyAccount.userId,
        userType: 'customer',
        userName: loyaltyAccount.userName,
        rideId: completed.id,
        orderTotalFare: completed.originalFare || completed.totalFare,
        discountAmount: discountGiven,
        finalFareAfterDiscount: completed.totalFare,
        timestamp: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
        idempotencyKey: `idem_coupon_${completed.id}_${activeCoupon.code}`,
      };
      setCouponRedemptions((prev) => [redRecord, ...prev]);

      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === activeCoupon.id) {
            const newUsage = c.currentUsageCount + 1;
            const newSpent = c.usedBudgetLira + discountGiven;
            const isCompleted = newSpent >= c.totalBudgetLira || newUsage >= c.totalUsageLimit;
            return {
              ...c,
              currentUsageCount: newUsage,
              usedBudgetLira: newSpent,
              status: isCompleted ? 'completed' : c.status,
            };
          }
          return c;
        })
      );
      setActiveCoupon(null);
    }

    setReferralRecords((prev) =>
      prev.map((rec) => {
        if (
          rec.status === 'verified' &&
          (rec.referredId === loyaltyAccount.userId || rec.referredContact.includes('505 677'))
        ) {
          setCustomerWalletBalance((curr) => curr + rec.rewardAmountReferrer);
          return {
            ...rec,
            status: 'rewarded',
            qualifiedAt: new Date().toLocaleString('tr-TR'),
            rewardedAt: new Date().toLocaleString('tr-TR'),
            qualifyingActionDescription: `İlk sefer tamamlandı (${completed.id}). Davet eden ve edilen ödülleri aktarıldı.`,
          };
        }
        return rec;
      })
    );

    setDriverQuests((prev) =>
      prev.map((q) => {
        if (q.isActive && !q.isClaimed) {
          const newCompleted = (q.currentCompletedTrips || 0) + 1;
          return {
            ...q,
            currentCompletedTrips: newCompleted,
          };
        }
        return q;
      })
    );

    if (completed.serviceType === 'isletme_siparis') {
      setMerchantProfiles((prev) =>
        prev.map((m) => {
          const newCount = m.monthlyOrdersCount + 1;
          let tier = m.currentTier;
          let discount = m.commissionDiscountPercent;
          if (newCount >= 50) {
            tier = 'enterprise';
            discount = 25;
          } else if (newCount >= 20) {
            tier = 'growth';
            discount = 15;
          }
          return {
            ...m,
            monthlyOrdersCount: newCount,
            currentTier: tier,
            commissionDiscountPercent: discount,
          };
        })
      );
    }

    showNotification({
      title: finalRideStatus === 'partially_completed' ? 'Kısmi Teslimat Tamamlandı' : 'Görev Başarıyla Tamamlandı',
      message: `${completed.serviceType === 'motosiklet' ? 'Yolculuk' : 'Teslimat'} mutabakatı yapıldı. Tahsilat: ${completed.totalFare} ₺ [${method.toUpperCase()}]. Sürücü Hakedişi: ${completed.courierEarnings} ₺.`,
      type: 'success',
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }
    return true;
  };

  const rateCompletedRide = (rating: number, review?: string) => {
    if (!currentRide) return;
    setAllRides((prev) =>
      prev.map((r) => (r.id === currentRide.id ? { ...r, rating, review } : r))
    );
    setCurrentRide(null);
  };

  const dismissCompletedRide = () => {
    setCurrentRide(null);
  };

  const decidePolicyProposal = (id: string, decision: 'approved' | 'rejected', notes?: string) => {
    setPendingPolicyProposals((prev) =>
      prev.map((prop) => {
        if (prop.id !== id) return prop;
        return {
          ...prop,
          status: decision,
          warningNote:
            decision === 'approved'
              ? `Yönetici/Kullanıcı tarafından ${new Date().toLocaleString('tr-TR')} tarihinde ONAYLANDI. ${notes || ''}`
              : `Yönetici/Kullanıcı tarafından ${new Date().toLocaleString('tr-TR')} tarihinde REDDEDİLDİ. ${notes || ''}`,
        };
      })
    );

    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Finansal Politika Masası',
      recordId: id,
      previousValue: 'pending_approval',
      newValue: decision === 'approved' ? 'Politika Onaylandı' : 'Politika Reddedildi',
      justification: notes || (decision === 'approved' ? 'Açık yönetici onayı ile kabul edildi.' : 'Politika teklifi reddedildi.'),
    });

    showNotification({
      title: decision === 'approved' ? 'Politika Onaylandı' : 'Politika Reddedildi',
      message: `${id} kodlu politika önerisi ${decision === 'approved' ? 'onaylandı ve yürürlüğe alındı' : 'reddedildi ve arşivlendi'}.`,
      type: decision === 'approved' ? 'success' : 'info',
    });
  };

  const refundUnapprovedRecord = (recordId: string) => {
    const existingRefund = customerTransactions.some((tx) => tx.id === `tx-refund-${recordId}`);
    if (existingRefund) {
      showNotification({
        title: 'Mükerrer İade Engellendi',
        message: `Bu işlem (${recordId}) için zaten telafi iadesi yapılmıştır.`,
        type: 'warning',
      });
      return;
    }

    const targetTx = customerTransactions.find((tx) => tx.id === recordId);
    const refundAmount = targetTx?.amount || 25;

    // Cüzdan bakiyesini iade et
    setCustomerWalletBalance((prev) => prev + refundAmount);

    // Düzeltme hareketini ekle
    const refundTx: WalletTransaction = {
      id: `tx-refund-${recordId}`,
      type: 'topup',
      amount: refundAmount,
      description: `Mali Denetim Düzeltmesi: ${recordId} Onaysız Kesinti İadesi (Hesaba +${refundAmount} ₺)`,
      date: new Date().toLocaleString('tr-TR'),
    };
    setCustomerTransactions((prev) => [refundTx, ...prev]);

    // Uzlaşma kütüğüne düzeltme kaydı ekle
    const refundRec: TransactionReconciliationRecord = {
      id: `REC-REFUND-${recordId}`,
      rideId: recordId,
      timestamp: new Date().toLocaleString('tr-TR'),
      paymentMethod: 'wallet',
      amountCollected: 0,
      collectionChannel: 'simulation_wallet',
      courierEarnings: 0,
      platformCommission: -refundAmount,
      cancellationFeeApplied: 0,
      appliedRule: {
        ruleCode: 'KURAL-DENETIM-IADE-ONAYLI',
        description: `Onaysız ${recordId} kesintisi için ${refundAmount} ₺ telafi iadesi mutabakatı`,
        isApprovedByUser: true,
      },
      reconciliationStatus: 'balanced',
      idempotencyKey: `idem_refund_${recordId}`,
      isIdempotentVerified: true,
      notes: 'Mali denetim masası tarafından onaylanarak müşteriye iade yapıldı.',
    };
    setReconciliationRecords((prev) => [refundRec, ...prev]);

    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Finansal Uzlaşma & Denetim Masası',
      recordId: recordId,
      previousValue: `${refundAmount} ₺ onaysız kesinti`,
      newValue: `${refundAmount} ₺ Müşteriye İade Edildi & Defter Mutabakatı Sağlandı`,
      justification: 'Kullanıcı onayı bulunmayan geçmiş kesinti denetçi tarafından tespit edilip hesaba iade edildi.',
    });

    showNotification({
      title: 'İade ve Düzeltme Başarılı',
      message: `Geçmiş ${recordId} nolu onaysız kesinti için ${refundAmount} ₺ tutar müşteri cüzdanına iade edildi.`,
      type: 'success',
    });
  };

  const toggleCourierOnline = (courierId: string) => {
    setCouriers((prev) =>
      prev.map((c) =>
        c.id === courierId
          ? {
              ...c,
              isOnline: !c.isOnline,
              status: !c.isOnline ? 'available' : 'offline',
            }
          : c
      )
    );
  };

  const approveCourierDocument = (courierId: string, docKey: keyof Courier['documents']) => {
    setCouriers((prev) =>
      prev.map((c) => {
        if (c.id === courierId) {
          const updatedDocs = { ...c.documents, [docKey]: true };
          const allApproved = Object.values(updatedDocs).every(Boolean);
          return {
            ...c,
            documents: updatedDocs,
            isVerified: allApproved,
          };
        }
        return c;
      })
    );
  };

  const toggleCourierVerification = (courierId: string) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === courierId ? { ...c, isVerified: !c.isVerified } : c))
    );
  };

  const updateTariffs = (newTariffs: Partial<TariffSettings>) => {
    setTariffs((prev) => ({ ...prev, ...newTariffs }));
  };

  const adminAddSurge = (multiplier: number) => {
    setTariffs((prev) => ({ ...prev, surgeMultiplier: multiplier }));
  };

  const resolveComplaint = (id: string, issueRefund: boolean) => {
    setComplaints((prev) =>
      prev.map((cmp) =>
        cmp.id === id ? { ...cmp, status: 'resolved', refundIssued: issueRefund } : cmp
      )
    );
  };

  const approveAllPendingPayouts = () => {
    setCouriers((prev) =>
      prev.map((c) => ({
        ...c,
        wallet: { ...c.wallet, pendingPayout: 0 },
      }))
    );
    showNotification({
      title: 'Hakedişler Onaylandı',
      message: 'Tüm kurye hakedişleri onaylandı ve banka transfer talimatı oluşturuldu.',
      type: 'success',
    });
  };

  // ============================================================================
  // 9. KURUMSAL İŞLETME & ALT KULLANICILAR (BUSINESS SUB-USERS & ACL)
  // ============================================================================
  const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>(INITIAL_BUSINESS_ACCOUNTS);
  const [activeBusinessAccountId, setActiveBusinessAccountId] = useState<string>('BIZ-01');
  const [activeBusinessSubUserId, setActiveBusinessSubUserId] = useState<string | null>('SUB-USR-01');

  const activeBusinessAccount = businessAccounts.find((b) => b.id === activeBusinessAccountId) || businessAccounts[0];
  const activeBusinessSubUser = activeBusinessAccount?.subUsers.find((u) => u.id === activeBusinessSubUserId) || null;

  const setActiveBusinessAccount = (bizId: string) => {
    setActiveBusinessAccountId(bizId);
    const biz = businessAccounts.find((b) => b.id === bizId);
    if (biz && biz.subUsers.length > 0) {
      setActiveBusinessSubUserId(biz.subUsers[0].id);
    } else {
      setActiveBusinessSubUserId(null);
    }
  };

  const addBusinessSubUser = (businessId: string, subUserData: Omit<BusinessSubUser, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    const newId = `SUB-USR-${Date.now().toString().slice(-4)}`;
    const newSubUser: BusinessSubUser = {
      ...subUserData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: 'Henüz giriş yapılmadı',
    };
    setBusinessAccounts((prev) =>
      prev.map((biz) => {
        if (biz.id === businessId) {
          return {
            ...biz,
            subUsers: [...biz.subUsers, newSubUser],
          };
        }
        return biz;
      })
    );
    showNotification({
      title: 'İşletme Alt Kullanıcısı Eklendi',
      message: `${newSubUser.name} (${newSubUser.role}) başarıyla tanımlandı ve ACL yetkileri atandı.`,
      type: 'success',
    });
  };

  const updateBusinessSubUser = (subUserId: string, updates: Partial<BusinessSubUser>) => {
    setBusinessAccounts((prev) =>
      prev.map((biz) => ({
        ...biz,
        subUsers: biz.subUsers.map((u) => (u.id === subUserId ? { ...u, ...updates } : u)),
      }))
    );
    showNotification({
      title: 'Alt Kullanıcı Güncellendi',
      message: 'Kullanıcı yetki ve profil bilgileri kaydedildi.',
      type: 'info',
    });
  };

  const deleteBusinessSubUser = (subUserId: string) => {
    setBusinessAccounts((prev) =>
      prev.map((biz) => ({
        ...biz,
        subUsers: biz.subUsers.filter((u) => u.id !== subUserId),
      }))
    );
    showNotification({
      title: 'Alt Kullanıcı Silindi',
      message: 'Kullanıcının sistem erişimi ve ACL yetkileri sonlandırıldı.',
      type: 'warning',
    });
  };

  // ============================================================================
  // 10. SERBEST KONUM & ROTA MOTORU (BÖLGE SINIRLAMASI YOK)
  // ============================================================================
  const [turkeyLocations] = useState<LocationPoint[]>(TURKEY_WIDE_LOCATIONS);

  const searchLocations = (query: string): LocationPoint[] => {
    if (!query || query.trim().length === 0) return turkeyLocations.slice(0, 8);
    const q = query.toLowerCase().trim();
    const filtered = turkeyLocations.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q)
    );
    if (filtered.length > 0) return filtered;
    // Özel arama yazıldıysa otomatik dinamik nokta üret!
    return [
      {
        name: query.trim(),
        address: `${query.trim()}, Türkiye (Özel Seçim Adres)`,
        lat: 41.0200 + (Math.random() * 0.04 - 0.02),
        lng: 29.0000 + (Math.random() * 0.04 - 0.02),
      },
      ...turkeyLocations.slice(0, 5),
    ];
  };

  const resolveLocationFromCoords = (lat: number, lng: number): LocationPoint => {
    let closest = turkeyLocations[0];
    let minDistance = 999999;
    for (const loc of turkeyLocations) {
      const dist = Math.hypot(loc.lat - lat, loc.lng - lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = loc;
      }
    }
    const name = minDistance < 0.025
      ? `${closest.name} Yakını`
      : `Harita Konumu (${lat.toFixed(4)}N, ${lng.toFixed(4)}E)`;
    const address = minDistance < 0.025
      ? `${closest.address}`
      : `Koordinat: ${lat.toFixed(4)}N, ${lng.toFixed(4)}E, Türkiye`;

    return {
      name,
      address,
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
    };
  };

  // ============================================================================
  // 11. SİPARİŞ & KURYE CRUD MOTORU (B16)
  // ============================================================================
  const createOrder = async (
    order: Partial<RideOrder>,
    idempotencyKey?: string
  ): Promise<{ success: boolean; orderId: string }> => {
    if (idempotencyKey) {
      if (idempotencyKeysRef.current.has(idempotencyKey)) {
        showNotification({
          title: 'Mükerrer İstek Engellendi',
          message: 'Bu işlem daha önce işlendi (Idempotency Key koruması).',
          type: 'warning',
        });
        return { success: false, orderId: '' };
      }
      idempotencyKeysRef.current.add(idempotencyKey);
    }

    const orderId = order.id || generateSecureUUID('order');
    const grossFare = order.totalFare || 120;
    const canonicalService = mapLegacyServiceTypeToCanonical(order.serviceType || 'kurye');
    const newOrder: RideOrder = {
      id: orderId,
      serviceType: order.serviceType || 'kurye',
      canonicalServiceType: canonicalService,
      customerName: order.customerName || 'Müşteri',
      customerPhone: order.customerPhone || '+90 555 000 00 00',
      pickup: order.pickup || TURKEY_WIDE_LOCATIONS[0],
      dropoff: order.dropoff || TURKEY_WIDE_LOCATIONS[1],
      distanceKm: order.distanceKm || 5.2,
      durationMin: order.durationMin || 18,
      baseFare: order.baseFare || 65,
      kmFare: order.kmFare || 28,
      surgeMultiplier: order.surgeMultiplier || 1.0,
      totalFare: grossFare,
      platformCommission: 0,
      courierEarnings: grossFare,
      serviceFeePercent: 0,
      serviceFeeFixed: 0,
      feeSnapshot: createZeroCommissionFeeSnapshot({
        orderId,
        serviceType: canonicalService,
        grossAmount: grossFare,
      }),
      status: order.status || 'searching',
      boardingCode: order.boardingCode || String(Math.floor(1000 + Math.random() * 9000)),
      createdAt: new Date().toISOString(),
      ...order,
    };

    setAllRides((prev) => [newOrder, ...prev]);
    setCurrentRide(newOrder);

    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'Sipariş Motoru',
      recordId: orderId,
      previousValue: 'Yok',
      newValue: `Sipariş #${orderId} (${newOrder.serviceType}) oluşturuldu`,
      justification: 'Kullanıcı/İşletme yeni taşıma talebi başlattı.',
    });

    return { success: true, orderId };
  };

  /**
   * [B17] Sipariş Durum Makinesi (State Machine) Korumalı Durum Güncelleyici (`updateOrderStatus`)
   * Geçersiz durum geçişlerini (`completed -> searching` vb.) `isValidOrderTransition` ile reddeder.
   */
  const updateOrderStatus = (
    orderId: string,
    status: RideStatus
  ): { success: boolean; error?: string } => {
    const targetOrder =
      allRides.find((r) => r.id === orderId) ||
      (currentRide && currentRide.id === orderId ? currentRide : undefined);

    if (targetOrder && !isValidOrderTransition(targetOrder.status, status)) {
      const errMsg = `Geçersiz durum geçişi engellendi: '${targetOrder.status}' -> '${status}' geçişine izin verilmiyor.`;
      setError(errMsg);
      showNotification({
        title: 'Durum Makinesi Koruması (State Machine Guard)',
        message: errMsg,
        type: 'error',
        isCritical: true,
      });
      return { success: false, error: errMsg };
    }

    setAllRides((prev) =>
      prev.map((r) => (r.id === orderId ? { ...r, status, version: (r.version || 1) + 1 } : r))
    );
    if (currentRide && currentRide.id === orderId) {
      setCurrentRide((prev) => (prev ? { ...prev, status, version: (prev.version || 1) + 1 } : null));
    }

    recordAuditLog({
      actionType: 'UPDATE',
      screenName: 'Sipariş Durum Makinesi',
      recordId: orderId,
      previousValue: targetOrder?.status || 'searching',
      newValue: status,
      justification: `Sipariş durumu kurallı geçiş matrisine uygun olarak '${status}' statüsüne güncellendi.`,
    });

    return { success: true };
  };

  const assignCourierToOrder = (orderId: string, courierId: string) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) return;
    const acceptedAt = new Date().toISOString();
    setAllRides((prev) =>
      prev.map((r) =>
        r.id === orderId
          ? {
              ...r,
              courierId,
              courierName: courier.name,
              assignedCourierId: courierId,
              assignedVehicleId: courier.plate,
              assignmentVersion: (r.assignmentVersion || 1) + 1,
              status: 'accepted',
              acceptedAt,
              version: (r.version || 1) + 1,
            }
          : r
      )
    );
    if (currentRide && currentRide.id === orderId) {
      setCurrentRide((prev) =>
        prev
          ? {
              ...prev,
              courierId,
              courierName: courier.name,
              assignedCourierId: courierId,
              assignedVehicleId: courier.plate,
              assignmentVersion: (prev.assignmentVersion || 1) + 1,
              status: 'accepted',
              acceptedAt,
              version: (prev.version || 1) + 1,
            }
          : null
      );
    }
    setActiveCourierId(courierId);
    setCouriers((prev) =>
      prev.map((c) => (c.id === courierId ? { ...c, status: 'busy' } : c))
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const target = allRides.find((r) => r.id === orderId);
    if (target && !isValidOrderTransition(target.status, 'cancelled')) {
      showNotification({
        title: 'İptal Kısıtı',
        message: `'${target.status}' durumundaki sipariş doğrudan iptal edilemez.`,
        type: 'error',
      });
      return;
    }

    setAllRides((prev) =>
      prev.map((r) =>
        r.id === orderId
          ? { ...r, status: 'cancelled', cancellationReason: reason || 'Kullanıcı iptali', version: (r.version || 1) + 1 }
          : r
      )
    );
    if (currentRide && currentRide.id === orderId) {
      setCurrentRide(null);
    }
  };

  const updateCourier = (courierId: string, updates: Partial<Courier>) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === courierId ? { ...c, ...updates, version: (c.version || 1) + 1 } : c))
    );
  };

  /**
   * [Katman 2 & 3] Hibrit Express Sunucusu İle Anlık Durum Senkronizasyonu (`syncWithServer`)
   */
  const syncWithServer = async (): Promise<{ synced: boolean; outboxFlushed: number }> => {
    try {
      const flushRes = await api.flushOutbox();
      const syncRes = await api.syncStateToServer({
        orders: allRides,
        couriers,
        vaults: cashVaults,
        auditLogs,
        ledgerEntries,
      });
      if (syncRes.success) {
        setLastSyncedAt(new Date().toLocaleTimeString('tr-TR'));
      }
      return {
        synced: syncRes.success,
        outboxFlushed: flushRes.flushed,
      };
    } catch {
      return { synced: false, outboxFlushed: 0 };
    }
  };

  // Platform stats calculation (B6 Kuruş Hassasiyetli)
  const totalRevenue = roundCurrency(allRides.reduce((sum, r) => sum + r.totalFare, 0));
  const platformCommissionEarned = roundCurrency(allRides.reduce((sum, r) => sum + r.platformCommission, 0));
  const activeDriversOnline = couriers.filter((c) => c.isOnline).length;

  return (
    <PlatformContext.Provider
      value={{
        activeView,
        setActiveView,
        customerProfileMode,
        setCustomerProfileMode,
        tariffs,
        updateTariffs,
        couriers,
        activeCourier,
        setActiveCourierId,
        toggleCourierOnline,
        approveCourierDocument,
        toggleCourierVerification,
        toggleCourierPermission,
        setCourierEquipmentMode,
        currentRide,
        allRides,
        calculateFare,
        requestRide,
        cancelRide,
        reportRideIssue,
        reportEmergencyIncident,
        updateDeliveryPackageStatus,
        acceptBargainOffer,
        counterBargainOffer,
        declineBargainOffer,
        acceptRide,
        rejectRide,
        arriveAtPickup,
        startTrip,
        completeTrip,
        rateCompletedRide,
        dismissCompletedRide,
        chatMessages,
        sendChatMessage,
        helmetTtsActive,
        toggleHelmetTts,
        favoriteCourierIds,
        toggleFavoriteCourier,
        directBookCourier,
        directChats,
        sendDirectMessageToCourier,
        complaints,
        resolveComplaint,
        approveAllPendingPayouts,
        adminAddSurge,
        customerWalletBalance,
        topUpCustomerWallet,
        customerCards,
        addCustomerCard,
        deleteCustomerCard,
        setDefaultCustomerCard,
        customerTransactions,
        courierShift,
        startCourierShift,
        endCourierShift,
        courierCashInHand,
        courierPenalties,
        payCourierPenalty,
        dailyClosingStatus,
        closeDayAndSeal,
        // TFKS Values
        vehicleAssignments,
        assignVehicle,
        unassignVehicle,
        cashVaults,
        cashTransfers,
        createCashTransfer,
        approveCashTransfer,
        damageReports,
        addDamageReport,
        warehouseParts,
        adjustPartStock,
        serviceWorkOrders,
        createServiceWorkOrder,
        approveTestDriveAndCloseService,
        systemBlockages,
        unlockSystemBlockage,
        blockCourier,
        auditLogs,
        recordAuditLog,
        verifyAuditChain,
        ledgerEntries,
        recordLedgerEntry,
        verifyLedgerBalance,
        snapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        lastSyncedAt,
        syncWithServer,
        dailyClosingAudit,
        runDailyClosingCheck,
        // Ödeme Yöntemi & Senaryoları
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        // Finansal Uzlaşma ve Mutabakat
        reconciliationRecords,
        // Onay Bekleyen Finansal Politika Önerileri (Taslak)
        pendingPolicyProposals,
        decidePolicyProposal,
        // Onaysız Kural İle Üretilmiş Geçmiş İşlem Tespiti
        detectedUnapprovedRecords,
        refundUnapprovedRecord,
        // Apple Typography & Accessibility
        dynamicTypeScale,
        dynamicTypePreset,
        setDynamicTypeScale,
        setDynamicTypePreset: handleSetPreset,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        // Erişilebilir Bildirim & Duyuru Sistemi
        notificationQueue,
        activeNotification,
        notificationHistory,
        dismissNotification,
        clearNotificationHistory,
        showNotification,
        // Sadakat & Ödül Sistemi
        loyaltyAccount,
        loyaltyTiers,
        loyaltySettings,
        loyaltyTransactions,
        updateLoyaltySettings,
        redeemLoyaltyPoints,
        appliedPointsDiscount,
        appliedPointsCount,
        clearPointsDiscount,
        // Davet & Referans Sistemi
        referralPrograms,
        referralCodes,
        referralRecords,
        updateReferralProgramConfig,
        generateReferralCode,
        registerReferralUsage,
        reviewFlaggedReferral,
        // Kupon & Kampanya Motoru
        campaigns,
        activeCoupon,
        couponRedemptions,
        applyCouponCode,
        removeCouponCode,
        createCampaign,
        updateCampaignStatus,
        // Sürücü Teşvik & Görevleri
        driverQuests,
        claimDriverQuestBonus,
        createDriverQuest,
        // İşletme Sadakati
        merchantProfiles,
        updateMerchantTier,
        // Geri Kazanım & Hediye
        winBackOffers,
        giftCredits,
        sendGiftCredit,
        redeemGiftCredit,
        // Güvenlik & Suistimal Denetimi
        fraudAuditRecords,
        resolveFraudRecord,
        // Kurumsal Web Sitesi & Başvuru Funnel Masası
        driverApplications,
        merchantLeads,
        submitDriverApplication,
        submitMerchantLead,
        updateDriverApplicationStatus,
        updateMerchantLeadStatus,
        // Kurumsal İşletme & Alt Kullanıcılar (Business Sub-Users & ACL)
        businessAccounts,
        activeBusinessAccount,
        activeBusinessSubUser,
        setActiveBusinessAccount,
        setActiveBusinessSubUserId,
        addBusinessSubUser,
        updateBusinessSubUser,
        deleteBusinessSubUser,
        // Serbest Konum Motoru
        turkeyLocations,
        searchLocations,
        resolveLocationFromCoords,
        // Mimari, Yükleme & CRUD Motoru (B4, B16)
        isLoading,
        error,
        clearError,
        createOrder,
        updateOrderStatus,
        assignCourierToOrder,
        cancelOrder,
        updateCourier,
        platformStats: {
          totalRevenue,
          platformCommissionEarned,
          totalTripsCompleted: allRides.length,
          activeDriversOnline,
        },
      }}
    >
      {/* WCAG 2.2 Uyumlu Ekran Okuyucu Canlı Duyuru Bölgeleri */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {screenReaderAnnouncement?.type === 'polite' ? screenReaderAnnouncement.message : ''}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {screenReaderAnnouncement?.type === 'assertive' ? screenReaderAnnouncement.message : ''}
      </div>

      {/* Universal Apple Dynamic Island / Toast Notification (BÖLÜM C: Erişilebilirlik, Hover Pause, Stacked Deck & WCAG AA) */}
      {activeNotification && (
        <div
          role={activeNotification.isCritical || activeNotification.type === 'error' ? 'alert' : 'status'}
          aria-live={activeNotification.isCritical || activeNotification.type === 'error' ? 'assertive' : 'polite'}
          tabIndex={0}
          onMouseEnter={() => setIsNotificationHovered(true)}
          onMouseLeave={() => setIsNotificationHovered(false)}
          onFocus={() => setIsNotificationHovered(true)}
          onBlur={() => setIsNotificationHovered(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') dismissNotification(activeNotification.id);
          }}
          className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[9999] max-w-md w-[92%] sm:w-[380px] motion-reduce:transform-none motion-reduce:transition-none outline-none select-none transition-all duration-200"
        >
          {/* C6: Kuyruktaki bildirimler için görsel yığınlama (Stacked Deck - Max 5) */}
          {notificationQueue.length > 0 && (
            <div className="absolute -bottom-1.5 inset-x-3 h-4 bg-white/10 border border-white/10 rounded-[20px] -z-10 blur-[0.5px]" />
          )}

          <div
            className={`p-4 rounded-[24px] backdrop-blur-2xl border shadow-[0_16px_50px_rgba(0,0,0,0.7)] flex items-start gap-3.5 text-xs ${
              activeNotification.type === 'error'
                ? 'bg-[#1C1C1E]/95 border-[#FF453A]/50 text-white'
                : activeNotification.type === 'warning'
                ? 'bg-[#1C1C1E]/95 border-[#FF9F0A]/50 text-white'
                : activeNotification.type === 'success'
                ? 'bg-[#1C1C1E]/95 border-[#30D158]/50 text-white'
                : 'bg-[#1C1C1E]/95 border-white/[0.2] text-white'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                activeNotification.type === 'error'
                  ? 'bg-[#FF453A]/25 text-[#FF453A]'
                  : activeNotification.type === 'warning'
                  ? 'bg-[#FF9F0A]/25 text-[#FF9F0A]'
                  : activeNotification.type === 'success'
                  ? 'bg-[#30D158]/25 text-[#30D158]'
                  : 'bg-[#0A84FF]/25 text-[#0A84FF]'
              }`}
            >
              {activeNotification.type === 'error' && <AlertCircle className="w-4 h-4 stroke-[2.5]" />}
              {activeNotification.type === 'warning' && <AlertTriangle className="w-4 h-4 stroke-[2.5]" />}
              {activeNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />}
              {activeNotification.type === 'info' && <Info className="w-4 h-4 stroke-[2.5]" />}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-white tracking-tight">{activeNotification.title}</h4>
                {activeNotification.isCritical && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/25 text-red-200 border border-red-500/40 font-bold uppercase tracking-wider">
                    Kritik Bildirim
                  </span>
                )}
                {notificationQueue.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/15 text-white/90 border border-white/20 font-mono">
                    +{notificationQueue.length}/5 kuyrukta
                  </span>
                )}
              </div>
              <p className="text-[#E5E5EA] text-[11px] leading-relaxed mt-0.5 font-normal">{activeNotification.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissNotification(activeNotification.id)}
              className="p-1.5 rounded-full text-[#8E8E93] hover:text-white transition-colors focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Kapat (Esc)"
              aria-label="Bildirimi kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
};

