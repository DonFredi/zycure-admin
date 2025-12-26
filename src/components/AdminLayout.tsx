"use client";

import Link from "next/link";
import Logo from "./icons/Logo";
import AdminLogoutButton from "./AdminLogoutButton";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col gap-4">
        <Logo />
        <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

        <Link href="/dashboard/products" className="hover:underline">
          View Products
        </Link>
        <Link href="/dashboard/categories" className="hover:underline">
          View Categories
        </Link>
        <Link href="/dashboard/orders" className="hover:underline">
          View Orders
        </Link>
        <AdminLogoutButton />
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default AdminLayout;
