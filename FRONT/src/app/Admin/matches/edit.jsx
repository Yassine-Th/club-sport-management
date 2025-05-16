import React, { useEffect, useState } from "react";
import { FaFutbol, FaMapMarkerAlt, FaCalendarAlt, FaFlagCheckered, FaBullseye, FaSortNumericUp } from "react-icons/fa";
import instance from "../../../helpers/axios";
import Select from 'react-select';
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const MatchEdit = () => {
    const [myclub, setMyclub] = useState(null)
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState({})
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState({
      my_club_id:"",
      opponent_club_id:"",
      match_date:"",
      match_location:"",
      is_home:"",
      my_club_goals:"",
      opponent_club_goals:"",
      journée:"",
      aller_retour:"",
      status:""
    })
      const { id } = useParams();
      const navigate = useNavigate();

       useEffect(() => {
    const getMatche = async () => {
      try {
        const response = await instance.get(`/matches-edit/${id}`);
        setMatch(response.data.match);
      } catch (error) {
        console.error("Erreur lors du chargement du match :", error);
      } finally {
        setLoading(false);
      }
    };
    getMatche();
  }, [id]);
    
    useEffect(() => {
    const getMyClub = async () => {
      try {
        const response = await instance.get('/myclub');
        setMyclub(response.data.myclub);
      } catch (error) {
        console.error(error);
      }
    };
    getMyClub();
  }, []);

   useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await instance.get("/clubs");
        setClubs(response.data.clubs);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setError("Impossible de charger les clubs.");
      }
    };
    fetchClubs();
  }, []);

  const clubOptions = clubs?.map(club => ({
  value: club.id,
  label: (
    <div className="flex items-center gap-2">
      <img
        src={`http://localhost:8000/storage/${club.logo}`}
        alt={club.name}
        className="w-6 h-6 rounded-full object-cover"
      />
      <span>{club.name}</span>
    </div>
  ),
}));



  const handleChange = (e) => {
    setMatch({ ...match, [e.target.name]: e.target.value });
  };



 const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("my_club_id", myclub?.id);
    formDataToSend.append("opponent_club_id", match.opponent_club_id);
    formDataToSend.append("match_date", match.match_date || "");
    formDataToSend.append("match_location", match.match_location || "" );
    formDataToSend.append("is_home", match.is_home || "");
    formDataToSend.append("my_club_goals", match.my_club_goals || "");
    formDataToSend.append("opponent_club_goals", match.opponent_club_goals || "");
    formDataToSend.append("journée", match.journée || "");
    formDataToSend.append("aller_retour", match.aller_retour || "");
    formDataToSend.append("status", match.status || "");
    formDataToSend.append("_method", "PUT")


    try {
      const response = await instance.post(`/matches/update/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setError(null)
      navigate('/admin/my_club/matches')
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
        console.error("Erreur de validation:", error.response.data);
      }
      console.error("Erreur lors de la création de l'actualité:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }


   if (!match)
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
 <div className="min-h-screen bg-gray-50 p-6">
  <div className="mb-6">
     <div className="flex items-center gap-4 mb-6">
               <Link to="/admin/my_club/matches" className="text-red-700 hover:text-red-900">
                 <IconArrowLeft size="1.2rem" />
               </Link>
               <h1 className="text-xl font-bold text-red-900">Ajouter un Matche</h1>
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
      {/* Équipe et Adversaire */}
     <div>
  <label className="text-sm font-semibold text-gray-800 mb-2 block">
    Sélectionner l'équipe et l'adversaire
  </label>

  <div className="flex flex-col md:flex-row items-center gap-4">
    {/* Club utilisateur (non modifiable) */}
    <div className="w-full md:w-1/2">
      <label className="text-xs text-gray-600 mb-1 block">Votre équipe</label>
      <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          disabled
        >
          {myclub && <option>{myclub.name}</option>}
      </select>
      {error?.my_club_id && (
        <p className="text-red-600 text-sm mt-1">{error.my_club_id[0]}</p>
      )}
    </div>

    {/* Icône */}
    <FaFlagCheckered className="text-2xl text-red-500 mt-6 md:mt-0" />

    {/* Sélection de l'adversaire */}
    <div className="w-full md:w-1/2">
      <label className="text-xs text-gray-600 mb-1 block">Adversaire</label>
      <Select
        name="opponent_club_id"
        onChange={(selectedOption) =>
          handleChange({ target: { name: "opponent_club_id", value: selectedOption.value } })
        }
        value={clubOptions.find((c) => c.value === match.opponent_club_id)}
        options={clubOptions}
        placeholder="Choisissez l'adversaire"
              />
      {error?.opponent_club_id && (
        <p className="text-red-600 text-sm mt-1">{error.opponent_club_id[0]}</p>
      )}
    </div>
  </div>
</div>

      {/* Date et Lieu */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="mr-2 text-red-500" />
            Date et heure du match
          </label>
          <input
            type="datetime-local"
            name="match_date"
            onChange={handleChange}
            value={match.match_date}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
            {error?.datetime && (
                <p className="text-red-600 text-sm">{error.datetime[0]}</p>
              )}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            Lieu du match
          </label>
          <input
            type="text"
            name="match_location"
            onChange={handleChange}
            value={match.match_location}
            placeholder="Exemple : Stade Mohammed V"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
           {error?.match_location && (
                <p className="text-red-600 text-sm">{error.match_location[0]}</p>
              )}
        </div>
      </div>

      {/* Score */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FaBullseye className="mr-2 text-red-500" />
            Buts de mon équipe
          </label>
          <input
            type="number"
            name="my_club_goals"
            onChange={handleChange}
            value={match.my_club_goals}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Exemple : 2"
          />
          {error?.my_club_goals && (
                <p className="text-red-600 text-sm">{error.my_club_goals[0]}</p>
              )}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FaBullseye className="mr-2 text-red-500" />
            Buts de l’adversaire
          </label>
          <input
            type="number"
            name="opponent_club_goals"
            onChange={handleChange}
            value={match.opponent_club_goals}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Exemple : 1"           
          />
           {error?.opponent_club_goals && (
                <p className="text-red-600 text-sm">{error.opponent_club_goals[0]}</p>
              )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
      {/* Match à domicile ou à l’extérieur */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Type de match</label>
        <select name="is_home" onChange={handleChange} value={match.is_home} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">Sélectionner...</option>
          <option value={1}>À domicile</option>
          <option value={0}>À l'extérieur</option>
        </select>
         {error?.is_home && (
                <p className="text-red-600 text-sm">{error.is_home[0]}</p>
              )}
      </div>

       <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FaSortNumericUp className="mr-2 text-red-500" />
            Journée 
          </label>
          <input
            type="number"
            name="journée"
            onChange={handleChange}
            value={match.journée}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Exemple : 2"          
          />
            {error?.journée && (
                <p className="text-red-600 text-sm">{error.journée[0]}</p>
              )}
        </div>


      </div>

       <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Aller Retour</label>
        <select name="aller_retour" onChange={handleChange} value={match.aller_retour} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="" >Choisire Aller ou Retour</option>
          <option value="aller" >Aller</option>
          <option value="retour">Retour</option>
        </select>
         {error?.aller_retour && (
                <p className="text-red-600 text-sm">{error.aller_retour[0]}</p>
              )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
        <select name="status" onChange={handleChange} value={match.status} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="" >Choisire le status de matche</option>
          <option value="venir" >A venir</option>
          <option value="terminée">Terminée</option>
          <option value="reportée">Reportée</option>
        </select>
         {error?.status && (
                <p className="text-red-600 text-sm">{error.status[0]}</p>
              )}
      </div>


      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-end gap-3 pt-4 border-t">
         <Link
                to="/admin/my_club/matches"
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
        </Link>
        <button
          type="submit"
          className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition"
        >
          Enregistrer le match
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default MatchEdit;
