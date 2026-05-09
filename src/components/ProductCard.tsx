import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { PRODUCT_STATUS_LABEL } from "@/lib/constants";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  status: string;
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { t } = useI18n();
  const disabled = product.status === "out_of_stock";
  const img = product.images?.[0] ?? "/placeholder.svg";

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border border-border/50">
      <Link to="/products/$id" params={{ id: product.id }} className="block aspect-square overflow-hidden bg-secondary relative">
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.status !== "available" && (
          <Badge className="absolute top-3 right-3 gradient-primary border-0 text-primary-foreground">
            {PRODUCT_STATUS_LABEL[product.status]}
          </Badge>
        )}
      </Link>
      <div className="p-4">
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="font-bold text-base line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-black text-gradient">{product.price} ₺</span>
          <Button
            size="sm"
            disabled={disabled}
            onClick={() => {
              add({ id: product.id, name: product.name, price: Number(product.price), image: img });
              toast.success(t.language === "ar" ? "أُضيف إلى السلة" : "Sepete eklendi");
            }}
            className="gradient-primary border-0 gap-1"
          >
            <ShoppingBag className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
