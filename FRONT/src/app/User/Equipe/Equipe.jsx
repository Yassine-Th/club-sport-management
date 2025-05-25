import React, { useEffect, useState } from 'react';
import instance from '../../../helpers/axios';
import Header from '../Header';
import logo from "../../../assets/logo.png";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import Footer from '../Footer';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';


const PlayersByPost = () => {
  const [players, setPlayers] = useState([]);
  const [activePost, setActivePost] = useState('Tous');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const orderedPosts = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Staff'];

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/players-user?position=${activePost === 'Tous' ? '' : activePost}`);
        setPlayers(response.data.players);

        if (posts.length === 0) {
          const uniquePosts = [...new Set(response.data.allPosts)];
          const sortedPosts = orderedPosts.filter(pos => uniquePosts.includes(pos));
          setPosts(sortedPosts);
        }

      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [activePost]);

  return (
    <>
      <Header />

      {/* Header Section */}
      <motion.div
        className="relative overflow-hidden border-b border-gray-200 pb-4 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="absolute bottom-0 right-0 opacity-10" initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}>
          <img src={logo} alt="background" className="w-30 object-contain" />
        </motion.div>

        <div className="pt-6 pb-2">
          <motion.h1
            className="mx-30 text-4xl font-extrabold text-[#001e3c]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Équipe Première
          </motion.h1>
        </div>

        {/* Filtrage par poste */}
        <motion.div
          className="ml-40 mt-6 flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {['Tous', ...posts].map((post) => (
            <motion.button
              key={post}
              onClick={() => setActivePost(post)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 border ${
                activePost === post
                  ? 'bg-red-600 text-white border-red-600'
                  : 'text-red-600 border-red-400 hover:bg-red-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {post}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Zone des joueurs */}
      <motion.div
        className="p-8 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {loading ? (
          <motion.div
            className="text-center text-red-600 text-2xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-600">
                Chargement des Joueurs...
              </p>
            </div>
          </div>
          </motion.div>
        ) : activePost === 'Tous' ? (
          posts.map((post) => (
            <PlayerSection key={post} post={post} players={players.filter(p => p.position === post)} />
          ))
        ) : (
          <PlayerSection post={activePost} players={players} />
        )}
      </motion.div>
      <Footer />
    </>
  );
};

const PlayerSection = ({ post, players }) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(players.length / itemsPerPage);

  const visiblePlayers = players.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const handleNext = () => {
    if (page < totalPages - 1) {
      setDirection(1);
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setDirection(-1);
      setPage((prev) => prev - 1);
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="mx-30 text-4xl font-extrabold mb-6 text-[#001e3c]"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {post}
      </motion.h2>

      <div className="relative overflow-hidden">
        <div className="relative min-h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {visiblePlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {players.length > itemsPerPage && (
          <>
            <motion.button
              onClick={handlePrev}
              disabled={page === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 shadow-md hover:bg-red-100 text-red-600 ${
                page === 0 ? "opacity-30 cursor-not-allowed" : ""
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowLeft size={20} />
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={page === totalPages - 1}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 shadow-md hover:bg-red-100 text-red-600 ${
                page === totalPages - 1 ? "opacity-30 cursor-not-allowed" : ""
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowRight size={20} />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

const PlayerCard = ({ player }) => {
  return (
    <Link to={`/players/${player.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{
          scale: 1.05,
          y: -5,
          boxShadow: "0px 15px 25px rgba(0,0,0,0.2)"
        }}
        className="relative w-64 h-[400px] rounded-2xl shadow-lg overflow-hidden text-center p-4 select-none"
      >
        {/* تأثير توهج أحمر داخلي من الجوانب */}
        <div className="absolute inset-0 z-0 pointer-events-none rounded-2xl">
          <div className="w-full h-full rounded-2xl"
            style={{
              background: `
                radial-gradient(farthest-side at bottom left, rgba(255, 0, 0, 0.2), transparent 70%),
                radial-gradient(farthest-side at bottom right, rgba(255, 0, 0, 0.2), transparent 70%)
              `,
              mixBlendMode: "screen"
            }}
          ></div>
        </div>

        <motion.img
          src={`http://localhost:8000/storage/${player.photo}`}
          alt={player?.name}
          className="w-full h-60 object-cover rounded-2xl mb-3 pointer-events-none relative z-10"
          draggable="false"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-red/60 to-transparent rounded-b-2xl z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        ></motion.div>

        <motion.div
          className="mt-10 relative flex items-start justify-start gap-2 mb-1 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="sm:text-[65px] font-extrabold text-[red] leading-none drop-shadow-[0_0_15px_rgba(108,99,255,0.2)]">
            <span className="align-top text-2xl text-[red] mr-1">▼</span>
            {player.number}
          </span>
          <div className="text-left">
            <h3 className="font-semibold text-2xl text-black drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
              {player?.name?.split(' ').slice(-1)[0]}
            </h3>
            <p className="text-lg text-black/80 font-extrabold drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]">
              {player?.position}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
};


export default PlayersByPost;