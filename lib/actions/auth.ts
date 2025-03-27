"use server";

import { signIn, signOut } from "../auth";
import { executeAction } from "../executeAction";
import { createUser } from "./user";

export const userLogin = async ( formData: FormData ) => {
	return executeAction({
		actionFn: async () => await signIn("credentials", { email: formData.get('email'), password: formData.get('password'), redirectTo: "/workspace"}),
		successMessage: "Signed in successfully."
	}) 
}

export const googleLogin = async () => {
  return executeAction({
		actionFn: async () => await signIn("google", { redirectTo: "/workspace" }),
		successMessage: "Signed in successfully."
	}) 
}

export const logout = async () => {
  return executeAction({
		actionFn: async () => await signOut({ redirectTo: "/" }),
		successMessage: "Signed out successfully."
	})
}

export const register = async ( formData: FormData ) => {
	return executeAction({
    actionFn: async () => {
      await createUser(formData)
		  await userLogin(formData)
    },
    successMessage: "User created succesfully"
  })
	
}