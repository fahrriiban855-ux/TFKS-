export type PlatformView = 'split' | 'customer' | 'business' | 'courier' | 'admin' | 'website' | 'presentation' | 'typography';

export type UserProfileMode = 'individual' | 'business';

export type ServiceType =
  | 'motosiklet' // 1. Beni Götür (Yolcu taşıma - MVP Dahil)
  | 'kurye' // 2. Paket Gönder (Tekil koli/evrak - MVP Dahil)
  | 'al_getir' // 3. Bir Şeyi Alıp Bana Getir (Öneri / Karar Bekleyen)
  | 'isletme_siparis'; // 4. İşletme Çoklu Teslimat (MVP Dahil)

export type OrderTimingOption = 'immediate' | 'scheduled';

export type FeatureScopeStatus = 'mvp' | 'phase2' | 'decision_pending';

export interface MultiDropStop {
  id: string;
  name: string;
  address: string;
  recipientName?: string;
  recipientPhone?: string;
  packageNote?: string;
  deliveryCode?: string;
  isCompleted?: boolean;
}

export type PaymentMethod = 'wallet' | 'card' | 'cash';

export interface DeliveryPackageItem {
  id: string;
  trackingCode: string; // e.g. MP-PK-01
  recipientName: string;
  recipientPhone: string;
  dropoffAddress: string;
  dropoffLocation: LocationPoint;
  weightKg: number;
  size: 'zarf' | 'kucuk' | 'orta' | 'buyuk';
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  deliveryCode: string;
  failureReason?: string;
  returnReason?: string;
  deliveredAt?: string;
  verificationMethod?: 'code' | 'signature_photo' | 'manual_name';
  verifiedRecipientName?: string;
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

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  plate: string;
  motorcycle: string;
  rating: number;
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
  };
  documents: {
    licenseApproved: boolean; // A sınıfı ehliyet
    registrationApproved: boolean; // Ruhsat
    insuranceApproved: boolean; // Trafik sigortası
    criminalRecordApproved: boolean; // Adli sicil kaydı
  };
  isVerified: boolean;
  isFavorite?: boolean;
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
  customerPhone: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  distanceKm: number;
  durationMin: number;
  baseFare: number;
  kmFare: number;
  surgeMultiplier: number;
  totalFare: number;
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
    phone: string;
  };
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
  serviceFeePercent?: number; // %10
  serviceFeeFixed?: number; // 20 TL
  cancellationNotice?: string; // İptal koşulu bildirimi
  cancellationReason?: string; // İptal gerekçesi
  issueReported?: string; // Bildirilen sorun
  emergencyIncidentReported?: boolean;
  paymentMethod?: PaymentMethod;
  isSettled?: boolean;
  settledAt?: string;
  settlementId?: string;
  settlementRuleCode?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  // Sadakat, Kupon & Ödül Entegrasyonu
  couponCode?: string;
  couponDiscountAmount?: number;
  pointsRedeemed?: number;
  pointsDiscountAmount?: number;
  loyaltyPointsEarned?: number;
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

export interface ComplaintTicket {
  id: string;
  rideId: string;
  customerName: string;
  courierName: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  refundIssued: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  sender: 'customer' | 'courier' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  status?: 'sent' | 'delivered' | 'read';
  isVoiceNote?: boolean;
  voiceDurationSec?: number;
  readByTts?: boolean;
  isEncrypted?: boolean; // Uçtan uca şifreli (E2EE)
  expiresAt?: string; // 24 saat sonra otomatik kalıcı silinme zamanı (ISO)
}

export interface SavedCard {
  id: string;
  cardHolder: string;
  last4: string;
  exp: string;
  brand: 'mastercard' | 'visa' | 'troy';
  isDefault: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'ride_payment' | 'refund';
  amount: number;
  description: string;
  date: string;
}

export interface CourierShift {
  isShiftActive: boolean;
  bikePlate: string;
  startKm: number;
  photosApproved: boolean;
  startedAt?: string;
}

export interface TrafficPenalty {
  id: string;
  plate: string;
  date: string;
  code: string;
  title: string;
  fullAmount: number;
  discountedAmount: number;
  discountValidUntil?: string;
  status: 'unpaid' | 'paid';
  disputed?: boolean;
  courierId?: string;
  courierName?: string;
  servedProof?: string;
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
  assignedAt: string;
  expectedReturnAt: string;
}

// TFKS Sınıf 2: Çoklu Kasa, Tahsilat & Cari Mutabakat
export interface CashVault {
  id: string;
  name: string;
  type: 'merkez' | 'operasyon' | 'pos' | 'kurye_avans';
  balance: number;
  responsiblePerson: string;
  pendingTransfersCount: number;
  lastAuditedAt: string;
  discrepancyAmount: number;
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
  timestamp: string;
  justification: string;
  approvedBy?: string;
}

// TFKS Sınıf 3: Ceza, HGS & Hasar Sorumluluk
export interface DamageReport {
  id: string;
  plate: string;
  courierId: string;
  courierName: string;
  incidentDate: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  status: 'pending_inspection' | 'repair_approved' | 'completed';
  responsibleParty: 'courier' | 'company' | 'insurance';
  beforePhoto: string;
  afterPhoto?: string;
  ledgerDeductionConfirmed: boolean;
}

// TFKS Sınıf 4: Depo, Yedek Parça & Servis İş Emirleri
export interface WarehousePart {
  id: string;
  partCode: string;
  name: string;
  category: 'mekanik' | 'kaporta' | 'elektrik' | 'lastik' | 'sarf';
  stockQty: number;
  minLimit: number;
  unitPrice: number;
  shelfLocation: string;
}

export interface ServiceWorkOrder {
  id: string;
  orderNo: string;
  plate: string;
  courierName: string;
  mechanicName: string;
  faultDescription: string;
  partsUsed: { partId: string; name: string; qty: number; cost: number }[];
  laborCost: number;
  totalCost: number;
  status: 'opened' | 'in_progress' | 'test_drive_passed' | 'closed';
  oldPartsStatus: 'hurda' | 'depoya_iade' | 'inceleniyor';
  closedBy?: string;
  closedAt?: string;
  testDriveApproved: boolean;
}

// TFKS Sınıf 5: Yetki, Blokaj & Sistem Frenleri
export interface SystemBlockage {
  id: string;
  targetType: 'courier' | 'vehicle' | 'cashier';
  targetId: string;
  targetName: string;
  blockReason: string;
  severity: 'critical' | 'warning';
  blockedAt: string;
  blockedBy: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  unlockedBy?: string;
  unlockJustification?: string;
}

// TFKS Sınıf 6: Mühürlü Audit Log (Eski Değer / Yeni Değer)
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  screenName: string;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE_BLOCKED' | 'APPROVE' | 'REJECT' | 'UNBLOCK' | 'SEAL';
  recordId: string;
  previousValue: string;
  newValue: string;
  justification: string;
  securitySealHash: string;
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
  sealedAt?: string;
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
  timestamp: string;
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

// Onay Bekleyen Finansal Politika Önerisi (Pending Policy Proposal)
export interface PolicyProposal {
  id: string;
  policyKey: string;
  title: string;
  proposedFee: number;
  proposedCourierShare: number;
  status: 'pending_approval' | 'rejected' | 'approved';
  description: string;
  warningNote: string;
  createdAt: string;
}

// Onaysız Kural İle Üretilmiş Geçmiş İşlem Tespiti (Detected Unapproved Record)
export interface DetectedUnapprovedRecord {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  detectedAt: string;
  reason: string;
  isDeleted: boolean; // Silinmedi, tespit edildi ve denetim için listelendi
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
  createdAt: string;
  lastLoginAt: string;
  permissions: BusinessSubUserPermissions;
}

export interface BusinessAccount {
  id: string; // BIZ-01
  title: string; // Lezzet Dünyası Restoranları A.Ş.
  brandName: string; // Burger & Co
  taxNumber: string; // 8420194821
  taxOffice: string; // Beşiktaş Vergi Dairesi
  address: string; // Nispetiye Cd. No: 24, Beşiktaş / İstanbul
  phone: string;
  contactEmail: string;
  currentBalance: number; // Cari Bakiye (₺)
  creditLimit: number; // Cari Kredi Limiti (₺)
  billingCycle: 'weekly' | 'monthly' | 'instant';
  activeBranches: string[];
  subUsers: BusinessSubUser[];
  apiKey: string;
  webhookUrl?: string;
  createdAt: string;
}



