"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifiedSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/auth/login"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070809] text-white">
      <div className="text-center max-w-md p-6">
        <h1 className="text-3xl font-bold text-green-500 mb-4">
          ✅ Email Verified Successfully!
        </h1>
        <p className="text-gray-300 mb-6">
          You can now log in to your Carbon Bazzar account.
        </p>
        <button
          onClick={() => router.push("/auth/login")}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
        >
          Go to Login
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to login in 5 seconds...
        </p>
      </div>
    </main>
  );
}
