import { IconLogout2 } from "@tabler/icons-react";
import { Tooltip, Group } from "@mantine/core";
import instance from "../helpers/axios";

export default function Logout() {
  const handleLogout = async () => {
    try {
      // Call the API endpoint to delete tokens (log the user out)
      const response = await instance.post("/logout");
      console.log(response.data.message); // Logged out

      // Clear Authorization header and local storage
      instance.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");

      // Reload the page (or you could redirect to a login page)
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Tooltip label="Log out" position="bottom" withArrow>
      <Group
        onClick={handleLogout}
        className="rounded-full px-3 py-2 transition-all duration-300 cursor-pointer text-white hover:bg-white/10"
        spacing="xs"
        noWrap
      >
        <IconLogout2 size={20} className="text-white flex-shrink-0" stroke={1.5} />
      </Group>
    </Tooltip>
  );
}
