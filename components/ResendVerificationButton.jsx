"use client";

import { useState } from "react";

export default function ResendVerificationButton({ email }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleResend() {
    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to resend email");

      setMessage("Verification email sent! Please check your inbox.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleResend}
        disabled={loading}
        className={`px-5 py-2 rounded-xl font-medium transition ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Sending..." : "Resend Verification Email"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-green-500 font-medium">{message}</p>
      )}
      {error && <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
