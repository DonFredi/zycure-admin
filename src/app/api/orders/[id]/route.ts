import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
  }

  try {
    const docSnap = adminDb.collection("orders").doc(id);
    const snap = await docSnap.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    console.error("Error fetching order:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = await req.json();

  if (!status) {
    return NextResponse.json({ error: "Missing status value" }, { status: 400 });
  }

  try {
    await adminDb.collection("orders").doc(id).update({ status });
    return NextResponse.json({ message: "Order updated" });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
