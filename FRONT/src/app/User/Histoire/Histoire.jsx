import React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  Loader2,
  Trophy,
  Calendar,
  MapPin,
  Users,
  User,
  Star, // Used in Palmares stats
  Award, // Used in Palmares stats
  Flag, // Used in Palmares competition title
  Clock, // Used in Palmares stats
  Landmark, // Used in Club Identity
  Shirt, // Used in Club Identity
} from "lucide-react";
// Removed Swiper and related imports as they are no longer used
import "swiper/css"; // Keep base swiper css if any other component uses it, otherwise remove
// "swiper/css/navigation"; // Removed
// "swiper/css/pagination"; // Removed
// "swiper/css/effect-coverflow"; // Removed
// "swiper/css/effect-cards"; // Removed
// "swiper/css/autoplay"; // Removed
import instance from "../../../helpers/axios";
import Header from "../Header";
import Footer from "../Footer";
import img1 from "../../../img/1.jpg";
import img2 from "../../../img/2.jpg";
import img3 from "../../../img/3.jpg";
import img4 from "../../../img/4.webp";


const Histoire = () => {
  const [myClub, setMyClub] = useState(null);
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("histoire");
  const [activeEra, setActiveEra] = useState("foundation");

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await instance.get("/myclub");
        setMyClub(res.data.myclub);
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    const fetchTrophies = async () => {
      try {
        const res = await instance.get("/trophy");
        setTrophies(res.data.trophy || []); // Ensure trophies is an array
      } catch (error) {
        console.error("Error fetching trophies data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
    fetchTrophies();
  }, []);

  const processedTrophies = useMemo(() => {
    if (!Array.isArray(trophies) || trophies.length === 0) return [];

    const uniqueTrophiesMap = new Map();

    trophies.forEach((trophy) => {
      if (!trophy || !trophy.title || !trophy.competition) return; // Skip malformed trophies

      const key = `${trophy.title}-${trophy.competition}`;

      if (uniqueTrophiesMap.has(key)) {
        const existingTrophy = uniqueTrophiesMap.get(key);
        if (trophy.year && !existingTrophy.years.includes(trophy.year)) {
          existingTrophy.years.push(trophy.year);
        }
        existingTrophy.times_won = (existingTrophy.times_won || 0) + (trophy.times_won || 0);
      } else {
        const newTrophy = { ...trophy };
        newTrophy.years = trophy.year ? [trophy.year] : [];
        newTrophy.times_won = trophy.times_won || 0; // Initialize times_won
        uniqueTrophiesMap.set(key, newTrophy);
      }
    });

    return Array.from(uniqueTrophiesMap.values()).map(trophy => ({
      ...trophy,
      years: trophy.years ? [...new Set(trophy.years)].sort((a, b) => Number(a) - Number(b)) : [],
      // Ensure times_won is at least the number of unique years if it's 0 but years exist
      times_won: (trophy.times_won || 0) > 0 ? (trophy.times_won || 0) : (trophy.years ? trophy.years.length : 0),
    }));
  }, [trophies]);


  const trophiesByCompetition = useMemo(() => {
    if (!processedTrophies || processedTrophies.length === 0) return {};

    return processedTrophies.reduce((acc, trophy) => {
      if (!trophy || !trophy.competition) return acc;

      if (!acc[trophy.competition]) {
        acc[trophy.competition] = [];
      }
      acc[trophy.competition].push(trophy);
      return acc;
    }, {});
  }, [processedTrophies]);

  const clubHistory = {
    foundation: {
      title: "Fondation et Débuts (1946-1960)",
      content: `Le Hassania Union Sport d'Agadir (HUSA) a été fondé le 22 janvier 1946 par un groupe de passionnés de football d'Agadir, dirigé par Lahcen Lyazidi. Le club a été créé dans un contexte de montée du mouvement nationaliste marocain, et son nom "Hassania" est un hommage à la dynastie Alaouite régnante. 

Dans ses premières années, le club a joué dans les divisions inférieures du football marocain sous le protectorat français. Les matchs se déroulaient sur un terrain modeste dans le quartier de Talborjt. Malgré des moyens limités, le club a rapidement gagné en popularité auprès de la population locale, devenant un symbole d'identité pour la région du Souss.`,
      image: `${img1}`,
    },
    earthquake: {
      title: "Reconstruction après le Séisme (1960-1970)",
      content: `Le 29 février 1960, un terrible tremblement de terre a dévasté la ville d'Agadir, causant plus de 15 000 morts et détruisant presque entièrement la ville. Cette catastrophe a profondément affecté le club, qui a perdu plusieurs joueurs et dirigeants.

Pendant plusieurs années, les activités du club ont été suspendues alors que la ville entière était en reconstruction. Ce n'est qu'en 1963 que le HUSA a repris ses activités, symbolisant la renaissance d'Agadir. Cette même année, le club a remporté sa première Coupe du Trône, un exploit extraordinaire qui a apporté espoir et fierté à une population encore traumatisée.

Cette période difficile a forgé l'identité résiliente du club, et le HUSA est devenu un symbole de la renaissance d'Agadir après la catastrophe.`,
      image: `${img2}`,
    },
    golden: {
      title: "L'Âge d'Or (1980-2000)",
      content: `Les années 1980 et 1990 ont constitué une période faste pour le HUSA. Le club a remporté sa deuxième Coupe du Trône en 1987, confirmant son statut parmi l'élite du football marocain.

En 1996, le HUSA a atteint son apogée en remportant le prestigieux Championnat Arabe des Clubs, devenant ainsi le premier club marocain à remporter cette compétition. Cette victoire historique a propulsé le club sur la scène internationale.

Durant cette période, le HUSA a développé un style de jeu offensif et technique qui est devenu sa marque de fabrique. Le club a également formé plusieurs joueurs qui ont ensuite rejoint l'équipe nationale marocaine et des clubs européens.`,
      image: `${img3}`,
    },
    modern: {
      title: "Ère Moderne (2000-Présent)",
      content: `Le début du 21ème siècle a été marqué par le premier titre de champion du Maroc pour le HUSA lors de la saison 2001-2002, sous la direction de l'entraîneur Mohamed Fakhir. Ce titre historique a été le fruit d'un projet sportif ambitieux et d'investissements importants dans l'infrastructure du club.

En 2018, le club a ajouté une troisième Coupe du Trône à son palmarès, battant le Wydad Athletic Club aux tirs au but après un match intense.

Plus récemment, le HUSA a brillé sur la scène continentale en atteignant la finale de la Coupe de la Confédération Africaine de Football en 2020, s'inclinant de justesse face au RS Berkane dans une finale 100% marocaine.

Aujourd'hui, le club évolue au Stade Adrar, une enceinte moderne de 45 480 places inaugurée en 2013, qui symbolise les ambitions du club pour l'avenir.`,
      image: `${img4}`, // This image is still referenced here
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex items-center justify-center flex-grow bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
            <p className="text-lg font-semibold text-gray-700">
              Chargement de l'histoire du club...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-red-600 sticky top-0 z-30 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("histoire")}
              className={`px-6 py-4 font-title text-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "histoire"
                  ? "text-yellow-400 border-b-2 border-red-600"
                  : "text-white "
              }`}
            >
              HISTOIRE
            </button>
            <button
              onClick={() => setActiveTab("palmares")}
              className={`px-6 py-4 font-title text-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === "palmares"
                  ? "text-yellow-400 border-b-2 border-red-600"
                  : "text-white "
              }`}
            >
              PALMARÈS
            </button>
            {/* Légendes and Stade tabs removed */}
          </div>
        </div>
      </div>

      {myClub && activeTab === "histoire" && (
        <>
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="bg-gradient-to-br from-red-700 to-red-900 p-8 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center p-2 mb-6">
                      <img
                        src={
                          myClub.logo
                            ? `http://localhost:8000/storage/${myClub.logo}`
                            : "/placeholder.svg"
                        }
                        alt={myClub.name || "Logo du Club"}
                        className="w-[90%] rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <h2 className="font-title text-2xl text-white text-center mb-2">
                      {myClub.name || "Nom du Club"}
                    </h2>
                    <div className="h-1 w-16 bg-white/50 mb-4"></div>
                    <p className="text-red-100 text-center">
                      {myClub.founded || "Année inconnue"} -{" "}
                      {new Date().getFullYear()}
                    </p>
                  </div>

                  <div className="col-span-2 p-8">
                    <h3 className="font-title text-2xl text-gray-800 mb-6">
                      CARTE D'IDENTITÉ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="text-red-600 w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Fondé en</p>
                            <p className="text-gray-600">
                              {myClub.founded || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="text-red-600 w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Ville</p>
                            <p className="text-gray-600">
                              {myClub.city || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <User className="text-red-600 w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Président</p>
                            <p className="text-gray-600">
                              {myClub.president || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Landmark className="text-red-600 w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Stade</p>
                            <p className="text-gray-600">
                              {myClub.stadium_name || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="text-red-600 w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Capacité</p>
                            <p className="text-gray-600">
                              {myClub.stadium_capacity
                                ? `${myClub.stadium_capacity.toLocaleString()} spectateurs`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shirt className="text-red-600 w-5 h-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Entraîneur</p>
                            <p className="text-gray-600">
                              {myClub.coach_name || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-title text-3xl text-gray-800 mb-2">
                  L'HISTOIRE DU HUSA
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-4"></div>
                <p className="max-w-2xl mx-auto text-gray-600">
                  Parcourez les différentes époques qui ont façonné l'histoire
                  du Hassania Union Sport d'Agadir.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {Object.entries(clubHistory).map(([era, data]) => (
                  <button
                    key={era}
                    onClick={() => setActiveEra(era)}
                    className={`px-6 py-3 rounded-full font-title text-sm transition-all ${
                      activeEra === era
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {data.title.split("(")[0].trim()}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h3 className="font-title text-2xl text-gray-800 mb-2">
                    {clubHistory[activeEra].title}
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-700 mb-6"></div>
                  <div className="prose prose-red max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {clubHistory[activeEra].content}
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
                    <img
                      src={clubHistory[activeEra].image || "/placeholder.svg"}
                      alt={clubHistory[activeEra].title}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg?height=400&width=600";
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-16 bg-gray-50 rounded-xl p-8 shadow-inner">
                <h3 className="font-title text-2xl text-gray-800 mb-4 text-center">
                  LE CLUB AUJOURD'HUI
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-6"></div>
                <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-center">
                  {myClub.description || "Description du club non disponible."}
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "palmares" && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* <div className="text-center mb-12">
              <h2 className="font-title text-3xl text-gray-800 mb-2">
                PALMARÈS DU CLUB
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-4"></div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Découvrez les trophées et les accomplissements majeurs remportés
                par le Hassania Union Sport d'Agadir au fil des années.
              </p>
            </div> */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="text-red-600 w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {processedTrophies.length}
                </div>
                <div className="text-gray-700 font-section">
                  Trophées Uniques
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-red-600 w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {Object.keys(trophiesByCompetition).length}
                </div>
                <div className="text-gray-700 font-section">Compétitions</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-red-600 w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {processedTrophies.reduce(
                    (sum, trophy) => sum + (trophy.times_won || 0),
                    0
                  )}
                </div>
                <div className="text-gray-700 font-section">
                  Victoires Totales
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-red-600 w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {myClub && myClub.founded
                    ? new Date().getFullYear() - Number(myClub.founded)
                    : "N/A"}
                </div>
                <div className="text-gray-700 font-section">
                  Années d'Histoire
                </div>
              </div>
            </div>

            {Object.keys(trophiesByCompetition).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(trophiesByCompetition).map(
                  ([competition, trophyList]) => (
                    <div
                      key={competition}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-red-600 to-red-800 py-4 px-6">
                        <h3 className="font-title text-2xl text-white flex items-center">
                          <Flag className="mr-3 h-6 w-6" />
                          {competition}
                        </h3>
                      </div>
                      <div className="p-6 divide-y divide-gray-200">
                        {trophyList.map((trophy) => (
                          <div
                            key={trophy.id || trophy.title}
                            className="py-6 first:pt-0 last:pb-0"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                              <h4 className="font-title text-xl text-gray-800 mb-1 sm:mb-0">
                                {trophy.title || "Titre Inconnu"}
                              </h4>
                              {trophy.times_won > 0 && (
                                <span className="text-sm font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full whitespace-nowrap">
                                  Remporté {trophy.times_won} fois
                                </span>
                              )}
                            </div>
                            {trophy.years && trophy.years.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                                  Années de Victoire :
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {trophy.years.map((year, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-sm"
                                    >
                                      {year}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {trophy.description && (
                              <p className="text-sm text-gray-600 mt-3">
                                {trophy.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Aucun trophée à afficher pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Legends Section Removed */}
      {/* Stadium Section Removed */}

      {activeTab === "histoire" && processedTrophies.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-title text-3xl text-gray-800 mb-2">
                MOMENTS HISTORIQUES
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-4"></div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Les dates clés qui ont marqué l'histoire du Hassania Union Sport
                d'Agadir.
              </p>
            </div>
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-200"></div>
              <div className="space-y-16">
                <div className="relative flex items-center flex-row">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 z-10 border-4 border-white"></div>
                  <div className="w-5/12 pr-12 text-right">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow transform hover:-translate-y-1">
                      <div className="text-red-600 font-bold text-2xl mb-2">
                        1946
                      </div>
                      <h3 className="font-title text-xl mb-3">
                        Fondation du Club
                      </h3>
                      <p className="text-gray-600">
                        Le Hassania Union Sport d'Agadir est fondé le 22 janvier
                        1946.
                      </p>
                    </div>
                  </div>
                  <div className="w-5/12"></div>
                </div>
                <div className="relative flex items-center flex-row-reverse">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 z-10 border-4 border-white"></div>
                  <div className="w-5/12 pl-12 text-left">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow transform hover:-translate-y-1">
                      <div className="text-red-600 font-bold text-2xl mb-2">
                        1960
                      </div>
                      <h3 className="font-title text-xl mb-3">
                        Tremblement de Terre d'Agadir
                      </h3>
                      <p className="text-gray-600">
                        Le club est touché par le séisme. Activités suspendues.
                      </p>
                    </div>
                  </div>
                  <div className="w-5/12"></div>
                </div>
                {processedTrophies
                  .filter(
                    (trophy) =>
                      trophy &&
                      (trophy.year || (trophy.years && trophy.years.length > 0))
                  )
                  .sort(
                    (a, b) =>
                      (a.years && a.years[0] ? a.years[0] : a.year) -
                      (b.years && b.years[0] ? b.years[0] : b.year)
                  )
                  .map((trophy, index) => (
                    <div
                      key={trophy.id || trophy.title}
                      className={`relative flex items-center ${
                        (index + 2) % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 z-10 border-4 border-white"></div>
                      <div
                        className={`w-5/12 ${
                          (index + 2) % 2 === 0
                            ? "pr-12 text-right"
                            : "pl-12 text-left"
                        }`}
                      >
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow transform hover:-translate-y-1">
                          <div className="text-red-600 font-bold text-2xl mb-2">
                            {trophy.years && trophy.years.length > 0
                              ? trophy.years.join(", ")
                              : trophy.year}
                          </div>
                          <h3 className="font-title text-xl mb-3">
                            {trophy.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {trophy.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-5/12"></div>
                    </div>
                  ))}
                {/* Stadium event removed from timeline */}
              </div>
            </div>
          </div>
        </section>
      )}


      <Footer />
    </div>
  );

};
export default Histoire;