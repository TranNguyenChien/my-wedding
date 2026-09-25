import type { InvitationContent } from "../types";
import { shared, storyUntil } from "./shared";

/** Lễ Tân Hôn — nhà trai, Lâm Đồng. */
export const tanHon: InvitationContent = {
  ...shared,
  eventName: "LỄ TÂN HÔN",
  dateIso: "2026-10-29",
  dateDots: "29 · 10 · 2026",
  dateShort: "29.10.2026",
  countdownTarget: "2026-10-29T09:40:00+07:00",
  region: "LÂM ĐỒNG · VIỆT NAM",

  heroImageOnly: true,
  images: { ...shared.images, hero: "/images/hero/hero-section.png" },

  schedule: [
    { key: "ceremony", label: "LỄ TÂN HÔN", value: "09:40" },
    { key: "reception", label: "TIỆC CƯỚI", value: "11:00" },
    {
      key: "date",
      label: "THỨ NĂM",
      value: "29.10.2026",
      note: "(Nhằm ngày 20 tháng 9 năm Bính Ngọ)",
    },
  ],

  venue: {
    name: "Nhà hàng tiệc cưới Tuấn Thảo",
    address: "Số 48, đường Xuân Diệu, xã Đức Lập, Tỉnh Lâm Đồng",
    mapUrl: "https://maps.app.goo.gl/d3FzydaBvUd5zVhz8",
  },

  story: storyUntil("29.10.2026"),
};
