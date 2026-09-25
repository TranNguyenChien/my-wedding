import type { Metadata } from "next";
import {
  beVietnamText,
  pinyonScript,
  playfairBody,
  yesevaTime,
} from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";
import EnvelopeGate from "@/feature/envelop/components/envelope-gate";

export const metadata: Metadata = {
  title: "Bảo Ngọc & Nguyên Chiến | Thiệp Cưới",
  description:
    "Thiệp mời cưới của Nguyễn Thị Bảo Ngọc & Trần Nguyên Chiến — 26.10.2026",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={cn(
        pinyonScript.variable,
        playfairBody.variable,
        yesevaTime.variable,
        beVietnamText.variable,
        "h-full antialiased",
      )}
    >
      <body>
        <main className="mx-auto flex min-h-full w-full max-w-lg flex-col">
          <EnvelopeGate>{children}</EnvelopeGate>
        </main>
      </body>
    </html>
  );
}
