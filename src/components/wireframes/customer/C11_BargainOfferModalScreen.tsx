import React from 'react';
import {
  Handshake,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Clock,
  Percent,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const C11_BargainOfferModalScreen: WireframeScreen = {
  id: 'C-11',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 11 / 14',
  title: 'Sünnet Pazarlığı & Çift Taraflı Fiyat Teklifi Verme Şeması',
  subtitle: 'Esnaf Usulü İkram, Düz Hesap ve Kurye Karşı Teklif Senkronizasyonu',
  userGoal:
    'Standart algoritma tarifesine mahkum kalmadan, esnaf usulü pazarlıkla indirim teklif etmek ve sürücünün karşı teklifini tek dokunuşla kabul etmek.',
  triggerAction:
    'Yolcu çağrı ekranındaki "Pazarlık Yap (Maksat Gönül Olsun)" butonuna dokunur ➔ Hızlı teklif çipleri ve karşı teklif akışı açılır.',
  uxHighlights: [
    'Sünnet İndirimi (-%10): Esnaf geleneği öğrenci ve dost ikramı indirimi',
    'Düz Hesap: Kuruşları ve küsuratları en yakın taban 10 TL katına yuvarlama',
    'Hızlı Kap Primi (+%12): Acil işi olan yolcunun kuryeye prim sunarak çağrısını ön plana alması',
    'Karşı Teklif Alarmı (Counter-Offer): Kurye "Ortasını bulalım" dediğinde çıkan 30 saniyelik anlaşma penceresi',
    'Helalleşildi Mührü: Her iki taraf anlaştığında yeşil el sıkışma rozetiyle sefere başlanması',
  ],
  securityRule:
    'Pazarlık taban ücret kuralı: İndirimli tutar motosiklet yakıt ve baz maliyetinin altına (60 TL altına) inemez.',
  apiEndpoint: 'POST /api/v1/ride/bargain/propose',
  apiPayload: JSON.stringify(
    {
      ride_id: 'BLS-9481',
      original_fare: 155,
      offered_fare: 140,
      bargain_type: 'sunnet',
      reason: 'Maksat sünnet olsun, iki tarafın da gönlü olsun 🤝',
      counter_offer_received: 145,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'SF Pro Display 16px Heavy / Inter 13px Medium / JetBrains Mono 12px Bold',
    colors: ['#F59E0B', '#10B981', '#0F172A', '#EAB308'],
    touchTarget: '48pt x 48pt Action Buttons',
    elevation: 'Gold Amber Glow (border-amber-500/50 shadow-2xl)',
  },
  edgeCases: [
    'Kurye teklifi reddederse: Sefer otomatik olarak liste fiyatına döner ve yolcuya bildirim gider.',
    '30 saniye içinde karşı teklife yanıt verilmezse: Zaman aşımı olur ve standart fiyatla devam edilir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center text-lg font-black shadow-md">
              🤝
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Fiyat Teklifi Masası</h3>
              <span className="text-[10px] text-zinc-400 font-mono">Dostane Doğrudan Teklif</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-300 font-mono bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
            Aktif Teklif
          </span>
        </div>
      </div>

      {/* Main Bargain Card */}
      <div className="space-y-3 py-2">
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Standart Algoritma Fiyatı:</span>
            <span className="font-mono text-zinc-500 line-through">155 ₺</span>
          </div>

          <div className="flex justify-between items-center text-sm font-bold pt-1 border-t border-zinc-850">
            <span className="text-zinc-300">Önerilen Fiyat Teklifi:</span>
            <span className="font-mono text-lg text-white font-black">140 ₺</span>
          </div>
        </div>

        {/* Embedded (-) Price (+) Stepper */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            Fiyat Ayarlama Butonu (- / +)
          </span>
          <div className="w-full py-2 pl-4 pr-2 bg-white text-black font-black text-xs rounded-xl flex items-center justify-between shadow-lg">
            <span>Teklif ile Çağır</span>
            <div className="flex items-center bg-black border border-zinc-800 rounded-lg p-1 gap-1.5 text-white">
              <span className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center font-bold text-xs">-</span>
              <span className="font-mono text-xs px-1 font-bold text-white">140 ₺</span>
              <span className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center font-bold text-xs">+</span>
            </div>
          </div>
        </div>

        {/* Incoming Counter Offer Box */}
        <div className="p-3 bg-zinc-950 border border-zinc-700 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Handshake className="w-4 h-4 text-zinc-300" />
              <span>Sürücü Karşı Teklif Sundu:</span>
            </div>
            <span className="font-mono text-base font-black text-white">145 ₺</span>
          </div>
          <p className="text-[11px] text-zinc-400 italic">
            "Ortasını bulalım Bedirhan Bey, iki tarafın da gönlü hoş olsun 🤝"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="grid grid-cols-2 gap-2">
          <div className="min-h-[48px] py-2.5 bg-white text-black font-black text-center rounded-xl text-xs shadow-lg flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all">
            <Check className="w-4 h-4" />
            <span>Kabul Et (145 ₺)</span>
          </div>
          <div className="min-h-[48px] py-2.5 bg-zinc-900 text-zinc-300 font-bold text-center rounded-xl text-xs border border-zinc-800 flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all">
            <X className="w-4 h-4" />
            <span>Reddet</span>
          </div>
        </div>
        <div className="text-[10px] text-zinc-500 text-center">
          Pazarlık anlaşması yolculuk bitiminde otomatik cariye yansıtılır.
        </div>
      </div>
    </div>
  ),
};
