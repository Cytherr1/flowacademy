"use server";

import { Session } from "next-auth";
import db from "../db";
import { genSalt, hash } from "bcrypt-ts"

export const editUser = async ( formData: FormData, session: Session ) => {
	const salt = await genSalt(10);
  const user = await db.user.findFirst({
    where: {
      id: session.user?.id
    }
  })

	await db.user.update({
		where: {
      id: user?.id
		},
		data: {
      name: (formData.get("name") ?? user?.name) as string,
			username: (formData.get("username") ?? user?.username) as string,
      image: (formData.get("image") ?? user?.image) as string,
			password: formData.get("password") !== null ? await hash(formData.get('password') as string, salt) : user?.password
		}
	})
}