# BLESYUM MOTOSİKLET VE KURYE ÇAĞIRMA PLATFORMU
## EKRAN ŞEMALARI, UX/UI MİMARİSİ VE ŞABLONLAR ŞARTNAMESİ (REV.03 PRO)

Bu doküman, Blesyum platformu kapsamında geliştirilen **2 Mobil Uygulama (Müşteri & Kurye)** ve **1 Web Yönetici Paneli**ne ait **22 adet Ekran Şeması**, kullanıcı akışları, tasarım tokenleri, Rust API şemaları ve kenar durum (edge case) kurallarının teknik kütüğüdür.

Tüm ekran şablonları kaynak kod içerisinde tek tek modüler dosyalara ayrıştırılmıştır:
- `src/components/wireframes/customer/` (C-01 - C-08)
- `src/components/wireframes/courier/` (K-01 - K-08)
- `src/components/wireframes/admin/` (A-01 - A-06)
- `src/components/wireframes/types.ts`
- `src/components/wireframes/index.ts`

---

## 📱 BÖLÜM 1: MÜŞTERİ (YOLCU) MOBİL UYGULAMASI (8 EKRAN ŞEMASI)

### 1.1. C-01: SMS OTP Doğrulama ve Üyelik
- **Dosya Yolu**: `src/components/wireframes/customer/C01_OtpVerificationScreen.tsx`
- **Kullanıcı Amacı**: Şifresiz, tek dokunuşla SMS OTP ile saniyeler içinde oturum açmak.
- **Tetikleyici**: Telefon numarası girilir ➔ 6 haneli kod otomatik okunur ➔ Profil oluşur.
- **Tasarım Tokenleri**: SF Pro Display 24px Bold, 48x56pt numerik kutular, Primary Blue `#0066FF`.
- **Rust API Endpoint**: `POST /api/v1/auth/verify-otp`
- **Güvenlik Kuralı**: JWT belirteci Secure Keychain / KeyStore donanım kasasında mühürlenir.

### 1.2. C-02: Ana Harita & Çift Mod Hizmet Seçimi
- **Dosya Yolu**: `src/components/wireframes/customer/C02_HomeMapServiceSelectScreen.tsx`
- **Kullanıcı Amacı**: 🛵 Motosiklet (Yolcu) veya 📦 Motokurye (Paket) hizmetini seçip çevredeki müsait araçları görmek.
- **Tetikleyici**: Segment anahtarına dokunulur ➔ Haritadaki müsait kuryeler anında filtrelenir.
- **Rust API Endpoint**: `GET /api/v1/fleet/nearby?lat=41.0425&lng=29.0065&radius_m=2000`
- **Güvenlik Kuralı**: Konum verisi sadece uygulama açıkken ve talep anında geçici işlenir (KVKK).

### 1.3. C-03: Güzergah & Önceden Görünen Fiyat
- **Dosya Yolu**: `src/components/wireframes/customer/C03_RouteFareEstimateScreen.tsx`
- **Kullanıcı Amacı**: Yolculuk başlamadan önce kaç TL ödeyeceğini ve kaç dakikada varacağını bilmek.
- **Araç Segmentleri**: Moto Standart (NMAX 155), Moto Konfor (XMAX 250), Express Kurye.
- **Rust API Endpoint**: `POST /api/v1/rides/estimate-fare`
- **Güvenlik Kuralı**: Fiyat hesaplaması istemcide değil, kurcalamaya kapalı Rust motorunda kilitlenir.

### 1.4. C-04: Kayıtlı Kart & 3D Secure Tokenizasyon
- **Dosya Yolu**: `src/components/wireframes/customer/C04_Card3DSecureScreen.tsx`
- **Kullanıcı Amacı**: Kredi kartını bir kez güvenle ekleyip her çağrıda tekrar sormadan tek tıkla ödemek.
- **Rust API Endpoint**: `POST /api/v1/payments/tokenize-card`
- **Güvenlik Kuralı**: Kart bilgisi veritabanında tutulmaz; PCI-DSS Seviye 1 tokenizasyon ile saklanır.

### 1.5. C-05: En Yakın Kurye Eşleşme Radarı
- **Dosya Yolu**: `src/components/wireframes/customer/C05_CourierMatchingRadarScreen.tsx`
- **Kullanıcı Amacı**: Dakikalarca beklemeden saniyeler içinde en yakın kuryenin onayını almak.
- **Kurgu**: 2 km çapındaki en uygun kuryeye 15 saniye süreyle sıralı teklif.
- **Rust API Endpoint**: `POST /api/v1/dispatch/order`
- **Güvenlik Kuralı**: Çift atama (Race Condition) Rust tarafında Mutex kilidiyle engellenir.

### 1.6. C-06: Canlı Takip & 4 Haneli Biniş Kodu
- **Dosya Yolu**: `src/components/wireframes/customer/C06_LiveTrackingBoardingCodeScreen.tsx`
- **Kullanıcı Amacı**: Kuryenin saniye saniye yaklaşmasını izlemek ve doğru motora bindiğinden emin olmak.
- **Güvenlik Kodu**: Ekranda üretilen 4 haneli `4821` biniş kodu sürücüye söylenir.
- **WebSocket Endpoint**: `WS /api/v1/rides/BLS-9481/telemetry`
- **Güvenlik Kuralı**: Numara maskeleme kullanılır; gerçek telefon numaraları birbirine gösterilmez.

### 1.7. C-07: Yolculuk Paylaşımı & Acil Durum (112 SOS)
- **Dosya Yolu**: `src/components/wireframes/customer/C07_EmergencySosShareScreen.tsx`
- **Kullanıcı Amacı**: Yolculuk esnasında canlı konumu yakınlarla paylaşmak ve 112 Acil Yardım çağırmak.
- **Rust API Endpoint**: `POST /api/v1/safety/emergency-alert`
- **Güvenlik Kuralı**: Acil durum sinyali panelde kırmızı bayrakla Audit Trail'e işlenir.

### 1.8. C-08: İşlem Sonu, Otomatik Fiş & Puanlama
- **Dosya Yolu**: `src/components/wireframes/customer/C08_TripCompletedRatingReceiptScreen.tsx`
- **Kullanıcı Amacı**: Karttan otomatik çekim faturasını görmek, PDF indirmek ve sürücüyü puanlamak.
- **Rust API Endpoint**: `POST /api/v1/rides/BLS-9481/rate`
- **Güvenlik Kuralı**: Tekil Transaction UUID ile mükerrer çekim riski sıfırlanır.

---

## 🛵 BÖLÜM 2: KURYE (SÜRÜCÜ) MOBİL UYGULAMASI (8 EKRAN ŞEMASI)

### 2.1. K-01: Kurye Kayıt & KYC Belge Yükleme
- **Dosya Yolu**: `src/components/wireframes/courier/K01_KycDocumentUploadScreen.tsx`
- **Belgeler**: A sınıfı ehliyet, motosiklet ruhsatı, zorunlu mali sigorta, e-Devlet adli sicil kaydı.
- **Rust API Endpoint**: `POST /api/v1/courier/kyc/upload`
- **Güvenlik Kuralı**: Panel onaylamadan sürücünün çevrim içi olma yetkisi kilitlidir.

### 2.2. K-02: Çevrim İçi Anahtarı & Günlük Kazanç Cüzdanı
- **Dosya Yolu**: `src/components/wireframes/courier/K02_OnlineToggleWalletScreen.tsx`
- **Özellik**: Eldivenle basılabilir dev anahtar; bugünkü net kazanç (`1.480,00 ₺`) ve sefer sayısı.
- **Rust API Endpoint**: `POST /api/v1/courier/status`
- **Güvenlik Kuralı**: Çevrim dışı olunduğunda arka plan GPS takibi donanımsal olarak durur.

### 2.3. K-03: 15 Saniyelik Çağrı Teklifi HUD Ekranı
- **Dosya Yolu**: `src/components/wireframes/courier/K03_IncomingOrderRadarScreen.tsx`
- **Özellik**: Dairesel geri sayım sayacı, net kazanç (`202.72 ₺`), alış ve varış noktası.
- **Rust API Endpoint**: `POST /api/v1/dispatch/respond`
- **Güvenlik Kuralı**: 15 saniyede basılmazsa cezasız sıradaki kuryeye paslanır.

### 2.4. K-04: Alış Noktasına Turn-by-Turn Navigasyon
- **Dosya Yolu**: `src/components/wireframes/courier/K04_TurnByTurnNavigationScreen.tsx`
- **Özellik**: *"250m sonra sağa dönün"* canlı HUD başlığı ve *"Alış Noktasına Vardım"* butonu.
- **Rust API Endpoint**: `POST /api/v1/rides/BLS-9481/arrive`
- **Güvenlik Kuralı**: Geofence koruması: Konuma 200m yaklaşmadan varış butonu basılamaz.

### 2.5. K-05: Biniş Kodu Doğrulama (Numerik PIN Pad)
- **Dosya Yolu**: `src/components/wireframes/courier/K05_BoardingPinPadScreen.tsx`
- **Özellik**: Yolcunun söylediği 4 haneli kodun girildiği dev POS numerik tuş takımı.
- **Rust API Endpoint**: `POST /api/v1/rides/BLS-9481/verify-code`
- **Güvenlik Kuralı**: Kod doğrulanmadan taksimetre ve rota başlayamaz.

### 2.6. K-06: Paket Teslim Alma & Teslimat Fotoğrafı (PoD)
- **Dosya Yolu**: `src/components/wireframes/courier/K06_ProofOfDeliveryCameraScreen.tsx`
- **Özellik**: Zaman damgalı ve GPS koordinatlı kamera vizörüyle teslim anı fotoğrafı yükleme.
- **Rust API Endpoint**: `POST /api/v1/delivery/pod-upload`
- **Güvenlik Kuralı**: EXIF doğrulaması yapılır; galeriden sahte fotoğraf yüklenemez.

### 2.7. K-07: Görevi Tamamla & Kazanç Onayı
- **Dosya Yolu**: `src/components/wireframes/courier/K07_CompleteTripEarningsScreen.tsx`
- **Özellik**: Sürüş sonlandırılır; hakediş bakiyesine anında `+202.72 ₺` eklenir.
- **Rust API Endpoint**: `POST /api/v1/rides/BLS-9481/complete`

### 2.8. K-08: Kurye Cüzdanı & Hakediş Geçmişi
- **Dosya Yolu**: `src/components/wireframes/courier/K08_PayoutWalletHistoryScreen.tsx`
- **Özellik**: Haftalık kazanç dökümü, kayıtlı IBAN bilgisi ve pazartesi otomatik transfer takvimi.
- **Rust API Endpoint**: `POST /api/v1/courier/wallet/payout-request`

---

## 💻 BÖLÜM 3: WEB YÖNETİCİ PANELİ (6 EKRAN / 4 KATMAN ŞEMASI)

### 3.1. A-01: Canlı Operasyon Haritası & PostGIS Filo Radarı (Katman 1 & 4)
- **Dosya Yolu**: `src/components/wireframes/admin/A01_FleetRadarGeofenceScreen.tsx`
- **Özellik**: Geofence poligonları (Avrupa/Anadolu), saniyelik kurye hız, şarj ve rotaları.
- **WebSocket Endpoint**: `WS /api/v1/admin/fleet/radar`

### 3.2. A-02: Kurye Başvuru ve KYC Belge Onay Masası (Katman 3)
- **Dosya Yolu**: `src/components/wireframes/admin/A02_KycApprovalDeskScreen.tsx`
- **Özellik**: Ehliyet, ruhsat ve sigorta belgelerini tam ekran vizörde inceleyip Onayla / Askıya Al.
- **Rust API Endpoint**: `POST /api/v1/admin/kyc/review`

### 3.3. A-03: Tarife, Bölge ve Yoğun Saat Çarpanı (Katman 2)
- **Dosya Yolu**: `src/components/wireframes/admin/A03_TariffSurgePricingScreen.tsx`
- **Özellik**: Açılış, km/dk ücreti, komisyon oranı (%20) ve surge slider'ı (1.0x - 2.5x).
- **Rust API Endpoint**: `PUT /api/v1/tariffs/surge`

### 3.4. A-04: Finans, Komisyon Kasası & Banka Mutabakatı
- **Dosya Yolu**: `src/components/wireframes/admin/A04_FinancialSettlementScreen.tsx`
- **Özellik**: Kuryeye ödenen, platformda kalan tutarlar; tek tıkla toplu banka transfer onayı.
- **Rust API Endpoint**: `POST /api/v1/admin/payouts/batch-transfer`

### 3.5. A-05: Sipariş Akışı & Güvenlik Denetim İzi (Audit Log)
- **Dosya Yolu**: `src/components/wireframes/admin/A05_AuditLogsStreamScreen.tsx`
- **Özellik**: Her işlemin koordinat, süre ve tutar kaydı; değiştirilemez Append-Only Log.
- **Rust API Endpoint**: `GET /api/v1/admin/audit-logs`

### 3.6. A-06: Şikayet, Destek & Anında İade Masası
- **Dosya Yolu**: `src/components/wireframes/admin/A06_ComplaintsRefundDeskScreen.tsx`
- **Özellik**: Müşteri şikayeti sürüş haritasıyla birlikte açılır; tek tıkla karta iade veya kupon verilir.
- **Rust API Endpoint**: `POST /api/v1/admin/support/refund`
