# MotoPilot / TFKS — Çok Platformlu Akıllı Ulaşım, Kapasite Yönetimi, B2B SaaS Teslimat ve Lojistik Ağı (`implementation_plan.md`)

Bu ana referans kitabı; **tüm konuların 8 bağımsız modül (`KONU-01` – `KONU-08`) halinde bölümlendirilmesi**, **kod tabanında halihazırda tamamlanmış işlerin (`YAPILANLAR`) ayıklanması**, **yapılanlardan çıkarıldıktan sonra kalan net eksiklerin (`GAP-01` – `GAP-06`) tek tek tespiti** ve **onayınızla (`Proceed`) doğrudan koda uygulanacak icra planının (`EXEC-01` – `EXEC-06`)** uçtan uca birleştirilmesiyle oluşturulmuştur.

---

## BÖLÜM 0: KONULARIN BÖLÜMLENDİRİLMESİ, YAPILANLARDAN ÇIKARILAN NET EKSİKLER VE UYGULAMAYA GEÇİŞ MATRİSİ

> [!IMPORTANT]
> ### Kullanıcı Onaylı Stratejik Kararlar ve Uygulama İcra Özeti
> 1. **Mağaza ve Paketleme Mimarisi (`Birleşik Süper Uygulama — Tek Pakette Tüm Roller`)**: App Store (iOS), Google Play Store (Android) ve Web/PWA için tüm roller (`Müşteri/Yolcu`, `Sürücü/Kurye`, `İşletme SaaS Portalı`, `Admin Komuta Merkezi`) tek birleşik süper uygulama paketinde toplanacaktır.
> 2. **Canlı Saha Veritabanı ve Kimlik Doğrulama (`Firebase Cloud Firestore & Auth`)**: Siparişler, kurye konumları, 18 alanlı `TransactionFeeSnapshot` kayıtları, çoklu paket rotaları ve işletme abonelikleri gerçek zamanlı bulut veritabanı (`Firestore onSnapshot`) ve `Firebase Auth` ile senkronize edilecektir.
> 3. **MotoPilot 4 Çekirdek Akıllı Kapasite ve Lojistik Motoru**: (1) Sürücü/Kurye Hibrit Kapasite Dengeleme Algoritması, (2) İşletme SaaS Abonelik ve Otomatik Sipariş Dağıtımı (`Auto-Dispatch`), (3) Akıllı Güzergah ve Çoklu Paket Birleştirme Motoru (`Multi-Drop Route Batching`), (4) Kurumsal B2B API ve Dış Sipariş Entegrasyon Paneli canlı koda geçirilecektir.

---

### 0.1. Tüm Konuların 8 Ana Modül Halinde Bölümlendirilmesi ve İçeriklendirilmesi (`KONU-01` – `KONU-08`)

Karmaşıklığı önlemek ve her modülü bağımsız denetleyebilmek için sistemin tamamı **8 Ana Konu Başlığına (`KONU-01` – `KONU-08`)** bölünmüş ve içeriklendirilmiştir:

| Konu Kodu | Bölümlendirilen Ana Konu Başlığı | İçeriklendirilen Alt Başlıklar ve Kapsam Özeti | Belge Referansı |
| :--- | :--- | :--- | :--- |
| **`KONU-01`** | **Hizmet Kapsamı, `%0` Komisyon Ekonomisi ve 18 Alanlı `TransactionFeeSnapshot` Motoru** | • Aktif M0 Hizmetleri: `TAXI_RIDE` (Taksi), `INDIVIDUAL_DELIVERY` (Bireysel Kurye), `BUSINESS_DELIVERY` (İşletme Kurye)<br>• Kilitli Hizmet: `MOTO_PASSENGER_RIDE` (`DISABLED_BY_POLICY` — UKOME yazılı teyidi olmadan açılmaz)<br>• `%0` Müşteri Hizmet Bedeli, `%0` Sürücü/Kurye Kesintisi (`%100` Net Kazanç), `%0` İşletme Sipariş Komisyonu<br>• 18 Alanlı Değişmez `TransactionFeeSnapshot` ve SHA-256 Doğrulama Mührü | Bölüm A, B, C.1, C.2, F |
| **`KONU-02`** | **6 Ana Görünüm, 22 Uçtan Uca Akış (`FLOW-01..22`) ve 42 Wireframe Ekran Stüdyosu** | • 6 Ana Görünüm: Kurumsal Web, Müşteri/Yolcu, Sürücü/Kurye Kokpiti, İşletme Portalı, Admin Komuta, Bölünmüş Simülasyon<br>• 22 Operasyonel Akış (`FLOW-01` – `FLOW-22`) — her biri 12 zorunlu alanıyla<br>• 42 Wireframe Ekranı: Müşteri `C-01..15` (15), Sürücü/Kurye `K-01..15` (15), İşletme `B-01..06` (6), Admin `A-01..06` (6) | Bölüm C.4, H (Cilt 3) |
| **`KONU-03`** | **İşletme SaaS Üyelik (`BusinessSubscription`), 2 Hafta Tanışma Kampanyası (`IntroCampaign`) ve Havale/EFT Onayı** | • 6 Durumlu `IntroCampaign`: `ELIGIBLE` ➔ `APPLIED` ➔ `ACTIVE_FREE_PERIOD` (14 Gün) ➔ `EXPIRED` ➔ `CONVERTED_TO_PAID` / `REJECTED`<br>• 8 Durumlu `BusinessSubscription`: `REGISTERED` ➔ `FREE_INTRO` ➔ `PLAN_SELECTION_REQUIRED` ➔ `PAYMENT_PENDING` ➔ `ACTIVE_MEMBERSHIP` ➔ `PAST_DUE` ➔ `GRACE_PERIOD` ➔ `LIMITED_ACCESS` / `SUSPENDED`<br>• VKN/IBAN Tek Seferlik Kampanya Kilidi + Havale/EFT Dekont & Referans Kodu (`wire_reference_code`) Bildirimi + Admin Manuel Onayı | Bölüm C.3, FLOW-09..12 |
| **`KONU-04`** | **MotoPilot Akıllı Kapasite Dengeleme, Çoklu Paket Rota Birleştirme ve B2B Dış Sipariş Ağı** | • **Modül 4.1 (`HybridCapacityEngine`)**: Yolcu ve paket talebi arasında bölgesel atıl kapasiteyi dinamik dengeleme algoritması<br>• **Modül 4.2 (`MultiDropBatchEngine`)**: Aynı koridordaki 2–4 paketi tek bir optimize rotada (`BatchRoutePlan`) birleştirme ve KM/süre tasarrufu<br>• **Modül 4.3 (`SaaSAutoDispatch`)**: Mutfak/hazırlık süresine (`prepTimeMinutes`) göre sıfır bekleme ile otomatik kurye atama<br>• **Modül 4.4 (`B2BWebhookHub`)**: Yemeksepeti, Getir, Trendyol, Shopify, WooCommerce ve POS dış siparişlerini canlı çekme ve kurye atama | Bölüm K.1, K.2 |
| **`KONU-05`** | **Gerçek Zamanlı Bulut Veritabanı (`Firebase Firestore`), Kimlik Doğrulama (`Auth`) ve Güvenlik Kuralları** | • `Firebase Authentication` (Google ve oturum doğrulama) + Rol/Profil bağlama<br>• `Cloud Firestore` üzerinde gerçek zamanlı (`onSnapshot`) sipariş, kurye, işletme aboneliği, çoklu rota ve denetim izi senkronizasyonu<br>• Sıfır-Güven (`Zero-Trust`) `firestore.rules` (`platformCommission == 0`, RBAC ve şema doğrulaması) | Bölüm K.3, K.4 |
| **`KONU-06`** | **Birleşik Süper Uygulama Paketlemesi (`App Store`, `Google Play Store` & `PWA`) ve Mağaza Yayın Merkezi** | • Tek pakette tüm rollerin (`Customer`, `Courier/Driver`, `Business`, `Admin`) kesintisiz çalışması<br>• `vite-plugin-pwa`, `manifest.json`, `192x192` & `512x512` ikonlar, `PWAInstallButton` (Android/Desktop/iOS kurulum rehberi), `OfflineIndicator`<br>• `capacitor.config.ts` (`com.motopilot.superapp`) ve etkileşimli **App Store & Google Play Yayın Hazırlık Kontrol Merkezi** | Bölüm K.3, K.4 |
| **`KONU-07`** | **18 TFKS Operasyon Sınıfı (`SINIF-01..18`), 71 Mimari/Güvenlik Kontrolü ve Muhasebe/Denetim Zinciri** | • 18 TFKS Operasyon Sınıfı: Zimmet, Kasa, Ceza, Hasar, Depo, Servis İş Emri, Otomatik Blokaj, Gün Sonu Kapanışı (`DailyClosingAudit`)<br>• 71 Kontrol (`A1–A21`, `B1–B22`, `C1–C18`, `D1–D10`) — her biri 13 zorunlu alanıyla<br>• Çift Kayıtlı Muhasebe (`Double-Entry Ledger`) ve SHA-256 Kriptografik Denetim Zinciri (`AuditLog`) | Bölüm C.5, G (Cilt 2), I (Cilt 4) |
| **`KONU-08`** | **Fazlı Teslimat Yol Haritası (`M0–M7`), 20 Sistem Gereksinimi (`SYS-01..20`) ve 7 Açık Karar (`DEC-01..07`)** | • `M0`, `M1`, `M2`, `M3`, `M4`, `M5`, `M6`, `M7` ayrı faz spesifikasyonları (Giriş/Çıkış kriterleri, kapsam içi/dışı)<br>• 20 Sistem Genel Gereksinimi (`SYS-01..20`) ve 20 Doğrulama Senaryosu (`TEST-01..20`)<br>• 7 Açık Ticari/Hukuki Karar Kaydı (`DEC-01..07`) | Bölüm C.6, C.7, D, E |

---

### 0.2. Konuların Üzerinden ve Yapılanlardan Çıkarılan Net Eksikler Matrisi (`YAPILANLAR` vs. `KALAN NET EKSİKLER`)

Canlı kod tabanı (`/src`) ile yukarıdaki 8 ana konu (`KONU-01` – `KONU-08`) satır satır karşılaştırılmış; **halihazırda yapılmış olanlar (`YAPILANLAR`) düşüldükten sonra geriye kalan net eksikler (`GAP-01` – `GAP-06`)** aşağıda çıkartılmıştır:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    KONU BAZLI DENETİM: YAPILANLAR DÜŞÜLDÜKTEN SONRA KALAN NET EKSİKLER                     │
├──────────────────────────────────────────────────────┬─────────────────────────────────────────────────────┤
│   ✅ KOD TABANINDA TAMAMLANMIŞ OLANLAR (YAPILANLAR)  │   🚨 YAPILANLARDAN ÇIKARILAN NET EKSİKLER (EKSİKLER)│
├──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────┤
│ • [KONU-01] %0 Komisyon Hesaplama Motoru             │ • [GAP-01 | KONU-03] İşletme Portalı Canlı Durum    │
│   (calculateFare, createZeroCommissionFeeSnapshot,   │   Makinesi (6 Durumlu IntroCampaign + 8 Durumlu     │
│   18 Alanlı FeeSnapshot, %100 Sürücü Hakedişi)       │   BusinessSubscription) & Havale/EFT Dekont Formu   │
│ • [KONU-01] Müşteri Ekranı (CustomerApp) TAXI_RIDE + │ • [GAP-02 | KONU-02] Wireframe Stüdyosunda Eksik 13 │
│   INDIVIDUAL_DELIVERY + MOTO_PASSENGER_RIDE Kilidi   │   Ekranın (C-15, K-10..15 [6], İşletme B-01..06 [6])│
│ • [KONU-02] Sürücü/Kurye Kokpiti (CourierApp) %100   │   Tamamlanarak 29 Ekrandan 42 Ekrana Çıkarılması    │
│   Net Hakediş, 4 Haneli PIN, PoD Kamera, Sesli Komut │ • [GAP-03 | KONU-04] Sürücü ve Kurye Hibrit Kapasite│
│ • [KONU-02] Kurumsal Web (WebsiteMainView) & Canlı   │   Dengeleme Algoritması (HybridCapacityEngine)      │
│   Bölünmüş Simülasyon (%0 Komisyon Denetim Şeridi)   │ • [GAP-04 | KONU-04] Akıllı Güzergah & Çoklu Paket  │
│ • [KONU-07] 18 TFKS Operasyon Masası (Zimmet, Kasa,  │   Birleştirme (Multi-Drop Batching) ve Otomatik     │
│   Ceza, Hasar, Depo, Servis, Gün Sonu Mühürleme)     │   Sipariş Dağıtımı (SaaS Auto-Dispatch) Motoru      │
│ • [KONU-07] 71/71 Otonom Denetim Merkezi             │ • [GAP-05 | KONU-04] Kurumsal B2B API & Dış Sipariş │
│   (AdminAutonomousAuditHub & SHA-256 Mühür Zinciri)  │   (Yemeksepeti/Getir/Trendyol/POS) Canlı Webhook Hub│
│ • [KONU-08] M0-M7 Lansman Strateji Matrisi           │ • [GAP-06 | KONU-05 & 06] Firebase Firestore & Auth │
│   (LaunchStrategyMatrix & Tipografi Rehberi)         │   Canlı Senkronizasyon + PWA / App Store / Play     │
│                                                      │   Store Birleşik Süper Uygulama Paketleme Merkezi   │
└──────────────────────────────────────────────────────┴─────────────────────────────────────────────────────┘
```

| Konu Kodu | Kod Tabanında Tamamlanmış Olanlar (`YAPILANLAR — Çıkarılanlar`) | Yapılanlardan Çıkarıldıktan Sonra Kalan Net Eksik (`NET EKSİKLER`) | Eksik Kodu & Uygulama Durumu |
| :--- | :--- | :--- | :--- |
| **`KONU-01`**<br>*(%0 Komisyon & Hizmet Kapsamı)* | • `PlatformContext.tsx` içinde `calculateFare`, `requestRide`, `directBookCourier` ve `acceptBargainOffer` fonksiyonlarında `%0` komisyon (`platformCommission: 0`, `courierEarnings === totalFare`) ve 18 alanlı `createZeroCommissionFeeSnapshot` aktif.<br>• `CustomerApp.tsx` içinde `TAXI_RIDE`, `INDIVIDUAL_DELIVERY` aktif; `MOTO_PASSENGER_RIDE` (`DISABLED_BY_POLICY`) rozetiyle ayrıştırılmış.<br>• `WebsiteMainView.tsx` ve `SplitSimulationView.tsx` `%0` komisyon şeridiyle güncellenmiş. | **Kod tabanında eksik kalmamıştır (`%100 Tamamlandı`).** Yalnızca yeni eklenecek Çoklu Paket (`Multi-Drop Batch`) ve B2B Dış Sipariş akışlarının da aynı 18 alanlı `createZeroCommissionFeeSnapshot` motorunu kullanması sağlanacaktır. | **TAMAMLANDI**<br>*(Yeni modüllere bağlanacak)* |
| **`KONU-02`**<br>*(6 Görünüm & 42 Wireframe)* | • 6 Ana Görünüm (`WebsiteMainView`, `CustomerApp`, `CourierApp`, `BusinessPortal`, `AdminDashboard`, `SplitSimulationView`) çalışıyor.<br>• Wireframe Stüdyosunda (`ScreenDesignSystem.tsx`) 29 ekran (`C-01..14`, `K-01..09`, `A-01..06`) mevcut. | **13 Wireframe Ekranı Eksik**:<br>1. Müşteri: `C-15` (Sadakat, Davet Kodu ve Kampanya Cüzdanı)<br>2. Sürücü/Kurye: `K-10` (Haftalık Platform Erişim Durumu), `K-11` (Ağ İçi Yönlendirme), `K-12` (M0 Brüt=Net Kazanç Çetelesi), `K-13` (Saha Sorun & Kaza Raporlama), `K-14` (Bölgesel Yoğunluk & Isı Haritası), `K-15` (Kurye Kutu/Ekipman Uyumluluk)<br>3. İşletme Portalı: `B-01..B-06` (6 Ekranın tamamı) ve `ScreenDesignSystem.tsx` içinde **İşletme (`business`)** kategori sekmesi.<br>4. API sekmesindeki `"Rust API Şeması"` başlığının `"Java 21 / Spring Boot 3.4 OpenAPI 3.1"` olarak düzeltilmesi. | **`GAP-02`**<br>*(Uygulamaya Geçirilecek)* |
| **`KONU-03`**<br>*(İşletme SaaS Üyelik & Tanışma Kampanyası)* | • `BusinessPortal.tsx` içinde `subscriptionStatus` ve `%0` komisyon bilgi kartı mevcut.<br>• Alt kullanıcı (`BusinessSubUser`) ACL yetki kontrolleri mevcut. | **Canlı Durum Makinesi ve Havale/EFT Akışı Eksik**:<br>1. `BusinessPortal.tsx` içinde 6 durumlu `IntroCampaign` (`ELIGIBLE` ➔ `APPLIED` ➔ `ACTIVE_FREE_PERIOD` ➔ `EXPIRED` ➔ `CONVERTED_TO_PAID`) ve 8 durumlu `BusinessSubscription` (`PAST_DUE`, `GRACE_PERIOD`, `SUSPENDED`) canlı geçiş kontrolü.<br>2. Etkileşimli **Havale/EFT Ödeme Bildirimi (`wire_reference_code`, banka dekontu yükleme ve Admin onayına gönderme)** formu.<br>3. `SUSPENDED` / `LIMITED_ACCESS` durumunda `BUSINESS_DELIVERY` sipariş kilidi ve tek tıkla durum test anahtarı. | **`GAP-01`**<br>*(Uygulamaya Geçirilecek)* |
| **`KONU-04`**<br>*(MotoPilot 4 Akıllı Lojistik & Kapasite Motoru)* | • Temel tekil sipariş oluşturma (`requestRide`) ve kurye kabul/teslimat akışı mevcut. | **MotoPilot Şirket Vizyonunun 4 Çekirdek Motoru Kod Tabanında Eksik**:<br>1. **`GAP-03` (`HybridCapacityEngine`)**: Bölgesel yolcu ve paket talebini karşılaştırıp atıl sürücü/kurye kapasitesini otomatik dengeleyen algoritma (`CourierApp` + `AdminDashboard` + `PlatformContext`).<br>2. **`GAP-04` (`MultiDropBatchEngine` & `SaaSAutoDispatch`)**: Aynı koridordaki paketleri tek rotada (`BatchRoutePlan`) birleştiren çoklu paket motoru ve hazırlık süresine (`prepTimeMinutes`) göre otomatik kurye atayan SaaS dağıtım motoru (`BusinessPortal` + `CourierApp`).<br>3. **`GAP-05` (`B2BWebhookHub`)**: Dış sipariş kanallarından (Yemeksepeti, GetirYemek, Trendyol Yemek, Shopify, WooCommerce, Kurumsal POS) canlı sipariş çeken ve otomatik kurye atayan entegrasyon merkezi (`BusinessPortal`). | **`GAP-03`**<br>**`GAP-04`**<br>**`GAP-05`**<br>*(Uygulamaya Geçirilecek)* |
| **`KONU-05`**<br>*(Gerçek Zamanlı Bulut Veritabanı & Auth)* | • İstemci tarafı `useLocalStorageState` ve `server.ts` bellek içi REST API mevcut. | **Gerçek Zamanlı Bulut Veritabanı ve Kimlik Doğrulama Eksik**:<br>1. Firebase (`Firestore` & `Authentication`) kurulumu (`firebase_setup` / `ProvisionFirebase`), `firebase-blueprint.json` ve Sıfır-Güven `firestore.rules`.<br>2. Siparişler, kuryeler, işletme abonelikleri, çoklu paket rotaları ve B2B dış siparişlerin `onSnapshot` ile gerçek zamanlı bulut senkronizasyonu ve kullanıcı giriş/kimlik doğrulama akışı. | **`GAP-06A`**<br>*(Uygulamaya Geçirilecek)* |
| **`KONU-06`**<br>*(App Store, Play Store & PWA Süper Uygulama)* | • Duyarlı (Responsive) web arayüzü ve `PhoneFrame` mobil önizleme çerçevesi mevcut. | **PWA ve App Store / Play Store Paketleme Altyapısı Eksik**:<br>1. `vite-plugin-pwa`, `public/manifest.json`, `192x192` & `512x512` uygulama ikonları ve Service Worker önbellekleme.<br>2. Üst barda (`PlatformNavbar`) canlı **`Uygulamayı Yükle (PWAInstallButton)`** ve **`Çevrimdışı Durum Göstergesi (OfflineIndicator)`**.<br>3. `capacitor.config.ts` (`com.motopilot.superapp`) ve App Store / Google Play Store yayın hazırlık kontrol listesini doğrulayan etkileşimli **"Mağaza & Yayın Hazırlık Merkezi"** modalı/görünümü. | **`GAP-06B`**<br>*(Uygulamaya Geçirilecek)* |
| **`KONU-07`**<br>*(18 TFKS Sınıfı & 71/71 Kontrol)* | • `AdminDashboard.tsx` (18 Sekme) ve `AdminAutonomousAuditHub.tsx` (71/71 Kontrol, SHA-256 mühür zinciri, Çift Kayıtlı Muhasebe Defteri) tamamlanmış. | **Kod tabanında eksik kalmamıştır (`%100 Tamamlandı`).** Yeni eklenecek Hibrit Kapasite, Multi-Drop Rota ve B2B Webhook işlemleri de otomatik olarak `AuditLog` zincirine mühürlenecektir. | **TAMAMLANDI** |
| **`KONU-08`**<br>*(M0-M7 Fazları & Kabul Testleri)* | • `LaunchStrategyMatrix.tsx` ve `src/tests/platform.test.ts` mevcut. | Yeni eklenecek `GAP-01..GAP-06` modüllerinin birim ve entegrasyon doğrulamaları mevcut test ve denetim motoruna bağlanacaktır. | **TAMAMLANDI** |

---

### 0.3. Kalan Net Eksikleri Uygulamaya Geçirme Sırası (`EXEC-01` – `EXEC-06` İcra Planı)

Onay verdiğiniz (`Proceed`) anda, halihazırda tamamlanmış modüllere dokunulmadan doğrudan **yapılanlardan çıkarılan 6 net eksik iş paketi (`GAP-01` – `GAP-06`)** aşağıdaki sırayla kod tabanına uygulanacaktır:

1. **`EXEC-01` (`GAP-06A` — Gerçek Zamanlı Bulut Veritabanı & Kimlik Doğrulama Kurulumu)**:
   - Firebase (`Firestore` + `Auth`) entegrasyonu başlatılacak, `firebase-blueprint.json` ve `firestore.rules` yapılandırılacak, üst barda canlı Bulut Senkronizasyon & Kullanıcı Oturum durumu devreye alınacaktır.
2. **`EXEC-02` (`GAP-06B` — Birleşik Süper Uygulama PWA + App Store / Play Store Paketleme Merkezi)**:
   - `vite-plugin-pwa`, `manifest.json`, uygulama ikonları, `capacitor.config.ts`, `PWAInstallButton`, `OfflineIndicator` ve etkileşimli **"App Store & Play Store Yayın Hazırlık Merkezi"** kodlanacaktır.
3. **`EXEC-03` (`GAP-03` — Sürücü ve Kurye Hibrit Kapasite Dengeleme Algoritması)**:
   - `PlatformContext.tsx`, `CourierApp.tsx` ve `AdminDashboard.tsx` içine bölgesel yolcu (`TAXI_RIDE`) ve paket (`BUSINESS_DELIVERY`) talebini analiz eden, atıl saha kapasitesini tek tıkla veya otonom olarak paket teslimatına yönlendiren **`HybridCapacityEngine`** eklenecektir.
4. **`EXEC-04` (`GAP-04` — Akıllı Güzergah, Çoklu Paket Birleştirme [`Multi-Drop Batching`] & SaaS `Auto-Dispatch`)**:
   - `BusinessPortal.tsx` ve `CourierApp.tsx` içine bekleyen paketleri aynı koridorda birleştiren **`MultiDropBatchEngine`** (% KM tasarrufu, durak sırası, her durak için 4 haneli PIN/PoD) ve hazırlık süresine (`prepTimeMinutes`) göre otomatik kurye atayan **`SaaSAutoDispatch`** motoru eklenecektir.
5. **`EXEC-05` (`GAP-05` & `GAP-01` — Kurumsal B2B Dış Sipariş Entegrasyon Paneli + İşletme Havale/EFT & Abonelik Durum Makinesi)**:
   - `BusinessPortal.tsx` içine Yemeksepeti, GetirYemek, Trendyol Yemek, Shopify, WooCommerce ve POS kanallarından canlı sipariş çeken **`B2B Dış Sipariş Webhook Simülatörü`**, **Havale/EFT Dekont & Referans Kodu Bildirim Formu (`wire_reference_code`)** veAdmin panelinden tek tıkla onay/red akışı eklenecektir.
6. **`EXEC-06` (`GAP-02` — Wireframe Stüdyosu Eksik 13 Ekranın [`C-15`, `K-10..15`, `B-01..06`] Tamamlanması ve Derleme Doğrulaması)**:
   - `ScreenDesignSystem.tsx` ve `src/components/wireframes/` altına eksik 13 ekran (`C-15`, `K-10..15`, `B-01..06`) eklenecek, toplam ekran sayısı **42/42** yapılacak, `"Java 21 / Spring Boot 3.4 OpenAPI 3.1"` etiketi düzeltilecek ve `compile_applet` ile sıfır hata doğrulanacaktır.

---

## BÖLÜM A: DENETİM RAPORU (TESPİT EDİLEN MİMARİ HATALAR, ÇELİŞKİLER, EKSİKLER VE RİSKLER)

Mevcut `implementation_plan.md` ve ön yüz prototip kod tabanı karşılaştırıldığında aşağıdaki **14 kritik mimari, ticari ve güvenlik hatası** tespit edilmiş ve bu yeni sürümde tamamen düzeltilmiştir:

| Bulgu ID | Önem Derecesi | Tespit Edilen Hata / Çelişki / Eksik | Etkilenen Bölümler | Uygulanan Kesin Düzeltme |
| :--- | :--- | :--- | :--- | :--- |
| **AUD-01** | **KRİTİK** | **Üretim Mimarisi ile Prototip/Simülasyon Ortamının Karıştırılması**: Önceki belgede `localStorage`, `useLocalStorageState` ve `BroadcastChannel` sanki üretim ortamının kalıcı veritabanı ve çoklu kullanıcı senkronizasyon katmanıymış gibi sunulmuştur. Oysa onaylı hedef mimari **Java 21 + Spring Boot 3 (Modüler Monolit) + PostgreSQL 16 + PostGIS 3.4 + Tek Flutter Mobil Uygulaması + React/Next.js Web Panelleri** yapısıdır. | Mimari, Veri Kalıcılığı, B1–B22, M0–M7 | `localStorage` ve `BroadcastChannel` yalnızca **AI Studio Bölünmüş Simülasyon Stüdyosu (`MOCK / PROTOTYPE`)** bileşeni olarak sınırlandırıldı. Üretim veri kaynağı olarak **PostgreSQL 16 + PostGIS 3.4** ve sunucu tarafı ACID işlemleri tanımlandı. |
| **AUD-02** | **KRİTİK** | **Tek Mobil Uygulama Kararının İhlali**: Önceki planda `CustomerApp` ve `CourierApp` iki ayrı bağımsız mobil uygulama gibi tanımlanmış; tek hesap altında çoklu profil (`UserAccount` -> `CustomerProfile`, `DriverProfile`, `CourierProfile`) mimarisi atlanmıştır. | Görünüm 2, Görünüm 3, M1, FLOW-01..12 | Müşteri/Yolcu/Gönderici ve Sürücü/Kurye görünümleri **Tek Flutter Mobil Uygulaması** içinde rol/profil ve sunucu yetkisi bazlı modlar olarak birleştirildi. |
| **AUD-03** | **KRİTİK** | **M0 Kapsam Dışı Finansal Özelliklerin (Cüzdan, Kart Saklama, Otomatik Çekim, Ledger Para Hareketi) M0'a Sızması**: M0 kararlarında otomatik kart çekimi, kart saklama, müşteri cüzdanı, escrow ve gerçek para hareketi yapan muhasebe defteri (ledger) kapsam dışı bırakıldığı halde; önceki planda `C-04 Cüzdan/Kayıtlı Kart`, `K-07 Anında Hakediş Aktarımı` ve `Double-Entry General Ledger` M0 içinde aktif gibi yazılmıştır. | Hizmet & Ticari Model, C-04, K-02, K-07, A-06, M0, M6 | M0'da yalnızca **ücret/kazanç bilgisinin değişmez kaydı (`TransactionFeeSnapshot`)** ve işletme haftalık üyeliğinde **Havale/EFT + Ödeme Bildirimi + Admin Manuel Onayı (`MANUAL_APPROVAL`)** yer alır. Cüzdan, kart saklama, escrow ve çift taraflı muhasebe defteri M0'dan çıkarılarak ileriki fazlara (`M6`) ve `KARAR_GEREKİYOR` sınırına çekildi. |
| **AUD-04** | **KRİTİK** | **SHA-256 Hash Kullanımının Tek Başına Değiştirilemezlik Kanıtı Sayılması**: İstemci tarafında (`localStorage` içinde) üretilen SHA-256 özetinin kırılmaz denetim izi olduğu iddia edilmiştir. İstemci belleğindeki tüm zincir kötü niyetli kullanıcı tarafından baştan hesaplanarak yeniden yazılabilir. | Güvenlik, AuditLog, TransactionFeeSnapshot, B3, B14 | Değiştirilemezlik yalnızca **sunucu tarafında (Spring Boot Backend)** üretilen, PostgreSQL'de `UPDATE/DELETE` yetkisi kısıtlanmış (`append-only`) tabloda saklanan ve harici/periyodik kök özet (Merkle/Root Digest) ile doğrulanan kayıtlar için geçerli kılındı. İstemci tarafı SHA-256 uygulaması `MOCK / PROTOTYPE` olarak işaretlendi. |
| **AUD-05** | **YÜKSEK** | **Haversine Mesafesinin Gerçek Yol Mesafesi ve ETA İle Eşdeğer Gösterilmesi**: Kuş uçuşu Haversine formülü gerçek sokak/trafik rotası ve varış süresi (ETA) hesabı gibi sunulmuştur. İstanbul gibi boğaz, köprü ve tek yönlü yolların olduğu şehirlerde kuş uçuşu mesafe büyük fiyat sapması üretir. | C-02, C-03, A-04, B10, M2 | Haversine (`PostGIS ST_DistanceSphere`) yalnızca **ön aday sürücü filtreleme (yarıçap taraması) ve yönlendirme servisi çöktüğünde acil yedek (fallback) tahmin** olarak konumlandırıldı. Bağlayıcı rota mesafesi ve ETA için yol ağı yönlendirme motoru (OSRM / Valhalla / Google Routes API) şart koşuldu. |
| **AUD-06** | **YÜKSEK** | **Profil Varlığı İle İşlem Yetkisinin Karıştırılması**: Bir kullanıcının `DriverProfile`, `CourierProfile` veya `BusinessAccount` kaydının bulunması, o işlemi yapmaya yetkili olduğu anlamına gelmez. | M1, M3, M4, B12, B20 | Yetkilendirme iki katmana ayrıldı: **(1) Profil Varlığı** ve **(2) Aktif Operasyonel Yetki** (Sürücü/kurye için `kycStatus == APPROVED && activeBlockageCount == 0`; İşletme için `BUSINESS_DELIVERY` çağrısında `subscriptionStatus IN ('FREE_INTRO', 'ACTIVE_MEMBERSHIP', 'GRACE_PERIOD')` ve alt kullanıcıda `canCreateOrders == true`). |
| **AUD-07** | **YÜKSEK** | **İş Atamasında Yarış Durumu (Race Condition) ve Çoklu Sürücüye Atanma Riski**: 15 saniyelik teklif radarında aynı işin iki sürücü tarafından aynı anda kabul edilmesi veya ağ gecikmesiyle yinelenen kabul isteği gönderilmesi sunucu atomik kilidi olmadan çözülemez. | C-05, K-03, M2, M4, B7, B11 | İş kabulünde PostgreSQL satır kilidi (`SELECT ... FOR UPDATE NOWAIT`) veya iyimser kilit (`UPDATE service_requests SET status='ACCEPTED', assigned_provider_id=:id, version=version+1 WHERE id=:reqId AND status='OFFERED' AND version=:v`) zorunlu kılındı. |
| **AUD-08** | **YÜKSEK** | **71 Kontrolün Sayı Dağılımı ve Uygulama Durumu Yanıltması**: Önceki belgede `B1–B23 (23)`, `C1–C15 (15)`, `D1–D12 (12)` şeklinde farklı bir dağılım kullanılmış ve tümüne `%100 Kapatıldı (IMPLEMENTED)` denmiştir. Oysa kaynak kural dağılımı **`A1–A21 (21) + B1–B22 (22) + C1–C18 (18) + D1–D10 (10) = 71`** şeklindedir ve mevcut kod yalnızca React/TypeScript simülasyon prototipidir. | Bölüm 5 (71 Kontrol), Bölüm D | `A1–A21`, `B1–B22`, `C1–C18`, `D1–D10` sayı dağılımı birebir korundu; her bir kontrol 13 zorunlu alanıyla ayrı ayrı yazıldı ve gerçek durumları (`PARTIAL`, `MOCK`, `MISSING`, `NOT_TESTED`, `DECISION_REQUIRED`) dürüstçe işlendi. |
| **AUD-09** | **YÜKSEK** | **22 Uçtan Uca Akışın (`FLOW-01`–`FLOW-22`) Eksik ve Parçalı Olması**: Önceki belgede yalnızca ekran listesi (`C-01..C-08`, `K-01..K-08`, `A-01..A-06`) verilmiş; aktör, ön koşul, API, durum geçişi, hata/zaman aşımı ve kabul kriterlerini içeren `FLOW-01`–`FLOW-22` akış şeması tanımlanmamıştır. | Bölüm 6 (Akışlar) | `FLOW-01` ile `FLOW-22` arasındaki 22 uçtan uca akışın tamamı 12 zorunlu alt başlığıyla eksiksiz tanımlandı. |
| **AUD-10** | **YÜKSEK** | **M6 ve M7 Fazlarının Tek Başlıkta Birleştirilmesi**: Önceki planda `M6 & M7` birleştirilmiş ve fazların giriş/çıkış kriterleri, kapsam dışı özellikleri ve tamamlanma kanıtları atlanmıştır. | Bölüm 8 (M0–M7 Fazları) | `M0`, `M1`, `M2`, `M3`, `M4`, `M5`, `M6` ve `M7` tamamen ayrı başlıklar halinde, her biri 12 zorunlu alt başlıkla yeniden yazıldı. |
| **AUD-11** | **ORTA** | **`IntroCampaign` ve `BusinessSubscription` Geçiş Tablolarında Eksik Kenar Durumlar (Edge Cases)**: Kampanya bulunmaması, kampanya başlamadan işletme onaylanması, dekontun reddedilip yeniden gönderilmesi ve işletmenin kendi `CustomerProfile` kaydı üzerinden `INDIVIDUAL_DELIVERY` oluşturması teknik olarak modellenmemişti. | Bölüm 5 (Durum Makineleri) | Tüm kenar durumlar, saat dilimi (`Europe/Istanbul`) ve tarih sınır kuralları tam geçiş tablolarına eklendi. |
| **AUD-12** | **ORTA** | **Proje / Marka Adı Karmaşası (`TFKS`, `Blesyum`, `MotoPilot`)**: Kod tabanında ve geçmiş metinlerde `TFKS`, `Blesyum` ve `MotoPilot` adları bir arada geçmektedir. | Tüm Belge | İsim kendiliğinden değiştirilmedi; teknik çalışma adı `TFKS / Çok Platformlu Ulaşım ve Teslimat Ekosistemi` olarak korundu ve nihai ticari marka adı `KARAR_GEREKİYOR (DEC-01)` olarak kayıt altına alındı. |
| **AUD-13** | **ORTA** | **Taksi ve Kurye Taşıma Bedelinin (Yolcu/Gönderici -> Şoför/Kurye) Ödeme Yöntemi Belirsizliği**: M0'da kart saklama, cüzdan ve escrow kapsam dışı iken, yolcunun veya göndericinin taşıma ücretini şoföre/kuryeye nasıl ödeyeceği (Nakit / Sürücü Fiziksel POS / Harici Ödeme) netleştirilmemişti. | Hizmet & Ticari Model, FLOW-04..07 | M0'da platformun taşıma ücretine aracılık etmediği (Nakit / Sürücünün kendi POS'u veya doğrudan ödeme) ve yalnızca `displayedTransportAmount` bilgisini `TransactionFeeSnapshot` içinde kaydettiği netleştirildi; online ödeme aracılığı `KARAR_GEREKİYOR (DEC-02)` olarak ayrıldı. |
| **AUD-14** | **ORTA** | **KVKK, Belge Depolama Güvenliği ve Simülasyon/Üretim Veri İzolasyonu Eksikliği**: Sürücü ehliyet/adli sicil belgelerinin ve işletme dekontlarının nasıl saklanacağı, imzalı URL (Pre-signed URL) erişimi ve simülasyon verilerinin üretim tablosuna karışmaması tanımlanmamıştı. | Güvenlik, M1, M4, M5 | Özel nesne depolama (S3/MinIO), kısa ömürlü imzalı URL, KVKK saklama süreleri ve `environment / is_simulation` veri izolasyon kuralları eklendi. |

---

## BÖLÜM B: DÜZELTME VE KARAR KAYDI

### B.1. Kaynaklarda Açıkça Onaylanmış ve Korunan Temel Kararlar
1. **Hizmet Kapsamı (M0)**:
   - **`TAXI_RIDE`**: Otomobil ile yolcu taşıma — **M0'da AKTİF**.
   - **`INDIVIDUAL_DELIVERY`**: Bireysel tekil paket/kurye teslimatı — **M0'da AKTİF**.
   - **`BUSINESS_DELIVERY`**: İşletme/esnaf paket teslimatı — **M0'da AKTİF**.
   - **`MOTO_PASSENGER_RIDE`**: Motosikletli yolcu taşıma — **M0'da AKTİF DEĞİLDİR**; gelecek vizyonu olarak korunur, İl UKOME/UGETAM yazılı yasal onayı olmadan üretimde hiçbir ekran, API veya eşleştirme akışı açılmaz. Motosiklet M0'da yalnızca paket taşıma aracıdır.
2. **Sıfır Komisyon (%0) ve Gelir Modeli**:
   - Müşteri platform hizmet bedeli (`customerPlatformServiceFee`): **`0.00 TL (%0)`**.
   - Taksi şoförü ve kurye platform kesintisi (`providerPlatformFee`): **`0.00 TL (%0)`**.
   - İşletme sipariş başı komisyonu (`businessOrderCommission`): **`0.00 TL (%0)`**.
   - Platformun planlanan tek gelir kalemi: Ücretsiz tanışma dönemi (`FREE_INTRO`) sona erdikten sonra, profesyonel işletme panelini (`BUSINESS_DELIVERY`, toplu sipariş, alt kullanıcı, raporlama) kullanmak isteyen işletmelerden alınan **Haftalık Sabit Üyelik Bedelidir**.
   - Üyelik tahsilat yöntemi: **Havale/EFT + Ödeme Bildirimi (Dekont) + Yönetici Manuel Onayı (`MANUAL_APPROVAL`)**.
   - M0'da **otomatik kart çekimi, kart saklama, müşteri/sürücü cüzdanı, escrow (emanet hesap) ve gerçek para hareketi yapan muhasebe defteri (ledger) YOKTUR**.
3. **Hedef Teknik Mimari**:
   - **Mobil**: **Tek Flutter Mobil Uygulaması**; tek hesap (`UserAccount`) altında profil ve yetki bazlı görünümler (`CustomerProfile` ile Müşteri/Yolcu/Gönderici görünümü, `DriverProfile` / `CourierProfile` ile Sürücü/Kurye görünümü).
   - **Web Panelleri**: **React / Next.js** tabanlı Kurumsal Web Portalı, İşletme Web Paneli ve Admin/Operasyon Komuta Merkezi.
   - **Backend**: **Java 21 + Spring Boot 3**, **Modüler Monolit** mimarisi.
   - **Veritabanı**: **PostgreSQL 16 + PostGIS 3.4** (Coğrafi sorgular, ACID işlemler ve satır bazlı kilitler).
   - **İletişim**: **REST API (OpenAPI 3.1)** ve gerçek zamanlı olaylar için **WebSocket + JSON**.
   - **Önbellek / Mesajlaşma**: **Redis ilk pilot (M0–M5) için zorunlu değildir**; durum ve kilit yönetimi PostgreSQL 16 üzerinde yürütülür, yüksek ölçek фаzında (`M7`) opsiyonel olarak devreye alınır.

### B.2. Denetim Sonrası Yapılan Mimari Düzeltmelerin Kaydı
- **DÜZELTME-01 (`Prototip vs Üretim Ayrımı`)**: Mevcut çalışma alanındaki React + Vite + TypeScript + `localStorage` + `server.ts` (Express) yapısı **Canlı Etkileşimli Prototip ve Bölünmüş Simülasyon Stüdyosu** olarak konumlandırıldı; hedef üretim mimarisi olan **Spring Boot 3 + PostgreSQL 16/PostGIS 3.4 + Flutter + Next.js** mimarisinin yerine geçmeyeceği açıkça kayıt altına alındı.
- **DÜZELTME-02 (`Para Hareketi vs Bilgi Kaydı Ayrımı`)**: M0'da şoför ve kurye ekranlarında gösterilen "Kazanç Özeti", platformun para tahsil edip dağıttığı bir banka/cüzdan bakiyesi değil; tamamlanan işlerin `TransactionFeeSnapshot.displayedTransportAmount` toplamından oluşan **bilgilendirici brüt=net kazanç çetelesidir**.
- **DÜZELTME-03 (`İşletmenin Bireysel Gönderi Hakkı`)**: `REGISTERED`, `PLAN_SELECTION_REQUIRED`, `PAYMENT_PENDING`, `LIMITED_ACCESS` veya `CANCELLED` durumundaki bir işletme, `BUSINESS_DELIVERY` (profesyonel işletme teslimatı) başlatamaz; ancak aynı hesap altındaki **`CustomerProfile`** yetkisini kullanarak her zaman tekil **`INDIVIDUAL_DELIVERY`** (bireysel kurye gönderisi) oluşturabilir.
- **DÜZELTME-04 (`Tarih ve Saat Dilimi Standartlaştırması`)**: Tüm kampanya, üyelik ve bildirim hesaplamalarında veritabanı kayıtları `TIMESTAMPTZ (UTC)` olarak saklanır; gün dönümü (`00:00:00`) ve bitiş tarihi (`etkinBitişTarihi`) değerlendirmeleri **`Europe/Istanbul` (UTC+3)** saat dilimine göre yapılır.

---

## BÖLÜM C: TAM DÜZELTİLMİŞ UYGULAMA PLANI (`implementation_plan.md` ANA GÖVDESİ)

### 1. HEDEF SİSTEM MİMARİSİ VE ORTAM İZOLASYONU

#### 1.1. Üretim Mimarisi ve Prototip/Simülasyon Sınır Şeması

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     İSTEMCİ KATMANI (CLIENT TIER)                                        │
├───────────────────────────────────┬──────────────────────────────────┬───────────────────────────────────┤
│   TEK FLUTTER MOBİL UYGULAMASI    │     REACT / NEXT.JS WEB APP      │   BÖLÜNMÜŞ SİMÜLASYON STÜDYOSU   │
│ • Görünüm 2: Müşteri/Yolcu/Gönderi│ • Görünüm 1: Kurumsal Web Portalı│ • Görünüm 6: Yalnızca Test, Demo  │
│ • Görünüm 3: Sürücü/Kurye Saha    │ • Görünüm 4: İşletme Web Paneli  │   ve Çoklu Rol Etkileşim Doğrulama│
│   (Tek Hesap + Çoklu Profil/Yetki)│ • Görünüm 5: Admin Komuta Merkezi│   (Üretim Verisinden Tam İzole)   │
└─────────────────┬─────────────────┴────────────────┬─────────────────┴─────────────────┬─────────────────┘
                  │                                  │                                   │
                  └──────────────────────────────────┼───────────────────────────────────┘
                                                     ▼
                          REST API (OpenAPI 3.1 / HTTPS) + WebSocket (JSON Events)
                                                     │
                                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     JAVA 21 + SPRING BOOT 3 MODÜLER MONOLİT BACKEND (SERVER TIER)                        │
├────────────────────────┬────────────────────────┬───────────────────────────┬────────────────────────────┤
│ 1. Identity & Profile  │ 2. Campaign & Business │ 3. Dispatch, Geo & Order  │ 4. Governance, Audit &     │
│    Module              │    Membership Module   │    State Machine Module   │    Document Security Module│
│ • UserAccount (Single) │ • IntroCampaign Engine │ • TAXI_RIDE               │ • Append-Only AuditLog     │
│ • CustomerProfile      │ • BusinessSubscription │ • INDIVIDUAL_DELIVERY     │ • TransactionFeeSnapshot   │
│ • Driver/CourierProfile│ • MANUAL_APPROVAL Flow │ • BUSINESS_DELIVERY       │ • KYC & Receipt Pre-signed │
│ • BusinessSubUser ACL  │ • Effective Date Calc  │ • Atomic Offer Lock       │   Object Storage Guard     │
└────────────────────────┴───────────┬────────────┴──────────────┬────────────┴────────────────────────────┘
                                     │                           │
                                     ▼                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                         VERİ VE ENTEGRASYON KATMANI (DATA & INTEGRATION TIER)                            │
├────────────────────────────────────────────────────┬─────────────────────────────────────────────────────┤
│         POSTGRESQL 16 + POSTGIS 3.4                │        DIŞ SERVİSLER VE SANDBOX/MOCK AYRIMI         │
│ • ACID İşlemler & SELECT ... FOR UPDATE Kilitleri  │ • Yol Ağı Rota/ETA Servisi (Gerçek Yol Mesafesi)    │
│ • PostGIS Coğrafi Yarıçap & Geofence Sorguları     │ • SMS OTP & Bildirim Sağlayıcısı (Adapter Pattern)  │
│ • Optimistic Locking (@Version) & Idempotency Tablo│ • S3 Uyumlu Özel Belge/Dekont Depolama              │
│ • Redis: İlk pilotta zorunlu değil (PostgreSQL)    │ • Mock/Sandbox: Yalnızca test/simülasyon profilinde │
└────────────────────────────────────────────────────┴─────────────────────────────────────────────────────┘
```

#### 1.2. Katı Mimari Kurallar ve Yasaklar
1. **`localStorage` Yasağı**: Üretim ortamında siparişler, kullanıcılar, işletme üyelikleri, ücret snapshot'ları veya denetim kayıtları tarayıcı `localStorage` alanında tutulamaz. İstemci yalnızca oturum belirtecini (güvenli depoda) ve geçici UI tercihlerini (tema, dil) saklar.
2. **Haversine vs Gerçek Yol Mesafesi Kuralı**:
   - PostGIS (`ST_DWithin` / Haversine) yalnızca **müsait sürücü/kurye adaylarını coğrafi yarıçap içinde hızlı filtrelemek** için kullanılır.
   - Müşteriye gösterilen fiyatlandırma mesafesi ve tahmini varış süresi (ETA), **gerçek yol ağı yönlendirme servisinden (Routing Engine)** alınır. Yönlendirme servisi yanıt vermezse Haversine mesafesi `1.30` şehir içi yol kıvrım katsayısıyla çarpılarak geçici tahmin üretilir ve kayda `distanceCalculationMethod = 'FALLBACK_HAVERSINE'` olarak işlenir.
3. **Değiştirilemezlik (`Immutability`) ve SHA-256 Sınırı**:
   - SHA-256 özeti tek başına güvenlik sağlamaz. `transaction_fee_snapshots` ve `audit_logs` tablolarında uygulama veritabanı kullanıcısının `UPDATE` ve `DELETE` yetkisi PostgreSQL `REVOKE UPDATE, DELETE` komutuyla ve veritabanı tetikleyicisi (`BEFORE UPDATE OR DELETE RAISE EXCEPTION`) ile kapatılır.
4. **Tek Hesap, Çoklu Profil ve Sunucu Yetkilendirmesi**:
   - Her gerçek kişi tek bir `UserAccount` (`id`, `phone`, `status`) kaydına sahiptir.
   - Bu hesaba bağlı `CustomerProfile` (varsayılan açık), `DriverProfile` (taksi şoförü), `CourierProfile` (kurye) ve `BusinessMemberProfile` (işletme sahibi veya alt kullanıcısı) bulunabilir.
   - Her API çağrısında JWT içindeki `activeProfileType`, hedef kaynağın `tenant/businessId` sahipliği ve profilin anlık operasyonel durumu (`APPROVED`, blokaj yok, aktif üyelik) Spring Security filtreleriyle sunucuda doğrulanır.

---

### 2. HİZMET VE TİCARİ MODEL SPESİFİKASYONU

#### 2.1. Hizmet Kapsamı ve Komisyon/Ücret Kuralları

| Parametre / Kural | `TAXI_RIDE` (Taksi Yolcu) | `INDIVIDUAL_DELIVERY` (Bireysel Paket) | `BUSINESS_DELIVERY` (İşletme Paket) | `MOTO_PASSENGER_RIDE` (Motor Yolcu) |
| :--- | :--- | :--- | :--- | :--- |
| **M0 Durumu** | **AKTİF** | **AKTİF** | **AKTİF** | **PASİF (Kapsam Dışı — Gelecek Vizyonu)** |
| **Çağrı Başlatabilen Profil** | `CustomerProfile` | `CustomerProfile` (Birey veya İşletme Hesabı) | `BusinessAccount` (`owner`, `branch_manager`, `dispatch_staff`) | Hiçbiri (UKOME yazılı onayı olmadan kapalı) |
| **Hizmet Veren Profil** | `DriverProfile` (Ticari Taksi) | `CourierProfile` (Motokurye / Araçlı Kurye) | `CourierProfile` (Motokurye / Araçlı Kurye) | Yok (M0'da kapalı) |
| **Müşteri Platform Hizmet Bedeli** | `0.00 TL (%0)` | `0.00 TL (%0)` | `0.00 TL (%0)` | `0.00 TL (%0)` (Gelecek ilkesi) |
| **Şoför / Kurye Platform Kesintisi** | `0.00 TL (%0)` | `0.00 TL (%0)` | `0.00 TL (%0)` | `0.00 TL (%0)` (Gelecek ilkesi) |
| **İşletme Sipariş Başı Komisyonu** | Yok | `0.00 TL (%0)` | `0.00 TL (%0)` | Yok |
| **Platformun Gelir Kalemi** | Yok (`0.00 TL`) | Yok (`0.00 TL`) | Ücretsiz Tanışma (`FREE_INTRO`) sonrası **Haftalık Sabit Üyelik Bedeli** | Yok |
| **Taşıma Ücreti Tahsilat Akışı (M0)** | Yolcu $\rightarrow$ Şoför (Doğrudan: Nakit / Şoför POS'u) | Gönderici/Alıcı $\rightarrow$ Kurye (Doğrudan: Nakit / Kurye POS'u) | İşletme/Alıcı $\rightarrow$ Kurye (Doğrudan: Nakit / Kurye POS'u) | Yok |

> [!IMPORTANT]
> **M0 Finansal Kapsam Sınırı (Sıfır Komisyon $\neq$ Para Hareketi Aracılığı)**
> - M0'da platform **ödeme kuruluşu / elektronik para kuruluşu (escrow, cüzdan, kart saklama, otomatik kart çekimi, IBAN'a otomatik bakiye dağıtımı)** olarak çalışmaz.
> - Yolculuk veya teslimat tamamlandığında sistem **para transferi yapmaz**; `TransactionFeeSnapshot` üzerinde hesaplanan taşıma tutarını (`displayedTransportAmount`), `0.00 TL` komisyonları ve işin tamamlandığını kayıt altına alır. Şoför/kurye ekranındaki "Kazanç Tablosu" tamamlanan işlerin bilgilendirici hakediş kaydıdır.
> - Platformun M0'da tahsil ettiği tek bedel olan **İşletme Haftalık Sabit Üyelik Ücreti**, işletme tarafından şirketin banka hesabına **Havale/EFT** ile gönderilir, işletme panelinden ödeme bildirimi (dekont) yüklenir ve Admin tarafından **`MANUAL_APPROVAL`** ile onaylanır.

---

### 3. KAMPANYA (`IntroCampaign`) VE İŞLETME ÜYELİĞİ (`BusinessSubscription`) DURUM MAKİNELERİ

#### 3.1. Zamanlama, Saat Dilimi ve Tek Doğruluk Formülü (`ücretsiz_mi`)
- **Saat Dilimi**: Tüm tarih sınırları **`Europe/Istanbul` (`UTC+03:00`)** saat dilimine göre hesaplanır.
- **Etkin Bitiş Tarihi (`effectiveIntroEndDate`)**:
  $$\text{effectiveIntroEndDate} = \text{business.personalIntroEndDate} \;\ ?? \;\ \text{business.assignedIntroCampaign.endDate}$$
- **Ücretsiz Tanışma Kontrolü (`isFreeIntroActive` / `ücretsiz_mi`)**:
  $$\text{isFreeIntroActive} = (\text{effectiveIntroEndDate} \neq \text{null}) \land (\text{now}_{\text{Istanbul}} < \text{effectiveIntroEndDate})$$
- **Bitiş Günü Sınır Kuralı**: `effectiveIntroEndDate` değeri `2026-05-20T00:00:00+03:00` olarak tanımlandığında, son ücretsiz saniye `19 Mayıs 23:59:59`'dur. `20 Mayıs 00:00:00` itibarıyla `isFreeIntroActive = false` olur.
- **Kişisel Tanışma Tarihinin Üstünlüğü**: Bir işletmeye yönetici tarafından `personalIntroEndDate` atanmışsa (kampanya bitişinden daha ileri veya daha geri bir tarih), sistem her zaman `personalIntroEndDate` değerini esas alır.
- **Kampanya Bulunmaması veya Başlamamış Olması**: İşletme doğrulandığı (`KYC Approved`) anda sistemde `ACTIVE` durumda hiçbir kampanya yoksa ve işletmeye `personalIntroEndDate` tanımlanmamışsa (`effectiveIntroEndDate == null`), `isFreeIntroActive = false` döner ve işletme doğrudan `PLAN_SELECTION_REQUIRED` durumuna geçer.

#### 3.2. `IntroCampaign` Durum Makinesi (6 Durum ve Tam Geçiş Tablosu)
Kampanya durumları: `DRAFT`, `SCHEDULED`, `ACTIVE`, `PAUSED`, `ENDED`, `ARCHIVED`.

| Geçiş Kodu | Kaynak Durum | Hedef Durum | Tetikleyici | Ön Koşul & Çakışma Kuralı | Yetkili Aktör | Veri Değişikliği & Audit | Hata Davranışı | Kabul Testi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CMP-T01** | *(Yok)* | `DRAFT` | Kampanya oluşturma formu gönderimi | `startDate < endDate`, kampanya adı dolu | Admin | Yeni `IntroCampaign(status=DRAFT, version=1)` ve `AuditLog` yazılır. | `400 Bad Request` (Geçersiz tarih aralığı). | Taslak kampanya oluşturulur, hiçbir işletmeye atanmaz. |
| **CMP-T02** | `DRAFT` | `SCHEDULED` | Admin "Planla / Onayla" aksiyonu | `startDate > now` VE mevcut hiçbir `SCHEDULED` veya `ACTIVE` kampanya ile `[startDate, endDate)` aralığı kesişmemeli (`startA < endB && startB < endA`). | Admin | `status = SCHEDULED`, `version += 1`, `AuditLog` kaydı. | `409 Conflict` (Çakışan kampanya ID ve tarihleri döner). | Çakışmasız kampanya `SCHEDULED` olur; çakışan reddedilir. |
| **CMP-T03** | `DRAFT` veya `SCHEDULED` | `ACTIVE` | Zamanlayıcı (`startDate <= now`) veya Admin "Şimdi Başlat" | Sistemde başka `ACTIVE` kampanya olmamalı ve tarih aralığı kesişmemeli. | Sistem / Admin | `status = ACTIVE`, `activatedAt = now`, `version += 1`, `AuditLog`. | `409 Conflict` (Halihazırda aktif kampanya var). | Sistemde aynı anda en fazla 1 adet `ACTIVE` kampanya bulunur. |
| **CMP-T04** | `ACTIVE` | `PAUSED` | Admin "Kampanyayı Duraklat" aksiyonu | Gerekçe (`justification`) zorunlu. | Admin | `status = PAUSED`, `pausedAt = now`, `version += 1`, `AuditLog`. **Önceden bu kampanyaya atanmış işletmelerin `FREE_INTRO` bitiş tarihi değişmez.** | Gerekçe boşsa `422 Unprocessable Entity`. | Yeni işletmelere atanmaz; mevcut işletmelerin hakkı korunur. |
| **CMP-T05** | `PAUSED` | `ACTIVE` | Admin "Yeniden Etkinleştir" aksiyonu | `endDate > now`, başka `ACTIVE` kampanya yok, tarih çakışması yok, gerekçe dolu. | Admin | `status = ACTIVE`, `version += 1`, `AuditLog`. | Başka aktif kampanya varsa `409 Conflict`. | Çakışma kontrolünden geçerek tekrar aktifleşir. |
| **CMP-T06** | `ACTIVE` | `ACTIVE` *(Süre Uzatma)* | Admin "Bitiş Tarihini Uzat" aksiyonu | `newEndDate > oldEndDate`, ileri tarihli `SCHEDULED` kampanya ile kesişmeme, gerekçe dolu, `@Version` eşleşmesi. | Admin | `endDate = newEndDate`, `version += 1`, `AuditLog(oldValue, newValue, justification)`. | Sürüm uyuşmazlığında `409 OptimisticLockException`. | Kampanya sürümü artar ve bağlı işletmelerin etkin tarihi uzar. |
| **CMP-T07** | `ACTIVE` veya `PAUSED` | `ENDED` | Zamanlayıcı (`now >= endDate`) veya Admin "Erken Sonlandır" | Erken sonlandırmada gerekçe zorunlu; mevcut işletmelerin kazanılmış tarihi (`assignedCampaignEndDateSnapshot`) korunur. | Sistem / Admin | `status = ENDED`, `endedAt = now`, `version += 1`, `AuditLog`. | `ENDED` kampanya tekrar `ACTIVE` yapılamaz (`400`). | Kampanya biter, yeni atama kapanır. |
| **CMP-T08** | `ENDED` | `ARCHIVED` | Admin "Arşivle" aksiyonu | Kampanya `ENDED` durumunda olmalı. | Admin | `status = ARCHIVED`, `archivedAt = now`, `version += 1`, `AuditLog`. Salt-okunur (`DELETE` yasak). | Silme (`DELETE`) denemesi `403 Forbidden` ile engellenir. | Kampanya salt-okunur arşive taşınır. |

#### 3.3. `BusinessSubscription` Durum Makinesi (8 Durum ve Tam Geçiş Tablosu)
İşletme üyelik durumları: `REGISTERED`, `FREE_INTRO`, `PLAN_SELECTION_REQUIRED`, `PAYMENT_PENDING`, `ACTIVE_MEMBERSHIP`, `GRACE_PERIOD`, `LIMITED_ACCESS`, `CANCELLED`.

| Geçiş Kodu | Kaynak Durum | Hedef Durum | Tetikleyici | Ön Koşul | Yetkili Aktör | Veri Değişikliği | Kullanılabilir Özellikler | Hata / Kenar Durum Davranışı | Kabul Testi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SUB-T01** | *(Yok)* | `REGISTERED` | İşletme kayıt başvurusu | Vergi no, unvan, yetkili telefon OTP doğrulaması | İşletme Sahibi | `BusinessAccount` ve `BusinessSubscription(status=REGISTERED, version=1)` oluşur. | Profil hazırlığı açık; `BUSINESS_DELIVERY` kapalı; `CustomerProfile` ile `INDIVIDUAL_DELIVERY` açık. | Mükerrer vergi no varsa `409 Conflict`. | Kayıtlı işletme onay 전 kurumsal çağrı açamaz. |
| **SUB-T02** | `REGISTERED` | `FREE_INTRO` | Admin işletme KYC/Vergi onayı | İşletme belgeleri tam VE `ücretsiz_mi == true` (aktif kampanya veya kişisel tarih var). | Admin | `status = FREE_INTRO`, `assignedIntroCampaignId`, `introEndDateSnapshot` kaydedilir, `AuditLog` yazılır. | Tüm profesyonel panel (`BUSINESS_DELIVERY`, toplu sipariş, alt kullanıcılar, raporlar) **0 TL** ile açık. | Belgeler eksikse onaylanamaz (`422`). | Onaylanan işletme ücretsiz tanışma dönemine başlar. |
| **SUB-T03** | `REGISTERED` | `PLAN_SELECTION_REQUIRED` | Admin işletme KYC/Vergi onayı (Kampanyasız) | İşletme belgeleri tam ANCAK `ücretsiz_mi == false` (aktif kampanya ve kişisel tarih yok). | Admin | `status = PLAN_SELECTION_REQUIRED`, `decisionDeadline = now + [KARAR_SURESI_GUN]`, `AuditLog`. | `BUSINESS_DELIVERY` kapalı; plan seçim ekranı açık; `INDIVIDUAL_DELIVERY` açık. | Otomatik borçlandırma yapılmaz. | Kampanya yoksa işletme doğrudan plan seçimine yönlendirilir. |
| **SUB-T04** | `FREE_INTRO` | `PLAN_SELECTION_REQUIRED` | Zamanlayıcı (`now >= effectiveIntroEndDate`) | Tanışma süresi doldu (`ücretsiz_mi == false`). | Sistem Zamanlayıcı | `status = PLAN_SELECTION_REQUIRED`, `decisionDeadline = now + [KARAR_SURESI_GUN]`. **Yoldaki aktif siparişler etkilenmez.** | Yeni `BUSINESS_DELIVERY` kapalı; geçmiş raporlar salt-okunur açık; `INDIVIDUAL_DELIVERY` açık. | Otomatik kart çekimi veya sessiz ücretlendirme kesinlikle yapılmaz. | Gece `00:00`'da süresi biten işletme plan seçimine geçer. |
| **SUB-T05** | `PLAN_SELECTION_REQUIRED` | `PAYMENT_PENDING` | İşletme "Haftalık Plan Seç & Havale Dekontu Bildir" | Geçerli tutar, banka referans/dekont dosyası yüklendi. | İşletme (`owner` / `accountant`) | `status = PAYMENT_PENDING`, `ManualPaymentNotification(status=PENDING)` kaydı oluşur. | Yeni `BUSINESS_DELIVERY` admin onayına kadar kapalı; geçmiş raporlar ve `INDIVIDUAL_DELIVERY` açık. | Dekontsuz veya `0 TL` bildirim `400 Bad Request` ile reddedilir. | Dekont yükleyen işletme onay kuyruğuna düşer. |
| **SUB-T06** | `PLAN_SELECTION_REQUIRED` | `LIMITED_ACCESS` | Zamanlayıcı (`now >= decisionDeadline`) veya "Şimdilik Bireysel Devam Et" | Karar süresi içinde ödeme bildirimi yapılmadı. | Sistem / İşletme | `status = LIMITED_ACCESS`, `limitedSince = now`, `AuditLog`. **Hiçbir veri silinmez.** | `BUSINESS_DELIVERY` ve alt kullanıcı sipariş girişi kapalı; tüm geçmiş raporlar salt-okunur açık; `CustomerProfile` üzerinden `INDIVIDUAL_DELIVERY` açık. | Veri silme veya hesabı tamamen kilitleme yasaktır. | Karar süresi dolan işletme veri kaybetmeden sınırlı erişime geçer. |
| **SUB-T07** | `PAYMENT_PENDING` | `ACTIVE_MEMBERSHIP` | Admin "Havale Ödemesini Onayla (`MANUAL_APPROVAL`)" | Dekont ve banka hesabı mutabakatı doğrulandı (`@Version` kontrolü). | Admin | `status = ACTIVE_MEMBERSHIP`, `currentPeriodStart = now`, `currentPeriodEnd = now + 7 gün`, `AuditLog`. | Tüm `BUSINESS_DELIVERY`, toplu sipariş, alt kullanıcı ve raporlama özellikleri **%0 sipariş komisyonuyla** tam açık. | Aynı dekont iki kez onaylanamaz (`409 Idempotency`). | Onaylanan işletmenin 7 günlük aktif üyeliği başlar. |
| **SUB-T08** | `PAYMENT_PENDING` | `PLAN_SELECTION_REQUIRED` veya `LIMITED_ACCESS` | Admin "Havale Bildirimini Reddet" | Dekont geçersiz veya tutar hatalı; red gerekçesi zorunlu. | Admin | Karar/tolerans süresi bitmediyse `PLAN_SELECTION_REQUIRED`, bittiyse `LIMITED_ACCESS`; işletmeye bildirim gider ve **yeniden dekont gönderme** hakkı açıktır. | `BUSINESS_DELIVERY` kapalı; yeniden ödeme bildirimi formu ve `INDIVIDUAL_DELIVERY` açık. | Gerekçesiz red `422` hatası verir. | Reddedilen dekont sonrası işletme düzeltilmiş dekont yükleyebilir. |
| **SUB-T09** | `ACTIVE_MEMBERSHIP` | `GRACE_PERIOD` | Zamanlayıcı (`now >= currentPeriodEnd`) | 7 günlük haftalık üyelik süresi doldu ve yeni hafta ödemesi henüz onaylanmadı. | Sistem Zamanlayıcı | `status = GRACE_PERIOD`, `graceDeadline = currentPeriodEnd + [GRACE_PERIOD_GUN]`, `AuditLog`. | **Tüm `BUSINESS_DELIVERY` ve panel özellikleri açık kalmaya devam eder** (operasyon yarıda kesilmez). | Tolerans süresinde ekstra ceza/faiz yansıtılmaz. | Süresi biten işletme tolerans süresince sipariş açmaya devam eder. |
| **SUB-T10** | `GRACE_PERIOD` | `PAYMENT_PENDING` / `ACTIVE_MEMBERSHIP` | İşletme yeni hafta havalesini bildirir ve Admin onaylar | Havale bildirimi ve `MANUAL_APPROVAL`. | İşletme + Admin | Admin onayladığında `status = ACTIVE_MEMBERSHIP`, yeni 7 günlük dönem başlatılır. | Tüm kurumsal özellikler kesintisiz devam eder. | Dekont onaylanana kadar `graceDeadline` içinde yetki korunur. | Tolerans süresinde yenilenen üyelik kesintisiz devam eder. |
| **SUB-T11** | `GRACE_PERIOD` | `LIMITED_ACCESS` | Zamanlayıcı (`now >= graceDeadline`) | Tolerans süresi dolduğu halde onaylanmış yeni ödeme yok. | Sistem Zamanlayıcı | `status = LIMITED_ACCESS`, `limitedSince = now`, `AuditLog`. **Aktif/yoldaki siparişler tamamlanana kadar sürer.** | Yeni `BUSINESS_DELIVERY` kapanır; geçmiş veriler salt-okunur korunur; `INDIVIDUAL_DELIVERY` açık kalır. | Hiçbir müşteri, şube veya sipariş geçmişi silinmez. | Tolerans süresi bitince işletme `LIMITED_ACCESS` durumuna düşer. |
| **SUB-T12** | `LIMITED_ACCESS` veya `CANCELLED` | `PAYMENT_PENDING` $\rightarrow$ `ACTIVE_MEMBERSHIP` | İşletme yeniden haftalık üyelik ödemesi bildirir ve Admin onaylar | İşletme hesabı blokajlı değilse her zaman geri dönebilir. | İşletme + Admin | Ödeme bildirimiyle `PAYMENT_PENDING`, Admin onayıyla `ACTIVE_MEMBERSHIP` olur. | Eski tüm şube, alt kullanıcı ve sipariş geçmişiyle kurumsal panel tekrar açılır. | Geçmiş veriler korunduğu için yeniden kurulum gerekmez. | Sınırlı erişimdeki işletme ödeme onayıyla tam erişime döner. |
| **SUB-T13** | Herhangi Bir Durum | `CANCELLED` | İşletme sahibi üyelik iptal talebi veya Admin fesih kararı | Gerekçe zorunlu; yoldaki aktif siparişlerin tamamlanması beklenir. | İşletme Sahibi / Admin | `status = CANCELLED`, `cancelledAt = now`, `AuditLog`. | `BUSINESS_DELIVERY` kapalı; geçmiş raporlar salt-okunur arşiv; `CustomerProfile` ile bireysel kullanım açık. | Fiziksel veri silme (`DELETE`) yapılmaz. | İptal edilen üyelikte tüm geçmiş kayıtlar arşivde korunur. |

#### 3.4. Alt Kullanıcıların (`BusinessSubUser`) ve Şubelerin Üyelik Durumundan Etkilenmesi
- Bir işletmenin tüm şubeleri ve alt kullanıcıları (`owner`, `branch_manager`, `dispatch_staff`, `accountant`, `read_only`), ana `BusinessAccount` kaydının `BusinessSubscription.status` durumuna tabidir.
- İşletme `LIMITED_ACCESS`, `PLAN_SELECTION_REQUIRED`, `PAYMENT_PENDING` veya `CANCELLED` durumuna geçtiğinde:
  - `branch_manager` ve `dispatch_staff` rollerinin yeni `BUSINESS_DELIVERY` oluşturma yetkisi sunucu tarafında (`403 BUSINESS_SUBSCRIPTION_INACTIVE`) otomatik olarak durdurulur.
  - `owner` ve `accountant` rolleri geçmiş sipariş/finans raporlarını salt-okunur görebilir ve `ManualPaymentNotification` (havale dekontu) yükleyebilir.
  - İşletme sahibinin kişisel `CustomerProfile` üzerinden tekil `INDIVIDUAL_DELIVERY` oluşturma hakkı kurumsal alt kullanıcılara devredilmez; yalnızca ilgili kişinin kendi `CustomerProfile` oturumuyla çalışır.

#### 3.5. Bildirim Zamanlama Motoru (Tanışma Dönemi ve Haftalık Üyelik Ortak Kuralları)
- **Tanışma Dönemi Bildirimleri**: `effectiveIntroEndDate` tarihine **`T-14 gün`**, **`T-7 gün`**, **`T-3 gün`**, **`T-1 gün`** kala ve **`T-0 (Bitiş günü 09:00 Europe/Istanbul)`** anında işletme sahibine bilgilendirme gönderilir (`[ADMIN_AYARI]`).
- **Haftalık Üyelik Bildirimleri**: Aynı zamanlama motoru haftalık üyelik bitişine **`T-2 gün`**, **`T-1 gün`**, **`T-0 (GRACE_PERIOD başlangıcı)`** ve **`GRACE_PERIOD bitişine T-1 gün`** kala hatırlatma üretir. Mükerrer bildirim göndermemek için `(business_id, notification_type, target_period_end_date)` tekil anahtarı (`UNIQUE constraint`) kullanılır.


---

### 4. ALTI ANA GÖRÜNÜMÜN SINIRLARI VE 22 UÇTAN UCA AKIŞ (`FLOW-01` – `FLOW-22`)

#### 4.1. Altı Ana Görünümün Mimari Sınırları

| Görünüm No | Görünüm Adı | Hedef Teknoloji / İstemci | Kimlik & Profil Sınırı | Yapabileceği İşlemler | Kesin Yasaklar / Sınırlar |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Görünüm 1** | **Kurumsal Web Portalı** (`WebsiteLanding`) | React / Next.js (SSR/SSG) | Anonim Ziyaretçi / Ön Başvuru Adayı | Vizyon, `%0` komisyon modeli, tanışma kampanyası bilgilendirmesi, şeffaf ücret/kazanç simülasyonu, şoför/kurye/işletme ön başvuru rehberi. | Üretim siparişi açamaz, iç operasyon veya müşteri verisine erişemez. |
| **Görünüm 2** | **Müşteri / Yolcu / Gönderici Mobil Görünümü** | **Tek Flutter Mobil Uygulaması** (`CustomerProfile` Modu) | `UserAccount` + Aktif `CustomerProfile` | `TAXI_RIDE` ve `INDIVIDUAL_DELIVERY` çağrısı açma, canlı takip, 4 haneli PIN gösterimi, güvenli mesajlaşma, 112 SOS, geçmiş fişler ve puanlama. | `MOTO_PASSENGER_RIDE` çağrısı açamaz (M0 dışı). Sürücü belgesi/onayı olmadan çağrı kabul edemez. |
| **Görünüm 3** | **Sürücü / Kurye Saha Mobil Görünümü** | **Tek Flutter Mobil Uygulaması** (`DriverProfile` / `CourierProfile` Modu) | `UserAccount` + KYC Onaylı (`APPROVED`) `DriverProfile` veya `CourierProfile` | Belge yükleme, çevrim içi/dışı olma, 15 sn çağrı teklifi kabul/ret, alış noktasına varış, 4 haneli PIN doğrulama, PoD fotoğraf/teslim kodu, kazanç kaydı izleme. | Ayrı bir mobil APK/IPA değildir; tek Flutter uygulaması içinde profil geçişiyle çalışır. KYC onaysız veya blokajlıyken çevrim içi olamaz. |
| **Görünüm 4** | **İşletme Web Paneli** (`BusinessPortal`) | React / Next.js Web Uygulaması | `BusinessAccount` + `BusinessSubUser` (`owner`, `branch_manager`, `dispatch_staff`, `accountant`, `read_only`) | Tanışma sayacı izleme, `BUSINESS_DELIVERY` tekil/toplu çağrı açma, şube/alt kullanıcı yönetimi, haftalık üyelik seçimi, Havale/EFT dekont bildirimi, `LIMITED_ACCESS` rapor izleme ve `CustomerProfile` ile bireysel gönderi başlatma. | Başka bir `businessId` verisine erişemez. Üyelik `ACTIVE_MEMBERSHIP`, `FREE_INTRO` veya `GRACE_PERIOD` değilken `BUSINESS_DELIVERY` başlatamaz. |
| **Görünüm 5** | **Admin / Operasyon Komuta Merkezi** (`AdminDashboard`) | React / Next.js Web Uygulaması | `AdminRole` (`SUPER_ADMIN`, `OPS_MANAGER`, `FINANCE_ADMIN`, `AUDITOR`) | Canlı filo radarı, sürücü/işletme KYC onayı, kampanya yönetimi (`IntroCampaign`), Havale/EFT `MANUAL_APPROVAL` onayı, tarife yönetimi, blokaj/ceza/hasar/kasa/denetim işlemleri. | `TransactionFeeSnapshot` ve `AuditLog` kayıtlarını silemez (`DELETE` yasak) veya `%0` komisyon kuralını M0'da değiştiremez. |
| **Görünüm 6** | **Bölünmüş Canlı Simülasyon Stüdyosu** (`SplitSimulationView`) | React / Next.js Test & Demo Kabuğu | Yalnızca `SIMULATION / SANDBOX` Ortamı | Müşteri, Sürücü/Kurye, İşletme ve Admin görünümlerini tek ekranda yan yana çalıştırarak uçtan uca sipariş, eşleşme, PIN ve durum geçişlerini canlı test etme. | **Üretim (`PRODUCTION`) veritabanına asla yazamaz**; tüm kayıtları `isSimulation = true` / ayrı sandbox şemasında izole çalışır. |

---

#### 4.2. 22 Uçtan Uca Akışın (`FLOW-01` – `FLOW-22`) Tam Spesifikasyonu

##### `FLOW-01`: Tek Hesap Kaydı, SMS OTP Doğrulaması ve Çoklu Profil Başlatma
- **Başlangıç Aktörü ve Ön Koşullar**: Kayıtsız kullanıcı veya mevcut kullanıcı; geçerli cep telefonu numarası.
- **Kullanılan Görünüm ve Ekranlar**: Tek Flutter Mobil Uygulaması (`C-01` OTP Ekranı, Profil Seçim Çekmecesi) veya İşletme Web Paneli Giriş Ekranı.
- **Adım Adım Kullanıcı Eylemleri**: (1) Telefon numarasını girer $\rightarrow$ (2) SMS ile gelen 6 haneli OTP kodunu girer $\rightarrow$ (3) Hesap oluşur ve varsayılan `CustomerProfile` aktifleşir $\rightarrow$ (4) İsterse aynı hesap altında "Şoför/Kurye Ol" veya "İşletme Hesabı Bağla" adımına geçer.
- **İlgili Modül, API ve Olaylar**: `IdentityModule` | `POST /api/v1/auth/otp/request`, `POST /api/v1/auth/otp/verify`, `POST /api/v1/profiles/switch` | Olay: `USER_AUTHENTICATED`.
- **Durum Geçişleri**: `OTP_PENDING` $\rightarrow$ `VERIFIED` $\rightarrow$ `ACCOUNT_ACTIVE (CustomerProfile=ACTIVE)`.
- **Yetkilendirme ve Doğrulama**: Dakikada en fazla 3 OTP isteği (Rate Limit), 5 hatalı denemede 15 dk geçici kilit, telefon formatı (`E.164` / `PhoneNumber`).
- **Başarılı Sonuç**: JWT erişim ve yenileme belirteci üretilir; `UserAccount` ve `CustomerProfile` PostgreSQL'de oluşturulur.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: 120 sn OTP süresi dolarsa "Yeniden Gönder" aktifleşir; SMS sağlayıcı hatasında yedek sağlayıcıya geçilir.
- **Kullanılan Veri Kayıtları**: `user_accounts`, `customer_profiles`, `otp_verification_logs`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M1`.
- **Test ve Kabul Kriterleri**: Aynı telefon numarasıyla ikinci bir `UserAccount` açılamamalı (`UNIQUE`); tek hesap altında hem müşteri hem sürücü profili bağlanabilmelidir.

##### `FLOW-02`: Taksi Şoförü ve Kurye Başvurusu, KYC Belge Yükleme ve Admin Onayı
- **Başlangıç Aktörü ve Ön Koşullar**: `UserAccount` sahibi kullanıcı; henüz onaylı `DriverProfile` veya `CourierProfile` yok.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 3 (`K-01` KYC Belge Yükleme) ve Görünüm 5 (`A-02` Admin KYC Onay Masası).
- **Adım Adım Kullanıcı Eylemleri**: (1) Hizmet rolünü seçer (`TAXI_DRIVER` veya `COURIER`) $\rightarrow$ (2) Ehliyet, ruhsat, zorunlu trafik sigortası, ticari belge ve adli sicil dosyalarını yükler $\rightarrow$ (3) Admin `A-02` ekranında belgeleri inceler ve "Onayla" veya "Gerekçeli Reddet" kararını verir.
- **İlgili Modül, API ve Olaylar**: `IdentityModule`, `DocumentStorageModule` | `POST /api/v1/Driver-kyc/upload-url`, `POST /api/v1/driver-kyc/submit`, `POST /api/v1/admin/kyc/{profileId}/decision` | Olay: `PROVIDER_KYC_APPROVED` / `PROVIDER_KYC_REJECTED`.
- **Durum Geçişleri**: `KYC_DRAFT` $\rightarrow$ `KYC_PENDING_REVIEW` $\rightarrow$ `KYC_APPROVED` veya `KYC_REJECTED`.
- **Yetkilendirme ve Doğrulama**: Dosya tipi (`PDF/JPG/PNG`), maksimum `10 MB`, özel S3/MinIO kovasına imzalı URL ile yükleme; yalnızca `OPS_MANAGER` / `SUPER_ADMIN` onaylayabilir.
- **Başarılı Sonuç**: 4 zorunlu belge onaylandığında `isVerified = true` olur ve sürücü/kurye çevrim içi olma yetkisi kazanır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Reddedilen belge için red gerekçesi sürücüye bildirim olarak düşer; sürücü yalnızca hatalı belgeyi yeniden yükleyebilir.
- **Kullanılan Veri Kayıtları**: `driver_profiles`, `courier_profiles`, `kyc_documents`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M1` ve `M4`.
- **Test ve Kabul Kriterleri**: En az 1 belgesi `PENDING` veya `REJECTED` olan sürücü `POST /api/v1/providers/availability` çağrısında `403 KYC_NOT_APPROVED` almalıdır.

##### `FLOW-03`: Sürücü / Kurye Çevrim İçi Olma, Konum Kalp Atışı (Heartbeat) ve Müsaitlik Yönetimi
- **Başlangıç Aktörü ve Ön Koşullar**: `KYC_APPROVED` durumunda ve aktif blokajı olmayan (`activeBlockageCount == 0`) taksi şoförü veya kurye.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 3 (`K-02` Eldiven Dostu Çevrim İçi Anahtarı ve Durum Ekranı).
- **Adım Adım Kullanıcı Eylemleri**: (1) Sürücü `44x44px+` boyutundaki "Çevrim İçi Ol" anahtarına dokunur $\rightarrow$ (2) Uygulama GPS iznini ve sigorta/muayene tarihini kontrol eder $\rightarrow$ (3) Durum `AVAILABLE` olur ve her 10 saniyede bir konum kalp atışı gönderilir $\rightarrow$ (4) Sürücü "Çevrim Dışı Ol"a bastığında konum paylaşımı durur.
- **İlgili Modül, API ve Olaylar**: `DispatchModule` | `PUT /api/v1/providers/me/status`, `POST /api/v1/providers/me/location` (veya WebSocket `LOCATION_PING`) | Olay: `PROVIDER_STATUS_CHANGED`.
- **Durum Geçişleri**: `OFFLINE` $\leftrightarrow$ `AVAILABLE` $\leftrightarrow$ `BUSY`.
- **Yetkilendirme ve Doğrulama**: `kycStatus == APPROVED`, araç sigorta/muayene tarihi `> today`, koordinatlar `[-90..90, -180..180]` aralığında.
- **Başarılı Sonuç**: Sürücünün son konumu PostGIS `GEOGRAPHY(Point, 4326)` sütununda güncellenir ve eşleştirme radarına dahil edilir.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: 90 saniye boyunca konum sinyali gelmeyen sürücü otomatik olarak `STALE_LOCATION` işaretlenir ve yeni çağrı adaylığından çıkarılır; üzerinde aktif iş varsa `OFFLINE` geçişi engellenir (`409 ACTIVE_ORDER_EXISTS`).
- **Kullanılan Veri Kayıtları**: `provider_locations`, `vehicle_assignments`, `system_blockages`.
- **İlgili M0–M7 Fazı**: `M4`.
- **Test ve Kabul Kriterleri**: Sigortası dün bitmiş araçla çevrim içi olma denemesi `403 VEHICLE_INSURANCE_EXPIRED` ile reddedilmelidir.

##### `FLOW-04`: Müşteri Taksi Çağrısı (`TAXI_RIDE`) Oluşturma, Rota/Fiyat Hesabı ve `%0` Komisyon Snapshot Mührü
- **Başlangıç Aktörü ve Ön Koşullar**: Doğrulanmış `CustomerProfile` kullanıcısı; askıda aktif yolculuğu yok.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 2 (`C-02` Ana Harita & Hizmet Seçimi, `C-03` Güzergâh & Şeffaf Fiyat Kutusu, `C-04` Çağrı Onayı).
- **Adım Adım Kullanıcı Eylemleri**: (1) `TAXI_RIDE` seçer $\rightarrow$ (2) Alış ve varış noktasını seçer $\rightarrow$ (3) Sistem yol ağı mesafesini (km), tahmini süreyi (dk) ve şeffaf fiyat kutusunu (`Taşıma Ücreti: X TL`, `Platform Hizmet Bedeli: 0.00 TL`, `Şoför Kesintisi: 0.00 TL`) gösterir $\rightarrow$ (4) "Taksi Çağır" butonuna basar.
- **İlgili Modül, API ve Olaylar**: `OrderModule`, `PricingModule` | `POST /api/v1/quotes/calculate`, `POST /api/v1/orders/taxi` (`Idempotency-Key` başlığıyla) | Olay: `TAXI_RIDE_REQUESTED`.
- **Durum Geçişleri**: `IDLE` $\rightarrow$ `SEARCHING`.
- **Yetkilendirme ve Doğrulama**: Alış ve varış arası en az `300m` olmalı, hizmet bölgesi geofence sınırları içinde olmalı, `Idempotency-Key` benzersiz olmalı.
- **Başarılı Sonuç**: Aynı veritabanı transaction'ı içinde `service_requests` kaydı (`status = SEARCHING`), 4 haneli `boardingCode` ve 18 alanlı değiştirilemez `TransactionFeeSnapshot` (`customerPlatformServiceFee = 0`, `providerPlatformFee = 0`) oluşturulur.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Aynı `Idempotency-Key` ile gelen tekrar istek yeni kayıt açmaz, mevcut çağrıyı döner.
- **Kullanılan Veri Kayıtları**: `service_requests`, `transaction_fee_snapshots`, `idempotency_keys`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M0` ve `M2`.
- **Test ve Kabul Kriterleri**: Oluşturulan `TransactionFeeSnapshot` kaydında tüm komisyon alanları `0.00` olmalı ve `UPDATE` denemesi veritabanı tarafından reddedilmelidir.

##### `FLOW-05`: Müşteri Bireysel Kurye / Paket Gönderimi (`INDIVIDUAL_DELIVERY`) Oluşturma
- **Başlangıç Aktörü ve Ön Koşullar**: `CustomerProfile` kullanıcısı (bireysel kullanıcı veya bireysel gönderi yapmak isteyen işletme sahibi).
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 2 (`C-02`, `C-03`, `C-04`) veya Görünüm 4 içindeki Bireysel Gönderi Kartı (`B-05`).
- **Adım Adım Kullanıcı Eylemleri**: (1) `INDIVIDUAL_DELIVERY` seçer $\rightarrow$ (2) Alış adresi, varış adresi, alıcı adı/telefonu, paket boyutu (`zarf/kucuk/orta/buyuk`) ve ağırlığını (`kg`) girer $\rightarrow$ (3) `%0` komisyonlu taşıma tutarını görür ve onaylar.
- **İlgili Modül, API ve Olaylar**: `OrderModule` | `POST /api/v1/orders/individual-delivery` (`Idempotency-Key` ile) | Olay: `INDIVIDUAL_DELIVERY_REQUESTED`.
- **Durum Geçişleri**: `IDLE` $\rightarrow$ `SEARCHING`.
- **Yetkilendirme ve Doğrulama**: Paket ağırlığı kurye taşıma limitine (`<= 25 kg` motokurye) uygun olmalı; alıcı telefonu geçerli `PhoneNumber` olmalı.
- **Başarılı Sonuç**: Sipariş, 4 haneli alış PIN kodu (`boardingCode`), 4 haneli alıcı teslim kodu (`deliveryCode`) ve `%0` komisyonlu `TransactionFeeSnapshot` ile oluşturulur.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Eksik alıcı bilgisi `400` döner; kurye atanmadan önce müşteri ücretsiz iptal edebilir.
- **Kullanılan Veri Kayıtları**: `service_requests`, `delivery_packages`, `transaction_fee_snapshots`.
- **İlgili M0–M7 Fazı**: `M0` ve `M2`.
- **Test ve Kabul Kriterleri**: `LIMITED_ACCESS` durumundaki bir işletme hesabı bile kendi `CustomerProfile` kimliğiyle bu akışı kullanarak tekil paket gönderebilmelidir.

##### `FLOW-06`: 15 Saniyelik Teklif Dağıtımı, Atomik Sürücü/Kurye Kabul Kilidi ve Eşleşme
- **Başlangıç Aktörü ve Ön Koşullar**: `SEARCHING` durumundaki çağrı ve PostGIS yarıçap sorgusuyla bulunan en yakın `AVAILABLE` ve güncel konumlu (`< 90 sn`) sürücü/kurye.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 2 (`C-05` Eşleşme Radarı) ve Görünüm 3 (`K-03` 15 Saniyelik Çağrı Teklifi HUD Ekranı).
- **Adım Adım Kullanıcı Eylemleri**: (1) Sistem en yakın uygun sürücüye teklifi gönderir (`OFFERED`, 15 sn sayaç) $\rightarrow$ (2) Sürücü ekranda alış/varış adresini ve `%100` net taşıma tutarını (`Platform Kesintisi: 0.00 TL`) görür $\rightarrow$ (3) "Kabul Et" veya "Pas Geç" butonuna basar.
- **İlgili Modül, API ve Olaylar**: `DispatchModule` | `POST /api/v1/offers/{offerId}/accept`, `POST /api/v1/offers/{offerId}/decline` | WebSocket: `OFFER_CREATED`, `ORDER_ACCEPTED`, `OFFER_EXPIRED`.
- **Durum Geçişleri**: `SEARCHING` $\rightarrow$ `OFFERED` $\rightarrow$ `ACCEPTED` (Ret veya 15 sn zaman aşımında tekrar `SEARCHING` $\rightarrow$ sıradaki adaya `OFFERED`).
- **Yetkilendirme ve Doğrulama**: **PostgreSQL Atomik Kilit**: Kabul anında `SELECT * FROM service_requests WHERE id = :id FOR UPDATE` çalıştırılır; yalnızca `status == 'OFFERED'` ve `currentOfferProviderId == :providerId` ise kabul işlenir, sürücü durumu `BUSY` yapılır.
- **Başarılı Sonuç**: Sipariş tek bir sürücüye atanır; müşteriye sürücü/araç bilgileri ve canlı konum akışı açılır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: 15 saniye içinde yanıt gelmezse teklif düşer ve ceza yazılmadan bir sonraki en yakın sürücüye geçilir; aynı anda iki kabul isteği gelirse ikincisi `409 ORDER_ALREADY_ASSIGNED` alır.
- **Kullanılan Veri Kayıtları**: `service_requests`, `dispatch_offers`, `provider_profiles`.
- **İlgili M0–M7 Fazı**: `M2` ve `M4`.
- **Test ve Kabul Kriterleri**: Paralel 10 kabul isteği gönderildiğinde yalnızca 1 tanesi `200 OK` almalı, 9 tanesi `409 Conflict` ile reddedilmelidir.

##### `FLOW-07`: Alış Noktasına Varış, 4 Haneli Güvenlik Kodu (`PIN`) Doğrulaması ve Taşıma Başlatma
- **Başlangıç Aktörü ve Ön Koşullar**: Çağrıyı kabul etmiş (`ACCEPTED`) sürücü/kurye ve müşteri/işletme.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 3 (`K-04` Navigasyon & Varış, `K-05` 4 Haneli PIN Girişi) ve Görünüm 2 (`C-06` Canlı Takip & PIN Gösterimi).
- **Adım Adım Kullanıcı Eylemleri**: (1) Sürücü alış noktasına yaklaşır ve "Alış Noktasına Vardım" butonuna basar $\rightarrow$ (2) Müşteriye "Sürücünüz Kapıda" bildirimi gider $\rightarrow$ (3) Müşteri/gönderici 4 haneli `boardingCode` değerini sürücüye söyler $\rightarrow$ (4) Sürücü kodu `K-05` ekranına girer ve işi başlatır.
- **İlgili Modül, API ve Olaylar**: `OrderModule` | `POST /api/v1/orders/{id}/arrive`, `POST /api/v1/orders/{id}/start` | WebSocket: `PROVIDER_ARRIVED`, `ORDER_IN_PROGRESS`.
- **Durum Geçişleri**: `ACCEPTED` $\rightarrow$ `ARRIVED` $\rightarrow$ `IN_PROGRESS`.
- **Yetkilendirme ve Doğrulama**: Sürücü koordinatı alış noktasına `<= 200m` mesafede olmalı (Geofence); 4 haneli `boardingCode` eşleşmeden `IN_PROGRESS` durumuna geçiş kesinlikle reddedilir (`422 INVALID_BOARDING_CODE`).
- **Başarılı Sonuç**: Yolculuk veya paket taşıma resmen başlar (`startedAt = now`).
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: 5 ardışık yanlış PIN girişinde güvenlik kilidi devreye girer ve operasyon merkezine uyarı düşer.
- **Kullanılan Veri Kayıtları**: `service_requests`, `order_state_history`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M2` ve `M4`.
- **Test ve Kabul Kriterleri**: Doğru PIN girilmeden doğrudan `POST /api/v1/orders/{id}/complete` çağrılırsa durum makinesi `409 INVALID_STATE_TRANSITION` hatası vermelidir.

##### `FLOW-08`: Teslimat Kanıtı (`PoD`), İş Tamamlama, Şeffaf Fiş ve Kazanç Kaydı
- **Başlangıç Aktörü ve Ön Koşullar**: `IN_PROGRESS` durumundaki aktif taksi yolculuğu veya paket teslimatı.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 3 (`K-06` PoD & Alıcı Doğrulama, `K-07` Tamamlama) ve Görünüm 2 (`C-08` Şeffaf Fiş & Değerlendirme).
- **Adım Adım Kullanıcı Eylemleri**: (1) Varış noktasına ulaşılır $\rightarrow$ (2) Paket teslimatıysa kurye alıcıdan 4 haneli `deliveryCode` alır veya zaman/koordinat damgalı teslimat kanıt fotoğrafı (`PoD`) yükler $\rightarrow$ (3) "İşi Tamamla" butonuna basar $\rightarrow$ (4) Taşıma bedeli doğrudan tahsil edilir, her iki ekranda `%0` komisyonlu şeffaf fiş gösterilir ve müşteri 1–5 yıldız puan verir.
- **İlgili Modül, API ve Olaylar**: `OrderModule` | `POST /api/v1/orders/{id}/complete`, `POST /api/v1/orders/{id}/rate` | WebSocket: `ORDER_COMPLETED`.
- **Durum Geçişleri**: `IN_PROGRESS` $\rightarrow$ `COMPLETED` (Çoklu pakette bazı paketler teslim edilemediyse `PARTIALLY_COMPLETED`).
- **Yetkilendirme ve Doğrulama**: Teslimat işlerinde `deliveryCode` veya `podPhotoKey` zorunludur; sürücü durumu `BUSY` $\rightarrow$ `AVAILABLE` olarak güncellenir.
- **Başarılı Sonuç**: Sipariş kapanır, `completedAt` yazılır ve sürücünün bilgilendirici kazanç çetelesine `TransactionFeeSnapshot.displayedTransportAmount` (`%100`) eklenir.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Alıcıya ulaşılamazsa kurye "Alıcıya Ulaşılamadı / İade Süreci" (`failed` / `returned`) kaydı açar.
- **Kullanılan Veri Kayıtları**: `service_requests`, `delivery_packages`, `provider_earnings_summary`, `ratings`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M2` ve `M4`.
- **Test ve Kabul Kriterleri**: Tamamlanan sipariş tekrar `IN_PROGRESS` veya `CANCELLED` durumuna geçirilememelidir.

##### `FLOW-09`: İşletme Kaydı, Vergi/KYC Doğrulaması ve `FREE_INTRO` Tanışma Kampanyası Ataması
- **Başlangıç Aktörü ve Ön Koşullar**: Esnaf, restoran veya e-ticaret işletmesi yetkilisi.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 4 (`BusinessPortal` Kayıt Ekranı, `B-01` Durum Başlığı) ve Görünüm 5 (`A-03` İşletme & Kampanya Yönetim Merkezi).
- **Adım Adım Kullanıcı Eylemleri**: (1) İşletme unvanı, vergi dairesi, vergi no, adres ve yetkili bilgilerini girer (`REGISTERED`) $\rightarrow$ (2) Vergi levhası belgesini yükler $\rightarrow$ (3) Admin başvuruyu inceler ve onaylar $\rightarrow$ (4) Sistem `ücretsiz_mi` kuralını çalıştırır; aktif kampanya varsa işletmeyi `FREE_INTRO` durumuna geçirir.
- **İlgili Modül, API ve Olaylar**: `BusinessMembershipModule` | `POST /api/v1/businesses/register`, `POST /api/v1/admin/businesses/{id}/approve` | Olay: `BUSINESS_APPROVED_FREE_INTRO`.
- **Durum Geçişleri**: `REGISTERED` $\rightarrow$ `FREE_INTRO` (Aktif kampanya/kişisel tarih yoksa `REGISTERED` $\rightarrow$ `PLAN_SELECTION_REQUIRED`).
- **Yetkilendirme ve Doğrulama**: Vergi numarası tekilliği (`10` veya `11` hane), Admin rol kontrolü.
- **Başarılı Sonuç**: İşletmeye yürürlükteki `IntroCampaign` bağlanır (`introEndDateSnapshot` kaydedilir) ve tüm `BUSINESS_DELIVERY` yetkileri `0 TL` ile açılır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Eksik vergi belgesinde başvuru `REGISTERED` kalır ve işletmeye düzeltme bildirimi gider.
- **Kullanılan Veri Kayıtları**: `business_accounts`, `business_subscriptions`, `intro_campaigns`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M0`, `M1` ve `M3`.
- **Test ve Kabul Kriterleri**: `REGISTERED` durumundaki işletme admin onayı almadan `POST /api/v1/orders/business-delivery` çağırırsa `403` almalıdır.

##### `FLOW-10`: İşletme Panelinden Tekil ve Çoklu (`BUSINESS_DELIVERY`) Paket Çağrısı Oluşturma
- **Başlangıç Aktörü ve Ön Koşullar**: Üyelik durumu `FREE_INTRO`, `ACTIVE_MEMBERSHIP` veya `GRACE_PERIOD` olan işletmenin yetkili kullanıcısı (`owner`, `branch_manager`, `dispatch_staff`).
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 4 (`B-02` Hızlı İşletme Teslimatı, `B-03` Toplu Sipariş & Çoklu Alıcı Rota Masası).
- **Adım Adım Kullanıcı Eylemleri**: (1) Tekil veya çoklu alıcı (3–5+ paket) adreslerini, alıcı telefonlarını ve paket boyutlarını girer $\rightarrow$ (2) Sistem her durak için mesafe ve toplam taşıma ücretini (`Sipariş Komisyonu: 0.00 TL`, `Kurye Kesintisi: 0.00 TL`) hesaplar $\rightarrow$ (3) "Kurye Çağır" butonuna basar.
- **İlgili Modül, API ve Olaylar**: `OrderModule`, `BusinessMembershipModule` | `POST /api/v1/orders/business-delivery` | Olay: `BUSINESS_DELIVERY_REQUESTED`.
- **Durum Geçişleri**: `IDLE` $\rightarrow$ `SEARCHING` $\rightarrow$ `OFFERED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `ARRIVED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED` / `PARTIALLY_COMPLETED`.
- **Yetkilendirme ve Doğrulama**: Sunucu tarafında (1) `user.businessId == request.businessId`, (2) `subUser.permissions.canCreateOrders == true`, (3) `subscription.status IN ('FREE_INTRO', 'ACTIVE_MEMBERSHIP', 'GRACE_PERIOD')` kontrolleri zorunludur.
- **Başarılı Sonuç**: Sipariş ve `TransactionFeeSnapshot` (`businessOrderCommission = 0.00`) mühürlenir ve kurye radarına düşer.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Üyelik `LIMITED_ACCESS` ise sunucu `403 SUBSCRIPTION_LIMITED_ACCESS` döner ve kullanıcıyı Bireysel Gönderi (`INDIVIDUAL_DELIVERY`) veya Plan Seçim ekranına yönlendirir.
- **Kullanılan Veri Kayıtları**: `service_requests`, `delivery_packages`, `transaction_fee_snapshots`, `business_subscriptions`.
- **İlgili M0–M7 Fazı**: `M0` ve `M3`.
- **Test ve Kabul Kriterleri**: `read_only` veya `accountant` rolündeki alt kullanıcı sipariş oluşturmayı denediğinde `403 INSUFFICIENT_SUBUSER_PERMISSION` almalıdır.

##### `FLOW-11`: Global Tanışma Kampanyası Oluşturma, Çakışma Kontrolü, Duraklatma ve Süre Uzatma
- **Başlangıç Aktörü ve Ön Koşullar**: `SUPER_ADMIN` veya `OPS_MANAGER` rolündeki yönetici.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 5 (`A-03` Tanışma Kampanyaları ve İşletme Üyelik Yönetim Merkezi).
- **Adım Adım Kullanıcı Eylemleri**: (1) Kampanya adı, başlangıç ve bitiş tarihini girerek taslak (`DRAFT`) oluşturur $\rightarrow$ (2) "Yayınla / Planla" butonuna basar $\rightarrow$ (3) Sistem `KURAL-01..06` tarih çakışma kontrolünü çalıştırır $\rightarrow$ (4) Gerektiğinde kampanyayı gerekçeyle `PAUSED` yapar veya bitiş tarihini uzatır (`version + 1`).
- **İlgili Modül, API ve Olaylar**: `CampaignModule` | `POST /api/v1/admin/intro-campaigns`, `PUT /api/v1/admin/intro-campaigns/{id}/status`, `PUT /api/v1/admin/intro-campaigns/{id}/extend` | Olay: `INTRO_CAMPAIGN_UPDATED`.
- **Durum Geçişleri**: `DRAFT` $\rightarrow$ `SCHEDULED` $\rightarrow$ `ACTIVE` $\leftrightarrow$ `PAUSED` $\rightarrow$ `ENDED` $\rightarrow$ `ARCHIVED`.
- **Yetkilendirme ve Doğrulama**: Tarih kesişme kontrolü (`startA < endB && startB < endA`), `@Version` iyimser kilidi ve zorunlu yönetici gerekçesi (`justification`).
- **Başarılı Sonuç**: Çakışmasız kampanya devreye girer; süre uzatıldığında `version` artar ve `AuditLog` üretilir.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Tarih kesişmesi varsa `409 CAMPAIGN_DATE_OVERLAP` döner; aynı anda iki admin güncellerse eski sürüm `409 OPTIMISTIC_LOCK_CONFLICT` alır.
- **Kullanılan Veri Kayıtları**: `intro_campaigns`, `business_subscriptions`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M0` ve `M5`.
- **Test ve Kabul Kriterleri**: Kampanya `PAUSED` yapıldığında önceden bu kampanyaya bağlanmış işletmelerin `effectiveIntroEndDate` değeri değişmemelidir.

##### `FLOW-12`: İşletmeye Özel Kişisel Tanışma Tarihi (`personalIntroEndDate`) Tanımlama ve Override
- **Başlangıç Aktörü ve Ön Koşullar**: `SUPER_ADMIN` / `OPS_MANAGER`; hedef işletme kaydı mevcut.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 5 (`A-03`) ve Görünüm 4 (`B-01` Canlı Durum Banner'ı).
- **Adım Adım Kullanıcı Eylemleri**: (1) Admin listeden işletmeyi seçer $\rightarrow$ (2) Yeni `personalIntroEndDate` tarihini ve zorunlu açıklamayı girer $\rightarrow$ (3) Sistem `effectiveIntroEndDate = personalIntroEndDate ?? campaign.endDate` formülünü yeniden değerlendirir.
- **İlgili Modül, API ve Olaylar**: `BusinessMembershipModule` | `PUT /api/v1/admin/businesses/{id}/personal-intro-date` | Olay: `PERSONAL_INTRO_DATE_UPDATED`.
- **Durum Geçişleri**: Yeni tarih `> now` ise işletme (`LIMITED_ACCESS` veya `PLAN_SELECTION_REQUIRED` olsa bile) `FREE_INTRO` durumuna geçer.
- **Yetkilendirme ve Doğrulama**: Gerekçe alanı boş bırakılamaz, `@Version` kontrolü yapılır.
- **Başarılı Sonuç**: Kişisel tarih global kampanya tarihini ezer ve `AuditLog` kaydı oluşur.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Geçmiş bir tarih verilmek istenirse uyarı gösterilir ve onaylanırsa `ücretsiz_mi = false` olarak güncellenir.
- **Kullanılan Veri Kayıtları**: `business_subscriptions`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M0` ve `M5`.
- **Test ve Kabul Kriterleri**: Global kampanya bitmiş olsa dahi `personalIntroEndDate > now` olan işletmede `ücretsiz_mi == true` dönmelidir.

##### `FLOW-13`: Tanışma Süresi Bitimi (`T-14..T-0`), `PLAN_SELECTION_REQUIRED` ve Aktif İşlerin Korunması (`In-Flight Protection`)
- **Başlangıç Aktörü ve Ön Koşullar**: `FREE_INTRO` durumundaki işletme; `effectiveIntroEndDate` yaklaşmakta veya dolmuş.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 4 (`B-01` Uyarı Banner'ı, `B-04` Plan Seçim Ekranı).
- **Adım Adım Kullanıcı Eylemleri**: (1) Sistem `T-14`, `T-7`, `T-3`, `T-1` günlerinde işletmeye bilgilendirme gönderir $\rightarrow$ (2) Bitiş günü `00:00 (Europe/Istanbul)` olduğunda işletme `PLAN_SELECTION_REQUIRED` durumuna geçer $\rightarrow$ (3) O sırada yolda (`IN_PROGRESS` / `ACCEPTED`) olan teslimatlar kesintisiz tamamlanır $\rightarrow$ (4) İşletme yeni kurumsal sipariş açmak istediğinde şeffaf plan seçim ekranıyla karşılaşır.
- **İlgili Modül, API ve Olaylar**: `MembershipSchedulerModule` | İç Zamanlayıcı & `GET /api/v1/businesses/me/subscription` | Olay: `INTRO_PERIOD_EXPIRED`.
- **Durum Geçişleri**: `FREE_INTRO` $\rightarrow$ `PLAN_SELECTION_REQUIRED` (Karar süresi `3 gün` içinde işlem yapılmazsa $\rightarrow$ `LIMITED_ACCESS`).
- **Yetkilendirme ve Doğrulama**: Otomatik kart çekimi yasağı; aktif siparişlerin durum makinesine dokunmama kuralı.
- **Başarılı Sonuç**: Hiçbir gizli tahsilat yapılmadan işletmeye haftalık sabit plan veya bireysel devam seçeneği sunulur.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Zamanlayıcı hatasında API katmanı da anlık `now < effectiveIntroEndDate` kontrolü yaptığı için süresi dolmuş işletme her durumda yakalanır.
- **Kullanılan Veri Kayıtları**: `business_subscriptions`, `notification_logs`, `service_requests`.
- **İlgili M0–M7 Fazı**: `M0` ve `M3`.
- **Test ve Kabul Kriterleri**: Saat `23:55`'te açılan ve `00:15`'te biten siparişin `TransactionFeeSnapshot` kaydı ve kurye teslim akışı `00:00` geçişinden etkilenmemelidir.

##### `FLOW-14`: Haftalık Sabit Üyelik Havale/EFT Bildirimi (`PAYMENT_PENDING`) ve Admin `MANUAL_APPROVAL` Onay/Red Akışı
- **Başlangıç Aktörü ve Ön Koşullar**: `PLAN_SELECTION_REQUIRED`, `GRACE_PERIOD` veya `LIMITED_ACCESS` durumundaki işletme (`owner` / `accountant`) ve Admin (`FINANCE_ADMIN` / `SUPER_ADMIN`).
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 4 (`B-04` Havale Bildirim Formu) ve Görünüm 5 (`A-03` Havale Onay Kuyruğu).
- **Adım Adım Kullanıcı Eylemleri**: (1) İşletme haftalık sabit ücreti (`[ADMIN_AYARI]`) banka hesabına Havale/EFT yapar $\rightarrow$ (2) Dekont dosyasını ve gönderici IBAN/referans bilgisini `B-04` ekranından yükler (`PAYMENT_PENDING`) $\rightarrow$ (3) Admin `A-03` ekranında dekontu inceler $\rightarrow$ (4) "Onayla (`MANUAL_APPROVAL`)" seçerse 7 günlük `ACTIVE_MEMBERSHIP` başlar; "Reddet" seçerse gerekçeyle işletmeye yeniden bildirim hakkı tanınır.
- **İlgili Modül, API ve Olaylar**: `BusinessMembershipModule` | `POST /api/v1/businesses/me/payment-notifications`, `POST /api/v1/admin/payment-notifications/{id}/approve`, `POST /api/v1/admin/payment-notifications/{id}/reject` | Olay: `MEMBERSHIP_PAYMENT_APPROVED` / `REJECTED`.
- **Durum Geçişleri**: `PLAN_SELECTION_REQUIRED / LIMITED_ACCESS` $\rightarrow$ `PAYMENT_PENDING` $\rightarrow$ `ACTIVE_MEMBERSHIP` (veya Red durumunda `PLAN_SELECTION_REQUIRED / LIMITED_ACCESS`).
- **Yetkilendirme ve Doğrulama**: Dekont dosyası özel depoda imzalı URL ile incelenir; aynı banka referans numarası mükerrer onaylanamaz (`UNIQUE`); `@Version` kontrolü yapılır.
- **Başarılı Sonuç**: İşletme 7 gün boyunca (`currentPeriodEnd = now + 7 days`) sınırsız `BUSINESS_DELIVERY` hakkı kazanır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Reddedilen bildirimde işletme doğru dekontu tekrar yükleyerek yeniden `PAYMENT_PENDING` başlatabilir.
- **Kullanılan Veri Kayıtları**: `manual_payment_notifications`, `business_subscriptions`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M0`, `M3` ve `M5`.
- **Test ve Kabul Kriterleri**: Admin onayı olmadan yalnızca dekont yüklemek (`PAYMENT_PENDING`) `BUSINESS_DELIVERY` yetkisini açmamalıdır (ancak işletme `GRACE_PERIOD` içindeyse tolerans süresi bitene kadar mevcut hakkı korunur).

##### `FLOW-15`: Haftalık Üyelik Süre Bitimi, `GRACE_PERIOD` (Tolerans Süresi), `LIMITED_ACCESS` ve Bireysel Gönderi Sürekliliği
- **Başlangıç Aktörü ve Ön Koşullar**: `ACTIVE_MEMBERSHIP` süresi (`currentPeriodEnd`) dolan işletme.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 4 (`B-01`, `B-04`, `B-05` Salt-Okunur Raporlar ve Bireysel Gönderi Alanı).
- **Adım Adım Kullanıcı Eylemleri**: (1) 7 günlük süre dolduğunda sistem işletmeyi `[ADMIN_AYARI: 3 gün]` boyunca `GRACE_PERIOD` durumuna alır; kurumsal siparişler kesilmez $\rightarrow$ (2) Tolerans süresi içinde yeni ödeme onaylanmazsa işletme `LIMITED_ACCESS` durumuna düşer $\rightarrow$ (3) İşletme geçmiş sipariş ve raporlarını salt-okunur inceler $\rightarrow$ (4) Acil tekil paketi varsa kendi `CustomerProfile` oturumuyla `INDIVIDUAL_DELIVERY` çağrısı açar.
- **İlgili Modül, API ve Olaylar**: `BusinessMembershipModule`, `OrderModule` | `GET /api/v1/businesses/me/orders` (Salt-okunur), `POST /api/v1/orders/individual-delivery` | Olay: `SUBSCRIPTION_ENTERED_GRACE_PERIOD`, `SUBSCRIPTION_ENTERED_LIMITED_ACCESS`.
- **Durum Geçişleri**: `ACTIVE_MEMBERSHIP` $\rightarrow$ `GRACE_PERIOD` $\rightarrow$ `LIMITED_ACCESS` (Ödeme onaylanırsa tekrar `ACTIVE_MEMBERSHIP`).
- **Yetkilendirme ve Doğrulama**: `LIMITED_ACCESS` durumunda hiçbir işletme verisi silinmez; `GET` rapor uç noktaları açık, `POST /api/v1/orders/business-delivery` kapalıdır.
- **Başarılı Sonuç**: İşletme veri kaybına uğramaz ve bireysel kurye hizmetini kullanmaya devam edebilir.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: İşletme istediği an haftalık ödeme bildirimi göndererek kurumsal panelini tekrar aktifleştirebilir.
- **Kullanılan Veri Kayıtları**: `business_subscriptions`, `business_accounts`, `service_requests`.
- **İlgili M0–M7 Fazı**: `M0` ve `M3`.
- **Test ve Kabul Kriterleri**: `LIMITED_ACCESS` durumundaki işletmenin geçmiş sipariş sayısı ve müşteri kayıtları `%100` eksiksiz görüntülenmelidir.

##### `FLOW-16`: İşletme Alt Kullanıcı (`BusinessSubUser`) Tanımlama ve Çok Kiracılı Veri İzolasyonu (`ACL`)
- **Başlangıç Aktörü ve Ön Koşullar**: `BusinessAccount` sahibi (`owner`).
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 4 (`B-06` Alt Kullanıcı Yönetimi) ve Görünüm 5 (`A-05` ACL İzolasyon Denetim Masası).
- **Adım Adım Kullanıcı Eylemleri**: (1) İşletme sahibi şube müdürü (`branch_manager`), sevkiyat personeli (`dispatch_staff`), muhasebe (`accountant`) veya izleyici (`read_only`) rolünde alt kullanıcı ekler $\rightarrow$ (2) Alt kullanıcı kendi kimliğiyle giriş yapar $\rightarrow$ (3) Yalnızca kendi `businessId` ve yetki matrisi dahilindeki işlemleri gerçekleştirir.
- **İlgili Modül, API ve Olaylar**: `BusinessAclModule` | `POST /api/v1/businesses/me/sub-users`, `PUT /api/v1/businesses/me/sub-users/{id}/permissions` | Olay: `SUB_USER_PERMISSION_UPDATED`.
- **Durum Geçişleri**: `SUB_USER_INVITED` $\rightarrow$ `SUB_USER_ACTIVE` $\leftrightarrow$ `SUB_USER_SUSPENDED`.
- **Yetkilendirme ve Doğrulama**: Her sorguda `WHERE business_id = :authenticatedBusinessId` filtresi zorunludur; başka bir işletmenin sipariş ID'si bilinse bile erişim `403 CROSS_TENANT_ACCESS_DENIED` ile reddedilir.
- **Başarılı Sonuç**: Rol bazlı görev ayrımı ve işletmeler arası tam veri izolasyonu sağlanır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Yetkisiz işlem denemesi engellenir ve `audit_logs` tablosuna güvenlik uyarısı olarak yazılır.
- **Kullanılan Veri Kayıtları**: `business_sub_users`, `business_accounts`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M1` ve `M3`.
- **Test ve Kabul Kriterleri**: İşletme A'nın alt kullanıcısı İşletme B'nin sipariş detayını (`GET /api/v1/businesses/orders/{orderB_Id}`) istediğinde `403` veya `404` almalıdır.

##### `FLOW-17`: Yolculuk / Teslimat İptali, Sürücü Reddi, Zaman Aşımı ve Yeniden Eşleştirme
- **Başlangıç Aktörü ve Ön Koşullar**: `SEARCHING`, `OFFERED` veya `ACCEPTED` durumundaki çağrı; Müşteri, İşletme, Sürücü/Kurye veya Sistem.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 2 (`C-05`, `C-06`), Görünüm 3 (`K-03`, `K-04`), Görünüm 4 (`B-02`).
- **Adım Adım Kullanıcı Eylemleri**: (1) Müşteri/işletme sürücü alış noktasına varmadan veya PIN girilmeden çağrıyı iptal eder (`CANCELLED`) VEYA (2) Sürücü kabul ettiği çağrıyı acil mazeretle bırakır $\rightarrow$ (3) Sistem sürücü mazeretinde çağrıyı tekrar `SEARCHING` durumuna alıp sıradaki en yakın sürücüye yönlendirir.
- **İlgili Modül, API ve Olaylar**: `OrderModule`, `DispatchModule` | `POST /api/v1/orders/{id}/cancel`, `POST /api/v1/orders/{id}/release-by-provider` | Olay: `ORDER_CANCELLED`, `ORDER_REQUEUED`.
- **Durum Geçişleri**: `SEARCHING / OFFERED / ACCEPTED / ARRIVED` $\rightarrow$ `CANCELLED` (`IN_PROGRESS` ve `COMPLETED` durumlarında standart müşteri iptali kapalıdır).
- **Yetkilendirme ve Doğrulama**: İptal gerekçesi (`cancellationReason`) zorunludur; M0'da otomatik karttan iptal cezası çekimi yoktur.
- **Başarılı Sonuç**: İptal edilen sipariş güvenli şekilde kapanır veya sürücü bıraktıysa yeni sürücüye aktarılır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: 3 ardışık sürücü turunda (`45 sn`) eşleşme olmazsa müşteriye "Bölgede yoğunluk var, tekrar dene veya iptal et" seçeneği sunulur.
- **Kullanılan Veri Kayıtları**: `service_requests`, `dispatch_offers`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M2` ve `M4`.
- **Test ve Kabul Kriterleri**: `IN_PROGRESS` (PIN girilmiş, taşıma başlamış) bir siparişe müşteri iptal isteği gönderdiğinde `409 CANNOT_CANCEL_IN_PROGRESS_ORDER` dönmelidir.

##### `FLOW-18`: 112 Acil SOS Bildirimi, Canlı Takip Paylaşımı ve Güvenlik Eskalasyonu
- **Başlangıç Aktörü ve Ön Koşullar**: Aktif seferdeki (`ACCEPTED`, `ARRIVED`, `IN_PROGRESS`) yolcu, gönderici, taksi şoförü veya kurye.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 2 (`C-07` SOS & Rota Paylaşımı), Görünüm 3 (`K-04` SOS Butonu) ve Görünüm 5 (`A-01` Canlı Komuta Haritası Alarm Paneli).
- **Adım Adım Kullanıcı Eylemleri**: (1) Kullanıcı "Acil SOS / 112" butonuna basar $\rightarrow$ (2) Cihazda 112 acil arama ekranı tetiklenir ve aynı anda sunucuya anlık GPS koordinatı, sipariş ID ve sürücü/araç plaka bilgisiyle kritik alarm gönderilir $\rightarrow$ (3) Admin Komuta Merkezi (`A-01`) ekranında sesli/görsel kırmızı alarm açılır.
- **İlgili Modül, API ve Olaylar**: `SafetyModule` | `POST /api/v1/safety/sos`, `POST /api/v1/orders/{id}/share-link` | WebSocket: `CRITICAL_SOS_ALERT`.
- **Durum Geçişleri**: `incidentStatus`: `OPEN_CRITICAL` $\rightarrow$ `INVESTIGATING` $\rightarrow$ `RESOLVED`.
- **Yetkilendirme ve Doğrulama**: Paylaşım bağlantısı rastgele tahmin edilemez tek kullanımlık token (`256-bit`) içerir ve sefer bitiminde otomatik geçersizleşir.
- **Başarılı Sonuç**: Acil durum kaydı en yüksek öncelikle Komuta Merkezine ve değişmez `AuditLog` tablosuna düşer.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: İnternet zayıfsa SOS paketi yerel kuyruktan ilk fırsatta gönderilir; 112 telefon araması internetten bağımsız GSM üzerinden başlatılır.
- **Kullanılan Veri Kayıtları**: `safety_incidents`, `shared_tracking_links`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M2`, `M4` ve `M5`.
- **Test ve Kabul Kriterleri**: Sefer `COMPLETED` olduktan sonra paylaşılan takip linkine girildiğinde canlı konum gösterilmemeli (`410 Gone`), gizlilik korunmalıdır.

##### `FLOW-19`: Sürücü / Kurye Güvenlik Blokajı (`SystemBlockage`) ve Aktif İş Koruma Kuralı (`B8`)
- **Başlangıç Aktörü ve Ön Koşullar**: `OPS_MANAGER` / `SUPER_ADMIN` veya otomatik güvenlik kuralı (sigorta bitimi, belge iptali).
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 5 (`A-02` Güvenlik Blokaj Masası) ve Görünüm 3 (`K-02` Blokaj Bilgilendirme Ekranı).
- **Adım Adım Kullanıcı Eylemleri**: (1) Admin kural ihlali veya risk tespit edilen sürücü için blokaj gerekçesini girer ve "Blokla" butonuna basar $\rightarrow$ (2) Sistem sürücünün üzerinde aktif sipariş (`ACCEPTED`, `ARRIVED`, `IN_PROGRESS`) olup olmadığını kontrol eder $\rightarrow$ (3) Aktif sipariş yoksa sürücü anında `OFFLINE / BLOCKED` yapılır; aktif sipariş varsa işlem reddedilir veya iş bitiminde devreye girecek bekleyen blokaj (`PENDING_BLOCK_AFTER_COMPLETION`) oluşturulur.
- **İlgili Modül, API ve Olaylar**: `GovernanceModule` | `POST /api/v1/admin/blockages`, `POST /api/v1/admin/blockages/{id}/unlock` | Olay: `PROVIDER_BLOCKED`, `PROVIDER_UNBLOCKED`.
- **Durum Geçişleri**: `ACTIVE_CLEAR` $\rightarrow$ `BLOCKED` $\rightarrow$ (Çift onay ve gerekçeyle) `UNLOCKED`.
- **Yetkilendirme ve Doğrulama**: **Kural B8**: Aktif siparişi olan sürücü yoldaki işi yarım bırakacak şekilde anında bloklanamaz (`409 PROVIDER_HAS_ACTIVE_ORDER`). Blokaj kaldırma işlemi zorunlu gerekçe (`unlockJustification`) ve `AuditLog` gerektirir.
- **Başarılı Sonuç**: Riskli sürücü yeni çağrı alamaz; kaldırılan blokajlar denetim iziyle kayıt altına alınır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Gerekçesiz blokaj veya blokaj kaldırma isteği `422` ile reddedilir.
- **Kullanılan Veri Kayıtları**: `system_blockages`, `provider_profiles`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M4` ve `M5`.
- **Test ve Kabul Kriterleri**: `IN_PROGRESS` siparişi olan kuryeye doğrudan blokaj atıldığında sistem `409` dönmeli ve mevcut teslimat kesilmemelidir.

##### `FLOW-20`: Filo Operasyon Yönetimi (Zimmet, Trafik Cezası Tebliği, Hasar ve Servis İş Emri — `SINIF-01..13`)
- **Başlangıç Aktörü ve Ön Koşullar**: Filo Operasyon Müdürü, Saha Garaj Amiri, Servis Sorumlusu ve Sürücü/Kurye.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 5 (`A-01`, `A-02`) ve Görünüm 3 (`K-01`, `K-08`).
- **Adım Adım Kullanıcı Eylemleri**: (1) Araç sürücüye başlangıç km ve 4 yönlü fotoğrafla zimmetlenir (`VehicleAssignment`) $\rightarrow$ (2) Plakaya gelen trafik cezası (`TrafficPenalty`) sürücüye bildirimle tebliğ edilir; sürücü okur veya itiraz eder (`acknowledgedByCourier`) $\rightarrow$ (3) Hasar durumunda teslim öncesi/sonrası fotoğraflar karşılaştırılır (`DamageReport`) $\rightarrow$ (4) Bakım/onarım için iş emri (`ServiceWorkOrder`) açılır, depodan parça düşülür (`WarehousePart`), yol testi onayı (`testDriveApproved`) ve eski parça teslimiyle iş emri kapatılır.
- **İlgili Modül, API ve Olaylar**: `FleetOperationsModule` | `POST /api/v1/fleet/assignments`, `POST /api/v1/fleet/penalties/{id}/acknowledge`, `POST /api/v1/fleet/work-orders/{id}/close` | Olay: `ASSIGNMENT_CREATED`, `PENALTY_ACKNOWLEDGED`, `WORK_ORDER_CLOSED`.
- **Durum Geçişleri**: Zimmet: `ACTIVE` $\rightarrow$ `COMPLETED`; İş Emri: `OPENED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `TEST_DRIVE_PASSED` $\rightarrow$ `CLOSED`.
- **Yetkilendirme ve Doğrulama**: Aynı araç aynı anda iki sürücüye zimmetlenemez; tebliğ edilmemiş ceza sürücü hesabına yansıtılamaz; `testDriveApproved == false` iken servis iş emri kapatılamaz; depo stoğu `< 0` olamaz.
- **Başarılı Sonuç**: Tüm filo yaşam döngüsü kanıtlı ve denetlenebilir biçimde yürütülür.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Çakışan zimmet veya eksik yol testi `409 / 422` hatasıyla engellenir.
- **Kullanılan Veri Kayıtları**: `vehicle_assignments`, `traffic_penalties`, `damage_reports`, `warehouse_parts`, `service_work_orders`, `audit_logs`.
- **İlgili M0–M7 Fazı**: `M5` ve `M6`.
- **Test ve Kabul Kriterleri**: Açık iş emri ve plaka olmadan depodan parça çıkışı yapılamamalı; yol testi onaysız araç sahaya dönememelidir.

##### `FLOW-21`: Değiştirilemez Denetim Zinciri (`AuditLog`) Doğrulaması, Gün Sonu Mührü ve Yedek/Geri Yükleme
- **Başlangıç Aktörü ve Ön Koşullar**: `AUDITOR` veya `SUPER_ADMIN`.
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 5 (`A-04` Gün Sonu Mührü, `A-06` Denetim & Doğrulama Üssü).
- **Adım Adım Kullanıcı Eylemleri**: (1) Denetçi `A-06` ekranında "Denetim Zincirini Doğrula" butonuna basar $\rightarrow$ (2) Sunucu `GENESIS` kaydından itibaren tüm `previousSealHash -> securitySealHash` halkalarını ve veritabanı kısıtlarını kontrol eder $\rightarrow$ (3) Gün sonunda açık zimmet, açık iş emri ve mutabakat kontrolleri (`DailyClosingAudit`) çalıştırılarak gün mühürlenir.
- **İlgili Modül, API ve Olaylar**: `AuditGovernanceModule` | `GET /api/v1/admin/audit/verify-chain`, `POST /api/v1/admin/daily-closing/seal` | Olay: `AUDIT_CHAIN_VERIFIED`, `DAILY_CLOSING_SEALED`.
- **Durum Geçişleri**: Gün Kapanışı: `OPEN` $\rightarrow$ `SEALED_CLEAN` (Risk varsa `RISK_DETECTED_BLOCKED` $\rightarrow$ Üst yönetici gerekçesiyle `SEALED_WITH_EXECUTIVE_OVERRIDE`).
- **Yetkilendirme ve Doğrulama**: `audit_logs` tablosunda `DELETE` ve `UPDATE` veritabanı seviyesinde kapalıdır; açık risk varken gerekçesiz `SEALED_CLEAN` yapılamaz.
- **Başarılı Sonuç**: Sistemin tüm kritik işlem geçmişi kriptografik ve ilişkisel bütünlük raporuyla doğrulanır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: Zincirde bozulma tespit edilirse kırılan kayıt ID'si (`brokenAtId`) raporlanır ve güvenlik alarmı üretilir.
- **Kullanılan Veri Kayıtları**: `audit_logs`, `daily_closing_audits`, `system_snapshots`.
- **İlgili M0–M7 Fazı**: `M5`, `M6` ve `M7`.
- **Test ve Kabul Kriterleri**: Açık zimmet veya açık risk varken istisna gerekçesi girilmeden gün temiz kapatılamamalıdır (`409 DAILY_CLOSING_RISK_BLOCKED`).

##### `FLOW-22`: Bölünmüş Canlı Simülasyon Stüdyosunda (`SplitSimulationView`) Çoklu Rol Uçtan Uca Senaryo Testi
- **Başlangıç Aktörü ve Ön Koşullar**: QA Test Mühendisi, Ürün Yöneticisi veya Demo Kullanıcısı (`SIMULATION` modunda).
- **Kullanılan Görünüm ve Ekranlar**: Görünüm 6 (`S-01` Bölünmüş Canlı Simülasyon Stüdyosu — Müşteri, Sürücü/Kurye, İşletme ve Admin panelleri yan yana).
- **Adım Adım Kullanıcı Eylemleri**: (1) Kullanıcı üst bardan "Bölünmüş Simülasyon" görünümünü açar $\rightarrow$ (2) Sol panelde Müşteri veya İşletme olarak çağrı oluşturur $\rightarrow$ (3) Orta panelde Sürücü/Kurye ekranında 15 sn teklifin anında çaldığını görür ve kabul eder $\rightarrow$ (4) 4 haneli PIN kodunu girip teslimatı tamamlar $\rightarrow$ (5) Sağ panelde Admin ekranında `TransactionFeeSnapshot` (`%0` komisyon) ve `AuditLog` kaydını anında doğrular.
- **İlgili Modül, API ve Olaylar**: `SimulationSandboxModule` | Sandbox State / WebSocket Senkronizasyonu (`isSimulation = true`).
- **Durum Geçişleri**: `IDLE -> SEARCHING -> OFFERED -> ACCEPTED -> ARRIVED -> IN_PROGRESS -> COMPLETED` geçişlerinin tamamı tek ekranda canlı izlenir.
- **Yetkilendirme ve Doğrulama**: **Katı Ortam İzolasyonu**: Simülasyon stüdyosunda üretilen hiçbir kayıt üretim (`PRODUCTION`) veritabanı tablolarına yazılmaz.
- **Başarılı Sonuç**: Tüm paydaş ekranlarının birbirleriyle gerçek zamanlı uyumu sayfa yenilemeden doğrulanır.
- **İptal, Hata, Zaman Aşımı ve Tekrar Deneme**: "Simülasyonu Sıfırla / Snapshot Yükle" butonu ile test ortamı saniyeler içinde başlangıç durumuna döndürülür.
- **Kullanılan Veri Kayıtları**: Sandbox izole veri deposu (`simulation_sessions`).
- **İlgili M0–M7 Fazı**: `M0`–`M7` (Tüm fazların canlı kabul doğrulama aracı).
- **Test ve Kabul Kriterleri**: Simülasyon stüdyosunda yapılan işlemler üretim raporlarını veya üretim veritabanını kesinlikle etkilememelidir.


---

### 5. 71 KONTROLÜN TAMAMI AYRI AYRI (`A1–A21`, `B1–B22`, `C1–C18`, `D1–D10`)

> [!NOTE]
> **Gerçek Uygulama Durumu Sözlüğü ve Dürüstlük İlkesi**
> - `IMPLEMENTED`: Hem ön yüz prototipinde hem de hedef doğrulama kurallarında eksiksiz çalışan ve kanıtı bulunan kontrol.
> - `PARTIAL`: Ön yüz TypeScript/React katmanında uygulanmış ancak hedef üretim backend'i (Spring Boot 3 + PostgreSQL 16) tarafı henüz kurulmamış kontrol.
> - `MOCK`: Mevcut çalışma alanında yalnızca tarayıcı belleği (`localStorage` / simülasyon) üzerinde taklit edilen, üretimde sunucu/veritabanı gerektiren kontrol.
> - `DECISION_REQUIRED`: Ticari veya hukuki karar beklediği için kapsamı dondurulmuş kontrol.
> - **Önemli Ayrım**: Bir kontrolün burada tanımlanmış olması veya TypeScript tipinin yazılmış olması, üretim ortamında uçtan uca test edilip onaylandığı anlamına gelmez.

---

#### 5.1. Bölüm A Kontrolleri (`A1` – `A21`: 21 Kontrol — Veri Modeli, Tip Güvenliği ve Şema Bütünlüğü)

##### `A1` — Puanlama Sınır Koruması (`RatingNumber` `0.0–5.0`)
1. **Kontrol ID**: `A1` | 2. **Kontrol Adı**: Puanlama (`Rating`) Sınır ve Tip Koruması
3. **Gereksinim**: Sürücü, kurye ve yolculuk puanları `0.0` ile `5.0` dışında değer alamamalıdır.
4. **Önlediği Risk**: Negatif veya `5`'ten büyük puanlarla ortalama manipülasyonu.
5. **Teknik Katman**: Frontend Type (`platform.ts`) + Backend DTO (`@DecimalMin("0.0") @DecimalMax("5.0")`) + PostgreSQL `CHECK (rating BETWEEN 0 AND 5)`.
6. **Bağımlılıklar**: `OrderModule`, `RatingEntity`.
7. **Doğrulama Yöntemi**: Sınır değer birim testi (`-1`, `0`, `4.85`, `5`, `6`).
8. **Beklenen Sonuç**: Sınır dışı değerler reddedilir veya `0..5` aralığına bağlanır.
9. **Ölçülebilir Kabul Kriteri**: `< 0` veya `> 5` puan içeren API isteklerinin `%100`'ü `400 Bad Request` ile reddedilir.
10. **İlgili Ekran/Model/API**: `C-08`, `K-08`, `Courier.rating`, `RideOrder.rating`, `POST /api/v1/orders/{id}/rate`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`toRatingNumber`) | 13. **Gerçek Durum**: `PARTIAL` (Frontend tip koruyucusu mevcut; PostgreSQL `CHECK` kısıtı üretim şemasında uygulanacak).

##### `A2` — Sürücü ve Kurye Kurumsal E-Posta Zorunluluğu (`Courier.email`)
1. **Kontrol ID**: `A2` | 2. **Kontrol Adı**: Sürücü/Kurye E-Posta ve Tebligat Adresi Zorunluluğu
3. **Gereksinim**: Her sürücü/kurye kaydında geçerli formatta ve tekil (`UNIQUE`) e-posta adresi bulunmalıdır.
4. **Önlediği Risk**: Yasal tebligatların, trafik cezası bildirimlerinin ve belge yenileme uyarılarının iletilememesi.
5. **Teknik Katman**: `DriverProfile` / `CourierProfile` şeması (`@Email`, `UNIQUE`).
6. **Bağımlılıklar**: `IdentityModule`.
7. **Doğrulama Yöntemi**: Şema doğrulama ve format testi.
8. **Beklenen Sonuç**: Geçersiz e-posta formatı kayıt aşamasında reddedilir.
9. **Ölçülebilir Kabul Kriteri**: Boş veya RFC-5322 uyumsuz e-posta ile `FLOW-02` başvurusu yapılamaz.
10. **İlgili Ekran/Model/API**: `K-01`, `A-02`, `Courier.email`, `POST /api/v1/driver-kyc/submit`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`Courier.email`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A3` — Standart Telefon Numarası Doğrulaması (`PhoneNumber` / `E.164`)
1. **Kontrol ID**: `A3` | 2. **Kontrol Adı**: `PhoneNumber` (`E.164`) Format ve Normalizasyon Koruması
3. **Gereksinim**: Müşteri, alıcı, sürücü ve işletme telefon numaraları boşluk ve özel karakterlerden arındırılarak standart formatta saklanmalıdır.
4. **Önlediği Risk**: Yanlış format nedeniyle SMS OTP veya alıcı teslimat PIN kodunun ulaşmaması ve mükerrer hesap açılması.
5. **Teknik Katman**: `toPhoneNumber`, Backend `@Pattern(regexp="^\\+?[1-9]\\d{9,14}$")`.
6. **Bağımlılıklar**: `IdentityModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: Regex ve normalizasyon birim testi.
8. **Beklenen Sonuç**: Tüm telefon numaraları tekil standartta normalize edilir.
9. **Ölçülebilir Kabul Kriteri**: Harf veya eksik hane içeren telefon numaraları `%100` reddedilir.
10. **İlgili Ekran/Model/API**: `C-01`, `C-03`, `B-02`, `POST /api/v1/auth/otp/request`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`toPhoneNumber`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A4` — ISO-8601 Zaman Damgası ve Saat Dilimi Standardı (`ISODateString`)
1. **Kontrol ID**: `A4` | 2. **Kontrol Adı**: `ISODateString` ve `TIMESTAMPTZ` Saat Dilimi Tutarlılığı
3. **Gereksinim**: Tüm tarih/saat alanları ISO-8601 formatında (`UTC`) saklanmalı, iş kuralları `Europe/Istanbul` saat dilimine göre değerlendirilmelidir.
4. **Önlediği Risk**: Tanışma kampanyası bitiş saatinde (`00:00`) veya denetim sıralamasında saat dilimi kayması nedeniyle erken/geç kapanış.
5. **Teknik Katman**: Frontend `toISODateString`, Backend `Instant` / `ZonedDateTime`, PostgreSQL `TIMESTAMPTZ`.
6. **Bağımlılıklar**: Tüm modüller.
7. **Doğrulama Yöntemi**: `Europe/Istanbul` gece yarısı geçiş testi (`23:59:59` vs `00:00:00`).
8. **Beklenen Sonuç**: İstemci cihaz saati yanlış olsa bile sunucu UTC/Istanbul zamanı esas alınır.
9. **Ölçülebilir Kabul Kriteri**: Geçersiz tarih dizgesi içeren API çağrıları `400` ile reddedilir; kampanya geçişleri yalnızca sunucu saatine göre tetiklenir.
10. **İlgili Ekran/Model/API**: `IntroCampaign`, `BusinessSubscription`, `AuditLogEntry`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`toISODateString`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A5` — Coğrafi Koordinat Sınır ve Hizmet Bölgesi Koruması (`Latitude` / `Longitude`)
1. **Kontrol ID**: `A5` | 2. **Kontrol Adı**: Coğrafi Koordinat (`[-90..90]`, `[-180..180]`) ve Geofence Sınır Doğrulaması
3. **Gereksinim**: Enlem ve boylam değerleri matematiksel sınırlar ve aktif hizmet bölgesi poligonu (`PostGIS ST_Contains`) içinde olmalıdır.
4. **Önlediği Risk**: `(0,0)` Null Island koordinatlarına veya deniz/hizmet dışı bölgeye sahte çağrı açılması.
5. **Teknik Katman**: `toLatitude`, `toLongitude`, PostGIS `GEOGRAPHY(Point, 4326)`.
6. **Bağımlılıklar**: `GeoModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: Koordinat sınır ve poligon dışı nokta testi.
8. **Beklenen Sonuç**: Hizmet bölgesi dışındaki veya alış=varış (`< 300m`) olan koordinatlar reddedilir.
9. **Ölçülebilir Kabul Kriteri**: Hizmet poligonu dışındaki çağrıların `%100`'ü `422 OUT_OF_SERVICE_AREA` hatası alır.
10. **İlgili Ekran/Model/API**: `C-02`, `K-04`, `LocationPoint`, `POST /api/v1/quotes/calculate`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`toLatitude`, `toLongitude`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A6` — Pozitif ve Negatif Olmayan Sayı Koruması (`PositiveNumber` / `NonNegativeNumber`)
1. **Kontrol ID**: `A6` | 2. **Kontrol Adı**: Sayısal Tutar, Mesafe ve Ağırlık Negatiflik Engeli
3. **Gereksinim**: Taşıma ücreti, mesafe ve paket ağırlığı `> 0` (`PositiveNumber`), komisyon ve stok miktarları `>= 0` (`NonNegativeNumber`) olmalıdır.
4. **Önlediği Risk**: Negatif ücret veya negatif ağırlık gönderilerek fiyat formülünün tersine çevrilmesi.
5. **Teknik Katman**: `toPositiveNumber`, `toNonNegativeNumber`, Backend `BigDecimal` `@Positive` / `@PositiveOrZero`.
6. **Bağımlılıklar**: `PricingModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: Negatif ve sıfır girdi testleri (`-10`, `0`, `NaN`, `Infinity`).
8. **Beklenen Sonuç**: Negatif veya `NaN` değerler çalışma zamanında reddedilir.
9. **Ölçülebilir Kabul Kriteri**: `<= 0` taşıma ücreti veya mesafe ile hiçbir sipariş kaydedilemez.
10. **İlgili Ekran/Model/API**: `C-03`, `B-02`, `A-04`, `TransactionFeeSnapshot`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`toPositiveNumber`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A7` — Para Birimi Kodu Standartlaştırması (`CurrencyCode`)
1. **Kontrol ID**: `A7` | 2. **Kontrol Adı**: ISO-4217 Para Birimi (`CurrencyCode`) Zorunluluğu
3. **Gereksinim**: Her parasal kayıt açık bir para birimi (`TRY`, `USD`, `EUR`, `GBP`) taşımalı ve farklı para birimleri doğrudan toplanmamalıdır.
4. **Önlediği Risk**: Çoklu para birimi veya uluslararası genişlemede kur/birim karışıklığı.
5. **Teknik Katman**: `CurrencyCode` enum, PostgreSQL `VARCHAR(3) NOT NULL DEFAULT 'TRY'`.
6. **Bağımlılıklar**: `PricingModule`, `BusinessMembershipModule`.
7. **Doğrulama Yöntemi**: Farklı para birimi işlem reddi testi.
8. **Beklenen Sonuç**: M0'da tüm işlemler `TRY` olarak sabitlenir ve `TransactionFeeSnapshot.currency` alanında mühürlenir.
9. **Ölçülebilir Kabul Kriteri**: `currency` alanı boş olan hiçbir ücret snapshot'ı veya üyelik planı kaydedilemez.
10. **İlgili Ekran/Model/API**: `TransactionFeeSnapshot`, `BusinessSubscription`, `A-03`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`CurrencyCode`) | 13. **Gerçek Durum**: `IMPLEMENTED` (Tip ve model düzeyinde).

##### `A8` — Sipariş ve Doğrudan Sürücü Sohbet Oturumu Bağlantısı (`RideOrder.chatSession`)
1. **Kontrol ID**: `A8` | 2. **Kontrol Adı**: Çağrıya Bağlı İletişim Oturumu (`DirectDriverChat`) İlişkisi
3. **Gereksinim**: Müşteri ve sürücü arasındaki mesajlaşma oturumu sahipsiz kalamaz; doğrudan aktif bir `RideOrder.id` kaydına bağlı olmalıdır.
4. **Önlediği Risk**: Sipariş dışında taciz/spam mesajlaşma veya yanlış sürücüye mesaj gitmesi.
5. **Teknik Katman**: `RideOrder.chatSession`, `chat_messages.order_id REFERENCES service_requests(id)`.
6. **Bağımlılıklar**: `OrderModule`, `CommunicationModule`.
7. **Doğrulama Yöntemi**: Aktif siparişi olmayan iki kullanıcı arasında mesaj gönderme denemesi.
8. **Beklenen Sonuç**: Yalnızca `ACCEPTED`, `ARRIVED` veya `IN_PROGRESS` durumundaki siparişin tarafları mesajlaşabilir.
9. **Ölçülebilir Kabul Kriteri**: Sipariş `COMPLETED` veya `CANCELLED` olduğunda yeni mesaj gönderimi `403 CHAT_CLOSED` ile reddedilir.
10. **İlgili Ekran/Model/API**: `C-06`, `K-04`, `ChatMessage`, `POST /api/v1/orders/{id}/messages`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`RideOrder.chatSession`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A9` — Şikayet ve Destek Biletlerinin Siparişe Yabancı Anahtarla Bağlanması (`ComplaintTicket.rideId`)
1. **Kontrol ID**: `A9` | 2. **Kontrol Adı**: `ComplaintTicket.rideId` İlişkisel Bütünlük Koruması
3. **Gereksinim**: Her operasyonel şikayet veya sorun bildirimi geçerli bir `RideOrder.id` kaydına referans vermelidir.
4. **Önlediği Risk**: Var olmayan siparişler üzerinden sahte şikayet/iade talebi oluşturulması.
5. **Teknik Katman**: `ComplaintTicket.rideId`, PostgreSQL `FOREIGN KEY (ride_id) REFERENCES service_requests(id)`.
6. **Bağımlılıklar**: `SupportModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: Geçersiz `rideId` ile şikayet kaydı oluşturma testi.
8. **Beklenen Sonuç**: Yalnızca ilgili siparişin müşterisi, işletmesi veya sürücüsü o siparişe bilet açabilir.
9. **Ölçülebilir Kabul Kriteri**: Başka bir kullanıcının siparişine veya geçersiz ID'ye bilet açma denemesi `403 / 404` ile engellenir.
10. **İlgili Ekran/Model/API**: `C-08`, `A-02`, `ComplaintTicket`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`ComplaintTicket`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A10` — Trafik Cezası Sürücü Tebliğ ve İtiraz Alanları (`TrafficPenalty`)
1. **Kontrol ID**: `A10` | 2. **Kontrol Adı**: Trafik Cezası Tebliğ (`acknowledgedByCourier`) ve İtiraz Takibi
3. **Gereksinim**: `TrafficPenalty` modelinde sürücüye tebliğ durumu (`acknowledgedByCourier`), tebliğ zamanı (`acknowledgedAt`), okuma durumu (`unread | read | appealed`) ve itiraz notu (`appealNote`) bulunmalıdır.
4. **Önlediği Risk**: Sürücünün haberi olmadan ve 15 günlük indirim/itiraz hakkı kullandırılmadan adına ceza kaydedilmesi (`SINIF-07`).
5. **Teknik Katman**: `TrafficPenalty` modeli, `FleetOperationsModule`.
6. **Bağımlılıklar**: `NotificationModule`, `AuditModule`.
7. **Doğrulama Yöntemi**: Tebliğ edilmemiş cezanın sürücüye yansıtılma testi.
8. **Beklenen Sonuç**: `acknowledgedByCourier == false` olan ceza sürücüye kesinleşmiş borç olarak işlenemez.
9. **Ölçülebilir Kabul Kriteri**: Tebliğ onayı olmayan cezaların sürücü hesabına yansıtılma denemeleri `%100` bloklanır.
10. **İlgili Ekran/Model/API**: `K-08`, `A-02`, `TrafficPenalty`, `FLOW-20`.
11. **İlgili Faz**: `M5` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`TrafficPenalty`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A11` — Depo Yedek Parça Negatif Stok Koruması (`WarehousePart.stockQty >= 0`)
1. **Kontrol ID**: `A11` | 2. **Kontrol Adı**: Depo Stok Miktarı (`stockQty`) Sıfır Altı Engeli
3. **Gereksinim**: Depodaki hiçbir yedek parçanın stok adedi `0` altına düşememelidir (`SINIF-10`).
4. **Önlediği Risk**: Hayali parça çıkışı ve envanter açığı.
5. **Teknik Katman**: `WarehousePart.stockQty`, PostgreSQL `CHECK (stock_qty >= 0)`.
6. **Bağımlılıklar**: `FleetOperationsModule`.
7. **Doğrulama Yöntemi**: Stokta `2` adet varken `3` adet çıkış yapma testi.
8. **Beklenen Sonuç**: Yetersiz stokta parça çıkışı reddedilir.
9. **Ölçülebilir Kabul Kriteri**: `stockQty < requestedQty` durumunda işlem `409 INSUFFICIENT_PART_STOCK` döner.
10. **İlgili Ekran/Model/API**: `A-01`, `WarehousePart`, `FLOW-20`.
11. **İlgili Faz**: `M5` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`WarehousePart`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A12` — Standart Servis Parça Kullanım Kaydı (`PartUsageRecord`)
1. **Kontrol ID**: `A12` | 2. **Kontrol Adı**: `PartUsageRecord` ile İş Emri ve Depo Çıkış Bağlantısı
3. **Gereksinim**: Servis iş emrinde kullanılan her parça `partId`, `partCode`, `qty`, `unitCost` ve `cost` alanlarıyla `ServiceWorkOrder.partsUsed` listesine bağlanmalıdır.
4. **Önlediği Risk**: İş emri olmadan depodan kayıtsız parça çıkışı (`SINIF-10` & `SINIF-11`).
5. **Teknik Katman**: `PartUsageRecord`, `ServiceWorkOrder`.
6. **Bağımlılıklar**: `A11`, `FleetOperationsModule`.
7. **Doğrulama Yöntemi**: İş emri numarası olmadan parça düşme testi.
8. **Beklenen Sonuç**: Her stok düşümü geçerli bir `ServiceWorkOrder.id` ile eşleşir.
9. **Ölçülebilir Kabul Kriteri**: İş emri bağlantısı olmayan parça çıkışlarının `%100`'ü reddedilir.
10. **İlgili Ekran/Model/API**: `A-01`, `ServiceWorkOrder`, `PartUsageRecord`.
11. **İlgili Faz**: `M5` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`PartUsageRecord`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A13` — Çoklu Hedef Tipini Kapsayan Sistem Blokaj Modeli (`SystemBlockage.targetType`)
1. **Kontrol ID**: `A13` | 2. **Kontrol Adı**: `SystemBlockage` Kapsamlı Hedef Tipi (`courier | vehicle | cashier | business_account`)
3. **Gereksinim**: Blokaj mekanizması yalnızca sürücüyü değil; aracı, kasayı ve suistimal yapan işletme hesabını (`business_account`) da hedefleyebilmelidir (`SINIF-15`).
4. **Önlediği Risk**: Riskli işletme veya arızalı aracın sistemde işlem yapmaya devam etmesi.
5. **Teknik Katman**: `SystemBlockage`, `GovernanceModule`.
6. **Bağımlılıklar**: `AuditModule`.
7. **Doğrulama Yöntemi**: Her 4 hedef tipi için blokaj oluşturma ve yetki engelleme testi.
8. **Beklenen Sonuç**: Blokajlı varlık ilgili operasyonel aksiyonu başlatamaz.
9. **Ölçülebilir Kabul Kriteri**: Blokajlı `business_account` veya `vehicle` ile işlem denemesi `403 ENTITY_BLOCKED` alır.
10. **İlgili Ekran/Model/API**: `A-02`, `SystemBlockage`, `FLOW-19`.
11. **İlgili Faz**: `M5` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`SystemBlockage`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A14` — Fiziksel Silme Yasağı ve Mantıksal Silme (`Soft Delete`: `isDeleted` & `deletedAt`)
1. **Kontrol ID**: `A14` | 2. **Kontrol Adı**: Kritik Kayıtlarda `DELETE` Yasağı ve `Soft Delete` Alanları
3. **Gereksinim**: Sipariş, sürücü, işletme, alt kullanıcı, ceza, hasar ve kampanya kayıtları fiziksel olarak silinemez; `isDeleted` ve `deletedAt` ile arşivlenir (`SINIF-16`).
4. **Önlediği Risk**: Geçmiş suistimal izlerinin veya işletme geçmişinin kalıcı olarak yok edilmesi.
5. **Teknik Katman**: Domain modelleri (`isDeleted`, `deletedAt`), PostgreSQL `REVOKE DELETE`.
6. **Bağımlılıklar**: Tüm veritabanı tabloları.
7. **Doğrulama Yöntemi**: Fiziksel `DELETE` sorgusu ve API silme testi.
8. **Beklenen Sonuç**: Kayıtlar veritabanında kalır, aktif sorgularda `WHERE is_deleted = false` ile filtrelenir ve denetim ekranlarında görünür.
9. **Ölçülebilir Kabul Kriteri**: Hiçbir üretim tablosunda fiziksel satır silme (`DELETE`) gerçekleşmez (`0` silinen satır).
10. **İlgili Ekran/Model/API**: Tüm modeller (`RideOrder`, `Courier`, `BusinessAccount`, `IntroCampaign`).
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`isDeleted`, `deletedAt`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A15` — İyimser Eşzamanlılık Kilidi (`Optimistic Concurrency Locking`: `version`)
1. **Kontrol ID**: `A15` | 2. **Kontrol Adı**: `@Version` Alanı İle Eşzamanlı Güncelleme Çakışma Koruması
3. **Gereksinim**: `IntroCampaign`, `BusinessSubscription`, `RideOrder`, `Courier` ve `CashVault` kayıtlarında `version` alanı bulunmalı ve her güncellemede `WHERE version = :expectedVersion` kontrolü yapılmalıdır.
4. **Önlediği Risk**: İki yöneticinin veya iki isteğin aynı anda aynı kaydı güncelleyerek birbirinin değişikliğini sessizce ezmesi (Lost Update).
5. **Teknik Katman**: `version: number`, Spring Data JPA `@Version`, PostgreSQL.
6. **Bağımlılıklar**: `CampaignModule`, `BusinessMembershipModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: Eşzamanlı iki güncelleme isteği (`version=1`) gönderme testi (`TEST-14`).
8. **Beklenen Sonuç**: İlk işlem `version=2` yapar; ikinci işlem `409 OptimisticLockException` ile reddedilir.
9. **Ölçülebilir Kabul Kriteri**: Bayat (`stale`) `version` ile yapılan güncellemelerin `%100`'ü `409 Conflict` döner.
10. **İlgili Ekran/Model/API**: `A-03`, `IntroCampaign`, `BusinessSubscription`, `FLOW-11`, `FLOW-14`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`version?: number`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A16` — Kritik Karar Kayıtlarında `AuditLog` Yabancı Anahtar Bağlantısı (`auditLogId`)
1. **Kontrol ID**: `A16` | 2. **Kontrol Adı**: Kritik İşlem Modellerinde Zorunlu `auditLogId` Referansı
3. **Gereksinim**: `SystemBlockage`, `ComplaintTicket`, `CashTransferRecord`, `PolicyProposal` ve `ManualPaymentNotification` kayıtları ürettikleri `AuditLogEntry.id` değerine doğrudan referans tutmalıdır.
4. **Önlediği Risk**: Denetim izi oluşmadan kritik durum veya onay değişikliği yapılması.
5. **Teknik Katman**: Domain modelleri (`auditLogId`), aynı DB transaction'ı içinde çift yazım.
6. **Bağımlılıklar**: `AuditModule`.
7. **Doğrulama Yöntemi**: `AuditLog` yazımı başarısız olduğunda ana işlemin `rollback` edilmesi testi (`SINIF-16`).
8. **Beklenen Sonuç**: Denetim kaydı olmadan hiçbir onay veya blokaj işlemi commit edilemez.
9. **Ölçülebilir Kabul Kriteri**: Kritik tablolardaki kayıtların `%100`'ü geçerli bir `audit_log_id` değerine sahiptir.
10. **İlgili Ekran/Model/API**: `A-02`, `A-03`, `A-06`, `AuditLogEntry`.
11. **İlgili Faz**: `M0` ve `M5` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`auditLogId`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A17` — Standart Sayfalama ve İmleç Sözleşmesi (`PaginationParams` & `PaginatedResult<T>`)
1. **Kontrol ID**: `A17` | 2. **Kontrol Adı**: Liste Uç Noktalarında Zorunlu Sayfalama (`PaginatedResult<T>`)
3. **Gereksinim**: Sipariş geçmişi, denetim kayıtları ve sürücü listeleri sınırsız (`SELECT *`) çekilemez; `page`, `limit` (maks `100`) ve `cursor` ile sayfalanmalıdır.
4. **Önlediği Risk**: Kayıt sayısı arttığında bellek taşması (`OutOfMemory`) ve yavaş API yanıtları.
5. **Teknik Katman**: `PaginationParams`, `PaginatedResult<T>`, Spring Data `Pageable`.
6. **Bağımlılıklar**: Tüm `GET` liste uç noktaları.
7. **Doğrulama Yöntemi**: `limit=10000` parametresiyle yapılan isteğin `limit=100` üst sınırına çekilmesi testi.
8. **Beklenen Sonuç**: Tüm liste uç noktaları deterministik sayfalama zarfı döner.
9. **Ölçülebilir Kabul Kriteri**: Tek bir API çağrısında en fazla `100` kayıt döner; yanıtta `total`, `page`, `limit`, `hasMore` bulunur.
10. **İlgili Ekran/Model/API**: `B-05`, `A-03`, `A-06`, `PaginatedResult<T>`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`PaginatedResult`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A18` — Standart API Yanıt ve Hata Zarfı (`ApiResponse<T>` & `Result<T, E>`)
1. **Kontrol ID**: `A18` | 2. **Kontrol Adı**: Tek Tip `ApiResponse<T>` ve Hata Kodu Sözleşmesi
3. **Gereksinim**: Tüm REST API yanıtları `status`, `statusCode`, `data`, `message`, `errorCode` ve `timestamp` içeren standart zarf kullanmalıdır.
4. **Önlediği Risk**: İstemcide yakalanamayan belirsiz hata formatları ve ham stack-trace sızıntısı.
5. **Teknik Katman**: `ApiResponse<T>`, `Result<T,E>`, Spring `@RestControllerAdvice`.
6. **Bağımlılıklar**: Tüm API контроllerleri.
7. **Doğrulama Yöntemi**: `400`, `403`, `404`, `409`, `422`, `500` yanıt şeması testi.
8. **Beklenen Sonuç**: Hiçbir hata durumunda sunucu iç sınıf yolları veya SQL sorgusu istemciye sızmaz.
9. **Ölçülebilir Kabul Kriteri**: Tüm uç noktaların başarı ve hata yanıtları OpenAPI 3.1 `ApiResponse` şemasıyla `%100` uyumludur.
10. **İlgili Ekran/Model/API**: Tüm REST API uç noktaları.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`ApiResponse`, `Result`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `A19` — Kart Bilgisi Saklama Yasağı ve Maskeleme (`CardLastFour`)
1. **Kontrol ID**: `A19` | 2. **Kontrol Adı**: M0 Kart Saklama Yasağı ve `CardLastFour` Maskeleme Koruması
3. **Gereksinim**: M0'da sistemde kredi kartı saklanmaz ve otomatik çekim yapılmaz. İleriki fazlarda ödeme sağlayıcı entegre edildiğinde dahi sistemde tam kart numarası (PAN) veya CVV tutulamaz; yalnızca `CardLastFour` (son 4 hane) gösterilebilir.
4. **Önlediği Risk**: PCI-DSS ihlali, kart verisi sızıntısı ve M0 "otomatik kart çekimi yok" kuralının delinmesi.
5. **Teknik Katman**: `CardLastFour` branded type (`toCardLastFour`).
6. **Bağımlılıklar**: `BusinessMembershipModule`.
7. **Doğrulama Yöntemi**: M0 ekranlarında ve API'lerinde kart numarası giriş alanı bulunmadığının denetimi.
8. **Beklenen Sonuç**: M0'da yalnızca Havale/EFT dekont bildirimi (`MANUAL_APPROVAL`) çalışır; 16 haneli kart numarası hiçbir tabloya yazılamaz.
9. **Ölçülebilir Kabul Kriteri**: Veritabanında PAN/CVV sütunu sayısı `0`; M0'da otomatik kart çekim akışı sayısı `0`.
10. **İlgili Ekran/Model/API**: `B-04`, `C-04`, `toCardLastFour`.
11. **İlgili Faz**: `M0` (Kapsam sınırı) ve `M6` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`toCardLastFour`) | 13. **Gerçek Durum**: `DECISION_REQUIRED` (M0'da kart saklama kapalıdır; ileriki faz online ödeme modeli `DEC-02` kararına bağlıdır).

##### `A20` — Ücret Snapshot'ı (`TransactionFeeSnapshot`) ve İleriki Faz Muhasebe Defteri (`LedgerEntry`) Ayrımı
1. **Kontrol ID**: `A20` | 2. **Kontrol Adı**: M0 `TransactionFeeSnapshot` Doğruluk Kaynağı ve `M6` Çift Taraflı Defter Bağlantısı
3. **Gereksinim**: M0'da her siparişin tek finansal doğruluk kaynağı 18 alanlı `TransactionFeeSnapshot` kaydıdır (`%0` komisyon). Gerçek para hareketi ve çift taraflı muhasebe defteri (`LedgerEntry`) M0 kapsamı dışındadır ve yalnızca `M6` fazında devreye alındığında `TransactionFeeSnapshot.id` referansıyla çalışır.
4. **Önlediği Risk**: M0'da kapsam dışı olan cüzdan/escrow muhasebesinin M0'a karıştırılması veya ücret kaydı olmadan sipariş açılması.
5. **Teknik Katman**: `TransactionFeeSnapshot` (M0), `LedgerEntry` (M6).
6. **Bağımlılıklar**: `OrderModule`, `PricingModule`.
7. **Doğrulama Yöntemi**: Her sipariş oluşumunda 18 alanlı `TransactionFeeSnapshot` üretildiğinin kontrolü.
8. **Beklenen Sonuç**: Snapshot olmadan hiçbir sipariş `SEARCHING` durumuna geçemez.
9. **Ölçülebilir Kabul Kriteri**: Aktif veya tamamlanmış siparişlerin `%100`'ü birebir eşleşen bir `TransactionFeeSnapshot` kaydına sahiptir.
10. **İlgili Ekran/Model/API**: `C-03`, `B-02`, `A-06`, `TransactionFeeSnapshot`, `LedgerEntry`.
11. **İlgili Faz**: `M0` (Snapshot) ve `M6` (Ledger) | 12. **Kanıt Kaydı**: Bölüm C.2.4 ve `src/types/platform.ts` | 13. **Gerçek Durum**: `PARTIAL`.

##### `A21` — Hizmet Türleri (`ServiceType`) Derleme Zamanı Eksiksizliği (`assertNever` & M0 Filtresi)
1. **Kontrol ID**: `A21` | 2. **Kontrol Adı**: Kanonik `ServiceType` (`TAXI_RIDE`, `INDIVIDUAL_DELIVERY`, `BUSINESS_DELIVERY`) ve `assertNever` Kontrolü
3. **Gereksinim**: Tüm fiyatlandırma, yetkilendirme ve durum geçiş blokları `TAXI_RIDE`, `INDIVIDUAL_DELIVERY` ve `BUSINESS_DELIVERY` hizmetlerini eksiksiz ele almalı; `MOTO_PASSENGER_RIDE` M0'da kilitli tutulmalıdır.
4. **Önlediği Risk**: Tanımsız hizmet tipiyle çağrı açılması veya M0'da pasif olan `MOTO_PASSENGER_RIDE` hizmetinin yanlışlıkla tetiklenmesi.
5. **Teknik Katman**: `ServiceType`, `assertNever`, Backend `ServiceTypeEnum`.
6. **Bağımlılıklar**: `OrderModule`, `PricingModule`.
7. **Doğrulama Yöntemi**: `serviceType = 'MOTO_PASSENGER_RIDE'` ile gönderilen isteğin M0'da reddedilmesi testi (`TEST-03`).
8. **Beklenen Sonuç**: M0'da yalnızca 3 aktif hizmet çalışır; `MOTO_PASSENGER_RIDE` isteği `403 SERVICE_DISABLED_IN_M0` döner.
9. **Ölçülebilir Kabul Kriteri**: M0 ortamında `MOTO_PASSENGER_RIDE` ile açılabilen sipariş sayısı `0`'dır.
10. **İlgili Ekran/Model/API**: `C-02`, `B-02`, `POST /api/v1/orders/*`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`assertNever`) — *Not: `platform.ts` içindeki eski Türkçe enum adları hedef şemada kanonik `TAXI_RIDE | INDIVIDUAL_DELIVERY | BUSINESS_DELIVERY` ile eşleştirilmiştir* | 13. **Gerçek Durum**: `PARTIAL`.

---

#### 5.2. Bölüm B Kontrolleri (`B1` – `B22`: 22 Kontrol — İş Kuralları, Güvenlik, Eşzamanlılık ve Veri Bütünlüğü)

##### `B1` — Üretim Veritabanı Kalıcılığı (PostgreSQL 16) ve Simülasyon `localStorage` Ayrımı
1. **Kontrol ID**: `B1` | 2. **Kontrol Adı**: PostgreSQL 16 ACID Kalıcılığı ve `localStorage` Üretim Yasağı
3. **Gereksinim**: Üretimde hiçbir sipariş, üyelik, kullanıcı veya denetim kaydı `localStorage` içinde tutulamaz; tamamı PostgreSQL 16 veritabanında saklanır. `useLocalStorageState` yalnızca Görünüm 6 (Bölünmüş Simülasyon Stüdyosu) için kullanılır.
4. **Önlediği Risk**: Tarayıcı önbelleği temizlendiğinde veri kaybı ve istemci tarafı veri manipülasyonu (`AUD-01`).
5. **Teknik Katman**: PostgreSQL 16 (Üretim) vs `useLocalStorageState` (Simülasyon).
6. **Bağımlılıklar**: Spring Data JPA / Hibernate, Flyway/Liquibase şema göçü.
7. **Doğrulama Yöntemi**: Tarayıcı verileri tamamen silindiğinde üretim oturumuyla giriş yapan kullanıcının tüm verilerinin sunucudan eksiksiz gelmesi testi.
8. **Beklenen Sonuç**: Üretim verisi istemci cihazdan bağımsız olarak sunucuda kalıcıdır.
9. **Ölçülebilir Kabul Kriteri**: İstemci depolaması sıfırlandığında sunucu veri kaybı `%0`'dır.
10. **İlgili Ekran/Model/API**: Tüm modüller.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: Mevcut çalışma alanında `useLocalStorageState` prototip amaçlıdır | 13. **Gerçek Durum**: `MOCK` (Mevcut prototipte `localStorage` kullanılmaktadır; üretimde PostgreSQL 16 zorunludur).

##### `B2` — Bildirim Kuyruğu Bellek Sızıntısı Koruması (FIFO Maksimum 5 Bildirim)
1. **Kontrol ID**: `B2` | 2. **Kontrol Adı**: İstemci Bildirim Kuyruğu (`AccessibleNotification`) Bellek Sınırı
3. **Gereksinim**: Kapatılan (`dismissNotification`) bildirimler diziden fiziksel olarak silinmeli ve aynı anda bellekte en fazla 5 aktif bildirim tutulmalıdır.
4. **Önlediği Risk**: Uzun süreli açık kalan Operasyon Komuta Merkezi veya İşletme ekranında binlerce bildirim birikerek tarayıcı/uygulama belleğini şişirmesi.
5. **Teknik Katman**: Frontend State (`PlatformContext`).
6. **Bağımlılıklar**: Bildirim bileşeni.
7. **Doğrulama Yöntemi**: Arka arkaya 20 bildirim tetiklenip aktif dizi uzunluğunun kontrol edilmesi.
8. **Beklenen Sonuç**: Dizi uzunluğu hiçbir zaman `5`'i aşmaz ve kapatılan bildirim diziden çıkarılır.
9. **Ölçülebilir Kabul Kriteri**: `notifications.length <= 5` koşulu her zaman sağlanır.
10. **İlgili Ekran/Model/API**: Tüm görünümler, `AccessibleNotification`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `B3` — Sunucu Tarafı Kriptografik SHA-256 Özeti ve `append-only` Tablo Koruması
1. **Kontrol ID**: `B3` | 2. **Kontrol Adı**: Sunucu Tarafı SHA-256 Özeti ve Veritabanı `REVOKE UPDATE/DELETE` Koruması
3. **Gereksinim**: `AuditLogEntry.securitySealHash` ve `TransactionFeeSnapshot.immutableHash` özetleri sunucu tarafında hesaplanmalı ve ilgili tablolarda `UPDATE/DELETE` izinleri veritabanı seviyesinde kapatılmalıdır (`AUD-04`).
4. **Önlediği Risk**: İstemci tarafında sahte hash üretilmesi veya veritabanı satırlarının sonradan değiştirilmesi.
5. **Teknik Katman**: Backend `MessageDigest.getInstance("SHA-256")`, PostgreSQL Trigger & Role Permissions, İstemci Simülasyonunda Web Crypto API.
6. **Bağımlılıklar**: `AuditModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: `audit_logs` ve `transaction_fee_snapshots` üzerinde `UPDATE` ve `DELETE` SQL komutu denemesi.
8. **Beklenen Sonuç**: Veritabanı `ERROR: permission denied / append-only table` hatası fırlatır.
9. **Ölçülebilir Kabul Kriteri**: `audit_logs` ve `transaction_fee_snapshots` üzerinde başarılı `UPDATE/DELETE` sayısı `0`'dır.
10. **İlgili Ekran/Model/API**: `A-06`, `AuditLogEntry`, `TransactionFeeSnapshot`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: Mevcut prototipte Web Crypto API SHA-256 mevcuttur; DB trigger üretimde eklenecektir | 13. **Gerçek Durum**: `PARTIAL`.

##### `B4` — Gerçek Zamanlı Olay Dağıtımı (WebSocket JSON) ve Simülasyon `BroadcastChannel` Ayrımı
1. **Kontrol ID**: `B4` | 2. **Kontrol Adı**: WebSocket Gerçek Zamanlı Olay Kanalı ve Sekmeler Arası Senkronizasyon
3. **Gereksinim**: Üretimde çağrı teklifi (`OFFER_CREATED`), kabul (`ORDER_ACCEPTED`), konum ve durum geçişleri sunucu üzerinden WebSocket (JSON) ile iletilir. `BroadcastChannel` yalnızca aynı tarayıcıdaki Bölünmüş Simülasyon sekmeleri için kullanılır.
4. **Önlediği Risk**: Farklı cihazlardaki müşteri ve sürücünün birbirinin durumunu görememesi.
5. **Teknik Katman**: Spring WebSocket / STOMP (Üretim), `BroadcastChannel` (Simülasyon).
6. **Bağımlılıklar**: `DispatchModule`, `OrderModule`.
7. **Doğrulama Yöntemi**: Müşteri çağrı açtığında sürücü ekranına `< 1 sn` içinde teklif düşmesi testi.
8. **Beklenen Sonuç**: Sayfa yenilemeye gerek kalmadan durumlar tüm istemcilerde güncellenir.
9. **Ölçülebilir Kabul Kriteri**: Olay iletim gecikmesi (p95) `< 500 ms`.
10. **İlgili Ekran/Model/API**: `C-05`, `K-03`, `A-01`, `S-01`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: Simülasyonda `BroadcastChannel` aktif | 13. **Gerçek Durum**: `MOCK` (Simülasyonda `BroadcastChannel`; üretimde WebSocket).

##### `B5` — Kuruş Hassasiyetli Parasal Hesaplama (`roundCurrency` / `BigDecimal(12,2)`)
1. **Kontrol ID**: `B5` | 2. **Kontrol Adı**: IEEE-754 Kayan Nokta Hatası Önleme (`BigDecimal` & `roundCurrency`)
3. **Gereksinim**: Tüm ücret hesaplamaları sunucuda `BigDecimal` (`RoundingMode.HALF_UP`, scale `2`), istemcide `roundCurrency` ile kuruş hassasiyetinde yapılmalıdır.
4. **Önlediği Risk**: `0.1 + 0.2 = 0.30000000000000004` gibi kayan nokta hataları nedeniyle snapshot hash uyuşmazlığı veya kuruş farkı.
5. **Teknik Katman**: `roundCurrency`, Java `BigDecimal`, PostgreSQL `NUMERIC(12,2)`.
6. **Bağımlılıklar**: `PricingModule`.
7. **Doğrulama Yöntemi**: Küsuratlı km ve tarife çarpımlarında 1.000 rastgele değer testi.
8. **Beklenen Sonuç**: Tüm tutarlar tam 2 ondalık basamakla üretilir.
9. **Ölçülebilir Kabul Kriteri**: 2 ondalık basamağı aşan parasal değer sayısı `0`.
10. **İlgili Ekran/Model/API**: `C-03`, `B-02`, `TransactionFeeSnapshot`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`roundCurrency`) | 13. **Gerçek Durum**: `IMPLEMENTED` (İstemci fonksiyonu hazır).

##### `B6` — Kriptografik Güvenli Benzersiz Kimlik Üretimi (`CSPRNG UUIDv4 / UUIDv7`)
1. **Kontrol ID**: `B6` | 2. **Kontrol Adı**: Tahmin Edilemez `CSPRNG UUID` Kimlik Üretimi
3. **Gereksinim**: Sipariş, snapshot, ödeme bildirimi ve takip linki kimlikleri `Math.random()` ile değil; `crypto.randomUUID()` / `SecureRandom` ile üretilmelidir.
4. **Önlediği Risk**: Ardışık veya tahmin edilebilir ID üzerinden başka siparişlerin veya canlı takip linklerinin ele geçirilmesi (IDOR).
5. **Teknik Katman**: Web Crypto `crypto.randomUUID()`, Java `UUID.randomUUID()`.
6. **Bağımlılıklar**: Tüm modüller.
7. **Doğrulama Yöntemi**: 100.000 ID üretiminde çarpışma (`collision`) ve entropi testi.
8. **Beklenen Sonuç**: Hiçbir kritik kayıtta `Math.random()` kullanılmaz.
9. **Ölçülebilir Kabul Kriteri**: Çarpışma oranı `0`; `Math.random()` ile üretilen güvenlik/sipariş ID sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm varlıklar.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `B7` — Kanonik Sipariş Durum Makinesi (`ALLOWED_ORDER_TRANSITIONS`) Zorlaması
1. **Kontrol ID**: `B7` | 2. **Kontrol Adı**: `ALLOWED_ORDER_TRANSITIONS` Geçersiz Durum Atlaması Engeli
3. **Gereksinim**: Sipariş durumu yalnızca izin verilen yönlü graf (`idle -> searching -> offered -> accepted -> arrived -> in_progress -> completed | partially_completed | cancelled`) üzerinden ilerleyebilir.
4. **Önlediği Risk**: PIN girilmeden (`searching -> completed`) işin tamamlanması veya tamamlanmış (`completed`) işin iptal edilmesi.
5. **Teknik Katman**: `isValidOrderTransition`, Backend `OrderStateMachine`.
6. **Bağımlılıklar**: `OrderModule`.
7. **Doğrulama Yöntemi**: Tüm `9 x 9 = 81` durum geçiş çiftinin birim testi (`TEST-18`).
8. **Beklenen Sonuç**: Geçersiz her geçiş `409 INVALID_ORDER_STATE_TRANSITION` ile reddedilir.
9. **Ölçülebilir Kabul Kriteri**: İzin verilmeyen geçişlerin engellenme oranı `%100`.
10. **İlgili Ekran/Model/API**: `FLOW-06`, `FLOW-07`, `FLOW-08`, `FLOW-17`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`ALLOWED_ORDER_TRANSITIONS`, `isValidOrderTransition`) | 13. **Gerçek Durum**: `IMPLEMENTED` (Durum geçiş fonksiyonu ve kuralları hazır).

##### `B8` — Aktif Siparişi Olan Sürücü/Kurye Blokaj Engeli (`blockCourier` Koruması)
1. **Kontrol ID**: `B8` | 2. **Kontrol Adı**: Yoldaki Aktif İşi Olan Sürücünün Anında Bloklanmasını Önleme Kuralı
3. **Gereksinim**: Üzerinde `accepted`, `arrived` veya `in_progress` durumunda aktif çağrı bulunan taksi şoförü veya kurye, o iş tamamlanmadan (`completed`) veya güvenli şekilde başka sürücüye devredilmeden bloklanamaz.
4. **Önlediği Risk**: Yolcunun araç içinde veya paketin kuryede asılı kalması (`TEST-17`).
5. **Teknik Katman**: `GovernanceModule`, `blockCourier` kontrolü.
6. **Bağımlılıklar**: `OrderModule`, `SystemBlockage`.
7. **Doğrulama Yöntemi**: `in_progress` siparişi olan sürücüye `blockCourier` çağrısı yapılması.
8. **Beklenen Sonuç**: İşlem reddedilir ve yöneticiye aktif sipariş numarası gösterilir.
9. **Ölçülebilir Kabul Kriteri**: Aktif siparişi varken anında bloklanabilen sürücü sayısı `0`.
10. **İlgili Ekran/Model/API**: `A-02`, `FLOW-19`, `POST /api/v1/admin/blockages`.
11. **İlgili Faz**: `M4` ve `M5` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` & `AdminAutonomousAuditHub.tsx` | 13. **Gerçek Durum**: `IMPLEMENTED` (Prototipte doğrulandı; backend servisinde aynı kural zorunlu).

##### `B9` — İş Atamasında PostgreSQL Atomik Satır Kilidi (`SELECT ... FOR UPDATE`)
1. **Kontrol ID**: `B9` | 2. **Kontrol Adı**: Aynı Çağrının Birden Fazla Sürücüye Atanmasını Önleyen Atomik Kilit
3. **Gereksinim**: Teklif kabulünde (`POST /api/v1/offers/{id}/accept`) ilgili `service_requests` satırı PostgreSQL'de atomik olarak kilitlenmeli ve aynı anda yalnızca tek bir sürücüye atanabilmelidir (`AUD-07`).
4. **Önlediği Risk**: İki sürücünün aynı milisaniyede "Kabul Et"e basarak aynı müşteriye gitmesi.
5. **Teknik Katman**: PostgreSQL `SELECT ... FOR UPDATE NOWAIT` + `@Version`.
6. **Bağımlılıklar**: `DispatchModule`.
7. **Doğrulama Yöntemi**: 10 eşzamanlı iş parçacığı (thread) ile aynı teklifi kabul etme yük testi.
8. **Beklenen Sonuç**: Yalnızca 1 sürücü `200 OK` alır, diğer 9 istek `409 Conflict` alır.
9. **Ölçülebilir Kabul Kriteri**: Çift atama (double assignment) sayısı `0`.
10. **İlgili Ekran/Model/API**: `K-03`, `C-05`, `FLOW-06`.
11. **İlgili Faz**: `M2` ve `M4` | 12. **Kanıt Kaydı**: Hedef PostgreSQL işlem kuralı | 13. **Gerçek Durum**: `PARTIAL` (Tek iş parçacıklı istemci prototipinde korumalı; PostgreSQL `FOR UPDATE` backend'de uygulanacak).

##### `B10` — Gerçek Yol Ağı Mesafesi/ETA Hesabı ve PostGIS Haversine Yedekleme Kuralı
1. **Kontrol ID**: `B10` | 2. **Kontrol Adı**: Yol Ağı Rota Motoru + PostGIS Haversine Yarıçap ve Fallback Kuralı
3. **Gereksinim**: Sürücü aday taraması PostGIS yarıçap sorgusuyla (`ST_DWithin`), müşteri fiyatlandırma mesafesi ve ETA hesabı ise gerçek yol ağı yönlendirme servisiyle yapılmalıdır. Yönlendirme servisi erişilemezse Haversine $\times 1.30$ yedek katsayısı kullanılır ve kayıt `FALLBACK_HAVERSINE` olarak işaretlenir (`AUD-05`).
4. **Önlediği Risk**: Deniz/boğaz üzerinden kuş uçuşu mesafe ölçülerek gerçek yol mesafesinin yarısı kadar hatalı ücret çıkarılması.
5. **Teknik Katman**: Routing Service Adapter + `calculateHaversineDistanceKm` + PostGIS 3.4.
6. **Bağımlılıklar**: `GeoModule`, `PricingModule`.
7. **Doğrulama Yöntemi**: Kadıköy–Beşiktaş gibi deniz aşırı iki nokta arasında yol ağı mesafesi ile Haversine mesafesinin karşılaştırılması.
8. **Beklenen Sonuç**: Fiyat teklifi gerçek sürüş rotası üzerinden üretilir.
9. **Ölçülebilir Kabul Kriteri**: Her fiyat teklifinde `distanceCalculationMethod` (`ROUTING_ENGINE` veya `FALLBACK_HAVERSINE`) açıkça kayıtlıdır.
10. **İlgili Ekran/Model/API**: `C-02`, `C-03`, `B-02`, `POST /api/v1/quotes/calculate`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`calculateHaversineDistanceKm` mevcut; gerçek yol ağı adaptörü backend'de eklenecek) | 13. **Gerçek Durum**: `PARTIAL`.

##### `B11` — API İsteklerinde Tekillik Anahtarı (`Idempotency-Key`) Koruması
1. **Kontrol ID**: `B11` | 2. **Kontrol Adı**: Sipariş, Teklif Kabulü ve Havale Bildiriminde `Idempotency-Key` Zorunluluğu
3. **Gereksinim**: `POST /api/v1/orders/*`, `POST /api/v1/offers/{id}/accept` ve `POST /api/v1/businesses/me/payment-notifications` uç noktaları `Idempotency-Key` başlığı taşımalı ve `idempotency_keys` tablosunda 24 saat boyunca saklanmalıdır.
4. **Önlediği Risk**: Zayıf mobil internette kullanıcının butona arka arkaya basmasıyla aynı çağrının veya aynı ödeme bildiriminin 2–3 kez oluşturulması.
5. **Teknik Katman**: `IdempotencyFilter`, PostgreSQL `UNIQUE (actor_id, idempotency_key)`.
6. **Bağımlılıklar**: `OrderModule`, `BusinessMembershipModule`.
7. **Doğrulama Yöntemi**: Aynı `Idempotency-Key` ile ardışık 3 `POST` isteği gönderme testi.
8. **Beklenen Sonuç**: Veritabanında yalnızca 1 kayıt oluşur; 2. ve 3. istek ilk yanıtı aynen döner.
9. **Ölçülebilir Kabul Kriteri**: Aynı `Idempotency-Key` ile oluşan mükerrer kayıt sayısı `0`.
10. **İlgili Ekran/Model/API**: `C-04`, `B-02`, `B-04`, `FLOW-04`, `FLOW-14`.
11. **İlgili Faz**: `M0` ve `M2` | 12. **Kanıt Kaydı**: `TransactionReconciliationRecord.idempotencyKey` | 13. **Gerçek Durum**: `PARTIAL`.

##### `B12` — Sürücü/Kurye KYC Belge Onay ve Muayene/Sigorta Çevrim İçi Kilidi
1. **Kontrol ID**: `B12` | 2. **Kontrol Adı**: 4 Zorunlu KYC Belgesi ve Araç Sigorta/Muayene Geçerlilik Kilidi
3. **Gereksinim**: Ehliyet, ruhsat, trafik sigortası ve adli sicil kaydı `APPROVED` olmayan veya araç sigorta/muayene tarihi geçmiş sürücü/kurye `AVAILABLE` (çevrim içi) durumuna geçemez (`SINIF-01`, `SINIF-02`, `TEST-16`).
4. **Önlediği Risk**: Belgesiz, sigortasız veya onaysız kişinin yolcu/paket taşıması.
5. **Teknik Katman**: `IdentityModule`, `DispatchModule`.
6. **Bağımlılıklar**: `FLOW-02`, `FLOW-03`.
7. **Doğrulama Yöntemi**: 1 belgesi onaysız sürücüyle `PUT /api/v1/providers/me/status (AVAILABLE)` çağrısı.
8. **Beklenen Sonuç**: Sunucu `403 KYC_OR_VEHICLE_NOT_ELIGIBLE` hatası döner.
9. **Ölçülebilir Kabul Kriteri**: Onaysız belgeyle çevrim içi olabilen sürücü sayısı `0`.
10. **İlgili Ekran/Model/API**: `K-01`, `K-02`, `A-02`.
11. **İlgili Faz**: `M1` ve `M4` | 12. **Kanıt Kaydı**: `Courier.documents` & `PlatformContext.tsx` | 13. **Gerçek Durum**: `IMPLEMENTED` (Prototipte aktif; backend'de zorunlu).

##### `B13` — Araç ve Sürücü Zimmet Çakışma Engeli (`SINIF-03`)
1. **Kontrol ID**: `B13` | 2. **Kontrol Adı**: Tekil Aktif Zimmet (`VehicleAssignment`) Kısıtı
3. **Gereksinim**: Aynı plaka aynı anda birden fazla aktif sürücüye, aynı sürücü aynı anda birden fazla aktif araca zimmetlenemez.
4. **Önlediği Risk**: Trafik cezası, HGS geçişi veya kaza anında aracın hangi sürücüde olduğunun tespit edilememesi.
5. **Teknik Katman**: PostgreSQL Partial Unique Index: `CREATE UNIQUE INDEX uq_active_plate ON vehicle_assignments(plate) WHERE shift_status = 'ACTIVE'` ve `uq_active_courier ON vehicle_assignments(courier_id) WHERE shift_status = 'ACTIVE'`.
6. **Bağımlılıklar**: `FleetOperationsModule`.
7. **Doğrulama Yöntemi**: Aktif zimmetteki plakayı ikinci bir sürücüye atama testi.
8. **Beklenen Sonuç**: İşlem `409 VEHICLE_ALREADY_ASSIGNED` ile reddedilir.
9. **Ölçülebilir Kabul Kriteri**: Çakışan aktif zimmet sayısı `0`.
10. **İlgili Ekran/Model/API**: `A-01`, `K-01`, `VehicleAssignment`, `FLOW-20`.
11. **İlgili Faz**: `M5` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`VehicleAssignment`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `B14` — Kriptografik Denetim Zinciri (`verifyAuditChain`) Bütünlük Doğrulaması
1. **Kontrol ID**: `B14` | 2. **Kontrol Adı**: `GENESIS` Başlangıçlı `previousSealHash -> securitySealHash` Zincir Doğrulayıcısı
3. **Gereksinim**: Her `AuditLogEntry` kaydı kendisinden önceki kaydın `securitySealHash` değerini `previousSealHash` alanında tutmalı ve `verifyAuditChain` tüm zinciri baştan sona doğrulamalıdır (`SINIF-16`).
4. **Önlediği Risk**: Aradan bir denetim kaydının silinmesi veya bir kaydın eski/yeni değerinin değiştirilmesi.
5. **Teknik Katman**: `AuditGovernanceModule`, `verifyAuditChain()`.
6. **Bağımlılıklar**: `B3`.
7. **Doğrulama Yöntemi**: Zincirdeki bir kaydın verisi bozulduğunda `verifyAuditChain().isValid == false` ve `brokenAtId` dönmesi testi (`TEST-20`).
8. **Beklenen Sonuç**: Tampon/manipülasyon anında tespit edilir.
9. **Ölçülebilir Kabul Kriteri**: Manipüle edilmiş kaydın tespit oranı `%100`.
10. **İlgili Ekran/Model/API**: `A-06`, `GET /api/v1/admin/audit/verify-chain`, `FLOW-21`.
11. **İlgili Faz**: `M0` ve `M5` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` (`verifyAuditChain`) | 13. **Gerçek Durum**: `PARTIAL` (Zincir doğrulama algoritması çalışmaktadır; üretimde PostgreSQL üzerinde çalışacaktır).

##### `B15` — M0 `%0` Komisyon Değişmezi (`Zero-Commission Invariant`) ve `TransactionFeeSnapshot` Doğrulaması
1. **Kontrol ID**: `B15` | 2. **Kontrol Adı**: `TransactionFeeSnapshot` `%0` Komisyon ve `%100` Sürücü Payı Değişmez Kuralı
3. **Gereksinim**: M0'da üretilen tüm `TransactionFeeSnapshot` kayıtlarında `customerPlatformServiceFee == 0.00`, `providerPlatformFee == 0.00`, `businessOrderCommission == 0.00` ve `netProviderPayoutAmount == displayedTransportAmount` olmalıdır. *(Not: `M6` fazında çift taraflı muhasebe defteri devreye alındığında bu kontrol `totalDebit === totalCredit` mizan dengesini de doğrular).*
4. **Önlediği Risk**: Yanlış tarife ayarıyla yolcudan, şoförden, kuryeden veya işletme siparişinden komisyon kesilmesi (`TEST-01`, `TEST-02`, `TEST-04`).
5. **Teknik Katman**: `PricingModule`, PostgreSQL `CHECK (customer_platform_service_fee = 0 AND provider_platform_fee = 0 AND business_order_commission = 0)`.
6. **Bağımlılıklar**: `A20`, `B5`.
7. **Doğrulama Yöntemi**: Her 3 aktif hizmet tipi için snapshot oluşturma ve komisyon kontrol testi.
8. **Beklenen Sonuç**: Komisyon `> 0` olan hiçbir snapshot üretilemez.
9. **Ölçülebilir Kabul Kriteri**: M0'da komisyon kesilen işlem sayısı `0`.
10. **İlgili Ekran/Model/API**: `C-03`, `B-02`, `K-03`, `A-06`, `TransactionFeeSnapshot`.
11. **İlgili Faz**: `M0` (Snapshot Invariant) ve `M6` (Ledger Balance) | 12. **Kanıt Kaydı**: Bölüm C.2.4 | 13. **Gerçek Durum**: `PARTIAL`.

##### `B16` — Alış Noktasında 4 Haneli Güvenlik Kodu (`boardingCode`) ve Teslimatta `PoD / deliveryCode` Zorunluluğu
1. **Kontrol ID**: `B16` | 2. **Kontrol Adı**: PIN Kodu Doğrulanmadan Taşıma Başlatma (`IN_PROGRESS`) ve PoD Olmadan Tamamlama (`COMPLETED`) Engeli
3. **Gereksinim**: Sürücü/kurye alış noktasında doğru 4 haneli `boardingCode` değerini girmeden çağrı `IN_PROGRESS` durumuna geçemez; paket teslimatlarında `deliveryCode` veya `podPhotoUrl` olmadan `COMPLETED` yapılamaz.
4. **Önlediği Risk**: Yanlış yolcunun alınması, paketin teslim alınmadan "teslim edildi" işaretlenmesi.
5. **Teknik Katman**: `OrderModule` (`startOrder`, `completeOrder`).
6. **Bağımlılıklar**: `B7`.
7. **Doğrulama Yöntemi**: Yanlış PIN ile `start` ve boş PoD ile `complete` API çağrısı testi.
8. **Beklenen Sonuç**: Sunucu `422 INVALID_VERIFICATION_CODE` hatası döner.
9. **Ölçülebilir Kabul Kriteri**: PIN doğrulamasız başlayan yolculuk/taşıma sayısı `0`.
10. **İlgili Ekran/Model/API**: `K-05`, `K-06`, `C-06`, `FLOW-07`, `FLOW-08`.
11. **İlgili Faz**: `M2` ve `M4` | 12. **Kanıt Kaydı**: `RideOrder.boardingCode`, `deliveryCode` | 13. **Gerçek Durum**: `PARTIAL`.

##### `B17` — Global Tanışma Kampanyası Çakışma ve Kazanılmış Hak Koruması (`KURAL-01..06`)
1. **Kontrol ID**: `B17` | 2. **Kontrol Adı**: `IntroCampaign` Tek Aktif Kampanya, Tarih Kesişme Yasağı ve `PAUSED` Hak Koruması
3. **Gereksinim**: Aynı anda yalnızca 1 `ACTIVE` kampanya olabilir; tarih aralıkları kesişemez; kampanyanın `PAUSED` yapılması önceden atanmış işletmelerin `FREE_INTRO` bitiş tarihini daraltamaz (`TEST-11`, `TEST-12`).
4. **Önlediği Risk**: Çakışan kampanyalar nedeniyle belirsiz bitiş tarihi veya duraklatılan kampanyada esnafın kazanılmış ücretsiz süresinin yanması.
5. **Teknik Katman**: `CampaignModule`, PostgreSQL Exclusion Constraint (`EXCLUDE USING gist (tstzrange(start_date, end_date) WITH &&) WHERE (status IN ('SCHEDULED', 'ACTIVE'))`).
6. **Bağımlılıklar**: `A4`, `A15`.
7. **Doğrulama Yöntemi**: Kesişen tarihli kampanya planlama ve aktif kampanyayı duraklatma testi.
8. **Beklenen Sonuç**: Kesişen kampanya `409` ile reddedilir; `PAUSED` geçişinde mevcut işletmelerin `effectiveIntroEndDate` değeri korunur.
9. **Ölçülebilir Kabul Kriteri**: Tarih çakışmalı aktif/planlı kampanya sayısı `0`; `PAUSED` nedeniyle hakkı daralan işletme sayısı `0`.
10. **İlgili Ekran/Model/API**: `A-03`, `B-01`, `FLOW-11`.
11. **İlgili Faz**: `M0` ve `M5` | 12. **Kanıt Kaydı**: Bölüm C.3.2 | 13. **Gerçek Durum**: `PARTIAL`.

##### `B18` — Gece Yarısı / Dönem Sonu Aktif İşlerin Korunması (`In-Flight Order Protection`)
1. **Kontrol ID**: `B18` | 2. **Kontrol Adı**: Devam Eden Çağrıların Kampanya veya Üyelik Bitişinden Etkilenmeme Kuralı
3. **Gereksinim**: Bir sipariş `SEARCHING`, `OFFERED`, `ACCEPTED`, `ARRIVED` veya `IN_PROGRESS` durumundayken saat `00:00` olup işletmenin `PLAN_SELECTION_REQUIRED` veya `LIMITED_ACCESS` durumuna geçmesi, o aktif siparişi iptal etmemeli ve `TransactionFeeSnapshot` değerlerini değiştirmemelidir (`TEST-15`).
4. **Önlediği Risk**: Gece vardiyasında yolda olan paketlerin saat `00:00`'da kilitlenmesi veya fiyatının değişmesi.
5. **Teknik Katman**: `OrderModule`, `MembershipSchedulerModule`.
6. **Bağımlılıklar**: `A20`, `B7`.
7. **Doğrulama Yöntemi**: `23:55`'te açılan sipariş `IN_PROGRESS` iken üyelik durumunun `LIMITED_ACCESS`'e çekilmesi ve `00:10`'da siparişin tamamlanması testi.
8. **Beklenen Sonuç**: Aktif sipariş sorunsuz tamamlanır; yalnızca *yeni* `BUSINESS_DELIVERY` talepleri engellenir.
9. **Ölçülebilir Kabul Kriteri**: Üyelik durum geçişi nedeniyle yarıda kesilen aktif sipariş sayısı `0`.
10. **İlgili Ekran/Model/API**: `B-02`, `K-06`, `FLOW-13`.
11. **İlgili Faz**: `M0`, `M3` ve `M4` | 12. **Kanıt Kaydı**: Bölüm C.2.5 (`TEST-15`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `B19` — Sürücü–Müşteri Güvenli İletişim Gizliliği ve 24 Saat Sonra Otomatik Temizleme (`TTL`)
1. **Kontrol ID**: `B19` | 2. **Kontrol Adı**: Numara Maskeleme ve Sipariş Sonrası 24 Saat Mesaj Saklama Sınırı (`expiresAt`)
3. **Gereksinim**: Sohbet mesajları gerçek telefon numaralarını ifşa etmemeli ve sipariş tamamlandıktan 24 saat sonra (`expiresAt`) kişisel veri gizliliği (KVKK) gereği aktif erişimden kaldırılmalıdır.
4. **Önlediği Risk**: Yolculuk/teslimat bittikten günler sonra sürücünün müşteriye veya müşterinin sürücüye ulaşarak rahatsızlık vermesi.
5. **Teknik Katman**: `ChatMessage.expiresAt`, `CommunicationModule` TTL temizleyici.
6. **Bağımlılıklar**: `A8`.
7. **Doğrulama Yöntemi**: `completedAt + 24 saat` sonrasında sohbet geçmişi sorgulama testi.
8. **Beklenen Sonuç**: Süresi dolan mesajlar kullanıcı ekranlarından kaldırılır.
9. **Ölçülebilir Kabul Kriteri**: Sipariş bitiminden 24 saat sonra istemciye dönen sohbet mesajı sayısı `0`.
10. **İlgili Ekran/Model/API**: `C-06`, `K-04`, `ChatMessage`.
11. **İlgili Faz**: `M2` ve `M4` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`ChatMessage.expiresAt`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `B20` — İşletmeler Arası Çok Kiracılı Veri İzolasyonu (`Cross-Tenant ACL Isolation`) ve Alt Kullanıcı Yetki Matrisi
1. **Kontrol ID**: `B20` | 2. **Kontrol Adı**: `BusinessAccount` Kiracı İzolasyonu ve `BusinessSubUserPermissions` Sunucu Denetimi
3. **Gereksinim**: Bir işletmenin sahibi veya alt kullanıcısı (`owner`, `branch_manager`, `dispatch_staff`, `accountant`, `read_only`) yalnızca kendi `businessId` verilerini görebilir ve yalnızca rolünün izin verdiği (`canCreateOrders`, `canViewFinancials`, `canManageSubUsers`) aksiyonları çağırabilir.
4. **Önlediği Risk**: Bir esnafın rakip esnafın siparişlerini/müşterilerini görmesi veya yetkisiz personelin alt kullanıcı eklemesi.
5. **Teknik Katman**: Spring Security `@PreAuthorize`, Hibernate `@TenantId` / `WHERE business_id = :ctxBusinessId`.
6. **Bağımlılıklar**: `IdentityModule`, `BusinessAclModule`.
7. **Doğrulama Yöntemi**: İşletme A token'ı ile İşletme B siparişlerine erişim (`IDOR`) ve `read_only` alt kullanıcıyla sipariş açma testi (`FLOW-16`).
8. **Beklenen Sonuç**: Çapraz erişim ve yetkisiz rol işlemleri `403 Forbidden` ile reddedilir.
9. **Ölçülebilir Kabul Kriteri**: Çapraz işletme veri sızıntısı `%0`.
10. **İlgili Ekran/Model/API**: `B-06`, `A-05`, `BusinessSubUser`, `FLOW-10`, `FLOW-16`.
11. **İlgili Faz**: `M1` ve `M3` | 12. **Kanıt Kaydı**: `src/types/platform.ts` (`BusinessSubUserPermissions`) & `AdminBusinessAclHub.tsx` | 13. **Gerçek Durum**: `PARTIAL`.

##### `B21` — KYC Belgeleri ve Havale Dekontları İçin Özel Depolama ve İmzalı URL (`Pre-Signed URL`) Koruması
1. **Kontrol ID**: `B21` | 2. **Kontrol Adı**: Hassas Belgelerin Herkese Açık (`Public`) URL Yasağı ve Kısa Ömürlü İmzalı Erişim
3. **Gereksinim**: Sürücü ehliyet/adli sicil belgeleri, teslimat kanıt fotoğrafları (`PoD`) ve işletme Havale/EFT dekontları herkese açık dizinlerde tutulamaz; yalnızca yetkili rol için üretilen maksimum `15 dakika` geçerli imzalı URL (Pre-signed URL) ile görüntülenebilir (`AUD-14`).
4. **Önlediği Risk**: Adli sicil, kimlik ve banka dekontlarının internete sızması (KVKK ihlali).
5. **Teknik Katman**: S3/MinIO Private Bucket, `DocumentStorageModule`.
6. **Bağımlılıklar**: `FLOW-02`, `FLOW-08`, `FLOW-14`.
7. **Doğrulama Yöntemi**: İmzasız veya süresi dolmuş (`> 15 dk`) belge URL'sine doğrudan erişim testi.
8. **Beklenen Sonuç**: Depolama servisi `403 Access Denied` döner.
9. **Ölçülebilir Kabul Kriteri**: Herkese açık (`public-read`) belge kovası sayısı `0`.
10. **İlgili Ekran/Model/API**: `K-01`, `B-04`, `A-02`, `A-03`.
11. **İlgili Faz**: `M1`, `M3` ve `M4` | 12. **Kanıt Kaydı**: Mimari güvenlik şartı (`AUD-14`) | 13. **Gerçek Durum**: `MISSING` (Üretim nesne depolama entegrasyonu `M1/M3` fazında kurulacaktır).

##### `B22` — Yedekleme, `SystemSnapshot` Geri Yükleme ve Simülasyon/Üretim Veri İzolasyonu
1. **Kontrol ID**: `B22` | 2. **Kontrol Adı**: Veritabanı Yedekleme/Geri Yükleme Doğrulaması ve Simülasyon Ortam İzolasyonu
3. **Gereksinim**: Üretim PostgreSQL veritabanı günlük otomatik yedeklenmeli (PITR) ve bütünlük özeti (`checksumHash`) doğrulanmalıdır. Bölünmüş Simülasyon Stüdyosu (`SplitSimulationView`) içinde alınan `SystemSnapshot` ve üretilen test kayıtları üretim veritabanından tamamen izole olmalıdır.
4. **Önlediği Risk**: Veri kaybı anında geri dönememe veya demo/simülasyon siparişlerinin gerçek kuryelere ve gerçek raporlara karışması.
5. **Teknik Katman**: PostgreSQL WAL/PITR Backup (Üretim) + `SystemSnapshot` (Simülasyon Stüdyosu).
6. **Bağımlılıklar**: `AuditGovernanceModule`, `SimulationSandboxModule`.
7. **Doğrulama Yöntemi**: Snapshot alma, durumu değiştirme ve `restoreSnapshot` ile sağlama toplamı (`checksumHash`) doğrulanarak geri yükleme testi (`TEST-20`).
8. **Beklenen Sonuç**: Geri yükleme sonrası kayıt sayıları ve hash değerleri birebir eşleşir; simülasyon verisi üretimde görünmez.
9. **Ölçülebilir Kabul Kriteri**: Geri yükleme veri tutarlılığı `%100`; üretim tablolarına sızan simülasyon kaydı sayısı `0`.
10. **İlgili Ekran/Model/API**: `A-06`, `S-01`, `SystemSnapshot`, `FLOW-21`, `FLOW-22`.
11. **İlgili Faz**: `M6` ve `M7` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` (`createSnapshot`, `restoreSnapshot`) | 13. **Gerçek Durum**: `PARTIAL` (Simülasyon snapshot motoru çalışmaktadır; üretim PostgreSQL PITR yedeği `M7` fazında devreye alınır).


---

#### 5.3. Bölüm C Kontrolleri (`C1` – `C18`: 18 Kontrol — UI/UX Tasarım Sistemi, Erişilebilirlik ve Kullanıcı Deneyimi)

##### `C1` — Minimum `11px` Tipografi Tabanı ve Mikro-Metin Yasağı
1. **Kontrol ID**: `C1` | 2. **Kontrol Adı**: `11px` (`0.6875rem`) Altı Okunaksız Yazı Boyutu Yasağı
3. **Gereksinim**: Mobil ve web ekranlarında hiçbir rozet, tablo hücresi veya dipnot `11px` altında yazı boyutuna sahip olamaz.
4. **Önlediği Risk**: Sürüş/saha esnasında kuryenin veya esnafın kritik durum ve ücret bilgisini okuyamaması.
5. **Teknik Katman**: Global CSS (`src/index.css`), Flutter TextTheme.
6. **Bağımlılıklar**: Tasarım tokenları (`C8`, `C9`).
7. **Doğrulama Yöntemi**: CSS/DOM taraması ile `text-[8px]`, `text-[9px]`, `text-[10px]` sınıflarının denetimi.
8. **Beklenen Sonuç**: En küçük metin boyutu `11px` olarak uygulanır.
9. **Ölçülebilir Kabul Kriteri**: `< 11px` hesaplanan (`computed font-size`) metin öğesi sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm 6 görünüm.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/index.css` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C2` — WCAG 2.2 AA Metin Kontrast Oranı (`>= 4.5:1` / `#94A3B8`)
1. **Kontrol ID**: `C2` | 2. **Kontrol Adı**: Birincil ve İkincil Metinlerde WCAG 2.2 AA Kontrast Standardı
3. **Gereksinim**: Koyu temada (`#0B0F19` zemin) ikincil metinler en az `#94A3B8` (`7.1:1`), açık temada (`#F8FAFC` zemin) `#475569` (`7.5:1`) kontrast oranını sağlamalıdır.
4. **Önlediği Risk**: Güneş ışığında (saha kuryesi) veya düşük parlaklıkta soluk gri metinlerin okunamaması.
5. **Teknik Katman**: CSS Değişkenleri (`--text-primary`, `--text-secondary`).
6. **Bağımlılıklar**: `C10`.
7. **Doğrulama Yöntemi**: Otomatik kontrast hesaplama testi.
8. **Beklenen Sonuç**: Tüm metinler WCAG AA (`4.5:1`) ve çoğunlukla AAA (`7.0:1`) eşiğini geçer.
9. **Ölçülebilir Kabul Kriteri**: `< 4.5:1` kontrast oranına sahip metin öğesi sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm görünümler.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/index.css` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C3` — İkon Butonları ve Durum Rozetlerinde `aria-label` ve Ekran Okuyucu Desteği
1. **Kontrol ID**: `C3` | 2. **Kontrol Adı**: Semantik HTML, `aria-label` ve `aria-live` Bildirim Erişilebilirliği
3. **Gereksinim**: Yalnızca ikon içeren tüm butonlar açık `aria-label` taşımalı; canlı durum ve bildirim alanları `role="status"` / `aria-live="polite"` (SOS ve kritik hatalarda `assertive`) kullanmalıdır.
4. **Önlediği Risk**: Ekran okuyucu kullanan kullanıcıların buton işlevlerini ve gelen çağrı bildirimlerini algılayamaması.
5. **Teknik Katman**: React JSX / Flutter `Semantics`.
6. **Bağımlılıklar**: Bildirim ve navigasyon bileşenleri.
7. **Doğrulama Yöntemi**: Erişilebilirlik ağacı (Accessibility Tree) denetimi.
8. **Beklenen Sonuç**: İsimsiz etkileşimli eleman kalmaz.
9. **Ölçülebilir Kabul Kriteri**: Erişilebilir adı (`accessible name`) boş olan buton sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm görünümler, `AccessibleNotification`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: Bileşen `aria-label` nitelikleri | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C4` — Eldiven Dostu Minimum `44x44px` Dokunma Hedefleri
1. **Kontrol ID**: `C4` | 2. **Kontrol Adı**: Mobil ve Saha Ekranlarında `44x44px` (`min-h-[44px]`) Dokunma Alanı
3. **Gereksinim**: Özellikle Sürücü/Kurye (`K-01..K-08`) ve Müşteri (`C-01..C-08`) ekranlarındaki tüm butonlar, anahtarlar ve seçim kutuları en az `44x44px` dokunma alanına sahip olmalıdır.
4. **Önlediği Risk**: Motosiklet eldiveniyle veya hareket halinde yanlış butona (örn. kabul yerine ret) basılması.
5. **Teknik Katman**: Tailwind `min-h-[44px] min-w-[44px]`, Flutter `ConstrainedBox(minWidth: 44, minHeight: 44)`.
6. **Bağımlılıklar**: `C14`.
7. **Doğrulama Yöntemi**: Birincil aksiyon butonlarının (`getBoundingClientRect`) boyut kontrolü.
8. **Beklenen Sonuç**: Tüm saha ve çağrı kontrolleri tek parmak/eldivenle hatasız tetiklenir.
9. **Ölçülebilir Kabul Kriteri**: Birincil etkileşim kontrollerinde `< 44px` yükseklik sayısı `0`.
10. **İlgili Ekran/Model/API**: `K-02`, `K-03`, `K-05`, `C-02`, `C-05`.
11. **İlgili Faz**: `M2` ve `M4` | 12. **Kanıt Kaydı**: `AdminAutonomousAuditHub.tsx` & kurye bileşenleri | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C5` — Klavye Navigasyonu ve Görünür Odak Halkası (`focus-visible`)
1. **Kontrol ID**: `C5` | 2. **Kontrol Adı**: `Tab` Sırası ve `:focus-visible` Odak Göstergesi
3. **Gereksinim**: İşletme Paneli (`B-01..B-06`) ve Admin Komuta Merkezi (`A-01..A-06`) tamamen klavye ile gezilebilmeli ve odaklanan öğede `2px solid #2563EB` (`outline-offset: 2px`) halkası görünmelidir.
4. **Önlediği Risk**: Masaüstü operatörlerinin fare kullanmadan hızlı sipariş/onay işlemi yapamaması.
5. **Teknik Katman**: Global CSS `:focus-visible`.
6. **Bağımlılıklar**: `C8`.
7. **Doğrulama Yöntemi**: Klavye `Tab` / `Shift+Tab` / `Enter` / `Escape` gezinme testi.
8. **Beklenen Sonuç**: Odak hiçbir zaman kaybolmaz (`outline: none` ile gizlenmez).
9. **Ölçülebilir Kabul Kriteri**: Klavye ile ulaşılamayan form veya buton sayısı `0`.
10. **İlgili Ekran/Model/API**: Görünüm 1, 4, 5, 6.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/index.css` (`:focus-visible`) | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C6` — Bildirim Kartlarında Fare Üzerine Gelindiğinde (`Hover` / `Focus`) Sayacı Duraklatma
1. **Kontrol ID**: `C6` | 2. **Kontrol Adı**: Toast Bildirim Otomatik Kapanma Sayacının `onMouseEnter` İle Duraklatılması
3. **Gereksinim**: Kullanıcı bir bildirimi okurken fareyi üzerine getirdiğinde veya odaklandığında otomatik kapanma geri sayımı durmalı, çekildiğinde devam etmelidir.
4. **Önlediği Risk**: Kritik hata veya onay mesajının kullanıcı okuyamadan ekrandan kaybolması.
5. **Teknik Katman**: Bildirim bileşeni zamanlayıcı kontrolü.
6. **Bağımlılıklar**: `B2`.
7. **Doğrulama Yöntemi**: Bildirim üzerinde 10 saniye `hover` bekletme testi.
8. **Beklenen Sonuç**: Fare üzerindeyken bildirim kapanmaz.
9. **Ölçülebilir Kabul Kriteri**: `hover` durumunda kapanan bildirim sayısı `0`.
10. **İlgili Ekran/Model/API**: Küresel bildirim katmanı.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `App.tsx` / Bildirim bileşeni | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C7` — Hareket Hassasiyeti Desteği (`prefers-reduced-motion`)
1. **Kontrol ID**: `C7` | 2. **Kontrol Adı**: `prefers-reduced-motion: reduce` Medya Sorgusu Desteği
3. **Gereksinim**: İşletim sisteminde "Hareketi Azalt" seçeneği açık olan kullanıcılarda radar dalgası ve sayfa geçiş animasyonları devre dışı bırakılmalıdır.
4. **Önlediği Risk**: Vestibüler hassasiyeti olan kullanıcılarda baş dönmesi ve saha cihazlarında gereksiz pil tüketimi.
5. **Teknik Katman**: Global CSS `@media (prefers-reduced-motion: reduce)`.
6. **Bağımlılıklar**: `src/index.css`.
7. **Doğrulama Yöntemi**: Tarayıcı/cihaz `prefers-reduced-motion: reduce` emülasyonu.
8. **Beklenen Sonuç**: Animasyon süreleri `0.01ms`'ye iner.
9. **Ölçülebilir Kabul Kriteri**: Azaltılmış hareket modunda sürekli dönen/zıplayan dekoratif animasyon sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm görünümler.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/index.css` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C8` — 10 Semantik Renk Tokenı Disiplini (Rastgele Hex Rengi Yasağı)
1. **Kontrol ID**: `C8` | 2. **Kontrol Adı**: 10 Kanonik Renk Tokenı (`--bg-canvas` .. `--status-danger`) Standardı
3. **Gereksinim**: Tüm yüzey, metin, kenarlık ve durum renkleri yalnızca tanımlı 10 semantik token üzerinden kullanılmalıdır (Hedef: `< 12` renk).
4. **Önlediği Risk**: Ekranlar arası görsel tutarsızlık ve açık/koyu tema geçişinde okunmayan metinler.
5. **Teknik Katman**: `src/index.css` (`:root` ve `.theme-light`).
6. **Bağımlılıklar**: `C10`.
7. **Doğrulama Yöntemi**: Renk paleti envanter denetimi.
8. **Beklenen Sonuç**: Tüm modüller aynı 10 semantik token ile boyanır.
9. **Ölçülebilir Kabul Kriteri**: Toplam semantik renk token sayısı `10` (`< 12` hedefi karşılanır).
10. **İlgili Ekran/Model/API**: Tüm görünümler.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/index.css` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C9` — 6 Kanonik Tipografik Ölçek ve `tabular-nums` Rakam Hizalaması
1. **Kontrol ID**: `C9` | 2. **Kontrol Adı**: 6 Tipografik Hiyerarşi Sınıfı (`type-display`..`type-mono`) ve `tabular-nums`
3. **Gereksinim**: Başlık, gövde ve rakamlar 6 sabit ölçekle (`Plus Jakarta Sans` + `JetBrains Mono`) sınırlandırılmalı; tüm fiyat, geri sayım ve koordinat rakamlarında `font-variant-numeric: tabular-nums` kullanılmalıdır.
4. **Önlediği Risk**: 15 saniyelik teklif geri sayımında veya fiyat tablolarında rakamlar değişirken metnin sağa sola titremesi (layout jitter).
5. **Teknik Katman**: `src/index.css`.
6. **Bağımlılıklar**: `C1`.
7. **Doğrulama Yöntemi**: Tipografi ölçek sayısı ve `tabular-nums` kontrolü.
8. **Beklenen Sonuç**: Rakam sütunları dikey olarak milimetrik hizalanır.
9. **Ölçülebilir Kabul Kriteri**: Toplam tipografik ölçek sayısı `6` (`< 8` hedefi karşılanır); tüm parasal alanlarda `tabular-nums` aktiftir.
10. **İlgili Ekran/Model/API**: `C-03`, `K-03`, `B-01`, `A-03`, `A-06`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/index.css` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C10` — Çift Tema Mimarisi (`Obsidian Dark` & `Daylight Light`)
1. **Kontrol ID**: `C10` | 2. **Kontrol Adı**: Gece Saha Operasyonu (`Obsidian Dark`) ve Gündüz Ofis (`Daylight Light`) Canlı Tema Geçişi
3. **Gereksinim**: Kullanıcılar tek tıkla koyu ve açık tema arasında geçiş yapabilmeli ve tercih korunmalıdır.
4. **Önlediği Risk**: Gece sürüşünde parlak beyaz ekranın sürücünün gözünü alması veya gündüz güneş altında koyu ekranın parlaması.
5. **Teknik Katman**: `PlatformContext.themeMode`, `.theme-light` CSS sınıfı.
6. **Bağımlılıklar**: `C2`, `C8`.
7. **Doğrulama Yöntemi**: Her iki temada tüm 6 görünümün görsel ve kontrast testi.
8. **Beklenen Sonuç**: Sayfa yenilenmeden tüm yüzeyler kesintisiz tema değiştirir.
9. **Ölçülebilir Kabul Kriteri**: Tema değişiminde bozulan veya okunmaz hale gelen bileşen sayısı `0`.
10. **İlgili Ekran/Model/API**: Üst navigasyon çubuğu, `W-05`, `A-06`.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` (`themeMode`) | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C11` — `4px / 8px` Uzamsal Grid ve Boşluk (Spacing) Disiplini
1. **Kontrol ID**: `C11` | 2. **Kontrol Adı**: `4px / 8px` Katlarına Oturan Padding, Margin ve Gap Ölçeği
3. **Gereksinim**: Tüm bileşen içi boşluklar ve ızgara aralıkları `4px`, `8px`, `12px`, `16px`, `24px`, `32px` ölçeğine oturmalıdır.
4. **Önlediği Risk**: Rastgele piksel değerleriyle oluşan dağınık ve hizasız kart düzeni.
5. **Teknik Katman**: Tailwind spacing sistemi, Flutter `EdgeInsets`.
6. **Bağımlılıklar**: Layout bileşenleri.
7. **Doğrulama Yöntemi**: Kart ve tablo hizalama denetimi.
8. **Beklenen Sonuç**: Tüm paneller kurumsal SaaS düzeninde hizalanır.
9. **Ölçülebilir Kabul Kriteri**: Standart grid dışı rastgele (`13px`, `19px` vb.) boşluk kullanımı `0`.
10. **İlgili Ekran/Model/API**: Tüm görünümler.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: Tailwind layout sınıfları | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C12` — Şeffaf Fiyat ve `%0` Komisyon Kutusu Görsel Standartlaştırması
1. **Kontrol ID**: `C12` | 2. **Kontrol Adı**: Çağrı Öncesi ve Fiş Ekranında Zorunlu `%0` Komisyon Şeffaflık Kutusu
3. **Gereksinim**: Müşteri (`C-03`), İşletme (`B-02`) ve Sürücü/Kurye (`K-03`) ekranlarında taşıma ücreti gösterilirken `Platform Hizmet Bedeli: 0.00 TL (%0)` ve `Şoför/Kurye Net Payı: %100` bilgisi gizlenmeden açıkça gösterilmelidir.
4. **Önlediği Risk**: Kullanıcının veya sürücünün gizli kesinti yapıldığını düşünmesi.
5. **Teknik Katman**: Fiyat özeti bileşeni (`QuoteBreakdownCard`).
6. **Bağımlılıklar**: `A20`, `B15`.
7. **Doğrulama Yöntemi**: `TAXI_RIDE`, `INDIVIDUAL_DELIVERY` ve `BUSINESS_DELIVERY` ekranlarında fiyat kutusu kontrolü.
8. **Beklenen Sonuç**: Her 3 rolde de kuruşu kuruşuna aynı şeffaf döküm görünür.
9. **Ölçülebilir Kabul Kriteri**: Gizli ücret veya belirsiz "hizmet bedeli" satırı sayısı `0`.
10. **İlgili Ekran/Model/API**: `W-02`, `C-03`, `C-08`, `K-03`, `B-02`.
11. **İlgili Faz**: `M0` ve `M2` | 12. **Kanıt Kaydı**: Müşteri, Kurye ve İşletme ekran tasarımları | 13. **Gerçek Durum**: `PARTIAL`.

##### `C13` — İşletme Paneli Canlı Üyelik ve Tanışma Dönemi Durum Başlığı (`MembershipBanner`)
1. **Kontrol ID**: `C13` | 2. **Kontrol Adı**: İşletme Üst Barında `ücretsiz_mi`, Kalan Gün ve Üyelik Durumu Gösterimi
3. **Gereksinim**: İşletme panelinin (`B-01`) en üstünde işletmenin mevcut üyelik durumu (`FREE_INTRO`, `ACTIVE_MEMBERSHIP`, `GRACE_PERIOD`, `LIMITED_ACCESS` vb.), `effectiveIntroEndDate` tarihi ve kalan gün sayısı sürekli görünür olmalıdır.
4. **Önlediği Risk**: İşletmenin ücretsiz tanışma döneminin ne zaman biteceğini sürpriz şekilde öğrenmesi.
5. **Teknik Katman**: `BusinessPortal` üst durum bileşeni.
6. **Bağımlılıklar**: `FLOW-09`, `FLOW-13`.
7. **Doğrulama Yöntemi**: 8 farklı üyelik durumunda banner metni ve aksiyon butonunun doğrulaması.
8. **Beklenen Sonuç**: İşletme her an üyelik durumunu ve kalan süresini net olarak görür.
9. **Ölçülebilir Kabul Kriteri**: 8 üyelik durumunun tamamında (`100%`) doğru durum etiketi ve kalan süre gösterilir.
10. **İlgili Ekran/Model/API**: `B-01`, `GET /api/v1/businesses/me/subscription`.
11. **İlgili Faz**: `M0` ve `M3` | 12. **Kanıt Kaydı**: `BusinessPortal.tsx` | 13. **Gerçek Durum**: `PARTIAL`.

##### `C14` — `LIMITED_ACCESS` ve `PLAN_SELECTION_REQUIRED` İçin Korkutmayan, Yapıcı UX Dili
1. **Kontrol ID**: `C14` | 2. **Kontrol Adı**: Cezalandırıcı Kilit Ekranı Yasağı ve Alternatifli (`INDIVIDUAL_DELIVERY`) Yönlendirme
3. **Gereksinim**: Tanışma süresi veya haftalık üyeliği biten işletmeye "Hesabınız Bloklandı / Borcunuz Var" gibi korkutucu kırmızı ekranlar gösterilemez; verilerinin güvende olduğu belirtilmeli, haftalık plan seçimi (`B-04`) ve Bireysel Gönderi (`B-05`) seçenekleri yan yana sunulmalıdır.
4. **Önlediği Risk**: Esnafın kendisini zorla borçlandırılmış veya verilerine el konulmuş hissetmesi (Vizyon ihlali).
5. **Teknik Katman**: `BusinessPortal` (`B-04`, `B-05`).
6. **Bağımlılıklar**: `FLOW-13`, `FLOW-15`.
7. **Doğrulama Yöntemi**: `PLAN_SELECTION_REQUIRED` ve `LIMITED_ACCESS` ekran metinleri ve eylem butonlarının UX denetimi.
8. **Beklenen Sonuç**: İşletme geçmiş raporlarını okur ve isterse tekil bireysel gönderi açabilir.
9. **Ölçülebilir Kabul Kriteri**: `LIMITED_ACCESS` ekranında geçmiş raporlara erişim `%100` açık; bireysel gönderi butonu `%100` erişilebilir.
10. **İlgili Ekran/Model/API**: `B-04`, `B-05`.
11. **İlgili Faz**: `M0` ve `M3` | 12. **Kanıt Kaydı**: Bölüm C.3.3 | 13. **Gerçek Durum**: `PARTIAL`.

##### `C15` — Mobil, Tablet ve Geniş Ekran Masaüstü Duyarlı (Responsive) Kırılım Mimarisi
1. **Kontrol ID**: `C15` | 2. **Kontrol Adı**: `375px` (Mobil), `768px` (Tablet) ve `1440px+` (Komuta Merkezi) Responsive Tasarım
3. **Gereksinim**: Tüm web ve mobil görünümler yatay taşma (`horizontal scroll`) yapmadan ekran boyutuna uyum sağlamalıdır.
4. **Önlediği Risk**: Küçük telefon ekranlarında çağrı/onay butonlarının ekran dışına taşması.
5. **Teknik Katman**: CSS Grid / Flexbox (`sm:`, `md:`, `lg:`, `xl:`), Flutter `LayoutBuilder`.
6. **Bağımlılıklar**: `C11`.
7. **Doğrulama Yöntemi**: `375x667`, `768x1024` ve `1440x900` çözünürlüklerinde görünüm testi.
8. **Beklenen Sonuç**: Hiçbir çözünürlükte metin binmesi veya yatay kaydırma oluşmaz.
9. **Ölçülebilir Kabul Kriteri**: `375px` genişlikte yatay taşma (`scrollWidth > clientWidth`) yapan ekran sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm 6 görünüm.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: Responsive Tailwind sınıfları | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C16` — Yükleniyor (`Skeleton`), Boş Durum (`Empty State`) ve Hata Durumu (`Error State`) Standartları
1. **Kontrol ID**: `C16` | 2. **Kontrol Adı**: Sıfır Veri ve Ağ Hatası Durumlarında Açıklayıcı Görsel Geri Bildirim
3. **Gereksinim**: Henüz sipariş/kampanya yokken boş beyaz alan yerine yönlendirici `Empty State`, veri çekilirken `Skeleton` ve hata anında "Tekrar Dene" butonlu `Error State` gösterilmelidir.
4. **Önlediği Risk**: Kullanıcının uygulamanın donduğunu sanarak sayfayı terk etmesi.
5. **Teknik Katman**: Ortak UI bileşenleri.
6. **Bağımlılıklar**: `A18`.
7. **Doğrulama Yöntemi**: Boş sipariş listesi ve ağ kesintisi simülasyonu.
8. **Beklenen Sonuç**: Kullanıcı her durumda ne yapabileceğini görür.
9. **Ölçülebilir Kabul Kriteri**: Boş liste döndüğünde ham boş `div` gösteren ekran sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm liste ve tablo ekranları.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: Görünüm bileşenleri | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `C17` — Kritik Yönetici İşlemlerinde Gerekçeli Onay Modalı (`Confirmation & Justification Modal`)
1. **Kontrol ID**: `C17` | 2. **Kontrol Adı**: Kampanya Duraklatma, Süre Uzatma, Havale Reddi ve Blokajda Zorunlu Gerekçe Girişi
3. **Gereksinim**: Admin panelinde (`A-02`, `A-03`, `A-04`) yapılan kritik işlemler tek tıkla sessizce gerçekleşemez; açıklama/gerekçe (`min 10 karakter`) isteyen onay penceresi zorunludur.
4. **Önlediği Risk**: Yanlış tıklamayla aktif kampanyanın durdurulması veya gerekçesiz havale reddi.
5. **Teknik Katman**: Admin onay formları + Backend `@NotBlank @Size(min=10) justification`.
6. **Bağımlılıklar**: `A16`, `B3`.
7. **Doğrulama Yöntemi**: Gerekçe yazmadan onay/red/uzatma butonuna basma testi.
8. **Beklenen Sonuç**: Gerekçe girilmeden form gönderilemez ve `AuditLogEntry.justification` alanına kaydedilir.
9. **Ölçülebilir Kabul Kriteri**: Gerekçesiz tamamlanabilen kritik yönetici işlemi sayısı `0`.
10. **İlgili Ekran/Model/API**: `A-02`, `A-03`, `A-04`, `FLOW-11`, `FLOW-14`, `FLOW-19`.
11. **İlgili Faz**: `M0` ve `M5` | 12. **Kanıt Kaydı**: `AdminDashboard.tsx` & `AdminLoyaltyCampaignHub.tsx` | 13. **Gerçek Durum**: `PARTIAL`.

##### `C18` — Sürücü/Kurye 15 Saniyelik Çağrı Teklifi (`HUD`) Yüksek Görünürlük ve Net Hakediş Tasarımı
1. **Kontrol ID**: `C18` | 2. **Kontrol Adı**: `K-03` Çağrı Teklif Ekranında 4 Kritik Veri Noktası ve Geri Sayım Halkası
3. **Gereksinim**: Sürücüye gelen 15 saniyelik teklif ekranında karmaşık metinler yerine büyük puntolarla yalnızca 4 temel bilgi öne çıkarılmalıdır: (1) Hizmet Tipi (`TAXI_RIDE` / `DELIVERY`), (2) Alış ve Varış Mesafesi/Adresi, (3) `%100 Net Kazanç Tutarı (Kesinti: 0 TL)`, (4) 15 Saniyelik Geri Sayım ve Dev `Kabul Et / Pas Geç` Butonları.
4. **Önlediği Risk**: Sürücünün teklifi incelerken dikkat dağınıklığı yaşaması.
5. **Teknik Katman**: `CourierApp` (`K-03` Teklif Kartı).
6. **Bağımlılıklar**: `C4`, `C9`, `C12`.
7. **Doğrulama Yöntemi**: `K-03` ekranında görsel hiyerarşi ve `44x44px+` buton kontrolü.
8. **Beklenen Sonuç**: Sürücü `< 3 saniye` içinde teklifi okuyup karar verebilir.
9. **Ölçülebilir Kabul Kriteri**: Teklif kartında `0.00 TL` kesinti ve net kazanç tutarı `type-display` / `type-h1` boyutunda görünürdür.
10. **İlgili Ekran/Model/API**: `K-03`, `FLOW-06`.
11. **İlgili Faz**: `M4` | 12. **Kanıt Kaydı**: `CourierApp.tsx` | 13. **Gerçek Durum**: `IMPLEMENTED`.

---

#### 5.4. Bölüm D Kontrolleri (`D1` – `D10`: 10 Kontrol — Backend API, Dayanıklılık, İzleme, Test ve Yayın Süreçleri)

##### `D1` — Modüler Monolit Backend Mimarisi (Spring Boot 3 / Java 21) ve Prototip Sunucu (`server.ts`) Sınırı
1. **Kontrol ID**: `D1` | 2. **Kontrol Adı**: Üretim Spring Boot 3 Modüler Monolit ve AI Studio Express (`server.ts`) Simülasyon Ayrımı
3. **Gereksinim**: Üretim backend'i Java 21 + Spring Boot 3 modüler monolit olarak sınırları net paketlerle (`identity`, `campaign`, `membership`, `order`, `dispatch`, `governance`) kurgulanmalı; mevcut çalışma alanındaki `server.ts` (Express + Vite) yalnızca ön yüz prototip ve simülasyon sunucusu olarak kullanılmalıdır.
4. **Önlediği Risk**: Prototip bellek içi Express sunucusunun üretim backend'i sanılarak canlıya alınması.
5. **Teknik Katman**: Spring Boot 3 (Üretim Hedefi) / `server.ts` (AI Studio Prototip).
6. **Bağımlılıklar**: PostgreSQL 16 + PostGIS 3.4.
7. **Doğrulama Yöntemi**: Modül sınırları ve OpenAPI 3.1 sözleşme uyumluluk kontrolü.
8. **Beklenen Sonuç**: İstemciler standart REST ve WebSocket sözleşmeleri üzerinden konuşur.
9. **Ölçülebilir Kabul Kriteri**: Modüller arası döngüsel bağımlılık (`circular dependency`) sayısı `0`.
10. **İlgili Ekran/Model/API**: Tüm `/api/v1/*` uç noktaları.
11. **İlgili Faz**: `M0`–`M7` | 12. **Kanıt Kaydı**: `server.ts` (Prototip sunucu aktif) | 13. **Gerçek Durum**: `MOCK` (Bu çalışma alanında `server.ts` Express simülasyon sunucusu çalışmaktadır; Java 21/Spring Boot 3 üretim hedef mimarisidir).

##### `D2` — OpenAPI 3.1 Sözleşmesi ve İstemci–Sunucu Durum Mutabakatı (`/api/v1/state/sync`)
1. **Kontrol ID**: `D2` | 2. **Kontrol Adı**: OpenAPI 3.1 Şema Doğrulaması ve Durum Senkronizasyon Uç Noktası
3. **Gereksinim**: Tüm REST uç noktaları OpenAPI 3.1 şemasıyla belgelenmeli ve bağlantı koptuktan sonra yeniden bağlanan istemci `/api/v1/orders/active` veya `/api/state/sync` üzerinden sunucudaki güncel durumu almalıdır.
4. **Önlediği Risk**: Tünel veya asansörde interneti kopup gelen sürücünün/müşterinin eski sipariş durumunda takılı kalması.
5. **Teknik Katman**: REST API + İstemci yeniden bağlanma (Reconnection) kancası.
6. **Bağımlılıklar**: `A15`, `A18`.
7. **Doğrulama Yöntemi**: Ağ bağlantısı kesilip açıldığında aktif sipariş durumunun otomatik güncellenmesi testi.
8. **Beklenen Sonuç**: İstemci her zaman sunucudaki otoriter duruma (`authoritative state`) hizalanır.
9. **Ölçülebilir Kabul Kriteri**: Yeniden bağlanma sonrası durum mutabakat süresi `< 2 saniye`.
10. **İlgili Ekran/Model/API**: `A-06`, `K-04`, `C-06`, `/api/state/sync`.
11. **İlgili Faz**: `M2` | 12. **Kanıt Kaydı**: `server.ts` (`/api/state/sync`) & `PlatformContext.tsx` | 13. **Gerçek Durum**: `PARTIAL`.

##### `D3` — Çevrim Dışı Giden Kutusu Kuyruğu (`Offline Outbox Queue`) ve Sıralı Gönderim
1. **Kontrol ID**: `D3` | 2. **Kontrol Adı**: Sürücü ve Saha İşlemlerinde Bağlantı Kesintisi Kuyruğu (`Outbox`)
3. **Gereksinim**: Sürücü "Alış Noktasına Vardım" veya "Teslim Ettim (PoD)" butonuna bastığında anlık internet kesintisi varsa, işlem `Idempotency-Key` ve zaman damgasıyla yerel `Outbox` kuyruğuna alınmalı ve bağlantı gelir gelmez sırayla (`FIFO`) sunucuya iletilmelidir.
4. **Önlediği Risk**: Bodrum katta veya zayıf şebekede paket teslim eden kuryenin işleminin kaybolması.
5. **Teknik Katman**: İstemci `OfflineOutboxQueue` + `B11` (`Idempotency-Key`).
6. **Bağımlılıklar**: `B11`, `D2`.
7. **Doğrulama Yöntemi**: Çevrim dışı modda yapılan 3 durum güncellemesinin çevrim içi olunduğunda sırasıyla sunucuya iletilmesi testi.
8. **Beklenen Sonuç**: Hiçbir saha aksiyonu ağ kopması nedeniyle kaybolmaz ve mükerrer işlenmez.
9. **Ölçülebilir Kabul Kriteri**: Kısa süreli bağlantı kesintisinde işlem kaybı `%0`.
10. **İlgili Ekran/Model/API**: `K-04`, `K-06`, `K-07`, `C-07`.
11. **İlgili Faz**: `M4` | 12. **Kanıt Kaydı**: `PlatformContext.tsx` (`syncWithServer`) | 13. **Gerçek Durum**: `PARTIAL`.

##### `D4` — Küresel Çökme Koruması (`ErrorBoundary`) ve Hata Telemetri Kütüğü (`ErrorTracker`)
1. **Kontrol ID**: `D4` | 2. **Kontrol Adı**: İstemci `ErrorBoundary` Kurtarma Ekranı ve Yapılandırılmış Hata İzleme
3. **Gereksinim**: Herhangi bir alt bileşende beklenmeyen bir çalışma zamanı hatası oluştuğunda uygulama tamamen beyaz ekrana düşmemeli; kullanıcıya güvenli kurtarma ekranı sunulmalı ve hata `ErrorTracker` ile kaydedilmelidir.
4. **Önlediği Risk**: Tek bir grafik veya harita bileşeni hatasının tüm Operasyon Komuta Merkezini çökertmesi.
5. **Teknik Katman**: `src/components/ErrorBoundary.tsx`, `src/utils/errorTracker.ts`.
6. **Bağımlılıklar**: `A18`.
7. **Doğrulama Yöntemi**: Yapay bileşen hatası fırlatıldığında `ErrorBoundary` kurtarma ekranının açılması testi.
8. **Beklenen Sonuç**: Kullanıcı "Görünümü Yenile / Güvenli Moda Dön" butonuyla çalışmaya devam eder.
9. **Ölçülebilir Kabul Kriteri**: Yakalanmayan bileşen hatası nedeniyle oluşan tam beyaz ekran sayısı `0`.
10. **İlgili Ekran/Model/API**: `App.tsx`, tüm görünümler.
11. **İlgili Faz**: `M1` | 12. **Kanıt Kaydı**: `src/components/ErrorBoundary.tsx` & `src/utils/errorTracker.ts` | 13. **Gerçek Durum**: `IMPLEMENTED`.

##### `D5` — M0 Kampanya, Üyelik ve `%0` Komisyon Otomatik Birim Test Paketi (`Unit Tests`)
1. **Kontrol ID**: `D5` | 2. **Kontrol Adı**: `ücretsiz_mi`, `IntroCampaign`, `BusinessSubscription` ve `TransactionFeeSnapshot` Birim Testleri
3. **Gereksinim**: `effectiveIntroEndDate` hesaplaması, `personalIntroEndDate` önceliği, bitiş günü `00:00` sınır durumu ve `%0` komisyon snapshot üretimi otomatik birim testleriyle doğrulanmalıdır (`TEST-01..TEST-15`).
4. **Önlediği Risk**: Kod değişikliği sonrasında ücretsiz tanışma formülünün veya `%0` komisyon kuralının regresyona uğraması.
5. **Teknik Katman**: Vitest / JUnit 5 birim testleri.
6. **Bağımlılıklar**: `M0` kuralları.
7. **Doğrulama Yöntemi**: Otomatik test koşumu.
8. **Beklenen Sonuç**: Tüm sınır değer ve öncelik testleri (`%100`) başarılı geçer.
9. **Ölçülebilir Kabul Kriteri**: M0 iş kuralı birim testlerinde başarısız test sayısı `0`.
10. **İlgili Ekran/Model/API**: `CampaignModule`, `BusinessMembershipModule`, `PricingModule`.
11. **İlgili Faz**: `M0` | 12. **Kanıt Kaydı**: `src/utils/__tests__` / `AdminAutonomousAuditHub.tsx` | 13. **Gerçek Durum**: `PARTIAL` (Mevcut invariant testleri genişletilerek tüm 20 M0 senaryosunu kapsayacak).

##### `D6` — Sipariş Durum Makinesi, Atomik Eşleşme ve Çok Kiracılı ACL Entegrasyon Testleri
1. **Kontrol ID**: `D6` | 2. **Kontrol Adı**: `OrderStateMachine`, Eşzamanlı Teklif Kabulü ve `Cross-Tenant ACL` Entegrasyon Testleri
3. **Gereksinim**: `ALLOWED_ORDER_TRANSITIONS` geçişleri, paralel sürücü kabul yarış durumu ve işletmeler arası veri izolasyonu entegrasyon testleriyle doğrulanmalıdır (`TEST-16..TEST-18`).
4. **Önlediği Risk**: Yetki sızıntısı veya çift sürücü atamasının canlıya çıkması.
5. **Teknik Katman**: API Entegrasyon Testleri (Testcontainers PostgreSQL 16 + PostGIS 3.4).
6. **Bağımlılıklar**: `B7`, `B9`, `B20`.
7. **Doğrulama Yöntemi**: CI/CD boru hattında otomatik entegrasyon test koşumu.
8. **Beklenen Sonuç**: Tüm geçersiz geçişler ve çapraz kiracı erişimleri reddedilir.
9. **Ölçülebilir Kabul Kriteri**: Entegrasyon test paketi başarı oranı `%100`.
10. **İlgili Ekran/Model/API**: `OrderModule`, `DispatchModule`, `BusinessAclModule`.
11. **İlgili Faz**: `M1`–`M4` | 12. **Kanıt Kaydı**: Entegrasyon test şartnamesi | 13. **Gerçek Durum**: `NOT_TESTED` (PostgreSQL Testcontainers entegrasyon testleri backend kurulumuyla çalışacaktır).

##### `D7` — Dış Servis Adaptör İzolasyonu (`Sandbox / Mock` vs `Production` Profilleri)
1. **Kontrol ID**: `D7` | 2. **Kontrol Adı**: SMS, Harita/Rota, Push Bildirim ve Depolama Servislerinde `Adapter Pattern` ve Profil Ayrımı
3. **Gereksinim**: Tüm dış servisler (`SmsGateway`, `RoutingEngine`, `ObjectStorage`, `PushNotifier`) arayüz (`interface`) arkasına soyutlanmalı; `dev/simulation` profilinde sahte (mock) adaptörler, `prod` profilinde gerçek sağlayıcılar çalışmalıdır.
4. **Önlediği Risk**: Test veya simülasyon sırasında gerçek kullanıcılara SMS gitmesi veya üretimde mock servisin unutulması.
5. **Teknik Katman**: Spring `@Profile("prod")` vs `@Profile({"dev", "simulation"})`.
6. **Bağımlılıklar**: Tüm dış entegrasyonlar.
7. **Doğrulama Yöntemi**: `prod` profilinde hiçbir `Mock*Adapter` bean'inin yüklenmediğinin başlangıç (startup) kontrolü.
8. **Beklenen Sonuç**: Simülasyon ve üretim entegrasyonları birbirine asla karışmaz.
9. **Ölçülebilir Kabul Kriteri**: `prod` çalışma profilinde aktif mock adaptör sayısı `0`.
10. **İlgili Ekran/Model/API**: `IdentityModule`, `GeoModule`, `DocumentStorageModule`.
11. **İlgili Faz**: `M1` ve `M7` | 12. **Kanıt Kaydı**: Mimari katman kuralı | 13. **Gerçek Durum**: `MOCK` (Şu an yalnızca simülasyon adaptörleri çalışmaktadır).

##### `D8` — Kriptografik Denetim Zinciri ve Veritabanı Değişmezlik (`Invariant`) Doğrulama Testi
1. **Kontrol ID**: `D8` | 2. **Kontrol Adı**: `verifyAuditChain` ve `TransactionFeeSnapshot` Bütünlük Denetimi
3. **Gereksinim**: Sistem her başlangıçta ve denetim ekranında (`A-06`) tüm `AuditLogEntry` zincirini ve `TransactionFeeSnapshot` özetlerini doğrulayabilmelidir (`TEST-20`).
4. **Önlediği Risk**: Veritabanında yetkisiz doğrudan müdahalenin fark edilmemesi.
5. **Teknik Katman**: `AuditGovernanceModule`, `POST /api/v1/admin/audit/verify`.
6. **Bağımlılıklar**: `B3`, `B14`, `B15`.
7. **Doğrulama Yöntemi**: Canlı zincir doğrulama testi.
8. **Beklenen Sonuç**: `isValid: true` ve doğrulanan mühür sayısı raporlanır.
9. **Ölçülebilir Kabul Kriteri**: Kırık veya özeti uyuşmayan kayıt sayısı `0`.
10. **İlgili Ekran/Model/API**: `A-06`, `AdminAutonomousAuditHub.tsx`.
11. **İlgili Faz**: `M5` ve `M7` | 12. **Kanıt Kaydı**: `AdminAutonomousAuditHub.tsx` (`verifyAuditChain`) | 13. **Gerçek Durum**: `IMPLEMENTED` (Ön yüz ve simülasyon sunucusunda aktif).

##### `D9` — Performans, Hız Sınırı (`Rate Limiting`) ve Konum Akışı Yük Dayanıklılığı
1. **Kontrol ID**: `D9` | 2. **Kontrol Adı**: API Hız Sınırlandırması (`Rate Limit`) ve Eşzamanlı Konum/Çağrı Performans Kriteri
3. **Gereksinim**: Auth/OTP ve sipariş oluşturma uç noktaları IP ve kullanıcı bazlı hız sınırına (Rate Limit) tabi olmalı; PostGIS yarıçap sorguları indeks (`GIST`) kullanarak `< 200ms` altında yanıt vermelidir.
4. **Önlediği Risk**: Kaba kuvvet (Brute-force) OTP saldırıları, sahte çağrı yağmuru (DoS) ve konum sorgularında veritabanı kilitlenmesi.
5. **Teknik Katman**: API Gateway / Bucket4j Rate Limiter, PostgreSQL `CREATE INDEX idx_provider_loc ON provider_locations USING GIST (location)`.
6. **Bağımlılıklar**: `FLOW-01`, `FLOW-03`, `FLOW-06`.
7. **Doğrulama Yöntemi**: Yük testi ve eşik aşımında `429 Too Many Requests` yanıtı kontrolü.
8. **Beklenen Sonuç**: Sistem yoğun saatlerde kararlı yanıt süresini korur.
9. **Ölçülebilir Kabul Kriteri**: Yarıçap eşleştirme sorgusu p95 süresi `< 200ms`; limit aşımında `%100` `429` yanıtı.
10. **İlgili Ekran/Model/API**: Tüm açık API uç noktaları.
11. **İlgili Faz**: `M7` | 12. **Kanıt Kaydı**: Performans ve indeks şartnamesi | 13. **Gerçek Durum**: `NOT_TESTED`.

##### `D10` — Canlıya Geçiş (`Go-Live`), Sağlık İzleme (`Health Check`) ve Geri Dönüş (`Rollback`) Mekanizması
1. **Kontrol ID**: `D10` | 2. **Kontrol Adı**: Sıfır Kesintili Yayın, Flyway Şema Göçü, `/actuator/health` ve Geri Dönüş Planı
3. **Gereksinim**: Her sürüm geriye dönük uyumlu veritabanı göçü (Flyway) ile çıkmalı, `/actuator/health` (DB, PostGIS, Disk, WebSocket) izlenmeli ve kritik hata oranında (`> %1` 5xx) önceki sürüme `< 5 dakika` içinde geri dönülebilmelidir.
4. **Önlediği Risk**: Hatalı bir yayının sahadaki aktif taksi ve kurye operasyonunu durdurması.
5. **Teknik Katman**: CI/CD, Flyway, Spring Boot Actuator, Feature Flags (`FEATURE_FLAG_MOTO_PASSENGER = false`).
6. **Bağımlılıklar**: Tüm modüller (`M0–M7`).
7. **Doğrulama Yöntemi**: Staging ortamında yayın ve geri alma (`rollback`) tatbikatı.
8. **Beklenen Sonuç**: Aktif siparişler kopmadan sürüm geçişi ve gerektiğinde geri dönüş tamamlanır.
9. **Ölçülebilir Kabul Kriteri**: Sağlık kontrolü uç noktası çalışma oranı `%99.9`; geri dönüş süresi `< 5 dk`.
10. **İlgili Ekran/Model/API**: `/actuator/health`, Dağıtım altyapısı.
11. **İlgili Faz**: `M7` | 12. **Kanıt Kaydı**: Yayın ve geri dönüş şartnamesi | 13. **Gerçek Durum**: `NOT_TESTED`.


---

### 6. M0–M7 FAZLARININ AYRI AYRI VE TAM TANIMI (`M6` ve `M7` Ayrı Başlıklar Altında)

#### 6.1. FAZ `M0` — Ürün Kapsamı, `%0` Komisyon Anayasası, Tanışma Kampanyası ve Haftalık İşletme Üyelik Modeli
1. **Amaç**: 3 aktif hizmetin (`TAXI_RIDE`, `INDIVIDUAL_DELIVERY`, `BUSINESS_DELIVERY`), `%0` komisyon kuralının, `IntroCampaign` (6 durum) ve `BusinessSubscription` (8 durum) durum makinelerinin ve 18 alanlı `TransactionFeeSnapshot` mühürleme yapısının kesinleştirilmesi.
2. **Ön Koşullar**: Ürün vizyon belgesi (v0.2) ve M0 çelişki düzeltmelerinin onaylanmış olması.
3. **Modül ve Özellik Kapsamı**: `CampaignModule`, `BusinessMembershipModule`, `PricingSnapshotModule`, `ücretsiz_mi` hesaplayıcısı, `MANUAL_APPROVAL` havale bildirim modeli.
4. **Kullanıcı Akışları**: `FLOW-09`, `FLOW-11`, `FLOW-12`, `FLOW-13`, `FLOW-14`, `FLOW-15`.
5. **Veri Modeli ve API Gereksinimleri**: `intro_campaigns`, `business_subscriptions`, `manual_payment_notifications`, `transaction_fee_snapshots` tabloları ve ilgili admin/işletme API sözleşmeleri.
6. **Güvenlik ve İş Kuralları**: `customerPlatformServiceFee = 0`, `providerPlatformFee = 0`, `businessOrderCommission = 0`; `KURAL-01..06` kampanya çakışma kuralları; `In-Flight` aktif iş koruması; `LIMITED_ACCESS` durumunda veri silinmeme ve bireysel gönderi hakkı.
7. **Kapsam Dışı Özellikler**: `MOTO_PASSENGER_RIDE` aktif çağrıları, otomatik kart çekimi, kart saklama, müşteri/sürücü cüzdanı, escrow, gerçek para hareketi yapan muhasebe defteri (ledger).
8. **Bağımlılıklar**: PostgreSQL 16 şema temeli (`A4`, `A6`, `A7`, `A14`, `A15`, `A20`, `A21`).
9. **Test Senaryoları**: `TEST-01`–`TEST-15` arasındaki 15 temel kabul senaryosu (`D5`).
10. **Ölçülebilir Kabul Kriterleri**: `%0` komisyon ihlali `0`; tarih çakışmalı kampanya `0`; `LIMITED_ACCESS` durumunda silinen işletme verisi `0`.
11. **Tamamlanma Kanıtları**: Onaylı M0 veri şeması, durum geçiş tabloları ve `D5` birim test raporu.
12. **Sonraki Faza (`M1`) Geçiş Koşulları**: M0 durum makineleri ve `TransactionFeeSnapshot` kurallarında hiçbir açık çelişki kalmaması.

#### 6.2. FAZ `M1` — Tek Hesap, Çoklu Profil, Kimlik Doğrulama ve İşletme Alt Kullanıcı (`ACL`) Altyapısı
1. **Amaç**: Tek `UserAccount` altında çoklu profil (`CustomerProfile`, `DriverProfile`, `CourierProfile`, `BusinessMemberProfile`) yapısının, SMS OTP oturumunun, özel belge depolamanın ve işletme alt kullanıcı yetki izolasyonunun kurulması.
2. **Ön Koşullar**: `M0` fazının tamamlanmış olması.
3. **Modül ve Özellik Kapsamı**: `IdentityModule`, `BusinessAclModule`, `DocumentStorageModule`, Tek Flutter Mobil Uygulaması kabuğu ve Next.js Web Panelleri oturum altyapısı.
4. **Kullanıcı Akışları**: `FLOW-01`, `FLOW-02` (Başvuru ve belge yükleme), `FLOW-16`.
5. **Veri Modeli ve API Gereksinimleri**: `user_accounts`, `customer_profiles`, `driver_profiles`, `courier_profiles`, `business_accounts`, `business_sub_users`, `kyc_documents`; `/api/v1/auth/*`, `/api/v1/profiles/*`, `/api/v1/businesses/me/sub-users`.
6. **Güvenlik ve İş Kuralları**: Profil varlığı ile aktif işlem yetkisinin ayrılması (`AUD-06`), kiracı izolasyonu (`B20`), özel S3/MinIO imzalı URL (`B21`), OTP hız sınırı (`D9`).
7. **Kapsam Dışı Özellikler**: Harita üzerinden canlı çağrı eşleştirme (`M2`), kurye saha navigasyonu (`M4`).
8. **Bağımlılıklar**: `A2`, `A3`, `A17`, `A18`, `B20`, `B21`, `C1–C11`.
9. **Test Senaryoları**: Tek hesapla profil değiştirme testi, çapraz işletme (`IDOR`) erişim reddi testi, imzasız belge URL erişim reddi testi.
10. **Ölçülebilir Kabul Kriterleri**: Çapraz işletme veri sızıntısı `%0`; onaysız profille sürücü/işletme aksiyonu başarısı `0`.
11. **Tamamlanma Kanıtları**: Spring Security filtre testleri ve `FLOW-01`, `FLOW-16` doğrulama kaydı.
12. **Sonraki Faza (`M2`) Geçiş Koşulları**: Tüm rollerin JWT ve sunucu tarafı ACL kontrollerinin eksiksiz çalışması.

#### 6.3. FAZ `M2` — Müşteri Mobil Görünümü (`TAXI_RIDE` ve `INDIVIDUAL_DELIVERY` Uçtan Uca Çağrı Akışı)
1. **Amaç**: Tek Flutter uygulamasının Müşteri (`CustomerProfile`) görünümünde `TAXI_RIDE` ve `INDIVIDUAL_DELIVERY` çağrılarının rota/fiyat hesabı, `%0` komisyonlu `TransactionFeeSnapshot` mührü, 15 sn eşleşme radarı, 4 haneli PIN ve 112 SOS ile uçtan uca çalıştırılması.
2. **Ön Koşullar**: `M0` ve `M1` fazlarının tamamlanmış olması.
3. **Modül ve Özellik Kapsamı**: `GeoModule`, `PricingModule`, `OrderModule`, `SafetyModule`, Görünüm 2 (`C-01`–`C-08`).
4. **Kullanıcı Akışları**: `FLOW-04`, `FLOW-05`, `FLOW-06` (Müşteri tarafı), `FLOW-07` (PIN gösterimi), `FLOW-08` (Fiş ve puanlama), `FLOW-17`, `FLOW-18`.
5. **Veri Modeli ve API Gereksinimleri**: `service_requests`, `delivery_packages`, `chat_messages`, `safety_incidents`, `ratings`; `/api/v1/quotes/calculate`, `/api/v1/orders/taxi`, `/api/v1/orders/individual-delivery`.
6. **Güvenlik ve İş Kuralları**: Gerçek yol ağı mesafesi + PostGIS yedekleme (`B10`), `Idempotency-Key` (`B11`), `ALLOWED_ORDER_TRANSITIONS` (`B7`), 24 saat sohbet TTL (`B19`).
7. **Kapsam Dışı Özellikler**: `MOTO_PASSENGER_RIDE`, uygulama içi cüzdan bakiyesi yükleme, kayıtlı karttan otomatik çekim.
8. **Bağımlılıklar**: `A1`, `A5`, `A8`, `A9`, `B4`, `B7`, `B10`, `B11`, `C12`.
9. **Test Senaryoları**: `TEST-01`, `TEST-02`, `TEST-03`, `TEST-18` ve mükerrer `Idempotency-Key` çağrı testi.
10. **Ölçülebilir Kabul Kriterleri**: Her çağrıda 18 alanlı `%0` komisyonlu snapshot üretim oranı `%100`; `MOTO_PASSENGER_RIDE` erişimi `0`.
11. **Tamamlanma Kanıtları**: `C-01..C-08` ekran akış testleri ve API entegrasyon raporları.
12. **Sonraki Faza (`M3`) Geçiş Koşulları**: Bireysel taksi ve paket çağrılarının uçtan uca tamamlanabilmesi.

#### 6.4. FAZ `M3` — İşletme Web Paneli (`BUSINESS_DELIVERY`), Toplu Sipariş, Havale Bildirimi ve `LIMITED_ACCESS` Sürekliliği
1. **Amaç**: Esnaf ve işletmelerin Next.js tabanlı İşletme Paneli (`B-01..B-06`) üzerinden tanışma döneminde (`FREE_INTRO`) ve haftalık üyelikte (`ACTIVE_MEMBERSHIP` / `GRACE_PERIOD`) tekil/toplu `BUSINESS_DELIVERY` açabilmesi, Havale/EFT dekontu bildirebilmesi ve `LIMITED_ACCESS` durumunda veri kaybetmeden bireysel gönderi yapabilmesi.
2. **Ön Koşullar**: `M0`, `M1` ve `M2` fazlarının tamamlanmış olması.
3. **Modül ve Özellik Kapsamı**: Görünüm 4 (`B-01`–`B-06`), çoklu durak/paket sipariş girişi, `ManualPaymentNotification` yükleme, `LIMITED_ACCESS` salt-okunur arşiv ve `CustomerProfile` bireysel gönderi köprüsü.
4. **Kullanıcı Akışları**: `FLOW-09`, `FLOW-10`, `FLOW-13`, `FLOW-14` (İşletme tarafı), `FLOW-15`, `FLOW-16`.
5. **Veri Modeli ve API Gereksinimleri**: `POST /api/v1/orders/business-delivery`, `POST /api/v1/businesses/me/payment-notifications`, `GET /api/v1/businesses/me/orders`.
6. **Güvenlik ve İş Kuralları**: Üyelik durumuna göre sunucu tarafı yetki matrisi (`SUB-T01..SUB-T13`), `In-Flight` aktif iş koruması (`B18`), korkutmayan şeffaf UX dili (`C13`, `C14`).
7. **Kapsam Dışı Özellikler**: Otomatik kredi kartı aboneliği, sipariş başı yüzde komisyon kesintisi.
8. **Bağımlılıklar**: `B17`, `B18`, `B20`, `B21`, `C13`, `C14`.
9. **Test Senaryoları**: `TEST-04`, `TEST-06`, `TEST-07`, `TEST-08`, `TEST-09`, `TEST-10`, `TEST-15`.
10. **Ölçülebilir Kabul Kriterleri**: `LIMITED_ACCESS` durumunda veri kaybı `0`; `FREE_INTRO` ve `ACTIVE_MEMBERSHIP` durumunda sipariş komisyonu `0.00 TL`.
11. **Tamamlanma Kanıtları**: 8 üyelik durumunun tamamında `BusinessPortal` ekran ve API davranış doğrulaması.
12. **Sonraki Faza (`M4`) Geçiş Koşulları**: İşletme siparişlerinin ve üyelik yaşam döngüsünün eksiksiz doğrulanması.

#### 6.5. FAZ `M4` — Sürücü ve Kurye Saha Mobil Görünümü, Atomik Eşleşme, PIN/PoD ve `%100` Kazanç Çetelesi
1. **Amaç**: Tek Flutter uygulamasının Sürücü/Kurye (`DriverProfile` / `CourierProfile`) görünümünde (`K-01..K-08`) KYC kilidi, çevrim içi olma, 15 sn teklif HUD ekranı, PostgreSQL atomik iş kabulü, 200m geofence varış, 4 haneli PIN doğrulama, PoD fotoğraf/teslim kodu ve `%100` net kazanç özeti akışlarının tamamlanması.
2. **Ön Koşullar**: `M1`, `M2` ve `M3` fazlarının tamamlanmış olması.
3. **Modül ve Özellik Kapsamı**: `DispatchModule`, Görünüm 3 (`K-01`–`K-08`), `OfflineOutboxQueue` (`D3`).
4. **Kullanıcı Akışları**: `FLOW-02`, `FLOW-03`, `FLOW-06`, `FLOW-07`, `FLOW-08`, `FLOW-19`.
5. **Veri Modeli ve API Gereksinimleri**: `provider_locations`, `dispatch_offers`, `provider_earnings_summary`; `PUT /api/v1/providers/me/status`, `POST /api/v1/offers/{id}/accept`, `POST /api/v1/orders/{id}/start`, `POST /api/v1/orders/{id}/complete`.
6. **Güvenlik ve İş Kuralları**: KYC 4 belge onay kilidi (`B12`), `SELECT ... FOR UPDATE` atomik kabul kilidi (`B9`), 4 haneli PIN ve PoD zorunluluğu (`B16`), aktif siparişte blokaj engeli (`B8`), `44x44px+` eldiven dostu butonlar (`C4`, `C18`).
7. **Kapsam Dışı Özellikler**: Uygulama içinden banka hesabına otomatik para dağıtımı (M0'da taşıma bedeli doğrudan tahsil edilir, ekranda kazanç kaydı tutulur).
8. **Bağımlılıklar**: `B8`, `B9`, `B12`, `B16`, `C4`, `C18`, `D3`.
9. **Test Senaryoları**: `TEST-16`, `TEST-17`, 10 paralel sürücü kabul yarış testi, yanlış PIN red testi.
10. **Ölçülebilir Kabul Kriterleri**: Çift sürücü ataması `0`; PIN doğrulamasız başlayan iş `0`; onaysız belgeyle çevrim içi olan sürücü `0`.
11. **Tamamlanma Kanıtları**: `K-01..K-08` saha akış testleri ve eşzamanlı kabul yük testi raporu.
12. **Sonraki Faza (`M5`) Geçiş Koşulları**: Müşteri/İşletme çağrılarının saha sürücüsü tarafından uçtan uca tamamlanabilmesi.

#### 6.6. FAZ `M5` — Admin / Operasyon Komuta Merkezi, `MANUAL_APPROVAL` Masası ve Filo Yönetişimi
1. **Amaç**: Next.js tabanlı Admin Komuta Merkezi (`A-01..A-06`) üzerinden canlı filo izleme, KYC onaylama, global tanışma kampanyası yönetimi, Havale/EFT `MANUAL_APPROVAL` onaylama, tarife yönetimi, blokaj ve temel filo operasyon sınıflarının (`SINIF-01..16`) devreye alınması.
2. **Ön Koşullar**: `M0`–`M4` fazlarının tamamlanmış olması.
3. **Modül ve Özellik Kapsamı**: Görünüm 5 (`A-01`–`A-06`), Görünüm 1 (`W-01`–`W-05` Kurumsal Web Portalı), `GovernanceModule`, `FleetOperationsModule`, `AuditGovernanceModule`.
4. **Kullanıcı Akışları**: `FLOW-02` (Admin onayı), `FLOW-11`, `FLOW-12`, `FLOW-14` (`MANUAL_APPROVAL`), `FLOW-18` (SOS izleme), `FLOW-19`, `FLOW-20`, `FLOW-21`.
5. **Veri Modeli ve API Gereksinimleri**: `/api/v1/admin/intro-campaigns/*`, `/api/v1/admin/payment-notifications/*`, `/api/v1/admin/kyc/*`, `/api/v1/admin/blockages/*`, `/api/v1/fleet/*`.
6. **Güvenlik ve İş Kuralları**: Kampanya çakışma kuralları (`B17`), `@Version` iyimser kilidi (`A15`), zorunlu gerekçe modalları (`C17`), `append-only` denetim izi (`B3`, `B14`).
7. **Kapsam Dışı Özellikler**: M0 komisyon oranlarını `%0` üzerine çıkarma (sistemde kilitlidir).
8. **Bağımlılıklar**: `A10–A16`, `B3`, `B8`, `B13`, `B14`, `B17`, `C17`.
9. **Test Senaryoları**: `TEST-05`, `TEST-08`, `TEST-11`, `TEST-12`, `TEST-13`, `TEST-14`, `TEST-17`.
10. **Ölçülebilir Kabul Kriterleri**: Gerekçesiz veya `AuditLog` üretmeyen yönetici işlemi sayısı `0`.
11. **Tamamlanma Kanıtları**: Admin onay, çakışma ve denetim zinciri doğrulama raporları.
12. **Sonraki Faza (`M6`) Geçiş Koşulları**: Tüm operasyonel yönetim ve manuel üyelik onay süreçlerinin eksiksiz çalışması.

#### 6.7. FAZ `M6` — İleri Finansal Mutabakat, Çoklu Kasa, Mühürlü Gün Kapanışı ve Opsiyonel Çift Taraflı Defter (`General Ledger`)
1. **Amaç**: Şirket içi fiziksel/operasyonel kasaların (`SINIF-05` `CashVault`), işletme haftalık üyelik havale tahsilat mutabakatının, mühürlü gün sonu kapanışının (`SINIF-17` `DailyClosingAudit`) ve — *kullanıcı `DEC-02` kararıyla online tahsilat/emanet modelini onaylarsa* — Çift Taraflı Muhasebe Defteri (`LedgerEntry`) altyapısının devreye alınması.
2. **Ön Koşullar**: `M5` fazının tamamlanmış olması ve online ödeme/cüzdan kapsamı için `DEC-02` kararının netleşmesi.
3. **Modül ve Özellik Kapsamı**: `ReconciliationModule`, `CashVaultModule`, `DailyClosingModule`, `GeneralLedgerModule` (`A20`), `A-04` ve `A-06` finansal mutabakat görünümleri.
4. **Kullanıcı Akışları**: `FLOW-20` (Kasa/Ceza/Hasar finansal mutabakatı) ve `FLOW-21` (Mühürlü Gün Sonu Kapanışı).
5. **Veri Modeli ve API Gereksinimleri**: `cash_vaults`, `cash_transfer_records`, `daily_closing_audits`, `ledger_entries`, `transaction_reconciliation_records`; `/api/v1/admin/vaults/transfer`, `/api/v1/admin/daily-closing/seal`.
6. **Güvenlik ve İş Kuralları**: Yetersiz bakiyeli kasa transferi engeli, açık risk (açık zimmet, kasa farkı, tebliğsiz ceza) varken gerekçesiz gün kapanışı engeli (`SINIF-17`), çift taraflı yevmiye defterinde `totalDebit === totalCredit` mizan dengesi (`TEST-19`).
7. **Kapsam Dışı Özellikler**: Onaysız otomatik kart çekimi veya `%0` komisyon kuralını bozan kesintiler.
8. **Bağımlılıklar**: `A20`, `B5`, `B14`, `B15`, `SINIF-05`, `SINIF-06`, `SINIF-17`.
9. **Test Senaryoları**: `TEST-19` (Çift taraflı mizan dengesi), yetersiz kasa transfer reddi testi ve açık riskli gün kapanışı blokaj testi.
10. **Ölçülebilir Kabul Kriterleri**: Yevmiye defterinde borç–alacak farkı `0.00 TL`; mutabakatsız temiz gün kapanışı `0`.
11. **Tamamlanma Kanıtları**: Gün sonu kapanış mührü ve mizan doğrulama test raporu.
12. **Sonraki Faza (`M7`) Geçiş Koşulları**: Tüm iç kasa, üyelik tahsilat ve gün sonu mutabakat süreçlerinin doğrulanması.

#### 6.8. FAZ `M7` — Güvenlik Sıkılaştırma, Yük/Performans Testleri, Yedekleme/Geri Yükleme ve Canlıya Geçiş (`Go-Live`)
1. **Amaç**: Sistemin üretim ortamına çıkmadan önce tüm 71 kontrolünün (`A1–D10`), 22 uçtan uca akışının (`FLOW-01..22`), performans/hız sınırlarının, PostgreSQL PITR yedekleme/geri yükleme süreçlerinin ve sıfır kesintili yayın/geri dönüş (`rollback`) planının doğrulanması.
2. **Ön Koşullar**: `M0`–`M6` fazlarının tamamlanmış olması.
3. **Modül ve Özellik Kapsamı**: Görünüm 6 (`S-01` Bölünmüş Simülasyon Stüdyosu regresyon doğrulaması), API Rate Limiting (`D9`), PostgreSQL PITR Backup & `SystemSnapshot` (`B22`), `/actuator/health` ve izleme (`D10`), opsiyonel Redis önbellek/dağıtık kilit katmanı.
4. **Kullanıcı Akışları**: `FLOW-21` (Tam zincir ve yedek doğrulama) ve `FLOW-22` (Çoklu rol uçtan uca canlı simülasyon testi).
5. **Veri Modeli ve API Gereksinimleri**: `/actuator/health`, `/api/v1/admin/audit/verify-chain`, `/api/v1/admin/snapshots/*`.
6. **Güvenlik ve İş Kuralları**: `prod` profilinde sıfır mock adaptör (`D7`), simülasyon verisinin üretimden tam izolasyonu (`B22`), KVKK veri saklama ve imha politikaları.
7. **Kapsam Dışı Özellikler**: Yazılı UKOME onayı gelmedikçe `MOTO_PASSENGER_RIDE` hizmetinin canlıya açılması.
8. **Bağımlılıklar**: `B22`, `D6`, `D7`, `D8`, `D9`, `D10`.
9. **Test Senaryoları**: `TEST-01`–`TEST-20` tam regresyon paketi, Penetrasyon/IDOR güvenlik taraması, PostGIS yarıçap yük testi ve veritabanı geri yükleme (`restore`) tatbikatı.
10. **Ölçülebilir Kabul Kriterleri**: 20 kabul senaryosu başarı oranı `%100`; p95 eşleştirme süresi `< 200ms`; geri dönüş (`rollback`) süresi `< 5 dakika`.
11. **Tamamlanma Kanıtları**: Tamamlanmış 71/71 kontrol denetim raporu, yük testi sonuçları ve Go-Live onay tutanağı.
12. **Sonraki Faza Geçiş / Canlı Operasyon Koşulları**: Kritik ve yüksek seviyeli açık bulgu sayısının `0` olması.

---

### 7. SİSTEM GENELİNDE ZORUNLU MİMARİ VE OPERASYONEL GEREKSİNİMLER (20 KONTROL ALANI)

1. **Tek Hesap ve Çoklu Profil**: Her kullanıcı tek bir `UserAccount` ile kayıt olur; aynı hesap altında `CustomerProfile`, `DriverProfile`, `CourierProfile` ve `BusinessMemberProfile` profillerini açabilir ve Tek Flutter Mobil Uygulaması içinde profil değiştirebilir.
2. **Sunucu Tarafı Yetkilendirme**: İstemci arayüzündeki gizlemeler güvenlik sayılmaz; her API çağrısında Spring Security üzerinden aktif profil, `kycStatus`, `subscription.status`, `subUser.permissions` ve `activeBlockageCount` sunucuda doğrulanır.
3. **İşletme ve Alt Kullanıcı Veri İzolasyonu**: Tüm işletme sorguları oturumdaki `businessId` ile sınırlandırılır; alt kullanıcılar yalnızca kendi şube ve rol yetkileri dahilinde işlem yapabilir.
4. **Kimlik ve Belge Onayı (KYC)**: Taksi şoförü ve kuryeler için 4 belge (Ehliyet, Ruhsat, Trafik Sigortası, Adli Sicil), işletmeler için Vergi Levhası ve yetkili kimliği Admin tarafından onaylanmadan operasyonel yetki açılmaz.
5. **Dosya Depolama ve Erişim Kontrolleri**: Tüm KYC belgeleri, PoD fotoğrafları ve Havale/EFT dekontları özel (private) nesne depolamada şifreli saklanır ve yalnızca yetkili rollere maksimum 15 dakikalık imzalı URL ile sunulur.
6. **Sürücü/Kurye Çevrim İçi Olma Koşulları**: `kycStatus == APPROVED`, aktif blokaj yok (`0`), araç muayene ve zorunlu sigorta tarihi geçerli ve cihaz GPS izni açık olmalıdır.
7. **Teklif Dağıtımı ve Atomik Kabul Kilidi**: Çağrı en yakın uygun sürücüye 15 saniyelik teklif olarak iletilir; kabul anında PostgreSQL `SELECT ... FOR UPDATE` satır kilidi ile aynı işin iki sürücüye atanması teknik olarak engellenir.
8. **Konum Güncelliği ve Gerçek Zamanlı Olaylar**: Çevrim içi sürücüler 10 saniyede bir konum gönderir; 90 saniye sinyal alınmayan sürücü `STALE_LOCATION` olarak işaretlenir ve teklif havuzundan çıkarılır.
9. **İptal, Ret, Zaman Aşımı ve Tekrar Deneme**: Sürücü 15 saniyede yanıt vermezse veya cezasız pas geçerse teklif sıradaki sürücüye aktarılır; `IN_PROGRESS` (PIN doğrulanmış) siparişler müşteri tarafından tek taraflı iptal edilemez.
10. **Ücret Hesaplama ve Fiyat Sürümleme**: Fiyat teklifi gerçek yol ağı mesafesi ve o anki tarife sürümü (`policyVersion`) ile hesaplanır; çağrı oluştuğu anda 18 alanlı `TransactionFeeSnapshot` içinde `%0` komisyonla mühürlenir.
11. **İşletme Üyeliği ve Manuel Tahsilat**: Ücretsiz tanışma dönemi (`ücretsiz_mi`) bitince otomatik kart çekimi yapılmaz; haftalık sabit üyelik ödemeleri Havale/EFT dekont bildirimi (`PAYMENT_PENDING`) ve Admin `MANUAL_APPROVAL` onayıyla yürütülür.
12. **Kayıtların Değişmezliği ve Denetim İzi**: `transaction_fee_snapshots` ve `audit_logs` tablolarında `UPDATE` ve `DELETE` veritabanı seviyesinde kapatılır; her kritik işlem eski değer, yeni değer, gerekçe ve `previousSealHash -> securitySealHash` zinciriyle kaydedilir.
13. **Kişisel Veri Saklama (KVKK) ve Erişim**: Sürücü–müşteri sohbet mesajları siparişten 24 saat sonra, canlı takip paylaşım linkleri ise sipariş tamamlandığı anda erişime kapatılır.
14. **SOS, Bildirimler ve Destek Süreçleri**: 112 Acil SOS butonu hem cihaz üzerinden 112 aramasını başlatır hem de Komuta Merkezine (`A-01`) anlık koordinat ve araç bilgileriyle kritik alarm düşürür.
15. **Çevrim Dışı Davranış ve Idempotency**: Saha sürücü aksiyonları internet koptuğunda yerel `Outbox` kuyruğunda tutulur ve `Idempotency-Key` başlığıyla sunucuya mükerrer kayıt üretmeden iletilir.
16. **Yedekleme, Geri Yükleme ve Hata Kurtarma**: PostgreSQL veritabanı günlük tam yedek + sürekli WAL arşivi (PITR) ile korunur; istemci tarafında `ErrorBoundary` ile tam ekran çökmeleri önlenir.
17. **Simülasyon ile Üretim Ortamlarının İzolasyonu**: Bölünmüş Simülasyon Stüdyosu (`Görünüm 6`) ve mock dış servis adaptörleri üretim veritabanından ve `prod` çalışma profilinden tamamen izoledir.
18. **Birim, Entegrasyon, Uçtan Uca, Güvenlik ve Performans Testleri**: 20 M0 kabul senaryosu, 81 sipariş durum geçişi, 10 paralel sürücü kabul testi ve çapraz kiracı (IDOR) güvenlik testleri CI hattında koşulur.
19. **Erişilebilirlik Gereksinimleri**: Minimum `11px` yazı boyutu, WCAG 2.2 AA (`>= 4.5:1`) kontrast, `44x44px` eldiven dostu dokunma alanı, `:focus-visible` klavye halkası, `aria-label` ve çift tema (`Obsidian Dark` / `Daylight Light`) standarttır.
20. **Canlıya Geçiş, İzleme ve Geri Dönüş Planı**: Flyway şema göçleri, `/actuator/health` canlılık kontrolleri ve özellik bayrakları (`Feature Flags`) ile `< 5 dakika` içinde geri alınabilir yayın mimarisi uygulanır.

---

## BÖLÜM D: SON DOĞRULAMA TABLOSU VE İKİNCİ TUR İÇ TUTARLILIK DENETİMİ

### D.1. Sayısal ve İçerik Doğrulama Özeti

| Doğrulama Kalemi | Hedeflenen Sayı / Kapsam | Belgede Tanımlanan Sayı | İçerik ve Kural Tutarlılığı | Doğrulama Sonucu |
| :--- | :--- | :--- | :--- | :--- |
| **Aktif M0 Hizmetleri** | 3 (`TAXI_RIDE`, `INDIVIDUAL_DELIVERY`, `BUSINESS_DELIVERY`) + 1 Pasif (`MOTO_PASSENGER_RIDE`) | 3 Aktif + 1 Pasif | `%0` yolcu, şoför, kurye ve işletme sipariş komisyonu tüm bölümlerde tutarlı. | **DOĞRULANDI (`100%`)** |
| **Ana Uygulama Görünümleri** | 6 Görünüm (Tek Flutter Mobil Uygulaması dahil) | Görünüm 1 – Görünüm 6 | Görünüm 2 ve Görünüm 3 Tek Flutter Uygulaması altında birleştirildi. | **DOĞRULANDI (`6 / 6`)** |
| **Kampanya & Üyelik Durum Makineleri** | `IntroCampaign` (6 durum) + `BusinessSubscription` (8 durum) | 6 Durum (`CMP-T01..08`) + 8 Durum (`SUB-T01..13`) | `Europe/Istanbul` saat dilimi, `ücretsiz_mi` formülü ve kenar durumlar tam. | **DOĞRULANDI (`14 / 14 Durum`)** |
| **Uçtan Uca Akışlar (`FLOW-01..22`)** | 22 Benzersiz Akış (12 zorunlu alanla) | `FLOW-01` – `FLOW-22` (22 Akış) | Her akışta aktör, ön koşul, API, durum geçişi, hata ve kabul kriteri mevcut. | **DOĞRULANDI (`22 / 22`)** |
| **Bölüm A Kontrolleri (`A1–A21`)** | 21 Kontrol (13 zorunlu alanla ayrı ayrı) | `A1` – `A21` (21 Kontrol) | Hiçbir madde gruplanmadı; gerçek uygulama durumları dürüstçe yazıldı. | **DOĞRULANDI (`21 / 21`)** |
| **Bölüm B Kontrolleri (`B1–B22`)** | 22 Kontrol (13 zorunlu alanla ayrı ayrı) | `B1` – `B22` (22 Kontrol) | PostgreSQL atomik kilit, yol ağı mesafesi ve `append-only` denetim izi düzeltildi. | **DOĞRULANDI (`22 / 22`)** |
| **Bölüm C Kontrolleri (`C1–C18`)** | 18 Kontrol (13 zorunlu alanla ayrı ayrı) | `C1` – `C18` (18 Kontrol) | WCAG AA, `11px` taban, `44x44px` dokunma alanı ve korkutmayan UX dili tam. | **DOĞRULANDI (`18 / 18`)** |
| **Bölüm D Kontrolleri (`D1–D10`)** | 10 Kontrol (13 zorunlu alanla ayrı ayrı) | `D1` – `D10` (10 Kontrol) | Spring Boot 3 hedefi ile `server.ts` simülasyon sınırı ayrıldı. | **DOĞRULANDI (`10 / 10`)** |
| **Toplam Kontrol Sayısı** | **71 Kontrol (`21 + 22 + 18 + 10`)** | **71 Kontrol** | Tüm 71 kontrol tek tek numaralandırıldı ve doğrulandı. | **DOĞRULANDI (`71 / 71`)** |
| **Uygulama Fazları (`M0–M7`)** | 8 Ayrı Faz (`M0`, `M1`, `M2`, `M3`, `M4`, `M5`, `M6`, `M7`) | `M0` – `M7` (8 Ayrı Başlık) | `M6` ve `M7` ayrıldı; her fazda 12 zorunlu alt başlık tamamlandı. | **DOĞRULANDI (`8 / 8`)** |

### D.2. İkinci Tur İç Tutarlılık Kontrol Listesi Sonucu
- [x] Bir bölümde alınan karar diğer bölümde çelişiyor mu? **Hayır (`AUD-01..14` ile tüm çelişkiler temizlendi).**
- [x] M0 kapsam dışı bir özellik (cüzdan, kart saklama, otomatik çekim, `MOTO_PASSENGER_RIDE`) başka bölümde M0'a dahil edilmiş mi? **Hayır, M0'dan tamamen çıkarıldı.**
- [x] Tek Flutter mobil uygulama kararı korunmuş mu? **Evet, Görünüm 2 ve Görünüm 3 tek uygulamada birleştirildi.**
- [x] İşletme erişim kuralları (`FREE_INTRO`, `ACTIVE_MEMBERSHIP`, `GRACE_PERIOD`, `LIMITED_ACCESS`) ekranlarda ve backend'de aynı mı? **Evet, birebir aynı.**
- [x] Finansal model, ödeme akışı ve `TransactionFeeSnapshot` birbiriyle uyumlu mu? **Evet, M0'da `%0` komisyonlu bilgi kaydı ve üyelikte Havale/EFT + `MANUAL_APPROVAL` ile tam uyumlu.**
- [x] İçerikte kesilmiş cümle, eksik bölüm veya "devamı eklenecek" ifadesi var mı? **Hayır, belge tam metin olarak tamamlandı.**

---

## BÖLÜM E: AÇIK KARARLAR (`KARAR_GEREKİYOR`)

Kaynaklarda kesinleşmemiş olan ve gizli varsayım yapılmadan ürün sahibinin/yöneticinin onayına sunulan karar noktaları şunlardır:

| Karar Kodu | Konu | Neden `KARAR_GEREKİYOR`? | Etkilediği Modüller | Uygulanabilir Çözüm Seçenekleri |
| :--- | :--- | :--- | :--- | :--- |
| **`DEC-01`** | **Nihai Ticari Marka Adı (`TFKS` / `Blesyum` / `MotoPilot`)** | Kod tabanında ve geçmiş belgelerde 3 farklı isim geçmektedir; marka adı kendiliğinden değiştirilemez. | Görünüm 1–6 Başlıkları, Mobil Uygulama Adı, Bildirim Şablonları | **Seçenek A**: `Blesyum` (Tüketici/Esnaf markası) + `TFKS` (İç filo/denetim modülü adı).<br>**Seçenek B**: Tüm yüzeylerde tek bir yeni marka adının parametrik (`APP_BRAND_NAME`) kullanılması. |
| **`DEC-02`** | **Taşıma Bedelinin (Yolcu/Gönderici $\rightarrow$ Şoför/Kurye) Online Ödeme Aracılığı Zamanlaması** | M0'da cüzdan, kart saklama ve escrow kapsam dışıdır. Yolcu ve göndericinin şoföre/kuryeye ödemeyi yalnızca Nakit/Fiziksel POS ile mi yapacağı, yoksa ileriki bir fazda (`M6`) lisanslı ödeme kuruluşu entegrasyonu mu açılacağı netleştirilmelidir. | `OrderModule`, `ReconciliationModule`, `M6` Fazı | **Seçenek A (M0 Varsayılanı)**: Platform taşıma parasına hiç dokunmaz; ödeme sahada Nakit / Sürücü POS'u ile doğrudan yapılır.<br>**Seçenek B (`M6`)**: BDDK lisanslı ödeme kuruluşu ile `%0` komisyonlu doğrudan aktarım entegrasyonu. |
| **`DEC-03`** | **Haftalık Sabit İşletme Üyelik Ücretinin Başlangıç Tutarı (`[ADMIN_AYARI]`)** | Haftalık sabit üyelik modeli kesinleşmiştir ancak ilk lansman TL tutarı ticari bir karardır. | `BusinessMembershipModule`, `A-03`, `B-04` | Sistemde kod içine sabitlenmemiştir (`[ADMIN_AYARI]`). Lansman öncesi Admin panelinden (Örn: `500 TL/Hafta`, `750 TL/Hafta` veya kademeli) girilir. |
| **`DEC-04`** | **Global Tanışma Kampanyası Başlangıç Süresi, Karar Süresi ve `GRACE_PERIOD` Gün Sayıları** | Kampanya süresi, `PLAN_SELECTION_REQUIRED` karar süresi ve `GRACE_PERIOD` tolerans süresi parametrik bırakılmıştır. | `CampaignModule`, `BusinessMembershipModule` | Önerilen parametrik varsayılanlar: Karar süresi `3 gün`, `GRACE_PERIOD` `3 gün`, Bildirim günleri `T-14, T-7, T-3, T-1`. Admin panelinden (`A-03`) değiştirilebilir. |
| **`DEC-05`** | **`MOTO_PASSENGER_RIDE` (Motosikletli Yolcu) İçin İl UKOME / UGETAM Yasal Onay Durumu** | Yasal teyit olmadan M0'da açılmaması kararlaştırılmıştır. | `FeatureFlagModule`, `C-02`, `K-01` | Yazılı yasal izin belgesi sisteme kaydedilene kadar `FEATURE_FLAG_MOTO_PASSENGER = false` olarak kilitli tutulur. |
| **`DEC-06`** | **`BUY_FOR_ME` (`Al-Getir` / Sipariş Satın Alma) Hizmetinin Gelecek Faz Durumu** | Eski tip dosyasında (`al_getir`) yer almakta ancak ürün bedeli ödemesi gerektirdiği için M0'da yer almamaktadır. | `ServiceType`, `OrderModule` | **Seçenek A**: Tamamen sistemden kaldırılması.<br>**Seçenek B**: `M6` sonrasında ürün bedeli tahsilat yöntemi çözülünceye kadar pasif (`decision_pending`) tutulması. |
| **`DEC-07`** | **Üretim Yol Ağı Yönlendirme (Routing & ETA) Sağlayıcısı Seçimi** | Haversine gerçek yol mesafesi yerine geçemeyeceği için (`AUD-05`) üretimde kullanılacak harita/rota motoru seçilmelidir. | `GeoModule`, `PricingModule`, `B10` | **Seçenek A**: Kendi sunucumuzda açık kaynak **OSRM / Valhalla** (Sıfır API çağrı maliyeti).<br>**Seçenek B**: Ticari API (**Google Routes API / Mapbox**). |


---

## BÖLÜM F: MASTER İÇERİK KİTABI — CİLT 1: RESMİ ŞARTNAME MADDELERİ (`MADDE 1`, `2.1–2.11`, `3.1–3.4`), 8 ORTAK SEÇENEK, SINIRLI KAPASİTE PRENSİBİ VE FAZ 2 MODÜLLERİ

Bu bölüm, platformun hiçbir detayının özetlenmeden veya atlanmadan korunduğu **Master İçerik Kitabı**nın birinci cildidir.

### F.1. Resmi Şartname Maddeleri (`MP-SPEC-2026-V1` & `PROJE TANIM BELGESİ v0.2` Sentezi)

#### Madde 1 — Platformun Üç Ana Operasyonel Arayüz Katmanı ve Ortak Altyapısı
1. **Müşteri / İşletme Arayüz Katmanı**:
   - **Kullanıcılar**: Yolcu (`TAXI_RIDE`), bireysel paket gönderen kişi (`INDIVIDUAL_DELIVERY`), işletme sahibi ve yetkili işletme çalışanı (`BUSINESS_DELIVERY`).
   - **Temel İşlev**: Talep oluşturur, sunucuda hesaplanan bağlayıcı fiyatı (`%0` komisyon dökümüyle) önceden görür, işi haritada canlı takip eder, 4 haneli güvenlik kodunu (`PIN`) doğrular, ödeme bildirimlerini ve destek işlemlerini yürütür.
   - **Profil Geçiş Kuralı**: Bireysel müşteri profili (`CustomerProfile`) ile işletme profili (`BusinessMemberProfile`) tek hesap altında profil değiştirerek kullanılır; işletme ayrıca geniş ekran web panelinden (`BusinessPortal`) çoklu operasyon yürütebilir.
2. **Sürücü / Kurye Saha Arayüz Katmanı**:
   - **Kullanıcılar**: Hizmet yetkisi, KYC belgeleri ve araç/ekipman uygunluğu Admin tarafından onaylanmış taksi şoförleri (`DriverProfile`) ve kuryeler (`CourierProfile`).
   - **Temel İşlev**: Tek Flutter uygulaması içinde çevrim içi olur, ekipman ve ruhsat yetkisine uygun işleri 15 saniyelik HUD ekranında görür, kabul eder, alış/teslimat doğrulama adımlarını (4 haneli PIN ve PoD fotoğraf/teslim kodu) tamamlar.
3. **Operasyon ve Komuta Merkezi Katmanı**:
   - **Kullanıcılar**: Operasyon uzmanları, filo amirleri, destek ekibi, finans yöneticileri, iç denetçiler ve üst yöneticiler.
   - **Temel İşlev**: Tüm canlı talepleri, sürücüleri, 18 TFKS operasyon sınıfını (`SINIF-01..18`), güvenlik blokajlarını, tanışma kampanyalarını (`IntroCampaign`), haftalık işletme üyelik onaylarını (`MANUAL_APPROVAL`) ve 71/71 denetim kontrollerini tek bir entegre web portalından yönetir.

#### Madde 2.1 – 2.11 — Müşteri ve İşletme Uygulaması Bağlayıcı Şartname Maddeleri
- **Madde 2.1 — Karşılama, Giriş ve Hesap Oluşturma (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Telefon numarası giriş alanı (`+90`), 6 haneli SMS OTP doğrulama kutuları, KVKK/Kullanıcı Sözleşmesi aydınlatma metni ve canlı yardım bağlantısı.
  - **İşleyiş**: Telefon doğrulandıktan sonra yeni kullanıcı profil bilgilerini tamamlar; mevcut kullanıcı doğrudan hesabına girer. İşletme profili oluşturmak veya mevcut bir işletmeye alt kullanıcı olarak katılmak ayrı ve kontrollü bir akıştır.
  - **Karşılanacak Kenar Durumlar**: SMS kodu gelmedi (60 sn geri sayım), kod yanlış girildi, kod süresi doldu (120 sn), yeniden gönderme sınırı (dakikada maks 3), internet bağlantı hatası ve erişimi kısıtlı/blokajlı hesap uyarısı.
  - **Bağlayıcı Prensip**: **Konum izni uygulamaya girişin ön şartı yapılmaz**; kullanıcı GPS izni vermezse alış ve varış adresini elle yazarak veya listeden/haritadan seçerek işlem yapabilir.
- **Madde 2.2 — Ana Ekran, Hizmet Seçimi ve Profil Geçişi (`MVP DÂHİL`)**:
  - **Kişisel Profilde (`CustomerProfile`)**: `Taksi Çağır (TAXI_RIDE)` · `Paket Gönder (INDIVIDUAL_DELIVERY)` · `Geçmiş İşler` · `Destek ve Hesabım`.
  - **İşletme Profilinde (`BusinessAccount`)**: `İşletme Teslimatı Oluştur (BUSINESS_DELIVERY)` · `Toplu/Çoklu Teslimat` · `Aktif Teslimatlar` · `Tamamlanan İşler` · `Üyelik & Havale Bildirimi` · `Alt Kullanıcı ve Şube Yönetimi` · `Bireysel Gönderi Alanı (INDIVIDUAL_DELIVERY)`.
  - **Kapsam Kuralı**: `MOTO_PASSENGER_RIDE` (motosikletli yolcu), `Al-Getir` (`BUY_FOR_ME`), lüks araç/motosiklet sınıfı ve özel tarifeler yazılı yasal/ticari onay olmadan aktif ana hizmet olarak açılmaz.
- **Madde 2.3 — Yolculuk Talebi Oluşturma (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Alış adresi, varış adresi, interaktif harita pini ve buluşma açıklaması (`pickupDescription`: bina adı, kapı no, sokak tarafı).
  - **İşleyiş**: (1) Kullanıcı alış noktasını doğrular (`pickupConfirmedByUser = true`) $\rightarrow$ (2) Varış adresini arar veya haritadan seçer $\rightarrow$ (3) Buluşma açıklamasını ekler $\rightarrow$ (4) Sistem hizmet bölgesi (`Geofence`) ve minimum mesafe (`>= 300m`) kontrolünü yapar $\rightarrow$ (5) Şeffaf fiyat özetine geçer.
  - **Bağlayıcı Prensip**: **Cihazın ham GPS konumu doğrudan kesin alış noktası kabul edilmez**; sapmaları önlemek için kullanıcıya harita pini veya adres metni üzerinden mutlaka doğrulatılır.
- **Madde 2.4 — Tekil Paket Gönderimi (`INDIVIDUAL_DELIVERY`) Oluşturma (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Gönderici adı/telefonu, alıcı adı/telefonu, alım ve teslimat adresleri, paket adedi, paket boyutu (`zarf`, `kucuk`, `orta`, `buyuk`), ağırlık (`kg`), paketin hazır olma durumu (`isPackageReady`) ve teslimat talimatı (`deliveryInstructions`).
  - **İşleyiş**: Girilen paket boyutu ve ağırlığı sürücünün çanta hacmi (`45L / 65L`) ve taşıma kapasitesiyle (`<= 25 kg`) eşleştirilir. Kapasiteyi aşan talep nedenleriyle birlikte kullanıcıya açıklanır. **Adres tarifi (`pickupDescription`) ile kurye teslimat talimatı (`deliveryInstructions`) birbirinden ayrı alanlarda tutulur.**
- **Madde 2.5 — İşletme İçin Çoklu Teslimat (`BUSINESS_DELIVERY`) Oluşturma (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: İşletmenin çıkış şubesi/alım adresi ve her alıcı paketi için ayrı satır (`DeliveryPackageItem`: alıcı adı, telefon, varış adresi, boyut, ağırlık, not).
  - **İşleyiş**: Aynı alım noktasından çıkan 3–5 paket tek seferde eklenir. Her pakete bağımsız takip numarası (`MP-BIZ-801`, `MP-BIZ-802` vb.) ve bağımsız 4 haneli teslim kodu (`deliveryCode`) üretilir. Toplam ağırlık kontrol edilir. **Kritik Kural**: Çoklu teslimatta bir paketin alıcıya teslim edilememesi (`failed` / `returned`), aynı seferdeki diğer paketleri otomatik olarak başarısız veya tamamlanmış yapmaz; sipariş `PARTIALLY_COMPLETED` olarak paket bazlı kapatılır.
- **Madde 2.6 — Şeffaf Fiyat Özeti ve Talep Onayı (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Hizmet türü, alış/varış adresleri, ara duraklar, tahmini yol ağı mesafesi (`km`), tahmini süre (`dk`), açılış + km taşıma ücreti, **Platform Hizmet Bedeli: `0.00 TL (%0)`**, **Şoför/Kurye Kesintisi: `0.00 TL (%0)`**, **İşletme Sipariş Komisyonu: `0.00 TL (%0)`** ve toplam ödenecek tutar.
  - **Bağlayıcı Prensip**: Fiyat istemcide değil sunucuda hesaplanır ve çağrı onaylandığı anda 18 alanlı `TransactionFeeSnapshot` ile mühürlenir. Kullanıcı "Talebi Gönder" butonuna basmadan önce ne ödeyeceğini ve sürücüye `%100` net geçeceğini tam olarak görür.
- **Madde 2.7 — Sürücü / Kurye Arama ve Eşleştirme Motoru (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Canlı radar durumu, geçen süre sayacı, talep özeti ve iptal seçeneği.
  - **Eşleştirme Kriterleri**: Hizmet yetkisi (`passengerServiceApproved` / `courierServiceApproved`), ekipman modu (`equipmentMode`), çanta kapasitesi, aktif bölge ve konum güncelliği (`< 90 sn`).
  - **Bağlayıcı Prensip**: **Sürücüye teklif gönderilmesi (`OFFERED`) ile kesin atama (`ACCEPTED`) farklıdır**; aynı işi eşzamanlı kabul eden sürücülerden yalnızca biri PostgreSQL atomik satır kilidi (`SELECT ... FOR UPDATE`) ile atanır.
- **Madde 2.8 — Sürücü Eşleşti ve Alış Noktasına Geliyor (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Sürücü fotoğrafı, adı, araç/motosiklet modeli, plaka, puan ortalaması (`0–5`), konum güncelliği göstergesi, tahmini geliş süresi (ETA) ve güvenli iletişim butonları.
  - **Doğrulama**: Ekranda 4 haneli güvenlik başlatma kodu (`boardingCode`) gösterilir.
- **Madde 2.9 — Aktif Yolculuk / Teslimat Takibi (`MVP DÂHİL`)**:
  - **Bağlayıcı Prensip**: 4 haneli PIN kodu doğrulanmadan sefer `IN_PROGRESS` durumuna geçemez. Paket işinde **alım doğrulaması (`boardingCode`)** ile **teslimat doğrulaması (`deliveryCode` / `PoD`)** ayrı tutulur. Sürücünün internet/GPS bağlantısı kesildiğinde iş otomatik tamamlanmış sayılmaz; ekranda son bilinen konum zamanı ve bağlantı durumu şeffafça gösterilir.
- **Madde 2.10 — Acil Yardım ve Güvenlik (`112 SOS`) (`MVP DÂHİL`)**:
  - **Üçlü Ayrım**: (1) **112 Acil Arama** (GSM üzerinden doğrudan resmi acil çağrı), (2) **Platforma Güvenlik Olayı Bildirme** (`emergencyIncidentReported = true` ile Komuta Merkezine kırmızı alarm), (3) **Canlı Yolculuk/Takip Bağlantısı Paylaşma** birbirinden ayrı ve net butonlardır.
  - **Dürüstlük Kuralı**: Resmi 112 sistemine doğrudan devlet API'siyle otomatik veri aktarımı varmış gibi yanıltıcı ifade yazılmaz; uygulama 112 telefon aramasını başlatır ve eşzamanlı olarak platform Komuta Merkezine GPS koordinatlı alarm düşürür.
- **Madde 2.11 — Tamamlama, Fiş ve Değerlendirme (`MVP DÂHİL`)**:
  - **Yolculukta (`TAXI_RIDE`)**: Varış noktasında sefer sonlandırma ve `%0` komisyonlu şeffaf fiş kaydı.
  - **Paket Teslimatında (`INDIVIDUAL_DELIVERY` / `BUSINESS_DELIVERY`)**: Alıcı teslim kodu (`deliveryCode`) ve zaman/koordinat damgalı teslimat kanıt fotoğrafı (`PoD`) kullanılır. **Yolcu taşımada yolcunun yüz fotoğrafı teslimat kanıtı olarak asla istenmez (KVKK).**

#### Madde 3.1 – 3.4 — Sürücü ve Kurye Saha Uygulaması Bağlayıcı Şartname Maddeleri
- **Madde 3.1 — Başvuru, KYC ve Hizmet Yetkisi Ayrımı (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Kişisel bilgiler, plaka/araç bilgileri, 4 temel belge (Ehliyet, Ruhsat, Trafik Sigortası, Adli Sicil), ekipman beyanı ve inceleme durumu.
  - **Yetki Kuralı**: Yolcu taşıma yetkisi (`passengerServiceApproved`) ile paket/kurye taşıma yetkisi (`courierServiceApproved`) birbirinden bağımsız boolean bayraklardır; biri açıkken diğeri kapalı tutulabilir.
  - **Dürüstlük Kuralı**: Resmi kurum (İBB / UKOME / EGM) dış sistem entegrasyonu canlıda bağlanmadan "otomatik devlet sorgusu çalışıyor" gibi sunulmaz; Admin belge inceleme ve onay masası (`A-02`) üzerinden yürütülür.
- **Madde 3.2 — Çevrim İçi Olma ve Ekipman/Kapasite Seçimi (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Eldiven dostu (`min 44x44px`) çevrim içi anahtarı, aktif hizmet modu, kullanılan araç plakası, çanta kapasitesi ve GPS/şarj durumu.
  - **Bağlayıcı Prensip**: Üzerinde aktif sipariş (`ACCEPTED`, `ARRIVED`, `IN_PROGRESS`) bulunan sürücü çevrim dışı olamaz ve aktif işle çelişen ekipman/mod değişikliği yapamaz.
- **Madde 3.3 — 15 Saniyelik İş Teklifi (`HUD`) (`MVP DÂHİL`)**:
  - **Ekranda Bulunanlar**: Hizmet türü, alış noktasına uzaklık (`km`), toplam rota mesafesi/süresi, ara durak/paket sayısı, paket ağırlığı (`kg`) ve **Sürücü Net Hakedişi (`%100 — Kesinti: 0.00 TL`)**.
  - **Bağlayıcı Prensip**: Kazanç "yakıt/bakım giderleri düşüldükten sonra net kâr" gibi tahmini ifadelerle değil; **Brüt Taşıma Ücreti (`X TL`) - Platform Kesintisi (`0.00 TL`) = Sürücüye Kalan Tutar (`X TL`)** olarak net gösterilir. Teklif süresi (15 sn) dolduğunda kabul butonu otomatik kilitlenir.
- **Madde 3.4 — Saha İş Yürütme ve 8 Standart Sorun Bildirimi (`MVP DÂHİL`)**:
  - **Standart Saha Adımları**: `Alıma Git` $\rightarrow$ `Alış Noktasına Vardım (200m Geofence)` $\rightarrow$ `4 Haneli PIN Doğrula` $\rightarrow$ `Yolculuğu Başlat / Paketi Teslim Al` $\rightarrow$ `Ara Durakları Tamamla` $\rightarrow$ `PoD / Teslim Kodu Doğrula` $\rightarrow$ `İşi Bitir`.
  - **8 Standart Saha Sorun Seçeneği**: (1) `Müşteri / Gönderici Buluşma Noktasında Yok`, (2) `Paket Henüz Hazır Değil`, (3) `Paket Boyutu / Ağırlığı Kapasiteye Uygun Değil`, (4) `Alım veya Teslimat Adresi Yanlış / Eksik`, (5) `Teslimat Noktasında Alıcı Yok`, (6) `Araç / Motosiklet Arızası`, (7) `Trafik Kazası / Acil Durum`, (8) `İnternet / GPS Bağlantı Kaybı`.
  - **Bağlayıcı Prensip**: Sürücünün bildirdiği her sorun doğrudan aktif `orderId` ile ilişkilendirilir ve Komuta Merkezine (`A-01` / `A-06`) düşer; sürücü sahada belirsiz bir ekranda tek başına bırakılmaz.

---

### F.2. Tüm Hizmetlerde Geçerli 8 Ortak Operasyonel Seçenek, Sınırlı Kapasite Kuralı ve Faz 2 Modülleri

#### 1. Aktif Olacak 8 Ortak Seçenek (`LaunchStrategyMatrix`)
1. **Hemen Al (`timing: 'immediate'`)**: Çağrı onaylandığı anda en yakın uygun sürücüye 15 saniyelik teklif olarak düşer.
2. **Belirli Saatte Al (`timing: 'scheduled'`, `scheduledTime`)**: İleri saatli planlı gönderi veya yolculuk (Örn: `19:30` alış).
3. **Ek Durak Ekle (`extraStops: MultiDropStop[]`)**: Güzergâh üzerinde 1 ila 3 ara teslimat veya durak noktası tanımlama; her durak için alıcı adı, telefon ve ayrı `deliveryCode` desteği.
4. **Kısa Süre Bekle (`waitMinutes`: `5 | 10 | 15 dk`)**: Durakta bekleme talebi (*ücretlendirme kuralı `DEC-06 / Öneri` kapsamında parametrik yönetilir*).
5. **Teslimat Notu ve Buluşma Açıklaması (`pickupDescription` & `deliveryInstructions`)**: Alış kapısı tarifi ile alıcıya teslim talimatının ("Zili çalmayın, güvenliğe bırakın") ayrı alanlarda sürücü ekranına yansıtılması.
6. **4 Haneli Güvenlik Kodu (`boardingCode` & `deliveryCode`) + PoD**: Alışta 4 haneli biniş/teslim alma PIN kodu, varışta 4 haneli alıcı teslim kodu ve zaman/koordinat damgalı teslimat fotoğrafı.
7. **Canlı Telemetri Takibi (`Live Tracking`)**: Harita üzerinde sürücünün anlık GPS konumu, yaklaşım süresi (ETA) ve güvenli paylaşım bağlantısı.
8. **Esnek Fiyat Teklifi / Pazarlık Modu (`BargainStatus`: `none | proposed | accepted | counter_offered | declined`)**: Yoğun saatlerde veya özel gönderilerde müşterinin/işletmenin önerdiği tutar (`bargainOfferedFare`) ile sürücünün karşı teklifinin (`bargainCounterFare`) şeffaf onayı (*M0'da komisyon yine `%0`'dır*).

#### 2. İlk Sürümde Sınırlı Kapasite Prensibi (Kara Kutu Algoritma Yerine Kontrollü Saha Dağıtımı)
- **Birkaç Noktaya Dağıt (`1–3 Ara Nokta`)**: İlk sürümde kuryenin saha hâkimiyetini bozacak karmaşık 20 duraklı zincirler yerine aynı yönde maksimum `1–3` teslimat noktası açılır.
- **Aynı Sürücüye Maksimum `3–5 Paket` (`multiPackageCount <= 5`)**: Bir işletmeden çıkan eşzamanlı siparişlerde tek bir motokuryeye en fazla `3–5` paket atanır; yemeklerin soğuması ve paket karışıklığı engellenir.
- **Fiziksel Çanta ve Ağırlık Sınırı (`45L Standart / 65L XL`, `<= 25 kg`)**: Sürücünün kayıtlı çanta hacmini veya ağırlık limitini aşan paketler motokuryeye atanmaz; uygun araçlı kuryeye yönlendirilir.

#### 3. Altyapısı Hazır Ancak İlk Gün Pasif (`Faz 2 / Feature Flag`) Tutulan 8 Kurumsal Modül
1. **Büyük Ölçekli Toplu Dağıtım (`50+ Paket Depo Çıkışı`)**: E-ticaret bölge depolarından toplu barkodlu çıkış.
2. **Gelişmiş TSP/VRP Akıllı Rota Optimizasyon Motoru**: Çok değişkenli yapay zekâ rota sıralama motoru.
3. **Çok Şubeli Zincir Marka Matrisi**: Yüzlerce şubeli ulusal zincirlerin bölge müdürlüğü hiyerarşisi.
4. **White-Label Filo Kiralama Modülü**: Farklı kurumsal kimlik ve alan adıyla kapalı devre filo çalıştırma.
5. **Çok Katmanlı Kurumsal SaaS Faturalandırma**: Otomatik e-Fatura/e-Arşiv entegrasyonu.
6. **Bölgeler Arası Filo Federasyon Ağı (`Network`)**: Farklı şehir ve bağımsız kurye kooperatiflerinin ortak havuz paylaşımı.
7. **Dış Pazar Yeri ve ERP Webhook Entegrasyonları**: Trendyol, Yemeksepeti, Getir, WooCommerce, Shopify siparişlerinin otomatik `BUSINESS_DELIVERY` çağrısına dönüştürülmesi (`BusinessAccount.apiKey` & `webhookUrl`).
8. **Panelvan ve Hafif Ticari Kargo Filosu**: Büyük hacimli koliler için 4 tekerlekli panelvan araç sınıfı.

---

## BÖLÜM G: MASTER İÇERİK KİTABI — CİLT 2: TFKS 18 OPERASYON SINIFI (`SINIF-01` – `SINIF-18`) VE BAŞLIK ALTI ZORUNLU 4'LÜ TALİMAT PROTOKOLÜ

### G.1. TFKS 18 Operasyon Sınıfının Tam Spesifikasyonu (`SINIF-01` – `SINIF-18`)

#### `SINIF-01`: Araç & Plaka Yönetimi
- **Sorumlu Rol**: Filo Operasyon Müdürü
- **Tanım**: Filodaki tüm ticari taksi, motosiklet ve hafif ticari araçların tescil, plaka, ruhsat, muayene, zorunlu trafik sigortası ve teknik durum künyesi.
- **Temel İş Kuralı**: Muayenesi veya zorunlu mali mesuliyet sigortası bitmiş araç zimmetsiz dahi olsa sistemde aktif edilemez ve çağrı alamaz.
- **Otomatik Blokaj Tetikleyicisi**: Muayene/sigorta geçerlilik tarihinin dolması (`expiryDate < today`) veya kritik OBD motor/fren arıza kodu algılanması.
- **Mühürlü Audit Gereksinimi**: Plaka, ruhsat ve muayene tarihi değişiklikleri yönetici kimliği, eski/yeni değer ve SHA-256 mührüyle saklanır.
- **Kabul Test Senaryosu**: Sigorta geçerlilik tarihi dün olan araca sürücü atanmaya çalışıldığında sistem `"Muayene/Sigorta Blokajı (403 VEHICLE_INSURANCE_EXPIRED)"` vermelidir.

#### `SINIF-02`: Şoför & Kurye Sicil Kartı
- **Sorumlu Rol**: İnsan Kaynakları & Operasyon Onay Masası
- **Tanım**: Sürücü kimlik, ehliyet sınıfı (`A / B`), e-Devlet adli sicil kaydı, ticari taşıma/SRC/Psikoteknik belgesi, ekipman/kask durumu ve performans risk sicil kartı.
- **Temel İş Kuralı**: 4 zorunlu KYC belgesi kontrol edilip Admin onayı (`isVerified = true`) almamış sürücü vardiyaya başlayamaz ve çevrim içi olamaz.
- **Otomatik Blokaj Tetikleyicisi**: Adli sicil kaydı eksikliği, ehliyet süresi dolumu veya ehliyet ceza puanının `100` limitini aşması.
- **Mühürlü Audit Gereksinimi**: Sürücü onaylama, askıya alma veya blokaja alma işlemleri zorunlu gerekçeyle `AuditLog` tablosuna yazılır.
- **Kabul Test Senaryosu**: Onaysız ehliyetli sürücü "Çevrim İçi Ol" anahtarına basarsa sistem `"Belge Eksikliği Blokajı (403 KYC_NOT_APPROVED)"` ile işlemi durdurmalıdır.

#### `SINIF-03`: Zimmet & Araç Teslim Zinciri (`VehicleAssignment`)
- **Sorumlu Rol**: Saha Garaj Amiri & Sürücü/Kurye
- **Tanım**: Aracın sürücüye teslimi, başlangıç kilometresi (`startKm`), yakıt/şarj seviyesi (`fuelLevel`) ve 4 yönlü teslim alma fotoğraflarının (`photoApproved`) onay zinciri.
- **Temel İş Kuralı**: Zimmet çakışma üretemez; bir araç aynı anda iki sürücüde, bir sürücü aynı anda iki araçta aktif görünemez (`B13`).
- **Otomatik Blokaj Tetikleyicisi**: Araç tesliminde önceki kapanış kilometresi ile yeni başlangıç kilometresi arasında uyumsuzluk (`newStartKm < previousEndKm`) tespit edilmesi.
- **Mühürlü Audit Gereksinimi**: Zimmet açılış saati, başlangıç km, plaka, sürücü kimliği ve onaylayan amir mühürlenir.
- **Kabul Test Senaryosu**: Aktif zimmetteki bir araç için başka bir sürücüye zimmet açılmak istendiğinde sistem çakışmayı tespit edip `409 VEHICLE_ALREADY_ASSIGNED` ile engellemelidir.

#### `SINIF-04`: Vardiya & Canlı Mesai Takibi (`CourierShift`)
- **Sorumlu Rol**: Saha Vardiya Şefi
- **Tanım**: Sürücünün canlı göreve başlama, mola, aktif sipariş taşıma ve vardiya tamamlama yaşam döngüsü.
- **Temel İş Kuralı**: Üzerinde açık/aktif sipariş (`ACCEPTED`, `ARRIVED`, `IN_PROGRESS`) bulunan sürücü vardiyasını kapatamaz ve çevrim dışı olamaz.
- **Otomatik Blokaj Tetikleyicisi**: Vardiyada araç GPS sinyalinin 90 saniyeden uzun kesilmesi veya teslim edilmemiş açık sipariş varken vardiya kapatma denemesi.
- **Mühürlü Audit Gereksinimi**: Vardiya başlangıç, bitiş, toplam km ve mola süreleri denetim veritabanına yazılır.
- **Kabul Test Senaryosu**: Açık siparişi olan kurye vardiyayı kapatmak istediğinde sistem `"Açık Sipariş Blokajı (409 ACTIVE_ORDER_EXISTS)"` vermelidir.

#### `SINIF-05`: Çoklu Kasa Yönetimi (`CashVault`: `merkez | operasyon | pos | kurye_avans`)
- **Sorumlu Rol**: Merkez Muhasebe Sorumlusu
- **Tanım**: Şirket içi nakit kasaları, operasyon kasaları, POS/banka mutabakat kasası, kasalar arası çift onaylı transfer (`CashTransferRecord`) ve gün sonu fiziksel sayım mutabakatı.
- **Temel İş Kuralı**: Kasa farkı (`discrepancyAmount`) sessizce kapatılamaz; eski kayıt silinmez, gerekçeli düzeltme/ters kayıt açılır. Kaynak kasada yeterli bakiye olmadan transfer yapılamaz (`B9`).
- **Otomatik Blokaj Tetikleyicisi**: Fiziksel sayım ile sistem kasası arasında mutabakatsız fark oluşması.
- **Mühürlü Audit Gereksinimi**: Kasa açılış, kapanış, transfer (`fromVaultId -> toVaultId`) ve sayım farkı onaylayan rol ve saat ile kaydedilir.
- **Kabul Test Senaryosu**: Sayım eksiği olan kasayı mazeretsiz ve üst onaysız kapatmaya çalışmak işlemi engellemelidir.

#### `SINIF-06`: Cari & Sürücü Hakediş / Borç Bağlantısı
- **Sorumlu Rol**: Finans Müdürü
- **Tanım**: Sürücü günlük/haftalık `%100` taşıma kazanç kayıtları, M0 `%0` komisyon garantisi ve kaynak evraka dayalı (tebliğ edilmiş trafik cezası veya kanıtlı hasar) mahsup kayıtları.
- **Temel İş Kuralı**: Kaynak olaya ve kanıtlı evrak numarasına dayanmayan hiçbir borç veya kesinti sürücü hesabına yazılamaz.
- **Otomatik Blokaj Tetikleyicisi**: Açık itirazı (`disputed == true`) bulunan sürücüye habersiz kesinti uygulanmaya çalışılması.
- **Mühürlü Audit Gereksinimi**: Kaynak evrak numarası, eski tutar, yeni tutar ve gerekçe loglanır.
- **Kabul Test Senaryosu**: Kaynak iş emri veya tebliğli ceza numarası girilmeden sürücü hesabına borç yazılmaya çalışıldığında sistem validasyon hatası (`422 SOURCE_DOCUMENT_REQUIRED`) vermelidir.

#### `SINIF-07`: Ceza & Trafik Tebligat Masası (`TrafficPenalty`)
- **Sorumlu Rol**: Filo İdari İşler Sorumlusu
- **Tanım**: Plakaya veya sürücüye tebliğ edilen trafik cezalarının 15 günlük `%25` erken ödeme indirim süresi (`discountValidUntil`) takibi ve sürücü tebliğ/itiraz yönetimi.
- **Temel İş Kuralı**: Ceza sürücüye uygulama içi mühürlü bildirimle ispatlı olarak tebliğ edilmeden (`acknowledgedByCourier == true`) sürücüye yansıtılamaz (`A10`, `B16`).
- **Otomatik Blokaj Tetikleyicisi**: İndirim süresinin dolmasına 48 saat kala hâlâ tebliğ edilmemiş veya incelenmemiş ceza bulunması.
- **Mühürlü Audit Gereksinimi**: Ceza sisteme işlendiğinde tebliğ tarihi, ceza tutanağı, zimmetli sürücü eşleşmesi ve sürücünün okuma/itiraz yanıtı (`courierReadStatus`) loglanır.
- **Kabul Test Senaryosu**: Sürücüye tebliğ bildirimi onaylanmadan (`acknowledgedByCourier == false`) ceza yansıtma denenirse sistem işlemi durdurmalıdır.

#### `SINIF-08`: HGS / OGS Köprü ve Otoyol Geçiş Mutabakatı
- **Sorumlu Rol**: Muhasebe & Filo Uzmanı
- **Tanım**: Köprü, tünel ve otoyol geçişlerinin araç plakası, geçiş saati ve o anki aktif zimmetli sürücü/çağrı ile eşleştirilmesi.
- **Temel İş Kuralı**: Vardiya dışı veya zimmetsiz saatte gerçekleşen geçişler otomatik `"Zimmetsiz / Özel Kullanım Geçiş Alarmı"` üretir.
- **Otomatik Blokaj Tetikleyicisi**: HGS bakiyesinin kritik limit altına düşmesi veya kaçak geçiş ihbarı oluşması.
- **Mühürlü Audit Gereksinimi**: Tüm geçiş kayıtları plaka, zaman damgası ve aktif zimmet ID'si ile eşleştirilerek saklanır.
- **Kabul Test Senaryosu**: Zimmet kapalıyken gerçekleşen köprü geçişi sistemce doğrudan `"Yetkisiz Kullanım İncelemesi"` kuyruğuna düşürülmelidir.

#### `SINIF-09`: Hasar Sorumluluk ve Ekspertiz Masası (`DamageReport`)
- **Sorumlu Rol**: Ekspertiz & Hasar Sorumlusu
- **Tanım**: Kazalı veya hasarlı araçların zimmet öncesi (`beforePhoto`) ve zimmet sonrası (`afterPhoto`) fotoğraflarla karşılaştırılması ve sorumluluk (`courier | company | insurance`) tespiti.
- **Temel İş Kuralı**: Teslim alma ve teslim etme fotoğrafları yan yana getirilip incelenmeden hasar maliyeti sürücüye re'sen yüklenemez.
- **Otomatik Blokaj Tetikleyicisi**: Açık ve ağır hasar tespiti (`status == 'pending_inspection'`) bulunan aracın servise girmeden sefere çıkarılmak istenmesi.
- **Mühürlü Audit Gereksinimi**: Hasar tutanağı, fotoğraflar, tahmini/gerçek maliyet (`estimatedCost` / `actualCost`) ve sorumluluk kararı mühürlenir.
- **Kabul Test Senaryosu**: Zimmet öncesi fotoğrafta zaten var olan bir çizik yeni hasar olarak sürücüye yazılmak istendiğinde teslim arşivi kontrolüyle reddedilmelidir.

#### `SINIF-10`: Barkodlu Depo & Yedek Parça Stoğu (`WarehousePart`)
- **Sorumlu Rol**: Depo Sorumlusu
- **Tanım**: Balata, lastik, kayış, motor yağı, ayna ve kaporta parçalarının raf konumu (`shelfLocation`), asgari stok (`minLimit`) ve birim maliyet (`unitPrice`) takibi.
- **Temel İş Kuralı**: Açık bir servis iş emri numarası (`ServiceWorkOrder.orderNo`) ve araç plakası olmadan depodan 1 adet parça dahi düşülemez; stok miktarı `< 0` olamaz (`A11`).
- **Otomatik Blokaj Tetikleyicisi**: Stok miktarının `minLimit` altına düşmesi veya negatif stok denemesi.
- **Mühürlü Audit Gereksinimi**: Stok giriş, çıkış (`PartUsageRecord`), sayım farkı ve fire kayıtları kim tarafından yapıldığıyla loglanır.
- **Kabul Test Senaryosu**: Plaka ve açık iş emri olmadan yapılan parça çıkış denemesi `422 WORK_ORDER_REQUIRED` ile engellenmelidir.

#### `SINIF-11`: Servis İş Emirleri, Yol Testi ve Eski Parça Takibi (`ServiceWorkOrder`)
- **Sorumlu Rol**: Baş Usta & Servis Müdürü
- **Tanım**: Periyodik bakım, mekanik onarım, kullanılan parçalar (`partsUsed`), işçilik (`laborCost`), yol testi (`testDriveApproved`) ve çıkan eski parçanın akıbeti (`oldPartsStatus: 'hurda' | 'depoya_iade' | 'inceleniyor'`).
- **Temel İş Kuralı**: Sözle servis açılamaz ve kapatılamaz; **yol testi onayı (`testDriveApproved == true`) ve eski parça teslimi yapılmadan iş emri kapatılamaz ve araç sahaya dönemez**.
- **Otomatik Blokaj Tetikleyicisi**: `testDriveApproved == false` veya `oldPartsStatus == 'inceleniyor'` iken iş emrinin `closed` yapılmaya çalışılması.
- **Mühürlü Audit Gereksinimi**: Değişen parçalar, toplam maliyet (`totalCost`), usta adı (`mechanicName`) ve yol testi onayı audit zincirine mühürlenir.
- **Kabul Test Senaryosu**: Yol testi onay kutusu işaretlenmemiş servis iş emri kapatılmak istendiğinde sistem `"Güvenlik Yol Testi Eksik (422 TEST_DRIVE_REQUIRED)"` uyarısıyla işlemi bloke etmelidir.

#### `SINIF-12`: GPS, Araç Takip & Cihaz Güvenliği
- **Sorumlu Rol**: Teknik Altyapı & Telemetri Amiri
- **Tanım**: Saniyelik konum, kontak durumu, hız aşımı, rota takibi ve GPS sinyal kesintisi (`gpsStatus: 'connected' | 'warning' | 'disconnected'`) tespiti.
- **Temel İş Kuralı**: GPS verisi aktif zimmet ve vardiya ile örtüşmelidir; zimmetsiz araç hareketi anında kırmızı güvenlik alarmı üretir.
- **Otomatik Blokaj Tetikleyicisi**: Araç seferdeyken GPS sinyalinin `90 saniyeden` uzun süre kesilmesi (`STALE_LOCATION`).
- **Mühürlü Audit Gereksinimi**: Sinyal kopma zamanı, son bilinen koordinat ve yeniden bağlanma süresi kaydedilir.
- **Kabul Test Senaryosu**: Zimmet kapalıyken aracın hareket ettiği algılanırsa sistem `"Yetkisiz Hareket Alarmı"` tetiklemelidir.

#### `SINIF-13`: ECU / OBD / CAN-Bus Araç Telemetri Verisi
- **Sorumlu Rol**: Teknik Filo Mühendisi
- **Tanım**: Motor arıza ışığı (`ecuStatus: 'normal' | 'dtc_warning'`), hararet, akü voltajı ve beyinden okunan gerçek kilometre verisinin izlenmesi.
- **Temel İş Kuralı**: Araç beyninden (ECU) okunan kilometre ile sürücünün manuel girdiği kilometre çelişirse sistem ECU verisini esas alır ve manipülasyon uyarısı açar.
- **Otomatik Blokaj Tetikleyicisi**: Kritik motor harareti veya fren sistemi DTC arıza kodunun raporlanması.
- **Mühürlü Audit Gereksinimi**: Algılanan DTC arıza kodları plaka ve zaman damgasıyla loglanır.
- **Kabul Test Senaryosu**: `ecuStatus == 'dtc_warning'` olan araca yeni çağrı atanmak istendiğinde sistem teknik güvenlik blokajı uygulamalıdır.

#### `SINIF-14`: Rol, Yetki Matrisi & Çift Onay (`Four-Eyes Principle`)
- **Sorumlu Rol**: Sistem Yöneticisi & İç Denetçi
- **Tanım**: Personel ve işletme rollerinin (`SUPER_ADMIN`, `OPS_MANAGER`, `FINANCE_ADMIN`, `AUDITOR`, `owner`, `branch_manager`, `dispatch_staff`, `accountant`, `read_only`) katı yetki matrisiyle sınırlandırılması.
- **Temel İş Kuralı**: Kritik finansal düzeltmeler, kasa farkı kapatma ve kritik güvenlik blokajı kaldırma işlemleri tek kişinin sessiz kararıyla yapılamaz; gerekçe ve üst onay gerektirir.
- **Otomatik Blokaj Tetikleyicisi**: Yetkisiz rolün başka bir işletmenin verisine (`Cross-Tenant`) veya yetkisi dışındaki bir uç noktaya erişim denemesi.
- **Mühürlü Audit Gereksinimi**: Tüm yetki ihlali girişimleri (`403 Forbidden`) aktör, IP, ekran ve hedef kayıt ID'si ile `AuditLog` zincirine yazılır.
- **Kabul Test Senaryosu**: `dispatch_staff` veya `read_only` rolündeki kullanıcı finansal ayarları veya alt kullanıcı yetkilerini değiştirmeye çalıştığında `403` almalı ve deneme loglanmalıdır.

#### `SINIF-15`: Otomatik Blokaj & Sistem Freni Mekanizması (`SystemBlockage`)
- **Sorumlu Rol**: Risk & Uyum Komitesi
- **Tanım**: Operasyonel, yasal veya finansal risk oluşturan hedef varlıkların (`courier | vehicle | cashier | business_account`) sistemi otomatik kilitlemesi.
- **Temel İş Kuralı**: Hiçbir blokaj sessizce kaldırılamaz; kimin kaldırdığı (`unlockedBy`), ne zaman kaldırdığı (`unlockedAt`) ve dayandığı resmi gerekçe (`unlockJustification`) sisteme mühürlenir. Aktif siparişi olan sürücü iş bitmeden bloklanamaz (`B8`).
- **Otomatik Blokaj Tetikleyicisi**: Onaysız KYC, süresi bitmiş sigorta/muayene, açık kasa farkı veya ağır güvenlik ihlali.
- **Mühürlü Audit Gereksinimi**: Blokaj açılış ve kaldırılış kayıtları `auditLogId` ile birbirine bağlanır.
- **Kabul Test Senaryosu**: Blokajlı (`isUnlocked == false`) bir aracın veya sürücünün çağrı eşleştirme havuzuna girmesi `%100` engellenmelidir.

#### `SINIF-16`: Değiştirilemez (`Append-Only`) Audit Log & Kriptografik Olay İzi (`AuditLogEntry`)
- **Sorumlu Rol**: İç Denetim & Teftiş Kurulu
- **Tanım**: Kritik hiçbir verinin silinemediği, her güncellemenin `previousValue`, `newValue`, `justification` ve `previousSealHash -> securitySealHash` zinciriyle saklandığı denetim kütüğü.
- **Temel İş Kuralı**: Sistemde iz bırakmayan hiçbir yönetici veya durum değişikliği işlemi yapılamaz; `DELETE` komutu veritabanı seviyesinde yasaktır (`A14`, `B3`).
- **Otomatik Blokaj Tetikleyicisi**: `AuditLog` tablosuna yazma hatası oluşması durumunda ana işlemin de otomatik `Rollback` edilmesi.
- **Mühürlü Audit Gereksinimi**: `id`, `timestamp`, `actorName`, `actorRole`, `screenName`, `actionType`, `recordId`, `previousValue`, `newValue`, `justification`, `previousSealHash`, `securitySealHash`.
- **Kabul Test Senaryosu**: Herhangi bir denetim kaydının metni veritabanında değiştirildiğinde `verifyAuditChain()` fonksiyonu `isValid: false` ve kırılan kaydın ID'sini döndürmelidir (`TEST-20`).

#### `SINIF-17`: 14 Maddelik Risk Kontrolü ve Mühürlü Gün Kapanışı (`DailyClosingAudit`)
- **Sorumlu Rol**: Genel Müdür & Operasyon Direktörü
- **Tanım**: Günün sonunda tüm araç, zimmet (`openZimmetCount`), kasa (`vaultDiscrepancy`), servis (`openWorkOrdersCount`) ve tebliğsiz ceza (`unservedPenaltiesCount`) kayıtlarının denetlenip şirket mührüyle dondurulması.
- **Temel İş Kuralı**: Açık zimmet, kasa farkı veya tebliğsiz ceza varken gün `"Temiz Kapanış (sealed_clean)"` olarak kapatılamaz; sistem otomatik olarak `risk_detected_blocked` durumuna geçer.
- **Otomatik Blokaj Tetikleyicisi**: `vaultDiscrepancy != 0` veya `unservedPenaltiesCount > 0` olması durumunda temiz kapanış blokajı.
- **Mühürlü Audit Gereksinimi**: Gün kapanış kontrol listesi (`auditChecklist`), kapanış zamanı (`sealedAt`), mühürleyen yönetici (`sealedBy`), `sealHash` ve varsa üst yönetici istisna gerekçesi (`executiveOverrideNote`).
- **Kabul Test Senaryosu**: Kasada `1.200 TL` açık varken "Günü Temiz Kapat" dendiğinde sistem işlemi bloke etmeli ve kırmızı risk kontrol listesini göstermelidir.

#### `SINIF-18`: Otomatik Test Senaryoları, İnvariant Denetimi ve Kabul Kriterleri
- **Sorumlu Rol**: Kalite Güvence (QA) & Yazılım Mimarisi Ekibi
- **Tanım**: Tüm iş kurallarının normal akış, sınır değer (`00:00` geçişi, `0 TL` komisyon, `300m` min mesafe), kötüye kullanım (IDOR, çift kabul, sahte koordinat) ve yetkisiz işlem testleriyle doğrulanması.
- **Temel İş Kuralı**: 20 M0 kabul senaryosundan (`TEST-01..20`) ve 71 mimari kontrolden (`A1..D10`) geçmeyen hiçbir modül canlıya alınamaz.
- **Otomatik Blokaj Tetikleyicisi**: CI/CD boru hattında tek bir invariant testinin dahi başarısız olması (`Regression Block`).
- **Mühürlü Audit Gereksinimi**: Test koşum zamanı, doğrulanan kontrol sayısı ve başarı raporu.
- **Kabul Test Senaryosu**: Kötü niyetli istemci negatif tutar veya geçersiz durum geçişi gönderdiğinde sunucu `%100` oranında işlemi reddetmelidir.

---

### G.2. Başlık Altı Zorunlu 4'lü Talimat Protokolü ve Güçlü Cümle Standardı (`TfksMasterSpec`)

Sistemdeki tüm modüller aşağıda tanımlanan **Zorunlu 4'lü Talimat Protokolü** ve **Zayıf İfade $\rightarrow$ Güçlü Talimat Dönüşümü** disiplinine tabidir:

| Modül / Akış Grubu | 1. BU BÖLÜMÜN AMACI | 2. NE YAPACAK | 3. NASIL YAPACAK (Sıralı Kontrol) | 4. ÇIKTI NE OLACAK | ✗ Zayıf İfade (Yasak) $\rightarrow$ ✓ Güçlü Talimat (Zorunlu Standart) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Müşteri & İşletme Çağrı ve Fiyatlama Motoru (`C-02..C-05`, `B-02..B-03`)** | Müşteri ve işletmelerin doğrulanan alış/varış noktaları arasında `%0` komisyonlu, bağlayıcı ve şeffaf taşıma çağrısı oluşturmasını sağlamak. | Alış/varış koordinatlarını Geofence ve `>= 300m` kuralıyla doğrulayacak, gerçek yol ağı mesafesini hesaplayacak ve 18 alanlı `TransactionFeeSnapshot` mührüyle çağrıyı başlatacak. | 1. Alış noktasını kullanıcıya doğrulatır.<br>2. Yol ağı rota motorundan km ve dakika alır.<br>3. Tarife tablosunu uygular, komisyonları `0.00 TL` kilitler.<br>4. `Idempotency-Key` ile `TransactionFeeSnapshot` ve `RideOrder` kaydını atomik yazar. | Bağlayıcı taşıma fiyatı (`₺`), 4 haneli `boardingCode` ve 18 alanlı değiştirilemez `TransactionFeeSnapshot`. | ✗ *"Kullanıcı konum seçer ve fiyat görür."*<br>✓ *"Kullanıcı alış pinini doğrular; sunucu yol ağı mesafesini hesaplayarak `%0` komisyonlu 18 alanlı `TransactionFeeSnapshot` kaydını SHA-256 ile mühürler ve 15 sn radar taramasını başlatır."* |
| **Sürücü / Kurye Saha Eşleşme ve PIN/PoD Motoru (`K-01..K-09`)** | KYC ve ekipman onaylı sürücünün çağrıyı atomik kilitle kabul etmesini, 4 haneli PIN ile başlatmasını ve kanıtlı (`PoD`) tamamlamasını sağlamak. | 15 sn teklif sunacak, `SELECT ... FOR UPDATE` ile tek sürücüye atayacak, 200m geofence + 4 haneli PIN olmadan seferi başlatmayacak ve PoD/teslim kodu ile kapatacak. | 1. `kycStatus == APPROVED` ve sigorta kontrolü yapar.<br>2. 15 sn teklifte `%100` net kazancı gösterir.<br>3. Alışta 200m geofence ve 4 haneli `boardingCode` doğrular.<br>4. Teslimatta `deliveryCode` / `PoD` fotoğrafı alıp `%100` kazanç kaydını işler. | Güvenli tamamlanmış sefer (`COMPLETED`), zaman damgalı teslimat kanıtı ve `%100` sürücü kazanç kaydı. | ✗ *"Kurye siparişi alır ve teslim eder."*<br>✓ *"Kurye 15 sn içinde teklifi atomik kilitle kabul eder; alış noktasında 200m geofence ve 4 haneli `boardingCode` doğrulamadan `IN_PROGRESS` durumuna geçemez; teslimatta `deliveryCode`/PoD mühürlenerek tutarın `%100`'ü sürücü kazanç tablosuna yazılır."* |
| **Tanışma Kampanyası ve İşletme Haftalık Üyelik Motoru (`B-01..B-06`, `A-03`)** | Esnafın ücretsiz tanışma dönemini (`FREE_INTRO`) ve dönem sonu Havale/EFT + Admin `MANUAL_APPROVAL` tabanlı haftalık sabit üyeliğini şeffafça yönetmek. | `ücretsiz_mi` formülünü `Europe/Istanbul` saatine göre çalıştıracak, kampanya çakışmalarını (`KURAL-01..06`) önleyecek, 3 gün `GRACE_PERIOD` tanıyacak ve `LIMITED_ACCESS` durumunda verileri koruyup bireysel gönderiyi açık tutacak. | 1. `effectiveIntroEndDate = personal ?? campaign` hesaplar.<br>2. Süre bitiminde otomatik çekim yapmadan `PLAN_SELECTION_REQUIRED` açar.<br>3. Dekont bildirimini `PAYMENT_PENDING`'e alır.<br>4. Admin `MANUAL_APPROVAL` onayıyla 7 günlük `ACTIVE_MEMBERSHIP` başlatır. | Kesintisiz esnaf operasyonu, `%0` sipariş komisyonu, veri silinmeme garantisi ve denetlenebilir üyelik geçişleri. | ✗ *"İşletme ücretsiz süre bitince haftalık ücret öder."*<br>✓ *"İşletmenin `effectiveIntroEndDate` süresi `00:00`'da dolduğunda otomatik kart çekimi yapılmaz; yoldaki aktif işler korunur, işletme Havale/EFT dekontu yükleyip Admin `MANUAL_APPROVAL` onayıyla 7 günlük `ACTIVE_MEMBERSHIP` başlatır veya `LIMITED_ACCESS` modunda verileri silinmeden `INDIVIDUAL_DELIVERY` ile devam eder."* |
| **Admin Komuta, Filo Yönetişimi ve 71/71 Denetim Üssü (`A-01..A-06`)** | Filo, zimmet, kasa, ceza, hasar, servis, ACL ve kriptografik denetim zincirinin tek merkezden kurallı ve çift onaylı yönetilmesini sağlamak. | Canlı harita telemetrisini akıtacak, KYC/havale onaylarını gerekçeli işleyecek, aktif işi olan kuryeyi bloklamayacak (`B8`) ve gün sonu 14 risk kriterini denetleyerek mühürleyecek. | 1. Her kritik işlemde yönetici gerekçesi (`min 10 krk`) ve `@Version` kontrol eder.<br>2. Eski/yeni değeri `append-only` `AuditLog` zincirine yazar.<br>3. Gün sonunda açık zimmet/kasa/ceza risklerini tarar.<br>4. `verifyAuditChain()` ile tüm SHA-256 halkalarını doğrular. | Kırılmaz denetim izi (`AuditLog`), sıfır yetki sızıntısı ve mühürlü gün kapanış raporu (`DailyClosingAudit`). | ✗ *"Admin panelden kuryeleri, kampanyaları ve kasaları yönetir."*<br>✓ *"Admin her kampanya, havale onayı, kasa transferi ve blokaj işleminde zorunlu gerekçe girer; sistem `@Version` kilidiyle çakışmayı önler, aktif siparişi olan kuryenin bloklanmasını (`B8`) reddeder ve işlemi `previousSealHash -> securitySealHash` zinciriyle `append-only` denetim tablosuna mühürler."* |


---

## BÖLÜM H: MASTER İÇERİK KİTABI — CİLT 3: 42 EKRANLIK MASTER WIREFRAME KATALOĞU (`C-01..15`, `K-01..15`, `B-01..06`, `A-01..06`), 18 ADMIN SEKMESİ VE 6 GÖRÜNÜMÜN TAM BİLEŞEN HARİTASI

> [!IMPORTANT]
> Önceki özet sürümlerde yalnızca 22 akıştan (`FLOW-01..22`) bahsedilmiş, ancak kod tabanında ve UX şartnamesinde yer alan **15 Müşteri Ekranı (`C-01`–`C-15`)**, **15 Sürücü/Kurye Ekranı (`K-01`–`K-15`)**, **6 İşletme Ekranı (`B-01`–`B-06`)**, **6 Admin Denetim Ekranı (`A-01`–`A-06`)**, **18 Admin Komuta Merkezi Sekmesi**, **5 İşletme Portalı Sekmesi** ve **7 Kurumsal Web Görünümü** tek tek alan/buton/validasyon düzeyinde listelenmemişti. Bu bölümde **toplam 42 ekran şeması** ve tüm portal sekmeleri hiçbir ekran atlanmadan tek tek tanımlanmıştır.

---

### H.1. Müşteri Süper-App 15 Ekran Şeması (`C-01` – `C-15`)

#### `C-01`: Telefon + 6 Haneli OTP Doğrulama ve KVKK/Açık Rıza Ekranı
- **Ekran Kodu & Dosya**: `C-01` (`C01_OtpVerificationScreen.tsx`) | **Bağlı Akış**: `FLOW-01` | **Bağlı Kontroller**: `A1`, `B1`, `C1`, `C14`
- **Ekran Özeti**: Kullanıcının `+90 5XX XXX XX XX` telefon numarası, KVKK aydınlatma metni onayı ve 6 haneli SMS OTP kodu ile güvenli oturum açtığı ilk giriş ekranı.
- **Zorunlu Form Alanları ve Veri Tipleri**:
  - `phoneNumber` (`string`, maskeli `+90 (5__) ___ __ __`, zorunlu)
  - `otpCode` (`string`, 6 haneli nümerik kutu, `inputMode="numeric"`, `autoComplete="one-time-code"`)
  - `kvkkConsent` (`boolean`, zorunlu onay kutusu — işaretlenmeden OTP gönderilemez)
  - `countdownSeconds` (`number`, 120 sn geri sayım sayacı)
- **Butonlar, Komutlar ve API Tetikleyicileri**:
  - `[Doğrulama Kodu Gönder]` $\rightarrow$ `POST /api/v1/auth/otp/request` (`Rate-Limit`: 15 dk / 5 istek)
  - `[Kodu Doğrula ve Giriş Yap]` $\rightarrow$ `POST /api/v1/auth/otp/verify` (Başarılıysa `HttpOnly` Refresh + Access JWT üretir)
  - `[Kodu Yeniden Gönder]` $\rightarrow$ Yalnızca `countdownSeconds == 0` olduğunda aktifleşir.
- **Validasyon ve Hata Durumları**:
  - Eksik/hatalı telefon formatında: `"Lütfen 10 haneli geçerli bir cep telefonu numarası giriniz."`
  - 5 hatalı OTP denemesinde: `"Güvenliğiniz için giriş denemesi 15 dakika süreyle kilitlenmiştir (429 TOO_MANY_ATTEMPTS)."`

#### `C-02`: Müşteri Ana Sayfa, Tanışma Kampanyası Banner'ı ve 3 Aktif Hizmet Seçimi
- **Ekran Kodu & Dosya**: `C-02` (`C02_HomeLocationScreen.tsx`) | **Bağlı Akış**: `FLOW-02` | **Bağlı Kontroller**: `A13`, `B15`, `C3`, `C4`, `C18`
- **Ekran Özeti**: Canlı konum pini, aktif ücretsiz tanışma kampanyası (`FREE_INTRO`) bilgi kartı ve yalnızca 3 aktif M0 hizmetinin (`TAXI_RIDE`, `INDIVIDUAL_DELIVERY`, `BUSINESS_DELIVERY`) seçildiği ana merkez.
- **Görsel Bileşenler ve Veri Alanları**:
  - `IntroCampaignBanner`: `campaignTitle`, `effectiveIntroEndDate`, `remainingDays`, `"M0 %0 Komisyon Garantisi"` rozeti
  - `ActiveServiceGrid`:
    1. `Taksi Çağır (TAXI_RIDE)` — Yolcudan ve şoförden `%0` komisyon
    2. `Bireysel Kurye Çağır (INDIVIDUAL_DELIVERY)` — Göndericiden ve kuryeden `%0` komisyon
    3. `İşletme / Esnaf Siparişi (BUSINESS_DELIVERY)` — Müşteriden ve kuryeden `%0` komisyon
  - `AddressShortcutChips`: `Ev`, `İş`, `Son Seçilen Konumlar`
- **Mimari Koruma Kuralı**: Bu ekranda `MOTO_PASSENGER_RIDE` kartı **kesinlikle yer almaz** (`AUD-01`).

#### `C-03`: Harita Üzerinde Alış / Varış Noktası ve Geofence Doğrulama Ekranı
- **Ekran Kodu & Dosya**: `C-03` (`C03_DestinationSearchScreen.tsx`) | **Bağlı Akış**: `FLOW-02`, `FLOW-04` | **Bağlı Kontroller**: `A15`, `B17`, `C5`, `D3`
- **Ekran Özeti**: Otomatik tamamlamalı adres arama, harita pini sürükleme, bina/kapı no girişi ve alış-varış mesafesi (`>= 300m`) doğrulaması.
- **Zorunlu Alanlar**:
  - `pickupCoord` (`{lat, lng, addressText, buildingNo, floorDoor}`)
  - `dropoffCoord` (`{lat, lng, addressText, recipientNote}`)
  - `routePolyline` (Gerçek yol ağı poligonu, kuş uçuşu çizgi yasaktır — `B18`)
- **Validasyon ve Blokajlar**:
  - `distanceMeters < 300` ise: `[Devam Et]` butonu kilitlenir, `"Alış ve varış noktası arası en az 300 metre olmalıdır (422 ROUTE_TOO_SHORT)."` uyarısı gösterilir.
  - Aktif hizmet bölgesi (`Geofence`) dışı koordinatta: `"Seçilen nokta şu an aktif hizmet bölgemiz dışındadır (422 OUT_OF_SERVICE_AREA)."`

#### `C-04`: Taksi / Kurye Araç Sınıfı ve Şeffaf Fiyat Önizleme (`%0` Komisyon Rozetli)
- **Ekran Kodu & Dosya**: `C-04` (`C04_VehicleSelectionScreen.tsx`) | **Bağlı Akış**: `FLOW-02`, `FLOW-04` | **Bağlı Kontroller**: `A8`, `B10`, `B18`, `C12`, `D9`
- **Ekran Özeti**: Gerçek yol ağı mesafesine (`km`) ve tahmini süreye (`dk`) göre hesaplanan bağlayıcı taşıma ücretinin ve `%0` komisyon kırılımının (`TransactionFeeSnapshot` önizlemesi) sunulduğu ekran.
- **Gösterilen Zorunlu Kırılım Alanları**:
  - `vehicleClass`: Taksi (`Sarı Taksi`, `Turkuaz Taksi`, `VIP/Geniş Taksi`) veya Kurye (`Moto Kurye`, `Araçlı Kurye`)
  - `estimatedDistanceKm` (`tabular-nums`, örn. `6.4 km`) ve `estimatedDurationMin` (`18 dk`)
  - `grossTransactionAmount` (`₺`), `customerCommissionFee: 0.00 ₺ (%0)`, `providerCommissionFee: 0.00 ₺ (%0)`, `driverNetPayout: %100`
- **Butonlar**:
  - `[Ücreti Onayla ve Devam Et]` $\rightarrow$ Fiyat teklifini (`quoteId`, 180 sn geçerli) kilitler.

#### `C-05`: Gönderi Paketi Detayı, Alıcı Doğrulama ve Ödeme/Çağrı Onay Ekranı
- **Ekran Kodu & Dosya**: `C-05` (`C05_PackageDetailsScreen.tsx`) | **Bağlı Akış**: `FLOW-04` | **Bağlı Kontroller**: `A4`, `A7`, `B2`, `B10`, `D4`
- **Ekran Özeti**: Bireysel kurye gönderilerinde paket içeriği, ağırlık limiti, kırılabilirlik durumu, alıcı telefon numarası ve tehlikeli/yasaklı madde taahhüdünün alındığı ekran.
- **Zorunlu Form Alanları**:
  - `packageCategory`: `'EVRAK' | 'GIDA' | 'TEKSTIL' | 'ELEKTRONIK' | 'DIGER'`
  - `weightBracket`: `'0_2_KG' | '2_5_KG' | '5_15_KG' | '15_30_KG'` (Moto kurye için `> 15 kg` seçilirse otomatik `Araçlı Kurye` sınıfına yönlendirir)
  - `isFragile` (`boolean`), `recipientFullName` (`string`), `recipientPhone` (`string`)
  - `prohibitedItemsDeclaration` (`boolean`, zorunlu onay: *"Paketimde yanıcı, patlayıcı, nakit para/altın veya yasa dışı madde bulunmadığını beyan ederim."*)
- **Butonlar**:
  - `[Çağrıyı Başlat]` (`Idempotency-Key` başlığı ve `isSubmitting` kilidiyle `POST /api/v1/orders` çağrısını tetikler)

#### `C-06`: Canlı Kurye / Taksi Radar Eşleşme ve 15 Saniye Teklif Arama Ekranı
- **Ekran Kodu & Dosya**: `C-06` (`C06_CourierMatchingScreen.tsx`) | **Bağlı Akış**: `FLOW-02`, `FLOW-04` | **Bağlı Kontroller**: `A3`, `A9`, `C9`, `D2`
- **Ekran Özeti**: `SEARCHING` durumundaki çağrının çevredeki uygun sürücülere 15'er saniyelik halkalar halinde teklif edildiği, gerçek zamanlı radar ve iptal kuralları ekranı.
- **Görsel Bileşenler**:
  - Canlı daralan/genişleyen radar halkası, taranan uygun sürücü sayısı, `TransactionFeeSnapshot` özet şeridi
  - `[Çağrıyı Ücretsiz İptal Et]` (`status == 'SEARCHING'` iken cezasız iptal)
- **Zaman Aşımı Kuralı**: 90 saniye sonunda eşleşme olmazsa `EXPIRED` durumuna geçer; `[Tekrar Dene]` ve `[Yakın Bölgeyi Genişlet]` aksiyonlarını sunar.

#### `C-07`: Canlı Harita Takibi, Sürücü Kartı ve 4 Haneli Biniş/Teslim PIN Ekranı
- **Ekran Kodu & Dosya**: `C-07` (`C07_LiveTrackingScreen.tsx`) | **Bağlı Akış**: `FLOW-03`, `FLOW-05`, `FLOW-22` | **Bağlı Kontroller**: `A9`, `B7`, `B12`, `C12`
- **Ekran Özeti**: Sürücü `ACCEPTED`, `ARRIVED` ve `IN_PROGRESS` aşamalarındayken canlı konumunun, plakasının, 4 haneli güvenlik PIN kodunun (`boardingCode` / `deliveryCode`) ve acil durum (`SOS`) butonunun gösterildiği ekran.
- **Zorunlu Bileşenler**:
  - `DriverVerifiedCard`: Sürücü adı, fotoğrafı, araç plakası (`tabular-nums`), araç modeli, puanı
  - `SecurityPinBadge`: 4 haneli `boardingCode` (Taksi binişinde şoföre söylenir) ve `deliveryCode` (Paket tesliminde alıcı tarafından kuryeye söylenir)
  - `[Maskeli Ara (0850...)]`, `[Uygulama İçi Mesaj]`, `[SOS / Acil Güvenlik Masası]` (`FLOW-22`)

#### `C-08`: Maskeli Uygulama İçi Sohbet ve Numara Gizliliği (`0850` Köprü) Ekranı
- **Ekran Kodu & Dosya**: `C-08` (`C08_InAppChatScreen.tsx`) | **Bağlı Akış**: `FLOW-03`, `FLOW-05` | **Bağlı Kontroller**: `A2`, `B6`, `B12`, `C10`
- **Ekran Özeti**: Müşteri ile sürücü/kuryenin birbirlerinin gerçek cep telefonu numaralarını (`+90 5XX...`) görmeden hazır hızlı mesajlarla veya metinle haberleştiği ekran.
- **Güvenlik ve Gizlilik Kuralları**:
  - Mesaj içeriklerinde telefon numarası veya IBAN paylaşımı regex filtresiyle maskelenir (`***`).
  - Sefer `COMPLETED` veya `CANCELLED` olduktan 15 dakika sonra sohbet kanalı salt-okunur (`read-only`) hale gelir ve arşivlenir.

#### `C-09`: Teslimat / Yolculuk Tamamlandı, PoD Kanıtı, `%0` Komisyon Makbuzu ve Puanlama
- **Ekran Kodu & Dosya**: `C-09` (`C09_DeliveryCompletedScreen.tsx`) | **Bağlı Akış**: `FLOW-03`, `FLOW-05` | **Bağlı Kontroller**: `A8`, `B7`, `B10`, `C12`
- **Ekran Özeti**: Tamamlanan yolculuk veya teslimatın zaman damgalı kanıt fotoğrafını (`PoD`), 18 alanlı `TransactionFeeSnapshot` şeffaf makbuzunu ve 1–5 yıldız değerlendirme formunu gösteren ekran.
- **Zorunlu Makbuz Satırları**:
  - `Toplam Taşıma Ücreti`: `₺...`
  - `Müşteri Platform Komisyonu`: `0.00 ₺ (%0)`
  - `Sürücü / Kurye Kesintisi`: `0.00 ₺ (%0)`
  - `Sürücüye Aktarılan Net Kazanç`: `%100`
  - `SHA-256 Snapshot Mührü`: `0x9f8a...`

#### `C-10`: Müşteri Geçmiş Yolculuklar, Gönderiler ve İndirilebilir Makbuz Arşivi
- **Ekran Kodu & Dosya**: `C-10` (`C10_OrderHistoryScreen.tsx`) | **Bağlı Akış**: `FLOW-03`, `FLOW-05` | **Bağlı Kontroller**: `C9`, `C11`, `C12`
- **Ekran Özeti**: Tüm geçmiş `TAXI_RIDE`, `INDIVIDUAL_DELIVERY` ve `BUSINESS_DELIVERY` işlemlerinin tarih, durum, tutar ve `%0` komisyon makbuzlarıyla filtrelenebilir listesi.
- **Aksiyonlar**: `[Makbuzu Görüntüle / PDF İndir]`, `[Aynı Rotada Tekrar Çağır]`, `[Bu İşlem İçin Destek / İtiraz Aç]`.

#### `C-11`: Müşteri Ödeme Yöntemleri, Bakiye ve İade/Provizyon Takip Ekranı
- **Ekran Kodu & Dosya**: `C-11` (`C11_WalletPaymentScreen.tsx`) | **Bağlı Akış**: `FLOW-02`, `FLOW-04` | **Bağlı Kontroller**: `A8`, `B9`, `B10`
- **Ekran Özeti**: Nakit ödeme, araç içi POS veya PCI-DSS uyumlu tokenleştirilmiş kart tercihlerinin yönetildiği, iptal edilen çağrıların iade/provizyon durumlarının izlendiği ekran.
- **Güvenlik Kuralı**: Ham kart numarası (`PAN`) ve `CVV` uygulama belleğinde veya veritabanında **asla** tutulmaz; yalnızca ödeme kuruluşu token'ı (`cardToken`, `maskedPan: '**** **** **** 4242'`) gösterilir.

#### `C-12`: Kayıtlı Adreslerim, Geofence Uygunluk Rozeti ve Konum Rehberi
- **Ekran Kodu & Dosya**: `C-12` (`C12_SavedAddressesScreen.tsx`) | **Bağlı Akış**: `FLOW-02`, `FLOW-04` | **Bağlı Kontroller**: `A15`, `B17`, `C5`
- **Ekran Özeti**: Ev, İş, Depo ve sık kullanılan alıcı adreslerinin koordinat, bina/kat/daire, kapı zili notu ve Geofence uygunluk durumuyla kaydedildiği ekran.

#### `C-13`: Bildirim Merkezi, Kampanya Duyuruları ve Güvenlik Uyarıları
- **Ekran Kodu & Dosya**: `C-13` (`C13_NotificationsScreen.tsx`) | **Bağlı Akış**: `FLOW-01`–`FLOW-05` | **Bağlı Kontroller**: `C9`, `C12`
- **Ekran Özeti**: Sürücü varış bildirimleri, PIN hatırlatmaları, tanışma kampanyası (`FREE_INTRO`) kalan gün bildirimleri ve destek talebi yanıtlarının kronolojik merkezi.

#### `C-14`: Müşteri Profil, KVKK Veri Taşınabilirliği ve Hesap Güvenliği Ayarları
- **Ekran Kodu & Dosya**: `C-14` (`C14_ProfileSettingsScreen.tsx`) | **Bağlı Akış**: `FLOW-01` | **Bağlı Kontroller**: `A2`, `B6`, `C14`
- **Ekran Özeti**: Ad-soyad, kurumsal fatura bilgileri, acil durum kişisi (`emergencyContact`), açık oturumları sonlandırma ve KVKK kapsamında kişisel verileri dışa aktarma ekranı.

#### `C-15`: Yardım, Kanıtlı İtiraz (`Dispute`) Açma ve Acil Güvenlik (`SOS`) Merkezi
- **Ekran Kodu & Dosya**: `C-15` (`C15_SupportCenterScreen.tsx`) | **Bağlı Akış**: `FLOW-22` | **Bağlı Kontroller**: `A14`, `B7`, `C10`
- **Ekran Özeti**: Sefer/teslimat bazlı itiraz oluşturma, fotoğraflı kanıt yükleme, eşya kaybı bildirimi ve tek dokunuşla `112` + Admin Güvenlik Masası (`SOS`) tetikleme ekranı.

---

### H.2. Sürücü / Kurye Süper-App 15 Ekran Şeması (`K-01` – `K-15`)

#### `K-01`: Sürücü / Kurye Başvuru, 6 Evraklı KYC Yükleme ve Durum Takip Ekranı
- **Ekran Kodu & Dosya**: `K-01` (`K01_CourierOnboardingScreen.tsx`) | **Bağlı Akış**: `FLOW-06` | **Bağlı Kontroller**: `A6`, `A16`, `B14`, `D6`
- **Ekran Özeti**: Şoför ve kuryelerin 6 zorunlu belgeyi (`Kimlik`, `Ehliyet`, `Adli Sicil`, `Ruhsat`, `Zorunlu Trafik Sigortası`, `Mesleki Belge/Vergi Levhası`) son geçerlilik tarihleriyle yüklediği ve `PENDING -> APPROVED | REJECTED` durumunu izlediği ekran.
- **Kural**: `kycStatus !== 'APPROVED'` iken `Çevrim İçi Ol` anahtarı donanımsal/yazılımsal olarak kilitlidir (`403 KYC_NOT_APPROVED`).

#### `K-02`: Sürücü Vardiya Açılış, Zimmetli Araç Seçimi ve Çevrim İçi Radar Ekranı
- **Ekran Kodu & Dosya**: `K-02` (`K02_ActiveShiftHomeScreen.tsx`) | **Bağlı Akış**: `FLOW-06`, `FLOW-07`, `FLOW-19` | **Bağlı Kontroller**: `A6`, `B13`, `B14`, `D6`
- **Ekran Özeti**: Aktif zimmetli aracın plakası, kalan sigorta/muayene gün sayısı, canlı GPS sinyal durumu (`connected`), günlük `%100` net kazanç sayacı ve `Çevrim İçi / Mola / Çevrim Dışı` vardiya anahtarının bulunduğu ana saha ekranı.

#### `K-03`: 15 Saniye Geri Sayımlı Yeni Çağrı Teklif Kartı (`%100` Net Kazanç Gösterimli)
- **Ekran Kodu & Dosya**: `K-03` (`K03_IncomingOrderModal.tsx`) | **Bağlı Akış**: `FLOW-07` | **Bağlı Kontroller**: `A3`, `A8`, `B10`, `C4`, `D2`
- **Ekran Özeti**: Gelen `TAXI_RIDE`, `INDIVIDUAL_DELIVERY` veya `BUSINESS_DELIVERY` çağrısının alış/varış mesafesini, paket ağırlığını ve **`%0` komisyonlu `%100` net sürücü kazancını** büyük `tabular-nums` fontla gösteren 15 saniyelik tam ekran teklif kartı.
- **Butonlar**:
  - `[Çağrıyı Kabul Et (₺... Net)]` $\rightarrow$ `POST /api/v1/orders/:id/accept` (`SELECT ... FOR UPDATE` atomik kilit)
  - `[Pas Geç]` $\rightarrow$ Çağrıyı bir sonraki uygun sürücüye devreder.

#### `K-04`: Alış Noktasına (`Pickup`) Canlı Rota, Trafik ve Müşteri/Esnaf İletişim Ekranı
- **Ekran Kodu & Dosya**: `K-04` (`K04_PickupNavigationScreen.tsx`) | **Bağlı Akış**: `FLOW-08` | **Bağlı Kontroller**: `A9`, `B12`, `B18`, `C12`
- **Ekran Özeti**: Sürücüyü alış noktasına götüren adım adım navigasyon, kalan mesafe/dakika, maskeli arama (`0850`) ve alış noktasına 200m yaklaşıldığında aktifleşen `[Alış Noktasına Vardım (ARRIVED)]` butonu.

#### `K-05`: Alış Doğrulama: 4 Haneli `boardingCode` Girişi ve Paket Teslim Alma Kontrolü
- **Ekran Kodu & Dosya**: `K-05` (`K05_PackageVerificationScreen.tsx`) | **Bağlı Akış**: `FLOW-08`, `FLOW-13` | **Bağlı Kontroller**: `A9`, `B7`, `C5`, `D7`
- **Ekran Özeti**: Taksi binişinde müşteriden alınan 4 haneli `boardingCode` PIN'inin veya kurye teslimatında esnaf/göndericiden alınan paket barkodu + paket durum fotoğrafının doğrulandığı ekran.
- **Kural**: Doğru 4 haneli kod girilmeden durum **asla** `IN_PROGRESS` olamaz (`422 INVALID_PIN`).

#### `K-06`: Varış Noktasına (`Dropoff`) Aktif Sefer Navigasyonu ve Canlı Telemetri Ekranı
- **Ekran Kodu & Dosya**: `K-06` (`K06_DropoffNavigationScreen.tsx`) | **Bağlı Akış**: `FLOW-08` | **Bağlı Kontroller**: `A9`, `B18`, `C12`
- **Ekran Özeti**: `IN_PROGRESS` durumundaki yolculuk/teslimatın varış noktasına rotası, alıcı teslimat notu, bina/kat/kapı bilgisi ve canlı hız/telemetri şeridi.

#### `K-07`: Teslimat Kanıtı (`PoD`): 4 Haneli `deliveryCode` ve Kamera Fotoğraf Onay Ekranı
- **Ekran Kodu & Dosya**: `K-07` (`K07_ProofOfDeliveryScreen.tsx`) | **Bağlı Akış**: `FLOW-08` | **Bağlı Kontroller**: `A9`, `B7`, `D7`
- **Ekran Özeti**: Teslimatın tamamlanması (`COMPLETED`) için alıcıdan alınan 4 haneli `deliveryCode` PIN'inin ve/veya zaman-konum damgalı teslimat fotoğrafının (`podPhotoUrl`) yüklendiği zorunlu ekran.

#### `K-08`: Sürücü Günlük / Haftalık `%100` Net Kazanç ve `%0` Kesinti Muhasebe Özeti
- **Ekran Kodu & Dosya**: `K-08` (`K08_EarningsSummaryScreen.tsx`) | **Bağlı Akış**: `FLOW-09` | **Bağlı Kontroller**: `A8`, `B9`, `B10`, `C12`, `D9`
- **Ekran Özeti**: Tamamlanan her işin brüt ücreti, **`0.00 ₺ (%0)` platform komisyonu** ve **`%100` sürücü net kazancı** olarak satır satır listelendiği şeffaf gelir tablosu.

#### `K-09`: Kazanç Çekim (`Payout`), IBAN Doğrulama ve Kasa/Cari Mutabakat Ekranı
- **Ekran Kodu & Dosya**: `K-09` (`K09_WalletWithdrawScreen.tsx`) | **Bağlı Akış**: `FLOW-09` | **Bağlı Kontroller**: `A8`, `B9`, `B16`
- **Ekran Özeti**: Sürücünün biriken net hakedişini doğrulanan kendi IBAN'ına aktarma talebi oluşturduğu ve varsa tebliğ edilmiş/onaylanmış resmi ceza mahsuplarını kanıt evrakıyla gördüğü ekran.

#### `K-10`: Sürücü Görev Geçmişi, Rota İstatistikleri ve `TransactionFeeSnapshot` İnceleme
- **Ekran Kodu & Dosya**: `K-10` (`K10_DeliveryHistoryScreen.tsx`) | **Bağlı Akış**: `FLOW-09` | **Bağlı Kontroller**: `A8`, `C9`, `C11`
- **Ekran Özeti**: Sürücünün tamamladığı veya iptal edilen tüm seferlerin mesafe, süre, PIN doğrulama saati ve SHA-256 ücret mührüyle listelendiği arşiv ekranı.

#### `K-11`: Vardiya Planlama, Bölge Yoğunluk Haritası ve Dinamik Görev (`DriverQuest`) Ekranı
- **Ekran Kodu & Dosya**: `K-11` (`K11_ShiftScheduleScreen.tsx`) | **Bağlı Akış**: `FLOW-06`, `FLOW-19` | **Bağlı Kontroller**: `B13`, `C9`
- **Ekran Özeti**: Sürücünün haftalık çalışma saatlerini planladığı, saatlik talep yoğunluk tahminlerini ve platformun sunduğu ek ödül hedeflerini (`DriverQuest`) takip ettiği ekran.

#### `K-12`: Araç Zimmet Teslim Alma/Etme, 4 Yönlü Fotoğraf ve Ekipman Kontrol (`Checklist`) Ekranı
- **Ekran Kodu & Dosya**: `K-12` (`K12_VehicleEquipmentScreen.tsx`) | **Bağlı Akış**: `FLOW-19`, `FLOW-20` | **Bağlı Kontroller**: `A11`, `B13`, `B14`, `B16`
- **Ekran Özeti**: `SINIF-03`, `SINIF-07` ve `SINIF-09` kapsamında aracın başlangıç/bitiş kilometresi, yakıt seviyesi, 4 yönlü hasar tespit fotoğrafı, kask/termal çanta kontrolü ve sürücüye tebliğ edilen trafik cezalarının (`acknowledgedByCourier`) okunup yanıtlandığı ekran.

#### `K-13`: Sürücü Bildirimleri, Belge Yenileme Uyarıları ve Ceza Tebliğ Kutusu
- **Ekran Kodu & Dosya**: `K-13` (`K13_NotificationsScreen.tsx`) | **Bağlı Akış**: `FLOW-06`, `FLOW-20` | **Bağlı Kontroller**: `A10`, `B14`, `B16`
- **Ekran Özeti**: Sigorta/muayene bitişine 15 gün kala gönderilen uyarılar, yeni tebliğ edilen trafik cezaları ve operasyon duyurularının gösterildiği ekran.

#### `K-14`: Sürücü Profil, Belgelerim, Çalışma Bölgesi ve Hesap Ayarları
- **Ekran Kodu & Dosya**: `K-14` (`K14_ProfileSettingsScreen.tsx`) | **Bağlı Akış**: `FLOW-06` | **Bağlı Kontroller**: `A6`, `B14`, `C14`
- **Ekran Özeti**: Sürücünün yüklü KYC belgelerinin geçerlilik tarihlerini gördüğü, yenilenen poliçesini yüklediği ve bildirim/navigasyon tercihlerini yönettiği ekran.

#### `K-15`: Saha Acil Durum (`SOS`), Kaza/Hasar Bildirimi ve Alıcıya Ulaşılamadı Protokol Ekranı
- **Ekran Kodu & Dosya**: `K-15` (`K15_EmergencySupportScreen.tsx`) | **Bağlı Akış**: `FLOW-08`, `FLOW-20`, `FLOW-22` | **Bağlı Kontroller**: `A9`, `A14`, `B7`
- **Ekran Özeti**: Kaza anında `DamageReport` (`SINIF-09`) fotoğraf yükleme, alıcıya ulaşılamadığında 10 dk bekleme sayacı + 3 maskeli arama kanıtıyla `RETURN_IN_PROGRESS` başlatma ve tek tuşla `SOS` güvenlik alarmı gönderme ekranı.

---

### H.3. İşletme / Esnaf Portalı 6 Ekran Şeması (`B-01` – `B-06`) ve 5 Operasyon Sekmesi

#### `B-01`: İşletme Kayıt, Vergi/MERSİS Doğrulama ve Tanışma Kampanyası (`FREE_INTRO`) Aktivasyon Ekranı
- **Ekran Kodu**: `B-01` | **Bağlı Akış**: `FLOW-10` | **Bağlı Kontroller**: `A1`, `A13`, `B15`, `D10`
- **Zorunlu Alanlar**: `companyLegalName`, `taxOffice`, `taxNumber` (10/11 hane VKN/TCKN), `mersisNo`, `pickupAddress`, `pickupCoord`, `authorizedPersonPhone`.
- **Çıktı**: Onay sonrası işletmeye otomatik `FREE_INTRO` statüsü tanımlanır ve kalan ücretsiz gün sayacı başlatılır.

#### `B-02`: Çoklu Teslimat Çağrısı Oluşturma, Paket Hazırlık Süresi ve Maliyet Önizleme Ekranı
- **Ekran Kodu**: `B-02` | **Bağlı Akış**: `FLOW-12` | **Bağlı Kontroller**: `A4`, `A7`, `A8`, `B10`, `B18`
- **Zorunlu Alanlar**: Alıcı adresi, alıcı telefonu, paket ağırlığı, hazırlık süresi (`Hemen Hazır | 10 dk | 20 dk`), kuryeye ödenecek net taşıma ücreti (`%0` platform sipariş komisyonu).

#### `B-03`: Canlı Saha Kurye Takibi, Paket Teslim PIN/Barkod Onayı ve Teslimat Kanıtı (`PoD`) Panosu
- **Ekran Kodu**: `B-03` | **Bağlı Akış**: `FLOW-13` | **Bağlı Kontroller**: `A9`, `B7`, `C12`
- **Özellikler**: Hazırlanan siparişlerin kuryeye tesliminde okutulan barkod/PIN onayı, yoldaki kuryelerin tek haritada canlı izlenmesi ve teslim edilen siparişlerin `PoD` fotoğraflarının görüntülenmesi.

#### `B-04`: Ücretsiz Tanışma Sayacı, Haftalık Sabit Üyelik Seçimi ve Havale/EFT Dekont Bildirim Ekranı
- **Ekran Kodu**: `B-04` | **Bağlı Akış**: `FLOW-11`, `FLOW-14`, `FLOW-15` | **Bağlı Kontroller**: `A12`, `A13`, `B5`, `B15`, `D8`, `D10`
- **Zorunlu Bileşenler**:
  - `IntroCountdownCard`: `effectiveIntroEndDate`, kalan gün/saat, `"Süre bitiminde otomatik kart çekimi yapılmaz"` güvence metni
  - `WeeklyPlanSelector`: Haftalık Sabit Esnaf Paketi (`weeklyPriceTl`, `%0` sipariş komisyonu)
  - `BankWireSubmissionForm`: Şirket IBAN bilgisi, `transferReferenceCode` (Havale açıklama kodu), `receiptFileUrl` (Dekont PDF/Görsel yükleme), `senderAccountName`, `[Havale/EFT Ödeme Bildirimi Gönder]` (`status -> PAYMENT_PENDING`)

#### `B-05`: `LIMITED_ACCESS` (Kısıtlı Mod) Bilgilendirme, Bireysel Kurye Köprüsü ve Arşiv Erişimi
- **Ekran Kodu**: `B-05` | **Bağlı Akış**: `FLOW-15` | **Bağlı Kontroller**: `A12`, `B15`, `C10`, `D8`
- **Kural**: `GRACE_PERIOD` sonunda ödeme yapılmazsa işletme verileri **asla silinmez**; geçmiş sipariş ve fatura arşivi `%100` açık kalır, toplu işletme özellikleri duraklar ancak işletme `[Bireysel Kurye Çağır]` veya `[Haftalık Üyeliği Şimdi Başlat]` seçenekleriyle kesintisiz devam edebilir.

#### `B-06`: İşletme Alt Kullanıcı (`SubUser`) Rol Matrisi, Şube Yönetimi ve Muhasebe Ekstresi
- **Ekran Kodu**: `B-06` | **Bağlı Akış**: `FLOW-10`, `FLOW-14` | **Bağlı Kontroller**: `A2`, `B6`, `C11`
- **Özellikler**: `owner`, `branch_manager`, `dispatch_staff`, `accountant`, `read_only` alt kullanıcılarının yetkilendirilmesi (`Tenant Guard` ile diğer işletmelerden `%100` izole).

---

### H.4. Admin Komuta Merkezi 6 Denetim Şeması (`A-01` – `A-06`) ve 18 Operasyonel Sekme

#### `A-01`: Gerçek Zamanlı Filo, Aktif Çağrı ve Telemetri Komuta Haritası
- **Ekran Kodu**: `A-01` | **Bağlı Akış**: `FLOW-16` | **Bağlı Kontroller**: `A2`, `A9`, `B18`, `C12`
- **Kapsam**: Aktif `TAXI_RIDE`, `INDIVIDUAL_DELIVERY`, `BUSINESS_DELIVERY` çağrıları, `STALE_LOCATION` (`>90 sn` GPS kesintisi) uyarıları ve `ECU/OBD` arıza alarmları.

#### `A-02`: Sürücü / Kurye 6 Evraklı KYC Doğrulama, Zimmet ve Ekipman Onay Masası
- **Ekran Kodu**: `A-02` | **Bağlı Akış**: `FLOW-17` | **Bağlı Kontroller**: `A6`, `A16`, `B13`, `B14`, `D6`
- **Kapsam**: Belge inceleme, son geçerlilik tarihi kontrolü, zimmet çakışma denetimi (`B13`) ve zorunlu gerekçeli (`min 10 krk`) onay/red işlemleri.

#### `A-03`: Tanışma Kampanyası (`IntroCampaign`) ve İşletme Havale/EFT (`MANUAL_APPROVAL`) Onay Masası
- **Ekran Kodu**: `A-03` | **Bağlı Akış**: `FLOW-14`, `FLOW-18` | **Bağlı Kontroller**: `A5`, `A12`, `A13`, `B5`, `B15`, `D8`, `D10`
- **Kapsam**: `IntroCampaign` oluşturma/durdurma, `effectiveIntroEndDate` yönetimi ve `PAYMENT_PENDING` durumundaki işletme havale dekontlarını inceleyip `MANUAL_APPROVAL` ile 7 günlük `ACTIVE_MEMBERSHIP` başlatma.

#### `A-04`: 18 TFKS Operasyon Sınıfı (`SINIF-01..18`): Kasa, Ceza, Hasar, Depo ve Servis Yönetişimi
- **Ekran Kodu**: `A-04` | **Bağlı Akış**: `FLOW-19`, `FLOW-20` | **Bağlı Kontroller**: `A10`, `A11`, `B8`, `B9`, `B13`, `B16`
- **Kapsam**: Çoklu kasa (`CashVault`) transferleri, trafik cezası tebliğ/indirim takibi (`TrafficPenalty`), hasar ekspertizi (`DamageReport`), barkodlu yedek parça deposu (`WarehousePart`) ve yol testi zorunlu servis iş emirleri (`ServiceWorkOrder`).

#### `A-05`: Kriptografik `AuditLog` Gezgini, `verifyAuditChain()` Doğrulayıcı ve Mühürlü Gün Kapanışı
- **Ekran Kodu**: `A-05` | **Bağlı Akış**: `FLOW-21` | **Bağlı Kontroller**: `A14`, `B3`, `D5`
- **Kapsam**: `append-only` denetim kayıtlarının incelenmesi, SHA-256 zincir bütünlüğü testi ve 14 maddelik gün sonu risk kontrolü (`DailyClosingAudit`).

#### `A-06`: Otonom 71/71 Mimari, Güvenlik ve UI/UX Denetim Üssü (`AdminAutonomousAuditHub`)
- **Ekran Kodu**: `A-06` | **Bağlı Akış**: `FLOW-21`, `FLOW-22` | **Bağlı Kontroller**: `A1–A21`, `B1–B22`, `C1–C18`, `D1–D10`
- **Kapsam**: 71 kontrolün tamamının gerçek uygulama durumunu (`IMPLEMENTED | PARTIAL_PROTOTYPE | TARGET_SPEC`), kanıt dosyasını ve canlı invariant test sonuçlarını gösteren denetim ekranı.

#### Admin Komuta Merkezi (`AdminDashboard.tsx`) 18 Sekmenin Tam Envanteri
1. `overview`: Canlı Operasyon & SLA Özet Panosu
2. `couriers`: Sürücü & Kurye Filo, KYC ve Vardiya Yönetimi
3. `orders`: Aktif Çağrılar, Müdahale (`Override`) ve İade/İtiraz Masası
4. `Map`: Canlı GPS, Geofence ve Rota Telemetri Haritası
5. `Analytics`: Bölgesel Arz-Talep, Kârlılık ve Kapasite Analitiği
6. `Pricing`: Şehir/Bölge Tarife, KM/Dakika ve Haftalık Üyelik Fiyat Motoru
7. `Audit`: Kriptografik `AuditLog` ve `DailyClosingAudit` Gün Kapanış Masası
8. `ACL`: Rol ve Yetki Matrisi (`SUPER_ADMIN`, `OPS_MANAGER`, `FINANCE_ADMIN`, `AUDITOR`)
9. `Settings`: Sistem Parametreleri, Geofence Poligonları ve Sabit Kurallar
10. `Notifications`: Toplu Saha/Müşteri Duyuru ve Acil Bildirim Merkezi
11. `Vehicles`: Araç Kartları, Muayene/Sigorta ve Zimmet (`ZimmetLog`) Yönetimi
12. `Penalties`: Trafik Cezaları (`TrafficPenalty`), HGS ve Hasar (`DamageReport`) Masası
13. `Vaults`: Çoklu Kasa (`CashVault`) ve Çift Onaylı Transfer Merkezi
14. `Warehouse`: Barkodlu Yedek Parça Stoğu (`WarehousePart`) ve Servis İş Emirleri (`ServiceWorkOrder`)
15. `Loyalty`: Esnaf Tanışma Kampanyaları (`IntroCampaign`), Kupon ve Sadakat Motoru
16. `Architecture`: Sistem Mimarisi, Durum Makineleri ve Veri Akış Diyagramları
17. `LaunchStrategy`: Faz 1 / Faz 2 Lansman Stratejisi, 8 Ortak Seçenek ve Sınırlı Kapasite Matrisi
18. `AutonomousAudit`: 71/71 Mimari, Güvenlik, Veri Bütünlüğü ve UI/UX Denetim Üssü

---

## BÖLÜM I: MASTER İÇERİK KİTABI — CİLT 4: POSTGRESQL / DRIZZLE VERİTABANI ŞEMASI, ÇİFT KAYITLI MUHASEBE (`LEDGER`) VE OPENAPI 3.1 ENDPOINT KATALOĞU

### I.1. Üretim Veritabanı Tabloları ve Zorunlu Kısıtlar (`PostgreSQL 16 + PostGIS`)

| Tablo Adı | Birincil Anahtar (`PK`) | Kritik Sütunlar ve Veri Tipleri | Veritabanı Seviyesi Zorunlu Kısıtlar (`CHECK` / `UNIQUE` / `TRIGGER`) |
| :--- | :--- | :--- | :--- |
| `users` | `id UUID` | `phone VARCHAR(20)`, `role VARCHAR(24)`, `status VARCHAR(24)`, `failed_login_count INT`, `locked_until TIMESTAMPTZ`, `version INT` | `UNIQUE(phone)` |
| `driver_profiles` | `user_id UUID` | `kyc_status VARCHAR(24)`, `license_expiry DATE`, `insurance_expiry DATE`, `inspection_expiry DATE`, `active_vehicle_id UUID`, `is_online BOOLEAN`, `version INT` | `CHECK (NOT (is_online = TRUE AND kyc_status <> 'APPROVED'))` |
| `vehicles` | `id UUID` | `plate_number VARCHAR(16)`, `service_class VARCHAR(24)`, `status VARCHAR(24)`, `current_km INT`, `insurance_expiry DATE`, `inspection_expiry DATE`, `assigned_driver_id UUID` | `UNIQUE(plate_number)`, `UNIQUE(assigned_driver_id) WHERE assigned_driver_id IS NOT NULL` (`B13`) |
| `intro_campaigns` | `id UUID` | `name VARCHAR(120)`, `target_segment VARCHAR(24)`, `status VARCHAR(24)`, `start_at TIMESTAMPTZ`, `end_at TIMESTAMPTZ`, `duration_days INT`, `priority INT`, `version INT` | `CHECK (end_at > start_at)`, `CHECK (duration_days > 0)` |
| `business_tenants` | `id UUID` | `legal_name VARCHAR(160)`, `tax_number VARCHAR(16)`, `subscription_status VARCHAR(32)`, `applied_campaign_id UUID`, `personal_intro_end_at TIMESTAMPTZ`, `grace_ends_at TIMESTAMPTZ`, `membership_ends_at TIMESTAMPTZ`, `version INT` | `UNIQUE(tax_number)` |
| `business_payments` | `id UUID` | `tenant_id UUID`, `plan_code VARCHAR(32)`, `amount_kurus BIGINT`, `payment_method VARCHAR(24)`, `wire_reference_code VARCHAR(64)`, `receipt_url TEXT`, `approval_status VARCHAR(24)`, `approved_by UUID`, `approved_at TIMESTAMPTZ` | `UNIQUE(wire_reference_code)`, `CHECK (amount_kurus > 0)` |
| `orders` | `id UUID` | `order_no VARCHAR(24)`, `idempotency_key VARCHAR(64)`, `service_type VARCHAR(32)`, `status VARCHAR(24)`, `customer_id UUID`, `tenant_id UUID`, `driver_id UUID`, `pickup_geom GEOMETRY(Point,4326)`, `dropoff_geom GEOMETRY(Point,4326)`, `distance_meters INT`, `boarding_code CHAR(4)`, `delivery_code CHAR(4)`, `pod_photo_url TEXT`, `version INT` | `UNIQUE(idempotency_key)`, `CHECK (service_type IN ('TAXI_RIDE','INDIVIDUAL_DELIVERY','BUSINESS_DELIVERY'))`, `CHECK (distance_meters >= 300)` |
| `transaction_fee_snapshots` | `id UUID` | `order_id UUID`, `service_type VARCHAR(32)`, `gross_amount_kurus BIGINT`, `customer_commission_kurus BIGINT`, `provider_commission_kurus BIGINT`, `driver_net_payout_kurus BIGINT`, `snapshot_hash CHAR(64)` | `UNIQUE(order_id)`, `CHECK (customer_commission_kurus = 0)`, `CHECK (provider_commission_kurus = 0)`, `CHECK (driver_net_payout_kurus = gross_amount_kurus)`, `BEFORE UPDATE/DELETE RAISE EXCEPTION` |
| `ledger_entries` | `id UUID` | `transaction_group_id UUID`, `account_id UUID`, `entry_type VARCHAR(6)` (`DEBIT\|CREDIT`), `amount_kurus BIGINT`, `reference_type VARCHAR(32)`, `reference_id UUID`, `created_at TIMESTAMPTZ` | `CHECK (amount_kurus > 0)`, `BEFORE UPDATE/DELETE RAISE EXCEPTION` (`Append-Only`) |
| `audit_logs` | `id UUID` | `timestamp TIMESTAMPTZ`, `actor_id UUID`, `actor_role VARCHAR(32)`, `screen_name VARCHAR(64)`, `action_type VARCHAR(32)`, `record_id VARCHAR(64)`, `previous_value JSONB`, `new_value JSONB`, `justification TEXT`, `previous_seal_hash CHAR(64)`, `security_seal_hash CHAR(64)` | `CHECK (char_length(justification) >= 10)`, `BEFORE UPDATE/DELETE RAISE EXCEPTION` (`A14`, `B3`) |

---

### I.2. Çift Kayıtlı Muhasebe (`Double-Entry Ledger`) ve `%0` Komisyon Yevmiye Kuralları

1. **Kuruş (`BIGINT`) Hassasiyeti**: Tüm parasal tutarlar veritabanında `BIGINT` kuruş (`100.00 TL = 10000`) olarak saklanır; `FLOAT` veya `DOUBLE` kullanımı yasaktır (`B10`).
2. **Sıfır Toplam Denkliği (`Zero-Sum Invariant`)**: Her `transaction_group_id` altında yer alan `DEBIT` (Borç) satırlarının toplamı, `CREDIT` (Alacak) satırlarının toplamına kuruşu kuruşuna eşit olmak zorundadır (`SUM(DEBIT) == SUM(CREDIT)`).
3. **M0 `%0` Komisyon Yevmiye Şablonu (`TAXI_RIDE`, `INDIVIDUAL_DELIVERY`, `BUSINESS_DELIVERY`)**:
   - Müşteri / İşletme Ödeme Tahsilatı (`gross_amount_kurus = 25000` kuruş / `250.00 TL`):
     - `DEBIT`: `102_EMANET_TAHSILAT_HESABI` = `+25000` kuruş
     - `CREDIT`: `320_SURUCU_NET_HAKEDIS_HESABI` = `+25000` kuruş (`%100` Sürücü/Kurye Net Kazancı)
     - `CREDIT`: `600_PLATFORM_SIPARIS_KOMISYON_GELIRI` = **`0` kuruş (`%0` Komisyon)**
4. **Haftalık Sabit İşletme Üyeliği Yevmiye Şablonu (`MANUAL_APPROVAL` sonrası)**:
   - İşletme Havale/EFT Ödemesi (`weekly_membership_kurus = 75000` kuruş / `750.00 TL`):
     - `DEBIT`: `102_BANKA_HAVALE_HESABI` = `+75000` kuruş
     - `CREDIT`: `601_ISLETME_HAFTALIK_UYELIK_GELIRI` = `+75000` kuruş

---

### I.3. OpenAPI 3.1 Temel Uç Nokta (`Endpoint`) Kataloğu

| HTTP & Path | Yetkili Roller | Zorunlu Başlıklar (`Headers`) | İstek Gövdesi (`Request DTO`) | Başarılı Yanıt & Garantiler | Hata Kodları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST /api/v1/auth/otp/request` | `PUBLIC` | `X-Device-Fingerprint` | `{ phone, kvkkConsent: true }` | `200 OK` (`{ requestId, expiresIn: 120 }`) | `422`, `429` |
| `POST /api/v1/auth/otp/verify` | `PUBLIC` | `X-Device-Fingerprint` | `{ phone, otpCode, requestId }` | `200 OK` (`HttpOnly` Cookie + `{ accessToken, role }`) | `401`, `423`, `429` |
| `POST /api/v1/orders/quote` | `CUSTOMER`, `BUSINESS_*` | `Authorization: Bearer` | `{ serviceType, pickupCoord, dropoffCoord, vehicleClass }` | `200 OK` (`{ quoteId, distanceMeters, feeSnapshotPreview }`) | `422 OUT_OF_SERVICE_AREA`, `422 ROUTE_TOO_SHORT` |
| `POST /api/v1/orders` | `CUSTOMER`, `BUSINESS_*` | `Authorization`, `Idempotency-Key` | `{ quoteId, packageDetails, paymentMethod, recipientPhone }` | `201 Created` (`{ orderId, status: 'SEARCHING', boardingCode, feeSnapshot }`) | `403`, `409 DUPLICATE_REQUEST`, `422` |
| `POST /api/v1/orders/:id/accept` | `DRIVER`, `COURIER` | `Authorization`, `Idempotency-Key` | `{ driverCoord, expectedVersion }` | `200 OK` (`SELECT ... FOR UPDATE` ile tek sürücüye atar, `status: 'ACCEPTED'`) | `403 KYC_OR_DOC_EXPIRED`, `409 ORDER_ALREADY_TAKEN` |
| `POST /api/v1/orders/:id/start` | `DRIVER`, `COURIER` | `Authorization` | `{ boardingCode, driverCoord, expectedVersion }` | `200 OK` (200m geofence + 4 haneli PIN doğrular, `status: 'IN_PROGRESS'`) | `409`, `422 INVALID_PIN`, `422 GEOFENCE_VIOLATION` |
| `POST /api/v1/orders/:id/complete` | `DRIVER`, `COURIER` | `Authorization`, `Idempotency-Key` | `{ deliveryCode, podPhotoUrl, driverCoord, expectedVersion }` | `200 OK` (`status: 'COMPLETED'`, `%100` hakedişi `ledger_entries` tablosuna yazar) | `409`, `422 POD_REQUIRED`, `422 INVALID_PIN` |
| `POST /api/v1/business/subscriptions/wire-notice` | `BUSINESS_OWNER`, `ACCOUNTANT` | `Authorization`, `Idempotency-Key` | `{ planCode, wireReferenceCode, receiptUrl, amountKurus }` | `201 Created` (`subscriptionStatus: 'PAYMENT_PENDING'`) | `403`, `409 DUPLICATE_REFERENCE`, `422` |
| `POST /api/v1/admin/subscriptions/:id/approve` | `SUPER_ADMIN`, `FINANCE_ADMIN` | `Authorization`, `Idempotency-Key` | `{ expectedVersion, justification, bankTransactionId }` | `200 OK` (`subscriptionStatus: 'ACTIVE_MEMBERSHIP'`, `AuditLog` mührü) | `403`, `409 VERSION_CONFLICT`, `422` |
| `POST /api/v1/admin/audit/daily-close` | `SUPER_ADMIN`, `OPS_MANAGER` | `Authorization` | `{ targetDate, justification, executiveOverrideNote? }` | `200 OK` (`DailyClosingAudit` 14 kriteri tarar ve günü mühürler) | `403`, `409 RISK_DETECTED_BLOCKED` |

---

### I.4. Nihai Kapsama ve Eksiksizlik Matrisi (Kitap Bütünlük Mührü)

| Kitap Bölümü / Cilt | Kapsanan İçerik Kalemleri | Toplam Kalem | Eksik / Özet Bırakılan Kalem | Doğrulama Durumu |
| :--- | :--- | :---: | :---: | :---: |
| **Bölüm A & B** | Mimari Denetim Bulguları (`AUD-01..14`) ve Karar Kayıtları (`DEC-REC-01..14`) | 28 Kayıt | `0` | **TAMAMLANDI** |
| **Bölüm C.1 – C.3** | Hedef Üretim Mimarisi, `%0` Komisyon Modeli, 18 Alanlı `TransactionFeeSnapshot`, `IntroCampaign` & `BusinessSubscription` Durum Makineleri | 4 Ana Şema + 14 Durum | `0` | **TAMAMLANDI** |
| **Bölüm C.4** | 6 Ana Görünüm Sınırı ve 22 Uçtan Uca Operasyonel Akış (`FLOW-01` – `FLOW-22`) | 22 Akış | `0` | **TAMAMLANDI** |
| **Bölüm C.5** | 71 Mimari, Güvenlik, Veri Bütünlüğü ve UI/UX Kontrolü (`A1–A21`, `B1–B22`, `C1–C18`, `D1–D10`) — Her biri 13 zorunlu alanıyla | 71 Kontrol (923 Alt Alan) | `0` | **TAMAMLANDI** |
| **Bölüm C.6 & C.7** | Ayrı `M0–M7` Faz Spesifikasyonları (`M6` ve `M7` ayrı) + 20 Sistem Genel Gereksinimi (`SYS-01..20` & `TEST-01..20`) | 8 Faz + 20 Kabul Testi | `0` | **TAMAMLANDI** |
| **Bölüm D & E** | 12 Maddelik Son Doğrulama Tablosu + 7 Açık Karar Kaydı (`DEC-01..07`) | 19 Kayıt | `0` | **TAMAMLANDI** |
| **Bölüm F (Cilt 1)** | Resmi Şartname Maddeleri (`1`, `2.1–2.11`, `3.1–3.4`), 8 Ortak Seçenek, Sınırlı Kapasite Prensibi ve Faz 2 Modülleri | 16 Madde + 8 Seçenek + 4 Faz-2 Modülü | `0` | **TAMAMLANDI** |
| **Bölüm G (Cilt 2)** | 18 TFKS Operasyon Sınıfı (`SINIF-01..18`) + Başlık Altı Zorunlu 4'lü Talimat Protokolü | 18 Sınıf + 4 Ana Protokol | `0` | **TAMAMLANDI** |
| **Bölüm H (Cilt 3)** | 42 Wireframe Ekran Şeması (`C-01..15`, `K-01..15`, `B-01..06`, `A-01..06`) + 18 Admin Sekmesi | 42 Ekran + 18 Sekme | `0` | **TAMAMLANDI** |
| **Bölüm I (Cilt 4)** | PostgreSQL/PostGIS Veritabanı Tabloları, Çift Kayıtlı Muhasebe (`Ledger`) Kuralları ve OpenAPI 3.1 Endpoint Kataloğu | 10 Tablo + 10 Ana Endpoint | `0` | **TAMAMLANDI** |


---

## BÖLÜM J: CANLI KOD TABANI (`RUNTIME`) TAM DENETİM RAPORU — YAPILANLAR VE KALAN EKSİKLERİN AYRIMI (`RT-AUD-01` – `RT-AUD-08`)

> [!IMPORTANT]
> **Çalışan uygulama kod tabanının tamamı (`PlatformContext`, `CustomerApp`, `CourierApp`, `BusinessPortal`, `WebsiteMainView`, `AdminDashboard`, `ScreenDesignSystem`, `PlatformNavbar` ve `App`) satır satır denetlenmiş; önceki turlarda kodda tamamlanmış olan düzeltmeler (`YAPILDI`) ile yapılanlardan çıkarıldıktan sonra kalan net eksikler (`KALAN EKSİK — GAP-01 / GAP-02`) aşağıda dürüstçe ayrıştırılmıştır.**

### J.1. Çalışan Kod Tabanında (`Runtime`) Yapılanlar ve Kalan Net Eksikler Tablosu

| Denetim Kodu | İncelenen Çalışma Zamanı Modülü | Kod Tabanındaki Mevcut Gerçek Durum (Yapılanlar) | Yapılanlardan Çıkarılan Kalan Net Eksik (Uygulanacak İşlem) | Durum |
| :--- | :--- | :--- | :--- | :---: |
| **`RT-AUD-01`** | **Ücret Hesaplama ve Sipariş Motoru (`PlatformContext.tsx`)** | `calculateFare`, `requestRide`, `acceptBargainOffer` ve `directBookCourier` fonksiyonlarında `%0` komisyon (`platformCommission = 0`, `courierEarnings === totalFare`) ve 18 alanlı `createZeroCommissionFeeSnapshot` **kodlanmıştır ve aktiftir.** | Yeni eklenecek **Çoklu Paket (`Multi-Drop Batch`)** ve **B2B Dış Kanal (`Webhook`)** siparişlerinin de aynı `createZeroCommissionFeeSnapshot` motoruna bağlanması. | **YAPILDI**<br>*(Yeni modüllere bağlanacak)* |
| **`RT-AUD-02`** | **Müşteri Uygulaması Hizmet Seçimi ve Fiyat Özeti (`CustomerApp.tsx`)** | `TAXI_RIDE` ve `INDIVIDUAL_DELIVERY` aktif; `MOTO_PASSENGER_RIDE` (`DISABLED_BY_POLICY`) rozetiyle kilitlenmiş; fiyat çekmecesinde **`%0 Platform Komisyonu — %100 Şoför/Kurye Hakedişi`** **kodlanmıştır ve aktiftir.** | Eksik kalmamıştır (`%100 Tamamlandı`). | **YAPILDI** |
| **`RT-AUD-03`** | **Kurumsal Web Sitesi ve Üst/Alt Bar (`WebsiteMainView.tsx`, `PlatformNavbar.tsx`, `App.tsx`)** | Web ana sayfası ve navigasyon `%0` komisyonlu Taksi + Kurye/Teslimat ekosistemine göre güncellenmiştir. | Üst bara (`PlatformNavbar`) **`Uygulamayı Yükle (PWAInstallButton)`**, **`Bulut Senkron & Auth Rozeti`** ve **`Mağaza Yayın Hazırlık Merkezi`** butonu eklenecektir (`GAP-06`). | **KISMİ (`GAP-06`)** |
| **`RT-AUD-04`** | **İşletme Portalı Üyelik ve Tanışma Kampanyası (`BusinessPortal.tsx`)** | İşletme panelinde `%0` komisyon ve `subscriptionStatus` bilgi kartı mevcuttur; ancak canlı durum geçişleri ve Havale/EFT dekont yükleme formu eksiktir. | **`GAP-01`**: 6 durumlu `IntroCampaign` + 8 durumlu `BusinessSubscription` canlı durum makinesi, **Havale/EFT Referans Kodu (`wire_reference_code`) ve Dekont Bildirim Formu** ile `SUSPENDED` durumunda sipariş engeli kodlanacaktır. | **EKSİK (`GAP-01`)** |
| **`RT-AUD-05`** | **Sürücü ve Kurye Kokpiti (`CourierApp.tsx`)** | Çağrı kartı ve kazanç ekranında `%100` net hakediş, 4 haneli PIN ve PoD fotoğraf doğrulaması **kodlanmıştır ve aktiftir.** | **`GAP-03` & `GAP-04`**: Kokpite **Hibrit Kapasite Modu (`Yolcu <-> Paket Otomatik Geçiş`)** ve **Çok Duraklı (`Multi-Drop`) Paket Teslimat Navigasyonu** eklenecektir. | **KISMİ (`GAP-03/04`)** |
| **`RT-AUD-06`** | **Ekran Tasarımları & Wireframe Stüdyosu (`ScreenDesignSystem.tsx`)** | Şu anda 29 ekran (`C-01..14 [14]`, `K-01..09 [9]`, `A-01..06 [6]`) mevcuttur. `C-15`, `K-10..15 [6]` ve `İşletme B-01..06 [6]` (toplam 13 ekran) eksiktir; ayrıca API sekmesinde eski `"Rust API Şeması"` başlığı yer almaktadır. | **`GAP-02`**: Eksik **13 ekran (`C-15`, `K-10..15`, `B-01..06`)** ve `İşletme (business)` sekmesi eklenerek 42/42 ekran tamamlanacak; API sekmesi **`Java 21 / Spring Boot 3.4 OpenAPI 3.1`** olarak düzeltilecektir. | **EKSİK (`GAP-02`)** |
| **`RT-AUD-07`** | **Komuta Merkezi Tarife ve Finans Sekmeleri (`AdminDashboard.tsx`)** | Admin panelinde `%0` sipariş komisyonu kilidi, 18 TFKS operasyon masası ve 71/71 Otonom Denetim Merkezi **kodlanmıştır ve aktiftir.** | **`GAP-01` & `GAP-03`**: Admin paneline **İşletme Havale/EFT Dekont Onay Masası** ve **Bölgesel Hibrit Kapasite Dengeleme Kontrol Paneli** eklenecektir. | **KISMİ (`GAP-01/03`)** |
| **`RT-AUD-08`** | **Bölünmüş Canlı Simülasyon (`SplitSimulationView.tsx`)** | Canlı simülasyon ekranında `%0` komisyon ve `TransactionFeeSnapshot` denetim şeridi **kodlanmıştır ve aktiftir.** | Eksik kalmamıştır (`%100 Tamamlandı`). | **YAPILDI** |

---

### J.2. Çalışma Zamanı (`Runtime`) Bileşen ve Veri Akışı Hizalama Şeması

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     PLATFORM RUNTIME ENGINE (PlatformContext.tsx)                        │
│  • Aktif M0 Hizmetleri : TAXI_RIDE | INDIVIDUAL_DELIVERY | BUSINESS_DELIVERY             │
│  • Devre Dışı Hizmet   : MOTO_PASSENGER_RIDE (DISABLED_BY_POLICY — UKOME Teyidi Bekler)  │
│  • calculateFare()     : %0 Komisyon (platformCommission = 0, courierEarnings = total)   │
│  • FeeSnapshot         : 18 Alanlı Immutable TransactionFeeSnapshot (SHA-256 Mühürlü)    │
│  • IntroCampaign       : ELIGIBLE ➔ APPLIED ➔ ACTIVE_FREE_PERIOD ➔ EXPIRED ➔ CONVERTED   │
│  • BusinessSubscription: ACTIVE ➔ PAST_DUE ➔ GRACE_PERIOD ➔ SUSPENDED (Sipariş Kilidi)   │
└───────────────┬──────────────────────┬───────────────────────┬───────────────────────────┘
                │                      │                       │
                ▼                      ▼                       ▼
┌───────────────────────────┐ ┌────────────────────────┐ ┌─────────────────────────────────┐
│ 1. Web & Müşteri & İşletme│ │ 2. Sürücü / Kurye      │ │ 3. Admin & Wireframe & Şartname │
│ • WebsiteMainView (Taksi  │ │ • CourierApp (%100 Net │ │ • AdminDashboard (%0 Komisyon   │
│   & Kurye, %0 Komisyon)   │ │   Kazanç, 4 Haneli PIN,│ │   Sabit, Havale Onayı, 18 Sekme)│
│ • CustomerApp (Taksi +    │ │   PoD Fotoğraf, Eldiven│ │ • AdminAutonomousAuditHub       │
│   Paket, 0 ₺ Kesinti)     │ │   Dostu Kokpit)        │ │   (71/71 Kontrol + FeeSnapshot) │
│ • BusinessPortal (Tanışma │ │ • SplitSimulationView  │ │ • ScreenDesignSystem (42 Ekran: │
│   Kampanyası + Üyelik)    │ │   (Canlı Senkron Test) │ │   C-01..15, K-01..15, B-01..06, │
│                           │ │                        │ │   A-01..06 + OpenAPI 3.1)       │
└───────────────────────────┘ └────────────────────────┘ └─────────────────────────────────┘
```

---

## BÖLÜM K: MOTOPILOT ŞİRKET VİZYONU — AKILLI KAPASİTE YÖNETİMİ, B2B SAAS LOJİSTİK AĞI, GERÇEK ZAMANLI BULUT VERİTABANI VE APP STORE / PLAY STORE YAYIN MİMARİSİ

### K.1. Genel Bakış ve MotoPilot'un Asıl Amacı (Core Company Vision)
MotoPilot'un varlık sebebi yalnızca bir "araç/motosiklet çağırma" uygulaması olmak değildir; **yolcu, sürücü, kurye ve işletmeleri tek bir akıllı işletim sisteminde birleştirerek saha iş akışını, atıl araç/kurye kapasitesini ve gelir döngüsünü gerçek zamanlı yöneten bir teknoloji ve lojistik şirketi kurmaktır.**

- **Pazara Giriş Kapısı**: `%0` komisyonlu adil yolcu taşıma (`TAXI_RIDE` ve yasal UKOME izniyle `MOTO_PASSENGER_RIDE`) ile bireysel kurye (`INDIVIDUAL_DELIVERY`) hizmetleri, sürücü ve kullanıcı ağını hızla büyütür.
- **Uzun Vadeli Büyüme ve Gelir Motoru**: İşletme teslimat yönetimi (`BUSINESS_DELIVERY`), çoklu paket birleştirme ve akıllı güzergah optimizasyonu (`Multi-Drop Route Batching`), B2B dış sipariş API entegrasyonu ve sabit haftalık/aylık yazılım aboneliği (`SaaS Membership`) modelidir.

---

### K.2. Kullanıcı Deneyimi, Görsel Tasarım ve 4 Yeni Akıllı Lojistik Modülü

#### 1. Sürücü ve Kurye Hibrit Kapasite Dengeleme Algoritması (`Hybrid Capacity Balancing Engine`)
- **Ne Yapar**: Şehir bölgelerindeki (`Zone`) anlık yolcu çağrısı ile işletme/bireysel paket teslimatı talebini karşılaştırır. Yolcu talebinin düştüğü saatlerde (ör. 11:30–14:00 öğle yemeği veya 18:30–21:30 akşam paket yoğunluğu) hibrit/müsait saha kapasitesini otomatik olarak **İşletme Paket Teslimatı (`BUSINESS_DELIVERY`)** görevlerine yönlendirir.
- **Kullanıcı Deneyimi**:
  - **Sürücü/Kurye Kokpitinde (`CourierApp`)**: "Akıllı Kapasite Modu (Yolcu + Paket Hibrit Görev)" seçimi ve saatlik tahmini kazanç artışı (`+%38 Saatlik Doluluk Artışı`) göstergesi.
  - **Admin Komuta Merkezinde (`AdminDashboard`)**: Bölgesel talep/kapasite dengesini, atıl kapasite oranını ve tek tıkla "Kapasite Dengeleme Önerisini Uygula" aksiyonunu sunan canlı kontrol paneli.

#### 2. Akıllı Güzergah ve Çoklu Paket Birleştirme Motoru (`Smart Multi-Drop Route & Batching Engine`)
- **Ne Yapar**: Aynı bölgedeki işletmelerden çıkan ve aynı teslimat koridoruna giden 2 veya 3 paketi tek bir birleştirilmiş rota (`BatchRoutePlan`) altında gruplar.
- **Kullanıcı Deneyimi**:
  - **İşletme Panelinde (`BusinessPortal`)**: Bekleyen siparişleri tek tıkla "Akıllı Çoklu Rota Oluştur (Multi-Drop Batch)" ile birleştirme, durak sırasını (`Alış 1 ➔ Alış 2 ➔ Teslimat 1 ➔ Teslimat 2`), toplam mesafe tasarrufunu (`%28 KM Tasarrufu`) ve kurye saatlik net gelir artışını görme.
  - **Kurye Kokpitinde (`CourierApp`)**: Çok duraklı adım adım navigasyon kartı ve her durak için ayrı 4 haneli PIN / Teslimat Kanıtı (`PoD`) doğrulaması.

#### 3. İşletme SaaS Abonelik ve Otomatik Sipariş Dağıtımı (`B2B SaaS Auto-Dispatch Engine`)
- **Ne Yapar**: Aktif üyeliği (`FREE_INTRO` veya `ACTIVE_MEMBERSHIP`) bulunan işletmelerin siparişlerini, mutfak/hazırlık süresini (`prepTimeMinutes`) hesaba katarak paket tam hazır olduğu anda kapıda olacak en yakın uygun kuryeye otomatik atar (`Auto-Dispatch`).
- **Kullanıcı Deneyimi**: İşletme panelinde otomatik dağıtım anahtarı (`Auto-Dispatch Aktif`), SLA zamanlayıcısı ve `%0` sipariş komisyonuyla çalışan sabit SaaS abonelik yönetimi.

#### 4. Kurumsal B2B API ve Dış Sipariş Entegrasyon Paneli (`Enterprise B2B Webhook & External Order Hub`)
- **Ne Yapar**: Restoran, esnaf ve e-ticaret işletmelerinin harici sipariş kanallarından (Yemeksepeti, GetirYemek, Trendyol Yemek, Shopify, WooCommerce, Kurumsal POS) gelen siparişlerini Webhook / REST API üzerinden doğrudan MotoPilot kurye ağına aktarır.
- **Kullanıcı Deneyimi**: İşletme panelinde (`BusinessPortal`) yeni **"B2B API & Dış Sipariş Entegrasyonu"** sekmesi; canlı API Anahtarı (`mp_live_...`), Webhook URL'si, bağlı platform durumları ve tek tıkla gerçek zamanlı **"Dış Kanaldan Canlı Sipariş Simüle Et / Çek"** test tetikleyicisi.

---

### K.3. Birleşik Süper Uygulama (App Store, Google Play Store & PWA) ve Bulut Veritabanı Mimarisi

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                MOTOPILOT BİRLEŞİK SÜPER UYGULAMA (TEK PAKET — WEB + PWA + iOS + ANDROID)                 │
│  • PWA & Mağaza Katmanı : vite-plugin-pwa + Web App Manifest + Capacitor (iOS App Store & Play Store)    │
│  • Uygulama İçi Kurulum : PWAInstallButton (Android/Desktop/iOS Rehberli) + OfflineIndicator             │
│  • Tek Pakette Roller   : Müşteri/Yolcu + Sürücü/Kurye + İşletme SaaS Portalı + Admin Komuta + Simülasyon│
└─────────────────────────┬───────────────────────────────────────────────────────┬────────────────────────┘
                          │                                                       │
                          ▼                                                       ▼
┌─────────────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
│   AKILLI KAPASİTE, ROTA VE B2B SAAS MOTORU (CLIENT/API) │ │   GERÇEK ZAMANLI BULUT VERİTABANI & AUTH     │
│ • HybridCapacityEngine : Yolcu <-> Paket Dengeleme      │ │ • Firebase Authentication (Google / Oturum)  │
│ • MultiDropBatchEngine : Çoklu Paket Rota Birleştirme   │ │ • Cloud Firestore (onSnapshot Canlı Senkron) │
│ • SaaSAutoDispatch     : Hazırlık Süresi Odaklı Atama   │ │ • Zero-Trust firestore.rules (RBAC + %0 Fee) │
│ • B2BWebhookHub        : Dış Sipariş (POS/E-Ticaret) API│ │ • Çevrimdışı Önbellek + Otomatik Bulut Sync  │
└─────────────────────────────────────────────────────────┘ └──────────────────────────────────────────────┘
```

#### K.4. Teknik Uygulama Adımları (Onay Sonrası İnşa Edilecek Katmanlar)
1. **Gerçek Zamanlı Bulut Veritabanı ve Kimlik Doğrulama (Firebase Firestore & Auth)**:
   - Firebase kurulum akışı (`firebase_setup` / `ProvisionFirebase`) başlatılarak `firebase-applet-config.json`, `firebase-blueprint.json` ve Sıfır-Güven (`Zero-Trust`) `firestore.rules` güvenlik kuralları oluşturulacaktır.
   - `PlatformContext` içindeki siparişler (`orders`), sürücü/kurye profilleri (`couriers`), işletme abonelikleri (`businessAccounts`), çoklu paket rotaları (`batchRoutes`), B2B API entegrasyonları ve denetim izleri (`auditLogs`) gerçek zamanlı Firestore koleksiyonlarıyla (`onSnapshot`) senkronize edilecektir.
2. **Birleşik Süper Uygulama PWA ve App Store / Play Store Hazırlığı**:
   - `vite-plugin-pwa`, `manifest.json`, iOS/Android ikonları (`192x192`, `512x512`, `apple-touch-icon.png`), `capacitor.config.ts` (App ID: `com.motopilot.superapp`) ve üst barda doğrudan çalışan **`Uygulamayı Yükle (PWA / Mobil Kurulum)`** bileşeni (`PWAInstallButton`) + çevrim dışı durum göstergesi (`OfflineIndicator`) eklenecektir.
   - Ayrıca mağaza yayın hazırlık durumunu (App Store & Google Play Store paketleme, izinler, Capacitor yapılandırması, sürüm ve mağaza kontrol listesi) gösteren etkileşimli **"Mağaza & Yayın Hazırlık Merkezi"** eklenecektir.
3. **MotoPilot 4 Çekirdek Lojistik ve Kapasite Modülünün Canlı Kodlanması**:
   - `BusinessPortal` içine: **Akıllı Güzergah & Çoklu Paket Birleştirme (Multi-Drop Batching)**, **Otomatik Sipariş Dağıtımı (Auto-Dispatch)** ve **Kurumsal B2B API & Dış Sipariş Entegrasyon Paneli** sekmeleri/modülleri eklenecektir.
   - `CourierApp` ve `AdminDashboard` içine: **Sürücü ve Kurye Hibrit Kapasite Dengeleme Algoritması** ve **Çok Duraklı (Multi-Drop) Rota Navigasyonu** eklenecektir.

