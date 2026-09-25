import { wishSchema } from "@/types/wishes";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = wishSchema.safeParse(body);

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
    body: JSON.stringify({ type: "wish", ...parsed.data }),
  });

  if (!webhookRes.ok) {
    return Response.json(
      { success: false, error: "Không thể gửi lời chúc" },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}

export async function GET() {
  const webhookUrl = process.env.RSVP_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ wishes: [] });
  }

  const webhookRes = await fetch(`${webhookUrl}?type=wish`, {
    cache: "no-store",
  });

  if (!webhookRes.ok) {
    return Response.json({ wishes: [] });
  }

  const data = await webhookRes.json();
  return Response.json({ wishes: data.wishes ?? [] });
}
