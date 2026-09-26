import { site } from "@/constants/site";
import type { InvitationContent } from "../types";
import { brideFirst, shared, storyUntil } from "./shared";

/** Lễ Vu Quy — nhà gái, Quảng Trị. Thông tin lấy theo `site.le_vu_quy_*`. */
export const vuQuy: InvitationContent = {
  ...shared,
  ...brideFirst,
  eventName: "LỄ VU QUY",
  dateIso: "2026-10-26",
  dateDots: "26 · 10 · 2026",
  dateShort: "26.10.2026",
  countdownTarget: site.le_vu_quy_ceremony.dateTime,
  region: "QUẢNG TRỊ · VIỆT NAM",

  schedule: [
    { key: "ceremony", label: "LỄ VU QUY", value: "08:00" },
    { key: "reception", label: "TIỆC CƯỚI", value: "10:30" },
    {
      key: "date",
      label: "THỨ HAI",
      value: "26.10.2026",
      note: "(Nhằm ngày 17 tháng 9 năm Bính Ngọ)",
    },
  ],

  venue: {
    name: site.le_vu_quy_reception.venueName,
    address: site.le_vu_quy_reception.venueAddress,
    mapUrl: "https://maps.app.goo.gl/uAqTzF8tpDsHjv2i7",
  },

  story: storyUntil("26.10.2026"),
};
