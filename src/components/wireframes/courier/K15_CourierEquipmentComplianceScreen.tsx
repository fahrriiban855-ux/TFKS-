import React from 'react';
import { Package, RotateCcw, ShieldAlert, PhoneCall, Clock } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K15_CourierEquipmentComplianceScreen: WireframeScreen = {
  id: 'K-15',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 15 / 15',
  title: 'Saha Acil Durum (SOS), Kaza/Hasar Bildirimi & Alıcıya Ulaşılamadı İade Protokolü',
  subtitle: '10 Dakika Bekleme + 3 Arama Kanıtlı İade (RETURN_IN_PROGRESS) ve Ekipman/Hasar Kaydı',
  userGoal:
    'Alıcı adreste bulunamadığında 10 dakika bekleme ve 3 maskeli arama kanıtıyla güvenli iade akışını başlatmak veya saha kaza/ekipman durumunu bildirmek.',
  triggerAction:
    'Kurye teslimat noktasında alıcıya ulaşamadığında "Alıcıya Ulaşılamadı / İade Protokolü" ekranını açar.',
  uxHighlights: [
    'Kanıtlı İade Kilidi: 10 dakika bekleme sayacı ve en az 3 maskeli arama kaydı tamamlanmadan keyfi iade başlatılamaz',
    'RETURN_IN_PROGRESS -> RETURNED Akışı: İade tesliminde gönderici işletmeden/müşteriden 4 haneli iade PIN kodu alınır',
    'B8 Aktif Siparişte Blokaj Koruması: Üzerinde aktif paket bulunan kurye iş tamamlanmadan sistemce kilitlenemez',
    'Saha Kaza / Hasar Fotoğraf Raporlama: SINIF-09 ekspertiz masasına anında iletim',
  ],
  securityRule:
    'waitTimerSeconds < 600 veya callAttemptsCount < 3 iken POST /initiate-return çağrısı 422 RETURN_PRECONDITIONS_NOT_MET ile reddedilir.',
  apiEndpoint: 'POST /api/v1/orders/:id/initiate-return',
  apiPayload: JSON.stringify(
    {
      order_id: 'MP-9481',
      courier_id: 'kurye-1',
      wait_duration_seconds: 615,
      masked_call_attempts: 3,
      door_photo_url: 'https://storage.motopilot.com.tr/pod/return-9481.jpg',
      next_status: 'RETURN_IN_PROGRESS',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#F59E0B', '#EF4444', '#10B981', '#090D16'],
    touchTarget: '48pt x 48pt Glove-Friendly Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Alıcı 9. dakikada kapıyı açarsa: İade sayacı iptal edilir ve standart 4 haneli deliveryCode ile teslimat tamamlanır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">İade &amp; Saha Acil Protokolü</h3>
              <span className="text-[10px] text-zinc-400 font-mono">FLOW-08 · KANITLI İADE</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Kanıt Tamam
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2 text-xs">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kapıda Bekleme Süresi:</span>
            </span>
            <span className="text-emerald-400 font-bold tabular-nums">10:15 dk ✓</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>0850 Maskeli Arama Kanıtı:</span>
            </span>
            <span className="text-emerald-400 font-bold tabular-nums">3 / 3 Arama ✓</span>
          </div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>İade Güzergahı: Gönderici Şubeye Dönüş</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Paket göndericiye teslim edildiğinde 4 haneli iade PIN kodu ile tutanak kapatılır.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
        <div className="py-2.5 bg-red-600 text-white font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SOS / Kaza</span>
        </div>
        <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-[11px] flex items-center justify-center gap-1">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>İadeyi Başlat</span>
        </div>
      </div>
    </div>
  ),
};
