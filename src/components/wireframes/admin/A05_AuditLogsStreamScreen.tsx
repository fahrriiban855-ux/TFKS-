import React from 'react';
import { WireframeScreen } from '../types';

export const A05_AuditLogsStreamScreen: WireframeScreen = {
  id: 'A-05',
  category: 'admin',
  categoryLabel: 'Web Yönetici Paneli',
  stepNumber: 'PANEL 05 / 06',
  title: 'Sipariş Akışı & Güvenlik Denetim İzi (Audit Log)',
  subtitle: 'Her giriş, işlem, iptal ve ödemenin koordinatlı saniyelik kayıt arşivi',
  userGoal: 'Herhangi bir anlaşmazlıkta geriye dönük rotayı, saatleri ve ödemeyi kanıtla incelemek.',
  triggerAction: 'Geçmiş sefere tıklanır ➔ Haritada katedilen yol ve işlem adımları tek tek açılır.',
  uxHighlights: [
    'Anlaşmazlık tahmine değil, koordinat kaydına dayanır',
    'KVKK kapsamında konum verisi saklama ve anonimleştirme takvimi',
    'Excel dışa aktarım (CSV) desteği',
  ],
  securityRule: 'Denetim kayıtları değiştirilemez (Append-Only Write-Once) kütük olarak saklanır.',
  apiEndpoint: 'GET /api/v1/admin/audit-logs?date=2026-10-02',
  apiPayload: JSON.stringify({ logs: [{ id: 'LOG-9481', event: 'ride_completed', actor: 'courier_1', ip: '176.240.12.8' }] }, null, 2),
  designTokens: {
    typography: 'JetBrains Mono 11px Regular / Inter 12px Bold',
    colors: ['#0066FF', '#0F172A'],
    touchTarget: 'Row Click for Full Route Inspection',
    elevation: 'Log Viewer Surface',
  },
  edgeCases: ['Kayıtlar 2 yıl boyunca kanunen saklanır ve değiştirilemez.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <span className="font-bold text-white">İşlem ve Denetim İzi Kayıtları</span>
        <span className="text-zinc-400 font-mono text-[10px]">Append-Only Log</span>
      </div>
      <div className="space-y-2 text-[11px]">
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between">
          <div>
            <span className="font-bold text-white font-mono">BLS-9481</span> · Beşiktaş ➔ Levent
            <div className="text-zinc-400">Mert Aksoy (Kurye) ➔ Bedirhan İ. (Yolcu)</div>
          </div>
          <span className="font-mono font-bold text-white">203.40 ₺</span>
        </div>
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between">
          <div>
            <span className="font-bold text-white font-mono">BLS-9482</span> · Kadıköy ➔ Moda
            <div className="text-zinc-400">Serkan Y. (Kurye) ➔ Av. Kemal E. (Alıcı)</div>
          </div>
          <span className="font-mono font-bold text-zinc-300">142.20 ₺</span>
        </div>
      </div>
      <button className="w-full py-3 bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl hover:bg-zinc-800 transition-colors">
        Tüm Denetim İzini Excel Olarak İndir
      </button>
    </div>
  ),
};
