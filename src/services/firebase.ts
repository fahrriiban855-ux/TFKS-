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
  setDoc,
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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot as required by firebase-integration-rpc skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'users_public', 'connection_probe'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Permission denied on probe means online connection to Firestore succeeded
    return true;
  }
}

testFirestoreConnection();

export async function signInWithGooglePopup(): Promise<User | null> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  if (user && user.emailVerified) {
    const publicPath = `users_public/${user.uid}`;
    const privatePath = `users_private/${user.uid}`;
    try {
      await setDoc(
        doc(db, 'users_public', user.uid),
        {
          uid: user.uid,
          displayName: (user.displayName || 'MotoPilot Kullanıcı').slice(0, 100),
          activeRole: 'CUSTOMER',
          hybridModeEnabled: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, publicPath);
    }

    try {
      await setDoc(
        doc(db, 'users_private', user.uid),
        {
          uid: user.uid,
          email: (user.email || 'user@motopilot.com.tr').slice(0, 160),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, privatePath);
    }
  }
  return user;
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
  try {
    await setDoc(doc(db, 'orders', safeId), {
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
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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
  const path = `batch_routes/${safeId}`;
  try {
    await setDoc(doc(db, 'batch_routes', safeId), {
      batchId: safeId,
      ownerId: user.uid,
      businessId: params.businessId.slice(0, 64),
      corridorName: params.corridorName.slice(0, 120),
      packageCount: Math.min(10, Math.max(2, params.packageCount)),
      kmSavedPercent: Math.min(90, Math.max(0, params.kmSavedPercent)),
      status: params.status,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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
  const path = `wire_notices/${safeId}`;
  try {
    await setDoc(doc(db, 'wire_notices', safeId), {
      noticeId: safeId,
      ownerId: user.uid,
      businessId: params.businessId.slice(0, 64),
      wireReferenceCode: params.wireReferenceCode.slice(0, 64),
      amountTl: Math.min(500000, Math.max(1, params.amountTl)),
      approvalStatus: 'PENDING',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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
      handleFirestoreError(error, OperationType.LIST, 'orders');
    }
  );
}
