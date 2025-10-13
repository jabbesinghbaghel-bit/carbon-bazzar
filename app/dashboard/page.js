"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile/get");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      <p>Email: {profile.email}</p>
      {/* Add more profile fields here */}
    </div>
  );
}
