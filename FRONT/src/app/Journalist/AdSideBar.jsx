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

export default function JRSideBar() {
  const user_role = getUserRole();
  const user_info = getUserInfo();

  // Only allow access if the provided role matches the allowed role
  if (user_role !== "journalist") {
    return <Navigate to="/unauthorized" replace />;
  }
  const nav_data = [
    { link: "/journalist", label: "Dashboard", icon: IconDashboard },
    { link: "/journalist/news", label: "News", icon: IconBlocks },

    // { link: "/groupes", label: "Groupes", icon: IconUsersGroup },
   
  ];

  return Sidebar({ navData: nav_data, user: user_info });
}
