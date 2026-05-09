import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "ar" | "tr";

export interface Translations {
  // Meta
  language: Language;
  // Common
  home: string;
  products: string;
  orders: string;
  profile: string;
  login: string;
  register: string;
  cart: string;
  admin: string;
  search: string;
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  yes: string;
  no: string;

  // Header
  storeName: string;
  storeTagline: string;

  // Home page
  heroTitle: string;
  heroSubtitle: string;
  shopNow: string;
  exploreFlowers: string;
  featuredProducts: string;
  viewAll: string;
  categories: {
    flowers: string;
    gifts: string;
    chocolate: string;
    stands: string;
    bags: string;
  };
  features: {
    fastDelivery: string;
    whatsappOrders: string;
    guaranteedQuality: string;
  };

  // Products page
  allProducts: string;
  productCount: string;
  searchPlaceholder: string;
  noProducts: string;

  // Product card
  addToCart: string;
  outOfStock: string;
  limitedStock: string;
  available: string;

  // Cart
  yourCart: string;
  emptyCart: string;
  total: string;
  checkout: string;
  continueShopping: string;

  // Checkout
  checkoutTitle: string;
  customerInfo: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  orderSummary: string;
  subtotal: string;
  delivery: string;
  placeOrder: string;

  // Orders
  yourOrders: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;

  // Login/Register
  welcomeBack: string;
  newAccount: string;
  email: string;
  password: string;
  confirmPassword: string;
  createAccount: string;
  haveAccount: string;
  signIn: string;

  // Admin
  adminDashboard: string;
  overview: string;
  users: string;
  revenue: string;
  backToStore: string;
  newProduct: string;
  productName: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  status: string;
  featured: string;
  update: string;
  confirmDelete: string;
  deleted: string;
  updated: string;
  added: string;

  // Footer
  links: string;
  contact: string;
  followUs: string;
  allRightsReserved: string;

  // Error pages
  pageNotFound: string;
  somethingWrong: string;
  tryAgain: string;
  backHome: string;

  // Extra
  statusUpdated: string;
  order: string;
  noOrders: string;
  editProduct: string;
  shippingNote: string;
}

const arabicTranslations: Translations = {
  language: "ar",
  statusUpdated: "تم تحديث الحالة",
  order: "طلب",
  noOrders: "لا توجد طلبات",
  editProduct: "تعديل المنتج",
  shippingNote: "ملاحظة: الشحن على حسابكم الشخصي",
  home: "الرئيسية",
  products: "المنتجات",
  orders: "طلباتي",
  profile: "حسابي",
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  cart: "السلة",
  admin: "الأدمن",
  search: "البحث",
  loading: "جاري التحميل...",
  save: "حفظ",
  cancel: "إلغاء",
  delete: "حذف",
  edit: "تعديل",
  add: "إضافة",
  yes: "نعم",
  no: "لا",

  storeName: "Sima Touch",
  storeTagline: "ورود · هدايا · مرايا",

  heroTitle: "لحظة استثنائية تستحق وردة استثنائية",
  heroSubtitle: "تشكيلة فاخرة من الورود الطبيعية، الهدايا، المرايا والستاندات. اكمل طلبك على الواتس اب.",
  shopNow: "تسوّق الآن",
  exploreFlowers: "استكشف الورود",
  featuredProducts: "منتجات مميّزة",
  viewAll: "عرض الكل",
  categories: {
    flowers: "ورود",
    gifts: "هدايا",
    chocolate: "مرايا",
    stands: "ستاندات",
    bags: "شنط",
  },
  features: {
    fastDelivery: "توصيل سريع",
    whatsappOrders: "طلب عبر واتساب",
    guaranteedQuality: "جودة مضمونة",
  },

  allProducts: "جميع المنتجات",
  productCount: "منتج",
  searchPlaceholder: "ابحث عن منتج...",
  noProducts: "لا توجد منتجات مطابقة",

  addToCart: "أضف للسلة",
  outOfStock: "نفد المخزون",
  limitedStock: "كمية محدودة",
  available: "متوفر",

  yourCart: "سلتك",
  emptyCart: "سلتك فارغة",
  total: "المجموع",
  checkout: "الدفع",
  continueShopping: "متابعة التسوّق",

  checkoutTitle: "إتمام الطلب",
  customerInfo: "معلومات العميل",
  name: "الاسم",
  phone: "رقم الهاتف",
  address: "العنوان",
  notes: "ملاحظات",
  orderSummary: "ملخص الطلب",
  subtotal: "المجموع الفرعي",
  delivery: "التوصيل",
  placeOrder: "تأكيد الطلب",

  yourOrders: "طلباتي",
  orderNumber: "رقم الطلب",
  orderDate: "تاريخ الطلب",
  orderStatus: "حالة الطلب",
  pending: "قيد الانتظار",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",

  welcomeBack: "أهلاً بعودتك 🌹",
  newAccount: "انضم إلينا اليوم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  createAccount: "إنشاء الحساب",
  haveAccount: "لديك حساب؟",
  signIn: "سجّل دخول",

  adminDashboard: "لوحة الأدمن",
  overview: "نظرة عامة",
  users: "المستخدمون",
  revenue: "الإيرادات",
  backToStore: "للمتجر",
  newProduct: "منتج جديد",
  productName: "الاسم",
  description: "الوصف",
  price: "السعر (₺)",
  category: "التصنيف",
  imageUrl: "رابط الصورة",
  status: "الحالة",
  featured: "منتج مميّز",
  update: "تحديث",
  confirmDelete: "حذف هذا المنتج؟",
  deleted: "تم الحذف",
  updated: "تم التحديث",
  added: "أُضيف",

  links: "روابط",
  contact: "تواصل معنا",
  followUs: "تابعنا",
  allRightsReserved: "جميع الحقوق محفوظة",
  pageNotFound: "الصفحة غير موجودة",
  somethingWrong: "حدث خطأ ما",
  tryAgain: "حاول مجددًا",
  backHome: "الرئيسية",
};

const turkishTranslations: Translations = {
  language: "tr",
  statusUpdated: "Durum güncellendi",
  order: "Sipariş",
  noOrders: "Sipariş bulunamadı",
  editProduct: "Ürünü Düzenle",
  shippingNote: "Not: Kargo sizin hesabınıza aittir",
  home: "Ana Sayfa",
  products: "Ürünler",
  orders: "Siparişlerim",
  profile: "Hesabım",
  login: "Giriş Yap",
  register: "Kayıt Ol",
  cart: "Sepet",
  admin: "Yönetim",
  search: "Ara",
  loading: "Yükleniyor...",
  save: "Kaydet",
  cancel: "İptal",
  delete: "Sil",
  edit: "Düzenle",
  add: "Ekle",
  yes: "Evet",
  no: "Hayır",

  storeName: "Sima Touch",
  storeTagline: "Çiçekler · Hediyeler · aynalar",

  heroTitle: "Özel bir an, özel bir çiçek hak ediyor",
  heroSubtitle: "Doğal çiçekler, hediyeler, aynalar ve standlardan oluşan lüks koleksiyon. Siparişinizi WhatsApp üzerinden tamamlayın.",
  shopNow: "Şimdi Alışveriş Yap",
  exploreFlowers: "Çiçekleri Keşfet",
  featuredProducts: "Öne Çıkan Ürünler",
  viewAll: "Tümünü Gör",
  categories: {
    flowers: "Çiçekler",
    gifts: "Hediyeler",
    chocolate: "aynalar",
    stands: "Standlar",
    bags: "Çantalar",
  },
  features: {
    fastDelivery: "Hızlı Teslimat",
    whatsappOrders: "WhatsApp Siparişi",
    guaranteedQuality: "Garantili Kalite",
  },

  allProducts: "Tüm Ürünler",
  productCount: "ürün",
  searchPlaceholder: "Ürün ara...",
  noProducts: "Eşleşen ürün bulunamadı",

  addToCart: "Sepete Ekle",
  outOfStock: "Stokta Yok",
  limitedStock: "Sınırlı Stok",
  available: "Mevcut",

  yourCart: "Sepetiniz",
  emptyCart: "Sepetiniz boş",
  total: "Toplam",
  checkout: "Ödeme",
  continueShopping: "Alışverişe Devam",

  checkoutTitle: "Siparişi Tamamla",
  customerInfo: "Müşteri Bilgileri",
  name: "Ad",
  phone: "Telefon",
  address: "Adres",
  notes: "Notlar",
  orderSummary: "Sipariş Özeti",
  subtotal: "Ara Toplam",
  delivery: "Teslimat",
  placeOrder: "Siparişi Onayla",

  yourOrders: "Siparişlerim",
  orderNumber: "Sipariş Numarası",
  orderDate: "Sipariş Tarihi",
  orderStatus: "Sipariş Durumu",
  pending: "Beklemede",
  processing: "Hazırlanıyor",
  shipped: "Gönderildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",

  welcomeBack: "Tekrar hoş geldiniz 🌹",
  newAccount: "Bugün bize katılın",
  email: "E-posta",
  password: "Şifre",
  confirmPassword: "Şifreyi Onayla",
  createAccount: "Hesap Oluştur",
  haveAccount: "Hesabınız var mı?",
  signIn: "Giriş Yap",

  adminDashboard: "Yönetim Paneli",
  overview: "Genel Bakış",
  users: "Kullanıcılar",
  revenue: "Gelir",
  backToStore: "Mağazaya Dön",
  newProduct: "Yeni Ürün",
  productName: "İsim",
  description: "Açıklama",
  price: "Fiyat (₺)",
  category: "Kategori",
  imageUrl: "Resim URL'si",
  status: "Durum",
  featured: "Öne Çıkan",
  update: "Güncelle",
  confirmDelete: "Bu ürünü silmek istiyor musunuz?",
  deleted: "Silindi",
  updated: "Güncellendi",
  added: "Eklendi",

  links: "Bağlantılar",
  contact: "İletişim",
  followUs: "Bizi Takip Edin",
  allRightsReserved: "Tüm hakları saklıdır",
  pageNotFound: "Sayfa bulunamadı",
  somethingWrong: "Bir şeyler yanlış gitti",
  tryAgain: "Tekrar dene",
  backHome: "Ana Sayfa",
};

const translations = {
  ar: arabicTranslations,
  tr: turkishTranslations,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "ar" || saved === "tr")) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}