import React, { useState, useEffect } from "react";
import Header from "../Header";
import {
  FaHome,
  FaPlaneDeparture,
  FaTrophy,
  FaCrosshairs,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import instance from "../../../helpers/axios";
import { Loader2, MapPin, Calendar } from "lucide-react";
import Footer from "../Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MatchesUser = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Set current month as default
  const getCurrentMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // Stores YYYY-MM, e.g., "2025-05"
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 6;
  const navigate = useNavigate();

  const frenchMonthsAbbr = [
    "Janv",
    "Févr",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sept",
    "Oct",
    "Nov",
    "Déc",
  ];

  const generateCurrentYearMonthButtons = () => {
    const buttonsData = [];
    const today = new Date();
    const currentActualYear = today.getFullYear();

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthValue = `${currentActualYear}-${String(
        monthIndex + 1
      ).padStart(2, "0")}`;
      buttonsData.push({
        label: frenchMonthsAbbr[monthIndex],
        value: monthValue,
        isDisabled: false, // Remove the disability check
      });
    }
    return buttonsData;
  };

  const monthButtonsData = generateCurrentYearMonthButtons();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await instance.get("/user-matches");
        setMatches(response.data.matches || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError(
          "Impossible de charger les matchs. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Date non spécifiée";
    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString;
    }
  };

  const getMatchResult = (match) => {
    if (match.status !== "terminée") return null;

    const myGoals = match.my_club_goals || 0;
    const opponentGoals = match.opponent_club_goals || 0;

    if (myGoals > opponentGoals) return "victory";
    if (myGoals < opponentGoals) return "defeat";
    return "draw";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "terminée":
        return "bg-green-100 text-green-700";
      case "en cours":
        return "bg-yellow-100 text-yellow-700";
      case "venir":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredMatches = matches.filter((match) => {
    if (!selectedMonth) return true;

    if (match.match_date) {
      try {
        const matchDate = new Date(match.match_date);
        const matchYearMonth = `${matchDate.getFullYear()}-${String(
          matchDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return matchYearMonth === selectedMonth;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Filter Bar */}
      <section className="bg-red-600 py-3 sm:py-4 shadow-md top-0 z-10 border-b">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Month Scroller */}
            <div className="flex-1 min-w-0 bg-gray-50 rounded-full p-1 sm:p-1.5 overflow-hidden">
              <div className="flex items-center sm:space-x-1 overflow-x-auto no-scrollbar py-0.5">
                <button
                  onClick={() => {
                    setSelectedMonth("");
                    setCurrentPage(1);
                  }}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                    selectedMonth === ""
                      ? "bg-red-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tous
                </button>
                {monthButtonsData.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => {
                      setSelectedMonth(month.value);
                      setCurrentPage(1);
                    }}
                    className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap hover:shadow-sm ${
                      selectedMonth === month.value
                        ? "bg-yellow-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {selectedMonth && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    setSelectedMonth("");
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-800 text-white font-medium rounded-lg hover:bg-red-900 transition-colors text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Réinitialiser</span> ×
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Calendrier des matchs
          </h2>
          <div className="h-1 w-32 bg-red-600 mt-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <p className="text-lg text-gray-700 font-medium">
              Chargement des matchs...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 rounded-2xl p-8">
                <FaTrophy className="h-12 w-12 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 rounded-2xl p-8">
                <Calendar className="h-12 w-12 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun match trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Aucun match ne correspond à vos filtres actuels.
                </p>
                <button
                  onClick={() => {
                    setSelectedMonth("");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Voir tous les matchs
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100"
                >
                  {/* Header with teams */}
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {match.is_home ? (
                          <FaHome className="text-yellow-300" />
                        ) : (
                          <FaPlaneDeparture className="text-yellow-300" />
                        )}
                        <span className="text-sm font-medium">
                          {match.is_home ? "À domicile" : "À l'extérieur"}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          match.status
                        )}`}
                      >
                        {match.status === "terminée"
                          ? "Terminé"
                          : match.status === "en cours"
                          ? "En cours"
                          : match.status === "venir"
                          ? "À venir"
                          : match.status}
                      </span>
                    </div>

                    {/* Teams and Score */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:8000/storage/${match.myclub?.logo}`}
                          alt={match.myclub?.name}
                          className="w-12 h-12 object-contain bg-white rounded-full p-1"
                        />
                        <div className="text-left">
                          <div className="font-bold text-sm">
                            {match.myclub?.name ===
                            "Hassania Union Sport d'Agadir"
                              ? "HUSA"
                              : match.myclub?.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-black">
                          {match.status === "terminée"
                            ? `${match.my_club_goals || 0} - ${
                                match.opponent_club_goals || 0
                              }`
                            : "VS"}
                        </div>

                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-sm">
                            {match.opponent?.name?.split(" ")[0] || " "}
                          </div>
                        </div>
                        <img
                          src={`http://localhost:8000/storage/${match.opponent?.logo}`}
                          alt={match.opponent?.name}
                          className="w-12 h-12 object-contain bg-white rounded-full p-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <span className="text-sm">
                        {formatDate(match.match_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span className="text-sm">
                        {match.match_location || "Lieu non défini"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCrosshairs className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-semibold">
                        Journée {match.journée || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <FaTrophy className="w-5 h-5 text-red-500" />
                      <span className="text-sm capitalize">
                        {match.aller_retour || "Non spécifié"}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1">
                      {match.status  ? (
                        <button
                          onClick={() => navigate(`/matches/${match.id}`)}
                          className=" text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer font-medium"
                        >
                          ... Voir les détails
                        </button>
                      ) : (
                       <></>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-full">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-sm"
                    }`}
                  >
                    <FaChevronLeft className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      if (pageNum > totalPages || pageNum < 1) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                            currentPage === pageNum
                              ? "bg-red-600 text-white font-bold"
                              : "bg-white text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-sm"
                    }`}
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-gray-500 text-sm mt-3">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default MatchesUser;
