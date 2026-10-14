import React from 'react';
import { Users, Globe, ShieldCheck, Key } from 'lucide-react';
import { WireframeScreen } from '../types';

export const B06_WirePaymentSubscriptionScreen: WireframeScreen = {
  id: 'B-06',
  category: 'business',
  categoryLabel: 'İşletme SaaS Portalı',
  stepNumber: 'EKRAN 06 / 06',
  title: 'İşletme Alt Kullanıcı (SubUser) Rol Matrisi, Şube RBAC & B2B API Merkezi',
  subtitle: '5 Rol Bazlı Alt Kullanıcı Yetkilendirmesi (ACL) ve Yemeksepeti/Getir/Trendyol/POS Webhook',
  userGoal:
    'Şube müdürü, sevkiyat görevlisi ve muhasebeci alt kullanıcılarını yetkilendirmek ve dış sipariş kanallarından (B2B Webhook) gelen siparişleri otomatik kuryeye bağlamak.',
  triggerAction:
    'İşletme sahibi (owner) "Alt Kullanıcılar & B2B API" sekmesinden personel yetkilerini ve dış kanal entegrasyonunu yönetir.',
  uxHighlights: [
    '5 Kademeli Alt Kullanıcı Rol Matrisi: owner, branch_manager, dispatch_staff, accountant ve read_only',
    'A2 & B6 Tenant Guard: Muhasebe rolü (accountant) yeni sipariş açamaz; sevkiyat rolü (dispatch_staff) finansal ayarları değiştiremez',
    'B2B Dış Sipariş Webhook Hub: Yemeksepeti, GetirYemek, Trendyol Yemek, Shopify ve POS siparişlerini tek ekranda toplar',
    'Denetim İzi (AuditLog): Her alt kullanıcı ekleme/silme ve API anahtarı işlemi SHA-256 ile mühürlenir',
  ],
  securityRule:
    'Yalnızca owner rolü alt kullanıcı ekleyebilir veya API anahtarı üretebilir; yetkisiz denemeler 403 INSUFFICIENT_SUBUSER_ROLE alır.',
  apiEndpoint: 'POST /api/v1/business/sub-users & POST /api/v1/b2b/webhooks/ingest',
  apiPayload: JSON.stringify(
    {
      business_id: 'biz-nisantasi-01',
      actor_role: 'owner',
      sub_users: [
        { name: 'Selin Kaya', role: 'branch_manager', branch: 'Nişantaşı Merkez', can_create_orders: true },
        { name: 'Orhan Demir', role: 'accountant', branch: 'Genel Müdürlük', can_create_orders: false },
      ],
      connected_b2b_channels: ['YEMEKSEPETI', 'GETIRYEMEK', 'TRENDYOL_YEMEK', 'POS_WEBHOOK'],
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#2563EB', '#10B981', '#090D16', '#F8FAFC'],
    touchTarget: '44px x 44px Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Alt kullanıcı başka bir şubenin siparişini iptal etmeye çalışırsa: Şube bazlı RBAC filtresi işlemi engeller.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Alt Kullanıcı RBAC &amp; B2B Hub</h3>
              <span className="text-[10px] text-zinc-400 font-mono">A2 TENANT GUARD · 5 ROL</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            ACL Aktif
          </span>
        </div>
      </div>

      <div className="space-y-2 my-2 text-xs">
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Selin Kaya · Şube Müdürü</div>
            <div className="text-[10px] text-zinc-400">Sipariş Açabilir ✓ · İptal Yetkisi ✓</div>
          </div>
          <span className="font-mono text-[10px] text-blue-400">branch_manager</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Orhan Demir · Muhasebe</div>
            <div className="text-[10px] text-zinc-400">Ekstre Görebilir ✓ · Sipariş Açamaz ✗</div>
          </div>
          <span className="font-mono text-[10px] text-amber-400">accountant</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-[11px]">
          <span className="text-zinc-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>B2B Dış Sipariş Kanalları</span>
          </span>
          <span className="font-mono text-emerald-400 text-[10px]">4 Kanal Bağlı</span>
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <Key className="w-3.5 h-3.5" />
        <span>Alt Kullanıcı ve API Yetkilerini Yönet</span>
      </div>
    </div>
  ),
};
