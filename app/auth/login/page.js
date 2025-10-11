"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowResend(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful. Redirecting...");
        // cookie is set by server; navigate to protected page
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        setMessage(`⚠️ ${data.error || "Login failed."}`);

        // If account not verified, show resend option
        if (data.error && data.error.toLowerCase().includes("verify")) {
          setShowResend(true);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage("⚠️ Please enter your email first.");
      return;
    }

    try {
      setResending(true);
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(`📩 ${data.message || "Verification email sent!"}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070809] text-white p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-700 bg-transparent"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-700 bg-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="text-sm mt-3 text-gray-300">{message}</p>}

        {showResend && (
          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-3 text-green-400 underline hover:text-green-300 transition"
          >
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        )}
      </div>
    </main>
  );
}
