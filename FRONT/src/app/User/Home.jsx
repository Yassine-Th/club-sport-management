import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import logo from "../../assets/logo.png";
import Header from "./Header";
import axios from "axios";
import instance from "../../helpers/axios";
import {Loader2} from 'lucide-react'
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaPlaneDeparture, FaHome, FaQuestionCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


const Home = () => {
  const [lastNews, setLastNews] = useState([]);
  const [lastPlayers, setLastPlayers] = useState([]);
  const [lodingnews, setLodingnews] = useState(true)
  const [lodingplayers, setLodingplayers] = useState(true)
  const [lodingmatche, setLodingmatche] = useState(true)
  const [matche, setMatches] = useState({})


  useEffect(() => {
    instance.get("/home")
      .then((response) => {
        setLastNews(response.data.latestNews);
        console.log("Last news:", response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching last news:", error);
      }) .finally(() => {
        setLodingnews(false)
      })
  }, []);

   useEffect(() => {
    instance.get("/home")
      .then((response) => {
        setLastPlayers(response.data.latestPlayers);
        console.log("Last news:", response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching last news:", error);
      }) .finally(() => {
          setLodingplayers(false)
      })
      
  }, []);

   useEffect(() => {
    instance.get("/home")
      .then((response) => {
        setMatches(response.data.nextMatch);
        console.log(response.data.nextMatch)
        console.log("next matche get success");
      })
      .catch((error) => {
        console.error("Error fetching last news:", error);
      }) .finally(() => {
          setLodingmatche(false)
      })
      
  }, []);


  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const pageSize = 4; // Number of products to display at once
  const productsToMove = 3; // Changed from 2 to 3 products to move when navigating
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    instance
      .get("/products")
      .then((res) => {
        setProducts(res.data.data);
        setDisplayedProducts(res.data.data.slice(0, pageSize));
      })
      .catch(console.error);
  }, []);


  return (
    <>
      <Header />
      <div className=" bg-gradient-to-br from-red-800 to-red-600">
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
                      Chargement des Actaliter...
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
          <div className="text-center mt-10">
            <Link
              to="/news"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
            >
              TOUS LES ACTUALITÉS
            </Link>
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

          {/* Swiper Slider */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            slidesPerGroup={3}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            className="!px-2"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg group">
                  <Link to={`/boutique/${product.id}`} className="block">
                    <div className="h-64 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <span className="font-title text-white text-xl">
                          PRODUIT
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-title text-lg font-medium">
                        {product.name}
                      </h3>

                      {product.clothes?.gender && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {product.clothes.gender === "homme"
                            ? "Homme"
                            : product.clothes.gender === "femme"
                            ? "Femme"
                            : product.clothes.gender === "enfant"
                            ? "Enfant"
                            : "Unisexe"}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-3">
                      <span className="font-section text-red-600 font-bold text-lg">
                        {Number(product.price).toFixed(2)} DH
                      </span>
                      <button
                        className="flex items-center text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic here
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        ACHETER
                      </button>
                    </div>

                    {product.clothes?.sizes?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">
                          Tailles disponibles:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.clothes.sizes.map((size, index) => (
                            <span
                              key={size.id || size.label || index}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              NOTRE ÉQUIPE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>
          {lodingplayers && (
         <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-600">
                Chargement des Joueurs...
              </p>
            </div>
          </div>
        )}


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
        {/* توهج داخلي من الجوانب */}
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
                   <span className="align-top text-2xl text-[red] mr-1">▼</span>
                   {item.number}
                 </span>
                 <div className="text-left">
                   <h3 className="font-semibold text-3xl text-black drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
                     {item?.name?.split(' ').slice(-1)[0]}
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
          <div className="text-center mt-10">
            <Link
              to="/players"
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
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>      </div>

     {lodingmatche ? (
         <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-600">
                Chargement des Actaliter...
              </p>
            </div>
          </div>
     )
        : matche ? (
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
                    {matche.journée ? `Journée ${matche.journée}` : "Journée non définie"}
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
                        <FaHome className="text-red-600 text-2xl" /> À domicile
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
