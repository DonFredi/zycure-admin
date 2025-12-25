export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";

// 🔐 Cloudinary config (SERVER ONLY)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* ---------------- GET ---------------- */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getAdminDb();
  const snap = await db.collection("products").doc(id).get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = snap.data();

  return NextResponse.json({
    id: snap.id,
    ...data,
    createdAt: data?.createdAt?.toDate?.().toISOString() ?? null,
    updatedAt: data?.updatedAt?.toDate?.().toISOString() ?? null,
    imageSrc: typeof data?.imageSrc === "string" ? { url: data.imageSrc, publicId: null } : data?.imageSrc ?? null,
  });
}

/* ---------------- PUT ---------------- */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: productId } = await context.params;
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 404 });
  }

  const body = await req.json();
  const db = getAdminDb();
  const ref = db.collection("products").doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = snap.data();

  // 🧹 Cleanup old Cloudinary image if replaced
  if (body.imagePublicId && existing?.imagePublicId && body.imagePublicId !== existing.imagePublicId) {
    await cloudinary.uploader.destroy(existing.imagePublicId);
  }

  try {
    await ref.update({
      ...(body.title && { title: body.title }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.categoryId && { categoryId: body.categoryId }),
      ...(body.description && { description: body.description }),
      ...(body.benefit && { benefit: body.benefit }),
      ...(body.use && { use: body.use }),
      ...(body.imageSrc && { imageSrc: body.imageSrc }),
      ...(body.imagePublicId && { imagePublicId: body.imagePublicId }),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update product failed:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

/* ---------------- DELETE ---------------- */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const db = getAdminDb();
  const ref = db.collection("products").doc(id);
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
