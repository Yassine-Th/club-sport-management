import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import instance from "../../../helpers/axios";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  // StickerIcon as Stadium, // StickerIcon might not be the best for "Journée", maybe use Hash or Tag
  Hash as JourneeIcon, // Using Hash for Journée as an example
  Ticket,
  Users,
  Info, // For "Informations importantes"
} from "lucide-react";

const BilliesDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0); // To keep track of selected category tab

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        // Endpoint should be `/tickets/{id}` if it follows REST conventions and your controller
        const response = await instance.get(`/ticket/${id}`);
        setTicket(response.data);
        if (
          response.data &&
          response.data.categories &&
          response.data.categories.length > 0
        ) {
          setSelectedCategory(response.data.categories[0]);
          setActiveTab(0); // Set first category as active by default
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(
          "Impossible de charger les détails du billet. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date non spécifiée";
    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString;
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, value)); // Basic min/max, can be improved with stock check
    if (selectedCategory && newQuantity > selectedCategory.pivot.stock) {
      setQuantity(
        selectedCategory.pivot.stock > 0 ? selectedCategory.pivot.stock : 1
      );
    } else {
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = () => {
    // In a real app, this would involve more complex logic
    // (e.g., checking stock, user authentication, payment processing)
    if (!selectedCategory) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }
    if (quantity > selectedCategory.pivot.stock) {
      alert(
        `Quantité demandée (${quantity}) dépasse le stock disponible (${selectedCategory.pivot.stock}) pour la catégorie ${selectedCategory.category}.`
      );
      return;
    }
    alert(
      `${quantity} billet(s) pour la catégorie "${
        selectedCategory.category
      }" (Porte ${selectedCategory.gate}) pour "${
        ticket.description ||
        (ticket.match
          ? `${ticket.match.my_club_name} vs ${ticket.match.opponent_club_name}`
          : "Événement")
      }" ont été ajoutés à votre panier (simulation).`
    );
  };

  const handleCategoryChange = (category, index) => {
    setSelectedCategory(category);
    setActiveTab(index);
    setQuantity(1); // Reset quantity when category changes
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <Ticket className="h-16 w-16 text-red-600 animate-pulse mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chargement des détails du billet...
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full bg-red-50 rounded-2xl p-8 text-center">
            <Ticket className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Billet non trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "Ce billet n'existe pas ou n'est plus disponible."}
            </p>
            <Link to="/billies" className="inline-block">
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                Retour à la billetterie
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure selectedCategory is valid before trying to access its properties
  const currentCategoryPrice = selectedCategory
    ? Number.parseFloat(selectedCategory.pivot.price)
    : 0;
  const totalPrice = currentCategoryPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-red-700 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/billetterie"
            className="inline-flex items-center text-sm text-white hover:underline font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la billetterie
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Ticket Image and Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={ticket.image}
                alt={
                  ticket.type === "match" && ticket.match
                    ? `${ticket.match.my_club_name || ""} vs ${
                        ticket.match.opponent_club_name || ""
                      }`
                    : ticket.description || "Détail du billet"
                }
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    ticket.type === "match" && ticket.match
                      ? `/placeholder.svg?height=500&width=1000&text=${encodeURIComponent(
                          ticket.match.my_club_name || "Équipe A"
                        )} vs ${encodeURIComponent(
                          ticket.match.opponent_club_name || "Équipe B"
                        )}`
                      : ticket.type === "event"
                      ? `/placeholder.svg?height=500&width=1000&text=${encodeURIComponent(
                          ticket.description || "Événement"
                        )}`
                      : "/placeholder.svg?height=500&width=1000&text=Image Indisponible";
                }}
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-block px-3 py-1 ${
                    ticket.type === "match" ? "bg-red-700" : "bg-blue-600"
                  } text-white text-sm font-bold rounded-full shadow-lg`}
                >
                  {ticket.type === "match" ? "Match" : "Événement"}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              {ticket.type === "match" && ticket.match ? (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {ticket.match.my_club_name || "Mon Équipe"} vs{" "}
                    {ticket.match.opponent_club_name || "Adversaire"}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {ticket.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Date et heure</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(ticket.match.match_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Lieu</p>
                        <p className="font-semibold text-gray-800">
                          {/* Prioritize ticket.location */}
                          {ticket.location ||
                            ticket.match.match_location ||
                            "Non spécifié"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <JourneeIcon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Compétition</p>
                        <p className="font-semibold text-gray-800">
                          Journée {ticket.match.journée || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Places disponibles (total)
                        </p>
                        <p className="font-semibold text-gray-800">
                          {ticket.categories?.reduce(
                            (sum, cat) => sum + (cat.pivot?.stock || 0),
                            0
                          ) || 0}{" "}
                          places
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Event type
                <>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {ticket.description || "Événement Spécial"}
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Date de l'événement
                        </p>
                        <p className="font-semibold text-gray-800">
                          {/* Use ticket.date for events */}
                          {formatDate(ticket.date)}
                        </p>
                      </div>
                    </div>
                    {ticket.location && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Lieu</p>
                          <p className="font-semibold text-gray-800">
                            {ticket.location}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Places disponibles (total)
                        </p>
                        <p className="font-semibold text-gray-800">
                          {ticket.categories?.reduce(
                            (sum, cat) => sum + (cat.pivot?.stock || 0),
                            0
                          ) || 0}{" "}
                          places
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="bg-red-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2" /> Informations importantes
                </h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex">
                    <span className="text-red-600 mr-2 font-bold">•</span>Les
                    billets ne sont ni échangeables ni remboursables.
                  </li>
                  <li className="flex">
                    <span className="text-red-600 mr-2 font-bold">•</span>
                    Présentez-vous au moins 1 heure avant le début.
                  </li>
                  <li className="flex">
                    <span className="text-red-600 mr-2 font-bold">•</span>Une
                    pièce d'identité peut être demandée à l'entrée.
                  </li>
                  <li className="flex">
                    <span className="text-red-600 mr-2 font-bold">•</span>Les
                    objets dangereux sont interdits.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-lg p-6 sticky top-24">
              {" "}
              {/* Increased shadow */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                Réserver vos billets
              </h2>
              {selectedCategory ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choisir une catégorie
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ticket.categories?.map((category, index) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category, index)}
                          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors border-2 ${
                            activeTab === index
                              ? "bg-red-600 text-white border-red-700"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {category.category}
                        </button>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Prix unitaire:</span>
                        <span className="font-bold text-lg text-red-700">
                          {currentCategoryPrice.toFixed(2)} MAD
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Porte d'entrée:</span>
                        <span className="font-semibold text-gray-800">
                          Porte {selectedCategory.gate || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Places restantes:</span>
                        <span
                          className={`font-semibold ${
                            selectedCategory.pivot.stock > 10
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {selectedCategory.pivot.stock || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quantité
                    </label>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        max={
                          selectedCategory.pivot.stock > 10
                            ? 10
                            : selectedCategory.pivot.stock
                        } // Max 10 or available stock
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            Number.parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full text-center py-2 border-x focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={
                          quantity >=
                            (selectedCategory.pivot.stock > 10
                              ? 10
                              : selectedCategory.pivot.stock) || // Max 10 or available stock
                          quantity >= selectedCategory.pivot.stock
                        }
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max {Math.min(10, selectedCategory.pivot.stock || 10)} par
                      commande.
                    </p>
                  </div>

                  <div className="border-t pt-4 space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-medium text-gray-800">
                        {totalPrice.toFixed(2)} MAD
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Frais de service:</span>
                      <span className="font-medium text-gray-800">
                        5.00 MAD
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold mt-3 pt-3 border-t">
                      <span>Total à payer:</span>
                      <span className="text-red-700">
                        {(totalPrice + 5).toFixed(2)} MAD
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center font-semibold text-lg disabled:opacity-70"
                    onClick={handlePurchase}
                    disabled={
                      !selectedCategory ||
                      selectedCategory.pivot.stock === 0 ||
                      quantity > selectedCategory.pivot.stock
                    }
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Acheter maintenant
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  Aucune catégorie de billet disponible pour la sélection.
                </p>
              )}
              <p className="text-xs text-gray-500 text-center mt-6">
                En achetant ce billet, vous acceptez les{" "}
                <Link to="/terms" className="text-red-600 hover:underline">
                  conditions générales de vente
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BilliesDetail;
