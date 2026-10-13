import React from 'react';
import { WireframeScreen } from '../types';

export const K05_BoardingPinPadScreen: WireframeScreen = {
  id: 'K-05',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 05 / 08',
  title: 'Biniş Kodu Doğrulama (Numerik PIN Pad)',
  subtitle: 'Yolcunun söylediği 4 haneli kodu doğrulamadan sistem yolculuğu başlatmaz',
  userGoal: 'Yanlış yolcu alımını ve sahtekarlığı sıfıra indirmek.',
  triggerAction: 'Yolcu 4821 söyler ➔ Kurye tuşlar ➔ Kod uyuşunca sürüş başlar.',
  uxHighlights: [
    'Eldivenle kullanıma uygun dev numerik tuş takımı',
    'Yanlış kod girildiğinde sesli ve titreşimli ikaz',
    'Kod doğrulanmadan taksimetre ve rota başlamaz',
  ],
  securityRule: 'Biniş kodu doğrulaması sunucuda kriptografik hash karşılaştırmasıyla onaylanır.',
  apiEndpoint: 'POST /api/v1/rides/BLS-9481/verify-code',
  apiPayload: JSON.stringify({ code: '4821', courier_id: 'kurye-1' }, null, 2),
  designTokens: {
    typography: 'SF Pro Mono 24px Bold / Inter 12px Medium',
    colors: ['#10B981', '#0F172A', '#E2E8F0'],
    touchTarget: 'Keypad Cells 52pt',
    elevation: 'Tactile Button Depress',
  },
  edgeCases: ['3 hatalı denemede yolcuya SMS ile yeni kod üretilir.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-center">
      <div className="space-y-2 pt-2">
        <span className="text-[11px] text-zinc-400 font-bold uppercase">YOLCUNUN 4 HANELİ BİNİŞ KODU</span>
        <div className="flex justify-center gap-2">
          {['4', '8', '2', '1'].map((d, i) => (
            <div key={i} className="w-12 h-12 rounded-2xl bg-zinc-950 border-2 border-white font-mono font-bold text-xl text-white flex items-center justify-center shadow-lg">
              {d}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2 bg-zinc-950 rounded-3xl border border-zinc-800 text-base font-mono font-bold">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
          <div key={n} className="py-3 hover:bg-zinc-800 rounded-xl text-white cursor-pointer">{n}</div>
        ))}
        <div />
        <div className="py-3 text-white cursor-pointer">0</div>
        <div className="py-3 text-zinc-500 cursor-pointer">⌫</div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        Kodu Doğrula ve Sürüşü Başlat
      </button>
    </div>
  ),
};
