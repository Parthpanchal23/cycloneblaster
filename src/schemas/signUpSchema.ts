import { z } from "zod";
export const usernameValidation = z
  .string()
  .min(2, '"Username must be 2 characters')
  .max(20, "Usernaem mustbe no more than characters")
  .regex(/^[a-zA-Z0-9_]+$/, "User name must not contain special character");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 character" }),
});
