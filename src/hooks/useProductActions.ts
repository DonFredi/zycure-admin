"use client";

import { useState } from "react";
import { uploadProductImage } from "@/lib/uploadProductImage";
import { useRouter } from "next/navigation";

interface UpdatePayload {
  title?: string;
  price?: number;
  categoryId?: string;
  imageFile?: File | null;
  description?: string;
  use?: string;
  benefit?: string;
}

export function useProductActions(productId: string) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateProduct = async (payload: UpdatePayload) => {
    setLoading(true);

    try {
      let imageData;

      if (payload.imageFile) {
        imageData = await uploadProductImage(payload.imageFile, payload.title ?? "product");
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          price: payload.price,
          categoryId: payload.categoryId,
          benefit: payload.benefit,
          use: payload.use,
          desciption: payload.description,
          imageSrc: imageData?.url,
          imagePublicId: imageData?.publicId,
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete product failed:", err);
      alert("Failed to delete product");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProduct,
    deleteProduct,
    loading,
  };
}
