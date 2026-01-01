"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import SectionContainer from "@/components/section/SectionContainer";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found</p>;
  //   console.log(orders);
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <SectionContainer>
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link href={`/dashboard/orders/${order.id}`} key={order.id} className="border p-3 rounded shadow bg-white">
              <h2 className="font-bold">Order ID: {order.id}</h2>
              <p>Name: {order?.customer?.name}</p>
              <p>Phone: {order?.customer?.phone}</p>
              <p>Location: {order?.customer?.location}</p>
              <p>Total: KES {order.totalPrice}</p>
              <h3 className="font-bold mt-2">Items:</h3>
              <ul className="list-disc list-inside">
                {order?.items?.map((item, i) => (
                  <li key={i}>
                    {item.title}-{item.price} x {item.quantity} = KES {item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p className="text-blue-400 hover:underline w-fit">View Details</p>
            </Link>
          ))}
        </div>
      </SectionContainer>
    </>
  );
}
