"use client";

import AddProductForm from "@/components/AddProductForm";

export default function NewProductPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <AddProductForm
        onCancel={() => window.history.back()} // go back if canceled
        onSuccess={() => window.location.replace("/dashboard/products")} // go back to products list
      />
    </div>
  );
}
