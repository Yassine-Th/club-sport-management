import React, { useState,useEffect } from 'react';
import {
  FaFutbol, FaUser, FaBullseye, FaHandsHelping,
  FaSquare, FaStopwatch, FaPlus, FaTrash
} from 'react-icons/fa';
import instance from '../../../../helpers/axios';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from 'react-router-dom';

const CreateStatistique = () => {
  
  const [players, setPlayers] = useState([]);
  const { id } = useParams();
  const [match, setMatch] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const emptyForm = {
  match_id: id,
  player_id: '',
  goals_count: '',
  assists_count: '',
  yellow_cards: '',
  red_cards: '',
  goals: []
};
  const [forms, setForms] = useState([{ ...emptyForm }]);


   useEffect(() => {
      fetchPlayers();
    }, []);
  
    const fetchPlayers = async () => {
      setLoadingPlayers(true);
      try {
        const response = await instance.get("/players");
        setPlayers(response.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement des joueurs:", err);
      } finally{
        setLoadingPlayers(false);
      }
    };

     useEffect(() => {
    const getMatche = async () => {
      setLoadingMatch(true);
      try {
        const response = await instance.get(`/matches/${id}`);
        setMatch(response.data.match);
      } catch (error) {
        console.error("Erreur lors du chargement du match :", error);
      } finally {
        setLoadingMatch(false);
      }
    };

    getMatche();
  }, [id]);

     const playerOptions = players?.map(player => ({
        value: player.id,
        label: (
          <div className="flex items-center gap-2">
            <img
              src={`http://localhost:8000/storage/${player.photo}`}
              alt={player.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{player.name}</span>
          </div>
        ),
      }));

  const handleChange = (index, e) => {
    const updatedForms = [...forms];
    const { name, value } = e.target;

    if (name === 'goals_count') {
      const goals = parseInt(value) || 0; 
      updatedForms[index][name] = value;
      updatedForms[index].goals = Array.from({ length: goals }, () => ({ minute: '', assist_player: '' }));
    } else {
      updatedForms[index][name] = value;
    }

    setForms(updatedForms);
  };

  const handleGoalChange = (formIndex, goalIndex, field, value) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].goals[goalIndex][field] = value;
    setForms(updatedForms);
  };

  const addNewForm = () => {
    setForms([...forms, { ...emptyForm }]);
  };

  const removeForm = (indexToRemove) => {
    const updatedForms = forms.filter((_, index) => index !== indexToRemove);
    setForms(updatedForms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', forms);
    setLoading(true);
    setErrorMessage('');
    const totalGoalsInForm = forms.reduce((acc, player) => acc + Number(player.assists_count), 0);
  
  if (totalGoalsInForm > match.my_club_goals) {
    setErrorMessage("Le nombre de Assiste est supérieur au nombre de buts marqués par votre équipe !");
    return;
  }

  const totalAsisteInForm = forms.reduce((acc, player) => acc + Number(player.goals_count), 0);
  
  if (totalAsisteInForm > match.my_club_goals) {
    setErrorMessage("Le nombre de buts marqués est supérieur au nombre de buts marqués par votre équipe !");
    return;
  }

 const ids = forms.map(p => p.player_id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size < ids.length) {
    setErrorMessage("Un joueur ne peut pas être sélectionné plusieurs fois dans la méme statistique!");
    return;
  }

   for (let player of forms) {
    for (let goal of player.goals) {
      if (goal.assist_player && goal.assist_player === player.player_id) {
        setErrorMessage(`Un joueur ${player.player_id} ne peut pas marquer et faire une passe décisive en même temps !`)
        return;
      }
    }
  }

   
    try {
      const response = await instance.post('/statistiques', forms, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data.message);
      setSuccessMessage(response.data.message);
      setInterval(() => {
        setSuccessMessage('');
      }, 3000);
      setErrorMessage('');
      setErrors({});
      setForms([{ ...emptyForm }]);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error('Erreur de validation:', error.response.data);
        setErrors(error.response.data.details);
        setErrorMessage('Veuillez corriger les erreurs ci-dessus.');
      }
      console.error('Erreur lors de l’envoi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlayers || loadingMatch) {
    return (
     <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className='flex items-center gap-4 mb-6'>
          <Link to="/admin/my_club/matches" className="text-red-700 hover:text-red-900">
            <IconArrowLeft size="1.2rem" />
          </Link>
          <h1 className="text-xl font-bold text-red-900 mb-4">Ajouter des Statistiques</h1>
        </div>
         {successMessage && <p className="text-green-600 font-semibold mb-2">{successMessage}</p>}
{(errorMessage || Object.keys(errors).length > 0) && (
  <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
    <p className="font-bold mb-2">⚠️ Erreurs détectées :</p>

    {/* عرض رسالة الخطأ العامة */}
    {errorMessage && (
      <p className="mb-3">❌ {errorMessage}</p>
    )}

    {/* عرض أخطاء الحقول المرتبطة بكل لاعب */}
    <ul className="space-y-3">
      {Object.entries(errors).map(([formIndex, fieldErrors]) => (
        <li key={formIndex}>
          <p className="font-semibold">🔢 Formulaire du joueur #{parseInt(formIndex) + 1} :</p>
          <ul className="list-disc list-inside ml-4">
            {Object.entries(fieldErrors).map(([field, messages]) =>
              messages.map((msg, i) => (
                <li key={`${formIndex}-${field}-${i}`}>{msg}</li>
              ))
            )}
          </ul>
        </li>
      ))}
    </ul>
  </div>
)}
 {/* معلومات المباراة */}
                  <div className="bg-white rounded-sm shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      {/* Club 1 */}
                      <div className="text-center mb-4 md:mb-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2 border">
                          {match.myclub?.logo && (
                            <img
                              src={`http://localhost:8000/storage/${match.myclub.logo}`}
                              alt="Logo Club 1"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="text-sm">{match.myclub?.name}</p>
                      </div>

                      {/* Match Info */}
                      <div className="text-center mb-4 md:mb-0">
                        <p className="text-xs text-gray-500">N° {match.journée || "-"}</p>
                        <p className="text-lg font-bold text-red-700">
                          {`${match.my_club_goals || 0} - ${match.opponent_club_goals || 0}`}
                        </p>
                        <p className="text-sm text-gray-600">{match.status}</p>
                      </div>

                      {/* Club 2 */}
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2 border">
                          {match.opponent?.logo && (
                            <img
                              src={`http://localhost:8000/storage/${match.opponent.logo}`}
                              alt="Logo Club 2"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="text-sm">{match.opponent?.name}</p>
                      </div>
                    </div>
                  </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`grid gap-6 ${forms.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {forms.map((form, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow rounded-lg p-6 relative"
              >
                <button
                  type="button"
                  onClick={() => removeForm(index)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-lg"
                  title="Supprimer"
                >
                  <FaTrash />
                </button>

                <h2 className="text-lg font-semibold text-red-700 mb-4">
                  Statistique #{index + 1}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-sm shadow-lg p-6 mb-6 w-full col-span-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      <FaUser className="inline mr-2 text-gray-600" /> Joueur
                    </label>
                    <div className="w-full">
                      <Select
                        name="player_id"
                        className="w-full"
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          handleChange(index, {
                            target: { name: 'player_id', value: selectedOption.value },
                          })
                        }
                        value={playerOptions.find((c) => c.value === form.player_id)}
                        options={playerOptions}
                        placeholder="Choisissez le joueur"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      <FaBullseye className="inline mr-2 text-gray-600" /> But
                    </label>
                    <input
                      type="number"
                      name="goals_count"
                      value={form.goals_count}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      placeholder='number de buts'
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      <FaHandsHelping className="inline mr-2 text-gray-600" /> Assist (nombre)
                    </label>
                    <input
                      type="number"
                      name="assists_count"
                      value={form.assists_count}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      placeholder='number de assists'
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      <FaSquare className="inline mr-2 text-yellow-500" /> Carton Jaune
                    </label>
                    <input
                      type="number"
                      name="yellow_cards"
                      value={form.yellow_cards}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      max="2"
                      placeholder="Nombre de cartons jaunes"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      <FaSquare className="inline mr-2 text-red-600" /> Carton Rouge
                    </label>
                    <input
                      type="number"
                      name="red_cards"
                      value={form.red_cards}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      max="1"
                      placeholder="Nombre de cartons rouges"
                    />
                  </div>

                  <div className="md:col-span-2">
                    {form.goals.map((goal, goalIndex) => (
                      <div
                        key={goalIndex}
                        className="mb-4 p-4 border rounded-md bg-gray-50"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              <FaStopwatch className="inline mr-2 text-gray-600" />
                              Minute du but #{goalIndex + 1}
                            </label>
                            <input
                              type="number"
                              value={goal.minute}
                              onChange={(e) =>
                                handleGoalChange(index, goalIndex, 'minute', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder='Minute du but'
                            />
                          </div>

                          <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              <FaUser className="inline mr-2 text-blue-600" />
                              Joueur qui a assisté #{goalIndex + 1}
                            </label>
                             <Select
                                name="assist_player"
                                onChange={(selectedOption) =>
                                  handleGoalChange(index, goalIndex, 'assist_player', selectedOption.value)
                                }
                                value={playerOptions.find((c) => c.value === goal.assist_player)}
                                options={playerOptions}
                                placeholder="Choisissez l'assistant"
                              />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={addNewForm}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"
            >
              <FaPlus /> Ajouter une autre statistique
            </button>
            <button
              type="submit"
              className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Enregistrement en cours..." : "Enregistrer les Statistiques"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStatistique;
