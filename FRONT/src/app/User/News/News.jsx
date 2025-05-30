import React from "react";
import { useState, useEffect } from "react";
import logo from "../../../assets/logo.png";
import { Loader2, Search, Filter, Calendar, ArrowUpRight } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import instance from "../../../helpers/axios";
import Headers from "../../User/Header";
import Footer from "../Footer";

export default function NewsUser() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const newsPerPage = 9;

  useEffect(() => {
    setLoading(true);
    instance
      .get("/news-user")
      .then((response) => {
        setNews(response.data.news);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, []);

  const uniqueCategories = [...new Set(news.map((item) => item.category))];

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <Headers />
      <main className="min-h-screen bg-white">
        {/* Stylish Filter Bar */}
        <section className="bg-gradient-to-r from-red-700 to-red-900 py-6 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher une actualité..."
                    className="w-full pl-12 pr-4 py-3 bg-white text-gray-800 placeholder-gray-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === ""
                      ? "bg-yellow-500 text-red-900"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Toutes
                </button>

                {uniqueCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-yellow-500 text-red-900"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {category}
                  </button>
                ))}

                {selectedCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-red-800 text-white font-medium rounded-lg hover:bg-red-900 transition-colors"
                  >
                    Réinitialiser ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* News Section - Modern Card Grid */}
        <section className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Les dernières nouvelles du club
            </h2>
            <div className="h-1 w-20 bg-red-600 mt-4"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
              <p className="text-lg text-gray-700 font-medium">
                Chargement des actualités...
              </p>
            </div>
          ) : (
            <>
              {filteredNews.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="max-w-md mx-auto">
                    <div className="bg-red-50 rounded-2xl p-8">
                      <Search className="h-12 w-12 text-red-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Aucun résultat trouvé
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Aucune actualité ne correspond à votre recherche.
                        Essayez avec d'autres termes ou catégories.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("");
                          setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentNews.map((item, index) => (
                      <div
                        key={item.id}
                        className={`group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 flex flex-col h-full ${
                          index === 0 && currentPage === 1
                            ? "md:col-span-2 lg:col-span-1"
                            : ""
                        }`}
                      >
                        <Link to={"/news/" + item.id}>
                        <div className="relative h-56 overflow-hidden">
                          
                            <img
                              src={`http://localhost:8000/storage/${item.image}`}
                              alt={item.title}
                              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/placeholder.svg?height=300&width=500";
                              }}
                            />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 z-10">
                            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        </Link>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(item.date)}
                          </div>
                              <Link to={"/news/" + item.id}>
                          <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-red-700 transition-colors">
                            {item.title}
                          </h3>
                            </Link>
                          <p className="text-gray-600 mb-5 line-clamp-3 flex-grow">
                            {item.content}
                          </p>

                          <Link
                            to={`/news/${item.id}`}
                            className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold mt-auto group/link"
                          >
                            <span className="mr-2">LIRE L'ARTICLE</span>
                            <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center transition-transform group-hover/link:translate-x-1">
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Modern Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex flex-col items-center">
                      <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-full">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-sm"
                          }`}
                          aria-label="Page précédente"
                        >
                          <FaChevronLeft className="w-3 h-3" />
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              // Logic to show pages around current page
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                                    currentPage === pageNum
                                      ? "bg-red-600 text-white font-bold"
                                      : "bg-white text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-sm"
                          }`}
                          aria-label="Page suivante"
                        >
                          <FaChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-gray-500 text-sm mt-3">
                        Page {currentPage} sur {totalPages}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
