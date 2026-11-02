import type { Metadata } from "next";
import WeddingInvitation from "@/feature/invitation/components/wedding-invitation";
import { baoHy } from "@/feature/invitation/content";

export const metadata: Metadata = {
  title: "Nguyên Chiến & Bảo Ngọc | Thiệp Cưới | Tiệc Báo Hỷ",
  description:
    "Thiệp mời Tiệc Báo Hỷ của Nguyên Chiến và Bảo Ngọc, 18:00 thứ Bảy 21.11.2026 tại Gold Palace, TP. Hồ Chí Minh.",
};

const HomePage: React.FC = () => {
  return <WeddingInvitation content={baoHy} />;
};

export default HomePage;
