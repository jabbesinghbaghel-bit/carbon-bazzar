// /app/api/auth/resend/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensures server runtime

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Here, implement your logic to resend verification email
    // Example: generate token, send email via your service

    return NextResponse.json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
