import { z } from "zod";
import { PaymentMethod } from "@/utils/types/checkout";
import { normalizePhoneNumber, validateEgyptianPhone } from "@/helper/auth";

export const createCheckoutSchema = (t: any) => {
  return z.object({
    full_name: z
      .string()
      .trim()
      .min(1, {
        message: t?.form?.fullNameRequired,
      })
      .min(3, {
        message: t?.form?.fullNameMin3,
      })
      .max(50, {
        message: t?.form?.fullNameMax50,
      })
      .regex(/^[A-Za-z\u0600-\u06FF\s]+$/, {
        message: t?.form?.fullNameLettersOnly,
      })
      .transform((val) => val.replace(/\s+/g, " ")),

    email: z
      .string()
      .trim()
      .min(1, {
        message: t?.form?.requiredEmail,
      })
      .email({
        message: t?.form?.requiredEmail,
      }),

    phone_number: z
      .string()
      .trim()
      .min(1, { message: t?.form?.requiredPhone})
      .superRefine(validateEgyptianPhone)
      .transform(normalizePhoneNumber),

    shipping_address: z.object({
      address: z
        .string()
        .trim()
        .min(1, {
          message: t?.form?.requiredAddress,
        }),

      governorate_id: z
        .number()
        .min(1, {
          message: t?.form?.requiredGovernorate,
        }),
      city_id: z
        .number()
        .min(1, {
          message: t?.form?.requiredCity,
        }),
    }),
    notes: z
      .string()
      .trim()
      .optional(),

    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: t?.form?.termsRequired,
      }),



    paymentMethod: z
      .nativeEnum(PaymentMethod, {
        error: t?.form?.paymentMethodRequired
      }),
    save_address: z.boolean().optional().default(true),
    coupon_code: z.string().trim().optional(),
  });
};

export type CheckoutSchemaType = ReturnType<typeof createCheckoutSchema>;
