import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import instance from "../../../helpers/axios";
import {
  Calendar as CalendarIcon,
  Loader2,
  Users,
  MapPin,
  Clock,
  Ticket,
} from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Billies = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // Stores YYYY-MM, e.g., "2024-01"
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 6;

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
    const currentActualMonthIndex = today.getMonth();
    const currentActualYear = today.getFullYear();

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthValue = `${currentActualYear}-${String(
        monthIndex + 1
      ).padStart(2, "0")}`;
      const isDisabled = monthIndex < currentActualMonthIndex;
      buttonsData.push({
        label: frenchMonthsAbbr[monthIndex],
        value: monthValue,
        isDisabled: isDisabled,
      });
    }
    return buttonsData;
  };
  const monthButtonsData = generateCurrentYearMonthButtons();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await instance.get("availableTickets");
        setTickets(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(
          "Impossible de charger les billets. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
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

  const filteredTickets = tickets.filter((ticket) => {
    let matchesMonth = true;
    if (selectedMonth) {
      const ticketDateStr =
        ticket.type === "match" && ticket.match
          ? ticket.match.match_date
          : ticket.date;
      if (ticketDateStr) {
        try {
          const ticketDate = new Date(ticketDateStr);
          const ticketYearMonth = `${ticketDate.getFullYear()}-${String(
            ticketDate.getMonth() + 1
          ).padStart(2, "0")}`;
          matchesMonth = ticketYearMonth === selectedMonth;
        } catch (e) {
          matchesMonth = false;
        }
      } else {
        matchesMonth = false;
      }
    }

    const matchesType = selectedType ? ticket.type === selectedType : true;
    return matchesMonth && matchesType;
  });

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const getLowestPrice = (categories) => {
    if (!categories || categories.length === 0) return 0;
    return Math.min(
      ...categories.map((cat) => Number.parseFloat(cat.pivot.price))
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Filter Bar - All on one line */}
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
                      if (month.isDisabled) return;
                      setSelectedMonth(month.value);
                      setCurrentPage(1);
                    }}
                    disabled={month.isDisabled}
                    className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                      selectedMonth === month.value
                        ? "bg-blue-600 text-white shadow-md"
                        : month.isDisabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                        : "text-gray-700 hover:bg-gray-200"
                    } ${month.isDisabled ? "" : "hover:shadow-sm"}`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setSelectedType("");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedType === ""
                    ? "bg-yellow-500 text-red-900"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Types
              </button>
              <button
                onClick={() => {
                  setSelectedType("match");
                  setCurrentPage(1);
                }}
                className={`hidden sm:inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedType === "match"
                    ? "bg-yellow-500 text-red-900"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Matchs
              </button>
              <button
                onClick={() => {
                  setSelectedType("event");
                  setCurrentPage(1);
                }}
                className={`hidden sm:inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  selectedType === "event"
                    ? "bg-yellow-500 text-red-900"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Événements
              </button>
            </div>

            {/* Reset Button (conditional) */}
            {(selectedType || selectedMonth) && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    setSelectedType("");
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

      {/* Tickets Section */}
      <section className="container mx-auto px-4 py-5">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Réservez vos places maintenant
          </h2>
          <div className="h-1 w-32 bg-red-600 mt-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <p className="text-lg text-gray-700 font-medium">
              Chargement des billets disponibles...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 rounded-2xl p-8">
                <Ticket className="h-12 w-12 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    instance
                      .get("availableTickets")
                      .then((response) => {
                        setTickets(response.data);
                      })
                      .catch((err) => {
                        console.error("Error refetching tickets:", err);
                        setError(
                          "Impossible de charger les billets. Veuillez réessayer plus tard."
                        );
                      })
                      .finally(() => setLoading(false));
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 rounded-2xl p-8">
                <CalendarIcon className="h-12 w-12 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun billet trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Aucun billet ne correspond à vos filtres actuels.
                </p>
                <button
                  onClick={() => {
                    setSelectedMonth("");
                    setSelectedType("");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 flex flex-col h-full"
                >
                  {/* Modified image container with aspect ratio instead of fixed height */}
                  <div className="relative w-full pb-[60%] overflow-hidden">
                    <img
                      src={
                        ticket.image ||
                        (ticket.type === "match" && ticket.match
                          ? `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(
                              ticket.match.my_club_name || "Équipe A"
                            )} vs ${encodeURIComponent(
                              ticket.match.opponent_club_name || "Équipe B"
                            )}`
                          : ticket.type === "event"
                          ? `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(
                              ticket.description || "Événement"
                            )}`
                          : "/placeholder.svg?height=300&width=500&text=Billet")
                      }
                      alt={
                        ticket.type === "match" && ticket.match
                          ? `${ticket.match.my_club_name || ""} vs ${
                              ticket.match.opponent_club_name || ""
                            }`
                          : ticket.description || "Détail du billet"
                      }
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          ticket.type === "match" && ticket.match
                            ? `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(
                                ticket.match.my_club_name || "Équipe A"
                              )} vs ${encodeURIComponent(
                                ticket.match.opponent_club_name || "Équipe B"
                              )}`
                            : ticket.type === "event"
                            ? `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(
                                ticket.description || "Événement Special"
                              )}`
                            : "/placeholder.svg?height=300&width=500&text=Image Indisponible";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`inline-block px-3 py-1 ${
                          ticket.type === "match" ? "bg-red-600" : "bg-blue-600"
                        } text-white text-xs font-bold rounded-full shadow-lg`}
                      >
                        {ticket.type === "match" ? "Match" : "Événement"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    {ticket.type === "match" && ticket.match ? (
                      <>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(ticket.match.match_date)}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-red-700 transition-colors">
                          {ticket.match.my_club_name || "Mon Équipe"} vs{" "}
                          {ticket.match.opponent_club_name || "Adversaire"}
                        </h3>
                        {ticket.location && (
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-2 text-red-500" />
                            {ticket.location}
                          </div>
                        )}
                        {!ticket.location && ticket.match.match_location && (
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-2 text-red-500" />
                            {ticket.match.match_location}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Clock className="h-4 w-4 mr-2 text-red-500" />
                          Journée {ticket.match.journée || "N/A"}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(ticket.date)}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-700 transition-colors">
                          {ticket.description || "Événement Spécial"}
                        </h3>
                        {ticket.location && (
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-2 text-red-500" />
                            {ticket.location}
                          </div>
                        )}
                      </>
                    )}

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Catégories:
                        </span>
                        <span className="text-sm text-gray-600">
                          {ticket.categories?.length || 0} disponibles
                        </span>
                      </div>

                      {ticket.categories && ticket.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ticket.categories.map((category) => (
                            <span
                              key={category.id}
                              className="inline-block px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200"
                            >
                              {category.category}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {ticket.categories?.reduce(
                              (sum, cat) => sum + (cat.pivot?.stock || 0),
                              0
                            ) || 0}{" "}
                            places
                          </span>
                        </div>
                        <div className="text-red-600 font-bold">
                          À partir de {getLowestPrice(ticket.categories)} MAD
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link to={`/billies/${ticket.id}`} className="w-full">
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Acheter des billets
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

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
                    aria-label="Page précédente"
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
                    aria-label="Page suivante"
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

export default Billies;
