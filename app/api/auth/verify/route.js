"use server";
export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Invalid verification link." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const user = await users.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    await users.updateOne(
      { _id: user._id },
      { $set: { verified: true }, $unset: { verificationToken: "" } }
    );

    // You can redirect the user to a confirmation page; here we return a simple message.
    return NextResponse.json({ message: "Email verified successfully. You can now log in." }, { status: 200 });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
