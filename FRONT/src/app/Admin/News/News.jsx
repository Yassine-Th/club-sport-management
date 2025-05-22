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
  // IconAlertCircle, // Not used, can be removed
} from "@tabler/icons-react";
import { Text, Tooltip, UnstyledButton, Loader } from "@mantine/core"; // Badge was not used
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Pagination state (currently unused in rendering, but kept for potential future use)
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
        const uniqueCategories = [
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Impossible de charger les actualités.");
    } finally {
      setLoading(false);
    }
  };

  // const handleRefresh = () => { // Not currently used, can be removed or implemented
  //   fetchNews();
  //   setSearchTerm("");
  //   setSelectedCategory("all");
  //   setCurrentPage(1);
  // };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!selectedProduit) return;
    setError(null);
    try {
      const response = await instance.delete(
        `/news-delete/${selectedProduit.id}`
      );
      const data = response.data.data ?? response.data;
      setSuccess(data.message || "Actualité supprimée avec succès.");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setNews(news.filter((p) => p.id !== selectedProduit.id));
      // Also update filteredNews if necessary, or re-filter
      // For simplicity, fetchNews() could be called, but filtering existing state is more efficient
    } catch (err) {
      console.error("Error deleting news:", err);
      setError(
        err.response?.data?.message || "Impossible de supprimer l'actualité."
      );
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProduit(null);
    }
  };

  // Filter news based on search term and category
  const filteredNews = news.filter((item) => {
    const titleMatch = item.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const authorMatch = item.author?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || authorMatch;

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {" "}
        {/* Changed to h-screen for better full page loading */}
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
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
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center"
          role="alert"
        >
          <span>{error}</span>
          <IconX
            size="1rem"
            onClick={() => setError(null)}
            className="cursor-pointer"
            aria-label="Close error message"
          />
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center"
          role="alert"
        >
          <span>{success}</span>
          <IconX
            size="1rem"
            onClick={() => setSuccess(null)}
            className="cursor-pointer"
            aria-label="Close success message"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Rechercher (titre, journaliste)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-label="Search news"
          />
        </div>
        <div className="relative min-w-[200px]">
          <IconFilter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
            aria-hidden="true"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            aria-label="Filter by category"
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
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          {" "}
          {/* Added table-fixed */}
          <colgroup>
            {" "}
            {/* Define column widths for better control */}
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "35%" }} /> {/* Give more space to title */}
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead className="bg-red-900 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Journaliste
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Titre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Catégorie
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
              >
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
                  <td className="px-4 py-2 whitespace-nowrap">
                    {" "}
                    {/* Adjusted padding */}
                    {item.image ? (
                      <img
                        src={`http://localhost:8000/storage/${item.image}`}
                        alt={`Image for ${item.title}`}
                        className="h-10 w-10 object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }} // Hide if image fails to load
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Tooltip
                      label={item.author?.name || "N/A"}
                      openDelay={500}
                      withArrow
                    >
                      <div className="truncate max-w-[150px]">
                        {item.author?.name || "N/A"}
                      </div>
                    </Tooltip>
                  </td>
                  {/* MODIFIED TITLE CELL HERE */}
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    <Tooltip
                      label={item.title}
                      openDelay={500}
                      withArrow
                      multiline
                      w={220}
                    >
                      <div className="truncate max-w-sm">
                        {" "}
                        {/* Adjust max-w-sm as needed, or use pixels like max-w-[300px] */}
                        {item.title}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Tooltip
                      label={item.category || "N/A"}
                      openDelay={500}
                      withArrow
                    >
                      <div className="truncate max-w-[150px]">
                        {item.category || "N/A"}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip label="Modifier" withArrow>
                        <Link to={`/admin/edit-new/${item.id}`}>
                          <UnstyledButton className="!text-yellow-600 hover:!text-yellow-800 p-1">
                            {" "}
                            {/* Added padding for better click area */}
                            <IconEdit size="1.1rem" />{" "}
                            {/* Slightly smaller icon */}
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Supprimer" withArrow>
                        <UnstyledButton
                          onClick={() => {
                            setSelectedProduit(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="!text-red-600 hover:!text-red-800 p-1" /* Added padding */
                        >
                          <IconTrash size="1.1rem" />{" "}
                          {/* Slightly smaller icon */}
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
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduit(null);
          }}
        />
      )}
    </div>
  );
}
