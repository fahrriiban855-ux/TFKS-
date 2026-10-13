import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Building2,
  Users,
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Key,
  ExternalLink,
  DollarSign,
  Truck,
  MapPin,
  ChevronRight,
  Filter,
  Trash2,
  Edit2,
  UserCheck,
  Send,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Download,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';
import {
  BusinessSubUser,
  BusinessSubUserRole,
  DeliveryPackageItem,
  LocationPoint,
} from '../../types/platform';
import { MapComponent } from '../common/MapComponent';

export const BusinessPortal: React.FC = () => {
  const {
    businessAccounts,
    activeBusinessAccount,
    activeBusinessSubUser,
    setActiveBusinessAccount,
    setActiveBusinessSubUserId,
    addBusinessSubUser,
    updateBusinessSubUser,
    deleteBusinessSubUser,
    couriers,
    currentRide,
    requestRide,
    showNotification,
    turkeyLocations,
  } = usePlatform();

  // Navigation tab inside Business Portal
  const [activeTab, setActiveTab] = useState<'packages' | 'dispatch' | 'subusers' | 'billing' | 'api'>('packages');

  // Sub-user management states
  const [showAddSubUserModal, setShowAddSubUserModal] = useState(false);
  const [newSubUserName, setNewSubUserName] = useState('');
  const [newSubUserEmail, setNewSubUserEmail] = useState('');
  const [newSubUserPhone, setNewSubUserPhone] = useState('');
  const [newSubUserRole, setNewSubUserRole] = useState<BusinessSubUserRole>('branch_manager');
  const [newSubUserBranch, setNewSubUserBranch] = useState(activeBusinessAccount.activeBranches[0] || 'Merkez Şube');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Dispatch Package creation states
  const [pickupBranch, setPickupBranch] = useState(activeBusinessAccount.activeBranches[0] || 'Genel Merkez');
  const [newPkgRecipientName, setNewPkgRecipientName] = useState('');
  const [newPkgRecipientPhone, setNewPkgRecipientPhone] = useState('');
  const [newPkgAddress, setNewPkgAddress] = useState('');
  const [newPkgWeight, setNewPkgWeight] = useState(1.5);
  const [newPkgSize, setNewPkgSize] = useState<'zarf' | 'kucuk' | 'orta' | 'buyuk'>('kucuk');
  const [dispatchPackages, setDispatchPackages] = useState<DeliveryPackageItem[]>([
    {
      id: 'pkg-b1',
      trackingCode: 'MP-BIZ-801',
      recipientName: 'Alişan Koçak',
      recipientPhone: '+90 532 990 11 22',
      dropoffAddress: 'Bebek Cevdetpaşa Cd. No: 42/A, Beşiktaş',
      dropoffLocation: turkeyLocations[6] || { name: 'Bebek', address: 'Bebek', lat: 41.076, lng: 29.043 },
      weightKg: 2.1,
      size: 'kucuk',
      status: 'in_transit',
      deliveryCode: '6192',
    },
    {
      id: 'pkg-b2',
      trackingCode: 'MP-BIZ-802',
      recipientName: 'Gizem Öztürk',
      recipientPhone: '+90 544 332 55 66',
      dropoffAddress: 'Levent Kanyon Residance A Blok No: 12',
      dropoffLocation: turkeyLocations[1] || { name: 'Levent', address: 'Levent', lat: 41.078, lng: 29.011 },
      weightKg: 3.4,
      size: 'orta',
      status: 'pending',
      deliveryCode: '8834',
    },
    {
      id: 'pkg-b3',
      trackingCode: 'MP-BIZ-803',
      recipientName: 'Mert Aksoy',
      recipientPhone: '+90 555 771 88 99',
      dropoffAddress: 'Maslak 1453 B4 Girişi, Sarıyer',
      dropoffLocation: turkeyLocations[2] || { name: 'Maslak', address: 'Maslak', lat: 41.106, lng: 29.024 },
      weightKg: 1.2,
      size: 'zarf',
      status: 'delivered',
      deliveryCode: '2411',
      deliveredAt: 'Bugün 15:20',
      verifiedRecipientName: 'Mert Aksoy (İmza Alındı)',
    },
  ]);

  // Billing payment modal
  const [showPayBalanceModal, setShowPayBalanceModal] = useState(false);
  const [paymentAmountInput, setPaymentAmountInput] = useState(5000);

  // ACL Filter Check
  const canCreate = activeBusinessSubUser?.permissions.canCreateOrders ?? true;
  const canCancel = activeBusinessSubUser?.permissions.canCancelOrders ?? true;
  const canFinancials = activeBusinessSubUser?.permissions.canViewFinancials ?? true;
  const canManageUsers = activeBusinessSubUser?.permissions.canManageSubUsers ?? true;

  // Add sub-user submit
  const handleCreateSubUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubUserName || !newSubUserEmail) {
      showNotification({
        title: 'Eksik Alan',
        message: 'Lütfen isim ve e-posta alanlarını eksiksiz doldurun.',
        type: 'warning',
      });
      return;
    }

    addBusinessSubUser(activeBusinessAccount.id, {
      businessId: activeBusinessAccount.id,
      businessName: activeBusinessAccount.title,
      name: newSubUserName,
      email: newSubUserEmail,
      phone: newSubUserPhone || '+90 500 000 00 00',
      avatar: newSubUserName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      role: newSubUserRole,
      branchName: newSubUserBranch,
      status: 'active',
      permissions: {
        canCreateOrders: newSubUserRole !== 'accountant' && newSubUserRole !== 'read_only',
        canCancelOrders: newSubUserRole === 'owner' || newSubUserRole === 'branch_manager',
        canViewFinancials: newSubUserRole === 'owner' || newSubUserRole === 'accountant',
        canManageSubUsers: newSubUserRole === 'owner',
        canExportReports: newSubUserRole !== 'dispatch_staff',
        canManageApiKeys: newSubUserRole === 'owner',
      },
    });

    setNewSubUserName('');
    setNewSubUserEmail('');
    setNewSubUserPhone('');
    setShowAddSubUserModal(false);
  };

  // Add package to dispatch
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) {
      showNotification({
        title: 'ACL Yetki Reddi',
        message: 'Rolünüz paket oluşturma yetkisine sahip değildir.',
        type: 'error',
      });
      return;
    }
    if (!newPkgRecipientName || !newPkgAddress) {
      showNotification({
        title: 'Eksik Bilgi',
        message: 'Lütfen alıcı adı ve teslimat adresini belirtin.',
        type: 'warning',
      });
      return;
    }

    const newPkg: DeliveryPackageItem = {
      id: `pkg-${Date.now().toString().slice(-4)}`,
      trackingCode: `MP-BIZ-${Math.floor(100 + Math.random() * 900)}`,
      recipientName: newPkgRecipientName,
      recipientPhone: newPkgRecipientPhone || '+90 530 000 00 00',
      dropoffAddress: newPkgAddress,
      dropoffLocation: turkeyLocations[0],
      weightKg: newPkgWeight,
      size: newPkgSize,
      status: 'pending',
      deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    setDispatchPackages([newPkg, ...dispatchPackages]);
    setNewPkgRecipientName('');
    setNewPkgRecipientPhone('');
    setNewPkgAddress('');
    showNotification({
      title: 'Paket Kuyruğa Eklendi',
      message: `${newPkg.trackingCode} teslimat listesine eklendi.`,
      type: 'success',
    });
  };

  // Request Express Courier for all pending packages
  const handleCallBusinessCourier = () => {
    const pendingList = dispatchPackages.filter((p) => p.status === 'pending');
    if (pendingList.length === 0) {
      showNotification({
        title: 'Bekleyen Paket Yok',
        message: 'Tüm paketler zaten atanmış veya teslim edilmiş.',
        type: 'info',
      });
      return;
    }

    const pickupLocation: LocationPoint = {
      name: `${activeBusinessAccount.brandName} (${pickupBranch})`,
      address: activeBusinessAccount.address,
      lat: 41.0505,
      lng: 28.9938,
    };

    requestRide({
      serviceType: 'isletme_siparis',
      pickup: pickupLocation,
      dropoff: pendingList[0].dropoffLocation || turkeyLocations[1],
      pickupDescription: `${pickupBranch} Sevkiyat Kapısı / Hazır ${pendingList.length} Paket`,
      pickupConfirmedByUser: true,
      multiPackageCount: pendingList.length,
      packageNote: `İşletme B2B Toplu Teslimat (${pendingList.length} Paket)`,
      deliveryInstructions: 'Her teslimatta alıcı teslim kodunu kurye terminaline girmelidir.',
      paymentMethod: 'wallet',
    });

    // Mark packages as in_transit
    setDispatchPackages((prev) =>
      prev.map((p) => (p.status === 'pending' ? { ...p, status: 'in_transit' } : p))
    );

    showNotification({
      title: 'Kurye Çağrıldı & Görev Başlatıldı',
      message: `${pendingList.length} adet paket için en yakın filo kuryesi yönlendirildi.`,
      type: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ==================================================================== */}
      {/* KURUMSAL BAŞLIK & OTURUM BİLGİSİ (İŞLETME VE ALT KULLANICI AYRIMI)   */}
      {/* ==================================================================== */}
      <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#BF5AF2]/15 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#BF5AF2] to-[#5E5CE6] flex items-center justify-center text-white shadow-lg shrink-0">
              <Building2 className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#BF5AF2]/20 text-[#BF5AF2] border border-[#BF5AF2]/30">
                  Kurumsal İşletme Portalı
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {activeBusinessAccount.taxNumber} · {activeBusinessAccount.taxOffice}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {activeBusinessAccount.title}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeBusinessAccount.brandName} · {activeBusinessAccount.address}
              </p>
            </div>
          </div>

          {/* İşletme ve Alt Kullanıcı Oturum Seçici (Portal Farklılığı Kuralı) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/40 border border-white/[0.08] p-2.5 rounded-2xl">
            {/* Firma Değiştir */}
            <div className="flex flex-col">
              <label className="text-[10px] text-zinc-500 font-semibold px-2 mb-1">Aktif İşletme:</label>
              <select
                value={activeBusinessAccount.id}
                onChange={(e) => setActiveBusinessAccount(e.target.value)}
                className="bg-[#2C2C2E] border border-white/[0.1] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#BF5AF2]"
              >
                {businessAccounts.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brandName} ({b.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Alt Kullanıcı Oturumu (ACL) */}
            <div className="flex flex-col">
              <label className="text-[10px] text-zinc-500 font-semibold px-2 mb-1">Giriş Yapan Alt Kullanıcı (ACL):</label>
              <select
                value={activeBusinessSubUser?.id || ''}
                onChange={(e) => setActiveBusinessSubUserId(e.target.value)}
                className="bg-[#2C2C2E] border border-white/[0.1] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#BF5AF2]"
              >
                {activeBusinessAccount.subUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role === 'owner' ? 'Şirket Sahibi' : u.role === 'branch_manager' ? 'Şube Müdürü' : u.role === 'accountant' ? 'Muhasebe' : u.role === 'dispatch_staff' ? 'Sevkiyat' : 'İzleyici'} ({u.branchName})
                  </option>
                ))}
              </select>
            </div>

            {/* Yetki Rozeti */}
            <div className="sm:self-end pt-1">
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-center">
                <span className="text-[10px] text-zinc-400 block font-medium">ACL Kapsamı:</span>
                <span className="text-xs font-bold text-[#30D158]">
                  {activeBusinessSubUser?.branchName || 'Tüm Şubeler'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sekmeler (Apple Segmented Bar) */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'packages'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Paketler & Canlı Takip ({dispatchPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'dispatch'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Yeni Sevkiyat & Kurye Çağır</span>
          </button>

          <button
            onClick={() => setActiveTab('subusers')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'subusers'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Alt Kullanıcılar & Roller ({activeBusinessAccount.subUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'billing'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Cari Hesap & Fatura</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'api'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>B2B API & Webhook</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. SEKME: PAKETLER & CANLI TAKİP RADARI (ACL FİLTRELİ)                 */}
      {/* ==================================================================== */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">İşletme Teslimat Kuyruğu</h2>
                <p className="text-xs text-zinc-400">
                  {activeBusinessSubUser?.branchName} şubesi ve yetkili kurye görevleri
                </p>
              </div>

              {canCreate && (
                <button
                  onClick={() => setActiveTab('dispatch')}
                  className="px-3.5 py-2 bg-[#BF5AF2] hover:bg-[#A343D6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Paket Ekle</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {dispatchPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/[0.14]"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                        pkg.status === 'delivered'
                          ? 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30'
                          : pkg.status === 'in_transit'
                          ? 'bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30'
                          : 'bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{pkg.trackingCode}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            pkg.status === 'delivered'
                              ? 'bg-[#30D158]/20 text-[#30D158]'
                              : pkg.status === 'in_transit'
                              ? 'bg-[#0A84FF]/20 text-[#0A84FF]'
                              : 'bg-[#FF9F0A]/20 text-[#FF9F0A]'
                          }`}
                        >
                          {pkg.status === 'delivered'
                            ? 'Teslim Edildi'
                            : pkg.status === 'in_transit'
                            ? 'Kuryede Yolda'
                            : 'Kurye Bekliyor'}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Doğrulama Kodu: <strong className="text-white">{pkg.deliveryCode}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white mt-1">{pkg.recipientName}</h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{pkg.dropoffAddress}</span>
                      </p>
                      <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-3">
                        <span>Tel: {pkg.recipientPhone}</span>
                        <span>·</span>
                        <span>Ağırlık: {pkg.weightKg} kg</span>
                        <span>·</span>
                        <span>Boyut: {pkg.size.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    {pkg.status === 'delivered' ? (
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#30D158] bg-[#30D158]/10 px-3 py-1.5 rounded-xl border border-[#30D158]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{pkg.deliveredAt || 'Teslim Tamam'}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#0A84FF] bg-[#0A84FF]/10 px-3 py-1.5 rounded-xl border border-[#0A84FF]/20">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Tahmini: 25 Dk</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: Canlı Kurye Haritası & Durum Özeti */}
          <div className="space-y-4">
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#BF5AF2]" />
                <span>Canlı Filo Kurye Radarı</span>
              </h3>

              <div className="h-56 rounded-2xl overflow-hidden border border-white/[0.08] relative">
                <MapComponent couriers={couriers} currentRide={currentRide} heightClass="h-full" />
              </div>

              <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Çevrim İçi Kurye Sayısı:</span>
                  <span className="font-mono font-bold text-white">
                    {couriers.filter((c) => c.isOnline).length} Aktif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Ortalama Teslim Süresi:</span>
                  <span className="font-mono font-bold text-[#30D158]">22 Dakika</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Başarı Oranı (SLA):</span>
                  <span className="font-mono font-bold text-white">%99.4</span>
                </div>
              </div>

              <button
                onClick={handleCallBusinessCourier}
                className="w-full py-3.5 bg-[#BF5AF2] hover:bg-[#A343D6] text-white font-bold text-xs rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Bekleyen Paketler İçin Kurye Çağır</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SEKME: YENİ SEVKİYAT OLUŞTURMA & B2B GÖREV GİRİŞİ                 */}
      {/* ==================================================================== */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#BF5AF2]" />
              <span>Yeni Teslimat Paketi Ekle</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Bu formla işletmenize ait yeni bir teslimat paketi tanımlayabilir ve kurye ataması yapabilirsiniz.
            </p>

            <form onSubmit={handleAddPackage} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Çıkış Şubesi:</label>
                <select
                  value={pickupBranch}
                  onChange={(e) => setPickupBranch(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#BF5AF2]"
                >
                  {activeBusinessAccount.activeBranches.map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Alıcı Adı & Soyadı:</label>
                  <input
                    type="text"
                    required
                    value={newPkgRecipientName}
                    onChange={(e) => setNewPkgRecipientName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Alıcı Telefonu:</label>
                  <input
                    type="text"
                    value={newPkgRecipientPhone}
                    onChange={(e) => setNewPkgRecipientPhone(e.target.value)}
                    placeholder="Örn: +90 532 123 45 67"
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Teslimat Adresi (Türkiye Çapında Serbest):</label>
                <textarea
                  required
                  rows={2}
                  value={newPkgAddress}
                  onChange={(e) => setNewPkgAddress(e.target.value)}
                  placeholder="İlçe, Mahalle, Cadde/Sokak, Bina No, Daire, Kat..."
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Paket Ağırlığı (Kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="30"
                    value={newPkgWeight}
                    onChange={(e) => setNewPkgWeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#BF5AF2]"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Boyut Sınıfı:</label>
                  <select
                    value={newPkgSize}
                    onChange={(e) => setNewPkgSize(e.target.value as any)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#BF5AF2]"
                  >
                    <option value="zarf">Evrak / Zarf</option>
                    <option value="kucuk">Küçük Koli (&lt; 3 Kg)</option>
                    <option value="orta">Orta Koli (3 - 10 Kg)</option>
                    <option value="buyuk">Büyük Koli (10 - 25 Kg)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!canCreate}
                className="w-full py-3 bg-[#BF5AF2] hover:bg-[#A343D6] disabled:opacity-50 text-white font-bold rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Paketi Listeye Ekle</span>
              </button>
            </form>
          </div>

          {/* Toplu İşlem & Kurye Çağırma */}
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#30D158]" />
                <span>Kurye Çağır & Toplu Gönder</span>
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hazırlanan tüm paketler tek bir kuryeye teslim edilerek optimize edilmiş rota sırasıyla dağıtıma çıkarılır. Her paket alıcıya ulaştığında SMS doğrulama kodu ile teslim onaylanır.
              </p>

              <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/[0.06] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Bekleyen Paket Sayısı:</span>
                  <span className="font-mono font-bold text-white">
                    {dispatchPackages.filter((p) => p.status === 'pending').length} Adet
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Toplu Dağıtım İndirimi:</span>
                  <span className="font-mono font-bold text-[#30D158]">%20 Kurumsal İndirim</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Ödeme Şekli:</span>
                  <span className="font-mono font-bold text-zinc-300">Cari Hesaba Mahsuben (Haftalık Fatura)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCallBusinessCourier}
              className="w-full py-4 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-2xl shadow-[0_4px_20px_rgba(48,209,88,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Hemen Kurye Çağır ({dispatchPackages.filter((p) => p.status === 'pending').length} Paket)</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. SEKME: İŞLETME ALT KULLANICILARI & ACL ROLLERİ                    */}
      {/* ==================================================================== */}
      {activeTab === 'subusers' && (
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-[#BF5AF2]" />
                <span>İşletme Alt Kullanıcıları & ACL Yetkileri</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeBusinessAccount.brandName} adına sisteme erişebilen yetkili personel ve şube yöneticileri
              </p>
            </div>

            {canManageUsers && (
              <button
                onClick={() => setShowAddSubUserModal(true)}
                className="px-4 py-2.5 bg-[#BF5AF2] hover:bg-[#A343D6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Alt Kullanıcı Tanımla</span>
              </button>
            )}
          </div>

          {/* Alt Kullanıcı Tablosu */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 font-semibold">
                  <th className="pb-3 px-3">Kullanıcı</th>
                  <th className="pb-3 px-3">Rol & Yetki Seviyesi</th>
                  <th className="pb-3 px-3">Atandığı Şube</th>
                  <th className="pb-3 px-3">Durum</th>
                  <th className="pb-3 px-3">Son Giriş</th>
                  <th className="pb-3 px-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {activeBusinessAccount.subUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BF5AF2] to-[#5E5CE6] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                          {user.avatar || user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{user.name}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'owner'
                            ? 'bg-[#BF5AF2]/20 text-[#BF5AF2] border border-[#BF5AF2]/30'
                            : user.role === 'branch_manager'
                            ? 'bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30'
                            : user.role === 'accountant'
                            ? 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30'
                            : 'bg-zinc-700/40 text-zinc-300'
                        }`}
                      >
                        {user.role === 'owner'
                          ? 'Şirket Sahibi'
                          : user.role === 'branch_manager'
                          ? 'Şube Müdürü'
                          : user.role === 'accountant'
                          ? 'Muhasebe'
                          : user.role === 'dispatch_staff'
                          ? 'Sevkiyat'
                          : 'İzleyici'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-zinc-300">{user.branchName}</td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#30D158] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                        Aktif
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-500 font-mono text-[11px]">{user.lastLoginAt}</td>

                    <td className="py-3.5 px-3 text-right">
                      {user.role !== 'owner' && canManageUsers && (
                        <button
                          onClick={() => deleteBusinessSubUser(user.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Yetkiyi Kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ==================================================================== */}
      {/* 4. SEKME: CARİ HESAP, FATURALAR VE MUTABAKAT                         */}
      {/* ==================================================================== */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] text-zinc-400 font-medium block">Güncel Cari Bakiye</span>
              <span className="text-2xl font-bold font-mono text-[#FF453A] mt-1 block">
                {activeBusinessAccount.currentBalance.toLocaleString('tr-TR')} ₺
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Borç (Haftalık Faturalandırma)</span>
            </div>

            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-5 shadow-xl">
              <span className="text-[11px] text-zinc-400 font-medium block">Tanımlı Kredi Limiti</span>
              <span className="text-2xl font-bold font-mono text-[#30D158] mt-1 block">
                {activeBusinessAccount.creditLimit.toLocaleString('tr-TR')} ₺
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Kalan Kullanılabilir Limit: {(activeBusinessAccount.creditLimit + activeBusinessAccount.currentBalance).toLocaleString('tr-TR')} ₺</span>
            </div>

            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 font-medium block">Fatura Periyodu</span>
                <span className="text-base font-bold text-white mt-1 block">Haftalık Toplu E-Fatura</span>
              </div>
              <button
                onClick={() => setShowPayBalanceModal(true)}
                className="mt-3 w-full py-2 bg-[#0A84FF] hover:bg-[#0077ED] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Cari Borç Ödemesi Yap
              </button>
            </div>
          </div>

          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#BF5AF2]" />
                <span>Geçmiş Kurumsal E-Faturalar</span>
              </h3>
              <button className="text-xs text-[#0A84FF] hover:underline flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>Toplu Ekstre İndir</span>
              </button>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">E-Fatura #MP-2026-0814</span>
                  <span className="text-zinc-500 text-[11px]">01.10.2026 - 07.10.2026 Sevkiyatları</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white">12.450,00 ₺</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] text-[10px] font-bold">Ödendi</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">E-Fatura #MP-2026-0792</span>
                  <span className="text-zinc-500 text-[11px]">24.09.2026 - 30.09.2026 Sevkiyatları</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white">9.800,00 ₺</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] text-[10px] font-bold">Ödendi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. SEKME: B2B API & WEBHOOK ENTEGRASYONU                             */}
      {/* ==================================================================== */}
      {activeTab === 'api' && (
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="w-4 h-4 text-[#BF5AF2]" />
              <span>B2B Entegrasyon & Webhook Yönetimi</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Restoran POS, E-Ticaret altyapınız veya ERP sisteminizden tek tıkla otomatik MotoPilot kuryesi çağırmak için API anahtarlarınızı kullanın.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold block">Canlı API Anahtarı (Bearer Token):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={activeBusinessAccount.apiKey}
                  className="flex-1 bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeBusinessAccount.apiKey);
                    showNotification({
                      title: 'API Anahtarı Kopyalandı',
                      message: 'Gizli API anahtarı panoya kopyalandı.',
                      type: 'success',
                    });
                  }}
                  className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold rounded-xl transition-all"
                >
                  Kopyala
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold block">Canlı Webhook Bildirim Uç Noktası:</label>
              <input
                type="text"
                readOnly
                value={activeBusinessAccount.webhookUrl || 'https://api.burgerandco.com.tr/v1/motopilot-webhook'}
                className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/[0.06] space-y-2">
              <h4 className="font-bold text-white">Desteklenen Webhook Olayları</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                  <span>order.courier_assigned (Kurye atandı)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                  <span>order.picked_up (Paket alındı)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                  <span>order.delivered (Teslim edildi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                  <span>courier.live_location (Canlı koordinat)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: YENİ ALT KULLANICI EKLEME                                    */}
      {/* ==================================================================== */}
      {showAddSubUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-[32px] p-6 max-w-md w-full shadow-2xl text-xs text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#BF5AF2]" />
                <h3 className="font-bold text-sm text-white">Yeni Alt Kullanıcı Tanımla</h3>
              </div>
              <button
                onClick={() => setShowAddSubUserModal(false)}
                className="text-zinc-500 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubUser} className="space-y-3.5">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Ad Soyad:</label>
                <input
                  type="text"
                  required
                  value={newSubUserName}
                  onChange={(e) => setNewSubUserName(e.target.value)}
                  placeholder="Örn: Burak Özkan"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Kurumsal E-Posta:</label>
                <input
                  type="email"
                  required
                  value={newSubUserEmail}
                  onChange={(e) => setNewSubUserEmail(e.target.value)}
                  placeholder="Örn: burak@isletme.com.tr"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Telefon Numarası:</label>
                <input
                  type="text"
                  value={newSubUserPhone}
                  onChange={(e) => setNewSubUserPhone(e.target.value)}
                  placeholder="+90 532 000 00 00"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Kullanıcı Rolü:</label>
                  <select
                    value={newSubUserRole}
                    onChange={(e) => setNewSubUserRole(e.target.value as any)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#BF5AF2]"
                  >
                    <option value="branch_manager">Şube Müdürü</option>
                    <option value="dispatch_staff">Sevkiyat Personeli</option>
                    <option value="accountant">Muhasebe</option>
                    <option value="read_only">Salt Okunur (İzleyici)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Şube Kapsamı (ACL):</label>
                  <select
                    value={newSubUserBranch}
                    onChange={(e) => setNewSubUserBranch(e.target.value)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-[#BF5AF2]"
                  >
                    {activeBusinessAccount.activeBranches.map((br) => (
                      <option key={br} value={br}>
                        {br}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSubUserModal(false)}
                  className="flex-1 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] rounded-xl font-bold transition-all"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#BF5AF2] hover:bg-[#A343D6] text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                  Kullanıcıyı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CARİ BORÇ ÖDEMESİ                                             */}
      {/* ==================================================================== */}
      {showPayBalanceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-[32px] p-6 max-w-sm w-full shadow-2xl text-xs text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-bold text-sm text-white">Cari Hesap Ödemesi</h3>
              <button onClick={() => setShowPayBalanceModal(false)} className="text-zinc-500 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Ödenecek Tutar (₺):</label>
                <input
                  type="number"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-[#30D158]"
                />
              </div>

              <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] text-[11px] text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Ödeme Yöntemi:</span>
                  <span className="text-white font-medium">B2B Kurumsal Sanal POS</span>
                </div>
                <div className="flex justify-between">
                  <span>İşlem Türü:</span>
                  <span className="text-white font-medium">Cari Bakiye Kapatma</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showNotification({
                    title: 'Ödeme Alındı & Cari Bakiye Güncellendi',
                    message: `${paymentAmountInput.toLocaleString('tr-TR')} ₺ cari hesaba işlendi.`,
                    type: 'success',
                  });
                  setShowPayBalanceModal(false);
                }}
                className="w-full py-3 bg-[#30D158] hover:bg-[#34C759] text-black font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Ödemeyi Onayla & Cariyi Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
