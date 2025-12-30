import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { getAdminAuth } from "@/lib/firebaseAdmin"; // server-side only

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

        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (!apiKey) {
          console.error("Missing Firebase API key");
          return null;
        }

        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            returnSecureToken: true,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Firebase PROD auth error:", err);
          throw new Error("Firebase login failed");
        }

        const data = await res.json();

        const adminAuth = getAdminAuth();
        const adminUser = await adminAuth.getUser(data.localId);

        if (!adminUser.customClaims?.admin) {
          console.error("User is not admin");
          return null;
        }

        return {
          id: adminUser.uid,
          email: adminUser.email,
          admin: true,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.admin = (user as any).admin === true;
      return token;
    },

    async session({ session, token }) {
      session.user = { ...session.user, admin: token.admin as boolean };
      return session;
    },
  },

  pages: { signIn: "/login" },
};
