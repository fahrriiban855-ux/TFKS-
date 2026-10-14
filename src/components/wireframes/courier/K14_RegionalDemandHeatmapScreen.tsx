import React from 'react';
import { Flame, FileCheck, MapPin, Volume2 } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K14_RegionalDemandHeatmapScreen: WireframeScreen = {
  id: 'K-14',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 14 / 15',
  title: 'Bölgesel Yoğunluk Isı Haritası, Sürücü Profil & Belge Geçerlilik Ekranı',
  subtitle: 'Canlı Çağrı Yoğunluğu Bölgeleri, 6 Evraklı KYC Geçerlilik Rozetleri ve Sesli Navigasyon',
  userGoal:
    'Hangi ilçede taksi ve paket talebinin yüksek olduğunu ısı haritasında görmek ve 6 zorunlu KYC belgesinin son geçerlilik tarihlerini kontrol etmek.',
  triggerAction:
    'Sürücü "Bölge Yoğunluğu & Belgelerim" sekmesini açar ➔ İlçe bazlı talep yoğunluğu ve belge durumları listelenir.',
  uxHighlights: [
    'Canlı Bölgesel Talep Matrisi: Beşiktaş, Kadıköy, Şişli ve Maslak koridorlarındaki anlık paket/taksi talebi',
    'Hibrit Kapasite Önerisi: Paket talebi yüksek bölgede boş bekleyen sürücüye tek tıkla kurye moduna geçiş önerisi',
    '6 Evraklı KYC Geçerlilik Takibi: Ehliyet, ruhsat, trafik sigortası ve adli sicil onay rozetleri',
    'Kask İçi Sesli Okuma (TTS) Tercihi: Sürüş esnasında bildirimlerin sesli okunması ayarı',
  ],
  securityRule:
    'Belge geçerlilik tarihi dolan sürücünün çevrim içi olma yetkisi sunucu tarafında otomatik olarak askıya alınır.',
  apiEndpoint: 'GET /api/v1/driver/heatmap-and-documents',
  apiPayload: JSON.stringify(
    {
      driver_id: 'kurye-1',
      hot_zones: [
        { zone: 'Beşiktaş - Levent', demand_index: 94, avg_wait_sec: 45 },
        { zone: 'Kadıköy - Moda', demand_index: 88, avg_wait_sec: 60 },
      ],
      documents_valid: true,
      next_expiry_date: '2027-04-15',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px Tabular',
    colors: ['#10B981', '#F59E0B', '#2563EB', '#090D16'],
    touchTarget: '48pt x 48pt Controls',
    elevation: 'Single-Elevation Surface (border-zinc-800)',
  },
  edgeCases: [
    'Sigorta bitimine 15 günden az kaldığında: Sarı yenileme uyarısı gösterilir; süre dolduğunda kırmızı blokaj devreye girer.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Yoğunluk &amp; Belgelerim</h3>
              <span className="text-[10px] text-zinc-400 font-mono">CANLI TALEP RADARI</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            6/6 Belge Tamam
          </span>
        </div>
      </div>

      <div className="space-y-2 my-2 text-xs">
        {[
          { zone: 'Beşiktaş · Levent Hattı', load: 'Çok Yüksek (+18 Çağrı)', wait: '45 sn' },
          { zone: 'Kadıköy · Moda Koridoru', load: 'Yüksek (+12 Paket)', wait: '1 dk' },
        ].map((z) => (
          <div key={z.zone} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{z.zone}</span>
              </div>
              <span className="text-[10px] text-zinc-400">{z.load}</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-400 tabular-nums">{z.wait}</span>
          </div>
        ))}

        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ehliyet, Ruhsat, Sigorta &amp; Sicil</span>
            </span>
            <span className="font-mono text-emerald-400 text-[10px]">ONAYLI ✓</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-blue-400" /> Kask İçi Sesli Okuma (TTS)
            </span>
            <span className="font-mono text-white">AÇIK</span>
          </div>
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs">
        Yoğun Bölgeye Rota Çiz
      </div>
    </div>
  ),
};
