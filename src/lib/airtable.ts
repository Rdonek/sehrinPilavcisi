import { MenuItem, ItemTag, RestaurantConfig, Category } from "@/types/menu";
import { MOCK_MENU_ITEMS } from "./mock-data";
import { DEFAULT_RESTAURANT_INFO, MENU_CATEGORIES } from "./constants";

export interface RestaurantData {
  items: MenuItem[];
  categories: Category[];
  restaurantInfo: RestaurantConfig;
}

const CATEGORY_NAMES_TR: Record<string, string> = {
  corbalar: "Çorbalar",
  korbalar: "Çorbalar",
  firindan: "Fırından & Izgara",
  tencere: "Tencere Yemekleri",
  zeytinyaglilar: "Zeytinyağlılar",
  tatlilar: "Tatlılar",
  icecekler: "İçecekler",
  kahvalti: "Kahvaltı",
  salatalar: "Salatalar",
  burgerler: "Burgerler",
  makarnalar: "Makarnalar",
};

export async function getRestaurantData(): Promise<RestaurantData> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Menü";

  if (!apiKey || !baseId) {
    return {
      items: MOCK_MENU_ITEMS,
      categories: MENU_CATEGORIES,
      restaurantInfo: DEFAULT_RESTAURANT_INFO,
    };
  }

  let restaurantInfo = { ...DEFAULT_RESTAURANT_INFO };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let menuRecords: any[] = [];

  // 1. Menü tablosunu çek
  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 15 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.records)) {
        menuRecords = data.records;
      }
    }
  } catch (err) {
    console.error("[Airtable Error] Menü çekilemedi:", err);
  }

  // 2. İletişim / Ayarlar Tablosunu Çek
  const settingsTableCandidates = ["ayarlar", "Ayarlar", "İletişim", "Iletisim", "Settings"];
  for (const candidate of settingsTableCandidates) {
    try {
      const ayarlarUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(candidate)}`;
      const resAyarlar = await fetch(ayarlarUrl, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 15 },
      });

      if (resAyarlar.ok) {
        const ayarlarData = await resAyarlar.json();
        if (Array.isArray(ayarlarData.records) && ayarlarData.records.length > 0) {
          const af = ayarlarData.records[0].fields;
          const rawPhone = (af["Telefon"] || restaurantInfo.phone).toString();
          const cleanPhone = rawPhone.replace(/\D/g, "");

          // Slogan (dizi ise birleştir)
          let tagline = restaurantInfo.tagline;
          if (Array.isArray(af["Slogan"])) {
            tagline = af["Slogan"].join(" • ");
          } else if (af["Slogan"]) {
            tagline = af["Slogan"].toString();
          }

          // Logo Görseli (SADECE kullanıcının Airtable Ayarlar tablosuna yüklediği görsel)
          let logoUrl: string | undefined = undefined;
          const logoField = af["Logo"] || af["Logo Görseli"] || af["Görsel"];
          if (Array.isArray(logoField) && logoField.length > 0) {
            logoUrl = logoField[0].thumbnails?.large?.url || logoField[0].url;
          } else if (typeof logoField === "string" && logoField.startsWith("http")) {
            logoUrl = logoField;
          }

          restaurantInfo = {
            name: af["Mekan Adı"] || af["Restoran Adı"] || restaurantInfo.name,
            tagline,
            description: af["Hakkında"] || af["Detay"] || restaurantInfo.description,
            logoUrl,
            openingHours: af["Çalışma Saatleri"] || af["Saatler"] || restaurantInfo.openingHours,
            phone: cleanPhone || restaurantInfo.phone,
            formattedPhone: rawPhone || restaurantInfo.formattedPhone,
            whatsapp: af["WhatsApp"] || cleanPhone || restaurantInfo.whatsapp,
            address: af["Adres"] || restaurantInfo.address,
            googleMapsUrl: af["Google Maps"] || af["Harita Linki"] || restaurantInfo.googleMapsUrl,
            instagramUrl: af["Instagram"] || restaurantInfo.instagramUrl,
          };
          break;
        }
      }
    } catch {
      // diğer adayı dene
    }
  }

  // 3. Menü kayıtlarını işle (BOŞ SATIRLARI OTOMATİK TEMİZLE)
  const items: MenuItem[] = menuRecords
    .filter((record) => {
      const name = (record.fields["Yemek Adı"] || "").toString().trim();
      // İsmi olmayan boş satırları ve ayar satırlarını listeye alma
      if (!name) return false;
      if (name.startsWith("@") || name.startsWith("[ayarlar]") || name.toLowerCase() === "ayarlar") return false;
      return true;
    })
    .map((record) => {
      const f = record.fields;
      const name = f["Yemek Adı"].toString().trim();
      const rawCategory = (f["Kategori"] || "diger").toString().trim();
      const categorySlug = rawCategory.toLowerCase().replace(/\s+/g, "-");

      // Fotoğraf kontrolü
      const photoField = f.Fotoğraf || f["Başlık (Fotoğraf)"] || f.Görsel || f.Resim;
      let imageUrl: string | undefined = undefined;

      if (Array.isArray(photoField) && photoField.length > 0) {
        imageUrl = photoField[0].thumbnails?.large?.url || photoField[0].url;
      } else if (typeof photoField === "string" && photoField.startsWith("http")) {
        imageUrl = photoField;
      }

      if (!imageUrl) {
        const matchingMock = MOCK_MENU_ITEMS.find(
          (m) => m.name.toLowerCase() === name.toLowerCase() || m.category === categorySlug
        );
        imageUrl = matchingMock?.imageUrl || MOCK_MENU_ITEMS[0].imageUrl;
      }

      // Etiketler
      let tags: ItemTag[] = [];
      if (Array.isArray(f.Etiketler)) {
        tags = f.Etiketler as ItemTag[];
      } else if (typeof f.Etiketler === "string" && f.Etiketler.trim()) {
        tags = f.Etiketler.split(",").map((t: string) => t.trim() as ItemTag);
      }

      // Alerjenler
      let allergens: string[] | undefined = undefined;
      if (Array.isArray(f.Alerjenler)) {
        allergens = f.Alerjenler;
      } else if (typeof f.Alerjenler === "string" && f.Alerjenler.trim() !== "") {
        allergens = f.Alerjenler.split(",").map((a: string) => a.trim());
      }

      const isUnavailable =
        f["Tükendi"] === true ||
        f["Tükendi"] === "true" ||
        f["Mevcut"] === false ||
        f["Mevcut"] === "false";

      return {
        id: record.id,
        name,
        description: f["Açıklama"] || "",
        price: Number(f["Fiyat"]) || 0,
        category: categorySlug,
        rawCategoryName: rawCategory,
        imageUrl,
        tags,
        isAvailable: !isUnavailable,
        portionInfo: f["Porsiyon"] || undefined,
        allergens,
        prepTime: f["Hazırlık Süresi"] || undefined,
      };
    });

  // 4. KATEGORİLERİ AIRTABLE VERİSİNDEN DİNAMİK OLARAK OLUŞTUR
  const categoryMap = new Map<string, string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.forEach((item: any) => {
    const slug = item.category;
    if (!categoryMap.has(slug)) {
      const originalName = item.rawCategoryName || slug;
      const formattedName = CATEGORY_NAMES_TR[slug] || originalName;
      categoryMap.set(slug, formattedName);
    }
  });

  const categories: Category[] = Array.from(categoryMap.entries()).map(
    ([slug, name], index) => ({
      id: slug,
      slug,
      name,
      order: index + 1,
    })
  );

  return {
    items: items.length > 0 ? items : MOCK_MENU_ITEMS,
    categories: categories.length > 0 ? categories : MENU_CATEGORIES,
    restaurantInfo,
  };
}
