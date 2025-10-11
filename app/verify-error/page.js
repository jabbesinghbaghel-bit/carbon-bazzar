"use client";

import Link from "next/link";

export default function VerifyErrorPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-center text-white">
      <h1 className="text-3xl font-bold mb-4 text-red-500">⚠️ Verification Failed</h1>
      <p className="text-gray-300 mb-6">
        The verification link may have expired or is invalid. Please try signing up again.
      </p>
      <Link
        href="/signup"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
      >
        Go to Sign Up
      </Link>
    </main>
  );
}
