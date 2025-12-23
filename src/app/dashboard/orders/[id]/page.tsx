import OrderDetailsClient from "./OrderDetailsClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { Order } from "@/types/order";

interface PageProps {
  params: { id: string };
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = params;

  const snap = await adminDb.collection("orders").doc(id).get();

  if (!snap.exists) {
    return <div>Order not found</div>;
  }

  const data = snap.data() as Omit<Order, "id"> & {};

  const order = {
    id: snap.id,
    ...data,
    createdAt: data?.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : null,
  };
  return <OrderDetailsClient order={order} />;
}
