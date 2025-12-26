import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { getAdminAuth } from "@/lib/firebaseAdmin";

/**
 * Firebase Auth REST login (SERVER SAFE)
 */
async function signInWithEmailPassword(email: string, password: string) {
  const apiKey = process.env.FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing FIREBASE_API_KEY");
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!res.ok) return null;
  return res.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Server-side login using Firebase REST API
          const login = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                returnSecureToken: true,
              }),
            }
          ).then((r) => (r.ok ? r.json() : null));

          if (!login?.localId) return null;

          // Check admin claim with Admin SDK
          const adminAuth = getAdminAuth();
          const adminUser = await adminAuth.getUser(login.localId);

          if (!adminUser.customClaims?.admin) return null;

          return { id: adminUser.uid, email: adminUser.email, admin: true };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  /**
   * 🔐 Session config
   */
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  /**
   * ✨ Persist admin flag
   */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.admin = (user as any).admin === true;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        admin: token.admin as boolean,
      };
      return session;
    },
  },

  /**
   * 🔁 Custom login page
   */
  pages: {
    signIn: "/login",
  },
};
