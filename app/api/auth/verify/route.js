import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Token missing" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const user = await db.collection("users").findOne({ verifyToken: token });

    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { verified: true }, $unset: { verifyToken: "" } }
    );

    return NextResponse.json({ message: "User verified successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
