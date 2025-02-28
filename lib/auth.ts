import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { pool } from "./db/db"

export const { auth, handlers, signIn } = NextAuth({ providers: [
	Google,
	Credentials({
		credentials: {
			email: {},
			password: {}
		},
		authorize: async (credentials) => {
      const email = "ugur@mail.com"
      const password = "12345"
      
      if ( credentials.email === email && credentials.password === password ) {
        return { email, password }
      } else {
        throw new Error("Invalid credentials")
      }
		}
	})
]})