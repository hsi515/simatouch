import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { Package } from "lucide-react";

export const Route = createFileRoute("/orders")({
  component: Orders,
});

const statusColor: Record<string, string> = {
  pending: "bg-warning/20 text-warning-foreground",
  processing: "bg-primary-soft text-primary",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

function Orders() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">{t.language === "ar" ? "سجّل دخولك لعرض طلباتك" : "Siparişlerinizi görmek için giriş yapın"}</p>
            <Link to="/login"><Button>{t.login}</Button></Link>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl md:text-4xl font-black mb-8">{t.orders}</h1>
        {isLoading ? (
          <p className="text-muted-foreground">{t.language === "ar" ? "جاري التحميل..." : "Yükleniyor..."}</p>
        ) : !orders?.length ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{t.language === "ar" ? "لا توجد طلبات بعد" : "Henüz sipariş yok"}</p>
            <Link to="/products"><Button className="gradient-primary border-0">{t.shopNow}</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => (
              <div key={o.id} className="bg-card p-5 rounded-2xl shadow-soft border border-border/50">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <p className="font-bold text-lg">{t.language === "ar" ? `طلب #${o.order_number}` : `Sipariş #${o.order_number}`}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString(t.language === "ar" ? "ar" : "tr")}</p>
                  </div>
                  <Badge className={statusColor[o.status]}>{ORDER_STATUS_LABEL[o.status]}</Badge>
                </div>
                <div className="space-y-1 text-sm border-t border-border pt-3">
                  {(o.items as any[]).map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-bold">{it.price * it.quantity} ₺</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">{t.language === "ar" ? "الإجمالي" : "Toplam"}</span>
                  <span className="font-black text-gradient text-xl">{o.total_price} ₺</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
