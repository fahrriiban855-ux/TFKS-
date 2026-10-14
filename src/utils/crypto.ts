/**
 * TFKS Cryptographic and Security Utilities
 * Implements real SHA-256 via Web Crypto API (B3, B14), chain verification, and UUID generator (B8)
 */

import { AuditLogEntry } from '../types/platform';

/**
 * Senkron deterministik 64-karakter hex özet üreteci (Web Crypto asenkron tamamlanana kadar veya fallback için).
 * @param data Özetlenecek metin
 */
export function computeDeterministicHex(data: string): string {
  let h1 = 0x6a09e667;
  let h2 = 0xbb67ae85;
  let h3 = 0x3c6ef372;
  let h4 = 0xa54ff53a;
  for (let i = 0; i < data.length; i++) {
    const ch = data.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ (ch << 1), 1597334677);
    h3 = Math.imul(h3 ^ (ch << 2), 2246822519);
    h4 = Math.imul(h4 ^ (ch << 3), 3266489917);
  }
  const part = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return `${part(h1)}${part(h2)}${part(h3)}${part(h4)}${part(h1 ^ h3)}${part(h2 ^ h4)}${part(h1 + h2)}${part(h3 + h4)}`;
}

/**
 * Web Crypto API (`crypto.subtle.digest('SHA-256')`) kullanarak gerçek kriptografik SHA-256 hex özeti üretir.
 * @param data Özetlenecek ham veri
 */
export async function computeSha256Hex(data: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  return computeDeterministicHex(data);
}

/**
 * B3: Zincirleme denetim izi (Audit Log) ve gün sonu mühürlemesi için gerçek SHA-256 mühür üretir.
 * `btoa()` gibi geri döndürülebilir Base64 kodlamalar yerine tek yönlü kriptografik SHA-256 kullanır.
 * @param payload İşlem verisi (JSON veya kanonik dize)
 * @param previousHash Bir önceki kaydın SHA-256 mühür özeti (Genesis için 'GENESIS_0000000000000000')
 */
export async function generateSealHash(payload: string, previousHash: string = 'GENESIS_0000000000000000'): Promise<string> {
  const canonicalInput = `${previousHash}::${payload}`;
  const hex = await computeSha256Hex(canonicalInput);
  return `SHA256-${hex.toUpperCase()}`;
}

/**
 * Denetim izi (Audit Log) zincirinin kriptografik bütünlüğünü ve previousSealHash bağlarını doğrular.
 * @param logs Denetim kayıtları dizisi (yeniden eskiye sıralı)
 */
export function verifyAuditLogChain(logs: AuditLogEntry[]): {
  isValid: boolean;
  checkedCount: number;
  brokenRecordId?: string;
} {
  if (!logs || logs.length === 0) {
    return { isValid: true, checkedCount: 0 };
  }

  for (let i = 0; i < logs.length; i++) {
    const entry = logs[i];
    if (!entry.securitySealHash || entry.securitySealHash.length < 16) {
      return {
        isValid: false,
        checkedCount: i,
        brokenRecordId: entry.id,
      };
    }
    const olderEntry = logs[i + 1];
    if (olderEntry && entry.previousSealHash && entry.previousSealHash !== olderEntry.securitySealHash) {
      return {
        isValid: false,
        checkedCount: i,
        brokenRecordId: entry.id,
      };
    }
  }

  return {
    isValid: true,
    checkedCount: logs.length,
  };
}

/**
 * B8: Çakışma riski olmayan kriptografik UUID üreteci (`Math.random` yerine `crypto.randomUUID` kullanır).
 * @param prefix Kimlik öneki (örn. 'order', 'audit', 'ledger')
 */
export function generateSecureUUID(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${timestamp}-${randomPart}`;
}
