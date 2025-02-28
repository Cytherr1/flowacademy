import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./db"
import { schema } from "./schema"

const adapter = PrismaAdapter(db);

export const { auth, handlers, signIn, signOut } = NextAuth({ 
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {

        const validatedCredentials = schema.parse(credentials)

        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email,
            password: validatedCredentials.password
          }
        })
        if(!user) {
          throw new Error("Invalid credentials")
        }
        return user
      }
    })
]})