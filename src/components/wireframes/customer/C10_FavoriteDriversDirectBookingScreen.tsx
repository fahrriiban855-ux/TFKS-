import React from 'react';
import {
  Star,
  MessageCircle,
  Bike,
  ShieldCheck,
  Send,
  Heart,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { WireframeScreen } from '../types';

export const C10_FavoriteDriversDirectBookingScreen: WireframeScreen = {
  id: 'C-10',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 10 / 10',
  title: 'Favori Sürücü Kulübü & 7/24 Doğrudan VIP Sefer Çağrısı',
  subtitle: 'Kuryeyi Arkadaş Olarak Kaydetme, Önceden Mesajlaşma ve Doğrudan Çağrı',
  userGoal:
    'Memnun kalınan motosiklet sürücüsünü favorilere ekleyip, 7/24 mesajlaşarak gelecekteki seferleri planlamak ve sıraya girmeden %5 indirimle doğrudan aynı sürücüyü çağırmak.',
  triggerAction:
    'Yolcu sefer bitiminde veya profilinde "Favorilere Ekle" butonuna dokunur ➔ "Sürücülerim" sekmesinde 7/24 sohbet ve özel sefer başlatma aktifleşir.',
  uxHighlights: [
    'Sürücüyü Arkadaş/Favori Olarak Ekleme: Güvenilir, kibar ve iyi motor kullanan sürücüleri tek tıkla kaydetme',
    '7/24 Kesintisiz Özel Sohbet: Sefer olmasa bile kuryeye mesaj atıp "Yarın 09:00 için müsait misiniz?" gibi ön randevu oluşturma',
    'Doğrudan Özel Sefer Çağrısı: Genel havuza düşmeden, doğrudan seçilen kuryenin telefonuna VIP teklif gönderme',
    '%5 Sadakat İndirimi: Favori sürücüsüyle yolculuk yapan yolcuya %5 tasarruf, sürücüye +%5 platform sadakat primi',
    'Çevrim İçi Canlı Durum İndikatörü: Sürücünün o an görevde veya dinlenmede olduğunu anlık görme',
  ],
  securityRule:
    'Doğrudan çağrılar da platformun Zorunlu Koltuk Sigortası ve Mali Mesuliyet şemsiyesi altında gerçekleştirilir (Korsan taşımacılık engellenir).',
  apiEndpoint: 'POST /api/v1/favorites/direct-dispatch',
  apiPayload: JSON.stringify(
    {
      customer_id: 'usr_bedirhan_01',
      target_courier_id: 'kurye-1',
      service_type: 'motosiklet',
      pickup: { lat: 41.0425, lng: 29.0065, name: 'Beşiktaş İskele' },
      dropoff: { lat: 41.0782, lng: 29.0117, name: 'Levent Kanyon AVM' },
      loyalty_discount_applied: true,
      direct_reservation_slot: '2026-10-03T09:00:00Z',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'SF Pro Display 16px Heavy / Inter 13px Medium / JetBrains Mono 11px',
    colors: ['#F59E0B', '#0066FF', '#10B981', '#0F172A'],
    touchTarget: '48pt x 52pt VIP Action Buttons',
    elevation: 'Gold Glow Card (ring-1 ring-amber-500/40 shadow-2xl)',
  },
  edgeCases: [
    'Favori sürücü çevrim dışıysa: "Sürücünüz şu anda dinleniyor, mesaj bırakabilir veya benzer 4.9+ puanlı sürücü çağırabilirsiniz" önerisi.',
    'Sürücü başka seferdeyse: "Sürücünüzün mevcut seferi 4 dk sonra bitiyor, doğrudan çağrınız sıraya alındı" bildirimi.',
    'Yolcu ve sürücü doğrudan WhatsApp yerine uygulama içi güvenli santral ve sigortalı sefer protokolünü kullanır.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100 relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white text-black flex items-center justify-center font-black shadow-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-display">
                  FAVORİ SÜRÜCÜLERİM
                </h3>
                <span className="text-[9px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-700">
                  ÖZEL LİSTE
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Doğrudan Çağrı & 7/24 Kesintisiz Sohbet</span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-full font-bold">
            %5 İNDİRİM
          </span>
        </div>
      </div>

      {/* Driver Card */}
      <div className="space-y-3 my-2">
        <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-black text-white shadow-md">
                  🛵
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white ring-2 ring-black" title="Çevrim İçi" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">Mert Aksoy</h4>
                  <Heart className="w-3.5 h-3.5 text-white fill-current" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 font-mono">
                  <span>34 BLY 717</span>
                  <span>·</span>
                  <span className="text-zinc-300 font-semibold">Yamaha NMAX 155</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                  <span className="text-zinc-200 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" /> 4.96
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400">1.420 Sefer</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-white font-semibold">Çevrim İçi & Müsait</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Direct Message Preview */}
          <div className="p-2 bg-black rounded-xl border border-zinc-800 text-[11px] space-y-1">
            <div className="flex justify-between items-center text-[9px] text-zinc-400 font-mono">
              <span className="text-zinc-300 font-semibold">Son Mesajlaşma</span>
              <span>18:20</span>
            </div>
            <p className="text-zinc-300 italic truncate">
              "Mert Aksoy: Selamlar Bedirhan Bey! Yarın 09:00 için hazırım, doğrudan çağrı atabilirsiniz."
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button className="py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-zinc-800">
              <MessageCircle className="w-3.5 h-3.5 text-zinc-300" />
              <span>7/24 Sohbet Et</span>
            </button>
            <button className="py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg">
              <Bike className="w-3.5 h-3.5" />
              <span>Doğrudan Çağır</span>
            </button>
          </div>
        </div>

        {/* Perks Box */}
        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5 text-[11px] text-zinc-400">
          <span className="font-bold text-zinc-200 block text-xs">Favori Sürücü Ayrıcalıkları:</span>
          <div className="flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white" />
            <span>Genel radar beklemesi olmadan doğrudan kuryeye bağlanma</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white" />
            <span>Her seferde anında %5 sadakat indirimi uygulanır</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-white" />
            <span>Tam sigortalı, e-Arşiv faturalı ve 4 haneli PIN korumalı yolculuk</span>
          </div>
        </div>
      </div>

      {/* Direct Ride Trigger Footer */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-zinc-400 block font-semibold">Varsayılan Güzergah</span>
          <span className="font-bold text-white">Beşiktaş ➔ Levent Kanyon</span>
        </div>
        <button className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl flex items-center gap-1.5 shadow-lg">
          <span>Özel Sefer Başlat</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  ),
};
