"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ loggedIn: true, user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ loggedIn: false });
  }
}
