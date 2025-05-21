import React, { useState, useEffect } from 'react';
import Header from '../Header';
import {
  FaHome,
  FaPlaneDeparture,
  FaTrophy,
  FaCrosshairs,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import instance from '../../../helpers/axios';
import { Loader2 } from 'lucide-react';
import Footer from '../Footer';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const MatchesUser = () => {
  const [matches, setMatches] = useState(null);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState(null);
   const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const frenchMonths = {
    1: 'Janvier',
    2: 'Février',
    3: 'Mars',
    4: 'Avril',
    5: 'Mai',
    6: 'Juin',
    7: 'Juillet',
    8: 'Août',
    9: 'Septembre',
    10: 'Octobre',
    11: 'Novembre',
    12: 'Décembre',
  };

  const fetchMatches = async (month = null) => {
    try {
      setLoading(true);
      const response = await instance.get('/user-matches', {
        params: month ? { month } : {},
      });
      setMatches(response.data.matches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonth = async () => {
    try {
      const response = await instance.get('/user-matches/months');
      setMonths(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMonth();
    fetchMatches();
  }, []);

  return (
    <>
      <Header />
      <div className="px-4 py-8 bg-gray-50 min-h-screen">
        {/* شريط الفلترة بالأشهر */}
        {!showModal ?    <div className="sticky top-0 z-30 w-full max-w-8xl shadow-md bg-white rounded-xl p-4 mb-8 ">
          <div>
            <h2 className="text-4xl font-bold text-center text-red-500 mb-6 flex items-center justify-center gap-2">
              <FaCalendarAlt className="text-red-600 text-4xl" />
              Calendrier des matchs
            </h2>
          </div>

          {/* زر "Tous" */}
          <div className="sticky top-4 z-30 w-full max-w-5xl mx-auto mb-8 px-4">
            <div className="bg-[#fdf6e3] rounded-2xl p-4 shadow-md flex flex-wrap justify-center gap-3 font-bold border border-[#fcebc1]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveMonth(null);
                  fetchMatches();
                }}
                className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
                  activeMonth === null
                    ? 'bg-red-600 text-white border-red-600'
                    : 'text-red-600 border-red-600 hover:bg-red-100'
                }`}
              >
                Tous
              </motion.button>

              {months?.map((month, idx) => {
                if (!month) return null; // تجاهل العناصر الفارغة أو null

                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={idx}
                    onClick={() => {
                      setActiveMonth(month);
                      fetchMatches(month);
                    }}
                    className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
                      activeMonth === month
                        ? 'bg-red-600 text-white border-red-600'
                        : 'text-red-600 border-red-600 hover:bg-red-100'
                    }`}
                  >
                    {frenchMonths[month] || ""}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>: ""
          }
     

        {/* تحميل */}
        {loading ? (
          <div className="flex items-center justify-center h-[45vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-600">
                Chargement des matchs...
              </p>
            </div>
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="pl-8 flex flex-wrap gap-8 justify-start">
            {matches.map((match, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl w-[350px] my-4 overflow-hidden border border-[#e5e7eb] flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* القسم الأحمر */}
                <div className="bg-red-600 text-white rounded-t-4xl px-4 pt-4 pb-6 shadow-md relative z-10 h-[170px]">
                  <div className="flex justify-between items-center text-sm mb-2 font-bold">
                    <span>{match.myclub?.name}</span>
                    <span className="text-4xl font-bold z-100">
                      {match?.my_club_goals ?? "--"} : {match?.opponent_club_goals ?? "--"}
                    </span>
                    <span>{match.opponent?.name}</span>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <img
                      src={`http://localhost:8000/storage/${match.myclub?.logo}`}
                      alt="Team1"
                      className="h-20 w-20 object-contain"
                    />
                    <div className="text-3xl font-bold text-white-700">𝒱𝒮</div>
                    <img
                      src={`http://localhost:8000/storage/${match.opponent?.logo}`}
                      alt="Team2"
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                </div>

                {/* القسم الأبيض */}
                <div className="bg-white rounded-2xl shadow-xl px-4 py-6 -mt-6 relative z-20 h-[240px] space-y-2 text-[18px]">
                  <div className="flex items-center text-gray-600 gap-2">
                    {match?.is_home === 1 ? (
                      <>
                        <FaHome className="text-red-600" />
                        <span>À domicile</span>
                      </>
                    ) : match?.is_home === 0 ? (
                      <>
                        <FaPlaneDeparture className="text-red-600" />
                        <span>À l'extérieur</span>
                      </>
                    ) : (
                      <>
                        <FaTrophy className="text-red-600" />
                        <span>Pas encore défini</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center font-semibold gap-2">
                    <FaCrosshairs className="text-red-600" />
                    <span>Journée {match?.journée ?? "Non spécifié"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-red-600" />
                    <span>{match?.match_date || "Date non définie"}</span>
                  </div>

                  <div className="flex items-center text-gray-500 gap-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    <span>{match?.match_location || "Lieu non défini"}</span>
                  </div>
                  {
                  match?.status === 'terminée' ? (
                    <div className="mt-6 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                        <svg width="16" height="16" fill="none" stroke="currentColor" className="text-green-600">
                          <path d="M4 8l3 3 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Terminée
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        className="text-[#4339f2] text-sm font-semibold hover:underline transition hover:text-[#181c3a] px-3 py-1 rounded-full bg-[#f0f4ff]"
                        onClick={() => navigate(`/matches/${match.id}`)}
                      >
                        Détails
                      </motion.button>
                    </div>
                  ) : (
                    <div className="mt-6 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                        match?.status === 'en cours'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" className={
                          match?.status === 'en cours' ? "text-yellow-500" : "text-gray-400"
                        }>
                          <circle cx="8" cy="8" r="7" strokeWidth="2"/>
                          <path d="M8 4v4l3 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {match?.status === 'en cours' ? 'En cours' : match?.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        className="text-[#4339f2] text-sm font-semibold hover:underline transition hover:text-[#181c3a] px-3 py-1 rounded-full bg-[#f0f4ff]"
                        onClick={() => setShowModal(true)}
                      >
                        Détails
                      </motion.button>
                    </div>
                  )
                }
                {/* نافذة منبثقة */}
                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center">
                      <h3 className="text-lg font-bold text-red-600 mb-4">Aucun détail pour ce match</h3>
                      <p className="text-gray-700 mb-6">Il n'y a pas de détails pour ce match car il n'a pas encore été joué.</p>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2 bg-[#4339f2] text-white rounded-full font-semibold hover:bg-[#181c3a] transition"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg font-medium py-12">
            Aucun match trouvé.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MatchesUser;
