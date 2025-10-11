"use server";

export const dynamic = "force-dynamic"; // Required for Vercel deployment

import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-error`);
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const user = await users.findOne({ verificationToken: token });

    if (!user) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-error`);
    }

    // ✅ Mark user as verified and clear the token
    await users.updateOne(
      { _id: user._id },
      { $set: { verified: true }, $unset: { verificationToken: "" } }
    );

    // ✅ Redirect to success page
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verified-success`);
  } catch (error) {
    console.error("Verification error:", error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-error`);
  }
}
