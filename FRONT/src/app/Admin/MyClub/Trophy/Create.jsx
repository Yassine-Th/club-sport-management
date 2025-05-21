import React, { useState } from "react";
import { Link } from "react-router-dom";
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

export default function TrophyForm() {
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [trophy, setTrophy] = useState({
    title: "",
    year: "",
    times_won: "",
    competition: "",
    description: "",
    photo: null,
  });

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
    formDataToSend.append("photo", trophy.photo);

    try {
      const response = await instance.post("/trophy-create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message);
      setError(null);
      setTrophy({
        title: "",
        year: "",
        times_won: "",
        competition: "",
        description: "",
        photo: null,
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
        console.error("Erreur de validation:", error.response.data);
      }
      console.error("Erreur lors de la création du titre:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 p-6">
  <div className="mb-6">
    <div className="flex items-center gap-4 mb-6">
      <Link to="/admin/my_club/titres" className="text-red-700 hover:text-red-900">
        <IconArrowLeft size="1.2rem" />
      </Link>
      <h1 className="text-xl font-bold text-red-900">Ajouter un Titre</h1>
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      {success && (
        <div
          className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md flex items-center"
          role="alert"
        >
          <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
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
        {/* جميع الحقول هنا تبقى كما هي بدون تغيير */}
        {/* ... */}

        {/* أزرار في الأسفل */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-3">
            <Link
              to="/admin/my_club/titres"
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </Link>

            <button
              type="button"
              onClick={() =>
                setTrophy({
                  title: "",
                  times_won: "",
                  year: "",
                  competition: "",
                  description: "",
                  photo: null,
                })
              }
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Réinitialiser
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Créer le Titre"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
}