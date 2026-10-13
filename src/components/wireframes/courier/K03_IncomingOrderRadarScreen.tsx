import React from 'react';
import { WireframeScreen } from '../types';

export const K03_IncomingOrderRadarScreen: WireframeScreen = {
  id: 'K-03',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 03 / 08',
  title: '15 Saniyelik Çağrı Teklifi HUD Ekranı',
  subtitle: 'Dönen sayaç halkası, net kazanç tutarı (202.72 ₺) ve güzergah',
  userGoal: 'Gelen çağrıyı sürüş esnasında 1 saniyede analiz edip kabul veya ret etmek.',
  triggerAction: 'Müşteri çağırır ➔ En yakın kuryede zil çalar ➔ 15 sn sayaç başlar.',
  uxHighlights: [
    'Kazanılacak NET hakediş tutarı dev puntolarla en üstte',
    'Alış noktası mesafesi ve varış noktası rotası',
    '15 saniyede basılmazsa sıradaki kuryeye otomatik devir',
  ],
  securityRule: 'Aynı iş iki kuryeye birden gitmez; atomik kilitleme uygulanır.',
  apiEndpoint: 'POST /api/v1/dispatch/respond',
  apiPayload: JSON.stringify({ order_id: 'BLS-9481', courier_id: 'kurye-1', action: 'accept' }, null, 2),
  designTokens: {
    typography: 'SF Pro Display 36px Black Mono / Inter 12px Bold',
    colors: ['#0066FF', '#10B981', '#F59E0B'],
    touchTarget: 'Half-screen Accept Button 56pt',
    elevation: 'Pulsing Amber/Blue Alert Border',
  },
  edgeCases: ['Süre dolduğunda çağrı cezasız bir sonraki kuryeye aktarılır.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 border-2 border-zinc-700 rounded-3xl">
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 bg-white text-black font-black rounded-lg">YENİ ÇAĞRI</span>
        <span className="font-mono font-bold text-white bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded-full">⏱ 15 sn</span>
      </div>
      <div className="text-center space-y-1">
        <span className="text-[10px] text-zinc-400 uppercase font-semibold">Net Kazancınız</span>
        <div className="text-4xl font-black font-mono text-white">202.72 ₺</div>
        <span className="text-[11px] text-zinc-400">5.4 km · 14 dakika</span>
      </div>
      <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 text-xs text-left">
        <div><strong className="text-white">Alış:</strong> Beşiktaş İskele Meydanı</div>
        <div><strong className="text-zinc-400">Varış:</strong> Levent Kanyon AVM</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="py-3.5 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-2xl border border-zinc-800">Pas Geç</button>
        <button className="py-3.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-2xl shadow-xl transition-all">KABUL ET</button>
      </div>
    </div>
  ),
};
