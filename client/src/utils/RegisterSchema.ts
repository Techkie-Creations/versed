import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

const validationSchema = toTypedSchema(
  z
    .object({
      firstName: z
        .string()
        .min(3, { message: "First name must be at least 3 characters long." })
        .max(30, {
          message: "First name cannot be more than 30 characters long.",
        }),
      lastName: z
        .string()
        .min(3, { message: "Last name must be at least 3 characters long." })
        .max(30, {
          message: "Last name cannot be more than 30 characters long.",
        }),
      email: z.string().email(),
      username: z
        .string()
        .min(3, { message: "Last name must be at least 3 characters long." })
        .max(30, {
          message: "Last name cannot be more than 30 characters long.",
        })
        .default(""),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .refine(
          (val) =>
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val),
          {
            message:
              "Your Password should contain number, letters and symbols!",
          }
        ),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .refine(
          (val) =>
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val),
          {
            message:
              "Your Password should contain number, letters and symbols!",
          }
        ),
      version: z.string(),
      book: z
        .string()
        .refine((book) => book !== "Select Book", { message: "Required" }),
      chapter: z
        .string()
        .refine((chapter) => chapter !== "Select Chapter", {
          message: "Required",
        }),
      verse: z
        .string()
        .refine((verse) => verse !== "Select Verse", { message: "Required" }),
      avatar: z.instanceof(FileList, { message: "Invalid image format" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    })
);

export default validationSchema;
