"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import React from "react"
import { ChevronRight, Loader2, PlusCircle, RefreshCw, AlertCircle } from "lucide-react"
import instance from "../../../helpers/axios"
export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await instance.get("/news")
      const data = response.data.data ?? response.data
      console.log(data)
      setNews(data)
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Impossible de charger les actualités.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchNews()
  }

  useEffect(() => {
    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Chargement…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Erreur</h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 p-1.5 rounded-lg">📰</span>
              Actualités
            </h1>
            <p className="text-gray-500 mt-1">Gérez toutes vos actualités</p>
          </div>

          <Link
            to="/journalist/create"
            className="group flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 font-medium"
          >
            <PlusCircle className="h-5 w-5" />
            Ajouter une actualité
            <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Journaliste
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.length > 0 ? (
                  news.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.author?.name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.author.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.title}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-lg font-medium">Aucune actualité disponible</p>
                        <p className="text-sm mt-1">Ajoutez votre première actualité pour commencer</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Button */}
        {news.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
