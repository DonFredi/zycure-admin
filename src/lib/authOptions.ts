import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { auth } from "@/lib/firebase"; // Firebase client SDK
import { getAdminAuth } from "@/lib/firebaseAdmin"; // Firebase Admin SDK
import { signInWithEmailAndPassword } from "firebase/auth";

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
          // 🔹 Sign in using Firebase client SDK
          const userCred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);

          // 🔹 Fetch user details via Admin SDK to check custom claims
          const adminAuth = getAdminAuth();
          const adminUser = await adminAuth.getUser(userCred.user.uid);

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

  // 🔐 Session config
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, // REQUIRED in production

  // 🔁 Persist admin flag
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

  // 🔑 Custom login page
  pages: { signIn: "/login" },
};
