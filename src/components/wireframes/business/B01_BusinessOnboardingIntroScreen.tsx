import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';
import { WireframeScreen } from '../types';

export const B01_BusinessOnboardingIntroScreen: WireframeScreen = {
  id: 'B-01',
  category: 'business',
  categoryLabel: 'İşletme SaaS Portalı',
  stepNumber: 'EKRAN 01 / 06',
  title: 'İşletme Kayıt, VKN/MERSİS Doğrulama & 14 Gün Ücretsiz Tanışma (FREE_INTRO)',
  subtitle: 'Tek Seferlik VKN/IBAN Kampanya Kilidi ve Sipariş Başı %0 Komisyon Aktivasyonu',
  userGoal:
    'İşletme vergi levhası (VKN/TCKN) ve şube adresiyle kayıt olup 14 gün boyunca ücretsiz tanışma kampanyasını (FREE_INTRO) ve %0 sipariş komisyonunu başlatmak.',
  triggerAction:
    'İşletme sahibi VKN ve şube bilgilerini girip "14 Gün Ücretsiz Başlat" butonuna tıklar ➔ VKN tekilliği doğrulanır ve FREE_INTRO başlar.',
  uxHighlights: [
    'KURAL-06 Mükerrer Kampanya Kilidi: Aynı VKN veya IBAN ile ikinci kez ücretsiz tanışma kampanyası açılamaz',
    'Etkin Bitiş Tarihi (effectiveIntroEndDate): Europe/Istanbul (UTC+3) 00:00 sınırına göre 14 tam gün hesaplanır',
    'Kredi Kartı Ön Provizyon Zorunluluğu Yok: Tanışma döneminde kart bilgisi istenmez, otomatik çekim yapılmaz',
    'Sipariş Başı %0 Komisyon: Tüm işletme teslimatlarında platform komisyonu 0.00 ₺ olarak sabitlenir',
  ],
  securityRule:
    'VKN ve IBAN özetleri (SHA-256) sunucuda kontrol edilir; mükerrer başvuru 409 INTRO_ALREADY_USED ile reddedilir.',
  apiEndpoint: 'POST /api/v1/business/register',
  apiPayload: JSON.stringify(
    {
      company_legal_name: 'Nişantaşı Gurme Mutfak & Lojistik A.Ş.',
      tax_office: 'Şişli V.D.',
      tax_number_vkn: '6210489120',
      subscription_status: 'FREE_INTRO',
      effective_intro_end_date: '2026-10-28T00:00:00+03:00',
      order_commission_rate: 0.0,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 15px Bold / JetBrains Mono 11px Tabular',
    colors: ['#2563EB', '#10B981', '#090D16', '#F8FAFC'],
    touchTarget: '44px x 44px SaaS Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Sistemde aktif genel kampanya yoksa: İşletme doğrudan PLAN_SELECTION_REQUIRED durumuna yönlendirilir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Esnaf &amp; İşletme Kayıt</h3>
              <span className="text-[10px] text-zinc-400 font-mono">FLOW-10 · VKN DOĞRULAMA</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            FREE_INTRO
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 font-mono block">TİCARİ UNVAN &amp; VKN</span>
          <div className="font-bold text-white">Nişantaşı Gurme Mutfak A.Ş.</div>
          <div className="text-[10px] text-zinc-400 font-mono">Şişli V.D. · VKN: 6210489120 ✓</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>14 Gün Ücretsiz Tanışma</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">0,00 ₺</span>
          </div>
          <div className="text-[10px] text-zinc-400">
            Bitiş: 28 Ekim 2026 00:00 (Europe/Istanbul). Süre sonunda habersiz otomatik çekim yapılmaz.
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-2 text-[10px] text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Sipariş başı komisyon: %0 (Yalnızca kurye taşıma bedeli).</span>
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-4 h-4" />
        <span>FREE_INTRO Kampanyasını Başlat</span>
      </div>
    </div>
  ),
};
