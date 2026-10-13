import React, { useState } from 'react';
import {
  Bike,
  Package,
  ShoppingBag,
  Store,
  Clock,
  Calendar,
  MapPin,
  Hourglass,
  FileText,
  Key,
  Radio,
  Layers,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Cpu,
  Building2,
  Share2,
  Cloud,
  Network,
  Webhook,
  Car,
  ChevronRight,
  Info,
  Coins,
} from 'lucide-react';

interface LaunchStrategyMatrixProps {
  onSelectService?: (serviceType: 'motosiklet' | 'kurye' | 'al_getir' | 'isletme_siparis') => void;
  className?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const LaunchStrategyMatrix: React.FC<LaunchStrategyMatrixProps> = ({
  onSelectService,
  className = '',
  isModal = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'proposals' | 'options' | 'limited' | 'phase2'>('all');

  return (
    <div className={`space-y-6 text-xs ${className}`}>
      {/* Header Banner - Apple HIG Card */}
      <div className="p-5 sm:p-7 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] text-white font-mono font-semibold text-[10px] uppercase tracking-wider">
                MotoPilot Tasarım ve Geliştirme Kapsamı
              </span>
              <span className="px-3 py-1 rounded-full bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] font-mono font-semibold text-[10px]">
                Kural Statüsü: MVP Dâhil & Öneri Ayrımı
              </span>
            </div>

            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-[#8E8E93] hover:text-white text-[11px] font-semibold transition-all"
              >
                ✕ Kapat
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Uygulama Yapısı & Kapsam Onay Matrisi
          </h2>
          <p className="text-[#8E8E93] text-xs sm:text-sm leading-relaxed max-w-3xl">
            Taslak prensibi: Onaylanmamış kurallar öneri olarak kalır, çalışan özellik gibi sunulmaz. Müşteri/İşletme tek uygulamada profil değiştirir; Sürücü/Kurye yetki ve ekipmana göre görev alır; Operasyon/Komuta Merkezi tek portalda toplanır.
          </p>

          {/* Quick Filter Tabs - Apple Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 text-[11px]">
            {[
              { id: 'all', label: 'Tüm Kapsam' },
              { id: 'active', label: '1. MVP Çekirdek Hizmetler' },
              { id: 'proposals', label: '2. Öneri & Onay Bekleyenler' },
              { id: 'options', label: '3. 7 Ortak Seçenek' },
              { id: 'limited', label: '4. Sınırlı Kapasite Kuralı' },
              { id: 'phase2', label: '5. Resmi Entegrasyon & Faz 2' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-[#8E8E93] hover:text-white border border-white/[0.08]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: MVP ÇEKİRDEK HİZMETLER (ONAYLANMIŞ) */}
      {(activeTab === 'all' || activeTab === 'active') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                1. MVP Çekirdek Hizmetler (Onaylanmış & Çalışan)
              </h3>
            </div>
            <span className="text-[10px] text-white font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-700">
              3 ÇEKİRDEK HİZMET
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1.1 Beni Götür */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-white">Beni Götür</h4>
                      <span className="text-[9px] bg-zinc-900 text-zinc-300 border border-zinc-800 px-1.5 py-0.2 rounded font-mono font-bold">
                        YOLCU
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Kişisel Yolculuk Hizmeti</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px] font-mono">
                  MVP DÂHİL ✓
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Yolcu buluşma noktasını doğrular, varış adresini seçer, 4 haneli güvenlik PIN koduyla sürücüye doğrulatıp yolculuğa başlar. Sürücünün yolcu kaskı ve onaylı yolcu yetkisi şarttır.
              </p>
              {onSelectService && (
                <button
                  type="button"
                  onClick={() => onSelectService('motosiklet')}
                  className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold border border-zinc-700 transition-all flex items-center justify-center gap-1"
                >
                  <span>Müşteri Ekranında Dene</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 1.2 Paket Gönder */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-white">Paket Gönder</h4>
                      <span className="text-[9px] bg-zinc-900 text-zinc-300 border border-zinc-800 px-1.5 py-0.2 rounded font-mono font-bold">
                        PAKET
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Adresten Adrese Kurye</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px] font-mono">
                  MVP DÂHİL ✓
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Gönderici/alıcı bilgileri, paket ağırlığı/boyutu, paketin hazır olma durumu ve teslimat talimatı girilir. Alım ve teslim doğrulaması ayrı tutulur; alıcı kodu ve teslimat kanıtı kullanılır.
              </p>
              {onSelectService && (
                <button
                  type="button"
                  onClick={() => onSelectService('kurye')}
                  className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold border border-zinc-700 transition-all flex items-center justify-center gap-1"
                >
                  <span>Müşteri Ekranında Dene</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 1.3 İşletme İçin Çoklu Teslimat */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5 relative overflow-hidden group hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-white">Çoklu Teslimat</h4>
                      <span className="text-[9px] bg-zinc-900 text-zinc-300 border border-zinc-800 px-1.5 py-0.2 rounded font-mono font-bold">
                        İŞLETME
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Tek Noktadan Çıkış</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px] font-mono">
                  MVP DÂHİL ✓
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                İşletme aynı alım noktasından birden fazla paket ekler; her pakete ayrı takip kodu verilir. Toplam kapasite kontrol edilir, bir paketin aksaması diğerlerini etkilemez.
              </p>
              {onSelectService && (
                <button
                  type="button"
                  onClick={() => onSelectService('isletme_siparis')}
                  className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold border border-zinc-700 transition-all flex items-center justify-center gap-1"
                >
                  <span>İşletme Profilinde Dene</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ÖNERİ & ONAY BEKLEYENLER (ÇALIŞAN GİBİ SUNULMAZ) */}
      {(activeTab === 'all' || activeTab === 'proposals') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider font-mono">
                2. Öneri ve Onay Bekleyen Maddeler (Çalışan Özellik Sayılmaz)
              </h3>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md font-mono">
              ONAY BEKLEYEN ÖNERİ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: ShoppingBag,
                title: 'Al-Getir Hizmeti',
                ruleText: 'Kural 2.2',
                status: 'Öneri / Onay Bekliyor',
                desc: 'Nöbetçi eczane, market alışverişi. Onaylanmadan ana hizmet olarak yerleştirilmez.',
              },
              {
                icon: Bike,
                title: 'Lüks Motosiklet Sınıfı',
                ruleText: 'Kural 2.2',
                status: 'Öneri / Onay Bekliyor',
                desc: 'Premium touring/maxi scooter tarifesi. Pazar doğrulamasından sonra değerlendirilir.',
              },
              {
                icon: Coins,
                title: 'Sanal Cüzdan & Bahşiş',
                ruleText: 'Kural 2.11',
                status: 'Öneri / Onay Bekliyor',
                desc: 'Ön ödemeli bakiye, bahşiş ve otomatik tahsilat kuralları ayrıca netleştirilecektir.',
              },
              {
                icon: Sparkles,
                title: 'Ek Durak & Bekleme Ücreti',
                ruleText: 'Kural 2.6',
                status: 'Öneri / Onay Bekliyor',
                desc: 'Ek durak ve bekleme ücretlerinin hangi koşullarda doğacağı ayrıca onaylanır.',
              },
            ].map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div key={idx} className="p-3.5 bg-zinc-950 border border-amber-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-center justify-center text-amber-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {prop.status}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-xs">{prop.title}</h5>
                      <span className="text-[10px] text-zinc-500 font-mono">{prop.ruleText}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{prop.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: AKTİF OLACAK 7 ORTAK SEÇENEK - Monochrome */}
      {(activeTab === 'all' || activeTab === 'options') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                2. Aktif Olacak 7 Ortak Seçenek (Tüm Hizmetlerde Geçerli)
              </h3>
            </div>
            <span className="text-[10px] text-white font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-700">
              7 ÖZELLİK ENTEGRE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {[
              {
                icon: Clock,
                title: 'Hemen Al',
                desc: 'En yakın sürücüye 15 saniyede düşer, anında yola çıkar.',
                tag: 'Anlık Çağrı',
              },
              {
                icon: Calendar,
                title: 'Belirli Saatte Al',
                desc: 'İleri saatli rezervasyon (örn. 19:30 alış), kurye zamanında kapıda olur.',
                tag: 'Randevulu',
              },
              {
                icon: MapPin,
                title: 'Ek Durak Ekle',
                desc: 'Güzergâh üstü 1-3 ara teslim veya yolcu durağı tanımlama.',
                tag: 'Ara Nokta',
              },
              {
                icon: Hourglass,
                title: 'Kısa Süre Bekle',
                desc: 'Durakta 5, 10, 15 dk bekleme süresi, dakikalık otomatik ücretlendirme.',
                tag: 'Bekleme Modu',
              },
              {
                icon: FileText,
                title: 'Teslimat Notu',
                desc: 'Kurye ekranına yansıyan net talimat (zil çalmayın, güvenliğe bırakın).',
                tag: 'Açıklama',
              },
              {
                icon: Key,
                title: 'Teslimat Kodu / PIN',
                desc: '4 haneli biniş ve teslim kodu + teslim anı fotoğraf doğrulaması.',
                tag: 'Güvenlik',
              },
              {
                icon: Radio,
                title: 'Canlı Takip',
                desc: 'Harita üstünde anlık kurye GPS konumu, tahmini varış ve rota takibi.',
                tag: 'Telemetri',
              },
              {
                icon: Sparkles,
                title: 'Fiyat Pazarlığı',
                desc: 'Düz hesap veya hızlı kabul prim teklifiyle karşılıklı esnek anlaşma.',
                tag: 'Esnek Fiyat',
              },
            ].map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-zinc-800 bg-zinc-950 space-y-1.5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {opt.tag}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">{opt.title}</h5>
                    <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: İLK SÜRÜMDE SINIRLI AÇILACAKLAR - Monochrome */}
      {(activeTab === 'all' || activeTab === 'limited') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                3. İlk Sürümde Sınırlı Açılacaklar & Saha Prensibi
              </h3>
            </div>
            <span className="text-[10px] text-white font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-700">
              KONTROLLÜ DAĞITIM
            </span>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white text-xs">
                  Neden Başlangıçta Tamamen Otomatik “Akıllı Rota Optimizasyonu” Yok?
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Yazılımda yapay zekâlı kara kutu algoritmaları kurmadan önce, <strong>operasyonun sahada kuryeler, paket boyutları ve İstanbul trafiğiyle nasıl aktığını gözlemlemek esastır</strong>. Sürücünün sokak hâkimiyetini ve işletmenin önceliklerini ezmeden, kontrollü sınırlı kapasiteyle başlatıyoruz.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-zinc-850 text-xs">
              <div className="p-3 bg-black rounded-xl border border-zinc-800 space-y-1">
                <span className="font-bold text-white block text-[11px]">📍 Birkaç Noktaya Dağıt</span>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Aynı yöndeki 1 ila 3 teslimat noktası. Aşırı karmaşık zincirler yerine kuryenin hafızasında rahat tutabileceği ardışık teslimat.
                </p>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800 space-y-1">
                <span className="font-bold text-white block text-[11px]">📦 Aynı Sürücüye 3–5 Paket</span>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Bir restorandan/mağazadan çıkan eşzamanlı siparişlerde tek kuryeye maksimum 3-5 paket yüklenir; gecikme ve soğuma riski sıfırlanır.
                </p>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800 space-y-1">
                <span className="font-bold text-white block text-[11px]">🎒 Çanta & Hacim Sınırı</span>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Sürücünün motosiklet çanta hacmine (standart 45L / XL 65L) ve kg sınırına göre sistem paket aşımını engeller.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ALTYAPISI HAZIR AMA İLK GÜN AKTİF OLMAYACAK MODÜLLER - Monochrome */}
      {(activeTab === 'all' || activeTab === 'phase2') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                4. Altyapısı Hazır Ama İlk Gün Pasif / Faz 2 Modülleri
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800 font-mono">
              ALTYAPI KODLANDI · İSTEĞE BAĞLI AÇILIR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: Truck,
                title: 'Büyük Ölçekli Toplu Teslimat',
                desc: 'Depodan aynı anda 50+ paket çıkışı ve toplu konsolidasyon.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Cpu,
                title: 'Gelişmiş Akıllı Rota Motoru',
                desc: 'Çok değişkenli TSP/VRP yapay zekâ rota optimizasyon motoru.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Building2,
                title: 'Çok Şubeli Kurumsal Operasyon',
                desc: 'Zincir markaların tüm şubelerini tek merkezden yönetme matrisi.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Share2,
                title: 'White-Label Çözümü',
                desc: 'Farklı marka, logo ve renk temalarıyla bağımsız kiralama.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Cloud,
                title: 'SaaS Abonelik Modeli',
                desc: 'Aylık/yıllık lisans kiralama ve çoklu işletme faturalandırma.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Network,
                title: 'MotoPilot Network',
                desc: 'Şehirlerarası veya bağımsız filo havuzlarının federasyon ağı.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Webhook,
                title: 'Büyük İşletme API Entegrasyonları',
                desc: 'ERP, Yemeksepeti, Trendyol, Getir vb. dış API webhook uçları.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
              {
                icon: Car,
                title: 'Otomobil / Panelvan Desteği',
                desc: '4 tekerlekli ticari araç, binek taksi ve panelvan kategorisi.',
                phase: 'Faz 2',
                status: 'Altyapı Hazır (Pasif)',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 relative group hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-zinc-500" />
                      <span className="text-[9px] font-mono font-bold text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {item.phase}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">{item.title}</h5>
                    <p className="text-[10px] text-zinc-400 leading-snug mt-1">{item.desc}</p>
                  </div>
                  <div className="pt-1.5 border-t border-zinc-850 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                    <span>{item.status}</span>
                    <span className="text-zinc-400 font-bold">Yönetici Paneli Kontrolünde</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
