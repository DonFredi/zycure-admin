import CategoryDetailsClient from "./CategoryDetailsClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { Category } from "@/types/category";
import { Order } from "@/types/order";

interface PageProps {
  params: { id: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;

  const snap = await adminDb.collection("categories").doc(id).get();

  if (!snap.exists) {
    return <div> Category not found</div>;
  }

  const data = snap.data() as Omit<Category, "id"> & {};

  const category = {
    id: snap.id,
    ...data,
  };
  return <CategoryDetailsClient category={category} />;
}
