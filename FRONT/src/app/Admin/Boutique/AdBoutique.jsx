import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconShoppingCart,
  IconPackage,
  IconCategory,
  IconUsers,
  IconTrendingUp,
  IconAlertTriangle,
  IconCurrencyDollar,
  IconChevronRight,
  IconArrowUpRight,
  IconEye,
} from "@tabler/icons-react";
import { Text, Badge, Tooltip, UnstyledButton, Loader } from "@mantine/core";
import instance from "../../../helpers/axios";

const AdminBoutique = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Tableau de Bord Boutique | HUSA Club Admin";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // In a real implementation, you might have a dedicated endpoint for dashboard data
      // For now, we'll simulate with separate requests

      // Fetch orders for stats and recent orders
      const ordersResponse = await instance.get("/orders");
      const orders = Array.isArray(ordersResponse.data)
        ? ordersResponse.data
        : [];

      // Fetch products for stats and popular products
      const productsResponse = await instance.get("/produits");
      const products = productsResponse.data.data || [];

      // Calculate stats
      const totalSales = orders.reduce(
        (sum, order) => sum + Number.parseFloat(order.total_price),
        0
      );
      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      ).length;
      const lowStockProducts = products.filter(
        (product) => product.stock < 5
      ).length;

      // Set stats
      setStats({
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: new Set(orders.map((order) => order.user_id)).size,
        pendingOrders,
        lowStockProducts,
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));

      // Set popular products (for demo, just take first 4)
      // In a real implementation, you'd sort by sales or views
      setPopularProducts(products.slice(0, 4));

      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger les données du tableau de bord. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return Number.parseFloat(amount).toFixed(2) + " DH";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <Text fw={700} size="xl" className="text-red-900">
          Tableau de Bord Boutique
        </Text>
        <Text size="sm" className="text-gray-600">
          Vue d'ensemble de votre boutique en ligne
        </Text>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <Text size="sm" className="text-gray-500 mb-1">
                Ventes Totales
              </Text>
              <Text fw={700} size="xl" className="text-gray-900">
                {formatCurrency(stats.totalSales)}
              </Text>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <IconCurrencyDollar size="1.5rem" className="text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <IconArrowUpRight size="1rem" className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">depuis le mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <Text size="sm" className="text-gray-500 mb-1">
                Commandes Totales
              </Text>
              <Text fw={700} size="xl" className="text-gray-900">
                {stats.totalOrders}
              </Text>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <IconShoppingCart size="1.5rem" className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <IconArrowUpRight size="1rem" className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+5%</span>
            <span className="text-gray-500 ml-1">depuis le mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <Text size="sm" className="text-gray-500 mb-1">
                Produits
              </Text>
              <Text fw={700} size="xl" className="text-gray-900">
                {stats.totalProducts}
              </Text>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IconPackage size="1.5rem" className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <IconArrowUpRight size="1rem" className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+3%</span>
            <span className="text-gray-500 ml-1">depuis le mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <Text size="sm" className="text-gray-500 mb-1">
                Clients
              </Text>
              <Text fw={700} size="xl" className="text-gray-900">
                {stats.totalCustomers}
              </Text>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <IconUsers size="1.5rem" className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <IconArrowUpRight size="1rem" className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+8%</span>
            <span className="text-gray-500 ml-1">depuis le mois dernier</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
            <div className="flex items-center">
              <IconAlertTriangle
                size="1.5rem"
                className="text-yellow-600 mr-2"
              />
              <Text fw={600} size="lg" className="text-yellow-800">
                Commandes en attente
              </Text>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Text size="xl" fw={700} className="text-gray-900">
                {stats.pendingOrders}
              </Text>
              <Link to="/admin/boutique/orders">
                <UnstyledButton className="!text-yellow-600 !flex !items-center !gap-1 hover:!text-yellow-800">
                  <span>Voir toutes</span>
                  <IconChevronRight size="1rem" />
                </UnstyledButton>
              </Link>
            </div>
            <Text size="sm" className="text-gray-500 mt-1">
              Commandes qui nécessitent votre attention
            </Text>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100">
            <div className="flex items-center">
              <IconAlertTriangle size="1.5rem" className="text-red-600 mr-2" />
              <Text fw={600} size="lg" className="text-red-800">
                Produits en stock faible
              </Text>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Text size="xl" fw={700} className="text-gray-900">
                {stats.lowStockProducts}
              </Text>
              <Link to="/admin/boutique/produits">
                <UnstyledButton className="!text-red-600 !flex !items-center !gap-1 hover:!text-red-800">
                  <span>Voir tous</span>
                  <IconChevronRight size="1rem" />
                </UnstyledButton>
              </Link>
            </div>
            <Text size="sm" className="text-gray-500 mt-1">
              Produits avec un stock inférieur à 5 unités
            </Text>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IconShoppingCart size="1.5rem" className="text-red-600 mr-2" />
              <Text fw={600} size="lg">
                Commandes Récentes
              </Text>
            </div>
            <Link to="/admin/boutique/orders">
              <UnstyledButton className="!text-red-600 !flex !items-center !gap-1 hover:!text-red-800">
                <span>Voir toutes</span>
                <IconChevronRight size="1rem" />
              </UnstyledButton>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucune commande récente
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.ship_full_name || "Client"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.total_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={getStatusBadgeColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Tooltip label="Voir détails">
                          <UnstyledButton className="!text-blue-600 hover:!text-blue-800">
                            <IconEye size="1.2rem" />
                          </UnstyledButton>
                        </Tooltip>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IconTrendingUp size="1.5rem" className="text-red-600 mr-2" />
              <Text fw={600} size="lg">
                Produits Populaires
              </Text>
            </div>
            <Link to="/admin/boutique/produits">
              <UnstyledButton className="!text-red-600 !flex !items-center !gap-1 hover:!text-red-800">
                <span>Voir tous</span>
                <IconChevronRight size="1rem" />
              </UnstyledButton>
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.length === 0 ? (
              <div className="col-span-4 text-center text-gray-500 py-4">
                Aucun produit disponible
              </div>
            ) : (
              popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="h-40 bg-gray-200 relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg?height=160&width=320";
                      }}
                    />
                    {product.stock < 5 && (
                      <div className="absolute top-2 right-2">
                        <Badge color="red">Stock faible</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Text fw={600} className="mb-1 truncate">
                      {product.name}
                    </Text>
                    <div className="flex justify-between items-center">
                      <Text fw={700} className="text-red-600">
                        {formatCurrency(product.price)}
                      </Text>
                      <Badge color={product.stock > 0 ? "green" : "red"}>
                        {product.stock > 0
                          ? `En stock: ${product.stock}`
                          : "Épuisé"}
                      </Badge>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Link to={`/admin/produits/${product.id}`}>
                        <UnstyledButton className="!text-blue-600 !text-sm !flex !items-center !gap-1 hover:!text-blue-800">
                          <span>Détails</span>
                          <IconChevronRight size="0.8rem" />
                        </UnstyledButton>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/admin/boutique/produits">
          <div className="bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 transition-colors">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <IconPackage size="1.5rem" className="text-red-600" />
            </div>
            <div>
              <Text fw={600}>Gérer les Produits</Text>
              <Text size="xs" className="text-gray-500">
                Ajouter, modifier, supprimer
              </Text>
            </div>
          </div>
        </Link>

        <Link to="/admin/boutique/categories">
          <div className="bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 transition-colors">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <IconCategory size="1.5rem" className="text-blue-600" />
            </div>
            <div>
              <Text fw={600}>Gérer les Catégories</Text>
              <Text size="xs" className="text-gray-500">
                Organiser vos produits
              </Text>
            </div>
          </div>
        </Link>

        <Link to="/admin/boutique/orders">
          <div className="bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 transition-colors">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <IconShoppingCart size="1.5rem" className="text-yellow-600" />
            </div>
            <div>
              <Text fw={600}>Gérer les Commandes</Text>
              <Text size="xs" className="text-gray-500">
                Suivre et mettre à jour
              </Text>
            </div>
          </div>
        </Link>

        <Link to="/admin/boutique/users">
          <div className="bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <IconUsers size="1.5rem" className="text-purple-600" />
            </div>
            <div>
              <Text fw={600}>Gérer les Clients</Text>
              <Text size="xs" className="text-gray-500">
                Voir les informations clients
              </Text>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminBoutique;
