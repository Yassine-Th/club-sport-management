import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import { IconPlus, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { Tooltip, UnstyledButton, Loader, Text } from "@mantine/core";
import instance from "../../../../helpers/axios";
import DeleteConfirmation from "../../../../helpers/DeleteConfirmation";

const Trophy = () => {
  const [trophy, setTrophy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const getTrophy = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get("/trophy");
        setTrophy(response.data.trophy);
      } catch (error) {
        console.error("Error fetching trophies:", error);
        setError("Impossible de charger les titres.");
      } finally {
        setLoading(false);
      }
    };
    getTrophy();
  }, []);

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/trophy-delete/${selectedProduit.id}`);
      setTrophy(trophy.filter((p) => p.id !== selectedProduit.id));
    } catch (error) {
      console.error("Error deleting trophy:", error);
      setError("Erreur lors de la suppression du titre.");
    } finally{
      setIsDeleteModalOpen(false)
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
          Gestion des Titres
        </Text>
        <Link to="/admin/create-titres">
          <UnstyledButton className="!bg-red-700 !text-white !px-4 !py-2 !rounded-md !flex !items-center !gap-2 hover:!bg-red-800 !transition-colors">
            <IconPlus size="1rem" />
            <span>Ajouter un titre</span>
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
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Compétition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Fois Gagnées
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trophy.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucun titre trouvé
                </td>
              </tr>
            ) : (
              trophy.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 max-w-[120px] truncate">
                        <img
                          src={`http://localhost:8000/storage/${item.photo}`}
                          alt={item.title}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.title || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.competition || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.times_won || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Modifier">
                        <Link to={`/admin/edit-titres/${item.id}`}>
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
                message={`Êtes-vous sûr de vouloir supprimer Titre « ${selectedProduit.title} » ?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            )}
    </div>
  );
};

export default Trophy;