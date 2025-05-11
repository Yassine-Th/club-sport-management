import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, Loader2, PlusCircle, RefreshCw, AlertCircle, ChevronLeft } from "lucide-react"
import { FaTrash, FaEdit, FaFilter, FaSearch } from "react-icons/fa"
import instance from "../../../helpers/axios"

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deleteItemId, setDeleteItemId] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await instance.get("/news")
      const data = response.data.data ?? response.data
      console.log(data)
      setNews(data)

      // Extract unique categories from news data
      if (data && data.length > 0) {
        const uniqueCategories = [...new Set(data.map((item) => item.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Impossible de charger les actualités.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchNews()
    setSearchTerm("")
    setSelectedCategory("all")
    setCurrentPage(1)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleDelete = async (id) => {
    setLoadingDelete(true)
    setError(null)
    try {
      const response = await instance.delete(`/news-delete/${id}`)
      const data = response.data.data ?? response.data
      setSuccess(data.message)
      setTimeout(() => {
        setSuccess("")
      }, 3000)
      setError(null)
      console.log(data)
      setNews((prevNews) => prevNews.filter((item) => item.id !== id))
      setDeleteItemId(null)
    } catch (err) {
      console.error("Error deleting news:", err)
      setError("Impossible de supprimer l'actualité.")
    } finally {
      setLoadingDelete(false)
    }
  }

  // Filter news based on search term and category
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get current news items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem)

  // Calculate total pages
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Chargement des actualités...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Erreur</h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-red-100 text-red-800 p-1 rounded-lg">📰</span>
              Actualités
            </h1>
            <p className="text-gray-600 text-sm mt-1">Gérez toutes vos actualités</p>
            {success && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative mb-3 mt-2 text-sm"
                role="alert"
              >
                <strong className="font-bold">Succès! </strong>
                <span className="block sm:inline">{success}</span>
              </div>
            )}
          </div>

          <Link
            to="/admin/create-new"
            className="group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 font-medium text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter
            <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>

        {/* Search and Filter - Compact version */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 appearance-none"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">Toutes catégories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* News Table - Compact version */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Journaliste</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cat.</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50 transition-colors">
                      <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{item.id}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700">
                        {item.author?.name ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.author.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 max-w-[120px] truncate">
                        {item.title}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700">
                        {item.category ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {item.category}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700">
                        <div className="flex items-center justify-center space-x-3">
                          <Link
                            to={`/admin/edit-new/${item.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Modifier"
                          >
                            <FaEdit size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteItemId(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Supprimer"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-2 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">Aucune actualité disponible</p>
                        <p className="text-xs mt-1">
                          {searchTerm || selectedCategory !== "all"
                            ? "Aucun résultat pour votre recherche"
                            : "Ajoutez votre première actualité"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Compact version */}
        {filteredNews.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-xs text-gray-700">
              <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-medium">
                {indexOfLastItem > filteredNews.length ? filteredNews.length : indexOfLastItem}
              </span>{" "}
              sur <span className="font-medium">{filteredNews.length}</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-2 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-red-50 border border-gray-300"
                }`}
              >
                <ChevronLeft className="h-3 w-3" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-2 py-1 rounded-md text-xs ${
                    currentPage === number
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-red-50 border border-gray-300"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center px-2 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-red-50 border border-gray-300"
                }`}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Refresh Button - Compact version */}
        {news.length > 0 && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium py-1 px-2 rounded-md hover:bg-red-50 transition-colors duration-200 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Actualiser
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal - Compact version */}
      {deleteItemId && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs w-full">
            <h2 className="text-base font-semibold mb-3 text-center">Confirmer la suppression</h2>
            <p className="mb-4 text-center text-sm">Voulez-vous vraiment supprimer cette actualité ?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleDelete(deleteItemId)}
                disabled={loadingDelete}
                className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition flex items-center gap-1"
              >
                {loadingDelete ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
              <button
                onClick={() => setDeleteItemId(null)}
                className="bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-400 transition"
                disabled={loadingDelete}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
