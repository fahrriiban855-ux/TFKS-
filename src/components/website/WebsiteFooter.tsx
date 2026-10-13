import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface WebsiteFooterProps {
  onOpenLegalModal: (tab: 'kvkk' | 'privacy' | 'terms' | 'assurance') => void;
  onOpenDriverModal: () => void;
  onOpenMerchantModal: () => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onOpenLegalModal,
  onOpenDriverModal,
  onOpenMerchantModal,
}) => {
  const { setActiveView } = usePlatform();

  return (
    <footer className="border-t border-white/[0.08] bg-[#0A0A0C] text-[#8E8E93] text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#0A84FF] to-[#0071E3] flex items-center justify-center text-white font-bold text-xs">
                M
              </div>
              <span className="text-base font-bold text-white tracking-tight">MotoPilot</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              İstanbul'un en hızlı ve güvenli motosiklet yolcu (Moto TAG) ve kurye ağı. Trafikten bağımsız, anlık eşleşen mobilite platformu.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#30D158] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BDDK Uyumlu Güvenli Ödeme & Kaza Sigortası</span>
            </div>
          </div>

          {/* Col 2: Hizmetlerimiz */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('customer')}
                  className="hover:text-white transition-colors text-left"
                >
                  Moto TAG — Yolcu Taşımacılığı
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('customer')}
                  className="hover:text-white transition-colors text-left"
                >
                  Express Kurye — Tekil Paket & Evrak
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMerchantModal}
                  className="hover:text-white transition-colors text-left text-[#BF5AF2] font-semibold"
                >
                  İşletme & Restoran Çoklu Dağıtımı
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('customer')}
                  className="hover:text-white transition-colors text-left"
                >
                  VIP & Öncelikli Rezervasyon
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sürücüler & İş Ortakları */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">İş Ortaklığı</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenDriverModal}
                  className="hover:text-white transition-colors text-left text-[#30D158] font-semibold"
                >
                  Motosiklet Sürücüsü Başvurusu
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMerchantModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Restoran / E-Ticaret Sözleşmesi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('assurance')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sürücü Hak Ediş & Güvence Modeli
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-white transition-colors text-left font-mono text-[11px]"
                >
                  Operasyon & Komuta Merkezi Girişi →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: İletişim ve Yasal Merkez */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">İletişim & Merkez</h4>
            <div className="space-y-2 text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0A84FF] shrink-0 mt-0.5" />
                <span>Büyükdere Cad. No: 195 Levent, Beşiktaş / İstanbul</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0A84FF] shrink-0" />
                <a href="tel:+908508406686" className="hover:text-white transition-colors">
                  0850 840 66 86
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0A84FF] shrink-0" />
                <a href="mailto:destek@motopilot.com.tr" className="hover:text-white transition-colors">
                  destek@motopilot.com.tr
                </a>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                <span>7 Gün 24 Saat Kesintisiz Saha Hizmeti</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Buttons */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 MotoPilot Teknoloji ve Mobilite A.Ş. Tüm hakları saklıdır.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#8E8E93]">
            <button
              onClick={() => onOpenLegalModal('kvkk')}
              className="hover:text-white transition-colors"
            >
              KVKK Aydınlatma
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-white transition-colors"
            >
              Gizlilik & Çerezler
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-white transition-colors"
            >
              Kullanım Koşulları
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('assurance')}
              className="hover:text-white transition-colors text-[#30D158]"
            >
              Kaza Güvence Poliçesi
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
