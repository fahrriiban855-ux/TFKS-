import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, Clock } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K10_WeeklyPlatformAccessStatusScreen: WireframeScreen = {
  id: 'K-10',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 10 / 15',
  title: 'Sürücü Görev Geçmişi, Haftalık Erişim & TransactionFeeSnapshot İnceleme',
  subtitle: 'Tamamlanan Seferlerin 18 Alanlı %0 Komisyon Mührü ve Haftalık Platform Erişim Durumu',
  userGoal:
    'Tamamlanan tüm taksi ve kurye görevlerinin 18 alanlı ücret mührünü (TransactionFeeSnapshot) incelemek ve haftalık platform erişim durumunu şeffafça görmek.',
  triggerAction:
    'Sürücü "Görev Geçmişi & Ücret Mühürleri" sekmesine dokunur ➔ Sayfalanmış sefer listesi ve SHA-256 doğrulama kartı açılır.',
  uxHighlights: [
    '18 Alanlı TransactionFeeSnapshot Kartı: Brüt tutar, 0.00 ₺ platform kesintisi ve %100 sürücü net hakedişi',
    'SHA-256 Kriptografik Mühür Doğrulaması: Her geçmiş seferin değiştirilemez özet değeri',
    'Sayfalanmış (Paginated) Görev Arşivi: Tarih ve hizmet türüne (TAXI_RIDE / BUSINESS_DELIVERY) göre filtreleme',
    'M0 Sıfır Komisyon Güvencesi: Sürücüden hiçbir ad altında yüzdesel komisyon kesilmediğinin kanıtı',
  ],
  securityRule:
    'TransactionFeeSnapshot kayıtları PostgreSQL üzerinde append-only (UPDATE/DELETE yasaklı) olarak tutulur.',
  apiEndpoint: 'GET /api/v1/driver/orders?page=1&pageSize=20',
  apiPayload: JSON.stringify(
    {
      driver_id: 'kurye-1',
      access_status: 'ACTIVE_ZERO_COMMISSION',
      completed_orders: [
        {
          order_id: 'MP-9481',
          service_type: 'INDIVIDUAL_DELIVERY',
          gross_amount_tl: 205.0,
          provider_commission_tl: 0.0,
          driver_net_payout_tl: 205.0,
          snapshot_hash: 'SHA256-9F86D081884C7D659A2FEAA0C55AD015',
        },
      ],
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#10B981', '#2563EB', '#090D16', '#F8FAFC'],
    touchTarget: '48pt x 48pt Row Hitbox',
    elevation: 'Flat Hairline Border (border-zinc-800)',
  },
  edgeCases: [
    'İnternet bağlantısı zayıfsa: Son 20 seferin özet mührü yerel önbellekten salt-okunur olarak gösterilir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Görev &amp; Snapshot Arşivi</h3>
              <span className="text-[10px] text-zinc-400 font-mono">18 ALANLI ÜCRET MÜHRÜ</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            %100 Net
          </span>
        </div>
      </div>

      <div className="space-y-2 my-2 font-mono text-[11px]">
        {[
          { id: 'MP-9481', route: 'Beşiktaş → Levent', fare: '205,00 ₺', hash: '9F86..D015' },
          { id: 'MP-9476', route: 'Nişantaşı → Bebek (3 Paket)', fare: '340,00 ₺', hash: '4A12..E901' },
          { id: 'MP-9462', route: 'Kadıköy → Ataşehir', fare: '220,00 ₺', hash: '7C31..B204' },
        ].map((item) => (
          <div key={item.id} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{item.id}</span>
              <span className="text-emerald-400 font-bold tabular-nums">{item.fare}</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-sans">{item.route}</div>
            <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-900">
              <span>Komisyon: 0,00 ₺ (%0)</span>
              <span>SHA256: {item.hash}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Tüm seferlerde M0 Sıfır Komisyon mührü doğrulandı.</span>
        </div>
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      </div>
    </div>
  ),
};
