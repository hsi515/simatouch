import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
});

const schema = z.object({
  name: z.string().trim().min(2, "الاسم قصير").max(80),
  phone: z.string().trim().min(8, "رقم غير صحيح").max(20),
  address: z.string().trim().min(5, "العنوان قصير").max(300),
  notes: z.string().trim().max(500).optional(),
});

function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("name, phone").eq("id", user.id).maybeSingle().then(({ data }) => {
        if (data) setForm((f) => ({ ...f, name: data.name || "", phone: data.phone || "" }));
      });
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">{t.language === "ar" ? "سلّتك فارغة" : "Sepetiniz boş"}</p>
            <Link to="/products"><Button>{t.shopNow}</Button></Link>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">{t.language === "ar" ? "سجّل دخولك للمتابعة" : "Devam etmek için giriş yapın"}</h2>
            <p className="text-muted-foreground mb-6">{t.language === "ar" ? "أنشئ حسابًا أو سجّل الدخول لإتمام الطلب وتتبّعه." : "Siparişi tamamlamak ve takip etmek için hesap oluşturun veya giriş yapın."}</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login"><Button className="gradient-primary border-0">{t.login}</Button></Link>
              <Link to="/register"><Button variant="outline">{t.language === "ar" ? "حساب جديد" : "Yeni Hesap"}</Button></Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: parsed.data.name,
          phone: parsed.data.phone,
          address: parsed.data.address,
          notes: parsed.data.notes ?? null,
          items: items as any,
          total_price: total,
        })
        .select("order_number, id")
        .single();
      if (error) throw error;

      // Build WhatsApp message
      const lines = [
        `🌹 *طلب جديد من Sima Touch*`,
        `رقم الطلب: #${data.order_number}`,
        ``,
        `*المنتجات:*`,
        ...items.map((i) => `• ${i.name} × ${i.quantity} = ${i.price * i.quantity} ₺`),
        ``,
        `*الإجمالي:* ${total} ₺`,
        ``,
        `*العميل:* ${parsed.data.name}`,
        `*الهاتف:* ${parsed.data.phone}`,
        `*العنوان:* ${parsed.data.address}`,
        parsed.data.notes ? `*ملاحظات:* ${parsed.data.notes}` : "",
        ``,
        `📦 ${t.shippingNote}`,
      ].filter(Boolean).join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
      clear();
      toast.success(`تم إنشاء الطلب #${data.order_number}`);
      window.open(url, "_blank");
      navigate({ to: "/orders" });
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl md:text-4xl font-black mb-8">{t.language === "ar" ? "إتمام الطلب" : "Siparişi Tamamla"}</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={submit} className="lg:col-span-2 space-y-4 bg-card p-6 rounded-2xl shadow-soft border border-border/50">
            <div>
              <Label>{t.name}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label>{t.phone}</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+90..." />
            </div>
            <div>
              <Label>{t.language === "ar" ? "عنوان التوصيل" : "Teslimat Adresi"}</Label>
              <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div>
              <Label>{t.language === "ar" ? "ملاحظات (اختياري)" : "Notlar (İsteğe bağlı)"}</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 text-sm font-bold text-primary">
              ⚠️ {t.shippingNote}
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full gradient-primary border-0 gap-2">
              <MessageCircle className="w-5 h-5" />
              {loading ? (t.language === "ar" ? "جاري الإرسال..." : "Gönderiliyor...") : (t.language === "ar" ? "إرسال الطلب عبر واتساب" : "WhatsApp ile Sipariş Gönder")}
            </Button>
          </form>

          <div className="bg-card p-6 rounded-2xl shadow-elegant border border-border/50 h-fit">
            <h2 className="font-bold text-xl mb-4">{t.language === "ar" ? `طلبك (${items.length})` : `Siparişiniz (${items.length})`}</h2>
            <div className="space-y-3 mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="line-clamp-1">{i.name} × {i.quantity}</span>
                  <span className="font-bold whitespace-nowrap">{i.price * i.quantity} ₺</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold">{t.language === "ar" ? "الإجمالي" : "Toplam"}</span>
              <span className="text-2xl font-black text-gradient">{total} ₺</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
