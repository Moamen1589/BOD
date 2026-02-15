import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Save } from "lucide-react";
import type { SiteSetting } from "@shared/schema";

export default function AdminSettings() {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest("PUT", "/api/admin/settings", { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "تم حفظ الإعداد بنجاح" });
      setNewKey("");
      setNewValue("");
      setEditingId(null);
      setEditValue("");
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    upsertMutation.mutate({ key: newKey.trim(), value: newValue });
  };

  const handleEdit = (setting: SiteSetting) => {
    setEditingId(setting.id);
    setEditValue(setting.value);
  };

  const handleSaveEdit = (key: string) => {
    upsertMutation.mutate({ key, value: editValue });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark" data-testid="text-settings-title">
        الإعدادات
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-dark">إضافة إعداد جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex items-end gap-3 flex-wrap">
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-sm font-medium text-brand-dark" htmlFor="setting-key">
                المفتاح
              </label>
              <Input
                id="setting-key"
                data-testid="input-setting-key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="اسم الإعداد"
                required
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-sm font-medium text-brand-dark" htmlFor="setting-value">
                القيمة
              </label>
              <Input
                id="setting-value"
                data-testid="input-setting-value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="قيمة الإعداد"
              />
            </div>
            <Button
              type="submit"
              className="bg-brand-gold text-white"
              disabled={upsertMutation.isPending}
              data-testid="button-add-setting"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-brand-dark">
            الإعدادات الحالية ({settings?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !settings || settings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-settings">
              لا توجد إعدادات
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المفتاح</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id} data-testid={`row-setting-${setting.id}`}>
                    <TableCell className="font-medium">{setting.key}</TableCell>
                    <TableCell>
                      {editingId === setting.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          data-testid={`input-edit-${setting.id}`}
                        />
                      ) : (
                        <span className="text-muted-foreground">{setting.value}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === setting.id ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSaveEdit(setting.key)}
                          disabled={upsertMutation.isPending}
                          data-testid={`button-save-${setting.id}`}
                        >
                          <Save />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(setting)}
                          data-testid={`button-edit-${setting.id}`}
                        >
                          تعديل
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
