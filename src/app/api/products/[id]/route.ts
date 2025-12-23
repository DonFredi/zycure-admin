import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";

// 🔐 Cloudinary config (SERVER ONLY)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* ---------------- GET ---------------- */
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const snap = await adminDb.collection("products").doc(context.params.id).get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = snap.data();

  return NextResponse.json({
    id: snap.id,
    ...data,
    imageSrc: typeof data?.imageSrc === "string" ? { url: data.imageSrc, publicId: null } : data?.imageSrc ?? null,
  });
}

/* ---------------- PUT ---------------- */
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const body = await req.json();
  const productId = context.params.id;

  const ref = adminDb.collection("products").doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = snap.data();

  // 🧹 Cleanup old Cloudinary image if replaced
  if (body.imagePublicId && existing?.imagePublicId && body.imagePublicId !== existing.imagePublicId) {
    await cloudinary.uploader.destroy(existing.imagePublicId);
  }

  await ref.update({
    ...(body.title && { title: body.title }),
    ...(body.price !== undefined && { price: body.price }),
    ...(body.categoryId && { categoryId: body.categoryId }),
    ...(body.imageSrc && { imageSrc: body.imageSrc }),
    ...(body.imagePublicId && { imagePublicId: body.imagePublicId }),
    updatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

/* ---------------- DELETE ---------------- */
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const ref = adminDb.collection("products").doc(context.params.id);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = snap.data();

  // 🧹 Delete Cloudinary image
  if (data?.imagePublicId) {
    await cloudinary.uploader.destroy(data.imagePublicId);
  }

  // 🗑️ Delete Firestore document
  await ref.delete();

  return NextResponse.json({ success: true });
}
