"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadProductImage } from "@/lib/uploadProductImage";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [benefit, setBenefit] = useState("");
  const [use, setUse] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Add new product
  const handleAddProduct = async () => {
    if (!title || !price || !categoryId || !imageFile) {
      alert("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload image to Cloudinary
      const uploaded = await uploadProductImage(imageFile, title);
      // uploaded = { url: string; publicId: string }

      // 2️⃣ Save product to Firestore
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const docRef = await addDoc(collection(db, "products"), {
        title,
        price,
        categoryId,
        description,
        benefit,
        use,
        imageSrc: uploaded,
        createdAt,
        updatedAt,
      });

      // 3️⃣ Optimistic UI update
      setProducts((prev) => [
        ...prev,
        {
          id: docRef.id,
          title,
          price,
          categoryId,
          description,
          benefit,
          use,
          imageSrc: uploaded,
          createdAt,
          updatedAt,
        },
      ]);

      // Reset form
      setTitle("");
      setPrice(0);
      setCategoryId("");
      setDescription("");
      setBenefit("");
      setUse("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,

    // Form state
    title,
    setTitle,
    price,
    setPrice,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    benefit,
    setBenefit,
    use,
    setUse,
    setImageFile,

    handleAddProduct,
  };
}
