"use client";

import Plus from "@/components/icons/Plus";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";
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
            className="w-70 h-fit flex flex-col  border rounded-sm"
          >
            <div className="relative w-full h-48 overflow-hidden ">
              <Image
                src={product.imageSrc?.url || "/images/placeholder.png"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            {/* {product.imageSrc?.url ? (
              <img src={product.imageSrc.url} alt={product.title} className="h-32 w-full object-cover mb-2 rounded" />
            ) : (
              <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )} */}
            <div className="flex flex-col items-center gap-2 px-4 py-2 h-fit">
              <h2>{product.title}</h2>
              {/* <p>Category: {product.categoryId}</p> */}
              <p> KES {product.price}</p>
              <Button className="w-full">View Product</Button>
            </div>
          </Link>
        ))}
        <Link
          href="/dashboard/products/new-product"
          className="shadow bg-white flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-10 w-70 h-full flex-col  border rounded-sm "
        >
          <p>Add new product</p>
          <Button className="flex items-center text-lg">
            <Plus className="text-white" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
