import React from 'react';
import { Phone, Mail } from 'lucide-react';
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
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
                M
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)]">MotoPilot</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              %0 Komisyonlu Taksi ve Kurye Platformu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveView('customer')}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Müşteri Ekranı
            </button>
            <button
              onClick={onOpenDriverModal}
              className="hover:text-[var(--text-primary)] text-emerald-500 font-semibold transition-colors cursor-pointer"
            >
              Kurye Başvurusu
            </button>
            <button
              onClick={onOpenMerchantModal}
              className="hover:text-[var(--text-primary)] text-[#2563EB] font-semibold transition-colors cursor-pointer"
            >
              İşletme Kaydı
            </button>
            <a
              href="tel:+908508406686"
              className="flex items-center gap-1 hover:text-[var(--text-primary)] font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>0850 840 66 86</span>
            </a>
            <a
              href="mailto:destek@motopilot.com.tr"
              className="flex items-center gap-1 hover:text-[var(--text-primary)]"
            >
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>destek@motopilot.com.tr</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>© 2026 MotoPilot. Tüm hakları saklıdır.</div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLegalModal('kvkk')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              KVKK
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              Gizlilik
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              Koşullar
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('assurance')}
              className="hover:text-[var(--text-primary)] text-emerald-500 cursor-pointer"
            >
              Güvence
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

