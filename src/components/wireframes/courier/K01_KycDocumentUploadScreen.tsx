import React from 'react';
import { WireframeScreen } from '../types';

export const K01_KycDocumentUploadScreen: WireframeScreen = {
  id: 'K-01',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 01 / 08',
  title: 'Kurye Kayıt & KYC Belge Yükleme',
  subtitle: 'A sınıfı ehliyet, ruhsat, sigorta ve adli sicil kaydı doğrulama',
  userGoal: 'Belgelerini yükleyip sisteme kurye/sürücü olarak akredite olmak.',
  triggerAction: 'Kurye kamera ile belgeleri tarar ➔ Yönetici paneline onaya düşer.',
  uxHighlights: [
    'Belge tarama rehberi ve otomatik kenar algılama',
    'e-Devlet barkodlu adli sicil PDF yükleme',
    'Yönetici onayı gelene kadar hesap koruma kilidinde tutulur',
  ],
  securityRule: 'Onaylanmamış kuryelerin sunucu tarafında çevrim içi olma yetkisi kilitlidir.',
  apiEndpoint: 'POST /api/v1/courier/kyc/upload',
  apiPayload: JSON.stringify(
    {
      courier_id: 'kurye-1',
      license_photo_url: 's3://blesyum-kyc/license_front.jpg',
      registration_url: 's3://blesyum-kyc/ruhsat.jpg',
      criminal_record_pdf: 's3://blesyum-kyc/edevlet_sicil.pdf',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 13px SemiBold / SF Pro Display 16px Bold',
    colors: ['#10B981', '#0F172A', '#38BDF8'],
    touchTarget: 'Document Card 52pt',
    elevation: 'Green Verification Glow',
  },
  edgeCases: ['Süresi geçmiş sigorta tespit edilirse sistem yüklemeyi reddeder.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider">KURYE AKREDİTASYONU</span>
        <h3 className="text-base font-bold text-white">Sürücü Belgelerinizi Yükleyin</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-zinc-950 border border-zinc-700 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-white">1. A Sınıfı Ehliyet</div>
              <div className="text-[10px] text-zinc-400">Ön ve Arka Yüz Taraması</div>
            </div>
            <span className="text-white font-bold font-mono text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-1 rounded">YÜKLENDİ ✓</span>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-700 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-white">2. Motosiklet Ruhsatı</div>
              <div className="text-[10px] text-zinc-400">34 BLY 717 · NMAX 155</div>
            </div>
            <span className="text-white font-bold font-mono text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-1 rounded">YÜKLENDİ ✓</span>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-white">3. Zorunlu Mali Sigorta</div>
              <div className="text-[10px] text-zinc-400">Poliçe Bitiş Tarihi Kontrolü</div>
            </div>
            <span className="text-black font-bold font-mono text-[10px] bg-white px-2 py-1 rounded">YÜKLE</span>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-white">4. e-Devlet Adli Sicil</div>
              <div className="text-[10px] text-zinc-400">Barkodlu Belge Doğrulama</div>
            </div>
            <span className="text-zinc-400 font-bold font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">PDF YÜKLE</span>
          </div>
        </div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        İncelemeye Gönder
      </button>
    </div>
  ),
};
