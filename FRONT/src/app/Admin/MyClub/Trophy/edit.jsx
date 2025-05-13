import React from "react"
import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  FaMedal,
  FaCalendarAlt,
  FaImage,
  FaInfoCircle,
  FaTrophy,
  FaTag
} from "react-icons/fa"
import instance from "../../../../helpers/axios"

export default function TrophyEdit() {
    const [error, setError] = useState({})
    const [success, setSuccess] = useState('')
    const [loding, setLoding] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
  const [trophy, setTrophy] = useState({
    title: "",
    year: "",
    times_won:"",
    competition: "",
    description: "",
    photo: null,
  })

  const {id} = useParams()
   useEffect(() => {
    const getMyclub = async () => {
      try{
        setFetchLoading(true)
        const response = await instance.get(`/trophy-edit/${id}`)
        setTrophy(response.data.trophy)
      } catch (error){
        console.log(error)
        setMyclub(null);
      } finally{
        setFetchLoading(false)
      }
    }
    getMyclub();
  },[id])


  const handleChange = (e) => {
    const { name, value } = e.target
    setTrophy((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    setTrophy((prev) => ({ ...prev, photo: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoding(true)
    const formDataToSend = new FormData()
    formDataToSend.append('title', trophy.title)
    formDataToSend.append('year', trophy.year)
    formDataToSend.append('times_won', trophy.times_won)
    formDataToSend.append('competition', trophy.competition)
    formDataToSend.append('description', trophy.description)
    if (trophy.photo instanceof File) {
        formDataToSend.append('photo', trophy.logo);
      }

      formDataToSend.append("_method", "PUT") 
    try{
        const response = await instance.post(`/trophy/update/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        })
        setSuccess(response.data.message)
        setError(null)
        setTrophy({
            title: "",
            year: "",
            times_won:"",
            competition: "",
            description: "",
            photo: null,
        })
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors)
        console.error("Erreur de validation:", error.response.data)
      }
      console.error("Erreur lors de la création de l'actualité:", error)
    } finally{
        setLoding(false)
    }
  } 


  if (fetchLoading)
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des information mon Titre...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8 bg-red-600 py-4 rounded-t-lg -mt-6 -mx-6 px-6">
          <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <FaTrophy className="text-white-300 text-4xl" />
            Modifier un Titre
          </h2>
          <p className="mt-2 text-sm text-white text-opacity-90">
            Remplissez le formulaire pour Modifier un nouveau Titre à l'équipe
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaTag className="mr-2 text-red-500" />
              Titre
            </label>
            <input
              type="text"
              name="title"
              value={trophy.title}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Nom du Titre"
            />
             {error?.title && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.title[0]}
                </div>
              )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaMedal className="mr-2 text-red-500" />
              Fois gagnées
            </label>
            <input
              type="number"
              name="times_won"
              value={trophy.times_won}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Fois gagnées"
            />
             {error?.times_won && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.times_won[0]}
                </div>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="mr-2 text-red-500" />
                 Année de la victoire
              </label>
              <input
                type="number"
                name="year"
                value={trophy.year}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Année de la victoire"
              />
              {error?.year && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.year[0]}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaTrophy className="mr-2 text-red-500" />
                Competition 
              </label>
              <input
                type="text"
                name="competition"
                value={trophy.competition}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Competition"
              />
              {error?.competition && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.competition[0]}
                </div>
              )}
            </div>
          </div>

         <div>
                       <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                         <FaInfoCircle  className="mr-2 text-red-500" />
                         Description
                       </label>
                       <textarea
                         name="description"
                         value={trophy.description}
                         onChange={handleChange}
                         rows={5}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                         placeholder="Décris Titre..."
                       ></textarea>
                       {error?.description && (
                         <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                             <path
                               fillRule="evenodd"
                               d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                               clipRule="evenodd"
                             />
                           </svg>
                           {error.description[0]}
                         </div>
                       )}
                     </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaImage className="mr-2 text-red-500" />
              Image
            </label>
            {trophy?.photo && (
              <div className="mb-4 flex justify-center">
                <img
                  src={`http://localhost:8000/storage/${trophy.photo}`}
                  alt="Logo actuel"
                  className="w-32 h-32 object-cover rounded-full border-2 border-red-400 shadow"
                />
              </div>
            )}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-red-400 transition-colors duration-200">
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
                    htmlFor="photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
                  >
                    <span>Télécharger un fichier</span>
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      className="sr-only"
                      onChange={handlePhotoChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
              </div>
            </div>
            {trophy.photo && <p className="mt-2 text-sm text-gray-600">Fichier sélectionné: {trophy.photo.name}</p>}
            {error?.photo && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.photo[0]}
                </div>
              )}
          </div>

          <div className="pt-4">
              <button
                type="submit"
                disabled={loding}
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md ${
                  loding ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loding ? (
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
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Modifier un Titre
                  </>
                )}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}
