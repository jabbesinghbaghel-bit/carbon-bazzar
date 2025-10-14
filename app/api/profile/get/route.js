import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic"; // ✅ ensures Vercel doesn't try to pre-render

export async function GET(req) {
  try {
    // ✅ Get token from Authorization header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id || decoded.userId; // support any format

    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    // ✅ Convert userId to ObjectId safely
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Return only safe user info
    return NextResponse.json({
      name: user.name || "",
      email: user.email,
      pan: user.pan || "",
      aadhar: user.aadhar || "",
      kycStatus: user.kycStatus || "Pending",
      phone: user.phone || "",
    });
  } catch (err) {
    console.error("❌ Profile fetch error:", err.message);
    return NextResponse.json({ error: "Unauthorized or invalid token" }, { status: 401 });
  }
}
