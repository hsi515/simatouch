import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { t } = useI18n();

  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [p, o, u, rev] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total_price"),
      ]);
      const revenue = (rev.data ?? []).reduce((s, r: any) => s + Number(r.total_price), 0);
      return {
        products: p.count ?? 0,
        orders: o.count ?? 0,
        users: u.count ?? 0,
        revenue,
      };
    },
  });

  const stats = [
    { label: t.products, value: data?.products ?? 0, icon: Package },
    { label: t.orders, value: data?.orders ?? 0, icon: ShoppingCart },
    { label: t.users, value: data?.users ?? 0, icon: Users },
    { label: t.revenue, value: `${data?.revenue ?? 0} ₺`, icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-black mb-6">{t.overview}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card p-5 rounded-2xl shadow-soft border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
