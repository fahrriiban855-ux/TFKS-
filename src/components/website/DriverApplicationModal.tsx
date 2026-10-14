import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Bike, ArrowRight, User, Phone, Mail, Award, Check } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DriverApplication } from '../../types/website';

interface DriverApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverApplicationModal: React.FC<DriverApplicationModalProps> = ({ isOpen, onClose }) => {
  const { submitDriverApplication } = usePlatform();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedApp, setGeneratedApp] = useState<DriverApplication | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Kadıköy');

  const [vehicleType, setVehicleType] = useState<DriverApplication['vehicleType']>('scooter_125');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModelYear, setVehicleModelYear] = useState<number>(2023);
  const [drivingLicenseClass, setDrivingLicenseClass] = useState<DriverApplication['drivingLicenseClass']>('A2');
  const [experienceYears, setExperienceYears] = useState<number>(3);

  const [hasSecondHelmet, setHasSecondHelmet] = useState<boolean>(true);
  const [hasDeliveryBox, setHasDeliveryBox] = useState<boolean>(true);
  const [servicePreference, setServicePreference] = useState<DriverApplication['servicePreference']>('passenger_and_courier');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNextStep = () => {
    setFormError(null);
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !email.trim()) {
        setFormError('Lütfen ad soyad, telefon ve e-posta alanlarını eksiksiz doldurun.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!vehiclePlate.trim()) {
        setFormError('Lütfen motosiklet plakanızı girin (Örn: 34 ABC 123).');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const app = submitDriverApplication({
      fullName,
      phone,
      email,
      city,
      district,
      vehicleType,
      vehiclePlate: vehiclePlate.toUpperCase().trim(),
      vehicleModelYear,
      drivingLicenseClass,
      experienceYears,
      hasSecondHelmet,
      hasDeliveryBox,
      servicePreference,
    });

    setGeneratedApp(app);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setStep(1);
    setFullName('');
    setPhone('');
    setEmail('');
    setVehiclePlate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#161618] border border-white/[0.12] rounded-[32px] w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-[#F5F5F7] space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#30D158]" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Taksi Şoförü & Kurye Başvurusu (%0 Komisyon)
              </h3>
            </div>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              1. Taksi (TAXI_RIDE) ve 2. Kurye / Teslimat ağında %0 platform komisyonu (%100 net hakediş) ile çalışın.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted && generatedApp ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#30D158]/20 border border-[#30D158]/40 text-[#30D158] mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Başvurunuz Başarıyla Alındı!</h4>
              <p className="text-xs text-[#8E8E93] max-w-md mx-auto">
                Bilgileriniz operasyon ekibimizce ön kontrolden geçirildi. 24 saat içinde SMS ve telefon ile bilgilendirileceksiniz.
              </p>
            </div>

            <div className="p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Başvuru Takip Kodu:</span>
                <span className="font-mono font-bold text-[#0A84FF]">{generatedApp.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Ad Soyad:</span>
                <span className="font-semibold text-white">{generatedApp.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Plaka:</span>
                <span className="font-mono text-white">{generatedApp.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Hizmet Tercihi:</span>
                <span className="text-[#30D158] font-semibold">
                  {generatedApp.servicePreference === 'passenger_and_courier'
                    ? '1. Taksi (TAXI_RIDE) + Kurye (%0 Komisyon)'
                    : '2. Bireysel & İşletme Kurye (%0 Komisyon)'}
                </span>
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
          /* Multi-Step Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-xs pb-1">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 1 ? 'bg-[#0071E3] text-white' : 'bg-white/[0.1] text-[#8E8E93]'
                }`}>
                  1
                </span>
                <span className={step === 1 ? 'text-white font-semibold' : 'text-[#8E8E93]'}>
                  Kişisel & İletişim
                </span>
              </div>
              <div className="h-0.5 w-8 bg-white/[0.1]" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 2 ? 'bg-[#0071E3] text-white' : 'bg-white/[0.1] text-[#8E8E93]'
                }`}>
                  2
                </span>
                <span className={step === 2 ? 'text-white font-semibold' : 'text-[#8E8E93]'}>
                  Araç & Ehliyet
                </span>
              </div>
              <div className="h-0.5 w-8 bg-white/[0.1]" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 3 ? 'bg-[#0071E3] text-white' : 'bg-white/[0.1] text-[#8E8E93]'
                }`}>
                  3
                </span>
                <span className={step === 3 ? 'text-white font-semibold' : 'text-[#8E8E93]'}>
                  Ekipman & Onay
                </span>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-[#FF453A]/15 border border-[#FF453A]/30 rounded-xl text-xs text-[#FF453A] font-semibold">
                {formError}
              </div>
            )}

            {/* STEP 1: Kişisel Bilgiler */}
            {step === 1 && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                    AD SOYAD *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0A84FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      TELEFON NUMARASI *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="05XX XXX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      E-POSTA ADRESİ *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ornek@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      ŞEHİR
                    </label>
                    <input
                      type="text"
                      disabled
                      value={city}
                      className="w-full bg-[#242426]/50 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-[#8E8E93] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      BÖLGE / İLÇE
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF]"
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
              </div>
            )}

            {/* STEP 2: Araç & Ehliyet Bilgileri */}
            {step === 2 && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      MOTOSİKLET TİPİ
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as any)}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF]"
                    >
                      <option value="scooter_125">Scooter (125cc - PCX, NMAX vb.)</option>
                      <option value="motorcycle_250_plus">Vitesli / 250cc+ Touring</option>
                      <option value="electric_bike">Elektrikli Maxi Scooter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      PLAKA *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="34 ABC 123"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      MODEL YILI
                    </label>
                    <input
                      type="number"
                      min={2015}
                      max={2026}
                      value={vehicleModelYear}
                      onChange={(e) => setVehicleModelYear(Number(e.target.value))}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#0A84FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      EHLİYET SINIFI
                    </label>
                    <select
                      value={drivingLicenseClass}
                      onChange={(e) => setDrivingLicenseClass(e.target.value as any)}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF]"
                    >
                      <option value="A2">A2 Sınıfı</option>
                      <option value="A">A Sınıfı (Büyük Hacim)</option>
                      <option value="A1">A1 Sınıfı (125cc)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] mb-1">
                      SÜRÜŞ DENEYİMİ
                    </label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#242426] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0A84FF]"
                    >
                      <option value={1}>1 Yıl</option>
                      <option value={2}>2 Yıl</option>
                      <option value={3}>3-5 Yıl</option>
                      <option value={6}>6+ Yıl Profesyonel</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Ekipman & Hizmet Tercihi */}
            {step === 3 && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="space-y-2">
                  <span className="block text-[11px] font-semibold text-[#8E8E93]">
                    HİZMET VE ÇAĞRI TERCİHİNİZ
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setServicePreference('passenger_and_courier')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        servicePreference === 'passenger_and_courier'
                          ? 'bg-[#30D158]/15 border-[#30D158] ring-1 ring-[#30D158]'
                          : 'bg-white/[0.03] border-white/[0.08]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">1. Taksi (TAXI_RIDE) + Kurye (%0 Komisyon)</div>
                      <p className="text-[10px] text-[#8E8E93] mt-0.5 leading-snug">
                        Taksi yolcu çağrıları ve paket teslimatlarında %0 komisyon (%100 net hakediş). Motosikletli yolcu (MOTO_PASSENGER_RIDE) M0'da kapalıdır.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServicePreference('courier_only')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        servicePreference === 'courier_only'
                          ? 'bg-[#0071E3]/15 border-[#0071E3] ring-1 ring-[#0071E3]'
                          : 'bg-white/[0.03] border-white/[0.08]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">2. Kurye / Teslimat (PERSONAL & MERCHANT)</div>
                      <p className="text-[10px] text-[#8E8E93] mt-0.5 leading-snug">
                        Bireysel ve esnaf/işletme paket teslimatları. %0 platform komisyonu (%100 net kurye hakedişi).
                      </p>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <span className="block text-[11px] font-semibold text-[#8E8E93]">
                    MEVCUT EKİPMANLARINIZ
                  </span>

                  <label className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSecondHelmet}
                      onChange={(e) => setHasSecondHelmet(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0071E3] bg-[#242426] border-white/20 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white block">Yolcu İçin 2. Kask ve Hijyen Bonesi</span>
                      <span className="text-[10px] text-[#8E8E93]">Moto TAG yolcu taşımacılığı için yasal zorunluluktur.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasDeliveryBox}
                      onChange={(e) => setHasDeliveryBox(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0071E3] bg-[#242426] border-white/20 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white block">Su Geçirmez Paket Taşıma Çantası (Topcase)</span>
                      <span className="text-[10px] text-[#8E8E93]">Evrak ve gıda paketlerinin güvenli taşınması için.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs rounded-xl transition-all"
                >
                  ← Geri
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Devam Et</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#30D158] hover:bg-[#34C759] text-black font-extrabold text-xs rounded-xl shadow-[0_4px_16px_rgba(48,209,88,0.3)] transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Başvurumu Gönder</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
