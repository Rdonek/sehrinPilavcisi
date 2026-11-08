import { Category, RestaurantConfig } from "@/types/menu";

export const DEFAULT_RESTAURANT_INFO: RestaurantConfig = {
  name: "Şehrin Pilavcısı",
  tagline: "Lezzet Şehrin, Pilav Bizim",
  description: "Kaliteli Malzeme • Özenli Pişirme • Eşsiz Lezzet",
  logoUrl: undefined, // Sadece Airtable'dan kullanıcı yüklediğinde görünür
  openingHours: "Her gün 11:30 - 02:00",
  phone: "05550000000",
  formattedPhone: "0 (555) 000 00 00",
  whatsapp: "905550000000",
  address: "Hüseyin Avni Ulaş Mah. 1. Kağan Sok. 1/1 B Harmoni City, Erzurum",
  googleMapsUrl: "https://maps.google.com/?q=Sehrin+Pilavcisi+Erzurum",
  instagramUrl: "https://instagram.com/sehrinpilavcisi",
};

export const RESTAURANT_INFO = DEFAULT_RESTAURANT_INFO;

export const MENU_CATEGORIES: Category[] = [
  { id: "pilavlar", name: "Pilavlar", slug: "pilavlar", order: 1 },
  { id: "pilav-tavuk-menu", name: "Pilav & Tavuk Menü", slug: "pilav-tavuk-menu", order: 2 },
  { id: "pilav-et-menu", name: "Pilav & Et Menü", slug: "pilav-et-menu", order: 3 },
  { id: "makarna-cesitleri", name: "Makarna Çeşitleri", slug: "makarna-cesitleri", order: 4 },
  { id: "makarna-tavuk-menu", name: "Makarna & Tavuk Menü", slug: "makarna-tavuk-menu", order: 5 },
  { id: "makarna-et-menu", name: "Makarna & Et Menü", slug: "makarna-et-menu", order: 6 },
  { id: "ogrenci-menuleri", name: "Öğrenci Menüleri", slug: "ogrenci-menuleri", order: 7 },
  { id: "soguk-icecekler", name: "Soğuk İçecekler", slug: "soguk-icecekler", order: 8 },
  { id: "litrelik-icecekler", name: "Litrelik İçecekler", slug: "litrelik-icecekler", order: 9 },
];
