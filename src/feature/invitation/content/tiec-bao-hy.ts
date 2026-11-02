import type { InvitationContent } from "../types";
import { groomFirst, shared, storyUntil } from "./shared";

/** Tiệc Báo Hỷ — tiệc tối tại TP. Hồ Chí Minh, sau hai lễ ở quê. */
export const baoHy: InvitationContent = {
  ...shared,
  ...groomFirst,
  eventName: "TIỆC BÁO HỶ",
  rsvpEvent: "tiec-bao-hy",
  audioSrc: "/audio/le-tan-hon.mp3",
  dateIso: "2026-11-21",
  dateDots: "21 · 11 · 2026",
  dateShort: "21.11.2026",
  countdownTarget: "2026-11-21T18:00:00+07:00",
  region: "TP. HỒ CHÍ MINH · VIỆT NAM",
  countdownTitle: "ĐẾN TIỆC BÁO HỶ",
  welcomeOccasion: "tiệc báo hỷ",

  schedule: [
    { key: "reception", label: "TIỆC BÁO HỶ", value: "18:00" },
    {
      key: "date",
      label: "THỨ BẢY",
      value: "21.11.2026",
      note: "(Nhằm ngày 13 tháng 10 năm Bính Ngọ)",
    },
  ],

  /** TODO: thêm tên sảnh khi nhà hàng xác nhận; thay `mapUrl` bằng link share nếu có. */
  venue: {
    name: "Trung tâm Hội nghị Tiệc cưới Gold Palace",
    address: "329 Nơ Trang Long, Phường Bình Lợi Trung, TP. Hồ Chí Minh",
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      "Gold Palace, 329 Nơ Trang Long, TP. Hồ Chí Minh",
    )}`,
    website: "https://goldpalace.com.vn",
  },

  party: {
    endsAt: "2026-11-21T21:00:00+07:00",
    photo: "/images/gallery/TH_02177.jpg",
  },

  sibling: {
    href: "/le-tan-hon",
    eventName: "Lễ Tân Hôn",
    dateShort: "29.10.2026",
    place: "Lâm Đồng",
  },

  story: storyUntil("21.11.2026"),
};
