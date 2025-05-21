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
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { Text, Badge, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [positions, setPositions] = useState([
    "Gardien",
    "Défenseur",
    "Milieu",
    "Attaquant",
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Gestion des Joueurs | HUSA Club Admin";
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/players");
      setPlayers(response.data.data);
      setError(null);
      setSuccess(null);
    } catch (err) {
      console.error("Erreur lors du chargement des joueurs:", err);
      setError("Impossible de charger les joueurs. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await instance.delete(`/player-delete/${selectedPlayer.id}`);
      setPlayers(players.filter((p) => p.id !== selectedPlayer.id));
      setIsDeleteModalOpen(false);
      setSelectedPlayer(null);
      setSuccess("Joueur supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression du joueur:", err);
      setError("Erreur lors de la suppression du joueur.");
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition
      ? player.position === filterPosition
      : true;
    return matchesSearch && matchesPosition;
  });

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  if (loading && players.length === 0) {
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
          Gestion des Joueurs
        </Text>
        <Link to="/admin/create-player">
          <UnstyledButton className="!bg-red-700 !text-white !px-4 !py-2 !rounded-md !flex !items-center !gap-2 hover:!bg-red-800 !transition-colors">
            <IconPlus size="1rem" />
            <span>Ajouter un joueur</span>
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
            placeholder="Rechercher un joueur..."
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
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
          >
            <option value="">Toutes les positions</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Âge
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm || filterPosition
                    ? "Aucun joueur correspondant aux critères de recherche"
                    : "Aucun joueur disponible"}
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={`http://localhost:8000/storage/${player.photo}`}
                      alt={player.name}
                      className="h-12 w-12 object-cover rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg?height=48&width=48";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Badge color="blue">
                      {player.position || "Non défini"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateAge(player.birth_date)} ans
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Modifier">
                        <Link to={`/admin/edit-player/${player.id}`}>
                          <UnstyledButton className="!text-yellow-600 hover:!text-yellow-800">
                            <IconEdit size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Supprimer">
                        <UnstyledButton
                          onClick={() => {
                            setSelectedPlayer(player);
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

      {isDeleteModalOpen && selectedPlayer && (
        <DeleteConfirmation
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer le joueur « ${selectedPlayer.name} » ?`}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Players;
