"use client";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./icons/Logo";
import AdminLogoutButton from "./AdminLogoutButton";
import Breadcrumb from "./ui/breadcrumb";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex flex-row justify-between gap-2 w-full p-2">
        {/* Desktop Sidebar (FIXED) */}
        <aside className="hidden md:block w-64 border-r bg-background text-3xl">
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/products" className="hover:underline">
                          View Products
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/categories" className="hover:underline">
                          View Categories
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/orders" className="hover:underline">
                          View Orders
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <AdminLogoutButton />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </aside>

        {/* Mobile Sidebar */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/40">
            <aside className="w-64 h-full bg-background border-r">
              <Sidebar>
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin" onClick={() => setOpen(false)}>
                          Dashboard
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
              </Sidebar>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex flex-col w-full">
          {/* Mobile top bar */}
          <div className="md:hidden mb-4">
            <Button variant="ghost" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <Breadcrumb />

          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
