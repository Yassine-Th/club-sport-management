import React, { useState } from "react"
import axios from "axios"
import { getUserInfo } from "../../../helpers/access_token"
import instance from "../../../helpers/axios"
import { Loader } from "@mantine/core"

const CreateNew = () => {
  const user = getUserInfo()
  const user_id = user.id

  const [formData, setFormData] = useState({
    author_id: user_id,
    title: "",
    content: "",
    category: "",
    image: null,
  })

  const [error, setError] = useState({})
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formDataToSend = new FormData()
    formDataToSend.append("author_id", formData.author_id)
    formDataToSend.append("title", formData.title)
    formDataToSend.append("content", formData.content)
    formDataToSend.append("category", formData.category)
    formDataToSend.append("image", formData.image)

    try {
      const response = await instance.post("/news-create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setSuccess(response.data.message)
      setInterval(()=> {
        setSuccess("")
      }, 3000)
      setError(null)
      setFormData({
        author_id: user_id,
        title: "",
        content: "",
        category: "",
        image: null,
      })
      // Reset file input manually
      document.getElementById("imgInput").value = ""
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors)
        console.error("Erreur de validation:", error.response.data)
      }
      console.error("Erreur lors de la création de l'actualité:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          📰 Créer une nouvelle actualité
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Succès! </strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Titre de l'actualité"
            />
            {error?.title && <div className="text-red-500 text-sm mt-1">{error.title[0]}</div>}
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décris l'actualité..."
            ></textarea>
            {error?.content && <div className="text-red-500 text-sm mt-1">{error.content[0]}</div>}
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir une catégorie</option>
              <option value="match">Match</option>
              <option value="transfer">Transfert</option>
              <option value="club">Club</option>
              <option value="other">Autre</option>
            </select>
            {error?.category && <div className="text-red-500 text-sm mt-1">{error.category[0]}</div>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              name="image"
              id="imgInput"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {error?.image && <div className="text-red-500 text-sm mt-1">{error.image[0]}</div>}
          </div>

          {/* Bouton Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? <Loader size="sm" color="white" /> : null}
              {loading ? "Création en cours..." : "Créer l'actualité"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateNew
