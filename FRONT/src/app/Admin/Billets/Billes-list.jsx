import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
  IconFilter,
  IconX,
  IconEye,
  IconRefresh,
} from "@tabler/icons-react";
import { Text, Badge, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";

const BillesList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [types] = useState(["match", "event"]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Gestion des Billets | HUSA Club Admin";
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/tickets");
      setTickets(response.data);
      setError(null);
      setSuccess(null);
    } catch (err) {
      console.error("Erreur lors du chargement des billets:", err);
      setError("Impossible de charger les billets. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await instance.delete(`/tickets/${selectedTicket.id}`);
      setTickets(tickets.filter((t) => t.id !== selectedTicket.id));
      setIsDeleteModalOpen(false);
      setSelectedTicket(null);
      setSuccess("Billet supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression du billet:", err);
      setError("Erreur lors de la suppression du billet.");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType ? ticket.type === filterType : true;
    return matchesSearch && matchesType;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "green";
      case "sold out":
        return "red";
      case "limited":
        return "yellow";
      default:
        return "blue";
    }
  };

  // Get price range for a ticket
  const getPriceRange = (categories) => {
    if (!categories || categories.length === 0) return "N/A";

    const prices = categories.map((cat) => Number(cat.pivot.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice
      ? `${minPrice} DH`
      : `${minPrice} - ${maxPrice} DH`;
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <Text fw={700} size="xl" className="text-red-900">
          Gestion des Billets
        </Text>
        <Link to="/admin/create-ticket">
          <UnstyledButton className="!bg-red-700 !text-white !px-4 !py-2 !rounded-md !flex !items-center !gap-2 hover:!bg-red-800 !transition-colors">
            <IconPlus size="1rem" />
            <span>Ajouter un billet</span>
          </UnstyledButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <IconX
            size="1rem"
            onClick={() => setError(null)}
            className="cursor-pointer"
          />
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <IconX
            size="1rem"
            onClick={() => setSuccess(null)}
            className="cursor-pointer"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <input
            type="text"
            placeholder="Rechercher un billet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="relative min-w-[200px]">
          <IconFilter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
          >
            <option value="">Tous les types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "match" ? "Match" : "Événement"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <UnstyledButton
          onClick={fetchTickets}
          className="!text-red-600 !flex !items-center !gap-1 hover:!text-red-800"
        >
          <IconRefresh size="1rem" />
          <span>Actualiser</span>
        </UnstyledButton>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Catégories
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || filterType
                    ? "Aucun billet correspondant aux critères de recherche"
                    : "Aucun billet disponible"}
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={ticket.type === "match" ? "blue" : "purple"}>
                      {ticket.type === "match" ? "Match" : "Événement"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.type === "match" && ticket.match ? (
                      <div>
                        <div>
                          <span className="font-semibold">Hôte:</span>{" "}
                          {ticket.match.my_club_name}
                        </div>
                        <div>
                          <span className="font-semibold">Adversaire:</span>{" "}
                          {ticket.match.opponent_club_name}
                        </div>
                        <div>
                          <span className="font-semibold">Date:</span>{" "}
                          {formatDate(ticket.match.match_date)}
                        </div>
                      </div>
                    ) : ticket.type === "event" ? (
                      <div>{ticket.description}</div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPriceRange(ticket.categories)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusBadgeColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {ticket.categories.slice(0, 2).map((category) => (
                        <Badge key={category.id} color="gray" variant="outline">
                          {category.category}
                        </Badge>
                      ))}
                      {ticket.categories.length > 2 && (
                        <Badge color="gray" variant="outline">
                          +{ticket.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Modifier">
                        <Link to={`/admin/edit-ticket/${ticket.id}`}>
                          <UnstyledButton className="!text-yellow-600 hover:!text-yellow-800">
                            <IconEdit size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Supprimer">
                        <UnstyledButton
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setIsDeleteModalOpen(true);
                          }}
                          className="!text-red-600 hover:!text-red-800"
                        >
                          <IconTrash size="1.2rem" />
                        </UnstyledButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && selectedTicket && (
        <DeleteConfirmation
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer le billet « ${selectedTicket.description} » ?`}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BillesList;
