"use client";
import React from "react";

type OrdersFiltersProps = {
  status: "ALL" | "ACTIVE" | "PAID" | "EXPIRED" | "CANCELLED";
  onChange: (next: OrdersFiltersProps["status"]) => void;
};

export function OrdersFilters({ status, onChange }: OrdersFiltersProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <label htmlFor="status" className="text-sm text-gray-700">
        Status
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) =>
          onChange(e.target.value as OrdersFiltersProps["status"])
        }
        className="block rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="ALL">All</option>
        <option value="ACTIVE">Active</option>
        <option value="PAID">Paid</option>
        <option value="EXPIRED">Expired</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  );
}

