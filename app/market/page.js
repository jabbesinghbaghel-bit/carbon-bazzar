// app/market/page.js
"use client";

import { useEffect, useState } from "react";

export default function MarketPage() {
  const [certs, setCerts] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/certificates")
      .then(r => r.json())
      .then(setCerts)
      .catch(e => console.error(e));
  }, []);

  async function buy(id) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    const res = await fetch("/api/certificates/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ certificateId: id, qty: 1 }),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Error");
    else {
      setMsg(data.message || "Bought");
      // refresh list to show updated credits
      fetch("/api/certificates").then(r => r.json()).then(setCerts);
    }
  }

  return (
    <div>
      <h1>Market</h1>
      <p>{msg}</p>
      <table>
        <thead>
          <tr><th>Project</th><th>Issuer</th><th>Credits</th><th>Price</th><th>Action</th></tr>
        </thead>
        <tbody>
          {certs.map(c => (
            <tr key={c._id}>
              <td>{c.projectName}</td>
              <td>{c.issuedBy}</td>
              <td>{c.credits}</td>
              <td>{c.price}</td>
              <td><button onClick={() => buy(c._id)}>Buy 1</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
