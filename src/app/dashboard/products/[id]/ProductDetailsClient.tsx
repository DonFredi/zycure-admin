"use client";
import { Product } from "@/types/product";
import { useProductActions } from "@/hooks/useProductActions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCategory } from "@/hooks/useCategories";
import { Input } from "@/components/ui/input";

interface Props {
  product: Product;
}
export default function ProductDetailsClient({ product }: Props) {
  const { updateProduct, deleteProduct, loading } = useProductActions(product.id);
  const { categories } = useCategory();
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
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name ?? "Unknown";

  return (
    <div>
      {editing && (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-2"
        />
      )}
      {editing ? (
        <Input className="border p-2 w-full mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      ) : (
        <h2>Title:{product.title}</h2>
      )}
      {editing ? (
        <Input
          className="border p-2 w-full mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : 0)}
        />
      ) : (
        <p>Title:{product.price}</p>
      )}
      {editing ? (
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border p-2 rounded">
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      ) : (
        <p>Category:{categoryName}</p>
      )}
      {editing ? (
        <Input className="border p-2 w-full mb-2" value={benefit} onChange={(e) => setBenefit(e.target.value)} />
      ) : (
        <p> Benefit:{product.benefit}</p>
      )}
      {editing ? (
        <Input className="border p-2 w-full mb-2" value={use} onChange={(e) => setUse(e.target.value)} />
      ) : (
        <p>How to use :{product.use}</p>
      )}
      <p>Updated At: {product.updatedAt && new Date(product.updatedAt).toLocaleString()}</p>

      <div className="flex gap-2 mt-2">
        {editing ? (
          <>
            <Button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </Button>

            <Button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditing(true)} className="text-white">
              Edit
            </Button>
            <Button onClick={deleteProduct} className="text-white">
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
