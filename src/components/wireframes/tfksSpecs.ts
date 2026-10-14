import { TfksMasterSpec } from './types';

export interface TfksOperationalClassInfo {
  code: string;
  name: string;
  responsibleRole: string;
  description: string;
  coreRule: string;
  blockageTrigger: string;
  auditRequirement: string;
  testScenario: string;
}

export const TFKS_OPERATIONAL_CLASSES: TfksOperationalClassInfo[] = [
  {
    code: 'SINIF-01',
    name: 'Araç & Plaka Yönetimi',
    responsibleRole: 'Filo Operasyon Müdürü',
    description: 'Filodaki tüm motosiklet ve hafif ticari araçların tescil, ruhsat, muayene ve teknik durum künyesi.',
    coreRule: 'Muayenesi veya zorunlu mali mesuliyet sigortası bitmiş araç zimmetsiz dahi olsa sistemde aktif edilemez.',
    blockageTrigger: 'Muayene süresi dolumu veya kritik OBD motor arıza kodu algılanması.',
    auditRequirement: 'Ruhsat ve muayene tarihi değişiklikleri yönetici onaylı audit iziyle saklanır.',
    testScenario: 'Sigorta geçerlilik tarihi dün olan araca kurye atanmaya çalışıldığında sistem "Muayene/Sigorta Blokajı" vermelidir.',
  },
  {
    code: 'SINIF-02',
    name: 'Şoför & Kurye Kartı',
    responsibleRole: 'İnsan Kaynakları & Operasyon',
    description: 'Sürücü kimlik, A sınıfı ehliyet, adli sicil, SRC/Psikoteknik ve performans risk sicil kartı.',
    coreRule: 'Belge kontrolü yapılmamış ve 2. onay almamış kurye vardiyaya başlayamaz.',
    blockageTrigger: 'Adli sicil kaydı eksikliği veya ehliyet ceza puanının 100 limitini aşması.',
    auditRequirement: 'Kurye onaylama, askıya alma veya kara listeye alma gerekçesi loglanır.',
    testScenario: 'Onaysız ehliyetli sürücü vardiya başlat butonuna basarsa sistem "Belge Eksikliği Blokajı" ile işlemi durdurmalıdır.',
  },
  {
    code: 'SINIF-03',
    name: 'Zimmet & Araç Teslim Zinciri',
    responsibleRole: 'Saha Garaj Amiri & Kurye',
    description: 'Aracın kuryeye teslimi, başlangıç kilometresi, yakıt seviyesi ve 4 yönlü hasar kontrolü zinciri.',
    coreRule: 'Zimmet çakışma üretemez; bir araç aynı anda iki sürücüde, bir sürücü aynı anda iki araçta görünemez.',
    blockageTrigger: 'Araç tesliminde önceki kapanış kilometresi ile yeni başlangıç km arasında çelişki tespit edilmesi.',
    auditRequirement: 'Zimmet açılış saati, başlangıç km, kurye kimliği ve onaylayan amir loglanır.',
    testScenario: 'Zimmetteki araç için başka bir kuryeye zimmet açılmak istendiğinde sistem çakışmayı tespit edip işlemi engellemelidir.',
  },
  {
    code: 'SINIF-04',
    name: 'Vardiya & Canlı Mesai Takibi',
    responsibleRole: 'Saha Vardiya Şefi',
    description: 'Kuryenin canlı göreve başlama, mola, aktif sipariş taşıma ve vardiya tamamlama yaşam döngüsü.',
    coreRule: 'Maksimum kesintisiz sürüş süresi aşıldığında sistem mola zorunluluğu uyarısı verir.',
    blockageTrigger: 'Vardiyada araç GPS sinyali kesintisi veya teslim edilmemiş açık sipariş bulunması.',
    auditRequirement: 'Vardiya başlangıç, bitiş, toplam km ve mola süreleri audit veritabanına yazılır.',
    testScenario: 'Açık siparişi olan kurye vardiyayı kapatmak istediğinde sistem "Açık Sipariş Blokajı" vermelidir.',
  },
  {
    code: 'SINIF-05',
    name: 'Kasa (Çoklu Kasa: Merkez / Operasyon / POS)',
    responsibleRole: 'Merkez Muhasebe Sorumlusu',
    description: 'Nakit tahsilat teslimi, operasyon kasaları, pos blokesi ve gün sonu fiziksel sayım mutabakatı.',
    coreRule: 'Kasa farkı sessiz kapatılamaz; eski kayıt silinmez, gerekçeli ters/düzeltme kaydı açılır.',
    blockageTrigger: 'Fiziksel sayım ile sistem kasası arasında mutabakatsız fark oluşması.',
    auditRequirement: 'Kasa açılış, kapanış, transfer ve sayım farkı onaylayan rol ve saat ile kaydedilir.',
    testScenario: 'Sayım eksiği olan kasayı mazeretsiz ve onaysız kapatmaya çalışmak işlemi engellemelidir.',
  },
  {
    code: 'SINIF-06',
    name: 'Cari & Şoför Borç / Hakediş Bağlantısı',
    responsibleRole: 'Finans Müdürü',
    description: 'Kurye günlük kazançları, platform komisyon kesintisi, ceza ve servis yansıtmaları.',
    coreRule: 'Kaynak olaya (ceza, hasar, eksik yevmiye, servis) dayanmayan hiçbir borç veya kesinti cariye yazılamaz.',
    blockageTrigger: 'Açık cari itirazı bulunan kuryeye habersiz kesinti uygulanması.',
    auditRequirement: 'Cariye borç/alacak girişinin kaynak evrak numarası, eski bakiye, yeni bakiye loglanır.',
    testScenario: 'Kaynak iş emri numarası girilmeden kurye carisine servis borcu yazılmaya çalışıldığında sistem validasyon hatası vermelidir.',
  },
  {
    code: 'SINIF-07',
    name: 'Ceza & Trafik Tebligat Masası',
    responsibleRole: 'Filo İdari İşler',
    description: 'Plakaya veya sürücüye tebliğ edilen trafik cezalarının 15 günlük %25 indirim süresi takibi ve cariye yansıtılması.',
    coreRule: 'Ceza sürücüye ispatlı tebliğ edilmeden (SMS/Uygulama İçi Mühürlü Bildirim) cariye yansıtılamaz.',
    blockageTrigger: 'İndirim süresine 48 saat kala ödenmemiş veya itiraz edilmemiş ceza bulunması.',
    auditRequirement: 'Ceza sisteme işlendiğinde tebliğ tarihi, ceza tutanağı PDF ve bildirim kanıtı loglanır.',
    testScenario: 'Kuryeye tebliğ bildirimi onaylanmadan cariye borç aktarımı denenirse sistem işlemi beklemeye almalıdır.',
  },
  {
    code: 'SINIF-08',
    name: 'HGS / OGS Geçiş Mutabakatı',
    responsibleRole: 'Muhasebe Uzmanı',
    description: 'Köprü ve otoyol geçişlerinin araç plakası, tarih, saat ve o anki aktif zimmetli sürücü ile eşleştirilmesi.',
    coreRule: 'Vardiya dışı veya zimmetsiz güzergah dışı geçişler "Özel Kullanım / Kaçak Geçiş" alarmı üretir.',
    blockageTrigger: 'HGS bakiyesinin kritik limit altına düşmesi veya kaçak geçiş ihbarı gelmesi.',
    auditRequirement: 'Tüm geçiş logları Karayolları veri dökümü ile eşleştirilerek saklanır.',
    testScenario: 'Zimmet saatleri dışında gerçekleşen köprü geçişi sistemce doğrudan "Kişisel Kullanım Soruşturması"na yönlendirilmelidir.',
  },
  {
    code: 'SINIF-09',
    name: 'Hasar Sorumluluk Masası',
    responsibleRole: 'Ekspertiz & Hasar Sorumlusu',
    description: 'Kazalı veya hasarlı araçların zimmet öncesi ve sonrası fotoğraflarla karşılaştırılması ve sorumluluk tespiti.',
    coreRule: 'Teslim alma ve teslim etme fotoğrafları yan yana getirilmeden hasar kurye carisine re’sen yüklenemez.',
    blockageTrigger: 'Açık hasar tespiti bulunan aracın servise girmeden sefere çıkarılmak istenmesi.',
    auditRequirement: 'Hasar tutanağı, eksper raporu, fotoğraflar ve yönetici onay kararı audit altına alınır.',
    testScenario: 'Teslim öncesi fotoğrafta mevcut olan çizik yeni hasar olarak kaydedilmeye çalışıldığında teslim arşivi kontrolüyle reddedilmelidir.',
  },
  {
    code: 'SINIF-10',
    name: 'Depo & Yedek Parça Stoğu',
    responsibleRole: 'Depo Sorumlusu',
    description: 'Balata, lastik, kayış, yağ ve kaporta parçalarının raf bazlı barkodlu stok ve maliyet takibi.',
    coreRule: 'İş emri numarası ve plaka olmadan depodan 1 adet civata dahi çıkarılamaz.',
    blockageTrigger: 'Depo asgari emniyet stok seviyesi altına düşen kritik sarf malzemesi.',
    auditRequirement: 'Stok giriş, çıkış, sayım farkı ve fire kayıtları kim tarafından yapıldığıyla kaydedilir.',
    testScenario: 'Plaka ve açık iş emri olmadan yapılan parça çıkış denemesi yetki blokajına takılmalıdır.',
  },
  {
    code: 'SINIF-11',
    name: 'Servis İş Emirleri & Eski Parça Takibi',
    responsibleRole: 'Baş Usta & Servis Müdürü',
    description: 'Periyodik bakım, mekanik onarım, kaporta tamiri, test sürüşü ve eski parçanın akıbeti (hurda/iade) yönetimi.',
    coreRule: 'Sözle servis açılamaz, sözle kapatılamaz; test sürüşü onayı almayan araç sahaya dönemez.',
    blockageTrigger: 'Eski parçanın hurdaya veya depoya teslimi yapılmadan iş emrinin kapatılmaya çalışılması.',
    auditRequirement: 'Değişen parçalar, işçilik tutarı, usta imzası ve yol testi verisi audit loga mühürlenir.',
    testScenario: 'Test sürüşü onayı eksik olan servis iş emri kapatılmak istendiğinde sistem "Güvenlik Testi Eksik" uyarısıyla bloke etmelidir.',
  },
  {
    code: 'SINIF-12',
    name: 'GPS, Araç Takip & Cihaz Güvenliği',
    responsibleRole: 'Teknik Altyapı Amiri',
    description: 'Saniyelik konum, kontak durumu, hız aşımı, rota takibi ve cihaz sökülme / sinyal kesintisi tespiti.',
    coreRule: 'GPS verisi zimmet ve vardiya ile örtüşmelidir; zimmetsiz hareket anında kırmızı alarm üretir.',
    blockageTrigger: 'Araç hareket ettiği halde GPS sinyali 90 saniyeden uzun süre kesilirse veya cihaz sökülürse.',
    auditRequirement: 'Sinyal kopma süreleri, uydudan kopuş koordinatları ve cihaz sağlık sinyalleri loglanır.',
    testScenario: 'Zimmet kapalıyken aracın hızının 10 km/s üzerine çıktığı algılanırsa sistem "Yetkisiz Hareket Alarmı" tetiklemelidir.',
  },
  {
    code: 'SINIF-13',
    name: 'ECU / OBD / CAN Telemetri Verisi',
    responsibleRole: 'Teknik Filo Mühendisi',
    description: 'Motor arıza ışığı (DTC), hararet, akü voltajı, gerçek kilometre ve devir verilerinin araç beyninden okunması.',
    coreRule: 'Beyinden okunan gerçek kilometre ile gösterge beyanı çelişirse manipülasyon alarmı açılır.',
    blockageTrigger: 'Kritik motor harareti veya fren sistemi hata kodunun ECU üzerinden raporlanması.',
    auditRequirement: 'OBD hata kodları ve anlık telemetri zaman damgasıyla saklanır.',
    testScenario: 'OBD km değeri sürücünün manuel girdiği km değerinden yüksekse sistem kilometreyi otomatik ECU verisiyle günceller.',
  },
  {
    code: 'SINIF-14',
    name: 'Rol, Yetki & İkinci Kontrol (Çift Onay)',
    responsibleRole: 'Sistem Yöneticisi & Denetçi',
    description: 'Personel rollerinin katı yetki matrisi (Operatör, Muhasebeci, Şef, Müdür, Denetçi) ile sınırlandırılması.',
    coreRule: '5.000 ₺ üzeri finansal düzeltme, ceza silme ve kurye blokajı kaldırma 2. üst onay olmadan tamamlanamaz.',
    blockageTrigger: 'Yetkisiz personelin kritik parametre veya finansal kayıt üzerinde işlem denemesi.',
    auditRequirement: 'Tüm yetki ihlali girişimleri IP, kullanıcı ve oturum bilgisiyle loglanır.',
    testScenario: 'Operatör rolündeki kullanıcı bir kuryenin cezasını silmeye çalıştığında "Yetkisiz İşlem" uyarısı verilip deneme loglanmalıdır.',
  },
  {
    code: 'SINIF-15',
    name: 'Blokaj & Sistem Freni Mekanizması',
    responsibleRole: 'Risk & Uyum Komitesi',
    description: 'Operasyonel, teknik veya finansal risk oluşturan unsurların sistemi otomatik kilitlemesi.',
    coreRule: 'Blokaj sessiz kaldırılamaz; kimin kaldırdığı, gerekçesi ve dayandığı belge sisteme mühürlenir.',
    blockageTrigger: 'Açık ehliyet cezası, teslim edilmemiş yüksek nakit veya arıza kaydı bulunan araç.',
    auditRequirement: 'Blokaj koyulma tarihi, gerekçesi, kaldıran yetkili ve kural parametresi audit kaydına yazılır.',
    testScenario: 'Blokajlı bir aracı zorla sefere atamaya çalışmak sevk algoritması tarafından doğrudan engellenmelidir.',
  },
  {
    code: 'SINIF-16',
    name: 'Mühürlü Audit Log & Olay İzi',
    responsibleRole: 'İç Denetim & Teftiş Kurulu',
    description: 'Kritik hiçbir verinin silinemediği, her güncellemenin eski ve yeni değerle kriptografik saklandığı denetim izi.',
    coreRule: 'Sistemde görünmeyen ve log üretmeyen hiçbir işlem yapılamaz; DELETE komutu yasaktır.',
    blockageTrigger: 'Audit tablosuna yazma hatası oluşursa ilişkili ana işlem de Rollback edilir.',
    auditRequirement: 'Aktör, Zaman, Ekran, Kayıt ID, Eski Değer, Yeni Değer, Gerekçe ve SHA-256 Mührü.',
    testScenario: 'Kasa bakiye düzeltmesinde eski değerin 10.000 ₺, yeni değerin 8.500 ₺ olduğu audit logda açıkça görüntülenmelidir.',
  },
  {
    code: 'SINIF-17',
    name: 'Mühürlü Gün Kapanışı (End of Day)',
    responsibleRole: 'Genel Müdür & Operasyon Direktörü',
    description: 'Günün tüm araç, zimmet, kasa, servis, ceza ve tahsilat kayıtlarının şirket mührüyle dondurulması.',
    coreRule: 'Açık zimmet, eksik tahsilat, kasa farkı veya bildirimsiz ceza varsa gün temiz kapatılamaz.',
    blockageTrigger: 'Kapatılmamış kasa veya sahada zimmetsiz dönen araç bulunması durumunda kapanış blokajı.',
    auditRequirement: 'Gün kapanış özeti, açık riskler, toplam ciro, kapanış zamanı ve yönetici elektronik imzası mühürlenir.',
    testScenario: 'Açık kasa açığı varken "Günü Kapat" dendiğinde sistem risk checklist’ini kırmızıya çevirip üst onay istemelidir.',
  },
  {
    code: 'SINIF-18',
    name: 'Test Senaryoları & Kabul Kriterleri',
    responsibleRole: 'Kalite Güvence & Yazılım Ekibi',
    description: 'Tüm iş kurallarının normal, sınır değer, kötüye kullanım ve yetkisiz işlem testleriyle doğrulanması.',
    coreRule: 'Test senaryolarından ve kabul kriterlerinden geçmeyen hiçbir ekran ve modül canlıya alınamaz.',
    blockageTrigger: 'Otomasyon testlerinde %100 başarı sağlanamayan regresyon durumu.',
    auditRequirement: 'Test adı, başlangıç koşulu, yapılan işlem, beklenen sonuç ve test başarı raporu belgelenir.',
    testScenario: 'Kötü niyetli kullanıcı sahte koordinat gönderirse sunucu mesafe validasyonu ile siparişi reddetmelidir.',
  },
];

export function getScreenTfksSpec(screenId: string, title: string, category: string): TfksMasterSpec {
  const isCustomer = category === 'customer';
  const isCourier = category === 'courier';
  const isBusiness = category === 'business';
  const isAdmin = category === 'admin';

  if (isBusiness) {
    return {
      purpose: 'İşletme ve esnafın %0 sipariş komisyonuyla çoklu paket (Multi-Drop) dağıtımı yapmasını, 14 günlük ücretsiz tanışma kampanyasını ve Havale/EFT abonelik döngüsünü yönetmesini sağlamak.',
      whatItDoes: 'VKN doğrulamasıyla tek seferlik FREE_INTRO açar, aynı koridordaki paketleri birleştirir (BatchRoutePlan), mutfak hazırlık süresine göre otomatik kurye atar ve Havale/EFT dekontunu MANUAL_APPROVAL kuyruğuna iletir.',
      howItDoes: [
        '1. VKN/TCKN ve IBAN tekilliğini doğrulayarak 14 günlük FREE_INTRO kampanya sayacını başlatır.',
        '2. Bekleyen paketleri coğrafi koridorlara göre gruplayarak %28-%36 mesafe tasarruflu BatchRoutePlan üretir.',
        '3. Mutfak hazırlık süresine (prepTimeMinutes) göre kuryeyi paket hazır olmadan 2 dk önce kapıda olacak şekilde çağırır.',
        '4. Dış kanallardan (Yemeksepeti, Getir, Trendyol, POS) gelen webhook siparişlerini %0 komisyonlu 18 alanlı FeeSnapshot ile mühürler.',
        '5. Tanışma süresi sonunda otomatik kart çekimi yapmaz; Havale/EFT referans kodu (wire_reference_code) ile Admin onayına sunar.',
      ],
      output: 'İşletmeye %0 komisyonlu teslimat kanıtları (PoD), optimize çoklu rota planı ve şeffaf haftalık sabit abonelik mutabakatı üretir.',
      weakVsStrong: {
        weak: 'İşletme panelden kurye çağırır ve haftalık ücret öder.',
        weakReason: 'Tanışma süresi sonunda otomatik çekim yasağı, VKN tekilliği, çoklu paket koridor birleştirmesi ve LIMITED_ACCESS veri koruma garantisi belirtilmemiştir.',
        strong: 'İşletme VKN doğrulamasıyla 14 gün ücretsiz başlar; sipariş başı %0 komisyon öder. Süre bitiminde otomatik çekim yapılmaz; Havale/EFT dekontu Admin tarafından @Version kilidiyle onaylanır. Yenilenmezse LIMITED_ACCESS modunda geçmiş veriler silinmeden korunur.',
      },
      buttonDirectives: [
        {
          name: 'Çoklu Paket Rotası (Multi-Drop) Oluştur ve Kurye Ata',
          role: 'İşletme Sahibi / Sevkiyat Görevlisi (canCreateOrders)',
          precondition: 'İşletme aboneliği FREE_INTRO, ACTIVE_MEMBERSHIP veya GRACE_PERIOD durumunda olmalıdır.',
          action: 'Seçilen 2-10 paketi aynı koridorda birleştirir, her durak için 4 haneli deliveryCode üretir ve kurye atar.',
          validation: 'Tenant Guard ile alt kullanıcının yetkisi ve paket ağırlık sınırı kontrol edilir.',
          errorMessage: 'LIMITED_ACCESS veya SUSPENDED durumunda toplu işletme çağrısı yapılamaz; bireysel kurye köprüsünü kullanınız.',
          successResult: 'BatchRoutePlan DISPATCHED durumuna geçer ve 18 alanlı %0 komisyonlu FeeSnapshot üretilir.',
          auditLog: 'batchId, businessId, packageCount, kmSavedPercent ve snapshotHash AuditLog zincirine mühürlenir.',
        },
        {
          name: 'Havale / EFT Dekont Bildirimi Gönder',
          role: 'İşletme Sahibi / Muhasebe',
          precondition: 'Geçerli banka referans kodu (wire_reference_code) ve dekont dosyası girilmiş olmalıdır.',
          action: 'Abonelik durumunu PAYMENT_PENDING yapar ve Admin A-03 onay masasına düşürür.',
          validation: 'Mükerrer referans kodu veya negatif/sıfır tutar reddedilir.',
          errorMessage: 'Geçersiz veya daha önce kullanılmış banka referans kodu (422 DUPLICATE_WIRE_REF).',
          successResult: 'Dekont bildirimi kaydedilir ve Admin MANUAL_APPROVAL kuyruğuna eklenir.',
          auditLog: 'noticeId, businessId, wireReferenceCode ve amountTl SHA-256 mührüyle loglanır.',
        },
      ],
      dataAndValidation: [
        { field: 'businessPerOrderCommissionFee', type: 'currency (TRY)', rule: 'Her zaman 0.00 ₺ (%0) olmalıdır', riskIfNotValidated: 'M0 sıfır komisyon anayasası ihlal edilir.' },
        { field: 'wireReferenceCode', type: 'string (4-64 krk)', rule: 'Tekil banka işlem referansı', riskIfNotValidated: 'Aynı dekontla birden fazla hafta ücretsiz abonelik açılır.' },
        { field: 'tenantBusinessId', type: 'UUID / string', rule: 'JWT içindeki işletme kimliği ile eşleşmeli', riskIfNotValidated: 'Başka işletmenin sipariş ve fatura verilerine erişilir (IDOR).' },
      ],
      authorityAndBlockage: {
        authorizedRoles: ['owner', 'branch_manager', 'dispatch_staff', 'accountant'],
        secondaryApprovalRequired: true,
        blockageTrigger: 'GRACE_PERIOD (3 gün) sonunda ödeme yapılmaması durumunda LIMITED_ACCESS kilidi.',
        blockageResolver: 'Havale/EFT dekontunun Admin tarafından MANUAL_APPROVAL ile onaylanması.',
      },
      auditLogContract: {
        loggedEvents: ['BUSINESS_REGISTERED', 'BATCH_ROUTE_CREATED', 'B2B_WEBHOOK_INGESTED', 'WIRE_NOTICE_SUBMITTED'],
        fieldsCaptured: ['businessId', 'subUserId', 'subscriptionStatus', 'wireReferenceCode', 'sealHash'],
        immutableSeal: true,
      },
      testAndAcceptance: {
        testName: 'İşletme %0 Sipariş Komisyonu ve Tanışma Bitimi Otomatik Çekim Yasağı Testi',
        givenCondition: 'İşletmenin 14 günlük FREE_INTRO süresi Europe/Istanbul 00:00 itibarıyla dolmuştur.',
        whenAction: 'Sistem durum kontrolü çalıştırır ve işletme yeni BUSINESS_DELIVERY açmayı dener.',
        thenExpected: 'Kredi kartından otomatik çekim yapılmaz; durum PLAN_SELECTION_REQUIRED olur ve dekont yükleme ekranı açılır.',
        acceptanceCriteria: 'Otomatik çekim = 0.00 ₺ olmalı; geçmiş sipariş arşivi %100 erişilebilir kalmalıdır.',
      },
    };
  }

  if (screenId === 'C02' || screenId.includes('HomeMap')) {
    return {
      purpose: 'Müşterinin kalkış ve varış noktalarını haritadan pin ile veya listeden seçerek anlık tarife, mesafe ve süre hesaplatmasını sağlamak.',
      whatItDoes: 'Harita üzerinde interaktif pin bırakma, arama kutusuyla mekan bulma, hizmet türü (Motosiklet/Kurye) seçimi ve dinamik ücret önizleme işini yapar.',
      howItDoes: [
        '1. Harita bileşeni üzerinde dokunulan koordinatı yakalar (lat/lng).',
        '2. En yakın onaylı ilçe veya adres noktasını tespit eder.',
        '3. Seçilen iki nokta arasındaki sürüş mesafesini ve tahmini süreyi hesaplar.',
        '4. Açılış ücreti, km tarifesi ve anlık yoğunluk çarpanını (Surge) uygulayarak toplam tutarı ekrana basar.',
        '5. "Haritada Pin Seç" ve "Listeden Seç" modları arasında anlık geçiş sağlar.',
      ],
      output: 'Kullanıcıya net rota çizgisi, tahmini varış süresi (dakika) ve onaylanabilir net yolculuk fiyatı (₺) üretir.',
      weakVsStrong: {
        weak: 'Kullanıcı ekrandan konum seçer ve fiyat görür.',
        weakReason: 'Hangi veriyle seçtiği, haritada tıklamanın nasıl çalıştığı, ters rota butonu ve yoğun saat çarpanının nasıl yansıdığı belli değildir.',
        strong: 'Kullanıcı harita üzerinde pin bırakarak veya arama kutusuna yazarak kalkış/varış noktasını kilitler. Sistem iki nokta arası mesafeyi (km) ve süreyi (dk) hesaplayarak 50 ₺ açılış + 25 ₺/km + anlık Surge çarpanı ile bağlayıcı fiyatı üretir.',
      },
      buttonDirectives: [
        {
          name: 'Haritada Pin İle Seç',
          role: 'Müşteri',
          precondition: 'Harita ekranı aktif ve konum izni açık olmalıdır.',
          action: 'Haritayı interaktif pin seçim moduna alır, tıklanan koordinatı varış noktası olarak kilitler.',
          validation: 'Seçilen nokta İstanbul il sınırları ve geofence alanı içinde olmalıdır.',
          errorMessage: 'Hizmet bölgesi dışındaki koordinatlar için sipariş oluşturulamaz.',
          successResult: 'Pin yeşil/mavi işaretçiyle haritaya oturur, adres kutusu anında güncellenir.',
          auditLog: 'Kullanıcı koordinat seçim olayı (lat/lng, timestamp) geçici oturum loguna yazılır.',
        },
        {
          name: 'Kurye / Moto Çağır',
          role: 'Müşteri',
          precondition: 'Kalkış ve varış adresleri dolu, en az bir geçerli ödeme yöntemi tanımlı olmalıdır.',
          action: 'Siparişi sunucuya iletir, en yakın sürücüyü bulmak üzere 15 saniyelik radar taramasını başlatır.',
          validation: 'Kullanıcının ödenmemiş borç blokajı veya askıda aktif seferi olmamalıdır.',
          errorMessage: 'Devam eden aktif seferiniz bulunmaktadır, yeni çağrı açılamaz.',
          successResult: 'Sipariş "searching" durumuna geçer, biniş kodu üretilir, radar ekranı açılır.',
          auditLog: 'Sipariş ID, müşteri ID, tutar ve koordinatlarla RideOrder tablosuna mühürlenir.',
        },
      ],
      dataAndValidation: [
        { field: 'pickup.lat/lng', type: 'float', rule: 'Geofence sınırları içinde olmalı', riskIfNotValidated: 'Hizmet verilemeyen dağ/deniz konumlarına çağrı düşer.' },
        { field: 'dropoff.lat/lng', type: 'float', rule: 'Pickup ile aynı koordinat olamaz (Min 300m)', riskIfNotValidated: '0 km sefer açılarak sahte promosyon kötüye kullanımı oluşur.' },
        { field: 'totalFare', type: 'currency (TRY)', rule: 'Min açılış ücretinden küçük olamaz', riskIfNotValidated: 'Platform negatif bakiye ve zarar üretir.' },
      ],
      authorityAndBlockage: {
        authorizedRoles: ['customer', 'guest_with_otp'],
        secondaryApprovalRequired: false,
        blockageTrigger: 'Ödenmemiş ceza/hasar borcu veya riskli müşteri skoru.',
        blockageResolver: 'Kredi kartından açık bakiye tahsilatı tamamlandığında otomatik kalkar.',
      },
      auditLogContract: {
        loggedEvents: ['RIDE_REQUESTED', 'FARE_CALCULATED', 'LOCATION_PIN_SELECTED'],
        fieldsCaptured: ['rideId', 'customerId', 'pickupAddress', 'dropoffAddress', 'totalFare', 'surgeMultiplier'],
        immutableSeal: true,
      },
      testAndAcceptance: {
        testName: 'Harita Pin Seçimi ve Ücret Hesaplama Entegrasyon Testi',
        givenCondition: 'Müşteri Kadıköy Boğa Heykeli konumundadır.',
        whenAction: 'Haritadan Beşiktaş İskele noktasına dokunur ve "Motosiklet" seçeneğini seçer.',
        thenExpected: 'Sistem 8.4 km mesafe, 22 dk süre ve 260 ₺ toplam ücret hesaplayıp rotayı mavi çizgiyle çizer.',
        acceptanceCriteria: 'Mesafe > 0 km ve Tutar >= Taban Ücret olmalı; harita tıklaması 200ms altında yanıt vermelidir.',
      },
    };
  }

  if (isCourier) {
    return {
      purpose: 'Kuryenin motosiklet zimmetini başlatması, iş emirlerini kabul etmesi, navigasyon ve teslimat güvenliğini sağlaması.',
      whatItDoes: 'Gelen sipariş teklifini 15 sn geri sayımla gösterir, kabul/red kararı alır, biniş PIN kodunu doğrular ve teslimat kanıtı toplar.',
      howItDoes: [
        '1. Kurye çevrimiçi olduğunda WebSocket üzerinden yarıçapındaki en uygun siparişi dinler.',
        '2. Teklif geldiğinde sesli kask uyarısı ve 15 saniyelik görsel alarm üretir.',
        '3. Kurye kabul ettiğinde rota navigasyon moduna geçer, müşteriye "Yola Çıktı" bildirimi gönderir.',
        '4. Alış noktasına vardığında 4 haneli biniş kodunu kontrol eder; yanlışsa sefer başlatılamaz.',
        '5. Paket tesliminde kamera ile teslimat anı fotoğrafını çeker ve teslim PIN kodunu kapatır.',
      ],
      output: 'Kuryeye rota yönlendirmesi, net hakediş kazancı ve teslimat kanıt belgesi üretir.',
      weakVsStrong: {
        weak: 'Kurye siparişi alır ve teslim eder.',
        weakReason: 'PIN kodu kontrolü, teslimat fotoğrafı kanıtı, sesli kask uyarısı ve kurye cüzdanına yansıma sırası belirtilmemiştir.',
        strong: 'Kurye 15 saniyelik alarm ile teklifi inceler. Kabul ettiğinde dahili navigasyon açılır. Alış noktasında yolcunun 4 haneli biniş PIN kodunu girmeden sefer "in_progress" durumuna geçemez. Teslimatta ise kamera ile paket fotoğrafı çekilerek kanıt mühürlenir ve hakediş anında cüzdana aktarılır.',
      },
      buttonDirectives: [
        {
          name: 'Teklifi Kabul Et',
          role: 'Kurye',
          precondition: 'Gelen teklif durumu "offered" ve 15 saniyelik süre bitmemiş olmalıdır.',
          action: 'Siparişi kuryeye bağlar, müşteriye "Kurye Yolda" durumunu iletir.',
          validation: 'Kurye üzerinde aynı anda başka aktif yolculuk bulunmamalıdır.',
          errorMessage: 'Bu sipariş başka bir kuryeye yönlendirildi veya süresi doldu.',
          successResult: 'Sipariş durumu "accepted" olur, ekran canlı navigasyona geçer.',
          auditLog: 'Kurye ID, Sipariş ID ve kabul zamanı milisaniye hassasiyetiyle loglanır.',
        },
        {
          name: 'Biniş PIN Kodunu Doğrula',
          role: 'Kurye',
          precondition: 'Kurye alış noktasına varmış ("arrived") olmalıdır.',
          action: 'Müşteriden alınan 4 haneli kodu doğrular ve seferi başlatır.',
          validation: 'Girilen kod siparişte üretilen kodla birebir eşleşmelidir (3 hatalı denemede blokaj).',
          errorMessage: 'Hatalı biniş kodu! Lütfen yolcunun ekranındaki kodu kontrol ediniz.',
          successResult: 'Sefer "in_progress" durumuna geçer, taksimetre ve GPS takip mührü başlar.',
          auditLog: 'Doğrulama zamanı ve PIN doğrulama kanıtı loglanır.',
        },
      ],
      dataAndValidation: [
        { field: 'boardingCode', type: 'string (4 hane)', rule: 'Yolcu kodu ile tam eşleşme', riskIfNotValidated: 'Yanlış yolcu araca binerek güvenlik ve kaçırma zafiyeti doğar.' },
        { field: 'deliveryPhoto', type: 'image URL / Base64', rule: 'Paket teslimatlarında zorunlu', riskIfNotValidated: 'Alıcı "paket gelmedi" derse şirket tazminat ödemek zorunda kalır.' },
        { field: 'courierEarnings', type: 'currency (TRY)', rule: 'Komisyon düşüldükten sonra hesaplanır', riskIfNotValidated: 'Hakediş havuzunda finansal dengesizlik oluşur.' },
      ],
      authorityAndBlockage: {
        authorizedRoles: ['courier_verified'],
        secondaryApprovalRequired: false,
        blockageTrigger: 'Zimmet açığı, muayene süresi dolumu veya kask/ekipman reddi.',
        blockageResolver: 'Saha amiri veya garaj şefinin fiziksel araç onayı ile kalkar.',
      },
      auditLogContract: {
        loggedEvents: ['OFFER_ACCEPTED', 'BOARDING_PIN_VERIFIED', 'DELIVERY_PHOTO_SAVED', 'TRIP_COMPLETED'],
        fieldsCaptured: ['rideId', 'courierId', 'timestamp', 'photoUrl', 'netEarnings'],
        immutableSeal: true,
      },
      testAndAcceptance: {
        testName: 'PIN Doğrulama ve Sefer Başlatma Testi',
        givenCondition: 'Kurye alış noktasına varmış ve beklemektedir.',
        whenAction: 'Yolcunun söylediği doğru 4 haneli PIN kodunu girip "Başlat"a basar.',
        thenExpected: 'Sistem yeşil onay verir, seferi "in_progress" yapar ve navigasyon varış noktasına kilitlenir.',
        acceptanceCriteria: 'Hatalı kodda sefer başlamamalı, doğru kodda gecikme olmaksızın taksimetre çalışmalıdır.',
      },
    };
  }

  // Admin / TFKS
  return {
    purpose: 'Filo, sürücü, kasa, ceza, depo ve gün kapanışı operasyonlarının merkezi denetim, onay ve yetkilendirmesini yönetmek.',
    whatItDoes: 'Canlı araç telemetrisini izler, kurye KYC belgelerini onaylar/reddeder, çoklu kasa mutabakatı yapar, cezaları cariye bağlar ve mühürlü gün kapanışı icra eder.',
    howItDoes: [
      '1. Harita üzerinde tüm filonun anlık GPS, kontak ve hız telemetrisini WebSocket ile akıtır.',
      '2. Kurye başvuru belgelerini (Ehliyet, Ruhsat, Sigorta, Sicil) 4 göz kuralıyla inceler.',
      '3. Kasalar arası transferleri çift taraflı onay zinciriyle mühürler; sayım açığı varsa blokaj koyar.',
      '4. Trafik cezalarını 15 günlük indirim süresi sayacıyla izler, tebliğ kanıtı olmadan cariye borç yazmaz.',
      '5. Gün sonunda 14 maddelik denetim listesini tarar; açık risk varsa gün kapanışını durdurur.',
    ],
    output: 'Şirket yönetimine denetlenebilir rapor, onaylanmış hakediş listesi ve dijital mühürlü gün kapanış belgesi üretir.',
    weakVsStrong: {
      weak: 'Yönetici paneli kuryeleri ve paraları kontrol eder.',
      weakReason: 'Hangi yetkiyle yaptığı, kasa açığında ne olduğu, ceza indirim süresinin nasıl izlendiği ve mühürlü gün kapanışının şartları belirtilmemiştir.',
      strong: 'Yönetici Operasyon Paneli üzerinden filoyu saniyelik GPS ile izler. Kasa transferlerinde gönderen ve alan kasacıların çift onayı olmadan bakiye aktarılmaz. 15 günlük trafik cezası süresi kaçırılmadan cariye yansıtılır. Gün sonunda açık zimmet veya kasa farkı varsa gün kapanışı kilitlenir ve teftiş kurulu alarmı tetiklenir.',
    },
    buttonDirectives: [
      {
        name: 'Mühürlü Gün Kapanışını Tamamla',
        role: 'Genel Müdür / Finans Direktörü',
        precondition: '14 maddelik denetim checklist’i incelenmiş ve açık kritik blokaj bulunmamalıdır.',
        action: 'O günün tüm finansal hareketlerini, seferlerini ve kasa kayıtlarını dondurur, SHA-256 mührü üretir.',
        validation: 'Açık kasa farkı veya zimmetsiz aktif araç bulunmamalıdır.',
        errorMessage: 'Açık riskler giderilmeden gün kapatılamaz! Yönetici gerekçeli istisna onayı gereklidir.',
        successResult: 'Gün kapanış mührü oluşturulur, ertesi günün açılış bakiyeleri devredilir.',
        auditLog: 'Kapanış tarihi, toplam ciro, kasa tutarı ve yönetici mührü kalıcı audit tablosuna yazılır.',
      },
      {
        name: 'Kasa Transferini Onayla',
        role: 'Merkez Muhasebe Sorumlusu',
        precondition: 'Transfer kaydı "pending_approval" durumunda olmalıdır.',
        action: 'Gönderen kasadan tutarı düşer, alan kasanın bakiyesini artırır.',
        validation: 'Gönderen kasada transfer tutarı kadar fiziki bakiye bulunmalıdır.',
        errorMessage: 'Yetersiz kasa bakiyesi! Transfer tutarı kasa mevcudunu aşıyor.',
        successResult: 'Transfer durumu "approved" olur, her iki kasanın ekstresine çift taraflı kayıt düşer.',
        auditLog: 'Gönderen kasa, alan kasa, tutar, onaylayan kişi ve işlem saati loglanır.',
      },
    ],
    dataAndValidation: [
      { field: 'cashVault.balance', type: 'currency (TRY)', rule: 'Fiziki sayımla %100 mutabık olmalıdır', riskIfNotValidated: 'Şirket içinde para kaçağı ve zimmet suistimali oluşur.' },
      { field: 'penalty.discountValidUntil', type: 'datetime (ISO)', rule: 'Tebliğ tarihinden itibaren 15 gün', riskIfNotValidated: '%25 indirim hakkı kaybedilerek şirkete veya kuryeye maliyet biner.' },
      { field: 'auditSealHash', type: 'SHA-256 string', rule: 'Değiştirilemez kriptografik hash', riskIfNotValidated: 'Denetimde geriye dönük veri manipülasyonu ispatlanamaz.' },
    ],
    authorityAndBlockage: {
      authorizedRoles: ['admin', 'finance_director', 'fleet_manager'],
      secondaryApprovalRequired: true,
      blockageTrigger: '5.000 ₺ üzeri bakiye silme veya tebliğsiz ceza yansıtma denemesi.',
      blockageResolver: 'Yönetim Kurulu veya Genel Müdürün gerekçeli PIN onayı ile çözülür.',
    },
    auditLogContract: {
      loggedEvents: ['VAULT_TRANSFER_APPROVED', 'PENALTY_LEDGER_SYNCED', 'DAY_CLOSED_SEALED', 'BLOCKAGE_OVERRIDDEN'],
      fieldsCaptured: ['actorName', 'actorRole', 'screenName', 'previousValue', 'newValue', 'justification', 'sealHash'],
      immutableSeal: true,
    },
    testAndAcceptance: {
      testName: 'Açık Kasa Riski Altında Gün Kapanışı Blokajı Testi',
      givenCondition: 'Operasyon kasasında 1.200 ₺ sayım açığı bulunmaktadır.',
      whenAction: 'Yönetici "Mühürlü Gün Kapanışı" butonuna tıklar.',
      thenExpected: 'Sistem işlemi durdurur, kırmızı alarm verir ve "Kasa Farkı Giderilmeden Kapanış Yapılamaz" uyarısı gösterir.',
      acceptanceCriteria: 'Kasa açığı olan gün temiz mühürlenemez; ancak gerekçeli "Riskli Kapanış İstisnası" ile audit altına alınabilir.',
    },
  };
}
