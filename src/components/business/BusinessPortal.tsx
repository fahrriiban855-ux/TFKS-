import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import {
  Building2,
  Users,
  Package,
  Plus,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Key,
  DollarSign,
  Truck,
  MapPin,
  Trash2,
  Send,
  AlertTriangle,
  Download,
  Lock,
  Layers,
  Zap,
  Globe,
  Navigation,
  Upload,
  ArrowRight,
} from 'lucide-react';
import {
  BusinessSubUserRole,
  BusinessSubscriptionStatus,
  DeliveryPackageItem,
  IntroCampaignStatus,
  LocationPoint,
} from '../../types/platform';
import { MapComponent } from '../common/MapComponent';
import {
  BatchRoutePlanRecord,
  B2BWebhookOrderEvent,
  BUSINESS_SUBSCRIPTION_STATES_META,
  ExternalOrderChannel,
  INITIAL_WIRE_SUBMISSIONS,
  INTRO_CAMPAIGN_STATES_META,
  WirePaymentSubmission,
  buildOptimizedBatchRoute,
  createSimulatedB2BWebhookEvent,
} from '../../services/motopilotEngines';
import {
  syncBatchRouteToFirestore,
  syncOrderToFirestore,
  syncWireNoticeToFirestore,
} from '../../services/firebase';

export const BusinessPortal: React.FC = () => {
  const {
    businessAccounts,
    activeBusinessAccount,
    activeBusinessSubUser,
    setActiveBusinessAccount,
    setActiveBusinessSubUserId,
    addBusinessSubUser,
    deleteBusinessSubUser,
    couriers,
    currentRide,
    requestRide,
    showNotification,
    turkeyLocations,
    recordAuditLog,
    setActiveView,
  } = usePlatform();

  // Navigation tab inside Business Portal
  const [activeTab, setActiveTab] = useState<
    'packages' | 'dispatch' | 'multidrop' | 'subusers' | 'billing' | 'api'
  >('packages');

  // GAP-01: Live IntroCampaign (6 states) & BusinessSubscription (8 states) state machine
  const [introCampaignState, setIntroCampaignState] = useLocalStorageState<IntroCampaignStatus>(
    'mp_intro_campaign_state_v1',
    'ACTIVE'
  );
  const [subscriptionStatus, setSubscriptionStatus] =
    useLocalStorageState<BusinessSubscriptionStatus>(
      'mp_business_sub_state_v1',
      activeBusinessAccount.subscriptionStatus || 'FREE_INTRO'
    );

  // GAP-01: EFT / Wire Payment Notices shared with AdminDashboard
  const [wireNotices, setWireNotices] = useLocalStorageState<WirePaymentSubmission[]>(
    'mp_wire_notices_v1',
    INITIAL_WIRE_SUBMISSIONS
  );
  const [wireRefCodeInput, setWireRefCodeInput] = useState('TR-EFT-20261014-5520');
  const [wireIbanInput, setWireIbanInput] = useState('TR44 0006 2000 4190 0006 2991 12');
  const [wirePlanInput, setWirePlanInput] = useState<'WEEKLY_PRO_750' | 'MONTHLY_PRO_1490'>(
    'WEEKLY_PRO_750'
  );
  const [wireReceiptFile, setWireReceiptFile] = useState('isbank_dekont_haftalik_750tl.pdf');

  // GAP-04: Multi-Drop Batching & SaaS Auto-Dispatch
  const [autoDispatchEnabled, setAutoDispatchEnabled] = useLocalStorageState<boolean>(
    'mp_saas_autodispatch_v1',
    true
  );
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(12);
  const [selectedCorridor, setSelectedCorridor] = useState<string>(
    'Beşiktaş · Levent · Maslak Kuzey Koridoru'
  );
  const [batchRoutes, setBatchRoutes] = useLocalStorageState<BatchRoutePlanRecord[]>(
    'mp_batch_routes_v1',
    []
  );

  // GAP-05: B2B External Order Webhook Hub
  const [webhookEvents, setWebhookEvents] = useLocalStorageState<B2BWebhookOrderEvent[]>(
    'mp_b2b_webhooks_v1',
    []
  );
  const [selectedExternalChannel, setSelectedExternalChannel] =
    useState<ExternalOrderChannel>('YEMEKSEPETI');

  // Sub-user management states
  const [showAddSubUserModal, setShowAddSubUserModal] = useState(false);
  const [newSubUserName, setNewSubUserName] = useState('');
  const [newSubUserEmail, setNewSubUserEmail] = useState('');
  const [newSubUserPhone, setNewSubUserPhone] = useState('');
  const [newSubUserRole, setNewSubUserRole] = useState<BusinessSubUserRole>('branch_manager');
  const [newSubUserBranch, setNewSubUserBranch] = useState(
    activeBusinessAccount.activeBranches[0] || 'Merkez Şube'
  );

  // Dispatch Package creation states
  const [pickupBranch, setPickupBranch] = useState(
    activeBusinessAccount.activeBranches[0] || 'Genel Merkez'
  );
  const [newPkgRecipientName, setNewPkgRecipientName] = useState('');
  const [newPkgRecipientPhone, setNewPkgRecipientPhone] = useState('');
  const [newPkgAddress, setNewPkgAddress] = useState('');
  const [newPkgWeight, setNewPkgWeight] = useState(1.5);
  const [newPkgSize, setNewPkgSize] = useState<'zarf' | 'kucuk' | 'orta' | 'buyuk'>('kucuk');
  const [dispatchPackages, setDispatchPackages] = useLocalStorageState<DeliveryPackageItem[]>(
    'mp_business_packages_v1',
    [
      {
        id: 'pkg-b1',
        trackingCode: 'MP-BIZ-801',
        recipientName: 'Alişan Koçak',
        recipientPhone: '+90 532 990 11 22',
        dropoffAddress: 'Bebek Cevdetpaşa Cd. No: 42/A, Beşiktaş',
        dropoffLocation: turkeyLocations[6] || {
          name: 'Bebek',
          address: 'Bebek',
          lat: 41.076,
          lng: 29.043,
        },
        weightKg: 2.1,
        size: 'kucuk',
        status: 'pending',
        deliveryCode: '6192',
      },
      {
        id: 'pkg-b2',
        trackingCode: 'MP-BIZ-802',
        recipientName: 'Gizem Öztürk',
        recipientPhone: '+90 544 332 55 66',
        dropoffAddress: 'Levent Kanyon Residence A Blok No: 12',
        dropoffLocation: turkeyLocations[1] || {
          name: 'Levent',
          address: 'Levent',
          lat: 41.078,
          lng: 29.011,
        },
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
        dropoffLocation: turkeyLocations[2] || {
          name: 'Maslak',
          address: 'Maslak',
          lat: 41.106,
          lng: 29.024,
        },
        weightKg: 1.2,
        size: 'zarf',
        status: 'delivered',
        deliveryCode: '2411',
        deliveredAt: 'Bugün 15:20',
        verifiedRecipientName: 'Mert Aksoy (İmza Alındı)',
      },
    ]
  );

  // Billing payment modal
  const [showPayBalanceModal, setShowPayBalanceModal] = useState(false);
  const [paymentAmountInput, setPaymentAmountInput] = useState(750);

  // ACL Filter Check & Subscription Lock Check
  const canCreate = activeBusinessSubUser?.permissions.canCreateOrders ?? true;
  const canManageUsers = activeBusinessSubUser?.permissions.canManageSubUsers ?? true;

  const currentSubMeta =
    BUSINESS_SUBSCRIPTION_STATES_META.find((m) => m.status === subscriptionStatus) ||
    BUSINESS_SUBSCRIPTION_STATES_META[0];
  const isBusinessDeliveryAllowed = currentSubMeta.canCreateBusinessDelivery;

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
      avatar: newSubUserName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
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
    if (!isBusinessDeliveryAllowed) {
      showNotification({
        title: `BUSINESS_DELIVERY Kilitli (${subscriptionStatus})`,
        message:
          'İşletme aboneliğiniz askıda veya paket seçimi bekliyor. Havale/EFT bildirimi yapabilir ya da Bireysel Kurye (INDIVIDUAL_DELIVERY) çağırabilirsiniz.',
        type: 'error',
        isCritical: true,
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
    if (!isBusinessDeliveryAllowed) {
      showNotification({
        title: `Üyelik Kilidi (${subscriptionStatus})`,
        message:
          'Profesyonel işletme teslimatı (BUSINESS_DELIVERY) için lütfen haftalık üyelik Havale/EFT bildirimi gönderin veya Bireysel Kurye köprüsünü kullanın.',
        type: 'error',
        isCritical: true,
      });
      return;
    }

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
      packageNote: `İşletme B2B Toplu Teslimat (${pendingList.length} Paket · Hazırlık: ${prepTimeMinutes} dk)`,
      deliveryInstructions: 'Her teslimatta alıcı teslim kodunu kurye terminaline girmelidir.',
      packagesList: pendingList,
      paymentMethod: 'wallet',
    });

    setDispatchPackages((prev) =>
      prev.map((p) => (p.status === 'pending' ? { ...p, status: 'in_transit' } : p))
    );

    showNotification({
      title: 'Kurye Çağrıldı & %0 Komisyon Snapshot Mühürlendi',
      message: `${pendingList.length} adet paket için en yakın filo kuryesi yönlendirildi (%100 kurye hakedişi).`,
      type: 'success',
    });
  };

  // GAP-04: Build Multi-Drop Batch Route Plan
  const handleCreateMultiDropBatch = async () => {
    if (!isBusinessDeliveryAllowed) {
      showNotification({
        title: `Çoklu Rota Kilitli (${subscriptionStatus})`,
        message: 'Çoklu paket birleştirme (Multi-Drop) yalnız aktif işletme üyeliğinde çalışır.',
        type: 'error',
      });
      return;
    }

    const pendingList = dispatchPackages.filter((p) => p.status === 'pending');
    const sourcePackages =
      pendingList.length >= 2
        ? pendingList
        : [
            {
              id: 'pkg-auto-1',
              trackingCode: `MP-BIZ-${Math.floor(100 + Math.random() * 899)}`,
              recipientName: 'Alişan Koçak',
              recipientPhone: '+90 532 990 11 22',
              dropoffAddress: 'Bebek Cevdetpaşa Cd. No: 42/A, Beşiktaş',
            },
            {
              id: 'pkg-auto-2',
              trackingCode: `MP-BIZ-${Math.floor(100 + Math.random() * 899)}`,
              recipientName: 'Gizem Öztürk',
              recipientPhone: '+90 544 332 55 66',
              dropoffAddress: 'Levent Kanyon Residence A Blok No: 12',
            },
            {
              id: 'pkg-auto-3',
              trackingCode: `MP-BIZ-${Math.floor(100 + Math.random() * 899)}`,
              recipientName: 'Mert Aksoy',
              recipientPhone: '+90 555 771 88 99',
              dropoffAddress: 'Maslak 1453 B4 Girişi, Sarıyer',
            },
          ];

    const availableCourier = couriers.find((c) => c.isOnline) || couriers[0];
    const plan = buildOptimizedBatchRoute({
      businessId: activeBusinessAccount.id,
      businessName: activeBusinessAccount.brandName,
      corridorName: selectedCorridor,
      packages: sourcePackages,
      assignedCourierId: availableCourier?.id,
      assignedCourierName: availableCourier?.name || 'Burak Yılmaz',
      prepTimeMinutes,
      subscriptionStatus,
    });

    setBatchRoutes((prev) => [plan, ...prev]);
    setDispatchPackages((prev) =>
      prev.map((p) => (p.status === 'pending' ? { ...p, status: 'in_transit' } : p))
    );

    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'BusinessPortal/MultiDropBatchEngine',
      recordId: plan.batchId,
      previousValue: `Ayrı Rotalar: ${plan.standaloneTotalKm} km`,
      newValue: `Optimize Rota: ${plan.optimizedBatchKm} km (%${plan.kmSavedPercent} Tasarruf · %0 Komisyon · ${plan.stops.length} Durak)`,
      justification: `MotoPilot Multi-Drop Batching motoru ${plan.stops.length} paketi tek rotada birleştirdi.`,
    });

    await syncBatchRouteToFirestore({
      batchId: plan.batchId,
      businessId: plan.businessId,
      corridorName: plan.corridorName,
      packageCount: plan.stops.length,
      kmSavedPercent: plan.kmSavedPercent,
      status: plan.status,
    });

    showNotification({
      title: `Akıllı Çoklu Rota Oluşturuldu (${plan.batchId})`,
      message: `${plan.stops.length} paket birleştirildi · %${plan.kmSavedPercent} KM tasarrufu · Kurye: ${plan.assignedCourierName}`,
      type: 'success',
    });
  };

  // GAP-05: Simulate Live External Order Webhook (Yemeksepeti/Getir/Trendyol/POS/Shopify)
  const handleSimulateB2BWebhookOrder = async () => {
    if (!isBusinessDeliveryAllowed) {
      showNotification({
        title: `B2B Webhook Duraklatıldı (${subscriptionStatus})`,
        message: 'Dış kanaldan otomatik kurye ataması için aktif üyelik gereklidir.',
        type: 'error',
      });
      return;
    }

    const availableCourier = couriers.find((c) => c.isOnline) || couriers[0];
    const ev = createSimulatedB2BWebhookEvent({
      channel: selectedExternalChannel,
      businessId: activeBusinessAccount.id,
      assignedCourierName: availableCourier?.name || 'Burak Yılmaz',
      subscriptionStatus,
    });

    setWebhookEvents((prev) => [ev, ...prev]);

    const newPkg: DeliveryPackageItem = {
      id: `pkg-${ev.eventId}`,
      trackingCode: ev.externalOrderId,
      recipientName: ev.customerName,
      recipientPhone: ev.customerPhone,
      dropoffAddress: ev.dropoffAddress,
      dropoffLocation: turkeyLocations[1] || {
        name: 'Levent',
        address: ev.dropoffAddress,
        lat: 41.078,
        lng: 29.011,
      },
      weightKg: 1.8,
      size: 'kucuk',
      status: autoDispatchEnabled ? 'in_transit' : 'pending',
      deliveryCode: ev.pinCode,
    };

    setDispatchPackages((prev) => [newPkg, ...prev]);

    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'BusinessPortal/B2BWebhookHub',
      recordId: ev.externalOrderId,
      previousValue: `Dış Kanal: ${ev.channel}`,
      newValue: `Otomatik Kurye: ${ev.assignedCourierName} · %0 Komisyon (${ev.deliveryFeeTl} ₺ Net)`,
      justification: `${ev.channel} kanalından gelen dış sipariş Webhook üzerinden MotoPilot filosuna aktarıldı.`,
    });

    await syncOrderToFirestore({
      orderId: ev.externalOrderId,
      serviceType: 'BUSINESS_DELIVERY',
      status: autoDispatchEnabled ? 'accepted' : 'searching',
      pickupName: activeBusinessAccount.brandName,
      dropoffName: ev.dropoffAddress,
      totalFare: ev.deliveryFeeTl,
      snapshotHash: ev.feeSnapshot.snapshotHash,
    });

    showNotification({
      title: `${ev.channel} Siparişi Çekildi (${ev.externalOrderId})`,
      message: `${ev.customerName} · Hazırlık: ${ev.prepTimeMinutes} dk · Otomatik Kurye: ${ev.assignedCourierName} (%0 Komisyon)`,
      type: 'success',
    });
  };

  // GAP-01: Submit EFT / Wire Payment Notice for Weekly/Monthly SaaS Membership
  const handleSubmitWireNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wireRefCodeInput.trim() || wireRefCodeInput.trim().length < 4) {
      showNotification({
        title: 'Geçersiz Dekont Referans Kodu',
        message: 'Lütfen banka havale/EFT referans numarasını (wire_reference_code) giriniz.',
        type: 'warning',
      });
      return;
    }

    const isDuplicate = wireNotices.some(
      (w) => w.wireReferenceCode.toLowerCase() === wireRefCodeInput.trim().toLowerCase()
    );
    if (isDuplicate) {
      showNotification({
        title: '409 Conflict — Mükerrer Dekont Referansı',
        message: `${wireRefCodeInput} referans kodu daha önce kullanılmış. Her dekont tekil olmalıdır.`,
        type: 'error',
      });
      return;
    }

    const amountTl = wirePlanInput === 'WEEKLY_PRO_750' ? 750 : 1490;
    const newNotice: WirePaymentSubmission = {
      noticeId: `WIRE-${Date.now().toString().slice(-5)}`,
      businessId: activeBusinessAccount.id,
      businessName: `${activeBusinessAccount.brandName} (${activeBusinessAccount.title})`,
      taxNumber: activeBusinessAccount.taxNumber,
      planCode: wirePlanInput,
      amountTl,
      wireReferenceCode: wireRefCodeInput.trim(),
      senderIban: wireIbanInput.trim(),
      receiptFileName: wireReceiptFile,
      submittedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
    };

    setWireNotices((prev) => [newNotice, ...prev]);
    setSubscriptionStatus('PAYMENT_PENDING');
    setWireRefCodeInput(`TR-EFT-20261014-${Math.floor(1000 + Math.random() * 8999)}`);

    recordAuditLog({
      actionType: 'CREATE',
      screenName: 'BusinessPortal/WirePaymentNotice',
      recordId: newNotice.noticeId,
      previousValue: `Üyelik: ${subscriptionStatus}`,
      newValue: `PAYMENT_PENDING · Ref: ${newNotice.wireReferenceCode} · ${amountTl} ₺`,
      justification: `İşletme haftalık/aylık sabit üyelik için Havale/EFT ödeme bildirimi yükledi; Admin MANUAL_APPROVAL bekleniyor.`,
    });

    await syncWireNoticeToFirestore({
      noticeId: newNotice.noticeId,
      businessId: newNotice.businessId,
      wireReferenceCode: newNotice.wireReferenceCode,
      amountTl: newNotice.amountTl,
    });

    showNotification({
      title: 'Havale/EFT Bildirimi Gönderildi (PAYMENT_PENDING)',
      message: `Ref: ${newNotice.wireReferenceCode} (${amountTl} ₺) Admin Komuta Merkezi onay masasına iletildi.`,
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
              <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400">
                <span className="font-semibold text-[#BF5AF2]">Kurumsal İşletme SaaS Portalı</span>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-mono font-semibold ${
                    isBusinessDeliveryAllowed ? 'text-[#30D158]' : 'text-[#FF453A]'
                  }`}
                >
                  Üyelik: {subscriptionStatus} (%0 Sipariş Komisyonu)
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-zinc-400">
                  VKN: {activeBusinessAccount.taxNumber}
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

          {/* İşletme ve Alt Kullanıcı Oturum Seçici */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/40 border border-white/[0.08] p-2.5 rounded-2xl">
            <div className="flex flex-col">
              <label htmlFor="active-business-select" className="text-[11px] text-zinc-400 font-semibold px-2 mb-1">
                Aktif İşletme:
              </label>
              <select
                id="active-business-select"
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

            <div className="flex flex-col">
              <label htmlFor="active-subuser-select" className="text-[11px] text-zinc-400 font-semibold px-2 mb-1">
                Giriş Yapan Alt Kullanıcı (ACL):
              </label>
              <select
                id="active-subuser-select"
                value={activeBusinessSubUser?.id || ''}
                onChange={(e) => setActiveBusinessSubUserId(e.target.value)}
                className="bg-[#2C2C2E] border border-white/[0.1] text-xs font-semibold text-white px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#BF5AF2]"
              >
                {activeBusinessAccount.subUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} —{' '}
                    {u.role === 'owner'
                      ? 'Şirket Sahibi'
                      : u.role === 'branch_manager'
                      ? 'Şube Müdürü'
                      : u.role === 'accountant'
                      ? 'Muhasebe'
                      : u.role === 'dispatch_staff'
                      ? 'Sevkiyat'
                      : 'İzleyici'}{' '}
                    ({u.branchName})
                  </option>
                ))}
              </select>
            </div>

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

        {/* SUSPENDED / LIMITED_ACCESS B-05 UYARI VE BİREYSEL KURYE KÖPRÜSÜ */}
        {!isBusinessDeliveryAllowed && (
          <div className="mt-4 p-4 rounded-2xl bg-[#FF453A]/15 border border-[#FF453A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#FF453A] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">
                  Profesyonel İşletme Teslimatı (`BUSINESS_DELIVERY`) Duraklatıldı — Durum:{' '}
                  <span className="font-mono text-[#FF453A]">{subscriptionStatus}</span>
                </h4>
                <p className="text-zinc-300 mt-0.5">
                  Hiçbir işletme veriniz veya geçmiş faturanız silinmemiştir. Haftalık üyelik için
                  Havale/EFT dekontu yükleyebilir veya kesintisiz olarak{' '}
                  <strong>Bireysel Kurye (`INDIVIDUAL_DELIVERY`)</strong> çağırabilirsiniz.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('billing')}
                className="px-3.5 py-2 rounded-xl bg-[#30D158] text-black font-bold cursor-pointer"
              >
                Havale/EFT Bildir
              </button>
              <button
                type="button"
                onClick={() => setActiveView('customer')}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold cursor-pointer"
              >
                Bireysel Kurye Çağır
              </button>
            </div>
          </div>
        )}

        {/* Sekmeler */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Paketler &amp; Canlı Takip ({dispatchPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('multidrop')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'multidrop'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#30D158]" />
            <span>Akıllı Çoklu Rota &amp; Auto-Dispatch ({batchRoutes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dispatch'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Yeni Sevkiyat &amp; Kurye Çağır</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>SaaS Üyelik, Kampanya &amp; Havale/EFT</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'api'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Key className="w-4 h-4 text-[#0A84FF]" />
            <span>B2B API &amp; Dış Sipariş Entegrasyonu ({webhookEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subusers')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'subusers'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Alt Kullanıcılar &amp; Roller ({activeBusinessAccount.subUsers.length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. SEKME: PAKETLER & CANLI TAKİP RADARI                              */}
      {/* ==================================================================== */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  İşletme Teslimat Kuyruğu &amp; SaaS Otomatik Dağıtım
                </h2>
                <p className="text-xs text-zinc-400">
                  {activeBusinessSubUser?.branchName} şubesi · Mutfak Hazırlık Odaklı Eşleştirme:{' '}
                  <strong className="text-[#30D158]">
                    {autoDispatchEnabled ? `Aktif (${prepTimeMinutes} dk)` : 'Manuel'}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateMultiDropBatch}
                  className="px-3.5 py-2 bg-[#30D158] hover:bg-[#28B84C] text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Layers className="w-4 h-4" />
                  <span>Akıllı Çoklu Rota Birleştir (%28 Tasarruf)</span>
                </button>
                {canCreate && (
                  <button
                    onClick={() => setActiveTab('dispatch')}
                    className="px-3.5 py-2 bg-[#BF5AF2] hover:bg-[#A343D6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Paket</span>
                  </button>
                )}
              </div>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-white">
                          {pkg.trackingCode}
                        </span>
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
                        <span className="text-[11px] text-zinc-400 font-mono">
                          PIN: <strong className="text-white">{pkg.deliveryCode}</strong>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          %0 Komisyon
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
                        <Clock className="w-3.5 h-3.5" />
                        <span>ETA: 18 Dk</span>
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
                  <span className="text-zinc-400">Mutfak Hazırlık Senkronu:</span>
                  <span className="font-mono font-bold text-[#30D158]">
                    {prepTimeMinutes} Dk Sıfır Bekleme
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Sipariş Başı Komisyon:</span>
                  <span className="font-mono font-bold text-[#30D158]">0,00 ₺ (%0)</span>
                </div>
              </div>

              <button
                onClick={handleCallBusinessCourier}
                disabled={!isBusinessDeliveryAllowed}
                className="w-full py-3.5 bg-[#BF5AF2] hover:bg-[#A343D6] disabled:opacity-40 text-white font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isBusinessDeliveryAllowed
                    ? 'Bekleyen Paketler İçin Kurye Çağır'
                    : `Sipariş Kilitli (${subscriptionStatus})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SEKME (GAP-04): AKILLI GÜZERGAH, ÇOKLU PAKET BİRLEŞTİRME & AUTO-DISPATCH */}
      {/* ==================================================================== */}
      {activeTab === 'multidrop' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: SaaS Auto-Dispatch ve Çoklu Paket Birleştirme Kontrolü */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#30D158]" />
                  <h2 className="text-base font-bold text-white">
                    Multi-Drop Rota &amp; Auto-Dispatch
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] font-mono text-[10px] font-bold">
                  %28 KM TASARRUFU
                </span>
              </div>

              <p className="text-zinc-400 leading-relaxed">
                Aynı teslimat koridorundaki 2–4 paketi tek bir birleştirilmiş rotada (
                <code>BatchRoutePlan</code>) gruplar ve mutfak hazırlık süresine göre en yakın
                kuryeyi paket hazır olduğu saniyede kapıda olacak şekilde atar.
              </p>

              {/* Auto-Dispatch Toggle */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">
                      SaaS Otomatik Sipariş Dağıtımı (Auto-Dispatch)
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Hazırlık süresine göre sıfır kurye beklemesi
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoDispatchEnabled(!autoDispatchEnabled)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                      autoDispatchEnabled
                        ? 'bg-[#30D158] text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {autoDispatchEnabled ? 'Açık' : 'Kapalı'}
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Mutfak / Paket Hazırlık Süresi (`prepTimeMinutes`):</span>
                    <span className="font-mono font-bold text-white">{prepTimeMinutes} Dakika</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full accent-[#30D158] cursor-pointer"
                  />
                </div>
              </div>

              {/* Corridor Select */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">
                  Birleştirilecek Teslimat Koridoru:
                </label>
                <select
                  value={selectedCorridor}
                  onChange={(e) => setSelectedCorridor(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2.5 text-white font-medium"
                >
                  <option value="Beşiktaş · Levent · Maslak Kuzey Koridoru">
                    Beşiktaş · Levent · Maslak Kuzey Koridoru
                  </option>
                  <option value="Nişantaşı · Şişli · Mecidiyeköy Merkez Hattı">
                    Nişantaşı · Şişli · Mecidiyeköy Merkez Hattı
                  </option>
                  <option value="Kadıköy · Moda · Ataşehir Anadolu Koridoru">
                    Kadıköy · Moda · Ataşehir Anadolu Koridoru
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleCreateMultiDropBatch}
                className="w-full py-3.5 rounded-2xl bg-[#30D158] hover:bg-[#28B84C] text-black font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Akıllı Çoklu Rota Oluştur &amp; Kurye Ata</span>
              </button>
            </div>

            {/* Sağ 2 Kolon: Aktif Birleştirilmiş Rotalar (BatchRoutePlan) */}
            <div className="lg:col-span-2 bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Aktif Çok Duraklı (Multi-Drop) Rotalar
                  </h3>
                  <p className="text-zinc-400">
                    Kurye Kokpitinde (`CourierApp`) adım adım PIN ve PoD doğrulamasıyla takip edilir
                  </p>
                </div>
                <span className="font-mono text-zinc-400">
                  Toplam: <strong className="text-white">{batchRoutes.length} Rota</strong>
                </span>
              </div>

              {batchRoutes.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/30 border border-white/[0.06] text-center space-y-3">
                  <Navigation className="w-8 h-8 text-[#30D158] mx-auto" />
                  <div className="font-bold text-white text-sm">
                    Henüz Birleştirilmiş Çoklu Rota Yok
                  </div>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Soldaki <strong>"Akıllı Çoklu Rota Oluştur &amp; Kurye Ata"</strong> butonuna
                    tıklayarak bekleyen paketleri aynı koridorda birleştirebilir ve %28 KM
                    tasarrufunu canlı test edebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {batchRoutes.map((batch) => (
                    <div
                      key={batch.batchId}
                      className="p-4 rounded-2xl bg-black/40 border border-white/[0.1] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-[#30D158]/20 text-[#30D158] font-mono font-bold">
                            {batch.batchId}
                          </span>
                          <span className="font-bold text-white">{batch.corridorName}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-zinc-400 line-through">
                            {batch.standaloneTotalKm} km
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#30D158]" />
                          <span className="text-[#30D158] font-bold">
                            {batch.optimizedBatchKm} km (-%{batch.kmSavedPercent})
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white">
                            Kurye Net: {batch.courierNetPayoutTl} ₺ (%0 Komisyon)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {batch.stops.map((stop) => (
                          <div
                            key={stop.packageId}
                            className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-[#0A84FF]">
                                Durak #{stop.stopOrder} · {stop.trackingCode}
                              </span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white">
                                PIN: {stop.pinCode}
                              </span>
                            </div>
                            <div className="font-semibold text-white truncate">
                              {stop.recipientName}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate">{stop.address}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <span>
                          Atanan Kurye: <strong className="text-white">{batch.assignedCourierName}</strong>
                        </span>
                        <span className="font-mono text-emerald-400">
                          FeeSnapshot: {batch.feeSnapshot.snapshotHash.slice(0, 22)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. SEKME: YENİ SEVKİYAT OLUŞTURMA & B2B GÖREV GİRİŞİ                 */}
      {/* ==================================================================== */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#BF5AF2]" />
              <span>Yeni Teslimat Paketi Ekle</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Bu formla işletmenize ait yeni bir teslimat paketi tanımlayabilir ve kurye ataması
              yapabilirsiniz.
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
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Alıcı Adı &amp; Soyadı:
                  </label>
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
                <label className="text-zinc-400 font-semibold block mb-1">
                  Teslimat Adresi (Türkiye Çapında Serbest):
                </label>
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
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Paket Ağırlığı (Kg):
                  </label>
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
                    onChange={(e) =>
                      setNewPkgSize(e.target.value as 'zarf' | 'kucuk' | 'orta' | 'buyuk')
                    }
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
                disabled={!canCreate || !isBusinessDeliveryAllowed}
                className="w-full py-3 bg-[#BF5AF2] hover:bg-[#A343D6] disabled:opacity-50 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isBusinessDeliveryAllowed
                    ? 'Paketi Listeye Ekle'
                    : `Sipariş Kilitli (${subscriptionStatus})`}
                </span>
              </button>
            </form>
          </div>

          {/* Toplu İşlem & Kurye Çağırma */}
          <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#30D158]" />
                <span>Kurye Çağır &amp; Toplu Gönder (%0 Komisyon)</span>
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hazırlanan tüm paketler tek bir kuryeye teslim edilerek optimize edilmiş rota
                sırasıyla dağıtıma çıkarılır. Her paket alıcıya ulaştığında 4 haneli PIN kodu ve
                PoD fotoğrafı ile teslim onaylanır.
              </p>

              <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/[0.06] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Bekleyen Paket Sayısı:</span>
                  <span className="font-mono font-bold text-white">
                    {dispatchPackages.filter((p) => p.status === 'pending').length} Adet
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Sipariş Başı Platform Komisyonu:</span>
                  <span className="font-mono font-bold text-[#30D158]">0,00 ₺ (%0)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Sürücü / Kurye Hakedişi:</span>
                  <span className="font-mono font-bold text-white">%100 Net Taşıma Ücreti</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCallBusinessCourier}
              disabled={!isBusinessDeliveryAllowed}
              className="w-full py-4 bg-[#30D158] hover:bg-[#34C759] disabled:opacity-40 text-black font-bold text-xs rounded-2xl shadow-[0_4px_20px_rgba(48,209,88,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>
                Hemen Kurye Çağır ({dispatchPackages.filter((p) => p.status === 'pending').length}{' '}
                Paket)
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. SEKME (GAP-01): SAAS ÜYELİK, 2 HAFTA KAMPANYA VE HAVALE/EFT FORMU   */}
      {/* ==================================================================== */}
      {activeTab === 'billing' && (
        <div className="space-y-6 text-xs">
          {/* Canlı Durum Makinesi Simülatörü: 6 Durumlu IntroCampaign & 8 Durumlu BusinessSubscription */}
          <div className="bg-[#1C1C1E] border border-white/[0.1] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#30D158] font-bold">
                  KONU-03 · CANLI DURUM MAKİNESİ &amp; SİPARİŞ YETKİ KİLİDİ
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  `IntroCampaign` (6 Durum) &amp; `BusinessSubscription` (8 Durum) Yönetimi
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[11px]">
                BUSINESS_DELIVERY İzni:{' '}
                <strong className={isBusinessDeliveryAllowed ? 'text-[#30D158]' : 'text-[#FF453A]'}>
                  {isBusinessDeliveryAllowed ? 'AÇIK (YETKİLİ)' : 'KİLİTLİ (ENGELLENDİ)'}
                </strong>
              </span>
            </div>

            {/* 6 Durumlu IntroCampaign Seçici */}
            <div className="space-y-2">
              <label className="font-bold text-zinc-300 block">
                1. Tanışma Kampanyası (`IntroCampaign` — 6 Durum):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {INTRO_CAMPAIGN_STATES_META.map((item) => {
                  const active = introCampaignState === item.status;
                  return (
                    <button
                      key={item.status}
                      type="button"
                      onClick={() => setIntroCampaignState(item.status)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#BF5AF2]/20 border-[#BF5AF2] text-white'
                          : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-mono font-bold text-[11px]">{item.status}</div>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8 Durumlu BusinessSubscription Seçici */}
            <div className="space-y-2">
              <label className="font-bold text-zinc-300 block">
                2. İşletme Aboneliği (`BusinessSubscription` — 8 Durum):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {BUSINESS_SUBSCRIPTION_STATES_META.map((item) => {
                  const active = subscriptionStatus === item.status;
                  return (
                    <button
                      key={item.status}
                      type="button"
                      onClick={() => {
                        setSubscriptionStatus(item.status);
                        showNotification({
                          title: `İşletme Üyelik Durumu: ${item.status}`,
                          message: item.desc,
                          type: item.canCreateBusinessDelivery ? 'success' : 'warning',
                        });
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? item.canCreateBusinessDelivery
                            ? 'bg-[#30D158]/20 border-[#30D158] text-white'
                            : 'bg-[#FF453A]/20 border-[#FF453A] text-white'
                          : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold text-[11px] text-white">
                          {item.status}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            item.canCreateBusinessDelivery
                              ? 'bg-[#30D158]/20 text-[#30D158]'
                              : 'bg-[#FF453A]/20 text-[#FF453A]'
                          }`}
                        >
                          {item.canCreateBusinessDelivery ? 'Aktif' : 'Kilitli'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 mt-1 leading-snug">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Havale / EFT Ödeme Bildirimi (wire_reference_code) ve Admin Onay Akışı */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#30D158]" />
                  <span>Havale / EFT Ödeme Bildirimi (`MANUAL_APPROVAL`)</span>
                </h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  M0 Tahsilat Standardı
                </span>
              </div>
              <p className="text-zinc-400">
                M0 fazında otomatik kart çekimi yapılmaz. Haftalık veya aylık sabit üyelik bedelini
                Havale/EFT ile gönderdikten sonra dekont referans kodunu (
                <code>wire_reference_code</code>) aşağıdan bildirin.
              </p>

              <form onSubmit={handleSubmitWireNotice} className="space-y-3.5">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Seçilen Sabit SaaS Üyelik Paketi:
                  </label>
                  <select
                    value={wirePlanInput}
                    onChange={(e) =>
                      setWirePlanInput(e.target.value as 'WEEKLY_PRO_750' | 'MONTHLY_PRO_1490')
                    }
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2.5 text-white font-semibold"
                  >
                    <option value="WEEKLY_PRO_750">
                      Haftalık Profesyonel İşletme Paketi — 750,00 ₺ (%0 Sipariş Komisyonu)
                    </option>
                    <option value="MONTHLY_PRO_1490">
                      Aylık Kurumsal İşletme Paketi — 1.490,00 ₺ (%0 Sipariş Komisyonu)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">
                      Banka Dekont Referans Kodu (`wire_reference_code`):
                    </label>
                    <input
                      type="text"
                      required
                      value={wireRefCodeInput}
                      onChange={(e) => setWireRefCodeInput(e.target.value)}
                      placeholder="TR-EFT-2026..."
                      className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">
                      Gönderen İşletme IBAN:
                    </label>
                    <input
                      type="text"
                      required
                      value={wireIbanInput}
                      onChange={(e) => setWireIbanInput(e.target.value)}
                      className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Dekont Dosyası Adı (İmzalı S3/MinIO Belge Kaydı):
                  </label>
                  <input
                    type="text"
                    required
                    value={wireReceiptFile}
                    onChange={(e) => setWireReceiptFile(e.target.value)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#30D158] hover:bg-[#28B84C] text-black font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Havale/EFT Dekontunu Yükle &amp; Admin Onayına Gönder</span>
                </button>
              </form>
            </div>

            {/* Gönderilen Dekont Bildirimleri Listesi */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#BF5AF2]" />
                  <span>Havale/EFT Bildirim Geçmişi ({wireNotices.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveView('admin')}
                  className="text-[11px] text-[#0A84FF] hover:underline font-semibold cursor-pointer"
                >
                  Admin Onay Masasında Aç &rarr;
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {wireNotices.map((item) => (
                  <div
                    key={item.noticeId}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          {item.wireReferenceCode}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            item.status === 'APPROVED'
                              ? 'bg-[#30D158]/20 text-[#30D158]'
                              : item.status === 'REJECTED'
                              ? 'bg-[#FF453A]/20 text-[#FF453A]'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {item.businessName} · Dosya: {item.receiptFileName}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        IBAN: {item.senderIban} · Saat: {item.submittedAt}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold font-mono text-white block">
                        {item.amountTl.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-[10px] text-zinc-400">{item.planCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. SEKME (GAP-05): B2B API & DIŞ SİPARİŞ ENTEGRASYON MERKEZİ         */}
      {/* ==================================================================== */}
      {activeTab === 'api' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: Canlı Dış Kanal Sipariş Simülatörü */}
            <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0A84FF]" />
                <h2 className="text-base font-bold text-white">
                  B2B Dış Sipariş Entegrasyon Hub
                </h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Yemeksepeti, GetirYemek, Trendyol Yemek, Shopify, WooCommerce ve Kurumsal POS
                kanallarından gelen dış siparişleri Webhook üzerinden çekip otomatik MotoPilot
                kuryesine atayın.
              </p>

              <div className="space-y-2">
                <label className="text-zinc-400 font-semibold block">
                  Simüle Edilecek Dış Sipariş Kanalı:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'YEMEKSEPETI',
                      'GETIRYEMEK',
                      'TRENDYOL_YEMEK',
                      'SHOPIFY',
                      'WOOCOMMERCE',
                      'KURUMSAL_POS',
                    ] as ExternalOrderChannel[]
                  ).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setSelectedExternalChannel(ch)}
                      className={`p-2.5 rounded-xl border font-mono font-bold text-[11px] text-left cursor-pointer transition-all ${
                        selectedExternalChannel === ch
                          ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white'
                          : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateB2BWebhookOrder}
                className="w-full py-3.5 rounded-2xl bg-[#0A84FF] hover:bg-[#0071E3] text-white font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{selectedExternalChannel} Kanalından Canlı Sipariş Çek</span>
              </button>

              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <label className="text-zinc-400 font-semibold block">
                  Canlı API Anahtarı (Bearer Token):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activeBusinessAccount.apiKey}
                    className="flex-1 bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-[11px]"
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
                    className="px-3 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Kopyala
                  </button>
                </div>
              </div>
            </div>

            {/* Sağ 2 Kolon: Gelen B2B Webhook Sipariş Akışı */}
            <div className="lg:col-span-2 bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Canlı Gelen Dış Sipariş Akışı (Webhook Stream)
                  </h3>
                  <p className="text-zinc-400">
                    Tüm dış kanal siparişleri %0 platform komisyonu ve 18 alanlı{' '}
                    <code>TransactionFeeSnapshot</code> ile kuryeye atanır
                  </p>
                </div>
                <span className="font-mono text-zinc-400">
                  Toplam: <strong className="text-white">{webhookEvents.length} Olay</strong>
                </span>
              </div>

              {webhookEvents.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/30 border border-white/[0.06] text-center space-y-2">
                  <Key className="w-8 h-8 text-[#0A84FF] mx-auto" />
                  <div className="font-bold text-white text-sm">
                    Dış Kanal Sipariş Akışı Bekleniyor
                  </div>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Soldan bir kanal seçip <strong>"Canlı Sipariş Çek"</strong> butonuna basarak
                    dış siparişin otomatik kurye atamasını test edebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {webhookEvents.map((ev) => (
                    <div
                      key={ev.eventId}
                      className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#0A84FF]/20 text-[#0A84FF] font-mono font-bold text-[10px]">
                            {ev.channel}
                          </span>
                          <span className="font-mono font-bold text-white">
                            {ev.externalOrderId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#30D158]/20 text-[#30D158] font-mono text-[10px]">
                            Otomatik Kurye: {ev.assignedCourierName}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            PIN: {ev.pinCode}
                          </span>
                        </div>
                        <div className="font-semibold text-white">
                          {ev.customerName} · <span className="text-zinc-400">{ev.customerPhone}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">{ev.dropoffAddress}</div>
                      </div>
                      <div className="sm:text-right shrink-0 space-y-0.5">
                        <div className="font-mono font-bold text-sm text-[#30D158]">
                          Kurye Net: {ev.deliveryFeeTl} ₺
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          Komisyon: 0 ₺ · Hazırlık: {ev.prepTimeMinutes} dk
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">{ev.receivedAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. SEKME: İŞLETME ALT KULLANICILARI & ACL ROLLERİ                    */}
      {/* ==================================================================== */}
      {activeTab === 'subusers' && (
        <div className="bg-[#1C1C1E] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-[#BF5AF2]" />
                <span>İşletme Alt Kullanıcıları &amp; ACL Yetkileri</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeBusinessAccount.brandName} adına sisteme erişebilen yetkili personel ve şube
                yöneticileri
              </p>
            </div>

            {canManageUsers && (
              <button
                onClick={() => setShowAddSubUserModal(true)}
                className="px-4 py-2.5 bg-[#BF5AF2] hover:bg-[#A343D6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Alt Kullanıcı Tanımla</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 font-semibold">
                  <th className="pb-3 px-3">Kullanıcı</th>
                  <th className="pb-3 px-3">Rol &amp; Yetki Seviyesi</th>
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

                    <td className="py-3.5 px-3 text-zinc-500 font-mono text-[11px]">
                      {user.lastLoginAt}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {user.role !== 'owner' && canManageUsers && (
                        <button
                          onClick={() => deleteBusinessSubUser(user.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
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

      {/* MODAL: YENİ ALT KULLANICI EKLEME */}
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
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500"
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
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Telefon Numarası:</label>
                <input
                  type="text"
                  value={newSubUserPhone}
                  onChange={(e) => setNewSubUserPhone(e.target.value)}
                  placeholder="+90 532 000 00 00"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Kullanıcı Rolü:</label>
                  <select
                    value={newSubUserRole}
                    onChange={(e) => setNewSubUserRole(e.target.value as BusinessSubUserRole)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-medium"
                  >
                    <option value="branch_manager">Şube Müdürü</option>
                    <option value="dispatch_staff">Sevkiyat Personeli</option>
                    <option value="accountant">Muhasebe</option>
                    <option value="read_only">Salt Okunur (İzleyici)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Şube Kapsamı (ACL):
                  </label>
                  <select
                    value={newSubUserBranch}
                    onChange={(e) => setNewSubUserBranch(e.target.value)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-medium"
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
                  className="flex-1 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] rounded-xl font-bold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#BF5AF2] hover:bg-[#A343D6] text-white rounded-xl font-bold shadow-md"
                >
                  Kullanıcıyı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CARİ BORÇ ÖDEMESİ */}
      {showPayBalanceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-[32px] p-6 max-w-sm w-full shadow-2xl text-xs text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-bold text-sm text-white">Cari Hesap Ödemesi</h3>
              <button
                onClick={() => setShowPayBalanceModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">
                  Ödenecek Tutar (₺):
                </label>
                <input
                  type="number"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-base font-bold"
                />
              </div>

              <button
                onClick={() => {
                  showNotification({
                    title: 'Ödeme Bildirimi Alındı',
                    message: `${paymentAmountInput.toLocaleString('tr-TR')} ₺ ödeme bildirimi işlendi.`,
                    type: 'success',
                  });
                  setShowPayBalanceModal(false);
                }}
                className="w-full py-3 bg-[#30D158] hover:bg-[#34C759] text-black font-bold rounded-xl shadow-md"
              >
                Ödemeyi Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
