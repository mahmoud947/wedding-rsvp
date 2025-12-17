export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createWeddingIcs } from "@/lib/createWeddingIcs";
import { connectToDatabase } from "@/lib/mongodb";

type RSVPBody = {
  name: string;
  email: string;
  status: "coming" | "have_fun";
  message?: string;
};

function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as Partial<RSVPBody>;

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const status = body.status;
    const message = (body.message ?? "").trim();

    if (!name || !email || (status !== "coming" && status !== "have_fun")) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Save to MongoDB (non-blocking)
    try {
      const { db } = await connectToDatabase();
      await db.collection("rsvps").insertOne({
        name,
        email,
        status,
        message,
        createdAt: new Date(),
        ipAddress: getClientIp(req),
      });
      console.log("✅ Saved to MongoDB");
    } catch (dbError) {
      console.error("❌ MongoDB error:", dbError);
      // continue
    }

    // Validate SMTP env (avoid runtime crash)
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json(
        { error: "SMTP is not configured on the server" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const isComing = status === "coming";
    const subject = isComing
      ? "🎉 Thank you for confirming – Mahmoud & Sajda Wedding"
      : "❤️ Thank you – we'll miss you at the wedding";

    const icsContent = isComing
      ? createWeddingIcs({ guestName: name, guestEmail: email })
      : "";

    const safeMessageHtml = message
      ? escapeHtml(message).replace(/\n/g, "<br/>")
      : "<i>No message provided.</i>";

    const textMessage = isComing
      ? `Dear ${name},

Thank you for confirming that you'll join our wedding!

We added a calendar event for you – please find it attached.

We can't wait to see you there!

Best,
Mahmoud & Sajda`
      : `Dear ${name},

Thank you for your wishes!

We're sad you can't join, but we really appreciate your love and message.

Best,
Mahmoud & Sajda`;

    const htmlMessage = `
      <p>Dear ${escapeHtml(name)},</p>
      <p>${
        isComing
          ? "Thank you for confirming that you'll join our wedding! 🎉"
          : "Thank you for your lovely message and wishes ❤️"
      }</p>
      ${isComing ? "<p>You'll find a calendar event attached so you can save the date easily.</p>" : ""}
      <p>Your message to us:</p>
      <blockquote style="border-left: 4px solid #f472b6; padding-left: 8px; color: #555;">
        ${safeMessageHtml}
      </blockquote>
      <p>With love,<br/>Mahmoud &amp; Sajda</p>
    `;

    // Send email to guest
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? SMTP_USER,
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

    console.log("✅ Sent email to guest");

    // Notify admin (optional)
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (notificationEmail) {
      const statusEmoji = isComing ? "✅" : "❌";
      const notificationSubject = `${statusEmoji} New RSVP: ${name} - ${
        isComing ? "Coming" : "Can't Make It"
      }`;

      const notificationHtml = `
        <h2>New RSVP Received</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Name</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Email</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Status</td><td style="padding:8px;border:1px solid #ddd;"><strong>${isComing ? "✅ Coming" : "❌ Can't Make It"}</strong></td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Message</td><td style="padding:8px;border:1px solid #ddd;">${safeMessageHtml}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Time</td><td style="padding:8px;border:1px solid #ddd;">${new Date().toISOString()}</td></tr>
        </table>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? SMTP_USER,
        to: notificationEmail,
        subject: notificationSubject,
        html: notificationHtml,
      });

      console.log("✅ Forwarded notification email");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}