import "server-only";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

const adminConfig: FirebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cv-asia-plastik-attendance",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
};

function createFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // If private key and client email exist, authenticate with service account credentials
  if (adminConfig.privateKey && adminConfig.clientEmail && !adminConfig.privateKey.includes("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...")) {
    return initializeApp({
      credential: cert({
        projectId: adminConfig.projectId,
        clientEmail: adminConfig.clientEmail,
        privateKey: adminConfig.privateKey,
      }),
    });
  }

  // Fallback initialization for local development and build phases
  return initializeApp({
    projectId: adminConfig.projectId,
  });
}

export const isFirebaseAdminConfigured = Boolean(
  adminConfig.privateKey &&
  adminConfig.clientEmail &&
  !adminConfig.privateKey.includes("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...") &&
  !adminConfig.clientEmail.includes("xxxxx")
);

const adminApp = createFirebaseAdminApp();
const adminAuth: Auth = getAuth(adminApp);
const adminDb: Firestore = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
