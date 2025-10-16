"use client";
import React from "react";
import { GetOrderResponse } from "@/types";

type OrderCardProps = {
  order: GetOrderResponse;
  onVerify: (orderId: string) => void;
};

export function OrderCard({ order, onVerify }: OrderCardProps) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-sm text-gray-500">
            Order #{order.orderNumber}
          </div>
          <div className="text-lg font-medium text-gray-900">
            {order.orderCurrency} {order.orderAmount}
          </div>
          <div className="text-sm text-gray-500">Status: {order.status}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVerify(order.orderId)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Verify Payment Status
          </button>
        </div>
      </div>
    </div>
  );
}

