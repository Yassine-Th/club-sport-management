import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import logo from "../../assets/logo.png";
import Header from "./Header";
import instance from "../../helpers/axios";
import { Loader2 } from "lucide-react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaPlaneDeparture, FaHome, FaQuestionCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [lastNews, setLastNews] = useState([]);
  const [lastPlayers, setLastPlayers] = useState([]);
  const [lodingnews, setLodingnews] = useState(true);
  const [lodingplayers, setLodingplayers] = useState(true);
  const [lodingmatche, setLodingmatche] = useState(true);
  const [matche, setMatches] = useState({});
  const [products, setProducts] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    instance
      .get("/home")
      .then((response) => {
        setLastNews(response.data.latestNews);
      })
      .catch((error) => {
        console.error("Error fetching last news:", error);
      })
      .finally(() => {
        setLodingnews(false);
      });
  }, []);

  useEffect(() => {
    instance
      .get("/home")
      .then((response) => {
        setLastPlayers(response.data.latestPlayers);
      })
      .catch((error) => {
        console.error("Error fetching last players:", error);
      })
      .finally(() => {
        setLodingplayers(false);
      });
  }, []);

  useEffect(() => {
    instance
      .get("/home")
      .then((response) => {
        setMatches(response.data.nextMatch);
      })
      .catch((error) => {
        console.error("Error fetching next match:", error);
      })
      .finally(() => {
        setLodingmatche(false);
      });
  }, []);

  useEffect(() => {
    instance
      .get("/products")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (swiperInstance && products.length > 0) {
      swiperInstance.update();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, products]);

  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-800 to-red-600">
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-15 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h1 className="font-title text-4xl md:text-5xl lg:text-6xl mb-4">
                  BIENVENUE AU <br /> CLUB Hassania Union Sport Agadir
                </h1>
                <div className="h-1 w-24 bg-white mb-6"></div>
                <p className="font-section mb-8 text-red-100">
                  Le site officiel du club de football HUSA. Suivez les
                  dernières actualités, les matchs, et rejoignez notre
                  communauté de fans passionnés.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-red-600 rounded-full flex items-center justify-center p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Club Logo"
                      className="w-[100%] rounded-full "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Dernières actualités */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-title text-3xl text-gray-800 mb-2"
            >
              DERNIÈRES ACTUALITÉS
            </motion.h2>
            <AnimatePresence>
              {lodingnews && (
                <motion.div
                  key="loader-news"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center h-[50vh]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
                    <p className="text-lg font-semibold text-gray-600">
                      Chargement des actualités...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {lastNews.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center overflow-hidden rounded-md">
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="font-section text-xs text-red-600 mb-2">
                      {item.date}
                    </div>
                    <h3 className="font-title text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {item.content}
                    </p>
                    <div className="font-section text-xs text-red-600 mb-2">
                      {item.category}
                    </div>
                    <Link
                      to={`/news/${item.id}`}
                      className="font-section text-red-600 hover:text-red-700"
                    >
                      LIRE PLUS →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Boutique section with Swiper */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              BOUTIQUE OFFICIELLE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Découvrez notre collection officielle et supportez votre équipe
              avec style. Maillots, écharpes et accessoires aux couleurs du
              club.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="relative group/swiper">
              <Swiper
                modules={[Navigation]}
                onSwiper={setSwiperInstance}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 16 },
                  1024: { slidesPerView: 4, spaceBetween: 16 },
                }}
                slidesPerGroup={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                loop={products.length > 4}
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                      <Link
                        to={`/boutique/${product.id}`}
                        className="block relative group"
                      >
                        <div className="h-56 relative overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name || "Produit"}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/placeholder.svg?text=Image+Indisponible";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                              <span className="font-title text-white text-xl">
                                PRODUIT
                              </span>
                            </div>
                          )}
                        </div>
                        {product.attributes?.type === "clothes" &&
                          product.attributes?.gender && (
                            <span className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded-sm font-medium z-10">
                              {product.attributes.gender === "homme"
                                ? "Homme"
                                : product.attributes.gender === "femme"
                                ? "Femme"
                                : product.attributes.gender === "enfant"
                                ? "Enfant"
                                : "Unisexe"}
                            </span>
                          )}
                      </Link>
                      <div className="p-3 flex flex-col flex-grow">
                        <Link
                          to={`/boutique/${product.id}`}
                          className="block mb-auto"
                        >
                          <h3 className="font-title text-sm font-medium truncate hover:text-red-600 transition-colors">
                            {product.name || "Produit"}
                          </h3>
                          {product.description && (
                            <p className="text-gray-600 text-xs mt-1 mb-2 line-clamp-2 h-8">
                              {product.description}
                            </p>
                          )}
                        </Link>
                        <div className="flexitems-start mt-2">
                          <span className="font-section text-lg text-red-600 font-bold mb-2">
                            {product.price
                              ? Number.parseFloat(product.price).toFixed(2)
                              : "0.00"}{" "}
                            DH
                          </span>
                          <Link to={`/boutique/${product.id}`}>
                            <button className="w-full flex items-center justify-center text-center bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition-colors">
                              <ShoppingCart className="w-3 h-3 mr-1.5" />
                              ACHETER
                            </button>
                          </Link>
                        </div>
                        {product.attributes?.type === "clothes" &&
                          product.attributes?.sizes &&
                          product.attributes.sizes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1">
                                {product.attributes.sizes.map((size, index) => (
                                  <span
                                    key={size.id || size.label || index}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                                  >
                                    {size.label || size}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-[-12px] sm:left-[-16px] z-20 p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 transition-all duration-300 opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:left-2 sm:group-hover/swiper:left-3 disabled:opacity-0 disabled:cursor-not-allowed">
                <ChevronLeft size={28} />
              </button>
              <button className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-[-12px] sm:right-[-16px] z-20 p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 transition-all duration-300 opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:right-2 sm:group-hover/swiper:right-3 disabled:opacity-0 disabled:cursor-not-allowed">
                <ChevronRight size={28} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="ml-3 text-lg font-semibold text-gray-700">
                Chargement des produits...
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/boutique"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
            >
              VISITER LA BOUTIQUE
            </Link>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              NOTRE ÉQUIPE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>
          {lodingplayers ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
                <p className="text-lg font-semibold text-gray-600">
                  Chargement des Joueurs...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {lastPlayers.map((item) => (
                <Link to={`/players/${item.id}`} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: "0px 15px 25px rgba(0,0,0,0.2)",
                    }}
                    className="relative rounded-2xl shadow-lg overflow-hidden text-center p-4 select-none"
                  >
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-2xl">
                      <div
                        className="w-full h-full rounded-2xl"
                        style={{
                          background: `
                            radial-gradient(farthest-side at bottom left, rgba(255, 0, 0, 0.2), transparent 70%),
                            radial-gradient(farthest-side at bottom right, rgba(255, 0, 0, 0.2), transparent 70%)
                          `,
                          mixBlendMode: "screen",
                        }}
                      ></div>
                    </div>
                    <motion.img
                      src={`http://localhost:8000/storage/${item.photo}`}
                      alt={item.name}
                      className="w-full aspect-square object-cover rounded-2xl mb-3 pointer-events-none relative z-10"
                      draggable="false"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red/60 to-transparent rounded-b-2xl z-10"
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
                        <span className="align-top text-2xl text-[red] mr-1">
                          ▼
                        </span>
                        {item.number}
                      </span>
                      <div className="text-left">
                        <h3 className="font-semibold text-3xl text-black drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
                          {item?.name?.split(" ").slice(-1)[0]}
                        </h3>
                        <p className="text-lg text-black/80 font-extrabold drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]">
                          {item?.position}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              to="/equipe/joueurs"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
            >
              TOUS LES JOUEURS
            </Link>
          </div>
        </div>
      </section>

      {/* Prochain match */}
      <section className="py-16 bg-gray-50 ">
        <div className="text-center mb-10">
          <h2 className="font-title text-3xl text-gray-800 mb-2">
            Next Matche
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
        </div>
        {lodingmatche ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-600">
                Chargement des Actaliter...
              </p>
            </div>
          </div>
        ) : matche ? (
          <div className="flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Club 1 */}
                <div className="text-center mb-6 md:mb-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2 border border-gray-300">
                    {matche.myclub?.logo && (
                      <img
                        src={`http://localhost:8000/storage/${matche.myclub?.logo}`}
                        alt="Logo My Club"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {matche.myclub?.name}
                  </h3>
                </div>
                {/* Match Info */}
                <div className="text-center mb-6 md:mb-0">
                  <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-red-700">
                      {matche.journée
                        ? `Journée ${matche.journée}`
                        : "Journée non définie"}
                    </h1>
                  </div>
                  <div className="bg-red-100 rounded-lg px-6 py-3 mb-2">
                    <div className="text-xl font-bold text-red-700">
                      {matche.match_date || "Date Non défini"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {matche.match_location || "Lieu non défini"}
                  </div>
                  {/* is_home */}
                  <div className="mt-1 text-sm text-gray-700 flex items-center justify-center gap-1">
                    Terrain du match :
                    <span className="font-semibold flex items-center gap-1">
                      {matche.is_home === 0 || matche.is_home === "0" ? (
                        <>
                          <FaPlaneDeparture className="text-red-600 text-2xl" />{" "}
                          À l'extérieur
                        </>
                      ) : matche.is_home === 1 || matche.is_home === "1" ? (
                        <>
                          <FaHome className="text-red-600 text-2xl" /> À
                          domicile
                        </>
                      ) : (
                        <>
                          <FaQuestionCircle className="text-red-500 text-2xl" />{" "}
                          Non défini
                        </>
                      )}
                    </span>
                  </div>
                  {/* aller_retour */}
                  {matche.aller_retour && (
                    <div className="mt-1 text-sm text-gray-700">
                      Type :{" "}
                      <span className="font-medium">{matche.aller_retour}</span>
                    </div>
                  )}
                </div>
                {/* Club 2 */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2 border border-gray-300">
                    {matche.opponent?.logo && (
                      <img
                        src={`http://localhost:8000/storage/${matche.opponent?.logo}`}
                        alt="Logo Opponent"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {matche.opponent?.name}
                  </h3>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link
                  to="/matches"
                  className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-full font-semibold hover:shadow-md transition duration-300"
                >
                  VIOR TOUT LES MATCHES
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 text-xl">
            Il n'y a pas de match à venir actuellement.
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Home;
