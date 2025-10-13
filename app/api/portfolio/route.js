"use server";

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const dynamic = "force-dynamic";

  try {
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const portfolio = await db.collection("portfolio").find().toArray();
    return new Response(JSON.stringify(portfolio), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
