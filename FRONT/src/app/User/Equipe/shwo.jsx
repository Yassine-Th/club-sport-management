import React,{ useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import instance from "../../../helpers/axios";
import { IconArrowLeft } from "@tabler/icons-react";
import Header from "../Header";
import Footer from "../Footer";
import { Loader2 } from "lucide-react";
import { FaUserTimes } from "react-icons/fa";
import { getUserRole } from "../../../helpers/access_token";

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUserRole();
  const isAdmin = user === "admin";

  useEffect(() => {
    instance
      .get(`/players-user/${id}`)
      .then((res) => setPlayer(res.data))
      .catch((err) => console.error("Error fetching player:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const getPositionColor = (position) => {
    switch (position) {
      case "Gardien":
        return "bg-green-600";
      case "Défenseur":
        return "bg-blue-600";
      case "Milieu":
        return "bg-yellow-600";
      case "Attaquant":
        return "bg-red-600";
      case "Staff":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => navigate("/equipe/joueurs")}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold mb-8 transition-colors"
            >
              <IconArrowLeft size={20} />
              <span>Retour à l'équipe</span>
            </button>
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
                <p className="text-lg font-medium text-gray-600">
                  Chargement du profil joueur...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!player) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => navigate("/equipe/joueurs")}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold mb-8 transition-colors"
            >
              <IconArrowLeft size={20} />
              <span>Retour à l'équipe</span>
            </button>
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <FaUserTimes className="h-16 w-16 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">
                  Joueur introuvable
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
            onClick={() => navigate("/equipe/joueurs")}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-colors"
          >
            <IconArrowLeft size={20} />
            <span>Retour à l'équipe</span>
          </button>
        </div>

        {/* Main Player Card */}
        <div className="container mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Player Image */}
              <div className="lg:w-1/2 p-8 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <img
                    src={`http://localhost:8000/storage/${player.photo}`}
                    alt={player.name}
                    className="w-80 h-80 object-cover rounded-2xl shadow-xl"
                  />
                  {/* Position Badge */}
                  <div
                    className={`absolute top-4 right-4 ${getPositionColor(
                      player.position
                    )} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {player.position}
                  </div>
                </motion.div>
              </div>

              {/* Player Information */}
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {/* Number and Name */}
                  <div className="flex items-end gap-4 mb-6">
                    {player.position !== "Staff" && (
                      <div className="text-5xl font-black text-red-600 leading-none">
                        {player.number}
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
                        {player.name}
                      </h1>
                    </div>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                        Nationalité
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {player.nationality}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                        Date de naissance
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {new Date(player.birth_date).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                        Taille
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {player.height} cm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                        Poids
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {player.weight} kg
                      </p>
                    </div>
                    {player.position !== "Staff" && (
                      <div>
                        <p className="text-sm flex text-gray-500 uppercase tracking-wide font-semibold">
                          Pied préféré
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                          {player.foot}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Statistics Section */}
        {player.position !== "Staff" && (
          <div className="container mx-auto px-4 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Statistiques de la saison
              </h2>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {/* Matches Played */}
                {/* <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-4xl font-black text-green-600 mb-2">
                    {player.match_stats.length || 0}
                  </div>
                  <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                    Matchs joués
                  </div>
                </div> */}

                {/* Goals */}
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                  <div className="text-4xl font-black text-red-600 mb-2">
                    {player.total_goals || 0}
                  </div>
                  <div className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                    Buts
                  </div>
                </div>

                {/* Assists */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-4xl font-black text-blue-600 mb-2">
                    {player.total_assists || 0}
                  </div>
                  <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Passes décisives
                  </div>
                </div>

                {/* Yellow Cards */}
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="text-4xl font-black text-yellow-600 mb-2">
                    {player.total_yellow_cards || 0}
                  </div>
                  <div className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                    Cartons jaunes
                  </div>
                </div>

                {/* Red Cards */}
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                  <div className="text-4xl font-black text-red-600 mb-2">
                    {player.total_red_cards || 0}
                  </div>
                  <div className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                    Cartons rouges
                  </div>
                </div>
              </div>

              
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PlayerDetails;
