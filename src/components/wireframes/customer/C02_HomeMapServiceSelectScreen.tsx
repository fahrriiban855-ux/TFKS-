import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C02_HomeMapServiceSelectScreen: WireframeScreen = {
  id: 'C-02',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 02 / 08',
  title: 'Ana Harita & Çift Mod Hizmet Seçimi',
  subtitle: 'Motosiklet Yolcu Taşıma vs Motokurye Paket Gönderimi',
  userGoal: 'Şehir içi hızlı ulaşım mı yoksa evrak/koli teslimatı mı istediğini anında seçmek.',
  triggerAction: 'Motosiklet (Yolcu) veya Kurye (Paket) tabına dokunulur ➔ Haritadaki müsait araçlar filtrelenir.',
  uxHighlights: [
    'Tam ekran koyu vektörel harita (CartoDB Dark Matter / Mapbox Dark)',
    'Çevredeki aktif kuryelerin saniyelik yön işaretçili ve radar dalgalı ikonları',
    'İki hizmet türü arasında tek dokunuşla kaydırma geçişi',
    'Pusula, GPS odaklama ve son gidilen favori adresler çubuğu',
  ],
  securityRule: 'Müşteri konum verisi yalnızca uygulama açıkken ve talep anında geçici işlenir (KVKK uyumu).',
  apiEndpoint: 'GET /api/v1/fleet/nearby?lat=41.0425&lng=29.0065&radius_m=2000',
  apiPayload: JSON.stringify(
    {
      lat: 41.0425,
      lng: 29.0065,
      service_filter: 'motosiklet',
      active_geofence: 'TR-IST-AVR-01',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 12px SemiBold / SF Pro Display 16px Bold',
    colors: ['#0066FF', '#06B6D4', '#0F172A', '#1E293B'],
    touchTarget: '44pt Segment Switcher',
    elevation: 'Float Card (backdrop-blur-xl border border-slate-700/80)',
  },
  edgeCases: [
    'Yakında hiç kurye yoksa: "Bölgenizde yoğunluk var, en yakın kurye 6 dk uzakta" uyarısı.',
    'Kullanıcı konum izni vermediyse: Manuel adres arama çubuğu tam ekran açılır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-[#080E1C] p-4 flex flex-col justify-between text-slate-100 relative overflow-hidden">
      {/* Simulated Detailed Vector Map Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091224] to-[#060A14] flex items-center justify-center">
        {/* Road lines */}
        <div className="absolute w-[180%] h-1 bg-slate-800 rotate-45" />
        <div className="absolute w-[180%] h-1 bg-slate-800 -rotate-12" />
        <div className="absolute w-2 h-[180%] bg-slate-800/80 left-1/3" />
        {/* Radar wave */}
        <div className="w-56 h-56 rounded-full border border-white/10 animate-ping absolute" />
        <div className="w-36 h-36 rounded-full border border-white/20 animate-pulse absolute" />

        {/* Courier Markers */}
        <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
          <div className="px-2 py-0.5 bg-white text-black rounded text-[9px] font-mono font-bold shadow-lg">2 dk</div>
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center text-sm shadow-xl">🛵</div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
          <div className="px-2 py-0.5 bg-white text-black rounded text-[9px] font-mono font-bold shadow-lg">4 dk</div>
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center text-sm shadow-xl">🛵</div>
        </div>
        {/* User Pin */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="px-2.5 py-1 bg-black border border-zinc-700 text-white rounded-xl text-[10px] font-bold shadow-2xl mb-1">
            Buradasınız (Beşiktaş)
          </div>
          <div className="w-5 h-5 rounded-full bg-white ring-4 ring-white/20" />
        </div>
      </div>

      {/* Top Floating Controls */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="p-1 bg-zinc-950 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-xl flex gap-1 text-xs font-bold">
          <span className="px-3.5 py-2 bg-white text-black rounded-xl shadow-md flex items-center gap-1.5 font-black">
            <span>🛵 Motosiklet</span>
          </span>
          <span className="px-3.5 py-2 text-zinc-400 hover:text-white flex items-center gap-1.5">
            <span>📦 Motokurye</span>
          </span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-bold text-white shadow-xl">
          BI
        </div>
      </div>

      {/* Bottom Floating Booking Trigger */}
      <div className="relative z-10 p-4 bg-zinc-950 backdrop-blur-xl rounded-3xl border border-zinc-800 shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold px-1">
          <span>ŞEHİR İÇİ HIZLI ULAŞIM</span>
          <span className="text-white font-mono font-bold">● 4 Sürücü Çevrede</span>
        </div>

        <div className="p-3.5 bg-black rounded-2xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-500 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white ring-4 ring-white/20" />
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">Nereye Gitmek İstersiniz?</span>
              <span className="text-xs font-bold text-white">Levent Kanyon AVM</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  ),
};
