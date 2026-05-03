import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CheckCircle } from "lucide-react";
import { hasCompletedRegistration, saveRegistration } from "@/lib/registration";
import {
  extractTokenFromPayload,
  saveEncryptedAuthToken,
} from "@/lib/authToken";

type RegisterFormData = {
  organizationName: string;
  organizationEmail: string;
  organizationType: string;
  licenseNumber: string;
};

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<RegisterFormData>({
    organizationName: "",
    organizationEmail: "",
    organizationType: "",
    licenseNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (hasCompletedRegistration()) {
      setLocation("/ecstt");
    }
  }, [setLocation]);

  const registerMutation = useMutation<
    { id?: string },
    Error,
    RegisterFormData
  >({
    mutationFn: async (data) => {
      const registeredAt = new Date();
      const evaluationDate = registeredAt.toISOString().split("T")[0];
      const response = await fetch(
        "https://gold-weasel-489740.hostingersite.com/api/organizations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.organizationName,
            email: data.organizationEmail,
            type: data.organizationType,
            liscense_number: data.licenseNumber,
            evaluation_duration: 0,
            evaluator_name: "",
            evaluation_team: "",
            representative_name: "",
            evaluation_date: evaluationDate,
          }),
        },
      );
      if (!response.ok) throw new Error("Registration failed");

      const responseData = await response.json();
      const authToken = extractTokenFromPayload(responseData);
      if (authToken) {
        saveEncryptedAuthToken(authToken);
      }

      const generatedId =
        responseData?.id ??
        responseData?.data?.id ??
        responseData?.organization?.id ??
        crypto.randomUUID();

      saveRegistration({
        id: String(generatedId),
        name: data.organizationName,
        email: data.organizationEmail,
        type: data.organizationType,
        liscense_number: data.licenseNumber,
        evaluation_duration: 0,
        evaluator_name: "",
        evaluation_team: "",
        representative_name: "",
        evaluation_date: evaluationDate,
        registered_at: registeredAt.toISOString(),
      });

      return { id: String(generatedId) };
    },
    onSuccess: (data) => {
      setSubmitted(true);
      setTimeout(() => {
        setLocation(`/ecstt?orgId=${data.id}`);
      }, 2000);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
            <h1 className="text-4xl font-black text-brand-dark mb-4">
              تم التسجيل بنجاح
            </h1>
            <p className="text-xl text-brand-gray mb-8">
              جاري التوجيه إلى اختبار المنظومة...
            </p>
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
            <h1 className="text-4xl font-black text-brand-dark mb-2 text-center">
              اختبار المنظومة المجتمعية
            </h1>
            <p className="text-center text-brand-gray mb-12 text-lg">
              يرجى تسجيل بيانات مؤسستكم لبدء الاختبار
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  اسم المؤسسة
                </label>
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
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="organizationEmail"
                  value={formData.organizationEmail}
                  onChange={handleChange}
                  required
                  placeholder="example@organization.com"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  نوع الجهة
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "جمعية", value: "government" },
                    { label: "مؤسسة", value: "foundation" },
                    { label: "مبادرة", value: "non_profit" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-brand-gold/20 rounded-2xl cursor-pointer hover:border-brand-gold transition-all"
                    >
                      <input
                        type="radio"
                        name="organizationType"
                        value={option.value}
                        checked={formData.organizationType === option.value}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            organizationType: option.value,
                          }))
                        }
                        required
                        className="w-4 h-4 accent-brand-gold"
                      />
                      <span className="font-bold text-brand-dark">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  رقم الترخيص
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  placeholder="LIC-123456"
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
                <p className="text-red-700 font-bold">
                  حدث خطأ أثناء التسجيل. يرجى المحاولة مجددًا.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
