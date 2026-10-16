import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocFromServer,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function sanitizeFirebaseError(
  error: unknown,
  operationType: OperationType
): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  const lower = raw.toLowerCase();
  if (lower.includes('permission-denied') || lower.includes('insufficient permissions')) {
    return 'Bulut veritabanı erişim yetkisi kısıtlı (Yerel çalışma modu aktif).';
  }
  if (lower.includes('offline') || lower.includes('unavailable') || lower.includes('network')) {
    return 'Bulut bağlantısı çevrimdışı. Veriler yerel depoda korunuyor.';
  }
  if (lower.includes('popup-closed-by-user') || lower.includes('cancelled')) {
    return 'Oturum açma işlemi kullanıcı tarafından iptal edildi.';
  }
  if (lower.includes('unauthenticated') || lower.includes('auth')) {
    return 'Kimlik doğrulama oturumu doğrulanamadı.';
  }
  return `Bulut senkronizasyonu şu an kullanılamıyor (${operationType}). Yerel kayıt korundu.`;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const safeMessage = sanitizeFirebaseError(error, operationType);
  console.warn('[Firestore Sanitized Diagnostics]', {
    operationType,
    collection: path ? path.split('/')[0] : null,
    status: safeMessage,
  });
  throw new Error(safeMessage);
}

// Validate connection on boot without masking permission errors as full live read/write
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'users_public', 'connection_probe'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline.');
      return false;
    }
    return false;
  }
}

testFirestoreConnection();

export async function signInWithGooglePopup(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user && user.emailVerified) {
      const publicRef = doc(db, 'users_public', user.uid);
      const privateRef = doc(db, 'users_private', user.uid);
      const safeDisplayName = (user.displayName || 'MotoPilot Kullanıcı').slice(0, 100);

      try {
        const publicSnap = await getDoc(publicRef);
        if (!publicSnap.exists()) {
          await setDoc(publicRef, {
            uid: user.uid,
            displayName: safeDisplayName,
            activeRole: 'CUSTOMER',
            hybridModeEnabled: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          await updateDoc(publicRef, {
            displayName: safeDisplayName,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.warn('[Auth Profile Sync Skipped - Local Fallback]', sanitizeFirebaseError(err, OperationType.WRITE));
      }

      try {
        const privateSnap = await getDoc(privateRef);
        if (!privateSnap.exists()) {
          await setDoc(privateRef, {
            uid: user.uid,
            email: (user.email || 'user@motopilot.com.tr').slice(0, 160),
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.warn('[Private Profile Sync Skipped - Local Fallback]', sanitizeFirebaseError(err, OperationType.WRITE));
      }
    }
    return user;
  } catch (error) {
    throw new Error(sanitizeFirebaseError(error, OperationType.WRITE));
  }
}

export async function signOutFirebaseUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export async function syncOrderToFirestore(params: {
  orderId: string;
  serviceType: 'TAXI_RIDE' | 'INDIVIDUAL_DELIVERY' | 'BUSINESS_DELIVERY';
  status: 'searching' | 'offered' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  pickupName: string;
  dropoffName: string;
  totalFare: number;
  snapshotHash: string;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;
  const safeId = params.orderId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const path = `orders/${safeId}`;
  const orderRef = doc(db, 'orders', safeId);

  try {
    const snap = await getDoc(orderRef);
    if (!snap.exists()) {
      await setDoc(orderRef, {
        orderId: safeId,
        ownerId: user.uid,
        serviceType: params.serviceType,
        status: params.status,
        pickupName: params.pickupName.slice(0, 200),
        dropoffName: params.dropoffName.slice(0, 200),
        totalFare: params.totalFare,
        platformCommission: 0,
        courierEarnings: params.totalFare,
        snapshotHash: params.snapshotHash.slice(0, 128),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(orderRef, {
        status: params.status,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('[Order Cloud Sync Fallback]', sanitizeFirebaseError(error, OperationType.WRITE), path.split('/')[0]);
  }
}

export async function syncBatchRouteToFirestore(params: {
  batchId: string;
  businessId: string;
  corridorName: string;
  packageCount: number;
  kmSavedPercent: number;
  status: 'READY' | 'DISPATCHED' | 'COMPLETED';
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;
  const safeId = params.batchId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const batchRef = doc(db, 'batch_routes', safeId);

  try {
    const snap = await getDoc(batchRef);
    if (!snap.exists()) {
      await setDoc(batchRef, {
        batchId: safeId,
        ownerId: user.uid,
        businessId: params.businessId.slice(0, 64),
        corridorName: params.corridorName.slice(0, 120),
        packageCount: Math.min(10, Math.max(2, params.packageCount)),
        kmSavedPercent: Math.min(90, Math.max(0, params.kmSavedPercent)),
        status: params.status,
        createdAt: serverTimestamp(),
      });
    } else {
      await updateDoc(batchRef, {
        status: params.status,
      });
    }
  } catch (error) {
    console.warn('[Batch Cloud Sync Fallback]', sanitizeFirebaseError(error, OperationType.WRITE));
  }
}

export async function syncWireNoticeToFirestore(params: {
  noticeId: string;
  businessId: string;
  wireReferenceCode: string;
  amountTl: number;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;
  const safeId = params.noticeId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const noticeRef = doc(db, 'wire_notices', safeId);

  try {
    const snap = await getDoc(noticeRef);
    if (!snap.exists()) {
      await setDoc(noticeRef, {
        noticeId: safeId,
        ownerId: user.uid,
        businessId: params.businessId.slice(0, 64),
        wireReferenceCode: params.wireReferenceCode.slice(0, 64),
        amountTl: Math.min(500000, Math.max(1, params.amountTl)),
        approvalStatus: 'PENDING',
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('[Wire Notice Cloud Sync Fallback]', sanitizeFirebaseError(error, OperationType.WRITE));
  }
}

export function subscribeToUserCloudOrders(
  userId: string,
  onData: (count: number) => void
): Unsubscribe {
  const q = query(collection(db, 'orders'), where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.size);
    },
    (error) => {
      console.warn('[Cloud Orders Subscription Fallback]', sanitizeFirebaseError(error, OperationType.LIST));
      onData(0);
    }
  );
}
