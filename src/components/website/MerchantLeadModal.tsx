import React, { useState } from 'react';
import { X, CheckCircle2, Building, Mail, Phone, ArrowRight, Check, Package, TrendingUp } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { MerchantLead } from '../../types/website';

interface MerchantLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantLeadModal: React.FC<MerchantLeadModalProps> = ({ isOpen, onClose }) => {
  const { submitMerchantLead } = usePlatform();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedLead, setSubmittedLead] = useState<MerchantLead | null>(null);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Kadıköy');
  const [businessType, setBusinessType] = useState<MerchantLead['businessType']>('restaurant');
  const [dailyEstimatedDeliveries, setDailyEstimatedDeliveries] = useState<number>(30);
  const [requestedService, setRequestedService] = useState<MerchantLead['requestedService']>('express_courier');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Monthly estimate
  const monthlyVolume = dailyEstimatedDeliveries * 30;
  const estimatedDiscountRate = dailyEstimatedDeliveries >= 50 ? 20 : dailyEstimatedDeliveries >= 25 ? 12 : 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!businessName.trim() || !contactPerson.trim() || !phone.trim() || !email.trim()) {
      setFormError('Lütfen işletme adı, yetkili kişi, telefon ve e-posta alanlarını eksiksiz doldurun.');
      return;
    }

    const lead = submitMerchantLead({
      businessName,
      contactPerson,
      phone,
      email,
      district,
      businessType,
      dailyEstimatedDeliveries,
      requestedService,
      notes: notes.trim() || undefined,
    });

    setSubmittedLead(lead);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setBusinessName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#161618] border border-white/[0.12] rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-[#F5F5F7] space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BF5AF2]" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                İşletme & Restoran Teslimat Talebi
              </h3>
            </div>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Kendi kuryenizi istihdam etme maliyetinden kurtulun; 30 dakikada adrese teslim.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted && submittedLead ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#BF5AF2]/20 border border-[#BF5AF2]/40 text-[#BF5AF2] mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Teklif Talebiniz Alındı!</h4>
              <p className="text-xs text-[#8E8E93] max-w-md mx-auto">
                Kurumsal hesap uzmanımız en geç 2 saat içinde özel komisyon teklifinizle sizinle iletişime geçecektir.
              </p>
            </div>

            <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Talep Kodu:</span>
                <span className="font-mono font-bold text-[#BF5AF2]">{submittedLead.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">İşletme:</span>
                <span className="font-semibold text-white">{submittedLead.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Tahmini Hacim:</span>
                <span className="font-mono text-white">~{submittedLead.dailyEstimatedDeliveries} paket/gün</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Özel İndirim Oranı:</span>
                <span className="text-[#30D158] font-bold">%{estimatedDiscountRate} Avantaj</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-all shadow-md"
            >
              Tamam, Kapat
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 bg-[#FF453A]/15 border border-[#FF453A]/30 rounded-xl text-xs text-[#FF453A] font-semibold">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                  İŞLETME / MARKA ADI *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Kadıköy Burger Co."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                  YETKİLİ ADI SOYADI *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Canan Yıldız"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                  TELEFON NUMARASI *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0212 XXX XX XX / 05XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                  KURUMSAL E-POSTA *
                </label>
                <input
                  type="email"
                  required
                  placeholder="info@isletme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                  SEKTÖR / İŞLETME TÜRÜ
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#BF5AF2]"
                >
                  <option value="restaurant">Restoran & Kafe & Fırın</option>
                  <option value="ecommerce">E-Ticaret & Butik Satış</option>
                  <option value="pharmacy_cosmetics">Eczane & Medikal & Kozmetik</option>
                  <option value="retail_store">Perakende & Çiçek & Hediye</option>
                  <option value="other">Diğer Ticari İşletme</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                  HİZMET BÖLGESİ (İLÇE)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#BF5AF2]"
                >
                  <option value="Kadıköy">Kadıköy</option>
                  <option value="Beşiktaş">Beşiktaş</option>
                  <option value="Şişli">Şişli</option>
                  <option value="Üsküdar">Üsküdar</option>
                  <option value="Sarıyer">Sarıyer</option>
                  <option value="Ataşehir">Ataşehir</option>
                  <option value="Bakırköy">Bakırköy</option>
                  <option value="Fatih">Fatih</option>
                </select>
              </div>
            </div>

            {/* Volume Estimator Slider */}
            <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E8E93]">Günlük Tahmini Paket Sayısı:</span>
                <span className="font-mono font-bold text-white text-sm">{dailyEstimatedDeliveries} Paket/Gün</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={dailyEstimatedDeliveries}
                onChange={(e) => setDailyEstimatedDeliveries(Number(e.target.value))}
                className="w-full accent-[#BF5AF2] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                <span>Aylık ~{monthlyVolume} Teslimat</span>
                <span className="text-[#30D158] font-bold">Özel barem: %{estimatedDiscountRate} Komisyon İndirimi</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                ÖZEL İSTEK VEYA ENTEGRASYON NOTLARI
              </label>
              <textarea
                rows={2}
                placeholder="Örn: Yemeksepeti/Getir API entegrasyonu, haftalık toplu faturalandırma isteği..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BF5AF2]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#BF5AF2] hover:bg-[#A84EE2] text-white font-bold text-xs rounded-2xl shadow-[0_4px_20px_rgba(191,90,242,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Kurumsal Teklif İsteyin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
