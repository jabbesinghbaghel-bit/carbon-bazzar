"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token"); // Token stored after login
        if (!token) {
          router.push("/login"); // redirect if not authenticated
          return;
        }

        const res = await fetch("/api/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push("/login"); // unauthorized
          return;
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
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
