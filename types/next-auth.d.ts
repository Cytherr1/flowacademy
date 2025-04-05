import { Quota } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role?: 'admin' | 'user'
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            username?: string | null
            quota?: Quota | null
        } & DefaultSession["user"]
    }
}