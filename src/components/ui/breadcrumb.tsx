"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  lastLabel?: string; // e.g product title
}

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  "new-product": "New Product",
  orders: "Orders",
  users: "Users",
};

const Breadcrumb = ({ lastLabel }: BreadcrumbProps) => {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "admin"); // optional if you have /admin prefix

  return (
    <nav className="text-sm text-muted-foreground mb-3">
      <ol className="flex items-center gap-1 flex-wrap">
        {/* Dashboard root */}
        <li>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
        </li>

        {segments.slice(1).map((segment, index) => {
          const href = "/dashboard/" + segments.slice(1, index + 2).join("/");
          const isLast = index === segments.slice(1).length - 1;

          const label = isLast && lastLabel ? lastLabel : labelMap[segment] || segment.replace(/-/g, " ");

          return (
            <li key={href} className="flex items-center gap-1">
              <span>/</span>

              {isLast ? (
                <span className="font-medium text-foreground capitalize">{label}</span>
              ) : (
                <Link href={href} className="hover:text-foreground capitalize">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
