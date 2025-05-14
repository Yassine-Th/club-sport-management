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
    { link: "/admin", label: "Tableau de bord", icon: IconDashboard },
    {
      link: "/admin/my_club",
      label: "Mon Club",
      icon: IconShield,
      children: [
        { link: "/admin/players", label: "Joueurs", icon: IconUsersGroup },
        { link: "/admin/titres", label: "Trophées", icon: IconTrophy },
      ],
    },
    { link: "/admin/team", label: "Autres Équipes", icon: IconUsersGroup },
    { link: "/admin/fixtures", label: "Calendrier", icon: IconCalendarEvent },

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
    { link: "/admin/tickets", label: "Billets", icon: IconTicket },
    { link: "/admin/news", label: "Actualités", icon: IconNews },
  ];

  return <Sidebar navData={nav_data} user={user_info} />;
}
