import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K07_CompleteTripEarningsScreen: WireframeScreen = {
  id: 'K-07',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 07 / 08',
  title: 'Görevi Tamamla & Kazanç Onayı',
  subtitle: 'Sürüş bitirilir, ücret karttan çekilir, kurye hakediş bakiyesine eklenir',
  userGoal: 'İşi sonlandırıp kazancını anında cüzdanında görmek.',
  triggerAction: 'Kurye "Tamamla"ya basar ➔ Ücret karttan çekilir ➔ Bakiye artar.',
  uxHighlights: [
    'Net hakediş bakiyesinin anında +202.72 ₺ artış animasyonu',
    'Müşteriyi puanlama ve yeni çağrılara hazır hâle gelme',
  ],
  securityRule: 'Ödeme başarısız olursa sistem kuryeye anında borç kaydı bildirir.',
  apiEndpoint: 'POST /api/v1/rides/BLS-9481/complete',
  apiPayload: JSON.stringify({ fare_final: 203.4, courier_net: 202.72, commission: 50.68 }, null, 2),
  designTokens: {
    typography: 'SF Pro Display 32px Black Mono',
    colors: ['#10B981', '#0F172A'],
    touchTarget: 'Primary Action 56pt',
    elevation: 'Success Ring Glow',
  },
  edgeCases: ['Müşteri karta bloke koyduysa sistem anında kuryeyi tazmin eder.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-center">
      <div className="space-y-4 pt-4">
        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center mx-auto ring-4 ring-zinc-800">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Görev Başarıyla Tamamlandı!</h3>
          <p className="text-xs text-zinc-400">Kazancınız hakediş hesabınıza aktarıldı.</p>
        </div>
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-3xl">
          <span className="text-[11px] text-zinc-400 block mb-1">Bu Seferden Net Kazancınız</span>
          <div className="text-4xl font-black font-mono text-white">+202.72 ₺</div>
        </div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        Yeni Çağrılara Hazırım
      </button>
    </div>
  ),
};
