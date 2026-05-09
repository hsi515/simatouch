import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name, phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({ name: data.name || "", phone: data.phone || "" });
    });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">{t.language === "ar" ? "سجّل دخولك لعرض حسابك" : "Hesabınızı görmek için giriş yapın"}</p>
            <Link to="/login"><Button>{t.login}</Button></Link>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t.language === "ar" ? "تم الحفظ" : "Kaydedildi");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black mb-8">{t.language === "ar" ? "حسابي" : "Hesabım"}</h1>
        <form onSubmit={save} className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 space-y-4">
          <div>
            <Label>{t.email}</Label>
            <Input value={user.email ?? ""} disabled />
          </div>
          <div>
            <Label>{t.name}</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <Label>{t.phone}</Label>
            <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="gradient-primary border-0">{t.language === "ar" ? "حفظ التغييرات" : "Değişiklikleri Kaydet"}</Button>
            <Link to="/orders"><Button type="button" variant="outline">{t.orders}</Button></Link>
            <Button type="button" variant="ghost" onClick={signOut} className="mr-auto text-destructive">
              {t.language === "ar" ? "تسجيل الخروج" : "Çıkış Yap"}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
