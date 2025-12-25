export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { v2 as cloudinary } from "cloudinary";

// 🔐 SERVER ONLY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await context.params;
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) ?? "product";

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.collection("products").doc(productId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = snap.data();

    // 🧹 Delete old image
    if (existing?.imageSrc?.publicId) {
      await cloudinary.uploader.destroy(existing.imageSrc.publicId, {
        invalidate: true,
      });
    }

    // Convert file → buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
            public_id: `${title}-${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }

            if (!result) {
              return reject(new Error("Cloudinary returned no result"));
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        )
        .end(buffer);
    });

    // Update Firestore
    await ref.update({
      imageSrc: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      imageSrc: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (err) {
    console.error("Product image upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
