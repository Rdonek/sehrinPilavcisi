export type ItemTag = 
  | "Şefin Seçimi"
  | "Günün Favorisi"
  | "Vejetaryen"
  | "Glütensiz"
  | "Acılı"
  | "Taş Fırın"
  | "Organik";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  tags?: ItemTag[];
  isAvailable: boolean; // true = Serviste, false = Tükendi
  portionInfo?: string;
  allergens?: string[];
  prepTime?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  openingHours: string;
  phone: string;
  formattedPhone: string;
  whatsapp?: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
}
