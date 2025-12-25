import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const docRef = await db.collection("categories").add({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: docRef.id,
      ...body,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
