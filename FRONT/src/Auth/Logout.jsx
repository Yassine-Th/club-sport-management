import React from "react";
import { IconLogout2 } from "@tabler/icons-react";
import instance from "../helpers/axios";

export default function Logout() {
  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await instance.post("/logout");
      console.log(response.data);
      
      // Clear auth headers and tokens
      instance.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");

      // Reload the page or redirect
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center
        px-3 py-2
        bg-red-600 hover:bg-red-700
        text-white font-medium
        rounded focus:outline-none focus:ring-2 focus:ring-red-400
        transition-colors
      "
    >
      <IconLogout2 size={18} className="mr-2" />
      Logout
    </button>
  );
}
