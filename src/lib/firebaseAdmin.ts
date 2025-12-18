import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// Use require for JSON
const serviceAccount = require("../adminSetup/serviceAccountKey.json") as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
