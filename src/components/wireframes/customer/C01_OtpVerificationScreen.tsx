import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C01_OtpVerificationScreen: WireframeScreen = {
  id: 'C-01',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 01 / 08',
  title: 'SMS OTP Doğrulama ve Üyelik',
  subtitle: 'Telefon numarası ile şifresiz, tek dokunuşla güvenli giriş',
  userGoal: 'Uygulamaya saniyeler içinde şifre hatırlama zahmeti olmadan güvenle giriş yapmak.',
  triggerAction: 'Kullanıcı telefon numarasını girer ➔ 6 haneli SMS kodu otomatik okunur ➔ Profil oluşur.',
  uxHighlights: [
    'Şifre sormadan doğrudan SMS OTP ile %100 sürtünmesiz oturum açma',
    'Otomatik SMS okuma (iOS AutoFill / Android SMS Retriever API)',
    'KVKK ve Kullanıcı Sözleşmesi tek tıkla açık rıza onayı',
    'Numerik tuş takımı için 56px yüksekliğinde dokunsal inputlar',
  ],
  securityRule: 'Kimlik doğrulama belirteci (JWT HS256 / Ed25519) güvenli depolama (Secure Keychain / KeyStore) ile korunur.',
  apiEndpoint: 'POST /api/v1/auth/verify-otp',
  apiPayload: JSON.stringify(
    {
      phone: '+905056779379',
      otp_code: '482190',
      device_fingerprint: 'a7f9c2e01',
      platform: 'ios_18',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'SF Pro Display 24px Bold / Inter 14px Regular',
    colors: ['#0066FF', '#0F172A', '#10B981', '#38BDF8'],
    touchTarget: '48pt x 56pt (WCAG 2.1 AAA)',
    elevation: 'Elevation 3 (shadow-2xl ring-1 ring-blue-500/40)',
  },
  edgeCases: [
    'SMS 60 saniye içinde gelmezse: "Tekrar Kod Gönder" sayacı devreye girer.',
    'Hatalı kod 3 kez üst üste girilirse: 15 dakika IP/cihaz kilidi uygulanır.',
    'Hat sinyal kaybında: İstemci tarafında "Bağlantı Bekleniyor" offline HUD belirir.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-6 flex flex-col justify-between text-zinc-100 relative">
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-xl text-black shadow-xl">
            W
          </div>
          <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded-full font-bold">
            BLS-AUTH-V2
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black font-display text-white tracking-tight">
            Blesyum'a Hoş Geldiniz
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Motosiklet yolculuğu ve acil motokurye çağırmak için telefon numaranızı doğrulayınız.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3 text-sm font-mono shadow-inner">
            <span className="text-zinc-400 font-bold flex items-center gap-1.5">
              <span className="text-base">🇹🇷</span> +90
            </span>
            <span className="text-white font-bold tracking-wide">505 677 93 79</span>
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 font-semibold mb-1.5 block uppercase tracking-wider">
              SMS DOĞRULAMA KODU (6 HANELİ)
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {['4', '8', '2', '1', '9', '0'].map((digit, i) => (
                <div
                  key={i}
                  className="h-14 bg-zinc-950 border-2 border-white rounded-2xl flex items-center justify-center font-mono font-black text-xl text-white shadow-lg"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
            <span>Kodu almadınız mı?</span>
            <span className="text-white font-bold font-mono">00:48</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all">
          <span>Giriş Yap ve Devam Et</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          Devam ederek <strong className="text-slate-400">Kullanıcı Sözleşmesi</strong> ve <strong className="text-slate-400">KVKK Aydınlatma Metni</strong>ni kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  ),
};
