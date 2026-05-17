import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CheckCircle } from "lucide-react";
import { hasCompletedRegistration, saveRegistration } from "@/lib/registration";
import {
  clearStoredAuthToken,
  saveEncryptedAuthToken,
  extractTokenFromPayload,
} from "@/lib/authToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type RegisterFormData = {
  organizationName: string;
  organizationEmail: string;
  organizationPassword: string;
  organizationPasswordConfirmation: string;
  organizationType: string;
  licenseNumber: string;
  phoneNumber: string;
};

const registerSchema = z.object({
  organizationEmail: z
    .string()
    .trim()
    .email("من فضلك أدخل بريدًا إلكترونيًا صالحًا."),
  organizationPassword: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل."),
});

type RegisterFieldErrors = Partial<
  Record<"organizationEmail" | "organizationPassword", string>
>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formSchema = z
    .object({
      organizationName: z.string().trim().min(1, "اسم المؤسسة مطلوب."),
      organizationEmail: z
        .string()
        .trim()
        .email("من فضلك أدخل بريدًا إلكترونيًا صالحًا."),
      organizationPassword: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل."),
      organizationPasswordConfirmation: z.string(),
      organizationType: z.string().min(1, "نوع الجهة مطلوب."),
      licenseNumber: z.string().trim().min(1, "رقم الترخيص مطلوب."),
      phoneNumber: z.string().trim().min(1, "رقم الهاتف مطلوب."),
    })
    .refine(
      (data) =>
        data.organizationPassword === data.organizationPasswordConfirmation,
      {
        path: ["organizationPasswordConfirmation"],
        message: "كلمات المرور غير متطابقة.",
      },
    );

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      organizationEmail: "",
      organizationPassword: "",
      organizationPasswordConfirmation: "",
      organizationType: "",
      licenseNumber: "",
      phoneNumber: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const hasRegistration = hasCompletedRegistration();
    if (hasRegistration) {
      setLocation("/login");
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
            password: data.organizationPassword,
            password_confirmation: data.organizationPasswordConfirmation,
            type: data.organizationType,
            liscense_number: data.licenseNumber,
            phone_number: data.phoneNumber,
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

      // If API returned a token on registration, save it into session (encrypted)
      try {
        const possibleToken = extractTokenFromPayload(responseData);
        if (possibleToken) {
          saveEncryptedAuthToken(possibleToken);
        } else {
          // Ensure no stale token remains
          clearStoredAuthToken();
        }
      } catch {
        clearStoredAuthToken();
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
        phone_number: data.phoneNumber,
        evaluation_duration: 0,
        evaluator_name: "",
        evaluation_team: "",
        representative_name: "",
        evaluation_date: evaluationDate,
        registered_at: registeredAt.toISOString(),
      });

      // Also save the registration in sessionStorage for immediate UI updates
      sessionStorage.setItem(
        REGISTRATION_STORAGE_KEY,
        JSON.stringify({
          id: String(generatedId),
          name: data.organizationName,
          email: data.organizationEmail,
        }),
      );
      window.dispatchEvent(new CustomEvent("registration:updated"));
      // token handling done above

      return { id: String(generatedId) };
    },
    onSuccess: (data, variables) => {
      setSubmitted(true);
      setTimeout(() => {
        setLocation(
          `/login?email=${encodeURIComponent(variables.organizationEmail)}`,
        );
      }, 2000);
    },
  });

  const handleSubmit = (data: RegisterFormData) => {
    setSubmitError("");
    registerMutation.mutate(data);
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

            <form
              onSubmit={rhfHandleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  اسم المؤسسة
                </label>
                <input
                  type="text"
                  {...register("organizationName")}
                  placeholder="أدخل اسم مؤسستك"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.organizationName?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  {...register("organizationEmail")}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="example@organization.com"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.organizationEmail?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.organizationEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  {...register("organizationPassword")}
                  autoComplete="new-password"
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.organizationPassword?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.organizationPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  {...register("organizationPasswordConfirmation")}
                  autoComplete="new-password"
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.organizationPasswordConfirmation?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.organizationPasswordConfirmation.message}
                  </p>
                )}
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
                      onClick={() =>
                        setValue("organizationType", option.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    >
                      <input
                        type="radio"
                        checked={watch("organizationType") === option.value}
                        readOnly
                        className="w-4 h-4 accent-brand-gold"
                      />
                      <span className="font-bold text-brand-dark">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.organizationType?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.organizationType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  رقم الترخيص
                </label>
                <input
                  type="text"
                  {...register("licenseNumber")}
                  placeholder="LIC-123456"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.licenseNumber?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="+966 5XXXXXXXX"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.phoneNumber?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
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
                  "تسجيل الحساب"
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

            {submitError && !registerMutation.isError && (
              <div className="mt-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-bold">{submitError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
