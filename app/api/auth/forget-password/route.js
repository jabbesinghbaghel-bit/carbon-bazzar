export const dynamic = "force-dynamic"; // ✅ ensures Vercel doesn't try to pre-render

import clientPromise from "@/lib/mongodb";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ Parse request body safely
    const body = await req.json();
    const email = body?.email?.trim();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    // ✅ Find user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Generate reset token and expiration (1 hour)
    const resetToken = randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    // ✅ Update user with reset token
    await users.updateOne(
      { _id: user._id },
      { $set: { resetToken, resetExpires } }
    );

    // ✅ Build reset URL (make sure NEXT_PUBLIC_BASE_URL is set in Vercel)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // ✅ Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Carbon Bazzar <no-reply@carbonbazzar.com>",
      to: email,
      subject: "Reset your password",
      html: `
        <div>
          <h2>Password Reset Request</h2>
          <p>Click below to reset your password:</p>
          <a href="${resetUrl}" style="
            padding:10px 16px;
            background:#16a34a;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
          ">Reset Password</a>
          <p>If the button doesn't work, copy this link: ${resetUrl}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent" });

  } catch (err) {
    console.error("❌ Forget-password API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
