"use client";
import { Product } from "@/types/product";
import { useProductActions } from "@/hooks/useProductActions";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  product: Product;
}
export default function ProductDetailsClient({ product }: Props) {
  const { updateProduct, deleteProduct, loading } = useProductActions(product.id);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [benefit, setBenefit] = useState(product.benefit);
  const [use, setUse] = useState(product.use);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSave = async () => {
    await updateProduct({
      title,
      price,
      categoryId,
      imageFile,
      benefit,
      use,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(product.title);
    setPrice(product.price);
    setCategoryId(product.categoryId);
    setBenefit(product.benefit);
    setImageFile(null);
    setEditing(false);
  };

  return (
    <div>
      {editing && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-2"
        />
      )}
      {editing ? (
        <input className="border p-2 w-full mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      ) : (
        <h2>Title:{product.title}</h2>
      )}
      {editing ? (
        <input
          className="border p-2 w-full mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : 0)}
        />
      ) : (
        <p>Title:{product.price}</p>
      )}
      {editing ? (
        <input className="border p-2 w-full mb-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
      ) : (
        <p>Category:{product.categoryId}</p>
      )}
      {editing ? (
        <input className="border p-2 w-full mb-2" value={benefit} onChange={(e) => setBenefit(e.target.value)} />
      ) : (
        <p> Benefit:{product.benefit}</p>
      )}
      {editing ? (
        <input className="border p-2 w-full mb-2" value={use} onChange={(e) => setUse(e.target.value)} />
      ) : (
        <p>How to use :{product.use}</p>
      )}
      <div className="flex gap-2 mt-2">
        {editing ? (
          <>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>

            <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setEditing(true)}
              className="bg-yellow-600 text-white p-1 rounded hover:bg-yellow-700"
            >
              Edit
            </Button>
            <Button onClick={() => deleteProduct} className="bg-red-600 text-white p-1 rounded hover:bg-red-700">
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
