import React, { useState } from 'react';
import {
  Smartphone,
  Bike,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import {
  AUDITED_FINDINGS_SUMMARY,
  M0_TO_M7_PHASES,
  TWENTY_TWO_FLOWS,
  MASTER_42_WIREFRAMES_CATALOG,
  SEVENTY_ONE_CONTROLS,
} from '../../data/masterSpecBookData';

export const SpecificationDocView: React.FC = () => {
  const { setActiveView } = usePlatform();
  const [filterClause, setFilterClause] = useState<string>('all');
  const [screenGroupFilter, setScreenGroupFilter] = useState<
    'ALL' | 'CUSTOMER' | 'COURIER' | 'BUSINESS' | 'ADMIN'
  >('ALL');

  const filteredWireframes = MASTER_42_WIREFRAMES_CATALOG.filter(
    (w) => screenGroupFilter === 'ALL' || w.group === screenGroupFilter
  );

  return (
    <div className="space-y-8 text-xs text-[#F5F5F7]">
      {/* Top Banner - Apple HIG Card */}
      <div className="p-6 sm:p-8 bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#0071E3] text-white font-mono font-semibold text-[11px]">
                Master İçerik &amp; Mimari Şartname Kitabı
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.1] text-[#8E8E93] font-mono text-[11px]">
                Bölüm A–I Tam Sürüm (71 Kontrol · 42 Ekran · 22 Akış · M0–M7)
              </span>
            </div>
            <span className="text-[#8E8E93] font-mono text-[11px]">
              Doküman Kodu: MP-SPEC-2026-MASTER-BOOK
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Çok Platformlu Ulaşım ve Teslimat Ekosistemi — Master İçerik Kitabı
          </h2>

          <div className="p-3.5 bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 rounded-2xl text-[#F5F5F7] text-xs leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FF9F0A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Mimari &amp; Ticari Anayasa (`M0`):</strong> Aktif hizmetler yalnızca{' '}
              <span className="text-emerald-400 font-semibold">
                TAXI_RIDE, INDIVIDUAL_DELIVERY ve BUSINESS_DELIVERY
              </span>{' '}
              olarak çalışır (`%0` komisyon, `%100` sürücü net kazancı, 18 alanlı `TransactionFeeSnapshot`).{' '}
              <span className="text-[#FF9F0A] font-semibold">MOTO_PASSENGER_RIDE</span> yazılı UKOME/UGETAM teyidine kadar{' '}
              <code>DISABLED_BY_POLICY</code> statüsündedir.
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'Tüm Kitap (Tam İçerik)' },
              { id: 'structure', label: '1. Uygulama Yapısı' },
              { id: 'customer', label: '2. Müşteri & İşletme (2.1–2.11)' },
              { id: 'courier', label: '3. Sürücü & Kurye (3.1–3.4)' },
              { id: 'phases_flows', label: '4. M0–M7 Fazları & 22 Akış (FLOW-01..22)' },
              { id: 'screens_controls', label: '5. 42 Ekran Kataloğu & 71 Kontrol' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterClause(f.id)}
                className={`px-3.5 py-2 rounded-full font-semibold transition-all cursor-pointer ${
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
            <span className="text-[11px] text-zinc-400 font-mono">
              6 Ana Görünüm · Ortak Operasyon Çekirdeği
            </span>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-300 leading-relaxed space-y-3">
            <p>
              Platform, kullanıcı türlerine ve operasyonel rollerine göre <strong>üç ayrı arayüz</strong> ve bunların bağlı olduğu <strong>ortak bir operasyon altyapısı</strong> üzerine kurgulanmıştır:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-zinc-850 rounded-xl overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-200 font-mono uppercase text-[11px]">
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
                    <td className="p-3 text-zinc-300">Bireysel müşteriler ve işletme hesapları</td>
                    <td className="p-3 text-zinc-300">
                      Taksi çağrısı (`TAXI_RIDE`), bireysel kurye (`INDIVIDUAL_DELIVERY`) ve işletme teslimatı (`BUSINESS_DELIVERY`) oluşturur, canlı takip eder ve `%0` komisyonlu makbuz alır.
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('customer')}
                        className="px-2.5 py-1 bg-white text-black font-bold rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Aç</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <Bike className="w-4 h-4 text-white" />
                      <span>Sürücü / Kurye Uygulaması</span>
                    </td>
                    <td className="p-3 text-zinc-300">Taksi şoförleri ve kuryeler</td>
                    <td className="p-3 text-zinc-300">
                      6 evraklı KYC sonrası çevrimiçi olur, 15 sn teklifi atomik kilitle kabul eder, 4 haneli PIN ve PoD ile işi tamamlayıp `%100` net kazancını alır.
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('courier')}
                        className="px-2.5 py-1 bg-white text-black font-bold rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Aç</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span>Operasyon ve Yönetim Paneli</span>
                    </td>
                    <td className="p-3 text-zinc-300">Yöneticiler ve operasyon ekibi</td>
                    <td className="p-3 text-zinc-300">
                      18 TFKS operasyon sınıfını, KYC ve Havale/EFT (`MANUAL_APPROVAL`) onaylarını, çoklu kasaları, SHA-256 denetim zincirini ve 71 kontrolü yönetir.
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveView('admin')}
                        className="px-2.5 py-1 bg-white text-black font-bold rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Aç</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-black rounded-xl border border-zinc-850 text-zinc-400 text-[11px]">
              <strong className="text-white">Çoklu Profil:</strong> Aynı telefon numarası hem müşteri hem işletme veya sürücü hesabıyla ilişkili olabilir; ancak yetki ve oturum bağlamları (`Tenant Guard`) kesin olarak ayrılır.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MÜŞTERİ VE İŞLETME UYGULAMASI (2.1 - 2.11) */}
      {(filterClause === 'all' || filterClause === 'customer') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <h3 className="text-base font-bold text-white tracking-wide">
                2. Müşteri ve İşletme Uygulaması (Madde 2.1 – 2.11)
              </h3>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">11 Alt Madde</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.1. Giriş ve Hesap Oluşturma (`C-01`)</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  AKTİF (M1)
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Amaç:</strong> Kullanıcının hızlı, güvenli ve tekrar tekrar form doldurmadan giriş yapması.<br />
                <strong>Ekranda:</strong> Telefon numarası (`+90 5XX`), 6 haneli SMS doğrulama kodu, KVKK açık rıza onayı ve Bireysel / İşletme hesap seçimi.<br />
                <span className="text-zinc-400">Hatalı kodda kalan deneme hakkı gösterilir; 5 hatalı denemede 15 dk geçici kilit (`B1`) uygulanır.</span>
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.2. Ana Ekran ve 3 Aktif Hizmet Seçimi (`C-02`)</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  AKTİF (M0)
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Ekranda:</strong> Canlı harita, aktif tanışma kampanyası (`FREE_INTRO`) bilgi kartı ve 3 aktif M0 hizmeti: <strong>Taksi (`TAXI_RIDE`)</strong>, <strong>Bireysel Kurye (`INDIVIDUAL_DELIVERY`)</strong> ve <strong>İşletme Teslimatı (`BUSINESS_DELIVERY`)</strong>.<br />
                <span className="text-amber-300 font-semibold">Kapsam Kuralı:</span> `MOTO_PASSENGER_RIDE` yasal UKOME iznine kadar ana ekranda yer almaz.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.3. Taksi Yolcu Çağrısı ve `%0` Komisyon (`C-03..C-04`)</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-mono">
                  %0 KOMİSYON
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Akış:</strong> Alış pini doğrulanır ➔ varış noktası seçilir (`&gt;= 300m`) ➔ gerçek yol ağı mesafesi (`B18`) hesaplanır ➔ `%0` komisyonlu 18 alanlı `TransactionFeeSnapshot` gösterilir ➔ 4 haneli `boardingCode` ile yolculuk başlar.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.4. Bireysel Kurye / Paket Gönderimi (`C-05`)</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-mono">
                  %0 KOMİSYON
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>Zorunlu Alanlar:</strong> Gönderi türü, paket ağırlık dilimi (`&gt;15 kg` ise Araçlı Kurye zorunlu), kırılabilirlik, alıcı ad-soyad/telefon ve yasaklı madde beyanı. Teslimatta 4 haneli `deliveryCode` ve `PoD` fotoğrafı zorunludur.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.5. Sınırlı Kapasite Prensibi</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  GÜVENLİK KURALI
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Motosiklet ve taksi bagaj kapasitesini aşan, tehlikeli/yanıcı madde içeren, nakit para/altın veya canlı hayvan barındıran gönderiler sistem tarafından otomatik reddedilir.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.6 – 2.7. İşletme Teslimatı, Tanışma ve Haftalık Üyelik (`B-01..B-06`)</h4>
                <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-700/50 text-blue-300 text-[11px] font-mono">
                  SABİT HAFTALIK ÜYELİK
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Esnaf sipariş başına `%0` komisyon öder. `FREE_INTRO` bitiminde otomatik kart çekimi yapılmaz; işletme Havale/EFT dekontu yükler (`PAYMENT_PENDING`) ve Admin `MANUAL_APPROVAL` ile 7 günlük `ACTIVE_MEMBERSHIP` başlar. `LIMITED_ACCESS` modunda veriler asla silinmez.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">2.8 – 2.11. 8 Ortak Seçenek (`OPT-01..08`) ve Faz 2 Modülleri</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  TAM LİSTE
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                <strong>8 Ortak Seçenek:</strong> `OPT-01` Şimdi/İleri Tarihli, `OPT-02` Çoklu Durak, `OPT-03` Bekleme Süresi, `OPT-04` İade Akışı (`RETURN_IN_PROGRESS`), `OPT-05` 4 Haneli PIN + PoD, `OPT-06` 0850 Maskeli İletişim, `OPT-07` 18 Alanlı `TransactionFeeSnapshot`, `OPT-08` Favori Sürücü.<br />
                <strong>Faz 2 Modülleri:</strong> Al-Getir (Kurye Avanslı Sipariş), Sünnet Pazarlığı (Kontrollü Fiyat Teklifi), Şehirlerarası VIP/Ekspres ve Kurumsal B2B Webhook API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SÜRÜCÜ VE KURYE UYGULAMASI (3.1 - 3.4) */}
      {(filterClause === 'all' || filterClause === 'courier') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <h3 className="text-base font-bold text-white tracking-wide">
                3. Sürücü ve Kurye Uygulaması (Madde 3.1 – 3.4)
              </h3>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">4 Alt Madde · %100 Net Hakediş</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.1. 6 Evraklı KYC Başvuru ve Onay (`K-01`, `A-02`)</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  ZORUNLU KAPI (`A6`)
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Kimlik, Ehliyet, Adli Sicil, Ruhsat, Zorunlu Trafik Sigortası ve Mesleki/Vergi Belgesi son geçerlilik tarihleriyle yüklenir. `kycStatus == APPROVED` olmadan çevrim içi olunamaz.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.2. Zimmet, Vardiya ve Ekipman Kontrolü (`K-02`, `K-12`)</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  ZİMMET KORUMALI (`B13`)
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Zimmet çakışması (`B13`) ve kilometre tutarlılığı doğrulanır. Üzerinde açık sipariş bulunan sürücü vardiyasını kapatamaz (`SINIF-04`).
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.3. 15 Saniye İş Teklifi ve Atomik Kabul (`K-03`)</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-mono">
                  %100 NET KAZANÇ
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Teklif kartında `0.00 ₺ (%0)` platform kesintisi ve `%100` net sürücü kazancı gösterilir. `SELECT ... FOR UPDATE` (`A3`) ile aynı çağrı iki sürücüye atanamaz.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">3.4. Saha Yürütme, 4 Haneli PIN, PoD ve Sorun Bildirimi (`K-04..K-07`, `K-15`)</h4>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                  PIN &amp; POD ZORUNLU (`B7`)
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Alışta `boardingCode`, teslimatta `deliveryCode` + `PoD` fotoğrafı zorunludur. Alıcıya ulaşılamadığında 10 dk bekleme ve 3 maskeli arama kanıtıyla `RETURN_IN_PROGRESS` başlatılır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: M0-M7 FAZLARI (AYRI AYRI) VE 22 UÇTAN UCA AKIŞ (FLOW-01..22) */}
      {(filterClause === 'all' || filterClause === 'phases_flows') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                4. M0–M7 Fazları (`M6` ve `M7` Ayrı) ve 22 Uçtan Uca Operasyonel Akış (`FLOW-01` – `FLOW-22`)
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">
              8 Faz · 22 Tam Akış
            </span>
          </div>

          {/* 14 Mimari Denetim Düzeltmesi Özeti */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AUDITED_FINDINGS_SUMMARY.map((item) => (
              <div key={item.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-400 text-xs">{item.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 text-[11px] font-mono">
                    DÜZELTİLDİ ({item.severity})
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">{item.title}</h4>
                <p className="text-[11px] text-zinc-400">
                  <strong>Önce:</strong> {item.before}
                </p>
                <p className="text-[11px] text-zinc-200">
                  <strong>Yeni Kanonik Kural:</strong> {item.after}
                </p>
              </div>
            ))}
          </div>

          {/* M0 - M7 8 Ayrı Faz Tablosu */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-white">
              M0 – M7 Fazlarının Ayrı Ayrı Kapsam ve Çıkış Kriterleri (`M6` ve `M7` Bağımsız Fazlar)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {M0_TO_M7_PHASES.map((p) => (
                <div key={p.phaseCode} className="p-3.5 bg-black border border-zinc-850 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-white text-black font-mono font-bold text-xs">
                      FAZ {p.phaseCode}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">BAĞIMSIZ FAZ</span>
                  </div>
                  <h5 className="font-bold text-white text-xs">{p.title}</h5>
                  <p className="text-[11px] text-zinc-400">{p.purpose}</p>
                  <ul className="space-y-1 text-[11px] text-zinc-300">
                    {p.inScope.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1.5 border-t border-zinc-900 text-[11px] text-amber-300">
                    <strong>Çıkış Kriteri:</strong> {p.exitCriteria}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 22 Uçtan Uca Akış Tablosu */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-white">
              22 Uçtan Uca Operasyonel Akış (`FLOW-01` – `FLOW-22`)
            </h4>
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-zinc-900 text-zinc-300 font-mono text-[11px]">
                  <tr>
                    <th className="p-2.5 border-b border-zinc-800">Akış Kodu</th>
                    <th className="p-2.5 border-b border-zinc-800">Akış Adı &amp; Ekranlar</th>
                    <th className="p-2.5 border-b border-zinc-800">Temel Adımlar &amp; İş Kuralı</th>
                    <th className="p-2.5 border-b border-zinc-800">Güvenlik &amp; Kabul Kriteri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {TWENTY_TWO_FLOWS.map((fl) => (
                    <tr key={fl.flowId} className="hover:bg-zinc-900/40">
                      <td className="p-2.5 font-mono font-bold text-emerald-400 align-top whitespace-nowrap">
                        {fl.flowId}
                      </td>
                      <td className="p-2.5 align-top">
                        <div className="font-bold text-white">{fl.title}</div>
                        <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                          Aktör: {fl.actors} &bull; Ekranlar: {fl.screens.join(', ')}
                        </div>
                      </td>
                      <td className="p-2.5 align-top text-[11px] text-zinc-300 space-y-1">
                        {fl.steps.map((st, i) => (
                          <div key={i}>
                            {i + 1}. {st}
                          </div>
                        ))}
                        <div className="text-amber-300/90 pt-0.5">
                          <strong>İstisna/İptal:</strong> {fl.errorAndCancellationRules}
                        </div>
                      </td>
                      <td className="p-2.5 align-top text-[11px]">
                        <div className="text-zinc-300">{fl.securityAndAudit}</div>
                        <div className="text-emerald-400 font-mono mt-1">
                          &rarr; {fl.acceptanceCriterion}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: 42 EKRAN KATALOĞU (C-01..15, K-01..15, B-01..06, A-01..06) & 71 KONTROL */}
      {(filterClause === 'all' || filterClause === 'screens_controls') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                5. 42 Ekranlık Master Wireframe Kataloğu (`C-01..15`, `K-01..15`, `B-01..06`, `A-01..06`)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(
                [
                  { id: 'ALL', label: 'Tümü (42)' },
                  { id: 'CUSTOMER', label: 'Müşteri (15)' },
                  { id: 'COURIER', label: 'Sürücü/Kurye (15)' },
                  { id: 'BUSINESS', label: 'İşletme (6)' },
                  { id: 'ADMIN', label: 'Admin (6)' },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setScreenGroupFilter(g.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer ${
                    screenGroupFilter === g.id
                      ? 'bg-white text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredWireframes.map((scr) => (
              <div key={scr.code} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-bold text-xs">
                    {scr.code}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {scr.linkedFlow} &bull; Kontroller: {scr.linkedControls.join(', ')}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">{scr.title}</h4>
                <div className="text-[11px] text-zinc-300">
                  <strong>Zorunlu Alanlar:</strong> {scr.mandatoryFields.join(', ')}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  <strong>Aksiyon / API:</strong> {scr.actionsAndEndpoints.join(' | ')}
                </div>
                <div className="text-[11px] text-emerald-400">
                  <strong>Doğrulama &amp; Blokaj:</strong> {scr.validationAndBlockRules}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">
                71 Mimari, Güvenlik ve UI/UX Kontrolü (`A1–A21`, `B1–B22`, `C1–C18`, `D1–D10` — Toplam {SEVENTY_ONE_CONTROLS.length} Kontrol)
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Canlı invariant simülatörünü, 18 alanlı `TransactionFeeSnapshot` üreteci ve 71 kontrolün tamamını Komuta Merkezi Denetim Üssünde canlı test edebilirsiniz.
              </p>
            </div>
            <button
              onClick={() => setActiveView('admin')}
              className="px-4 py-2.5 bg-white text-black font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer hover:bg-zinc-200"
            >
              71/71 Denetim Üssünü Aç
            </button>
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
          className="px-4 py-2 bg-white text-black font-bold rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer"
        >
          <span>Eşzamanlı Canlı Simülasyonu İncele</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
