import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { db } from "./db/index"
import { usersTable } from "./db/schema"
import { eq } from "drizzle-orm"


 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  callbacks: {
    async signIn({user}){
      if(user.email){
        console.log("Email exists in session")
        const userExists = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.email));
        console.log(userExists)
  
        if(userExists.length === 0){
          console.log("User doesn't exist in the database, adding hjim")
          const today = new Date()
          const formattedDate = today.toISOString().split('T')[0];
          await db.insert(usersTable).values({
            email: user.email as string,
            username: user.name as string,
            createdAt: formattedDate
          })
        }
      }
      return true
    },
    
    async jwt({user, token}){
      if(user){
        const userQuery = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.email as string));
        if(userQuery.length > 0){
          const userId = userQuery[0]['id']
          token.userId = userId
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Make additional token fields available in the session
      session.userId = String(token.userId);
      return session;
    },


  }
})
