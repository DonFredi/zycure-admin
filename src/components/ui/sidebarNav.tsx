"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";
import Logo from "../icons/Logo";
import AdminLogoutButton from "../AdminLogoutButton";
import { adminSidebarLinks } from "@/lib/sidebarMenu";

type Props = {
  onNavigate?: () => void;
};

const SidebarNav = ({ onNavigate }: Props) => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      {/* 👈 THIS FIXES MOBILE */}
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {adminSidebarLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild className={isActive ? "bg-muted text-primary" : ""}>
                      <Link href={item.href} onClick={onNavigate} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

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
  );
};

export default SidebarNav;
