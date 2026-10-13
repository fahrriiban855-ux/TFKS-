import React from 'react';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  X,
  FileText,
  CreditCard,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const C13_CancellationFeeReasonScreen: WireframeScreen = {
  id: 'C-13',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 13 / 14',
  title: 'Gerekçeli İptal & Cayma Bedeli Şeffaflık Şeması',
  subtitle: 'Kurye Emeğini Koruyan 2 Dakika Kuralı ve Cayma Bedeli Bilgilendirmesi',
  userGoal:
    'Sürüş veya kurye çağrısını geçerli bir gerekçe belirterek iptal etmek; kurye adrese vardığında keyfi iptal durumundaki 35 ₺ cayma bedeli şartlarını şeffafça bilmek.',
  triggerAction:
    'Yolcu aktif sefer kartındaki "Seferi İptal Et" butonuna dokunur ➔ Gerekçe seçim modalı ve cayma bedeli koşulları açılır.',
  uxHighlights: [
    '2 Dakika Kuralı: Çağrı kabul edildikten sonraki ilk 2 dakika içinde yapılan iptaller tamamen ücretsizdir',
    'Sürücü Yakıtı & Emek Koruma Bedeli (35 ₺): Kurye adrese vardıktan sonraki iptallerde sürücünün cüzdanına yansıtılır',
    'Gerekçe Seçim Listesi: "Kurye gecikti (+5 dk)", "Yanlış konum girdim", "Acil işim çıktı"',
    'Kurye Kusuru Koruması: Kurye gecikmesinden kaynaklanan iptallerde yolcudan asla cayma bedeli kesilmez',
  ],
  securityRule:
    'İptal gerekçesi ve GPS koordinatı immutable audit log olarak kaydedilir; suistimal eden hesaplara geçici çağrı blokajı uygulanır.',
  apiEndpoint: 'POST /api/v1/ride/cancel',
  apiPayload: JSON.stringify(
    {
      ride_id: 'BLS-9481',
      cancel_reason: 'driver_delayed_more_than_5_minutes',
      elapsed_seconds_since_accept: 420,
      driver_distance_meters: 850,
      cancellation_fee_applied: false,
      fee_amount: 0,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 13px Regular / SF Pro Display 15px Bold / JetBrains Mono 11px',
    colors: ['#EF4444', '#F59E0B', '#0F172A', '#10B981'],
    touchTarget: '48pt x 48pt Action Buttons',
    elevation: 'Rose Alert Border (border-rose-500/50 shadow-2xl)',
  },
  edgeCases: [
    'Kurye 5 dakikadan fazla geciktiyse: Sistem cayma bedelini sıfırlar ve kurye performans puanını düşürür.',
    'Yolcu peş peşe 3 kez iptal yaparsa: 1 saatlik soğuma periyodu başlatılır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center text-lg shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Yolculuğu İptal Et</h3>
              <span className="text-[10px] text-zinc-400 font-mono">Gerekçe ve Politika</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            Sefer: BLS-9481
          </span>
        </div>
      </div>

      {/* Reason Selection */}
      <div className="space-y-2.5 py-2">
        <p className="text-zinc-300 text-[11px]">
          Lütfen iptal gerekçenizi seçiniz. Geri bildiriminiz sürücü eşleşme kalitemizi artırır:
        </p>

        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 bg-zinc-900 border border-white rounded-xl flex items-center gap-2 text-white font-medium">
            <div className="w-3 h-3 rounded-full bg-white ring-2 ring-zinc-400" />
            <span>Kurye çok gecikti (+5 dakika)</span>
          </div>

          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center gap-2 text-zinc-400">
            <div className="w-3 h-3 rounded-full border border-zinc-600" />
            <span>Yanlış biniş veya iniş adresi girdim</span>
          </div>

          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center gap-2 text-zinc-400">
            <div className="w-3 h-3 rounded-full border border-zinc-600" />
            <span>Planım değişti / Acil işim çıktı</span>
          </div>
        </div>

        {/* Policy Explanation Box */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-[11px] text-zinc-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <ShieldAlert className="w-4 h-4 shrink-0 text-zinc-300" />
            <span>Şeffaf Cayma Bedeli Politikası</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            İlk 2 dakika içindeki iptaller ücretsizdir. Kurye adrese vardıktan sonra yapılan keyfi iptallerde sürücünün yakıt ve amortismanı için 35 ₺ cayma bedeli yansıtılır.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="grid grid-cols-2 gap-2">
          <div className="py-2.5 bg-zinc-900 text-zinc-300 font-bold text-center rounded-xl text-xs border border-zinc-800">
            Vazgeç (Sürüşe Dön)
          </div>
          <div className="py-2.5 bg-white text-black font-black text-center rounded-xl text-xs shadow-lg">
            İptali Onayla
          </div>
        </div>
      </div>
    </div>
  ),
};
