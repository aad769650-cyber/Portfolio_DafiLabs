import { NextResponse } from "next/server";
import { z } from "zod";

// Keep this schema in sync with the client-side schema in ContactForm.jsx.
const contactPayloadSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().min(5).max(150),
  message: z.string().trim().min(20).max(2000),
  token: z.string().min(1, { message: "Missing reCAPTCHA token." }),
});

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_SCORE_THRESHOLD = 0.5;

async function verifyRecaptchaToken(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("RECAPTCHA_SECRET_KEY is not configured on the server.");
  }

  const params = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  const verifyResponse = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!verifyResponse.ok) {
    throw new Error("Failed to reach reCAPTCHA verification service.");
  }

  return verifyResponse.json();
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const parsed = contactPayloadSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstIssue?.message || "Invalid form submission.",
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, token } = parsed.data;

    let recaptchaResult;
    try {
      recaptchaResult = await verifyRecaptchaToken(token);
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return NextResponse.json(
        { success: false, message: "Could not verify reCAPTCHA. Please try again." },
        { status: 502 }
      );
    }

    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    if (
      typeof recaptchaResult.score === "number" &&
      recaptchaResult.score < RECAPTCHA_SCORE_THRESHOLD
    ) {
      return NextResponse.json(
        { success: false, message: "Suspicious activity detected. Please try again." },
        { status: 400 }
      );
    }

    if (recaptchaResult.action && recaptchaResult.action !== "contact_form") {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA action mismatch." },
        { status: 400 }
      );
    }

    // -----------------------------------------------------------------
    // Optional: persist to a database and/or send a notification email.
    // Wire up your DB client / email provider here, e.g.:
    //
    //   await db.contactMessage.create({ data: { name, email, subject, message } });
    //   await sendEmail({ to: "you@example.com", subject, text: message, replyTo: email });
    // -----------------------------------------------------------------

    return NextResponse.json(
      { success: true, message: "Message received successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}