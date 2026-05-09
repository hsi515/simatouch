import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
      }));
    },
  });

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
    }
    toast.success(t.updated);
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-black mb-6">المستخدمون</h1>
      <div className="grid gap-3">
        {users?.map((u: any) => {
          const isAdmin = u.roles.includes("admin");
          return (
            <div key={u.id} className="bg-card p-4 rounded-2xl shadow-soft border border-border/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                {(u.name || "?")[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold">{u.name || "بدون اسم"}</p>
                <p className="text-xs text-muted-foreground">{u.phone || "—"}</p>
              </div>
              {isAdmin && <Badge className="gradient-primary border-0 text-primary-foreground">أدمن</Badge>}
              <Button size="sm" variant={isAdmin ? "outline" : "default"} onClick={() => toggleAdmin(u.id, isAdmin)} className={!isAdmin ? "gradient-primary border-0" : ""}>
                {isAdmin ? "إزالة الأدمن" : "ترقية لأدمن"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
