import React from 'react';
import { WireframeScreen } from '../types';

export const A04_FinancialSettlementScreen: WireframeScreen = {
  id: 'A-04',
  category: 'admin',
  categoryLabel: 'Web Yönetici Paneli',
  stepNumber: 'PANEL 04 / 06',
  title: 'Finans, Komisyon Kasası & Banka Mutabakatı',
  subtitle: 'Platform komisyonu kasada kalır, kurye hakedişleri onaylanıp IBAN’a aktarılır',
  userGoal: 'Muhasebe karmaşasını bitirmek, tek kuruş sapma olmadan haftalık hakediş listesini onaylamak.',
  triggerAction: 'Pazartesi günü "Hakedişleri Onayla"ya basılır ➔ Banka transfer talimatı üretilir.',
  uxHighlights: [
    'Kuryeye ödenen, platformda kalan ve iade edilen tutarların net ayrımı',
    'Tek tıkla toplu hakediş listesi onaylama',
    'Excel / CSV ve muhasebe programı entegrasyonu',
  ],
  securityRule: 'Blesyum para akışının içine girmez; tahsilat doğrudan müşteriden bankaya, oradan kuryeye gider.',
  apiEndpoint: 'POST /api/v1/admin/payouts/batch-transfer',
  apiPayload: JSON.stringify({ batch_id: 'PAY-2026-W40', total_amount: 11450.0, courier_count: 4 }, null, 2),
  designTokens: {
    typography: 'Inter 12px Regular / SF Pro Mono 16px Bold',
    colors: ['#10B981', '#0F172A'],
    touchTarget: 'Batch Action Buttons',
    elevation: 'Ledger Table Elevation',
  },
  edgeCases: ['Kurye IBAN numarası hatalıysa transfer otomatik durdurulur.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <span className="font-bold text-white">Hakediş & Finans Mutabakatı</span>
        <span className="text-white font-mono font-bold">11.450 ₺ Kasa</span>
      </div>
      <div className="space-y-2">
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-white">Mert Aksoy (34 BLY 717)</div>
            <div className="text-[10px] text-zinc-400 font-mono">TR42 0006 2000 0001 2345...</div>
          </div>
          <span className="font-mono font-bold text-white text-sm">3.200 ₺</span>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-white">Serkan Yıldırım (34 MKP 92)</div>
            <div className="text-[10px] text-zinc-400 font-mono">TR15 0001 5001 0022 9988...</div>
          </div>
          <span className="font-mono font-bold text-white text-sm">2.100 ₺</span>
        </div>
      </div>
      <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-xl shadow transition-colors">
        Tüm Kurye Hakedişlerini Onayla
      </button>
    </div>
  ),
};
