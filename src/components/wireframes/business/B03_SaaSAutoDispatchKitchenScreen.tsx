import React from 'react';
import { Clock, Camera, CheckCircle2, Truck } from 'lucide-react';
import { WireframeScreen } from '../types';

export const B03_SaaSAutoDispatchKitchenScreen: WireframeScreen = {
  id: 'B-03',
  category: 'business',
  categoryLabel: 'İşletme SaaS Portalı',
  stepNumber: 'EKRAN 03 / 06',
  title: 'SaaS Auto-Dispatch, Mutfak Hazırlık Zamanlayıcısı & Canlı PoD Panosu',
  subtitle: 'Hazırlık Süresine (prepTimeMinutes) Göre Sıfır Beklemeli Kurye Atama ve Teslimat Kanıtı',
  userGoal:
    'Paketin mutfak/depo hazırlanma süresine göre kuryeyi tam zamanında kapıya çağırmak ve teslim edilen paketlerin PoD fotoğraflarını canlı izlemek.',
  triggerAction:
    'İşletme hazırlık süresini (örn. 12 dk) belirler ➔ Auto-Dispatch motoru kurye varış süresini eşleştirerek otomatik çağrı açar.',
  uxHighlights: [
    'SaaS Auto-Dispatch Zamanlaması: Paket hazır olmadan 2 dk önce kurye şube kapısında olacak şekilde çağrı tetiklenir',
    'Sıcak/Soğuk Zincir Koruması: Paketin tezgahta soğuması veya kuryenin kapıda boş beklemesi önlenir',
    'Canlı Saha Kurye ve PoD Panosu: Teslim edilen her paketin alıcı PIN onayı ve fotoğraf kanıtı anında görünür',
    'Tenant Guard İzolasyonu: İşletme yalnızca kendi şubelerine ait aktif kuryeleri ve PoD kayıtlarını görür',
  ],
  securityRule:
    'Başka bir işletmeye ait sipariş veya PoD kaydı sorgulandığında 403 TENANT_ISOLATION_VIOLATION döner.',
  apiEndpoint: 'GET /api/v1/business/orders/active & POST /api/v1/business/auto-dispatch',
  apiPayload: JSON.stringify(
    {
      business_id: 'biz-nisantasi-01',
      auto_dispatch_enabled: true,
      prep_time_minutes: 12,
      courier_target_arrival_min: 10,
      active_deliveries: [
        {
          tracking_code: 'MP-BIZ-803',
          courier_name: 'Mert Aksoy',
          status: 'DELIVERED',
          verified_pin: '2411',
          pod_verified: true,
        },
      ],
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#10B981', '#2563EB', '#F59E0B', '#090D16'],
    touchTarget: '44px x 44px Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Mutfak hazırlığı gecikirse: İşletme tek tıkla "+5 Dk Ek Hazırlık" bildirimi göndererek kurye sırasını günceller.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Auto-Dispatch &amp; Canlı PoD</h3>
              <span className="text-[10px] text-zinc-400 font-mono">FLOW-13 · SIFIR BEKLEME</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Oto-Sevk Açık
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Mutfak Hazırlık Süresi</span>
            </span>
            <span className="font-mono font-bold text-white tabular-nums">12 Dakika</span>
          </div>
          <div className="text-[10px] text-zinc-400">
            Kurye çağrısı 10. dakikada kapıda olacak şekilde otomatik tetiklenir.
          </div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white font-bold">MP-BIZ-803 · Mert Aksoy</span>
            <span className="text-emerald-400 text-[10px] flex items-center gap-1">
              <Camera className="w-3 h-3" /> PoD Onaylı
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 font-sans">
            Maslak 1453 B4 · Alıcı PIN (2411) ve Fotoğraf Kanıtı İle Teslim Edildi.
          </div>
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-4 h-4" />
        <span>Canlı Teslimat Kanıtlarını İncele</span>
      </div>
    </div>
  ),
};
