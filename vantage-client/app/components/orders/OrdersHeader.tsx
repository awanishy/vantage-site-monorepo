"use client";
import React from "react";

type OrdersHeaderProps = {
  title?: string;
  onRefresh?: () => void;
};

export function OrdersHeader({
  title = "My Orders",
  onRefresh,
}: OrdersHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Refresh
        </button>
      )}
    </div>
  );
}

