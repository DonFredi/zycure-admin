import CategoryDetailsClient from "./CategoryDetailsClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { Category } from "@/types/category";

interface PageProps {
  params: { id: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = params;
  const db = getAdminDb();
  const snap = await db.collection("categories").doc(id).get();

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
