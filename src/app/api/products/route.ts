import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("products").get();
    const products = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        imageSrc: typeof data.imageSrc === "string" ? { url: data.imageSrc, publicId: null } : data.imageSrc ?? null,
      };
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
