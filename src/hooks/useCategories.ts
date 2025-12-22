import { useState, useEffect } from "react";
import { Category } from "@/types/category";

import { uploadCategoryImage } from "@/lib/uploadCategoryImage"; // Cloudinary upload helper

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(errorData.error || "Upload failed");
        }

        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add category with image upload
  const handleCategoryAdd = async () => {
    if (!name || !imageFile) {
      alert("Please provide category name and image");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload image to Cloudinary
      const res = await fetch("/api/upload/category-image", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append("name", name); // ✅ send name, not slug
          return formData;
        })(),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      const { url: imageSrc, slug } = data; // ✅ get slug from server

      // 2️⃣ Save category in Firestore
      // 2️⃣ Save category via API (Admin SDK)
      const saveRes = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          imageSrc,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save category");
      }

      const savedCategory = await saveRes.json();

      // Optimistic UI update
      setCategories((prev) => [...prev, savedCategory]);

      // 4️⃣ Reset input fields
      setName("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    name,
    setName,
    setImageFile,
    handleCategoryAdd,
    loading,
    error,
  };
}
