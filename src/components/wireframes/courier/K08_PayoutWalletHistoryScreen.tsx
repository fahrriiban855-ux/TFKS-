import React from 'react';
import { WireframeScreen } from '../types';

export const K08_PayoutWalletHistoryScreen: WireframeScreen = {
  id: 'K-08',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 08 / 09',
  title: 'Performans Özeti & D3.js Aylık Trend Radarı',
  subtitle: 'Aylık tamamlanan seferler, net hakediş ve memnuniyet puanı trend grafiği',
  userGoal: 'Ne kadar kazandığını, sefer sayısını ve puan trendini D3.js görselleştirmesiyle izleyip hakedişini banka hesabına çekmek.',
  triggerAction: 'Kazanç sekmesi açılır ➔ D3.js ile çizilmiş aylık trend eğrileri, metrik filtreleri ve IBAN transfer paneli listelenir.',
  uxHighlights: [
    'D3.js Aylık Trend Grafiği: Net kazanç (₺), tamamlanan sefer adedi ve ortalama puan eğrileri',
    'İnteraktif Metrik Filtreleri: Kazanç, sefer, puan veya kombine görselleştirme',
    'Sünnet Pazarlıklı Sefer İstatistiği: Gönül almalı ve helalleşmeli tamamlanan sefer dökümü',
    'Pazartesi otomatik banka transfer takvimi ve anlık IBAN çekim butonu',
  ],
  securityRule: 'IBAN değişikliklerinde SMS onay kodu ve güvenlik bekleme süresi uygulanır.',
  apiEndpoint: 'POST /api/v1/courier/wallet/payout-request',
  apiPayload: JSON.stringify({ amount: 1480.0, iban: 'TR420006200000012345678901' }, null, 2),
  designTokens: {
    typography: 'Inter 12px Medium / SF Pro Mono 18px',
    colors: ['#0066FF', '#10B981', '#0F172A'],
    touchTarget: 'Cashout Button 48pt',
    elevation: 'Card Gradient Layer',
  },
  edgeCases: ['Hafta sonu taleplerinde pazartesi sabahı EFT çalışır.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="space-y-4 pt-2">
        <span className="text-xs font-bold text-white uppercase font-mono">HAKEDİŞ & CÜZDAN</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-center">
            <span className="text-zinc-400 text-[10px] block">Haftalık Kazanç</span>
            <span className="text-xl font-bold font-mono text-white block">9.350 ₺</span>
          </div>
          <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-center">
            <span className="text-zinc-400 text-[10px] block">Yatacak Hakediş</span>
            <span className="text-xl font-bold font-mono text-white block">3.200 ₺</span>
          </div>
        </div>
        <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-[11px] space-y-1 font-mono">
          <div className="text-zinc-400">TR42 0006 2000 0001 2345 6789 01</div>
          <div className="text-white font-semibold font-sans">Her Pazartesi Otomatik Transfer</div>
        </div>
      </div>
      <button className="w-full py-3.5 bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-xs rounded-2xl hover:bg-zinc-800 transition-colors">
        Detaylı Sefer Dökümünü İndir (PDF)
      </button>
    </div>
  ),
};
