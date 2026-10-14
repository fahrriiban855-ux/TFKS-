import React from 'react';
import { ShieldCheck, Camera, Gauge, CheckCircle2 } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K12_M0GrossEqualsNetTallyScreen: WireframeScreen = {
  id: 'K-12',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 12 / 15',
  title: 'Araç Zimmet Teslim Alma/Etme, 4 Yönlü Fotoğraf & M0 Brüt=Net Çetelesi',
  subtitle: 'SINIF-03 Zimmet Kilometre Doğrulaması, 4 Yönlü Ekspertiz ve %100 Net Hakediş Çetelesi',
  userGoal:
    'Vardiya başında/sonunda aracı 4 yönlü fotoğrafla ve kilometre kontrolüyle zimmete almak veya teslim etmek ve vardiya boyunca oluşan Brüt = Net (%100) kazanç çetelesini mühürlemek.',
  triggerAction:
    'Sürücü "Zimmet & Vardiya Mutabakatı" ekranından başlangıç/bitiş km değerini girer ve 4 yönlü araç fotoğraflarını onaylar.',
  uxHighlights: [
    'B13 Zimmet Çakışma Kalkanı: Aktif zimmetli araç aynı anda ikinci bir sürücüye atanamaz',
    'Kilometre Manipülasyon Freni: Girilen yeni başlangıç km değeri önceki kapanış km değerinden küçük olamaz',
    '4 Yönlü Fotoğraf Kanıtı: Ön, arka, sağ ve sol kaporta fotoğrafları zaman damgasıyla mühürlenir',
    'M0 Brüt = Net Çetelesi: Vardiya süresince yapılan tüm işlerin %0 kesintili toplamını gösterir',
  ],
  securityRule:
    'newStartKm < previousEndKm durumunda sistem otomatik olarak KM_MANIPULATION_BLOCKAGE üretir ve işlemi durdurur.',
  apiEndpoint: 'POST /api/v1/driver/zimmet/handover',
  apiPayload: JSON.stringify(
    {
      driver_id: 'kurye-1',
      vehicle_plate: '34 BLY 717',
      previous_end_km: 24810,
      reported_start_km: 24890,
      four_side_photos_verified: true,
      helmet_ece2206_verified: true,
      shift_gross_equals_net_tl: 1480.0,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 12px Tabular',
    colors: ['#10B981', '#2563EB', '#F59E0B', '#090D16'],
    touchTarget: '48pt x 48pt Action Buttons',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Önceki kapanış km değerinden düşük km girilirse: 422 KM_ROLLBACK_DETECTED hatası döner ve garaj amiri onayı gerekir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Zimmet &amp; Brüt=Net Çetele</h3>
              <span className="text-[10px] text-zinc-400 font-mono">SINIF-03 · 34 BLY 717</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Zimmet Aktif
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5 font-mono">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400">Önceki Kapanış KM:</span>
            <span className="text-white tabular-nums">24.810 KM</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400">Güncel Bildirilen KM:</span>
            <span className="text-emerald-400 font-bold tabular-nums">24.890 KM (+80)</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
          {['Ön', 'Arka', 'Sağ', 'Sol'].map((side) => (
            <div key={side} className="p-2 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{side} ✓</span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 block">Vardiya Brüt = Net Kazanç (%0 Kesinti)</span>
            <span className="text-sm font-bold font-mono text-white tabular-nums">1.480,00 ₺</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4" />
        <span>Zimmet ve Çeteleyi Mühürle</span>
      </div>
    </div>
  ),
};
