import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Reddit", path: "/reddit" },
    { name: "Twitter", path: "/twitter" },
    { name: "YouTube", path: "/youtube" },
    { name: "Analyze Prompt", path: "/analyze" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white/10 backdrop-blur-2xl border-r border-white/20 shadow-xl p-6 flex flex-col z-50">
      {/* 🌌 Logo */}
      <h2 className="text-3xl font-bold mb-10 text-white tracking-wide drop-shadow-lg text-center">
        Cyber<span className="text-blue-400">Bullying</span>
      </h2>

      {/* 📋 Navigation */}
      <ul className="space-y-3">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

     
      {/* ✨ Extra Style */}
      <style>
        {`
          .active-glow {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          }
        `}
      </style>
    </div>
  );
}
