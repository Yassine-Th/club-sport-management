import React from "react";
import { useState } from "react";
import { getUserInfo } from "../../../helpers/access_token";
import instance from "../../../helpers/axios";
import { Link } from "react-router-dom";
import { FaImage, FaHeading, FaThLarge, FaInfoCircle } from "react-icons/fa";
import {
  IconArrowLeft,
} from "@tabler/icons-react";

const CreateNew = () => {
  const user = getUserInfo();
  const user_id = user.id;

  const [formData, setFormData] = useState({
    author_id: user_id,
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("author_id", formData.author_id);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("image", formData.image);
    try {
      const response = await instance.post("/news-create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message);
      setInterval(() => {
        setSuccess("");
      }, 3000);
      setError(null);
      setFormData({
        author_id: user_id,
        title: "",
        content: "",
        category: "",
        image: null,
      });
      document.getElementById("imgInput").value = "";
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
        console.error("Erreur de validation:", error.response.data);
      }
      console.error("Erreur lors de la création de l'actualité:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
         <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/news" className="text-red-700 hover:text-red-900">
              <IconArrowLeft size="1.2rem"  />
          </Link>
          <h1 className="text-xl font-bold text-red-900">Ajouter un News</h1>
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
                <FaHeading className="mr-2 text-red-500" />
                Titre
              </label>
              <input
                type="text"
                name="title"
                value={formData?.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error?.title ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Titre de l'actualité"
              />
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
          )}{success && (
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
          )}{success && (
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
          )}{success && (
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
          )}{success && (
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
            </div>

            {/* Content */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaInfoCircle className="mr-2 text-red-500" />
                Contenu
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                className={`w-full px-3 py-2 border ${
                  error?.content ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Décris l'actualité..."
              ></textarea>
              {error?.content && (
                <p className="text-red-600 text-sm">{error.content[0]}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FaThLarge className="mr-2 text-red-500" />
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error?.category ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              >
                <option value="">Choisir une catégorie</option>
                <option value="match">Match</option>
                <option value="transfer">Transfert</option>
                <option value="club">Club</option>
                <option value="other">Autre</option>
              </select>
              {error?.category && (
                <p className="text-red-600 text-sm">{error.category[0]}</p>
              )}
            </div>

            {/* Image */}
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
                      htmlFor="imgInput"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
                    >
                      <span>Télécharger un fichier</span>
                      <input id="imgInput" name="image" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                </div>
              </div>
              {formData.image && (
                <p className="mt-2 text-sm text-gray-600">Fichier sélectionné: {formData.image.name}</p>
              )}
              {error?.image && (
                <p className="text-red-600 text-sm">{error.image[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
               <Link to="/admin/news" className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
                  Annuler
               </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
              >
                {loading ? "Création en cours..." : "Créer l'actualité"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNew;