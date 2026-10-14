# MotoPilot — görünür arayüz yenileme paketi

Bu paket, önceki backend/CI paketinden ayrıdır ve **ekranda görünür değişiklik** yapar. Mevcut uygulama mantığını, fiyatlandırma kurallarını, rol izinlerini veya veri akışlarını değiştirmez. Global tasarım tokenlarını yeniler; uygulama üst gezinmesini, aktif sekmeleri, karanlık yüzeyleri, kart/kenarlık hiyerarşisini, form odak durumlarını ve dar ekran davranışlarını düzenler.

## Uygulama

1. ZIP'i açın.
2. Terminali proje kökünde açın.
3. Çalıştırın:

```bash
python3 /path/to/motopilot-ui-refresh/apply_ui_refresh.py /path/to/TFKS-
```

PowerShell'de `python` komutu kullanılabilir:

```powershell
python C:\path\to\motopilot-ui-refresh\apply_ui_refresh.py C:\path\to\TFKS-
```

Betik `src/main.tsx` dosyasına `premium-refresh.css` importunu ekler, CSS dosyasını `src/` altına kopyalar ve `main.tsx` için repo dışında yedek oluşturur. Mevcut çalışma ağacında kaydedilmemiş değişiklik varsa varsayılan olarak durur; yalnızca değişikliklerinizi kontrol ettikten sonra `--allow-dirty` ekleyin.

## Ardından doğrulayın

```bash
bun run lint
bun run test
bun run build
```

Bunlar bu paketin oluşturulması sırasında gerçek proje üzerinde çalıştırılmadı. Bu katman, ekranların görsel tutarlılığını artıran bir ilk UI revizyonudur; tüm ekranların yerleşim, iş akışı ve işlev açısından tek tek yeniden tasarlanıp test edildiği anlamına gelmez.
