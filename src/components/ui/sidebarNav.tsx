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
    <Sidebar collapsible="none">
      <div className="h-full flex flex-col justify-between">
        {/* ───────────── TOP ───────────── */}
        <SidebarHeader>
          <Logo />
        </SidebarHeader>

        {/* ─────────── MIDDLE ─────────── */}
        <SidebarContent className="flex-1 overflow-y-auto flex-col justify-between">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminSidebarLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        className={isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}
                      >
                        <Link href={item.href} onClick={onNavigate} className="flex items-center gap-2 p-6">
                          <Icon className="h-6 w-6" />
                          <span className="text-md font-semibold">{item.label}</span>
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
