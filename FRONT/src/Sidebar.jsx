import React from "react"; 
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UnstyledButton, Group, Text, Tooltip, Avatar } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";

function Sidebar({ navData, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const activeLabel = navData.find((i) => i.link === location.pathname)?.label;

  // Toggle collapse on Ctrl+B
  useHotkeys([["mod+B", () => setCollapsed((c) => !c)]], []);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 768 && setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = navData.map((item) => (
    <NavLink
      to={item.link}
      key={item.label}
      className={({ isActive }) =>
        `no-underline w-full block mb-1 ${
          isActive ? "text-white" : "text-gray-300 hover:text-white"
        }`
      }
      end
    >
      {collapsed ? (
        <Tooltip label={item.label} position="right" withArrow>
          <div
            className={`flex justify-center py-3 rounded-md transition-all duration-200 ${
              activeLabel === item.label ? "bg-red-700 text-white" : ""
            }`}
          >
            <item.icon size="1.5rem" stroke={1.5} />
          </div>
        </Tooltip>
      ) : (
        <UnstyledButton
          className={`!w-full !rounded-md !px-4 !py-3 !transition-all !duration-200 !flex !items-center !gap-3 ${
            activeLabel === item.label
              ? "!bg-red-700 !text-white !font-medium"
              : "!text-gray-300 hover:!bg-red-900 hover:!text-white"
          }`}
        >
          <item.icon size="1.2rem" stroke={1.5} />
          <Text size="sm" fw={500} className="tracking-wide">
            {item.label}
          </Text>
        </UnstyledButton>
      )}
    </NavLink>
  ));

  return (
    <div
      style={{ width: collapsed ? 70 : 250 }}
      className="transition-all duration-300 ease-in-out bg-gradient-to-b from-red-950 to-red-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-10"
    >
      {/* Header with Logo */}
      <div
        className={`flex flex-col items-center justify-center p-4 mb-2 border-b border-red-800 ${
          collapsed ? "py-3" : "py-4"
        }`}
      >
        {!collapsed ? (
          <div className="flex flex-col items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z7UKOJyj_400x400.jpg-FaTwQMgv7594yqhjFNixF4tBplhmUG.jpeg"
              alt="Club Logo"
              className="h-12 w-12 mb-2"
            />
            <Text
              fw={700}
              size="md"
              className="text-white tracking-wide uppercase"
            >
              HUSA Club
            </Text>
          </div>
        ) : (
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/z7UKOJyj_400x400.jpg-FaTwQMgv7594yqhjFNixF4tBplhmUG.jpeg"
            alt="Club Logo"
            className="h-8 w-8"
          />
        )}
        <UnstyledButton
          onClick={() => setCollapsed((c) => !c)}
          className="!absolute !-right-3 !top-12 !h-6 !w-6 !rounded-full !bg-red-600 border !border-red-800 flex items-center justify-center shadow-md hover:!bg-red-700 transition-colors"
        >
          {collapsed ? (
            <IconChevronRight size="0.8rem" />
          ) : (
            <IconChevronLeft size="0.8rem" />
          )}
        </UnstyledButton>
      </div>

      {/* User Role Badge */}
      

      {/* Nav links */}
      <div
        className={`flex-grow overflow-y-auto px-2 ${
          collapsed ? "flex flex-col items-center" : ""
        }`}
      >
        {links}
      </div>
      <div className={`px-4 mb-4 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <div className="bg-red-800/50 rounded-md p-2 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
              {
                {
                  admin: "AD",
                  Journalist: "JR",
                  store_manager: "STM",
                }[user?.role || "NN"]
              }
            </div>
            <Text size="xs" className="text-gray-200">
              {
                {
                  admin: "Administrator",
                  Journalist: "Journalist",
                  store_manager: "Store Manager",
                }[user?.role || "User"]
              }
            </Text>
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
            {
              {
                admin: "AD",
                Journalist: "JR",
                store_manager: "STM",
              }[user?.role || "NN"]
            }
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <div className="border-t border-red-800 p-4 mt-auto bg-red-950/50">
        <Group position={collapsed ? "center" : "apart"}>
          <Group>
            <Avatar
              size={36}
              radius="xl"
              src={user?.avatar}
              className="border-2 border-red-700"
            />
            {!collapsed && (
              <div>
                <Text size="sm" fw={600}>
                  {user?.name || "User Name"}
                </Text>
                <Text size="xs" className="text-gray-400">
                  {user?.email || "user@example.com"}
                </Text>
              </div>
            )}
          </Group>
        </Group>
      </div> */}
    </div>
  );
}

export default Sidebar;
