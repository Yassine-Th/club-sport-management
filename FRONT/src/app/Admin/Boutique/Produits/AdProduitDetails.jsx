import React from "react";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { IconArrowLeft, IconEdit, IconAlertCircle } from "@tabler/icons-react";
import {
  Text,
  Badge,
  UnstyledButton,
  Loader,
  Alert,
  Button,
} from "@mantine/core";
import instance from "../../../../helpers/axios";

const AdProduitDetails = () => {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Détail Produit ${id} | HUSA Club Admin`;
    fetchProduit();
  }, [id]);

  const fetchProduit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get(`/produits/${id}`);
      const produitData = response.data.data;
      setProduit(produitData);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger les détails du produit. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  if (error && !produit) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert
          title="Erreur"
          color="red"
          icon={<IconAlertCircle size="1rem" />}
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
        <div className="mt-4">
          <Link to="/produits" className="text-red-700 hover:underline">
            Retour à la liste des produits
          </Link>
        </div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center text-gray-500">
          <p>Produit introuvable.</p>
          <Link
            to="/produits"
            className="text-red-700 hover:underline mt-4 inline-block"
          >
            Retour à la liste des produits
          </Link>
        </div>
      </div>
    );
  }

  const isClothing = !!produit.clothes;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with back button and actions */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Link to="/admin/boutique/produits">
            <button className="p-2 rounded-full text-red-700 hover:bg-red-100 transition">
              <IconArrowLeft size="1.5rem" />
            </button>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Détails du produit{" "}
            <span className="font-semibold text-red-600">{produit.name}</span>
          </h2>
        </div>

        <Link to={`/admin/boutique/produits/edit/${produit.id}`}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium transition-shadow shadow-md hover:shadow-lg">
            <IconEdit size="1.1rem" />
            Modifier
          </button>
        </Link>
      </div>

      {/* Error message if needed */}
      {error && produit && (
        <Alert
          title="Erreur"
          color="red"
          icon={<IconAlertCircle size="1rem" />}
          onClose={() => setError(null)}
          withCloseButton
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {/* Main content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column – Image & General Info */}
          <div>
            <img
              src={produit.image || "/placeholder.svg"}
              alt={produit.name}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg?height=256&width=256";
              }}
            />

            <div className="mt-6 bg-gray-50 p-5 rounded-md">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Informations générales
              </h3>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-gray-500">ID</dt>
                <dd className="font-medium">{produit.id}</dd>

                <dt className="text-gray-500">Créé le</dt>
                <dd className="font-medium">
                  {new Date(produit.created_at).toLocaleDateString()}
                </dd>

                <dt className="text-gray-500">Mis à jour le</dt>
                <dd className="font-medium">
                  {new Date(produit.updated_at).toLocaleDateString()}
                </dd>
              </dl>
            </div>
          </div>

          {/* Right Column – Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-red-800">
                {produit.name}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                  {produit.category?.name || "Non définie"}
                </span>
                {isClothing && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Vêtement
                  </span>
                )}
              </div>
              <p className="mt-4 text-gray-700 max-w-[80%] whitespace-normal break-words leading-relaxed">
                {produit.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Prix : {Number(produit.price).toFixed(2)}&nbsp;€
              </h3>
            </div>

            {!isClothing ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Stock
                </h4>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                    produit.stock > 10
                      ? "bg-green-100 text-green-700"
                      : produit.stock > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {produit.stock} unités
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-md">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Détails du vêtement
                  </h4>
                  <dl className="grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-gray-500">Genre</dt>
                    <dd className="font-medium capitalize">
                      {produit.clothes.gender}
                    </dd>

                    <dt className="text-gray-500">Type</dt>
                    <dd className="font-medium capitalize">
                      {produit.clothes.type}
                    </dd>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Stock par taille
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {produit.clothes.sizes.map((size) => (
                      <div
                        key={size.id}
                        className="flex justify-between items-center bg-white border border-gray-200 rounded-md p-3"
                      >
                        <span className="font-medium">{size.label}</span>
                        <span
                          className={`px-2 py-1 text-sm font-medium rounded ${
                            size.pivot.stock > 10
                              ? "bg-green-100 text-green-700"
                              : size.pivot.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {size.pivot.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdProduitDetails;
