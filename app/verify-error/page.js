"use client";

import { useRouter } from "next/navigation";

export default function VerifyError() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070809] text-white">
      <div className="text-center max-w-md p-6">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          ❌ Verification Failed
        </h1>
        <p className="text-gray-300 mb-6">
          The verification link is invalid or has expired.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
        >
          Try Signing Up Again
        </button>
      </div>
    </main>
  );
}
