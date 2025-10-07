// app/api/certificates/buy/route.js
"use server";

import clientPromise from "@/lib/mongodb";
import getUserFromToken from "@/lib/getUserFromToken";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // read body
    const body = await req.json();

    // token can be in Authorization header or body.token
    const authHeader = req.headers.get("authorization") || "";
    const token = body.token || authHeader || "";

    const qty = Number(body.qty || 1);
    const certificateId = body.certificateId;

    if (!certificateId) {
      return new Response(JSON.stringify({ error: "certificateId required" }), { status: 400 });
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      return new Response(JSON.stringify({ error: "qty must be a positive integer" }), { status: 400 });
    }

    // resolve user
    const user = await getUserFromToken(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    // Atomically decrement certificate credits if enough available
    const certResult = await db.collection("certificates").findOneAndUpdate(
      { _id: new ObjectId(certificateId), credits: { $gte: qty }, status: "listed" },
      { $inc: { credits: -qty } },
      { returnDocument: "after" } // returns document after update
    );

    if (!certResult.value) {
      return new Response(JSON.stringify({ error: "Not enough credits available or certificate not listed" }), { status: 400 });
    }

    const cert = certResult.value;
    const unitPrice = cert.price || 0;
    const total = unitPrice * qty;

    // Add to portfolio (upsert)
    await db.collection("portfolio").updateOne(
      { userId: user._id, certificateId: new ObjectId(certificateId) },
      { $inc: { quantity: qty }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    // Record transaction
    await db.collection("transactions").insertOne({
      userId: user._id,
      certificateId: new ObjectId(certificateId),
      quantity: qty,
      unitPrice,
      total,
      action: "buy",
      createdAt: new Date(),
    });

    // If credits hit 0, optionally change status
    if (cert.credits - qty <= 0) {
      await db.collection("certificates").updateOne(
        { _id: new ObjectId(certificateId) },
        { $set: { status: "sold" } }
      );
    }

    return new Response(JSON.stringify({ message: "Purchase successful", certificate: cert }), { status: 200 });
  } catch (err) {
    console.error("Buy API error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
