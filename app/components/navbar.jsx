export default function Navbar() {
  return (
    <nav className="bg-[#0B0D17] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      {/* Left - Logo + Name */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Carbon Bazzar Logo"
          className="h-10 w-auto"
        />
        <span className="text-2xl font-bold text-white">
          Carbon<span className="text-green-400">Bazzar</span>
        </span>
      </div>

      {/* Right - Menu */}
      <div className="hidden md:flex items-center gap-6 text-gray-300">
        <a href="#" className="hover:text-green-400">Home</a>
        <a href="#" className="hover:text-green-400">Trade</a>
        <a href="#" className="hover:text-green-400">About</a>
        <a href="#" className="hover:text-green-400">Contact</a>
        <button className="bg-green-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-green-300">
          Sign Up
        </button>
      </div>
    </nav>
  );
}
