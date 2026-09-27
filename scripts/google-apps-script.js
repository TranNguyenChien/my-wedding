/**
 * RSVP DASHBOARD — tạo bảng "Danh sách khách" (STT tự tăng, dynamic) + bảng "Thống kê"
 * ---------------------------------------------------------------------------
 * Cách dùng: dán file này vào project Apps Script (File mới: RSVP_Dashboard.gs)
 * → chọn hàm rsvpSetupDashboard → Run (chạy 1 lần). Sau đó mọi phản hồi mới do
 * API ghi vào 2 sheet "Lễ Vu Quy" / "Lễ Tân Hôn" sẽ TỰ ĐỘNG hiện lên, không cần chạy lại.
 *
 * Không đụng vào 2 sheet gốc, nên doPost / appendRow của API vẫn chạy như cũ.
 */

const RSVP_CFG = {
  SPREADSHEET_ID: "1Ypec7iiP9khZz91WbYXAyhRFnB2IsCQQMWoPtxeaX14", // file "Wedding RSVP"
  SOURCES: ["Lễ Vu Quy", "Lễ Tân Hôn"], // 2 sheet API đang ghi (cột A→F)
  LIST: "Danh sách khách",
  STATS: "Thống kê",
  // Tiêu đề hiển thị cho cột A→F của sheet gốc. Sửa lại nếu khác thứ tự trong doPost.
  HEADERS: [
    "Thời gian",
    "Họ tên",
    "Liên hệ",
    "Tham dự",
    "Số khách",
    "Lời chúc",
  ],
  FONT: "Be Vietnam Pro",
  // Tông chủ đạo #78131d (đỏ rượu vang) + các sắc nhạt của nó
  C: {
    main: "#78131D",
    banner: "#8E2A33",
    bannerSub: "#F3DADD",
    text: "#3B2A2C",
    muted: "#9A8587",
    soft: "#FBF3F4",
    soft2: "#F6E6E8",
    zebra: "#FDF8F8",
    line: "#EFDFE1",
    okBg: "#F6E6E8",
    okFg: "#78131D",
    noBg: "#F3F0F0",
    noFg: "#8C7F80",
    vqBg: "#FBEFF0",
    vqFg: "#78131D",
    thBg: "#F7EEE8",
    thFg: "#8A4A38",
    chart1: "#78131D",
    chart2: "#D9A5AB",
  },
};

function rsvpSetupDashboard() {
  const ss =
    SpreadsheetApp.getActiveSpreadsheet() ||
    SpreadsheetApp.openById(RSVP_CFG.SPREADSHEET_ID);
  RSVP_CFG.SOURCES.forEach((n) => {
    if (!ss.getSheetByName(n)) ss.insertSheet(n);
  });
  const list = rsvpBuildList_(ss);
  const stats = rsvpBuildStats_(ss);
  ss.setActiveSheet(stats);
  ss.moveActiveSheet(1);
  ss.setActiveSheet(list);
  ss.moveActiveSheet(2);
  ss.setActiveSheet(stats);
  SpreadsheetApp.flush();
}

/* ---------------------------- helpers ---------------------------- */
function rsvpFreshSheet_(ss, name) {
  let sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.getCharts().forEach((c) => sh.removeChart(c));
  sh.clearConditionalFormatRules();
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart().clear();
  if (sh.getFilter()) sh.getFilter().remove();
  if (sh.getMaxRows() < 1000)
    sh.insertRowsAfter(sh.getMaxRows(), 1000 - sh.getMaxRows());
  sh.setHiddenGridlines(true);
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns())
    .setFontFamily(RSVP_CFG.FONT)
    .setFontSize(10)
    .setVerticalAlignment("middle")
    .setFontColor(RSVP_CFG.C.text);
  return sh;
}
const q_ = (n) => `'${n.replace(/'/g, "''")}'`;

/* ------------------------ Danh sách khách ------------------------ */
function rsvpBuildList_(ss) {
  const {
    C,
    SOURCES: [s1, s2],
    HEADERS: H,
  } = RSVP_CFG;
  const sh = rsvpFreshSheet_(ss, RSVP_CFG.LIST);
  const N = sh.getMaxRows();

  // Banner
  sh.getRange("A1:H1")
    .merge()
    .setValue("DANH SÁCH KHÁCH MỜI · RSVP")
    .setBackground(C.banner)
    .setFontColor("#FFFFFF")
    .setFontSize(18)
    .setFontWeight("bold")
    .setHorizontalAlignment("left");
  sh.getRange("A2:H2")
    .merge()
    .setFormula(
      `="Tự động cập nhật từ API  ·  " & COUNT(A5:A) & " phản hồi  ·  " & SUMIF(E5:E,"*Tham dự",F5:F) & " khách dự kiến  ·  " & TEXT(NOW(),"HH:mm dd/mm/yyyy")`,
    )
    .setBackground(C.banner)
    .setFontColor(C.bannerSub)
    .setFontSize(10);
  sh.setRowHeight(1, 52)
    .setRowHeight(2, 26)
    .setRowHeight(3, 10)
    .setRowHeight(4, 38);

  // Header
  sh.getRange("A4:H4")
    .setValues([["STT", H[0], H[1], H[2], "Trạng thái", H[4], H[5], "Sự kiện"]])
    .setBackground(C.soft)
    .setFontColor(C.main)
    .setFontWeight("bold")
    .setFontSize(10)
    .setBorder(
      false,
      false,
      true,
      false,
      false,
      false,
      C.main,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM,
    );

  // Công thức dynamic: gộp 2 sheet → lọc dòng trống → sort theo thời gian → STT = SEQUENCE
  sh.getRange("A5").setFormula(`=ARRAYFORMULA(LET(
  v, ${q_(s1)}!A1:F, t, ${q_(s2)}!A1:F,
  all, VSTACK(HSTACK(v, IF(SEQUENCE(ROWS(v)), "${s1}")), HSTACK(t, IF(SEQUENCE(ROWS(t)), "${s2}"))),
  d, IFERROR(FILTER(all, LEN(TO_TEXT(CHOOSECOLS(all, 1))) > 0), ""),
  IF(ROWS(d) * COLUMNS(d) = 1, "Chưa có phản hồi nào",
    LET(s, SORT(d, 1, TRUE), n, ROWS(s),
        att, LOWER(TRIM(TO_TEXT(CHOOSECOLS(s, 4)))), qty, CHOOSECOLS(s, 5),
        HSTACK(SEQUENCE(n), CHOOSECOLS(s, 1, 2, 3),
          IF(REGEXMATCH(att, "^(yes|y|có|co|true|1|attend.*|tham dự)$"), "Tham dự",
            IF(REGEXMATCH(att, "^(no|n|không|khong|false|0|vắng)$"), "Không dự",
              IF(att = "", "—", CHOOSECOLS(s, 4)))),
          IFERROR(VALUE(qty), qty), CHOOSECOLS(s, 6), CHOOSECOLS(s, 7))))))`);

  // Định dạng vùng dữ liệu
  const body = sh.getRange(5, 1, N - 4, 8);
  body.setFontSize(10);
  sh.getRange(5, 1, N - 4, 1)
    .setHorizontalAlignment("center")
    .setFontColor(C.muted)
    .setFontWeight("bold");
  sh.getRange(5, 2, N - 4, 1)
    .setNumberFormat("dd/mm/yyyy  hh:mm")
    .setFontColor(C.muted);
  sh.getRange(5, 3, N - 4, 1).setFontWeight("bold");
  sh.getRange(5, 5, N - 4, 1).setHorizontalAlignment("center");
  sh.getRange(5, 6, N - 4, 1)
    .setHorizontalAlignment("center")
    .setNumberFormat("0");
  sh.getRange(5, 7, N - 4, 1)
    .setWrap(true)
    .setFontStyle("italic");
  sh.getRange(5, 8, N - 4, 1).setHorizontalAlignment("center");
  sh.getRange("A4:H4").setHorizontalAlignment("center");

  [56, 150, 200, 140, 130, 90, 360, 120].forEach((w, i) =>
    sh.setColumnWidth(i + 1, w),
  );
  sh.setFrozenRows(4);

  // Chip màu + zebra (tự áp dụng khi có dòng mới)
  const col = (c) => sh.getRange(5, c, N - 4, 1);
  const B = SpreadsheetApp.newConditionalFormatRule;
  sh.setConditionalFormatRules([
    B()
      .whenTextContains("Tham dự")
      .setBackground(C.okBg)
      .setFontColor(C.okFg)
      .setBold(true)
      .setRanges([col(5)])
      .build(),
    B()
      .whenTextContains("Không dự")
      .setBackground(C.noBg)
      .setFontColor(C.noFg)
      .setBold(true)
      .setRanges([col(5)])
      .build(),
    B()
      .whenTextEqualTo(s1)
      .setBackground(C.vqBg)
      .setFontColor(C.vqFg)
      .setBold(true)
      .setRanges([col(8)])
      .build(),
    B()
      .whenTextEqualTo(s2)
      .setBackground(C.thBg)
      .setFontColor(C.thFg)
      .setBold(true)
      .setRanges([col(8)])
      .build(),
    B()
      .whenFormulaSatisfied("=AND(ISNUMBER($A5), ISEVEN($A5))")
      .setBackground(C.zebra)
      .setRanges([body])
      .build(),
  ]);
  return sh;
}

/* ---------------------------- Thống kê ---------------------------- */
function rsvpBuildStats_(ss) {
  const {
    C,
    SOURCES: [s1, s2],
  } = RSVP_CFG;
  const sh = rsvpFreshSheet_(ss, RSVP_CFG.STATS);
  const L = q_(RSVP_CFG.LIST);

  sh.setColumnWidth(1, 24);
  for (let c = 2; c <= 9; c++) sh.setColumnWidth(c, 118);
  sh.setColumnWidth(10, 24);

  // Banner
  sh.getRange("B1:I1")
    .merge()
    .setValue("THỐNG KÊ RSVP · TIỆC CƯỚI")
    .setBackground(C.banner)
    .setFontColor("#FFFFFF")
    .setFontSize(18)
    .setFontWeight("bold");
  sh.getRange("B2:I2")
    .merge()
    .setFormula(`="Cập nhật lúc " & TEXT(NOW(), "HH:mm · dd/mm/yyyy")`)
    .setBackground(C.banner)
    .setFontColor(C.bannerSub);
  sh.setRowHeight(1, 52).setRowHeight(2, 26).setRowHeight(3, 16);

  // KPI cards (dựa trên dòng Tổng cộng ở hàng 12)
  const cards = [
    [
      "B",
      "TỔNG PHẢN HỒI",
      "=C12",
      `="+" & COUNTIF(${L}!B5:B, ">=" & TODAY()) & " hôm nay"`,
      C.soft,
      C.main,
    ],
    ["D", "THAM DỰ", "=D12", '="Tỉ lệ " & TEXT(G12, "0%")', C.soft2, C.main],
    [
      "F",
      "KHÔNG DỰ",
      "=E12",
      '="Chiếm " & TEXT(IFERROR(E12/C12, 0), "0%")',
      C.noBg,
      C.noFg,
    ],
    [
      "H",
      "TỔNG KHÁCH",
      "=F12",
      '="TB " & TEXT(IFERROR(F12/D12, 0), "0.0") & " người/nhóm"',
      C.vqBg,
      C.main,
    ],
  ];
  cards.forEach(([c, label, val, sub, bg, fg]) => {
    const c2 = String.fromCharCode(c.charCodeAt(0) + 1);
    sh.getRange(`${c}4:${c2}4`)
      .merge()
      .setValue(label)
      .setFontSize(9)
      .setFontWeight("bold")
      .setFontColor(fg);
    sh.getRange(`${c}5:${c2}5`)
      .merge()
      .setFormula(val)
      .setFontSize(28)
      .setFontWeight("bold")
      .setFontColor(C.main)
      .setNumberFormat("#,##0");
    sh.getRange(`${c}6:${c2}6`)
      .merge()
      .setFormula(sub)
      .setFontSize(9)
      .setFontColor(C.muted);
    sh.getRange(`${c}4:${c2}6`)
      .setBackground(bg)
      .setHorizontalAlignment("center")
      .setBorder(
        true,
        true,
        true,
        true,
        false,
        false,
        "#FFFFFF",
        SpreadsheetApp.BorderStyle.SOLID_THICK,
      );
  });
  sh.setRowHeight(4, 28)
    .setRowHeight(5, 50)
    .setRowHeight(6, 26)
    .setRowHeight(7, 18);

  // Bảng thống kê theo sự kiện
  sh.getRange("B8:I8")
    .merge()
    .setValue("Theo sự kiện")
    .setFontSize(12)
    .setFontWeight("bold");
  sh.getRange("B9:I9")
    .setValues([
      [
        "Sự kiện",
        "Phản hồi",
        "Tham dự",
        "Không dự",
        "Tổng khách",
        "Tỉ lệ dự",
        "Tiến độ",
        "",
      ],
    ])
    .setBackground(C.soft)
    .setFontColor(C.main)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBorder(
      false,
      false,
      true,
      false,
      false,
      false,
      C.main,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM,
    );
  sh.getRange("H9:I9").merge();

  [
    [10, s1],
    [11, s2],
  ].forEach(([r, ev]) => {
    sh.getRange(`B${r}:H${r}`).setFormulas([
      [
        ev,
        `=COUNTIF(${L}!$H$5:$H, B${r})`,
        `=COUNTIFS(${L}!$H$5:$H, B${r}, ${L}!$E$5:$E, "*Tham dự")`,
        `=COUNTIFS(${L}!$H$5:$H, B${r}, ${L}!$E$5:$E, "*Không dự")`,
        `=SUMIFS(${L}!$F$5:$F, ${L}!$H$5:$H, B${r}, ${L}!$E$5:$E, "*Tham dự")`,
        `=IFERROR(D${r}/C${r}, 0)`,
        `=SPARKLINE(G${r}, {"charttype","bar"; "max",1; "color1","${C.chart1}"})`,
      ],
    ]);
  });
  sh.getRange("B10").setValue(s1);
  sh.getRange("B11").setValue(s2);
  sh.getRange("B12:H12").setFormulas([
    [
      "Tổng cộng",
      "=SUM(C10:C11)",
      "=SUM(D10:D11)",
      "=SUM(E10:E11)",
      "=SUM(F10:F11)",
      "=IFERROR(D12/C12, 0)",
      `=SPARKLINE(G12, {"charttype","bar"; "max",1; "color1","${C.chart2}"})`,
    ],
  ]);
  sh.getRange("B12").setValue("Tổng cộng");
  [10, 11, 12].forEach((r) => sh.getRange(`H${r}:I${r}`).merge());

  sh.getRange("B10:I12")
    .setHorizontalAlignment("center")
    .setFontSize(11)
    .setBorder(
      null,
      null,
      true,
      null,
      null,
      true,
      C.line,
      SpreadsheetApp.BorderStyle.SOLID,
    );
  sh.getRange("B10:B12").setHorizontalAlignment("left").setFontWeight("bold");
  sh.getRange("B10").setFontColor(C.vqFg);
  sh.getRange("B11").setFontColor(C.thFg);
  sh.getRange("B12:I12")
    .setBackground(C.soft2)
    .setFontWeight("bold")
    .setFontColor(C.main);
  sh.getRange("G10:G12").setNumberFormat("0%");
  sh.getRange("C10:F12").setNumberFormat("#,##0");
  [9, 10, 11, 12].forEach((r) => sh.setRowHeight(r, 34));

  // Dữ liệu phụ cho biểu đồ tròn (cột L:M, ẩn)
  sh.getRange("L4:M6").setValues([
    ["Trạng thái", "Số lượng"],
    ["Tham dự", ""],
    ["Không dự", ""],
  ]);
  sh.getRange("M5").setFormula("=D12");
  sh.getRange("M6").setFormula("=E12");
  sh.hideColumns(12, 2);

  // Biểu đồ
  const donut = sh
    .newChart()
    .asPieChart()
    .addRange(sh.getRange("L4:M6"))
    .setOption("pieHole", 0.55)
    .setOption("title", "Tỉ lệ tham dự")
    .setOption("colors", [C.chart1, C.chart2])
    .setOption("legend", { position: "bottom" })
    .setOption("fontName", RSVP_CFG.FONT)
    .setOption("backgroundColor", "#FFFFFF")
    .setHiddenDimensionStrategy(Charts.ChartHiddenDimensionStrategy.SHOW_BOTH)
    .setNumHeaders(1)
    .setPosition(14, 2, 0, 0)
    .setOption("width", 470)
    .setOption("height", 300)
    .build();
  const bars = sh
    .newChart()
    .asColumnChart()
    .addRange(sh.getRange("B9:B11"))
    .addRange(sh.getRange("D9:E11"))
    .setOption("title", "Tham dự theo sự kiện")
    .setOption("colors", [C.chart1, C.chart2])
    .setOption("legend", { position: "bottom" })
    .setOption("fontName", RSVP_CFG.FONT)
    .setNumHeaders(1)
    .setPosition(14, 6, 0, 0)
    .setOption("width", 470)
    .setOption("height", 300)
    .build();
  sh.insertChart(donut);
  sh.insertChart(bars);
  return sh;
}
