import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // if using JWT

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer TOKEN
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify token (replace SECRET with your secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      pan: user.pan,
      aadhar: user.aadhar,
      kycStatus: user.kycStatus,
      phone: user.phone,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
