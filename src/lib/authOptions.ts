import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "./firebase"; // client SDK
import { adminAuth } from "./firebaseAdmin"; // admin SDK
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const userCred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);

          const adminUser = await adminAuth.getUser(userCred.user.uid);

          const isAdmin = adminUser.customClaims?.admin === true;

          if (!isAdmin) return null;

          return {
            id: adminUser.uid,
            email: adminUser.email,
            admin: true,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  // ✨ ADD THIS SECTION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.admin = user.admin; // store admin flag
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        admin: token.admin, // expose admin to frontend
      };
      return session;
    },
  },

  pages: { signIn: "/login" },
};
