import React from 'react';
import { WireframeScreen } from '../types';

export const K02_OnlineToggleWalletScreen: WireframeScreen = {
  id: 'K-02',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 02 / 08',
  title: 'Çevrim İçi Anahtarı & Günlük Kazanç Cüzdanı',
  subtitle: 'Tek dokunuşla göreve başlama ve anlık net kazanç takibi',
  userGoal: 'İstediği an çalışmaya başlamak veya mola vermek, kazancını canlı görmek.',
  triggerAction: 'Sürücü anahtarı kaydırır ➔ Konum paylaşımı başlar ➔ Haritada yeşil yanar.',
  uxHighlights: [
    'Eldivenle basılabilir dev çevrim içi anahtarı',
    'Bugün kazanılan net hakediş ve tamamlanan çağrı sayısı',
    'Arka planda pil dostu akıllı GPS frekans ayarlaması',
  ],
  securityRule: 'Çevrim dışı olunduğunda konum izleme donanımsal olarak tamamen durdurulur.',
  apiEndpoint: 'POST /api/v1/courier/status',
  apiPayload: JSON.stringify({ courier_id: 'kurye-1', is_online: true, lat: 41.0425, lng: 29.0065 }, null, 2),
  designTokens: {
    typography: 'SF Pro Display 32px Black Mono / Inter 13px Bold',
    colors: ['#10B981', '#0F172A', '#34D399'],
    touchTarget: 'Big Toggle Slider',
    elevation: 'Emerald Ring Glow',
  },
  edgeCases: ['Pil %15 altına düşerse sürücüye şarj uyarısı verilir.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="p-3.5 bg-zinc-950 rounded-3xl border border-zinc-800 flex justify-between items-center">
        <div>
          <span className="font-bold text-xs text-white">Mert Aksoy</span>
          <span className="text-[10px] text-zinc-400 block font-mono">34 BLY 717 · 4.94 ★</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-white font-bold text-[10px]">
          GÖREVE HAZIR
        </span>
      </div>

      <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 text-center space-y-1 shadow-2xl">
        <span className="text-xs text-zinc-400">Bugünkü Net Kazancınız</span>
        <div className="text-4xl font-black font-mono text-white">1.480,00 ₺</div>
        <span className="text-[11px] text-zinc-500">8 Tamamlanan Sefer · Komisyon Ayrıldı</span>
      </div>

      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-2xl shadow-xl transition-all">
        ÇEVRİM İÇİ (ÇALIŞIYOR)
      </button>
    </div>
  ),
};
