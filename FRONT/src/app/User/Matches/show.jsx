import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import instance from "../../../helpers/axios";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  FaFutbol,
  FaHandHoldingHeart,
  FaSquareFull,
  FaUserTimes,
  FaHome,
  FaPlaneDeparture,
} from "react-icons/fa";
import Header from "../Header";
import Footer from "../Footer";

const ShowMatchUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/matches/${id}`);
        setMatch(response.data.match);
        setError(null);
      } catch (err) {
        console.error("Error fetching match:", err);
        setError("Impossible de charger les détails du match.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatchData();
  }, [id]);

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
      return dateString;
    }
  };

  // ... (getMatchResult and getResultText remain the same)
  const getMatchResult = () => {
    if (match?.status !== "terminée") return null;
    const myGoals = match.my_club_goals || 0;
    const opponentGoals = match.opponent_club_goals || 0;
    if (myGoals > opponentGoals) return "victory";
    if (myGoals < opponentGoals) return "defeat";
    return "draw";
  };

  const getResultText = () => {
    const result = getMatchResult();
    switch (result) {
      case "victory":
        return "🏆 Victoire";
      case "defeat":
        return "😞 Défaite";
      case "draw":
        return "🤝 Match nul";
      default:
        return "⚽ Match à venir";
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => navigate("/matches")}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold mb-8 transition-colors"
            >
              <IconArrowLeft size={20} />
              <span>Retour aux Calendrier</span>
            </button>
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
                <p className="text-lg font-medium text-gray-600">
                  Chargement des détails du match...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !match) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => navigate("/matches")}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold mb-8 transition-colors"
            >
              <IconArrowLeft size={20} />
              <span>Retour aux Calendrier</span>
            </button>
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <FaUserTimes className="h-16 w-16 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">
                  {error || "Match introuvable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/matches")}
            className="flex cursor-pointer items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-colors"
          >
            <IconArrowLeft size={20} />
            <span>Retour aux matchs</span>
          </button>
        </div>

        {/* Match Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-gradient-to-r from-red-600 to-red-800  text-white py-4`}
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <span className="block text-lg font-semibold mb-2">
            {match.match_date
              ? new Date(match.match_date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : ""}
                </span>
                <div className="flex items-center justify-center gap-2 mb-2">
            {match.is_home ? (
              <FaHome className="text-yellow-300" />
            ) : (
              <FaPlaneDeparture className="text-yellow-300" />
            )}
            <span className="text-lg font-medium">
              {match.is_home ? "Match à domicile" : "Match à l'extérieur"}
            </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">
            Botola Pro - Journée {match.journée}
                </h1>
              </div>

              {/* Teams and Score */}
            <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12">
              {" "}
              {/* Adjusted gap for responsiveness */}
              {/* Home Team */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center flex-1"
              >
                <img
                  src={`http://localhost:8000/storage/${match.my_club?.logo}`}
                  alt={match.my_club?.name}
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain mx-auto mb-2 md:mb-4 bg-white rounded-full p-1 md:p-2" // Adjusted size & padding
                />
                <h2 className="text-base md:text-xl lg:text-2xl font-bold">
                  {" "}
                  {/* Adjusted font size */}
                  {match.my_club?.name === "Hassania Union Sport d'Agadir"
                    ? "HUSA"
                    : match.my_club?.name}
                </h2>
              </motion.div>
              {/* Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl lg:text-8xl font-black mb-1 md:mb-2">
                  {" "}
                  {/* Adjusted font size */}
                  {match.status === "terminée"
                    ? `${match.my_club_goals || 0} - ${
                        match.opponent_club_goals || 0
                      }`
                    : "VS"}
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-2">
                  {" "}
                  {/* Adjusted padding */}
                  <span className="text-xs md:text-sm font-medium">
                    {" "}
                    {/* Adjusted font size */}
                    {match.status === "terminée"
                      ? "Terminé"
                      : match.status === "en cours"
                      ? "En cours"
                      : "À venir"}
                  </span>
                </div>
              </motion.div>
              {/* Away Team */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center flex-1"
              >
                <img
                  src={`http://localhost:8000/storage/${match.opponent?.logo}`}
                  alt={match.opponent?.name}
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain mx-auto mb-2 md:mb-4 bg-white rounded-full p-1 md:p-2" // Adjusted size & padding
                />
                <h2 className="text-base md:text-xl lg:text-2xl font-bold">
                  {" "}
                  {/* Adjusted font size */}
                  {match.opponent?.name}
                </h2>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Match Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
              {" "}
              {/* Adjusted font size and margin */}
              Informations du match
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {" "}
              {/* Adjusted gap */}
              <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                {" "}
                {/* Adjusted gap and padding */}
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-red-500" />{" "}
                {/* Adjusted icon size */}
                <div>
                  <p className="text-xs md:text-sm text-gray-500">
                    Date et heure
                  </p>{" "}
                  {/* Adjusted font size */}
                  <p className="font-semibold text-sm md:text-base">
                    {" "}
                    {/* Adjusted font size */}
                    {formatDate(match.match_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Lieu</p>
                  <p className="font-semibold text-sm md:text-base">
                    {match.match_location || "Non spécifié"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Type</p>
                  <p className="font-semibold capitalize text-sm md:text-base">
                    {match.aller_retour || "Non spécifié"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Statut</p>
                  <p className="font-semibold capitalize text-sm md:text-base">
                    {match.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Player Statistics - MINIMIZED */}
        {match.status === "terminée" &&
        match.player_stats &&
        match.player_stats.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="container mx-auto px-4 pb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              {" "}
              {/* MODIFIED: Reduced padding */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
                {" "}
                {/* MODIFIED: Smaller title, less margin */}
                Statistiques des joueurs
              </h3>
              {/* Summary Stats - MINIMIZED */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
                {" "}
                {/* MODIFIED: Smaller gap, less margin */}
                <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg md:rounded-xl">
                  {" "}
                  {/* MODIFIED: Reduced padding, adjusted rounding for smaller size */}
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600 mx-auto mb-1" />{" "}
                  {/* MODIFIED: Smaller icon, less margin */}
                  <div className="text-lg md:text-xl font-bold text-green-600">
                    {" "}
                    {/* MODIFIED: Smaller font */}
                    {match.player_stats.reduce(
                      (sum, stat) => sum + (stat.goals_count || 0),
                      0
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-green-700">
                    Buts marqués
                  </div>{" "}
                  {/* MODIFIED: Smaller font */}
                </div>
                <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg md:rounded-xl">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg md:text-xl font-bold text-blue-600">
                    {match.player_stats.reduce(
                      (sum, stat) => sum + (stat.assists_count || 0),
                      0
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-blue-700">
                    Passes décisives
                  </div>
                </div>
                <div className="text-center p-2 md:p-3 bg-yellow-50 rounded-lg md:rounded-xl">
                  <FaSquareFull className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-lg md:text-xl font-bold text-yellow-600">
                    {match.player_stats.reduce(
                      (sum, stat) => sum + (stat.yellow_cards || 0),
                      0
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-yellow-700">
                    Cartons jaunes
                  </div>
                </div>
                <div className="text-center p-2 md:p-3 bg-red-50 rounded-lg md:rounded-xl">
                  <FaSquareFull className="w-5 h-5 md:w-6 md:h-6 text-red-600 mx-auto mb-1" />
                  <div className="text-lg md:text-xl font-bold text-red-600">
                    {match.player_stats.reduce(
                      (sum, stat) => sum + (stat.red_cards || 0),
                      0
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-red-700">
                    Cartons rouges
                  </div>
                </div>
              </div>
              {/* Player Details - MINIMIZED */}
              <div className="grid gap-3 md:gap-4">
                {" "}
                {/* MODIFIED: Smaller gap */}
                <AnimatePresence>
                  {match.player_stats
                    .filter(
                      (stat) =>
                        (stat.goals && stat.goals.length > 0) ||
                        stat.assists_count > 0 ||
                        stat.yellow_cards > 0 ||
                        stat.red_cards > 0
                    )
                    .map((stat, index) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 15 }} // MODIFIED: Smaller y animation
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }} // MODIFIED: Faster animation
                        className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 hover:shadow-md transition-shadow" // MODIFIED: Reduced padding
                      >
                        <div className="flex items-start gap-2 md:gap-3">
                          {" "}
                          {/* MODIFIED: Smaller gap */}
                          <img
                            src={`http://localhost:8000/storage/${stat.player?.photo}`}
                            alt={stat.player?.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200 shadow-sm" // MODIFIED: Smaller image, simpler border
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2 md:mb-3">
                              {" "}
                              {/* MODIFIED: Less margin */}
                              <div>
                                <h4
                                  className="text-sm md:text-base font-bold text-gray-900 hover:text-red-600 cursor-pointer transition-colors" // MODIFIED: Smaller font
                                  onClick={() =>
                                    navigate(`/players/${stat.player?.id}`)
                                  }
                                >
                                  {stat.player?.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {" "}
                                  {/* MODIFIED: Smaller font */}#
                                  {stat.player?.number} •{" "}
                                  {stat.player?.position}
                                </p>
                              </div>
                              <div className="flex gap-1 md:gap-2 text-xs">
                                {" "}
                                {/* MODIFIED: Smaller gap and font */}
                                {stat.yellow_cards > 0 && (
                                  <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                                    {" "}
                                    {/* MODIFIED: Reduced padding */}
                                    <FaSquareFull
                                      className="w-2 h-2 md:w-2.5 md:h-2.5" // MODIFIED: Smaller icon
                                      color="yellow"
                                    />
                                    {stat.yellow_cards}
                                  </span>
                                )}
                                {stat.red_cards > 0 && (
                                  <span className="flex items-center gap-1 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                                    <FaSquareFull
                                      className="w-2 h-2 md:w-2.5 md:h-2.5"
                                      color="red"
                                    />
                                    {stat.red_cards}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Goals */}
                            {stat.goals && stat.goals.length > 0 && (
                              <div className="space-y-1 md:space-y-1.5">
                                {" "}
                                {/* MODIFIED: Smaller space */}
                                {stat.goals.map((goal) => (
                                  <div
                                    key={goal.id}
                                    className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 bg-white rounded-md" // MODIFIED: Reduced padding and gap
                                  >
                                    <FaFutbol className="text-green-600 w-3.5 h-3.5 md:w-4 md:h-4" />{" "}
                                    {/* MODIFIED: Smaller icon */}
                                    <span className="font-semibold text-green-700 text-xs md:text-sm">
                                      {" "}
                                      {/* MODIFIED: Smaller font */}
                                      But à la {goal.minute}'
                                    </span>
                                    {goal.assister && (
                                      <div className="flex items-center gap-1 md:gap-1.5 ml-auto">
                                        {" "}
                                        {/* MODIFIED: Smaller gap */}
                                        <FaHandHoldingHeart className="text-blue-500 w-3 h-3 md:w-3.5 md:h-3.5" />{" "}
                                        {/* MODIFIED: Smaller icon */}
                                        <img
                                          src={`http://localhost:8000/storage/${goal.assister?.photo}`}
                                          alt={goal.assister?.name}
                                          className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover" // MODIFIED: Smaller image
                                        />
                                        <span
                                          className="text-xs md:text-sm text-blue-600 hover:text-blue-800 cursor-pointer" /* MODIFIED: Smaller font */
                                          onClick={() =>
                                            navigate(
                                              `/players/${goal.assister?.id}`
                                            )
                                          }
                                        >
                                          {goal.assister?.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Assists */}
                            {stat.assists_count > 0 && (
                              <div className="mt-1.5 md:mt-2 p-1.5 md:p-2 bg-blue-50 rounded-md">
                                {" "}
                                {/* MODIFIED: Reduced margin and padding */}
                                <span className="text-blue-700 font-semibold text-xs md:text-sm">
                                  {" "}
                                  {/* MODIFIED: Smaller font */}
                                  {stat.assists_count} passe
                                  {stat.assists_count > 1 ? "s" : ""} décisive
                                  {stat.assists_count > 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : match.status !== "terminée" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="container mx-auto px-4 pb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              {" "}
              {/* Adjusted padding */}
              <Clock className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />{" "}
              {/* Adjusted size & margin */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">
                {" "}
                {/* Adjusted font size & margin */}
                Match à venir
              </h3>
              <p className="text-gray-600 text-sm md:text-lg">
                {" "}
                {/* Adjusted font size */}
                Les statistiques seront disponibles une fois le match terminé.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="container mx-auto px-4 pb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">
                Aucune statistique
              </h3>
              <p className="text-gray-600 text-sm md:text-lg">
                Aucune statistique de joueur disponible pour ce match.
              </p>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ShowMatchUser;
