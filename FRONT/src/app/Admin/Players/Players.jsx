import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, Loader2, PlusCircle, RefreshCw, AlertCircle, ChevronLeft } from "lucide-react"
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa"
import instance from "../../../helpers/axios"

const Players = () => {
  const [players, setPlayers] = useState([])
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [playersPerPage] = useState(10)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  const getPlayers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await instance.get("/players")
      setPlayers(response.data.data)
    } catch (error) {
      console.error("حدث خطأ أثناء جلب اللاعبين:", error)
      setError("Impossible de charger les joueurs.")
    } finally {
      setLoading(false)
    }
  }

  const handelDelete = async (id) => {
    setLoadingDelete(true)
    setError(null)
    try {
      const response = await instance.delete(`/player-delete/${id}`)
      console.log(response.data.message)
      setPlayers((prevPlayers) => prevPlayers.filter((item) => item.id !== id))
      setDeleteItemId(null)
      setSuccess(response.data.message)
    } catch (err) {
      console.error("Error deleting player:", err)
      setError("Impossible de supprimer player.")
    } finally {
      setLoadingDelete(false)
    }
  }

  const handleRefresh = () => {
    getPlayers()
  }

  useEffect(() => {
    getPlayers()
  }, [])

  // Filter players based on search term
  const filteredPlayers =
    players.length > 0 ? players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase())) : []

  // Get current players for pagination
  const indexOfLastPlayer = currentPage * playersPerPage
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Calculate total pages
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage)

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
              Joueurs
            </h1>
            <p className="text-gray-600 text-sm mt-1">Gérez toutes vos Joueurs</p>
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
            to="/admin/create-player"
            className="group flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 font-medium text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter
            <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Rechercher un joueur par nom..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
        </div>

        {/* News Table - Compact version */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPlayers.length > 0 ? (
                  currentPlayers.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50 transition-colors">
                      <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{item.id}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 max-w-[120px] truncate">
                        <img
                          src={`http://localhost:8000/storage/${item.photo}`}
                          alt={item.name}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 max-w-[120px] truncate">
                        {item.name}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 max-w-[120px] truncate">
                        {item.birth_date}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700">
                        <div className="flex items-center justify-center space-x-3">
                          <Link
                            to={`/admin/edit-player/${item.id}`}
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
                        <p className="text-sm font-medium">
                          {searchTerm ? "Aucun joueur trouvé avec ce nom" : "Aucun joueur disponible"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredPlayers.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{indexOfFirstPlayer + 1}</span> à{" "}
              <span className="font-medium">
                {indexOfLastPlayer > filteredPlayers.length ? filteredPlayers.length : indexOfLastPlayer}
              </span>{" "}
              sur <span className="font-medium">{filteredPlayers.length}</span> joueurs
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center p-1 rounded-md ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-red-100"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page numbers */}
              <div className="flex space-x-1">
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number + 1 ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-red-100"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center p-1 rounded-md ${
                  currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-red-100"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {players.length > 0 && (
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
                onClick={() => handelDelete(deleteItemId)}
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

export default Players
