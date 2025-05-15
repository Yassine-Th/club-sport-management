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
  IconAlertCircle,
  IconEye
} from "@tabler/icons-react";
import { Text, Badge, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get("/matches");
      const data = response.data.matches ?? response.data;
      setMatches(data);
      console.log(data)
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Impossible de charger les actualités.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);


  const handleDelete = async () => {
    setError(null);
    try {
      const response = await instance.delete(`/matches-delete/${selectedProduit.id}`);
      const data = response.data.data ?? response.data;
      setSuccess(data.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setError(null);
      setMatches(matches.filter((p) => p.id !== selectedProduit.id));
    } catch (err) {
      console.error("Error deleting news:", err);
      setError("Impossible de supprimer l'actualité.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <Text fw={700} size="xl" className="text-red-900">
          Gestion des Matches
        </Text>
        <Link to="/admin/create-match">
          <UnstyledButton className="!bg-red-700 !text-white !px-4 !py-2 !rounded-md !flex !items-center !gap-2 hover:!bg-red-800 !transition-colors">
            <IconPlus size="1rem" />
            <span>Ajouter une Matche</span>
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

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Mon club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                But
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                But
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Advercire
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matches.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucune actualité trouvée
                </td>
              </tr>
            ) : (
              matches.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.myclub?.name}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item?.my_club_goals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item?.opponent_club_goals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.opponent?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
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
                          <UnstyledButton className="!text-yellow-600 hover:!text-yellow-800">
                            <IconEdit size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Supprimer">
                        <UnstyledButton
                          onClick={() => {
                             setSelectedProduit(item);
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
      {isDeleteModalOpen && selectedProduit && (
              <DeleteConfirmation
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le matche « ${selectedProduit.journée} » ?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            )}
    </div>
  );
}