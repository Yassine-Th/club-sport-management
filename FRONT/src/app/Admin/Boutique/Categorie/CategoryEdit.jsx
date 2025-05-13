import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconCategory,
  IconAlertCircle,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import { Text, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../../helpers/axios";

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCategory = id === "ajouter";

  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(!isNewCategory);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = isNewCategory
      ? "Ajouter une catégorie | HUSA Club Admin"
      : "Modifier une catégorie | HUSA Club Admin";

    if (!isNewCategory) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/categories/${id}`);
      setCategory(response.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger les détails de la catégorie. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!category.name.trim()) {
      errors.name = "Le nom de la catégorie est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (isNewCategory) {
        await instance.post("/categories", category);
      } else {
        await instance.put(`/categories/${id}`, category);
      }

      navigate("/admin/boutique/categories");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        // Handle validation errors from Laravel
        setFormErrors(err.response.data.errors);
      } else {
        setError(
          isNewCategory
            ? "Erreur lors de la création de la catégorie."
            : "Erreur lors de la mise à jour de la catégorie."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/boutique/categories">
          <UnstyledButton className="!text-red-600 !flex !items-center !gap-2 hover:!text-red-800">
            <IconArrowLeft size="1rem" />
            <span>Retour</span>
          </UnstyledButton>
        </Link>
        <Text fw={700} size="xl" className="text-red-900">
          {isNewCategory ? "Ajouter une catégorie" : "Modifier la catégorie"}
        </Text>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <IconAlertCircle size="1.5rem" className="mr-2" />
            <span>{error}</span>
          </div>
          <IconX
            size="1rem"
            onClick={() => setError(null)}
            className="cursor-pointer"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconCategory size="1.5rem" className="text-red-600" />
            <Text fw={600} size="lg">
              Informations de la catégorie
            </Text>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nom de la catégorie"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={category.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Description de la catégorie"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link to="/admin/boutique/categories">
              <UnstyledButton className="!bg-gray-200 !text-gray-800 !px-4 !py-2 !rounded-md !mr-4 hover:!bg-gray-300 !transition-colors">
                Annuler
              </UnstyledButton>
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 transition-colors disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader size="sm" color="white" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <IconDeviceFloppy size="1rem" />
                  <span>
                    {isNewCategory
                      ? "Créer la catégorie"
                      : "Enregistrer les modifications"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit;
