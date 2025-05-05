import React from "react";
import Logout from "./Auth/Logout";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg relative z-10">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: App Title */}
        <h1 className="text-white font-bold text-lg">My App</h1>

        {/* Right: Logout Button */}
        <Logout />
      </div>
    </header>
  );
}
