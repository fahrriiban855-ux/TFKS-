import React, { useState } from 'react';
import {
  Bike,
  Package,
  Building,
  ShieldCheck,
  Clock,
  ArrowRight,
  Phone,
  CheckCircle2,
  Navigation,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { WebsiteHeader } from './WebsiteHeader';
import { WebsiteFooter } from './WebsiteFooter';
import { FareEstimatorModal } from './FareEstimatorModal';
import { DriverApplicationModal } from './DriverApplicationModal';
import { MerchantLeadModal } from './MerchantLeadModal';
import { LegalModal } from './LegalModal';
import { ContentArticleModal } from './ContentArticleModal';
import { GuideArticle } from '../../types/website';

const POPULAR_ROUTES = [
  { from: 'Beşiktaş', to: 'Kadıköy', dist: '12 km', motoTime: '14 Dk', carTime: '55 Dk', fare: '260 ₺' },
  { from: 'Levent', to: 'Maslak', dist: '6 km', motoTime: '8 Dk', carTime: '35 Dk', fare: '150 ₺' },
  { from: 'Kadıköy', to: 'Ataşehir', dist: '9 km', motoTime: '11 Dk', carTime: '40 Dk', fare: '205 ₺' },
  { from: 'Şişli', to: 'Taksim', dist: '4.5 km', motoTime: '7 Dk', carTime: '28 Dk', fare: '125 ₺' },
];

const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'guide-1',
    title: 'İstanbul Boğaz Geçişinde Motosikletin Süre ve Yakıt Analizi',
    summary: 'Köprü trafiğinde dur-kalk yapan otomobillere kıyasla motosiklet yolculuğunun sağladığı süre ve karbon emisyonu tasarrufu.',
    readingTimeMinutes: 4,
    publishDate: 'Ekim 2026',
    category: 'urban_mobility',
    contentMarkdown: `### İstanbul Trafiğinde Boğaz Geçişi Neden Motosikletle Yapılmalı?

İstanbul'da günde yaklaşık 2.5 milyon araç iki yaka arasında geçiş yapmaktadır. Zirve saatlerde (08:00 - 10:00 ve 17:30 - 20:30) 15 Temmuz Şehitler Köprüsü ve Fatih Sultan Mehmet Köprüsü üzerinde ortalama araç hızı saatte 9 ila 12 km seviyesine düşmektedir.

#### 1. Süre Tasarrufu:
Motosikletler, yasal emniyet şeritleri ve kontrollü şerit filtreleme (lane filtering) kurallarına uygun biçimde seyrederek dur-kalk trafiğine takılmaz. Beşiktaş - Kadıköy arası sarı taksiyle 55 ila 75 dakika sürerken, MotoPilot yolcusu olarak bu mesafe 14 ila 16 dakikada kat edilir.

#### 2. Şeffaf ve Bekleme Zamsız Fiyat:
Standart taksimetreler sıkışık trafikte bekleme tarifesi işlettiği için tahmin edilemeyen yüksek faturalar çıkarır. MotoPilot'ta ise yolculuk başında onayladığınız net mesafe ücreti dışında sürpriz ek ücret alınmaz.`,
  },
  {
    id: 'guide-2',
    title: 'ECE 22.06 Kask Standardı ve Yolcu Güvenliği Protokolü',
    summary: 'MotoPilot sürücülerinin yolcuya temin etmekle yükümlü olduğu uluslararası güvenlik onaylı kasklar ve hijyen kuralları.',
    readingTimeMinutes: 3,
    publishDate: 'Eylül 2026',
    category: 'safety',
    contentMarkdown: `### Can Güvenliği ve Kask Standartlarımız

Moto TAG hizmetinde güvenliğiniz taviz verilemez bir önceliktir. Platformumuza kayıtlı her sürücü aşağıdaki ekipman ve hijyen protokolüne uymakla yükümlüdür:

#### 1. ECE 22.06 Sertifikasyonu:
Avrupa Birliği'nin en güncel ve en katı çarpışma testi normu olan ECE 22.06 standardına sahip olmayan hiçbir kask yolcu kullanımına sunulamaz. Kasklar rotasyonel darbe emilimi ve çene koruması testlerinden tam not almıştır.

#### 2. Tek Kullanımlık Hijyen Bonesi:
Her seyahat öncesinde sürücünüz ambalajlı, tek kullanımlık dezenfekte saç bonesi takdim eder. Bone takılmadan kask giyilmez.

#### 3. PIN Doğrulaması ve Canlı Takip:
Yolculuğa başlamadan önce sürücüye 4 haneli biniş kodunuzu söylersiniz. Bu kod girilmeden seyahat başlamaz ve anlaşmalı kaza sigortası poliçesi devreye girmez.`,
  },
  {
    id: 'guide-3',
    title: 'Restoranlar İçin Kurye İstihdam Maliyeti vs. Dış Kaynak Analizi',
    summary: 'Motosiklet amortismanı, sigorta ve sabit kurye maaşları yerine sipariş başına esnek kurye çağırmanın karlılık tablosu.',
    readingTimeMinutes: 5,
    publishDate: 'Eylül 2026',
    category: 'driver_tips',
    contentMarkdown: `### İşletmeler İçin Lojistik Karlılık Raporu

Bir restoranın kendi bünyesinde 2 adet tam zamanlı kurye ve motosiklet bulundurmasının 2026 yılı aylık ortalama maliyeti:
- 2 Kurye Asgari Ücret + SGK + Yemek: ~94.000 TL
- 2 Motosiklet Kiralama / Amortisman & Kasko: ~28.000 TL
- Yakıt, Lastik ve Periyodik Bakım: ~18.000 TL
- **Toplam Sabit Aylık Gider:** ~140.000 TL

#### MotoPilot Dış Kaynak Modeli İle Tasarruf:
Sipariş olmayan saatlerde kurye maliyeti sıfırdır. Yağmurlu ve yoğun saatlerde 15 dakikada 5 kurye çağırabilir, sakin saatlerde hiç ödeme yapmazsınız. Bu esneklik ortalama bir restoranın teslimat giderlerini %38 oranında düşürür.`,
  },
];

const FAQS = [
  {
    q: 'M0 ilk lansmanda hangi hizmetler sunuluyor? Motosikletli yolcu (motor taksi) aktif mi?',
    a: 'İlk lansman iki ana hizmetle birlikte yapılır: 1. Taksi (TAXI_RIDE) ve 2. Kurye / Teslimat (PERSONAL_DELIVERY & MERCHANT_DELIVERY). Motosikletli yolcu (MOTO_PASSENGER_RIDE) gelecek hizmettir; İl UKOME / UGETAM yazılı yasal teyidi alınmadan M0 sürümünde aktif edilmez.',
  },
  {
    q: 'Taksi ve kurye çağrılarında komisyon veya gizli hizmet bedeli var mı?',
    a: 'Hayır. M0 Sıfır Komisyon İlkesi (M0-ZERO-COMMISSION-2026-V1) uyarınca taksi yolcusundan, taksi şoföründen, bireysel göndericiden ve kuryeden %0 platform komisyonu alınır. Ödenen tutarın %100’ü doğrudan sürücüye/kuryeye aktarılır.',
  },
  {
    q: 'Esnaf ve işletmeler için ücretlendirme ve 2 hafta ücretsiz kampanya nasıl işler?',
    a: 'İşletmelerden sipariş başına yüzdesel komisyon (%0) kesilmez. Yeni katılan doğrulanmış işletmeler (VKN/TCKN ve IBAN kontrolü ile tek seferlik) 14 gün boyunca ücretsiz tanışma kampanyasından yararlanır. Süre sonunda otomatik ücretli yenileme yapılmaz; işletmenin açık onayıyla sabit aylık üyeliğe geçilir.',
  },
  {
    q: 'Sürücü veya kurye olmak için hangi şartlar aranır?',
    a: 'Geçerli sürücü belgesi, araç ruhsatı, temiz adli sicil kaydı ve hizmet standartlarına uygun ekipman gereklidir. Onaylanan tüm sürücü ve kuryeler %0 komisyon (%100 net hakediş) ile çalışır.',
  },
  {
    q: 'İşletmeler ve restoranlar için toplu teslimat nasıl çalışır?',
    a: 'İşletme panelimizden tek seferde 5 teslimat noktasına kadar çoklu dağıtım (Multi-Drop) oluşturabilir veya B2B API ile siparişlerinizi otomatik aktarabilirsiniz. Sipariş başı %0 komisyon uygulanır.',
  },
];

export const WebsiteMainView: React.FC = () => {
  const { setActiveView } = usePlatform();
  const [showEstimator, setShowEstimator] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'kvkk' | 'privacy' | 'terms' | 'assurance' | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<GuideArticle | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#0071E3] selection:text-white">
      {/* 1. Header */}
      <WebsiteHeader
        onOpenEstimator={() => setShowEstimator(true)}
        onOpenDriverModal={() => setShowDriverModal(true)}
        onOpenMerchantModal={() => setShowMerchantModal(true)}
        onScrollToSection={scrollToSection}
      />

      {/* 2. Hero Section */}
      <section id="hero" className="relative pt-12 pb-20 overflow-hidden border-b border-white/[0.06]">
        {/* Apple subtle ambient gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#0A84FF]/15 via-[#0071E3]/10 to-[#BF5AF2]/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-10 text-center">
          {/* Subtle Editorial Kicker (Zero-Pill Rule) */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0A84FF]">
            <span>M0 Lansman: 1. Taksi & 2. Kurye / Teslimat</span>
            <span aria-hidden="true">·</span>
            <span>%0 Platform Komisyonu</span>
            <span aria-hidden="true">·</span>
            <span>Esnafa 2 Hafta Ücretsiz Başlangıç</span>
          </div>

          {/* Display Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance">
              Adil Ulaşım ve Teslimat. <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-[#0A84FF] bg-clip-text text-transparent">
                %0 Komisyonlu Taksi ve Kurye Ağı.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Şoför ve kuryeyi sömürmeyen, esnafın yanında duran çok platformlu ulaşım ve teslimat ekosistemi. Taksi ve kurye çağrılarında %0 komisyon alınır; ödenen tutarın %100'ü doğrudan emekçiye aktarılır.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveView('customer')}
              className="px-6 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-[0_4px_24px_rgba(0,113,227,0.45)] transition-all flex items-center gap-2 active:scale-95"
            >
              <Bike className="w-4 h-4 stroke-[2.2]" />
              <span>Taksi veya Kurye Çağır</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowEstimator(true)}
              className="px-6 py-4 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-semibold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 active:scale-95"
            >
              <Clock className="w-4 h-4 text-[#0A84FF]" />
              <span>Ücret ve Süre Hesapla</span>
            </button>

            <button
              onClick={() => setShowDriverModal(true)}
              className="px-6 py-4 bg-[#30D158]/15 hover:bg-[#30D158]/25 border border-[#30D158]/35 text-[#30D158] font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 active:scale-95"
            >
              <span>%0 Komisyonla Sürücü / Kurye Ol</span>
            </button>
          </div>

          {/* Trust Metrics Strip (Claim-to-Proof Adjacency) */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/[0.08] text-left">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl font-black font-mono text-[#30D158]">%0</div>
              <div className="text-[11px] text-[#8E8E93] mt-0.5">Taksi & Kurye Sipariş Komisyonu</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl font-black font-mono text-white">%100</div>
              <div className="text-[11px] text-[#8E8E93] mt-0.5">Doğrudan Şoför & Kurye Hakedişi</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl font-black font-mono text-[#BF5AF2]">14 Gün</div>
              <div className="text-[11px] text-[#8E8E93] mt-0.5">Esnafa Ücretsiz Tanışma Paketi</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-2xl font-black font-mono text-[#0A84FF]">7/24</div>
              <div className="text-[11px] text-[#8E8E93] mt-0.5">PIN Doğrulamalı Canlı Takip</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Routes Quick Strip */}
      <section className="py-12 border-b border-white/[0.06] bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF]">
                CANLI GÜZERGAH ÖRNEKLERİ
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Popüler İstanbul Hatlarında Zaman ve Ücret Karşılaştırması
              </h2>
            </div>
            <button
              onClick={() => setShowEstimator(true)}
              className="text-xs text-[#0A84FF] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Kendi Güzergahınızı Hesaplayın</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {POPULAR_ROUTES.map((route, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#161618] border border-white/[0.08] hover:border-[#0A84FF]/40 transition-all space-y-3 cursor-pointer group"
                onClick={() => setShowEstimator(true)}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{route.from}</span>
                  <span className="text-[#8E8E93]">→</span>
                  <span>{route.to}</span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-[#8E8E93] block">Motosikletle:</span>
                    <span className="text-base font-extrabold text-[#30D158] font-mono">
                      {route.motoTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8E8E93] block">Otomobille:</span>
                    <span className="text-xs text-[#FF453A] line-through font-mono">
                      {route.carTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                  <span className="font-mono font-bold text-white text-sm">{route.fare}</span>
                  <span className="text-[10px] text-[#0A84FF] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Seç <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Services Bento Grid */}
      <section id="services" className="py-20 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF]">
              ÇEKİRDEK HİZMETLERİMİZ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Her Mobilite İhtiyacına Özel Profesyonel Çözüm
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Yolcu taşımacılığından e-ticaret dağıtımına, tüm süreçler lisanslı donanım ve merkezi denetim altında yürütülür.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Taksi (TAXI_RIDE) */}
            <div className="p-7 rounded-[32px] bg-[#161618] border border-white/[0.08] hover:border-[#0A84FF]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/20 border border-[#0071E3]/30 flex items-center justify-center text-[#0A84FF]">
                  <Bike className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">1. Taksi (TAXI_RIDE — %0 Komisyon)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    İlk lansman ana hizmetimiz. Yolcudan ve taksi şoföründen %0 platform komisyonu alınır; ödenen ücretin %100'ü şoföre kalır.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>%0 Platform Komisyonu & %100 Şoför Hakedişi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>PIN kodlu biniş doğrulaması ve şeffaf tarife</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>Haritada canlı rota paylaşımı ve acil durum butonu</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('customer')}
                className="w-full py-3.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Hemen Taksi Çağır</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Bireysel Kurye (PERSONAL_DELIVERY) */}
            <div className="p-7 rounded-[32px] bg-[#161618] border border-white/[0.08] hover:border-[#30D158]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#30D158]/20 border border-[#30D158]/30 flex items-center justify-center text-[#30D158]">
                  <Package className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">2. Bireysel Kurye (PERSONAL_DELIVERY)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Evrak, anahtar, ilaç veya paket gönderimlerinde göndericiden ve kuryeden %0 komisyon alınır; teslimat ücretinin tamamı kuryeye aktarılır.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>%0 Platform Komisyonu — %100 Kurye Hakedişi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>Alıcıya özel teslimat PIN kodu ve fotoğraf teyidi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>Anlık veya zaman ayarlı (Planlı) kurye çağırma</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('customer')}
                className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Paket Kuryesi İste</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: İşletme & Esnaf Teslimatı (MERCHANT_DELIVERY) */}
            <div className="p-7 rounded-[32px] bg-[#161618] border border-white/[0.08] hover:border-[#BF5AF2]/40 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#BF5AF2]/20 border border-[#BF5AF2]/30 flex items-center justify-center text-[#BF5AF2]">
                  <Building className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">Esnaf & İşletme Teslimatı (MERCHANT_DELIVERY)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Esnaf ve küçük işletmelerden sipariş başına yüzdesel komisyon (%0) kesilmez. Yeni işletmelere 2 hafta ücretsiz tanışma kampanyası sunulur.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>Sipariş Başı %0 Komisyon + 14 Gün Ücretsiz Başlangıç</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>Tek tıkla çoklu adres dağıtımı (Multi-Drop)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                    <span>Otomatik ücretli yenileme yok; açık onaylı üyelik</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowMerchantModal(true)}
                className="w-full py-3.5 bg-[#BF5AF2] hover:bg-[#A84EE2] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>2 Hafta Ücretsiz İşletme Kaydı</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Districts & Coverage Map Section */}
      <section id="districts" className="py-20 border-b border-white/[0.06] bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF]">
                HİZMET KAPSAMI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                İstanbul'un Ana Koridorlarında Kesintisiz Kurye Ağı
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Aşağıdaki ilçelerde filo yoğunluğumuz sayesinde ortalama kurye eşleşme ve kapıya varış süresi 3 ila 5 dakikadır.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Kadıköy', sub: 'Moda, Bağdat Cd, Fikirtepe', time: '3 Dk' },
              { name: 'Beşiktaş', sub: 'Levent, Etiler, Barbaros', time: '4 Dk' },
              { name: 'Şişli', sub: 'Mecidiyeköy, Nişantaşı', time: '3 Dk' },
              { name: 'Üsküdar', sub: 'Altunizade, Çamlıca', time: '5 Dk' },
              { name: 'Sarıyer', sub: 'Maslak, İstinye, Ayazağa', time: '5 Dk' },
              { name: 'Ataşehir', sub: 'Batı Ataşehir, Finans Merkezi', time: '4 Dk' },
            ].map((district, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#161618] border border-white/[0.08] space-y-2 hover:border-[#0A84FF]/40 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MapPin className="w-3.5 h-3.5 text-[#0A84FF]" />
                  <span>{district.name}</span>
                </div>
                <p className="text-[10px] text-zinc-400 truncate">{district.sub}</p>
                <div className="text-[11px] font-mono font-bold text-[#30D158]">
                  Ortalama {district.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Driver Recruitment Funnel Card */}
      <section className="py-20 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-[36px] bg-gradient-to-r from-[#161618] via-[#1C1C1E] to-[#161618] border border-white/[0.12] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#30D158]">
                <Zap className="w-4 h-4" />
                <span>Sürücü & Kurye Ortaklığı</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                %0 Platform Komisyonu İle Çalışın. <br />
                Kazancınızın %100'ü Sizin Olsun.
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Şoförü ve kuryeyi sömürmeyen adil platform modeli. Taksi ve kurye seferlerinizde %0 komisyon kesilir; kazancınızın tamamını banka hesabınıza anında FAST ile çekersiniz.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <span className="font-bold text-white block">Anında Ödeme</span>
                  <span className="text-[11px] text-zinc-400">Gün sonunda hesaba FAST aktarımı</span>
                </div>
                <div>
                  <span className="font-bold text-white block">Görev Primleri</span>
                  <span className="text-[11px] text-zinc-400">Hedef teslimata ek nakit bonus</span>
                </div>
                <div>
                  <span className="font-bold text-white block">Davet Bonusu</span>
                  <span className="text-[11px] text-zinc-400">Arkadaşını getirene +500 ₺</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowDriverModal(true)}
                  className="px-7 py-4 bg-[#30D158] hover:bg-[#34C759] text-black font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_4px_20px_rgba(48,209,88,0.4)] transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Hemen Sürücü Başvurusu Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Guides & Articles Section */}
      <section className="py-20 border-b border-white/[0.06] bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF]">
                BİLGİ MERKEZİ & REHBERLER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Kentsel Mobilite, Güvenlik ve Lojistik Kılavuzları
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUIDE_ARTICLES.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-6 rounded-[28px] bg-[#161618] border border-white/[0.08] hover:border-[#0A84FF]/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-[#8E8E93]">
                    <span>{art.publishDate}</span>
                    <span>·</span>
                    <span>{art.readingTimeMinutes} dk okuma</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#0A84FF] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A84FF]">
                  <span>Makaleyi Oku</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF]">
              MERAK EDİLENLER
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#161618] border border-white/[0.08] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-white"
                  >
                    <span>{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 text-[#8E8E93]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Mobile Sticky Action Dock (Under 15% viewport height rule) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#161618]/95 backdrop-blur-2xl border-t border-white/[0.1] p-3 flex items-center gap-2.5 shadow-2xl">
        <a
          href="tel:+908508406686"
          className="flex-1 py-3 px-3 bg-white/[0.08] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>0850 840 66 86</span>
        </a>

        <button
          onClick={() => setActiveView('customer')}
          className="flex-1 py-3 px-3 bg-[#0071E3] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
        >
          <Bike className="w-4 h-4" />
          <span>Hemen Çağır</span>
        </button>
      </div>

      {/* 10. Modals */}
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

      <ContentArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* 11. Footer */}
      <WebsiteFooter
        onOpenLegalModal={(tab) => setLegalModalTab(tab)}
        onOpenDriverModal={() => setShowDriverModal(true)}
        onOpenMerchantModal={() => setShowMerchantModal(true)}
      />
    </div>
  );
};
