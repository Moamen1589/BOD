import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Eye, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

const purposeLabel: Record<string, string> = {
  inquiry: "استفسار",
  complaint: "شكوى",
  callback: "معاودة الاتصال",
};

const purposeFilters = [
  { value: "all", label: "الكل" },
  { value: "inquiry", label: "استفسار" },
  { value: "complaint", label: "شكوى" },
  { value: "callback", label: "معاودة الاتصال" },
];

export default function AdminMessages() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/admin/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages/unread-count"] });
      toast({ title: "تم تحديث حالة الرسالة" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages/unread-count"] });
      toast({ title: "تم حذف الرسالة" });
    },
  });

  const filtered = messages?.filter(
    (m) => filter === "all" || m.purpose === filter
  ) ?? [];

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-messages-title">
        الرسائل
      </h1>

      <div className="flex items-center gap-2 flex-wrap">
        {purposeFilters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            className={filter === f.value ? "bg-brand-gold text-white" : ""}
            onClick={() => setFilter(f.value)}
            data-testid={`button-filter-${f.value}`}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-dark">
            جميع الرسائل ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-messages">
              لا توجد رسائل
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الغرض</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((msg) => (
                  <>
                    <TableRow
                      key={msg.id}
                      className={!msg.isRead ? "bg-brand-light-gold/30" : ""}
                      data-testid={`row-message-${msg.id}`}
                    >
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell>{msg.email}</TableCell>
                      <TableCell dir="ltr" className="text-right">{msg.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {purposeLabel[msg.purpose] || msg.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(msg.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={msg.isRead ? "secondary" : "default"}
                          className={!msg.isRead ? "bg-brand-gold" : ""}
                        >
                          {msg.isRead ? "مقروءة" : "جديدة"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                            data-testid={`button-expand-${msg.id}`}
                          >
                            {expandedId === msg.id ? <ChevronUp /> : <ChevronDown />}
                          </Button>
                          {!msg.isRead && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => markReadMutation.mutate(msg.id)}
                              disabled={markReadMutation.isPending}
                              data-testid={`button-markread-${msg.id}`}
                            >
                              <Eye />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(msg.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${msg.id}`}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === msg.id && (
                      <TableRow key={`detail-${msg.id}`}>
                        <TableCell colSpan={7} className="bg-muted/50">
                          <div className="p-4 space-y-2" data-testid={`detail-message-${msg.id}`}>
                            <p className="text-sm font-medium text-brand-dark">نص الرسالة:</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
