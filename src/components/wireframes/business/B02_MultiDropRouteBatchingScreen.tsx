import React from 'react';
import { Layers, Navigation, Package, CheckCircle2 } from 'lucide-react';
import { WireframeScreen } from '../types';

export const B02_MultiDropRouteBatchingScreen: WireframeScreen = {
  id: 'B-02',
  category: 'business',
  categoryLabel: 'İşletme SaaS Portalı',
  stepNumber: 'EKRAN 02 / 06',
  title: 'Çoklu Paket (Multi-Drop) & Koridor Rota Birleştirme (%0 Komisyon)',
  subtitle: 'Aynı Koridordaki 2–5 Paketi Tek Optimize Rotada Birleştirme ve KM Tasarrufu',
  userGoal:
    'Aynı yöne giden birden fazla müşteri paketini tek bir kurye rotasında (BatchRoutePlan) birleştirerek teslimat süresini ve km maliyetini %32 düşürmek.',
  triggerAction:
    'Sevkiyat görevlisi bekleyen paketleri seçip "Koridor Rotası Birleştir & Kurye Ata" butonuna tıklar.',
  uxHighlights: [
    'MultiDropBatchEngine: Aynı koridordaki (örn. Beşiktaş -> Levent -> Maslak) paketleri durak sırasına dizerek tek kuryeye atar',
    'Her Durak İçin Bağımsız 4 Haneli deliveryCode: Her alıcı kendi özel PIN kodu ve PoD fotoğrafıyla doğrulanır',
    '18 Alanlı %0 Komisyon Mührü: İşletmeden sipariş başı yüzdesel komisyon (0.00 ₺) alınmaz',
    'Canlı KM ve Süre Tasarruf Göstergesi: Tekil gönderime kıyasla kazanılan net mesafe yüzdesi',
  ],
  securityRule:
    'LIMITED_ACCESS veya SUSPENDED durumundaki işletmeler toplu BUSINESS_DELIVERY başlatamaz (403 SUBSCRIPTION_LOCKED).',
  apiEndpoint: 'POST /api/v1/business/batch-routes/dispatch',
  apiPayload: JSON.stringify(
    {
      batch_id: 'BATCH-2026-801',
      business_id: 'biz-nisantasi-01',
      corridor_name: 'Beşiktaş · Levent · Maslak Kuzey Koridoru',
      package_count: 3,
      km_saved_percent: 32,
      business_order_commission_tl: 0.0,
      stops: [
        { stop_order: 1, tracking_code: 'MP-BIZ-801', delivery_code: '6192' },
        { stop_order: 2, tracking_code: 'MP-BIZ-802', delivery_code: '8834' },
        { stop_order: 3, tracking_code: 'MP-BIZ-803', delivery_code: '2411' },
      ],
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#2563EB', '#10B981', '#F59E0B', '#090D16'],
    touchTarget: '44px x 44px Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Duraklardan birinde alıcıya ulaşılamazsa: Kurye kalan durakları tamamlar ve yalnızca ulaşılamayan paketi RETURN_IN_PROGRESS yapar.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Multi-Drop Rota Birleştirme</h3>
              <span className="text-[10px] text-zinc-400 font-mono">3 DURAK · %32 KM TASARRUFU</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            %0 Komisyon
          </span>
        </div>
      </div>

      <div className="space-y-2 my-2 text-xs font-mono">
        {[
          { step: 'Durak 1', code: 'MP-BIZ-801', addr: 'Bebek Cevdetpaşa Cd.', pin: '6192' },
          { step: 'Durak 2', code: 'MP-BIZ-802', addr: 'Levent Kanyon A Blok', pin: '8834' },
          { step: 'Durak 3', code: 'MP-BIZ-803', addr: 'Maslak 1453 B4 Giriş', pin: '2411' },
        ].map((s) => (
          <div key={s.code} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-[11px] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-blue-400" />
                <span>{s.step}: {s.code}</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-sans">{s.addr}</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 text-[10px]">
              PIN: {s.pin}
            </span>
          </div>
        ))}
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <Navigation className="w-3.5 h-3.5" />
        <span>Tek Kurye İle 3 Durağı Başlat</span>
      </div>
    </div>
  ),
};
