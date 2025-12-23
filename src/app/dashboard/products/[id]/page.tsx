import ProductDetailsClient from "./ProductDetailsClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const snap = await adminDb.collection("products").doc(id).get();

  if (!snap.exists) {
    return <div>Product not found</div>;
  }

  const data = snap.data() as Omit<Product, "id" | "createdAt"> & {
    createdAt?: { seconds: number };
  };

  const product = {
    id: snap.id,
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : null,
  };
  return <ProductDetailsClient product={product} />;
}
