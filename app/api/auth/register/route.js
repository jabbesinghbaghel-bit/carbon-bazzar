export const dynamic = "force-dynamic";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");
    const users = db.collection("users");

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User already exists" }),
        { status: 400 }
      );
    }

    await users.insertOne({ email, password });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
