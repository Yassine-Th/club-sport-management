import React from "react";
import Header from "../Header";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../../../helpers/axios";
import { IconArrowLeft } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { FaFutbol, FaHandHoldingHeart, FaSquareFull, FaUserTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Footer";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5 }
  }),
  exit: { opacity: 0, y: 40, transition: { duration: 0.3 } }
};

const ShowMatchUser = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [matche, setMatche] = useState({});
  const [statistique, setStatistique] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMatche = async () => {
      try {
        const response = await instance.get(`/matches/${id}`);
        setMatche(response.data.match);

        const statsResponse = await instance.get(`/matches/${id}/statistique`);
        setStatistique(statsResponse.data.stats);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getMatche();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-5xl mx-auto mt-6 ml-8"
        >
          <button
            onClick={() => navigate("/players")}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded transition"
          >
            <IconArrowLeft size={22} />
            <span>Retour</span>
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-[45vh]"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
            <p className="text-lg font-semibold text-gray-600">
              Chargement des Formation de Matches...
            </p>
          </div>
        </motion.div>
      </>
    );
  }

  if (!matche) {
    return (
      <>
        <Header />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="px-6 mt-6"
        >
          <button
            onClick={() => navigate("/players")}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded transition"
          >
            <IconArrowLeft size={22} />
            <span>Retour</span>
          </button>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center justify-center h-[45vh]"
        >
          <div className="flex flex-col items-center gap-3">
            <FaUserTimes className="h-12 w-12 text-red-500" />
            <p className="text-lg font-semibold text-gray-600">
              Aucun matche trouvé
            </p>
          </div>
        </motion.div>
      </>
    );
  }

  if (!statistique) {
    return (
      <>
        <Header />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="px-6 mt-6"
        >
          <button
            onClick={() => navigate("/players")}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded transition"
          >
            <IconArrowLeft size={22} />
            <span>Retour</span>
          </button>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center justify-center h-[45vh]"
        >
          <div className="flex flex-col items-center gap-3">
            <FaUserTimes className="h-12 w-12 text-red-500" />
            <p className="text-lg font-semibold text-gray-600">
              Aucun statistique trouvé
            </p>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Header />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="sticky top-0 z-30 w-full bg-[#03244a] py-6 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-white text-lg font-bold mb-2 pl-4"
          >
            Première division nationale marocaine
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-8"
          >
            {/* الفريق المضيف */}
            <div className="flex items-center gap-2">
              <span className="text-2xl text-white font-bold">{matche.myclub?.name}</span>
              <img
                src={`http://localhost:8000/storage/${matche.myclub.logo}`}
                alt="Logo My Club"
                className="h-12 w-12 object-contain"
              />
            </div>
            {/* النتيجة */}
            <div className="flex items-center gap-2">
              <span className="text-6xl text-white font-bold">{matche.my_club_goals}</span>
              <span className="px-3 py-1 rounded bg-[#e5e7eb] text-[#03244a] text-xs font-bold">
                {matche.status}
              </span>
              <span className="text-6xl text-white font-bold">{matche.opponent_club_goals}</span>
            </div>
            {/* الفريق الضيف */}
            <div className="flex items-center gap-2">
              <img
                src={`http://localhost:8000/storage/${matche.opponent.logo}`}
                alt="Logo Opponent"
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl text-white font-bold">{matche.opponent?.name}</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white text-sm font-medium mt-4 pl-4"
          >
            compitition
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-12"
      >
        <h1 className="mt-12 text-4xl font-extrabold text-[#001e3c] mb-6 text-center">
          Statistiques du match
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {statistique && statistique.length > 0 ? (
              statistique.map((stat, index) => {
                const hasStats =
                  (stat.goals && stat.goals.length > 0) ||
                  stat.yellow_cards > 0 ||
                  stat.red_cards > 0;

                return hasStats ? (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeIn}
                    custom={index}
                    className="flex items-start gap-4 p-4 bg-white shadow-md rounded-lg"
                  >
                    {/* Player image */}
                    <img
                      src={`http://localhost:8000/storage/${stat.player?.photo}`}
                      alt={stat.player?.name}
                      className="w-16 h-16 rounded-full object-cover border"
                    />

                    <div className="flex-1">
                      {/* Player name */}
                      <motion.h3
                        whileHover={{ scale: 1.08, color: "#4339f2", cursor: "pointer" }}
                        className="text-lg font-semibold text-gray-800 hover:text-[#4339f2] transition"
                        onClick={() => navigate(`/players/${stat.player?.id}`)}
                      >
                        {stat.player?.name}
                      </motion.h3>

                      {/* Goals and assists */}
                      {stat.goals?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {stat.goals.map((goal, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              {/* Goal icon */}
                              <FaFutbol className="text-green-600" />
                              {/* Goal info */}
                              <span>
                                {goal.minute}'
                                {goal.assister && (
                                  <span className="flex items-center gap-1 ml-5">
                                    <FaHandHoldingHeart className="text-blue-500" />
                                    <img
                                      src={`http://localhost:8000/storage/${goal.assister?.photo}`}
                                      alt={goal.assister?.name}
                                      className="w-6 h-6 rounded-full object-cover border"
                                    />
                                    <motion.span
                                      whileHover={{ scale: 1.08, color: "#4339f2", cursor: "pointer" }}
                                      className="text-xs text-gray-600 hover:text-[#4339f2]"
                                      onClick={() => navigate(`/players/${goal.assister?.id}`)}
                                    >
                                      {goal.assister?.name || "N/A"}
                                    </motion.span>
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Cards */}
                      <div className="mt-2 flex gap-4 text-sm font-medium">
                        {stat.yellow_cards > 0 && (
                          <span className="flex items-center text-yellow-600">
                            <FaSquareFull className="mr-1" color="yellow" /> {stat.yellow_cards} Jaune
                          </span>
                        )}
                        {stat.red_cards > 0 && (
                          <span className="flex items-center text-red-600">
                            <FaSquareFull className="mr-1" /> {stat.red_cards} Rouge
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : null;
              })
            ) : (
              <motion.p
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                className="text-lg font-semibold text-center text-gray-500"
              >
                Aucune statistique trouvée
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default ShowMatchUser;