import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Server,
  Cpu,
  Layers,
  Calendar,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Bike,
  Smartphone,
  LayoutDashboard,
  Check,
  Zap,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { LaunchStrategyMatrix } from '../common/LaunchStrategyMatrix';
import { SpecificationDocView } from './SpecificationDocView';

export const PresentationView: React.FC = () => {
  const { setActiveView } = usePlatform();
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    { id: 0, title: '00. Mimari Şartname (Kapsam Taslağı)' },
    { id: 14, title: '14. Lansman Matrisi (Aktif / Faz 2)' },
    { id: 1, title: '01. Sunuş & Yönetici Özeti' },
    { id: 2, title: '02. Sistem Nasıl Çalışıyor?' },
    { id: 3, title: '03. İki Uygulama, Bir Panel' },
    { id: 4, title: '04. Eşleştirme & Fiyatlama' },
    { id: 5, title: '05. Güvenlik & Doğrulama' },
    { id: 6, title: '06. Neden Rust? Altyapı' },
    { id: 7, title: '07. Ödeme & Komisyon' },
    { id: 8, title: '08. Yönetici Paneli' },
    { id: 9, title: '09. Mobil & Mimari' },
    { id: 10, title: '10. Geliştirme Takvimi' },
    { id: 11, title: '11. Yatırım & Ödeme Planı' },
    { id: 12, title: '12. 1 Yıl Ücretsiz Destek' },
    { id: 13, title: '13. Kapsam & Şartlar' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Document Header & Cover Banner - Apple HIG Showcase */}
      <div className="relative rounded-[36px] bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-10 shadow-2xl overflow-hidden text-[#F5F5F7]">
        {/* Subtle Apple ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071E3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top meta tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold tracking-wider text-[#0A84FF] uppercase font-mono text-[11px]">
                MotoPilot · Tasarım · Rev.04
              </span>
              <span className="text-[#636366]">|</span>
              <span className="text-[#8E8E93] font-mono">No: MP-2026-REV04</span>
            </div>

            <div className="flex items-center gap-2 text-[#8E8E93] text-[11px]">
              <span>Tarih: <strong className="text-white">1 Ekim 2026</strong></span>
              <span>·</span>
              <span className="text-[#30D158] font-mono font-medium">5 gün geçerli</span>
            </div>
          </div>

          {/* Main Title & Lead */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Motosiklet ve Kurye <br className="hidden sm:inline" />
              Çağırma Platformu
            </h1>
            <p className="text-sm sm:text-base text-[#8E8E93] leading-relaxed">
              Müşterinin tek dokunuşla motosiklet ya da kurye çağırdığı; en yakın sürücünün saniyeler içinde
              eşleştiği, yolculuğun ve paketin haritada canlı takip edildiği, ücretin kayıtlı karttan
              kendiliğinden çekildiği ve platform komisyonunun otomatik ayrıldığı iOS ve Android
              uygulamaları ile web yönetici paneli. Sunucu tarafı Rust ile inşa edilir.
            </p>
          </div>

          {/* Feature Badges - Apple Pill Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] text-white border border-white/[0.1] font-medium">
              2 Uygulama · 1 Panel · 1 Fiyat
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#0071E3]/20 text-[#0A84FF] border border-[#0071E3]/30 font-medium">
              Rust Tokio + Actix Web
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30 font-medium">
              PostgreSQL + PostGIS Harita
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FF9F0A]/15 text-[#FF9F0A] border border-[#FF9F0A]/30 font-medium">
              İki Kask Zorunlu (ECE 22.06)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] text-[#F5F5F7] border border-white/[0.1] font-medium">
              Canlı Konum · Eşleşme
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] text-[#F5F5F7] border border-white/[0.1] font-medium">
              Kartla Ödeme · Komisyon
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#30D158] text-black font-semibold shadow-sm">
              1 Yıl Destek + Sunucu
            </span>
          </div>

          {/* 3 Main Highlights (Sayfa 1 & 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                P R O J E · B E D E L İ
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                150.000 ₺ <span className="text-sm font-normal text-zinc-400">+ KDV</span>
              </div>
              <span className="text-xs text-zinc-400">2 uygulama, panel ve ödeme dâhil</span>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                G E L İ Ş T İ R M E · S Ü R E S İ
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                1 Ay
              </div>
              <span className="text-xs text-zinc-400">Sözleşme imzasından mağaza yayınına</span>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                D E S T E K · V E · S U N U C U
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                1 Yıl Ücretsiz
              </div>
              <span className="text-xs text-zinc-400">Canlı destek ve barındırma, ek bedel yok</span>
            </div>
          </div>

          {/* Parties Meta (Sayfa 1 & 15) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Teklif Veren</span>
              <span className="font-bold text-white text-sm">Blesyum Yazılım ve Teknoloji Ltd. Şti.</span>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                blesyum.com · hello@blesyum.com · +90 850 307 71 77
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Teklif Alan</span>
              <span className="font-bold text-white text-sm">Bedirhan İbanoğlu</span>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                +90 505 677 93 79 · Motosiklet ve Kurye Platformu
              </div>
            </div>
          </div>

          {/* Live Action CTA Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-400">
              Sistemi canlı olarak hemen deneyimlemek için mod seçin:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('split')}
                className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Eşzamanlı Canlı Simülasyonu Başlat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Selection Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            T E K L İ F · B Ö L Ü M L E R İ ( 1 3 · B Ö L Ü M )
          </span>
          <span className="text-xs text-zinc-500">Tıklayarak inceleyebilirsiniz</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                activeSection === sec.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* CHAPTER 0: MİMARİ ŞARTNAME (KAPSAM TASLAĞI & STATÜ AYRIMI) */}
      {activeSection === 0 && (
        <div className="space-y-6">
          <SpecificationDocView />
        </div>
      )}

      {/* CHAPTER 14: İLK LANSMAN STRATEJİSİ & FAZ 1 / FAZ 2 MATRİSİ */}
      {activeSection === 14 && (
        <div className="space-y-6">
          <LaunchStrategyMatrix
            onSelectService={(service) => {
              setActiveView('customer');
            }}
          />
        </div>
      )}

      {/* CHAPTER 1: Sunuş ve Yönetici Özeti (Sayfa 2) - Monochrome */}
      {activeSection === 1 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">0 1 · S U N U Ş</span>
            <h2 className="text-2xl font-bold font-display text-white">
              Sayın Bedirhan İbanoğlu,
            </h2>
          </div>

          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed max-w-4xl">
            <p>
              Motosikletle yolcu taşıma ve motokurye hizmetlerini tek bir uygulamada buluşturacak platformunuz için
              hazırladığımız teklifi bilgilerinize sunuyoruz. Müşteriniz uygulamayı açar, motosiklet mi kurye mi istediğini
              seçer, ücreti önceden görür ve tek dokunuşla çağırır; en yakın müsait sürücü saniyeler içinde eşleşir ve müşteri
              onu haritada canlı izler.
            </p>
            <p>
              Kurgunun kalbinde iki şey var: <strong>hızlı eşleşme</strong> ve <strong>her işlemden kazanç</strong>. Talep en yakın kuryeye anında düşer,
              kabul etmezse sıradakine geçer; yolculuk ya da teslimat bittiğinde ücret müşterinin kayıtlı kartından kendiliğinden
              çekilir, platform komisyonunuz otomatik ayrılır ve kuryenin kazancı hakediş hesabına yazılır. Kimse elle hesap tutmaz,
              her kuruş kayıt altındadır.
            </p>
            <p>
              Sistem üç parçadan oluşur: müşteri uygulaması, kurye uygulaması ve tüm operasyonu yönettiğiniz web yönetici
              paneli. Sunucu tarafı <strong>Rust</strong> ile yazılır; iOS ve Android yayını, 1 yıl koşulsuz ücretsiz canlı destek ve 1 yıl sunucu
              barındırma dâhildir; bu süre boyunca sizden sunucu kirası istenmez. Fiyata dâhil olmayan tek gider, web panelinin alan adıdır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
            <button
              onClick={() => setActiveView('customer')}
              className="p-4 bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-left transition-all group"
            >
              <Smartphone className="w-5 h-5 text-white mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white text-sm">Müşteri Uygulaması</h3>
              <p className="text-xs text-zinc-400 mt-1">iOS & Android · Yolcu ve Paket Çağrısı</p>
              <span className="text-[11px] text-white font-bold mt-2 inline-flex items-center gap-1">
                Arayüzü Aç <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            <button
              onClick={() => setActiveView('courier')}
              className="p-4 bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-left transition-all group"
            >
              <Bike className="w-5 h-5 text-white mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white text-sm">Kurye Uygulaması</h3>
              <p className="text-xs text-zinc-400 mt-1">iOS & Android · Sürücü & Talep Kabul</p>
              <span className="text-[11px] text-white font-bold mt-2 inline-flex items-center gap-1">
                Arayüzü Aç <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            <button
              onClick={() => setActiveView('admin')}
              className="p-4 bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-left transition-all group"
            >
              <LayoutDashboard className="w-5 h-5 text-white mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white text-sm">Yönetici Paneli</h3>
              <p className="text-xs text-zinc-400 mt-1">Web · Tüm Harita ve Operasyon Merkezi</p>
              <span className="text-[11px] text-white font-bold mt-2 inline-flex items-center gap-1">
                Arayüzü Aç <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* CHAPTER 2: Sistem Nasıl Çalışıyor? (Sayfa 3) - Monochrome */}
      {activeSection === 2 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">0 2 · S İ S T E M · A K I Ş I</span>
            <h2 className="text-2xl font-bold font-display text-white">Sistem Nasıl Çalışıyor?</h2>
            <p className="text-xs text-zinc-400">
              Müşterinin uygulamayı açmasından ücretin karttan çekilmesine kadar tüm süreç, tek bir zincir hâlinde ilerler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">ADIM 1</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded text-[10px] border border-zinc-800 font-mono">KAYITLI KART</span>
              </div>
              <h3 className="font-bold text-white text-sm">Müşteri üye olur, kartını bir kez kaydeder</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Telefon numarası ve SMS koduyla üye olur. Kartını bir kez ekler; kart bilgisi ödeme kuruluşunda saklanır, sonraki çağrıda yeniden girilmez.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">ADIM 2</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded text-[10px] border border-zinc-800 font-mono">ÖN FİYAT</span>
              </div>
              <h3 className="font-bold text-white text-sm">Motosiklet ya da kurye seçer, ücreti önceden görür</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Haritadan alış ve varış noktasını belirler. Motosiklet seçerse kendisi yolculuk yapar; Kurye seçerse paketin bilgisini ve alıcının iletişimini girer.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">ADIM 3</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-white rounded text-[10px] border border-zinc-700 font-mono font-bold">ANLIK</span>
              </div>
              <h3 className="font-bold text-white text-sm">En yakın müsait kurye saniyeler içinde eşleşir</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Talep, konumu en yakın ve çevrim içi olan kuryeye düşer. Kabul etmezse talep sıradakine geçer; kilit mekanizması sayesinde aynı iş iki kuryeye verilmez.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">ADIM 4</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded text-[10px] border border-zinc-800 font-mono">CANLI KONUM</span>
              </div>
              <h3 className="font-bold text-white text-sm">Kurye haritada canlı izlenir</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Müşteri kuryenin adını, fotoğrafını, plakasını ve puanını görür; motosikletin yaklaşmasını haritada saniye saniye izler, tahmini varış süresi güncellenir.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">ADIM 5</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded text-[10px] border border-zinc-800 font-mono">GÜVENLİK</span>
              </div>
              <h3 className="font-bold text-white text-sm">Biniş kodu ya da teslim onayıyla başlar ve biter</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yolcu, kuryeye 4 haneli biniş kodunu söyler ve yolculuk başlar. Paket gönderiminde alıcı teslim kodunu verir, kurye teslim anının fotoğrafını yükler.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">ADIM 6</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded text-[10px] border border-zinc-800 font-mono">OTOMATİK</span>
              </div>
              <h3 className="font-bold text-white text-sm">Ücret karttan çekilir, komisyon kendiliğinden ayrılır</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                İş bittiğinde ücret kayıtlı karttan çekilir, dijital fiş gönderilir. Platform komisyonu ayrılır, kalan tutar kuryenin hakedişine yazılır. Puanlama yapılır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 6: Neden Rust? (Sayfa 7-8) - Monochrome */}
      {activeSection === 6 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">0 6 · T E K N O L O J İ · T E R C İ H İ</span>
            <h2 className="text-2xl font-bold font-display text-white">Neden Rust?</h2>
            <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Türkiye'de yazılım firmalarının büyük çoğunluğu projelerini PHP, Node.js veya Java ile yazar. Biz yazmıyoruz. Sunucu tarafını, dünyanın en büyük teknoloji şirketlerinin son on yılda kendi altyapılarını taşıdığı dille geliştiriyoruz: <strong>Rust</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="text-3xl font-extrabold font-mono text-white">%70</div>
              <h4 className="text-xs font-bold text-white uppercase">Cloudflare İşlemci Düşüşü</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cloudflare NGINX altyapısını Rust'a taşıdığında işlemci tüketiminde elde ettiği düşüş.
              </p>
            </div>

            <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="text-3xl font-extrabold font-mono text-white">%67</div>
              <h4 className="text-xs font-bold text-white uppercase">Bellek Tüketim Tasarrufu</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Aynı trafikte üçte bir donanım kullanımı. Sunucu kira faturanızı minimumda tutar.
              </p>
            </div>

            <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="text-3xl font-extrabold font-mono text-white">%76 → %24</div>
              <h4 className="text-xs font-bold text-white uppercase">Android Güvenlik Açığı</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Google Android'de bellek hatalarının Rust ile düşürüldüğü seviye. Sıfır çökme garantisi.
              </p>
            </div>
          </div>

          {/* Big Tech Companies Grid (Sayfa 8) */}
          <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Bu Dili Kimler Kullanıyor? (Sayfa 8)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-white block">Cloudflare</span>
                <span className="text-[11px] text-zinc-400">İnternet proxy altyapısı</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-white block">Microsoft</span>
                <span className="text-[11px] text-zinc-400">Windows çekirdeği</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-white block">Google</span>
                <span className="text-[11px] text-zinc-400">Android bileşenleri</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="font-bold text-white block">Discord</span>
                <span className="text-[11px] text-zinc-400">Gerçek zamanlı sunucular</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 10 & 11: Takvim ve Fiyatlandırma (Sayfa 12-13) - Monochrome */}
      {(activeSection === 10 || activeSection === 11) && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">1 0 · T A K V İ M · & · 1 1 · Y A T I R I M</span>
            <h2 className="text-2xl font-bold font-display text-white">1 Ayda Yayına & Yatırım Planı</h2>
          </div>

          {/* 4 Weeks Timeline (Sayfa 12) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between font-bold text-white">
                <span>1. HAFTA</span>
                <span className="font-mono text-zinc-400">%40 Ödeme</span>
              </div>
              <h4 className="font-bold text-white text-sm">Analiz, Tasarım & Başvurular</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Hizmet bölgeleri, tarifeler, komisyon oranları ve arayüz tasarımları. Apple, Google ve ödeme kuruluşu başvurusu.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="font-bold text-white">2. HAFTA</div>
              <h4 className="font-bold text-white text-sm">Sunucu & Canlı Konum</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Rust sunucu, WebSocket canlı konum, eşleştirme ve fiyatlama motoru. Müşteri çağırır, kurye kabul eder.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="font-bold text-white">3. HAFTA</div>
              <h4 className="font-bold text-white text-sm">Ödemeler & Yönetici Paneli</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Kart kaydı, otomatik çekim, biniş kodu, teslim fotoğrafı, kurye belge onayı, canlı harita ve raporlar.
              </p>
            </div>

            <div className="p-4 bg-black rounded-2xl border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between font-bold text-white">
                <span>4. HAFTA</span>
                <span className="font-mono text-zinc-400">%60 Ödeme</span>
              </div>
              <h4 className="font-bold text-white text-sm">Saha Testi & Mağaza Yayını</h4>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Gerçek motosikletle sahada test, App Store ve Google Play yayını, yönetici ekibinize panel eğitimi.
              </p>
            </div>
          </div>

          {/* Pricing Table (Sayfa 13) */}
          <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-4">
            <h3 className="text-sm font-bold text-white">Yatırım ve Ödeme Planı (Sayfa 13)</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-850">
                <span className="text-zinc-300">Motosiklet ve Kurye Platformu (2 Uygulama + Web Panel + Rust Sunucu)</span>
                <span className="font-mono font-bold text-white">150.000,00 ₺</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-850">
                <span className="text-zinc-300">Kredi kartı, otomatik çekim, komisyon ve hakediş entegrasyonu</span>
                <span className="text-white font-bold">Dâhil</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-850">
                <span className="text-zinc-300">App Store ve Google Play mağaza yayınları, güvenlik ve teknik doküman</span>
                <span className="text-white font-bold">Dâhil</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-850">
                <span className="text-zinc-300">1 yıl ücretsiz canlı destek, bakım ve sunucu barındırma</span>
                <span className="text-zinc-300 font-bold">0 ₺ (Ücretsiz)</span>
              </div>
              <div className="flex justify-between py-3 text-sm font-bold text-white">
                <span>ÖDENECEK TOPLAM (KDV DÂHİL)</span>
                <span className="text-base text-white font-mono font-black">180.000,00 ₺</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 12 & 13: Destek ve Şartlar (Sayfa 14-15) - Monochrome */}
      {(activeSection === 3 || activeSection === 4 || activeSection === 5 || activeSection === 7 || activeSection === 8 || activeSection === 9 || activeSection === 12 || activeSection === 13) && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">1 2 · D E S T E K · & · 1 3 · Ş A R T L A R</span>
            <h2 className="text-2xl font-bold font-display text-white">
              1 Yıl Koşulsuz Destek ve Genel Şartlar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-3">
              <h4 className="font-bold text-white uppercase text-xs">Teklife Dâhil Olanlar</h4>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Müşteri uygulaması (iOS + Android)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Kurye uygulaması (iOS + Android)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Web yönetici paneli (tüm operasyon)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Rust ile sunucu, API ve veri tabanı</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Canlı konum takibi ve harita entegrasyonu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>12 ay ücretsiz sunucu barındırma</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-3">
              <h4 className="font-bold text-zinc-400 uppercase text-xs">Fiyata Dâhil Olmayan Tek Gider</h4>
              <p className="text-zinc-300 leading-relaxed">
                Yalnızca web paneli için alan adı (domain). Bunun dışında sunucu kirası, bakım faturası veya ilk yıl için herhangi bir ek ücret yoktur.
              </p>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-300 text-[11px]">
                Fikrî mülkiyet: Tüm bedel ödendiğinde kaynak kodu ve tüm varlıklar müşteriye eksiksiz devredilir.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
