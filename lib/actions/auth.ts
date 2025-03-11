"use server";

import { signIn, signOut } from "../auth";

export const userLogin = async (formData: FormData) => {
	await signIn("credentials", { email: formData.get('email'), password: formData.get('password'), redirectTo: "/"});
}

export const googleLogin = async () => {
	await signIn("google", { redirectTo: "/" });
}

export const logout = async () => {
	await signOut({ redirectTo: "/" });
}