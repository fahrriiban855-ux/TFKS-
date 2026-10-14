import React from 'react';
import { Upload, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WireframeScreen } from '../types';

export const B04_B2BExternalOrderWebhookScreen: WireframeScreen = {
  id: 'B-04',
  category: 'business',
  categoryLabel: 'İşletme SaaS Portalı',
  stepNumber: 'EKRAN 04 / 06',
  title: 'Ücretsiz Tanışma Sayacı, Haftalık Sabit Üyelik & Havale/EFT Dekont Bildirimi',
  subtitle: 'Habersiz Otomatik Kart Çekimi Yasağı, Haftalık Plan Seçimi ve MANUAL_APPROVAL Dekont Akışı',
  userGoal:
    'Ücretsiz tanışma süresi (FREE_INTRO) dolduğunda haftalık sabit paketi seçmek ve banka Havale/EFT referans koduyla (wire_reference_code) ödeme bildirimi göndermek.',
  triggerAction:
    'İşletme "Abonelik & Havale/EFT Bildirimi" ekranında banka dekontunu ve referans kodunu girip Admin onayına gönderir.',
  uxHighlights: [
    'Habersiz Otomatik Çekim Yasağı: Tanışma süresi bittiğinde karttan otomatik para çekilmez; durum PLAN_SELECTION_REQUIRED olur',
    'Havale/EFT Referans Kodu (wire_reference_code): Banka dekont numarası ile PAYMENT_PENDING kaydı açılır',
    'Admin MANUAL_APPROVAL Masası: A-03 ekranında yönetici @Version iyimser kilidiyle onayladığında 7 günlük ACTIVE_MEMBERSHIP başlar',
    'B2B Dış Sipariş Webhook Entegrasyonu: Aktif üyelikte Yemeksepeti/Getir/Trendyol/POS siparişleri %0 komisyonla çekilir',
  ],
  securityRule:
    'Aynı wire_reference_code ikinci kez kullanılamaz; Admin onayı @Version kontrolüyle yarış durumuna (race condition) karşı korunur.',
  apiEndpoint: 'POST /api/v1/business/subscriptions/wire-notice',
  apiPayload: JSON.stringify(
    {
      notice_id: 'WIRE-2026-5520',
      business_id: 'biz-nisantasi-01',
      plan_code: 'WEEKLY_PRO_750',
      amount_tl: 750.0,
      wire_reference_code: 'TR-EFT-20261014-5520',
      receipt_file: 'isbank_dekont_750tl.pdf',
      approval_status: 'PENDING',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#2563EB', '#10B981', '#F59E0B', '#090D16'],
    touchTarget: '44px x 44px Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Yoldaki aktif siparişler: Tanışma süresi tam sipariş ortasında dolsa bile yoldaki paketler asla iptal edilmez.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Haftalık Üyelik &amp; EFT Bildirimi</h3>
              <span className="text-[10px] text-zinc-400 font-mono">FLOW-14 · MANUAL_APPROVAL</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            PAYMENT_PENDING
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1 font-mono">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-sans">Seçilen Paket:</span>
            <span className="text-white font-bold">Haftalık Sabit (750,00 ₺)</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-sans">EFT Referans Kodu:</span>
            <span className="text-emerald-400 font-bold">TR-EFT-20261014-5520</span>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span>Sipariş Başı Komisyon:</span>
            <span className="text-emerald-400">0,00 ₺ (%0)</span>
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-2 text-[10px] text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Otomatik kredi kartı çekimi yoktur. Dekontunuz Admin onayından sonra 7 gün üyelik açar.</span>
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <Upload className="w-4 h-4" />
        <span>Dekontu Admin Onayına Gönder</span>
      </div>
    </div>
  ),
};
