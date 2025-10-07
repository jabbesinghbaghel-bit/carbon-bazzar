"use client";
import { useState } from "react";

export default function CreateCertificatePage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    issuedTo: "",
    quantity: "",
    price: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Creating certificate...");

    const res = await fetch("/api/certificates/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Certificate created successfully!");
      setForm({ name: "", description: "", issuedTo: "", quantity: "", price: "" });
    } else {
      setMessage("❌ Error: " + data.error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Carbon Certificate</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Certificate Name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full" />
        <input name="issuedTo" placeholder="Issued To (Company/User)" value={form.issuedTo} onChange={handleChange} className="border p-2 w-full" />
        <input type="number" name="quantity" placeholder="Quantity (tons)" value={form.quantity} onChange={handleChange} className="border p-2 w-full" />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
