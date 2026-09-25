import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().trim().optional(),
  attendance: z.enum(["yes", "no"]),
  guestCount: z.number().int().min(1, "Tối thiểu 1 khách"),
  message: z.string().trim(),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;

export interface RsvpResult {
  success: boolean;
  error?: string;
}
