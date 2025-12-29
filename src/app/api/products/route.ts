import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("products").get();
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
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title || !body.price || !body.categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const db = getAdminDb();
  const ref = await db.collection("products").add({
    title: body.title,
    price: body.price,
    categoryId: body.categoryId,
    benefit: body.benefit ?? "",
    use: body.use ?? "",
    description: body.description ?? "",
    imageSrc: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({
    success: true,
    productId: ref.id,
  });
}
