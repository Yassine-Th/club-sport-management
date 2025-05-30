import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { NavLink, useLocation } from "react-router-dom";
import { UnstyledButton, Text, Tooltip } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconChevronRight,
  IconChevronLeft,
  IconChevronDown,
} from "@tabler/icons-react";
import img from "./assets/logo.png"; // Assuming you have a logo image

function Sidebar({ navData, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openItem, setOpenItem] = useState(null);
  const location = useLocation();
  const submenuTimeoutRef = useRef(null); // Ref to store submenu timeout ID

  const activeLabel = navData.find((i) => i.link === location.pathname)?.label;

  useHotkeys([["mod+B", () => setCollapsed((c) => !c)]], []);

  // Auto-collapse on small screens (original logic preserved)
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 768) {
  //       setCollapsed(true);
  //     }
  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize(); // Initial check
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // Handlers for submenu visibility with timeout
  const handleSubmenuMouseEnter = (itemLabel) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
    setOpenItem(itemLabel);
  };

  const handleSubmenuMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenItem(null);
    }, 200); // Adjust delay as needed (e.g., 200-300ms)
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  const links = navData.map((item) => {
    const isActive = activeLabel === item.label; // For custom active styling of the parent
    const hasChildren =
      Array.isArray(item.children) && item.children.length > 0;
    const isOpen = openItem === item.label;

    return (
      <div
        key={item.label}
        className="relative w-full mb-1"
        onMouseEnter={() => {
          if (hasChildren) {
            handleSubmenuMouseEnter(item.label);
          }
        }}
        onMouseLeave={() => {
          if (hasChildren) {
            handleSubmenuMouseLeave();
          }
        }}
      >
        <NavLink
          to={item.link}
          className={(
            { isActive: isNavActive } // isNavActive from NavLink
          ) =>
            `no-underline w-full block ${
              // Use isNavActive for NavLink's own active state, isActive for custom parent highlight
              isNavActive && !hasChildren // Only color if it's a direct link and not a parent of an open submenu
                ? "text-white"
                : "text-gray-300 hover:text-white"
            }`
          }
          end // Important for NavLink to not stay active for child routes
        >
          {collapsed ? (
            <Tooltip label={item.label} position="right" withArrow>
              <div
                className={`flex justify-center py-3 rounded-md transition-all duration-200 ${
                  isActive ? "bg-red-700 text-white" : "" // Custom active style
                }`}
              >
                <item.icon size="1.5rem" stroke={1.5} />
              </div>
            </Tooltip>
          ) : (
            <UnstyledButton
              className={`!w-full !rounded-md !px-4 !py-3 !transition-all !duration-200 !flex !items-center !gap-3 ${
                isActive && !isOpen // Highlight if active AND its submenu isn't open (or no submenu)
                  ? "!bg-red-700 !text-white !font-medium"
                  : "!text-gray-300 hover:!bg-red-900 hover:!text-white"
              } ${isOpen ? "!bg-red-900 !text-white" : ""}`} // Keep parent highlighted if submenu is open
            >
              <item.icon size="1.2rem" stroke={1.5} />
              <Text size="sm" fw={500} className="tracking-wide">
                {item.label}
              </Text>
              {hasChildren && (
                <IconChevronDown
                  size="1rem"
                  className={`ml-auto transition-transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </UnstyledButton>
          )}
        </NavLink>

        {/* Submenu: display below parent */}
        {/* Conditionally render submenu only if not collapsed, or adjust styling for collapsed state */}
        {hasChildren && isOpen && !collapsed && (
          <div
            className="absolute left-0 top-full mt-1 w-full bg-red-900 text-white rounded shadow-lg z-20"
            onMouseEnter={() => handleSubmenuMouseEnter(item.label)} // Keep submenu open
            onMouseLeave={handleSubmenuMouseLeave} // Allow closing if mouse leaves submenu
          >
            {item.children.map((child) => (
              <NavLink
                to={child.link}
                key={child.label}
                className={({ isActive: isChildActive }) =>
                  `block px-4 py-2 no-underline text-sm ${
                    // Added text-sm for consistency
                    isChildActive
                      ? "bg-red-700 text-white font-medium"
                      : "text-gray-200 hover:bg-red-800 hover:text-white"
                  }`
                }
                end
                onClick={() => setOpenItem(null)} // Optional: close submenu on child click
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <div
      style={{ width: collapsed ? 70 : 250 }}
      className="transition-all duration-300 ease-in-out bg-gradient-to-b from-red-950 to-red-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-10"
    >
      {/* Header with Logo */}
      <div
        className={`flex flex-col items-center justify-center p-4 mb-2 border-b border-red-800 ${
          collapsed ? "py-3" : "py-3" // No change if p-4 is desired for both
        }`}
      >
        {!collapsed ? (
          <div className="flex items-center">
            <img
              src={img}
              alt="Club Logo"
              className="h-12 w-12" // Removed mb-2, spacing handled by flex gap or parent padding
            />
            <Text
              fw={700}
              size="md"
              className="text-white tracking-wide uppercase ml-2.5"
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
      </div>

      {/* Nav links */}
      <div
        className={`flex-grow overflow-y-auto px-2 py-5 ${
          collapsed ? "flex flex-col items-center" : ""
        }`}
      >
        {links}
      </div>

      {/* User Role Badge */}
      <div className={`px-4 mb-4 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <div className="bg-red-800/50 rounded-md p-2 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
              {
                { admin: "AD", Journalist: "JR", store_manager: "STM" }[
                  user?.role || "NN"
                ]
              }
            </div>
            <Text size="xs" className="text-gray-200">
              {
                {
                  admin: "Administrator",
                  Journalist: "Journalist",
                  store_manager: "Store Manager",
                  default: "User", // Added a default case
                }[user?.role || "default"]
              }
            </Text>
          </div>
        ) : (
          <Tooltip
            label={
              {
                admin: "Administrator",
                Journalist: "Journalist",
                store_manager: "Store Manager",
                default: "User",
              }[user?.role || "default"]
            }
            position="right"
            withArrow
          >
            <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs cursor-default">
              {
                { admin: "AD", Journalist: "JR", store_manager: "STM" }[
                  user?.role || "NN"
                ]
              }
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
