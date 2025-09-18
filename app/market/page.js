'use client';

import { useState, useEffect } from 'react';

export default function Market() {
  const [credits, setCredits] = useState([]);
  const [msg, setMsg] = useState('');

  // Example carbon credits symbols; replace with your actual market data if needed
  const availableCredits = [
    { symbol: 'CR1', name: 'Carbon Credit 1' },
    { symbol: 'CR2', name: 'Carbon Credit 2' },
    { symbol: 'CR3', name: 'Carbon Credit 3' },
  ];

  // Load portfolio from API
  async function loadPortfolio() {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    const res = await fetch('/api/market/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    // Merge available credits with owned amounts
    const merged = availableCredits.map(c => {
      const ownedCredit = data.portfolio.find(p => p.symbol === c.symbol);
      return { ...c, owned: ownedCredit ? ownedCredit.amount : 0 };
    });

    setCredits(merged);
  }

  useEffect(() => {
    loadPortfolio();
  }, []);

  // Buy credit
  async function buy(index) {
    const symbol = credits[index].symbol;
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    const res = await fetch('/api/market/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, symbol }),
    });

    const data = await res.json();

    if (data.portfolio) {
      const newCredits = credits.map(c => {
        const updated = data.portfolio.find(p => p.symbol === c.symbol);
        return { ...c, owned: updated ? updated.amount : 0 };
      });
      setCredits(newCredits);
    }

    setMsg(data.message);
  }

  // Sell credit
  async function sell(index) {
    const symbol = credits[index].symbol;
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    const res = await fetch('/api/market/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, symbol }),
    });

    const data = await res.json();

    if (data.portfolio) {
      const newCredits = credits.map(c => {
        const updated = data.portfolio.find(p => p.symbol === c.symbol);
        return { ...c, owned: updated ? updated.amount : 0 };
      });
      setCredits(newCredits);
    }

    setMsg(data.message);
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Carbon Market</h1>
      <p>{msg}</p>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Owned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((c, idx) => (
            <tr key={c.symbol}>
              <td>{c.symbol}</td>
              <td>{c.name}</td>
              <td>{c.owned}</td>
              <td>
                <button onClick={() => buy(idx)}>Buy</button>{' '}
                <button onClick={() => sell(idx)}>Sell</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
