import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WorkItem } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  "strategic-planning": "خطة استراتيجية",
  "procedural-guides": "دليل إجرائي",
  "annual-plans": "خطة سنوية",
  "community-initiatives": "مبادرة مجتمعية",
  "motion-graphics": "موشن جرافيك",
};

export default function AdminWorkLibrary() {
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "strategic-planning",
    imageUrl: "",
    fileUrl: "",
    published: true,
  });
  const { toast } = useToast();

  const { data: items, isLoading } = useQuery<WorkItem[]>({
    queryKey: ["/api/admin/work-library"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/work-library", {
        ...form,
        imageUrl: form.imageUrl || null,
        fileUrl: form.fileUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work-library"] });
      setCreating(false);
      resetForm();
      toast({ title: "تم إنشاء العمل بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      return apiRequest("PUT", `/api/admin/work-library/${editing.id}`, {
        ...form,
        imageUrl: form.imageUrl || null,
        fileUrl: form.fileUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work-library"] });
      setEditing(null);
      resetForm();
      toast({ title: "تم تحديث العمل بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/work-library/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work-library"] });
      toast({ title: "تم حذف العمل" });
    },
  });

  function resetForm() {
    setForm({ title: "", slug: "", description: "", content: "", category: "strategic-planning", imageUrl: "", fileUrl: "", published: true });
  }

  function startEdit(item: WorkItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      category: item.category,
      imageUrl: item.imageUrl || "",
      fileUrl: item.fileUrl || "",
      published: item.published,
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
        <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-admin-work-title">
          إدارة مكتبة الأعمال
        </h1>
        {!showForm && (
          <Button onClick={startCreate} className="bg-brand-gold text-white gap-2" data-testid="button-create-work">
            <Plus className="h-4 w-4" />
            إضافة عمل
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-brand-dark">
              {editing ? "تعديل العمل" : "إضافة عمل جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">العنوان</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-work-title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">الرابط (slug)</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" data-testid="input-work-slug" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">الوصف المختصر</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} data-testid="textarea-work-description" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">المحتوى التفصيلي</label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} data-testid="textarea-work-content" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">التصنيف</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger data-testid="select-work-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strategic-planning">خطة استراتيجية</SelectItem>
                      <SelectItem value="procedural-guides">دليل إجرائي</SelectItem>
                      <SelectItem value="annual-plans">خطة سنوية</SelectItem>
                      <SelectItem value="community-initiatives">مبادرة مجتمعية</SelectItem>
                      <SelectItem value="motion-graphics">موشن جرافيك</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">رابط الصورة</label>
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} dir="ltr" placeholder="https://..." data-testid="input-work-image" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">رابط الملف (PDF)</label>
                  <Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} dir="ltr" placeholder="https://..." data-testid="input-work-file" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="checkbox-work-published" />
                  <span className="text-sm font-medium text-brand-dark">منشور</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => editing ? updateMutation.mutate() : createMutation.mutate()}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-brand-gold text-white gap-2"
                  data-testid="button-save-work"
                >
                  <Save className="h-4 w-4" />
                  {editing ? "تحديث" : "إنشاء"}
                </Button>
                <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); resetForm(); }} data-testid="button-cancel-work">
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
          {items?.map((item) => (
            <Card key={item.id} data-testid={`row-work-${item.id}`}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-md object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-brand-dark truncate">{item.title}</p>
                      <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                      <Badge variant={item.published ? "default" : "secondary"} className={item.published ? "bg-brand-gold" : ""}>
                        {item.published ? "منشور" : "مسودة"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(item)} data-testid={`button-edit-work-${item.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-work-${item.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">لا توجد أعمال</p>
          )}
        </div>
      )}
    </div>
  );
}
