import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'kvkk' | 'privacy' | 'terms' | 'assurance';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'kvkk',
}) => {
  const [activeTab, setActiveTab] = useState<'kvkk' | 'privacy' | 'terms' | 'assurance'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#161618] border border-white/[0.12] rounded-[32px] w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-[#F5F5F7] space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#30D158]" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Hukuki Metinler & Güvence Merkezi
              </h3>
              <p className="text-xs text-[#8E8E93]">6698 Sayılı KVKK ve Tüketici Hakları Uyum Bildirimi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.06] rounded-xl border border-white/[0.06] text-xs font-semibold shrink-0 overflow-x-auto">
          {[
            { id: 'kvkk', label: 'KVKK Aydınlatma Metni' },
            { id: 'privacy', label: 'Gizlilik ve Çerez Politikası' },
            { id: 'terms', label: 'Hizmet ve Taşıma Şartları' },
            { id: 'assurance', label: 'Yolcu & Kaza Güvence Modeli' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-[#8E8E93] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-zinc-300 pr-2 leading-relaxed">
          {activeTab === 'kvkk' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">6698 Sayılı KVKK Kapsamında Kişisel Verilerin İşlenmesi</h4>
              <p>
                MotoPilot Teknoloji ve Mobilite A.Ş. ("MotoPilot") olarak; müşterilerimizin, yolcularımızın, bağımsız kurye ve sürücü ortaklarımızın kişisel verilerinin korunmasına azami önem atfetmekteyiz.
              </p>
              <h5 className="font-semibold text-white">1. İşlenen Kişisel Veriler</h5>
              <p>
                Kimlik Bilgileri (Ad, Soyad), İletişim Bilgileri (Telefon Numarası, E-posta Adresi), Konum Bilgileri (GPS Tabanlı Alış ve Varış Koordinatları, Canlı Rota Verisi), Finansal Veriler (Kredi Kartı Tokenize Ödeme Bilgileri - Kart numarası sunucularımızda saklanmaz, PCI-DSS Seviye 1 güvencesindeki BDDK lisanslı Sanal POS altyapısında tutulur).
              </p>
              <h5 className="font-semibold text-white">2. Verilerin İşlenme Amacı</h5>
              <p>
                Sözleşmenin ifası kapsamında en yakın sürücü ile yolcunun eşleştirilmesi, teslimatın harita üzerinde canlı takibi, hakediş mutabakatının yürütülmesi ve acil durumlarda emniyet/sağlık birimlerine lokasyon bildiriminde bulunulması amaçlarıyla sınırlı olarak işlenir.
              </p>
              <h5 className="font-semibold text-white">3. Haklarınız</h5>
              <p>
                KVKK 11. maddesi uyarınca dilediğiniz zaman verilerinizin silinmesini, anonim hale getirilmesini veya yurt içi/dışı aktarımlar hakkında bilgi talep etme hakkına sahipsiniz. Başvurularınızı kvkk@motopilot.com.tr adresine iletebilirsiniz.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Gizlilik Politikası ve Çerez Yönetimi</h4>
              <p>
                Bu platform, ziyaretçi deneyimini iyileştirmek, oturum güvenliğini temin etmek ve dönüşüm analitiğini ölçmek amacıyla zorunlu ve işlevsel çerezler (cookies) kullanmaktadır.
              </p>
              <h5 className="font-semibold text-white">Zorunlu Çerezler:</h5>
              <p>
                Oturum kimliği, sepet ve çağrı talebi oluşturma, güvenlik belirteçleri (CSRF / Idempotency key doğrulaması) için teknik olarak elzem olan çerezlerdir. Devre dışı bırakılamaz.
              </p>
              <h5 className="font-semibold text-white">Analitik Çerezler:</h5>
              <p>
                Google Analytics 4 ve sunucu logları aracılığıyla anonimleştirilmiş sayfa görüntülemeleri, rota hesaplama sıklığı ve hata raporlama (Core Web Vitals) metriklerini ölçer. Kişisel IP adresiniz anonimleştirilerek işlenir.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Kullanım ve Taşıma Hizmeti Şartları</h4>
              <p>
                MotoPilot, motosiklet sürücüleri ile yolcuları veya göndericileri bir araya getiren bağımsız bir teknolojik pazaryeri platformudur.
              </p>
              <h5 className="font-semibold text-white">1. Kask ve Koruyucu Donanım Şartı</h5>
              <p>
                Moto TAG hizmetinde sürücülerimiz, yolcuya ECE 22.06 güvenlik standardına uygun temiz 2. kask ve tek kullanımlık hijyenik saç bonesi temin etmekle yükümlüdür. Kask takmayı reddeden yolcuların seyahati başlatılamaz.
              </p>
              <h5 className="font-semibold text-white">2. Yasaklı Maddeler ve Paket Sınırları</h5>
              <p>
                Express kurye paketlerinde yanıcı, patlayıcı, kimyasal ve yasal mevzuatça taşınması yasak ürünler kesinlikle kabul edilmez. Maksimum tekil koli ağırlığı 15 kg, hacim sınırı 45 litredir.
              </p>
              <h5 className="font-semibold text-white">3. İptal ve Ücret İadesi</h5>
              <p>
                Sürücü eşleştikten sonraki ilk 2 dakika içerisinde yapılan iptaller ücretsizdir. Sürücü alış noktasına ulaştıktan sonra yapılan haksız iptallerde sürücünün yakıt tazminatı tahakkuk ettirilir.
              </p>
            </div>
          )}

          {activeTab === 'assurance' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">MotoPilot Güvence Modeli ve Kaza Teminatı</h4>
              <p>
                Yolcularımızın ve sürücülerimizin can güvenliği en birinci önceliğimizdir.
              </p>
              <div className="p-3.5 bg-[#30D158]/10 border border-[#30D158]/20 rounded-2xl space-y-1.5">
                <span className="font-bold text-white block">Ferdi Kaza ve Sağlık Sigortası</span>
                <p className="text-zinc-300">
                  MotoPilot üzerinden başlatılan ve PIN doğrulama kodu ile mühürlenen her yolculuk, başlangıç anından varış noktasına kadar anlaşmalı sigorta konsorsiyumu tarafından kesintisiz ferdi kaza teminatı altındadır.
                </p>
              </div>
              <h5 className="font-semibold text-white">Güvenlik Doğrulama Önlemleri:</h5>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li>Sürücülerin sabıka kaydı, ehliyet geçerliliği ve psikoteknik test onayları düzenli denetlenir.</li>
                <li>Motosikletlerin muayene, sigorta ve periyodik fren/lastik bakım geçmişi sistemimizde kayıtlıdır.</li>
                <li>Uygulama içi 7/24 Tek Dokunuşla Acil Durum (112 Acil & Operasyon Çağrısı) butonu aktiftir.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-all"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
