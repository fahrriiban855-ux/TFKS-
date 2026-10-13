import React from 'react';
import { WireframeScreen } from '../types';

export const C05_CourierMatchingRadarScreen: WireframeScreen = {
  id: 'C-05',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 05 / 08',
  title: 'En Yakın Kurye Eşleşme Radarı',
  subtitle: 'Sıralı teklif kurgusu: Yakındaki en uygun sürücüye 15 sn süreyle teklif düşer',
  userGoal: 'Dakikalarca beklemeden saniyeler içinde en yakın kuryenin onayını almak.',
  triggerAction: 'Çağrı başlatılır ➔ 2 km çapındaki müsait kuryeler mesafeye göre sıralanır.',
  uxHighlights: [
    'Kilit mekanizması sayesinde aynı iş asla iki kuryeye birden verilmez',
    'Kurye kabul etmezse süre dolduğunda otomatik olarak sıradaki kuryeye aktarılır',
    'Dinamik radar dalgası ve kalan süre göstergesi',
    'Müşteriye tahmini eşleşme süresi (6.2 saniye) geri bildirimi',
  ],
  securityRule: 'Yarış durumu (Race Condition) Rust derleme aşamasında Mutex kilidiyle imkansız kılınır.',
  apiEndpoint: 'POST /api/v1/dispatch/order',
  apiPayload: JSON.stringify(
    {
      order_id: 'BLS-9481',
      dispatch_phase: 'cascading_offer',
      target_courier_id: 'kurye-1',
      timeout_sec: 15,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 14px SemiBold / SF Pro Display 18px Bold',
    colors: ['#0066FF', '#38BDF8', '#0F172A'],
    touchTarget: 'Cancel Button 44pt',
    elevation: 'Pulsing Concentric Rings',
  },
  edgeCases: [
    'Tüm kuryeler pas geçerse: Arama yarıçapı otomatik olarak 2 km’den 4 km’ye genişletilir.',
    'Müşteri aramayı iptal ederse: Henüz teklif kabul edilmediği için iptal ücreti alınmaz.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-5 flex flex-col justify-between text-zinc-100 relative items-center text-center font-sans">
      <div className="space-y-1.5 pt-6 relative z-10">
        <span className="px-3.5 py-1 bg-zinc-900 text-zinc-300 border border-zinc-700 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
          CANLI EŞLEŞTİRME MOTORU
        </span>
        <h3 className="text-xl font-bold text-white">En Yakın Kurye Aranıyor...</h3>
        <p className="text-xs text-zinc-400">Beşiktaş bölgesindeki müsait sürücüler mesafeye göre taranıyor</p>
      </div>

      <div className="relative my-auto flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-zinc-700 animate-ping absolute" />
        <div className="w-36 h-36 rounded-full border border-zinc-600 animate-pulse absolute" />
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center text-3xl shadow-2xl">
          🛵
        </div>
      </div>

      <div className="w-full p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-400">
        Ortalama eşleşme süresi: <strong className="text-white font-mono text-sm">6.2 saniye</strong>
      </div>
    </div>
  ),
};
