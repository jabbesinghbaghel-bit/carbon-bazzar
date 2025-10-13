"use client";

import { useState } from "react";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Resend Verification Email</h2>
      <form onSubmit={handleResend}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 w-full p-2 rounded text-white font-medium"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
    </div>
  );
}
