import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  extractTokenFromPayload,
  getStoredEncryptedAuthToken,
  saveEncryptedAuthToken,
} from "@/lib/authToken";
import { REGISTRATION_STORAGE_KEY } from "@/lib/registration";

type LoginFormData = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().trim().email("من فضلك أدخل بريدًا إلكترونيًا صالحًا."),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل."),
});

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const nextPath =
    typeof window === "undefined"
      ? "/ecstt"
      : new URLSearchParams(window.location.search).get("next") || "/ecstt";
  const initialEmail =
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("email") || "";

  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (getStoredEncryptedAuthToken()) {
      setLocation(nextPath);
    }
  }, [nextPath, setLocation]);

  const loginMutation = useMutation<
    {
      token: string;
      registration?: { id?: string; name?: string; email?: string };
    },
    Error,
    LoginFormData
  >({
    mutationFn: async (data) => {
      const response = await fetch(
        "https://gold-weasel-489740.hostingersite.com/api/organizations/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseData = await response.json();
      const token = extractTokenFromPayload(responseData);

      if (!token) {
        throw new Error("Token not found");
      }

      // try to extract some registration info
      const registration = (():
        | { id?: string; name?: string; email?: string }
        | undefined => {
        try {
          const record = responseData as Record<string, any>;
          const maybe =
            record.organization ||
            record.data ||
            record.org ||
            record.user ||
            record;
          if (!maybe) return undefined;
          return {
            id: maybe.id ? String(maybe.id) : undefined,
            name:
              maybe.name ||
              maybe.organizationName ||
              maybe.orgName ||
              maybe.title,
            email: maybe.email || data.email,
          };
        } catch {
          return undefined;
        }
      })();

      return { token, registration };
    },
    onSuccess: (result) => {
      saveEncryptedAuthToken(result.token);

      try {
        if (result.registration) {
          sessionStorage.setItem(
            REGISTRATION_STORAGE_KEY,
            JSON.stringify(result.registration),
          );
          // notify other parts of the app
          window.dispatchEvent(new CustomEvent("registration:updated"));
        }
      } catch {
        // ignore
      }

      setLocation(nextPath);
    },
    onError: () => {
      setSubmitError(
        "فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.",
      );
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    setSubmitError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      <div className="flex-1 mt-10 bg-brand-light-gold py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 border-t-8 border-brand-gold">
            <h1 className="text-4xl font-black text-brand-dark mb-2 text-center">
              تسجيل الدخول
            </h1>
            <p className="text-center text-brand-gray mb-12 text-lg">
              أدخل البريد الإلكتروني وكلمة المرور للمتابعة إلى الاختبار
            </p>

            <form
              onSubmit={rhfHandleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  {...register("email")}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="example@organization.com"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.email?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-bold text-brand-dark mb-3">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  {...register("password")}
                  autoComplete="current-password"
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-6 py-4 border-2 border-brand-gold/20 rounded-2xl text-lg font-medium text-brand-dark placeholder-brand-gray/50 focus:outline-none focus:border-brand-gold transition-all"
                />
                {errors.password?.message && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-6 rounded-2xl text-2xl font-black shadow-lg hover:shadow-2xl transition-all"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جارٍ تسجيل الدخول...
                  </span>
                ) : (
                  "الدخول إلى الاختبار"
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-brand-gray text-sm">
                لم تمتلك حساب ؟
                <Link
                  to="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/register");
                  }}
                  className="mr-2 font-bold text-brand-gold hover:text-brand-gold-dark transition-colors"
                >
                  أنشئ حساب
                </Link>
              </p>
            </div>

            {submitError && (
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
