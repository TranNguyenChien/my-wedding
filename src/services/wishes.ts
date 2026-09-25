import type { Wish, WishFormData, WishSubmitResult } from "@/types/wishes";

export async function submitWish(data: WishFormData): Promise<WishSubmitResult> {
  try {
    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return { success: false, error: "Không thể gửi lời chúc, vui lòng thử lại." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Lỗi kết nối, vui lòng thử lại." };
  }
}

export async function fetchWishes(): Promise<Wish[]> {
  try {
    const res = await fetch("/api/wishes", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.wishes) ? data.wishes : [];
  } catch {
    return [];
  }
}
