import React from 'react';
import { WireframeScreen } from '../types';

export const A01_FleetRadarGeofenceScreen: WireframeScreen = {
  id: 'A-01',
  category: 'admin',
  categoryLabel: 'Web Yönetici Paneli',
  stepNumber: 'PANEL 01 / 06 (KATMAN 1 & 4)',
  title: 'Canlı Operasyon Haritası & PostGIS Filo Radarı',
  subtitle: 'Tüm kuryeler, aktif yolculuklar ve bekleyen talepler tek bakışta haritada',
  userGoal: 'Tüm şehirdeki motosiklet trafiğini, talep yoğunluğunu ve boşta kalan kuryeleri canlı izlemek.',
  triggerAction: 'Yönetici paneli açılır ➔ WebSocket ile saniyelik kurye telemetrisi haritada akar.',
  uxHighlights: [
    'Geofence çokgenleri (Avrupa Yakası, Anadolu Yakası, Boğaz Geçiş Hattı)',
    'Yeşil: Müsait, Sarı: Yolculukta/Pakette, Kırmızı: Acil Durum / SOS uyarısı',
    'Kurye üzerine tıklandığında anlık hız, şarj seviyesi ve aktif rota kartı',
  ],
  securityRule: 'Yönetici paneline sadece iki faktörlü (2FA) doğrulanmış yetkili IP adreslerinden erişilir.',
  apiEndpoint: 'WS /api/v1/admin/fleet/radar',
  apiPayload: JSON.stringify({ active_zones: ['zone-avrupa', 'zone-anadolu'], active_couriers: 4, surge: 1.2 }, null, 2),
  designTokens: {
    typography: 'Inter 13px Regular / JetBrains Mono 14px Bold',
    colors: ['#0066FF', '#10B981', '#0F172A'],
    touchTarget: 'Interactive Map Pins',
    elevation: 'Full Viewport Glass Console',
  },
  edgeCases: ['Kurye bağlantısı 30 saniye koparsa radar "Sinyal Kaybı" uyarısı verir.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative">
      <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
        <span className="font-bold text-white">Canlı Filo Radarı (İstanbul)</span>
        <span className="font-mono text-zinc-300 font-bold">4 Aktif · 1 Görevde</span>
      </div>
      <div className="flex-1 my-2 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 text-center space-y-2">
          <span className="px-3.5 py-1 bg-zinc-900 text-white border border-zinc-700 rounded-full text-[10px] font-mono font-bold">
            POSTGIS GEOFENCE RADAR AKTİF
          </span>
          <div className="text-xs text-zinc-400">Avrupa & Anadolu Servis Poligonları Devrede</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300">Ciro: 253.40 ₺</div>
        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold">Komisyon: 50.68 ₺</div>
        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold">Kurye: 202.72 ₺</div>
      </div>
    </div>
  ),
};
