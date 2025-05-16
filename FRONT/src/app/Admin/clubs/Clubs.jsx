import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Text, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";


const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get("/clubs");
        setClubs(response.data.clubs);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Impossible de charger les clubs.");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleDelete = async () => {
    setError(null);
    try {
      await instance.delete(`/clubs-delete/${selectedClub.id}`);
      setSuccess("Club supprimé avec succès.");
      setTimeout(() => setSuccess(null), 3000);
      setClubs((prev) => prev.filter((item) => item.id !== selectedClub.id));
    } catch (error) {
      console.error(error.response.data.message);
      setError("Impossible de supprimer le club.");
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
          Gestion des Clubs
        </Text>
        <Link to="/admin/create-club">
          <UnstyledButton className="!bg-red-700 !text-white !px-4 !py-2 !rounded-md !flex !items-center !gap-2 hover:!bg-red-800 !transition-colors">
            <IconPlus size="1rem" />
            <span>Ajouter un club</span>
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

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Année de Fondation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Nom de l'entraîneur
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clubs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Aucun club trouvé
                </td>
              </tr>
            ) : (
              clubs.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <img
                      src={`http://localhost:8000/storage/${item.logo}`}
                      alt={item.name}
                      className="h-10 w-10 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.founded || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.coach_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Modifier">
                        <Link to={`/admin/edit-club/${item.id}`}>
                          <UnstyledButton className="!text-yellow-600 hover:!text-yellow-800">
                            <IconEdit size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Supprimer">
                        <UnstyledButton
                          onClick={() => {
                            setSelectedClub(item);
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
 {isDeleteModalOpen && selectedClub && (
              <DeleteConfirmation
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer l'actualité « ${selectedClub.name} » ?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            )}
    </div>
  );
};

export default Clubs;