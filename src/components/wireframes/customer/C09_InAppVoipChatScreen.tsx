import React from 'react';
import {
  MessageCircle,
  Phone,
  ShieldCheck,
  Mic,
  Send,
  Volume2,
  Lock,
  Headphones,
  CheckCheck,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const C09_InAppVoipChatScreen: WireframeScreen = {
  id: 'C-09',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 09 / 09',
  title: '24 Saatlik Özel ve Uçtan Uca Şifreli İletişim',
  subtitle: 'Kimseyle Paylaşılmayan, 24 Saat Sonra Kendini İmha Eden Özel Sohbet ve VoIP',
  userGoal:
    'Sürücüyle tamamen gizli, uçtan uca şifreli iletişim kurmak. Konuşmaların kimseyle paylaşılmayacağını ve 24 saat sonra kalıcı olarak silineceğini bilerek güvenle mesajlaşmak.',
  triggerAction:
    'Yolcu veya sürücü sohbeti açtığında 24 saatlik geçici E2EE şifreli oturum başlar.',
  uxHighlights: [
    'Uçtan Uca Şifreleme (E2EE - AES-256-GCM): Konuşmalar tamamen özeldir, üçüncü taraflarla ASLA paylaşılmaz.',
    '24 Saatlik Kalıcı İmha Kuralı: Konuşmalar yalnızca 24 saat tutulabilir; 24 saat dolunca her iki taraftan da otomatik silinir.',
    'Maskeli VoIP Santrali: Gerçek GSM numarası gizlenir, arama sanal santral üzerinden bağlanır.',
    'Kask İnterkomu Entegrasyonu: Yolcunun yazdığı metin kuryenin kulaklığına sesli okunur.',
    'Çift Mavi Tik & Dinlendi Bildirimi',
  ],
  securityRule:
    'KVKK ve E2EE Protokolü: Tüm yazışmalar ve sesler şifrelidir. Platform çalışanları dahil kimse içeriği göremez ve 24 saat sonra veritabanından kalıcı olarak silinir.',
  apiEndpoint: 'POST /api/v1/communication/session/initiate',
  apiPayload: JSON.stringify(
    {
      ride_id: 'BLS-9481',
      session_type: 'masked_voip_and_chat',
      caller_role: 'customer',
      receiver_role: 'courier',
      virtual_relay_did: '+908508859481',
      e2e_encryption: 'AES-256-GCM',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 13px Regular / SF Pro Display 15px Bold / JetBrains Mono 11px',
    colors: ['#0066FF', '#10B981', '#0F172A', '#38BDF8'],
    touchTarget: '48pt x 48pt VoIP Action Controls',
    elevation: 'Backdrop Blur 20px (bg-slate-900/98 shadow-2xl)',
  },
  edgeCases: [
    'Sürücü sürüş halindeyse: "Kurye seyir halinde, mesajınız kask interkomuna sesli iletildi" rozeti belirir.',
    'Kötü ağ bağlantısında (2G/Edge): Sistem otomatik olarak SMS maskeleme proxy fall-back moduna geçer.',
    'Sefer tamamlandığında: Mesajlaşma oturumu ve maskeli santral köprüsü 15 dakika içinde kalıcı olarak kapanır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden">
      {/* Top Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold text-white shadow-md">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Mert Aksoy</span>
                <span className="text-[9px] font-bold text-white bg-zinc-900 border border-zinc-700 px-1 rounded">
                  Sürücü
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono font-semibold">
                34 BLY 717 · NMAX 155
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="p-2 bg-zinc-950 border border-zinc-700 text-white rounded-xl flex items-center gap-1 text-[10px] font-bold">
              <Phone className="w-3.5 h-3.5" />
              <span>Maskeli VoIP</span>
            </div>
          </div>
        </div>

        {/* Riding & Helmet Status Strip */}
        <div className="flex items-center justify-between p-2 bg-zinc-950 rounded-xl border border-zinc-800 text-[10px]">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Headphones className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Kurye Sürüş Halinde · Kask İnterkomu Aktif</span>
          </div>
          <span className="text-white font-mono font-bold">0850 885 94 81</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-2.5 py-3 text-xs">
        {/* Security Warning: 24h Encrypted Ephemeral Chat */}
        <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] text-zinc-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="font-semibold text-white">Uçtan Uca Şifreli (E2EE)</span>
            <span className="text-zinc-400 text-[9px]">• Kimseyle Paylaşılmaz</span>
          </div>
          <span className="font-mono text-zinc-300 text-[9px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 font-bold">
            ⏱️ 24 Saat Sonra Silinir
          </span>
        </div>

        {/* Driver Message */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[9px] text-zinc-400 font-bold">Mert Aksoy</span>
            <span className="text-[8px] text-zinc-500 font-mono">09:42</span>
          </div>
          <div className="max-w-[85%] px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none text-zinc-200">
            Merhaba Bedirhan Bey, yola çıktım. Kaskınız ve hijyen bonesi hazırdır. 2 dakikaya oradayım.
          </div>
        </div>

        {/* Customer Text Message */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[9px] text-zinc-400 font-bold">Siz (Yolcu)</span>
            <span className="text-[8px] text-zinc-500 font-mono">09:43</span>
          </div>
          <div className="max-w-[85%] px-3 py-2 bg-white text-black font-medium rounded-2xl rounded-tr-none shadow-md">
            Harika, Beşiktaş Çarşı köşesinde bekliyorum. Siyah montluyum.
          </div>
          <div className="flex items-center gap-1 text-[8px] text-zinc-400 mt-0.5 font-bold">
            <Volume2 className="w-2.5 h-2.5" />
            <span>Kasktan Sesli Dinlendi ✓✓</span>
          </div>
        </div>

        {/* Driver Voice Memo */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[9px] text-white font-bold">Mert Aksoy (Telsiz Sesli Notu)</span>
            <span className="text-[8px] text-zinc-500 font-mono">09:43</span>
          </div>
          <div className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-2xl rounded-tl-none text-zinc-200 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
              ▶
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-5 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-2 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <span className="text-[9px] text-zinc-300 font-mono">0:04 · "Dörtlüleri yaktım, sağdayım"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="py-2 flex gap-1.5 overflow-x-auto text-[10px]">
        {['📍 Alış noktasındayım', '🪖 Kaskım var', '🎒 Sırt çantam var', '🚨 Dörtlüleri yakar mısınız?'].map(
          (chip, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 whitespace-nowrap"
            >
              {chip}
            </span>
          )
        )}
      </div>

      {/* Input Bar */}
      <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-800">
          <Mic className="w-4 h-4" />
        </button>
        <input
          type="text"
          placeholder="Sürücüye mesaj ilet (Kaskında okunur)..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
          readOnly
          value="Alış noktasındayım, sizi görüyorum."
        />
        <button className="w-9 h-9 rounded-xl bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-lg transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  ),
};
