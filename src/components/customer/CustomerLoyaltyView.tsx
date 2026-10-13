import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Award,
  Gift,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Ticket,
  Clock,
  ArrowRight,
  Coins,
  ShieldCheck,
  Users,
  Send,
  Plus,
  Percent,
  CheckCircle2,
  X,
  Star,
  Info,
} from 'lucide-react';

export const CustomerLoyaltyView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const {
    loyaltyAccount,
    loyaltyTiers,
    loyaltySettings,
    loyaltyTransactions,
    redeemLoyaltyPoints,
    referralCodes,
    referralRecords,
    generateReferralCode,
    campaigns,
    applyCouponCode,
    activeCoupon,
    removeCouponCode,
    sendGiftCredit,
    redeemGiftCredit,
    customerWalletBalance,
    showNotification,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'overview' | 'referral' | 'coupons' | 'gift' | 'history'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Puan Dönüştürme Modalı
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [pointsToRedeemInput, setPointsToRedeemInput] = useState(100);

  // Hediye Kartı Gönderme Formu
  const [giftRecipientName, setGiftRecipientName] = useState('');
  const [giftRecipientPhone, setGiftRecipientPhone] = useState('');
  const [giftAmount, setGiftAmount] = useState(50);
  const [giftMessage, setGiftMessage] = useState('Trafikle uğraşma, güvenle git!');

  // Hediye Kodu Yükleme
  const [giftCodeInput, setGiftCodeInput] = useState('');

  // Aktif kullanıcı davet kodu
  const customerReferralCode =
    referralCodes.find((c) => c.ownerId === loyaltyAccount.userId && c.programType === 'customer_to_customer')?.code ||
    generateReferralCode('customer_to_customer');

  const currentTierConfig =
    loyaltyTiers.find((t) => t.tier === loyaltyAccount.currentTier) || loyaltyTiers[0];

  // Sonraki seviyeye kalan ilerleme
  const nextTierConfig =
    loyaltyAccount.currentTier === 'bronze'
      ? loyaltyTiers.find((t) => t.tier === 'silver')
      : loyaltyAccount.currentTier === 'silver'
      ? loyaltyTiers.find((t) => t.tier === 'gold')
      : null;

  const currentPoints = loyaltyAccount.lifetimeEarnedPoints;
  const targetPoints = nextTierConfig ? nextTierConfig.minPoints : loyaltyAccount.lifetimeEarnedPoints;
  const prevPoints = currentTierConfig ? currentTierConfig.minPoints : 0;
  const progressPercent = nextTierConfig
    ? Math.min(100, Math.max(0, Math.round(((currentPoints - prevPoints) / (targetPoints - prevPoints)) * 100)))
    : 100;

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
    showNotification({
      title: 'Kod Kopyalandı',
      message: `'${code}' panoya kopyalandı. Arkadaşlarınızla paylaşabilirsiniz!`,
      type: 'success',
    });
  };

  const handleRedeemPointsSubmit = () => {
    const res = redeemLoyaltyPoints(pointsToRedeemInput, 200);
    if (res.success) {
      setShowRedeemModal(false);
    }
  };

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftRecipientName || !giftRecipientPhone) {
      showNotification({
        title: 'Eksik Bilgi',
        message: 'Lütfen alıcı adı ve telefon numarasını giriniz.',
        type: 'warning',
      });
      return;
    }
    const res = sendGiftCredit(giftRecipientPhone, giftRecipientName, giftAmount, giftMessage);
    if (res.success) {
      setGiftRecipientName('');
      setGiftRecipientPhone('');
    }
  };

  const handleRedeemGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCodeInput.trim()) return;
    const res = redeemGiftCredit(giftCodeInput);
    if (res.success) {
      setGiftCodeInput('');
    }
  };

  return (
    <div className="w-full bg-[#121214] text-[#F5F5F7] rounded-[32px] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-white/[0.06] to-transparent border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#409CFF] text-white flex items-center justify-center shadow-md">
            <Award className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">MotoPilot Sadakat & Ödüller</h3>
            <span className="text-[11px] text-[#8E8E93]">Puanlar, Seviye Avantajları, Davet ve Kuponlar</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-all"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Navigation Bar */}
      <div className="p-2 border-b border-white/[0.06] bg-[#161618] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'overview', label: 'Puanım & Seviyem', icon: Award },
            { id: 'referral', label: 'Davet Et & Kazan', icon: Users },
            { id: 'coupons', label: 'Kuponlar', icon: Ticket },
            { id: 'gift', label: 'Hediye Gönder', icon: Gift },
            { id: 'history', label: 'Puan Geçmişi', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0071E3] text-white shadow-md'
                    : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & TIER STATUS                                             */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* VIP Loyalty Card */}
            <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#1C1C1E] via-[#242428] to-[#1C1C1E] border border-white/[0.12] shadow-2xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0071E3]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider block">
                    MotoPilot Sadakat Kulübü
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{loyaltyAccount.userName}</h4>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-sm ${
                    loyaltyAccount.currentTier === 'gold'
                      ? 'bg-[#FF9F0A]/20 border-[#FF9F0A]/40 text-[#FF9F0A]'
                      : loyaltyAccount.currentTier === 'silver'
                      ? 'bg-slate-300/20 border-slate-300/40 text-slate-200'
                      : 'bg-amber-800/20 border-amber-700/40 text-amber-400'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{currentTierConfig.name}</span>
                </div>
              </div>

              {/* Point Balance */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
                  <span className="text-[10px] text-[#8E8E93] block">Kullanılabilir Puan</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-white font-mono">
                      {loyaltyAccount.availablePoints}
                    </span>
                    <span className="text-[10px] text-[#30D158] font-bold">Puan</span>
                  </div>
                  <span className="text-[10px] text-[#8E8E93] mt-0.5 block">
                    ≈ {(loyaltyAccount.availablePoints * loyaltySettings.pointRedeemRateLira).toFixed(1)} ₺ Değerinde
                  </span>
                </div>

                <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
                  <span className="text-[10px] text-[#8E8E93] block">Toplam Kazanılan</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0A84FF] font-mono">
                      {loyaltyAccount.lifetimeEarnedPoints}
                    </span>
                    <span className="text-[10px] text-[#0A84FF] font-bold">Puan</span>
                  </div>
                  <span className="text-[10px] text-[#8E8E93] mt-0.5 block">Kayıttan itibaren</span>
                </div>

                <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/[0.06] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#8E8E93] block">Daimi İndirim</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#30D158] font-mono">
                      %{currentTierConfig.discountPercent}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8E8E93] mt-0.5 block">
                    {currentTierConfig.freeWaitMinutes} dk ücretsiz bekleme
                  </span>
                </div>
              </div>

              {/* Tier Progress Bar */}
              {nextTierConfig && (
                <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8E8E93]">
                      Sonraki Seviye: <strong className="text-white">{nextTierConfig.name}</strong>
                    </span>
                    <span className="text-[#0A84FF] font-mono font-bold">
                      {targetPoints - currentPoints} puan kaldı (%{progressPercent})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0071E3] to-[#30D158] transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowRedeemModal(true)}
                  disabled={loyaltyAccount.availablePoints < loyaltySettings.minRedeemPoints}
                  className="flex-1 py-3 px-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-white/[0.06] disabled:text-[#8E8E93] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>Puanlarımı İndirime Dönüştür</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('referral')}
                  className="py-3 px-4 bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-[#0A84FF]" />
                  <span>Arkadaşını Davet Et (50 ₺)</span>
                </button>
              </div>
            </div>

            {/* Tier Comparison & Benefits */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Üyelik Seviyesi Avantajları</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {loyaltyTiers.map((tier) => (
                  <div
                    key={tier.tier}
                    className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                      loyaltyAccount.currentTier === tier.tier
                        ? 'bg-[#0071E3]/10 border-[#0071E3]/50 ring-1 ring-[#0071E3]/40'
                        : 'bg-white/[0.03] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{tier.name}</span>
                      {loyaltyAccount.currentTier === tier.tier && (
                        <span className="px-2 py-0.5 rounded-full bg-[#0071E3] text-white text-[9px] font-bold">
                          Mevcut
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8E8E93] font-mono">
                      {tier.minPoints === 0 ? 'Giriş Seviyesi' : `${tier.minPoints} Puan Eşiği`}
                    </div>
                    <ul className="space-y-1.5 pt-1 text-[11px]">
                      {tier.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[#F5F5F7]">
                          <Check className="w-3.5 h-3.5 text-[#30D158] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REFERRAL & EARN (Arkadaşını Davet Et)                               */}
        {/* ========================================================================= */}
        {activeTab === 'referral' && (
          <div className="space-y-6">
            {/* Referral Hero Card */}
            <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#0071E3]/20 via-[#1C1C1E] to-[#1C1C1E] border border-[#0071E3]/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0071E3] text-white flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Arkadaşını Davet Et, 50 ₺ Kazan!</h4>
                  <p className="text-[11px] text-[#8E8E93]">
                    Arkadaşın ilk seferinde %30 indirim kazanır; ilk yolculuğu tamamlandığında sen 50 ₺ cüzdan bakiyesi kazanırsın.
                  </p>
                </div>
              </div>

              {/* Referral Code Copy Box */}
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/[0.08] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-[#8E8E93] uppercase font-bold block">Kişisel Davet Kodunuz</span>
                  <span className="text-base font-bold font-mono text-white tracking-wider block truncate">
                    {customerReferralCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(customerReferralCode)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    {copiedCode === customerReferralCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === customerReferralCode ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=MotoPilot%20ile%20trafiğe%20takılmadan%20ulaş!%20İlk%20seferinde%20%2530%20indirim%20için%20davet%20kodum:%20${customerReferralCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Referral Progress Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-[#8E8E93] block">Toplam Davet</span>
                  <span className="text-base font-bold text-white font-mono">
                    {referralRecords.filter((r) => r.referrerId === loyaltyAccount.userId).length} Kişi
                  </span>
                </div>
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-[#8E8E93] block">Ödül Kazandıran</span>
                  <span className="text-base font-bold text-[#30D158] font-mono">
                    {referralRecords.filter((r) => r.referrerId === loyaltyAccount.userId && r.status === 'rewarded').length} Sefer
                  </span>
                </div>
                <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-[#8E8E93] block">Kazanılan Bakiye</span>
                  <span className="text-base font-bold text-[#0A84FF] font-mono">
                    {referralRecords
                      .filter((r) => r.referrerId === loyaltyAccount.userId && r.status === 'rewarded')
                      .reduce((sum, r) => sum + r.rewardAmountReferrer, 0)}{' '}
                    ₺
                  </span>
                </div>
              </div>
            </div>

            {/* Invited Friends List */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Davet Ettiğiniz Kişiler</h4>
              <div className="space-y-2">
                {referralRecords
                  .filter((r) => r.referrerId === loyaltyAccount.userId)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-white block truncate">{rec.referredName}</span>
                        <span className="text-[10px] text-[#8E8E93] font-mono block">
                          {rec.referredContact} · {rec.createdAt}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 block truncate">
                          {rec.qualifyingActionDescription}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        {rec.status === 'rewarded' ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] font-bold text-[10px]">
                            +{rec.rewardAmountReferrer} ₺ Kazanıldı
                          </span>
                        ) : rec.status === 'qualifying_action_completed' ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#0A84FF]/15 border border-[#0A84FF]/30 text-[#0A84FF] font-bold text-[10px]">
                            İlk Sefer Tamamlandı
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#8E8E93] text-[10px]">
                            İlk Sefer Bekleniyor
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: COUPONS & CAMPAIGNS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Active Coupon Banner if Applied */}
            {activeCoupon && (
              <div className="p-4 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#30D158]" />
                  <div>
                    <span className="font-bold text-white text-xs block">
                      Aktif Kupon: {activeCoupon.code}
                    </span>
                    <span className="text-[11px] text-[#30D158]">
                      {activeCoupon.title} sepetinize tanımlandı.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCouponCode}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs text-white"
                >
                  Kaldır
                </button>
              </div>
            )}

            {/* Available Campaigns List */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Kullanılabilir Kampanya Kuponları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaigns
                  .filter((c) => c.status === 'active')
                  .map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-base font-extrabold font-mono text-[#0A84FF] tracking-wider block">
                            {camp.code}
                          </span>
                          <h5 className="font-bold text-white text-xs mt-0.5">{camp.title}</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[9px] font-mono text-[#8E8E93]">
                          Min: {camp.minOrderAmount} ₺
                        </span>
                      </div>

                      <p className="text-[11px] text-[#8E8E93] leading-relaxed">{camp.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <span className="text-[10px] text-[#8E8E93] font-mono">
                          Bitiş: {camp.endDate}
                        </span>

                        <button
                          type="button"
                          onClick={() => applyCouponCode(camp.code, 200, 'motosiklet')}
                          className="px-3 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs transition-all active:scale-95"
                        >
                          Kuponu Uygula
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GIFT CREDITS (Hediye Kartı Gönder / Yükle)                         */}
        {/* ========================================================================= */}
        {activeTab === 'gift' && (
          <div className="space-y-6">
            {/* Gift Send Card */}
            <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#FF9F0A]/10 via-[#1C1C1E] to-[#1C1C1E] border border-[#FF9F0A]/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF9F0A] text-black flex items-center justify-center font-bold">
                  <Gift className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Arkadaşına Yolculuk Hediye Et</h4>
                  <p className="text-[11px] text-[#8E8E93]">
                    Sevdiklerine güvenli ve hızlı ulaşım hediye edin. Kod anında üretilir.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendGift} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#8E8E93] block mb-1">Alıcı Adı Soyadı</label>
                    <input
                      type="text"
                      placeholder="Örn. Zeynep Kaya"
                      value={giftRecipientName}
                      onChange={(e) => setGiftRecipientName(e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-white text-xs focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#8E8E93] block mb-1">Alıcı Telefon Numarası</label>
                    <input
                      type="text"
                      placeholder="+90 5XX XXX XX XX"
                      value={giftRecipientPhone}
                      onChange={(e) => setGiftRecipientPhone(e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-white text-xs focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                </div>

                {/* Amount presets */}
                <div>
                  <label className="text-[10px] text-[#8E8E93] block mb-1">Hediye Tutarı</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 75, 100, 150].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setGiftAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          giftAmount === amt
                            ? 'bg-[#FF9F0A] text-black shadow-md'
                            : 'bg-white/[0.04] text-[#8E8E93] hover:text-white'
                        }`}
                      >
                        {amt} ₺
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#8E8E93] block mb-1">Kişisel Mesajınız</label>
                  <input
                    type="text"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-white text-xs focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#8E8E93]">
                    Mevcut Cüzdan Bakiyeniz: <strong className="text-white">{customerWalletBalance} ₺</strong>
                  </span>

                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2.5 bg-[#FF9F0A] hover:bg-[#FFB03A] text-black font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Hediye Kartı Oluştur ({giftAmount} ₺)
                  </button>
                </div>
              </form>
            </div>

            {/* Redeem Gift Code Form */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
              <h4 className="font-bold text-white text-xs">Hediye Kodum Var</h4>
              <form onSubmit={handleRedeemGift} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Örn. HEDIYE-ZK75"
                  value={giftCodeInput}
                  onChange={(e) => setGiftCodeInput(e.target.value)}
                  className="flex-1 p-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-white text-xs font-mono uppercase focus:outline-none focus:border-[#0071E3]"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-xl transition-all active:scale-95"
                >
                  Cüzdana Yükle
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: POINTS TRANSACTION HISTORY                                         */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Puan Hareketleri Kayıt Defteri</h4>
            <div className="space-y-2">
              {loyaltyTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-white text-xs block truncate">{tx.description}</span>
                    <span className="text-[10px] text-[#8E8E93] font-mono block">
                      {tx.timestamp} · {tx.rideId ? `Sefer No: ${tx.rideId}` : 'Sistem Kampanyası'}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-bold font-mono ${
                        tx.points > 0 ? 'text-[#30D158]' : 'text-[#FF453A]'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} Puan
                    </span>
                    <span className="text-[10px] text-[#8E8E93] block">
                      Kalan: {tx.balanceAfter} Puan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Redeem Points Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-white/[0.12] rounded-[32px] p-5 w-full max-w-sm space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h4 className="font-bold text-white text-sm">Puanı İndirime Dönüştür</h4>
              <button onClick={() => setShowRedeemModal(false)} className="text-[#8E8E93] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white/[0.04] rounded-2xl space-y-1">
              <span className="text-[11px] text-[#8E8E93]">Mevcut Puanınız:</span>
              <span className="text-xl font-bold font-mono text-white block">
                {loyaltyAccount.availablePoints} Puan
              </span>
              <span className="text-[10px] text-[#8E8E93] block">
                (Dönüşüm katsayısı: 100 Puan = {100 * loyaltySettings.pointRedeemRateLira} ₺ İndirim)
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#8E8E93] block">Harcamak İstediğiniz Puan:</label>
              <input
                type="number"
                step="50"
                min={loyaltySettings.minRedeemPoints}
                max={loyaltyAccount.availablePoints}
                value={pointsToRedeemInput}
                onChange={(e) => setPointsToRedeemInput(Number(e.target.value))}
                className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-[#0071E3]"
              />
              <span className="text-[10px] text-[#30D158] font-bold block">
                Uygulanacak İndirim: {(pointsToRedeemInput * loyaltySettings.pointRedeemRateLira).toFixed(1)} ₺
              </span>
            </div>

            <button
              type="button"
              onClick={handleRedeemPointsSubmit}
              className="w-full min-h-[44px] py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
            >
              Sepetime {(pointsToRedeemInput * loyaltySettings.pointRedeemRateLira).toFixed(1)} ₺ İndirim Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
