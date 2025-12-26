"use client";

import Plus from "@/components/icons/Plus";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";

export default function ProductsPage() {
  const { products, loading } = useProducts();

  if (loading) return <p>Loading products...</p>;
  if (!products.length) return <p>No products found.</p>;
  console.log(products);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            href={`/dashboard/products/${product.id}`}
            key={product.id}
            className="border p-3 rounded shadow bg-white"
          >
            {product.imageSrc?.url ? (
              <img src={product.imageSrc.url} alt={product.title} className="h-32 w-full object-cover mb-2 rounded" />
            ) : (
              <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )}
            <h2>Name:{product.title}</h2>
            <p>Category: {product.categoryId}</p>
            <p>Price: KES {product.price}</p>
            <span className="text-blue-400 hover:underline">View Product</span>
          </Link>
        ))}
        <Link
          href="/dashboard/products/new-product"
          className=" border p-3 rounded shadow bg-white flex items-center justify-center text-4xl cursor-pointer hover:bg-gray-100"
        >
          <Button className="flex items-center text-lg">
            <Plus className="text-white" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
