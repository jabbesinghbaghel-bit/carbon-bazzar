import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default function DashboardPage() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      // middleware should have redirected already, but fallback:
      return (
        <main className="min-h-screen flex items-center justify-center text-white">
          <p>Not authenticated. Redirecting...</p>
        </main>
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded?.email || "User";

    return (
      <main className="min-h-screen bg-[#070809] text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="mb-6">Welcome, <span className="font-medium">{email}</span>!</p>

          <section className="bg-[#0B0D17] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Your account</h2>
            <p className="text-gray-300">This is a protected page — only visible when authenticated.</p>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>Unable to verify token. Please login again.</p>
      </main>
    );
  }
}
