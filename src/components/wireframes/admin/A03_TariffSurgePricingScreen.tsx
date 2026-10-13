import React from 'react';
import { WireframeScreen } from '../types';

export const A03_TariffSurgePricingScreen: WireframeScreen = {
  id: 'A-03',
  category: 'admin',
  categoryLabel: 'Web Yönetici Paneli',
  stepNumber: 'PANEL 03 / 06 (KATMAN 2)',
  title: 'Tarife, Bölge ve Yoğun Saat Çarpanı (Surge)',
  subtitle: 'Açılış, km/dk ücreti ve komisyon oranını kod yazmadan panelden yönetme',
  userGoal: 'Cuma akşamı, yağmurlu hava veya yoğun bölgelerde kurye çekmek için dinamik fiyatlama yapmak.',
  triggerAction: 'Panelden çarpan 1.5x yapılır ➔ Tüm çağrılarda yeni tarife anında devreye girer.',
  uxHighlights: [
    'Motosiklet ve motokurye için birbirinden bağımsız tarife motoru',
    'Dinamik Yoğun Saat Çarpanı Slider (1.0x - 2.5x)',
    'Şirket platform komisyon oranı (%10 - %30) değiştirici',
  ],
  securityRule: 'Tüm tarife değişiklikleri yönetici ID ve IP damgasıyla denetim izine (Audit Trail) yazılır.',
  apiEndpoint: 'PUT /api/v1/tariffs/surge',
  apiPayload: JSON.stringify({ surge_multiplier: 1.25, motorcycle_base: 60.0, per_km: 28.0, commission: 0.2 }, null, 2),
  designTokens: {
    typography: 'Inter 12px Regular / SF Pro Mono 16px Bold',
    colors: ['#0066FF', '#F59E0B'],
    touchTarget: 'Slider Controls',
    elevation: 'Control Panel Surface',
  },
  edgeCases: ['Surge çarpanı 2.5x üstüne çıkarılamaz (Tüketici koruma tavanı).'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <span className="font-bold text-white">Tarife ve Fiyatlama Motoru</span>
        <span className="text-white font-bold font-mono">Canlı Yayında</span>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-400">Motosiklet Açılış:</span>
            <span className="font-bold text-white font-mono">60.00 ₺</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Motosiklet Km Başı:</span>
            <span className="font-bold text-white font-mono">28.00 ₺</span>
          </div>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-400">Yoğun Saat Çarpanı (Surge):</span>
            <span className="font-bold text-white font-mono">1.2x Aktif</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Platform Komisyonu:</span>
            <span className="font-bold text-white font-mono">%20.00</span>
          </div>
        </div>
      </div>
      <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-xl shadow transition-colors">
        Tarifeleri Güncelle ve Dağıt
      </button>
    </div>
  ),
};
