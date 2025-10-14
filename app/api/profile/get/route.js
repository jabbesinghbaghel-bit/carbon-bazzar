import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic"; // prevents Vercel from pre-rendering

export async function GET(req) {
  try {
    // 1️⃣ Get token from Authorization header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    // 2️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
    }

    // 3️⃣ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    // 4️⃣ Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5️⃣ Return safe user info
    return NextResponse.json({
      name: user.name || "",
      email: user.email,
      pan: user.pan || "",
      aadhar: user.aadhar || "",
      kycStatus: user.kycStatus || "Pending",
      phone: user.phone || "",
    });
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
