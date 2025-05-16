import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../../helpers/axios";
import { FaPlaneDeparture, FaHome, FaQuestionCircle } from "react-icons/fa";

const ShowMatch = () => {
  const { id } = useParams();
  const [matche, setMatche] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMatche = async () => {
      try {
        
        const response = await instance.get(`/matches/${id}`);
        setMatche(response.data.match);
      } catch (error) {
        console.error("Erreur lors du chargement du match :", error);
      } finally {
        setLoading(false);
      }
    };

    getMatche();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }


   if (!matche)
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
          <h3 className="text-lg font-semibold text-gray-800">Matche non trouvée</h3>
          <p className="mt-2 text-gray-600">Impossible de charger les détails de cette Matche.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Club 1 */}
          <div className="text-center mb-6 md:mb-0">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2 border border-gray-300">
              {matche.myclub?.logo && (
                <img
                  src={`http://localhost:8000/storage/${matche.myclub.logo}`}
                  alt="Logo My Club"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-800">
              {matche.myclub?.name}
            </h3>
          </div>

          {/* Match Info */}
          <div className="text-center mb-6 md:mb-0">
            <div className="bg-red-100 rounded-lg px-6 py-3 mb-2">
              <div className="text-xl font-bold text-red-700">
                {matche.match_date || "Date Non défini"}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {matche.match_location || "Lieu non défini"}
            </div>

            {/* is_home */}
         <div className="mt-1 text-sm text-gray-700 flex items-center justify-center gap-1">
            Terrain du match :{" "}
            <span className="font-semibold flex items-center gap-1">
                {matche.is_home === 0 || matche.is_home === "0" ? (
                <>
                    <FaPlaneDeparture className="text-red-600 text-2xl"/> À l'extérieur
                </>
                ) : matche.is_home === 1 || matche.is_home === "1" ? (
                <>
                    <FaHome className="text-red-600 text-2xl" /> À domicile
                </>
                ) : (
                <>
                    <FaQuestionCircle className="text-red-500 text-2xl" /> Non défini
                </>
                )}
            </span>
            </div>

            {/* aller_retour */}
            {matche.aller_retour && (
              <div className="mt-1 text-sm text-gray-700">
                Type : <span className="font-medium">{matche.aller_retour}</span>
              </div>
            )}

            <div className="mt-1 text-xs text-gray-500">
              Statut :{" "}
              <span className="font-medium">{matche.status || "Status Non défini"}</span>
            </div>
          </div>

          {/* Club 2 */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2 border border-gray-300">
              {matche.opponent?.logo && (
                <img
                  src={`http://localhost:8000/storage/${matche.opponent.logo}`}
                  alt="Logo Opponent"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h3 className="font-semibold text-lg text-gray-800">
              {matche.opponent?.name}
            </h3>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to={`/admin/edit-match/${id}`}
            className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-full font-semibold hover:shadow-md transition duration-300"
          >
            MODIFIER LE MATCH
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowMatch;
