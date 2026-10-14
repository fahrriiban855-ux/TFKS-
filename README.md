# MotoPilot — TFKS (Türkiye Filo & Kurye Sistemi)

## 📌 Proje Genel Bakış
MotoPilot, Türkiye çapında hem bireysel yolcu ve paket taşımacılığı, hem de kurumsal işletmeler (B2B) için çoklu şube, alt kullanıcı rol yönetimli (ACL) ve mühürlü çift-taraflı finansal denetimli (TFKS) filo yönetim platformudur.

---

## 🏗️ Mimari Katmanlar
1. **Kişisel Müşteri Portalı (`/customer`)**:
   - "Beni Götür" (Motosiklet Yolcu Taşımacılığı)
   - "Paket Gönder" (Tekil ekspres evrak / koli)
   - "Bir Şeyi Alıp Bana Getir" (Özel sipariş)
   - Serbest Konum Seçimi: 81 il ve Türkiye geneli serbest koordinat & pinleme
   - Biniş Kodu & Cüzdan Bakiye Yönetimi

2. **Kurumsal İşletme Portalı (`/business`)**:
   - Bağımsız B2B Giriş ve Kurumsal Hesap Seçimi
   - **İşletme Alt Kullanıcıları & ACL Motoru**:
     - `owner` (Şirket Sahibi / Tam Yetki)
     - `branch_manager` (Şube Müdürü - Yalnızca kendi şubesinin paketleri)
     - `dispatch_staff` (Sevkiyat Personeli - Paket girişi & barkod)
     - `accountant` (Muhasebe - Cari ekstre, fatura, mutabakat)
     - `read_only` (Müşteri Hizmetleri - Yalnızca durum izleme)
   - B2B Çoklu Teslimat / Dağıtım (Multi-Drop Dispatch)
   - Canlı Sevkiyat Radarı & Cari Bakiye Takibi

3. **Komuta Merkezi & Yönetici Paneli (`/admin`)**:
   - TFKS Sınıf 1: Araç, Şoför, Zimmet & Vardiya (Çift zimmet kilidi)
   - TFKS Sınıf 2: Çoklu Kasa & Cari Mutabakat (Çift onaylı transfer, bakiye koruması)
   - TFKS Sınıf 3: Ceza, HGS & Hasar Sorumluluk
   - TFKS Sınıf 4: Depo, Yedek Parça & Servis İş Emirleri (Parça kullanım kaydı)
   - TFKS Sınıf 5: Yetki & Blokaj Masası (İşletme blokajı dahil)
   - TFKS Sınıf 6: Mühürlü SHA-256 Audit Log (Eski Değer / Yeni Değer)
   - TFKS Sınıf 7: Mühürlü Gün Kapanışı (Tahsil edilmemiş nakitte blokaj)
   - İşletme Alt Kullanıcıları & ACL Denetim Masası

4. **Kurye Terminali (`/courier`)**:
   - Vardiya Açılış / Başlangıç KM / Ekipman & Kask Teyidi
   - Canlı Teklif / Çağrı Kabulü ve Rota Navigasyonu
   - Biniş & Teslim Kodu Doğrulama

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Derleme ve Tip Kontrolü
npm run build
```

---

## 🔒 Güvenlik & Denetim İlkeleri (TFKS Standartları)
- **Kriptografik SHA-256 Mühürleme**: Tüm kritik kayıtlar Web Crypto API tabanlı SHA-256 zinciriyle mühürlenir.
- **Kasa Koruma Kilidi**: Yetersiz bakiyeli kasalardan para çıkışı kesin olarak engellenir.
- **Tahsilat Denetimi**: Gün kapanışında tahsil edilmemiş nakit varken temiz mühürleme yapılamaz.
- **Idempotency Koruması**: Mükerrer sipariş ve finansal işlemler engellenir.
- **LocalStorage Kalıcılığı**: Sayfa yenilendiğinde kritik veriler korunur.
- **WCAG AA Erişilebilirlik**: Dinamik ada bildirimlerinde tam kontrast ve ekran okuyucu desteği.
