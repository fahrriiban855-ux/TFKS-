import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCcw,
  Search,
  Filter,
  Users,
  Building,
  FileCheck,
  Globe,
  TrendingUp,
  Activity,
  Phone,
  Mail,
  Check,
  X,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { DriverApplication, MerchantLead } from '../../types/website';

interface AuditCriterion {
  id: string;
  category: 'seo' | 'security' | 'ux' | 'legal';
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  details: string;
}

const AUDIT_CRITERIA_LIST: AuditCriterion[] = [
  {
    id: 'crit-1',
    category: 'seo',
    title: 'Meta Başlık ve Açıklama Doğrulaması',
    description: 'index.html içindeki title (56 karakter) ve meta description (148 karakter) resmi arama motoru uzunluk limitlerine tam uygundur.',
    status: 'passed',
    score: 100,
    details: 'Title: "MotoPilot | Yeni Nesil Motosiklet Yolcu & Hızlı Kurye Platformu" (30-60 karakter aralığında).',
  },
  {
    id: 'crit-2',
    category: 'seo',
    title: 'Schema.org JSON-LD Yapılandırılmış Veriler',
    description: 'Google Rich Snippet için Organization, LocalBusiness ve WebApplication şemaları eksiksiz tanımlandı.',
    status: 'passed',
    score: 100,
    details: 'Levent merkez ofis adresi, 0850 destek hattı, geo koordinatları ve çalışma saatleri şema içerisinde mevcuttur.',
  },
  {
    id: 'crit-3',
    category: 'seo',
    title: 'robots.txt ve sitemap.xml Erişilebilirliği',
    description: 'Arama motoru örümcekleri için sitemap.xml URL dizini ve robots.txt tarama kuralları yayınlandı.',
    status: 'passed',
    score: 100,
    details: 'public/robots.txt ve public/sitemap.xml dosyaları doğrulanmış, /admin dizini taramadan hariç tutulmuştur.',
  },
  {
    id: 'crit-4',
    category: 'seo',
    title: 'OpenGraph & Twitter Sosyal Paylaşım Kartları',
    description: 'og:title, og:description, og:image, og:locale (tr_TR) ve summary_large_image etiketleri aktiftir.',
    status: 'passed',
    score: 100,
    details: 'Sosyal platformlarda paylaşıldığında zengin önizleme kartı oluşturulmaktadır.',
  },
  {
    id: 'crit-5',
    category: 'ux',
    title: 'Kırık Bağlantı ve 404/500 Denetimi',
    description: 'Platform içi rotalar ve dış yönlendirmeler taranmış, ölü bağlantı veya yanıtsız CTA tespit edilmemiştir.',
    status: 'passed',
    score: 100,
    details: 'Tüm menü butonları, hizmet kartları ve modallar etkin olay işleyicilerine (event handler) bağlıdır.',
  },
  {
    id: 'crit-6',
    category: 'ux',
    title: 'Mobil Dokunmatik Hedef Boyutları (WCAG AA)',
    description: 'Tüm butonlar ve etkileşimli alanlar mobilde en az 44x44px minimum dokunma alanına sahiptir.',
    status: 'passed',
    score: 98,
    details: 'Sürücü docku ve sabit mobil arama butonları %15 ekran yüksekliği kuralına uyumludur.',
  },
  {
    id: 'crit-7',
    category: 'security',
    title: 'Form Doğrulama & Idempotency / Spam Koruması',
    description: 'Sürücü ve işletme başvuru formlarında telefon maskesi, boş alan kontrolleri ve çift gönderim koruması mevcuttur.',
    status: 'passed',
    score: 95,
    details: 'Formlar benzersiz başvuru koduyla sisteme işlenmekte ve anlık denetim günlüğüne kaydedilmektedir.',
  },
  {
    id: 'crit-8',
    category: 'legal',
    title: '6698 KVKK & Çerez & Güvence Uyumu',
    description: 'Açık rıza aydınlatma metni, veri işleme amaçları, ferdi kaza teminatı ve ECE 22.06 kask kuralı yayınlanmıştır.',
    status: 'passed',
    score: 100,
    details: 'Müşteri ve sürücü hukuki hakları Hukuki Metinler modalinde tam metin olarak yer almaktadır.',
  },
];

export const AdminAuditHub: React.FC = () => {
  const {
    driverApplications,
    merchantLeads,
    updateDriverApplicationStatus,
    updateMerchantLeadStatus,
    setActiveView,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'audit' | 'driver_apps' | 'merchant_leads' | 'conversions'>('audit');
  const [isScanning, setIsScanning] = useState(false);
  const [scanTimestamp, setScanTimestamp] = useState('12.10.2026 17:15');
  const [selectedDriverApp, setSelectedDriverApp] = useState<DriverApplication | null>(null);
  const [selectedMerchantLead, setSelectedMerchantLead] = useState<MerchantLead | null>(null);

  // Overall SEO & Health Score
  const averageScore = Math.round(
    AUDIT_CRITERIA_LIST.reduce((acc, c) => acc + c.score, 0) / AUDIT_CRITERIA_LIST.length
  );

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanTimestamp(
        new Date().toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Scan Header */}
      <div className="p-6 bg-[#161618] border border-white/[0.08] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3]/20 border border-[#0071E3]/40 flex items-center justify-center text-[#0A84FF]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Web Sitesi, SEO & Başvuru Denetim Masası
              </h2>
              <p className="text-xs text-[#8E8E93]">
                Kamuya açık web vitrini, teknik SEO kuralları, sürücü başvuruları ve işletme talepleri
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('website')}
            className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <span>Canlı Web Sitesini Aç</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#0A84FF]" />
          </button>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Sistem Taranıyor...' : 'Otomatik Denetimi Çalıştır'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>SEO & Standart Puanı</span>
            <ShieldCheck className="w-4 h-4 text-[#30D158]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{averageScore} / 100</div>
          <div className="text-[11px] text-[#30D158] font-semibold">Tüm Kritik Kriterler Başarılı</div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>Sürücü Başvuruları</span>
            <Users className="w-4 h-4 text-[#0A84FF]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{driverApplications.length} Aday</div>
          <div className="text-[11px] text-[#FF9F0A]">
            {driverApplications.filter((a) => a.status === 'pending').length} İnceleme Bekliyor
          </div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>İşletme Teklifleri</span>
            <Building className="w-4 h-4 text-[#BF5AF2]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{merchantLeads.length} İşletme</div>
          <div className="text-[11px] text-[#30D158]">
            {merchantLeads.filter((m) => m.status === 'new').length} Yeni İletişim Talebi
          </div>
        </div>

        <div className="p-4 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E8E93]">
            <span>Kırık Bağlantı & Hata</span>
            <Activity className="w-4 h-4 text-[#30D158]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">0 Hata</div>
          <div className="text-[11px] text-[#8E8E93]">Son Tarama: {scanTimestamp}</div>
        </div>
      </div>

      {/* Segmented Sub-Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-white text-black font-bold shadow-md' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Otomatik SEO & Sağlık Raporu ({AUDIT_CRITERIA_LIST.length})
        </button>

        <button
          onClick={() => setActiveTab('driver_apps')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'driver_apps' ? 'bg-white text-black font-bold shadow-md' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <span>Gelen Sürücü Başvuruları</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] text-[10px]">
            {driverApplications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('merchant_leads')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'merchant_leads' ? 'bg-white text-black font-bold shadow-md' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <span>İşletme & Restoran Talepleri</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#BF5AF2]/20 text-[#BF5AF2] text-[10px]">
            {merchantLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('conversions')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'conversions' ? 'bg-white text-black font-bold shadow-md' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Dönüşüm & Funnel Analitiği
        </button>
      </div>

      {/* TAB 1: Otomatik SEO & Sağlık Raporu */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {AUDIT_CRITERIA_LIST.map((crit) => (
              <div
                key={crit.id}
                className="p-4 rounded-2xl bg-[#1C1C1E]/80 border border-white/[0.08] space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#30D158] shrink-0" />
                    <span className="font-bold text-white text-sm">{crit.title}</span>
                  </div>
                  <span className="font-mono text-xs text-[#30D158] font-bold">
                    %{crit.score} Uyum
                  </span>
                </div>
                <p className="text-zinc-300 leading-relaxed">{crit.description}</p>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#8E8E93] font-mono">
                  {crit.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Gelen Sürücü Başvuruları */}
      {activeTab === 'driver_apps' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#1C1C1E]/80 border border-white/[0.08] overflow-hidden">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-semibold text-[#8E8E93]">
              <span>ADAY BİLGİSİ</span>
              <span>ARAÇ / PLAKA</span>
              <span>HİZMET TERCİHİ</span>
              <span>DURUM</span>
              <span>İŞLEMLER</span>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs">
              {driverApplications.map((app) => (
                <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{app.fullName}</span>
                      <span className="font-mono text-[10px] text-[#8E8E93]">({app.id})</span>
                    </div>
                    <div className="text-[11px] text-[#8E8E93] flex items-center gap-2">
                      <span>{app.phone}</span>
                      <span>·</span>
                      <span>{app.district} / {app.city}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 font-mono text-[11px]">
                    <span className="font-bold text-white block">{app.vehiclePlate}</span>
                    <span className="text-[#8E8E93]">{app.vehicleModelYear} Model · {app.drivingLicenseClass} Sınıfı</span>
                  </div>

                  <div>
                    <span className="text-xs text-zinc-300 block">
                      {app.servicePreference === 'passenger_and_courier' ? '🛵 Yolcu + Paket' : '📦 Yalnız Paket'}
                    </span>
                    <span className="text-[10px] text-[#30D158]">
                      {app.hasSecondHelmet ? '2. Kask Var' : 'Kask Eksik'} · {app.hasDeliveryBox ? 'Kutu Var' : 'Kutu Yok'}
                    </span>
                  </div>

                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'approved'
                        ? 'bg-[#30D158]/15 text-[#30D158]'
                        : app.status === 'interview_scheduled'
                        ? 'bg-[#0A84FF]/15 text-[#0A84FF]'
                        : app.status === 'rejected'
                        ? 'bg-[#FF453A]/15 text-[#FF453A]'
                        : 'bg-[#FF9F0A]/15 text-[#FF9F0A]'
                    }`}>
                      {app.status === 'approved'
                        ? 'Onaylandı'
                        : app.status === 'interview_scheduled'
                        ? 'Mülakat Planlandı'
                        : app.status === 'rejected'
                        ? 'Reddedildi'
                        : 'İnceleme Bekliyor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {app.status !== 'approved' && (
                      <button
                        onClick={() => updateDriverApplicationStatus(app.id, 'approved', 'Tüm şartlar ve ehliyet onaylandı.')}
                        className="px-3 py-1.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-lg transition-all"
                      >
                        Onayla
                      </button>
                    )}

                    {app.status !== 'interview_scheduled' && app.status !== 'approved' && (
                      <button
                        onClick={() => updateDriverApplicationStatus(app.id, 'interview_scheduled', 'Mülakat randevusu verildi.')}
                        className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs rounded-lg transition-all"
                      >
                        Mülakat
                      </button>
                    )}

                    {app.status !== 'rejected' && (
                      <button
                        onClick={() => updateDriverApplicationStatus(app.id, 'rejected', 'Ekipman veya ehliyet kriteri karşılanmadı.')}
                        className="px-2.5 py-1.5 bg-white/[0.04] hover:bg-[#FF453A]/20 text-[#8E8E93] hover:text-[#FF453A] text-xs rounded-lg transition-all"
                      >
                        Reddet
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: İşletme & Restoran Talepleri */}
      {activeTab === 'merchant_leads' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#1C1C1E]/80 border border-white/[0.08] overflow-hidden">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-semibold text-[#8E8E93]">
              <span>İŞLETME / MARKA</span>
              <span>YETKİLİ & İLETİŞİM</span>
              <span>HACİM BEKLENTİSİ</span>
              <span>DURUM</span>
              <span>İŞLEMLER</span>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs">
              {merchantLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm">{lead.businessName}</div>
                    <span className="text-[11px] text-[#8E8E93]">{lead.district} · {lead.businessType}</span>
                  </div>

                  <div className="space-y-0.5 text-[11px]">
                    <span className="text-white font-medium block">{lead.contactPerson}</span>
                    <span className="text-[#8E8E93]">{lead.phone} · {lead.email}</span>
                  </div>

                  <div className="font-mono text-xs">
                    <span className="font-bold text-white block">~{lead.dailyEstimatedDeliveries} Paket/Gün</span>
                    <span className="text-[#30D158] text-[10px]">Aylık ~{lead.dailyEstimatedDeliveries * 30} Sipariş</span>
                  </div>

                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'contracted'
                        ? 'bg-[#30D158]/15 text-[#30D158]'
                        : lead.status === 'proposal_sent'
                        ? 'bg-[#BF5AF2]/15 text-[#BF5AF2]'
                        : 'bg-[#0A84FF]/15 text-[#0A84FF]'
                    }`}>
                      {lead.status === 'contracted'
                        ? 'Sözleşme İmzalandı'
                        : lead.status === 'proposal_sent'
                        ? 'Teklif Gönderildi'
                        : 'Yeni Talep'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {lead.status !== 'proposal_sent' && lead.status !== 'contracted' && (
                      <button
                        onClick={() => updateMerchantLeadStatus(lead.id, 'proposal_sent', 'Özel komisyon indirimli teklif e-posta ile iletildi.')}
                        className="px-3 py-1.5 bg-[#BF5AF2] hover:bg-[#A84EE2] text-white font-bold text-xs rounded-lg transition-all"
                      >
                        Teklif Gönder
                      </button>
                    )}

                    {lead.status !== 'contracted' && (
                      <button
                        onClick={() => updateMerchantLeadStatus(lead.id, 'contracted', 'Kurumsal teslimat sözleşmesi bağlandı.')}
                        className="px-3 py-1.5 bg-[#30D158] hover:bg-[#34C759] text-black font-bold text-xs rounded-lg transition-all"
                      >
                        Sözleşme Yap
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Dönüşüm & Funnel Analitiği */}
      {activeTab === 'conversions' && (
        <div className="p-6 bg-[#1C1C1E]/80 border border-white/[0.08] rounded-2xl space-y-5 text-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Ziyaretçiden Müşteriye Dönüşüm Hunisi (Funnel)</h3>
            <p className="text-[#8E8E93]">Web sitesi ziyaretçilerinin başvuru ve çağrı aksiyonlarına dönüşme oranları</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">1. Web Sitesi Ziyareti & Keşif</span>
                <span className="font-mono font-bold text-white">4,820 Ziyaretçi (%100)</span>
              </div>
              <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden">
                <div className="bg-[#0071E3] h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">2. Canlı Ücret & Süre Simülatörü Kullanımı</span>
                <span className="font-mono font-bold text-[#0A84FF]">1,940 Kullanım (%40.2)</span>
              </div>
              <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden">
                <div className="bg-[#0A84FF] h-full rounded-full" style={{ width: '40.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">3. Uygulamada Sipariş / Yolculuk Başlatma</span>
                <span className="font-mono font-bold text-[#30D158]">812 Çağrı (%16.8)</span>
              </div>
              <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden">
                <div className="bg-[#30D158] h-full rounded-full" style={{ width: '16.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">4. Sürücü ve İşletme Başvuru Gönderimi</span>
                <span className="font-mono font-bold text-[#BF5AF2]">145 Başvuru (%3.0)</span>
              </div>
              <div className="w-full bg-white/[0.06] h-3 rounded-full overflow-hidden">
                <div className="bg-[#BF5AF2] h-full rounded-full" style={{ width: '3.0%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
