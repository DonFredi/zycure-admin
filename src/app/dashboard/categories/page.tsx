"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "categories"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[];
      setCategories(list);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!name || !imageUrl) return alert("Please provide name and image URL");
    await addDoc(collection(db, "categories"), { name, imageUrl });
    setCategories([...categories, { id: Date.now().toString(), name, imageUrl }]);
    setName("");
    setImageUrl("");
  };

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
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="border p-3 rounded shadow bg-white">
            <img src={cat.imageUrl} alt={cat.name} className="h-24 w-full object-cover rounded mb-2" />
            <h2 className="font-bold">{cat.name}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
