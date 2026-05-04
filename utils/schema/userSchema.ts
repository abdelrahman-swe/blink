import z from "zod";
import { normalizePhoneNumber, validateEgyptianPhone } from "@/helper/auth";



////////////////////////////////////////////////////
// SECURITY SETTINGS PROFILE
////////////////////////////////////////////////////


const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const passwordSchema = z
    .string()
    .min(1, { message: "passwordRequired" })
    .regex(strongPasswordRegex, {
        message: "passwordMin8",
    });



export const changePasswordSchema = () =>
    z
        .object({
            current_Password: passwordSchema,
            new_Password: passwordSchema,
            password_confirmation: passwordSchema,
        })
        .refine((data) => data.new_Password === data.password_confirmation, {
            message: "passwordsMismatch",
            path: ["password_confirmation"],
        });




export const deleteAccountSchema = () =>
    z.object({
        password: passwordSchema,
    });



////////////////////////////////////////////////////
// ACCOUNT PERSONAL INFORMATION PROFILE
////////////////////////////////////////////////////



export const ProfileInfoSchema = () =>
    z.object({
        full_name: z
            .string()
            .min(1, { message: "fullNameRequired" })
            .min(3, { message: "fullNameMin3" })
            .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
                message: "fullNameLetters",
            }),

        email: z
            .string()
            .min(1, { message: "emailRequired" })
            .email({ message: "invalidEmail" }),

        phone: z
            .string()
            .trim()
            .min(1, { message: "phoneNumberRequired" })
            .superRefine(validateEgyptianPhone)
            .transform(normalizePhoneNumber),

        avatar: z
            .instanceof(File)
            .optional()
            .refine(
                (file) =>
                    !file ||
                    ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
                        file.type
                    ),
                {
                    message: "avatarType",
                }
            ),
    });



export const verifyProfilePhoneSchema = () =>

    z.object({
        otp: z
            .string()
            .length(6, { message: "otpLength" })
            .regex(/^[0-9]+$/, { message: "otpNumeric" }),
    });


export const ProfileAddressSchema = () =>
    z.object({
        governorate_id: z
            .number()
            .min(1, { message: "governorateRequired" }),

        city_id: z
            .number()
            .min(1, { message: "cityRequired" }),

        address: z
            .string()
            .min(5, { message: "addressMin5" })
            .min(1, { message: "addressRequired" }),

        // phone: z
        //     .string()
        //     .trim()
        //     .min(1, { message: "addressPhoneRequired" })
        //     .superRefine(validateEgyptianPhone)
        //     .transform(normalizePhoneNumber),

        label: z
            .string()
            .min(1, { message: "addressLabelRequired" }),
    });
