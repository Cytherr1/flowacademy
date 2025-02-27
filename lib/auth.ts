import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { auth, handlers } = NextAuth({ providers: [
	Google,
	Credentials({
		credentials: {
			email: {},
			password: {}
		},
		authorize: async (credentials) => {
			// tam olarak bu kısımda axiosla dbden asıl kullanıcı bilgileri gelecek
			const email = "ugur@email.com"
			const password = "12345"

			if (credentials.email === email && credentials.password === password) {
				return {email, password}
			} else {
				throw new Error("Invalid credentials")
			}
		}
	})
] })