import { z } from "zod";

export const wishSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên"),
  message: z.string().trim().min(1, "Vui lòng nhập lời chúc"),
});

export type WishFormData = z.infer<typeof wishSchema>;

export interface Wish extends WishFormData {
  timestamp: string;
}

export interface WishSubmitResult {
  success: boolean;
  error?: string;
}
