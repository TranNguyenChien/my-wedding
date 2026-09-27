import { rsvpSchema } from "@/types/rsvp";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = rsvpSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { success: false, error: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.RSVP_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json(
      { success: false, error: "Chưa cấu hình máy chủ" },
      { status: 500 },
    );
  }

  const webhookRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  // Apps Script always answers 200, so failures only show up in the body.
  const text = await webhookRes.text();
  let result: { success?: boolean } | null = null;
  try {
    result = JSON.parse(text);
  } catch {}
  if (!webhookRes.ok || !result?.success) {
    console.error("[rsvp] webhook failed", webhookRes.status, text.slice(0, 500));
    return Response.json(
      { success: false, error: "Không thể gửi phản hồi" },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
