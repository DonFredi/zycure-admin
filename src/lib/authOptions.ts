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

        try {
          const { email, password } = credentials;

          // 🔹 Use Firebase REST API to verify email/password server-side
          const apiKey = process.env.FIREBASE_API_KEY;
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
              }),
            }
          );

          if (!res.ok) return null; // invalid credentials

          const data = await res.json(); // contains idToken & localId

          // 🔹 Fetch user info from Admin SDK
          const adminAuth = getAdminAuth();
          const adminUser = await adminAuth.getUser(data.localId);

          // 🔹 Check if user has admin claim
          if (!adminUser.customClaims?.admin) return null;

          return {
            id: adminUser.uid,
            email: adminUser.email,
            admin: true,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
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
