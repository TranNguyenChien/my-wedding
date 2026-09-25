import type { Metadata } from "next";
import WeddingInvitation from "@/feature/invitation/components/wedding-invitation";
import { vuQuy } from "@/feature/invitation/content";

export const metadata: Metadata = {
  title: "Bảo Ngọc & Nguyên Chiến | Thiệp Cưới | Lễ Vu Quy",
  description:
    "Thiệp mời Lễ Vu Quy của Nguyễn Thị Bảo Ngọc và Trần Nguyên Chiến, ngày 26.10.2026 tại Quảng Trị.",
};

const LeVuQuyPage: React.FC = () => {
  return <WeddingInvitation content={vuQuy} />;
};

export default LeVuQuyPage;
