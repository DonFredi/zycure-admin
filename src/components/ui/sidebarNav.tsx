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
  SidebarFooter,
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
    <Sidebar collapsible="none" className="h-full flex flex-col justify-between">
      <div>
        {/* ───────────── TOP ───────────── */}
        <SidebarHeader>
          <Logo />
        </SidebarHeader>

        {/* ─────────── MIDDLE ─────────── */}
        <SidebarContent className="flex-1 overflow-y-auto">
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
                        <Link href={item.href} onClick={onNavigate} className="flex items-center gap-2 px-4 py-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ───────────── BOTTOM ───────────── */}
        <SidebarFooter className="border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <AdminLogoutButton />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default SidebarNav;
