import React from 'react';
import { Award, Gift, ShieldAlert, Ticket, CheckCircle2, Phone } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C15_LoyaltyReferralCampaignWalletScreen: WireframeScreen = {
  id: 'C-15',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 15 / 15',
  title: 'Sadakat, Davet Kodu, Kampanya Cüzdanı & Kanıtlı İtiraz / SOS Merkezi',
  subtitle: 'Sadakat Puanları, Arkadaşını Davet Et Kodu ve P0 Öncelikli Kanıtlı İtiraz / Acil Destek',
  userGoal:
    'Tamamlanan taksi ve kurye çağrılarından kazanılan sadakat puanlarını kullanmak, davet kodu paylaşmak ve kanıtlı itiraz veya SOS acil bildirimini tek merkezden yönetmek.',
  triggerAction:
    'Müşteri alt barda "Sadakat & Destek" sekmesine dokunur ➔ Aktif puanlar, kampanya kodları ve kanıtlı destek/SOS kartı görüntülenir.',
  uxHighlights: [
    '%0 Komisyon Koruma Kuralı: Uygulanan kampanya veya sadakat indirimi sürücünün %100 net hakedişinden düşülmez, platform bütçesinden karşılanır',
    'Tek Tıkla Davet Kodu Kopyalama: Arkadaş davetinde çift taraflı puan kazanımı',
    'Kanıtlı İtiraz (Dispute) Formu: Sefer ID, kategori ve fotoğraf kanıtı ile değiştirilemez destek kaydı',
    'P0 Acil Güvenlik (SOS / 112) Kısayolu: Canlı koordinat ve aktif plaka bilgisini komuta merkezine anında iletir',
  ],
  securityRule:
    'Kupon ve sadakat puanı kullanımları sunucu tarafında Idempotency-Key ile doğrulanır; aynı kod mükerrer kullanılamaz.',
  apiEndpoint: 'POST /api/v1/customer/loyalty/redeem & POST /api/v1/support/disputes',
  apiPayload: JSON.stringify(
    {
      customer_id: 'cust-9481',
      loyalty_tier: 'GOLD',
      available_points: 1450,
      referral_code: 'MOTO-BEDIRHAN-50',
      driver_net_payout_protected: true,
      dispute_ticket: {
        order_id: 'MP-9481',
        category: 'ROUTE_OR_DELIVERY_ISSUE',
        priority: 'P1',
      },
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 15px Bold / JetBrains Mono 11px SemiBold',
    colors: ['#2563EB', '#10B981', '#F59E0B', '#EF4444'],
    touchTarget: '48pt x 48pt Minimum Hitbox',
    elevation: 'Single-Elevation Surface (border-zinc-800 bg-zinc-950)',
  },
  edgeCases: [
    'Süresi dolmuş kupon kodu girildiğinde: 422 COUPON_EXPIRED döner ve kullanıcıya aktif alternatif kampanyalar listelenir.',
    'SOS tetiklendiğinde: Aktif sipariş varsa plaka ve canlı GPS koordinatı P0 alarmıyla A-01 Komuta Haritasına düşer.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Sadakat &amp; Güvenlik Merkezi</h3>
              <span className="text-[10px] text-zinc-400 font-mono">GOLD ÜYE · 1.450 PUAN</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            %0 Kesinti
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Kullanılabilir Puan Karşılığı</span>
            </span>
            <span className="font-mono font-bold text-white tabular-nums">145,00 ₺</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            İndirim tutarı sürücü kazancından düşülmez; sürücü %100 tam ücretini alır.
          </p>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-blue-400" />
              <span>Davet Kodunuz</span>
            </span>
            <span className="font-mono font-bold text-blue-400">MOTO-50TL</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Her başarılı davette +500 Sadakat Puanı tanımlanır.</span>
          </div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-white">Kanıtlı İtiraz &amp; Destek Kaydı</span>
            <span className="font-mono text-[10px] text-zinc-400">FLOW-22</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Sefer makbuzu, PoD fotoğrafı ve rota kaydı ile tek tıkla incelenebilir talep açın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
        <div className="py-2.5 bg-zinc-900 border border-zinc-700 text-white font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-blue-400" />
          <span>İtiraz Aç</span>
        </div>
        <div className="py-2.5 bg-red-600 text-white font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>112 SOS Acil</span>
        </div>
      </div>
    </div>
  ),
};
