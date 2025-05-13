import React from "react";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Mail,
  Home,
  Building,
  CurrencyIcon as Cash,
  ArrowRight,
} from "lucide-react";
import { useCart } from "./Cart";
import instance from "../../../helpers/axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    addressType: "home",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // Shipping cost calculation
  const shippingCost = 30; // Fixed shipping cost in DH
  const grandTotal = total + shippingCost;

  // Check if cart is empty and redirect to shop
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate("/boutique");
    }
  }, [items, navigate, success]);

  // Handle shipping form changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle card info changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setCardInfo((prev) => ({
        ...prev,
        cardNumber: formatted,
      }));
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 2) {
        setCardInfo((prev) => ({
          ...prev,
          expiryDate: cleaned,
        }));
      } else {
        const month = cleaned.substring(0, 2);
        const year = cleaned.substring(2, 4);
        setCardInfo((prev) => ({
          ...prev,
          expiryDate: `${month}/${year}`,
        }));
      }
    }
  };

  // Validate shipping form
  const validateShippingForm = () => {
    if (!shippingInfo.fullName) return "Veuillez entrer votre nom complet";
    if (!shippingInfo.email) return "Veuillez entrer votre email";
    if (!shippingInfo.phone) return "Veuillez entrer votre numéro de téléphone";
    if (!shippingInfo.address) return "Veuillez entrer votre adresse";
    if (!shippingInfo.city) return "Veuillez entrer votre ville";
    if (!shippingInfo.postalCode) return "Veuillez entrer votre code postal";
    return null;
  };

  // Validate payment form
  const validatePaymentForm = () => {
    if (paymentMethod === "card") {
      if (
        !cardInfo.cardNumber ||
        cardInfo.cardNumber.replace(/\s/g, "").length < 16
      )
        return "Veuillez entrer un numéro de carte valide";
      if (!cardInfo.cardHolder)
        return "Veuillez entrer le nom du titulaire de la carte";
      if (!cardInfo.expiryDate || cardInfo.expiryDate.length < 5)
        return "Veuillez entrer une date d'expiration valide";
      if (!cardInfo.cvv || cardInfo.cvv.length < 3)
        return "Veuillez entrer un code CVV valide";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate current step
    let validationError = null;
    if (step === 1) {
      validationError = validateShippingForm();
      if (!validationError) {
        setStep(2);
        return;
      }
    } else if (step === 2) {
      validationError = validatePaymentForm();
      if (!validationError) {
        processOrder();
        return;
      }
    }

    if (validationError) {
      setError(validationError);
      return;
    }
  };

  // Process the order
  const processOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Order data to send to backend
      const orderData = {
        items,
        shippingInfo,
        paymentMethod,
        cardInfo: paymentMethod === "card" ? cardInfo : null,
        total,
        shippingCost,
        grandTotal,
      };

      console.log("Order processed:", orderData);

       try{
        const response = await instance.post("/orders", orderData)
        console.log(response);
        
      }catch(err){
        console.error(err);
      };
      // Show success and clear cart
      setSuccess(true);
      setStep(3);
      clear();
    } catch (err) {
      console.error("Error processing order:", err);
      setError(
        "Une erreur s'est produite lors du traitement de votre commande. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    } else {
      navigate(-1);
    }
  };

  // Render order summary
  const renderOrderSummary = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-title text-lg mb-4 pb-2 border-b border-gray-200">
        Résumé de la commande
      </h3>

      <div className="max-h-80 overflow-y-auto mb-4">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${item.selectedSize?.id || "default"}-${index}`}
            className="flex mb-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="ml-3 flex-grow">
              <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
              {item.selectedSize && (
                <p className="text-xs text-gray-500">
                  Taille: {item.selectedSize.label}
                </p>
              )}
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Qté: {item.quantity}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {(Number.parseFloat(item.price) * item.quantity).toFixed(2)}{" "}
                  DH
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-medium">{total.toFixed(2)} DH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de livraison</span>
          <span className="font-medium">{shippingCost.toFixed(2)} DH</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-medium text-lg">Total</span>
          <span className="font-bold text-red-600 text-lg">
            {grandTotal.toFixed(2)} DH
          </span>
        </div>
      </div>
    </div>
  );

  // Render shipping form
  const renderShippingForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-title text-lg mb-4 pb-2 border-b border-gray-200">
        Informations de livraison
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleShippingChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Votre nom complet"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Téléphone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="+212 6XX XXXXXX"
              />
            </div>
          </div>


          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresse
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Votre adresse complète"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ville
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Votre ville"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Code postal
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Code postal"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-red-600"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            Continuer vers le paiement
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-title text-lg mb-4 pb-2 border-b border-gray-200">
        Méthode de paiement
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <CreditCard className="h-5 w-5 ml-2 text-gray-500" />
              <span className="ml-2 text-gray-700">Carte bancaire</span>
            </label>

            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <Cash className="h-5 w-5 ml-2 text-gray-500" />
              <span className="ml-2 text-gray-700">
                Paiement à la livraison
              </span>
            </label>

            {/* <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <Wallet className="h-5 w-5 ml-2 text-gray-500" />
              <span className="ml-2 text-gray-700">
                Portefeuille électronique
              </span>
            </label> */}
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="border p-4 rounded-md bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-3">
              Détails de la carte
            </h4>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Numéro de carte
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardInfo.cardNumber}
                  onChange={handleCardChange}
                  maxLength="19"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div>
                <label
                  htmlFor="cardHolder"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Titulaire de la carte
                </label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={cardInfo.cardHolder}
                  onChange={handleCardChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="NOM PRÉNOM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardInfo.expiryDate}
                    onChange={handleCardChange}
                    maxLength="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardInfo.cvv}
                    onChange={handleCardChange}
                    maxLength="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-red-600"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Traitement en cours...
              </>
            ) : (
              <>Confirmer la commande</>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Render order confirmation
  const renderOrderConfirmation = () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>
      <h3 className="font-title text-2xl mb-2">Commande confirmée!</h3>
      <p className="text-gray-600 mb-6">
        Votre commande a été traitée avec succès. Vous recevrez un email de
        confirmation sous peu.
      </p>

      <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
        <h4 className="font-medium text-gray-700 mb-2">
          Détails de la commande
        </h4>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Numéro de commande:</span> ORD-
          {Math.floor(Math.random() * 10000000)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Date:</span>{" "}
          {new Date().toLocaleDateString("fr-FR")}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Montant total:</span>{" "}
          {grandTotal.toFixed(2)} DH
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Méthode de paiement:</span>{" "}
          {paymentMethod === "card"
            ? "Carte bancaire"
            : paymentMethod === "cash"
            ? "Paiement à la livraison"
            : "Portefeuille électronique"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/boutique"
          className="px-6 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          Continuer vos achats
        </Link>
        <Link
          to="/commandes"
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Voir mes commandes
        </Link>
      </div>
    </div>
  );

  // Render checkout steps
  const renderCheckoutSteps = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          1
        </div>
        <div className="text-xs font-medium ml-2">Livraison</div>
      </div>
      <div
        className={`h-1 w-12 mx-2 ${step >= 2 ? "bg-red-600" : "bg-gray-200"}`}
      ></div>
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          2
        </div>
        <div className="text-xs font-medium ml-2">Paiement</div>
      </div>
      <div
        className={`h-1 w-12 mx-2 ${step >= 3 ? "bg-red-600" : "bg-gray-200"}`}
      ></div>
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          3
        </div>
        <div className="text-xs font-medium ml-2">Confirmation</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-600 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/boutique"
            className="inline-flex items-center text-white hover:text-red-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Retour à la boutique
          </Link>
          <h1 className="font-title text-3xl text-white mt-2">
            Finaliser votre commande
          </h1>
        </div>

        {renderCheckoutSteps()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 1 && renderShippingForm()}
            {step === 2 && renderPaymentForm()}
            {step === 3 && renderOrderConfirmation()}
          </div>
          <div className="lg:col-span-1">
            {step < 3 && renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
