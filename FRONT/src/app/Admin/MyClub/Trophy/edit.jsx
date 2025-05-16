import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaMedal,
  FaCalendarAlt,
  FaImage,
  FaInfoCircle,
  FaTrophy,
  FaTag,
} from "react-icons/fa";
import { IconArrowLeft } from "@tabler/icons-react";
import instance from "../../../../helpers/axios";

export default function TrophyEdit() {
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [trophy, setTrophy] = useState({
    title: "",
    year: "",
    times_won: "",
    competition: "",
    description: "",
    photo: null,
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchTrophy = async () => {
      try {
        setFetchLoading(true);
        const response = await instance.get(`/trophy-edit/${id}`);
        setTrophy(response.data.trophy);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTrophy();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrophy((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setTrophy((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", trophy.title);
    formDataToSend.append("year", trophy.year);
    formDataToSend.append("times_won", trophy.times_won);
    formDataToSend.append("competition", trophy.competition);
    formDataToSend.append("description", trophy.description);
    if (trophy.photo instanceof File) {
      formDataToSend.append("photo", trophy.photo);
    }
    formDataToSend.append("_method", "PUT");

    try {
      const response = await instance.post(`/trophy/update/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
        console.error("Erreur de validation:", error.response.data);
      }
      console.error("Erreur lors de la modification:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
     <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/my_club/titres" className="text-red-700 hover:text-red-900">
            <IconArrowLeft size="1.2rem" />
          </Link>
          <h1 className="text-xl font-bold text-red-900">Modifier un Titre</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
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
            {/* Title */}
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
                className={`w-full px-3 py-2 border ${
                  error?.title ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Nom du Titre"
              />
              {error?.title && (
                <p className="text-red-600 text-sm">{error.title[0]}</p>
              )}
            </div>

            {/* Times Won */}
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
                className={`w-full px-3 py-2 border ${
                  error?.times_won ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Fois gagnées"
              />
              {error?.times_won && (
                <p className="text-red-600 text-sm">{error.times_won[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Year */}
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
                  className={`w-full px-3 py-2 border ${
                    error?.year ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Année de la victoire"
                />
                {error?.year && (
                  <p className="text-red-600 text-sm">{error.year[0]}</p>
                )}
              </div>

              {/* Competition */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaTrophy className="mr-2 text-red-500" />
                  Compétition
                </label>
                <input
                  type="text"
                  name="competition"
                  value={trophy.competition}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    error?.competition ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Nom de la compétition"
                />
                {error?.competition && (
                  <p className="text-red-600 text-sm">{error.competition[0]}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaInfoCircle className="mr-2 text-red-500" />
                Description
              </label>
              <textarea
                name="description"
                value={trophy.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-3 py-2 border ${
                  error?.description ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Décris le titre..."
              ></textarea>
              {error?.description && (
                <p className="text-red-600 text-sm">{error.description[0]}</p>
              )}
            </div>

            {/* Photo */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaImage className="mr-2 text-red-500" />
              Image
            </label>
            <div className="bg-gray-50 p-4 rounded-md">
              {trophy.photo && !(trophy.photo instanceof File) ? (
                <div className="relative mb-4">
                  <img
                    src={`http://localhost:8000/storage/${trophy.photo}`}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setTrophy((prev) => ({ ...prev, photo: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 16l4-4m0 0l4 4m-4-4v12M21 16l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                  <span className="text-xs text-gray-500 mt-1">Cliquer pour uploader</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}
              {error?.image && (
                <p className="text-red-600 text-sm mt-1">{error?.photo[0]}</p>
              )}
            </div>
          </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link
                to="/admin/my_club/titres"
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
              >
                {loading ? "Modification en cours..." : "Modifier le Titre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}