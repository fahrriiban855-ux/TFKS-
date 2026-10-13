import React from 'react';
import {
  FileText,
  Download,
  Building,
  CheckCircle2,
  Receipt,
  Percent,
  ShieldCheck,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const C14_CorporateInvoiceReceiptScreen: WireframeScreen = {
  id: 'C-14',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 14 / 14',
  title: 'Kurumsal Masraf Profili & Resmi E-Arşiv Fatura Belgesi Şeması',
  subtitle: '10 Haneli VKN/11 Haneli TCKN Doğrulaması ve Maliye Uyumlu PDF E-Arşiv Fatura',
  userGoal:
    'İş için yapılan motosiklet ve motokurye harcamalarını şirket adına faturalandırmak, GİB onaylı e-Arşiv faturayı anında PDF olarak indirmek.',
  triggerAction:
    'Yolcu sefer bitiminde veya profilinde "E-Arşiv Fatura İndir" butonuna dokunur ➔ Şirket unvanı, VKN ve KDV dökümlü makbuz ekranı açılır.',
  uxHighlights: [
    'VKN (10 hane) & TCKN (11 hane) Format Doğrulama: Hatalı veya eksik vergi numarası girişini engelleyen validasyon kalkanı',
    'GİB Uyumlu E-Arşiv Belgesi: Fatura No, Tarih/Saat, KDV matrahı (%20) ve güzergah dökümü',
    'Tek Tıkla PDF İndirme & Muhasebeye E-Posta ile Gönderme',
    'Bahşiş ve Sefer Ücreti Ayrımı: Şirket giderine uygun şeffaf maliyet kalemleri',
  ],
  securityRule:
    'Fatura verileri Gelir İdaresi Başkanlığı (GİB) e-Fatura entegratörü üzerinden mali mühürle imzalanır ve 10 yıl saklanır.',
  apiEndpoint: 'POST /api/v1/billing/e-archive/generate',
  apiPayload: JSON.stringify(
    {
      ride_id: 'BLS-9481',
      invoice_no: 'BLS-2026-9481',
      company_name: 'Blesyum Teknoloji ve Yazılım Ltd. Şti.',
      tax_office: 'Beşiktaş V.D.',
      tax_number: '1780492190',
      total_fare: 155,
      tax_amount: 25.83,
      currency: 'TRY',
      pdf_url: 'https://cdn.blesyum.com/invoices/BLS-2026-9481.pdf',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'SF Pro Display 15px Bold / Inter 12px Regular / JetBrains Mono 11px Bold',
    colors: ['#0066FF', '#10B981', '#0F172A', '#38BDF8'],
    touchTarget: '48pt x 48pt Action Buttons',
    elevation: 'Blue Card Glow (border-blue-500/40 shadow-2xl)',
  },
  edgeCases: [
    'Şirket bilgisi girilmediyse: Fatura yolcunun ad-soyad ve T.C. Kimlik Numarasına bireysel e-arşiv olarak düzenlenir.',
    'VKN geçersizse: Sistem anında kırmızı hata vererek kurumsal kaydetmeyi durdurur.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center text-lg shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Resmi E-Arşiv Faturası</h3>
              <span className="text-[10px] text-zinc-400 font-mono">GİB Onaylı Elektronik Fatura</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-300 font-bold bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
            Mühürlü ✓
          </span>
        </div>
      </div>

      {/* Invoice Document Card */}
      <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-zinc-400 text-[11px]">
          <span>Fatura No:</span>
          <strong className="text-white">BLS-2026-9481</strong>
        </div>

        <div className="flex justify-between text-zinc-400 text-[11px]">
          <span>Düzenleme Tarihi:</span>
          <span className="text-white">03.10.2026 · 17:30</span>
        </div>

        <div className="pt-1.5 border-t border-zinc-850 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-sans">
            Alıcı / Müşteri Bilgileri
          </span>
          <div className="text-white font-bold font-sans text-xs">
            Blesyum Teknoloji ve Yazılım Ltd. Şti.
          </div>
          <div className="text-zinc-400 text-[10px]">
            Beşiktaş V.D. · VKN: 1780492190
          </div>
        </div>

        <div className="pt-1.5 border-t border-zinc-850 space-y-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-sans">
            Sefer & Güzergah Kalemleri
          </span>
          <div className="flex justify-between text-zinc-300 text-[11px] font-sans">
            <span>Beşiktaş İskele → Levent Kanyon</span>
            <span className="font-mono text-white">155,00 ₺</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[10px]">
            <span>Hesaplanan KDV (%20):</span>
            <span className="font-mono text-zinc-300">25,83 ₺</span>
          </div>
        </div>

        <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-800">
          <span className="font-sans">Genel Toplam:</span>
          <span className="font-mono">155,00 ₺</span>
        </div>
      </div>

      {/* Trust & Action */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Faturanız muhasebe ve maliye kayıtlarınız için resmi tevsik edici belgedir.</span>
        </div>

        <div className="py-2.5 bg-white text-black font-black text-center rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg">
          <Download className="w-4 h-4" />
          <span>PDF Faturayı İndir</span>
        </div>
      </div>
    </div>
  ),
};
