"use server";

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-error`);

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const user = await users.findOne({ verificationToken: token });
    if (!user) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-error`);

    await users.updateOne(
      { _id: user._id },
      { $set: { verified: true }, $unset: { verificationToken: "" } }
    );

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verified-success`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-error`);
  }
}
