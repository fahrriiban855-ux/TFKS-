import React from 'react';
import { Sparkles } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C03_RouteFareEstimateScreen: WireframeScreen = {
  id: 'C-03',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 03 / 08',
  title: 'Güzergah & Önceden Görünen Fiyat',
  subtitle: 'Açılış + KM + Süre x Yoğun Saat Çarpanı ile sürprizsiz net ön fiyat',
  userGoal: 'Yolculuk başlamadan önce tam olarak kaç TL ödeyeceğini ve kaç dakikada varacağını bilmek.',
  triggerAction: 'Varış noktası girilir ➔ Sunucu anında rotayı çizer ve net fiyatı üretir.',
  uxHighlights: [
    'Ön fiyat garantisi (Trafik sıkışsa dahi baştan onaylanan tutar çekilir)',
    '3 farklı araç sınıfı: Moto Standart (NMAX), Moto Konfor (XMAX), Express Kurye',
    'Hızlı Fiyat Ayarlama (+ / -): Çağırma butonu üzerinde anlık teklif artırma/azaltma imkânı',
    'Yoğun saat çarpanı (Surge Multiplier) açıkça listelenir',
    'Promosyon kuponu (BLESYUM50) tek dokunuşla uygulanabilir',
  ],
  securityRule: 'Fiyat hesaplaması istemcide değil, kurcalamaya kapalı sunucu tarafında (Rust) mühürlenir.',
  apiEndpoint: 'POST /api/v1/rides/estimate-fare',
  apiPayload: JSON.stringify(
    {
      pickup: { lat: 41.0425, lng: 29.0065, name: 'Beşiktaş İskele' },
      dropoff: { lat: 41.0782, lng: 29.0117, name: 'Levent Kanyon' },
      service_type: 'motosiklet',
      tier: 'standard',
      promo_code: 'BLESYUM50',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'SF Pro Display 28px Black Mono / Inter 13px Bold',
    colors: ['#0066FF', '#10B981', '#0F172A', '#F59E0B'],
    touchTarget: 'Full Width 56pt Primary Button',
    elevation: 'Layered Cards with Gradient Glow',
  },
  edgeCases: [
    'Güzergah Boğaz Köprüsü içeriyorsa: Köprü geçiş ücreti eklenir ve fişte ayrı kalem gösterilir.',
    'Mesafe 0.5 km altındaysa: Minimum taban ücret (85 TL) uygulanır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="space-y-3 pt-2">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1 text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Rota ve Tahmini Süre</span>
            <span className="font-mono text-white font-bold">5.4 km · 14 dk</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-zinc-400 font-semibold">Önceden Görünen Net Ücret</span>
            <span className="text-2xl font-black font-mono text-white">203.40 ₺</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-zinc-900 border border-white rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🛵</span>
              <div>
                <div className="font-bold text-white text-sm">Moto Standart</div>
                <div className="text-[10px] text-zinc-400">Yamaha NMAX 155 · Kask Dâhil · 3 dk</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-white text-sm">203.40 ₺</div>
              <span className="text-[9px] text-zinc-300 font-bold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-700">-50 ₺ Kupon</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏍️</span>
              <div>
                <div className="font-bold text-white text-sm">Moto Konfor (VIP)</div>
                <div className="text-[10px] text-zinc-400">Yamaha XMAX 250 · Sırt Destekli Sele</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-zinc-300 text-sm">266.75 ₺</div>
              <span className="text-[9px] text-zinc-500">Geniş Bagaj</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Kupon uygulandı: <strong>BLESYUM50</strong></span>
          </span>
          <span className="font-mono font-bold text-white">-50.00 ₺</span>
        </div>
      </div>

      <div className="w-full py-2 pl-5 pr-2 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-2xl shadow-xl flex items-center justify-between">
        <span>Motosiklet Çağır</span>
        <div className="flex items-center bg-black border border-zinc-800 rounded-xl p-1 gap-1.5 text-white">
          <span className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-xs">-</span>
          <span className="font-mono text-sm px-1 font-bold text-white">203.40 ₺</span>
          <span className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-xs">+</span>
        </div>
      </div>
    </div>
  ),
};
