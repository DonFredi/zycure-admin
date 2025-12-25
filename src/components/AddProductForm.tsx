"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/lib/uploadProductImage";
import { useCategory } from "@/hooks/useCategories";

export default function AddProductForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const { categories } = useCategory();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [benefit, setBenefit] = useState("");
  const [description, setDescription] = useState("");
  const [use, setUse] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !categoryId) return alert("Title and Category required");

    setLoading(true);

    try {
      // 1️⃣ Create product first
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price,
          categoryId,
          benefit,
          use,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const { productId } = await res.json();

      // 2️⃣ Upload image
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("title", title);

        const uploadRes = await fetch(`/api/upload/product-image/${productId}`, {
          method: "PUT",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error("Image upload failed");
      }

      onSuccess();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white mt-4">
      <div>
        Product Name:
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        Price:
        <input
          type="number"
          min="0"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        Category:{" "}
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border p-2 mb-2 w-full">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        Description:
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        Benefits:{" "}
        <input
          type="text"
          placeholder="Benefit"
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        How to use:
        <input
          type="text"
          placeholder="Use"
          value={use}
          onChange={(e) => setUse(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        Product image:
        <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mb-2" />
      </div>

      <div className="flex gap-2">
        <button onClick={handleAdd} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Product"}
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
