"use client";
import { useEffect, useState } from "react";

export default function Market() {
  const [credits, setCredits] = useState([
    { symbol: "C1", price: 10, owned: 0 },
    { symbol: "C2", price: 20, owned: 0 },
  ]);

  const buy = (index) => {
    const symbol = credits[index].symbol;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    const newCredits = [...credits];
    newCredits[index].owned += 1;
    setCredits(newCredits);
    alert(`Bought 1 ${symbol}`);
  };

  const sell = (index) => {
    const symbol = credits[index].symbol;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    const newCredits = [...credits];
    if (newCredits[index].owned > 0) newCredits[index].owned -= 1;
    setCredits(newCredits);
    alert(`Sold 1 ${symbol}`);
  };

  return (
    <div>
      <h1>Market</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Owned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((c, i) => (
            <tr key={c.symbol}>
              <td>{c.symbol}</td>
              <td>{c.price}</td>
              <td>{c.owned}</td>
              <td>
                <button onClick={() => buy(i)}>Buy</button>
                <button onClick={() => sell(i)}>Sell</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
