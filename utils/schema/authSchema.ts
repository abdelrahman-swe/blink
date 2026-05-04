import { normalizePhoneNumber, validateEgyptianPhone } from "@/helper/auth";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/* 🔐 Strong Password Rule                                                     */
/* At least 8 chars, 1 letter, 1 number, 1 special character                   */
/* -------------------------------------------------------------------------- */
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const passwordSchema = z
  .string()
  .min(1, { message: "passwordRequired" })
  .max(20, { message: "passwordMax20" })
  .regex(strongPasswordRegex, {
    message: "passwordMin8",
  });

export const checkIsEmail = (val: string) => /[a-zA-Z@]/.test(val);

export const getLoginSchema = () =>
  z.object({
    identifier: z
      .string()
      .trim()
      .min(1, { message: "phoneNumberRequired" })
      .superRefine((val, ctx) => {
        const isEmailLike = checkIsEmail(val);
        if (isEmailLike) {
            if (val.length > 50) {
               ctx.addIssue({ code: z.ZodIssueCode.custom, message: "emailMax50" });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
               ctx.addIssue({ code: z.ZodIssueCode.custom, message: "invalidEmail" });
            }
        } else {
            validateEgyptianPhone(val, ctx);
        }
      })
      .transform((val) => {
         if (checkIsEmail(val)) return val;
         return normalizePhoneNumber(val);
      }),
    password: passwordSchema,
    rememberMe: z.boolean().optional(),
  });

/* -------------------------------------------------------------------------- */
/* 🆕 Register                                                                 */
/* -------------------------------------------------------------------------- */
export const getRegisterSchema = () =>
  z
    .object({
      full_name: z
        .string()
        .min(1, { message: "fullNameRequired" })
        .min(3, { message: "fullNameMin3" })
        .max(50, { message: "fullNameMax50" })
        .regex(/^[A-Za-zأ-ي\s]+$/, {
          message: "fullNameLettersOnly",
        }),

      email: z
        .string()
        .min(1, { message: "emailRequired" })
        .max(50, { message: "emailMax50" })
        .email({ message: "invalidEmail" }),

      terms: z.boolean().refine((val) => val === true, {
        message: "termsRequired",
      }),

      phone: z
        .string()
        .trim()
        .min(1, { message: "phoneNumberRequired" })
        .superRefine(validateEgyptianPhone)
        .transform(normalizePhoneNumber),

      password: passwordSchema,

      password_confirmation: passwordSchema,
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "passwordsMismatch",
      path: ["password_confirmation"],
    });

/* -------------------------------------------------------------------------- */
/* 🔐 Verify Account (OTP)                                                     */
/* -------------------------------------------------------------------------- */
export const getVerifyAccountSchema = () =>
  z.object({
    identifier: z.string().min(1),
    otp: z
      .string()
      .length(6, { message: "otpLength" })
      .regex(/^[0-9]+$/, { message: "otpNumeric" }),
  });

/* -------------------------------------------------------------------------- */
/* 🔑 Forgot Password                                                          */
/* -------------------------------------------------------------------------- */
export const getForgotPasswordSchema = () =>
  z.object({
    identifier: z
      .string()
      .trim()
      .min(1, { message: "phoneNumberRequired" })
      .superRefine((val, ctx) => {
        const isEmailLike = checkIsEmail(val);
        if (isEmailLike) {
            if (val.length > 50) {
               ctx.addIssue({ code: z.ZodIssueCode.custom, message: "emailMax50" });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
               ctx.addIssue({ code: z.ZodIssueCode.custom, message: "invalidEmail" });
            }
        } else {
            validateEgyptianPhone(val, ctx);
        }
      })
      .transform((val) => {
         if (checkIsEmail(val)) return val;
         return normalizePhoneNumber(val);
      }),
  });

/* -------------------------------------------------------------------------- */
/* 🔢 Verify Code                                                              */
/* -------------------------------------------------------------------------- */
export const getVerifyCodeSchema = () =>
  z.object({
    otp: z
      .string()
      .length(6, { message: "otpLength" })
      .regex(/^[0-9]+$/, { message: "otpNumeric" }),
  });

/* -------------------------------------------------------------------------- */
/* 🔁 Reset Password                                                           */
/* -------------------------------------------------------------------------- */
export const getResetPasswordSchema = () =>
  z
    .object({
      new_password: passwordSchema,
      new_password_confirmation: passwordSchema,
      identifier: z.string().optional(),
    })
    .refine(
      (data) => data.new_password === data.new_password_confirmation,
      {
        message: "passwordsMismatch",
        path: ["new_password_confirmation"],
      }
    );
