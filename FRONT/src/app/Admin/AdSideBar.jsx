import React from "react";
import {
  IconDashboard,
  IconUsersGroup,
  IconBackpackOff,
  IconSchool,
  IconReport,
  IconFileCheck,
  IconBlocks,
} from "@tabler/icons-react";
import { Navigate } from "react-router-dom";
import { getUserInfo, getUserRole } from "../../helpers/access_token";
import Sidebar from "../../Sidebar";

export default function AdSideBar() {
  const user_role = getUserRole();
  const user_info = getUserInfo();

  // Only allow access if the provided role matches the allowed role
  if (user_role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }
  const nav_data = [
    { link: "/admin", label: "Dashboard", icon: IconDashboard },
    // { link: "/groupes", label: "Groupes", icon: IconUsersGroup },
   
  ];

  return Sidebar({ navData: nav_data, user: user_info });
}
