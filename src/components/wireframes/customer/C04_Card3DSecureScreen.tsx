import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C04_Card3DSecureScreen: WireframeScreen = {
  id: 'C-04',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 04 / 08',
  title: 'Kayıtlı Kart & 3D Secure Tokenizasyon',
  subtitle: 'Kart bilgisi sunucuda tutulmaz, lisanslı ödeme kuruluşunda saklanır',
  userGoal: 'Kredi kartını bir kez güvenle ekleyip her çağrıda tekrar kart sormadan tek tıkla ödemek.',
  triggerAction: 'Kart eklenir ➔ Bankanın 3D Secure SMS kodu doğrulanır ➔ Token kaydedilir.',
  uxHighlights: [
    'PCI-DSS Seviye 1 uyumlu kart tokenizasyonu',
    'Çağrı anında ön otorizasyon provizyonu, sürüş bitiminde otomatik kesin çekim',
    'Mastercard / Visa / Troy desteği',
    'Apple Pay ve Google Wallet tek tıkla entegrasyon desteği',
  ],
  securityRule: 'Apple/Google mağaza komisyonu ödenmez; fiziksel taşımacılık doğrudan kredi kartıyla tahsil edilir.',
  apiEndpoint: 'POST /api/v1/payments/tokenize-card',
  apiPayload: JSON.stringify(
    {
      card_token: 'tok_blesyum_948194',
      brand: 'mastercard',
      last4: '4289',
      three_ds_status: 'authenticated',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 14px Medium / SF Pro Mono 18px',
    colors: ['#0066FF', '#10B981', '#1E293B', '#F59E0B'],
    touchTarget: 'Card Carousel Item 180pt height',
    elevation: 'Metallic Gradient with Radial Glow',
  },
  edgeCases: [
    'Kart limiti yetersizse: Çağrı başlamadan "Ödeme yöntemi reddedildi" uyarısı verilir.',
    'Sürüş bitiminde karttan para çekilemezse: Kullanıcıya borç kaydı açılır ve operasyon bilgilendirilir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="space-y-4 pt-2">
        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">ÖDEME YÖNTEMLERİ</span>
        <div className="p-5 bg-zinc-950 rounded-3xl border border-zinc-700 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white tracking-widest text-sm">Blesyum Pay</span>
            <span className="font-bold font-mono text-zinc-300 text-sm">Mastercard</span>
          </div>
          <div className="text-xl font-mono tracking-widest text-white">•••• •••• •••• 4289</div>
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Bedirhan İbanoğlu</span>
            <span>SKT: 08/28 · 3D SECURE</span>
          </div>
        </div>
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-300 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 shrink-0 text-white" />
          <span>Kart numaranız sunucularımızda saklanmaz; PCI-DSS Seviye 1 token ile korunur.</span>
        </div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        Kartı Onayla ve Çağrıyı Başlat
      </button>
    </div>
  ),
};
