import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Invalid password' })
});

export { loginSchema }