"use client"; // must be at the very top

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile/get");
      const data = await res.json();
      setProfile(data);
    }
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {profile ? <p>Welcome, {profile.name}</p> : <p>Loading...</p>}
    </div>
  );
}
