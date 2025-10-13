"use server";

import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";
import jwt from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required." }),
        { status: 400 }
      );
    }

    // connect to MongoDB
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found." }),
        { status: 404 }
      );
    }

    // generate new verification token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;

    // send verification email
    await resend.emails.send({
      from: "no-reply@carbonbazzar.com",
      to: email,
      subject: "Verify your Carbon Bazzar account",
      html: `
        <p>Hello,</p>
        <p>Please verify your account by clicking the link below:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Verification email resent." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500 }
    );
  }
}
