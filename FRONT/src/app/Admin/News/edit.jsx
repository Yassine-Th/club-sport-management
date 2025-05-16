import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../../helpers/axios";
import { Link } from "react-router-dom";
import { FaImage, FaHeading, FaThLarge, FaInfoCircle } from "react-icons/fa";
import {
  IconArrowLeft,
} from "@tabler/icons-react";

const EditNew = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState({});

  // Fetch news data on load
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setFetchLoading(true);
        const response = await instance.get(`/news/${id}`);
        setNews(response.data.news);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNews({ ...news, image: files[0] });
    } else {
      setNews({ ...news, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("author_id", news.author_id);
    formDataToSend.append("title", news.title);
    formDataToSend.append("content", news.content);
    formDataToSend.append("category", news.category);

    if (news.image instanceof File) {
      formDataToSend.append("image", news.image);
    }

    formDataToSend.append("_method", "PUT"); // Laravel doesn't accept PUT directly with FormData

    try {
      setLoading(true);
      const response = await instance.post(`/news/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(response.data.message);
      setError({});
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(err.response.data.errors || {});
        console.error("Erreur de validation :", err.response.data);
      } else {
        console.error("Erreur lors de la mise à jour :", err);
      }
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
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
           <Link to="/admin/news" className="text-red-700 hover:text-red-900">
              <IconArrowLeft size="1.2rem"  />
          </Link>
          <h1 className="text-xl font-bold text-red-900">Modifier l'actualité</h1>
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
                value={news.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error.title ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Titre de l'actualité"
              />
              {error?.title && (
                <p className="text-red-600 text-sm">{error.title[0]}</p>
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
                value={news.content}
                onChange={handleChange}
                rows={5}
                className={`w-full px-3 py-2 border ${
                  error.content ? "border-red-500" : "border-gray-300"
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
                value={news.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  error.category ? "border-red-500" : "border-gray-300"
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
  <div className="bg-gray-50 p-4 rounded-md">
    {news.image && !(news.image instanceof File) ? (
      <div className="relative mb-4">
        <img
          src={`http://localhost:8000/storage/${news.image}`}
          alt="Preview"
          className="w-full h-48 object-cover rounded-md"
        />
        <button
          type="button"
          onClick={() => {
            setNews((prev) => ({ ...prev, image: null }));
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
    {error.image && (
      <p className="text-red-600 text-sm mt-1">{error.image[0]}</p>
    )}
  </div>
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
                {loading ? "Mise à jour en cours..." : "Mettre à jour l'actualité"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNew;