export type PlatformView = 'split' | 'customer' | 'business' | 'courier' | 'admin' | 'website';

export type UserProfileMode = 'individual' | 'business';

// ============================================================================
// A21: SERVICE TYPES WITH EXHAUSTIVE SWITCH PATTERN & AS CONST
// ============================================================================
export const SERVICE_TYPES = [
  'motosiklet', // 1. Beni Götür (Yolcu taşıma - MVP Dahil)
  'kurye', // 2. Paket Gönder (Tekil koli/evrak - MVP Dahil)
  'al_getir', // 3. Bir Şeyi Alıp Bana Getir (Öneri / Karar Bekleyen)
  'isletme_siparis', // 4. İşletme Çoklu Teslimat (MVP Dahil)
] as const;

export type ServiceType = typeof SERVICE_TYPES[number];

export function assertNever(x: never): never {
  throw new Error(`Beklenmeyen ServiceType veya case: ${JSON.stringify(x)}`);
}

// ============================================================================
// A1, A3, A4, A5, A6, A7, A18, A19: TYPE-SAFE BRANDED & CONSTRAINT TYPES
// ============================================================================
export type RatingScore = 0 | 1 | 2 | 3 | 4 | 5;
export type RatingNumber = number & { readonly __brand: 'RatingNumber' };

export function toRatingNumber(score: number): RatingNumber {
  const bounded = Math.max(0, Math.min(5, Math.round(score * 10) / 10));
  return bounded as RatingNumber;
}

export type PhoneNumber = string & { readonly __brand: 'PhoneNumber' };
export function toPhoneNumber(raw: string): PhoneNumber {
  // Strip non-digits and standardize
  const cleaned = raw.replace(/\s+/g, '');
  return cleaned as PhoneNumber;
}

export type ISODateString = string & { readonly __brand: 'ISODateString' };
export function toISODateString(d: Date | string | number = Date.now()): ISODateString {
  if (d instanceof Date) return d.toISOString() as ISODateString;
  if (typeof d === 'number') return new Date(d).toISOString() as ISODateString;
  return new Date(d).toISOString() as ISODateString;
}

export type Latitude = number & { readonly __brand: 'Latitude' };
export type Longitude = number & { readonly __brand: 'Longitude' };
export function toLatitude(lat: number): Latitude {
  const bounded = Math.max(-90, Math.min(90, lat));
  return bounded as Latitude;
}
export function toLongitude(lng: number): Longitude {
  const bounded = Math.max(-180, Math.min(180, lng));
  return bounded as Longitude;
}

export type PositiveNumber = number & { readonly __brand: 'PositiveNumber' };
export function toPositiveNumber(val: number): PositiveNumber {
  if (val <= 0) throw new Error(`Değer pozitif olmalı: ${val}`);
  return val as PositiveNumber;
}

export type NonNegativeNumber = number & { readonly __brand: 'NonNegativeNumber' };
export function toNonNegativeNumber(val: number): NonNegativeNumber {
  return Math.max(0, val) as NonNegativeNumber;
}

export type CardLastFour = string & { readonly __brand: 'CardLastFour' };
export function toCardLastFour(num: string): CardLastFour {
  const digits = num.replace(/\D/g, '').slice(-4).padStart(4, '0');
  return digits as CardLastFour;
}

// A7: Çoklu Para Birimi Desteği
export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP';

// A17: Pagination & Cursor Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: string;
}

// A18: Standard ApiResponse & Result Wrapper Types
export type Result<T, E = Error> =
  | { success: true; data: T; message?: string }
  | { success: false; error: E; message: string; errorCode?: string };

export interface ApiResponse<T> {
  status: 'success' | 'error';
  statusCode: number;
  data: T | null;
  message: string;
  error?: string;
  timestamp: ISODateString;
}

// ============================================================================
// BASE DOMAIN INTERFACES
// ============================================================================
export type OrderTimingOption = 'immediate' | 'scheduled';

export type FeatureScopeStatus = 'mvp' | 'phase2' | 'decision_pending';

export interface MultiDropStop {
  id: string;
  name: string;
  address: string;
  recipientName?: string;
  recipientPhone?: string | PhoneNumber;
  packageNote?: string;
  deliveryCode?: string;
  isCompleted?: boolean;
}

export type PaymentMethod = 'wallet' | 'card' | 'cash';

export interface DeliveryPackageItem {
  id: string;
  trackingCode: string; // e.g. MP-PK-01
  recipientName: string;
  recipientPhone: string | PhoneNumber;
  dropoffAddress: string;
  dropoffLocation: LocationPoint;
  weightKg: number;
  size: 'zarf' | 'kucuk' | 'orta' | 'buyuk';
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  deliveryCode: string;
  failureReason?: string;
  returnReason?: string;
  deliveredAt?: string | ISODateString;
  verificationMethod?: 'code' | 'signature_photo' | 'manual_name';
  verifiedRecipientName?: string;
  // A14: Soft Delete
  isDeleted?: boolean;
  deletedAt?: ISODateString;
}

export type CourierEquipmentMode = 'courier_only' | 'passenger_and_courier';

export interface CourierServicePermissions {
  passengerServiceApproved: boolean; // Yolcu yetkisi
  courierServiceApproved: boolean; // Kurye yetkisi
  hasPassengerHelmet: boolean; // 2. kask mevcut mu
  hasGrabHandles: boolean; // Yolcu tutamağı uygun mu
  equipmentVerified: boolean;
}

export type RideStatus =
  | 'idle'
  | 'searching' // En yakın kurye aranıyor
  | 'offered' // Kuryeye teklif gönderildi, kabul bekleniyor
  | 'accepted' // Kurye kabul etti, alış noktasına geliyor
  | 'arrived' // Kurye alış noktasına vardı
  | 'in_progress' // Biniş kodu doğrulandı, yolculuk / taşıma sürüyor
  | 'completed' // Varış noktasına ulaşıldı, ödeme çekildi
  | 'partially_completed' // Çoklu pakette kısmi teslimat (bazı paketler iade/başarısız)
  | 'cancelled'; // İptal edildi

/**
 * B7: Sipariş Durum Makinesi (State Machine) Geçiş Kuralları
 * Geçersiz durum atlamalarını (örn. searching -> completed veya completed -> cancelled) engeller.
 */
export const ALLOWED_ORDER_TRANSITIONS: Record<RideStatus, readonly RideStatus[]> = {
  idle: ['searching', 'offered', 'cancelled'],
  searching: ['offered', 'accepted', 'cancelled'],
  offered: ['accepted', 'searching', 'cancelled'],
  accepted: ['arrived', 'in_progress', 'cancelled'],
  arrived: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'partially_completed'],
  completed: [],
  partially_completed: [],
  cancelled: [],
} as const;

/**
 * Sipariş durum geçişinin kurallara uygun olup olmadığını doğrular.
 * @param current Mevcut sipariş durumu
 * @param next Hedeflenen yeni sipariş durumu
 */
export function isValidOrderTransition(current: RideStatus, next: RideStatus): boolean {
  if (current === next) return true;
  const allowed = ALLOWED_ORDER_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

export const createRating = toRatingNumber;
export const createPhoneNumber = toPhoneNumber;
export const createISODateString = toISODateString;
export const createLatitude = toLatitude;
export const createLongitude = toLongitude;
export const createPositiveNumber = (val: number): PositiveNumber => Math.max(0.01, val) as PositiveNumber;
export const createNonNegativeNumber = toNonNegativeNumber;
export const createCardLast4 = toCardLastFour;
export const CANONICAL_RIDE_TRANSITIONS = ALLOWED_ORDER_TRANSITIONS;
export const canTransitionRideStatus = isValidOrderTransition;

/**
 * B5: Kuruş hassasiyetli (2 ondalık basamak) finansal yuvarlama yardımcısı.
 * IEEE 754 kayan nokta (floating-point) sapmalarını önler.
 * @param amount Ham tutar
 */
export function roundCurrency(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * B10: Haversine formülü ile iki GPS koordinatı arasındaki gerçek küresel mesafeyi (km) hesaplar.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(0.5, roundCurrency(R * c));
}

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// A2, A14, A15: Courier model with email, rating, version, soft-delete
export interface Courier {
  id: string;
  name: string;
  email: string; // A2: Courier email eklendi
  phone: string | PhoneNumber;
  avatar: string;
  plate: string;
  motorcycle: string;
  rating: number; // 0-5 arası
  totalTrips: number;
  isOnline: boolean;
  status: 'available' | 'busy' | 'offline';
  currentLocation: { lat: number; lng: number };
  equipmentMode: CourierEquipmentMode;
  permissions: CourierServicePermissions;
  wallet: {
    dailyEarnings: number;
    weeklyEarnings: number;
    pendingPayout: number;
    currency?: CurrencyCode; // A7
  };
  documents: {
    licenseApproved: boolean; // A sınıfı ehliyet
    registrationApproved: boolean; // Ruhsat
    insuranceApproved: boolean; // Trafik sigortası
    criminalRecordApproved: boolean; // Adli sicil kaydı
  };
  isVerified: boolean;
  isFavorite?: boolean;
  // A14: Soft delete
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  // A15: Optimistic concurrency locking
  version?: number;
}

export interface DirectDriverChat {
  driverId: string;
  driverName: string;
  driverAvatar: string;
  driverPlate: string;
  driverMotorcycle: string;
  driverRating: number;
  isOnline: boolean;
  messages: ChatMessage[];
  lastMessageTimestamp: string;
}

export type BargainStatus = 'none' | 'proposed' | 'accepted' | 'counter_offered' | 'declined';

export interface RideOrder {
  id: string;
  serviceType: ServiceType;
  customerName: string;
  customerPhone: string | PhoneNumber;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  distanceKm: number;
  durationMin: number;
  baseFare: number;
  kmFare: number;
  surgeMultiplier: number;
  totalFare: number;
  currency?: CurrencyCode; // A7
  originalFare?: number;
  bargainStatus?: BargainStatus;
  bargainOfferedFare?: number;
  bargainCounterFare?: number;
  bargainReason?: string;
  bargainAcceptedBy?: 'customer' | 'courier' | null;
  platformCommission: number; // e.g. 20%
  courierEarnings: number;
  status: RideStatus;
  courierId?: string;
  courierName?: string;
  isDirectBooking?: boolean;
  targetCourierName?: string;
  boardingCode: string; // 4 haneli biniş kodu
  deliveryCode?: string; // Paket teslim kodu
  deliveryPhotoUrl?: string; // Teslimat anı fotoğrafı
  packageNote?: string;
  recipientContact?: {
    name: string;
    phone: string | PhoneNumber;
  };
  // A8: DirectDriverChat connected to RideOrder
  chatSession?: DirectDriverChat;
  // Lansman Ortak Seçenekleri
  timing?: OrderTimingOption; // 'immediate' (Hemen al) | 'scheduled' (Belirli saatte al)
  scheduledTime?: string; // Örn. 19:30
  extraStops?: MultiDropStop[]; // Ek durak ekle / Birkaç noktaya dağıt (3-5 paket)
  waitMinutes?: number; // Kısa süre bekle (Örn. 5, 10, 15 dk)
  purchaseItemList?: string; // "Bir Şeyi Alıp Bana Getir" için satın alınacaklar
  estimatedItemCost?: number; // Alınacak ürünün tahmini tutarı
  businessOrderNumber?: string; // "İşletmemin Siparişini Götür" sipariş/paket no
  multiPackageCount?: number; // 3-5 paket adedi
  // MotoPilot Kuralları & Ekran Girdileri
  pickupDescription?: string; // Bina adı, kapı, sokak tarafı
  pickupConfirmedByUser?: boolean; // GPS teyidi
  packageWeightKg?: number; // Ağırlık
  packageSize?: 'zarf' | 'kucuk' | 'orta' | 'buyuk'; // Boyut
  isPackageReady?: boolean; // Paket hazır mı?
  deliveryInstructions?: string; // Teslimat talimatı
  packagesList?: DeliveryPackageItem[]; // Çoklu paketler
  serviceFeePercent?: number; // %0 (M0 Sıfır Komisyon)
  serviceFeeFixed?: number; // 0 TL (M0 Sıfır Komisyon)
  canonicalServiceType?: CanonicalM0ServiceType;
  feeSnapshot?: TransactionFeeSnapshot; // 18 Alanlı Değiştirilemez %0 Komisyon Snapshot Kaydı
  cancellationNotice?: string; // İptal koşulu bildirimi
  cancellationReason?: string; // İptal gerekçesi
  issueReported?: string; // Bildirilen sorun
  emergencyIncidentReported?: boolean;
  paymentMethod?: PaymentMethod;
  isSettled?: boolean;
  settledAt?: string | ISODateString;
  settlementId?: string;
  settlementRuleCode?: string;
  // A20: Double-entry ledger journal link (Source of Truth connection)
  ledgerJournalId?: string;
  createdAt: string | ISODateString;
  acceptedAt?: string | ISODateString;
  completedAt?: string | ISODateString;
  rating?: number;
  review?: string;
  // Sadakat, Kupon & Ödül Entegrasyonu
  couponCode?: string;
  couponDiscountAmount?: number;
  pointsRedeemed?: number;
  pointsDiscountAmount?: number;
  loyaltyPointsEarned?: number;
  // A14: Soft delete
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  // A15: Optimistic locking
  version?: number;
}

export interface TariffSettings {
  motorcycleBaseFare: number; // Açılış (örn. 50 TL)
  motorcyclePerKm: number; // Km başına (örn. 25 TL)
  motorcyclePerMin: number; // Dakika başına (örn. 4 TL)
  motorcycleMinFare: number; // Minimum ücret (örn. 85 TL)

  courierBaseFare: number; // Kurye açılış (örn. 65 TL)
  courierPerKm: number; // Kurye km (örn. 28 TL)
  courierMinFare: number; // Kurye minimum (örn. 100 TL)

  surgeMultiplier: number; // Yoğun saat çarpanı (1.0x - 2.5x)
  platformCommissionRate: number; // Yüzde (örn. 18%)
}

// A9: ComplaintTicket.rideId strictly linked to RideOrder['id']
export interface ComplaintTicket {
  id: string;
  rideId: RideOrder['id'];
  customerName: string;
  courierName: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  refundIssued: boolean;
  createdAt: string | ISODateString;
  // A14: Soft delete & A16: Audit link
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  auditLogId?: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  sender: 'customer' | 'courier' | 'system';
  senderName: string;
  text: string;
  timestamp: string | ISODateString;
  isRead: boolean;
  status?: 'sent' | 'delivered' | 'read';
  isVoiceNote?: boolean;
  voiceDurationSec?: number;
  readByTts?: boolean;
  isEncrypted?: boolean; // Uçtan uca şifreli (E2EE)
  expiresAt?: string | ISODateString; // 24 saat sonra otomatik kalıcı silinme zamanı (ISO)
}

// A19: SavedCard with CardLastFour branded type
export interface SavedCard {
  id: string;
  cardHolder: string;
  last4: CardLastFour | string;
  exp: string;
  brand: 'mastercard' | 'visa' | 'troy';
  isDefault: boolean;
}

// A20: Canonical Source-of-Truth Dual-Entry Financial Journal
export interface LedgerEntry {
  id: string;
  timestamp: string | ISODateString;
  accountDebit: string; // Borçlanan hesap (örn: 100 Kasa / 120 Müşteri)
  accountCredit: string; // Alacaklanan hesap (örn: 600 Gelir / 320 Kurye)
  amount: number;
  currency: CurrencyCode;
  transactionRefId: string;
  sourceOfTruth: 'canonical_general_ledger';
  description: string;
  signedHash: string;
  isDeleted?: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'ride_payment' | 'refund';
  amount: number;
  currency?: CurrencyCode;
  description: string;
  date: string | ISODateString;
  // A20: Sub-ledger reference linking to the canonical general ledger
  ledgerJournalRefId?: string;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
}

export interface CourierShift {
  isShiftActive: boolean;
  bikePlate: string;
  startKm: number;
  photosApproved: boolean;
  startedAt?: string | ISODateString;
}

// A10: TrafficPenalty with courier acknowledgment status
export interface TrafficPenalty {
  id: string;
  plate: string;
  date: string | ISODateString;
  code: string;
  title: string;
  fullAmount: number;
  discountedAmount: number;
  discountValidUntil?: string | ISODateString;
  status: 'unpaid' | 'paid';
  disputed?: boolean;
  courierId?: string;
  courierName?: string;
  servedProof?: string;
  // A10: Kurye bilgilendirme / tebliğ durumu
  acknowledgedByCourier: boolean;
  acknowledgedAt?: string | ISODateString;
  courierReadStatus: 'unread' | 'read' | 'appealed';
  appealNote?: string;
  // A14 & A15
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  version?: number;
}

// TFKS Sınıf 1: Araç, Şoför, Zimmet & Vardiya
export interface VehicleAssignment {
  id: string;
  plate: string;
  model: string;
  courierId: string;
  courierName: string;
  startKm: number;
  currentKm: number;
  fuelLevel: number;
  shiftStatus: 'active' | 'completed' | 'blocked';
  photoApproved: boolean;
  gpsStatus: 'connected' | 'warning' | 'disconnected';
  ecuStatus: 'normal' | 'dtc_warning';
  assignedAt: string | ISODateString;
  expectedReturnAt: string | ISODateString;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  version?: number;
}

// TFKS Sınıf 2: Çoklu Kasa, Tahsilat & Cari Mutabakat
export interface CashVault {
  id: string;
  name: string;
  type: 'merkez' | 'operasyon' | 'pos' | 'kurye_avans';
  balance: number;
  currency?: CurrencyCode;
  responsiblePerson: string;
  pendingTransfersCount: number;
  lastAuditedAt: string | ISODateString;
  discrepancyAmount: number;
  version?: number;
}

export interface CashTransferRecord {
  id: string;
  fromVaultId: string;
  fromVaultName: string;
  toVaultId: string;
  toVaultName: string;
  amount: number;
  senderPerson: string;
  receiverPerson: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  timestamp: string | ISODateString;
  justification: string;
  approvedBy?: string;
  rejectionReason?: string;
  auditLogId?: string;
}

// TFKS Sınıf 3: Ceza, HGS & Hasar Sorumluluk
export interface DamageReport {
  id: string;
  plate: string;
  courierId: string;
  courierName: string;
  incidentDate: string | ISODateString;
  description: string;
  estimatedCost: number;
  actualCost: number;
  status: 'pending_inspection' | 'repair_approved' | 'completed';
  responsibleParty: 'courier' | 'company' | 'insurance';
  beforePhoto: string;
  afterPhoto?: string;
  ledgerDeductionConfirmed: boolean;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
}

// A11 & A12: WarehousePart with non-negative stock and PartUsageRecord interface
export interface PartUsageRecord {
  partId: string;
  partCode: string;
  name: string;
  qty: number;
  unitCost: number;
  cost: number;
}

export interface WarehousePart {
  id: string;
  partCode: string;
  name: string;
  category: 'mekanik' | 'kaporta' | 'elektrik' | 'lastik' | 'sarf';
  stockQty: number; // A11: >= 0 enforced
  minLimit: number;
  unitPrice: number;
  shelfLocation: string;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  version?: number;
}

export interface ServiceWorkOrder {
  id: string;
  orderNo: string;
  plate: string;
  courierName: string;
  mechanicName: string;
  faultDescription: string;
  partsUsed: PartUsageRecord[]; // A12: Reusable PartUsageRecord interface
  laborCost: number;
  totalCost: number;
  status: 'opened' | 'in_progress' | 'test_drive_passed' | 'closed';
  oldPartsStatus: 'hurda' | 'depoya_iade' | 'inceleniyor';
  closedBy?: string;
  closedAt?: string | ISODateString;
  testDriveApproved: boolean;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  version?: number;
}

// A13: SystemBlockage with 'business_account' support
export interface SystemBlockage {
  id: string;
  targetType: 'courier' | 'vehicle' | 'cashier' | 'business_account';
  targetId: string;
  targetName: string;
  blockReason: string;
  severity: 'critical' | 'warning';
  blockedAt: string | ISODateString;
  blockedBy: string;
  isUnlocked: boolean;
  unlockedAt?: string | ISODateString;
  unlockedBy?: string;
  unlockJustification?: string;
  auditLogId?: string;
}

// TFKS Sınıf 6: Mühürlü Audit Log (Eski Değer / Yeni Değer + Kriptografik Zincir)
export interface AuditLogEntry {
  id: string;
  timestamp: string | ISODateString;
  actorName: string;
  actorRole: string;
  screenName: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE_BLOCKED' | 'APPROVE' | 'REJECT' | 'UNBLOCK' | 'SEAL';
  recordId: string;
  previousValue: string;
  newValue: string;
  justification: string;
  previousSealHash?: string;
  securitySealHash: string;
}

// Time-Travel Snapshot (Anlık Sistem Yedeği & Geri Yükleme Noktası)
export interface SystemSnapshot {
  id: string;
  label: string;
  createdAt: ISODateString;
  checksumHash: string;
  ordersCount: number;
  vaultTotalBalance: number;
  ledgerEntriesCount: number;
  auditLogsCount: number;
  payload: string; // JSON serialized state
}

// TFKS Sınıf 7: Mühürlü Gün Kapanışı & Şirket Denetimi
export interface DailyClosingAudit {
  closingDate: string;
  status: 'open' | 'risk_detected_blocked' | 'sealed_clean' | 'sealed_with_executive_override';
  openZimmetCount: number;
  uncollectedCashAmount: number;
  vaultDiscrepancy: number;
  openWorkOrdersCount: number;
  unservedPenaltiesCount: number;
  sealedBy?: string;
  sealedAt?: string | ISODateString;
  sealHash?: string;
  executiveOverrideNote?: string;
  auditChecklist: {
    id: string;
    title: string;
    isPassed: boolean;
    detail: string;
  }[];
}

// Finansal Uzlaşma & İşlem Doğrulama Kaydı (Reconciliation Record)
export interface TransactionReconciliationRecord {
  id: string; // REC-xxx
  rideId: string;
  timestamp: string | ISODateString;
  paymentMethod: PaymentMethod;
  amountCollected: number;
  collectionChannel: 'simulation_wallet' | 'simulation_card_pos' | 'direct_cash';
  courierEarnings: number;
  platformCommission: number;
  cancellationFeeApplied: number; // 0 TL (Onaysız kural uygulanmadı)
  appliedRule: {
    ruleCode: string;
    description: string;
    isApprovedByUser: boolean;
  };
  reconciliationStatus: 'balanced' | 'pending_decision' | 'discrepancy';
  idempotencyKey: string;
  isIdempotentVerified: boolean;
  notes?: string;
}

// A16: Onay Bekleyen Finansal Politika Önerisi with auditLogEntryId
export interface PolicyProposal {
  id: string;
  policyKey: string;
  title: string;
  proposedFee: number;
  proposedCourierShare: number;
  status: 'pending_approval' | 'rejected' | 'approved';
  description: string;
  warningNote: string;
  createdAt: string | ISODateString;
  auditLogEntryId?: string; // A16
}

// A16: Onaysız Kural İle Üretilmiş Geçmiş İşlem Tespiti with auditLogEntryId
export interface DetectedUnapprovedRecord {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string | ISODateString;
  detectedAt: string | ISODateString;
  reason: string;
  isDeleted: boolean; // Silinmedi, tespit edildi ve denetim için listelendi
  auditLogEntryId?: string; // A16
}

// Erişilebilir Bildirim & Duyuru Kaydı
export interface AccessibleNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  durationMs: number;
  isCritical?: boolean;
  readConfirmed?: boolean;
}

// ============================================================================
// KURUMSAL İŞLETME & ALT KULLANICILAR (BUSINESS SUB-USERS & ACL ENGINE)
// ============================================================================
export type BusinessSubUserRole =
  | 'owner' // Şirket Sahibi / Ana Yönetici (Tüm yetkiler)
  | 'branch_manager' // Şube Müdürü (Paket oluşturma, kurye takibi, şube kuryeleri)
  | 'dispatch_staff' // Sevkiyat / Hazırlık Personeli (Yalnızca paket girişi & barkod)
  | 'accountant' // Muhasebe / Finans (Fatura, cari ekstre, mutabakat)
  | 'read_only'; // İzleyici / Müşteri Hizmetleri (Sadece durum sorgulama)

export interface BusinessSubUserPermissions {
  canCreateOrders: boolean; // Paket / Sipariş oluşturabilir
  canCancelOrders: boolean; // Sipariş iptal edebilir
  canViewFinancials: boolean; // Cari hesap ve faturaları görebilir
  canManageSubUsers: boolean; // Alt kullanıcı ekleyip silebilir
  canExportReports: boolean; // Rapor ve CSV indirebilir
  canManageApiKeys: boolean; // B2B API Entegrasyon anahtarı üretebilir
}

export interface BusinessSubUser {
  id: string; // SUB-USR-01
  businessId: string; // BIZ-01
  businessName: string; // Lezzet Dünyası Restoranları A.Ş.
  name: string; // Selin Karaca
  email: string;
  phone: string;
  avatar?: string;
  role: BusinessSubUserRole;
  branchName: string; // Nişantaşı Şubesi
  status: 'active' | 'suspended';
  createdAt: string | ISODateString;
  lastLoginAt: string | ISODateString;
  permissions: BusinessSubUserPermissions;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  version?: number;
}

export interface BusinessAccount {
  id: string; // BIZ-01
  title: string; // Lezzet Dünyası Restoranları A.Ş.
  brandName: string; // Burger & Co
  taxNumber: string; // 8420194821
  taxOffice: string; // Beşiktaş Vergi Dairesi
  address: string; // Nispetiye Cd. No: 24, Beşiktaş / İstanbul
  phone: string | PhoneNumber;
  contactEmail: string;
  currentBalance: number; // Cari Bakiye (₺)
  creditLimit: number; // Cari Kredi Limiti (₺)
  currency?: CurrencyCode;
  billingCycle: 'weekly' | 'monthly' | 'instant';
  activeBranches: string[];
  subUsers: BusinessSubUser[];
  apiKey: string;
  webhookUrl?: string;
  createdAt: string | ISODateString;
  isDeleted?: boolean;
  deletedAt?: ISODateString;
  version?: number;
  // M0–M7 Kanonik İşletme Üyelik ve Tanışma Kampanyası Alanları
  subscriptionStatus?: BusinessSubscriptionStatus;
  appliedIntroCampaignId?: string | null;
  personalIntroEndDate?: string | ISODateString | null;
  graceEndsAt?: string | ISODateString | null;
  membershipEndsAt?: string | ISODateString | null;
}

// ============================================================================
// M0 KANONİK HİZMET KAPSAMI, %0 KOMİSYON SNAPSHOT (18 ALAN) VE DURUM MAKİNELERİ
// ============================================================================

/**
 * AUD-01: M0 Aktif Hizmet Türleri (Yalnızca 3 aktif hizmet çalışır)
 */
export type CanonicalM0ServiceType =
  | 'TAXI_RIDE' // Taksi Yolcu Taşıma (%0 yolcu & %0 şoför komisyonu)
  | 'INDIVIDUAL_DELIVERY' // Bireysel Kurye / Paket Gönderimi (%0 gönderici & %0 kurye komisyonu)
  | 'BUSINESS_DELIVERY'; // İşletme / Esnaf Teslimatı (%0 müşteri & %0 kurye komisyonu; esnaf haftalık üyelik)

/**
 * AUD-01: Gelecek / Yasal Teyit Bekleyen Hizmet Türü (M0'da DISABLED_BY_POLICY)
 */
export type FutureReservedServiceType = 'MOTO_PASSENGER_RIDE';

/**
 * AUD-05: Tanışma Kampanyası (IntroCampaign) 6 Durumlu Yaşam Döngüsü
 */
export type IntroCampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'ENDED'
  | 'CANCELLED';

/**
 * AUD-06: İşletme Üyeliği (BusinessSubscription) 8 Durumlu Yaşam Döngüsü
 */
export type BusinessSubscriptionStatus =
  | 'FREE_INTRO' // Ücretsiz tanışma dönemi aktif
  | 'PLAN_SELECTION_REQUIRED' // Tanışma bitti; otomatik kart çekimi yapılmaz, paket seçimi beklenir
  | 'PAYMENT_PENDING' // İşletme Havale/EFT dekontu yükledi, Admin MANUAL_APPROVAL bekleniyor
  | 'ACTIVE_MEMBERSHIP' // Haftalık sabit üyelik aktif (%0 sipariş komisyonu)
  | 'GRACE_PERIOD' // Yenileme sonunda 3 takvim günü ek hoşgörü süresi
  | 'LIMITED_ACCESS' // Kısıtlı mod (veriler silinmez, INDIVIDUAL_DELIVERY açık kalır)
  | 'SUSPENDED' // Ağır sözleşme/güvenlik ihlali askısı
  | 'CANCELLED'; // İşletme kendi isteğiyle üyeliği sonlandırdı

export type PaymentApprovalMethod = 'MANUAL_APPROVAL' | 'FUTURE_PAYMENT_GATEWAY';

/**
 * AUD-04 & A8: 18 Alanlı Değiştirilemez İşlem Ücret ve Komisyon Kaydı (TransactionFeeSnapshot)
 */
export interface TransactionFeeSnapshot {
  snapshotId: string; // 1. Tekil Snapshot UUID
  orderId: string; // 2. Bağlı Çağrı / Sipariş ID
  serviceType: CanonicalM0ServiceType; // 3. Kanonik M0 Hizmet Türü
  pricingPolicyVersion: string; // 4. Tarife Politikası Sürümü (örn. 'M0-ZERO-COMM-v2.4')
  currency: CurrencyCode; // 5. Para Birimi ('TRY')
  grossTransactionAmount: number; // 6. Brüt Taşıma Ücreti (₺)
  customerCommissionRate: 0; // 7. Müşteri Komisyon Oranı (%0 sabit)
  customerCommissionFee: 0; // 8. Müşteri Komisyon Tutarı (0.00 ₺ sabit)
  providerCommissionRate: 0; // 9. Sürücü / Kurye Komisyon Oranı (%0 sabit)
  providerCommissionFee: 0; // 10. Sürücü / Kurye Komisyon Tutarı (0.00 ₺ sabit)
  businessPerOrderCommissionFee: 0; // 11. İşletme Sipariş Başı Komisyon Tutarı (0.00 ₺ sabit)
  driverNetPayout: number; // 12. Sürücü / Kurye Net Hakedişi (= grossTransactionAmount, %100)
  platformOrderNetRevenue: 0; // 13. Platform Sipariş Komisyon Geliri (0.00 ₺ sabit)
  appliedCampaignId: string | null; // 14. Uygulanan Tanışma Kampanyası ID
  businessSubscriptionState: BusinessSubscriptionStatus | 'NOT_APPLICABLE'; // 15. İşletme Üyelik Durumu
  isFreeIntroApplied: boolean; // 16. Ücretsiz Tanışma Dönemi Uygulandı mı?
  calculatedAt: ISODateString; // 17. Hesaplanma Zaman Damgası (ISO-8601)
  snapshotHash: string; // 18. SHA-256 Kriptografik Bütünlük Mührü
}

/**
 * Legacy ServiceType ('motosiklet' | 'kurye' | 'al_getir' | 'isletme_siparis') -> CanonicalM0ServiceType dönüştürücüsü
 */
export function mapLegacyServiceTypeToCanonical(serviceType: ServiceType): CanonicalM0ServiceType {
  switch (serviceType) {
    case 'motosiklet':
      return 'TAXI_RIDE';
    case 'kurye':
    case 'al_getir':
      return 'INDIVIDUAL_DELIVERY';
    case 'isletme_siparis':
      return 'BUSINESS_DELIVERY';
    default:
      return 'INDIVIDUAL_DELIVERY';
  }
}

/**
 * Deterministik %0 Komisyonlu 18 Alanlı TransactionFeeSnapshot Üreticisi
 */
export function createZeroCommissionFeeSnapshot(params: {
  orderId: string;
  serviceType: CanonicalM0ServiceType;
  grossAmount: number;
  appliedCampaignId?: string | null;
  businessSubscriptionState?: BusinessSubscriptionStatus | 'NOT_APPLICABLE';
  isFreeIntroApplied?: boolean;
}): TransactionFeeSnapshot {
  const gross = roundCurrency(Math.max(0, params.grossAmount));
  const calculatedAt = toISODateString(new Date());
  const subState =
    params.businessSubscriptionState ??
    (params.serviceType === 'BUSINESS_DELIVERY' ? 'FREE_INTRO' : 'NOT_APPLICABLE');
  const rawPayload = `${params.orderId}|${params.serviceType}|${gross.toFixed(2)}|0|0|0|${gross.toFixed(2)}|${subState}|${calculatedAt}`;
  let hashAcc = 0x811c9dc5;
  for (let i = 0; i < rawPayload.length; i++) {
    hashAcc ^= rawPayload.charCodeAt(i);
    hashAcc = Math.imul(hashAcc, 0x01000193);
  }
  const hexSeal = `sha256:${(hashAcc >>> 0).toString(16).padStart(8, '0')}${rawPayload.length.toString(16).padStart(8, '0')}m0zero`;

  return {
    snapshotId: `TFS-${params.orderId}-${Date.now().toString().slice(-4)}`,
    orderId: params.orderId,
    serviceType: params.serviceType,
    pricingPolicyVersion: 'M0-ZERO-COMM-v2.4',
    currency: 'TRY',
    grossTransactionAmount: gross,
    customerCommissionRate: 0,
    customerCommissionFee: 0,
    providerCommissionRate: 0,
    providerCommissionFee: 0,
    businessPerOrderCommissionFee: 0,
    driverNetPayout: gross,
    platformOrderNetRevenue: 0,
    appliedCampaignId: params.appliedCampaignId ?? null,
    businessSubscriptionState: subState,
    isFreeIntroApplied: params.isFreeIntroApplied ?? subState === 'FREE_INTRO',
    calculatedAt,
    snapshotHash: hexSeal,
  };
}

/**
 * AUD-07: İşletme Ücretsiz Tanışma Dönemi (ücretsiz_mi) Deterministik Hesaplayıcısı
 * KURAL-01: effectiveIntroEndDate = personalIntroEndDate ?? campaignEndDate
 */
export function evaluateBusinessIntroEligibility(params: {
  nowIso: string;
  campaignStartIso: string;
  campaignEndIso: string;
  personalIntroEndIso?: string | null;
  campaignStatus: IntroCampaignStatus;
}): {
  effectiveIntroEndDate: string;
  isFreeIntroActive: boolean;
  recommendedStatus: BusinessSubscriptionStatus;
} {
  const effectiveIntroEndDate = params.personalIntroEndIso || params.campaignEndIso;
  const nowMs = new Date(params.nowIso).getTime();
  const startMs = new Date(params.campaignStartIso).getTime();
  const endMs = new Date(effectiveIntroEndDate).getTime();

  const isFreeIntroActive =
    (params.campaignStatus === 'ACTIVE' || Boolean(params.personalIntroEndIso)) &&
    nowMs >= startMs &&
    nowMs < endMs;

  return {
    effectiveIntroEndDate,
    isFreeIntroActive,
    recommendedStatus: isFreeIntroActive ? 'FREE_INTRO' : 'PLAN_SELECTION_REQUIRED',
  };
}




