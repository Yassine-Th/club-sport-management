import React from "react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../../helpers/axios";
import {
  Package,
  ShoppingBag,
  Truck,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "../Header";
import Footer from "../Footer";

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/commandes/${userId}`);
        setCommandes(Array.isArray(res.data) ? res.data : [res.data]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de charger vos commandes. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    if (userId) {
      fetchCommandes();
    }
  }, [userId]);
  console.log(commandes);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Livré";
      case "processing":
        return "En traitement";
      case "cancelled":
        return "Annulé";
      case "pending":
      default:
        return "En attente";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-title text-3xl text-gray-800 mb-2">
                HISTORIQUE DES COMMANDES
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de vos commandes...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center max-w-2xl mx-auto">
                <p>{error}</p>
                <button
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            ) : commandes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
                <ShoppingBag className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="font-title text-2xl mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore passé de commande dans notre boutique.
                </p>
                <Link
                  to="/boutique"
                  className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-title hover:bg-red-700 transition-colors"
                >
                  VISITER LA BOUTIQUE
                </Link>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {commandes.map((commande) => (
                  <div
                    key={commande.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* En-tête de la commande */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <Package className="w-5 h-5 text-red-600 mr-2" />
                          <h3 className="font-title text-lg">
                            Commande #{commande.id}
                          </h3>
                          <span
                            className={`ml-3 text-xs px-2 py-1 rounded ${getStatusBadgeClass(
                              commande.status
                            )}`}
                          >
                            {getStatusLabel(commande.status)}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600">
                          <div className="flex items-center mr-4 mb-2 md:mb-0">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(commande.created_at)}
                          </div>
                          <div className="font-section text-red-600 font-bold">
                            {Number(commande.total_price).toFixed(2)} DH
                          </div>
                        </div>
                      </div>

                      <button
                        className="mt-4 flex items-center text-sm text-red-600 hover:text-red-700"
                        onClick={() => toggleOrderExpand(commande.id)}
                      >
                        {expandedOrders[commande.id] ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Masquer les détails
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Voir les détails
                          </>
                        )}
                      </button>
                    </div>

                    {/* Détails de la commande (conditionnellement affiché) */}
                    {expandedOrders[commande.id] && (
                      <div className="p-6 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Informations de livraison */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-title text-gray-800 mb-3 flex items-center">
                              <Truck className="w-4 h-4 mr-2 text-red-600" />
                              Informations de livraison
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold">Nom:</span>{" "}
                                {commande.ship_full_name}
                              </p>
                              <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {commande.ship_email}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Téléphone:
                                </span>{" "}
                                {commande.ship_phone}
                              </p>
                              <p>
                                <span className="font-semibold">Adresse:</span>{" "}
                                {commande.ship_address}
                              </p>
                              <p>
                                <span className="font-semibold">Ville:</span>{" "}
                                {commande.ship_city}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Code postal:
                                </span>{" "}
                                {commande.ship_postal_code}
                              </p>
                            </div>
                          </div>

                          {/* Informations de paiement */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-title text-gray-800 mb-3 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-red-600" />
                              Informations de paiement
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold">Méthode:</span>{" "}
                                {commande.payment_method === "cash"
                                  ? "Paiement à la livraison"
                                  : commande.payment_method}
                              </p>
                              <p>
                                <span className="font-semibold">Total:</span>{" "}
                                {Number(commande.total_price).toFixed(2)} DH
                              </p>
                              <p>
                                <span className="font-semibold">Statut:</span>{" "}
                                {getStatusLabel(commande.status)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Produits commandés */}
                        <h4 className="font-title text-gray-800 mb-3">
                          Produits commandés
                        </h4>
                        <div className="space-y-4">
                          {commande.order_items?.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row"
                            >
                              <div className="w-full md:w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center rounded-md overflow-hidden mb-4 md:mb-0 md:mr-4">
                                {item.product?.image ? (
                                  <img
                                    src={
                                      `http://127.0.0.1:8000/storage/${item.product.image} ` ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder.svg";
                                    }}
                                  />
                                ) : (
                                  <span className="font-title text-white text-sm">
                                    PRODUIT
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                  <h5 className="font-title text-lg">
                                    {item.product?.name || "Produit"}
                                  </h5>
                                  <div className="font-section text-red-600 font-bold">
                                    {Number(item.price).toFixed(2)} DH
                                  </div>
                                </div>
                                {item.product?.description && (
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {item.product.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <div>
                                    <span>Quantité: {item.quantity}</span>
                                    {item.size && (
                                      <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                                        Taille: {item.size.label}
                                      </span>
                                    )}
                                  </div>
                                  <span>
                                    Total:{" "}
                                    {(
                                      Number(item.price) * item.quantity
                                    ).toFixed(2)}{" "}
                                    DH
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/boutique"
                className="inline-block border-2 border-red-600 text-red-600 px-6 py-2 rounded-lg font-section hover:bg-red-600 hover:text-white transition-colors"
              >
                RETOUR À LA BOUTIQUE
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default MesCommandes;
