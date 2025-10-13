"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  const dynamic = "force-dynamic";

  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ loggedIn: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ loggedIn: true });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
