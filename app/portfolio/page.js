// app/portfolio/page.js
"use client";

import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/portfolio", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setItems);

    fetch("/api/transactions", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setTxs);
  }, []);

  return (
    <div>
      <h1>Your Portfolio</h1>
      <h2>Holdings</h2>
      <ul>
        {items.map(i => (
          <li key={i.certificateId}>
            {i.certificate.projectName} — Qty: {i.quantity} — Price: {i.certificate.price}
          </li>
        ))}
      </ul>

      <h2>Transactions</h2>
      <ul>
        {txs.map(t => (
          <li key={t._id}>
            {t.action} {t.quantity} units — total {t.total} — {new Date(t.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
