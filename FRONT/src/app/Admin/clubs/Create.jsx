import React, { useState } from "react";
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

export default function ClubsForm() {
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState({
    name: "",
    founded: "",
    coach_name: "",
    logo: null,
  });

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
    formDataToSend.append("logo", clubs.logo);

    try {
      const response = await instance.post("/clubs-create", formDataToSend, {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clubs" className="text-red-700 hover:text-red-900">
            <IconArrowLeft size="1.2rem" />
          </Link>
          <h1 className="text-xl font-bold text-red-900">Ajouter un Club</h1>
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
                Logo
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
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF jusqu'à 10MB
                  </p>
                </div>
              </div>
              {clubs.logo && (
                <p className="mt-2 text-sm text-gray-600">
                  Fichier sélectionné: {clubs.logo.name}
                </p>
              )}
              {error?.logo && (
                <p className="text-red-600 text-sm">{error.logo[0]}</p>
              )}
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
                {loading ? "Création en cours..." : "Créer un club"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}