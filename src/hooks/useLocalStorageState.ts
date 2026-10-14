import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'motopilot_';
const CHANNEL_NAME = 'motopilot_sync_v2';

/**
 * [B1] Veri Kalıcılığı ve Çoklu Sekme Senkronizasyonu Custom Hook'u (`useLocalStorageState`)
 * Context veya bileşen mount olduğunda `localStorage`'dan okur, her state değişikliğinde
 * hem `localStorage`'a yazar hem de `BroadcastChannel` üzerinden açık diğer sekmeleri anında günceller.
 *
 * @param key Depolama anahtarı (örn. 'orders', 'couriers', 'vaults', 'auditLogs')
 * @param initialValue Varsayılan başlangıç değeri
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevState: T) => T)) => void] {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const isExternalUpdateRef = useRef(false);

  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.warn(`[useLocalStorageState] "${storageKey}" okunurken hata oluştu:`, error);
    }
    return initialValue;
  });

  // State her değiştiğinde localStorage'a yaz ve BroadcastChannel ile diğer sekmelere bildir
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(storageKey, serialized);

      if (!isExternalUpdateRef.current && typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.postMessage({ key: storageKey, value: state, timestamp: Date.now() });
        channel.close();
      }
      isExternalUpdateRef.current = false;
    } catch (error) {
      console.warn(`[useLocalStorageState] "${storageKey}" yazılırken hata oluştu:`, error);
    }
  }, [storageKey, state]);

  // Diğer sekmelerden gelen BroadcastChannel ve storage olaylarını dinle
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data && event.data.key === storageKey) {
            isExternalUpdateRef.current = true;
            setState(event.data.value as T);
          }
        };
      } catch {
        // Ignore if BroadcastChannel is restricted
      }
    }

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue !== null) {
        try {
          isExternalUpdateRef.current = true;
          setState(JSON.parse(event.newValue) as T);
        } catch {
          // Ignore malformed JSON
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (channel) {
        channel.close();
      }
    };
  }, [storageKey]);

  const setPersistedState = useCallback((value: T | ((prevState: T) => T)) => {
    setState((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  return [state, setPersistedState];
}
