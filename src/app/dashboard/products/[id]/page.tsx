export const dynamic = "force-dynamic";
export const revalidate = 0;
import ProductDetailsClient from "./ProductDetailsClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { serializeTimestamp } from "@/lib/serializeTimetamps";
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

  const data = snap.data() as Omit<Product, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: { seconds: number };
    updatedAt?: { seconds: number };
  };

  const product = {
    id: snap.id,
    title: data.title,
    price: data.price,
    categoryId: data.categoryId,
    imageSrc: data.imageSrc,
    description: data.description,
    benefit: data.benefit,
    use: data.use,

    // ✅ SERIALIZED
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
  };
  return <ProductDetailsClient product={product} />;
}
