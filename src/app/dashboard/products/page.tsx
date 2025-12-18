"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { deleteProduct } from "@/lib/productHelpers";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(list);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-3 rounded shadow bg-white">
            <img src={product.imageUrl} alt={product.name} className="h-32 w-full object-cover mb-2 rounded" />
            <h2 className="font-bold">{product.name}</h2>
            <p>Category: {product.category}</p>
            <p>Price: KES {product.price}</p>
            <div className="flex gap-2 mt-2">
              <Link
                href={`/dashboard/edit-product/${product.id}`}
                className="bg-yellow-600 text-white p-1 rounded hover:bg-yellow-700"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteProduct(product.id, product.imageUrl)}
                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
