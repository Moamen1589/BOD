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
import type { DigitalSolution } from "@shared/schema";

const typeLabels: Record<string, string> = {
  platform: "منصة",
  "case-study": "دراسة حالة",
  publication: "إصدار",
};

export default function AdminSolutions() {
  const [editing, setEditing] = useState<DigitalSolution | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    solutionType: "platform",
    imageUrl: "",
    link: "",
    published: true,
  });
  const { toast } = useToast();

  const { data: solutions, isLoading } = useQuery<DigitalSolution[]>({
    queryKey: ["/api/admin/solutions"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/solutions", {
        ...form,
        imageUrl: form.imageUrl || null,
        link: form.link || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/solutions"] });
      setCreating(false);
      resetForm();
      toast({ title: "تم إنشاء الحل الرقمي بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      return apiRequest("PUT", `/api/admin/solutions/${editing.id}`, {
        ...form,
        imageUrl: form.imageUrl || null,
        link: form.link || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/solutions"] });
      setEditing(null);
      resetForm();
      toast({ title: "تم تحديث الحل الرقمي بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/solutions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/solutions"] });
      toast({ title: "تم حذف الحل الرقمي" });
    },
  });

  function resetForm() {
    setForm({ title: "", slug: "", description: "", content: "", solutionType: "platform", imageUrl: "", link: "", published: true });
  }

  function startEdit(sol: DigitalSolution) {
    setEditing(sol);
    setCreating(false);
    setForm({
      title: sol.title,
      slug: sol.slug,
      description: sol.description,
      content: sol.content,
      solutionType: sol.solutionType,
      imageUrl: sol.imageUrl || "",
      link: sol.link || "",
      published: sol.published,
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
        <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-admin-solutions-title">
          إدارة الحلول الرقمية
        </h1>
        {!showForm && (
          <Button onClick={startCreate} className="bg-brand-gold text-white gap-2" data-testid="button-create-solution">
            <Plus className="h-4 w-4" />
            إضافة حل رقمي
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-brand-dark">
              {editing ? "تعديل الحل الرقمي" : "إضافة حل رقمي جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">العنوان</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-solution-title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">الرابط (slug)</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" data-testid="input-solution-slug" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">الوصف المختصر</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} data-testid="textarea-solution-description" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">المحتوى التفصيلي</label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} data-testid="textarea-solution-content" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">النوع</label>
                  <Select value={form.solutionType} onValueChange={(v) => setForm({ ...form, solutionType: v })}>
                    <SelectTrigger data-testid="select-solution-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platform">منصة</SelectItem>
                      <SelectItem value="case-study">دراسة حالة</SelectItem>
                      <SelectItem value="publication">إصدار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">رابط الصورة</label>
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} dir="ltr" placeholder="https://..." data-testid="input-solution-image" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">رابط خارجي</label>
                  <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} dir="ltr" placeholder="https://..." data-testid="input-solution-link" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="checkbox-solution-published" />
                  <span className="text-sm font-medium text-brand-dark">منشور</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => editing ? updateMutation.mutate() : createMutation.mutate()}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-brand-gold text-white gap-2"
                  data-testid="button-save-solution"
                >
                  <Save className="h-4 w-4" />
                  {editing ? "تحديث" : "إنشاء"}
                </Button>
                <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); resetForm(); }} data-testid="button-cancel-solution">
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
          {solutions?.map((sol) => (
            <Card key={sol.id} data-testid={`row-solution-${sol.id}`}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-brand-dark truncate">{sol.title}</p>
                    <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                      {typeLabels[sol.solutionType] || sol.solutionType}
                    </Badge>
                    <Badge variant={sol.published ? "default" : "secondary"} className={sol.published ? "bg-brand-gold" : ""}>
                      {sol.published ? "منشور" : "مسودة"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">{sol.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(sol)} data-testid={`button-edit-solution-${sol.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(sol.id)} data-testid={`button-delete-solution-${sol.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {solutions?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">لا توجد حلول رقمية</p>
          )}
        </div>
      )}
    </div>
  );
}
