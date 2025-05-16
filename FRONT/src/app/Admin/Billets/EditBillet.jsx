import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import instance from "../../../helpers/axios";
import DeleteConfirmation from "../../../helpers/DeleteConfirmation";

const EditBillet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [isDeleteCatModalOpen, setIsDeleteCatModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  

  // Ticket form state
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [matches, setMatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: "match",
    matches_id: "",
    date: "",
    description: "",
    status: "available",
  });
  const [errors, setErrors] = useState({});

  // Category modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({
    id: null,
    category: "",
    gate: "",
    price: 0,
    stock: 0,
  });
  const [catErrors, setCatErrors] = useState({});

  useEffect(() => {
    fetchMatches();
    fetchCategories();
    if (isEdit) fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`/tickets/${id}`);
      const t = res.data;
      setFormData({
        type: t.type,
        matches_id: t.matches_id || "",
        date: t.date ? new Date(t.date).toISOString().split("T")[0] : "",
        description: t.description,
        status: t.status,
      });
      setSelectedCategories(
        t.categories.map((c) => ({
          id: c.id,
          category: c.category,
          gate: c.gate,
          price: c.pivot.price,
          stock: c.pivot.stock,
        }))
      );
    } catch (e) {
      setError("Impossible de charger le billet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    try {
      await instance.delete(`/ticket-categories/${cat.id}`);
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMatches = async () => {
    try {
      let res;
      if (isEdit) {
        // Fetch all matches for editing (so the current match is always available)
        res = await instance.get("/show-matches");
      } else {
        // Fetch only upcoming matches without tickets for creating
        res = await instance.get("/upcomming-matches");
      }
      setMatches(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await instance.get("/ticket-categories");
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Ticket form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleToggle = (cat) => {
    setSelectedCategories((prev) => {
      const exists = prev.find((c) => c.id === cat.id);
      if (exists) return prev.filter((c) => c.id !== cat.id);
      return [...prev, { ...cat }];
    });
  };

  const handleCatPrice = (id, val) =>
    setSelectedCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, price: val } : c))
    );

  const handleCatStock = (id, val) =>
    setSelectedCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stock: val } : c))
    );

  // Category modal handlers
  const openCatModal = (cat = null) => {
    if (cat) setCatForm({ ...cat });
    else setCatForm({ id: null, category: "", gate: "", price: 0, stock: 0 });
    setCatErrors({});
    setShowCatModal(true);
  };

  const handleCatChange = (e) => {
    const { name, value } = e.target;
    setCatForm((f) => ({ ...f, [name]: value }));
  };

  const saveCategory = async () => {
    const errs = {};
    if (!catForm.category.trim()) errs.category = "Nom requis";
    if (!catForm.gate.trim()) errs.gate = "Porte requise";
    if (catForm.price < 0) errs.price = "Prix invalide";
    if (catForm.stock < 0) errs.stock = "Stock invalide";
    if (Object.keys(errs).length) return setCatErrors(errs);

    try {
      if (catForm.id)
        await instance.put(`/ticket-categories/${catForm.id}`, catForm);
      else await instance.post("/ticket-categories", catForm);
      await fetchCategories();
      setShowCatModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Ticket validation
  const validate = () => {
    const errs = {};
    if (!formData.type) errs.type = "Type requis";
    if (formData.type === "match" && !formData.matches_id)
      errs.matches_id = "Match requis";
    if (formData.type === "event" && !formData.date) errs.date = "Date requise";
    if (!formData.description.trim()) errs.description = "Description requise";
    if (!formData.status) errs.status = "Statut requis";
    if (selectedCategories.length === 0)
      errs.categories = "Au moins une catégorie est requise";

    selectedCategories.forEach((cat, idx) => {
      if (!cat.price || cat.price <= 0)
        errs[`category_${idx}_price`] = "Prix invalide";
      if (cat.stock < 0) errs[`category_${idx}_stock`] = "Stock invalide";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);

    const payload = { ...formData, categories: selectedCategories };

    try {
      if (isEdit) await instance.put(`/tickets/${id}`, payload);
      else await instance.post("/tickets", payload);

      setSuccess(
        `Le billet a été ${isEdit ? "modifié" : "ajouté"} avec succès !`
      );

      if (!isEdit) {
        setFormData({
          type: "match",
          matches_id: "",
          date: "",
          description: "",
          status: "available",
        });
        setSelectedCategories([]);
      }
      window.scrollTo(0, 0);
    } catch (e) {
      if (e.response?.status === 422) setErrors(e.response.data.errors);
      else
        setError(
          `Erreur lors de ${isEdit ? "mise à jour" : "ajout"} du billet`
        );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/tickets">
          <IconArrowLeft
            size="1.2rem"
            className="text-red-700 hover:text-red-900"
          />
        </Link>
        <h1 className="text-xl font-bold text-red-900">
          {isEdit ? "Modifier" : "Ajouter"} un billet
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <IconAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md flex items-center">
          <svg
            className="h-5 w-5 mr-2 text-green-500"
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        {/* === LEFT COLUMN === */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de billet*
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center">
                  <input
                    id="type-match"
                    name="type"
                    type="radio"
                    value="match"
                    checked={formData.type === "match"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label
                    htmlFor="type-match"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Match
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="type-event"
                    name="type"
                    type="radio"
                    value="event"
                    checked={formData.type === "event"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label
                    htmlFor="type-event"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Événement
                  </label>
                </div>
              </div>
              {errors.type && (
                <p className="text-red-600 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Match vs Event */}
            {formData.type === "match" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Match*
                </label>
                <select
                  name="matches_id"
                  value={formData.matches_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.matches_id ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <option value="">Sélectionner un match</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.my_club_name === "Hassania Union Sport Agadir"? "HUSA" : m.my_club_name} vs{" "}
                      {m.opponent_club_name || "Adversaire"} (
                      {new Date(m.match_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {errors.matches_id && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.matches_id}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de l'événement*
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.date && (
                  <p className="text-red-600 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut*
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              >
                <option value="available">Disponible</option>
                <option value="limited">Quantité limitée</option>
                <option value="sold out">Épuisé</option>
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">{errors.status}</p>
              )}
            </div>
          </div>

          {/* === RIGHT COLUMN === */}
          <div className="space-y-4">
            {/* Available categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégories de billets*
              </label>
              <div className="mt-2 border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Catégories disponibles
                  </h4>
                  <button
                    type="button"
                    onClick={() => openCatModal()}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <IconPlus size="0.9rem" /> Nouvelle catégorie
                  </button>
                </div>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aucune catégorie disponible
                  </p>
                ) : (
                  categories.map((cat) => {
                    const isSel = selectedCategories.some(
                      (c) => c.id === cat.id
                    );
                    return (
                      <div
                        key={cat.id}
                        className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-md ${
                          isSel ? "bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => handleToggle(cat)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            {cat.category}
                          </label>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">
                            (Porte: {cat.gate})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setIsDeleteCatModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Supprimer la catégorie"
                          >
                            <IconTrash size="1rem" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {errors.categories && (
                <p className="text-red-600 text-sm mt-1">{errors.categories}</p>
              )}
            </div>

            {/* Selected categories */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Catégories séléctionnées
              </h3>
              {selectedCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Aucune catégorie sélectionnée
                </p>
              ) : (
                selectedCategories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="bg-white p-3 rounded-md border border-gray-200 mb-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">
                        {cat.category} (Porte: {cat.gate})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(cat)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <IconTrash size="1rem" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Prix* (DH)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={cat.price}
                          onChange={(e) =>
                            handleCatPrice(cat.id, e.target.value)
                          }
                          className={`w-full px-2 py-1 border ${
                            errors[`category_${idx}_price`]
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:ring-1 focus:ring-red-500 text-sm`}
                        />
                        {errors[`category_${idx}_price`] && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors[`category_${idx}_price`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Stock*
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cat.stock}
                          onChange={(e) =>
                            handleCatStock(cat.id, e.target.value)
                          }
                          className={`w-full px-2 py-1 border ${
                            errors[`category_${idx}_stock`]
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:ring-1 focus:ring-red-500 text-sm`}
                        />
                        {errors[`category_${idx}_stock`] && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors[`category_${idx}_stock`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link to="/admin/tickets">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
          >
            {submitting ? (
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-5 w-5" />
            ) : (
              <IconDeviceFloppy size="1rem" />
            )}
            <span>{isEdit ? "Enregistrer" : "Ajouter"}</span>
          </button>
        </div>
      </form>

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0  bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-900">
              {catForm.id ? "Modifier" : "Créer"} catégorie
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la catégorie*
                </label>
                <input
                  name="category"
                  type="text"
                  value={catForm.category}
                  onChange={handleCatChange}
                  className={`w-full px-3 py-2 border ${
                    catErrors.category ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {catErrors.category && (
                  <p className="text-red-600 text-xs mt-1">
                    {catErrors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porte*
                </label>
                <input
                  name="gate"
                  type="text"
                  value={catForm.gate}
                  onChange={handleCatChange}
                  className={`w-full px-3 py-2 border ${
                    catErrors.gate ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {catErrors.gate && (
                  <p className="text-red-600 text-xs mt-1">{catErrors.gate}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveCategory}
                className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800"
              >
                <IconDeviceFloppy size="1rem" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteCatModalOpen && categoryToDelete && (
        <DeleteConfirmation
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer la catégorie « ${categoryToDelete.category} » de ce billet ?`}
          onConfirm={async () => {
            try {
              await instance.delete(
                `/ticket-categories/${categoryToDelete.id}`
              );
              setSelectedCategories((prev) =>
                prev.filter((c) => c.id !== categoryToDelete.id)
              );
              // Optionally refresh categories list if needed:
              await fetchCategories();
            } catch (e) {
              // Optionally handle error
              console.error(e);
            } finally {
              setIsDeleteCatModalOpen(false);
              setCategoryToDelete(null);
            }
          }}
          onCancel={() => {
            setIsDeleteCatModalOpen(false);
            setCategoryToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default EditBillet;
