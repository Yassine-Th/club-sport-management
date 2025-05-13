import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconUser,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCreditCard,
  IconPackage,
  IconCalendar,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Text, Badge, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../../helpers/axios";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    document.title = `Commande #${id} | HUSA Club Admin`;
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/orders/${id}`);
      setOrder(response.data);
      setCurrentStatus(response.data.status);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger les détails de la commande. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await instance.put(`/orders/${id}/status`, { status: newStatus });
      setCurrentStatus(newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du statut de la commande.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "paid":
        return "blue";
      case "shipped":
        return "green";
      case "completed":
        return "green";
      case "processing":
        return "blue";
      case "cancelled":
        return "gray";
      case "pending":
      default:
        return "yellow";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "shipped":
        return "Exécuté";
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <IconAlertCircle size="1.5rem" className="mr-2" />
          <span>{error}</span>
        </div>
        <UnstyledButton
          onClick={() => navigate(-1)}
          className="!text-red-600 !flex !items-center !gap-2 hover:!text-red-800"
        >
          <IconArrowLeft size="1rem" />
          <span>Retour aux commandes</span>
        </UnstyledButton>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
          <IconAlertCircle size="1.5rem" className="mr-2" />
          <span>Commande non trouvée</span>
        </div>
        <Link to="/admin/boutique/orders">
          <UnstyledButton className="!text-red-600 !flex !items-center !gap-2 hover:!text-red-800">
            <IconArrowLeft size="1rem" />
            <span>Retour aux commandes</span>
          </UnstyledButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/boutique/orders">
            <UnstyledButton className="!text-red-600 !flex !items-center !gap-2 hover:!text-red-800">
              <IconArrowLeft size="1rem" />
              <span>Retour</span>
            </UnstyledButton>
          </Link>
          <Text fw={700} size="xl" className="text-red-900">
            Commande #{order.id}
          </Text>
          <Badge color={getStatusBadgeColor(order.status)} size="lg">
            {getStatusLabel(order.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Text size="sm" fw={500} className="text-gray-700">
            Modifier le statut:
          </Text>

          <div className="relative">
            <select
              value={currentStatus}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updatingStatus}
              className="appearance-none bg-white w-48 pl-4 pr-10 py-2.5 border border-gray-300 rounded-md text-sm font-medium shadow-sm hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 transition-colors"
            >
              <option value="pending" className="py-1">
                En attente
              </option>
              <option value="processing" className="py-1">
                En traitement
              </option>
              <option value="completed" className="py-1">
                Livré
              </option>
              <option value="paid" className="py-1">
                Payé
              </option>
              <option value="shipped" className="py-1">
                Exécuté
              </option>
              <option value="cancelled" className="py-1">
                Annulé
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {updatingStatus ? (
            <div className="flex items-center bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-xs font-medium animate-pulse">
              <Loader size="xs" color="red" className="mr-2" />
              Mise à jour...
            </div>
          ) : (
            <div
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                currentStatus === "pending"
                  ? "bg-yellow-50 text-yellow-700"
                  : currentStatus === "processing"
                  ? "bg-blue-50 text-blue-700"
                  : currentStatus === "completed"
                  ? "bg-green-50 text-green-700"
                  : currentStatus === "paid"
                  ? "bg-green-50 text-green-700"
                  : currentStatus === "shipped"
                  ? "bg-green-50 text-green-700"
                  : currentStatus === "cancelled"
                  ? "bg-red-50 text-red-700"	
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              {currentStatus === "pending"
                ? "En attente"
                : currentStatus === "processing"
                ? "En traitement"
                : currentStatus === "completed"
                ? "Livré"
                : currentStatus === "paid"
                ? "Payé"
                : currentStatus === "shipped"
                ? "Exécuté"
                : "Annulé"}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconUser size="1.5rem" className="text-red-600" />
            <Text fw={600} size="lg">
              Informations client
            </Text>
          </div>
          <div className="space-y-3">
            <div>
              <Text size="sm" className="text-gray-500">
                Nom complet
              </Text>
              <Text>{order.ship_full_name}</Text>
            </div>
            <div className="flex items-center gap-2">
              <IconMail size="1rem" className="text-gray-500" />
              <Text>{order.ship_email}</Text>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone size="1rem" className="text-gray-500" />
              <Text>{order.ship_phone}</Text>
            </div>
            {order.user && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Text size="sm" className="text-gray-500 mb-2">
                  Compte utilisateur
                </Text>
                <div className="flex items-center gap-2">
                  <IconUser size="1rem" className="text-gray-500" />
                  <Text>{order.user.name}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail size="1rem" className="text-gray-500" />
                  <Text>{order.user.email}</Text>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconMapPin size="1.5rem" className="text-red-600" />
            <Text fw={600} size="lg">
              Adresse de livraison
            </Text>
          </div>
          <div className="space-y-2">
            <Text>{order.ship_full_name}</Text>
            <Text>{order.ship_address}</Text>
            <Text>
              {order.ship_postal_code}, {order.ship_city}
            </Text>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconCreditCard size="1.5rem" className="text-red-600" />
            <Text fw={600} size="lg">
              Informations de paiement
            </Text>
          </div>
          <div className="space-y-3">
            <div>
              <Text size="sm" className="text-gray-500">
                Méthode de paiement
              </Text>
              <Text className="capitalize">
                {order.payment_method === "cash"
                  ? "Paiement à la livraison"
                  : order.payment_method}
              </Text>
            </div>
            <div>
              <Text size="sm" className="text-gray-500">
                Total
              </Text>
              <Text fw={700} className="text-red-600 text-xl">
                {Number.parseFloat(order.total_price).toFixed(2)} DH
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <IconCalendar size="1rem" className="text-gray-500" />
              <Text size="sm">Commandé le {formatDate(order.created_at)}</Text>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconPackage size="1.5rem" className="text-red-600" />
            <Text fw={600} size="lg">
              Produits commandés
            </Text>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix unitaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taille
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.order_items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 mr-4">
                      <img
                        src={`http://127.0.0.1:8000/storage/${item.product?.image} `|| "/placeholder.svg"}
                        alt={item.product?.name}
                        className="h-12 w-12 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg?height=48&width=48";
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.product?.name}
                      </div>
                      <div className="text-gray-500 text-xs truncate max-w-xs">
                        {item.product?.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Number.parseFloat(item.price).toFixed(2)} DH
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.size ? item.size.label : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {(Number.parseFloat(item.price) * item.quantity).toFixed(2)}{" "}
                  DH
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-right text-sm font-medium text-gray-500"
              >
                Total
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                {Number.parseFloat(order.total_price).toFixed(2)} DH
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Link to="/admin/boutique/orders">
          <UnstyledButton className="!text-red-600 !flex !items-center !gap-2 hover:!text-red-800">
            <IconArrowLeft size="1rem" />
            <span>Retour aux commandes</span>
          </UnstyledButton>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
