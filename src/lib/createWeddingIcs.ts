type IcsInput = {
  guestName: string;
  guestEmail: string;
};

export function createWeddingIcs({ guestName, guestEmail }: IcsInput): string {
  // Wedding: 2 Jan 2026, 3 PM Cairo (EET = UTC+2)
  // 3 PM Cairo = 1 PM UTC
  const dtStart = "20260102T130000Z"; // 3 PM Cairo time
  const dtEnd = "20260102T160000Z";   // 6 PM Cairo time (3 hour event)

  const uid = `wedding-${guestEmail}-${Date.now()}@wedding.mahmoud-sajda`;

  const location = "Solitaire Hall, Maadi, Cairo, Egypt";
  const locationUrl = "https://www.google.com/maps/place/Solitaire+Hall+Maadi%D8%8C+%D8%AF%D8%A7%D8%B1+%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%D8%8C%D8%8C+Cairo+Governorate%E2%80%AD/data=!4m2!3m1!1s0x145847916b32b001:0xb0245444266c23e7?utm_source=mstt_1&entry=gps";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mahmoud & Sajda Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatAsIcsDate(new Date())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    "SUMMARY:Mahmoud & Sajda Wedding 💍",
    `DESCRIPTION:Join us to celebrate the wedding of Mahmoud Kamal El-Din and Sajda Abu Bakr! We can't wait to see you, ${guestName}.`,
    `LOCATION:${escapeIcsText(location)}`,
    `URL:${locationUrl}`,
    `ORGANIZER;CN=Mahmoud & Sajda:mailto:${process.env.SMTP_FROM ?? "wedding@example.com"}`,
    `ATTENDEE;CN=${escapeIcsText(guestName)};RSVP=TRUE:mailto:${guestEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

function formatAsIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcsText(text: string): string {
  return text.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}