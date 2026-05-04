import { z } from "zod";

export const validateEgyptianPhone = (val: string, ctx: z.RefinementCtx) => {
  const digitsOnly = val.replace(/\D/g, "");

  if (digitsOnly.length > 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "phoneTooLong",
    });
    return;
  }

  if (digitsOnly.length === 11) {
    if (!digitsOnly.startsWith("0")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "phoneMustStartWithZero",
      });
      return;
    }

    const trimmed = digitsOnly.substring(1);

    if (!/^1[0-9]{9}$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "phoneInvalidAfterZero",
      });
    }
    return;
  }

  if (digitsOnly.length === 10) {
    if (!digitsOnly.startsWith("1")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "phoneMustStartWithOne",
      });
    }
    return;
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "phoneTooShort",
  });

};

export const normalizePhoneNumber = (val: string) => {
  const digitsOnly = val.replace(/\D/g, "");
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return digitsOnly.substring(1);
  }
  return digitsOnly;
};
