import { db, storage } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export async function deleteProduct(productId: string, imageUrl: string) {
  try {
    // Delete Firestore document
    await deleteDoc(doc(db, "products", productId));

    // Delete image from Storage
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef).catch(() => {});

    alert("Product deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Error deleting product");
  }
}
