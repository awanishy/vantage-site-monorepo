"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiResponse, GetMyOrdersResponse } from "@/types";
import { OrdersHeader } from "@/app/components/orders/OrdersHeader";
import { OrdersLoading } from "@/app/components/orders/OrdersLoading";
import { OrdersEmpty } from "@/app/components/orders/OrdersEmpty";
import { OrderList } from "@/app/components/orders/OrderList";
import { OrdersFilters } from "@/app/components/orders/OrdersFilters";

// Temporary inline UI; split into components in next edits
export default function MyOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<GetMyOrdersResponse["orders"]>([]);
  const [status, setStatus] = useState<
    "ALL" | "ACTIVE" | "PAID" | "EXPIRED" | "CANCELLED"
  >("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = new URL("/api/payments/my-orders", window.location.origin);
        if (status !== "ALL") url.searchParams.set("status", status);
        const res = await fetch(
          url.toString(),
          // { credentials: "include" }
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            credentials: "include",
          }
        );

        if (res.status === 401) {
          setError("Please sign in to view your orders.");
          setOrders([]);
          return;
        }
        const data: ApiResponse<GetMyOrdersResponse> = await res.json();
        if (!res.ok || !data.success)
          throw new Error(
            data.message || data.error || "Failed to fetch orders"
          );
        setOrders(data.data?.orders || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [status]);

  const handleVerify = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/payments/orders/${orderId}/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });
      if (res.status === 401) {
        setError("Please sign in to verify payments.");
        return;
      }
      const data: ApiResponse = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || data.error || "Verification failed");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <OrdersHeader onRefresh={() => router.refresh()} />
      <OrdersFilters status={status} onChange={setStatus} />
      {loading && <OrdersLoading />}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          {error.toLowerCase().includes("sign in") && (
            <button
              onClick={() => router.push("/signin?callbackUrl=/my-orders")}
              className="ml-4 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign in
            </button>
          )}
        </div>
      )}
      {!loading && !error && orders.length === 0 && <OrdersEmpty />}
      <OrderList orders={orders} onVerify={handleVerify} />
    </div>
  );
}
