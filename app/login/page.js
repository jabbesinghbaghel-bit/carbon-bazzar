"use client";
import { useState } from "react";
import Navbar from "../components/navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");
        // Redirect to dashboard or homepage
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setMessage(`⚠️ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Welcome Back</h2>
          <p className="text-gray-300 mb-6">Login to your Carbon Bazzar account</p>

          <form onSubmit={handleLogin} className="flex flex-col items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white w-64"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="px-3 py-2 rounded-md border border-gray-600 bg-transparent text-white w-64"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {message && (
              <p
                className={`text-sm mt-2 ${
                  message.startsWith("✅") ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
