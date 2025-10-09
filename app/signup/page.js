"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Signing up...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! Welcome to Carbon Bazzar.");
        setForm({ name: "", email: "", password: "" });
      } else {
        setMessage(`❌ ${data.error || "Signup failed"}`);
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D17] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Join Carbon Bazzar Today 🌱
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-600"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-600"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-600"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-semibold"
        >
          Sign Up
        </button>
      </form>

      {message && (
        <p className="mt-4 text-gray-300 text-center whitespace-pre-line">
          {message}
        </p>
      )}
    </div>
  );
}
