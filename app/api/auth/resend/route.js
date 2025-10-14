import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    // ✅ Check if user exists
    const user = await db.collection("users").findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );

    // ✅ Create a new verification token
    const verificationToken = Math.random().toString(36).substring(2);
    await db
      .collection("users")
      .updateOne({ email }, { $set: { verificationToken } });

    // ✅ Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail (from .env)
        pass: process.env.EMAIL_PASS, // app password (not your normal password)
      },
    });

    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Carbon Bazzar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Carbon Bazzar account",
      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Verify Your Email</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background:#0070f3;color:white;text-decoration:none;border-radius:5px;">Verify Now</a>
        </div>
      `,
    });

    return NextResponse.json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
