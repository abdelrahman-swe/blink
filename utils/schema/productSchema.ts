import { z } from "zod";

export const getReviewSchema = (t?: any) =>
  z.object({
    product_slug: z
      .string()
      .min(1, { message: "Product slug is required" }),

    rating: z
      .number()
      .min(1, { message: t?.reviews?.validation?.ratingRequired }),

    body: z
      .string()
      .trim()
      .min(10, { message: t?.reviews?.validation?.bodyMin })
      .max(500, { message: t?.reviews?.validation?.bodyMax })
      .optional()
      .or(z.literal("")),
  });


export const getReturnSchema = () =>
  z.object({
    items: z.array(z.object({
      order_item_id: z.number(),
      quantity: z.number().min(1)
    })).min(1, { message: "productRequired" }),

    reason: z
      .string()
      .min(1, { message: "reasonRequired" }),

    description: z
      .string()
      .max(250, { message: "descMax" })
      .optional(),

    images: z
      .array(z.any())
      .min(1, { message: "imageRequired" })
      .max(8, { message: "maxFiles" })
      .refine(
        (files) => {
          const allowedExtensions = ["jpeg", "png", "jpg", "webp", "mp4", "qt", "mov", "avi"];
          return files.every((item) => {
            const file = item.file as File;
            const extension = file.name.split(".").pop()?.toLowerCase();
            return extension && allowedExtensions.includes(extension);
          });
        },
        { message: "invalidFormat" }
      )
      .refine(
        (files) => {
          const imgExts = ["jpeg", "png", "jpg", "webp"];
          const videoExts = ["mp4", "qt", "mov", "avi"];
          const MAX_IMG_SIZE = 5 * 1024 * 1024;
          const MAX_VIDEO_SIZE = 20 * 1024 * 1024;

          return files.every((item) => {
            const file = item.file as File;
            const extension = file.name.split(".").pop()?.toLowerCase() || "";
            if (imgExts.includes(extension)) {
              return file.size <= MAX_IMG_SIZE;
            }
            if (videoExts.includes(extension)) {
              return file.size <= MAX_VIDEO_SIZE;
            }
            return true;
          });
        },
        { message: "fileSizeLimit" }
      ),
  }).refine((data) => {
    if (data.reason === "other" && (!data.description || data.description.trim().length < 5)) {
      return false;
    }
    return true;
  }, {
    message: "descMinOther",
    path: ["description"],
  });