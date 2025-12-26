"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "./ui/button";

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    try {
      // Sign out NextAuth first (handles redirect)
      await nextAuthSignOut({ callbackUrl: "/login" });
    } catch (err) {
      console.error("NextAuth logout error:", err);
    }

    try {
      // Sign out Firebase client
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Firebase logout error:", err);
    }
  };

  return (
    <Button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded w-full">
      Logout
    </Button>
  );
}
