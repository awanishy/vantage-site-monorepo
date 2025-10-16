"use client";
import React from "react";
import { GetOrderResponse } from "@/types";
import { OrderCard } from "./OrderCard";

type OrderListProps = {
  orders: GetOrderResponse[];
  onVerify: (orderId: string) => void;
};

export function OrderList({ orders, onVerify }: OrderListProps) {
  if (!orders.length) return null;
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <OrderCard key={o.orderId} order={o} onVerify={onVerify} />
      ))}
    </div>
  );
}

