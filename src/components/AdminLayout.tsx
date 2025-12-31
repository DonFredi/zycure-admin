"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SidebarNav from "./ui/sidebarNav";
import Breadcrumb from "./ui/breadcrumb";
import Cancel from "./ui/cancel";
import Menu from "./ui/menu";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  // Prevent background scroll on mobile
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background">
        <SidebarNav />
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-background border-r transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="block rounded-sm p-1 border border-primary text-primary"
        >
          <Cancel />
        </Button>

        <SidebarNav onNavigate={() => setOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Mobile Top Bar */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="md:hidden rounded-sm p-1 border border-primary text-primary"
          >
            <Menu />
          </Button>
        </div>

        <Breadcrumb />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
