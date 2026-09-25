// Setup:
// 1. In the target Google Sheet, create two tabs named exactly "RSVP" and "Wishes".
//    - "RSVP" header row:   Timestamp | Name | Phone | Attendance | Guest Count | Message
//    - "Wishes" header row: Timestamp | Name | Message
// 2. Extensions > Apps Script, paste this file's contents, save.
// 3. Deploy > New deployment > type "Web app", execute as "Me", access "Anyone".
// 4. Copy the deployment URL into RSVP_SHEET_WEBHOOK_URL in .env.local
//    (the same URL and env var serve both the RSVP and Wishes routes — the
//    payload's `type` field tells this script which sheet to use).

function getSheet_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.type === "wish") {
    getSheet_("Wishes").appendRow([new Date(), data.name, data.message]);
  } else {
    getSheet_("RSVP").appendRow([
      new Date(),
      data.name,
      data.phone || "",
      data.attendance,
      data.guestCount,
      data.message,
    ]);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.type !== "wish") {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getSheet_("Wishes");
  const rows = sheet.getDataRange().getValues().slice(1); // drop header row
  const wishes = rows
    .filter((row) => row[1])
    .map(([timestamp, name, message]) => ({
      timestamp: new Date(timestamp).toISOString(),
      name,
      message,
    }))
    .reverse(); // newest first

  return ContentService.createTextOutput(
    JSON.stringify({ wishes })
  ).setMimeType(ContentService.MimeType.JSON);
}
