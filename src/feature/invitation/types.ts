import type { RsvpEvent } from "@/types/rsvp";

export type ScheduleKey = "ceremony" | "reception" | "date";

export interface GiftRecipient {
  key: string;
  tab: string;
  role: string;
  name: string;
  bank: string;
  account: string;
  qr: string | null;
}

/**
 * Nội dung của một trang thiệp (Lễ Tân Hôn / Lễ Vu Quy). Hai trang dùng chung
 * bộ component, chỉ khác dữ liệu truyền vào qua `InvitationProvider`.
 */
export interface InvitationContent {
  /** Tên buổi lễ hiện ở màn thư, vd. "LỄ TÂN HÔN". */
  eventName: string;
  /** RSVP của trang này ghi vào sheet riêng theo giá trị này. */
  rsvpEvent: RsvpEvent;
  /**
   * Tên theo thứ tự hiển thị: Tân Hôn (nhà trai) chú rể trước, Vu Quy (nhà
   * gái) cô dâu trước. `profiles` và `giftRecipients` cũng theo thứ tự này.
   */
  firstName: string;
  secondName: string;
  monogram: { first: string; second: string };
  dateIso: string;
  dateDots: string;
  dateShort: string;
  /** Mốc đếm ngược — giờ làm lễ. */
  countdownTarget: string;
  region: string;
  audioSrc: string;
  schedule: readonly {
    key: ScheduleKey;
    label: string;
    value: string;
    note?: string;
  }[];
  venue: {
    name: string;
    /** Sảnh và tầng trong nhà hàng, hiện thành hai ô trên cuống vé. */
    hall?: { name: string; floor: string };
    address: string;
    mapUrl: string;
    website?: string;
  };
  /** Thiệp của buổi lễ còn lại — hiện thành thẻ liên kết ở chân trang. */
  sibling: { href: string; eventName: string; dateShort: string; place: string };
  /** Hero chỉ hiện ảnh — ẩn tên, ngày và lớp phủ gradient. */
  heroImageOnly?: boolean;
  /**
   * Chỉ Tiệc Báo Hỷ: có trường này thì trang hiện section tiệc tối thay cho
   * mục "Ngày cưới". `endsAt` là giờ kết thúc dự kiến khi lưu vào lịch.
   */
  party?: { endsAt: string; photo: string };
  /** Tiêu đề khối đếm ngược, mặc định "ĐẾN NGÀY CƯỚI". */
  countdownTitle?: string;
  /** Tên dịp trong lời chào ở mục "Thân gửi", mặc định "lễ cưới". */
  welcomeOccasion?: string;
  images: {
    hero: string;
    couple: string;
    sunset: string;
    venue: string;
    giftBox: string;
    ending: string;
    /** Hình dạng nét vẽ Love Story (600×1340, dùng làm alpha mask). */
    storyLine: string;
  };
  profiles: readonly {
    role: string;
    name: string;
    bio: string;
    /** Ảnh chân dung riêng, hiện cạnh phần giới thiệu ở mục "Thân gửi". */
    photo: string;
  }[];
  /** `step` = tiến độ cuộn (0–1) của nét vẽ mà tại đó mốc sáng lên. */
  story: readonly { date: string; title: string; text: string; step: number }[];
  album: readonly { src: string; alt: string; caption?: string }[];
  /** Kho ảnh photobooth; mỗi lần tải trang, section bốc ngẫu nhiên ảnh từ đây để xếp vào các dải. */
  photobooth: readonly { src: string; alt: string }[];
  giftRecipients: readonly GiftRecipient[];
}
