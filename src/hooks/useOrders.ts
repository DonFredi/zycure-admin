"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
  };
}
