"use server";

export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (user.verified) {
      return new Response(JSON.stringify({ message: "User is already verified" }), { status: 200 });
    }

    // Generate a new token
    const newToken = Math.random().toString(36).substring(2, 15);

    await users.updateOne(
      { _id: user._id },
      { $set: { verificationToken: newToken } }
    );

    // Send email
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${newToken}`;
    await resend.emails.send({
      from: "Carbon Bazzar <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family:sans-serif">
          <h2>Verify your email</h2>
          <p>Click below to confirm your Carbon Bazzar account:</p>
          <a href="${verifyLink}" style="background:#16a34a;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
            Verify Email
          </a>
        </div>
      `,
    });

    return new Response(JSON.stringify({ message: "Verification email resent successfully" }), { status: 200 });
  } catch (error) {
    console.error("Resend error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
