"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // temporary toggle; later replace with real auth check

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsLoggedIn(false);
        router.push("/auth/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-[#0B0D17] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      {/* Left - Logo + Name */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Carbon Bazzar Logo"
          className="h-8 md:h-10 w-auto max-w-[100px] object-contain"
        />
        <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
          Carbon Bazzar
        </span>
      </div>

      {/* Right - Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <a href="/" className="text-gray-300 hover:text-white transition">
          Home
        </a>
        <a href="/about" className="text-gray-300 hover:text-white transition">
          About
        </a>
        <a href="/projects" className="text-gray-300 hover:text-white transition">
          Projects
        </a>
        <a href="/contact" className="text-gray-300 hover:text-white transition">
          Contact
        </a>

        {/* Conditional Buttons */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <a
              href="/signup"
              className="bg-green-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-green-400 transition"
            >
              Sign Up
            </a>
            <a
              href="/auth/login"
              className="border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Login
            </a>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-sm"
          >
            Logout
          </button>
        ) : (
          <>
            <a
              href="/signup"
              className="bg-green-500 text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-green-400 transition text-sm"
            >
              Sign Up
            </a>
            <a
              href="/auth/login"
              className="border border-green-500 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition text-sm"
            >
              Login
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
