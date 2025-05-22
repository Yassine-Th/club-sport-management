import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
  IconTrash,
  IconPlus,
  IconPhotoUp, // For image upload icon
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
    image: "", // Stores URL of existing image
    location: "",
  });
  const [imageFile, setImageFile] = useState(null); // For new image File object
  const [imagePreview, setImagePreview] = useState(null); // For new image preview URL
  const [wantsToRemoveImage, setWantsToRemoveImage] = useState(false); // Flag to remove existing image

  const [errors, setErrors] = useState({});

  // Category modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({
    id: null,
    category: "",
    gate: "",
  });
  const [catErrors, setCatErrors] = useState({});

  useEffect(() => {
    fetchMatches();
    fetchCategories();
    if (isEdit) {
      fetchTicket();
    }
  }, [id, isEdit]); // Add isEdit to dependency array if its change should re-trigger

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`/tickets/${id}`);
      const t = res.data;
      setFormData({
        type: t.type,
        matches_id: t.matches_id || "",
        date: t.date ? new Date(t.date).toISOString().slice(0, 16) : "",
        description: t.description,
        status: t.status,
        image: t.image || "", // Load existing image URL
        location: t.location || "",
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
      // Reset file states when fetching/re-fetching
      setImageFile(null);
      setImagePreview(null);
      setWantsToRemoveImage(false);
    } catch (e) {
      setError("Impossible de charger le billet.");
      console.error("Fetch ticket error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategoryFromDb = async (catId) => {
    // Renamed to avoid confusion with local removal
    try {
      await instance.delete(`/ticket-categories/${catId}`);
      fetchCategories(); // Refresh the main list of categories
      // Also remove from selectedCategories if it was there
      setSelectedCategories((prev) => prev.filter((sc) => sc.id !== catId));
      setSuccess("Catégorie supprimée de la base de données avec succès.");
    } catch (e) {
      console.error(e);
      setError(
        "Erreur lors de la suppression de la catégorie de la base de données."
      );
    }
  };

  const fetchMatches = async () => {
    try {
      let res;
      if (isEdit) {
        res = await instance.get("/show-matches");
      } else {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setWantsToRemoveImage(false); // New file selected, so not "removing existing"
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: null })); // Clear previous image error (backend uses 'image' key)
    } else {
      // No file selected (e.g., user cancelled)
      setImageFile(null);
      setImagePreview(null);
      // If they had previously marked an existing image for removal, this doesn't change that
      // If they had an existing image and now unselect a new file, the existing image will still be shown unless `wantsToRemoveImage` is true
    }
  };

  const handleToggle = (cat) => {
    setSelectedCategories((prev) => {
      const exists = prev.find((c) => c.id === cat.id);
      if (exists) return prev.filter((c) => c.id !== cat.id);
      return [
        ...prev,
        { ...cat, price: cat.price || 0, stock: cat.stock || 0 },
      ];
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
    if (cat) setCatForm({ id: cat.id, category: cat.category, gate: cat.gate });
    else setCatForm({ id: null, category: "", gate: "" });
    setCatErrors({});
    setShowCatModal(true);
  };

  const handleCatChange = (e) => {
    const { name, value } = e.target;
    setCatForm((f) => ({ ...f, [name]: value }));
    setCatErrors((prev) => ({ ...prev, [name]: null }));
  };

  const saveCategory = async () => {
    const errs = {};
    if (!catForm.category.trim()) errs.category = "Nom requis";
    if (!catForm.gate.trim()) errs.gate = "Porte requise";
    if (Object.keys(errs).length) return setCatErrors(errs);

    try {
      if (catForm.id)
        await instance.put(`/ticket-categories/${catForm.id}`, {
          category: catForm.category,
          gate: catForm.gate,
        });
      else
        await instance.post("/ticket-categories", {
          category: catForm.category,
          gate: catForm.gate,
        });
      await fetchCategories();
      setShowCatModal(false);
      setSuccess("Catégorie enregistrée avec succès.");
    } catch (e) {
      if (e.response?.status === 422 && e.response?.data?.errors) {
        setCatErrors(e.response.data.errors);
      } else {
        console.error(e);
        setCatErrors({
          general: "Erreur lors de l'enregistrement de la catégorie.",
        });
      }
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
      if (cat.price === "" || cat.price === null || parseFloat(cat.price) < 0)
        errs[`category_${idx}_price`] = "Prix invalide";
      if (cat.stock === "" || cat.stock === null || parseInt(cat.stock, 10) < 0)
        errs[`category_${idx}_stock`] = "Stock invalide";
    });

    setErrors(errs); // Also updates errors from previous backend submission
    return Object.keys(errs).length === 0;
  };

  // Submit ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    setSuccess("");

    const submissionData = new FormData();

    submissionData.append("type", formData.type);
    if (formData.type === "match") {
      submissionData.append("matches_id", formData.matches_id);
    } else if (formData.type === "event") {
      submissionData.append("date", formData.date);
    }
    submissionData.append("description", formData.description);
    submissionData.append("status", formData.status);
    submissionData.append("location", formData.location || "");

    selectedCategories.forEach((cat, index) => {
      submissionData.append(`categories[${index}][id]`, cat.id);
      submissionData.append(`categories[${index}][price]`, cat.price);
      submissionData.append(`categories[${index}][stock]`, cat.stock);
    });

    if (imageFile) {
      submissionData.append("image", imageFile);
    } else if (isEdit && wantsToRemoveImage && formData.image) {
      submissionData.append("remove_image", "1"); // Or true, depending on backend
    }
    // If no new imageFile and not wantsToRemoveImage, 'image' field is not appended for update.
    // Backend should retain existing image if 'image' field is not present and 'remove_image' is not true.

    try {
      let response;
      if (isEdit) {
        submissionData.append("_method", "PUT"); // Laravel specific for FormData PUT
        response = await instance.post(`/tickets/${id}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await instance.post("/tickets", submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

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
          image: "",
          location: "",
        });
        setSelectedCategories([]);
        setErrors({}); // Clear errors on successful creation
      } else if (response.data) {
        // For edit, update formData with new image URL from backend
        const updatedTicket = response.data;
        setFormData((prev) => ({
          ...prev,
          image: updatedTicket.image || "", // Update with new or cleared image URL
        }));
      }

      // Reset file states after successful submission for both edit and create
      setImageFile(null);
      setImagePreview(null);
      setWantsToRemoveImage(false);
      const fileInput = document.getElementById("imageFile");
      if (fileInput) fileInput.value = null; // Clear file input visually

      window.scrollTo(0, 0);
    } catch (e) {
      if (e.response?.status === 422) {
        setErrors(e.response.data.errors); // This will include 'image' key if backend validation fails
        setError("Veuillez corriger les erreurs dans le formulaire.");
      } else {
        setError(
          `Erreur lors de ${isEdit ? "la mise à jour" : "l'ajout"} du billet. ${
            e.response?.data?.message || e.message
          }`
        );
        console.error("Submit error:", e.response || e);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEdit)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 animate-spin"></div>
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
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
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
                      {m.my_club_name === "Hassania Union Sport Agadir"
                        ? "HUSA"
                        : m.my_club_name}{" "}
                      vs {m.opponent_club_name || "Adversaire"} (
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
                rows={3}
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
            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lieu / Stade (optionnel)
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Ex: Stade Adrar, Agadir"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Image File Upload */}
            <div>
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image du billet (optionnel)
              </label>
              <input
                type="file"
                name="imageFile"
                id="imageFile"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageChange}
                className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">{errors.image}</p>
              )}

              {(imagePreview ||
                (isEdit && formData.image && !wantsToRemoveImage)) && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-xs text-gray-600 mb-1">Aperçu :</p>
                  <img
                    src={imagePreview || formData.image}
                    alt="Aperçu du billet"
                    className="h-32 w-auto object-contain border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      if (isEdit && formData.image) setWantsToRemoveImage(true);
                      const fileInput = document.getElementById("imageFile");
                      if (fileInput) fileInput.value = null;
                    }}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 flex items-center"
                  >
                    <IconTrash size="0.8rem" className="mr-1" /> Supprimer cette
                    image
                  </button>
                </div>
              )}
              {wantsToRemoveImage &&
                isEdit &&
                formData.image &&
                !imagePreview && (
                  <p className="text-sm text-orange-600 mt-1">
                    L'image existante sera supprimée lors de l'enregistrement.
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
                    <IconPlus size="0.9rem" /> Nouvelle
                  </button>
                </div>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aucune catégorie.{" "}
                    <button
                      type="button"
                      onClick={() => openCatModal()}
                      className="text-red-600 hover:underline"
                    >
                      Créer?
                    </button>
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
                            id={`cat-checkbox-${cat.id}`}
                            checked={isSel}
                            onChange={() => handleToggle(cat)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`cat-checkbox-${cat.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {cat.category}
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            (Porte: {cat.gate})
                          </span>
                          <button
                            type="button"
                            onClick={() => openCatModal(cat)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Modifier"
                          >
                            <IconPhotoUp size="1rem" />
                          </button>{" "}
                          {/* Changed IconPencil to IconPhotoUp as example */}
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setIsDeleteCatModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Supprimer de la DB"
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
            {selectedCategories.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Catégories sélectionnées pour ce billet
                </h3>
                {selectedCategories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="bg-white p-3 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">
                        {cat.category} (Porte: {cat.gate})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(cat)}
                        className="text-red-500 hover:text-red-700"
                        title="Retirer du billet"
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
                ))}
              </div>
            )}
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
            disabled={submitting || (loading && !isEdit)}
            className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
          >
            {submitting ? (
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-5 w-5 animate-spin" />
            ) : (
              <IconDeviceFloppy size="1rem" />
            )}
            <span>{isEdit ? "Enregistrer" : "Ajouter"}</span>
          </button>
        </div>
      </form>

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-red-900">
              {catForm.id ? "Modifier" : "Créer"} catégorie
            </h2>
            {catErrors.general && (
              <p className="text-red-600 text-sm mb-2">{catErrors.general}</p>
            )}
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
          message={`Êtes-vous sûr de vouloir supprimer la catégorie « ${categoryToDelete.category} » (Porte: ${categoryToDelete.gate}) de la base de données ? Ceci affectera tous les billets utilisant cette catégorie.`}
          onConfirm={async () => {
            await handleDeleteCategoryFromDb(categoryToDelete.id); // Use the renamed function
            setIsDeleteCatModalOpen(false);
            setCategoryToDelete(null);
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
