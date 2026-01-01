import { Package, Layers, ShoppingCart, LayoutDashboard } from "lucide-react";

export const adminSidebarLinks = [
  {
    label: "Dashboard Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "View Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    label: "View Categories",
    href: "/dashboard/categories",
    icon: Layers,
  },
  {
    label: "View Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
];
