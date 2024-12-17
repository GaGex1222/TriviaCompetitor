import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    userId: string;
  }

  interface JWT extends DefaultJWT {
    userId?: string;
  }
}