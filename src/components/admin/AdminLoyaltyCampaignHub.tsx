import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Award,
  Gift,
  Ticket,
  Share2,
  Users,
  Target,
  ShieldAlert,
  Percent,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ArrowRight,
  TrendingUp,
  Search,
  Check,
  X,
  AlertTriangle,
  Building,
  Bike,
  Sparkles,
  DollarSign,
  Filter,
  Coins,
} from 'lucide-react';
import {
  LoyaltyTier,
  CampaignStatus,
  CampaignTargetAudience,
  CampaignDiscountType,
  ReferralProgramType,
} from '../../types/loyalty';
import { ServiceType } from '../../types/platform';

export const AdminLoyaltyCampaignHub: React.FC = () => {
  const {
    loyaltyAccount,
    loyaltyTiers,
    loyaltySettings,
    loyaltyTransactions,
    updateLoyaltySettings,
    referralPrograms,
    referralRecords,
    updateReferralProgramConfig,
    reviewFlaggedReferral,
    campaigns,
    couponRedemptions,
    createCampaign,
    updateCampaignStatus,
    driverQuests,
    createDriverQuest,
    merchantProfiles,
    updateMerchantTier,
    winBackOffers,
    giftCredits,
    fraudAuditRecords,
    resolveFraudRecord,
    showNotification,
  } = usePlatform();

  const [activeSubTab, setActiveSubTab] = useState<
    'loyalty_tiers' | 'referrals' | 'campaigns' | 'driver_quests' | 'merchants' | 'winback' | 'fraud'
  >('loyalty_tiers');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>('all');
  const [referralStatusFilter, setReferralStatusFilter] = useState<string>('all');

  // New Campaign Modal
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaignCode, setNewCampaignCode] = useState('');
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');
  const [newCampaignAudience, setNewCampaignAudience] = useState<CampaignTargetAudience>('all');
  const [newCampaignDiscountType, setNewCampaignDiscountType] = useState<CampaignDiscountType>('percentage');
  const [newCampaignDiscountValue, setNewCampaignDiscountValue] = useState(20);
  const [newCampaignMinOrder, setNewCampaignMinOrder] = useState(100);
  const [newCampaignMaxDiscount, setNewCampaignMaxDiscount] = useState(50);
  const [newCampaignBudget, setNewCampaignBudget] = useState(10000);
  const [newCampaignUsageLimit, setNewCampaignUsageLimit] = useState(500);
  const [newCampaignPerUserLimit, setNewCampaignPerUserLimit] = useState(2);
  const [newCampaignFundedBy, setNewCampaignFundedBy] = useState<'platform' | 'sponsor_merchant'>('platform');
  const [newCampaignServices, setNewCampaignServices] = useState<ServiceType[]>([
    'motosiklet',
    'kurye',
    'isletme_siparis',
  ]);

  // New Quest Modal
  const [showNewQuestModal, setShowNewQuestModal] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDesc, setNewQuestDesc] = useState('');
  const [newQuestTargetTrips, setNewQuestTargetTrips] = useState(15);
  const [newQuestBonus, setNewQuestBonus] = useState(350);
  const [newQuestWindow, setNewQuestWindow] = useState<'daily' | 'weekend' | 'weekly' | 'rush_hour'>('weekend');

  // Metrics summary
  const totalPointsIssued = loyaltyTransactions
    .filter((t) => t.type === 'earn')
    .reduce((sum, t) => sum + t.points, 0);
  const totalPointsRedeemed = Math.abs(
    loyaltyTransactions.filter((t) => t.type === 'spend').reduce((sum, t) => sum + t.points, 0)
  );
  const totalPointsLiabilityLira = Math.round(
    loyaltyAccount.availablePoints * loyaltySettings.pointRedeemRateLira
  );
  const totalCampaignsBudgetUsed = campaigns.reduce((sum, c) => sum + c.usedBudgetLira, 0);
  const totalCampaignsBudgetLimit = campaigns.reduce((sum, c) => sum + c.totalBudgetLira, 0);
  const totalReferralsCount = referralRecords.length;
  const successfulReferralsCount = referralRecords.filter((r) => r.status === 'rewarded').length;
  const flaggedFraudCount = fraudAuditRecords.filter((f) => !f.resolved).length;

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignCode.trim() || !newCampaignTitle.trim()) {
      showNotification({
        title: 'Eksik Bilgi',
        message: 'Lütfen kupon kodu ve kampanya başlığını eksiksiz doldurunuz.',
        type: 'warning',
      });
      return;
    }

    createCampaign({
      code: newCampaignCode.toUpperCase().trim(),
      title: newCampaignTitle.trim(),
      description: newCampaignDesc.trim(),
      targetAudience: newCampaignAudience,
      discountType: newCampaignDiscountType,
      discountValue: Number(newCampaignDiscountValue),
      minOrderAmount: Number(newCampaignMinOrder),
      maxDiscountAmount: Number(newCampaignMaxDiscount),
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      totalBudgetLira: Number(newCampaignBudget),
      totalUsageLimit: Number(newCampaignUsageLimit),
      perUserLimit: Number(newCampaignPerUserLimit),
      applicableServices: newCampaignServices,
      applicablePaymentMethods: ['card', 'wallet', 'cash'],
      fundedBy: newCampaignFundedBy,
      status: 'active',
      canCombineWithLoyalty: false,
      createdBy: 'Operasyon Direktörü (Admin)',
    });

    setShowNewCampaignModal(false);
    setNewCampaignCode('');
    setNewCampaignTitle('');
    setNewCampaignDesc('');
  };

  const handleCreateQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) {
      showNotification({
        title: 'Eksik Bilgi',
        message: 'Lütfen görev başlığını giriniz.',
        type: 'warning',
      });
      return;
    }

    createDriverQuest({
      title: newQuestTitle.trim(),
      description: newQuestDesc.trim(),
      targetTrips: Number(newQuestTargetTrips),
      bonusAmountLira: Number(newQuestBonus),
      timeWindow: newQuestWindow,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-10-31',
      applicableRegions: ['Tüm İstanbul'],
      isActive: true,
      currentCompletedTrips: 0,
      isClaimed: false,
    });

    setShowNewQuestModal(false);
    setNewQuestTitle('');
    setNewQuestDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Program Master Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[28px] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3]/20 text-[#0071E3] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sadakat, Davet ve Kampanya Merkezi
            </h2>
          </div>
          <p className="text-xs text-[#8E8E93]">
            Müşteri sadakat puanları, 3 hatlı referans sistemi, kupon motoru, sürücü görevleri ve suistimal masası.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] rounded-2xl border border-white/[0.08] text-xs">
            <span className="text-[#8E8E93]">Program Durumu:</span>
            <button
              onClick={() => {
                updateLoyaltySettings({ isProgramActive: !loyaltySettings.isProgramActive });
                showNotification({
                  title: 'Program Durumu Değiştirildi',
                  message: `Sadakat ve Kampanya motoru ${!loyaltySettings.isProgramActive ? 'Aktifleştirildi' : 'Durduruldu'}.`,
                  type: 'info',
                });
              }}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                loyaltySettings.isProgramActive
                  ? 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/40'
                  : 'bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/40'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  loyaltySettings.isProgramActive ? 'bg-[#30D158] animate-pulse' : 'bg-[#FF453A]'
                }`}
              />
              <span>{loyaltySettings.isProgramActive ? 'AKTİF ÇALIŞIYOR' : 'DURDURULDU'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>Puan Yükümlülüğü</span>
            <Coins className="w-4 h-4 text-[#FFD60A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {totalPointsLiabilityLira} ₺
          </div>
          <div className="text-[11px] text-[#8E8E93]">
            {loyaltyAccount.availablePoints} aktif puan havuzu
          </div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>Kampanya Bütçesi</span>
            <Ticket className="w-4 h-4 text-[#0A84FF]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {totalCampaignsBudgetUsed} ₺
          </div>
          <div className="text-[11px] text-[#8E8E93]">
            Toplam Limit: {totalCampaignsBudgetLimit} ₺
          </div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>Davet Dönüşümü</span>
            <Share2 className="w-4 h-4 text-[#30D158]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            %{totalReferralsCount > 0 ? Math.round((successfulReferralsCount / totalReferralsCount) * 100) : 0}
          </div>
          <div className="text-[11px] text-[#8E8E93]">
            {successfulReferralsCount} / {totalReferralsCount} tamamlanan davet
          </div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>Şüpheli İşlem / Suistimal</span>
            <ShieldAlert className="w-4 h-4 text-[#FF453A]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {flaggedFraudCount} İnceleme
          </div>
          <div className="text-[11px] text-[#FF453A]">
            {flaggedFraudCount > 0 ? 'Müdahale Bekleyen Olaylar Var' : 'Tüm işlemler temiz'}
          </div>
        </div>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="flex items-center overflow-x-auto gap-1.5 p-1.5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl text-xs font-medium">
        {[
          { id: 'loyalty_tiers', label: 'Sadakat & Seviyeler', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'referrals', label: 'Davet & Referans (3 Hat)', icon: <Share2 className="w-3.5 h-3.5" /> },
          { id: 'campaigns', label: 'Kupon & Kampanya Motoru', icon: <Ticket className="w-3.5 h-3.5" /> },
          { id: 'driver_quests', label: 'Sürücü Teşvik & Görevler', icon: <Bike className="w-3.5 h-3.5" /> },
          { id: 'merchants', label: 'İşletme Sadakati', icon: <Building className="w-3.5 h-3.5" /> },
          { id: 'winback', label: 'Geri Kazanım & Hediye', icon: <Gift className="w-3.5 h-3.5" /> },
          {
            id: 'fraud',
            label: 'Suistimal & Şüpheli İşlem',
            icon: <ShieldAlert className="w-3.5 h-3.5" />,
            badge: flaggedFraudCount > 0 ? flaggedFraudCount : undefined,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSubTab === tab.id
                ? 'bg-[#0071E3] text-white font-bold shadow-md'
                : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF453A] text-white font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: SADAKAT & SEVİYE YÖNETİMİ */}
      {activeSubTab === 'loyalty_tiers' && (
        <div className="space-y-6">
          {/* Rules and Rates Form */}
          <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFD60A]" />
              <span>Merkezi Sadakat Puanı & Dönüşüm Parametreleri</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-1.5">
                <label className="text-[#8E8E93] font-medium block">Puan Kazanım Katsayısı (TL başına)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={loyaltySettings.earnRatePerLira}
                    onChange={(e) => updateLoyaltySettings({ earnRatePerLira: parseFloat(e.target.value) || 0.1 })}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                  <span className="text-[#8E8E93] shrink-0 font-mono text-[11px]">(0.10 = 10 TL’ye 1 Puan)</span>
                </div>
              </div>

              <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-1.5">
                <label className="text-[#8E8E93] font-medium block">Puan Harcama Değeri (1 Puan = ? TL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={loyaltySettings.pointRedeemRateLira}
                    onChange={(e) =>
                      updateLoyaltySettings({ pointRedeemRateLira: parseFloat(e.target.value) || 0.25 })
                    }
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                  <span className="text-[#8E8E93] shrink-0 font-mono text-[11px]">(100 Puan = 25 TL)</span>
                </div>
              </div>

              <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-1.5">
                <label className="text-[#8E8E93] font-medium block">Puan Geçerlilik Süresi (Gün)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loyaltySettings.pointValidityDays}
                    onChange={(e) =>
                      updateLoyaltySettings({ pointValidityDays: parseInt(e.target.value) || 180 })
                    }
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                  <span className="text-[#8E8E93] shrink-0 font-mono text-[11px]">Gün</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loyaltyTiers.map((tConfig) => (
              <div
                key={tConfig.tier}
                className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4 hover:border-white/[0.16] transition-all"
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        tConfig.tier === 'gold'
                          ? 'bg-[#FFD60A]/20 text-[#FFD60A]'
                          : tConfig.tier === 'silver'
                          ? 'bg-[#0A84FF]/20 text-[#0A84FF]'
                          : 'bg-white/[0.1] text-zinc-300'
                      }`}
                    >
                      {tConfig.name}
                    </span>
                    <h4 className="font-bold text-white text-base mt-1">
                      {tConfig.minPoints} Puan Eşiği
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#30D158] font-bold font-mono">
                      {tConfig.pointMultiplier}x Çarpan
                    </span>
                    <span className="text-[10px] text-[#8E8E93] block font-mono">
                      %{tConfig.discountPercent} Daimi İndirim
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[11px] text-[#8E8E93] font-semibold block uppercase">
                    Seviye Ayrıcalıkları:
                  </span>
                  <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                    {tConfig.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: DAVET & REFERANS SİSTEMİ (3 HAT) */}
      {activeSubTab === 'referrals' && (
        <div className="space-y-6">
          {/* 3 Referral Programs Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {referralPrograms.map((prog) => (
              <div
                key={prog.id}
                className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{prog.title}</span>
                  <button
                    onClick={() => updateReferralProgramConfig(prog.id, { isActive: !prog.isActive })}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prog.isActive
                        ? 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/40'
                        : 'bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/40'
                    }`}
                  >
                    {prog.isActive ? 'AKTİF' : 'PASİF'}
                  </button>
                </div>

                <p className="text-[11px] text-[#8E8E93] leading-relaxed">{prog.description}</p>

                <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Davet Eden Ödülü:</span>
                    <span className="font-bold text-[#30D158] font-mono">
                      {prog.referrerRewardAmount} ₺ {prog.referrerRewardType === 'points' ? 'Puan' : 'Bakiye'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Davet Edilen Ödülü:</span>
                    <span className="font-bold text-[#0A84FF] font-mono">
                      {prog.referredRewardAmount} ₺
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Min. Uygun Sefer Şartı:</span>
                    <span className="font-bold text-white font-mono">{prog.minQualifyingTrips} Sefer</span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] flex justify-between text-[11px]">
                    <span className="text-[#8E8E93]">Bütçe Kullanımı:</span>
                    <span className="font-mono text-zinc-300">
                      {prog.currentSpentLira} ₺ / {prog.budgetLimitLira} ₺
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Records Log */}
          <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#30D158]" />
                <span>Davet ve Referans Hareket Kayıtları</span>
              </h3>
              <span className="text-xs text-[#8E8E93] font-mono">{referralRecords.length} Toplam İşlem</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8E8E93]">
                    <th className="pb-2.5 font-medium">Program</th>
                    <th className="pb-2.5 font-medium">Davet Eden</th>
                    <th className="pb-2.5 font-medium">Davet Edilen</th>
                    <th className="pb-2.5 font-medium">Kod</th>
                    <th className="pb-2.5 font-medium">Ödül</th>
                    <th className="pb-2.5 font-medium">Durum</th>
                    <th className="pb-2.5 font-medium text-right">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {referralRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/[0.02]">
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-mono text-zinc-300">
                          {rec.programType === 'customer_to_customer'
                            ? 'Müşteri ➔ Müşteri'
                            : rec.programType === 'driver_to_driver'
                            ? 'Sürücü ➔ Sürücü'
                            : 'İşletme ➔ İşletme'}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-white">{rec.referrerName}</td>
                      <td className="py-3 text-zinc-300">
                        {rec.referredName}{' '}
                        <span className="text-[10px] text-[#8E8E93] block font-mono">{rec.referredContact}</span>
                      </td>
                      <td className="py-3 font-mono text-[#0A84FF]">{rec.codeUsed}</td>
                      <td className="py-3 font-mono font-bold text-[#30D158]">
                        {rec.rewardAmountReferrer} ₺
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'rewarded'
                              ? 'bg-[#30D158]/20 text-[#30D158]'
                              : rec.status === 'under_review'
                              ? 'bg-[#FF453A]/20 text-[#FF453A] animate-pulse'
                              : 'bg-[#FF9F0A]/20 text-[#FF9F0A]'
                          }`}
                        >
                          {rec.status === 'rewarded'
                            ? 'ÖDÜLLENDİRİLDİ'
                            : rec.status === 'under_review'
                            ? 'İNCELEMEDE'
                            : rec.status === 'verified'
                            ? 'DOĞRULANDI'
                            : 'BEKLEMEDE'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {rec.status === 'under_review' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => reviewFlaggedReferral(rec.id, 'approve', 'Yetkili denetiminden geçti')}
                              className="px-2 py-1 bg-[#30D158] hover:bg-[#30D158]/90 text-black font-bold text-[10px] rounded-lg"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => reviewFlaggedReferral(rec.id, 'reject', 'Cihaz çakışması tespit edildi')}
                              className="px-2 py-1 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white font-bold text-[10px] rounded-lg"
                            >
                              Reddet
                            </button>
                          </div>
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

      {/* SUB TAB 3: KUPON & KAMPANYA MOTORU */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8E8E93]">Filtre:</span>
              <div className="flex items-center gap-1 bg-[#1C1C1E] p-1 rounded-xl border border-white/[0.08] text-xs">
                {['all', 'active', 'paused', 'completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setCampaignStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all ${
                      campaignStatusFilter === st
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {st === 'all'
                      ? 'Tümü'
                      : st === 'active'
                      ? 'Aktif'
                      : st === 'paused'
                      ? 'Duraklatıldı'
                      : 'Tamamlandı'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowNewCampaignModal(true)}
              className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kampanya Tanımla</span>
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns
              .filter((c) => campaignStatusFilter === 'all' || c.status === campaignStatusFilter)
              .map((cmp) => (
                <div
                  key={cmp.id}
                  className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4 hover:border-white/[0.14] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0071E3]/20 border border-[#0071E3]/40 text-[#0071E3] font-mono font-bold text-xs tracking-wider">
                        {cmp.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cmp.status === 'active'
                            ? 'bg-[#30D158]/20 text-[#30D158]'
                            : cmp.status === 'paused'
                            ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]'
                            : 'bg-white/[0.08] text-[#8E8E93]'
                        }`}
                      >
                        {cmp.status === 'active'
                          ? 'AKTİF'
                          : cmp.status === 'paused'
                          ? 'DURAKLATILDI'
                          : 'TAMAMLANDI'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{cmp.title}</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed line-clamp-2">
                      {cmp.description}
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8E8E93]">İndirim Oranı:</span>
                      <span className="font-bold text-[#30D158] font-mono">
                        {cmp.discountType === 'percentage'
                          ? `%${cmp.discountValue} (Maks. ${cmp.maxDiscountAmount} ₺)`
                          : `${cmp.discountValue} ₺ Sabit`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E93]">Min. Sepet Tutarı:</span>
                      <span className="font-mono text-zinc-300">{cmp.minOrderAmount} ₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E93]">Kullanım / Limit:</span>
                      <span className="font-mono text-zinc-300">
                        {cmp.currentUsageCount} / {cmp.totalUsageLimit} adet
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E93]">Bütçe Tüketimi:</span>
                      <span className="font-mono text-zinc-300">
                        {cmp.usedBudgetLira} ₺ / {cmp.totalBudgetLira} ₺
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    {cmp.status === 'active' ? (
                      <button
                        onClick={() => updateCampaignStatus(cmp.id, 'paused')}
                        className="w-full py-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Duraklat</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateCampaignStatus(cmp.id, 'active')}
                        className="w-full py-1.5 bg-[#30D158]/20 hover:bg-[#30D158]/30 text-[#30D158] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Aktifleştir</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: SÜRÜCÜ TEŞVİK & GÖREV MASASI (DRIVER QUESTS) */}
      {activeSubTab === 'driver_quests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Sürücü Hedef & Teşvik Programları (Quests)</h3>
              <p className="text-xs text-[#8E8E93]">
                Kuryelerin yoğun saatlerde ve hafta sonlarında aktifliğini artıran sefer tamamlama hedefleri.
              </p>
            </div>

            <button
              onClick={() => setShowNewQuestModal(true)}
              className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Sürücü Görevi Tanımla</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {driverQuests.map((quest) => (
              <div
                key={quest.id}
                className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4 hover:border-white/[0.14] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF9F0A]/20 text-[#FF9F0A]">
                    {quest.timeWindow === 'weekend'
                      ? 'Hafta Sonu Hedefi'
                      : quest.timeWindow === 'rush_hour'
                      ? 'Yoğun Saat Primi'
                      : 'Haftalık Sefer Primi'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#30D158]">
                    +{quest.bonusAmountLira} ₺ Bonus
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{quest.title}</h4>
                  <p className="text-xs text-[#8E8E93] mt-1">{quest.description}</p>
                </div>

                <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Hedef Sefer Sayısı:</span>
                    <span className="font-bold text-white font-mono">{quest.targetTrips} Sefer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Geçerli Bölge:</span>
                    <span className="text-zinc-300">{quest.applicableRegions.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93]">Kalan Süre:</span>
                    <span className="text-[#FF9F0A] font-mono">{quest.endDate} son gün</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 5: İŞLETME SADAKATİ (MERCHANT PROFILES) */}
      {activeSubTab === 'merchants' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0A84FF]" />
              <span>Kayıtlı İşletme Sadakat Profilleri & Komisyon Avantajları</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8E8E93]">
                    <th className="pb-2.5 font-medium">İşletme Adı</th>
                    <th className="pb-2.5 font-medium">Aylık Paket Sayısı</th>
                    <th className="pb-2.5 font-medium">Sadakat Kademesi</th>
                    <th className="pb-2.5 font-medium">Komisyon İndirimi</th>
                    <th className="pb-2.5 font-medium">Öncelikli Kurye</th>
                    <th className="pb-2.5 font-medium text-right">Kademe Değiştir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {merchantProfiles.map((m) => (
                    <tr key={m.merchantId} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-medium text-white">{m.merchantName}</td>
                      <td className="py-3 font-mono text-zinc-300">{m.monthlyOrdersCount} Paket</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            m.currentTier === 'enterprise'
                              ? 'bg-[#FFD60A]/20 text-[#FFD60A]'
                              : m.currentTier === 'growth'
                              ? 'bg-[#0A84FF]/20 text-[#0A84FF]'
                              : 'bg-white/[0.1] text-zinc-300'
                          }`}
                        >
                          {m.currentTier}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-[#30D158]">
                        %{m.commissionDiscountPercent}
                      </td>
                      <td className="py-3">
                        {m.priorityDispatch ? (
                          <span className="text-[#30D158] font-bold">Aktif (VIP)</span>
                        ) : (
                          <span className="text-[#8E8E93]">Standart</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={m.currentTier}
                          onChange={(e) => updateMerchantTier(m.merchantId, e.target.value as any)}
                          className="bg-[#2C2C2E] border border-white/[0.1] rounded-lg px-2 py-1 text-white text-xs font-mono"
                        >
                          <option value="standard">Standart</option>
                          <option value="growth">Büyüme (Growth)</option>
                          <option value="enterprise">Enterprise VIP</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 6: GERİ KAZANIM & HEDİYE KARTLARI */}
      {activeSubTab === 'winback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Win-Back Offers */}
            <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF9F0A]" />
                <span>İnaktif Kullanıcıyı Geri Kazanma Teklifleri</span>
              </h3>

              <div className="space-y-3">
                {winBackOffers.map((wb) => (
                  <div
                    key={wb.id}
                    className="p-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{wb.userName}</div>
                      <div className="text-[11px] text-[#8E8E93]">{wb.daysInactive} gündür sipariş vermedi</div>
                      <div className="text-[11px] text-[#0A84FF] font-mono mt-0.5">{wb.couponCode}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-[#30D158]">
                        {wb.discountAmountLira} ₺ İndirim
                      </span>
                      <span className="text-[10px] text-[#8E8E93] block">
                        {wb.isRedeemed ? 'KULLANILDI' : 'KULLANILABİLİR'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift Credits */}
            <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#FFD60A]" />
                <span>Gönderilen Hediye Bakiyeleri</span>
              </h3>

              <div className="space-y-3">
                {giftCredits.map((gc) => (
                  <div
                    key={gc.id}
                    className="p-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {gc.senderName} ➔ {gc.recipientName}
                      </div>
                      <div className="text-[11px] text-[#8E8E93]">{gc.recipientContact}</div>
                      <div className="text-[11px] font-mono text-[#FFD60A] mt-0.5">{gc.redemptionCode}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-white">{gc.amountLira} ₺</span>
                      <span
                        className={`text-[10px] block font-bold ${
                          gc.status === 'redeemed' ? 'text-[#30D158]' : 'text-[#FF9F0A]'
                        }`}
                      >
                        {gc.status === 'redeemed' ? 'KULLANILDI' : 'YÜKLENMEYİ BEKLİYOR'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 7: SUİSTİMAL & ŞÜPHELİ İŞLEM MASASI (FRAUD AUDIT) */}
      {activeSubTab === 'fraud' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF453A]" />
                <span>Güvenlik Masası: Suistimal & Şüpheli Referans / Kupon Logları</span>
              </h3>
              <span className="text-xs text-[#8E8E93] font-mono">
                {fraudAuditRecords.filter((f) => !f.resolved).length} Açık Olay
              </span>
            </div>

            <div className="space-y-3">
              {fraudAuditRecords.map((fraud) => (
                <div
                  key={fraud.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                    fraud.resolved
                      ? 'bg-white/[0.02] border-white/[0.06] opacity-70'
                      : fraud.severity === 'high'
                      ? 'bg-[#FF453A]/10 border-[#FF453A]/30'
                      : 'bg-[#FF9F0A]/10 border-[#FF9F0A]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          fraud.severity === 'high'
                            ? 'bg-[#FF453A] text-white'
                            : 'bg-[#FF9F0A] text-black font-bold'
                        }`}
                      >
                        {fraud.severity.toUpperCase()} RİSK
                      </span>
                      <span className="font-bold text-white font-mono">{fraud.actionType}</span>
                      <span className="text-[#8E8E93] text-[11px] font-mono">{fraud.timestamp}</span>
                    </div>

                    <p className="text-zinc-200 text-xs">{fraud.details}</p>
                    <span className="text-[11px] text-[#8E8E93] block">
                      İşlemi Yapan: {fraud.actorName} ({fraud.actorId})
                    </span>

                    {fraud.resolved && (
                      <div className="text-[11px] text-[#30D158] font-medium pt-1">
                        Çözümlendi: {fraud.resolutionNote} ({fraud.resolvedBy} - {fraud.resolvedAt})
                      </div>
                    )}
                  </div>

                  {!fraud.resolved && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => resolveFraudRecord(fraud.id, 'Güvenlik incelemesi yapıldı, onaylandı.')}
                        className="px-3 py-1.5 bg-[#30D158] hover:bg-[#30D158]/90 text-black font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        İncele & Onayla
                      </button>
                      <button
                        onClick={() =>
                          resolveFraudRecord(fraud.id, 'Suistimal engellendi, referans ödülü iptal edildi.')
                        }
                        className="px-3 py-1.5 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        Engelle & İptal Et
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: YENİ KAMPANYA TANIMLA */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#0A84FF]" />
                <h3 className="text-base font-bold text-white">Yeni Kampanya Tanımla</h3>
              </div>
              <button onClick={() => setShowNewCampaignModal(false)} className="text-[#8E8E93] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8E8E93] block mb-1">Kupon Kodu (Büyük Harf):</label>
                  <input
                    type="text"
                    required
                    value={newCampaignCode}
                    onChange={(e) => setNewCampaignCode(e.target.value.toUpperCase())}
                    placeholder="Örn: YAZ50, HOŞGELDİN"
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-[#8E8E93] block mb-1">Kampanya Başlığı:</label>
                  <input
                    type="text"
                    required
                    value={newCampaignTitle}
                    onChange={(e) => setNewCampaignTitle(e.target.value)}
                    placeholder="Örn: %25 Hoş Geldin İndirimi"
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8E8E93] block mb-1">Açıklama:</label>
                <input
                  type="text"
                  value={newCampaignDesc}
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  placeholder="Kullanıcıya gösterilecek kampanya detayı"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#8E8E93] block mb-1">İndirim Türü:</label>
                  <select
                    value={newCampaignDiscountType}
                    onChange={(e) => setNewCampaignDiscountType(e.target.value as any)}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="percentage">Yüzde (%)</option>
                    <option value="fixed_amount">Sabit Tutar (TL)</option>
                    <option value="free_service_fee">Ücretsiz Hizmet Bedeli</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8E8E93] block mb-1">İndirim Değeri:</label>
                  <input
                    type="number"
                    value={newCampaignDiscountValue}
                    onChange={(e) => setNewCampaignDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#8E8E93] block mb-1">Maks. İndirim (TL):</label>
                  <input
                    type="number"
                    value={newCampaignMaxDiscount}
                    onChange={(e) => setNewCampaignMaxDiscount(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#8E8E93] block mb-1">Toplam Bütçe (TL):</label>
                  <input
                    type="number"
                    value={newCampaignBudget}
                    onChange={(e) => setNewCampaignBudget(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#8E8E93] block mb-1">Kullanım Sınırı (Adet):</label>
                  <input
                    type="number"
                    value={newCampaignUsageLimit}
                    onChange={(e) => setNewCampaignUsageLimit(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#8E8E93] block mb-1">Kişi Başı Limit:</label>
                  <input
                    type="number"
                    value={newCampaignPerUserLimit}
                    onChange={(e) => setNewCampaignPerUserLimit(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  Kampanyayı Oluştur & Yayına Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ SÜRÜCÜ GÖREVİ (QUEST) */}
      {showNewQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#30D158]" />
                <h3 className="text-base font-bold text-white">Yeni Sürücü Görevi Tanımla</h3>
              </div>
              <button onClick={() => setShowNewQuestModal(false)} className="text-[#8E8E93] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestSubmit} className="space-y-3.5">
              <div>
                <label className="text-[#8E8E93] block mb-1">Görev Başlığı:</label>
                <input
                  type="text"
                  required
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  placeholder="Örn: Hafta Sonu 20 Teslimat Bonusu"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[#8E8E93] block mb-1">Açıklama:</label>
                <input
                  type="text"
                  value={newQuestDesc}
                  onChange={(e) => setNewQuestDesc(e.target.value)}
                  placeholder="Örn: Cuma 18:00 - Pazar 23:59 arası tamamlanan seferler"
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8E8E93] block mb-1">Hedef Sefer Sayısı:</label>
                  <input
                    type="number"
                    value={newQuestTargetTrips}
                    onChange={(e) => setNewQuestTargetTrips(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#8E8E93] block mb-1">Bonus Tutar (TL):</label>
                  <input
                    type="number"
                    value={newQuestBonus}
                    onChange={(e) => setNewQuestBonus(Number(e.target.value))}
                    className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8E8E93] block mb-1">Zaman Penceresi:</label>
                <select
                  value={newQuestWindow}
                  onChange={(e) => setNewQuestWindow(e.target.value as any)}
                  className="w-full bg-[#2C2C2E] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                >
                  <option value="weekend">Hafta Sonu</option>
                  <option value="rush_hour">Yoğun Saat (Rush Hour)</option>
                  <option value="weekly">Haftalık</option>
                  <option value="daily">Günlük</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#30D158] hover:bg-[#30D158]/90 text-black font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  Görevi Sürücülere Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
