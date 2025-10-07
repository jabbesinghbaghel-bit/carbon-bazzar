"use server";
// app/api/certificates/[id]/route.js

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const cert = await db.collection("certificates").findOne({ _id: new ObjectId(id) });
    if (!cert) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(cert), { status: 200 });
  } catch (err) {
    console.error("Certificate GET error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
