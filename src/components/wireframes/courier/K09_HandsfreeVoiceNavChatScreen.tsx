import React from 'react';
import {
  Mic,
  Headphones,
  ShieldAlert,
  Volume2,
  Phone,
  Radio,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const K09_HandsfreeVoiceNavChatScreen: WireframeScreen = {
  id: 'K-09',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 09 / 09',
  title: 'Kurye Eldiven Uyumlu Sürüş HUD & Hands-Free Telsiz İletişimi',
  subtitle: 'Kask İnterkomu TTS Sesli Okuma, Bas-Konuş Telsiz ve Sürüş Güvenlik Kilidi',
  userGoal:
    'Sürüş esnasında motosikleti durdurmak zorunda kalmadan, eldivenle tek dokunuşla veya kask mikrofonu ile yolcuya anında bilgi vermek.',
  triggerAction:
    'Yolcudan yeni mesaj gelir ➔ Kask interkomunda sesli çalınır ➔ Kurye Bas-Konuş (PTT) veya 56px dev butonla yanıt verir.',
  uxHighlights: [
    'Bluetooth Kask İnterkomu Entegrasyonu (Sena / Cardo / Interphone uyumlu A2DP/HFP profili)',
    'Sürüş Güvenlik Kilidi: Hareket halinde serbest klavye kilitlenir, dikkat dağınıklığı ve kaza riski %100 önlenir',
    'Bas-Konuş (PTT) Telsiz: Gidondaki veya ekrandaki tek dev butona basılı tutarak 4 saniyelik sesli not gönderme',
    '6’lı Taktik Dev Dokunmatik Yanıt Matrisi: "2 Dk İçinde Oradayım", "Konumdayım", "Kask Hazır", "Kapıdayım"',
    'Sanal Santral VoIP: 0850 Blesyum maskeli santral üzerinden eller serbest (hands-free) telefon görüşmesi',
  ],
  securityRule:
    'Karayolları Trafik Kanunu Madde 73 ve Uluslararası ECE 22.06 kask güvenlik standardı gereğince sürüş esnasında klavye girişi engellenir.',
  apiEndpoint: 'POST /api/v1/courier/intercom/voice-ptt',
  apiPayload: JSON.stringify(
    {
      ride_id: 'BLS-9481',
      courier_id: 'kurye-1',
      audio_format: 'opus_48khz',
      duration_sec: 3.8,
      speed_kmh: 42,
      hands_free_profile: 'bluetooth_hfp_v1.8',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'JetBrains Mono 14px Bold / SF Pro Display 18px Heavy',
    colors: ['#10B981', '#0066FF', '#F59E0B', '#EF4444'],
    touchTarget: '64pt x 56pt Glove-Friendly Touch Targets',
    elevation: 'High-Contrast Cockpit Dark (bg-[#050B14] ring-2 ring-emerald-500/50)',
  },
  edgeCases: [
    'Sürat 15 km/s üzerindeyse: Ekran otomatik olarak "Telsiz ve Hazır Yanıt HUD" moduna kilitlenir.',
    'Kask kulaklığı bağlı değilse: Telefonun üst hoparlöründen otomatik yüksek sesli (Hands-free Car Mode) okuma devreye girer.',
    'Yolcu anlaşılmayan uzun bir metin atarsa: Yapay zekâ metni 5 kelimelik özet haline getirip kaska fısıldar.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden font-sans">
      {/* Top Cockpit Telemetry Bar */}
      <div className="space-y-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-xs shadow-lg">
              HUD
            </div>
            <div>
              <span className="text-xs font-black text-white font-mono">BLS-COCKPIT · SÜRÜŞ İLETİŞİMİ</span>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Kask Bluetooth Aktif (Cardo Freecom 4+)</span>
              </div>
            </div>
          </div>

          <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1">
            <Radio className="w-3 h-3 animate-spin" />
            <span>42 KM/S</span>
          </div>
        </div>

        {/* Live TTS Alert Card */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Kask İnterkomunda Sesli Okundu:
            </span>
            <span className="text-xs font-bold text-white truncate block">
              "Bedirhan: Çarşı köşesinde bekliyorum, siyah montluyum."
            </span>
          </div>
        </div>
      </div>

      {/* Glove-Friendly Big Tactical Reply Matrix (56px touch target buttons) */}
      <div className="space-y-2 my-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <span>Eldivenle Tek Dokunuşlu Yanıtlar</span>
          </span>
          <span className="text-[10px] font-mono text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
            OTO-İLETİM
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-2xl text-left text-white shadow-lg transition-colors flex items-center gap-2">
            <span className="text-base">🛵</span>
            <div className="min-w-0">
              <span className="block leading-tight text-[11px]">2 Dk İçinde Oradayım</span>
              <span className="text-[9px] text-zinc-400 font-mono">Trafik Akıcı</span>
            </div>
          </button>

          <button className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-2xl text-left text-white shadow-lg transition-colors flex items-center gap-2">
            <span className="text-base">📍</span>
            <div className="min-w-0">
              <span className="block leading-tight text-[11px]">Konuma Vardım</span>
              <span className="text-[9px] text-zinc-400 font-mono">Dörtlüler Açık</span>
            </div>
          </button>

          <button className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-2xl text-left text-white shadow-lg transition-colors flex items-center gap-2">
            <span className="text-base">🪖</span>
            <div className="min-w-0">
              <span className="block leading-tight text-[11px]">Kask & Bone Hazır</span>
              <span className="text-[9px] text-zinc-400 font-mono">Dezenfekte Edildi</span>
            </div>
          </button>

          <button className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-2xl text-left text-white shadow-lg transition-colors flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <div className="min-w-0">
              <span className="block leading-tight text-[11px]">Sağ Kaldırımda Bekleyin</span>
              <span className="text-[9px] text-zinc-400 font-mono">Güvenli Nokta</span>
            </div>
          </button>
        </div>
      </div>

      {/* Giant Push-to-Talk (PTT) Walkie Talkie & Safety Lock Strip */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        {/* Anti-Distraction Warning */}
        <div className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] text-zinc-300 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>SÜRÜŞ GÜVENLİK KİLİDİ AKTİF (Klavye Kilitli)</span>
          </div>
          <span className="text-[9px] text-zinc-500">ECE 22.06</span>
        </div>

        {/* Big PTT Radio Button */}
        <div className="flex items-center gap-2">
          <button className="flex-1 py-3.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2.5 active:scale-95 transition-all">
            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center animate-pulse">
              <Mic className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="tracking-wider">BAS-KONUŞ TELSİZ (PTT)</span>
          </button>

          <button className="p-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-2xl flex items-center justify-center shadow-lg" title="Maskeli Santral Arama">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ),
};
