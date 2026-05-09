import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading, user } = useAuth();
  const { t } = useI18n();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav({ to: "/" });
  }, [loading, isAdmin, user, nav]);

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">{t.loading}</div>;
  }

  const links = [
    { to: "/admin", label: t.overview, icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: t.products, icon: Package },
    { to: "/admin/orders", label: t.orders, icon: ShoppingCart },
    { to: "/admin/users", label: t.users, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> {t.backToStore}
          </Link>
          <div className="h-6 w-px bg-border" />
          <span className="font-display font-black text-lg text-gradient">{t.adminDashboard}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="lg:sticky lg:top-24 h-fit">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.exact }}
                activeProps={{ className: "gradient-primary text-primary-foreground" }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap"
              >
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
