"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/providers";
import { getAuthHeaders } from "@/app/utils/getHeaders";

interface AdminStats {
  ordersCount: number;
  paymentsCount: number;
  refundsCount: number;
  totalOrderAmount: number;
  totalRefundAmount: number;
}

interface Order {
  _id: string;
  userId: string;
  programId: string;
  orderAmount: number;
  orderCurrency: string;
  status: string;
  createdAt: string;
  payments: Payment[];
}

interface Payment {
  _id: string;
  status: string;
  amount: number;
  currency: string;
  paymentMessage: string;
  paymentTime?: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "payments"
  >("overview");

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/payments/admin/stats", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/payments/my-orders", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchStats(), fetchOrders()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "ACTIVE":
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
      case "EXPIRED":
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="rounded bg-blue-50 text-blue-700 px-3 py-2">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="rounded bg-red-50 text-red-700 px-3 py-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "payments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Payments (
            {orders.reduce(
              (acc, order) => acc + (order.payments?.length || 0),
              0
            )}
            )
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.ordersCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Payments
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.paymentsCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Refunds
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats.refundsCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(stats.totalOrderAmount, "USD")}
            </p>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">
                      {formatCurrency(order.orderAmount, order.orderCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-semibold">{order.programId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payments</p>
                    <p className="font-semibold">
                      {order.payments?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No payments found.</p>
            </div>
          ) : (
            orders
              .filter((order) => order.payments && order.payments.length > 0)
              .map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg border p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(order.orderAmount, order.orderCurrency)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Payments ({order.payments?.length || 0})
                    </h4>
                    {order.payments?.map((payment, index) => (
                      <div
                        key={payment._id}
                        className="bg-gray-50 rounded p-4 border-l-4 border-blue-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">
                                Payment #{index + 1}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                  payment.status
                                )}`}
                              >
                                {payment.status}
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(
                                  payment.amount,
                                  payment.currency
                                )}
                              </span>
                            </div>

                            {payment.paymentMessage && (
                              <p className="text-gray-600 text-sm mb-1">
                                {payment.paymentMessage}
                              </p>
                            )}

                            {payment.paymentTime && (
                              <p className="text-gray-500 text-xs">
                                {new Date(payment.paymentTime).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
