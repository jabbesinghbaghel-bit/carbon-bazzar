"use server";

import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const resend = new Resend(process.env.RESEND_API_KEY);

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${user.verificationToken}`;

    await resend.emails.send({
      from: "Carbon Bazzar <no-reply@carbonbazzar.com>",
      to: email,
      subject: "Your verification link",
      html: `<p>Click to verify: <a href="${verificationUrl}">Verify Email</a></p>`
    });

    return NextResponse.json({ message: "Verification email resent." });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
