import React, { useEffect, useState, useCallback } from "react";
import {
  FaFutbol,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFlagCheckered,
  FaBullseye,
  FaSortNumericUp,
  FaUser,
  FaClock,
} from "react-icons/fa";
// Assuming you have card icons, e.g., from react-icons or Tabler
import {
  IconRectangle as IconCardYellow,
  IconRectangleFilled as IconCardRed,
  IconPlus as IconAdd,
  IconTrash as IconRemove,
} from "@tabler/icons-react";

import instance from "../../../helpers/axios";
import Select from "react-select";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

const MatchEdit = () => {
  const [myclub, setMyclub] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [myClubPlayers, setMyClubPlayers] = useState([]);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState({
    my_club_id: "",
    opponent_club_id: "",
    match_date: "",
    match_location: "",
    is_home: "",
    my_club_goals: "",
    opponent_club_goals: "",
    journée: "",
    aller_retour: "",
    status: "",
  });
  const [myClubGoalDetails, setMyClubGoalDetails] = useState([]);
  const [cardEvents, setCardEvents] = useState([]); // NEW: State for card events

  const isMatchScoreable = useCallback(() => {
    // ... (isMatchScoreable function remains the same)
    if (match.status === "terminée") return true;
    if (!match.match_date) return false;
    try {
      const matchDate = new Date(match.match_date);
      const now = new Date();
      return matchDate < now;
    } catch (e) {
      return false;
    }
  }, [match.match_date, match.status]);

  useEffect(() => {
    /* ... getMyClubData (fetches myclub and players) ... */
    const getMyClubData = async () => {
      try {
        const clubResponse = await instance.get("/myclub");
        setMyclub(clubResponse.data.myclub);
        if (clubResponse.data.myclub && clubResponse.data.myclub.id) {
          setMatch((prev) => ({
            ...prev,
            my_club_id: prev.my_club_id || clubResponse.data.myclub.id,
          }));
          const playersResponse = await instance.get(
            `/players`
          ); // Pass club_id
          setMyClubPlayers(playersResponse.data.data || []); // Assuming data is in .players
        }
      } catch (err) {
        console.error("Error fetching MyClub or players:", err);
      }
    };
    getMyClubData();
  }, []);

  useEffect(() => {
    /* ... fetchClubs ... */
    const fetchClubs = async () => {
      try {
        const response = await instance.get("/clubs");
        setClubs(response.data.clubs);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError((prev) => ({
          ...prev,
          clubs: "Impossible de charger les clubs.",
        }));
      }
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    /* ... getMatchData (fetches existing match) ... */
    const getMatchData = async () => {
      setInitialLoading(true);
      try {
        const response = await instance.get(`/matches-edit/${id}`);
        const fetchedMatch = response.data.match;

        let formattedMatchDate = "";
        if (fetchedMatch.match_date) {
          const d = new Date(fetchedMatch.match_date);
          if (!isNaN(d.valueOf())) {
            const pad = (num) => (num < 10 ? "0" + num : num);
            formattedMatchDate = `${d.getFullYear()}-${pad(
              d.getMonth() + 1
            )}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          }
        }

        setMatch({
          id: fetchedMatch.id,
          my_club_id: fetchedMatch.my_club_id || myclub?.id || "",
          opponent_club_id: fetchedMatch.opponent_club_id || "",
          match_date: formattedMatchDate,
          match_location: fetchedMatch.match_location || "",
          is_home:
            fetchedMatch.is_home !== null ? String(fetchedMatch.is_home) : "",
          my_club_goals:
            fetchedMatch.my_club_goals !== null
              ? String(fetchedMatch.my_club_goals)
              : "",
          opponent_club_goals:
            fetchedMatch.opponent_club_goals !== null
              ? String(fetchedMatch.opponent_club_goals)
              : "",
          journée:
            fetchedMatch.journée !== null ? String(fetchedMatch.journée) : "",
          aller_retour: fetchedMatch.aller_retour || "",
          status: fetchedMatch.status || "",
        });

        if (
          fetchedMatch.my_club_goal_details &&
          Array.isArray(fetchedMatch.my_club_goal_details)
        ) {
          setMyClubGoalDetails(
            fetchedMatch.my_club_goal_details.map((detail) => ({
              scorer_id: detail.scorer_id || "",
              assister_id: detail.assister_id || "",
              minute: detail.minute || "",
            }))
          );
        } else {
          setMyClubGoalDetails([]);
        }

        // NEW: Initialize card events from fetched data
        if (
          fetchedMatch.card_events &&
          Array.isArray(fetchedMatch.card_events)
        ) {
          setCardEvents(
            fetchedMatch.card_events.map((event) => ({
              player_id: event.player_id || "",
              card_type: event.card_type || "",
            }))
          );
        } else {
          setCardEvents([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du match :", err);
        setError((prev) => ({
          ...prev,
          form: "Impossible de charger les détails du match.",
        }));
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) {
      getMatchData();
    }
  }, [id]); // Removed myclub dependency

  useEffect(() => {
    /* ... useEffect for my_club_goals, match.status, match.match_date to update goal/card details ... */
    if (!initialLoading && match.id) {
      const scoreable = isMatchScoreable();
      if (scoreable) {
        const numGoals = parseInt(match.my_club_goals, 10);
        if (!isNaN(numGoals) && numGoals >= 0) {
          setMyClubGoalDetails((currentDetails) => {
            const newDetails = Array(numGoals)
              .fill(null)
              .map((_, index) => {
                return (
                  currentDetails[index] || {
                    scorer_id: "",
                    assister_id: "",
                    minute: "",
                  }
                );
              });
            return newDetails;
          });
        } else if (match.my_club_goals === "") {
          setMyClubGoalDetails([]);
        }
        // Card events state (cardEvents) is now independent of numGoals but depends on scoreable.
        // It's populated from fetched data and can be modified by user actions.
      } else {
        setMyClubGoalDetails([]);
        setCardEvents([]); // Clear card events if match is not scoreable
      }
    }
  }, [
    match.my_club_goals,
    match.status,
    match.match_date,
    initialLoading,
    match.id,
    isMatchScoreable,
  ]);

  const clubOptions =
    clubs?.map((club) => ({
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
    })) || [];
  const playerOptionsForGoals = [
    { value: "own_goal", label: "But Contre Son Camp (CSC Adversaire)" },
    ...(myClubPlayers?.map((p) => ({ value: p.id, label: p.name })) || []),
  ];
  const assisterOptions = [
    { value: "", label: "Aucune passe décisive" },
    ...(myClubPlayers?.map((p) => ({ value: p.id, label: p.name })) || []),
  ];
  const playerOptionsForCards =
    myClubPlayers?.map((player) => ({
      value: player.id,
      label: player.name,
    })) || [];
  const cardTypeOptions = [
    {
      value: "yellow",
      label: (
        <div className="flex items-center text-sm">
          <IconCardYellow
            className="mr-2 text-yellow-500"
            size="1.1rem"
            stroke={1.5}
          />
          Jaune
        </div>
      ),
    },
    {
      value: "red",
      label: (
        <div className="flex items-center text-sm">
          <IconCardRed
            className="mr-2 text-red-600"
            size="1.1rem"
            stroke={1.5}
          />
          Rouge
        </div>
      ),
    },
  ];

  const handleChange = (e) => {
    /* ... */
    const { name, value } = e.target;
    setMatch((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalDetailChange = (index, field, selectedOptionOrEvent) => {
    /* ... */
    const value = selectedOptionOrEvent?.target
      ? selectedOptionOrEvent.target.value
      : selectedOptionOrEvent?.value;
    const updatedGoalDetails = [...myClubGoalDetails];
    updatedGoalDetails[index] = {
      ...updatedGoalDetails[index],
      [field]: value,
    };
    if (field === "scorer_id" && value === "own_goal") {
      updatedGoalDetails[index].assister_id = "";
    }
    setMyClubGoalDetails(updatedGoalDetails);
  };

  // Card Event Handlers (same as MatchForm)
  const handleAddCardEvent = () => {
    setCardEvents([...cardEvents, { player_id: "", card_type: "" }]);
  };
  const handleRemoveCardEvent = (index) => {
    setCardEvents(cardEvents.filter((_, i) => i !== index));
  };
  const handleCardEventChange = (index, field, selectedOptionOrEvent) => {
    const value = selectedOptionOrEvent?.target
      ? selectedOptionOrEvent.target.value
      : selectedOptionOrEvent?.value;
    const updatedCardEvents = [...cardEvents];
    updatedCardEvents[index] = { ...updatedCardEvents[index], [field]: value };
    setCardEvents(updatedCardEvents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError({});
    setSuccess(null);

    const formDataToSend = new FormData();
    // Append main match data
    Object.keys(match).forEach((key) => {
      // Exclude details arrays, they are handled separately
      if (
        key !== "my_club_goals" &&
        key !== "opponent_club_goals" &&
        key !== "my_club_goal_details" &&
        key !== "card_events" &&
        key !== "id"
      ) {
        formDataToSend.append(
          key,
          match[key] === null || match[key] === undefined ? "" : match[key]
        );
      }
    });
    formDataToSend.append("my_club_id", match.my_club_id || myclub?.id);
    formDataToSend.append("_method", "PUT");

    const scoreable = isMatchScoreable();
    if (scoreable) {
      formDataToSend.append("my_club_goals", match.my_club_goals || "0");
      formDataToSend.append(
        "opponent_club_goals",
        match.opponent_club_goals || "0"
      );

      const numGoals = parseInt(match.my_club_goals, 10) || 0;
      if (myClubGoalDetails.length > 0 && numGoals > 0) {
        const detailsToSend = myClubGoalDetails
          .slice(0, numGoals)
          .filter((detail) => detail.scorer_id && detail.minute !== "");
        formDataToSend.append(
          "my_club_goal_details",
          JSON.stringify(detailsToSend)
        );
      } else {
        formDataToSend.append("my_club_goal_details", JSON.stringify([]));
      }

      const validCardEvents = cardEvents.filter(
        (event) => event.player_id && event.card_type
      );
      formDataToSend.append("card_events", JSON.stringify(validCardEvents));
    } else {
      formDataToSend.append("my_club_goals", "");
      formDataToSend.append("opponent_club_goals", "");
    }

    try {
      await instance.post(`/matches/update/${id}`, formDataToSend);
      navigate("/admin/my_club/matches", {
        state: { message: "Match mis à jour avec succès !" },
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.errors);
      } else {
        setError({
          form: ["Une erreur s'est produite lors de la mise à jour."],
        });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (initialLoading) {
    /* ... loading spinner ... */ return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }
  if (!match.id && !initialLoading) {
    /* ... match not found ... */ return (
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
          <h3 className="text-lg font-semibold text-gray-800">
            Match non trouvé
          </h3>
          <p className="mt-2 text-gray-600">
            {error.form || "Impossible de charger les détails de ce Match."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="">
        {/* ... (Header, Success/Error Messages - same as MatchForm) ... */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/my_club/matches"
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <IconArrowLeft size="1.4rem" stroke={1.5} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-700">
            Modifier le Match
          </h1>
        </div>

        {success && (
          <div
            className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm"
            role="alert"
          >
            {" "}
            <p>{success}</p>{" "}
          </div>
        )}
        {error.form && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm"
            role="alert"
          >
            {" "}
            <p>{error.form[0]}</p>{" "}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1 & 2 (Keep as is) */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-sm font-semibold text-red-700 px-2">
              Informations Générales
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
              <div className="md:col-span-5">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Votre équipe
                </label>
                <input
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                  disabled
                  value={
                    myclub?.name || match?.my_club?.name || "Chargement..."
                  }
                />
                {error?.my_club_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.my_club_id[0]}
                  </p>
                )}
              </div>
              <div className="md:col-span-1 text-center">
                <FaFlagCheckered className="text-3xl text-red-500 mx-auto" />
              </div>
              <div className="md:col-span-5">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Adversaire
                </label>
                <Select
                  name="opponent_club_id"
                  onChange={(selectedOption) =>
                    handleChange({
                      target: {
                        name: "opponent_club_id",
                        value: selectedOption.value,
                      },
                    })
                  }
                  value={clubOptions.find(
                    (c) => c.value === match.opponent_club_id
                  )}
                  options={clubOptions}
                  placeholder="Choisissez l'adversaire"
                  isDisabled={!clubs.length}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "42px",
                      borderColor: error?.opponent_club_id
                        ? "#EF4444"
                        : "#D1D5DB",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                />
                {error?.opponent_club_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.opponent_club_id[0]}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-sm font-semibold text-red-700 px-2">
              Détails du Match
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                  <FaCalendarAlt className="mr-1.5 text-gray-400" /> Date et
                  heure
                </label>
                <input
                  type="datetime-local"
                  name="match_date"
                  onChange={handleChange}
                  value={match.match_date || ""}
                  className={`w-full px-3 py-2.5 text-sm border ${
                    error?.match_date ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-red-500 focus:border-red-500`}
                />
                {error?.match_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.match_date[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                  <FaMapMarkerAlt className="mr-1.5 text-gray-400" /> Lieu
                </label>
                <input
                  type="text"
                  name="match_location"
                  onChange={handleChange}
                  value={match.match_location || ""}
                  placeholder="Ex: Stade Adrar"
                  className={`w-full px-3 py-2.5 text-sm border ${
                    error?.match_location ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-red-500 focus:border-red-500`}
                />
                {error?.match_location && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.match_location[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Type (Domicile/Extérieur)
                </label>
                <select
                  name="is_home"
                  onChange={handleChange}
                  value={match.is_home}
                  className={`w-full px-3 py-2.5 text-sm border ${
                    error?.is_home ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-red-500 focus:border-red-500 bg-white`}
                >
                  <option value="">Sélectionner...</option>{" "}
                  <option value="1">À domicile</option>{" "}
                  <option value="0">À l'extérieur</option>
                </select>
                {error?.is_home && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.is_home[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                  <FaSortNumericUp className="mr-1.5 text-gray-400" /> Journée
                </label>
                <input
                  type="number"
                  name="journée"
                  min="1"
                  onChange={handleChange}
                  value={match.journée || ""}
                  placeholder="Ex: 15"
                  className={`w-full px-3 py-2.5 text-sm border ${
                    error?.journée ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-red-500 focus:border-red-500`}
                />
                {error?.journée && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.journée[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Phase (Aller/Retour)
                </label>
                <select
                  name="aller_retour"
                  onChange={handleChange}
                  value={match.aller_retour}
                  className={`w-full px-3 py-2.5 text-sm border ${
                    error?.aller_retour ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-red-500 focus:border-red-500 bg-white`}
                >
                  <option value="">Sélectionner...</option>{" "}
                  <option value="aller">Aller</option>{" "}
                  <option value="retour">Retour</option>
                </select>
                {error?.aller_retour && (
                  <p className="text-red-500 text-xs mt-1">
                    {error.aller_retour[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Statut du Match
                </label>
                <select
                  name="status"
                  onChange={handleChange}
                  value={match.status}
                  className={`w-full px-3 py-2.5 text-sm border ${
                    error?.status ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-red-500 focus:border-red-500 bg-white`}
                >
                  <option value="">Sélectionner...</option>{" "}
                  <option value="venir">À venir</option>{" "}
                  <option value="terminée">Terminée</option>{" "}
                  <option value="reportée">Reportée</option>
                </select>
                {error?.status && (
                  <p className="text-red-500 text-xs mt-1">{error.status[0]}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Section 3: Score, Goal Details, Card Events */}
          {isMatchScoreable() && (
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-semibold text-red-700 px-2">
                Score & Événements du Match
              </legend>

              {/* Score Inputs (Keep as is) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                    <FaBullseye className="mr-1.5 text-gray-400" /> Buts de mon
                    équipe
                  </label>
                  <input
                    type="number"
                    name="my_club_goals"
                    min="0"
                    onChange={handleChange}
                    value={
                      match.my_club_goals === null ? "" : match.my_club_goals
                    }
                    placeholder="Ex: 2"
                    className={`w-full px-3 py-2.5 text-sm border ${
                      error?.my_club_goals
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-red-500 focus:border-red-500`}
                  />
                  {error?.my_club_goals && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.my_club_goals[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                    <FaBullseye className="mr-1.5 text-gray-400" /> Buts de
                    l’adversaire
                  </label>
                  <input
                    type="number"
                    name="opponent_club_goals"
                    min="0"
                    onChange={handleChange}
                    value={
                      match.opponent_club_goals === null
                        ? ""
                        : match.opponent_club_goals
                    }
                    placeholder="Ex: 1"
                    className={`w-full px-3 py-2.5 text-sm border ${
                      error?.opponent_club_goals
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-red-500 focus:border-red-500`}
                  />
                  {error?.opponent_club_goals && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.opponent_club_goals[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Goal Details Section (Keep as is) */}
              {parseInt(match.my_club_goals, 10) > 0 && (
                <div className="space-y-6 mb-8">
                  <h3 className="text-md font-semibold text-slate-600 border-b pb-2">
                    Détails des Buts
                  </h3>
                  {myClubGoalDetails
                    .slice(0, parseInt(match.my_club_goals, 10) || 0)
                    .map((goal, index) => (
                      <div
                        key={`goal-${index}`}
                        className="p-4 border border-gray-200 rounded-md bg-slate-50 space-y-4"
                      >
                        <p className="font-medium text-sm text-red-700">
                          But {index + 1}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          <div>
                            <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                              <FaUser className="mr-1 text-gray-400" /> Buteur
                            </label>
                            <Select
                              name={`goal_scorer_${index}`}
                              options={playerOptionsForGoals}
                              value={playerOptionsForGoals.find(
                                (p) => p.value === goal.scorer_id
                              )}
                              onChange={(selectedOption) =>
                                handleGoalDetailChange(
                                  index,
                                  "scorer_id",
                                  selectedOption
                                )
                              }
                              placeholder="Choisir..."
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: "42px",
                                  borderColor: error?.[
                                    `my_club_goal_details.${index}.scorer_id`
                                  ]
                                    ? "#EF4444"
                                    : "#D1D5DB",
                                }),
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9997,
                                }),
                              }}
                              menuPortalTarget={document.body}
                            />
                            {error?.[
                              `my_club_goal_details_array.${index}.scorer_id`
                            ] && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  error[
                                    `my_club_goal_details_array.${index}.scorer_id`
                                  ][0]
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                              <FaUser className="mr-1 text-gray-400" /> Passeur
                            </label>
                            <Select
                              name={`goal_assister_${index}`}
                              options={assisterOptions}
                              value={assisterOptions.find(
                                (p) => p.value === goal.assister_id
                              )}
                              onChange={(selectedOption) =>
                                handleGoalDetailChange(
                                  index,
                                  "assister_id",
                                  selectedOption
                                )
                              }
                              isDisabled={goal.scorer_id === "own_goal"}
                              placeholder="Choisir..."
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: "42px",
                                  borderColor: error?.[
                                    `my_club_goal_details.${index}.assister_id`
                                  ]
                                    ? "#EF4444"
                                    : "#D1D5DB",
                                }),
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9997,
                                }),
                              }}
                              menuPortalTarget={document.body}
                            />
                            {error?.[
                              `my_club_goal_details_array.${index}.assister_id`
                            ] && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  error[
                                    `my_club_goal_details_array.${index}.assister_id`
                                  ][0]
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                              <FaClock className="mr-1 text-gray-400" /> Minute
                            </label>
                            <input
                              type="number"
                              name={`goal_minute_${index}`}
                              min="1"
                              max="120"
                              value={goal.minute || ""}
                              onChange={(e) =>
                                handleGoalDetailChange(index, "minute", e)
                              }
                              placeholder="Ex: 45"
                              className={`w-full px-3 py-2.5 text-sm border ${
                                error?.[`my_club_goal_details.${index}.minute`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md focus:ring-red-500 focus:border-red-500`}
                            />
                            {error?.[
                              `my_club_goal_details_array.${index}.minute`
                            ] && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  error[
                                    `my_club_goal_details_array.${index}.minute`
                                  ][0]
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Card Events Section (NEW for Edit Form) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-md font-semibold text-slate-600">
                    Cartons Disciplinaires
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddCardEvent}
                    className="flex items-center text-sm text-red-600 hover:text-red-800 font-medium py-1 px-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <IconAdd size="1.1rem" className="mr-1" /> Ajouter un Carton
                  </button>
                </div>
                {cardEvents.map((event, index) => (
                  <div
                    key={`card-edit-${index}`}
                    className="p-4 border border-gray-200 rounded-md bg-slate-50/50 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm text-red-700">
                        Événement Carton {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveCardEvent(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      >
                        <IconRemove size="1rem" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <div>
                        <label className="flex items-center text-xs font-medium text-gray-500 mb-1">
                          <FaUser className="mr-1 text-gray-400" /> Joueur
                        </label>
                        <Select
                          name={`card_player_${index}`}
                          options={playerOptionsForCards}
                          value={playerOptionsForCards.find(
                            (p) => p.value === event.player_id
                          )}
                          onChange={(selectedOption) =>
                            handleCardEventChange(
                              index,
                              "player_id",
                              selectedOption
                            )
                          }
                          placeholder="Choisir joueur..."
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "42px",
                              borderColor: error?.[
                                `card_events.${index}.player_id`
                              ]
                                ? "#EF4444"
                                : "#D1D5DB",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9996 }),
                          }}
                          menuPortalTarget={document.body}
                        />
                        {error?.[`card_events_array.${index}.player_id`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {error[`card_events_array.${index}.player_id`][0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Type de Carton
                        </label>
                        <Select
                          name={`card_type_${index}`}
                          options={cardTypeOptions}
                          value={cardTypeOptions.find(
                            (c) => c.value === event.card_type
                          )}
                          onChange={(selectedOption) =>
                            handleCardEventChange(
                              index,
                              "card_type",
                              selectedOption
                            )
                          }
                          placeholder="Choisir type..."
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "42px",
                              borderColor: error?.[
                                `card_events.${index}.card_type`
                              ]
                                ? "#EF4444"
                                : "#D1D5DB",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9996 }),
                          }}
                          menuPortalTarget={document.body}
                        />
                        {error?.[`card_events_array.${index}.card_type`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {error[`card_events_array.${index}.card_type`][0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {cardEvents.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    Aucun événement de carton ajouté.
                  </p>
                )}
              </div>
            </fieldset>
          )}

          {/* Bouton de soumission */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/admin/my_club/matches"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitLoading || initialLoading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
            >
              {submitLoading
                ? "Enregistrement..."
                : "Enregistrer les Modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatchEdit;
