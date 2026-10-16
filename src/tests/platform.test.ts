/**
 * MotoPilot — Otomatik Birim ve İş Kuralı Test Paketi (Bölüm 2 & 3 & GAP-02 Doğrulaması)
 * Çalıştırma: npm test (tsx src/tests/platform.test.ts && tsx src/tests/server.test.ts)
 * Not: Bir test grubu hata aldığında süreç hemen sonlanmaz; tüm gruplar çalıştırılır ve sonuçlar raporlanır.
 */
import assert from 'node:assert/strict';
import {
  roundCurrency,
  calculateHaversineDistanceKm,
  canTransitionRideStatus,
  toRatingNumber,
  toPhoneNumber,
  toCardLastFour,
  toLatitude,
  toLongitude,
  SERVICE_TYPES,
  createZeroCommissionFeeSnapshot,
  evaluateBusinessIntroEligibility,
} from '../types/platform';
import { INITIAL_TARIFFS } from '../data/platformData';
import { api } from '../services/api';
import {
  CUSTOMER_WIREFRAME_SCREENS,
  COURIER_WIREFRAME_SCREENS,
  BUSINESS_WIREFRAME_SCREENS,
  ADMIN_WIREFRAME_SCREENS,
  ALL_WIREFRAME_SCREENS,
} from '../components/wireframes';
import { getScreenTfksSpec } from '../components/wireframes/tfksSpecs';
import {
  buildOptimizedBatchRoute,
  createSimulatedB2BWebhookEvent,
  INTRO_CAMPAIGN_STATES_META,
  BUSINESS_SUBSCRIPTION_STATES_META,
  INITIAL_ZONE_CAPACITY_METRICS,
} from '../services/motopilotEngines';

type GroupResult = {
  name: string;
  passed: boolean;
  error?: unknown;
};

const groupResults: GroupResult[] = [];

function runTest(name: string, fn: () => void) {
  try {
    fn();
    groupResults.push({ name, passed: true });
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    groupResults.push({ name, passed: false, error: err });
    console.error(`❌ [FAIL] ${name}`, err);
  }
}

console.log('🚀 MotoPilot Birim, Finansal, Kapasite ve 42 Ekran Testleri Başlatılıyor...\n');

// 1. Finansal Yuvarlama & Kuruş Hassasiyeti Testi (A8)
runTest('roundCurrency kuruş hassasiyetini ve M0 %0 komisyon tarifesini doğru korur', () => {
  assert.equal(roundCurrency(145.556), 145.56);
  assert.equal(roundCurrency(100.001), 100);
  assert.equal(roundCurrency(0), 0);
  assert.equal(INITIAL_TARIFFS.platformCommissionRate, 0, 'M0 başlangıç komisyon oranı %0 olmalı');
});

// 2. Haversine Küresel Mesafe ve Durum Makinesi Geçiş Testi
runTest('calculateHaversineDistanceKm ve canTransitionRideStatus doğru çalışır', () => {
  const distKm = calculateHaversineDistanceKm(41.0422, 29.0067, 41.0766, 29.0143); // Beşiktaş -> Levent
  assert.ok(distKm > 2 && distKm < 10, 'Beşiktaş - Levent kuş uçuşu mesafe 2-10 km aralığında olmalı');
  assert.equal(canTransitionRideStatus('searching', 'offered'), true);
  assert.equal(canTransitionRideStatus('completed', 'searching'), false);
});

// 3. 18 Alanlı TransactionFeeSnapshot Deterministik %0 Komisyon Testi
runTest('createZeroCommissionFeeSnapshot 18 alanlı M0 %0 komisyon kaydı üretir', () => {
  const snap = createZeroCommissionFeeSnapshot({
    orderId: 'ORD-TEST-2026',
    serviceType: 'BUSINESS_DELIVERY',
    grossAmount: 380,
    businessSubscriptionState: 'FREE_INTRO',
    isFreeIntroApplied: true,
  });
  assert.equal(snap.customerCommissionRate, 0);
  assert.equal(snap.customerCommissionFee, 0);
  assert.equal(snap.providerCommissionRate, 0);
  assert.equal(snap.providerCommissionFee, 0);
  assert.equal(snap.businessPerOrderCommissionFee, 0);
  assert.equal(snap.platformOrderNetRevenue, 0);
  assert.equal(snap.grossTransactionAmount, 380);
  assert.equal(snap.driverNetPayout, 380);
  assert.equal(snap.pricingPolicyVersion, 'M0-ZERO-COMM-v2.4');
  assert.ok(snap.snapshotHash.startsWith('sha256:'));
});

// 4. Telefon Numarası, Kart Son 4 Hane ve Idempotency-Key Koruması Testleri
runTest('toPhoneNumber, toCardLastFour ve ApiClient Idempotency-Key doğrulamaları çalışır', () => {
  assert.equal(toPhoneNumber('+90 532 100 20 30'), '+905321002030');
  assert.equal(toCardLastFour('4543-1234-5678-9012'), '9012');
  const uniqueKey = `IDEMP-${Date.now()}`;
  assert.equal(api.checkIdempotency(uniqueKey), true);
  assert.equal(api.checkIdempotency(uniqueKey), false, 'Aynı Idempotency-Key ikinci kez kabul edilmemeli');
});

// 5. Coğrafi Koordinat ve Puan Sınırlandırma (Branded Types)
runTest('Coğrafi koordinatlar (Latitude/Longitude) ve RatingNumber sınırları korunur', () => {
  assert.equal(toRatingNumber(4.94), 4.9);
  assert.equal(toRatingNumber(6.5), 5);
  assert.equal(toLatitude(41.0082), 41.0082);
  assert.equal(toLongitude(29.0121), 29.0121);
  assert.equal(SERVICE_TYPES.length, 4);
});

// 6. Akıllı Çoklu Paket Birleştirme (Multi-Drop Route Optimizer) Testi
runTest('buildOptimizedBatchRoute mesafe tasarrufu sağlar ve %0 komisyonu korur', () => {
  const batch = buildOptimizedBatchRoute({
    businessId: 'BIZ-01',
    businessName: 'Burger & Co',
    corridorName: 'Beşiktaş · Levent Koridoru',
    packages: [
      {
        id: 'PKG-1',
        trackingCode: 'MP-101',
        recipientName: 'Ali Veli',
        recipientPhone: '+905321112233',
        dropoffAddress: 'Levent Mah. No:10',
      },
      {
        id: 'PKG-2',
        trackingCode: 'MP-102',
        recipientName: 'Ayşe Yılmaz',
        recipientPhone: '+905321112244',
        dropoffAddress: 'Etiler Mah. No:22',
      },
    ],
    prepTimeMinutes: 12,
    subscriptionStatus: 'ACTIVE_MEMBERSHIP',
  });
  assert.equal(batch.stops.length, 2);
  assert.ok(batch.optimizedBatchKm < batch.standaloneTotalKm, 'Optimize rota tekil toplamdan kısa olmalı');
  assert.equal(batch.platformCommissionTl, 0);
  assert.equal(batch.totalGrossFareTl, batch.courierNetPayoutTl);
  assert.equal(batch.feeSnapshot.platformOrderNetRevenue, 0);
});

// 7. Kurumsal B2B Webhook & SaaS Yaşam Döngüsü Durum Makineleri Testi
runTest('B2B Webhook otomatik atama, 6 durumlu IntroCampaign ve 8 durumlu BusinessSubscription çalışır', () => {
  const webhook = createSimulatedB2BWebhookEvent({
    channel: 'YEMEKSEPETI',
    businessId: 'BIZ-01',
    assignedCourierName: 'Burak Yılmaz',
    subscriptionStatus: 'FREE_INTRO',
  });
  assert.equal(webhook.autoDispatched, true);
  assert.equal(webhook.feeSnapshot.grossTransactionAmount, webhook.feeSnapshot.driverNetPayout);
  assert.equal(INTRO_CAMPAIGN_STATES_META.length, 6);
  assert.equal(BUSINESS_SUBSCRIPTION_STATES_META.length, 8);
  assert.ok(INITIAL_ZONE_CAPACITY_METRICS.length >= 3);

  const eligibility = evaluateBusinessIntroEligibility({
    nowIso: '2026-10-14T12:00:00.000Z',
    campaignStartIso: '2026-10-01T00:00:00.000Z',
    campaignEndIso: '2026-10-20T00:00:00.000Z',
    personalIntroEndIso: '2026-10-25T00:00:00.000Z',
    campaignStatus: 'ACTIVE',
  });
  assert.equal(eligibility.isFreeIntroActive, true);
  assert.equal(eligibility.recommendedStatus, 'FREE_INTRO');
});

// 8. 42 İnteraktif Hi-Fi Wireframe Ekranı ve Master TFKŞ Doğrulaması (GAP-02 / EXEC-06)
runTest('42 Hi-Fi Wireframe Ekranı (15 Müşteri + 15 Kurye + 6 İşletme + 6 Admin) eksiksizdir', () => {
  assert.equal(CUSTOMER_WIREFRAME_SCREENS.length, 15, 'Müşteri ekran sayısı 15 olmalı (C-01..C-15)');
  assert.equal(COURIER_WIREFRAME_SCREENS.length, 15, 'Kurye ekran sayısı 15 olmalı (K-01..K-15)');
  assert.equal(BUSINESS_WIREFRAME_SCREENS.length, 6, 'İşletme ekran sayısı 6 olmalı (B-01..B-06)');
  assert.equal(ADMIN_WIREFRAME_SCREENS.length, 6, 'Yönetim ekran sayısı 6 olmalı (A-01..A-06)');
  assert.equal(ALL_WIREFRAME_SCREENS.length, 42, 'Toplam wireframe ekran sayısı 42 olmalı');

  const ids = ALL_WIREFRAME_SCREENS.map((s) => s.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, 42, '42 ekranın tamamı benzersiz ID ye sahip olmalı');

  for (const screen of ALL_WIREFRAME_SCREENS) {
    assert.ok(screen.title.length > 3, `${screen.id} başlığı dolu olmalı`);
    assert.ok(screen.apiEndpoint.length > 3, `${screen.id} API endpoint dolu olmalı`);
    assert.ok(screen.apiPayload.length > 5, `${screen.id} API payload dolu olmalı`);
    assert.ok(Boolean(screen.screenVisual), `${screen.id} görsel bileşeni tanımlı olmalı`);

    const tfks = getScreenTfksSpec(screen.id, screen.title, screen.category);
    assert.ok(tfks.purpose.length > 10, `${screen.id} TFKŞ amacı dolu olmalı`);
    assert.ok(tfks.buttonDirectives.length > 0, `${screen.id} TFKŞ buton talimatları dolu olmalı`);
  }
});

import {
  verifyTripPinGuard,
  verifyTripCompletionGuard,
  verifyDailyClosingGuard,
  sanitizeUserMessageText,
} from '../context/PlatformContext';
import type { RideOrder, TransactionReconciliationRecord } from '../types/platform';

// 9. Lansman Engelleyici 5 Kritik Güvenlik & Durum Makinesi Testi (PIN Bypass, Kanonik Kimlik, Hata Maskeleme, Mükerrer Tahsilat)
runTest('Lansman Blokajları: Boş/Yanlış PIN reddi, Doğrulama öncesi Tamamlama reddi, Kanonik Kurye, Hata Sanitize ve İdempotent Tahsilat', () => {
  const baseOrder: RideOrder = {
    id: 'MP-9901',
    serviceType: 'motosiklet',
    customerName: 'Bedirhan İbanoğlu',
    customerPhone: '+905056779379',
    pickup: { id: 'p1', name: 'Beşiktaş Meydan', address: 'Beşiktaş', lat: 41.0422, lng: 29.0067 },
    dropoff: { id: 'd1', name: 'Levent Metro', address: 'Levent', lat: 41.0766, lng: 29.0143 },
    distanceKm: 4.2,
    durationMin: 12,
    baseFare: 50,
    kmFare: 120,
    surgeMultiplier: 1,
    totalFare: 170,
    platformCommission: 0,
    courierEarnings: 170,
    serviceFeePercent: 0,
    serviceFeeFixed: 0,
    status: 'arrived',
    boardingCode: '3141',
    courierId: 'kurye-1',
    courierName: 'Mert Aksoy',
    assignedCourierId: 'kurye-1',
    assignedVehicleId: '34 BLY 717',
    assignmentVersion: 2,
    verificationStatus: 'pending',
    pinUsed: false,
    createdAt: new Date().toISOString(),
  };

  // 1) Empty PIN & Wrong PIN must fail
  assert.equal(verifyTripPinGuard(baseOrder, '', 'kurye-1').allowed, false, 'Boş PIN reddedilmeli');
  assert.equal(verifyTripPinGuard(baseOrder, '0000', 'kurye-1').allowed, false, 'Yanlış PIN reddedilmeli');
  assert.equal(
    verifyTripPinGuard(baseOrder, 'PICKUP_CONFIRMED', 'kurye-1').allowed,
    false,
    'Yolcu seferinde PICKUP_CONFIRMED ile PIN bypass edilememeli'
  );

  // 2) Completion before PIN verification must fail
  assert.equal(
    verifyTripCompletionGuard(baseOrder, 'kurye-1', []).allowed,
    false,
    'PIN doğrulanmadan ve arrived durumundayken tamamlama reddedilmeli'
  );

  // 3) Unassigned courier action must fail
  assert.equal(
    verifyTripPinGuard(baseOrder, '3141', 'kurye-2').allowed,
    false,
    'Atanmamış kurye PIN doğrulayamaz'
  );

  // 4) Correct PIN allows ARRIVED -> IN_PROGRESS transition
  assert.equal(verifyTripPinGuard(baseOrder, '3141', 'kurye-1').allowed, true, 'Doğru PIN kabul edilmeli');

  const verifiedInProgressOrder: RideOrder = {
    ...baseOrder,
    status: 'in_progress',
    verificationStatus: 'verified',
    verifiedAt: new Date().toISOString(),
    pinUsed: true,
  };

  // Re-using same PIN must fail
  assert.equal(
    verifyTripPinGuard({ ...verifiedInProgressOrder, status: 'arrived' }, '3141', 'kurye-1').allowed,
    false,
    'Tekrar kullanılan PIN reddedilmeli'
  );

  // Completion after verification succeeds once
  assert.equal(
    verifyTripCompletionGuard(verifiedInProgressOrder, 'kurye-1', []).allowed,
    true,
    'Doğrulanmış in_progress sefer tamamlanabilmeli'
  );

  // 5) Duplicate financial posting must fail
  const existingRec: TransactionReconciliationRecord = {
    id: 'REC-MP-9901',
    rideId: 'MP-9901',
    timestamp: new Date().toISOString(),
    paymentMethod: 'card',
    amountCollected: 170,
    collectionChannel: 'simulation_card_pos',
    courierEarnings: 170,
    platformCommission: 0,
    cancellationFeeApplied: 0,
    appliedRule: { ruleCode: 'KURAL-F01-ONAYLI', description: 'Test', isApprovedByUser: true },
    reconciliationStatus: 'balanced',
    idempotencyKey: 'idem_MP-9901_settlement',
    isIdempotentVerified: true,
    notes: 'Test',
  };
  assert.equal(
    verifyTripCompletionGuard(verifiedInProgressOrder, 'kurye-1', [existingRec]).allowed,
    false,
    'Mükerrer tahsilat/mutabakat engellenmeli'
  );

  // 6) Sanitized Firebase/Auth error must never leak email, uid, path, or providerInfo
  const rawLeak =
    'Firestore Error: {"error":"Missing or insufficient permissions.","authInfo":{"userId":"GNwXpvQNFwapZHM02H5LDMzlWaM2","email":"fahrriiban855@gmail.com","providerInfo":[{"providerId":"google.com"}]},"path":"users_public/GNwXpvQNFwapZHM02H5LDMzlWaM2"}';
  const sanitized = sanitizeUserMessageText(rawLeak);
  assert.equal(sanitized.includes('fahrriiban855@gmail.com'), false, 'E-posta sızmamalı');
  assert.equal(sanitized.includes('GNwXpvQNFwapZHM02H5LDMzlWaM2'), false, 'UID sızmamalı');
  assert.equal(sanitized.includes('users_public/'), false, 'Koleksiyon yolu sızmamalı');

  // 7) Paket/İşletme teslimatında PICKUP_CONFIRMED ile arrived -> in_progress geçişi ve TFKS Gün Kapanışı risk kilidi
  const packageOrder: RideOrder = {
    ...baseOrder,
    id: 'MP-PKG-101',
    serviceType: 'kurye',
    verificationStatus: 'not_required',
  };
  assert.equal(
    verifyTripPinGuard(packageOrder, 'PICKUP_CONFIRMED', 'kurye-1').allowed,
    true,
    'Paket teslimatında PICKUP_CONFIRMED ile yola çıkışa izin verilmeli'
  );
  assert.equal(
    verifyDailyClosingGuard({
      hasOpenService: true,
      hasUnapprovedTransfer: false,
      uncollectedCashAmount: 1200,
    }).allowed,
    false,
    'Açık servis emri veya tahsil edilmemiş nakit varken override olmadan gün kapatılamamalı'
  );
  assert.equal(
    verifyDailyClosingGuard({
      hasOpenService: false,
      hasUnapprovedTransfer: false,
      uncollectedCashAmount: 0,
    }).allowed,
    true,
    'Tüm riskler temizlendiğinde gün kapanışı mühürlenebilmeli'
  );
});

const passedCount = groupResults.filter((r) => r.passed).length;
const failedCount = groupResults.length - passedCount;

console.log(`\n📊 Platform Test Özeti: ${passedCount}/${groupResults.length} grup başarılı, ${failedCount} grup başarısız.`);
if (failedCount > 0) {
  process.exitCode = 1;
}
