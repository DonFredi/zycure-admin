"use client";

import { Input } from "@/components/ui/input";
import { useCategory } from "@/hooks/useCategories";
import Image from "next/image";

export default function CategoriesPage() {
  const { categories, name, setName, setImageFile, handleCategoryAdd, loading } = useCategory();

  if (loading) return <p>Loading categories...</p>;
  if (!categories.length) return <p>No categories found.</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-fit"
        />
        <Input
          placeholder="Image URL"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border p-2 rounded w-fit"
        />
        <button onClick={handleCategoryAdd} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="border p-3 rounded shadow bg-white">
            <div className="relative w-full aspect-4/3 mb-2">
              <Image
                src={
                  typeof category.imageSrc === "string"
                    ? category.imageSrc
                    : category.imageSrc?.url || "/images/placeholder.png"
                }
                alt={category.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <h2>Category: {category.name}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
