import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useI18n } from "@/contexts/I18nContext";

export const Route = createFileRoute("/register")({
  component: Register,
});

const schema = z.object({
  name: z.string().trim().min(2, "الاسم قصير").max(80),
  email: z.string().email("بريد غير صحيح"),
  phone: z.string().trim().min(8, "رقم غير صحيح").max(20),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل").max(72),
});

function Register() {
  const nav = useNavigate();
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name: parsed.data.name, phone: parsed.data.phone },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t.language === "ar" ? "تم إنشاء الحساب" : "Hesap oluşturuldu");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-soft py-12">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl shadow-elegant border border-border/50">
        <Link to="/" className="block text-center mb-6">
          <span className="font-display font-black text-3xl text-gradient">Sima Touch</span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-2">{t.language === "ar" ? "حساب جديد" : "Yeni Hesap"}</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">{t.language === "ar" ? "انضم إلينا اليوم" : "Bugün bize katılın"}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>{t.name}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label>{t.email}</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label>{t.phone}</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <Label>{t.password}</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary border-0" size="lg">
            {loading ? "..." : t.language === "ar" ? "إنشاء الحساب" : "Hesap Oluştur"}
          </Button>
        </form>
        <p className="text-sm text-center mt-6 text-muted-foreground">
          {t.language === "ar" ? "لديك حساب؟" : "Hesabınız var mı?"} <Link to="/login" className="text-primary font-bold">{t.login}</Link>
        </p>
      </div>
    </div>
  );
}
