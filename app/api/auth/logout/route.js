"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const dynamic = "force-dynamic";

  cookies().delete("token", { path: "/" });
  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}
