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
import type { Article } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  news: "خبر",
  article: "مقال",
  newsletter: "نشرة بريدية",
};

export default function AdminBlog() {
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "article",
    imageUrl: "",
    publishDate: "",
    published: true,
  });
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/admin/blog"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/blog", {
        ...form,
        imageUrl: form.imageUrl || null,
        publishDate: form.publishDate || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setCreating(false);
      resetForm();
      toast({ title: "تم إنشاء المنشور بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      return apiRequest("PUT", `/api/admin/blog/${editing.id}`, {
        ...form,
        imageUrl: form.imageUrl || null,
        publishDate: form.publishDate || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setEditing(null);
      resetForm();
      toast({ title: "تم تحديث المنشور بنجاح" });
    },
    onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "تم حذف المنشور" });
    },
  });

  function resetForm() {
    setForm({ title: "", slug: "", excerpt: "", content: "", category: "article", imageUrl: "", publishDate: "", published: true });
  }

  function startEdit(post: Article) {
    setEditing(post);
    setCreating(false);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || "",
      publishDate: post.publishDate || "",
      published: post.published,
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
        <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-admin-blog-title">
          إدارة المدونة
        </h1>
        {!showForm && (
          <Button onClick={startCreate} className="bg-brand-gold text-white gap-2" data-testid="button-create-blog">
            <Plus className="h-4 w-4" />
            إضافة منشور
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-brand-dark">
              {editing ? "تعديل المنشور" : "إضافة منشور جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">العنوان</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-blog-title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">الرابط (slug)</label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" data-testid="input-blog-slug" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">الملخص</label>
                <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} data-testid="textarea-blog-excerpt" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1 block">المحتوى</label>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} data-testid="textarea-blog-content" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">التصنيف</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger data-testid="select-blog-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">خبر</SelectItem>
                      <SelectItem value="article">مقال</SelectItem>
                      <SelectItem value="newsletter">نشرة بريدية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">رابط الصورة</label>
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} dir="ltr" placeholder="https://..." data-testid="input-blog-image" />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1 block">تاريخ النشر</label>
                  <Input type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} dir="ltr" data-testid="input-blog-date" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="checkbox-blog-published" />
                  <span className="text-sm font-medium text-brand-dark">منشور</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => editing ? updateMutation.mutate() : createMutation.mutate()}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-brand-gold text-white gap-2"
                  data-testid="button-save-blog"
                >
                  <Save className="h-4 w-4" />
                  {editing ? "تحديث" : "إنشاء"}
                </Button>
                <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); resetForm(); }} data-testid="button-cancel-blog">
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
          {posts?.map((post) => (
            <Card key={post.id} data-testid={`row-blog-${post.id}`}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-brand-dark truncate">{post.title}</p>
                      <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                        {categoryLabels[post.category] || post.category}
                      </Badge>
                      <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-brand-gold" : ""}>
                        {post.published ? "منشور" : "مسودة"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.publishDate && <span>{post.publishDate}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(post)} data-testid={`button-edit-blog-${post.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(post.id)} data-testid={`button-delete-blog-${post.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {posts?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">لا توجد منشورات</p>
          )}
        </div>
      )}
    </div>
  );
}
