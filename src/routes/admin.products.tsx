import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Upload, X, Crown, Star } from "lucide-react";
import { CATEGORIES, PRODUCT_STATUS_LABEL } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

interface Form {
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  status: string;
  featured: boolean;
  is_premium: boolean;
}

const empty: Form = { name: "", description: "", price: "", category: "flowers", images: [], status: "available", featured: false, is_premium: false };

function AdminProducts() {
  const { t, language } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const openNew = () => { setForm(empty); setEditId(null); setOpen(true); };
  const getCategoryValue = (value: string | null | undefined) => {
    return CATEGORIES.some((c) => c.value === value) ? value : "flowers";
  };

  const getCategoryLabel = (value: string) => {
    const item = CATEGORIES.find((c) => c.value === value);
    return item ? (language === "ar" ? item.label : item.labelTr) : value;
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: getCategoryValue(p.category),
      images: p.images ?? [],
      status: p.status,
      featured: p.featured,
      is_premium: p.is_premium ?? false,
    });
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(language === "ar" ? `${file.name}: حجم أكبر من 5MB` : `${file.name}: 5MB'tan büyük`);
          continue;
        }
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("products").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) {
          toast.error(upErr.message);
          continue;
        }
        const { data: pub } = supabase.storage.from("products").getPublicUrl(path);
        uploaded.push(pub.publicUrl);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
      if (uploaded.length) toast.success(language === "ar" ? "تم رفع الصور" : "Görseller yüklendi");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.images.length) {
      toast.error(language === "ar" ? "أضف صورة واحدة على الأقل" : "En az bir görsel ekleyin");
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: getCategoryValue(form.category) as any,
      images: form.images,
      status: form.status as any,
      featured: form.featured,
      is_premium: form.is_premium,
    };
    const { error } = editId
      ? await supabase.from("products").update(payload).eq("id", editId)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editId ? t.updated : t.added);
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const del = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t.deleted);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-black">{t.products}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 gap-2">
              <Plus className="w-4 h-4" /> {t.newProduct}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? t.editProduct : t.newProduct}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div><Label>{t.name}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>{t.description}</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t.price} (₺)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div>
                  <Label>{t.category}</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{language === "ar" ? c.label : c.labelTr}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image uploader */}
              <div>
                <Label>{language === "ar" ? "صور المنتج (من جهازك)" : "Ürün görselleri (cihazınızdan)"}</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 right-1 text-[10px] bg-primary text-primary-foreground px-1.5 rounded">
                          {language === "ar" ? "رئيسية" : "Ana"}
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-secondary transition flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-xs">{uploading ? (language === "ar" ? "جاري الرفع..." : "Yükleniyor...") : (language === "ar" ? "رفع صور" : "Görsel yükle")}</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "ar" ? "JPG / PNG / WEBP — حد أقصى 5MB لكل صورة" : "JPG / PNG / WEBP — görsel başına en fazla 5MB"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t.status}</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRODUCT_STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm">{t.featured}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} />
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-sm">{language === "ar" ? "بريميوم / لوكس" : "Premium / Lüks"}</span>
                </label>
              </div>
              <Button type="submit" className="w-full gradient-primary border-0">{t.save}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {products?.map((p: any) => (
          <div key={p.id} className="bg-card p-4 rounded-2xl shadow-soft border border-border/50 flex items-center gap-4">
            <img src={p.images?.[0] ?? "/placeholder.svg"} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold">{p.name}</h3>
                {p.featured && <Badge className="gradient-primary border-0 text-primary-foreground gap-1"><Star className="w-3 h-3" />{t.featured}</Badge>}
                {p.is_premium && <Badge className="bg-amber-500 hover:bg-amber-500 border-0 text-white gap-1"><Crown className="w-3 h-3" />{language === "ar" ? "بريميوم" : "Premium"}</Badge>}
                <Badge variant="outline">{getCategoryLabel(p.category)}</Badge>
                <Badge variant="outline">{PRODUCT_STATUS_LABEL[p.status]}</Badge>
              </div>
              <p className="text-sm text-gradient font-bold">{p.price} ₺</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => del(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
