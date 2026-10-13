import React from 'react';
import { WireframeScreen } from '../types';

export const A02_KycApprovalDeskScreen: WireframeScreen = {
  id: 'A-02',
  category: 'admin',
  categoryLabel: 'Web Yönetici Paneli',
  stepNumber: 'PANEL 02 / 06 (KATMAN 3)',
  title: 'Kurye Başvuru ve KYC Belge Onay Masası',
  subtitle: 'A sınıfı ehliyet, ruhsat, sigorta ve adli sicil kayıtlarını tek tıkla onaylama',
  userGoal: 'Sisteme katılan kuryelerin evraklarını inceleyip sahte veya süresi dolmuş belgeleri ayıklamak.',
  triggerAction: 'Kurye başvurduğunda bildirim düşer ➔ Yönetici evrakları inceler ➔ Onayla / Dondur.',
  uxHighlights: [
    'Belge büyütme vizörü (Zoomable ID Inspector)',
    'Süresi dolan belgelerde otomatik hesap dondurma',
    'Tek tıkla kurye hesabını askıya alma veya aktifleştirme',
  ],
  securityRule: 'Onaylanmayan hiçbir sürücüye sunucu API tarafından çağrı atanmaz.',
  apiEndpoint: 'POST /api/v1/admin/kyc/review',
  apiPayload: JSON.stringify({ courier_id: 'kurye-3', decision: 'approve', reviewer_id: 'admin_1' }, null, 2),
  designTokens: {
    typography: 'Inter 12px Regular / SF Pro Display 14px Bold',
    colors: ['#0066FF', '#10B981', '#F59E0B'],
    touchTarget: 'Table Action Buttons',
    elevation: 'Modal Inspector Elevation',
  },
  edgeCases: ['Adli sicil kaydında suç kaydı varsa otomatik ret verilir.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
        <span className="font-bold text-white">Kurye Akreditasyon Masası</span>
        <span className="text-zinc-300 font-mono text-[10px] font-bold">1 Bekleyen Başvuru</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-white">Burak Keskin (34 MOT 19)</div>
            <div className="text-[11px] text-zinc-400">Vespa GTS 300 Super · Tel: +90 530 671...</div>
          </div>
          <span className="px-2.5 py-1 bg-white text-black rounded-lg font-bold text-[10px]">İNCELE</span>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-white">Mert Aksoy (34 BLY 717)</div>
            <div className="text-[11px] text-zinc-400">Yamaha NMAX 155 · 642 İşlem · 4.94 ★</div>
          </div>
          <span className="px-2.5 py-1 bg-zinc-900 text-white border border-zinc-700 rounded-lg font-bold text-[10px]">ONAYLI</span>
        </div>
      </div>
      <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-xl shadow transition-colors">
        Tüm Filo Belge Raporunu Gör
      </button>
    </div>
  ),
};
