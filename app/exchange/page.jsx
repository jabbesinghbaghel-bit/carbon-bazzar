// Binance-inspired Exchange Scaffold (original design)
// NOTE: This file is an original, legal scaffold inspired by common crypto-exchange layouts.
// It intentionally avoids copying Binance's trademarked branding, exact visuals, or proprietary code.

import React from 'react';

export default function ExchangeDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">CB</div>
            <nav className="hidden md:flex items-center gap-6">
              <a className="hover:underline" href="#markets">Markets</a>
              <a className="hover:underline" href="#trade">Trade</a>
              <a className="hover:underline" href="#wallet">Wallet</a>
              <a className="hover:underline" href="#learn">Learn</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border rounded text-sm">Login</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Sign up</button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Markets list */}
        <aside className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Markets</h3>
          <ul className="divide-y">
            {['BTC/INR','ETH/INR','USDT/INR','BNB/INR'].map((m) => (
              <li key={m} className="py-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{m}</div>
                  <div className="text-sm text-slate-500">24h change</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹0.00</div>
                  <div className="text-sm text-slate-500">Vol</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center column: Chart + Orderbook */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">BTC / INR</h2>
                <p className="text-sm text-slate-500">Market price • Spot</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹0.00</div>
                <div className="text-sm text-slate-500">24h: 0.00%</div>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="h-72 bg-gradient-to-b from-white to-slate-100 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
              Chart placeholder (integrate TradingView or Recharts)
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded border">Order Book (asks/bids)</div>
              <div className="bg-slate-50 p-3 rounded border">Recent Trades</div>
            </div>
          </div>

          {/* Order form */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Place Order</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="p-2 border rounded">
                <option>Limit</option>
                <option>Market</option>
                <option>Stop-Limit</option>
              </select>
              <input className="p-2 border rounded" placeholder="Price (INR)" />
              <input className="p-2 border rounded" placeholder="Amount (BTC)" />
            </div>

            <div className="mt-3 flex gap-3">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded">Buy</button>
              <button className="px-4 py-2 bg-rose-600 text-white rounded">Sell</button>
              <button className="px-4 py-2 border rounded">Advanced</button>
            </div>
          </div>

          {/* Wallet / balances */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Wallet Balances</h3>
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th>Asset</th>
                  <th>Available</th>
                  <th>In Orders</th>
                </tr>
              </thead>
              <tbody>
                {['BTC','ETH','USDT'].map(a=> (
                  <tr key={a} className="border-t">
                    <td className="py-2">{a}</td>
                    <td className="py-2">0.0000</td>
                    <td className="py-2">0.0000</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="mt-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-slate-500 flex justify-between">
          <div>© {new Date().getFullYear()} CarbonBazzar — an original project</div>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
