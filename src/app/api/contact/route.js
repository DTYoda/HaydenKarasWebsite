import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, subject, message, recipientEmail } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Get recipient email from environment or use provided one
    const toEmail =
      process.env.CONTACT_EMAIL || recipientEmail || "hkaras1121@gmail.com";

    // Try to use Resend if available
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = await import("resend");
        const resendClient = new resend.Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resendClient.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: toEmail,
          replyTo: email,
          subject: `Contact Form: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">New Contact Form Submission</h2>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
                <h3 style="color: #1f2937;">Message:</h3>
                <p style="color: #4b5563; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
          `,
        });

        if (error) {
          console.error("Resend error:", error);
          throw error;
        }

        return NextResponse.json(
          { success: true, message: "Email sent successfully!" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Resend email error:", error);
        // Fall through to alternative method
      }
    }

    // Alternative: Use Nodemailer if configured (only if Resend is not available)
    if (
      !process.env.RESEND_API_KEY &&
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      try {
        // Try to import nodemailer, but don't fail if it's not installed
        let nodemailer;
        try {
          nodemailer = await import("nodemailer");
        } catch (importError) {
          console.error(
            "Nodemailer not installed. Please install it with: npm install nodemailer"
          );
          throw new Error(
            "Nodemailer is not installed. Please install it or use Resend instead."
          );
        }

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: toEmail,
          replyTo: email,
          subject: `Contact Form: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">New Contact Form Submission</h2>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              <div style="background: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
                <h3 style="color: #1f2937;">Message:</h3>
                <p style="color: #4b5563; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
          `,
        });

        return NextResponse.json(
          { success: true, message: "Email sent successfully!" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Nodemailer error:", error);
        // Fall through to error response
      }
    }

    // If no email service is configured, return an error with instructions
    return NextResponse.json(
      {
        success: false,
        message:
          "Email service not configured. Please set RESEND_API_KEY and RESEND_FROM_EMAIL in your environment variables.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Error processing contact form submission" },
      { status: 500 }
    );
  }
}
