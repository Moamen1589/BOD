import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    licenseNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [orgId, setOrgId] = useState<string>("");

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Registration failed");
      return response.json();
    },
    onSuccess: (data) => {
      setOrgId(data.id);
      setSubmitted(true);
      localStorage.setItem("orgId", data.id);
      setTimeout(() => {
        setLocation(`/ecstt?orgId=${data.id}`);
      }, 2000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center  justify-center bg-brand-light-gold">
          <div className="max-w-md mx-auto text-center px-6 py-16">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-8" />
            <h1 className="text-4xl font-black text-brand-dark mb-4">تم التسجيل بنجاح</h1>
            <p className="text-xl text-brand-gray mb-8">جاري التوجيه إلى اختبار المنظومة...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      <div className="flex-1 mt-10 bg-brand-light-gold py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 border-t-8 border-brand-gold">
            <h1 className="text-4xl font-black text-brand-dark mb-2 text-center">اختبار المنظومة المجتمعية</h1>
            <p className="text-center text-brand-gray mb-12 text-lg">يرجى تسجيل بيانات مؤسستكم لبدء الاختبار</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">اسم المؤسسة</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم مؤسستك"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="organizationEmail"
                  value={formData.organizationEmail}
                  onChange={handleChange}
                  required
                  placeholder="البريد الإلكتروني الرسمي"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">رقم الترخيص</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  placeholder="رقم ترخيص المؤسسة"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-6 rounded-2xl text-2xl font-black shadow-lg hover:shadow-2xl transition-all"
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جاري المعالجة...
                  </span>
                ) : (
                  "ابدأ الاختبار الآن"
                )}
              </Button>
            </form>

            {registerMutation.isError && (
              <div className="mt-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-bold">حدث خطأ أثناء التسجيل. يرجى المحاولة مجددًا.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
