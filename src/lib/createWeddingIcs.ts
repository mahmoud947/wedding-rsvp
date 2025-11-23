type IcsInput = {
  guestName: string;
  guestEmail: string;
};

export function createWeddingIcs({ guestName, guestEmail }: IcsInput): string {
  // TODO: adjust date/time to your exact wedding time in UTC
  // Example: 20 Dec 2025, 7 PM Cairo ~ 17:00 UTC
  const dtStart = "20251220T170000Z";
  const dtEnd = "20251220T210000Z";

  const uid = `wedding-${guestEmail}-${Date.now()}@wedding.mahmoud-sajda`;

  const location = "Wedding Venue Name, Cairo, Egypt"; // update with real venue

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
    `ORGANIZER;CN=Mahmoud & Sajda:mailto:${process.env.SMTP_FROM ?? "wedding@example.com"}`,
    `ATTENDEE;CN=${escapeIcsText(guestName)};RSVP=TRUE:mailto:${guestEmail}`,
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