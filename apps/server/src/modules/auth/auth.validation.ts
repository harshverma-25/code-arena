import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .trim()
      .email("Invalid email format"),
    username: z
      .string()
      .min(1, "Username is required")
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .trim()
      .email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
