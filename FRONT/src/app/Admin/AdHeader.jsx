import React from "react";
import Logout from "../../Auth/Logout";

export default function AdHeader() {
  return (
    <header className="bg-gradient-to-r from-red-800 to-red-900 shadow-lg relative z-10">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo and Club Name */}
        <div className="flex items-center space-x-3">
          {/* <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z7UKOJyj_400x400.jpg-FaTwQMgv7594yqhjFNixF4tBplhmUG.jpeg"
            alt="HUSA Club Logo"
            className="h-8 w-8"
          />
          <h1 className="text-white font-bold text-lg ">HUSA Club</h1> */}
        </div>

        {/* Right: Logout Button */}
        <Logout />
      </div>
    </header>
  );
}
