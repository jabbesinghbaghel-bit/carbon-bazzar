"use server";

import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
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

    // existing user check
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create verification token
    const verificationToken = randomBytes(32).toString("hex");

    // insert user
    await users.insertOne({
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      createdAt: new Date(),
    });

    // send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;

    // configure transporter (Gmail example; adjust for other providers)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Carbon Bazzar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Carbon Bazzar account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.4;">
          <h2>Welcome to Carbon Bazzar</h2>
          <p>Thanks for signing up — please verify your email by clicking the button below:</p>
          <p><a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a></p>
          <p>If the button doesn't work, copy-paste this link into your browser:</p>
          <pre style="white-space:normal;">${verificationUrl}</pre>
        </div>
      `,
    };

    // send mail (do not block error path)
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr);
      // we still return success with note — user can be verified via token if email failed to send.
    }

    return NextResponse.json({ message: "User registered. Please check your email for verification link." }, { status: 200 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
