import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { UnstyledButton, Group, Text, Tooltip, Avatar } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";

function Sidebar({ navData, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const activeLabel = navData.find((i) => i.link === location.pathname)?.label;

  //Toggle collapse on Ctrl+B
  useHotkeys([["mod+B", () => setCollapsed((c) => !c)]], []);

  // auto-collapse on small screens
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
          isActive ? "text-white" : "text-gray-400 hover:text-white"
        }`
      }
      end
    >
      {collapsed ? (
        <Tooltip label={item.label} position="right" withArrow>
          <div
            className={`flex justify-center py-3 rounded-md transition-all duration-200 ${
              activeLabel === item.label ? "bg-blue-600 text-white" : ""
            }`}
          >
            <item.icon size="1.5rem" stroke={1.5} />
          </div>
        </Tooltip>
      ) : (
        <UnstyledButton
          className={`!w-full !rounded-md !px-4 !py-3 !transition-all !duration-200 !flex !items-center !gap-3 ${
            activeLabel === item.label
              ? "!bg-blue-600 !text-white !font-medium"
              : "!text-gray-300 hover:!bg-slate-800 hover:!text-white"
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
      className="transition-all duration-300 ease-in-out bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-10"
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 mb-6 border-b border-slate-800 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed ? (
          <Group spacing="sm">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
              {
                {
                  admin: "AD",
                  Journalist: "JR",
                  store_manager: "STM",
                }[user?.role || "NN"]
              }
            </div>
            <Text fw={600} size="md" className="text-white tracking-wide">
              {user?.name ?? "NN"}
            </Text>
          </Group>
        ) : (
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
            {
              {
                administrateur: "AD",
                formateur: "FM",
                stagiaire: "ST",
                surveillant_generale: "SG",
              }[user?.role || "NN"]
            }
          </div>
        )}
        <UnstyledButton
          onClick={() => setCollapsed((c) => !c)}
          className="!absolute !-right-3 !top-5 !h-6 !w-6 !rounded-full !bg-blue-600 border !border-slate-800 flex items-center justify-center shadow-md hover:!bg-blue-700 transition-colors"
        >
          {collapsed ? (
            <IconChevronRight size="0.8rem" />
          ) : (
            <IconChevronLeft size="0.8rem" />
          )}
        </UnstyledButton>
      </div>

      {/* Nav links */}
      <div
        className={`flex-grow overflow-y-auto px-2 ${
          collapsed ? "flex flex-col items-center" : ""
        }`}
      >
        {links}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4 mt-auto">
        <Group position={collapsed ? "center" : "apart"}>
          <Group>
            {/* <Avatar
              size={36}
              radius="xl"
              src={user?.avatar}
              className="border-2 border-slate-700"
            /> */}
            {!collapsed && (
              <div>
                <Text size="sm" fw={600}>
                  {user?.name}
                </Text>
                <Text size="xs" className="text-gray-400">
                  {user?.email}
                </Text>
              </div>
            )}
          </Group>
        </Group>
      </div>
    </div>
  );
}

export default Sidebar;
