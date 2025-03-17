import NextAuth from "next-auth"
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./db"
import { loginSchema } from "./schema";

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

        const validatedCredentials = loginSchema.parse(credentials)

        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email,
            password: validatedCredentials.password
          }
        })
        if(!user) {
          throw new Error("Invalid credentials")
        }

        const userSession = await db.session.findFirst({
          where: {
            user: user
          }
        })
        
        if(userSession) {
          await db.session.delete({ where: { id: userSession.id }})
        }
        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  }
})