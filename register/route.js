"use server";

import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
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

    const resend = new Resend(process.env.RESEND_API_KEY);

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

    await resend.emails.send({
      from: "Carbon Bazzar <no-reply@carbonbazzar.com>",
      to: email,
      subject: "Verify your Carbon Bazzar account",
      html: `
        <h2>Welcome to Carbon Bazzar</h2>
        <p>Please verify your email:</p>
        <a href="${verificationUrl}" style="padding:10px 16px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p>If the button doesn't work, copy-paste this link:</p>
        <pre>${verificationUrl}</pre>
      `,
    });

    return NextResponse.json({ message: "User registered. Check your email for verification." }, { status: 200 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
