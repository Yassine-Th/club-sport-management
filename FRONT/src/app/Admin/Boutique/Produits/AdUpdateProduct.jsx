import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  IconUpload,
  IconX,
  IconArrowLeft,
  IconDeviceFloppy,
  IconAlertCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import instance from "../../../../helpers/axios";

const AdUpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allSizes, setAllSizes] = useState([]);

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
    sizes: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchSizes();
    if (isEdit) fetchProduit();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await instance.get("/categories");
      setCategories(res.data.data || []);
    } catch {
      console.error("Erreur chargement catégories");
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await instance.get("/sizes");
      setAllSizes(res.data.data || []);
    } catch {
      console.error("Erreur chargement tailles");
    }
  };

  const fetchProduit = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`/produits/${id}`);
      const p = res.data.data;
      const isCl = !!p.clothes;
      setFormData({
        name: p.name,
        category_id: p.category_id.toString(),
        description: p.description || "",
        price: p.price.toString(),
        stock: p.stock.toString(),
        image: null,
        is_clothing: isCl,
        gender: isCl ? p.clothes.gender : "",
        type: isCl ? p.clothes.type : "",
        sizes: isCl
          ? p.clothes.sizes.map((sz) => ({
              size_id: sz.id,
              label: sz.label,
              stock: sz.pivot.stock.toString(),
            }))
          : [],
      });
      setImagePreview(p.image);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le produit.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((f) => ({ ...f, [name]: checked }));
    } else if (name === "image" && files?.[0]) {
      const file = files[0];
      setFormData((f) => ({ ...f, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleSizeChange = (sizeId, stock) => {
    const updated = [...formData.sizes];
    const idx = updated.findIndex((s) => s.size_id === sizeId);
    if (idx > -1) {
      if (!stock || stock === "0") updated.splice(idx, 1);
      else updated[idx].stock = stock;
    } else if (stock && stock !== "0") {
      const lbl = allSizes.find((s) => s.id === sizeId)?.label || "";
      updated.push({ size_id: sizeId, label: lbl, stock });
    }
    setFormData((f) => ({ ...f, sizes: updated }));
  };

  const addSize = (id) => {
    if (formData.sizes.some((s) => s.size_id === Number(id))) return;
    const sz = allSizes.find((s) => s.id.toString() === id);
    if (!sz) return;
    setFormData((f) => ({
      ...f,
      sizes: [...f.sizes, { size_id: sz.id, label: sz.label, stock: "0" }],
    }));
  };

  const removeSize = (id) =>
    setFormData((f) => ({
      ...f,
      sizes: f.sizes.filter((s) => s.size_id !== id),
    }));

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Nom requis";
    if (!formData.category_id) errs.category_id = "Catégorie requise";
    if (!formData.description.trim()) errs.description = "Description requise";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      errs.price = "Prix invalide";
    if (!formData.is_clothing) {
      if (
        !formData.stock ||
        isNaN(formData.stock) ||
        Number(formData.stock) < 0
      )
        errs.stock = "Stock requis";
    } else {
      if (!formData.gender) errs.gender = "Genre requis";
      if (!formData.type) errs.type = "Type requis";
      if (formData.sizes.length === 0)
        errs.sizes = "At least one size required";
    }
    if (!formData.image && !imagePreview) errs.image = "Image requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
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
    if (isEdit) data.append("_method", "PUT");

    try {
      const url = isEdit ? `/produits/${id}` : "/produits";
      await instance.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(
        isEdit
          ? `/admin/boutique/produits/${id}`
          : "/admin/boutique/produits"
      );
    } catch (err) {
      console.error(err);
      setError(`Erreur lors de ${isEdit ? "mise à jour" : "ajout"} produit`);
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
        <Link
          to={
            isEdit
              ? `/admin/boutique/produits/${id}`
              : "/admin/boutique/produits"
          }
        >
          <IconArrowLeft
            size="1.2rem"
            className="text-red-700 hover:text-red-900"
          />
        </Link>
        <h1 className="text-xl font-bold text-red-900">
          {isEdit ? "Modifier" : "Ajouter"} un produit
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <IconAlertCircle className="mr-2" />
          <span>{error}</span>
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
                Nom du produit*
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie*
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.category_id ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              >
                <option value="">Sélectionner</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.category_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_clothing"
                checked={formData.is_clothing}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Produit vestimentaire
              </label>
            </div>

            {!formData.is_clothing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock*
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.stock && (
                  <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre*
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="enfant">Enfant</option>
                    <option value="unisexe">Unisexe</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type*
                  </label>
                  <input
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Ex: t-shirt, sport..."
                    className={`w-full px-3 py-2 border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.type && (
                    <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tailles & Stocks*
                  </label>
                  <div className="space-y-2">
                    {allSizes.map((s) => {
                      const sel = formData.sizes.find(
                        (sz) => sz.size_id === s.id
                      );
                      return (
                        <div key={s.id} className="flex items-center space-x-2">
                          <span className="w-20 text-sm">{s.label}:</span>
                          <input
                            type="number"
                            min="0"
                            value={sel?.stock || ""}
                            onChange={(e) =>
                              handleSizeChange(s.id, e.target.value)
                            }
                            placeholder="Stock"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      );
                    })}
                    {errors.sizes && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.sizes}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image*
              </label>
              <div className="bg-gray-50 p-4 rounded-md">
                {imagePreview ? (
                  <div className="relative mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
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
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    <IconUpload size="1.5rem" className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      Cliquer pour uploader
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.image && (
                  <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            to={
              isEdit
                ? `/admin/boutique/produits/${id}`
                : "/admin/boutique/produits"
            }
          >
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
            <span>{isEdit ? "Enregistrer" : "Ajouter"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdUpdateProduct;
