import React, { useState } from 'react';
import {
  Bike,
  Clock,
  ArrowRight,
  Phone,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { WebsiteFooter } from './WebsiteFooter';
import { FareEstimatorModal } from './FareEstimatorModal';
import { DriverApplicationModal } from './DriverApplicationModal';
import { MerchantLeadModal } from './MerchantLeadModal';
import { LegalModal } from './LegalModal';

const POPULAR_ROUTES = [
  { from: 'Beşiktaş', to: 'Kadıköy', dist: '12 km', motoTime: '14 Dk', carTime: '55 Dk', fare: '260 ₺' },
  { from: 'Levent', to: 'Maslak', dist: '6 km', motoTime: '8 Dk', carTime: '35 Dk', fare: '150 ₺' },
  { from: 'Kadıköy', to: 'Ataşehir', dist: '9 km', motoTime: '11 Dk', carTime: '40 Dk', fare: '205 ₺' },
  { from: 'Şişli', to: 'Taksim', dist: '4.5 km', motoTime: '7 Dk', carTime: '28 Dk', fare: '125 ₺' },
];

const FAQS = [
  {
    q: 'Komisyon veya gizli hizmet bedeli var mı?',
    a: 'Hayır. Taksi ve kurye çağrılarında %0 komisyon uygulanır. Ödediğiniz tutarın tamamı doğrudan sürücüye/kuryeye aktarılır.',
  },
  {
    q: 'Esnaf ve işletmeler için ücretlendirme nasıl işler?',
    a: 'Sipariş başına yüzdesel komisyon kesilmez. Yeni işletmeler 14 gün ücretsiz kullanır; süre sonunda otomatik yenileme yapılmaz.',
  },
  {
    q: 'Güvenlik nasıl sağlanıyor?',
    a: 'Her çağrıda 4 haneli PIN kodu doğrulaması zorunludur. Kod girilmeden yolculuk veya teslimat başlatılamaz.',
  },
];

export const WebsiteMainView: React.FC = () => {
  const { setActiveView } = usePlatform();
  const [showEstimator, setShowEstimator] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'kvkk' | 'privacy' | 'terms' | 'assurance' | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white transition-colors duration-200">
      {/* 1. Ana Bölüm & Hızlı Ücret Tablosu */}
      <section className="py-10 lg:py-14 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Sol: Başlık ve Hızlı İşlem Butonları */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-[#2563EB]">
                  %0 Komisyon · Anında Eşleşme · PIN Güvenliği
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
                  Hızlı ve Adil{' '}
                  <span className="text-[#2563EB]">Taksi &amp; Kurye Ağı</span>
                </h1>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
                  Şoför ve kuryeden komisyon kesmeyen ulaşım ve teslimat platformu. Ödenen ücretin %100'ü doğrudan saha çalışanına kalır.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveView('customer')}
                    className="px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Taksi / Kurye Çağır</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowEstimator(true)}
                    className="px-4 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <span>Ücret Hesapla</span>
                  </button>

                  <button
                    onClick={() => setShowDriverModal(true)}
                    className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Kurye / Sürücü Ol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-subtle)]">
                  <div>
                    <div className="text-lg font-extrabold font-mono text-emerald-500">%0</div>
                    <div className="text-xs text-[var(--text-secondary)]">Komisyon Kesintisi</div>
                  </div>
                  <div>
                    <div className="text-lg font-extrabold font-mono text-[#2563EB]">14 Gün</div>
                    <div className="text-xs text-[var(--text-secondary)]">Esnafa Ücretsiz</div>
                  </div>
                  <div>
                    <div className="text-lg font-extrabold font-mono text-[var(--text-primary)]">4 Haneli PIN</div>
                    <div className="text-xs text-[var(--text-secondary)]">Güvenli Başlangıç</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Canlı Mesafe ve Ücret Tablosu */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">
                  Örnek Hat Süre ve Ücretleri
                </h2>
                <button
                  onClick={() => setShowEstimator(true)}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Fiyat Hesapla →
                </button>
              </div>

              <div className="divide-y divide-[var(--border-subtle)]">
                {POPULAR_ROUTES.map((route, i) => (
                  <div
                    key={i}
                    onClick={() => setShowEstimator(true)}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-[var(--bg-elevated)]/40 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">
                        {route.from} → {route.to}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                        {route.dist}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right font-mono tabular-nums">
                      <div>
                        <span className="text-xs font-bold text-emerald-500 block">
                          {route.motoTime}
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)] line-through block">
                          Trafik: {route.carTime}
                        </span>
                      </div>
                      <div className="min-w-[56px]">
                        <span className="text-sm font-bold text-[var(--text-primary)] block">
                          {route.fare}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Bekleme zammı yoktur</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">%100 Net Hakediş</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hizmetler (3 Sade Kart) */}
      <section className="py-10 lg:py-12 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Hizmetler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Kart 1 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2563EB]">YOLCU ULAŞIMI</span>
                  <span className="font-mono text-emerald-500 font-semibold">%0 Komisyon</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Taksi &amp; Moto Yolcu
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Sabit mesafe ücreti ve 4 haneli PIN kodu ile güvenli ulaşım. Sürücüden komisyon kesilmez.
                </p>
                <ul className="space-y-1.5 text-xs text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Önceden belli net ücret</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Plaka ve sürücü doğrulaması</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('customer')}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Yolculuk Başlat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Kart 2 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-500">EKSPRES KURYE</span>
                  <span className="font-mono text-emerald-500 font-semibold">Anlık Takip</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Bireysel Paket Gönderimi
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Evrak, anahtar ve paketleriniz için hızlı kurye. Alıcı PIN kodu ve teslimat fotoğrafı ile güvenceli.
                </p>
                <ul className="space-y-1.5 text-xs text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Alıcı onay kodu ile teslim</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Anlık veya saatli gönderim</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('customer')}
                className="w-full py-2.5 bg-[var(--bg-elevated)] hover:bg-[#2563EB] hover:text-white text-[var(--text-primary)] font-semibold text-xs rounded-xl border border-[var(--border-subtle)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Kurye Çağır</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Kart 3 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2563EB]">ESNAF &amp; İŞLETME</span>
                  <span className="font-mono text-[#2563EB] font-semibold">14 Gün Ücretsiz</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Çoklu Paket Dağıtımı
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Restoran ve işletmeler için tek seferde 5 durağa kadar toplu teslimat. Sipariş başı komisyon yok.
                </p>
                <ul className="space-y-1.5 text-xs text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Çoklu rota optimizasyonu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>14 gün ücretsiz başlangıç</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('business')}
                className="w-full py-2.5 bg-[var(--bg-elevated)] hover:bg-[#2563EB] hover:text-white text-[var(--text-primary)] font-semibold text-xs rounded-xl border border-[var(--border-subtle)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>İşletme Paneline Geç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kısa SSS */}
      <section className="py-10 border-b border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Sıkça Sorulan Sorular
          </h2>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[var(--text-primary)] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobil Alt Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] p-2.5 flex items-center gap-2">
        <a
          href="tel:+908508406686"
          className="flex-1 py-2.5 px-3 bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>0850 840 66 86</span>
        </a>

        <button
          onClick={() => setActiveView('customer')}
          className="flex-1 py-2.5 px-3 bg-[#2563EB] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Bike className="w-4 h-4" />
          <span>Hemen Çağır</span>
        </button>
      </div>

      {/* Modallar */}
      <FareEstimatorModal
        isOpen={showEstimator}
        onClose={() => setShowEstimator(false)}
        onBookNow={() => {
          setShowEstimator(false);
          setActiveView('customer');
        }}
      />

      <DriverApplicationModal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
      />

      <MerchantLeadModal
        isOpen={showMerchantModal}
        onClose={() => setShowMerchantModal(false)}
      />

      <LegalModal
        isOpen={legalModalTab !== null}
        onClose={() => setLegalModalTab(null)}
        defaultTab={legalModalTab || 'kvkk'}
      />

      <WebsiteFooter
        onOpenLegalModal={(tab) => setLegalModalTab(tab)}
        onOpenDriverModal={() => setShowDriverModal(true)}
        onOpenMerchantModal={() => setShowMerchantModal(true)}
      />
    </div>
  );
};

