import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createWeddingIcs } from "@/lib/createWeddingIcs";
import { connectToDatabase } from "@/lib/mongodb"; // You'll need to create this

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

    // Save to MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("rsvps").insertOne({
        name,
        email,
        status,
        message,
        createdAt: new Date(),
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      });
      console.log("✅ Saved to MongoDB");
    } catch (dbError) {
      console.error("❌ MongoDB error:", dbError);
      // Continue even if DB fails - don't block the email
    }

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
      : "❤️ Thank you – we'll miss you at the wedding";

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
      <p>Dear ${name},</p>
      <p>${
        isComing
          ? "Thank you for confirming that you'll join our wedding! 🎉"
          : "Thank you for your lovely message and wishes ❤️"
      }</p>
      ${
        isComing
          ? "<p>You'll find a calendar event attached so you can save the date easily.</p>"
          : ""
      }
      <p>Your message to us:</p>
      <blockquote style="border-left: 4px solid #f472b6; padding-left: 8px; color: #555;">
        ${message ? message.replace(/\n/g, "<br/>") : "<i>No message provided.</i>"}
      </blockquote>
      <p>With love,<br/>Mahmoud &amp; Sajda</p>
    `;

    // Send email to guest
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

    console.log("✅ Sent email to guest");

    // Forward RSVP notification to specific email
    const notificationEmail = process.env.NOTIFICATION_EMAIL; // e.g., "mahmoud@example.com"
    
    if (notificationEmail) {
      const statusEmoji = isComing ? "✅" : "❌";
      const notificationSubject = `${statusEmoji} New RSVP: ${name} - ${isComing ? "Coming" : "Can't Make It"}`;
      
      const notificationHtml = `
        <h2>New RSVP Received</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Status</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
              <strong style="color: ${isComing ? 'green' : 'orange'};">
                ${isComing ? "✅ Coming" : "❌ Can't Make It"}
              </strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Message</td>
            <td style="padding: 8px; border: 1px solid #ddd;">
              ${message ? message.replace(/\n/g, "<br/>") : "<i>No message</i>"}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Time</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
        to: notificationEmail,
        subject: notificationSubject,
        html: notificationHtml,
      });

      console.log("✅ Forwarded notification email");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}