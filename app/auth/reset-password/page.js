"use client"; // Must be a Client Component for useState and useEffect

import { useState } from "react";

export default function ResetPassword({ searchParams }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [kycStatus, setKycStatus] = useState("Pending");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = searchParams?.token; // Get token from URL query

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          profile: {
            fullName,
            panNumber,
            bankAccount,
            ifsc,
            kycStatus,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password & Update Profile</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* SEBI Profile Details */}
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>PAN Number</label>
          <input
            type="text"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Bank Account</label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>IFSC</label>
          <input
            type="text"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>KYC Status</label>
          <select
            value={kycStatus}
            onChange={(e) => setKycStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Reset Password & Update Profile
        </button>
      </form>
    </div>
  );
}
