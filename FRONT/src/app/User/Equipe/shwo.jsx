import React, { useEffect, useState } from "react";
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

  if (loading) {
    return(
      <>
      <Header />
      <div className="w-full max-w-5xl mx-auto mt-6 ml-8">
        <button
          onClick={() => navigate("/players")}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded transition"
        >
          <IconArrowLeft size={22} />
          <span>Retour</span>
        </button>
      </div>
      <div className="flex items-center justify-center h-[45vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-600">
                Chargement des Formation de Joueur...
              </p>
            </div>
          </div>
      </>
       
    )}

    if (!player) {
  return (
    <>
      <Header />
      <div className="px-6 mt-6">
        <button
          onClick={() => navigate("/players")}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded transition"
        >
          <IconArrowLeft size={22} />
          <span>Retour</span>
        </button>
      </div>

      <div className="flex items-center justify-center h-[45vh]">
        <div className="flex flex-col items-center gap-3">
          <FaUserTimes className="h-12 w-12 text-red-500" />
          <p className="text-lg font-semibold text-gray-600">
            Aucun joueur trouvé
          </p>
        </div>
      </div>
    </>
  );
}
  return (
    <>
      <Header />    

      <div className="min-h-[80vh] w-full flex items-center justify-center p-4 sm:p-10">
         
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[70] min-h-[75vh] flex flex-col sm:flex-row items-center justify-between bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] transition-shadow duration-500 p-6"
        >
           {isAdmin && (
          <button
            onClick={() => navigate(`/players`)}
            className="mt-25 flex items-center gap-2 absolute top-4 left-4 bg-[#181c3a] text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
             <IconArrowLeft size={22} />
             <span>Retour</span>
          </button>
        )}    
          <div className="flex flex-col items-center relative w-full sm:w-1/2">
            <motion.img
              src={`http://localhost:8000/storage/${player.photo}`}
              alt={player.name}
              className="w-72 h-72 object-cover rounded-3xl shadow-2xl border-4 border-white mx-auto"
              initial={{ opacity: 0, x: -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            />
          </div>

          {/* Right: Player Info & Stats */}
          <div className="flex-1 flex flex-col items-center sm:items-start mt-10 sm:mt-0 w-full">
            {/* Name, Number, Position */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center sm:items-end"
            >
              <span className="text-[70px] sm:text-[90px] font-extrabold text-[red] leading-none drop-shadow-[0_0_15px_rgba(108,99,255,0.2)]">
                <span className="align-top text-3xl text-[red] mr-1">▼</span>
                {player.position !== "Staff" ? player.number : ""}
              </span>
              <div className="sm:ml-4 text-center sm:text-left">
                <div className="text-4xl sm:text-5xl font-bold text-[#181c3a] drop-shadow-[0_0_10px_rgba(24,28,58,0.1)]">
                  {player.name}
                </div>
                <div className="text-xl text-[#181c3a]/70 mt-1 font-medium">
                  {player.position}
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
           {player.position !== "Staff" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-8 w-full max-w-2xl bg-[#181c3a] rounded-2xl shadow-xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <StatItem label="Buts" value={player.total_goals} />
              <StatItem label="Passes décisives" value={player.total_assists} />
              <StatItem label="Cartons jaunes" value={player.total_yellow_cards} />
              <StatItem label="Cartons rouges" value={player.total_red_cards} />
            </motion.div>
          )}

            {/* Deep Stats Link */}
            <motion.a
              href="#personal-data"
              className="mt-4 text-[#6c63ff] underline text-base font-medium hover:text-[#181c3a] transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Voir les informations personnelles
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Personal Data Card */}
      <div className="w-full py-10" id="personal-data">
        <div className="max-w-4xl min-h-[60vh] mx-auto bg-white rounded-2xl shadow-2xl px-8 py-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#181c3a] mb-6">Données personnelles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 ml-8">
            {/* Nom complet */}
            <div className="flex items-center gap-4">
                <span className="bg-white text-red-600 rounded-full p-3 shadow">
                <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M12 12c2.7 0 4.5-2.2 4.5-4.5S14.7 3 12 3 7.5 5.2 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-4.5c0-3-6-4.5-9-4.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <div>
                <div className="text-sm text-[#181c3a]/70 mt-1 font-medium">Nom complet</div>
                <div className="font-bold text-[#181c3a]">{player.name}</div>
                </div>
            </div>
            {/* Nationalité */}
            <div className="flex items-center gap-4">
                <span className="bg-white text-red-600 rounded-full p-3 shadow">
                <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <div>
                <div className="text-sm text-[#181c3a]/70 mt-1 font-medium">Nationalité</div>
                <div className="font-bold text-[#181c3a]">{player.nationality}</div>
                </div>
            </div>
            {/* القدم المفضلة */}
           <div className="flex items-center gap-4">
            <span className="bg-white text-red-600 rounded-full p-3 shadow">
              <svg width="24" height="24" fill="none" stroke="currentColor">
                <path d="M7 21V7a5 5 0 0 1 10 0v14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="7" y="17" width="10" height="4" rx="2" strokeWidth="1.5" />
              </svg>
            </span>
            <div>
              <div className="text-sm text-[#181c3a]/70 mt-1 font-medium">
                {player.position !== "Staff" ? "Pied préféré" : "Rôle"}
              </div>
              <div className="font-bold text-[#181c3a]">
                {player.position !== "Staff" ? player.foot : player.position}
              </div>
            </div>
          </div>
             {/* Date de naissance */}         
                <div className="flex items-center gap-4">
                    <span className="bg-white text-red-600 rounded-full p-3 shadow">
                    <svg width="24" height="24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="1.5"/><path d="M16 3v4M8 3v4M3 9h18" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                    <div>
                    <div className="text-sm text-[#181c3a]/70 mt-1 font-medium">Date de naissance</div>
                    <div className="font-bold text-[#181c3a]">{player.birth_date}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-white text-red-600 rounded-full p-3 shadow">
                    <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5"/><circle cx="12" cy="7" r="4" strokeWidth="1.5"/></svg>
                    </span>
                    <div>
                    <div className="text-sm text-[#181c3a]/70 mt-1 font-medium">Poids</div>
                    <div className="font-bold text-[#181c3a]">{player.weight} kg</div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-white text-red-600 rounded-full p-3 shadow">
                    <svg width="24" height="24" fill="none" stroke="currentColor"><rect x="9" y="3" width="6" height="18" rx="3" strokeWidth="1.5"/><path d="M12 3v18" strokeWidth="1.5"/></svg>
                    </span>
                    <div>
                    <div className="text-sm text-[#181c3a]/70 mt-1 font-medium">Taille</div>
                    <div className="font-bold text-[#181c3a]">{player.height} m</div>
                    </div>
                </div>
            </div>
            
            </div>
        </div>
      <Footer />
    </>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex flex-col items-center min-w-[100px]">
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="font-bold text-white/80 mt-1">{label}</div>
  </div>
);

export default PlayerDetails;