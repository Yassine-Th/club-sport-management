import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconUpload,
  IconX,
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
} from "@tabler/icons-react";
import instance from "../../../helpers/axios";

const PlayerForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    birth_date: "",
    number: "",
    height: "",
    weight: "",
    foot: "right",
    nationality: "",
    photo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((f) => ({ ...f, [name]: checked }));
    } else if (name === "photo" && files?.[0]) {
      const file = files[0];
      setFormData((f) => ({ ...f, photo: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Nom requis";
    if (!formData.position) errs.position = "Position requise";
    if (!formData.birth_date) errs.birth_date = "Date de naissance requise";
    if (
      !formData.number ||
      isNaN(formData.number) ||
      Number(formData.number) <= 0
    )
      errs.number = "Numéro invalide";
    if (
      !formData.height ||
      isNaN(formData.height) ||
      Number(formData.height) <= 0
    )
      errs.height = "Taille invalide";
    if (
      !formData.weight ||
      isNaN(formData.weight) ||
      Number(formData.weight) <= 0
    )
      errs.weight = "Poids invalide";
    if (!formData.foot) errs.foot = "Pied préféré requis";
    if (!formData.nationality.trim()) errs.nationality = "Nationalité requise";
    if (!formData.photo) errs.photo = "Photo requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("birth_date", formData.birth_date);
    data.append("number", formData.number);
    data.append("height", formData.height);
    data.append("weight", formData.weight);
    data.append("foot", formData.foot);
    data.append("nationality", formData.nationality);
    if (formData.photo) data.append("photo", formData.photo);

    try {
      const response = await instance.post("/player-create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message || "Joueur créé avec succès !");
      // Reset form after successful creation
      setFormData({
        name: "",
        position: "",
        birth_date: "",
        number: "",
        height: "",
        weight: "",
        foot: "right",
        nationality: "",
        photo: null,
      });
      setImagePreview(null);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setError("Erreur lors de la création du joueur");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/my_club/players">
          <IconArrowLeft
            size="1.2rem"
            className="text-red-700 hover:text-red-900"
          />
        </Link>
        <h1 className="text-xl font-bold text-red-900">Ajouter un joueur</h1>
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du joueur*
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Nom du joueur"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position*
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.position ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              >
                <option value="">Sélectionner une position</option>
                <option value="Gardien">Gardien de but</option>
                <option value="Défenseur">Défenseur</option>
                <option value="Milieu">Milieu de terrain</option>
                <option value="Attaquant">Attaquant</option>
              </select>
              {errors.position && (
                <p className="text-red-600 text-sm mt-1">{errors.position}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance*
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.birth_date ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.birth_date && (
                <p className="text-red-600 text-sm mt-1">{errors.birth_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro*
              </label>
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.number ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Numéro du joueur"
              />
              {errors.number && (
                <p className="text-red-600 text-sm mt-1">{errors.number}</p>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille (cm)*
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.height ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Taille en cm"
                />
                {errors.height && (
                  <p className="text-red-600 text-sm mt-1">{errors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids (kg)*
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Poids en kg"
                />
                {errors.weight && (
                  <p className="text-red-600 text-sm mt-1">{errors.weight}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pied préféré*
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center">
                  <input
                    id="foot-left"
                    name="foot"
                    type="radio"
                    value="left"
                    checked={formData.foot === "left"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label
                    htmlFor="foot-left"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Gauche
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="foot-right"
                    name="foot"
                    type="radio"
                    value="right"
                    checked={formData.foot === "right"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label
                    htmlFor="foot-right"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Droit
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="foot-both"
                    name="foot"
                    type="radio"
                    value="both"
                    checked={formData.foot === "both"}
                    onChange={handleChange}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label
                    htmlFor="foot-both"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Les deux
                  </label>
                </div>
              </div>
              {errors.foot && (
                <p className="text-red-600 text-sm mt-1">{errors.foot}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationalité*
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.nationality ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Nationalité du joueur"
              />
              {errors.nationality && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.nationality}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo*
              </label>
              <div className="bg-gray-50 p-4 rounded-md">
                {imagePreview ? (
                  <div className="relative mb-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((f) => ({ ...f, photo: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <IconX size="0.8rem" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    <IconUpload size="1.5rem" className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      Cliquer pour uploader
                    </span>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.photo && (
                  <p className="text-red-600 text-sm mt-1">{errors.photo}</p>
                )}
                {formData.photo && (
                  <p className="mt-2 text-sm text-gray-600">
                    Fichier sélectionné: {formData.photo.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link to="/admin/my_club/players">
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
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-5 w-5"></div>
            ) : (
              <IconDeviceFloppy size="1rem" />
            )}
            <span>Ajouter</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;
