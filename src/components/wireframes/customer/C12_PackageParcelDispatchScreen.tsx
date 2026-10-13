import React from 'react';
import {
  Package,
  Copy,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const C12_PackageParcelDispatchScreen: WireframeScreen = {
  id: 'C-12',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 12 / 14',
  title: 'Paket / Koli Gönderim & 4 Haneli Alıcı Teslimat PIN Kodu Şeması',
  subtitle: 'Evrak, Koli ve Değerli Eşya Taşımacılığı ile Güvenli Teslimat PIN Doğrulaması',
  userGoal:
    'Motosikletli kurye ile İstanbul içi evrak veya koli göndermek, alıcıya otomatik 4 haneli teslimat güvenlik PIN kodu üretip hırsızlık ve kayıp riskini sıfıra indirmek.',
  triggerAction:
    'Müşteri alt menüden "Kurye / Paket" sekmesine dokunur ➔ Paket türü, alıcı telefonu ve koli notu giriş ekranı açılır.',
  uxHighlights: [
    '4 Haneli Alıcı Güvenlik PIN Kodu: Alıcı kuryeye bu kodu ibraz etmeden kurye teslimatı tamamlayamaz',
    'Paket Türü Çipleri: Evrak/Dosya, Koli/Kutu, Anahtar/Değerli Eşya',
    'Tek Tıkla PIN Kopyalama & WhatsApp ile Alıcıya Gönderme',
    'Fotoğraflı Teslimat İspatı (Proof of Delivery): Teslimat anında çekilen kapı/alıcı fotoğrafı',
    'Harita Üzerinde Canlı Kargo Takibi',
  ],
  securityRule:
    'Teslimat PIN Kodu AES-256 şifreli tutulur; kurye terminalinde 3 hatalı denemede çağrı merkezi blokajı tetiklenir.',
  apiEndpoint: 'POST /api/v1/parcel/dispatch',
  apiPayload: JSON.stringify(
    {
      sender_id: 'usr_bedirhan_01',
      package_type: 'koli',
      recipient_name: 'Av. Kemal Erdem',
      recipient_phone: '+905429981020',
      delivery_pin: '4821',
      pickup_address: 'Beşiktaş Çarşı No:12',
      dropoff_address: 'Levent Kanyon Plaza Kat:8',
      fragile: true,
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 13px Regular / SF Pro Display 15px Bold / JetBrains Mono 14px Black',
    colors: ['#06B6D4', '#0066FF', '#10B981', '#0F172A'],
    touchTarget: '48pt x 48pt Action Controls',
    elevation: 'Cyan Tech Glow (border-cyan-500/40 shadow-xl)',
  },
  edgeCases: [
    'Alıcı adreste bulunamazsa: Kurye 5 dakika bekleme sayacı başlatır, ardından koli merkez depoya iade sürecine girer.',
    'Paket hasarlı teslim edilirse: Alıcı teslimat PIN kodunu vermez, hasar tutanağı başlatılır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center text-lg shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Motokurye Kargo Takibi</h3>
              <span className="text-[10px] text-zinc-400 font-mono">BLS-PKG-4821</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-300 font-bold bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
            Kurye Yolda (4 dk)
          </span>
        </div>
      </div>

      {/* PIN Code Highlight Box */}
      <div className="p-3.5 bg-zinc-950 border border-zinc-700 rounded-2xl space-y-2 text-center shadow-xl">
        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest block">
          ALICIYA İLETİLECEK GÜVENLİK PIN KODU
        </span>
        <div className="text-3xl font-black font-mono tracking-widest text-white">
          4821
        </div>
        <p className="text-[10px] text-zinc-400">
          Alıcı bu 4 haneli PIN kodunu kuryeye söyleyerek paketi teslim alacaktır.
        </p>

        <div className="pt-1 flex justify-center">
          <div className="px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md">
            <Copy className="w-3.5 h-3.5" />
            <span>Kodu Kopyala & WhatsApp'tan Gönder</span>
          </div>
        </div>
      </div>

      {/* Parcel Details */}
      <div className="space-y-2 text-xs">
        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span>Paket Türü:</span>
            <strong className="text-white">📦 Orta Boy Koli (Kırılabilir)</strong>
          </div>
          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span>Alıcı:</span>
            <span className="text-white">Av. Kemal Erdem</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span>Alıcı GSM:</span>
            <span className="text-white font-mono">+90 542 998 10 20</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[11px] pt-1 border-t border-zinc-800">
            <span>Teslimat Ücreti:</span>
            <strong className="text-white font-mono">115 ₺ (Karttan Tahsil Edildi)</strong>
          </div>
        </div>

        <div className="p-2 bg-black rounded-xl border border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white shrink-0" />
          <span>Koli teslim anında kurye tarafından fotoğraflanarak sisteme damgalanacaktır.</span>
        </div>
      </div>

      {/* Footer Status */}
      <div className="pt-2 border-t border-zinc-800 text-center text-[10px] text-zinc-500 font-mono">
        Blesyum Motokurye Lojistik A.Ş. · Taşıma Güvencesi No: GUV-882190
      </div>
    </div>
  ),
};
