"use server";

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      userId,
      name,
      panNumber,
      kycStatus,
      bankAccount,
      ifsc,
      address,
      phone,
      dob
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const updateResult = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name,
          panNumber,
          kycStatus,
          bankAccount,
          ifsc,
          address,
          phone,
          dob,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Profile UPDATE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
