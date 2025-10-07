"use client";

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="bg-[#0B0D17] text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold">
          <span className="text-green-400">1000</span> USERS TRUST US
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Join the world’s leading carbon credit trading marketplace.
          Buy, sell, and offset with transparency.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            placeholder="Email or phone number"
            className="px-4 py-2 rounded-l-md border border-gray-700 bg-[#15171b] text-white w-64 sm:w-auto"
          />
          <button className="bg-green-400 px-6 py-2 rounded-md font-semibold text-black hover:bg-green-300">
            Sign Up
          </button>
        </div>
      </section>

      {/* Stats / SAFU */}
      <section className="bg-[#0e1114] py-14 text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-4">FUNDS ARE SAFU</h2>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">
          The Security of User Assets Fund 
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-8 justify-center items-center">
          <div className="text-center">
            <div className="text-2xl font-bold">1000</div>
            <div className="text-sm text-gray-400">USDC in SAFU</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">500</div>
            <div className="text-sm text-gray-400">Users helped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$229,433</div>
            <div className="text-sm text-gray-400">Funds recovered</div>
          </div>
        </div>
      </section>

      {/* App preview */}
      <section className="py-16 flex flex-col items-center gap-6">
        <h3 className="text-2xl font-bold">Trade on the go. Anywhere, anytime.</h3>
        <p className="text-gray-400 max-w-xl text-center">
          Download the CarbonBazzar app for iOS and Android.
        </p>

        <div className="mt-6 flex items-center gap-6">
          <div className="bg-[#15171b] rounded-xl p-4">
            <img src="/app-preview.png" alt="App preview" className="w-40" />
          </div>
          <div className="text-center">
            <img src="/qr-code.png" alt="QR" className="w-28 h-28 mx-auto" />
            <p className="text-gray-400 mt-2">Scan to Download</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0e1114] py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4 px-4">
          {[
            "What is a carbon trading marketplace?",
            "What products does Carbon Bazzar provide?",
            "How to buy carbon credits?",
            "How to track carbon prices?",
          ].map((q, i) => (
            <details key={i} className="bg-[#0b0d11] p-4 rounded-lg border border-gray-800">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="text-gray-400 mt-2">
                This is an answer placeholder. Replace with your real FAQ content.
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070809] border-t border-gray-800 py-8 text-center text-gray-400">
        © {new Date().getFullYear()} Carbon Bazzar — Built with Next.js & Tailwind
      </footer>
    </main>
  );
}
