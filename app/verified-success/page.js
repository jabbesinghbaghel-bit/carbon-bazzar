"use client";

import Link from "next/link";

export default function VerifiedSuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-center text-white">
      <h1 className="text-3xl font-bold mb-4 text-green-400">🎉 Email Verified Successfully!</h1>
      <p className="text-gray-300 mb-6">
        Your email has been verified. You can now log in to your Carbon Bazzar account.
      </p>
      <Link
        href="/auth/login"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
      >
        Go to Login
      </Link>
    </main>
  );
}
