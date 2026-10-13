import React from 'react';
import { WireframeScreen } from '../types';

export const A06_ComplaintsRefundDeskScreen: WireframeScreen = {
  id: 'A-06',
  category: 'admin',
  categoryLabel: 'Web Yönetici Paneli',
  stepNumber: 'PANEL 06 / 06',
  title: 'Şikayet, Destek & Anında İade Masası',
  subtitle: 'Gecikme veya anlaşmazlıklarda rota kaydıyla birlikte tek tıkla iade ve kupon',
  userGoal: 'Müşteri ve kurye memnuniyetsizliğini dakikalar içinde çözüp kupon veya iade tanımlamak.',
  triggerAction: 'Şikayet bildirimi açılır ➔ Sürüşün haritası açılır ➔ Tam/kısmi iade onaylanır.',
  uxHighlights: [
    'İlgili sürüşün rotası, saatleri ve kuryesiyle birlikte gelen şikayet kartı',
    'Tek tıkla kart kuruluşuna kısmi/tam iade talimatı verme',
    'Kullanıcıya özür kuponu tanımlama mekanizması',
  ],
  securityRule: 'İade işlemleri banka API üzerinden orijinal provizyona iade edilir; nakit para çıkışı olmaz.',
  apiEndpoint: 'POST /api/v1/admin/support/refund',
  apiPayload: JSON.stringify({ ticket_id: 'CMP-101', refund_amount: 50.0, coupon_issued: 'BLESYUM50' }, null, 2),
  designTokens: {
    typography: 'Inter 12px Regular / SF Pro Display 14px Bold',
    colors: ['#E11D48', '#10B981'],
    touchTarget: 'Refund Action Buttons',
    elevation: 'Ticket Action Surface',
  },
  edgeCases: ['Kötü niyetli mükerrer iade talepleri sistem tarafından engellenir.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <span className="font-bold text-white">Canlı Destek & İade Masası</span>
        <span className="text-zinc-300 font-bold text-[10px]">1 Çözüldü</span>
      </div>
      <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
        <div className="flex justify-between">
          <span className="font-bold text-white">CMP-101: Gecikme Şikayeti</span>
          <span className="text-white font-bold text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">ÇÖZÜLDÜ ✓</span>
        </div>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          "Trafik nedeniyle 5 dk geç varış yapıldı. Müşteriye 50 ₺ indirim kuponu tanımlandı."
        </p>
      </div>
      <button className="w-full py-3 bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl hover:bg-zinc-800 transition-colors">
        Tüm Şikayet ve Kupon Geçmişini Gör
      </button>
    </div>
  ),
};
