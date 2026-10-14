/**
 * TFKS Internationalization (i18n) Dictionary & Hook (D5)
 * Standardized Turkish (default) and English translation matrix
 */

import { useState, useCallback } from 'react';

export type LanguageCode = 'tr' | 'en';

export const TRANSLATIONS = {
  tr: {
    // Navigation
    website: 'Kurumsal Web',
    customer: 'Kişisel (Müşteri)',
    business: 'İşletme (B2B)',
    courier: 'Kurye Terminali',
    admin: 'Komuta Merkezi',
    split: 'Canlı Bölünmüş Ekran',

    // Common Actions
    create: 'Oluştur',
    cancel: 'İptal Et',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    approve: 'Onayla',
    reject: 'Reddet',
    search: 'Ara',
    filter: 'Filtrele',
    close: 'Kapat',

    // Statuses
    pending: 'Beklemede',
    in_transit: 'Yolda / Taşıma Sürüyor',
    delivered: 'Teslim Edildi',
    failed: 'Başarısız',
    returned: 'İade Edildi',
    active: 'Aktif',
    passive: 'Pasif',
    blocked: 'Blokajlı',

    // Business & Sub-Users
    businessPortal: 'Kurumsal İşletme Portalı',
    subUsersTitle: 'İşletme Alt Kullanıcıları & ACL',
    newSubUser: 'Yeni Alt Kullanıcı',
    b2bDispatch: 'B2B Toplu & Hızlı Sevkiyat',
    radarTracking: 'Canlı Sevkiyat Radarı',
    corporateLedger: 'Cari Ekstre & Bakiye',

    // Notifications
    criticalNotice: 'Kritik Bildirim',
    inQueue: 'kuyrukta',
  },
  en: {
    // Navigation
    website: 'Corporate Web',
    customer: 'Individual (Customer)',
    business: 'Business (B2B)',
    courier: 'Courier Terminal',
    admin: 'Command Center',
    split: 'Live Split View',

    // Common Actions
    create: 'Create',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    approve: 'Approve',
    reject: 'Reject',
    search: 'Search',
    filter: 'Filter',
    close: 'Close',

    // Statuses
    pending: 'Pending',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    failed: 'Failed',
    returned: 'Returned',
    active: 'Active',
    passive: 'Passive',
    blocked: 'Blocked',

    // Business & Sub-Users
    businessPortal: 'Corporate Business Portal',
    subUsersTitle: 'Business Sub-Users & ACL',
    newSubUser: 'New Sub-User',
    b2bDispatch: 'B2B Multi-Drop Dispatch',
    radarTracking: 'Live Dispatch Radar',
    corporateLedger: 'Corporate Ledger & Balance',

    // Notifications
    criticalNotice: 'Critical Notice',
    inQueue: 'in queue',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS['tr'];

export function useTranslation() {
  const [lang, setLang] = useState<LanguageCode>('tr');

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.tr;
      return dict[key] || fallback || key;
    },
    [lang]
  );

  return {
    lang,
    setLang,
    t,
  };
}
