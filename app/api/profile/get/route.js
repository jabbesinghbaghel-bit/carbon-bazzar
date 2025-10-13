import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const users = await db.collection("users").find({}).toArray(); // or find one user based on session
    return NextResponse.json(users[0]); // send one user for dashboard
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
