import { z } from "zod";

/** Trang thiệp gửi RSVP — quyết định sheet ghi vào (xem scripts/google-apps-script.js). */
export const rsvpEvents = ["le-vu-quy", "le-tan-hon"] as const;
export type RsvpEvent = (typeof rsvpEvents)[number];

/** Giới hạn số khách mỗi lời xác nhận (bộ đếm trên form kẹp theo giá trị này). */
export const MAX_GUESTS = 10;

export const rsvpSchema = z.object({
  event: z.enum(rsvpEvents),
  name: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().trim().optional(),
  attendance: z.enum(["yes", "no"]),
  guestCount: z
    .number()
    .int()
    .min(1, "Tối thiểu 1 khách")
    .max(MAX_GUESTS, `Tối đa ${MAX_GUESTS} khách`),
  message: z.string().trim(),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;

export interface RsvpResult {
  success: boolean;
  error?: string;
}
