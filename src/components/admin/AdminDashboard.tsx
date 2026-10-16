import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { MapComponent } from '../common/MapComponent';
import {
  Courier,
  RideOrder,
  VehicleAssignment,
  CashVault,
  CashTransferRecord,
  DamageReport,
  WarehousePart,
  ServiceWorkOrder,
  SystemBlockage,
  AuditLogEntry,
  TrafficPenalty,
} from '../../types/platform';
import {
  LayoutDashboard,
  Layers,
  Users,
  Sliders,
  DollarSign,
  ShieldAlert,
  Activity,
  FileCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  X,
  Check,
  Radio,
  Server,
  Zap,
  ClipboardList,
  Wrench,
  Package,
  Lock,
  Unlock,
  AlertOctagon,
  ArrowRightLeft,
  Coins,
  ShieldCheck,
  Sparkles,
  Plus,
  RotateCcw,
  FileText,
  Key,
  Rocket,
  Navigation,
  MapPin,
  Clock,
  Phone,
  UserCheck,
  RefreshCw,
  Send,
  AlertTriangle,
  Award,
  Bike,
  Star,
  Globe,
  Building2,
} from 'lucide-react';
import { LaunchStrategyMatrix } from '../common/LaunchStrategyMatrix';
import { AdminLoyaltyCampaignHub } from './AdminLoyaltyCampaignHub';
import { AdminAuditHub } from './AdminAuditHub';
import { AdminBusinessAclHub } from './AdminBusinessAclHub';
import { AdminAutonomousAuditHub } from './AdminAutonomousAuditHub';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import {
  INITIAL_ZONE_CAPACITY_METRICS,
  WirePaymentSubmission,
  BatchRoutePlanRecord,
} from '../../services/motopilotEngines';

export const AdminDashboard: React.FC = () => {
  const {
    couriers,
    tariffs,
    updateTariffs,
    allRides,
    currentRide,
    platformStats,
    complaints,
    resolveComplaint,
    approveAllPendingPayouts,
    approveCourierDocument,
    toggleCourierVerification,
    toggleCourierPermission,
    // TFKS Operasyon Sınıfları
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
    auditLogs,
    recordAuditLog,
    dailyClosingAudit,
    runDailyClosingCheck,
    courierPenalties,
    showNotification,
    reconciliationRecords,
    pendingPolicyProposals,
    decidePolicyProposal,
    detectedUnapprovedRecords,
    refundUnapprovedRecord,
    cancelRide,
    acceptRide,
    rejectRide,
    arriveAtPickup,
    startTrip,
    completeTrip,
    toggleCourierOnline,
    setActiveCourierId,
    reportEmergencyIncident,
    driverApplications,
    merchantLeads,
    businessAccounts,
  } = usePlatform();

  // Canlı Filo & Sipariş Hızlı Aksiyon Masası State
  const [liveDispatchFilter, setLiveDispatchFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedCourierToAssign, setSelectedCourierToAssign] = useState<string>('');
  const [showAssignCourierModal, setShowAssignCourierModal] = useState<boolean>(false);
  const [fleetTableSearch, setFleetTableSearch] = useState<string>('');
  const [radioBroadcastMsg, setRadioBroadcastMsg] = useState<string>('');
  const [mapStatusFilter, setMapStatusFilter] = useState<'all' | 'available' | 'busy' | 'offline'>('all');
  const [selectedCourierIdForAction, setSelectedCourierIdForAction] = useState<string>(couriers[0]?.id || '');
  const [commandLayoutMode, setCommandLayoutMode] = useState<'split' | 'stacked'>('split');

  const [activeTab, setActiveTab] = useState<
    | 'map'
    | 'lansman'
    | 'zimmet'
    | 'kasa'
    | 'ceza'
    | 'servis'
    | 'blokaj'
    | 'audit'
    | 'closing'
    | 'reconciliation'
    | 'fleet'
    | 'finance'
    | 'tariffs'
    | 'support'
    | 'loyalty'
    | 'website_audit'
    | 'business_subusers'
    | 'autonomous_audit'
  >('map');

  const [selectedCourierForKyc, setSelectedCourierForKyc] = useState<Courier | null>(null);
  const [courierSearch, setCourierSearch] = useState('');
  const [navCategory, setNavCategory] = useState<'all' | 'ops' | 'finance' | 'system'>('all');
  const [navSearch, setNavSearch] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tariffs form state
  const [motoBase, setMotoBase] = useState(tariffs.motorcycleBaseFare);
  const [motoKm, setMotoKm] = useState(tariffs.motorcyclePerKm);
  const [kuryeBase, setKuryeBase] = useState(tariffs.courierBaseFare);
  const [kuryeKm, setKuryeKm] = useState(tariffs.courierPerKm);
  const [commissionRate, setCommissionRate] = useState(tariffs.platformCommissionRate);
  const [surge, setSurge] = useState(tariffs.surgeMultiplier);

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignPlate, setAssignPlate] = useState('34 GTL 55');
  const [assignCourierId, setAssignCourierId] = useState('kurye-3');

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom, setTransferFrom] = useState('kasa-kadikoy');
  const [transferTo, setTransferTo] = useState('kasa-merkez');
  const [transferAmount, setTransferAmount] = useState(3000);
  const [transferJustification, setTransferJustification] = useState('Elden toplanan kurye yevmiyeleri merkez kasaya devri');

  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [workOrderPlate, setWorkOrderPlate] = useState('34 BLY 717');
  const [workOrderFault, setWorkOrderFault] = useState('Ön fren balata değişimi ve 10.000 km bakım');
  const [workOrderMechanic, setWorkOrderMechanic] = useState('Usta İbrahim Kaya');

  const [unlockModalBlockage, setUnlockModalBlockage] = useState<SystemBlockage | null>(null);
  const [unlockNote, setUnlockNote] = useState('İdari teftiş yapıldı, geçici sevk izni verildi.');

  const [closingOverrideNote, setClosingOverrideNote] = useState('');
  const [closingMessage, setClosingMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [auditFilter, setAuditFilter] = useState<string>('all');

  const handleSaveTariffs = (e: React.FormEvent) => {
    e.preventDefault();
    updateTariffs({
      motorcycleBaseFare: Number(motoBase),
      motorcyclePerKm: Number(motoKm),
      courierBaseFare: Number(kuryeBase),
      courierPerKm: Number(kuryeKm),
      platformCommissionRate: Number(commissionRate),
      surgeMultiplier: Number(surge),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const filteredCouriers = couriers.filter(
    (c) =>
      c.name.toLowerCase().includes(courierSearch.toLowerCase()) ||
      c.plate.toLowerCase().includes(courierSearch.toLowerCase()) ||
      c.motorcycle.toLowerCase().includes(courierSearch.toLowerCase())
  );

  const totalPendingPayout = couriers.reduce((sum, c) => sum + c.wallet.pendingPayout, 0);

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'all') return true;
    return log.actionType === auditFilter;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#F5F5F7]">
      {/* Üst Özet Başlık */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0071E3] flex items-center justify-center text-white font-bold">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Yönetim Paneli
            </h1>
            <p className="text-xs text-[#8E8E93]">
              Filo, kasa, vardiya ve operasyon yönetimi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
          <span className="text-[#30D158] font-semibold">%0 Komisyon</span>
          <span aria-hidden="true">·</span>
          <span>{couriers.filter((c) => c.isOnline).length} Aktif Kurye</span>
        </div>
      </div>

      {/* 4 Özet Gösterge Kartı */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1.5">
          <span className="text-xs text-[#94A3B8] font-medium block">Toplam İşlem Hacmi</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {platformStats.totalRevenue.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-[#30D158] font-semibold">
            %100 sürücü/kurye hakedişi
          </div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1.5">
          <span className="text-xs text-[#94A3B8] font-medium block">Kesilen Komisyon (%{tariffs.platformCommissionRate})</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#0A84FF]">
            {platformStats.platformCommissionEarned.toLocaleString('tr-TR')} ₺
          </div>
          <span className="text-[11px] text-[#94A3B8] block">
            Sıfır komisyon modeli
          </span>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1.5">
          <span className="text-xs text-[#8E8E93] font-medium block">Aktif Kurye / Zimmet</span>
          <div className="text-2xl font-bold font-mono text-white">
            {platformStats.activeDriversOnline} <span className="text-sm text-[#8E8E93] font-normal">/ {vehicleAssignments.filter(v => v.shiftStatus === 'active').length} Araç</span>
          </div>
          <span className="text-[11px] text-[#30D158] block font-medium">
            Canlı konum takibi aktif
          </span>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1.5">
          <span className="text-xs text-[#8E8E93] font-medium block">Gün Kapanışı</span>
          <div className="text-xl font-bold font-mono flex items-center gap-2 text-white">
            {dailyClosingAudit.status.includes('sealed') ? (
              <span className="text-[#30D158] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#30D158]" /> KAPALI
              </span>
            ) : (
              <span className="text-[#FF9F0A] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF9F0A]" /> AÇIK
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#8E8E93] block">
            {systemBlockages.filter(b => !b.isUnlocked).length} Aktif Kısıtlama
          </span>
        </div>
      </div>

      {/* Ana İçerik: Sol Menü + Sağ Çalışma Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-3 space-y-2 shadow-xl">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8E8E93]" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Menüde ara..."
              className="w-full bg-[#2C2C2E]/60 border border-white/[0.08] focus:border-[#0071E3] rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-[#8E8E93] focus:outline-none transition-all"
            />
            {navSearch && (
              <button
                onClick={() => setNavSearch('')}
                className="absolute right-2.5 top-2.5 text-[#8E8E93] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06] text-[10px] font-medium">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'ops', label: 'Saha' },
              { id: 'finance', label: 'Finans' },
              { id: 'system', label: 'Ayarlar' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setNavCategory(cat.id as any)}
                className={`py-1.5 rounded-lg text-center transition-all ${
                  navCategory === cat.id
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-1 max-h-[640px] overflow-y-auto pr-0.5">
            {[
              {
                id: 'map',
                title: 'Canlı Harita & Sevk',
                category: 'ops',
                icon: <Layers className="w-4 h-4 text-[#0A84FF]" />,
                badge: currentRide ? 'Aktif' : undefined,
                badgeColor: 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/40',
              },
              {
                id: 'zimmet',
                title: 'Zimmet & Vardiya',
                category: 'ops',
                icon: <ClipboardList className="w-4 h-4 text-[#30D158]" />,
                badge: `${vehicleAssignments.length}`,
                badgeColor: 'bg-white/[0.08] text-[#8E8E93] border-white/[0.1]',
              },
              {
                id: 'fleet',
                title: 'Kuryeler & Belgeler',
                category: 'ops',
                icon: <Users className="w-4 h-4 text-[#0A84FF]" />,
                badge: `${couriers.length}`,
                badgeColor: 'bg-white/[0.08] text-[#8E8E93] border-white/[0.1]',
              },
              {
                id: 'servis',
                title: 'Servis & Bakım',
                category: 'ops',
                icon: <Wrench className="w-4 h-4 text-[#FF9F0A]" />,
                badge: `${serviceWorkOrders.filter((w) => w.status === 'in_progress').length}`,
                badgeColor: 'bg-white/[0.08] text-[#8E8E93] border-white/[0.1]',
              },
              {
                id: 'support',
                title: 'Destek & Şikayet',
                category: 'ops',
                icon: <ShieldAlert className="w-4 h-4 text-[#FF453A]" />,
                badge: complaints.filter((c) => c.status === 'open').length > 0 ? 'Açık' : undefined,
                badgeColor: 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/40',
              },
              {
                id: 'kasa',
                title: 'Kasa & Mutabakat',
                category: 'finance',
                icon: <Coins className="w-4 h-4 text-[#FFD60A]" />,
                badge: cashTransfers.some((t) => t.status === 'pending_approval') ? 'Onay' : undefined,
                badgeColor: 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/40',
              },
              {
                id: 'ceza',
                title: 'Ceza & Hasar',
                category: 'finance',
                icon: <AlertCircle className="w-4 h-4 text-[#FF453A]" />,
                badge: `${courierPenalties.length}`,
                badgeColor: 'bg-[#FF453A]/15 text-[#FF453A] border-[#FF453A]/30',
              },
              {
                id: 'finance',
                title: 'Hakediş Ödemeleri',
                category: 'finance',
                icon: <DollarSign className="w-4 h-4 text-[#30D158]" />,
                badge: `${totalPendingPayout} ₺`,
                badgeColor: 'bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30 font-mono font-bold',
              },
              {
                id: 'closing',
                title: 'Gün Kapanışı',
                category: 'finance',
                icon: <FileCheck className="w-4 h-4 text-[#30D158]" />,
                badge: undefined,
                badgeColor: '',
              },
              {
                id: 'reconciliation',
                title: 'Uzlaşma Kayıtları',
                category: 'finance',
                icon: <ShieldCheck className="w-4 h-4 text-[#0A84FF]" />,
                badge: `${reconciliationRecords.length}`,
                badgeColor: 'bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30',
              },
              {
                id: 'loyalty',
                title: 'Kampanya & Kupon',
                category: 'finance',
                icon: <Award className="w-4 h-4 text-[#FFD60A]" />,
                badge: undefined,
                badgeColor: '',
              },
              {
                id: 'blokaj',
                title: 'Kısıtlamalar',
                category: 'system',
                icon: <Lock className="w-4 h-4 text-[#FF453A]" />,
                badge: `${systemBlockages.filter((b) => !b.isUnlocked).length}`,
                badgeColor: 'bg-[#FF453A]/15 text-[#FF453A] border-[#FF453A]/30 font-semibold',
              },
              {
                id: 'audit',
                title: 'İşlem Kayıtları',
                category: 'system',
                icon: <Activity className="w-4 h-4 text-[#30D158]" />,
                badge: undefined,
                badgeColor: '',
              },
              {
                id: 'business_subusers',
                title: 'İşletme Yetkileri',
                category: 'system',
                icon: <Building2 className="w-4 h-4 text-[#BF5AF2]" />,
                badge: undefined,
                badgeColor: '',
              },
              {
                id: 'tariffs',
                title: 'Tarife Ayarları',
                category: 'system',
                icon: <Sliders className="w-4 h-4 text-[#0A84FF]" />,
                badge: undefined,
                badgeColor: '',
              },
            ]
              .filter((item) => {
                if (navCategory !== 'all' && item.category !== navCategory) return false;
                if (navSearch.trim() && !item.title.toLowerCase().includes(navSearch.toLowerCase())) return false;
                return true;
              })
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full min-h-[46px] p-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all ${
                    activeTab === item.id
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border whitespace-nowrap shrink-0 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* Right Content Viewport - Apple Elevated Panel */}
        <div className="lg:col-span-9 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl space-y-5">
          {/* TAB: LANSMAN STRATEJİSİ & FAZ KİLİDİ */}
          {activeTab === 'lansman' && (
            <div className="space-y-6 animate-in fade-in-50">
              <LaunchStrategyMatrix />
            </div>
          )}

          {/* TAB 1: FLEET RADAR, LIVE DISPATCH & ORDER ACTION DESK (BÜTÜNLEŞİK KOMUTA MASASI) */}
          {activeTab === 'map' && (() => {
            const selectedCourier = couriers.find((c) => c.id === selectedCourierIdForAction) || couriers[0];
            const isAssignedToActive = currentRide && currentRide.courierId === selectedCourier?.id && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';
            const availableCouriers = couriers.filter((c) => c.isOnline && (!currentRide || currentRide.courierId !== c.id));
            const busyCouriers = couriers.filter((c) => (currentRide && currentRide.courierId === c.id && currentRide.status !== 'completed' && currentRide.status !== 'cancelled') || c.status === 'busy');
            const offlineCouriers = couriers.filter((c) => !c.isOnline);

            return (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 1. Üst Bütünleşik Komuta Başlığı & Canlı Durum Filtreleri */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div>
                    <div className="text-[11px] font-semibold text-[#0A84FF] tracking-wide mb-0.5">
                      Bütünleşik Komuta ve Sevk Merkezi
                    </div>
                    <h2 className="text-lg font-bold text-white font-display">
                      Canlı Filo Radarı & Hızlı Aksiyon Masası
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Kuryelerin anlık konum ve durumları (boşta, seferde, molada) sevk masasıyla senkronize canlı yönetilir.
                    </p>
                  </div>

                  {/* Kurye Durum Filtreleri (Boşta, Seferde, Molada) + Düzen Seçici */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Status Filter Buttons */}
                    <div className="flex items-center gap-1 p-1 bg-[#2C2C2E]/60 rounded-xl border border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setMapStatusFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          mapStatusFilter === 'all'
                            ? 'bg-white text-black font-bold shadow-sm'
                            : 'text-[#8E8E93] hover:text-white'
                        }`}
                      >
                        Tümü ({couriers.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setMapStatusFilter('available')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                          mapStatusFilter === 'available'
                            ? 'bg-[#30D158] text-black font-bold shadow-sm'
                            : 'text-[#30D158] hover:bg-[#30D158]/10'
                        }`}
                        title="Boşta / Göreve Hazır Sürücüler"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Boşta ({availableCouriers.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMapStatusFilter('busy')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                          mapStatusFilter === 'busy'
                            ? 'bg-[#0A84FF] text-white font-bold shadow-sm'
                            : 'text-[#0A84FF] hover:bg-[#0A84FF]/10'
                        }`}
                        title="Seferde / Aktif Görevdeki Sürücüler"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>Seferde ({busyCouriers.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMapStatusFilter('offline')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                          mapStatusFilter === 'offline'
                            ? 'bg-[#8E8E93] text-black font-bold shadow-sm'
                            : 'text-[#8E8E93] hover:bg-white/[0.08]'
                        }`}
                        title="Molada / Çevrim Dışı Sürücüler"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>Molada ({offlineCouriers.length})</span>
                      </button>
                    </div>

                    {/* Layout Mode Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] text-[10px]">
                      <button
                        type="button"
                        onClick={() => setCommandLayoutMode('split')}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          commandLayoutMode === 'split'
                            ? 'bg-white text-black font-bold shadow-sm'
                            : 'text-[#8E8E93] hover:text-white'
                        }`}
                        title="Yan Yana Bölünmüş Konsol"
                      >
                        Bölünmüş
                      </button>
                      <button
                        type="button"
                        onClick={() => setCommandLayoutMode('stacked')}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          commandLayoutMode === 'stacked'
                            ? 'bg-white text-black font-bold shadow-sm'
                            : 'text-[#8E8E93] hover:text-white'
                        }`}
                        title="Tam Boy Harita Düzeni"
                      >
                        Geniş
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. BÜTÜNLEŞİK KONSOL: CANLI HARİTA & HIZLI AKSİYON MASASI (DUAL-PANE) */}
                <div className={`grid grid-cols-1 ${commandLayoutMode === 'split' ? 'xl:grid-cols-12 gap-5' : 'gap-5'} items-start`}>
                  {/* SOL PANEL: CANLI FİLO HARİTASI */}
                  <div className={`${commandLayoutMode === 'split' ? 'xl:col-span-7' : 'w-full'} space-y-3`}>
                    <div className="rounded-[28px] overflow-hidden border border-white/[0.1] shadow-2xl relative bg-[#121214]">
                      <MapComponent
                        couriers={couriers}
                        currentRide={currentRide}
                        heightClass={commandLayoutMode === 'split' ? 'h-[580px]' : 'h-[450px]'}
                        statusFilter={mapStatusFilter}
                        focusedCourierId={selectedCourierIdForAction}
                        onSelectCourier={(courierId) => {
                          setSelectedCourierIdForAction(courierId);
                          setSelectedCourierToAssign(courierId);
                          showNotification({
                            title: 'Kurye Odaklandı',
                            message: `Haritada seçilen kurye (${couriers.find(c => c.id === courierId)?.name}) hızlı aksiyon masasına bağlandı.`,
                            type: 'info',
                          });
                        }}
                        showAllStatuses={true}
                      />

                      {/* Floating HUD: Legend & Active Selection Badge */}
                      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
                        <div className="bg-[#161618]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl px-3 py-1.5 shadow-2xl flex items-center gap-2.5 text-[11px] pointer-events-auto">
                          <span className="text-[#8E8E93] font-semibold">Lejant:</span>
                          <span className="flex items-center gap-1 text-[#30D158] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#30D158] animate-ping" />
                            Boşta
                          </span>
                          <span className="flex items-center gap-1 text-[#0A84FF] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-pulse" />
                            Seferde
                          </span>
                          <span className="flex items-center gap-1 text-[#8E8E93] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#636366]" />
                            Molada
                          </span>
                        </div>

                        {selectedCourier && (
                          <div className="bg-[#0071E3]/90 text-white backdrop-blur-xl border border-white/[0.2] rounded-2xl px-3 py-1.5 shadow-2xl flex items-center gap-2 text-xs font-bold pointer-events-auto animate-in fade-in duration-150">
                            <span>Seçili:</span>
                            <span className="font-mono">{selectedCourier.plate}</span>
                            <span className="text-white/80">({selectedCourier.name})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SAĞ PANEL: BÜTÜNLEŞİK HIZLI AKSİYON MASASI */}
                  <div className={`${commandLayoutMode === 'split' ? 'xl:col-span-5' : 'w-full'} space-y-4`}>
                    {/* BİLEŞEN A: CANLI ÇAĞRI & SİPARİŞ SEVK MASASI */}
                    <div className="p-4.5 bg-[#1C1C1E]/90 backdrop-blur-2xl border border-white/[0.1] rounded-[26px] space-y-3.5 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0071E3]/20 border border-[#0071E3]/30 text-[#0A84FF] flex items-center justify-center font-bold text-xs">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            Canlı Sipariş Sevk Masası
                          </h3>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled'
                            ? 'bg-[#30D158]/15 border-[#30D158]/30 text-[#30D158]'
                            : 'bg-white/[0.06] border-white/[0.08] text-[#8E8E93]'
                        }`}>
                          {currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled' ? '● 1 Aktif Sefer' : '○ Boşta'}
                        </span>
                      </div>

                      {/* Active Ride Card */}
                      {currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled' ? (
                        <div className="p-3.5 bg-black/40 border border-[#0071E3]/30 rounded-2xl space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#0A84FF] text-xs">
                              {currentRide.id} · {currentRide.serviceType === 'motosiklet' ? 'TAG Yolcu' : 'Moto Paket'}
                            </span>
                            <span className="font-mono font-extrabold text-white text-sm">
                              {currentRide.totalFare} ₺
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                            <div className="flex items-center gap-1.5 text-zinc-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                              <strong className="text-white">Alış:</strong> {currentRide.pickup.address}
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A]" />
                              <strong className="text-white">Varış:</strong> {currentRide.dropoff.address}
                            </div>
                            <div className="text-[10px] text-[#8E8E93] pt-0.5 flex items-center justify-between">
                              <span>Yolcu: {currentRide.customerName} ({currentRide.customerPhone})</span>
                              <span className="font-mono text-[#0A84FF]">
                                Atanan: {currentRide.courierName || 'Bekliyor'} • {currentRide.assignedVehicleId || '-'} (v{currentRide.assignmentVersion || 1})
                              </span>
                            </div>
                          </div>

                          {/* Sevk Butonları: Haritadaki Seçili Kuryeyi Doğrudan Ata */}
                          <div className="space-y-2 pt-1">
                            {selectedCourier && (!currentRide.courierId || currentRide.courierId !== selectedCourier.id) && (
                              <button
                                type="button"
                                onClick={() => {
                                  assignCourierToOrder(currentRide.id, selectedCourier.id);
                                  showNotification({
                                    title: 'Haritadan Kurye Sevk Edildi (Kanonik Atama)',
                                    message: `${currentRide.id} seferi haritada seçtiğiniz ${selectedCourier.name} (${selectedCourier.plate}) kuryesine kanonik olarak atandı.`,
                                    type: 'success',
                                  });
                                }}
                                className="w-full min-h-[44px] py-2.5 px-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                              >
                                <UserCheck className="w-4 h-4" />
                                <span>Haritadan Seçili Kuryeyi Bu Siparişe Ata: {selectedCourier.name} ({selectedCourier.plate})</span>
                              </button>
                            )}

                            {/* Durum İlerletme Butonları */}
                            <div className="grid grid-cols-2 gap-1.5">
                              {currentRide.status === 'accepted' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    arriveAtPickup();
                                    showNotification({
                                      title: 'Durum İlerletildi',
                                      message: 'Kurye alış noktasına ulaştı olarak güncellendi.',
                                      type: 'info',
                                    });
                                  }}
                                  className="py-2.5 bg-[#BF5AF2]/20 hover:bg-[#BF5AF2]/30 text-[#BF5AF2] border border-[#BF5AF2]/40 font-bold text-xs rounded-xl transition-all active:scale-95"
                                >
                                  Noktaya Vardı
                                </button>
                              )}

                              {currentRide.status === 'arrived' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ok = startTrip(currentRide.boardingCode || '');
                                    if (ok) {
                                      showNotification({
                                        title: 'Sefer Başlatıldı (PIN Doğrulandı)',
                                        message: 'Yolcu biniş PIN kodu doğrulanarak sefer seyir halinde başlatıldı.',
                                        type: 'success',
                                      });
                                    }
                                  }}
                                  className="py-2.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                                >
                                  PIN Doğrula & Başlat ({currentRide.boardingCode})
                                </button>
                              )}

                              {currentRide.status === 'in_progress' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    completeTrip();
                                  }}
                                  className="col-span-2 py-2.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                                >
                                  Seferi Tamamlandı Yap
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  cancelRide();
                                  showNotification({
                                    title: 'Sefer İptal Edildi',
                                    message: `${currentRide.id} çağrısı operasyon tarafından sonlandırıldı.`,
                                    type: 'warning',
                                  });
                                }}
                                className="py-2.5 bg-[#FF453A]/15 hover:bg-[#FF453A]/25 text-[#FF453A] border border-[#FF453A]/30 font-bold text-xs rounded-xl transition-all active:scale-95"
                              >
                                Acil İptal
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-black/40 border border-white/[0.04] rounded-2xl text-center space-y-1.5 text-xs text-[#8E8E93]">
                          <div className="flex items-center justify-center gap-1.5 text-[#30D158] font-semibold text-xs">
                            <span className="w-2 h-2 rounded-full bg-[#30D158]" />
                            <span>Tüm Çağrılar Sevk Edildi</span>
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            Yeni sipariş geldiğinde harita rotasıyla birlikte anında bu sevk masasında belirecektir.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* BİLEŞEN B: HARİTADAN SEÇİLİ KURYE DETAY & MÜDAHALE KARTI */}
                    {selectedCourier && (
                      <div className="p-4.5 bg-[#1C1C1E]/90 backdrop-blur-2xl border border-white/[0.1] rounded-[26px] space-y-3 shadow-xl text-xs">
                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-sm font-bold">
                              <Bike className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-white text-xs">{selectedCourier.name}</h4>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.08] text-[#8E8E93] font-mono">
                                  Haritada Seçili Kurye
                                </span>
                              </div>
                              <span className="text-[10px] text-[#0A84FF] font-mono">
                                {selectedCourier.plate} · {selectedCourier.motorcycle}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                            isAssignedToActive || selectedCourier.status === 'busy'
                              ? 'bg-[#0A84FF]/20 text-[#0A84FF] border-[#0A84FF]/40'
                              : selectedCourier.isOnline
                              ? 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/40'
                              : 'bg-white/[0.06] text-[#8E8E93] border-white/[0.08]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedCourier.isOnline ? 'bg-current animate-pulse' : 'bg-zinc-500'}`} />
                            <span>
                              {isAssignedToActive
                                ? 'SEFERDE'
                                : selectedCourier.isOnline
                                ? 'BOŞTA (GÖREVE HAZIR)'
                                : 'MOLADA / GARAJDA'}
                            </span>
                          </span>
                        </div>

                        {/* Telemetry Summary */}
                        <div className="grid grid-cols-3 gap-2 text-[11px] bg-black/40 p-2.5 rounded-xl border border-white/[0.04]">
                          <div>
                            <span className="text-[#8E8E93] text-[10px] block">Puan</span>
                            <span className="font-bold text-[#FF9F0A] flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#FF9F0A]" /> {selectedCourier.rating}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#8E8E93] text-[10px] block">Tamamlanan</span>
                            <span className="font-mono text-white font-bold">{selectedCourier.totalTrips} Sefer</span>
                          </div>
                          <div>
                            <span className="text-[#8E8E93] text-[10px] block">Hizmet Modu</span>
                            <span className="font-semibold text-zinc-300 truncate block">
                              {selectedCourier.equipmentMode === 'passenger_and_courier' ? 'Yolcu+Paket' : 'Paket'}
                            </span>
                          </div>
                        </div>

                        {/* Direct Fast Actions for Selected Courier */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              toggleCourierOnline(selectedCourier.id);
                              showNotification({
                                title: 'Kontak Durumu Değiştirildi',
                                message: `${selectedCourier.name} (${selectedCourier.plate}) ${selectedCourier.isOnline ? 'molaya alındı' : 'çevrim içi yapıldı'}.`,
                                type: 'info',
                              });
                            }}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                              selectedCourier.isOnline
                                ? 'bg-white/[0.08] hover:bg-white/[0.12] border-white/[0.1] text-white'
                                : 'bg-[#30D158]/20 hover:bg-[#30D158]/30 border-[#30D158]/40 text-[#30D158]'
                            }`}
                          >
                            <span>{selectedCourier.isOnline ? 'Molaya Al (Offline)' : 'Göreve Al (Online)'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveCourierId(selectedCourier.id);
                              showNotification({
                                title: 'Terminal Seçildi',
                                message: `Aktif kurye terminali ${selectedCourier.name} olarak belirlendi.`,
                                type: 'info',
                              });
                            }}
                            className="py-2 px-2.5 bg-[#0071E3]/20 hover:bg-[#0071E3]/30 border border-[#0071E3]/40 text-[#0A84FF] rounded-xl text-xs font-bold transition-all"
                          >
                            <span>Terminal Yap</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* BİLEŞEN C: HIZLI TELSİZ ANONS BARI */}
                    <div className="p-3.5 bg-[#1C1C1E]/90 border border-white/[0.08] rounded-2xl flex items-center gap-2 shadow-lg">
                      <div className="w-7 h-7 rounded-lg bg-[#FF9F0A]/20 border border-[#FF9F0A]/30 text-[#FF9F0A] flex items-center justify-center font-bold text-xs shrink-0">
                        <Radio className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={radioBroadcastMsg}
                        onChange={(e) => setRadioBroadcastMsg(e.target.value)}
                        placeholder="Sahaya anlık telsiz anonsu geç..."
                        className="flex-1 bg-[#2C2C2E]/60 border border-white/[0.08] focus:border-[#FF9F0A] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#8E8E93] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!radioBroadcastMsg.trim()) return;
                          showNotification({
                            title: 'Operasyon Telsiz Anonsu',
                            message: radioBroadcastMsg,
                            type: 'info',
                          });
                          setRadioBroadcastMsg('');
                        }}
                        className="px-3 py-1.5 bg-[#FF9F0A] hover:bg-[#FFB340] text-black font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Yayınla</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. CANLI KURYELER TELEMETRİSİ & FİLO LİSTESİ (HARİTAYLA TAM SENKRONİZE TABLO) */}
                <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-[28px] space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#30D158]/20 border border-[#30D158]/30 text-[#30D158] flex items-center justify-center font-bold text-sm">
                        <Bike className="w-4 h-4 text-[#30D158]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Canlı Filo Telemetri & Durum Listesi</h3>
                        <span className="text-[11px] text-[#8E8E93]">
                          Satıra tıklayarak kuryeyi haritada ve hızlı aksiyon masasında odaklayabilirsiniz
                        </span>
                      </div>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8E8E93]" />
                      <input
                        type="text"
                        value={fleetTableSearch}
                        onChange={(e) => setFleetTableSearch(e.target.value)}
                        placeholder="Plaka veya kurye adı ara..."
                        className="w-full bg-[#2C2C2E]/60 border border-white/[0.08] focus:border-[#0071E3] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#8E8E93] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Courier Fleet Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/60 text-[#8E8E93] uppercase font-mono text-[10px] border-b border-white/[0.06]">
                        <tr>
                          <th className="p-3">Kurye & Plaka</th>
                          <th className="p-3">Kontak & Durum</th>
                          <th className="p-3">Mevcut Görev</th>
                          <th className="p-3">Hız & Telemetri</th>
                          <th className="p-3">Hizmet Modu</th>
                          <th className="p-3 text-right">Eylem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {couriers
                          .filter((c) => {
                            const matchesSearch =
                              c.name.toLowerCase().includes(fleetTableSearch.toLowerCase()) ||
                              c.plate.toLowerCase().includes(fleetTableSearch.toLowerCase());

                            if (!matchesSearch) return false;

                            const isAssigned = currentRide && currentRide.courierId === c.id && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';
                            const isBusy = isAssigned || c.status === 'busy';

                            if (mapStatusFilter === 'available') return c.isOnline && !isBusy;
                            if (mapStatusFilter === 'busy') return isBusy;
                            if (mapStatusFilter === 'offline') return !c.isOnline;
                            return true;
                          })
                          .map((c) => {
                            const isAssigned = currentRide && currentRide.courierId === c.id && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';
                            const isBusy = isAssigned || c.status === 'busy';
                            const isSelected = selectedCourierIdForAction === c.id;

                            return (
                              <tr
                                key={c.id}
                                onClick={() => {
                                  setSelectedCourierIdForAction(c.id);
                                  setSelectedCourierToAssign(c.id);
                                }}
                                className={`cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-[#0071E3]/15 border-l-2 border-[#0071E3]'
                                    : 'hover:bg-white/[0.03]'
                                }`}
                              >
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-bold ${
                                      isSelected ? 'bg-[#0071E3]/20 border-[#0071E3]' : 'bg-white/[0.08] border-white/[0.08]'
                                    }`}>
                                      <Bike className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <span className="font-bold text-white block">{c.name}</span>
                                      <span className="text-[10px] font-mono text-[#0A84FF]">
                                        {c.plate} · {c.motorcycle}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 border ${
                                    c.isOnline
                                      ? 'bg-[#30D158]/15 border-[#30D158]/30 text-[#30D158]'
                                      : 'bg-white/[0.06] border-white/[0.08] text-[#8E8E93]'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.isOnline ? 'bg-[#30D158] animate-pulse' : 'bg-zinc-500'}`} />
                                    <span>{c.isOnline ? 'ÇEVRİM İÇİ' : 'MOLADA'}</span>
                                  </span>
                                </td>

                                <td className="p-3">
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                                    isAssigned
                                      ? 'bg-[#0071E3]/20 text-[#0A84FF] border border-[#0071E3]/30'
                                      : c.isOnline
                                      ? 'bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20'
                                      : 'bg-black text-[#8E8E93] border border-white/[0.06]'
                                  }`}>
                                    {isAssigned ? `SEFERDE (${currentRide?.id})` : c.isOnline ? 'BOŞTA' : 'KAPALI'}
                                  </span>
                                </td>

                                <td className="p-3 font-mono">
                                  <div className="space-y-0.5">
                                    <span className="text-white text-xs block">
                                      {isAssigned ? '42 km/s (Seyirde)' : c.isOnline ? '0 km/s (Rölanti)' : '0 km/s (Kapalı)'}
                                    </span>
                                    <span className="text-[10px] text-[#8E8E93] flex items-center gap-1">
                                      <Star className="w-2.5 h-2.5 text-[#FF9F0A] fill-[#FF9F0A]" />
                                      {c.rating} · {c.totalTrips} Sefer
                                    </span>
                                  </div>
                                </td>

                                <td className="p-3">
                                  <span className="text-[11px] font-semibold text-zinc-300">
                                    {c.equipmentMode === 'passenger_and_courier' ? 'Yolcu + Paket' : 'Paket'}
                                  </span>
                                </td>

                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCourierIdForAction(c.id);
                                      setSelectedCourierToAssign(c.id);
                                      showNotification({
                                        title: 'Kurye Odaklandı',
                                        message: `${c.name} (${c.plate}) haritada ve hızlı masada seçildi.`,
                                        type: 'info',
                                      });
                                    }}
                                    className="px-2.5 py-1.5 bg-white/[0.08] hover:bg-[#0071E3] text-white font-semibold text-[10px] rounded-lg border border-white/[0.08] transition-all"
                                  >
                                    Masaya Seç
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. HİBRİT KAPASİTE DENGELEME MOTORU (GAP-03) & B2B HAVALE/EFT ONAY MASASI (GAP-01) */}
                {(() => {
                  const zoneMetrics = INITIAL_ZONE_CAPACITY_METRICS;
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Hibrit Kapasite Dengeleme Telemetrisi */}
                      <div className="p-5 bg-[#1C1C1E]/85 border border-white/[0.08] rounded-[28px] space-y-3 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-[#0071E3]/20 text-[#0A84FF] border border-[#0071E3]/30 font-mono text-[9px] font-bold">
                              GAP-03 · HYBRID CAPACITY ENGINE
                            </span>
                            <h3 className="text-sm font-bold text-white mt-1">
                              Bölgesel Hibrit Kapasite Dengeleme Algoritması
                            </h3>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#30D158] bg-[#30D158]/15 px-2.5 py-1 rounded-xl border border-[#30D158]/30">
                            +%38 Doluluk Artışı
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {zoneMetrics.map((zm) => (
                            <div
                              key={zm.zoneId}
                              className="p-3 bg-black/50 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{zm.zoneName}</span>
                                  <span className="px-2 py-0.5 rounded bg-white/[0.08] text-[10px] font-mono text-[#0A84FF]">
                                    {zm.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#8E8E93] mt-0.5">
                                  {zm.recommendedShiftToDelivery > 0
                                    ? `${zm.idleDriversCount} boş sürücüden ${zm.recommendedShiftToDelivery} birimi paket dağıtımına yönlendir`
                                    : 'Kapasite dengede · ek yönlendirme gerekmiyor'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] tabular-nums">
                                <span className="px-2 py-1 rounded bg-white/[0.04] text-zinc-300">
                                  Yolcu: {zm.passengerDemandIndex}
                                </span>
                                <span className="px-2 py-1 rounded bg-white/[0.04] text-zinc-300">
                                  Paket: {zm.packageDemandIndex}
                                </span>
                                <span className="px-2 py-1 rounded bg-[#30D158]/15 text-[#30D158] font-bold">
                                  +%{zm.estimatedHourlyUtilizationGainPercent}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Çoklu Paket Birleştirme & SaaS Abonelik Özeti */}
                      <div className="p-5 bg-[#1C1C1E]/85 border border-white/[0.08] rounded-[28px] space-y-3 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 font-mono text-[9px] font-bold">
                              GAP-01 & GAP-04 · SAAS & MULTI-DROP
                            </span>
                            <h3 className="text-sm font-bold text-white mt-1">
                              B2B SaaS Abonelik & Akıllı Güzergah Özeti
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">
                            0% Komisyon İnvaryantı Aktif
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center font-mono">
                          <div className="p-3 bg-black/50 border border-white/[0.06] rounded-2xl">
                            <span className="text-[10px] text-[#8E8E93] block">Müşteri / Kurye Kesinti</span>
                            <strong className="text-sm text-[#30D158]">0.00 ₺ (%0)</strong>
                          </div>
                          <div className="p-3 bg-black/50 border border-white/[0.06] rounded-2xl">
                            <span className="text-[10px] text-[#8E8E93] block">B2B SaaS Modeli</span>
                            <strong className="text-sm text-white">Haftalık Sabit</strong>
                          </div>
                          <div className="p-3 bg-black/50 border border-white/[0.06] rounded-2xl">
                            <span className="text-[10px] text-[#8E8E93] block">Çoklu Paket Limiti</span>
                            <strong className="text-sm text-[#0A84FF]">Maks. 3 Durak</strong>
                          </div>
                        </div>

                        <div className="p-3 bg-black/40 border border-white/[0.06] rounded-2xl text-[11px] text-[#8E8E93] leading-relaxed">
                          İşletme Portalı üzerinden gönderilen <strong className="text-white">Havale/EFT dekont bildirimleri</strong> (referans kodu doğrulamalı) ve <strong className="text-white">Çoklu Paket Birleştirme (Multi-Drop Batch)</strong> rotaları kurye kokpitleriyle gerçek zamanlı senkronize çalışmaktadır.
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* TAB 2: TFKS ZİMMET & VARDİYA MASASI - Monochrome */}
          {activeTab === 'zimmet' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                      TFKS SINIF 01 & 03
                    </span>
                    <h2 className="text-base font-bold text-white font-display">
                      Zimmet, Araç Teslim ve Vardiya Masası
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Çift zimmet önleme kuralı, başlangıç km kaydı, 4 yönlü hasar fotoğrafı ve OBD bağlantı doğrulaması.
                  </p>
                </div>

                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md self-start sm:self-auto transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Araç Zimmeti Aç</span>
                </button>
              </div>

              {/* Zimmet Tablosu */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Plaka & Model</th>
                      <th className="p-3">Zimmetli Kurye</th>
                      <th className="p-3">Başlangıç / Güncel Km</th>
                      <th className="p-3">Yakıt</th>
                      <th className="p-3">GPS / Telemetri</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3 text-right">Eylem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {vehicleAssignments.map((va) => (
                      <tr key={va.id} className="hover:bg-zinc-900/60">
                        <td className="p-3">
                          <span className="font-bold text-white font-mono block">{va.plate}</span>
                          <span className="text-[11px] text-zinc-400">{va.model}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-zinc-200 block">{va.courierName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{va.assignedAt}</span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-zinc-400">{va.startKm.toLocaleString()} km</span>
                          <span className="text-zinc-600"> → </span>
                          <span className="text-white font-bold">{va.currentKm.toLocaleString()} km</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full bg-white"
                                style={{ width: `${va.fuelLevel}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-zinc-400">%{va.fuelLevel}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 w-fit ${
                              va.gpsStatus === 'connected'
                                ? 'bg-zinc-900 text-white border border-zinc-700'
                                : 'bg-black text-zinc-400 border border-zinc-800'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${va.gpsStatus === 'connected' ? 'bg-white' : 'bg-zinc-500'}`} />
                            <span>{va.gpsStatus === 'connected' ? 'CANLI GPS' : 'SİNYAL KESİK'}</span>
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              va.shiftStatus === 'active'
                                ? 'bg-zinc-800 text-white border border-zinc-700'
                                : va.shiftStatus === 'completed'
                                ? 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                                : 'bg-black text-zinc-300 border border-zinc-700'
                            }`}
                          >
                            {va.shiftStatus === 'active'
                              ? 'Vardiyada'
                              : va.shiftStatus === 'completed'
                              ? 'Teslim Edildi'
                              : 'BLOKAJLI'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {va.shiftStatus === 'active' && (
                            <button
                              onClick={() => unassignVehicle(va.id)}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                            >
                              Zimmeti İade Al
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ÇOKLU KASA & CARİ MUTABAKAT - Monochrome */}
          {activeTab === 'kasa' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                      TFKS SINIF 05 & 06
                    </span>
                    <h2 className="text-base font-bold text-white font-display">
                      Çoklu Kasa & Finansal Teslim Zinciri
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Merkez, operasyon ve pos havuzları. Çift taraflı onay olmadan kasalar arası virman yapılamaz.
                  </p>
                </div>

                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md self-start sm:self-auto transition-all active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Kasalar Arası Transfer Başlat</span>
                </button>
              </div>

              {/* Kasa Kartları Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cashVaults.map((vault) => (
                  <div key={vault.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                      {vault.type.toUpperCase()} KASASI
                    </span>
                    <h3 className="text-sm font-bold text-white">{vault.name}</h3>
                    <div className="text-xl font-black font-mono text-white">
                      {vault.balance.toLocaleString('tr-TR')} ₺
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[11px] text-zinc-400 space-y-1">
                      <div>Sorumlu: <span className="text-zinc-300 font-semibold">{vault.responsiblePerson}</span></div>
                      <div className="text-[10px] text-zinc-300 font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                        <span>Sayım Farkı: 0 ₺ (Mutabık)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bekleyen Transferler ve Çift Onay Masası */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Kasa Virman & Transfer Onay Masası (İkinci Kontrol)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Transfer No & Tarih</th>
                        <th className="p-3">Gönderen Kasa</th>
                        <th className="p-3">Alan Kasa</th>
                        <th className="p-3">Tutar</th>
                        <th className="p-3">Gerekçe & Teslim Eden</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3 text-right">Çift Onay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {cashTransfers.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-900/60">
                          <td className="p-3 font-mono">
                            <span className="text-white font-bold block">{t.id}</span>
                            <span className="text-[10px] text-zinc-500">{t.timestamp}</span>
                          </td>
                          <td className="p-3 text-zinc-300">{t.fromVaultName}</td>
                          <td className="p-3 text-zinc-300">{t.toVaultName}</td>
                          <td className="p-3 font-mono font-bold text-white">
                            {t.amount.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="p-3 text-zinc-400">
                            <span className="text-zinc-300 block">{t.justification}</span>
                            <span className="text-[10px] text-zinc-500">Teslim: {t.senderPerson}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.status === 'approved'
                                  ? 'bg-zinc-800 text-white border border-zinc-700'
                                  : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                              }`}
                            >
                              {t.status === 'approved' ? 'Onaylandı (Mühürlü)' : 'Onay Bekliyor'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {t.status === 'pending_approval' ? (
                              <button
                                onClick={() => approveCashTransfer(t.id)}
                                className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                              >
                                Onayla & Bakiyeyi Düş
                              </button>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-mono">Tamamlandı</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CEZA, HGS & HASAR MASASI - Monochrome */}
          {activeTab === 'ceza' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                    TFKS SINIF 07 & 09
                  </span>
                  <h2 className="text-base font-bold text-white font-display">
                    Trafik Cezası Tebligatı & Hasar Sorumluluk Masası
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  15 günlük %25 indirim süresi sayacı, EGM tebligat kanıtı ve teslimat fotoğraflı hasar tespiti.
                </p>
              </div>

              {/* Cezalar Bölümü */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Trafik Cezaları & 15 Günlük İndirim Takip Listesi
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Plaka & Ceza Kodu</th>
                        <th className="p-3">Açıklama</th>
                        <th className="p-3">Tebliğ Tarihi</th>
                        <th className="p-3">Tam Tutar</th>
                        <th className="p-3">İndirimli Tutar (%25)</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3 text-right">Cari İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {courierPenalties.map((pen) => (
                        <tr key={pen.id} className="hover:bg-zinc-900/60">
                          <td className="p-3">
                            <span className="font-bold text-white font-mono block">{pen.plate}</span>
                            <span className="text-[10px] font-mono text-zinc-400 font-bold">{pen.code}</span>
                          </td>
                          <td className="p-3 text-zinc-300 max-w-xs">{pen.title}</td>
                          <td className="p-3 font-mono text-zinc-400">{pen.date}</td>
                          <td className="p-3 font-mono text-zinc-500 line-through">
                            {pen.fullAmount} ₺
                          </td>
                          <td className="p-3 font-mono font-bold text-white">
                            {pen.discountedAmount} ₺
                            <span className="block text-[9px] text-zinc-400 font-mono">11 Gün Kaldı</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pen.status === 'paid'
                                  ? 'bg-zinc-800 text-white border border-zinc-700'
                                  : 'bg-zinc-950 text-zinc-300 border border-zinc-800'
                              }`}
                            >
                              {pen.status === 'paid' ? 'Ödendi' : 'Tebliğ Edildi (Ödenmedi)'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                showNotification({
                                  title: 'Cari Hesaba Yansıtıldı',
                                  message: `Ceza (${pen.code}) ${pen.plate} plakalı aracın zimmetli sürücüsünün carisine tahakkuk ettirildi.`,
                                  type: 'info',
                                });
                              }}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold"
                            >
                              Kurye Carisine Yansıt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hasar Kayıtları Bölümü */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Motosiklet Hasar Tespit ve Ekspertiz Kayıtları
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {damageReports.map((dmg) => (
                    <div key={dmg.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                          {dmg.plate}
                        </span>
                        <span className="text-[10px] text-zinc-200 font-mono font-bold px-2 py-0.5 bg-zinc-900 rounded border border-zinc-700">
                          {dmg.status === 'repair_approved' ? 'ONARIM ONAYLANDI' : 'İNCELEMEDE'}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300">{dmg.description}</p>

                      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-zinc-900">
                        <span className="text-zinc-400">Eksper Maliyeti:</span>
                        <span className="font-bold text-white">{dmg.estimatedCost} ₺</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-zinc-400">Sorumlu: <strong className="text-zinc-200">Kurye ({dmg.courierName})</strong></span>
                        <button
                          onClick={() => {
                            showNotification({
                              title: 'Hasar İş Emrine Bağlandı',
                              message: `${dmg.plate} plakalı aracın ${dmg.estimatedCost} ₺ tutarındaki hasar kaydı aktif servis iş emriyle eşleştirildi.`,
                              type: 'success',
                            });
                          }}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[11px] font-bold transition-colors"
                        >
                          Servis İş Emrine Bağla
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEPO, SERVİS & YEDEK PARÇA */}
          {activeTab === 'servis' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                      TFKS SINIF 10 & 11
                    </span>
                    <h2 className="text-base font-bold text-white font-display">
                      Depo Yedek Parça & Servis İş Emirleri
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    İş emri olmadan parça çıkışı yapılamaz. Test sürüşü onayı almayan araç blokajdan çıkarılamaz.
                  </p>
                </div>

                <button
                  onClick={() => setShowWorkOrderModal(true)}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md self-start sm:self-auto transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Servis İş Emri Aç</span>
                </button>
              </div>

              {/* Servis İş Emirleri */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Aktif ve Kapatılan Servis İş Emirleri
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-3">İş Emri No & Plaka</th>
                        <th className="p-3">Usta & Arıza</th>
                        <th className="p-3">Kullanılan Parçalar</th>
                        <th className="p-3">Maliyet (Parça + İşçilik)</th>
                        <th className="p-3">Eski Parça Akıbeti</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3 text-right">Yol Testi & Kapanış</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {serviceWorkOrders.map((wo) => (
                        <tr key={wo.id} className="hover:bg-zinc-900/60">
                          <td className="p-3">
                            <span className="font-bold text-white font-mono block">{wo.orderNo}</span>
                            <span className="text-[10px] font-mono text-zinc-400 font-bold">{wo.plate}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-zinc-200 font-semibold block">{wo.mechanicName}</span>
                            <span className="text-[11px] text-zinc-400">{wo.faultDescription}</span>
                          </td>
                          <td className="p-3 text-zinc-300">
                            {wo.partsUsed.map((p, i) => (
                              <div key={i} className="text-[11px]">
                                • {p.name} ({p.qty} ad.)
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-mono font-bold text-white">
                            {wo.totalCost} ₺
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                              {wo.oldPartsStatus === 'hurda' ? 'Hurdaya Ayrıldı' : 'Depoya İade Edildi'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                wo.status === 'closed'
                                  ? 'bg-zinc-800 text-white border border-zinc-700'
                                  : 'bg-zinc-950 text-zinc-300 border border-zinc-800'
                              }`}
                            >
                              {wo.status === 'closed' ? 'Test Geçti & Kapandı' : 'Tamir Sürüyor'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {wo.status !== 'closed' ? (
                              <button
                                onClick={() => approveTestDriveAndCloseService(wo.id)}
                                className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                              >
                                Testi Onayla & Kapat
                              </button>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-mono">Kapatıldı</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Depo Yedek Parça Stoğu */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Depo Yedek Parça Envanteri & Emniyet Stok Seviyeleri
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {warehouseParts.map((part) => (
                    <div key={part.id} className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-300 font-bold">{part.partCode}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{part.shelfLocation}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{part.name}</h4>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-mono text-zinc-300">Birim: {part.unitPrice} ₺</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustPartStock(part.id, -1)}
                            className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                            part.stockQty <= part.minLimit ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-black text-white border border-zinc-850'
                          }`}>
                            {part.stockQty} Ad.
                          </span>
                          <button
                            onClick={() => adjustPartStock(part.id, 1)}
                            className="w-6 h-6 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: YETKİ, BLOKAJ & SİSTEM FRENİ - Monochrome */}
          {activeTab === 'blokaj' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                    TFKS SINIF 14 & 15
                  </span>
                  <h2 className="text-base font-bold text-white font-display">
                    Yetki Matrisi, Sistem Blokajları & Güvenlik Frenleri
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Kritik operasyonel açık durumlarında sistem otomatik kilitlenir. Blokaj kaldırma yalnızca gerekçeli yönetici onayıyla mümkündür.
                </p>
              </div>

              {/* Aktif Blokajlar Listesi */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Aktif Güvenlik Blokajları (Sistem Frenleri)
                </h3>

                <div className="space-y-3">
                  {systemBlockages.map((blockage) => (
                    <div
                      key={blockage.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        blockage.isUnlocked
                          ? 'bg-zinc-950 border-zinc-850 opacity-60'
                          : 'bg-zinc-950 border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            blockage.isUnlocked
                              ? 'bg-zinc-800 text-zinc-400'
                              : 'bg-zinc-900 border border-zinc-700 text-white'
                          }`}
                        >
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{blockage.targetName}</span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                blockage.isUnlocked
                                  ? 'bg-zinc-800 text-zinc-400'
                                  : 'bg-white text-black font-black'
                              }`}
                            >
                              {blockage.isUnlocked ? 'KİLİT KALDIRILDI' : 'BLOKAJ AKTİF'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-1">{blockage.blockReason}</p>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                            Tetikleyen: {blockage.blockedBy} · {blockage.blockedAt}
                          </span>
                        </div>
                      </div>

                      {!blockage.isUnlocked ? (
                        <button
                          onClick={() => setUnlockModalBlockage(blockage)}
                          className="px-3.5 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-black transition-all shadow-md whitespace-nowrap self-start sm:self-auto active:scale-95"
                        >
                          İstisna Onayı ile Kilidi Kaldır
                        </button>
                      ) : (
                        <div className="text-[10px] text-zinc-400 font-mono text-right">
                          Kaldıran: {blockage.unlockedBy}
                          <br />
                          {blockage.unlockJustification}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MÜHÜRLÜ AUDIT LOG - Monochrome */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                      TFKS SINIF 16
                    </span>
                    <h2 className="text-base font-bold text-white font-display">
                      Mühürlü Audit Log & Olay İzi (Eski / Yeni Değer)
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Silinemez, değiştirilemez ve SHA-256 kripto damgalı teftiş akışı.
                  </p>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded-xl text-[11px] font-mono">
                  {['all', 'CREATE', 'UPDATE', 'APPROVE', 'UNBLOCK', 'SEAL'].map((action) => (
                    <button
                      key={action}
                      onClick={() => setAuditFilter(action)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        auditFilter === action
                          ? 'bg-white text-black font-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredAuditLogs.map((entry) => (
                  <div key={entry.id} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-white border border-zinc-700">
                          {entry.actionType}
                        </span>
                        <strong className="text-white">{entry.screenName}</strong>
                        <span className="text-zinc-500">·</span>
                        <span className="text-zinc-400 font-mono text-[11px]">{entry.actorName} ({entry.actorRole})</span>
                      </div>

                      <span className="font-mono text-[10px] text-zinc-500">{entry.timestamp}</span>
                    </div>

                    {/* Eski / Yeni Değer Gösterimi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-2.5 bg-black border border-zinc-800 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">ESKİ DEĞER:</span>
                        <p className="text-zinc-400 font-mono text-[11px]">{entry.previousValue}</p>
                      </div>

                      <div className="p-2.5 bg-zinc-900 border border-zinc-750 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-white uppercase font-bold block">YENİ DEĞER:</span>
                        <p className="text-white font-mono text-[11px] font-semibold">{entry.newValue}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <div>Gerekçe: <em className="text-zinc-300">"{entry.justification}"</em></div>
                      <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[200px]" title={entry.securitySealHash}>
                        Mühür: {entry.securitySealHash}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MÜHÜRLÜ GÜN KAPANIŞI - Monochrome */}
          {activeTab === 'closing' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                    TFKS SINIF 17
                  </span>
                  <h2 className="text-base font-bold text-white font-display">
                    Mühürlü Gün Kapanışı & Şirket Denetim Masası (EOD)
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Açık risk, kasa açığı veya sahipsiz araç varsa gün temiz kapatılamaz. Yönetici gerekçeli istisna mührüyle dondurur.
                </p>
              </div>

              {/* Status Alert Banner */}
              {closingMessage && (
                <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
                  closingMessage.isError
                    ? 'bg-zinc-900 border-white text-white'
                    : 'bg-zinc-950 border-zinc-700 text-white'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                  <span>{closingMessage.text}</span>
                </div>
              )}

              {/* 6-Point Audit Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Kapanış Öncesi Zorunlu Denetim Listesi
                </h3>

                <div className="space-y-2 text-xs">
                  {dailyClosingAudit.auditChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between ${
                        item.isPassed
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                          : 'bg-zinc-900 border-zinc-600 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.isPassed ? (
                          <CheckCircle className="w-4 h-4 text-white shrink-0" />
                        ) : (
                          <AlertOctagon className="w-4 h-4 text-white shrink-0 animate-pulse" />
                        )}
                        <div>
                          <strong className="block text-white">{item.title}</strong>
                          <span className="text-[11px] text-zinc-400">{item.detail}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          item.isPassed
                            ? 'bg-zinc-900 text-white border border-zinc-700'
                            : 'bg-white text-black font-black'
                        }`}
                      >
                        {item.isPassed ? 'GEÇTİ ✓' : 'RİSK ENGELİ ✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closing Action Block */}
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Elektronik Mühür ile Günü Kapat</h3>
                    <p className="text-xs text-zinc-400">
                      Tüm kasa hesaplarını, seferleri ve hakediş havuzunu salt-okunur olarak dondurur.
                    </p>
                  </div>
                  {dailyClosingAudit.sealHash && (
                    <span className="font-mono text-[10px] text-white bg-zinc-900 px-2.5 py-1 rounded border border-zinc-700">
                      MÜHÜR: {dailyClosingAudit.sealHash.substring(0, 18)}...
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">
                    Açık Risk İstisna Gerekçesi (Açık iş emri vb. varsa zorunludur):
                  </label>
                  <input
                    type="text"
                    value={closingOverrideNote}
                    onChange={(e) => setClosingOverrideNote(e.target.value)}
                    placeholder="Örn: Garaj şefi gözetiminde SRV-2026-084 ertesi güne devredilmiştir."
                    className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500"
                  />
                </div>

                <button
                  onClick={() => {
                    const success = runDailyClosingCheck(closingOverrideNote);
                    if (success) {
                      setClosingMessage({
                        text: 'Tebrikler! Gün başarıyla mühürlendi ve ertesi günün açılış bakiyelerine devredildi.',
                        isError: false,
                      });
                    } else {
                      setClosingMessage({
                        text: 'DİKKAT: Açık servis veya onay bekleyen virman tespit edildi! Kapanış durduruldu. Kapatmak için yukarıya Yönetici İstisna Gerekçesi yazmalısınız.',
                        isError: true,
                      });
                    }
                  }}
                  className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Günü Kapat ve Dijital Mühür Bas (EOD Seal)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 8.5: FİNANSAL UZLAŞMA & POLİTİKA MASASI */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-6">
              {/* Header & Metric Cards */}
              <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30 font-mono text-[10px] font-bold">
                        TFKS FİNANSAL UZLAŞMA & DENETİM
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 font-mono text-[10px] font-bold">
                        ONAYSIZ KESİNTİ: 0 ₺
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white mt-1">
                      İşlem Kimliği Bazlı Uzlaşma & Politika Masası
                    </h2>
                    <p className="text-xs text-[#8E8E93] mt-0.5">
                      Her sefer ve iptal işleminin kuruş bazlı mutabakatı, onay bekleyen finansal taslaklar ve sunucu güvenlik geçiş mimarisi.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      Uzlaşma Kaydı: <strong className="text-white">{reconciliationRecords.length}</strong>
                    </span>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                      Bekleyen Taslak: <strong className="text-amber-300">{pendingPolicyProposals.length}</strong>
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-mono">TOPLAM UZLAŞILAN TUTAR</div>
                    <div className="text-base font-black text-white mt-1">
                      {reconciliationRecords.reduce((acc, r) => acc + r.amountCollected, 0).toFixed(2)} ₺
                    </div>
                    <div className="text-[10px] text-[#30D158] mt-0.5 font-medium">Bakiye mutabakatı tam</div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-mono">KURYE HAKEDİŞLERİ</div>
                    <div className="text-base font-black text-white mt-1">
                      {reconciliationRecords.reduce((acc, r) => acc + r.courierEarnings, 0).toFixed(2)} ₺
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-medium">Havuz mutabakatlı</div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-mono">PLATFORM GELİR PAYI</div>
                    <div className="text-base font-black text-[#0A84FF] mt-1">
                      {reconciliationRecords.reduce((acc, r) => acc + r.platformCommission, 0).toFixed(2)} ₺
                    </div>
                    <div className="text-[10px] text-[#0A84FF] mt-0.5 font-medium">Yasal komisyon / hizmet</div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-mono">İPTAL TAZMİNATI KESİNTİSİ</div>
                    <div className="text-base font-black text-[#FF453A] mt-1">
                      0.00 ₺
                    </div>
                    <div className="text-[10px] text-[#FF453A] mt-0.5 font-medium">25 ₺ kesinti devre dışı (Onaylı Kural)</div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: İŞLEM KİMLİĞİ BAZLI FİNANSAL UZLAŞMA TABLOSU */}
              <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#0A84FF]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      İşlem Kimliği (Transaction ID) Bazlı Uzlaşma Kütüğü
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Idempotent Mutabakat • Her Kayıt Ayrı Doğrulanır
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-zinc-400 uppercase font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Sefer / İşlem ID</th>
                        <th className="p-3">Tarih</th>
                        <th className="p-3">Ödeme Yöntemi</th>
                        <th className="p-3">Tahsilat Kanalı</th>
                        <th className="p-3">Tahsil Tutar</th>
                        <th className="p-3">Kurye Payı</th>
                        <th className="p-3">Platform Payı</th>
                        <th className="p-3">İptal Kesintisi</th>
                        <th className="p-3">Uygulanan Onaylı Kural</th>
                        <th className="p-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reconciliationRecords.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-zinc-500 font-mono text-xs">
                            Henüz tamamlanmış veya uzlaşmaya tabi tutulmuş işlem kaydı bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        reconciliationRecords.map((rec) => (
                          <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3">
                              <span className="font-mono font-bold text-white block">{rec.rideId}</span>
                              <span className="text-[9px] text-zinc-500 font-mono" title={rec.idempotencyKey}>
                                IDEM: {rec.idempotencyKey.slice(0, 16)}...
                              </span>
                            </td>
                            <td className="p-3 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                              {rec.timestamp}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                  rec.paymentMethod === 'cash'
                                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                    : rec.paymentMethod === 'card'
                                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                }`}
                              >
                                {rec.paymentMethod === 'cash'
                                  ? 'Nakit'
                                  : rec.paymentMethod === 'card'
                                  ? 'Kredi Kartı'
                                  : 'Cüzdan'}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-300 font-mono text-[11px]">
                              {rec.collectionChannel === 'direct_cash'
                                ? 'Kurye Nakit Elden'
                                : rec.collectionChannel === 'simulation_card_pos'
                                ? 'Sanal POS / Kart'
                                : 'Platform Cüzdanı'}
                            </td>
                            <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                              {rec.amountCollected.toFixed(2)} ₺
                            </td>
                            <td className="p-3 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                              +{rec.courierEarnings.toFixed(2)} ₺
                            </td>
                            <td className="p-3 font-mono font-semibold text-blue-400 whitespace-nowrap">
                              +{rec.platformCommission.toFixed(2)} ₺
                            </td>
                            <td className="p-3 font-mono text-zinc-400 whitespace-nowrap">
                              {rec.cancellationFeeApplied > 0 ? (
                                <span className="text-red-400 font-bold">-{rec.cancellationFeeApplied.toFixed(2)} ₺</span>
                              ) : (
                                <span className="text-zinc-500">0.00 ₺ (Muaf)</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="font-mono text-[10px] text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 block">
                                {rec.appliedRule.ruleCode}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1 ${
                                  rec.reconciliationStatus === 'balanced'
                                    ? 'bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30'
                                    : rec.reconciliationStatus === 'discrepancy'
                                    ? 'bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30'
                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {rec.reconciliationStatus === 'balanced' ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Uzlaşıldı
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3" />
                                    {rec.reconciliationStatus}
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 2: BEKLEYEN FİNANSAL POLİTİKA TASLAKLARI */}
              <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Onay Bekleyen Finansal Politika Taslakları (Pending Proposals)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Kullanıcı Kararı Bekleniyor
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-2 mb-4">
                  Kullanıcının açık onayı olmadan iptal tazminatı veya keyfi kurye payı kesintileri yürürlüğe sokulamaz.
                  Tüm politika değişiklikleri bu masada taslak statüsünde tutulur ve kullanıcı direktifiyle yürürlüğe girer.
                </p>

                <div className="space-y-3">
                  {pendingPolicyProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{prop.title}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {prop.id}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-300">
                          <strong>Önerilen Kesinti / Pay:</strong> {prop.proposedFee} ₺ (Sürücü Telafisi: {prop.proposedCourierShare} ₺)
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          <strong>Açıklama:</strong> {prop.description}
                        </div>
                        <div className="text-[11px] text-amber-300/90 font-mono">
                          {prop.warningNote}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {prop.status === 'pending_approval' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => decidePolicyProposal(prop.id, 'approved')}
                              className="px-2.5 py-1.5 rounded-xl bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-[10px] transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Onayla</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => decidePolicyProposal(prop.id, 'rejected')}
                              className="px-2.5 py-1.5 rounded-xl bg-[#FF453A]/20 hover:bg-[#FF453A]/30 text-[#FF453A] border border-[#FF453A]/40 font-bold text-[10px] transition-all active:scale-95 flex items-center gap-1"
                            >
                              <X className="w-3 h-3 stroke-[3]" />
                              <span>Reddet</span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border ${
                              prop.status === 'approved'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-red-500/15 text-red-300 border-red-500/30'
                            }`}
                          >
                            {prop.status === 'approved' ? '✓ Yürürlükte / Onaylandı' : '✕ Reddedildi / Arşivlendi'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: TESPİT EDİLEN ONAYSIZ KAYITLAR MASASI */}
              <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#30D158]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Onaysız Kesinti Denetim Taraması
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#30D158] bg-[#30D158]/10 px-2.5 py-0.5 rounded-full border border-[#30D158]/30">
                    {detectedUnapprovedRecords.length} Tespit Edilen Geçmiş Kayıt
                  </span>
                </div>

                {detectedUnapprovedRecords.length === 0 ? (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl mt-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-emerald-300">
                        Denetim Temiz: Onaysız Kesinti Bulunmuyor
                      </div>
                      <p className="text-[11px] text-emerald-200/70 mt-0.5">
                        İstemci veya test durumunda kullanıcı onayı olmaksızın tahsil edilmiş aktif 25 ₺ iptal tazminatı veya 20 ₺ sürücü kesintisi kaydı bulunmamaktadır. Tüm yeni iptaller 0 ₺ kesintiyle uzlaştırılmaktadır.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-3">
                    {detectedUnapprovedRecords.map((item) => {
                      const isRefunded = reconciliationRecords.some(
                        (r) => r.rideId === item.id && r.id.startsWith('REC-REFUND')
                      );
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-mono font-bold text-white flex items-center gap-2">
                              <span>{item.id}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                                {item.amount} ₺
                              </span>
                              {isRefunded && (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                                  İADE EDİLDİ & MUTABAKAT SAĞLANDI ✓
                                </span>
                              )}
                            </div>
                            <div className="text-zinc-300 mt-1">{item.description}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{item.reason}</div>
                          </div>
                          <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-zinc-400">{item.date}</span>
                            {!isRefunded ? (
                              <button
                                type="button"
                                onClick={() => refundUnapprovedRecord(item.id)}
                                className="px-3 py-1.5 rounded-xl bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-[10px] transition-all active:scale-95 flex items-center gap-1 shadow"
                              >
                                <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                                <span>{item.amount} ₺ İade Et & Defteri Düzelt</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                                Defter Bakiyesi Mutabakatlı
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 4: İSTEMCİ SİMÜLASYONU VS GERÇEK SUNUCU MİMARİ GEÇİŞ MATRİSİ */}
              <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Üretim Ortamı Sunucu Geçiş & Güvenlik Güvencesi Matrisi
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    Geçiş Yol Haritası
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mt-2 mb-4">
                  Mevcut istemci prototipindeki simülatif işlevler ile üretim aşamasında devreye alınacak bağımsız sunucu garantileri arasındaki kesin ayrım:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-zinc-400 uppercase font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Mimari Katman</th>
                        <th className="p-3">Mevcut İstemci Durumu</th>
                        <th className="p-3">Üretim Sunucu Güvencesi</th>
                        <th className="p-3">Güvenlik & Hukuki Risk</th>
                        <th className="p-3">Planlanan Protokol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white font-mono text-[11px]">
                          Yetkilendirme & Rol Doğrulama
                        </td>
                        <td className="p-3 text-zinc-400">
                          React State / Context içi rol anahtarı
                        </td>
                        <td className="p-3 text-emerald-300 font-medium">
                          JWT/HMAC Bearer Token + Sunucu RBAC + Rate Limit
                        </td>
                        <td className="p-3 text-amber-300">
                          İstemci tarafı bypass riski (Sunucuda engellenecek)
                        </td>
                        <td className="p-3 text-zinc-300 font-mono text-[10px]">
                          RFC 7519 / OAuth2
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white font-mono text-[11px]">
                          Fiyatlandırma & Komisyon Motoru
                        </td>
                        <td className="p-3 text-zinc-400">
                          İstemcide dinamik hesaplama formülü
                        </td>
                        <td className="p-3 text-emerald-300 font-medium">
                          Server-Authoritative Pricing Microservice (Tamsayı Kuruş)
                        </td>
                        <td className="p-3 text-amber-300">
                          Manipülasyon önleme: İstemci fiyat teklif edemez
                        </td>
                        <td className="p-3 text-zinc-300 font-mono text-[10px]">
                          Signed Quote Hash (TTL 120s)
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white font-mono text-[11px]">
                          Sürücü Eşleştirme & Yarış Durumları
                        </td>
                        <td className="p-3 text-zinc-400">
                          İstemcide setTimeout simülasyonu
                        </td>
                        <td className="p-3 text-emerald-300 font-medium">
                          Redis Geo + Distributed Mutex (Redlock)
                        </td>
                        <td className="p-3 text-amber-300">
                          Çift atama & gecikmeli ret engelleme
                        </td>
                        <td className="p-3 text-zinc-300 font-mono text-[10px]">
                          WebSockets / SSE + Redis PubSub
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white font-mono text-[11px]">
                          Ödeme & Cüzdan Güvenliği
                        </td>
                        <td className="p-3 text-zinc-400">
                          İstemci cüzdan state artış/azalışı
                        </td>
                        <td className="p-3 text-emerald-300 font-medium">
                          Lisanslı Ödeme Kuruluşu (PCI-DSS) + 3D Secure Webhook
                        </td>
                        <td className="p-3 text-red-300">
                          Kart verisi asla sunucumuzda saklanmaz
                        </td>
                        <td className="p-3 text-zinc-300 font-mono text-[10px]">
                          TCMB 6493 Uyumlu Pazaryeri Havuzu
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white font-mono text-[11px]">
                          Acil Durum & SOS 112 Protokolü
                        </td>
                        <td className="p-3 text-zinc-400">
                          Yerel test alarmı + 112 doğrudan arama yönlendirmesi
                        </td>
                        <td className="p-3 text-emerald-300 font-medium">
                          7/24 Güvenlik Operasyon Masası + SMS Telemetri
                        </td>
                        <td className="p-3 text-amber-300">
                          Yanıltıcı 112 otomatik sevk vaadinde bulunulmaz
                        </td>
                        <td className="p-3 text-zinc-300 font-mono text-[10px]">
                          Doğrudan Tel URL + Enlem/Boylam SMS
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white font-mono text-[11px]">
                          Mali Uzlaşma & Denetim Defteri
                        </td>
                        <td className="p-3 text-zinc-400">
                          İstemci localStorage mutabakat günlüğü
                        </td>
                        <td className="p-3 text-emerald-300 font-medium">
                          Append-Only İki Taraflı Muhasebe Defteri (Ledger DB)
                        </td>
                        <td className="p-3 text-emerald-300">
                          Kuruş bazlı kesinlik, ters işlem güvencesi
                        </td>
                        <td className="p-3 text-zinc-300 font-mono text-[10px]">
                          PostgreSQL Immutable Ledger + FAST/EFT
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: FLEET KYC DOCUMENTS */}
          {activeTab === 'fleet' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Kurye Başvuru ve Belge Denetim Masası
                  </h2>
                  <p className="text-xs text-slate-400">
                    A sınıfı ehliyet, ruhsat, sigorta ve adli sicil kayıtlarını inceleyin ve onaylayın.
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={courierSearch}
                    onChange={(e) => setCourierSearch(e.target.value)}
                    placeholder="İsim, plaka veya motor ara..."
                    className="pl-9 pr-4 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Kurye & Plaka</th>
                      <th className="p-3">Motosiklet</th>
                      <th className="p-3">Yolcu Yetkisi</th>
                      <th className="p-3">Kurye Yetkisi</th>
                      <th className="p-3">Hakediş Havuzu</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3 text-right">Eylem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {filteredCouriers.map((courier) => {
                      const docs = courier.documents;
                      const allApproved =
                        docs.licenseApproved &&
                        docs.registrationApproved &&
                        docs.insuranceApproved &&
                        docs.criminalRecordApproved;

                      return (
                        <tr key={courier.id} className="hover:bg-zinc-900/60">
                          <td className="p-3">
                            <span className="font-bold text-white block">{courier.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono font-bold">
                              {courier.plate}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-300">{courier.motorcycle}</td>
                          <td className="p-3">
                            <button
                              onClick={() => toggleCourierPermission(courier.id, 'passengerServiceApproved')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                courier.permissions?.passengerServiceApproved
                                  ? 'bg-zinc-900 border-white text-white'
                                  : 'bg-black border-zinc-700 text-zinc-500'
                              }`}
                              title="Yolcu Hizmeti Yetkisini Değiştir"
                            >
                              {courier.permissions?.passengerServiceApproved ? 'Yolcu Açık' : 'Yolcu Kapalı'}
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => toggleCourierPermission(courier.id, 'courierServiceApproved')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                courier.permissions?.courierServiceApproved
                                  ? 'bg-zinc-900 border-white text-white'
                                  : 'bg-black border-zinc-700 text-zinc-500'
                              }`}
                              title="Kurye Hizmeti Yetkisini Değiştir"
                            >
                              {courier.permissions?.courierServiceApproved ? 'Kurye Açık' : 'Kurye Kapalı'}
                            </button>
                          </td>
                          <td className="p-3 font-mono font-bold text-white">
                            {courier.wallet.pendingPayout} ₺
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                courier.isVerified
                                  ? 'bg-zinc-800 text-white border border-zinc-700'
                                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                              }`}
                            >
                              {courier.isVerified ? 'Mühürlü Sürücü' : 'Doğrulanmamış'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedCourierForKyc(courier)}
                              className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                            >
                              Belgeleri İncele
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: RECONCILIATION, POLICY & AUDIT MATRIX */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white border border-zinc-700 font-mono text-[10px] font-bold">
                    TFKS KURAL 1 & 3 & 6
                  </span>
                  <h2 className="text-base font-bold text-white font-display">
                    İşlem Bazlı Finansal Uzlaşma, Politika Masası & Mimari Teftiş
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Müşteri ödemesi, sürücü hakedişi, platform payı ve iptal kayıtlarının işlem kimliği üzerinden mutabakatı; onaysız kuralların tespiti ve sunucu geçiş gereksinimleri.
                </p>
              </div>

              {/* 1. Finansal Uzlaşma Tablosu (Reconciliation) */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono block">
                      1. İşlem Kimliği (Transaction ID) Bazlı Mutabakat Tablosu
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Her seferin tahsilatı, sürücü hakedişi ve komisyonu işlem kimliği ile eşleştirilmiştir. İdempotency anahtarı ile mükerrer çekim engellenmiştir.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-white/[0.08] text-white border border-white/[0.1] rounded-xl text-[10px] font-mono font-semibold self-start sm:self-auto">
                    {reconciliationRecords.length} Uzlaşılmış İşlem
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/80 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-2.5">Uzlaşma & Sefer No</th>
                        <th className="p-2.5">Zaman</th>
                        <th className="p-2.5">Ödeme & Tahsilat Kanalı</th>
                        <th className="p-2.5 text-right">Tahsil Edilen</th>
                        <th className="p-2.5 text-right">Sürücü Payı</th>
                        <th className="p-2.5 text-right">Platform</th>
                        <th className="p-2.5 text-center">İptal Bedeli</th>
                        <th className="p-2.5">Uygulanan Onaylı Kural</th>
                        <th className="p-2.5 text-center">İdempotency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {reconciliationRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-zinc-900/60 font-mono text-[11px]">
                          <td className="p-2.5">
                            <span className="text-white font-bold block">{rec.id}</span>
                            <span className="text-[10px] text-zinc-500">{rec.rideId}</span>
                          </td>
                          <td className="p-2.5 text-zinc-400 whitespace-nowrap">{rec.timestamp}</td>
                          <td className="p-2.5">
                            <span className="text-zinc-200 font-semibold block">
                              {rec.paymentMethod === 'card'
                                ? 'Kredi / Banka Kartı'
                                : rec.paymentMethod === 'cash'
                                ? 'Elden Nakit'
                                : 'Cüzdan Bakiyesi'}
                            </span>
                            <span className="text-[10px] text-zinc-500 block truncate max-w-[200px]" title={rec.notes}>
                              {rec.collectionChannel === 'simulation_card_pos' && 'Sanal POS Provizyonu (Simülasyon)'}
                              {rec.collectionChannel === 'direct_cash' && 'Kurye Zimmet Kasa Tahsilatı'}
                              {rec.collectionChannel === 'simulation_wallet' && 'Simülasyon Cüzdan Düşümü'}
                            </span>
                          </td>
                          <td className="p-2.5 text-right text-white font-bold">{rec.amountCollected} ₺</td>
                          <td className="p-2.5 text-right text-white">{rec.courierEarnings} ₺</td>
                          <td className="p-2.5 text-right text-zinc-400">{rec.platformCommission} ₺</td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 text-zinc-300 border border-zinc-750">
                              {rec.cancellationFeeApplied} ₺ (0 TL Muaf)
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className="text-white block font-bold">{rec.appliedRule.ruleCode}</span>
                            <span className="text-[9px] text-zinc-400 block truncate max-w-[160px]">
                              {rec.appliedRule.description}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-900 text-white border border-zinc-700">
                              ✓ Mükerrerlik Engelli
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Onay Bekleyen Finansal Politika Önerileri (Karar Listesi) */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono block">
                      2. Onay Bekleyen Politika Önerileri (Karar Listesi)
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Kullanıcı onayı bulunmayan hiçbir finansal ceza, kesinti veya komisyon kuralı yürürlüğe alınmaz.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-700 rounded-lg text-[10px] font-mono">
                    Karar Bekliyor
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingPolicyProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3.5 bg-black border border-zinc-800 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white block">{prop.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-900 text-zinc-300 border border-zinc-700">
                          DEVRE DIŞI
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{prop.description}</p>
                      
                      <div className="p-2.5 bg-zinc-900/90 border border-zinc-750 rounded-lg text-[10px] space-y-1">
                        <div className="text-zinc-200 font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>Yürürlük Durumu: KULLANICI ONAYI YOK</span>
                        </div>
                        <p className="text-zinc-400 leading-normal">
                          {prop.warningNote} Yeni bir rakam veya sürücü payı belirlenmemiştir; kullanıcı talimatı olmadan yürürlüğe girmez.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Onaysız Kural İle Üretilmiş Geçmiş Kayıt Tespiti (Silinmedi, Raporlandı) */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono block">
                      3. Onaysız Kural İle Üretilmiş Geçmiş İşlem Kayıtları Taraması
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Geçmişte onaysız 25 ₺ kuralıyla üretilmiş işlemler sistemden silinmemiş; teftiş ve denetim amacıyla listelenmiştir.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-zinc-900 text-white border border-zinc-700 rounded-xl text-[10px] font-mono font-bold">
                    {detectedUnapprovedRecords.length} Kayıt Tespit Edildi
                  </span>
                </div>

                {detectedUnapprovedRecords.length > 0 ? (
                  <div className="space-y-2">
                    {detectedUnapprovedRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-3 bg-black border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{rec.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-900 text-zinc-300 border border-zinc-700">
                              Kayıt Silinmedi (Korumalı)
                            </span>
                          </div>
                          <p className="text-zinc-300 text-[11px]">{rec.description}</p>
                          <span className="text-[10px] text-zinc-500 font-mono block">
                            Tespit Nedeni: {rec.reason}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-white text-sm block">
                            {rec.amount} ₺
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">{rec.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">Sistemde onaysız kural ile üretilmiş işlem kaydı bulunmamaktadır.</p>
                )}
              </div>

              {/* 4. İstemci Simülasyonu vs. Gerçek Sunucu Güvenceleri & Mimari Geçiş Planı (Kural 6) */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div>
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono block">
                    4. İstemci Simülasyonu vs. Gerçek Sunucu Güvenceleri (Kural 6 Teftişi)
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Yetkilendirme, fiyatlandırma, sürücü atama, ödeme provizyonu ve teslimat durumunun yalnızca React State içinde çalışması üretim güvenliği değildir. Aşağıdaki matris eksikleri ve geçiş planını belgeler.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-2.5">Mimari Fonksiyon</th>
                        <th className="p-2.5">Mevcut Durum (İstemci Prototipi)</th>
                        <th className="p-2.5">Üretim İçin Gerekli Sunucu Altyapısı</th>
                        <th className="p-2.5">Eksikler & Geçiş Yol Haritası</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                      <tr>
                        <td className="p-2.5 font-bold text-white">Yetkilendirme & Kimlik</td>
                        <td className="p-2.5 text-zinc-400">React Context & Local State</td>
                        <td className="p-2.5 text-white">OAuth2 / OIDC, JWT + Redis Session, Argon2id</td>
                        <td className="p-2.5 text-zinc-300">Bağımsız Auth microservice & rate limiter kurulumu</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Fiyatlandırma Motoru</td>
                        <td className="p-2.5 text-zinc-400">Client calculateFare formülü</td>
                        <td className="p-2.5 text-white">Sunucu-taraflı deterministik tarife & HMAC imzası</td>
                        <td className="p-2.5 text-zinc-300">Fiyat tokeninin sunucuda imzalanıp API ile doğrulanması</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Sürücü Atama & Yarış Durumu</td>
                        <td className="p-2.5 text-zinc-400">setTimeout & Javascript filter</td>
                        <td className="p-2.5 text-white">Redis Dağıtık Kilit (Redlock), PostGIS coğrafi eşleme</td>
                        <td className="p-2.5 text-zinc-300">İki sürücünün aynı çağrıyı almasını engelleyen distributed lock</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Ödeme & Sanal POS</td>
                        <td className="p-2.5 text-zinc-400">Simülasyon cüzdan & mock state</td>
                        <td className="p-2.5 text-white">PCI-DSS Lisanslı Sanal POS Entegrasyonu, 3D Secure 2.0</td>
                        <td className="p-2.5 text-zinc-300">Banka API gateway, webhook doğrulama & DB idempotency constraint</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Çoklu Teslimat & Mutabakat</td>
                        <td className="p-2.5 text-zinc-400">React State Array & UI kilitleri</td>
                        <td className="p-2.5 text-white">PostgreSQL ACID Transaction, Çift Kayıt Muhasebe Defteri</td>
                        <td className="p-2.5 text-zinc-300">Kısmi teslimatlarda iade/iptal için transactional rollback mimarisi</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Acil Durum / SOS</td>
                        <td className="p-2.5 text-zinc-400">Simülasyon alert & tel:112 yönlendirmesi</td>
                        <td className="p-2.5 text-white">Resmi 112 AÇM Kamu Entegrasyon API, EGM/Jandarma Protokolü</td>
                        <td className="p-2.5 text-zinc-300">Canlı kamu sevk taahhüdü verilmez; resmi entegrasyon protokolü şarttır</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: FINANCE & PAYOUTS - Monochrome */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white font-display">
                    Kurye Hakediş ve Finansal Mutabakat Masası
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Kuryelerin tamamladığı siparişlerin haftalık net aktarım listesi.
                  </p>
                </div>
                <button
                  onClick={approveAllPendingPayouts}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  Tüm Hakedişleri Onayla ({totalPendingPayout} ₺)
                </button>
              </div>

              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono block">
                  Bekleyen Transfer Emirleri
                </span>
                <div className="divide-y divide-zinc-850 text-xs">
                  {couriers.map((c) => (
                    <div key={c.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[11px] text-zinc-400">{c.plate} · {c.phone}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white text-sm block">
                          {c.wallet.pendingPayout} ₺
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">IBAN Aktarımı Hazır</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: TARIFFS & SURGE - Monochrome */}
          {activeTab === 'tariffs' && (
            <form onSubmit={handleSaveTariffs} className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Dinamik Tarife ve Yoğunluk Çarpan Motoru
                </h2>
                <p className="text-xs text-zinc-400">
                  İstanbul geneli açılış, km başı ve surge çarpanlarını anlık güncelleyin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                  <span className="font-bold text-white font-mono block">1. Taksi Tarifesi (TAXI_RIDE — %0 Komisyon)</span>
                  <div className="space-y-2">
                    <label className="text-zinc-400 block">Taksi Açılış Ücreti (TL)</label>
                    <input
                      type="number"
                      value={motoBase}
                      onChange={(e) => setMotoBase(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-400 block">Taksi Km Başına Ücret (TL)</label>
                    <input
                      type="number"
                      value={motoKm}
                      onChange={(e) => setMotoKm(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                  <span className="font-bold text-white font-mono block">2. Kurye / Teslimat Tarifesi (PERSONAL & MERCHANT — %0 Komisyon)</span>
                  <div className="space-y-2">
                    <label className="text-zinc-400 block">Kurye Açılış Ücreti (TL)</label>
                    <input
                      type="number"
                      value={kuryeBase}
                      onChange={(e) => setKuryeBase(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-400 block">Kurye Km Başına Ücret (TL)</label>
                    <input
                      type="number"
                      value={kuryeKm}
                      onChange={(e) => setKuryeKm(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 text-xs">
                <span className="font-bold text-white font-mono block">M0 Sıfır Komisyon Kuralı (M0-ZERO-COMMISSION-2026-V1) & Surge</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 block">Platform Komisyon Oranı (% — M0 Kilitli: %0)</label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-zinc-700 rounded-lg text-white font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block">Anlık Surge Çarpanı</label>
                    <input
                      type="number"
                      step="0.1"
                      value={surge}
                      onChange={(e) => setSurge(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-zinc-700 rounded-lg text-white font-mono mt-1"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Tarifeler Başarıyla Kaydedildi!</span>
                  </>
                ) : (
                  <span>Tarifeleri ve Çarpanları Kaydet</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 12: SUPPORT & COMPLAINTS - Monochrome */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Müşteri ve Kurye Şikayet Masası
                </h2>
                <p className="text-xs text-zinc-400">
                  Gecikme, rota anlaşmazlığı veya iptal ücreti itirazlarını karara bağlayın.
                </p>
              </div>

              <div className="space-y-3">
                {complaints.map((comp) => (
                  <div key={comp.id} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{comp.subject}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comp.status === 'resolved'
                            ? 'bg-zinc-800 text-white border border-zinc-700'
                            : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                        }`}
                      >
                        {comp.status === 'resolved' ? 'Çözüldü' : 'Açık İnceleme'}
                      </span>
                    </div>
                    <p className="text-zinc-300">{comp.description}</p>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                      <span>Müşteri: {comp.customerName}</span>
                      <span>·</span>
                      <span>Kurye: {comp.courierName}</span>
                    </div>

                    {comp.status !== 'resolved' && (
                      <div className="flex gap-2 pt-2 border-t border-zinc-850">
                        <button
                          onClick={() => resolveComplaint(comp.id, true)}
                          className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 rounded-lg transition-colors font-bold"
                        >
                          Kısmi İade Yap ve Kapat
                        </button>
                        <button
                          onClick={() => resolveComplaint(comp.id, false)}
                          className="px-3 py-1.5 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors font-semibold"
                        >
                          Çözüldü Olarak Kapat
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SADAKAT, KAMPANYA VE DAVET YÖNETİMİ MASASI */}
          {activeTab === 'loyalty' && <AdminLoyaltyCampaignHub />}

          {/* WEB SİTESİ, TEKNİK SEO & BAŞVURU DENETİM MASASI */}
          {activeTab === 'website_audit' && <AdminAuditHub />}

          {/* İŞLETME ALT KULLANICILARI & ACL VERİ İZOLASYONU MASASI */}
          {activeTab === 'business_subusers' && <AdminBusinessAclHub />}

          {/* FAZ 1-6 OTONOM 71/71 DENETİM, ÇİFT TARAFLI DEFTER (LEDGER) & TIME-TRAVEL ÜSSÜ */}
          {activeTab === 'autonomous_audit' && <AdminAutonomousAuditHub />}
        </div>
      </div>

      {/* MODAL 1: YENİ ARAÇ ZİMMETİ AÇ - Monochrome */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Yeni Araç Zimmeti Aç</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Motosiklet Plakası Seç:</label>
                <select
                  value={assignPlate}
                  onChange={(e) => setAssignPlate(e.target.value)}
                  className="w-full p-2.5 bg-black border border-zinc-700 rounded-xl text-white font-mono"
                >
                  <option value="34 GTL 55">34 GTL 55 (Honda Forza 250)</option>
                  <option value="34 MKP 92">34 MKP 92 (Honda PCX 125)</option>
                  <option value="34 BLY 717">34 BLY 717 (Yamaha NMAX 155)</option>
                  <option value="34 MTO 44">34 MTO 44 (Yamaha XMAX 250)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Zimmetlenecek Kurye Seç:</label>
                <select
                  value={assignCourierId}
                  onChange={(e) => setAssignCourierId(e.target.value)}
                  className="w-full p-2.5 bg-black border border-zinc-700 rounded-xl text-white font-mono"
                >
                  {couriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800 space-y-1.5 text-[11px] text-zinc-300">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  <span>4 Yönlü Fotoğraf & Ekipman Teyidi: Onaylı</span>
                </div>
                <p className="text-zinc-400">
                  Bu işlem başlatıldığında kurye terminalinde teslim belgesi mühürlenecek ve aracın GPS takibi zimmete bağlanacaktır.
                </p>
              </div>

              <button
                onClick={() => {
                  assignVehicle(assignPlate, assignCourierId);
                  setShowAssignModal(false);
                }}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Zimmeti Başlat & Sevk Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KASALAR ARASI TRANSFER - Monochrome */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Kasalar Arası Virman / Transfer</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Kaynak (Çıkış) Kasası:</label>
                <select
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white font-mono"
                >
                  {cashVaults.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.balance.toLocaleString('tr-TR')} ₺)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Hedef (Giriş) Kasası:</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white font-mono"
                >
                  {cashVaults.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.balance.toLocaleString('tr-TR')} ₺)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Transfer Tutarı (TL):</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Transfer Gerekçesi:</label>
                <input
                  type="text"
                  value={transferJustification}
                  onChange={(e) => setTransferJustification(e.target.value)}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500"
                />
              </div>

              <button
                onClick={() => {
                  createCashTransfer(transferFrom, transferTo, transferAmount, transferJustification);
                  setShowTransferModal(false);
                }}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Transfer Talebini Oluştur (Çift Onay İçin)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: YENİ SERVİS İŞ EMRİ AÇ - Monochrome */}
      {showWorkOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Servis İş Emri Aç</h3>
              </div>
              <button onClick={() => setShowWorkOrderModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Servise Alınacak Araç:</label>
                <select
                  value={workOrderPlate}
                  onChange={(e) => setWorkOrderPlate(e.target.value)}
                  className="w-full p-2.5 bg-black border border-zinc-700 rounded-xl text-white font-mono"
                >
                  <option value="34 BLY 717">34 BLY 717 (Mert Aksoy)</option>
                  <option value="34 MKP 92">34 MKP 92 (Serkan Yıldırım)</option>
                  <option value="34 GTL 55">34 GTL 55 (Burak Keskin)</option>
                  <option value="34 MTO 44">34 MTO 44 (Caner Aydın)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Görevli Usta:</label>
                <input
                  type="text"
                  value={workOrderMechanic}
                  onChange={(e) => setWorkOrderMechanic(e.target.value)}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Arıza / Bakım Açıklaması:</label>
                <textarea
                  rows={3}
                  value={workOrderFault}
                  onChange={(e) => setWorkOrderFault(e.target.value)}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-[11px] text-zinc-200">
                ⚠️ Bu iş emri açıldığında araç otomatik olarak <strong>BLOKAJ</strong> listesine alınacak ve test sürüşü onayı verilene kadar sefere atanamayacaktır.
              </div>

              <button
                onClick={() => {
                  createServiceWorkOrder({
                    plate: workOrderPlate,
                    fault: workOrderFault,
                    mechanic: workOrderMechanic,
                    courierName: 'Kurye Sorumlusu',
                  });
                  setShowWorkOrderModal(false);
                }}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                İş Emrini Aç ve Aracı Blokaja Al
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BLOKAJ KALDIRMA GEREKÇESİ - Monochrome */}
      {unlockModalBlockage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-white" />
                <h3 className="text-base font-bold text-white">Güvenlik Blokajını Kaldır</h3>
              </div>
              <button onClick={() => setUnlockModalBlockage(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">KİLİTLİ HEDEF:</span>
                <strong className="text-white text-sm">{unlockModalBlockage.targetName}</strong>
                <p className="text-zinc-400 mt-1">{unlockModalBlockage.blockReason}</p>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">İstisna Kaldırma Gerekçesi (Audit Loga Yazılır):</label>
                <textarea
                  rows={3}
                  value={unlockNote}
                  onChange={(e) => setUnlockNote(e.target.value)}
                  className="w-full p-2 bg-black border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <button
                onClick={() => {
                  unlockSystemBlockage(unlockModalBlockage.id, unlockNote);
                  setUnlockModalBlockage(null);
                }}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                İstisna Onayı ile Kilidi Aç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: KYC BELGE İNCELEME - Monochrome */}
      {selectedCourierForKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">
                  Kurye Belge Denetim Masası
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedCourierForKyc.name} ({selectedCourierForKyc.plate})
                </h3>
              </div>
              <button onClick={() => setSelectedCourierForKyc(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">A Sınıfı Motosiklet Ehliyeti</span>
                  <span className="text-[11px] text-zinc-400">Ön ve Arka Yüz Taraması</span>
                </div>
                <button
                  onClick={() => approveCourierDocument(selectedCourierForKyc.id, 'licenseApproved')}
                  className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold flex items-center gap-1 shadow transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Onaylı</span>
                </button>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Araç Ruhsatı ({selectedCourierForKyc.plate})</span>
                  <span className="text-[11px] text-zinc-400">{selectedCourierForKyc.motorcycle}</span>
                </div>
                <button
                  onClick={() => approveCourierDocument(selectedCourierForKyc.id, 'registrationApproved')}
                  className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold flex items-center gap-1 shadow transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Onaylı</span>
                </button>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Zorunlu Mali Sorumluluk Sigortası</span>
                  <span className="text-[11px] text-zinc-400">Poliçe Bitiş: 15.08.2027</span>
                </div>
                <button
                  onClick={() => approveCourierDocument(selectedCourierForKyc.id, 'insuranceApproved')}
                  className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold flex items-center gap-1 shadow transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Onaylı</span>
                </button>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Adli Sicil Kaydı (e-Devlet)</span>
                  <span className="text-[11px] text-zinc-400">Barkodlu Resmi Belge</span>
                </div>
                <button
                  onClick={() => approveCourierDocument(selectedCourierForKyc.id, 'criminalRecordApproved')}
                  className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold flex items-center gap-1 shadow transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Onaylı</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedCourierForKyc(null)}
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl transition-all active:scale-95"
            >
              İncelemeyi Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
