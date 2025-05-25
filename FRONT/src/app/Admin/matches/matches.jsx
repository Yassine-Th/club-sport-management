import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
  IconFilter,
  IconX,
  IconEye,
  IconCalendarEvent,
  IconClock,
  IconHistory,
  IconList,
} from "@tabler/icons-react";
import { FaChartBar } from "react-icons/fa";
import {
  Text,
  Badge,
  Tooltip,
  UnstyledButton,
  Loader,
  ActionIcon,
  Group,
  Avatar,
} from "@mantine/core";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [statusOptions] = useState(["terminée", "venir", "reportée"]);

  // New state for match view filter
  const [viewFilter, setViewFilter] = useState("all"); // "all", "past", "upcoming"

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get("/matches");
      const data = response.data.matches || [];
      setMatches(data);
      console.log("Fetched matches:", data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Impossible de charger les matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDelete = async () => {
    if (!selectedMatch) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await instance.delete(
        `/matches-delete/${selectedMatch.id}`
      );
      setSuccess(response.data.message || "Match supprimé avec succès !");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setMatches((currentMatches) =>
        currentMatches.filter((m) => m.id !== selectedMatch.id)
      );
    } catch (err) {
      console.error("Error deleting match:", err);
      setError(
        err.response?.data?.message || "Impossible de supprimer le match."
      );
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedMatch(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "terminée":
        return "green";
      case "venir":
        return "blue";
      case "reportée":
        return "orange";
      default:
        return "gray";
    }
  };

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.opponent?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.my_club?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? match.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Separate past and upcoming matches
  const now = new Date();
  const pastMatches = filteredMatches.filter(
    (match) => match.match_date && new Date(match.match_date) < now
  );
  const upcomingMatches = filteredMatches.filter(
    (match) => !match.match_date || new Date(match.match_date) >= now
  );

  // Get matches to display based on view filter
  const getMatchesToDisplay = () => {
    switch (viewFilter) {
      case "past":
        return pastMatches;
      case "upcoming":
        return upcomingMatches;
      default:
        return filteredMatches;
    }
  };

  const getTableTitle = () => {
    switch (viewFilter) {
      case "past":
        return `Matches Passés (${pastMatches.length})`;
      case "upcoming":
        return `Matches À Venir (${upcomingMatches.length})`;
      default:
        return `Tous les Matches (${filteredMatches.length})`;
    }
  };

  const renderMatchesTable = (matchesList, title) => (
    <div className="mb-8">
      <Text fw={600} size="lg" className="text-gray-800 mb-4">
        {title}
      </Text>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-red-900 to-red-800 text-white">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                Match
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Date et Heure
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {matchesList.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <IconCalendarEvent size="3rem" className="text-gray-300" />
                    <Text size="lg" c="dimmed" fw={500}>
                      {searchTerm || filterStatus
                        ? "Aucun match correspondant aux critères de recherche"
                        : "Aucun match trouvé"}
                    </Text>
                  </div>
                </td>
              </tr>
            ) : (
              matchesList.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-25 transition-all duration-200"
                >
                  {/* Column 1: Club Logos */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-4">
                      {/* Home Club Logo */}
                      <Tooltip
                        label={item.my_club?.name || "Mon Club"}
                        position="top"
                        withArrow
                      >
                        <div className="flex flex-col items-center">
                          {item.my_club?.logo ? (
                            <img
                              src={`http://localhost:8000/storage/${item.my_club.logo}`}
                              alt={item.my_club.name}
                              className="w-12 h-12 rounded-full ring-2 ring-gray-200 shadow-md hover:ring-red-300 transition-all duration-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Text size="xs" c="dimmed" fw={600}>
                                {item.my_club?.name?.charAt(0) || "M"}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Tooltip>

                      {/* VS Divider */}
                      <div className="flex flex-col items-center">
                        <Text size="sm" fw={700} className="text-red-600">
                          vs
                        </Text>
                      </div>

                      {/* Opponent Club Logo */}
                      <Tooltip
                        label={item.opponent?.name || "Adversaire"}
                        position="top"
                        withArrow
                      >
                        <div className="flex flex-col items-center">
                          {item.opponent?.logo ? (
                            <img
                              src={`http://localhost:8000/storage/${item.opponent.logo}`}
                              alt={item.opponent.name}
                              className="w-12 h-12 rounded-full ring-2 ring-gray-200 shadow-md hover:ring-red-300 transition-all duration-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Text size="xs" c="dimmed" fw={600}>
                                {item.opponent?.name?.charAt(0) || "A"}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Tooltip>
                    </div>
                  </td>

                  {/* Column 2: Score */}
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    {item.status === "terminée" ||
                    item.my_club_goals !== null ||
                    item.opponent_club_goals !== null ? (
                      <div className="bg-gray-50 rounded-lg px-4 py-2 inline-block">
                        <Text fw={700} size="lg" className="text-gray-800">
                          {item.my_club_goals ?? "-"}{" "}
                          <span className="text-red-500 mx-2">-</span>{" "}
                          {item.opponent_club_goals ?? "-"}
                        </Text>
                      </div>
                    ) : (
                      <Badge color="blue" variant="light" size="lg">
                        À venir
                      </Badge>
                    )}
                  </td>

                  {/* Column 3: Date and Time */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    {item.match_date ? (
                      <Group spacing="xs" noWrap>
                        <Tooltip
                          label={format(new Date(item.match_date), "PPPPpppp", {
                            locale: fr,
                          })}
                        >
                          <div className="text-sm font-medium text-gray-700">
                            {format(
                              new Date(item.match_date),
                              "dd MMM yyyy, HH:mm",
                              { locale: fr }
                            )}
                          </div>
                        </Tooltip>
                      </Group>
                    ) : (
                      <Text c="dimmed" size="sm">
                        N/A
                      </Text>
                    )}
                  </td>

                  {/* Column 4: Actions */}
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Voir détails">
                        <Link to={`/admin/match/${item.id}`}>
                          <UnstyledButton className="!text-blue-600 hover:!text-blue-800">
                            <IconEye size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Modifier">
                        <Link to={`/admin/edit-match/${item.id}`}>
                          <UnstyledButton className="!text-orange-500 hover:!text-orange-700">
                            <IconEdit size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Supprimer">
                        <UnstyledButton
                          onClick={() => {
                            setSelectedMatch(item);
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
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Text fw={700} size="xl" className="text-red-900 ">
            Gestion des Matches
          </Text>
          <Text size="sm" c="dimmed">
            Gérez vos matches passés et à venir
          </Text>
        </div>
        <Link to="/admin/create-match">
          <UnstyledButton className="!bg-gradient-to-r !from-red-700 !to-red-800 !text-white !px-6 !py-2 !rounded-lg !flex !items-center !gap-2 hover:!from-red-800 hover:!to-red-900 !transition-all !duration-200 !shadow-lg hover:!shadow-xl !transform hover:!scale-105">
            <IconPlus size="1.1rem" />
            <span className="font-medium">Ajouter un Match</span>
          </UnstyledButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm">
          <span>{error}</span>
          <IconX
            size="1rem"
            onClick={() => setError(null)}
            className="cursor-pointer hover:text-red-900"
          />
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm">
          <span>{success}</span>
          <IconX
            size="1rem"
            onClick={() => setSuccess(null)}
            className="cursor-pointer hover:text-green-900"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[250px]">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <input
            type="text"
            placeholder="Rechercher par nom d'équipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="relative min-w-[200px]">
          <IconFilter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none shadow-sm"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Filter Buttons */}
      <div className="flex space-x-3 mb-6">
        <UnstyledButton
          onClick={() => setViewFilter("all")}
          className={`!px-6 !py-2 !rounded-lg !flex !items-center !gap-2 !transition-all !duration-200 !font-medium ${
            viewFilter === "all"
              ? "!bg-red-700 !text-white !shadow-lg"
              : "!bg-white !text-gray-700 !border !border-gray-200 hover:!bg-gray-50 !shadow-sm"
          }`}
        >
          <IconList size="1.1rem" />
          <span>Tous les Matches</span>
          <Badge
            size="sm"
            variant={viewFilter === "all" ? "white" : "light"}
            color={viewFilter === "all" ? "red" : "gray"}
          >
            {filteredMatches.length}
          </Badge>
        </UnstyledButton>

        <UnstyledButton
          onClick={() => setViewFilter("upcoming")}
          className={`!px-6 !py-2 !rounded-lg !flex !items-center !gap-2 !transition-all !duration-200 !font-medium ${
            viewFilter === "upcoming"
              ? "!bg-blue-600 !text-white !shadow-lg"
              : "!bg-white !text-gray-700 !border !border-gray-200 hover:!bg-gray-50 !shadow-sm"
          }`}
        >
          <IconClock size="1.1rem" />
          <span>À Venir</span>
          <Badge
            size="sm"
            variant={viewFilter === "upcoming" ? "white" : "light"}
            color={viewFilter === "upcoming" ? "blue" : "gray"}
          >
            {upcomingMatches.length}
          </Badge>
        </UnstyledButton>

        <UnstyledButton
          onClick={() => setViewFilter("past")}
          className={`!px-6 !py-2 !rounded-lg !flex !items-center !gap-2 !transition-all !duration-200 !font-medium ${
            viewFilter === "past"
              ? "!bg-green-600 !text-white !shadow-lg"
              : "!bg-white !text-gray-700 !border !border-gray-200 hover:!bg-gray-50 !shadow-sm"
          }`}
        >
          <IconHistory size="1.1rem" />
          <span>Passés</span>
          <Badge
            size="sm"
            variant={viewFilter === "past" ? "white" : "light"}
            color={viewFilter === "past" ? "green" : "gray"}
          >
            {pastMatches.length}
          </Badge>
        </UnstyledButton>
      </div>

      {/* Single Table Display */}
      {renderMatchesTable(getMatchesToDisplay(), getTableTitle())}

      {isDeleteModalOpen && selectedMatch && (
        <DeleteConfirmation
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer le match de la journée ${selectedMatch.journée} (${selectedMatch.my_club?.name} vs ${selectedMatch.opponent?.name}) ?`}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
        />
      )}
    </div>
  );
}
