import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { token, password, profile } = await req.json(); 
    // profile can include SEBI-required fields like PAN, KYC status, bank details, etc.

    if (!token || !password) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    // Find user by reset token
    const user = await db.collection("users").findOne({ resetToken: token });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build update object
    const updateFields = { password: hashedPassword, $unset: { resetToken: "" } };

    // Include SEBI profile fields if provided
    if (profile && typeof profile === "object") {
      updateFields.$set = { ...profile };
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      updateFields
    );

    return NextResponse.json({ message: "Password reset and profile updated successfully" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
