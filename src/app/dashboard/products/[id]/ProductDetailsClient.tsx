"use client";
import { Product } from "@/types/product";
import { useProductActions } from "@/hooks/useProductActions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCategory } from "@/hooks/useCategories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import SectionContainer from "@/components/section/SectionContainer";

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
  const [description, setDescription] = useState(product.description);
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
      description,
      use,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(product.title);
    setPrice(product.price);
    setCategoryId(product.categoryId);
    setBenefit(product.benefit);
    setDescription(product.description);
    setImageFile(null);
    setEditing(false);
  };
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name ?? "Unknown";
  if (loading) return <p>Loading Product...</p>;

  return (
    <SectionContainer className="flex flex-col justify-between gap-2">
      {editing ? (
        <>
          <Label htmlFor="file">Image:</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-2"
          />
        </>
      ) : (
        <div className="relative w-full h-54 mt-2 border rounded overflow-hidden">
          <Image
            src={product.imageSrc?.url || "/images/placeholder.png"}
            alt={product.title}
            fill
            loading="eager"
            className="object-cover"
            sizes="160px"
          />
        </div>
      )}
      {editing ? (
        <>
          <Label htmlFor="name">Name:</Label>
          <Input className="border p-2 w-full mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </>
      ) : (
        <h2>
          <strong>Name: </strong>
          {product.title}
        </h2>
      )}
      {editing ? (
        <>
          <Label htmlFor="price">Price:</Label>
          <Input
            className="border p-2 w-full mb-2"
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : 0)}
          />
        </>
      ) : (
        <p>
          {" "}
          <strong>Price: </strong>
          {product.price}
        </p>
      )}
      {editing ? (
        <>
          <Label htmlFor="category">Category:</Label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border p-2 rounded">
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <p>
          <strong>Category: </strong>
          {categoryName}
        </p>
      )}
      {editing ? (
        <>
          <Label htmlFor="description">Description:</Label>
          <Input
            className="border p-2 w-full mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      ) : (
        <p>
          {" "}
          <strong>Description: </strong>
          {product.description}
        </p>
      )}
      {editing ? (
        <>
          <Label htmlFor="benefit">Benefit:</Label>
          <Input className="border p-2 w-full mb-2" value={benefit} onChange={(e) => setBenefit(e.target.value)} />
        </>
      ) : (
        <p>
          {" "}
          <strong>Benefit: </strong>
          {product.benefit}
        </p>
      )}
      {editing ? (
        <>
          <Label htmlFor="use">How to use:</Label>
          <Input className="border p-2 w-full mb-2" value={use} onChange={(e) => setUse(e.target.value)} />
        </>
      ) : (
        <p>
          <strong>How to use: </strong>
          {product.use}
        </p>
      )}
      {/* <p>Updated At: {product.updatedAt && new Date(product.updatedAt}</p> */}

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
    </SectionContainer>
  );
}
