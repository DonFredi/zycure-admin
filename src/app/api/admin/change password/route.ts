import { getAdminAuth } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    const body: ChangePasswordRequest = await req.json();

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const adminAuth = getAdminAuth();

    // ✅ Fetch current user info
    const adminUser = await adminAuth.getUser(session.user.id);

    // 🔹 Verify current password using Firebase REST API
    const apiKey = process.env.FIREBASE_API_KEY;
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminUser.email,
          password: currentPassword,
          returnSecureToken: true,
        }),
      }
    );

    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: "Current password is incorrect" }), { status: 401 });
    }

    // 🔹 Update password using Admin SDK
    await adminAuth.updateUser(adminUser.uid, { password: newPassword });

    return new Response(JSON.stringify({ message: "Password updated successfully" }), { status: 200 });
  } catch (err) {
    console.error("Change password error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
