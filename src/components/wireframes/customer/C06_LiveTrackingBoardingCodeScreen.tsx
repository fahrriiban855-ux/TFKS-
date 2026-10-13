import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C06_LiveTrackingBoardingCodeScreen: WireframeScreen = {
  id: 'C-06',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 06 / 08',
  title: 'Canlı Takip & 4 Haneli Biniş Kodu',
  subtitle: 'Mert Aksoy (34 BLY 717) yolda · Güvenlik kodu doğrulanmadan motor kalkmaz',
  userGoal: 'Kuryenin saniye saniye yaklaşmasını izlemek ve doğru motora bindiğinden emin olmak.',
  triggerAction: 'Kurye kabul eder ➔ Canlı rota açılır ➔ 4 haneli biniş kodu üretilir.',
  uxHighlights: [
    'Sürücü adı, net fotoğrafı, plaka, motor modeli ve 4.94 ★ puanı',
    'Büyük fontla 4 Haneli BİNİŞ KODU (Örn: 4821)',
    'Uygulama içi şifreli mesajlaşma ve maskeli telefon araması',
    'Kuryenin kalan varış süresi (ETA) milisaniyelik canlı güncelleme',
  ],
  securityRule: 'Müşteri ve kurye telefon numaraları birbirine gösterilmez; numara maskeleme kullanılır.',
  apiEndpoint: 'WS /api/v1/rides/BLS-9481/telemetry',
  apiPayload: JSON.stringify(
    {
      courier_id: 'kurye-1',
      lat: 41.043,
      lng: 29.007,
      heading: 42,
      eta_min: 2,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'SF Pro Display 32px Black Mono / Inter 13px Bold',
    colors: ['#0066FF', '#10B981', '#0F172A', '#06B6D4'],
    touchTarget: 'Call / Chat Buttons 48pt',
    elevation: 'Security Card Border Glow',
  },
  edgeCases: [
    'Kurye yanlış yöne giderse: ETA otomatik yeniden hesaplanır.',
    'Müşteri 5 dakika boyunca noktaya gelmezse: Bekleme ücreti sayacı başlar.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="p-3.5 bg-zinc-950 rounded-3xl border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center text-2xl shadow-lg">
            🛵
          </div>
          <div>
            <div className="font-bold text-xs text-white">Mert Aksoy (★ 4.94)</div>
            <div className="text-[11px] text-zinc-400 font-mono font-bold">34 BLY 717 · NMAX 155</div>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-700 px-3 py-1 rounded-xl">
          2 dk
        </span>
      </div>

      <div className="p-5 bg-zinc-950 border border-zinc-700 rounded-3xl text-center space-y-1.5 shadow-2xl">
        <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider block">
          BİNİŞ KODUNUZ (SÜRÜCÜYE İLETİNİZ)
        </span>
        <div className="text-4xl font-black font-mono tracking-widest text-white">4821</div>
        <p className="text-[10px] text-zinc-400">Bu kod sürücü terminalinden girilmeden yolculuk başlatılamaz.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors">
          <MessageCircle className="w-4 h-4 text-white" />
          <span>Mesaj Yaz</span>
        </button>
        <button className="py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors">
          <Phone className="w-4 h-4 text-white" />
          <span>Sürücüyü Ara</span>
        </button>
      </div>
    </div>
  ),
};
