// app/api/portfolio/route.js
"use server";

import clientPromise from "@/lib/mongodb";
import getUserFromToken from "@/lib/getUserFromToken";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    // Accept token header or query? use Authorization header
    const token = req.headers.get("authorization") || "";
    const user = await getUserFromToken(token);
    if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const items = await db
      .collection("portfolio")
      .aggregate([
        { $match: { userId: user._id } },
        {
          $lookup: {
            from: "certificates",
            localField: "certificateId",
            foreignField: "_id",
            as: "certificate",
          },
        },
        { $unwind: "$certificate" },
        {
          $project: {
            certificateId: 1,
            quantity: 1,
            certificate: { projectName: 1, certificateId: 1, price: 1, issuedBy: 1 },
          },
        },
      ])
      .toArray();

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    console.error("Portfolio GET error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
