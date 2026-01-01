"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import SectionContainer from "@/components/section/SectionContainer";
import { useState } from "react";

const TABS = ["all", "pending", "confirmed", "delivered", "cancelled"];

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState("all");
  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found</p>;
  //   console.log(orders);
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* MOBILE: Dropdown */}
      <div className="block md:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TABS.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>

      {/* DESKTOP: Tabs */}
      <div className="hidden md:flex gap-4 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-3 capitalize text-sm font-medium border-b-2 transition
        ${
          activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <SectionContainer>
        <div className="flex flex-col gap-4">
          {filteredOrders.length === 0 ? (
            <p className="text-gray-500">No {activeTab} orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <Link
                href={`/dashboard/orders/${order.id}`}
                key={order.id}
                className="border p-3 rounded shadow bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-bold">Order ID: {order.id}</h2>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 capitalize">{order.status}</span>
                </div>

                <p>Name: {order?.customer?.name}</p>
                <p>Phone: {order?.customer?.phone}</p>
                <p>Location: {order?.customer?.location}</p>
                <p>Total: KES {order.totalPrice}</p>

                <h3 className="font-bold mt-2">Items:</h3>
                <ul className="list-disc list-inside">
                  {order?.items?.map((item, i) => (
                    <li key={i}>
                      {item.title} - {item.price} x {item.quantity} = KES {item.price * item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-blue-500 hover:underline w-fit mt-2">View Details</p>
              </Link>
            ))
          )}
        </div>
      </SectionContainer>
    </>
  );
}
