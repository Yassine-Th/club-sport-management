import React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import instance from "../../../helpers/axios"

const EditNew = () => {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState({})

  // Fetch news data on load
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setFetchLoading(true)
        const response = await instance.get(`/news/${id}`)
        setNews(response.data.news)
      } catch (err) {
        console.error("Erreur lors du chargement :", err)
      } finally {
        setFetchLoading(false)
      }
    }
    fetchNews()
  }, [id])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image") {
      setNews({ ...news, image: files[0] })
    } else {
      setNews({ ...news, [name]: value })
    }
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("author_id", news.author_id)
    formDataToSend.append("title", news.title)
    formDataToSend.append("content", news.content)
    formDataToSend.append("category", news.category)

    if (news.image instanceof File) {
      formDataToSend.append("image", news.image)
    }

    formDataToSend.append("_method", "PUT") // Laravel doesn't accept PUT directly with FormData

    try {
      setLoading(true)
      const response = await instance.post(`/news/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setSuccess(response.data.message)
      setError({})
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(err.response.data.errors || {})
        console.error("Erreur de validation :", err.response.data)
      } else {
        console.error("Erreur lors de la mise à jour :", err)
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading)
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement de l'actualité...</p>
        </div>
      </div>
    )

  if (!news)
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">Actualité non trouvée</h3>
          <p className="mt-2 text-gray-600">Impossible de charger les détails de cette actualité.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 py-6 px-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">✏️</span> Modifier l'actualité
          </h1>
          <p className="text-blue-100 mt-2">Mettez à jour les informations de votre article</p>
        </div>

        <div className="p-8">
          {success && (
            <div
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md flex items-center"
              role="alert"
            >
              <svg
                className="h-5 w-5 mr-2 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {Object.keys(error).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <div className="font-medium mb-1">Veuillez corriger les erreurs suivantes:</div>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(error).map(([field, messages]) =>
                  messages.map((msg, i) => <li key={`${field}-${i}`}>{msg}</li>),
                )}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                name="title"
                value={news.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Titre de l'actualité"
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
              <textarea
                name="content"
                value={news.content}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Décris l'actualité..."
              ></textarea>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <div className="relative">
                <select
                  name="category"
                  value={news.category}
                  onChange={handleChange}
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Choisir une catégorie</option>
                  <option value="match">Match</option>
                  <option value="transfer">Transfert</option>
                  <option value="club">Club</option>
                  <option value="other">Autre</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>

              {/* Current image preview */}
              {news.image && !(news.image instanceof File) && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Image actuelle:</p>
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={`http://localhost:8000/storage/${news.image}`}
                      alt="Preview"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* New image upload */}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Télécharger une nouvelle image</span>
                      <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleChange} />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                </div>
              </div>

              {/* New image preview */}
              {news.image instanceof File && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Nouvelle image:</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(news.image) || "/placeholder.svg"}
                        alt="New preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600">{news.image.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mise à jour en cours...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mettre à jour l'actualité
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditNew
