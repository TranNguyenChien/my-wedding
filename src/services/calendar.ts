function toIcsTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildIcsDataUrl(params: {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
}): string {
  const { title, description, location, start, end } = params;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//VI",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@wedding-invitation`,
    `DTSTAMP:${toIcsTimestamp(new Date())}`,
    `DTSTART:${toIcsTimestamp(start)}`,
    `DTEND:${toIcsTimestamp(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function toGoogleTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildGoogleCalendarUrl(params: {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
}): string {
  const { title, description, location, start, end } = params;
  const search = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGoogleTimestamp(start)}/${toGoogleTimestamp(end)}`,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${search.toString()}`;
}
