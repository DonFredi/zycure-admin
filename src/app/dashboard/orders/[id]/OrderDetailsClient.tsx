"use client";
import { Order } from "@/types/order";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  order: Order & {
    createdAt: string | null;
  }; // plain string now
}

export default function OrderDetailsClient({ order }: Props) {
  const [status, setStatus] = useState<Order["status"]>(order.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateStatus() {
    setLoading(true);
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);

    if (res.ok) {
      router.refresh();
      alert("Order status updated");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="bg-white p-4 rounded shadow">
        <p>
          <strong>Order ID:</strong> {order.id ?? "N/A"}
        </p>
        <p>
          <strong>Name:</strong> {order.customer?.name ?? "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {order.customer?.phone ?? "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {order.customer?.location ?? "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {order.customer?.email ?? "N/A"}
        </p>
        <p>
          <strong>Created at:</strong> {order.createdAt ?? "N/A"}
        </p>

        <h2 className="font-bold mt-4">Items:</h2>
        <ul className="list-disc ml-4">
          {order.items?.map((item, index) => (
            <li key={`${item.productId}-${index}`}>
              {item.title} – {item.price} x {item.quantity} = {item.price * item.quantity}
            </li>
          )) ?? <li>No items</li>}
        </ul>

        <p className="mt-4">
          <strong>Total Price:</strong> KES {order.totalPrice ?? "N/A"}
        </p>

        <p className="mt-4">
          <strong>
            Status:
            {status}
          </strong>
        </p>
        <div className="w-full flex flex-row justify-start gap-2 items-center">
          <select
            className="border px-4 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as Order["status"])}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button disabled={loading} onClick={updateStatus} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Updating Order Status..." : "Update Order Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
