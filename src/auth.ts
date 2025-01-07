import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Define the authOptions for NextAuth
export const {handlers, signIn, signOut, auth }  = NextAuth({
  providers: [
    Google,
    GitHub,
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("USER IN SIGN IN", user);

      if (user.name) {
        const userExists = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, user.email));

        if (userExists.length === 0) {
          const today = new Date();
          const formattedDate = today.toISOString().split("T")[0];
          await db.insert(usersTable).values({
            email: user.email,
            username: user.name,
            profileUrl: user.image,
            createdAt: formattedDate,
            points: 0,
          });
        }
      }
      return true;
    },

    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update'){
        return { ...token, ...session.user }
      }
      if (user) {
        const userQuery = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, user.email));

        if (userQuery.length > 0) {
          const userData = userQuery[0];
          token.userId = userData.id;
          token.name = userData.username;
          token.image = userData.profileUrl;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.userId = String(token.userId);
      session.user.name = token.name as string;
      session.user.image = token.image as string;
      return session;
    },
  },
});

