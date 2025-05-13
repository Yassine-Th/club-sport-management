import React, { useEffect } from "react"
import { Await, useParams } from "react-router-dom"
import { useState } from "react"
import {
  FaUser,
  FaImage,
  FaCity,
  FaCalendarAlt,
  FaLandmark, 
  FaChair,
  FaUserTie,
  FaRunning,
  FaInfoCircle,
  FaExclamationCircle 
} from "react-icons/fa"
import instance from "../../../helpers/axios"

export default function MyclubEdit() {
    const [error, setError] = useState({})
    const [success, setSuccess] = useState('')
    const [loding, setLoding] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
  const [myclub, setMyclub] = useState({
    name: "",
    city: "",
    founded: "",
    stadium_name: "",
    stadium_capacity: "",
    president: "",
    coach_name: "",
    description: "",
    logo: null,
  })
  const {id} = useParams();

  useEffect(() => {
    const getMyclub = async () => {
      try{
        setFetchLoading(true)
        const response = await instance.get(`/myclub-edit/${id}`)
        setMyclub(response.data.monclub)
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
    setMyclub((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    setMyclub((prev) => ({ ...prev, logo: e.target.files[0] }))
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoding(true);

  const formDataToSend = new FormData();
  formDataToSend.append('name', myclub.name);
  formDataToSend.append('city', myclub.city);
  formDataToSend.append('founded', myclub.founded);
  formDataToSend.append('stadium_name', myclub.stadium_name);
  formDataToSend.append('stadium_capacity', myclub.stadium_capacity);
  formDataToSend.append('president', myclub.president);
  formDataToSend.append('coach_name', myclub.coach_name);
  formDataToSend.append('description', myclub.description);
  if (myclub.logo instanceof File) {
    formDataToSend.append('logo', myclub.logo);
  }

      formDataToSend.append("_method", "PUT") 
  try {
    const response = await instance.post(`/myclub/update/${id}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setSuccess(response.data.message || "Le club a été modifier avec succès.");
    setError({});
    setMyclub({
      name: "",
      city: "",
      founded: "",
      stadium_name: "",
      stadium_capacity: "",
      president: "",
      coach_name: "",
      description: "",
      logo: null,
    });
  } catch (error) {
    if (error.response && error.response.status === 422) {
      setError(error.response.data.errors || {});
      console.error("Erreur de validation:", error.response.data);
    } else {
      console.error("Erreur lors de la création du club:", error);
    }
  } finally {
    setLoding(false);
  }
};

if (fetchLoading)
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des information mon club...</p>
        </div>
      </div>
    )

    if (!myclub)
        return (
          <div className="min-h-[400px] flex justify-center items-center bg-gray-50 rounded-lg shadow-inner">
            <div className="flex flex-col items-center text-center">
              <FaExclamationCircle  size={48} stroke={2} className="text-red-500 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">Club introuvable</h2>
              <p className="text-sm text-gray-500 mt-1">Aucun club correspondant n'a été trouvé pour le moment.</p>
            </div>
          </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8 bg-red-600 py-4 rounded-t-lg -mt-6 -mx-6 px-6">
          <h2 className="text-3xl font-extrabold text-white">Modifier les données de votre équipe</h2>
          <p className="mt-2 text-sm text-white text-opacity-90">
            Remplissez le formulaire pour ajouter les informations de votre équipe préférée.
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
              value={myclub.name}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Nom du club"
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
               <label htmlFor="city" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaCity className="mr-2 text-red-500" /> Ville
                </label>
                <input
                  id="city"
                  name="city"
                  value={myclub.city}
                  onChange={handleChange}
                  placeholder="city"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              {error?.city && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.city[0]}
                </div>
              )}
            </div>

            <div>
                <label htmlFor="founded" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="mr-2 text-red-500" /> Année De Fondation
                </label>
                <input
                  id="founded"
                  name="founded"
                  type="number"
                  min="1800"
                  max="2030"
                  value={myclub.founded}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="YYYY"
                />
              {error?.founded && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.founded[0]}
                </div>
              )}
          </div>
          </div>

          <div>
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaInfoCircle className="mr-2 text-red-500" /> Description
              </label>
              <textarea
                id="description"
                name="description"
                value={myclub.description}
                onChange={handleChange}
                placeholder="Plus Information sur le club"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 min-h-[100px]"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="stadium_name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaLandmark className="mr-2 text-red-500" /> Nom du stade
                </label>
                <input
                  id="stadium_name"
                  name="stadium_name"
                  value={myclub.stadium_name}
                  onChange={handleChange}
                  placeholder="Nom du stade"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              {error?.stadium_name && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.stadium_name[0]}
                </div>
              )}
            </div>

            <div>
             <label htmlFor="stadium_capacity" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaChair className="mr-2 text-red-500" /> Capacité du stade
                </label>
                <input
                  id="stadium_capacity"
                  name="stadium_capacity"
                  type="number"
                  min="0"
                  value={myclub.stadium_capacity}
                  onChange={handleChange}
                  placeholder="Capacité du stade"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              {error?.stadium_capacity && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.stadium_capacity[0]}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="president" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaUserTie className="mr-2 text-red-500" /> President
                </label>
                <input
                  id="president"
                  name="president"
                  value={myclub.president}
                  onChange={handleChange}
                  placeholder="President"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
                {error?.president && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.president[0]}
                  </div>
                  )}
            </div>

            <div>
              <label htmlFor="coach_name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaRunning className="mr-2 text-red-500" /> Nom de l'entraîneur
                </label>
                <input
                  id="coach_name"
                  name="coach_name"
                  value={myclub.coach_name}
                  onChange={handleChange}
                  placeholder="Nom de l'entraîneur"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              {error?.coach_name && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error.coach_name[0]}
                </div>
              )}
            </div>
          </div>

        <div>
  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
    Logo
  </label>

  {/* عرض الشعار الحالي إذا كان موجودًا */}
  {myclub?.logo && (
    <div className="mb-4 flex justify-center">
      <img
        src={`http://localhost:8000/storage/${myclub.logo}`}
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
          htmlFor="logo"
          className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
        >
          <span>Télécharger un fichier</span>
          <input
            id="logo"
            name="logo"
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

  {/* خطأ التحميل إن وُجد */}
  {error?.logo && (
    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {error.logo[0]}
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
                     Mettre à jour en cours...
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
                     Mettre à jour mon club
                  </>
                )}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}
