import React from 'react';
import { Lock, Archive, ArrowRight, ShieldAlert } from 'lucide-react';
import { WireframeScreen } from '../types';

export const B05_SubUserBranchRbacScreen: WireframeScreen = {
  id: 'B-05',
  category: 'business',
  categoryLabel: 'İşletme SaaS Portalı',
  stepNumber: 'EKRAN 05 / 06',
  title: 'LIMITED_ACCESS (Kısıtlı Mod) Veri Koruması & Bireysel Kurye Köprüsü',
  subtitle: '3 Günlük GRACE_PERIOD Sonrası Veri Silinmeme Garantisi ve INDIVIDUAL_DELIVERY Köprüsü',
  userGoal:
    'Haftalık üyeliği yenilenmeyen işletmenin geçmiş sipariş ve fatura arşivine kesintisiz erişmesi ve acil durumda Bireysel Kurye (INDIVIDUAL_DELIVERY) köprüsünü kullanabilmesi.',
  triggerAction:
    '3 günlük GRACE_PERIOD sonunda ödeme yapılmazsa durum LIMITED_ACCESS olur ➔ Arşiv açık kalır ve Bireysel Kurye Köprüsü gösterilir.',
  uxHighlights: [
    '%100 Veri Koruma Garantisi: LIMITED_ACCESS durumunda hiçbir geçmiş sipariş, PoD fotoğrafı veya muhasebe ekstresi silinmez',
    '3 Günlük GRACE_PERIOD: Üyelik bitiminde işletmenin operasyonu aniden kesilmez, 3 takvim günü ek süre tanınır',
    'Bireysel Kurye Köprüsü (INDIVIDUAL_DELIVERY): İşletme toplu çağrı açamasa bile kendi CustomerProfile yetkisiyle tekil kurye çağırabilir',
    'Tek Tıkla Yeniden Aktivasyon: Havale/EFT bildirimi yapıldığı anda profesyonel özellikler geri açılır',
  ],
  securityRule:
    'LIMITED_ACCESS durumunda POST /orders (BUSINESS_DELIVERY) 403 ile engellenir; ancak GET /orders (Arşiv) ve INDIVIDUAL_DELIVERY açıktır.',
  apiEndpoint: 'GET /api/v1/business/subscription-state & POST /api/v1/orders',
  apiPayload: JSON.stringify(
    {
      business_id: 'biz-nisantasi-01',
      subscription_status: 'LIMITED_ACCESS',
      data_retention_guaranteed: true,
      archived_orders_count: 412,
      business_delivery_allowed: false,
      individual_delivery_bridge_allowed: true,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#F59E0B', '#2563EB', '#10B981', '#090D16'],
    touchTarget: '44px x 44px Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'İşletme LIMITED_ACCESS iken arşiv PDF indirmek isterse: Tüm geçmiş dönem makbuzları kısıtlamasız indirilebilir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Kısıtlı Mod &amp; Veri Koruma</h3>
              <span className="text-[10px] text-zinc-400 font-mono">FLOW-15 · LIMITED_ACCESS</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Arşiv Korunuyor
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geçmiş Sipariş &amp; Fatura Arşivi</span>
            </span>
            <span className="font-mono text-emerald-400">412 Kayıt Açık</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Üyelik yenilenmese bile geçmiş teslimat kanıtları ve ekstreleriniz asla silinmez.
          </p>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Bireysel Kurye Köprüsü Aktif</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Toplu işletme sevkiyatı kapalıdır; ancak tekil paketleriniz için %0 komisyonlu bireysel kurye çağırabilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
        <div className="py-2.5 bg-zinc-900 border border-zinc-700 text-white font-bold text-center rounded-xl text-[11px]">
          Bireysel Çağır
        </div>
        <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1">
          <span>Üyeliği Yenile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  ),
};
