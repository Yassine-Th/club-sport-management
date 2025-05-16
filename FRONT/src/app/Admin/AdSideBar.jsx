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
  IconShield,
  IconTrophy 
} from "@tabler/icons-react";

export default function AdSideBar() {
  const user_role = getUserRole();
  const user_info = getUserInfo();

  if (user_role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  const nav_data = [
    { link: "/admin", label: "Dashboard", icon: IconDashboard },
   
    {
      link: "/admin/my_club",
      label: "my_club",
      icon: IconShield,
      children: [
        { link: "/admin/my_club/titres", label: "Trophy" },
        { link: "/admin/my_club/players", label: "Players" },
        { link: "/admin/my_club/matches", label: "Matches" },
      ],
    },
    { link: "/admin/clubs", label: "Clubs", icon: IconUsersGroup },
    { link: "/admin/news", label: "News", icon: IconNews },
    {
      link: "/admin/boutique",
      label: "Boutique",
      icon: IconShirt,
      children: [
        { link: "/admin/boutique/produits", label: "Produits" },
        { link: "/admin/boutique/categories", label: "Catégories" },
        { link: "/admin/boutique/orders", label: "Commandes" },
      ],
    },
    { link: "/admin/fixtures", label: "Fixtures", icon: IconCalendarEvent },
    { link: "/admin/tickets", label: "Tickets", icon: IconTicket },
    { link: "/admin/news", label: "Actualités", icon: IconNews },
  ];

  return <Sidebar navData={nav_data} user={user_info} />;
}
