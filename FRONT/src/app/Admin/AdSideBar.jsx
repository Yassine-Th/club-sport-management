import React from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo, getUserRole } from "../../helpers/access_token";
import Sidebar from "../../Sidebar";
import {
  IconDashboard,
  IconUsersGroup,
  IconCalendarEvent,
  IconNews,
  IconShirt,
  IconTicket,
} from "@tabler/icons-react";

export default function AdSideBar() {
  const user_role = getUserRole();
  const user_info = getUserInfo();

  if (user_role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  const nav_data = [
    { link: "/admin", label: "Dashboard", icon: IconDashboard },
    { link: "/admin/team", label: "Team", icon: IconUsersGroup },
    {
      link: "/admin/boutique",
      label: "Boutique",
      icon: IconShirt,
      children: [
        { link: "/admin/boutique/produits", label: "produits" },
        { link: "/admin/boutique/categories", label: "Categories" },
        { link: "/admin/boutique/orders", label: "Orders" },
      ],
    },
    { link: "/admin/fixtures", label: "Fixtures", icon: IconCalendarEvent },
    { link: "/admin/news", label: "News", icon: IconNews },
    { link: "/admin/tickets", label: "Tickets", icon: IconTicket },
  ];

  return <Sidebar navData={nav_data} user={user_info} />;
}
