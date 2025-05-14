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

const Home = () => {
  const [lastNews, setLastNews] = useState([]);
  const [lastPlayers, setLastPlayers] = useState([]);
  const [lodingnews, setLodingnews] = useState(true)
  const [lodingplayers, setLodingplayers] = useState(true)


  useEffect(() => {
    instance.get("/latest-news")
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
    instance.get("/latest-players")
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
      <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
        <section className="relative overflow-hidden">
          {/* Fond diagonal rouge */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 skew-y-3 transform origin-top-right -translate-y-24 z-0"></div>

          <div className="container mx-auto px-4 py-20 relative z-10">
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
        {lodingnews && (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-700">
                Chargement des actualités...
              </p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              DERNIÈRES ACTUALITÉS
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lastNews.map((item) => (
              <div
                key={item.id}
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
              </div>
            ))}
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
            <div className="flex items-center justify-center h-screen bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
                <p className="text-lg font-semibold text-gray-700">
                  Chargement des playears...
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {lastPlayers.map((item) => (
              <div key={item.id} className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                  <img
                    src={`http://localhost:8000/storage/${item.photo}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-section text-lg">{item.name}</h3>
                <p className="text-red-600 font-player text-sm">
                  {item.position}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/boutique"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
            >
              TOUS LES JOUEURS
            </Link>
          </div>
        </div>
      </section>

      {/* Prochain match */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              PROCHAIN MATCH
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-title text-xl">HUSA</span>
                </div>
                <h3 className="font-section text-lg">CLUB HUSA</h3>
              </div>

              <div className="text-center mb-4 md:mb-0">
                <div className="bg-red-50 rounded-lg px-6 py-3 mb-2">
                  <div className="font-title text-2xl text-red-700">
                    15 MAI 2023
                  </div>
                  <div className="font-section text-gray-600">20:00</div>
                </div>
                <div className="font-section text-sm text-gray-500">
                  NOM DU STADE, VILLE
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-title text-xl">RCA</span>
                </div>
                <h3 className="font-section text-lg">RAJA CLUB</h3>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/tickets"
                className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-title hover:shadow-lg transition-all"
              >
                ACHETER DES BILLETS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
