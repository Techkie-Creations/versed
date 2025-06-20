import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const RegistrationSchema = toTypedSchema(
  z
    .object({
      firstName: z
        .string()
        .min(3, { message: "Must be at least 3 characters long." })
        .max(30, {
          message: "Cannot be more than 30 characters long.",
        }),
      lastName: z
        .string()
        .min(3, { message: "Must be at least 3 characters long." })
        .max(30, {
          message: "Cannot be more than 30 characters long.",
        }),
      email: z.string().email(),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .refine(
          (val) =>
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val),
          {
            message: "Should contain number, letters and symbols!",
          }
        ),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
      version: z.string(),
      book: z.string(),
      chapter: z.string(),
      verse: z.string(),
      avatar: z.instanceof(FileList, { message: "Invalid image format" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    })
);

export const LoginSchema = toTypedSchema(
  z.object({
    email: z.string({ message: "Email is required!" }).email(),
    password: z.string({ message: "Password is required!" }),
  })
);

export const ForgotPasswordSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    encryptedVerse: z.string(),
    verse: z.string(),
    book: z.string(),
    chapter: z.string(),
  })
);

export const passwordResetSchema = toTypedSchema(
  z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .refine(
          (val) =>
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val),
          {
            message: "Should contain number, letters and symbols!",
          }
        ),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    })
);
