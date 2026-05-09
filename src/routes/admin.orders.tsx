import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t.statusUpdated);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-black mb-6">{t.orders}</h1>
      <div className="grid gap-3">
        {orders?.map((o: any) => (
          <div key={o.id} className="bg-card p-5 rounded-2xl shadow-soft border border-border/50">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold text-lg">{t.order} #{o.order_number}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString(t.language === "ar" ? "ar" : "tr")}</p>
                <p className="text-sm mt-1">{o.customer_name} · {o.phone}</p>
                {o.address && <p className="text-xs text-muted-foreground">{o.address}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t border-border mt-3 pt-3 space-y-1 text-sm">
              {(o.items as any[]).map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span>{it.name} × {it.quantity}</span>
                  <span className="font-bold">{it.price * it.quantity} ₺</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <Badge className="gradient-primary border-0 text-primary-foreground">{t.total}</Badge>
              <span className="font-black text-gradient text-xl">{o.total_price} ₺</span>
            </div>
          </div>
        ))}
        {!orders?.length && <p className="text-muted-foreground text-center py-12">{t.noOrders}</p>}
      </div>
    </div>
  );
}
