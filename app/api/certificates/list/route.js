"use server";
// app/api/certificates/route.js

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const certs = await db
      .collection("certificates")
      .find({ status: "listed" })
      .project({ /* optionally hide sensitive fields */ })
      .toArray();
    return new Response(JSON.stringify(certs), { status: 200 });
  } catch (err) {
    console.error("Certificates GET error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

/**
 * Create certificate (admin/issuer)
 * Expect body: { projectName, certificateId, issuedBy, issuedDate, expiryDate, credits, price }
 * Protected by ADMIN_KEY header (x-admin-key)
 */
export async function POST(req) {
  try {
    const adminKey = req.headers.get("x-admin-key") || "";
    if (!process.env.ADMIN_KEY || adminKey !== process.env.ADMIN_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { projectName, certificateId, issuedBy, issuedDate, expiryDate, credits = 1, price = 0 } = body;

    if (!projectName || !certificateId || !issuedBy || !issuedDate) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    await db.collection("certificates").insertOne({
      projectName,
      certificateId,
      issuedBy,
      issuedDate: new Date(issuedDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      credits: Number(credits),
      price: Number(price),
      status: "listed",
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Certificate created" }), { status: 201 });
  } catch (err) {
    console.error("Certificates POST error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
