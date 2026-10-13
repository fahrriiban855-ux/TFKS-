import React, { useState } from 'react';
import {
  Smartphone,
  Bike,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Package,
  Layers,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  PhoneCall,
  Coins,
  Store,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const SpecificationDocView: React.FC = () => {
  const { setActiveView } = usePlatform();
  const [filterClause, setFilterClause] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="space-y-8 text-xs text-[#F5F5F7]">
      {/* Top Banner - Apple HIG Card */}
      <div className="p-6 sm:p-8 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0071E3] text-white font-mono font-semibold text-[10px]">
                Resmi Şartname
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] text-[#8E8E93] font-mono text-[10px]">
                Rev.04 Mimari Kapsamı
              </span>
            </div>
            <span className="text-[#8E8E93] font-mono text-[11px]">
              Doküman Kodu: MP-SPEC-2026-V1
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            MotoPilot Tasarım ve Geliştirme Kapsamı Şartnamesi
          </h2>

          <div className="p-3.5 bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 rounded-2xl text-[#F5F5F7] text-xs leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FF9F0A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Bağlayıcı Prensip:</strong> Bu metin tasarım ve geliştirme kapsamı taslağıdır. Onaylanmamış kurallar <span className="text-[#FF9F0A] font-semibold">öneri olarak kalır</span>; çalışan özellik gibi sunulmaz.
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'Tüm Şartname' },
              { id: 'structure', label: '1. Uygulama Yapısı' },
              { id: 'customer', label: '2. Müşteri / İşletme' },
              { id: 'courier', label: '3. Sürücü / Kurye' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterClause(f.id)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  filterClause === f.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-[#8E8E93] hover:text-white border border-white/[0.08]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: MOTOPİLOT'UN UYGULAMA YAPISI */}
      {(filterClause === 'all' || filterClause === 'structure') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <h3 className="text-base font-bold text-white tracking-wide">
                1. MotoPilot’un Uygulama Yapısı
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              3 Arayüz · Ortak Operasyon
            </span>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-300 leading-relaxed space-y-3">
            <p>
              Platform, kullanıcı türlerine ve operasyonel rollerine göre <strong>üç ayrı arayüz</strong> ve bunların bağlı olduğu <strong>ortak bir operasyon altyapısı</strong> üzerine kurgulanmıştır:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-zinc-850 rounded-xl overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-200 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3 border-b border-zinc-800">Arayüz</th>
                    <th className="p-3 border-b border-zinc-800">Kim Kullanır?</th>
                    <th className="p-3 border-b border-zinc-800">Ne Yapar?</th>
                    <th className="p-3 border-b border-zinc-800 text-right">Canlı Erişim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-white" />
                      <span>Müşteri / İşletme Uygulaması</span>
                    </td>
                    <td className="p-3 text-zinc-300">
                      Yolcu, paket gönderen kişi, işletme sahibi ve yetkili çalışanı.
                    </td>
                    <td className="p-3 text-zinc-400">
                      Talep oluşturur, fiyatı görür, işi takip eder, ödeme ve destek işlemlerini yürütür.
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('customer')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg text-[10px] transition-all"
                      >
                        Arayüzü Aç
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Bike className="w-4 h-4 text-white" />
                      <span>Sürücü / Kurye Uygulaması</span>
                    </td>
                    <td className="p-3 text-zinc-300">
                      Hizmet yetkisi onaylanmış sürücüler.
                    </td>
                    <td className="p-3 text-zinc-400">
                      Çevrimiçi olur, uygun işleri görür, kabul eder, taşıma ve teslimat adımlarını tamamlar.
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('courier')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg text-[10px] transition-all"
                      >
                        Arayüzü Aç
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span>Operasyon / Komuta Merkezi</span>
                    </td>
                    <td className="p-3 text-zinc-300">
                      Operasyon, destek, finans ve yetkili yöneticiler.
                    </td>
                    <td className="p-3 text-zinc-400">
                      Talepleri, sürücüleri, güvenlik olaylarını, finans hareketlerini ve platform kurallarını yönetir.
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('admin')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg text-[10px] transition-all"
                      >
                        Portalı Aç
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
              <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <strong className="text-white block mb-0.5">Profil Değişimi:</strong>
                <span className="text-zinc-400">Müşteri ile işletme aynı mobil uygulamada profil değiştirerek kullanılır.</span>
              </div>
              <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <strong className="text-white block mb-0.5">Yetki & Ekipman:</strong>
                <span className="text-zinc-400">Sürücü ile kurye aynı uygulamada ruhsatına, kaskına ve çanta ekipmanına göre hizmet verir.</span>
              </div>
              <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <strong className="text-white block mb-0.5">Tek Komuta Portalı:</strong>
                <span className="text-zinc-400">Operasyon ile komuta merkezi tek bir web yönetim portalında entegre çalışır.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MÜŞTERİ / İŞLETME UYGULAMASI */}
      {(filterClause === 'all' || filterClause === 'customer') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <h3 className="text-base font-bold text-white tracking-wide">
                2. Müşteri / İşletme Uygulaması Şartnamesi
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Madde 2.1 – 2.11
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2.1 Karşılama, Giriş ve Hesap Oluşturma */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.1. Karşılama, Giriş ve Hesap Oluşturma</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Telefon numarası, doğrulama kodu, gerekli bilgilendirmeler ve yardım bağlantısı bulunur.<br />
                <strong>İşleyiş:</strong> Telefon doğrulandıktan sonra yeni kullanıcı profil bilgilerini tamamlar. Mevcut kullanıcı hesabına girer. İşletme profili oluşturmak veya bir işletmeye katılmak ayrı bir akıştır.<br />
                <strong>Karşılanacak durumlar:</strong> Kod gelmedi, kod yanlış, kod süresi doldu, yeniden gönderme sınırı, bağlantı hatası ve erişimi kısıtlı hesap.<br />
                <span className="text-zinc-400 italic">Konum izni girişin şartı yapılmaz; izin verilmezse adres elle aranıp seçilebilir.</span>
              </p>
            </div>

            {/* 2.2 Ana Ekran ve Profil Geçişi */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.2. Ana Ekran ve Profil Geçişi</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <div className="text-zinc-300 text-[11px] leading-relaxed space-y-1.5">
                <div>
                  <strong>Kişisel Profilde:</strong> Beni Götür · Paket Gönder · Geçmiş İşler · Destek ve Hesabım
                </div>
                <div>
                  <strong>İşletme Profilinde:</strong> Teslimat Oluştur · Aktif Teslimatlar · Tamamlanan İşler · Hesap Hareketleri · İşletme Yönetimi
                </div>
                <div className="p-2 bg-amber-950/30 border border-amber-900/40 rounded-lg text-amber-200 text-[10px]">
                  <strong>Kapsam Kuralı:</strong> Al-Getir, lüks motosiklet ve farklı tarife seçenekleri ayrıca değerlendirilir; onaylanmadan ana hizmet olarak yerleştirilmez.
                </div>
              </div>
            </div>

            {/* 2.3 Yolculuk Talebi Oluşturma */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.3. Yolculuk Talebi Oluşturma</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Alış adresi, varış adresi, harita işaretçisi ve buluşma açıklaması.<br />
                <strong>İşleyiş:</strong> 1. Kullanıcı alış noktasını doğrular. 2. Varış adresini arar veya haritadan seçer. 3. Bina adı, kapı, sokak tarafı gibi buluşma açıklamasını ekler. 4. Sistem hizmet alanını kontrol eder. 5. Fiyat özetine geçer.<br />
                <strong>Prensip:</strong> GPS konumu doğrudan kesin alış noktası kabul edilmez; kullanıcıya doğrulatılır.
              </p>
            </div>

            {/* 2.4 Paket Gönderimi Oluşturma */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.4. Paket Gönderimi Oluşturma</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Gönderici, alıcı, telefonlar, alım ve teslimat adresleri, paket adedi, boyut, ağırlık ve taşıma açıklaması.<br />
                <strong>İşleyiş:</strong> Girilen paket bilgileri uygun ekipman ve kapasiteyle eşleştirilir. Taşıma sınırlarına uymayan talep kullanıcıya açıklanır. Paketin hazır olup olmadığı belirtilir. Teslimat talimatı ile adres açıklaması ayrı tutulur.
              </p>
            </div>

            {/* 2.5 İşletme İçin Çoklu Teslimat */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.5. İşletme İçin Çoklu Teslimat Oluşturma</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> İşletmenin alım adresi ve her paket için ayrı alıcı/adres satırı.<br />
                <strong>İşleyiş:</strong> Aynı alım noktasından çıkan paketler eklenir. Her pakete ayrı takip kimliği verilir. Toplam yük kapasitesi kontrol edilir. Önerilen teslimat sırası, tahmini süre ve fiyat gösterilir. Bir paketin sorunu diğerlerini otomatik tamamlanmış veya başarısız yapmaz.
              </p>
            </div>

            {/* 2.6 Fiyat Özeti ve Talep Onayı */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.6. Fiyat Özeti ve Talep Onayı</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Hizmet türü, adresler, tahmini mesafe/süre, ücret kalemleri, indirim, toplam ödeme ve ödeme yöntemi.<br />
                <strong>Prensip:</strong> Fiyat sunucuda hesaplanır. Kullanıcı "Talebi Gönder" öncesinde ne ödeyeceğini tam görür. Yolcudan %10 + sabit 20 TL hizmet bedeli mevcut model girdisidir. Ek durak/bekleme ücretleri onaylandıkça yansıtılır.
              </p>
            </div>

            {/* 2.7 Sürücü Arama */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.7. Sürücü Arama</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Arama durumu, geçen süre, talep özeti ve iptal seçeneği.<br />
                <strong>Eşleştirme Motoru:</strong> Hizmet yetkisi, ekipman modu, kapasite, bölge ve konum güncelliğine göre değerlendirir. Teklif gönderilmesi ile kesin atama farklıdır; aynı işi eşzamanlı kabul eden sürücülerden yalnızca biri Mutex ile atanır.
              </p>
            </div>

            {/* 2.8 Sürücü Eşleşti ve Geliyor */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.8. Sürücü Eşleşti ve Geliyor</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Sürücü fotoğrafı, adı, motosiklet, plaka, puan, konum güncelliği, tahmini geliş süresi ve iletişim.<br />
                <strong>Doğrulama:</strong> Yolculuk başlatma 4 haneli PIN kodu gösterilir. İptal bedeli varsa işlem yapılmadan önce gösterilir; tutar ve koşullar ayrıca onaylanır.
              </p>
            </div>

            {/* 2.9 Aktif Yolculuk / Teslimat */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.9. Aktif Yolculuk / Teslimat</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Prensip:</strong> Yolculuk doğrulaması tamamlanmadan başlatılamaz. Paket işinde alım doğrulaması, teslimat doğrulamasından ayrı tutulur. Konum kesildiğinde iş tamamlanmış sayılmaz; son güncelleme ve bağlantı durumu gösterilir.
              </p>
            </div>

            {/* 2.10 Acil Yardım */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.10. Acil Yardım</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ayrım:</strong> Acil arama (112), platforma olay bildirme ve yolculuk paylaşma seçenekleri açıkça ayrılır.<br />
                <span className="text-amber-300 font-semibold">Kural:</span> 112’ye otomatik konum aktarımı veya kesintisiz müdahale garantisi, doğrulanmış altyapı olmadan yazılmaz.
              </p>
            </div>

            {/* 2.11 Tamamlama, Ödeme ve Değerlendirme */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.11. Tamamlama, Ödeme ve Değerlendirme</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Yolculukta:</strong> 4 haneli PIN bitiriş kaydı ve doğrulamalar kullanılır.<br />
                <strong>Paket Teslimatında:</strong> Alıcı kodu ve onaylanmış teslimat kanıtı (PoD) kullanılır. Yolcu fotoğrafı varsayılan teslimat kanıtı yapılmaz.<br />
                <strong>Ödeme Kuralı:</strong> Sanal cüzdan, bahşiş ve otomatik tahsilat ayrıca onaylanır; belirsiz kesintiler yapılmaz.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SÜRÜCÜ / KURYE UYGULAMASI */}
      {(filterClause === 'all' || filterClause === 'courier') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <h3 className="text-base font-bold text-white tracking-wide">
                3. Sürücü / Kurye Uygulaması Şartnamesi
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Madde 3.1 – 3.4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 3.1 Başvuru ve Onay */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.1. Başvuru ve Onay</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Kişisel bilgiler, araç bilgileri, belgeler, hizmet başvuruları ve inceleme durumu.<br />
                <strong>Yetki Kuralı:</strong> Yolcu hizmeti onayı ile kurye hizmeti onayı ayrı izlenir. Biri açıkken diğeri kapalı kalabilir.<br />
                <span className="text-amber-300 font-semibold">Kural:</span> TFKS / İBB doğrulaması, mevcut çalışan bir entegrasyon gibi sunulmaz; onaylı resmi altyapı beklenir.
              </p>
            </div>

            {/* 3.2 Çevrimiçi Olma ve Ekipman Seçimi */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.2. Çevrimiçi Olma ve Ekipman Seçimi</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Çevrimiçi anahtarı, hizmet modu, kullanılan araç, ekipman ve cihaz durumu.<br />
                <strong>Prensip:</strong> Sürücü serbest çalışma modeline göre çevrimiçi olur. Yolcu taşımaya uygun olmayan ekipman düzeninde (örn: kask yok veya sadece arka çanta var) yolcu işi açılmaz. Aktif işle çelişen mod değişikliği yapılamaz.
              </p>
            </div>

            {/* 3.3 İş Teklifi */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.3. İş Teklifi</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> İş türü, alım mesafesi, tahmini toplam süre, duraklar, yük bilgisi ve sürücü hakedişi.<br />
                <strong>Prensip:</strong> Sürücü kabul etmeden işi ve ödenecek tutarı net anlamalıdır. Teklif süresi dolunca kabul butonu geçersizleşir.<br />
                <span className="text-zinc-400 italic">Hakediş "giderlerden sonra net kâr" diye gösterilmez; brüt tutar ve kesintiler şeffaf aktarılır. Sürüş sırasında dikkat dağıtıcı öğeler yer almaz.</span>
              </p>
            </div>

            {/* 3.4 İş Yürütme ve Sahada Sorun Bildirimi */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.4. İş Yürütme ve Sorun Bildirimi</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                  MVP DÂHİL
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Adımlar:</strong> Alıma git ➔ vardım ➔ doğrula ➔ yolculuğu başlat / paketi teslim al ➔ durakları tamamla ➔ işi bitir.<br />
                <strong>Sorun Seçenekleri:</strong> Müşteri yok, paket hazır değil, kapasite uygun değil, adres yanlış, alıcı yok, arıza, kaza ve bağlantı kaybı.<br />
                <span className="text-zinc-400 italic">Sorun kaydı mevcut işle ilişkilendirilir; sürücü belirsiz bir ekranda bırakılmaz.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-zinc-400">
          Tüm bu şartname maddeleri çalışan arayüzlerimizde gerçek zamanlı simüle edilmektedir.
        </span>
        <button
          onClick={() => setActiveView('split')}
          className="px-4 py-2 bg-white text-black font-bold rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all"
        >
          <span>Eşzamanlı Canlı Simülasyonu İncele</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
