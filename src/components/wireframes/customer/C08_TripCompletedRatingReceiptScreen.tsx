import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C08_TripCompletedRatingReceiptScreen: WireframeScreen = {
  id: 'C-08',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 08 / 08',
  title: 'İşlem Sonu, Otomatik Fiş & Puanlama',
  subtitle: 'Kayıtlı karttan otomatik çekim, dijital e-arşiv makbuzu ve 5 yıldız değerlendirme',
  userGoal: 'Ödeme kuyruğu olmadan motoru terk etmek, faturasını görmek ve sürücüyü puanlamak.',
  triggerAction: 'Sürücü "Tamamla"ya basar ➔ Tutar çekilir ➔ Dijital makbuz ekranda belirir.',
  uxHighlights: [
    'Otomatik çekim bildirimi (Karttan 203.40 ₺ çekildi)',
    '1-5 Yıldız puanlama ve sürücüye bahşiş ekleme',
    'Dijital fatura dökümü (KDV, baz ücret, km tutarı)',
    'E-Arşiv Fatura PDF indirme butonu',
  ],
  securityRule: 'Her finansal çekim işlemi tekil Transaction UUID ile korunur, mükerrer çekim imkansızdır.',
  apiEndpoint: 'POST /api/v1/rides/BLS-9481/rate',
  apiPayload: JSON.stringify(
    {
      rating: 5,
      tip_amount: 20.0,
      feedback_tags: ['guvenli_surus', 'temiz_kask', 'zamaninda_varis'],
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 14px SemiBold / SF Pro Display 24px Bold',
    colors: ['#10B981', '#F59E0B', '#0F172A'],
    touchTarget: 'Interactive Star Rating 40pt',
    elevation: 'Success Checkmark Pulse',
  },
  edgeCases: [
    '1 veya 2 yıldız verilirse: Otomatik şikayet formu açılır ve sürücüye geri bildirim iletilir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-center">
      <div className="space-y-4 pt-4">
        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center mx-auto ring-4 ring-zinc-800">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Yolculuk Tamamlandı!</h3>
          <p className="text-xs text-zinc-400">Ücret kayıtlı kartınızdan başarıyla çekildi.</p>
        </div>
        <div className="p-4 bg-zinc-950 rounded-3xl border border-zinc-800 text-xs">
          <span className="text-zinc-400 block mb-0.5">Toplam Ödenen</span>
          <span className="text-3xl font-black font-mono text-white">203.40 ₺</span>
          <span className="text-[10px] text-zinc-400 font-mono block mt-1">E-Arşiv Fatura: BLS-2026-9481</span>
        </div>
        <div className="flex justify-center gap-2 py-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-7 h-7 text-white fill-white cursor-pointer hover:scale-110 transition-transform" />
          ))}
        </div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        Değerlendirmeyi Gönder & Kapat
      </button>
    </div>
  ),
};
