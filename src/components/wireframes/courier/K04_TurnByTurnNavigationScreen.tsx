import React from 'react';
import { WireframeScreen } from '../types';

export const K04_TurnByTurnNavigationScreen: WireframeScreen = {
  id: 'K-04',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 04 / 08',
  title: 'Alış Noktasına Turn-by-Turn Navigasyon',
  subtitle: 'Adım adım yönlendirme ve "Alış Noktasına Vardım" butonu',
  userGoal: 'Müşterinin kapısına trafiğe takılmadan en hızlı rotadan ulaşmak.',
  triggerAction: 'Kabul Et butonuna basılır ➔ Navigasyon başlar ➔ Müşteriye bildirim gider.',
  uxHighlights: [
    'Büyük Turn-by-Turn HUD başlığı ("250m sonra sağa dönün")',
    'Tek dokunuşla Google Maps / Apple Haritalar dış navigasyona geçiş',
    'Yolcuya "Noktaya Vardım" basıldığında push bildirimi',
  ],
  securityRule: 'Geofence Guard: Kurye varış noktasına 200m yaklaşmadan buton aktifleşmez.',
  apiEndpoint: 'POST /api/v1/rides/BLS-9481/arrive',
  apiPayload: JSON.stringify({ courier_id: 'kurye-1', current_gps: { lat: 41.0425, lng: 29.0065 } }, null, 2),
  designTokens: {
    typography: 'SF Pro Display 14px Black / Inter 12px Regular',
    colors: ['#0066FF', '#0F172A', '#38BDF8'],
    touchTarget: 'Big Primary Action 52pt',
    elevation: 'HUD Banner Dropdown',
  },
  edgeCases: ['Kurye yanlış sokakta durursa yolcuya haritada tam konumu gösterilir.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">↱</div>
        <div>
          <div className="text-[10px] text-zinc-300 font-bold uppercase">250m SONRA SAĞA DÖNÜN</div>
          <div className="text-xs font-bold text-white">Çırağan Caddesi Yönü</div>
        </div>
      </div>
      <div className="p-4 bg-zinc-950 rounded-3xl border border-zinc-800 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-400">Yolcu:</span>
          <span className="font-bold text-white">Bedirhan İbanoğlu</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Varış Noktası:</span>
          <span className="font-bold text-white">Levent Kanyon</span>
        </div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        Alış Noktasına Vardım (Yolcuya Bildir)
      </button>
    </div>
  ),
};
