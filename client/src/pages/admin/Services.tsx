import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

export default function AdminServices() {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    deliverables: "",
    icon: "FileText",
    sortOrder: 0,
    published: true,
  });
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        deliverables: form.deliverables.split("\n").filter(Boolean),
      };
      return apiRequest("POST", "/api/admin/services", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setCreating(false);
      resetForm();
      toast({ title: "تم إنشاء الخدمة بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const body = {
        ...form,
        deliverables: form.deliverables.split("\n").filter(Boolean),
      };
      return apiRequest("PUT", `/api/admin/services/${editing.id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setEditing(null);
      resetForm();
      toast({ title: "تم تحديث الخدمة بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({ title: "تم حذف الخدمة" });
    },
  });

  function resetForm() {
    setForm({ title: "", slug: "", description: "", deliverables: "", icon: "FileText", sortOrder: 0, published: true });
  }

  function startEdit(service: Service) {
    setEditing(service);
    setCreating(false);
    const dels = Array.isArray(service.deliverables) ? (service.deliverables as string[]).join("\n") : "";
    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      deliverables: dels,
      icon: service.icon,
      sortOrder: service.sortOrder,
      published: service.published,
    });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    resetForm();
  }

  const showForm = creating || editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-admin-services-title">
          إدارة الخدمات
        </h1>
        {!showForm && (
          <Button onClick={startCreate} className="bg-brand-gold text-white gap-2" data-testid="button-create-service">
            <Plus className="h-4 w-4" />
            إضافة خدمة
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-brand-dark">
              {editing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">العنوان</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-service-title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">الرابط (slug)</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" data-testid="input-service-slug" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">الوصف</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} data-testid="textarea-service-description" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">المخرجات (سطر لكل مخرج)</label>
                <Textarea value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} rows={5} data-testid="textarea-service-deliverables" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">الأيقونة</label>
                  <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} dir="ltr" data-testid="input-service-icon" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">الترتيب</label>
                  <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} data-testid="input-service-order" />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="checkbox-service-published" />
                    <span className="text-sm font-medium text-brand-dark">منشورة</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => editing ? updateMutation.mutate() : createMutation.mutate()}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-brand-gold text-white gap-2"
                  data-testid="button-save-service"
                >
                  <Save className="h-4 w-4" />
                  {editing ? "تحديث" : "إنشاء"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setCreating(false); setEditing(null); resetForm(); }}
                  data-testid="button-cancel-service"
                >
                  <X className="h-4 w-4" />
                  إلغاء
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {services?.map((service) => (
            <Card key={service.id} data-testid={`row-service-${service.id}`}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-brand-dark">{service.title}</p>
                    <Badge variant={service.published ? "default" : "secondary"} className={service.published ? "bg-brand-gold" : ""}>
                      {service.published ? "منشورة" : "مسودة"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">{service.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(service)} data-testid={`button-edit-service-${service.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(service.id)} data-testid={`button-delete-service-${service.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
