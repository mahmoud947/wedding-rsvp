import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createWeddingIcs } from "@/lib/createWeddingIcs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, status, message } = body as {
      name: string;
      email: string;
      status: "coming" | "have_fun";
      message: string;
    };

    if (!name || !email || !status) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    console.log("RSVP:", { name, email, status, message });




    const icsContent = createWeddingIcs({ guestName: name, guestEmail: email });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const isComing = status === "coming";

    const subject = isComing
      ? "🎉 Thank you for confirming – Mahmoud & Sajda Wedding"
      : "❤️ Thank you – we’ll miss you at the wedding";

    const textMessage = isComing
      ? `Dear ${name},

Thank you for confirming that you'll join our wedding!

We added a calendar event for you – please find it attached.

We can't wait to see you there!

Best,
Mahmoud & Sajda`
      : `Dear ${name},

Thank you for your wishes!

We’re sad you can’t join, but we really appreciate your love and message.

Best,
Mahmoud & Sajda`;

    const htmlMessage = `
      <p>Dear ${name},</p>
      <p>${
        isComing
          ? "Thank you for confirming that you'll join our wedding! 🎉"
          : "Thank you for your lovely message and wishes ❤️"
      }</p>
      ${
        isComing
          ? "<p>You’ll find a calendar event attached so you can save the date easily.</p>"
          : ""
      }
      <p>Your message to us:</p>
      <blockquote style="border-left: 4px solid #f472b6; padding-left: 8px; color: #555;">
        ${message ? message.replace(/\n/g, "<br/>") : "<i>No message provided.</i>"}
      </blockquote>
      <p>With love,<br/>Mahmoud &amp; Sajda</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: email,
      subject,
      text: textMessage,
      html: htmlMessage,
      attachments: isComing
        ? [
            {
              filename: "wedding.ics",
              content: icsContent,
              contentType: "text/calendar; charset=utf-8; method=REQUEST",
            },
          ]
        : [],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}