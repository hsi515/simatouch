// Update this number to receive WhatsApp orders
export const WHATSAPP_NUMBER = "905016316010"; // placeholder — change me
export const STORE_NAME = "Sima Touch";
export const STORE_TAGLINE = "ورود · هدايا · مرايا";

export const CATEGORIES = [
  { value: "flowers", label: "ورود", labelTr: "Çiçekler" },
  { value: "gifts", label: "هدايا", labelTr: "Hediyeler" },
  { value: "chocolate", label: "مرايا", labelTr: "Aynalar" },
  { value: "stands", label: "ستاندات", labelTr: "Standlar" },
  { value: "bags", label: "شنط", labelTr: "Çantalar" },
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "قيد الانتظار",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  available: "متوفر",
  limited: "كمية محدودة",
  out_of_stock: "نفد المخزون",
};
