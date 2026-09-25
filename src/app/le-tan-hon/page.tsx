import type { Metadata } from "next";
import WeddingInvitation from "@/feature/invitation/components/wedding-invitation";
import { tanHon } from "@/feature/invitation/content";

export const metadata: Metadata = {
  title: "Bảo Ngọc & Nguyên Chiến | Thiệp Cưới | Lễ Tân Hôn",
  description:
    "Thiệp mời Lễ Tân Hôn của Nguyên Chiến và Bảo Ngọc, ngày 29.10.2026 tại Lâm Đồng.",
};

const LeTanHonPage: React.FC = () => {
  return <WeddingInvitation content={tanHon} />;
};

export default LeTanHonPage;
