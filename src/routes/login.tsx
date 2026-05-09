import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useI18n } from "@/contexts/I18nContext";

export const Route = createFileRoute("/login")({
  component: Login,
});

const schema = z.object({
  email: z.string().email("بريد غير صحيح"),
  password: z.string().min(6, "كلمة المرور قصيرة"),
});

function Login() {
  const nav = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t.language === "ar" ? "تم تسجيل الدخول" : "Giriş yapıldı");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-soft">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl shadow-elegant border border-border/50">
        <Link to="/" className="block text-center mb-6">
          <span className="font-display font-black text-3xl text-gradient">Sima Touch</span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-2">{t.login}</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">{t.language === "ar" ? "أهلاً بعودتك 🌹" : "Tekrar hoş geldiniz 🌹"}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>{t.email}</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label>{t.password}</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary border-0" size="lg">
            {loading ? "..." : t.login}
          </Button>
        </form>
        <p className="text-sm text-center mt-6 text-muted-foreground">
          {t.language === "ar" ? "ليس لديك حساب؟" : "Hesabınız yok mu?"} <Link to="/register" className="text-primary font-bold">{t.language === "ar" ? "أنشئ حسابًا" : "Hesap oluştur"}</Link>
        </p>
      </div>
    </div>
  );
}
