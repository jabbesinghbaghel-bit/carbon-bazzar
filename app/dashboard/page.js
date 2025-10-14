"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic"; // ✅ important for Vercel dynamic fetches

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // ✅ Ensure this only runs on the client (Vercel Edge doesn’t support localStorage)
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", // ✅ avoids Vercel caching old user data
        });

        if (!res.ok) {
          if (res.status === 401) router.push("/login");
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("❌ Dashboard Error:", err);
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        No profile data available
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold mb-3">Profile Details</h2>
        <p><strong>Name:</strong> {profile.name || "Not updated"}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>PAN:</strong> {profile.pan || "Not updated"}</p>
        <p><strong>Aadhar:</strong> {profile.aadhar || "Not updated"}</p>
        <p><strong>KYC Status:</strong> {profile.kycStatus || "Pending"}</p>
        <p><strong>Phone:</strong> {profile.phone || "Not updated"}</p>
      </div>
    </div>
  );
}
