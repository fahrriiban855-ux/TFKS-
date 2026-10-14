import React from 'react';
import { AlertTriangle, FileCheck, ShieldAlert, Clock } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K13_FieldIncidentAccidentReportScreen: WireframeScreen = {
  id: 'K-13',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 13 / 15',
  title: 'Sürücü Bildirimleri, Belge Yenileme Uyarıları & Ceza Tebliğ Kutusu',
  subtitle: 'SINIF-07 Tebliğli Ceza Onayı (%25 İndirim Sayacı) ve Saha Kaza/Arıza Bildirimi',
  userGoal:
    'Plakaya gelen trafik cezalarını inceleyip tebliğ onayı vermek veya kanıtlı itiraz açmak; belge yenileme sürelerini takip etmek.',
  triggerAction:
    'Sürücü "Ceza Tebliğ & Saha Bildirimleri" ekranını açar ➔ Tebliğ bekleyen cezaları ve 15 günlük indirim sayacını görür.',
  uxHighlights: [
    'A10 & B16 Tebliğ Koruması: Sürücü uygulama içinden tebliği onaylamadan (acknowledgedByCourier == true) cariye borç yazılamaz',
    '15 Günlük %25 Erken Ödeme İndirim Sayacı: İndirim süresini kaçırmamak için geri sayım',
    'Kanıtlı İtiraz Hakkı: O saatte aracın kendisinde olmadığını zimmet loguyla kanıtlama',
    'Belge Geçerlilik Erken Uyarısı: Sigorta veya muayene bitimine 15 gün kala otomatik bildirim',
  ],
  securityRule:
    'acknowledgedByCourier == false olan hiçbir trafik cezası sürücü hakedişinden re’sen kesilemez (422 PENALTY_NOT_ACKNOWLEDGED).',
  apiEndpoint: 'POST /api/v1/driver/penalties/:id/acknowledge',
  apiPayload: JSON.stringify(
    {
      penalty_id: 'ceza-101',
      driver_id: 'kurye-1',
      plate: '34 BLY 717',
      amount_tl: 1506.0,
      discounted_amount_tl: 1129.5,
      acknowledged_by_courier: true,
      timestamp: '2026-10-14T09:30:00Z',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#F59E0B', '#EF4444', '#10B981', '#090D16'],
    touchTarget: '48pt x 48pt Buttons',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Ceza saatinde araç başka sürücüye zimmetliyse: Sistem otomatik olarak zimmet çakışma uyarısı verir ve cezayı doğru zimmet sahibine yönlendirir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Ceza Tebliğ &amp; Uyarı Kutusu</h3>
              <span className="text-[10px] text-zinc-400 font-mono">SINIF-07 · TEBLİĞ ZORUNLU</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            1 Bekleyen
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Trafik Cezası #101 (EDS Hız)</span>
            <span className="font-mono text-amber-400 text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3" /> 11 Gün Kaldı
            </span>
          </div>
          <div className="text-[10px] text-zinc-400">
            Beşiktaş Barbaros Blv. · Plaka: 34 BLY 717
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-zinc-900 font-mono text-[11px]">
            <span className="text-zinc-400 line-through">1.506,00 ₺</span>
            <span className="text-emerald-400 font-bold">%25 İndirimli: 1.129,50 ₺</span>
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-[10px] text-zinc-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Onayınız olmadan hakedişinizden otomatik kesinti yapılamaz (Kural B16).</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
        <div className="py-2.5 bg-zinc-900 border border-zinc-700 text-white font-bold text-center rounded-xl text-[11px]">
          Kanıtlı İtiraz Et
        </div>
        <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Tebliği Onayla</span>
        </div>
      </div>
    </div>
  ),
};
