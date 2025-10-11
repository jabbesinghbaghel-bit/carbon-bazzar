"use server";

import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Remove top-level exports like dynamic — define inside the async function
export async function POST(req) {
  try {
    // Force dynamic behavior inside handler
    const dynamic = "force-dynamic";

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString("hex");

    await users.insertOne({
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      createdAt: new Date(),
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

    // Initialize Resend client inside the function
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Carbon Bazzar <no-reply@carbonbazzar.com>",
      to: email,
      subject: "Verify your Carbon Bazzar account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.4;">
          <h2>Welcome to Carbon Bazzar</h2>
          <p>Please verify your email:</p>
          <a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
          <p>If the button doesn't work, copy-paste this link into your browser:</p>
          <pre>${verificationUrl}</pre>
        </div>
      `,
    });

    return NextResponse.json({ message: "User registered. Check your email for verification." }, { status: 200 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
