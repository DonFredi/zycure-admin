import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

let app: admin.app.App;

function initAdmin() {
  if (!app) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase Admin environment variables");
    }

    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return app;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const adminApp = initAdmin();
    const auth = adminApp.auth();

    // ✅ Generate password reset link
    const link = await auth.generatePasswordResetLink(email);

    return NextResponse.json({ success: true, link });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: err.message || "Failed to send reset email" }, { status: 500 });
  }
}
