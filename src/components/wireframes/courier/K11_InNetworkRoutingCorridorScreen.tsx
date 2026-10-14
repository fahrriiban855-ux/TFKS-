import React from 'react';
import { Compass, Calendar, Target, Navigation } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K11_InNetworkRoutingCorridorScreen: WireframeScreen = {
  id: 'K-11',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 11 / 15',
  title: 'Vardiya Planlama, Ağ İçi Koridor Yönlendirme & Dinamik Görev (DriverQuest)',
  subtitle: 'Eve Dönüş Koridoru Filtresi, Haftalık Vardiya Seçimi ve Hedef Teslimat Primleri',
  userGoal:
    'Boş dönüş kilometresini sıfırlamak için eve dönüş veya tercih edilen koridor yönlendirmesini açmak ve haftalık vardiya/görev hedeflerini takip etmek.',
  triggerAction:
    'Kurye "Koridor & Vardiya Planla" ekranını açar ➔ Hedef koridoru seçer ve aktif görev ilerlemesini görüntüler.',
  uxHighlights: [
    'Ağ İçi Koridor Yönlendirme: Kuryenin seçtiği istikamete (örn. Kadıköy / Anadolu Yakası) giden paketleri önceliklendirir',
    'Boş Dönüş (Deadhead KM) Önleme: Dönüş yolunda %34 yakıt ve zaman tasarrufu sağlar',
    'Dinamik Görev (DriverQuest) Çubuğu: Tamamlanan paket sayısına göre ek teşvik takibi',
    'SINIF-04 Vardiya Koruması: Üzerinde açık sipariş olan sürücünün vardiyasını yanlışlıkla kapatmasını engeller',
  ],
  securityRule:
    'Açık siparişi (IN_PROGRESS / ACCEPTED) bulunan sürücü vardiyasını sonlandıramaz (409 ACTIVE_ORDER_EXISTS).',
  apiEndpoint: 'POST /api/v1/driver/shifts/corridor-routing',
  apiPayload: JSON.stringify(
    {
      driver_id: 'kurye-1',
      corridor_mode: 'HOMEBOUND_FILTER',
      target_corridor: 'Beşiktaş -> Kadıköy (Boğaz Hattı)',
      active_quest: {
        quest_id: 'Q-WEEKEND-12',
        completed: 9,
        target: 12,
        bonus_tl: 450,
      },
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Plus Jakarta Sans 14px Bold / JetBrains Mono 11px SemiBold',
    colors: ['#2563EB', '#10B981', '#F59E0B', '#090D16'],
    touchTarget: '48pt x 48pt Controls',
    elevation: 'Single-Elevation Card (border-zinc-800)',
  },
  edgeCases: [
    'Seçilen koridorda 10 dk boyunca çağrı çıkmazsa: Kuryeye komşu koridor önerisi sunulur.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 font-sans">
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Ağ İçi Koridor &amp; Vardiya</h3>
              <span className="text-[10px] text-zinc-400 font-mono">BOŞ DÖNÜŞ ÖNLEME MOTORU</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
            Aktif
          </span>
        </div>
      </div>

      <div className="space-y-2.5 my-2">
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hedef Koridor Yönü</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Eşleşme Açık</span>
          </div>
          <div className="text-xs font-bold text-white">Levent · Beşiktaş → Kadıköy Moda</div>
          <div className="text-[10px] text-zinc-400">
            Yalnızca dönüş güzergahınız üzerindeki bireysel ve işletme paketleri teklif edilir.
          </div>
        </div>

        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Günlük Görev Hedefi (9 / 12 Sefer)</span>
            </span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">+450 ₺</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-emerald-500 rounded-full" />
          </div>
          <div className="text-[10px] text-zinc-400">3 teslimat sonra görev ödülü hakedişinize eklenir.</div>
        </div>
      </div>

      <div className="py-2.5 bg-white text-black font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        <span>Koridor ve Vardiya Tercihini Kaydet</span>
      </div>
    </div>
  ),
};
