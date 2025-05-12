import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconUpload,
  IconX,
  IconArrowLeft,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../../helpers/axios";

const ProduitForm = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    is_clothing: false,
    gender: "",
    type: "",
    sizes: [], // { size_id, label, stock }
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch categories and sizes once
    instance
      .get("/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch(() => console.error("Erreur chargement catégories"));

    instance
      .get("/sizes")
      .then((res) => setAvailableSizes(res.data.data || []))
      .catch(() => console.error("Erreur chargement tailles"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((f) => ({ ...f, [name]: checked }));
    } else if (name === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormData((f) => ({ ...f, image: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }

    if (errors[name]) {
      setErrors((errs) => ({ ...errs, [name]: null }));
    }
  };

  const handleSizeChange = (sizeId, stock) => {
    const updated = [...formData.sizes];
    const idx = updated.findIndex((s) => s.size_id === sizeId);

    if (idx > -1) {
      // remove or update
      if (!stock || stock === "0") updated.splice(idx, 1);
      else updated[idx].stock = stock;
    } else if (stock && stock !== "0") {
      // add new
      const label = availableSizes.find((s) => s.id === sizeId)?.label || "";
      updated.push({ size_id: sizeId, label, stock });
    }

    setFormData((f) => ({ ...f, sizes: updated }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Nom requis";
    if (!formData.category_id) e.category_id = "Catégorie requise";
    if (!formData.description.trim()) e.description = "Description requise";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      e.price = "Prix invalide";

    if (!formData.is_clothing) {
      if (
        !formData.stock ||
        isNaN(formData.stock) ||
        Number(formData.stock) < 0
      )
        e.stock = "Stock requis";
    } else {
      if (!formData.gender) e.gender = "Genre requis";
      if (!formData.type) e.type = "Type requis";
      if (formData.sizes.length === 0) e.sizes = "Au moins une taille requise";
    }

    if (!formData.image && !imagePreview) e.image = "Image requise";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category_id", formData.category_id);
    data.append("description", formData.description);
    data.append("price", formData.price);

    if (formData.is_clothing) {
      data.append("is_clothing", "1");
      data.append("gender", formData.gender);
      data.append("type", formData.type);
      data.append("stock", "0");
      data.append("sizes", JSON.stringify(formData.sizes));
    } else {
      data.append("is_clothing", "0");
      data.append("stock", formData.stock);
    }

    if (formData.image) data.append("image", formData.image);

    try {
      await instance.post("/produits", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/boutique/produits");
    } catch (err) {
      console.error("Erreur ajout produit", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/boutique/produits">
            <UnstyledButton className="text-red-700 hover:text-red-900">
              <IconArrowLeft size="1.2rem" />
            </UnstyledButton>
          </Link>
          <h1 className="text-xl font-bold text-red-900">Ajouter un produit</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nom du produit*
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Catégorie*
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.category_id ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="">Sélectionner</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-600 text-sm">{errors.category_id}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prix (€)*
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.price && (
                    <p className="text-red-600 text-sm">{errors.price}</p>
                  )}
                </div>

                {/* Is clothing */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_clothing"
                    checked={formData.is_clothing}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium">
                    Produit vestimentaire
                  </label>
                </div>

                {/* Stock OR Clothing */}
                {!formData.is_clothing ? (
                  <div>
                    <label className="block text-sm mb-1">Stock*</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.stock ? "border-red-500" : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors.stock && (
                      <p className="text-red-600 text-sm">{errors.stock}</p>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Gender */}
                    <div>
                      <label className="block text-sm mb-1">Genre*</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.gender ? "border-red-500" : "border-gray-300"
                        } rounded-md`}
                      >
                        <option value="">Sélectionner</option>
                        {["homme", "femme", "enfant", "unisexe"].map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      {errors.gender && (
                        <p className="text-red-600 text-sm">{errors.gender}</p>
                      )}
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm mb-1">Type*</label>
                      <input
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Ex: t-shirt, sport..."
                        className={`w-full px-3 py-2 border ${
                          errors.type ? "border-red-500" : "border-gray-300"
                        } rounded-md`}
                      />
                      {errors.type && (
                        <p className="text-red-600 text-sm">{errors.type}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm mb-1">Description*</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm">{errors.description}</p>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm mb-1">
                    Image du produit*
                  </label>
                  <div className="flex items-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((f) => ({ ...f, image: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <IconX size="0.8rem" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                        <IconUpload size="1.5rem" className="text-gray-400" />
                        <span className="text-xs">Cliquer pour upload</span>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-red-600 text-sm">{errors.image}</p>
                  )}
                </div>

                {/* Sizes for clothing */}
                {formData.is_clothing && (
                  <div>
                    <label className="block text-sm mb-2">
                      Tailles & stocks*
                    </label>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {availableSizes.map((s) => {
                        const sel = formData.sizes.find(
                          (sz) => sz.size_id === s.id
                        );
                        return (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className="w-24 text-sm font-medium">
                              {s.label}:
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={sel?.stock || ""}
                              onChange={(e) =>
                                handleSizeChange(s.id, e.target.value)
                              }
                              placeholder="Stock"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </div>
                        );
                      })}
                    </div>
                    {errors.sizes && (
                      <p className="text-red-600 text-sm">{errors.sizes}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link to="/admin/boutique/produits">
                <UnstyledButton className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
                  Annuler
                </UnstyledButton>
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-800 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader size="sm" color="white" />
                ) : (
                  <IconDeviceFloppy size="1rem" />
                )}
                <span>Ajouter</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProduitForm;
