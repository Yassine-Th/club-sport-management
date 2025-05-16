import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaImage,
  FaFutbol,
  FaRunning,
  FaTag,
} from "react-icons/fa";
import { IconArrowLeft } from "@tabler/icons-react";
import instance from "../../../helpers/axios";
import { useParams } from "react-router-dom";

export default function ClubsEdit() {
  const { id } = useParams();
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [clubs, setClubs] = useState({
    name: "",
    founded: "",
    coach_name: "",
    logo: null,
  });

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setFetchLoading(true);
        const response = await instance.get(`/clubs-edit/${id}`);
        setClubs(response.data.club);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchClubs();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubs((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setClubs((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("name", clubs.name);
    formDataToSend.append("founded", clubs.founded);
    formDataToSend.append("coach_name", clubs.coach_name);
   if (clubs.logo instanceof File) {
      formDataToSend.append("logo", clubs.logo);
    }

    formDataToSend.append("_method", "PUT"); // Laravel doesn't accept PUT directly with FormData

    try {
      const response = await instance.post(`/clubs/update/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message);
      setError(null);
      setClubs({
        name: "",
        founded: "",
        coach_name: "",
        logo: null,
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
        console.error("Erreur de validation:", error.response.data);
      }
      console.error("Erreur lors de la création du club:", error);
    } finally {
      setLoading(false);
    }
  };

   if (fetchLoading)
    return (
       <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );

    if (!clubs)
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
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clubs" className="text-red-700 hover:text-red-900">
            <IconArrowLeft size="1.2rem" />
          </Link>
          <h1 className="text-xl font-bold text-red-900">Modifier un Club</h1>
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
            {/* Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaTag className="mr-2 text-red-500" />
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={clubs.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error?.name ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Nom du club"
              />
              {error?.name && (
                <p className="text-red-600 text-sm">{error.name[0]}</p>
              )}
            </div>

            {/* Founded */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="mr-2 text-red-500" />
                Année de Fondation
              </label>
              <input
                type="number"
                name="founded"
                value={clubs.founded}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error?.founded ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Année de Fondation"
              />
              {error?.founded && (
                <p className="text-red-600 text-sm">{error.founded[0]}</p>
              )}
            </div>

            {/* Coach Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaRunning className="mr-2 text-red-500" />
                Nom de l'entraîneur
              </label>
              <input
                type="text"
                name="coach_name"
                value={clubs.coach_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error?.coach_name ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Nom de l'entraîneur"
              />
              {error?.coach_name && (
                <p className="text-red-600 text-sm">{error.coach_name[0]}</p>
              )}
            </div>

            {/* Logo */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FaImage className="mr-2 text-red-500" />
              Image
            </label>
            <div className="bg-gray-50 p-4 rounded-md">
              { clubs.logo && !(clubs.logo instanceof File) ? (
                <div className="relative mb-4">
                  <img
                    src={`http://localhost:8000/storage/${clubs.logo}`}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setClubs((prev) => ({ ...prev, logo: null }));
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
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
              {error?.logo && (
                <p className="text-red-600 text-sm mt-1">{error.logo[0]}</p>
              )}
            </div>
          </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link
                to="/admin/clubs"
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
              >
                {loading ? "modification en cours..." : "Modifier un club"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}