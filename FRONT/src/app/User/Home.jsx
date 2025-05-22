import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import logo from "../../assets/logo.png";
import Header from "./Header";
import instance from "../../helpers/axios";
import { Loader2 } from "lucide-react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Removed Pagination
import "swiper/css";
import "swiper/css/navigation";
// import "swiper/css/pagination"; // No longer needed

const Home = () => {
  const [lastNews, setLastNews] = useState([]);
  const [lastPlayers, setLastPlayers] = useState([]);
  const [lodingnews, setLodingnews] = useState(true);
  const [lodingplayers, setLodingplayers] = useState(true);
  const [products, setProducts] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    instance
      .get("/latest-news")
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
      .get("/latest-players")
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
      {/* Hero Section ... (collapsed for brevity) */}
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

      {/* Dernières actualités ... (collapsed for brevity) */}
      <section className="py-16 bg-gray-50">
        {lodingnews && (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              <p className="text-lg font-semibold text-gray-700">
                Chargement des actualités...
              </p>
            </div>
          </div>
        )}
        {!lodingnews && lastNews.length > 0 && (
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
                  <div className="h-48 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="font-section text-xs text-red-600 mb-2">
                      {new Date(item.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
            <div className="text-center mt-10">
              <Link
                to="/news"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
              >
                TOUS LES ACTUALITÉS
              </Link>
            </div>
          </div>
        )}
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
                modules={[Navigation]} // Only Navigation module
                onSwiper={setSwiperInstance}
                spaceBetween={16} // Adjusted gap to match example (gap-4)
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 }, // sm
                  768: { slidesPerView: 3, spaceBetween: 16 }, // md
                  1024: { slidesPerView: 4, spaceBetween: 16 }, // lg
                  // xl: { slidesPerView: 5, spaceBetween: 16 }, // xl, if needed
                }}
                slidesPerGroup={1}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                loop={products.length > 4} // Adjust loop condition based on max slidesPerView
                // Removed className="!pb-12" as pagination is gone
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    {/* NEW CARD STRUCTURE STARTS HERE */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                      <Link
                        to={`/boutique/${product.id}`}
                        className="block relative group" // 'group' for image hover effect
                      >
                        <div className="h-56 relative overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image} // Assuming product.image is a full URL
                              alt={product.name || "Produit"}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/placeholder.svg?text=Image+Indisponible"; // More specific placeholder
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

                        {/* Category/Gender Badge - CONDITIONAL */}
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
                          {" "}
                          {/* mb-auto pushes content below it down */}
                          <h3 className="font-title text-sm font-medium truncate hover:text-red-600 transition-colors">
                            {product.name || "Produit"}
                          </h3>
                          {product.description && (
                            <p className="text-gray-600 text-xs mt-1 mb-2 line-clamp-2 h-8">
                              {" "}
                              {/* h-8 ensures consistent height for 2 lines */}
                              {product.description}
                            </p>
                          )}
                        </Link>

                        <div className="flexitems-start mt-2">
                          {" "}
                          {/* mt-2 to give space from description */}
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

                        {/* Sizes Display - CONDITIONAL */}
                        {product.attributes?.type === "clothes" &&
                          product.attributes?.sizes &&
                          product.attributes.sizes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1">
                                {product.attributes.sizes.map((size, index) => (
                                  <span
                                    key={size.id || size.label || index} // Assuming size can be object or string
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
                    {/* NEW CARD STRUCTURE ENDS HERE */}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
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

      {/* Équipe ... (collapsed for brevity) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              NOTRE ÉQUIPE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>
          {lodingplayers && (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
                <p className="text-lg font-semibold text-gray-700">
                  Chargement des joueurs...
                </p>
              </div>
            </div>
          )}
          {!lodingplayers && lastPlayers.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {lastPlayers.map((item) => (
                <div key={item.id} className="text-center group">
                  <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm relative">
                    <img
                      src={`http://localhost:8000/storage/${item.photo}`}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-section text-lg text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-red-600 font-semibold text-sm">
                    {item.position}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              to="/equipe/players"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
            >
              TOUS LES JOUEURS
            </Link>
          </div>
        </div>
      </section>

      {/* Prochain match ... (collapsed for brevity) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              PROCHAIN MATCH
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-around md:justify-between">
              <div className="text-center mb-6 md:mb-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <img
                    src={logo}
                    alt="HUSA Logo"
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </div>
                <h3 className="font-section text-lg font-medium text-gray-800">
                  HUSA
                </h3>
              </div>
              <div className="text-center mb-6 md:mb-0">
                <div className="bg-red-50 rounded-lg px-4 py-2 sm:px-6 sm:py-3 mb-2 border border-red-100">
                  <div className="font-title text-2xl text-red-700">
                    À venir
                  </div>
                  <div className="font-section text-gray-600">--:--</div>
                </div>
                <div className="font-section text-sm text-gray-500">
                  STADE ADRAR, AGADIR
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <span className="font-title text-xl text-gray-500">VS</span>
                </div>
                <h3 className="font-section text-lg font-medium text-gray-800">
                  ADVERSAIRE
                </h3>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/billetterie"
                className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 rounded-lg font-title hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-base"
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
