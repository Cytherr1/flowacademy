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
      name: formData.get("name") !== "" ? formData.get("name") as string : user?.name as string,
			username: formData.get("username") !== "" ? formData.get("username") as string : user?.username as string,
      image: formData.get("image") !== "" ? formData.get("image") as string : user?.image as string,
			password: formData.get("password") !== "" ? await hash(formData.get('password') as string, salt) : user?.password
		}
	})
}

export const createUser = async ( formData: FormData ) => {
  const salt = await genSalt(10);
  const userUsername = await db.user.findFirst({
    where: {
      username: formData.get("username") as string
    }
  })
  const userEmail = await db.user.findFirst({
    where: {
      email: formData.get("email") as string
    }
  })

  if (!userUsername && !userEmail) {
    await db.user.create({
      data: {
        username: formData.get("username") as string,
        email: formData.get('email') as string, 
        password: await hash(formData.get('password') as string, salt)
      }
    })
  } else if (!userUsername && userEmail) {
    throw new Error("This email already in use.")
  } else if (userUsername && !userEmail) {
    throw new Error("This username already in use.")
  } else {
    throw new Error("This email and username already in use.")
  }
}