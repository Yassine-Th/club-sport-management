import React from "react";
import {
  IconDashboard,
  IconUsersGroup,
  IconCalendarEvent,
  IconNews,
  IconShirt,
  IconTicket,
  IconSettings,
} from "@tabler/icons-react";
import { Navigate } from "react-router-dom";
import { getUserInfo, getUserRole } from "../../helpers/access_token";
import Sidebar from "../../Sidebar";

export default function AdSideBar() {
  const user_role = getUserRole();
  const user_info = getUserInfo();

  // Only allow access if the provided role tabler the allowed role
  if (user_role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Updated navigation data with football club related items
  const nav_data = [
    { link: "/admin", label: "Dashboard", icon: IconDashboard },
    { link: "/admin/team", label: "Team", icon: IconUsersGroup },
    { link: "/admin/fixtures", label: "Fixtures", icon: IconCalendarEvent },
    { link: "/admin/news", label: "News", icon: IconNews },
    { link: "/admin/shop", label: "Shop", icon: IconShirt },
    { link: "/admin/tickets", label: "Tickets", icon: IconTicket },
  ];

  return Sidebar({ navData: nav_data, user: user_info });
}
