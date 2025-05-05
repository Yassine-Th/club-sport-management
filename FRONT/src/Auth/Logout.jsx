import React from "react";
import { IconLogout2 } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import instance from "../helpers/axios";

export default function Logout() {
  const handleLogout = async () => {
    try {
      // Call logout API
      await instance.post("/logout");

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
    <Button
      color="red"
      variant="light"
      leftIcon={<IconLogout2 size={18} />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
