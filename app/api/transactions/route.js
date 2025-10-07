// app/api/transactions/route.js
export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import getUserFromToken from "@/lib/getUserFromToken";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization") || "";
    const user = await getUserFromToken(token);
    if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const txs = await db
      .collection("transactions")
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(txs), { status: 200 });
  } catch (err) {
    console.error("Transactions GET error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
