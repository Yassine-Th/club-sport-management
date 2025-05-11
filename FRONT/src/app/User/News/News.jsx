import React, { useState, useEffect } from "react"
import logo from "../../../assets/logo.png"
import { ChevronLeft, ChevronRight, Loader2, ArrowLeft } from "lucide-react"
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import { Link } from "react-router-dom"
import instance from "../../../helpers/axios"
import Headers from "../../User/Header"
import { FaSearch, FaFilter } from "react-icons/fa"
import Footer from "../Footer"
export default function NewsUser() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("");
  const newsPerPage = 9

  useEffect(() => {
    setLoading(true)
    instance.get('/news-user')
      .then((response) => {
        setNews(response.data.news)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching news:', error)
        setLoading(false)
      })
  }, [])
  const uniqueCategories = [...new Set(news.map(item => item.category))];


  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  const indexOfLastNews = currentPage * newsPerPage
  const indexOfFirstNews = indexOfLastNews - newsPerPage
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews)
  const totalPages = Math.ceil(filteredNews.length / newsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  return (
    <>
    <Headers/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-red-900 skew-y-3 transform origin-top-right -translate-y-24 z-0"></div>

  <div className="container mx-auto px-4 py-24 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left side (Text & Inputs) */}
      <div className="text-white">
      <h1 className="font-title text-4xl md:text-5xl lg:text-6xl mb-4">FILTRAGE</h1>

        {/* Search and Filter Inputs */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* حقل البحث مع أيقونة */}
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" />
                <input
                type="text"
                placeholder="Rechercher une actualité..."
                className="w-full pl-10 pr-4 py-3 bg-white text-black placeholder-black border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white transition duration-200 hover:bg-gray-100"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                />
            </div>

            {/* تحديد الفئة مع أيقونة */}
            <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" />
                <select
                className="w-full pl-10 pr-4 py-3 bg-white text-black border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white transition duration-200 hover:bg-gray-100"
                value={selectedCategory}
                onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                }}
                >
                <option value="">Toutes les catégories</option>
                {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>
                    {category}
                    </option>
                ))}
                </select>
            </div>
            </div>

        {/* Call to Action */}
        <Link
          to="/about"
          className="inline-flex items-center px-6 py-3 bg-white text-red-700 font-semibold rounded-md hover:bg-red-100 transition-colors"
        >
          Découvrir le club
        </Link>
      </div>

      {/* Right side (Logo) */}
      <div className="flex justify-center">
        <div className="w-72 h-72 bg-red-600 rounded-full flex items-center justify-center p-3 shadow-xl">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2">
            <img src={logo} alt="Logo du club HUSA" className="w-32 h-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* News Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">ACTUALITÉS DU CLUB</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <p className="text-lg text-gray-700 font-medium">Chargement des actualités...</p>
          </div>
        ) : (
          <>
            {filteredNews.length === 0 ? (
              <div className="text-center text-gray-600 py-16">
                Aucune actualité ne correspond à votre recherche.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentNews.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    >
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={`http://localhost:8000/storage/${item.image}`}
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                          style={{ objectPosition: "center" }}
                        />
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-red-600 font-medium mb-3">{item.date}</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-600 mb-5 line-clamp-3">{item.content}</p>
                        <Link
                          to={`/news/${item.id}`}
                          className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold group"
                        >
                          LIRE PLUS
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                      } transition-colors shadow`}
                      aria-label="Page précédente"                    >
                    <FaChevronLeft className="w-4 h-4" />
                    </button>

                   <div className="text-gray-700 font-medium">
                      Page {currentPage} sur {totalPages}
                   </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                    } transition-colors shadow`}
                    aria-label="Page suivante"                    >
                    <FaChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
    <Footer/>
    </>
  )
}
