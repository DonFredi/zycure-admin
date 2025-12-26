import admin from "firebase-admin";

let app: admin.app.App | undefined;

function assertEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin environment variables");
  }

  return { projectId, clientEmail, privateKey };
}

export function getAdminApp(): admin.app.App {
  if (app) return app;

  if (admin.apps.length) {
    app = admin.app();
    return app;
  }

  const { projectId, clientEmail, privateKey } = assertEnv();

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return app;
}

export const getAdminDb = () => getAdminApp().firestore();
export const getAdminAuth = () => getAdminApp().auth();
