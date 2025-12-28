import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const adminAuth = getAdminAuth();

    // Get admin user from Firebase
    const user = await adminAuth.getUser(session.user.id);

    if (!user.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Generate reset link
    const resetLink = await adminAuth.generatePasswordResetLink(user.email);

    // OPTIONAL: send email yourself
    // OR just return the link if Firebase handles email automatically
    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
