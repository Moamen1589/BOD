import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Mail, FileText, FolderOpen, Lightbulb, Briefcase } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

interface DashboardData {
  totalMessages: number;
  unreadMessages: number;
  totalBlogPosts: number;
  totalWorkItems: number;
  totalSolutions: number;
  totalServices: number;
}

export default function AdminDashboard() {
  const { data: messages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
  });

  const { data: dashboard, isLoading: dashboardLoading } = useQuery<DashboardData>({
    queryKey: ["/api/admin/dashboard"],
  });

  const isLoading = messagesLoading || dashboardLoading;

  const stats = [
    {
      title: "رسائل غير مقروءة",
      value: dashboard?.unreadMessages ?? 0,
      icon: Mail,
      color: "bg-brand-light-gold text-brand-gold-dark",
    },
    {
      title: "إجمالي الرسائل",
      value: dashboard?.totalMessages ?? 0,
      icon: MessageSquare,
      color: "bg-brand-light-gold text-brand-gold",
    },
    {
      title: "منشورات المدونة",
      value: dashboard?.totalBlogPosts ?? 0,
      icon: FileText,
      color: "bg-brand-light-gold text-brand-gold",
    },
    {
      title: "مكتبة الأعمال",
      value: dashboard?.totalWorkItems ?? 0,
      icon: FolderOpen,
      color: "bg-brand-light-gold text-brand-gold",
    },
    {
      title: "الحلول الرقمية",
      value: dashboard?.totalSolutions ?? 0,
      icon: Lightbulb,
      color: "bg-brand-light-gold text-brand-gold",
    },
    {
      title: "الخدمات",
      value: dashboard?.totalServices ?? 0,
      icon: Briefcase,
      color: "bg-muted text-brand-gray",
    },
  ];

  const recentMessages = messages?.slice(0, 5) ?? [];

  const purposeLabel: Record<string, string> = {
    inquiry: "استفسار",
    complaint: "شكوى",
    callback: "معاودة الاتصال",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-dashboard-title">
        لوحة التحكم
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold text-brand-dark" data-testid={`text-stat-value-${stat.title}`}>
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-dark" data-testid="text-recent-messages-title">
            آخر الرسائل
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messagesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-no-messages">
              لا توجد رسائل
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-md border"
                  data-testid={`row-message-${msg.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-dark truncate">{msg.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{msg.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={msg.isRead ? "secondary" : "default"} className={!msg.isRead ? "bg-brand-gold" : ""}>
                      {msg.isRead ? "مقروءة" : "جديدة"}
                    </Badge>
                    <Badge variant="outline">
                      {purposeLabel[msg.purpose] || msg.purpose}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
