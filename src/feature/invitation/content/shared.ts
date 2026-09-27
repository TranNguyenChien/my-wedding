import { site } from "@/constants/site";
import type { GiftRecipient, InvitationContent } from "../types";

/** Ảnh trong `public/images/gallery/`, theo thứ tự hiển thị ở Album. */
const GALLERY_PHOTOS = [
  "CN0091.jpg",
  "CN0113.jpg",
  "CN0123.jpg",
  "CN0163.jpg",
  "CN0204.jpg",
  "CN0259.jpg",
  "CN0285.jpg",
  "CN0319.jpg",
  "CN0333.jpg",
  "CN0353.jpg",
  "TH_01367.jpg",
  "TH_01596.jpg",
  "TH_01634.jpg",
  "TH_01781.jpg",
  "TH_01811.jpg",
  "TH_01888.jpg",
  "TH_01913.jpg",
  "TH_01948.jpg",
  "TH_01950.jpg",
  "TH_02036.jpg",
  "TH_02125.jpg",
  "TH_02159.jpg",
  "TH_02167.jpg",
  "TH_02177.jpg",
  "TH_02309.jpg",
  "TH_02324.jpg",
  "TH_02374.jpg",
  "TH_02425.jpg",
  "TH_02452.jpg",
  "TH_02472.jpg",
];

/** Chú thích cho vài ảnh đầu; các ảnh sau chỉ hiện số thứ tự. */
const ALBUM_CAPTIONS: (string | undefined)[] = [
  "Ngày mình bên nhau",
  "Chung một hành trình",
  "Dịu dàng bên nhau",
  "Những điều nhỏ xinh",
  "Một đời thương nhớ",
];

const GROOM_PROFILE = {
  role: "CHÚ RỂ",
  name: site.groom.shortName,
  bio: "Là người luôn ở bên, chọn yêu thương mỗi ngày và cùng em đi hết những hành trình phía trước.",
};

const BRIDE_PROFILE = {
  role: "CÔ DÂU",
  name: site.bride.shortName,
  bio: "Là cô gái tin vào những điều dịu dàng, và may mắn vì luôn có anh đồng hành trong từng khoảnh khắc.",
};

/**
 * TODO: thay `qr` bằng đường dẫn ảnh QR thật (vd. "/images/qr-groom.png")
 * và điền ngân hàng / số tài khoản trước khi phát hành.
 */
const GROOM_GIFT: GiftRecipient = {
  key: "groom",
  tab: "Chú rể",
  role: "CHÚ RỂ",
  name: site.groom.shortName,
  bank: "Vietcombank",
  account: "9355645006",
  qr: "https://img.vietqr.io/image/VCB-9355645006-qr_only.png",
};

const BRIDE_GIFT: GiftRecipient = {
  key: "bride",
  tab: "Cô dâu",
  role: "CÔ DÂU",
  name: site.bride.shortName,
  bank: "Vietcombank",
  account: "0171003469287",
  qr: "https://img.vietqr.io/image/VCB-0171003469287-qr_only.png",
};

/** Chú rể đứng trước — dùng cho Lễ Tân Hôn (nhà trai). */
export const groomFirst = {
  firstName: site.groom.shortName,
  secondName: site.bride.shortName,
  monogram: { first: "C", second: "N" },
  profiles: [GROOM_PROFILE, BRIDE_PROFILE],
  giftRecipients: [GROOM_GIFT, BRIDE_GIFT],
} satisfies Partial<InvitationContent>;

/** Cô dâu đứng trước — dùng cho Lễ Vu Quy (nhà gái). */
export const brideFirst = {
  firstName: site.bride.shortName,
  secondName: site.groom.shortName,
  monogram: { first: "N", second: "C" },
  profiles: [BRIDE_PROFILE, GROOM_PROFILE],
  giftRecipients: [BRIDE_GIFT, GROOM_GIFT],
} satisfies Partial<InvitationContent>;

/**
 * Phần giống nhau giữa hai trang. Tên cô dâu / chú rể lấy từ `site` để các
 * trang không lệch nhau; thứ tự tên do từng trang chọn (`groomFirst` /
 * `brideFirst`).
 */
export const shared = {
  images: {
    hero: "/images/gallery/CN0113.jpg",
    couple: "/images/gallery/CN0123.jpg",
    sunset: "/images/gallery/TH_02374.jpg",
    venue: "/images/wedding/tan-hon-venue-v2.png",
    giftBox: "/images/wedding/wedding-gift-box.png",
    ending: "/images/gallery/TH_02472.jpg",
    storyLine: "/images/icons/line.png",
  },

  album: GALLERY_PHOTOS.map((file, i) => ({
    src: `/images/gallery/${file}`,
    alt: `Ảnh cưới của Chiến và Ngọc (${i + 1})`,
    caption: ALBUM_CAPTIONS[i],
  })),
} satisfies Partial<InvitationContent>;

export const storyUntil = (weddingDate: string): InvitationContent["story"] => [
  {
    date: "01.01.2024",
    title: "Lần đầu gặp gỡ",
    text: "Một cuộc gặp gỡ tình cờ, nhưng lại là khởi đầu cho tất cả.",
    step: 0.04,
  },
  {
    date: "17.05.2025",
    title: "Cùng nhau trưởng thành",
    text: "Đi qua nhiều hành trình, ở lại vì cùng nhìn về một hướng.",
    step: 0.3,
  },
  {
    date: "24.08.2026",
    title: "Anh ngỏ lời, em nói đồng ý",
    text: "Một lời hẹn ước được viết nên từ những điều bình dị.",
    step: 0.58,
  },
  {
    date: weddingDate,
    title: "Về chung một nhà",
    text: "Từ hai cá thể, nay là một hành trình với chung một mục tiêu.",
    step: 0.84,
  },
];
