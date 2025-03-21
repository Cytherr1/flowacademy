"use server";

import { signIn, signOut } from "../auth";
import db from "../db";
import { genSalt, hash } from "bcrypt-ts"

export const userLogin = async ( formData: FormData ) => {
	await signIn("credentials", { email: formData.get('email'), password: formData.get('password'), redirectTo: "/workspace"});
}

export const googleLogin = async () => {
	await signIn("google", { redirectTo: "/workspace" });
}

export const logout = async () => {
	await signOut({ redirectTo: "/" });
}

export const register = async ( formData: FormData ) => {
	const salt = await genSalt(10);

	await db.user.create({
		data: {
			username: formData.get("username") as string,
			email: formData.get('email') as string, 
			password: await hash(formData.get('password') as string, salt)
		}
	})

	await userLogin(formData)
}