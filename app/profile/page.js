"use client";

import { useState, useEffect } from "react";

export default function Profile({ userId }) {
  const [profile, setProfile] = useState({
    name: "",
    panNumber: "",
    kycStatus: "",
    bankAccount: "",
    ifsc: "",
    address: "",
    phone: "",
    dob: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user profile on load
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        if (data.user) setProfile(data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Updating...");
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, userId })
      });
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Update failed due to server error");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Profile Update</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="panNumber"
          placeholder="PAN Number"
          value={profile.panNumber || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="kycStatus"
          placeholder="KYC Status"
          value={profile.kycStatus || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="bankAccount"
          placeholder="Bank Account"
          value={profile.bankAccount || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="ifsc"
          placeholder="IFSC Code"
          value={profile.ifsc || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profile.address || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={profile.phone || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={profile.dob ? profile.dob.split("T")[0] : ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
