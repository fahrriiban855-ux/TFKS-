# MotoPilot — Serbest Konum/Adres Seçimi, Bağımsız Müşteri & İşletme Portalları ve İşletme Alt Kullanıcıları (ACL) Uygulama Planı

Bu plan, kullanıcının talepleri doğrultusunda sistemdeki kısıtlı konum seçimini kaldırmayı, Kişisel Müşteri ve Kurumsal İşletme portallarını tamamen bağımsız iki ayrı giriş ve arayüze ayırmayı, İşletme Alt Kullanıcıları (ACL) yönetimini ve ekran arayüz hatalarını gidermeyi amaçlar.

---

## 1. Tespit Edilen Eksiklikler ve Kök Neden Analizi

1. **Kısıtlı Konum & Rota Seçimi:**
   - *Sorun:* Kullanıcılar sadece önceden tanımlı sabit birkaç lokasyon (Beşiktaş, Kadıköy, Levent vb.) arasından seçim yapabiliyordu. İstanbul geneli ve Türkiye çapında serbestçe herhangi bir cadde, sokak, mahalle veya harita noktası seçilemiyordu.
   - *Çözüm:* 
     - Açık metinli canlı adres arama motoru (Cadde/Sokak/Bina no/Mahalle/İlçe bazlı oto-tamamlama & koordinat çevirici).
     - İnteraktif Leaflet/SVG haritasında serbest tıklama veya pin sürükle-bırak (Drag & Drop Marker) ile istenilen herhangi bir koordinatı alış/varış noktası yapabilme.
     - Sık kullanılan favori adresler ve son arananlar listesi.
     - İl ve ilçe hiyerarşik hızlı seçim kataloğu.

2. **Kişisel vs. İşletme Giriş ve Panel Karışıklığı:**
   - *Sorun:* Kişisel bireysel müşteri ile kurumsal işletme aynı panelde iç içe geçmişti ve aynı kullanıcı profili altında karışıklık yaratıyordu.
   - *Çözüm:*
     - Üst menüde ve giriş akışında iki tamamen bağımsız portal:
       - **Kişisel Müşteri Portalı (B2C):** Bireysel Moto TAG yolculukları, kurye çağırma, kişisel cüzdan, kayıtlı kartlar ve bireysel indirim kuponları.
       - **Kurumsal İşletme Portalı (B2B):** Restoran, kafe, e-ticaret ve eczaneler için özel kurumsal panel; toplu dağıtım (Multi-Drop), şube yönetimi, kurumsal cari hesap, toplu faturalandırma ve API anahtarları.
     - Giriş / Oturum durumlarının (Session) ve rollerin ayrılması.

3. **İşletme Alt Kullanıcıları & Yetkilendirme (ACL) Eksikliği:**
   - *Sorun:* Bir işletmeye ait birden fazla şube müdürü, kurye hazırlık personeli veya muhasebeci tanımlanamıyor; tüm paketler tek bir yerde toplanıyordu.
   - *Çözüm:*
     - **İşletme Alt Kullanıcıları Modeli (`MerchantSubUser`):**
       - `owner`: Ana İşletme Sahibi (Tüm şubeleri, alt kullanıcıları, finansı ve API'yi yönetir).
       - `branch_manager`: Şube Yöneticisi (Yalnızca kendi şubesine ait siparişleri ve personeli görür).
       - `dispatcher_staff`: Paket/Sipariş Hazırlık Personeli (Yalnızca aktif teslimat çağırabilir ve kurye teslim durumunu takip eder, finansı göremez).
       - `finance`: Muhasebe & Fatura Yetkilisi (Yalnızca faturaları, carileri ve hakediş raporlarını görür).
     - Komuta Merkezi (`AdminDashboard`) ve İşletme Portalında Alt Kullanıcı Ekleme/Düzenleme/Pasife Alma masası.
     - Veri filtreleme (ACL): Alt kullanıcılar sadece kendi işletmelerine ve yetkili oldukları şubelere ait paketleri görür.

4. **Ekran & Arayüz Hatalarının Giderilmesi:**
   - Harita pinlerinin z-index ve taşma (overflow) sorunları.
   - Mobil ekranda butonların üst üste binmesi veya dokunma hedeflerinin dar kalması.
   - Modalların kapatma ve arka plan kaydırma (scroll-lock) mekanizmalarının düzeltilmesi.

---

## 2. Mimari ve Veri Modeli Değişiklikleri

### A. Tip Tanımları (`src/types/platform.ts` & `src/types/merchant.ts`)
```typescript
// Serbest Konum Arama ve Seçim Modeli
export interface CustomLocationPoint {
  id: string;
  name: string; // "Bağdat Cad. No: 142, Kadıköy"
  district: string;
  city: string;
  lat: number;
  lng: number;
  addressDetail?: string;
  isCustomPin?: boolean;
}

// İşletme Alt Kullanıcıları & ACL
export type MerchantUserRole = 'owner' | 'branch_manager' | 'dispatcher_staff' | 'finance';

export interface MerchantSubUser {
  id: string;
  merchantId: string;
  fullName: string;
  email: string;
  phone: string;
  role: MerchantUserRole;
  assignedBranchIds: string[]; // Boş ise tüm şubeler
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface MerchantBranch {
  id: string;
  merchantId: string;
  name: string; // "Moda Şubesi"
  district: string;
  address: string;
  lat: number;
  lng: number;
  contactPhone: string;
}
```

### B. Context & State Değişiklikleri (`PlatformContext.tsx`)
- `activeView` içine `'customer'` (bireysel) ve `'merchant_portal'` (kurumsal işletme) olarak iki net portal görünümü eklenmesi.
- `merchantSubUsers`, `merchantBranches`, `currentMerchantSession` state'leri.
- `addMerchantSubUser`, `updateMerchantSubUser`, `deleteMerchantSubUser`, `switchMerchantSubUserSession` fonksiyonları.
- Paket sorgulama ve sipariş filtreleme fonksiyonlarında `merchantId` ve `assignedBranchIds` bazlı ACL doğrulaması.

---

## 3. Geliştirilecek ve Güncellenecek Bileşenler

1. **`src/components/common/LocationSearchPicker.tsx` (Yeni):**
   - Canlı metin arama çubuğu (İstanbul cadde, sokak ve semtleri için anlık filtreleme).
   - "Haritadan Konum Seç" modu (Haritaya tıklanan her yere anında pin bırakma ve ters koordinat adresi üretme).
   - "Mevcut Konumumu Kullan" (GPS simülasyonu) ve "Sık Kullanılanlar" (Ev, İş, Şube).

2. **`src/components/merchant/MerchantPortalApp.tsx` (Yeni):**
   - Bağımsız Kurumsal İşletme Portalı:
     - Şube bazlı aktif siparişler paneli.
     - Toplu paket/kurye çağırma (Multi-Drop).
     - Alt Kullanıcılar Masası (Personel ekleme, rol atama, şube bağlama).
     - Kurumsal Cari, Faturalar ve Hakediş Masası.
     - API & Entegrasyon Ayarları (Yemeksepeti / Getir / Kendi web sitesi webhook).

3. **`src/components/customer/CustomerApp.tsx` (Güncelleme):**
   - Sabit lokasyon seçiminin kaldırılıp `LocationSearchPicker` ile değiştirilmesi.
   - Bireysel kullanıcıya özel odak: Moto TAG Yolculuk ve Bireysel Paket Kurye.
   - Arayüz taşma ve harita tıklama hatalarının temizlenmesi.

4. **`src/components/admin/AdminMerchantUsersHub.tsx` (Yeni):**
   - Komuta Merkezinde tüm kayıtlı işletmelerin alt kullanıcılarını, şubelerini ve ACL erişim haklarını denetleme masası.
   - Yetki ihlallerini ve şube bazlı sipariş dağılımını izleme.

5. **`src/components/common/PlatformNavbar.tsx` (Güncelleme):**
   - Segmented nav yapısında net ayrım:
     - 🌐 **Web Sitesi** (Kurumsal Vitrin)
     - 👤 **Bireysel Müşteri** (Kişisel Moto TAG & Kurye)
     - 🏢 **Kurumsal İşletme** (Restoran, E-Ticaret, Şubeler & Alt Kullanıcılar)
     - 🛵 **Sürücü / Kurye** (Saha Operasyonu)
     - ⚡ **Komuta Merkezi** (Merkezi Yönetim)

---

## 4. Test ve Kabul Kriterleri (Doğrulama)

- **Test 1 (Serbest Konum):** Kullanıcı haritada istediği herhangi bir noktaya tıklayıp veya arama kutusuna serbest adres yazıp alış/varış noktası belirleyebilmeli.
- **Test 2 (Giriş Ayrılığı):** Bireysel Müşteri portalı ile Kurumsal İşletme portalı tamamen farklı arayüzlere, fonksiyonlara ve oturumlara sahip olmalı.
- **Test 3 (İşletme Alt Kullanıcıları & ACL):**
  - "Şube Yöneticisi" rolündeki bir alt kullanıcı oturum açtığında yalnızca kendi şubesine ait paketleri görebilmeli.
  - "Sipariş Hazırlık Personeli" finansal carileri ve faturaları görememeli, yalnızca paket durumunu yönetebilmeli.
  - "Ana İşletme Sahibi" alt kullanıcı ekleyip çıkarabilmeli ve tüm şubeleri görebilmeli.
- **Test 4 (Ekran Hataları):** Mobil ve masaüstü görünümlerde hiçbir buton taşması, z-index çakışması veya kırık modal olmamalı.
- **Derleme:** `npm run build` ve `tsc --noEmit` hatasız tamamlanmalı.

---

Lütfen planı inceleyiniz. Uygun bulduğunuz takdirde onaylayarak uygulamaya geçebiliriz.
