import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { authOptions } from "@/lib/authOptions";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // not logged in → login
  }

  if (!session.user?.admin) {
    redirect("/not-authorized"); // logged in but not admin
  }

  return (
    <SidebarProvider>
      <AdminLayout>{children}</AdminLayout>;
    </SidebarProvider>
  );
}
