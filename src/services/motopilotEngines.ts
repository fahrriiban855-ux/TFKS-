import {
  BusinessSubscriptionStatus,
  IntroCampaignStatus,
  TransactionFeeSnapshot,
  createZeroCommissionFeeSnapshot,
} from '../types/platform';

export interface ZoneCapacityMetric {
  zoneId: string;
  zoneName: string;
  passengerDemandIndex: number; // 0-100
  packageDemandIndex: number; // 0-100
  idleDriversCount: number;
  activeCouriersCount: number;
  recommendedShiftToDelivery: number;
  estimatedHourlyUtilizationGainPercent: number;
  lastBalancedAt?: string;
  status: 'IMBALANCED_PACKAGE_SURGE' | 'IMBALANCED_PASSENGER_SURGE' | 'BALANCED';
}

export interface MultiDropStopItem {
  stopOrder: number;
  packageId: string;
  trackingCode: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  pinCode: string;
  prepTimeMinutes: number;
  status: 'PENDING' | 'PICKED_UP' | 'DELIVERED';
  podVerified: boolean;
}

export interface BatchRoutePlanRecord {
  batchId: string;
  businessId: string;
  businessName: string;
  corridorName: string;
  createdAt: string;
  status: 'READY' | 'DISPATCHED' | 'COMPLETED';
  assignedCourierId?: string;
  assignedCourierName?: string;
  standaloneTotalKm: number;
  optimizedBatchKm: number;
  kmSavedPercent: number;
  totalGrossFareTl: number;
  courierNetPayoutTl: number;
  platformCommissionTl: 0;
  feeSnapshot: TransactionFeeSnapshot;
  stops: MultiDropStopItem[];
}

export type ExternalOrderChannel =
  | 'YEMEKSEPETI'
  | 'GETIRYEMEK'
  | 'TRENDYOL_YEMEK'
  | 'SHOPIFY'
  | 'WOOCOMMERCE'
  | 'KURUMSAL_POS';

export interface B2BWebhookOrderEvent {
  eventId: string;
  externalOrderId: string;
  channel: ExternalOrderChannel;
  businessId: string;
  customerName: string;
  customerPhone: string;
  dropoffAddress: string;
  prepTimeMinutes: number;
  orderAmountTl: number;
  deliveryFeeTl: number;
  autoDispatched: boolean;
  assignedCourierName: string;
  pinCode: string;
  receivedAt: string;
  feeSnapshot: TransactionFeeSnapshot;
}

export interface WirePaymentSubmission {
  noticeId: string;
  businessId: string;
  businessName: string;
  taxNumber: string;
  planCode: 'WEEKLY_PRO_750' | 'MONTHLY_PRO_1490';
  amountTl: number;
  wireReferenceCode: string;
  senderIban: string;
  receiptFileName: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export const INITIAL_ZONE_CAPACITY_METRICS: ZoneCapacityMetric[] = [
  {
    zoneId: 'ZONE-BESIKTAS-LEVENT',
    zoneName: 'Beşiktaş · Levent · Etiler Koridoru',
    passengerDemandIndex: 42,
    packageDemandIndex: 91,
    idleDriversCount: 9,
    activeCouriersCount: 14,
    recommendedShiftToDelivery: 6,
    estimatedHourlyUtilizationGainPercent: 38,
    status: 'IMBALANCED_PACKAGE_SURGE',
  },
  {
    zoneId: 'ZONE-KADIKOY-ATASEHIR',
    zoneName: 'Kadıköy · Moda · Ataşehir Koridoru',
    passengerDemandIndex: 48,
    packageDemandIndex: 86,
    idleDriversCount: 7,
    activeCouriersCount: 11,
    recommendedShiftToDelivery: 5,
    estimatedHourlyUtilizationGainPercent: 34,
    status: 'IMBALANCED_PACKAGE_SURGE',
  },
  {
    zoneId: 'ZONE-SISLI-MASLAK',
    zoneName: 'Şişli · Mecidiyeköy · Maslak Hattı',
    passengerDemandIndex: 76,
    packageDemandIndex: 74,
    idleDriversCount: 2,
    activeCouriersCount: 16,
    recommendedShiftToDelivery: 0,
    estimatedHourlyUtilizationGainPercent: 18,
    status: 'BALANCED',
  },
];

export const INITIAL_WIRE_SUBMISSIONS: WirePaymentSubmission[] = [
  {
    noticeId: 'WIRE-2026-901',
    businessId: 'BIZ-01',
    businessName: 'Burger & Co (Lezzet Dünyası A.Ş.)',
    taxNumber: '8420194821',
    planCode: 'WEEKLY_PRO_750',
    amountTl: 750,
    wireReferenceCode: 'TR-EFT-20261013-8841',
    senderIban: 'TR44 0006 2000 4190 0006 2991 12',
    receiptFileName: 'garanti_dekont_8841.pdf',
    submittedAt: 'Bugün 14:15',
    status: 'PENDING',
  },
];

export function buildOptimizedBatchRoute(params: {
  businessId: string;
  businessName: string;
  corridorName: string;
  packages: {
    id: string;
    trackingCode: string;
    recipientName: string;
    recipientPhone: string;
    dropoffAddress: string;
  }[];
  assignedCourierId?: string;
  assignedCourierName?: string;
  prepTimeMinutes: number;
  subscriptionStatus: BusinessSubscriptionStatus;
}): BatchRoutePlanRecord {
  const count = Math.max(2, params.packages.length);
  const standaloneTotalKm = Number((count * 4.2).toFixed(1));
  const optimizedBatchKm = Number((standaloneTotalKm * 0.72).toFixed(1));
  const kmSavedPercent = 28;
  const totalGrossFareTl = count * 95;
  const batchId = `BATCH-${Date.now().toString().slice(-5)}`;

  const feeSnapshot = createZeroCommissionFeeSnapshot({
    orderId: batchId,
    serviceType: 'BUSINESS_DELIVERY',
    grossAmount: totalGrossFareTl,
    businessSubscriptionState: params.subscriptionStatus,
    isFreeIntroApplied: params.subscriptionStatus === 'FREE_INTRO',
  });

  const stops: MultiDropStopItem[] = params.packages.map((pkg, idx) => ({
    stopOrder: idx + 1,
    packageId: pkg.id,
    trackingCode: pkg.trackingCode,
    recipientName: pkg.recipientName,
    recipientPhone: pkg.recipientPhone,
    address: pkg.dropoffAddress,
    pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
    prepTimeMinutes: params.prepTimeMinutes,
    status: 'PICKED_UP',
    podVerified: false,
  }));

  return {
    batchId,
    businessId: params.businessId,
    businessName: params.businessName,
    corridorName: params.corridorName,
    createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    status: 'DISPATCHED',
    assignedCourierId: params.assignedCourierId,
    assignedCourierName: params.assignedCourierName || 'Burak Yılmaz (Hibrit Filo)',
    standaloneTotalKm,
    optimizedBatchKm,
    kmSavedPercent,
    totalGrossFareTl,
    courierNetPayoutTl: totalGrossFareTl,
    platformCommissionTl: 0,
    feeSnapshot,
    stops,
  };
}

export function createSimulatedB2BWebhookEvent(params: {
  channel: ExternalOrderChannel;
  businessId: string;
  assignedCourierName: string;
  subscriptionStatus: BusinessSubscriptionStatus;
}): B2BWebhookOrderEvent {
  const sampleCustomers = [
    { name: 'Selin Demirtaş', phone: '+90 532 411 82 90', addr: 'Nispetiye On Residence A Blok D:14, Beşiktaş', prep: 12, amt: 640, fee: 115 },
    { name: 'Kaan Çelik', phone: '+90 544 819 20 33', addr: 'Levent Loft 1. Kısım Kat:5 D:28, Şişli', prep: 10, amt: 480, fee: 105 },
    { name: 'Zeynep Akbulut', phone: '+90 533 602 44 19', addr: 'Bebek Yokuşu Sok. No:18/3, Beşiktaş', prep: 15, amt: 920, fee: 125 },
    { name: 'Emre Soylu', phone: '+90 555 219 77 41', addr: 'Maslak Eclipse Ticaret Merkezi B Blok, Sarıyer', prep: 8, amt: 540, fee: 110 },
  ];
  const pick = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
  const eventId = `WH-${Date.now().toString().slice(-5)}`;
  const externalOrderId = `${params.channel.slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const feeSnapshot = createZeroCommissionFeeSnapshot({
    orderId: externalOrderId,
    serviceType: 'BUSINESS_DELIVERY',
    grossAmount: pick.fee,
    businessSubscriptionState: params.subscriptionStatus,
    isFreeIntroApplied: params.subscriptionStatus === 'FREE_INTRO',
  });

  return {
    eventId,
    externalOrderId,
    channel: params.channel,
    businessId: params.businessId,
    customerName: pick.name,
    customerPhone: pick.phone,
    dropoffAddress: pick.addr,
    prepTimeMinutes: pick.prep,
    orderAmountTl: pick.amt,
    deliveryFeeTl: pick.fee,
    autoDispatched: true,
    assignedCourierName: params.assignedCourierName,
    pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
    receivedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    feeSnapshot,
  };
}

export const INTRO_CAMPAIGN_STATES_META: {
  status: IntroCampaignStatus;
  label: string;
  desc: string;
}[] = [
  { status: 'DRAFT', label: '1. DRAFT (Taslak)', desc: 'Kampanya kuralları tanımlandı, henüz işletmelere açılmadı.' },
  { status: 'SCHEDULED', label: '2. SCHEDULED (Planlandı)', desc: 'Çakışma kontrolü geçti, başlangıç saati bekleniyor.' },
  { status: 'ACTIVE', label: '3. ACTIVE (14 Gün Ücretsiz)', desc: 'İşletme için 14 günlük %0 komisyonlu ücretsiz tanışma aktif.' },
  { status: 'PAUSED', label: '4. PAUSED (Duraklatıldı)', desc: 'Yeni başvuru alımı durduruldu; mevcut işletmelerin hakkı korunur.' },
  { status: 'ENDED', label: '5. ENDED (Süresi Doldu)', desc: '14 günlük tanışma tamamlandı, haftalık üyelik seçimi bekleniyor.' },
  { status: 'CANCELLED', label: '6. CANCELLED (İptal/Red)', desc: 'Mükerrer VKN/IBAN veya politika ihlali nedeniyle kapatıldı.' },
];

export const BUSINESS_SUBSCRIPTION_STATES_META: {
  status: BusinessSubscriptionStatus;
  label: string;
  canCreateBusinessDelivery: boolean;
  desc: string;
}[] = [
  {
    status: 'FREE_INTRO',
    label: 'FREE_INTRO (14 Gün Ücretsiz Tanışma)',
    canCreateBusinessDelivery: true,
    desc: '14 gün boyunca haftalık sabit ücret 0 ₺, sipariş komisyonu %0.',
  },
  {
    status: 'PLAN_SELECTION_REQUIRED',
    label: 'PLAN_SELECTION_REQUIRED (Paket Seçimi Bekleniyor)',
    canCreateBusinessDelivery: false,
    desc: 'Tanışma süresi bitti; otomatik kart çekimi yapılmaz, paket seçimi beklenir.',
  },
  {
    status: 'PAYMENT_PENDING',
    label: 'PAYMENT_PENDING (Havale/EFT Onayı Bekleniyor)',
    canCreateBusinessDelivery: true,
    desc: 'Dekont ve referans kodu yüklendi, Admin MANUAL_APPROVAL kontrolünde.',
  },
  {
    status: 'ACTIVE_MEMBERSHIP',
    label: 'ACTIVE_MEMBERSHIP (Aktif Haftalık Üyelik)',
    canCreateBusinessDelivery: true,
    desc: 'Haftalık sabit SaaS üyeliği aktif, tüm siparişlerde %0 komisyon.',
  },
  {
    status: 'GRACE_PERIOD',
    label: 'GRACE_PERIOD (3 Gün Ek Hoşgörü Süresi)',
    canCreateBusinessDelivery: true,
    desc: 'Yenileme tarihi geçti; operasyonun aksamaması için 3 gün ek süre tanındı.',
  },
  {
    status: 'LIMITED_ACCESS',
    label: 'LIMITED_ACCESS (Kısıtlı Mod — Arşiv & Bireysel Kurye Açık)',
    canCreateBusinessDelivery: false,
    desc: 'Toplu işletme sevkiyatı duraklatıldı; veriler silinmez, bireysel kurye çağrılabilir.',
  },
  {
    status: 'SUSPENDED',
    label: 'SUSPENDED (Askıya Alındı — Sipariş Kilidi)',
    canCreateBusinessDelivery: false,
    desc: 'Ödeme gecikmesi veya güvenlik kuralı nedeniyle BUSINESS_DELIVERY kilitlendi.',
  },
  {
    status: 'CANCELLED',
    label: 'CANCELLED (Üyelik Sonlandırıldı)',
    canCreateBusinessDelivery: false,
    desc: 'İşletme kendi isteğiyle aboneliği kapattı; geçmiş fatura arşivi açık kalır.',
  },
];
