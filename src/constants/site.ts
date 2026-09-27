/** Real wedding details for Nguyễn Thị Bảo Ngọc & Trần Nguyên Chiến. */
export const site = {
  bride: {
    fullName: "Nguyễn Thị Bảo Ngọc",
    shortName: "Bảo Ngọc",
    name: "Ngọc",
    caption: "Trưởng Nữ",
  },
  groom: {
    fullName: "Trần Nguyên Chiến",
    shortName: "Nguyên Chiến",
    name: "Chiến",
    caption: "Trưởng Nam",
  },
  monogram: "NC",
  monogramFull: "BN × NC",
  tagline: "Our Forever Begins Here",
  announcement: "WEDDING ANNOUNCEMENT",

  weddingDate: "2026-10-26",
  weekday: "THỨ HAI",
  dateLine: "Thứ Hai, ngày 26 tháng 10 năm 2026",
  lunarDate: "Nhằm ngày 17 tháng 09 năm Bính Ngọ",
  region: "Quảng Trị, Việt Nam",

  le_vu_quy_ceremony: {
    name: "LỄ VU QUY",
    dateTime: "2026-10-26T08:00:00+07:00",
    time: "08 GIỜ 00",
    venueName: "Tư Gia",
    venueAddress: "Thôn Mỹ Chánh, Xã Nam Hải Lăng, Tỉnh Quảng Trị",
  },

  le_vu_quy_reception: {
    name: "TIỆC CƯỚI",
    dateTime: "2026-10-26T10:30:00+07:00",
    time: "10 GIỜ 30",
    venueName: "Nhà Hàng Queen",
    venueAddress: "Thôn Mỹ Chánh, Xã Nam Hải Lăng, Tỉnh Quảng Trị",
  },

  le_tan_hon_ceremony: {
    name: "LỄ TÂN HÔN",
    dateTime: "2026-10-29T11:00:00+07:00",
    time: "11 GIỜ 00",
    weekday: "THỨ NĂM",
    dateLine: "Thứ Năm, ngày 29 tháng 10 năm 2026",
    lunarDate: "Tức ngày 20 tháng 09 năm Bính Ngọ",
    venueName: "Nhà Hàng Tuấn Thảo",
    venueAddress: "Thôn Đắc Tâm, Xã Thuận An, Tỉnh Lâm Đồng",
  },

  /**
   * TODO: fill in with the real VietQR bank code (see
   * https://api.vietqr.io/v2/banks for `bankId` values), account number,
   * and account holder name before publishing. Until then the footer shows
   * a placeholder instead of calling img.vietqr.io with invalid params.
   */
  bankAccount: {
    bankId: "970436",
    accountNumber: "9355645006",
    accountName: "TRAN NGUYEN CHIEN",
  },

  brideFamily: {
    heading: "NHÀ GÁI",
    father: "Ông: Nguyễn Trọng Sơn",
    mother: "Bà: Nguyễn Thị Hương Trâm",
    address: "Thôn Mỹ Chánh, Xã Nam Hải Lăng, Tỉnh Quảng Trị",
  },

  groomFamily: {
    heading: "NHÀ TRAI",
    father: "Ông: Trần Nguyên Long",
    mother: "Bà: Nguyễn Thị Ngọc",
    address: "Thôn Đắc Tâm, Xã Thuận An, Tỉnh Lâm Đồng",
  },
} as const;

/** Countdown target — the ceremony start time. */
export const countdownTarget = site.le_vu_quy_ceremony.dateTime;
