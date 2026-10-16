import React, { useState, useEffect } from 'react';
import {
  Cloud,
  LogIn,
  LogOut,
  WifiOff,
} from 'lucide-react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';
import {
  signInWithGooglePopup,
  signOutFirebaseUser,
  subscribeToAuthChanges,
  subscribeToUserCloudOrders,
} from '../../services/firebase';
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

  return (
    <>
      {firebaseUser ? (
        <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium whitespace-nowrap shrink-0">
          <Cloud className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-[100px] font-semibold">
            {firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0]}
          </span>
          <span className="text-[11px] font-mono tabular-nums opacity-80">
            · {cloudOrderCount}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            title="Firebase Oturumunu Kapat"
            className="p-0.5 hover:text-white transition-colors cursor-pointer"
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
          className="hidden lg:flex items-center gap-1.5 px-3 h-9 rounded-lg bg-transparent hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <LogIn className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{authLoading ? 'Bağlanıyor...' : 'Bulut Giriş'}</span>
        </button>
      )}
    </>
  );
};

