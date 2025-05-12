import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import instance from "../../../helpers/axios";
import {
  ShoppingCart,
  ChevronLeft,
  Star,
  Package,
  Clock,
  Truck,
  Shield,
  Edit,
  Save,
  X,
} from "lucide-react";

const ProduitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const response = await instance.get(`/products/${id}`);
        const data = response.data.data;
        setProduit(data);
        setEditedProduct(data); // Initialize edit form with current data

        // If product has sizes, select the first size by default
        if (data.clothes?.sizes?.length > 0) {
          setSelectedSize(data.clothes.sizes[0].id);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de charger le produit. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  // Compute stock and availability
  const clothesSizes = produit?.clothes?.sizes ?? [];
  const totalClothesStock = clothesSizes.reduce(
    (sum, s) => sum + s.pivot.stock,
    0
  );
  const selectedSizeStock =
    clothesSizes.find((s) => s.id === selectedSize)?.pivot.stock ?? 0;

  const isAvailable = produit
    ? produit.clothes
      ? selectedSize
        ? selectedSizeStock > 0
        : totalClothesStock > 0
      : produit.stock > 0
    : false;

  const handleQuantityChange = (action) => {
    if (action === "increment") {
      const max = produit.clothes ? selectedSizeStock : produit.stock;
      if (quantity < max) setQuantity((q) => q + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: produit,
      quantity,
      selectedSize: produit.clothes?.sizes?.find((s) => s.id === selectedSize),
    });
    // Show success notification or redirect to cart
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle clothes-specific fields
  const handleClothesFieldChange = (field, value) => {
    setEditedProduct((prev) => ({
      ...prev,
      clothes: {
        ...prev.clothes,
        [field]: value,
      },
    }));
  };

  // Handle stock changes for non-clothes products
  const handleStockChange = (value) => {
    const numValue = parseInt(value, 10) || 0;
    setEditedProduct((prev) => ({
      ...prev,
      stock: numValue >= 0 ? numValue : 0,
    }));
  };

  // Handle stock changes for specific sizes of clothes
  const handleSizeStockChange = (sizeId, value) => {
    const numValue = parseInt(value, 10) || 0;
    setEditedProduct((prev) => ({
      ...prev,
      clothes: {
        ...prev.clothes,
        sizes: prev.clothes.sizes.map((size) =>
          size.id === sizeId
            ? {
                ...size,
                pivot: {
                  ...size.pivot,
                  stock: numValue >= 0 ? numValue : 0,
                },
              }
            : size
        ),
      },
    }));
  };

  // Save product changes
  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const response = await instance.put(`/products/${id}`, editedProduct);
      setProduit(response.data.data);
      setIsEditing(false);
      // Show success notification
      alert("Produit mis à jour avec succès");
    } catch (err) {
      console.error(err);
      setSaveError("Erreur lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedProduct(produit);
    setIsEditing(false);
    setSaveError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-red-600 text-5xl mb-4">!</div>
            <h2 className="font-title text-2xl mb-2">
              {error ? "Erreur" : "Produit non trouvé"}
            </h2>
            <p className="text-gray-700 mb-4">
              {error ? error : "Ce produit n'existe pas ou a été supprimé."}
            </p>
            <Link
              to="/boutique"
              className="inline-flex items-center text-red-600 hover:text-red-700"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
      <Header />

      <div className="px-4 py-8">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-1/2 p-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {produit.image ? (
                <img
                  src={produit.image}
                  alt={produit.name}
                  className="max-h-96 object-contain"
                />
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <span className="font-title text-2xl">
                    Image non disponible
                  </span>
                </div>
              )}

              {isEditing && (
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    URL de l'image
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={editedProduct.image || ""}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    placeholder="URL de l'image"
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 p-6">
              <div className="flex items-center justify-between mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    className="font-title text-3xl w-full border-b border-gray-300 focus:outline-none focus:border-red-500"
                    value={editedProduct.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                ) : (
                  <h1 className="font-title text-3xl">{produit.name}</h1>
                )}

                {produit.clothes && (
                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    {isEditing ? (
                      <select
                        value={editedProduct.clothes.gender}
                        onChange={(e) =>
                          handleClothesFieldChange("gender", e.target.value)
                        }
                        className="bg-transparent border-none focus:outline-none"
                      >
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                        <option value="enfant">Enfant</option>
                      </select>
                    ) : produit.clothes.gender === "homme" ? (
                      "Homme"
                    ) : produit.clothes.gender === "femme" ? (
                      "Femme"
                    ) : (
                      "Enfant"
                    )}
                  </span>
                )}
              </div>

              {/* Edit/Save Controls */}
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
                      disabled={saving}
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              {saveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
                  {saveError}
                </div>
              )}

              {/* Price & Availability */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="font-section text-2xl text-red-600 font-bold w-32 border-b border-gray-300 focus:outline-none focus:border-red-500"
                      value={editedProduct.price}
                      onChange={(e) =>
                        handleFieldChange(
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                    <span className="font-section text-2xl text-red-600 font-bold">
                      DH
                    </span>
                  </div>
                ) : (
                  <span className="font-section text-2xl text-red-600 font-bold">
                    {Number.parseFloat(produit.price).toFixed(2)} DH
                  </span>
                )}

                {!isEditing && (
                  <span className="text-sm text-gray-500 ml-2">
                    {isAvailable ? (
                      <span className="text-green-600">Disponible</span>
                    ) : (
                      <span className="text-red-600">Rupture de stock</span>
                    )}
                  </span>
                )}
              </div>

              {/* Stock Management for non-clothes */}
              {isEditing && !produit.clothes && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={editedProduct.stock}
                    onChange={(e) => handleStockChange(e.target.value)}
                  />
                </div>
              )}

              {/* Description */}
              {isEditing ? (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={editedProduct.description}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                  ></textarea>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">{produit.description}</p>
              )}

              {/* Size Selector */}
              {produit.clothes?.sizes?.length > 0 && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Taille
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {produit.clothes.sizes.map((size) => (
                      <div key={size.id} className="flex flex-col">
                        <button
                          onClick={() => {
                            setSelectedSize(size.id);
                            setQuantity(1);
                          }}
                          className={`px-4 py-2 border ${
                            selectedSize === size.id
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-300 hover:border-red-300"
                          } rounded-md transition-colors`}
                        >
                          {size.label}
                        </button>

                        {isEditing && (
                          <div className="mt-1">
                            <input
                              type="number"
                              min="0"
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-xs"
                              value={
                                editedProduct.clothes.sizes.find(
                                  (s) => s.id === size.id
                                )?.pivot.stock || 0
                              }
                              onChange={(e) =>
                                handleSizeStockChange(size.id, e.target.value)
                              }
                              placeholder="Stock"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Only show these in view mode, not edit mode */}
              {!isEditing && (
                <>
                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Quantité
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange("decrement")}
                        className={`px-3 py-1 border border-gray-300 rounded-l-md ${
                          quantity === 1
                            ? "text-gray-400"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        disabled={!isAvailable || quantity === 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-16 text-center border-t border-b border-gray-300 py-1"
                      />
                      <button
                        onClick={() => handleQuantityChange("increment")}
                        className={`px-3 py-1 border border-gray-300 rounded-r-md ${
                          !isAvailable ||
                          quantity >=
                            (produit.clothes
                              ? selectedSizeStock
                              : produit.stock)
                            ? "text-gray-400"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        disabled={
                          !isAvailable ||
                          quantity >=
                            (produit.clothes
                              ? selectedSizeStock
                              : produit.stock)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-white font-medium ${
                      isAvailable
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isAvailable ? "Ajouter au panier" : "Produit indisponible"}
                  </button>

                  {/* Features */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-red-100 p-2 mr-3">
                        <Truck className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          Livraison rapide
                        </h4>
                        <p className="text-xs text-gray-500">
                          2-4 jours ouvrables
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full bg-red-100 p-2 mr-3">
                        <Package className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          Produit authentique
                        </h4>
                        <p className="text-xs text-gray-500">
                          Qualité garantie
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full bg-red-100 p-2 mr-3">
                        <Shield className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          Garantie sécurisée
                        </h4>
                        <p className="text-xs text-gray-500">
                          30 jours de garantie
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full bg-red-100 p-2 mr-3">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Support 24/7</h4>
                        <p className="text-xs text-gray-500">
                          Assistance en ligne
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === "details"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Détails du produit
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="font-title text-xl mb-4">
                    Description du produit
                  </h3>
                  <p className="text-gray-600 mb-4">{produit.description}</p>
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <h3 className="font-title text-xl mb-4">
                    Caractéristiques du produit
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-gray-200 py-2">
                      <span className="font-medium">Référence:</span> PROD-
                      {produit.id}
                    </div>
                    <div className="border-b border-gray-200 py-2">
                      <span className="font-medium">Disponibilité:</span>{" "}
                      {isAvailable ? "En stock" : "Rupture de stock"}
                    </div>
                    {produit.category && (
                      <div className="border-b border-gray-200 py-2">
                        <span className="font-medium">Catégorie:</span>{" "}
                        {produit.category.name}
                      </div>
                    )}
                    {produit.clothes && (
                      <>
                        <div className="border-b border-gray-200 py-2">
                          <span className="font-medium">Genre:</span>{" "}
                          {produit.clothes.gender === "homme"
                            ? "Homme"
                            : produit.clothes.gender === "femme"
                            ? "Femme"
                            : "Enfant"}
                        </div>
                        {produit.clothes.sizes && (
                          <div className="border-b border-gray-200 py-2">
                            <span className="font-medium">
                              Tailles disponibles:
                            </span>{" "}
                            {produit.clothes.sizes
                              .map((size) => size.label)
                              .join(", ")}
                          </div>
                        )}
                      </>
                    )}
                    <div className="border-b border-gray-200 py-2">
                      <span className="font-medium">Date d'ajout:</span>{" "}
                      {new Date(produit.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="font-title text-2xl text-white mb-6">
            Produits similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg"
              >
                <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <span className="font-title text-white text-xl">PRODUIT</span>
                </div>
                <div className="p-4">
                  <h3 className="font-title text-lg mb-2">Produit similaire</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    Description du produit similaire...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-section text-red-600 font-bold">
                      99.00 DH
                    </span>
                    <button className="flex items-center text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      ACHETER
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduitDetail;
