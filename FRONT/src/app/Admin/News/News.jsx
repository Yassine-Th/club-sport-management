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
} from "@tabler/icons-react";
import { Text, Badge, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get("/news");
      const data = response.data.data ?? response.data;
      setNews(data);

      // Extract unique categories from news data
      if (data && data.length > 0) {
        const uniqueCategories = [...new Set(data.map((item) => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Impossible de charger les actualités.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNews();
    setSearchTerm("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchNews();
  }, []);


  const handleDelete = async () => {
    setError(null);
    try {
      const response = await instance.delete(`/news-delete/${selectedProduit.id}`);
      const data = response.data.data ?? response.data;
      setSuccess(data.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setError(null);
      setNews(news.filter((p) => p.id !== selectedProduit.id));
    } catch (err) {
      console.error("Error deleting news:", err);
      setError("Impossible de supprimer l'actualité.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Filter news based on search term and category
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
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
          Gestion des Actualités
        </Text>
        <Link to="/admin/create-new">
          <UnstyledButton className="!bg-red-700 !text-white !px-4 !py-2 !rounded-md !flex !items-center !gap-2 hover:!bg-red-800 !transition-colors">
            <IconPlus size="1rem" />
            <span>Ajouter une actualité</span>
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

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <input
            type="text"
            placeholder="Rechercher une actualité..."
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
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
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Journaliste
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNews.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucune actualité trouvée
                </td>
              </tr>
            ) : (
              filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                   <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 max-w-[120px] truncate">
                        <img
                          src={`http://localhost:8000/storage/${item.image}`}
                          alt={item.title}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.author?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Modifier">
                        <Link to={`/admin/edit-new/${item.id}`}>
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
                message={`Êtes-vous sûr de vouloir supprimer l'actualité « ${selectedProduit.title} » ?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            )}
    </div>
  );
}