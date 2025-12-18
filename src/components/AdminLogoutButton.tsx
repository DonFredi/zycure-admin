"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    await firebaseSignOut(auth); // 🔥 Logout Firebase client
    await nextAuthSignOut({
      // 🔥 Logout NextAuth
      callbackUrl: "/login",
    });
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded">
      Logout
    </button>
  );
}
