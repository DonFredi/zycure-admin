"use client";

import { useCategory } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { categories, name, setName, setImageFile, handleCategoryAdd, loading } = useCategory();

  if (loading) return <p>Loading categories...</p>;
  if (!categories.length) return <p>No categories found.</p>;

  if (loading) return <p>Loading categories...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Image URL"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <button onClick={handleCategoryAdd} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="border p-3 rounded shadow bg-white">
            <img src={category.imageSrc} alt={category.name} className="h-24 w-full object-cover rounded mb-2" />
            <h2>category:{category.name}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
