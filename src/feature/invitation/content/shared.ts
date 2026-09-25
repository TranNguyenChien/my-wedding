import { site } from "@/constants/site";
import type { InvitationContent } from "../types";

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

/**
 * Phần giống nhau giữa hai trang. Tên cô dâu / chú rể lấy từ `site` để các
 * trang không lệch nhau.
 */
export const shared = {
  groomName: site.groom.shortName,
  brideName: site.bride.shortName,
  monogram: { groom: "C", bride: "N" },
  audioSrc: "/audio/le-tan-hon.mp3",

  images: {
    hero: "/images/gallery/CN0091.jpg",
    couple: "/images/gallery/CN0123.jpg",
    sunset: "/images/gallery/TH_02374.jpg",
    venue: "/images/wedding/tan-hon-venue-v2.png",
    giftBox: "/images/wedding/wedding-gift-box.png",
    ending: "/images/gallery/TH_02472.jpg",
    storyLine: "/images/icons/line.png",
  },

  profiles: [
    {
      role: "CHÚ RỂ",
      name: site.groom.shortName,
      bio: "Là người luôn ở bên, chọn yêu thương mỗi ngày và cùng em đi hết những hành trình phía trước.",
    },
    {
      role: "CÔ DÂU",
      name: site.bride.shortName,
      bio: "Là cô gái tin vào những điều dịu dàng, và may mắn vì luôn có anh đồng hành trong từng khoảnh khắc.",
    },
  ],

  album: GALLERY_PHOTOS.map((file, i) => ({
    src: `/images/gallery/${file}`,
    alt: `Ảnh cưới của Chiến và Ngọc (${i + 1})`,
    caption: ALBUM_CAPTIONS[i],
  })),

  /**
   * TODO: thay `qr` bằng đường dẫn ảnh QR thật (vd. "/images/qr-groom.png")
   * và điền ngân hàng / số tài khoản trước khi phát hành.
   */
  giftRecipients: [
    {
      key: "groom",
      tab: "Chú rể",
      role: "CHÚ RỂ",
      name: site.groom.shortName,
      bank: "Đang cập nhật",
      account: "XXXXXXXXXXXX",
      qr: null,
    },
    {
      key: "bride",
      tab: "Cô dâu",
      role: "CÔ DÂU",
      name: site.bride.shortName,
      bank: "Đang cập nhật",
      account: "XXXXXXXXXXXX",
      qr: null,
    },
  ],
} satisfies Partial<InvitationContent>;

/** Các mốc Love Story; mốc cuối là ngày cưới của từng trang. */
export const storyUntil = (weddingDate: string): InvitationContent["story"] => [
  {
    date: "12.03.2022",
    title: "Lần đầu gặp gỡ",
    text: "Một cuộc gặp gỡ tình cờ, nhưng lại là khởi đầu cho tất cả.",
    step: 0.04,
  },
  {
    date: "20.08.2023",
    title: "Cùng nhau trưởng thành",
    text: "Đi qua nhiều hành trình, ở lại vì cùng nhìn về một hướng.",
    step: 0.3,
  },
  {
    date: "14.02.2025",
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
