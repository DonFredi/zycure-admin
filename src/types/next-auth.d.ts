// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      admin?: boolean; // <-- add admin here
    };
  }

  interface User extends DefaultUser {
    admin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    admin?: boolean;
  }
}
