"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
}
