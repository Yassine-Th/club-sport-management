import { Link } from "react-router-dom";
import React from "react";
import Footer from "./Footer";
import logo from "../../assets/logo.png";
import Header from "./Header";
import { useState,useEffect } from "react";
import axios from "axios";
import instance from "../../helpers/axios";
import {Loader2} from 'lucide-react'

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
                Le site officiel du club de football HUSA. Suivez les dernières
                actualités, les matchs, et rejoignez notre communauté de fans
                passionnés.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 bg-red-600 rounded-full flex items-center justify-center p-2">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Club Logo"
                    className="w-[100%] rounded-full "
                  />{" "}
                  {/* Added alt attribute for accessibility */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières actualités */}
      <section className="py-16 bg-gray-50">
        {
          lodingnews && (
             <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Chargement des actualités...</p>
        </div>
      </div>
          )
        }
     
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
                  <h3 className="font-title text-xl mb-2">
                    {item.title}
                  </h3>
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

          <div className="text-center mt-8">
            <Link
              to="/news"
              className="inline-block border-2 border-red-600 text-red-600 px-6 py-2 rounded-lg font-section hover:bg-red-600 hover:text-white transition-colors"
            >
              VOIR TOUTES LES ACTUALITÉS
            </Link>
          </div>
        </div>
      </section>

      {/* Boutique section */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Maillot Domicile", price: "89,99 €" },
              { name: "Maillot Extérieur", price: "89,99 €" },
              { name: "Écharpe Supporter", price: "19,99 €" },
              { name: "Casquette HUSA", price: "24,99 €" },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
              >
                <div className="h-56 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <span className="font-title text-white text-xl">PRODUIT</span>
                </div>
                <div className="p-4">
                  <h3 className="font-title text-lg">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-section text-red-600 font-bold">
                      {product.price}
                    </span>
                    <Link
                      to="/boutique"
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      ACHETER
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

      {/* Équipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl text-gray-800 mb-2">
              NOTRE ÉQUIPE
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
          </div>
          {
          lodingplayers && (
             <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Chargement des playears...</p>
        </div>
      </div>
          )
        }

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {lastPlayers.map((item) => (
    <div key={item.id} className="text-center">
      <div className="w-full aspect-square bg-gray-100 rounded-full mb-4 overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-red-800/20 absolute inset-0"></div>
        <div className="w-full h-full bg-gradient-to-t from-red-900 to-transparent absolute inset-0 flex items-end justify-center pb-4">
          <img
            src={`http://localhost:8000/storage/${item.photo}`}
            alt={item.name}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
      </div>
      <h3 className="font-section text-lg">{item.name}</h3>
      <p className="text-red-600 font-player text-sm">{item.position}</p>
    </div>
  ))}
</div>

          <div className="text-center mt-8">
            <Link
              to="/team"
              className="inline-block border-2 border-red-600 text-red-600 px-6 py-2 rounded-lg font-section hover:bg-red-600 hover:text-white transition-colors"
            >
              VOIR L'ÉQUIPE COMPLÈTE
            </Link>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <Footer />
    </div>
    </>
    
  );
};

export default Home;
