import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconEye,
  IconPackage,
  IconCalendar,
} from "@tabler/icons-react";
import { Text, Badge, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../../helpers/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    document.title = "Gestion des Commandes | HUSA Club Admin";
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/orders");
      setOrders(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les commandes. Veuillez réessayer.");
    } finally {
      setLoading(false);
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.ship_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ship_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? order.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <Text fw={700} size="xl" className="text-red-900">
          Gestion des Commandes
        </Text>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <IconX
            size="1rem"
            onClick={() => setError(null)}
            className="cursor-pointer"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="relative min-w-[200px]">
          <IconFilter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="1rem"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En traitement</option>
            <option value="completed">Livré</option>
            <option value="paid">Payé</option>
            <option value="shipped">Exécuté</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <IconPackage
                        size="1.2rem"
                        className="text-red-600 mr-2"
                      />
                      <span className="font-medium">#{order.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.ship_full_name}</div>
                      <div className="text-gray-500 text-xs">
                        {order.ship_email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <IconCalendar size="1rem" className="mr-1" />
                      {formatDate(order.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {Number.parseFloat(order.total_price).toFixed(2)} DH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.payment_method === "cash"
                      ? "Paiement à la livraison"
                      : order.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusBadgeColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end">
                      <Tooltip label="Voir détails">
                        <Link to={`${order.id}`}>
                          <UnstyledButton className="!text-blue-600 hover:!text-blue-800">
                            <IconEye size="1.2rem" />
                          </UnstyledButton>
                        </Link>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
