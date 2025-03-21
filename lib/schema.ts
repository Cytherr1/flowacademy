import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Invalid password" }),
});

const signUpSchema = z.object({
  username: z.string().min(5, { message: "Username needs to be at least 5 characters long." }).max(12, { message: "Username cannot exceed 12 characters." }),
  email: z.string().email({ message: "Invalid email." }),
  password: z.string().min(8, { message: "Password needs to be between 8-14 characters long." }).max(14, { message: "Password needs to be between 8-14 characters long." }),
  confirmPassword: z.string().min(8, { message: "Passwords don't match" }),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});;

export { loginSchema, signUpSchema };
