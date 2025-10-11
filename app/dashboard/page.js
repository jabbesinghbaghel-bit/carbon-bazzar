"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Optional: fetch session info or validate on client
    const fetchSession = async () => {
      const res = await fetch("/api/auth/status"); // Optional status API
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/auth/login");
      }
    };
    fetchSession();
  }, [router]);

  if (!user) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-[#070809] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
      <p className="text-gray-300">This is a protected dashboard page.</p>
    </main>
  );
}
