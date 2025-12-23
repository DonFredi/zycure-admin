import { NextRequest } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const body = await req.json();
  const ref = doc(db, "products", context.params.id);

  // Cleanup old images if replacing
  if (body.oldPublicIds?.length) {
    await Promise.all(body.oldPublicIds.map((id: string) => cloudinary.uploader.destroy(id)));
  }

  await updateDoc(ref, body.updateData);
  return new Response(null, { status: 204 });
}

export async function DELETE(req: NextRequest) {
  const { productId, publicIds } = await req.json();

  // 1️⃣ Delete Cloudinary images
  await Promise.all(publicIds.map((id: string) => cloudinary.uploader.destroy(id)));

  // 2️⃣ Delete Firestore doc
  await deleteDoc(doc(db, "products", productId));

  return new Response(null, { status: 204 });
}
