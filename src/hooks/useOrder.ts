"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";

export function useOrder(id?: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }

        const data: Order = await res.json();
        setOrder(data);
        setStatus(data?.status ?? "");
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  return {
    order,
    status,
    setStatus,
    loading,
    error,
  };
}
