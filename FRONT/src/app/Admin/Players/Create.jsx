import React from "react"
import { useState } from "react"
import {
  FaUser,
  FaRunning,
  FaCalendarAlt,
  FaRulerVertical,
  FaWeight,
  FaFlagCheckered,
  FaImage,
  FaFootballBall,
  FaHashtag,
} from "react-icons/fa"
import instance from "../../../helpers/axios"

export default function PlayerForm() {
    const [error, setError] = useState({})
    const [success, setSuccess] = useState('')
    const [loding, setLoding] = useState(false)
  const [player, setPlayer] = useState({
    name: "",
    position: "",
    birth_date: "",
    number: "",
    height: "",
    weight: "",
    foot: "",
    nationality: "",
    photo: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPlayer((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    setPlayer((prev) => ({ ...prev, photo: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoding(true)
    const formDataToSend = new FormData()
    formDataToSend.append('name', player.name)
    formDataToSend.append('position', player.position)
    formDataToSend.append('birth_date', player.birth_date)
    formDataToSend.append('number', player.number)
    formDataToSend.append('height', player.height)
    formDataToSend.append('weight', player.weight)
    formDataToSend.append('foot', player.foot)
    formDataToSend.append('nationality', player.nationality)
    formDataToSend.append('photo', player.photo)

    try{
        const response = await instance.post('/player-create', formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        })
        setSuccess(response.data.message)
        setError(null)
        setPlayer({
            name: "",
            position: "",
            birth_date: "",
            number: "",
            height: "",
            weight: "",
            foot: "",
            nationality: "",
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8 bg-red-600 py-4 rounded-t-lg -mt-6 -mx-6 px-6">
          <h2 className="text-3xl font-extrabold text-white">Ajouter un Joueur</h2>
          <p className="mt-2 text-sm text-white text-opacity-90">
            Remplissez le formulaire pour ajouter un nouveau joueur à l'équipe
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
              <FaUser className="mr-2 text-red-500" />
              Nom
            </label>
            <input
              type="text"
              name="name"
              value={player.name}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Nom du joueur"
            />
             {error?.name && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.name[0]}
                </div>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaRunning className="mr-2 text-red-500" />
                Position
              </label>
              <select
                name="position"
                value={player.position}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Sélectionner une position</option>
                <option value="goalkeeper">Gardien de but</option>
                <option value="defender">Défenseur</option>
                <option value="midfielder">Milieu de terrain</option>
                <option value="forward">Attaquant</option>
              </select>
              {error?.position && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.name[0]}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="mr-2 text-red-500" />
                Date de naissance
              </label>
              <input
                type="date"
                name="birth_date"
                value={player.birth_date}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              {error?.birth_date && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.birth_date[0]}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaHashtag className="mr-2 text-red-500" />
              Numéro
            </label>
            <input
              type="number"
              name="number"
              value={player.number}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Numéro du joueur"
            />
            {error?.number && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.number[0]}
                </div>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaRulerVertical className="mr-2 text-red-500" />
                Taille (cm)
              </label>
              <input
                type="number"
                name="height"
                value={player.height}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Taille en cm"
              />
              {error?.height && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.height[0]}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaWeight className="mr-2 text-red-500" />
                Poids (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={player.weight}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Poids en kg"
              />
              {error?.weight && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.weight[0]}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaFootballBall className="mr-2 text-red-500" />
                Pied préféré
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center">
                  <input
                    id="foot-left"
                    name="foot"
                    type="radio"
                    value="left"
                    checked={player.foot === "left"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label htmlFor="foot-left" className="ml-2 block text-sm text-gray-700">
                    Gauche
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="foot-right"
                    name="foot"
                    type="radio"
                    value="right"
                    checked={player.foot === "right"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label htmlFor="foot-right" className="ml-2 block text-sm text-gray-700">
                    Droit
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="foot-both"
                    name="foot"
                    type="radio"
                    value="both"
                    checked={player.foot === "both"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label htmlFor="foot-both" className="ml-2 block text-sm text-gray-700">
                    Les deux
                  </label>
                  {error?.foot && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.foot[0]}
                  </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaFlagCheckered className="mr-2 text-red-500" />
                Nationalité
              </label>
              <input
                type="text"
                name="nationality"
                value={player.nationality}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Nationalité du joueur"
              />
              {error?.nationality && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.nationality[0]}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaImage className="mr-2 text-red-500" />
              Image
            </label>
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
            {player.photo && <p className="mt-2 text-sm text-gray-600">Fichier sélectionné: {player.photo.name}</p>}
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
                    Création en cours...
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
                    Créer un joueur
                  </>
                )}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}
