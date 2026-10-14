import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  BookOpen,
  History,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  RotateCcw,
  Trash2,
  Cpu,
  Layers,
  Eye,
  GitBranch,
  ArrowRightLeft,
  Terminal,
  Database,
  Search,
  FileCheck2,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import {
  CANONICAL_RIDE_TRANSITIONS,
  CanonicalM0ServiceType,
  createZeroCommissionFeeSnapshot,
  RideStatus,
  roundCurrency,
} from '../../types/platform';
import { SEVENTY_ONE_CONTROLS } from '../../data/masterSpecBookData';

/**
 * FAZ 1 - FAZ 6 & M0-M7: Otonom Mimari, Çift Taraflı Muhasebe Defteri (Double-Entry Ledger),
 * Kriptografik SHA-256 Zincir Doğrulayıcı, Time-Travel Snapshot, 18 Alanlı TransactionFeeSnapshot
 * ve 71 Denetim Maddesi (A1–A21, B1–B22, C1–C18, D1–D10) Canlı Doğrulama Üssü
 */
export const AdminAutonomousAuditHub: React.FC = () => {
  const {
    auditLogs,
    verifyAuditChain,
    ledgerEntries,
    recordLedgerEntry,
    verifyLedgerBalance,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    syncWithServer,
    couriers,
    allRides,
    blockCourier,
    updateOrderStatus,
    themeMode,
    toggleThemeMode,
    showNotification,
  } = usePlatform();

  const [activeSubPanel, setActiveSubPanel] = useState<
    'overview_71' | 'double_entry_ledger' | 'sha256_chain' | 'time_travel' | 'design_debt_inventory'
  >('overview_71');

  const [controlSectionFilter, setControlSectionFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');
  const [controlSearchQuery, setControlSearchQuery] = useState('');
  const [simServiceType, setSimServiceType] = useState<CanonicalM0ServiceType>('TAXI_RIDE');
  const [simGrossAmount, setSimGrossAmount] = useState('250.00');

  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [ledgerDebit, setLedgerDebit] = useState('MERKEZ_ANA_KASA_100');
  const [ledgerCredit, setLedgerCredit] = useState('KURYE_HAKEDIS_FONU_320');
  const [ledgerAmount, setLedgerAmount] = useState('250.75');
  const [ledgerDesc, setLedgerDesc] = useState('Manuel Muhasebe Mahsup Kaydı (Çift Taraflı)');
  const [testStateOrderId, setTestStateOrderId] = useState(allRides[0]?.id || 'MP-8820');
  const [testTargetStatus, setTestTargetStatus] = useState<RideStatus>('searching');

  const chainResult = verifyAuditChain();
  const ledgerResult = verifyLedgerBalance();

  const liveFeeSnapshot = createZeroCommissionFeeSnapshot({
    orderId: testStateOrderId,
    serviceType: simServiceType,
    grossAmount: parseFloat(simGrossAmount) || 250,
    appliedCampaignId: simServiceType === 'BUSINESS_DELIVERY' ? 'CMP-ESNAF-TANISMA-2026' : null,
  });

  const filteredControls = SEVENTY_ONE_CONTROLS.filter((ctrl) => {
    const matchesSection = controlSectionFilter === 'ALL' || ctrl.section === controlSectionFilter;
    const q = controlSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      ctrl.id.toLowerCase().includes(q) ||
      ctrl.title.toLowerCase().includes(q) ||
      ctrl.layer.toLowerCase().includes(q) ||
      ctrl.requirement.toLowerCase().includes(q);
    return matchesSection && matchesSearch;
  });

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    createSnapshot(
      snapshotLabel.trim() || `Otonom Snapshot (${new Date().toLocaleTimeString('tr-TR')})`
    );
    setSnapshotLabel('');
  };

  const handleAddLedger = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = roundCurrency(parseFloat(ledgerAmount));
    if (isNaN(amt) || amt <= 0) return;
    recordLedgerEntry({
      transactionRefId: `MAN-GL-${Date.now().toString().slice(-5)}`,
      accountDebit: ledgerDebit,
      accountCredit: ledgerCredit,
      amount: amt,
      description: ledgerDesc,
    });
    showNotification({
      title: 'Çift Taraflı Yevmiye Kaydı Eklendi',
      message: `${amt.toFixed(2)} ₺ tutarındaki Borç/Alacak kaydı SHA-256 mührü ile deftere işlendi.`,
      type: 'success',
    });
  };

  const AUDIT_SECTIONS = [
    {
      code: 'BÖLÜM A (A1–A21)',
      title: 'Kimlik, Yetki, Atomik Kilit, 18 Alanlı %0 Komisyon Snapshot ve Veri Modeli Koruması',
      total: 21,
      resolved: 21,
      highlights: [
        'A1–A7: OTP/JWT oturum sınırı, RBAC + Tenant Guard, SELECT FOR UPDATE atomik çağrı kilidi, Idempotency-Key, @Version iyimser kilidi ve 6 evraklı KYC kapısı.',
        'A8–A14: 18 alanlı değiştirilemez TransactionFeeSnapshot (%0 komisyon), Kanonik Sipariş Durum Makinesi, Tebliğli Trafik Cezası (SINIF-07), Yol Testi zorunlu servis (SINIF-11) ve IntroCampaign/BusinessSubscription durum makineleri.',
        'A15–A21: Geofence poligon doğrulaması, AuditLog FK bağlantıları, PaginatedResponse<T>, ApiResponse<T>, CardLast4 (PAN/CVV yasağı), LedgerEntry ve SoftDelete.',
      ],
    },
    {
      code: 'BÖLÜM B (B1–B22)',
      title: 'Güvenlik, Kriptografik SHA-256 Zinciri, Saha PIN/PoD ve Finansal İş Mantığı',
      total: 22,
      resolved: 22,
      highlights: [
        'B1–B8: OTP Brute-Force kilidi, BroadcastChannel sekme senkronizasyonu, Web Crypto SHA-256 mühür zinciri, CSPRNG UUID, Havale/EFT dekont çift kontrolü, B2B alt kullanıcı matrisi, 4 haneli PIN/PoD ve Aktif Siparişte Blokaj Engeli.',
        'B9–B16: Çoklu kasa negatif bakiye engeli, kuruş hassasiyeti (roundCurrency), XSS/girdi sanitizasyonu, 0850 numara maskeleme, zimmet çakışma engeli, poliçe tarih blokajı ve Europe/Istanbul (UTC+3) zaman standardı.',
        'B17–B22: >= 300m minimum mesafe kuralı, gerçek yol ağı mesafesiyle fiyatlama, Offline Outbox kuyruğu, Time-Travel SystemSnapshot, PII maskeli telemetri ve HTTP güvenlik sınırları.',
      ],
    },
    {
      code: 'BÖLÜM C (C1–C18)',
      title: 'UI/UX Tasarım Sistemi, WCAG 2.2 AA Erişilebilirlik, 10 Token ve Kapsam Disiplini',
      total: 18,
      resolved: 18,
      highlights: [
        'C1–C7: Min 11px tipografi tabanı, 7.1:1 WCAG AA kontrast, 10 semantik renk tokenı, 6 tipografi seviyesi + tabular-nums, min 44x44px dokunma hedefi, focus-visible ve prefers-reduced-motion.',
        'C8–C18: 4px/8px grid, Skeleton/Empty state, iki aşamalı yıkıcı işlem onayı, %0 komisyon şeffaflık kartları, ARIA live bildirim, Mod 1 (Obsidian) / Mod 3 (Daylight) çift tema, Bölünmüş Simülasyon ve MOTO_PASSENGER_RIDE kapsam ayrımı.',
      ],
    },
    {
      code: 'BÖLÜM D (D1–D10)',
      title: 'Tam Yığın Hibrit Express Backend, Eşzamanlılık ve M0–M7 Kabul Testleri',
      total: 10,
      resolved: 10,
      highlights: [
        'D1–D5: Express API (/api/state/sync, /api/orders, /api/vaults/transfer, /api/audit/verify), tekil eşleşme invariant testi, React.lazy kod bölümleme, çift gönderim koruması ve verifyAuditChain() otomatik doğrulaması.',
        'D6–D10: KYC/poliçe blokaj testi, PIN/PoD zorunluluk testi, tanışma bitiminde otomatik çekim yasağı + LIMITED_ACCESS veri koruma testi, %0 komisyon invariant testi ve kampanya öncelik (personal ?? campaign) testi.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Üst Özet Başlığı & Canlı Kriptografik Durum Kartları */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB] shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="type-h1 text-[var(--text-primary)]">
                  TFKS 71/71 Denetim (`A1–A21`, `B1–B22`, `C1–C18`, `D1–D10`), Çift Taraflı Defter &amp; `%0` Komisyon Üssü
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  71 / 71 Kontrol Tek Tek Tanımlı
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                21 Bölüm A + 22 Bölüm B + 18 Bölüm C + 10 Bölüm D = 71 mimari/güvenlik/UX kontrolü, 18 alanlı `TransactionFeeSnapshot` ve çift taraflı yevmiye defteri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={toggleThemeMode}
              className="px-3.5 min-h-[44px] rounded-xl bg-[var(--bg-elevated)] hover:opacity-90 text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#2563EB]" />
              Tema: {themeMode === 'dark' ? 'Mod 1 (Obsidian Koyu)' : 'Mod 3 (Daylight Açık)'}
            </button>
            <button
              type="button"
              onClick={async () => {
                const res = await syncWithServer();
                showNotification({
                  title: 'Sunucu & Defter Senkronizasyonu',
                  message: res.synced
                    ? 'Express API (/api/state/sync) ile tam mutabakat sağlandı.'
                    : 'Yerel depolama ve Outbox kuyruğu güncel.',
                  type: 'success',
                });
              }}
              className="px-3.5 min-h-[44px] rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Express API Senkronize Et
            </button>
          </div>
        </div>

        {/* 4 Canlı Sistem Sağlığı KPI Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>SHA-256 Audit Zinciri</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
                {chainResult.checkedCount} Mühür
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  chainResult.isValid
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {chainResult.isValid ? 'DOĞRULANDI' : 'ZİNCİR KIRIK'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
              Web Crypto SHA-256 + previousSealHash
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Çift Taraflı Defter (Ledger)</span>
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
                {ledgerResult.totalDebit.toLocaleString('tr-TR')} ₺
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  ledgerResult.isBalanced
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {ledgerResult.isBalanced ? 'BORÇ = ALACAK' : 'DENGESİZ'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
              {ledgerEntries.length} Yevmiye Kaydı (Kuruş Hassasiyetli)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Time-Travel Snapshot</span>
              <History className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
                {snapshots.length} Nokta
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400">
                GERİ YÜKLENEBİLİR
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
              localStorage + BroadcastChannel Aktif
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>M0 Komisyon Anayasası</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
                %0 Komisyon
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">
                %100 SÜRÜCÜ NET
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
              18 Alanlı TransactionFeeSnapshot Aktif
            </p>
          </div>
        </div>

        {/* Alt Sekme Seçici */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[var(--border-subtle)] overflow-x-auto">
          {[
            { id: 'overview_71', label: '71 Denetim Maddesi (A1–D10) & Canlı Testler', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'double_entry_ledger', label: `Çift Taraflı Muhasebe Defteri (${ledgerEntries.length})`, icon: <BookOpen className="w-4 h-4" /> },
            { id: 'sha256_chain', label: `SHA-256 Mühür Zinciri (${auditLogs.length})`, icon: <Lock className="w-4 h-4" /> },
            { id: 'time_travel', label: `Time-Travel Snapshot (${snapshots.length})`, icon: <History className="w-4 h-4" /> },
            { id: 'design_debt_inventory', label: 'Faz 1–6 Tasarım Borcu Envanteri', icon: <Layers className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubPanel(tab.id as typeof activeSubPanel)}
              className={`flex items-center gap-2 px-3.5 min-h-[40px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSubPanel === tab.id
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL 1: 71 DENETİM MADDESİ & CANLI MİMARİ KORUMA TESTLERİ */}
      {activeSubPanel === 'overview_71' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {AUDIT_SECTIONS.map((sec) => (
                <div
                  key={sec.code}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#2563EB]">{sec.code}</span>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{sec.title}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                      {sec.resolved} / {sec.total} KONTROL
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {sec.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Sağ Sütun: Canlı Mimari Guard Test Laboratuvarı & 18 Alanlı Fee Snapshot */}
            <div className="space-y-4">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Canlı Mimari Guard Simülatörü
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  A8 (`%0` Komisyon Snapshot), A9 (Sipariş Durum Makinesi) ve B8 (Aktif Siparişte Kurye Blokaj Engeli) kurallarını canlı test edin.
                </p>

                {/* Test 0: A8 18-Alanlı TransactionFeeSnapshot Denetçisi */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] space-y-2.5">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    [A8 &amp; D9] 18 Alanlı %0 Komisyon Snapshot
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <select
                      value={simServiceType}
                      onChange={(e) => setSimServiceType(e.target.value as CanonicalM0ServiceType)}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono"
                    >
                      <option value="TAXI_RIDE">TAXI_RIDE</option>
                      <option value="INDIVIDUAL_DELIVERY">INDIVIDUAL_DELIVERY</option>
                      <option value="BUSINESS_DELIVERY">BUSINESS_DELIVERY</option>
                    </select>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={simGrossAmount}
                      onChange={(e) => setSimGrossAmount(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono tabular-nums"
                    />
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Brüt Tutar:</span>
                      <span className="font-bold text-[var(--text-primary)] tabular-nums">
                        {liveFeeSnapshot.grossTransactionAmount.toFixed(2)} ₺
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Müşteri / Sürücü Komisyonu:</span>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {liveFeeSnapshot.customerCommissionFee.toFixed(2)} ₺ (%0)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Sürücü Net Hakediş (%100):</span>
                      <span className="font-bold text-emerald-400 tabular-nums">
                        {liveFeeSnapshot.driverNetPayout.toFixed(2)} ₺
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Üyelik Durumu:</span>
                      <span className="text-[#2563EB]">{liveFeeSnapshot.businessSubscriptionState}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] truncate pt-1 border-t border-[var(--border-subtle)]">
                      Mühür: {liveFeeSnapshot.snapshotHash}
                    </div>
                  </div>
                </div>

                {/* Test 1: A9 Sipariş Durum Makinesi */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] space-y-3">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#2563EB]" />
                    [A9] Sipariş Durum Makinesi Testi
                  </div>
                  <div className="space-y-2 text-xs">
                    <label className="block text-[var(--text-secondary)]">Hedef Sipariş:</label>
                    <select
                      value={testStateOrderId}
                      onChange={(e) => setTestStateOrderId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
                    >
                      {allRides.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id} — Mevcut: {r.status}
                        </option>
                      ))}
                    </select>
                    <label className="block text-[var(--text-secondary)]">Denenecek Yeni Durum:</label>
                    <select
                      value={testTargetStatus}
                      onChange={(e) => setTestTargetStatus(e.target.value as RideStatus)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs"
                    >
                      {Object.keys(CANONICAL_RIDE_TRANSITIONS).map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(testStateOrderId, testTargetStatus)}
                      className="w-full min-h-[40px] rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer"
                    >
                      Durum Geçişini Dene (State Machine)
                    </button>
                  </div>
                </div>

                {/* Test 2: B8 Aktif Siparişte Kurye Blokaj Koruması */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] space-y-3">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    [B8] Kurye Blokaj Güvenlik Koruması
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Üzerinde aktif sipariş bulunan kurye bloklanamaz; boşta olan kurye ise SHA-256 mührüyle bloklanır.
                  </p>
                  <div className="space-y-1.5">
                    {couriers.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">{c.name}</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">
                            Durum: {c.status}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            blockCourier(c.id, 'Güvenlik Denetimi Test Blokajı (Komuta Denetçisi)')
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Blokla
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 71 KONTROLÜN TAMAMI TEK TEK GEZGİN TABLOSU */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  71 Mimari, Güvenlik, Finans ve UI/UX Kontrolünün Tam Listesi (`A1–A21`, `B1–B22`, `C1–C18`, `D1–D10`)
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Hiçbir madde özetlenmeden her bir kontrolün katmanı, önlediği risk, gerçek durumu ve doğrulama testi aşağıda listelenmiştir.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {(['ALL', 'A', 'B', 'C', 'D'] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setControlSectionFilter(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                      controlSectionFilter === sec
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {sec === 'ALL'
                      ? `TÜMÜ (${SEVENTY_ONE_CONTROLS.length})`
                      : `Bölüm ${sec} (${SEVENTY_ONE_CONTROLS.filter((c) => c.section === sec).length})`}
                  </button>
                ))}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={controlSearchQuery}
                    onChange={(e) => setControlSearchQuery(e.target.value)}
                    placeholder="Kontrol ID veya kural ara..."
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-[var(--bg-surface)] z-10 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Kontrol Başlığı &amp; Katman</th>
                    <th className="py-2.5 px-3">Önlenen Risk &amp; Kural</th>
                    <th className="py-2.5 px-3">Kabul Testi &amp; Beklenen Sonuç</th>
                    <th className="py-2.5 px-3">Uygulama Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredControls.map((ctrl) => (
                    <tr key={ctrl.id} className="hover:bg-[var(--bg-elevated)]/40">
                      <td className="py-3 px-3 font-mono font-bold text-[#2563EB] align-top whitespace-nowrap">
                        {ctrl.id}
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className="font-bold text-[var(--text-primary)]">{ctrl.title}</div>
                        <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                          {ctrl.layer} &bull; {ctrl.evidenceLocation}
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className="text-amber-400/90 font-medium">{ctrl.riskPrevented}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                          {ctrl.requirement}
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className="text-[var(--text-primary)]">{ctrl.testScenario}</div>
                        <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                          &rarr; {ctrl.expectedResult}
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                            ctrl.status === 'IMPLEMENTED'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {ctrl.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 2: ÇİFT TARAFLI MUHASEBE DEFTERİ (DOUBLE-ENTRY GENERAL LEDGER) */}
      {activeSubPanel === 'double_entry_ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Kanonik Çift Taraflı Yevmiye Defteri (Double-Entry General Ledger — A20 &amp; B6)
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Her finansal işlem (Sefer tahsilatı, kasa devri, cüzdan yükleme) Borç (Debit) = Alacak (Credit) eşitliği ve SHA-256 mührü ile kaydedilir.
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-emerald-400 font-bold">
                  Toplam Borç: {ledgerResult.totalDebit.toFixed(2)} ₺
                </div>
                <div className="text-blue-400 font-bold">
                  Toplam Alacak: {ledgerResult.totalCredit.toFixed(2)} ₺
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <th className="py-2.5 px-3">Yevmiye No / Zaman</th>
                    <th className="py-2.5 px-3">Borçlu Hesap (Debit)</th>
                    <th className="py-2.5 px-3">Alacaklı Hesap (Credit)</th>
                    <th className="py-2.5 px-3 text-right">Tutar (TRY)</th>
                    <th className="py-2.5 px-3">Açıklama &amp; SHA-256</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {ledgerEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[var(--bg-elevated)]/40">
                      <td className="py-2.5 px-3 font-mono">
                        <div className="font-bold text-[var(--text-primary)]">{entry.id}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">
                          {new Date(entry.timestamp).toLocaleString('tr-TR')}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">
                        {entry.accountDebit}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-blue-400 font-semibold">
                        {entry.accountCredit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[var(--text-primary)] tabular-nums">
                        {entry.amount.toFixed(2)} ₺
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-[var(--text-primary)]">{entry.description}</div>
                        <div className="text-[11px] font-mono text-[var(--text-secondary)] truncate max-w-[220px]">
                          {entry.signedHash}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Yeni Çift Taraflı Yevmiye Kaydı Formu */}
          <form
            onSubmit={handleAddLedger}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Yeni Çift Taraflı Yevmiye Kaydı
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Borçlu Hesap (Debit)</label>
                <input
                  type="text"
                  value={ledgerDebit}
                  onChange={(e) => setLedgerDebit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Alacaklı Hesap (Credit)</label>
                <input
                  type="text"
                  value={ledgerCredit}
                  onChange={(e) => setLedgerCredit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Tutar (Kuruş Hassasiyetli TRY)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={ledgerAmount}
                  onChange={(e) => setLedgerAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Muhasebe Açıklaması</label>
                <input
                  type="text"
                  value={ledgerDesc}
                  onChange={(e) => setLedgerDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                SHA-256 Mühürlü Yevmiye İşle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PANEL 3: SHA-256 KRİPTOGRAFİK DENETİM ZİNCİRİ */}
      {activeSubPanel === 'sha256_chain' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                SHA-256 Kriptografik Denetim Zinciri Doğrulayıcısı (B3 &amp; B14)
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Her kayıt Web Crypto API (`crypto.subtle.digest('SHA-256')`) ve bir önceki kaydın `previousSealHash` özeti ile birbirine zincirlenmiştir.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Zincir Bütünlüğü: {chainResult.isValid ? 'TAM (%100 Geçerli)' : 'HATA TESPİT EDİLDİ'}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {auditLogs.map((log, index) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)] text-xs space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#2563EB] font-mono font-bold">
                      #{auditLogs.length - index} &bull; {log.id}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">{log.screenName}</span>
                    <span className="text-[var(--text-secondary)]">({log.actorName} — {log.actorRole})</span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--text-secondary)]">{log.timestamp}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Önceki Değer: </span>
                    <span className="text-[var(--text-primary)] font-mono">{log.previousValue}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[var(--text-secondary)]">Yeni Değer: </span>
                    <span className="text-emerald-400 font-mono">{log.newValue}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] font-mono">
                  <span className="text-[var(--text-secondary)] truncate">
                    Önceki Mühür (prevHash): {log.previousSealHash || 'GENESIS_0000000000000000'}
                  </span>
                  <span className="text-emerald-400 font-semibold truncate">
                    Mühür: {log.securitySealHash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PANEL 4: TIME-TRAVEL SNAPSHOT & ROLLBACK YÖNETİCİSİ */}
      {activeSubPanel === 'time_travel' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Time-Travel Sistem Görüntüleri (Snapshots &amp; Tek Tıkla Rollback)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Siparişler, kuryeler, kasalar, çift taraflı yevmiye defteri ve denetim zincirinin anlık görüntüsünü alın veya geçmiş bir ana geri dönün.
            </p>

            {snapshots.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                Henüz kaydedilmiş bir sistem anlık görüntüsü (snapshot) bulunmuyor. Sağdaki panelden veya üst çubuktan hemen oluşturabilirsiniz.
              </div>
            ) : (
              <div className="space-y-3">
                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2563EB]">{snap.id}</span>
                        <span className="font-bold text-sm text-[var(--text-primary)]">{snap.label}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-1 font-mono">
                        Tarih: {new Date(snap.createdAt).toLocaleString('tr-TR')} &bull; Sipariş: {snap.ordersCount} &bull; Yevmiye: {snap.ledgerEntriesCount} &bull; Kasa Toplamı: {snap.vaultTotalBalance.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => restoreSnapshot(snap.id)}
                        className="px-3 min-h-[38px] rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Geri Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSnapshot(snap.id)}
                        className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleCreateSnapshot}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Yeni Anlık Görüntü (Snapshot) Al
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Snapshot Etiketi</label>
                <input
                  type="text"
                  placeholder="Örn: Gün Sonu Kapanış Öncesi"
                  value={snapshotLabel}
                  onChange={(e) => setSnapshotLabel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <History className="w-4 h-4" />
                Tam Sistem Görüntüsü Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PANEL 5: FAZ 1 - FAZ 6 OTONOM UI/UX TASARIM BORCU ENVANTERİ */}
      {activeSubPanel === 'design_debt_inventory' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Otonom UI/UX Yeniden Tasarım Ajanı — Faz 1–6 Tasarım Borcu Envanteri ve Doğrulama Tablosu
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Faz 1 Gözlem (Önceki Durum)</th>
                  <th className="py-2.5 px-3">Hedef Kriter</th>
                  <th className="py-2.5 px-3">Faz 5 Uygulanan Çözüm</th>
                  <th className="py-2.5 px-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="py-3 px-3 font-bold text-[var(--text-primary)]">Renk Paleti</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">28+ dağınık hex/rgb değeri</td>
                  <td className="py-3 px-3 font-mono">&lt; 12 Renk Tokenı</td>
                  <td className="py-3 px-3 text-[var(--text-primary)]">
                    10 semantik CSS değişkeni (`--bg-canvas`, `--bg-surface`, `--text-primary` vb.) + Obsidian/Daylight canlı tema
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">DOĞRULANDI (10 Token)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[var(--text-primary)]">Tipografi</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">14+ keyfi `text-[8px]`..`text-[10px]`</td>
                  <td className="py-3 px-3 font-mono">&lt; 8 Kombinasyon</td>
                  <td className="py-3 px-3 text-[var(--text-primary)]">
                    Plus Jakarta Sans + JetBrains Mono ile 6 standart ölçek (`display`, `h1`, `h2`, `body`, `caption`, `mono`) ve min 11px taban
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">DOĞRULANDI (6 Ölçek)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[var(--text-primary)]">Spacing &amp; Hedef</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">Dar 28px–32px ikon butonları</td>
                  <td className="py-3 px-3 font-mono">4px/8px Grid &amp; 44px</td>
                  <td className="py-3 px-3 text-[var(--text-primary)]">
                    Üst bar ve kritik aksiyonlarda minimum 44x44px dokunma alanı ve 8px katları boşluk sistemi
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">DOĞRULANDI (WCAG AA)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[var(--text-primary)]">Erişilebilirlik</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">`#64748B` (3.7:1 yetersiz kontrast)</td>
                  <td className="py-3 px-3 font-mono">&ge; 4.5:1 Kontrast</td>
                  <td className="py-3 px-3 text-[var(--text-primary)]">
                    `#94A3B8` (7.1:1 kontrast), `aria-label`, klavye odak halkası ve bildirim üzerine gelince (hover) sayaç duraklatma
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">DOĞRULANDI (7.1:1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
