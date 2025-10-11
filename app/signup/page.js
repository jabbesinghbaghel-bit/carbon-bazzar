"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registered successfully! Please check your email to verify your account.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        setMessage(`⚠️ ${data.error || "Registration failed."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#070809] text-white p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-3">
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
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-700 bg-transparent"
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-700 bg-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {message && <p className="text-sm mt-2 text-gray-300">{message}</p>}
        </form>

        <p className="mt-3 text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-green-500 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </main>
  );
}
