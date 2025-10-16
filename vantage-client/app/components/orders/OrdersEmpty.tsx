"use client";
import React from "react";

type OrdersEmptyProps = {
  message?: string;
};

export function OrdersEmpty({
  message = "No orders found.",
}: OrdersEmptyProps) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 text-center text-gray-700">
      {message}
    </div>
  );
}

