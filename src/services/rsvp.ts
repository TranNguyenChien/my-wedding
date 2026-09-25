import type { RsvpFormData, RsvpResult } from "@/types/rsvp";

export async function submitRsvp(data: RsvpFormData): Promise<RsvpResult> {
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { success: false, error: "Không thể gửi phản hồi, vui lòng thử lại." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Lỗi kết nối, vui lòng thử lại." };
  }
}
