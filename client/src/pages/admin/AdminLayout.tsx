import { useQuery } from "@tanstack/react-query";
import { useLocation, Link, Redirect } from "wouter";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { LayoutDashboard, MessageSquare, Settings, LogOut, Briefcase, FileText, FolderOpen, Lightbulb } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard },
  { title: "المدونة", url: "/admin/blog", icon: FileText },
  { title: "مكتبة الأعمال", url: "/admin/work-library", icon: FolderOpen },
  { title: "الحلول الرقمية", url: "/admin/solutions", icon: Lightbulb },
  { title: "الخدمات", url: "/admin/services", icon: Briefcase },
  { title: "الرسائل", url: "/admin/messages", icon: MessageSquare },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery<{ id: string; username: string; role: string } | null>({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-almarai" dir="rtl">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/admin/login" />;
  }

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout");
    queryClient.clear();
    setLocation("/admin/login");
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <div className="font-almarai" dir="rtl">
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex min-h-screen w-full">
          <Sidebar side="right" collapsible="none">
            <SidebarHeader className="p-4 border-b">
              <Link href="/admin">
                <img
                  src="https://bod.com.sa/wp-content/uploads/2024/07/logo11581.png"
                  alt="Logo"
                  className="h-10 object-contain"
                  data-testid="img-sidebar-logo"
                />
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="font-almarai text-xs text-muted-foreground">إدارة المحتوى</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => {
                      const isActive = location === item.url;
                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            data-testid={`nav-${item.url.split("/").pop()}`}
                          >
                            <Link href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
