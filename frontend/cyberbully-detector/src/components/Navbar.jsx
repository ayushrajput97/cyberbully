export default function Navbar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#1a1c2c]/70 via-[#2a2d4a]/60 to-[#1a1c2c]/70 backdrop-blur-2xl border-b border-white/10 shadow-md flex justify-between items-center px-8 py-4 fixed top-0 left-64 right-0 z-40 rounded-bl-2xl">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white tracking-wide">
        Cyber<span className="text-blue-400">AI</span> Dashboard
      </h1>

      {/* Welcome text */}
      <div className="text-gray-200 text-lg font-medium flex items-center space-x-2">
        <span>Welcome Back</span>
        <span className="animate-wave">👋</span>
      </div>

      <style>
        {`
          .animate-wave {
            display: inline-block;
            animation: wave 1.4s infinite;
          }
          @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
        `}
      </style>
    </div>
  );
}
