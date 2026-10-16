# V2 YÖNETİCİ AJAN SİSTEMİ — MOD 1 (KAPI 1: TÜM UYGULAMA DENETİMİ VE GÖREV PAKETİ)

## 1. TESPİT VE KÖK NEDEN (TÜM UYGULAMA TARAMASI)
Tüm uygulama katmanları (`PlatformContext.tsx`, `CustomerApp.tsx`, `CourierApp.tsx`, `BusinessPortal.tsx`, `AdminDashboard.tsx`) incelendiğinde, önceki 5 lansman düzeltmesinin dışında **5 kritik mimari/iş kuralı açığı** tespit edilmiştir:

1. **Kurye Teslimatı (`kurye`, `al_getir`, `isletme_siparis`) Yola Çıkış Bypass'ı:**
   - `verifyTripPinGuard` şu an tüm seferlerde `boardingCode` eşleşmesi bekliyor; ancak `CourierApp.tsx` satır 642'de kurye paket işlerinde **"Paketi Aldım, Yola Çık"** butonuna bastığında `startTrip('0000')` gönderiyor. `boardingCode` rastgele 4 haneli olduğu için `startTrip('0000')` reddediliyor ve **paket/işletme teslimatları `arrived` durumundan `in_progress` durumuna geçemiyor (kilitleniyor)!**
2. **VIP Doğrudan Çağrı (`directBookCourier`) Kanonik Alan ve Eşzamanlılık Eksikliği:**
   - `PlatformContext.tsx` içindeki `directBookCourier` fonksiyonu aktif sefer kontrolü (in-flight concurrency guard) yapmıyor, siparişi `allRides` listesine eklemiyor ve `assignedCourierId`, `assignedVehicleId`, `assignmentVersion`, `verificationStatus`, `pinUsed` kanonik alanlarını doldurmuyor.
3. **TFKS Gün Kapanışı Bypass'ı (`closeDayAndSeal`):**
   - `PlatformContext.tsx` satır 2618'deki `closeDayAndSeal` fonksiyonu; açık servis iş emirlerini, onay bekleyen kasa transferlerini ve tahsil edilmemiş nakit riskini kontrol eden `runDailyClosingCheck` denetimini tamamen atlayarak sahte `Math.random()` hash ile günü doğrudan kapatıyor.
4. **Sürücü Trafik Cezası Ödemesi (`payCourierPenalty`) Cari / Defter / Audit Kopukluğu:**
   - `payCourierPenalty` yalnızca cezanın statüsünü `'paid'` yapıyor; kuryenin hakediş cüzdanından (`pendingPayout` / `courierCashInHand`) düşüm yapmıyor, `recordLedgerEntry` (muhasebe defteri) ve `recordAuditLog` kaydı üretmiyor.
5. **Vardiya & Zimmet (`startCourierShift`) Kanonik Plaka Senkronizasyonu Eksikliği:**
   - Kurye vardiyası başlatıldığında (`startCourierShift`), kuryenin `couriers` listesindeki kanonik plakası ve `vehicleAssignments` zimmet kaydı senkronize edilmiyor.

---

## 2. 5 AJANIN KISA HÜKMÜ

* **[AJAN 1 — KAPSAM VE DOSYA KİLİDİ]:**
  - **Sadece Okunacak/Düzenlenecek Dosyalar:** `src/context/PlatformContext.tsx`, `src/components/courier/CourierApp.tsx`, `src/tests/platform.test.ts`.
  - **Yasaklar:** Dizin tarama yok, skill/doc okuma yok, UI redesign yok, 50 satırdan uzun rapor yok.

* **[AJAN 2 — DURUM MAKİNESİ VE KANONİK VERİ]:**
  - Yolcu taşımada (`motosiklet`) `ARRIVED -> IN_PROGRESS` geçişi 4 haneli `boardingCode` ile doğrulanmalı; paket/kurye teslimatlarında (`kurye`, `al_getir`, `isletme_siparis`) ise alım onayı (`PICKUP_CONFIRMED` veya `boardingCode`) ile `in_progress` durumuna geçmeli ve tamamlama aşamasında `deliveryCode` / paket durumları zorunlu tutulmalıdır.
  - `directBookCourier` fonksiyonu kanonik `assignedCourierId`, `assignedVehicleId`, `assignmentVersion: 1`, `verificationStatus` alanlarını üretmeli ve `allRides` ile senkronize olmalıdır.

* **[AJAN 3 — FİNANS, CARİ VE İDEMPOTENCY]:**
  - `closeDayAndSeal` fonksiyonu doğrudan `runDailyClosingCheck()` motoruna bağlanmalı; açık risk varken (`serviceWorkOrders`, `cashTransfers`, `uncollectedCashAmount`) override notu olmadan günü mühürleyememelidir.
  - `payCourierPenalty` idempotent olmalı (ödenmiş ceza tekrar ödenemez), indirimli tutarı (`discountedAmount`) kurye hakedişinden/kasasından düşmeli, `recordLedgerEntry` ve `recordAuditLog` kaydı oluşturmalıdır.

* **[AJAN 4 — GÜVENLİK, FIRESTORE/AUTH VE GERÇEKLİK]:**
  - Gün kapanışı mühründe `Math.random()` sahte hash kullanımı kaldırılmalı; deterministik SHA-256 (`computeDeterministicHex` / `generateSealHash`) kullanılmalıdır.

* **[AJAN 5 — YIKIM TESTİ VE KABUL KAPISI]:**
  - `src/tests/platform.test.ts` dosyasına: (a) Paket teslimatında `arrived -> in_progress` geçişi, (b) `directBookCourier` kanonik alan doğrulaması, (c) Açık risk varken gün kapanışı blokajı, (d) Ceza ödemesi muhasebe/idempotency kontrolü testleri eklenmeli; `npm test && npm run build` sıfır hatayla geçmelidir.

---

## 3. AI STUDIO’YA VERİLECEK KOMUT PAKETİ (KOPYALANABİLİR BLOK)

```text
SADECE şu dosyaları oku/düzenle:
src/context/PlatformContext.tsx
src/components/courier/CourierApp.tsx
src/tests/platform.test.ts

Dizin tarama yok. Skill/doc okuma yok. Rapor yok. UI redesign yok.
Sadece şu 5 tüm-uygulama bütünlük hatasını düzelt:
1) Paket/işletme teslimatlarında ('kurye', 'al_getir', 'isletme_siparis') arrived -> in_progress geçiş kilitlenmesini düzelt: verifyTripPinGuard yolcu seferinde ('motosiklet') 4 haneli boardingCode zorunluluğunu korusun, paket teslimatlarında ise 'PICKUP_CONFIRMED' veya geçerli kod ile in_progress geçişine izin versin; CourierApp.tsx 'Paketi Aldım, Yola Çık' butonu startTrip('PICKUP_CONFIRMED') çağırsın.
2) directBookCourier içinde aktif sefer çakışma kilidi (in-flight guard) ekle, yeni siparişi allRides listesine kaydet ve kanonik alanları (assignedCourierId, assignedVehicleId, courierName, assignmentVersion: 1, verificationStatus, pinUsed: false) eksiksiz doldur.
3) closeDayAndSeal içindeki sahte Math.random() hash ve kontrolsüz kapanışı kaldır; doğrudan runDailyClosingCheck() kurallarına bağla (açık servis emri, onay bekleyen kasa transferi veya tahsil edilmemiş nakit varken kapanışı engelle).
4) payCourierPenalty fonksiyonunu idempotent yap (zaten paid ise engelle), indirimli ceza tutarını (discountedAmount) kurye cüzdanı/hakedişinden düş, recordLedgerEntry ve recordAuditLog kaydı üret.
5) startCourierShift çağrıldığında aktif kuryenin kanonik plakasını ve zimmet kaydını senkronize et, audit log oluştur.

src/tests/platform.test.ts içine bu 5 maddeyi doğrulayan birim testlerini ekle ve npm test && npm run build çalıştır.
Çıktı en fazla 50 satır: değişen dosyalar, kısa neden, test/build sonucu, kalan limit. Test/build sonrası dur.
```

---

## 4. ONAY SORUSU (KAPI 1)
Bu görev paketini onaylıyor musunuz? (**Proceed** butonuna bastığınızda yukarıdaki komut paketini doğrudan uygulayıp test/build sonuçlarıyla **KAPI 2** denetim tablosunu sunacağım.)
