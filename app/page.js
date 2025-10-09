"use client";
import Navbar from "./components/navbar";
import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ User registered successfully!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`⚠️ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <main>
      <Navbar />
      <section>
        <div className="text-center py-10">
          <h2 className="text-3xl font-bold mb-4 text-white">TRADE IN CARBON CERTIFICATES</h2>
          <p className="text-gray-300 mb-6">
            Join the world’s leading carbon credit trading marketplace.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col items-center gap-3">
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
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Sign Up
            </button>

            {message && <p className="text-sm mt-2 text-gray-300">{message}</p>}
          </form>


        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070809] border-t border-gray-800 py-8 text-center text-gray-400">
        © {new Date().getFullYear()} Carbon Bazzar — Built with Next.js & Tailwind
      </footer>
    </main>
  );
}
