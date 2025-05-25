import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../../helpers/axios";
import { FaPlaneDeparture, FaHome, FaQuestionCircle, FaFutbol, FaHandshake, FaSquare, FaTrash, FaEdit, } from "react-icons/fa";
import { Tooltip, UnstyledButton } from "@mantine/core";
import {
  IconEdit,IconTrash} from "@tabler/icons-react";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";
import { IconArrowLeft } from "@tabler/icons-react";




const ShowMatch = () => {
  const { id } = useParams();
  const [matche, setMatche] = useState({});
  const [loading, setLoading] = useState(true);
  const [statistiques, setStatistique] = useState(null);
   const [selectedProduit, setSelectedProduit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    const getMatche = async () => {
      try {
        
        const response = await instance.get(`/matches/${id}`);
        setMatche(response.data.match);

        const statsResponse = await instance.get(`/matches/${id}/statistique`);
        setStatistique(statsResponse.data.stats);
        console.log(statsResponse.data.stats);
        console.log(statsResponse.data.message);

      } catch (error) {
        console.error("Erreur lors du chargement du match :", error);
      } finally {
        setLoading(false);
      }
    };
    getMatche();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await instance.delete(`/statistique-delete/${selectedProduit.id}`);
      const data = response.data.data ?? response.data;
      setSuccess(data.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      setStatistique(statistiques.filter((p) => p.id !== selectedProduit.id));
    } catch (err) {
      console.error("Error deleting news:", err);
      setError("Impossible de supprimer l'actualité.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

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
  <div className="min-h-screen bg-gray-100 py-10 px-4">
  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto transition-all duration-300">
  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
    {/* Club 1 */}
    <div className="text-center flex-1">
      <div className="w-24 h-24 bg-gray-100 border-2 border-gray-300 rounded-full overflow-hidden mx-auto shadow-sm">
        {matche.myclub?.logo && (
          <img
            src={`http://localhost:8000/storage/${matche.myclub.logo}`}
            alt="Logo My Club"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="font-bold text-lg text-gray-800 mt-2">{matche.myclub?.name}</h3>
      <div className="text-4xl font-bold text-red-700 mt-1">
        {matche.my_club_goals ?? "--"}
      </div>
    </div>

    {/* Score and Info */}
    <div className="text-center flex-1 space-y-3">
      <h1 className="text-3xl font-bold text-red-700">
        {matche.journée ? `Journée ${matche.journée}` : "Journée non définie"}
      </h1>
      <div className="bg-red-100 text-red-800 font-semibold py-2 px-4 rounded-xl shadow-sm inline-block">
        {matche.match_date || "Date Non définie"}
      </div>
      <div className="text-gray-600 text-sm">{matche.match_location || "Lieu non défini"}</div>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mt-1">
        Terrain :
        {matche.is_home === 0 || matche.is_home === "0" ? (
          <span className="flex items-center gap-1 font-semibold text-red-600">
            <FaPlaneDeparture /> Extérieur
          </span>
        ) : matche.is_home === 1 || matche.is_home === "1" ? (
          <span className="flex items-center gap-1 font-semibold text-red-600">
            <FaHome /> Domicile
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500">
            <FaQuestionCircle /> Inconnu
          </span>
        )}
      </div>

      {matche.aller_retour && (
        <div className="text-sm text-gray-700">
          Type : <span className="font-medium">{matche.aller_retour}</span>
        </div>
      )}
      <div className="text-xs text-gray-500">
        Statut : <span className="font-medium">{matche.status || "Non défini"}</span>
      </div>
    </div>

    {/* Club 2 */}
    <div className="text-center flex-1">
      <div className="w-24 h-24 bg-gray-100 border-2 border-gray-300 rounded-full overflow-hidden mx-auto shadow-sm">
        {matche.opponent?.logo && (
          <img
            src={`http://localhost:8000/storage/${matche.opponent.logo}`}
            alt="Logo Opponent"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="font-bold text-lg text-gray-800 mt-2">{matche.opponent?.name}</h3>
      <div className="text-4xl font-bold text-red-700 mt-1">
        {matche.opponent_club_goals ?? "--"}
      </div>
    </div>
  </div>

  {/* Modifier Match */}
  <div className="mt-10 text-center">
    <Link
      to={`/admin/edit-match/${id}`}
      className="inline-block bg-gradient-to-r from-red-500 to-red-800 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
    >
      MODIFIER LE MATCH
    </Link>
  </div>
</div>


  {/* Statistiques */}
  <div className="mt-12 max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
    <div className="bg-red-800 text-white text-lg font-bold px-6 py-4 flex items-center gap-4 mb-6">
       <Link to="/admin/my_club/matches" className="text-blue-700 hover:text-blue-900">
            <IconArrowLeft size="1.2rem" />
          </Link>
      Statistiques des Joueurs dans cette Match
    </div>
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
<table className="min-w-full text-sm text-gray-800">
  <thead className="bg-red-100 text-red-800 uppercase tracking-wider text-xs">
    <tr>
      <th className="px-6 py-3 text-left">Joueur</th>

      <th className="px-6 py-3 text-left">
        <div className="flex items-center gap-1">
          <FaFutbol className="text-green-600" />
          <span>Buts Marquer(minutes)</span>
        </div>
      </th>

      <th className="px-6 py-3 text-left">
        <div className="flex items-center gap-1">
          <FaHandshake className="text-blue-600" />
          <span>Passeur de but (nom & minutes)</span>
        </div>
      </th>

      <th className="px-6 py-3 text-left">
        <div className="flex items-center gap-1">
          <FaSquare className="text-yellow-400" />
          <span>Jaunes</span>
        </div>
      </th>

      <th className="px-6 py-3 text-left">
        <div className="flex items-center gap-1">
          <FaSquare className="text-red-600" />
          <span>Rouges</span>
        </div>
      </th>

      <th className="px-6 py-3 text-left">Action</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {statistiques?.length === 0 ? (
      <tr>
        <td colSpan="6" className="text-center px-6 py-4 text-gray-500">
          Aucune statistique trouvée
        </td>
      </tr>
    ) : (
      statistiques.map((stat) => (
        <tr key={stat.id} className="hover:bg-gray-50 transition duration-200">
          <td className="px-6 py-4">{stat.player?.name || "N/A"}</td>

          {/* الأهداف */}
         <td className="px-6 py-4">
            {stat.goals?.length > 0 ? (
              <>
                {stat.goals.length}
                <span className="text-gray-500 text-xs">
                  ({stat.goals.map((goal) => goal.minute).join(", ")}')
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-xs">Aucun but marqué</span>
            )}
          </td>

          {/* التمريرات */}
          <td className="px-6 py-4">
            {stat.goals?.some(g => g.assister) ? (
              <ul className="text-gray-500 text-xs list-disc pl-4 mt-1">
                {stat.goals
                  .filter(g => g.assister)
                  .map((goal, idx) => (
                    <li key={idx}>
                      {goal.assister?.name || "N/A"} — {goal.minute}'
                    </li>
                  ))}
              </ul>
            ) : (
              <span className="text-gray-500 text-xs">Aucune passe décisive</span>
            )}
          </td>

          <td className="px-6 py-4">{stat.yellow_cards || 0}</td>
          <td className="px-6 py-4">{stat.red_cards || 0}</td>

          {/* الأزرار */}
          <td className="px-6 py-4 flex gap-3 items-center">
               <Tooltip label="Supprimer">
                          <UnstyledButton className="!text-red-600 hover:!text-red-800" 
                              onClick={() => {
                             setSelectedProduit(stat);
                            setIsDeleteModalOpen(true);
                          }}
                          >
                            <IconTrash size="1.2rem" />
                          </UnstyledButton>
                </Tooltip>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
  </div>
  {isDeleteModalOpen && selectedProduit && (
              <DeleteConfirmation
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le statistique de« ${selectedProduit.player?.name} » ?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            )}
</div>

  );
};

export default ShowMatch;
