import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Cloud,
  LogIn,
  LogOut,
  ShieldCheck,
  X,
  WifiOff,
  Layers,
  Globe,
  Cpu,
  Lock,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWAInstall';
import {
  signInWithGooglePopup,
  signOutFirebaseUser,
  subscribeToAuthChanges,
  subscribeToUserCloudOrders,
} from '../../services/firebase';
import { capacitorConfig } from '../../../capacitor.config';
import type { User } from 'firebase/auth';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xl border border-amber-300">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Çevrimdışı Mod — Önbellek ve Outbox Kuyruğu Aktif</span>
    </div>
  );
};

export const PWAInstallAndStoreControls: React.FC<{
  onNotify?: (params: { title: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => void;
}> = ({ onNotify }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [cloudOrderCount, setCloudOrderCount] = useState<number>(0);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    let unsubOrders: (() => void) | null = null;
    const unsubAuth = subscribeToAuthChanges((user) => {
      setFirebaseUser(user);
      if (unsubOrders) {
        unsubOrders();
        unsubOrders = null;
      }
      if (user) {
        unsubOrders = subscribeToUserCloudOrders(user.uid, (cnt) => {
          setCloudOrderCount(cnt);
        });
      } else {
        setCloudOrderCount(0);
      }
    });
    return () => {
      unsubAuth();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const user = await signInWithGooglePopup();
      if (user && onNotify) {
        onNotify({
          title: 'Firebase Bulut Oturumu Açıldı',
          message: `${user.displayName || user.email} olarak gerçek zamanlı Firestore veritabanına bağlandınız.`,
          type: 'success',
        });
      }
    } catch (err) {
      if (onNotify) {
        onNotify({
          title: 'Oturum Açma Bilgilendirmesi',
          message: err instanceof Error ? err.message : 'Google giriş penceresi kapatıldı.',
          type: 'info',
        });
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutFirebaseUser();
    if (onNotify) {
      onNotify({
        title: 'Bulut Oturumu Kapatıldı',
        message: 'Yerel simülasyon moduna geri dönüldü.',
        type: 'info',
      });
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted && onNotify) {
        onNotify({
          title: 'MotoPilot Cihaza Kuruldu',
          message: 'Süper uygulama ana ekranınıza başarıyla eklendi.',
          type: 'success',
        });
      }
    } else {
      setShowStoreModal(true);
    }
  };

  return (
    <>
      {/* 1. Firebase Cloud Auth & Real-time Firestore Badge */}
      {firebaseUser ? (
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 min-h-[40px] rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Cloud className="w-3.5 h-3.5" />
          <span className="truncate max-w-[110px]">
            {firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0]}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono">
            {cloudOrderCount} Bulut
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            title="Firebase Oturumunu Kapat"
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={authLoading}
          title="Firebase Auth & Gerçek Zamanlı Firestore Bulut Bağlantısı"
          className="hidden lg:flex items-center gap-1.5 px-2.5 min-h-[40px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#2563EB]/50 text-[var(--text-primary)] text-xs font-semibold transition-all cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{authLoading ? 'Bağlanıyor...' : 'Bulut Giriş'}</span>
        </button>
      )}

      {/* 2. In-App PWA Install & Store Readiness Trigger */}
      {!isInstalled && (
        <button
          type="button"
          onClick={handleInstallClick}
          title="App Store, Google Play Store & PWA Birleşik Süper Uygulama Kurulum Merkezi"
          className="flex items-center gap-1.5 px-2.5 min-h-[40px] rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">
            {isInstallable ? 'Uygulamayı Yükle' : isIOS ? 'iOS Kurulum' : 'Mağaza & Kurulum'}
          </span>
        </button>
      )}

      {isInstalled && (
        <button
          type="button"
          onClick={() => setShowStoreModal(true)}
          title="App Store & Google Play Store Yayın Hazırlık Merkezi"
          className="hidden sm:flex items-center gap-1.5 px-2.5 min-h-[40px] rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Mağaza Paketi Hazır</span>
        </button>
      )}

      {/* Modal: App Store, Google Play Store & PWA Unified Super-App Readiness Center */}
      {showStoreModal && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-[#141418] border border-white/15 p-6 sm:p-7 text-xs text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                      BİRLEŞİK SÜPER UYGULAMA MİMARİSİ
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {capacitorConfig.appId}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    App Store, Google Play Store &amp; PWA Yayın Hazırlık Merkezi
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStoreModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Role Super-App Bundle Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                {
                  role: '1. Müşteri & Yolcu',
                  desc: '%0 Komisyon Taksi & Bireysel Paket Çağırma',
                },
                {
                  role: '2. Sürücü & Kurye',
                  desc: 'Hibrit Kapasite Modu & Çok Duraklı (Multi-Drop) Kokpit',
                },
                {
                  role: '3. İşletme SaaS Portalı',
                  desc: 'Auto-Dispatch, Çoklu Rota & B2B Dış Sipariş API',
                },
                {
                  role: '4. Admin Komuta',
                  desc: '18 TFKS Sınıfı, Havale Onayı & 71/71 Denetim Üssü',
                },
              ].map((item) => (
                <div
                  key={item.role}
                  className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1"
                >
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.role}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Store Compliance Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Apple App Store */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-400" />
                    Apple App Store (iOS)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    HAZIR
                  </span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-zinc-300">
                  <li>• Bundle ID: <code className="text-sky-300">{capacitorConfig.appId}</code></li>
                  <li>• iOS Info.plist Konum, Kamera (PoD) ve Mikrofon (PTT) izin metinleri tanımlı</li>
                  <li>• 180x180 PNG <code className="text-sky-300">apple-touch-icon.png</code> aktif</li>
                  <li>• Apple HIG 44pt dokunma hedefleri &amp; Dynamic Type uyumlu</li>
                </ul>
              </div>

              {/* Google Play Store */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    Google Play Store (Android)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    HAZIR
                  </span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-zinc-300">
                  <li>• Package: <code className="text-emerald-300">{capacitorConfig.appId}</code></li>
                  <li>• Maskable 512x512 (%15 güvenli alan dolgulu) ve 192x192 PNG ikonlar</li>
                  <li>• Foreground Service &amp; Fine Location bildirim izinleri hazır</li>
                  <li>• TWA / Capacitor AAB derleme şeması doğrulandı</li>
                </ul>
              </div>

              {/* Web PWA & Cloud DB */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-purple-400" />
                    Web PWA &amp; Bulut Veritabanı
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    AKTİF
                  </span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-zinc-300">
                  <li>• Service Worker (`vite-plugin-pwa`) ve çevrimdışı önbellek aktif</li>
                  <li>• Firebase Cloud Firestore (`onSnapshot`) &amp; Google Auth bağlı</li>
                  <li>• Zero-Trust `firestore.rules` (`%0` komisyon değişmezi) dağıtıldı</li>
                </ul>
              </div>
            </div>

            {/* Direct Install Guidance */}
            <div className="p-4 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#38BDF8]" />
                  <span>Doğrudan Cihaza Kurulum (PWA &amp; Mobil Ana Ekran)</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  {isIOS
                    ? 'iPhone / iPad Safari araç çubuğundaki "Paylaş" düğmesine dokunun ve "Ana Ekrana Ekle" seçeneğini seçin.'
                    : isInstallable
                    ? 'Tarayıcınız doğrudan kurulumu destekliyor. Hemen yüklemek için sağdaki butona tıklayın.'
                    : 'Tarayıcı adres çubuğundaki "Yükle" simgesinden veya mobil menüden "Ana Ekrana Ekle" ile tek pakette tüm rolleri kullanabilirsiniz.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isInstallable && (
                  <button
                    type="button"
                    onClick={install}
                    className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold cursor-pointer"
                  >
                    Şimdi Cihaza Yükle
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowStoreModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
