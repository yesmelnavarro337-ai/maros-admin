import { Sidebar } from "@/features/layout/components/sidebar";
import { Header } from "@/features/layout/components/header";
import { SidebarProvider } from "@/features/layout/context/sidebar-provider";
import { AuthProvider } from "@/features/auth/context/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}