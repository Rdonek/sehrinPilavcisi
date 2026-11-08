import { MenuItem, Category, RestaurantConfig, ItemTag } from "@/types/menu";
import { DEFAULT_RESTAURANT_INFO, MENU_CATEGORIES } from "./constants";

// Güvenli ve doğrudan Airtable REST API bağlantısı
const ENCODED_PAT = "cGF0S3c5Sk9iaEZ4MERYUFMuMThmMmVjM2ViYzM5MjgzYzljMzY0YTllYjE3NmYyNDEzMjlkNjRjNDMwYmY2MTAzNDZkOTJlZmU2Zjg3MmRlZQ==";
const BASE_ID = "app808CAtVXo4HrF3";
const TABLE_NAME = "menu";

function getToken(): string {
  try {
    return atob(ENCODED_PAT);
  } catch {
    return "";
  }
}

export async function fetchLiveRestaurantData(): Promise<{
  items: MenuItem[];
  categories: Category[];
  restaurantInfo: RestaurantConfig;
} | null> {
  const token = getToken();
  if (!token) return null;

  try {
    // 1. Menü kayıtlarını canlı çek (Cache yok, doğrudan güncel)
    const menuRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!menuRes.ok) return null;
    const menuData = await menuRes.json();
    const menuRecords: any[] = Array.isArray(menuData.records) ? menuData.records : [];

    // 2. Ayarlar / İletişim tablosunu canlı çek
    let restaurantInfo: RestaurantConfig = { ...DEFAULT_RESTAURANT_INFO };
    const settingsCandidates = ["ayarlar", "Ayarlar", "İletişim", "Iletisim", "Settings"];

    for (const candidate of settingsCandidates) {
      try {
        const ayarlarRes = await fetch(
          `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(candidate)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );
        if (ayarlarRes.ok) {
          const ayarlarData = await ayarlarRes.json();
          if (Array.isArray(ayarlarData.records) && ayarlarData.records.length > 0) {
            const af = ayarlarData.records[0].fields || {};
            const rawPhone = (af["Telefon"] || restaurantInfo.phone).toString();
            const cleanPhone = rawPhone.replace(/\D/g, "");

            let tagline = restaurantInfo.tagline;
            if (Array.isArray(af["Slogan"])) {
              tagline = af["Slogan"].join(" • ");
            } else if (af["Slogan"]) {
              tagline = af["Slogan"].toString();
            }

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
        // Devam et
      }
    }

    // 3. Menü kayıtlarını işle
    const items: MenuItem[] = menuRecords
      .filter((record) => {
        const name = (record.fields?.["Yemek Adı"] || "").toString().trim();
        if (!name) return false;
        if (name.startsWith("@") || name.startsWith("[ayarlar]") || name.toLowerCase() === "ayarlar") return false;
        return true;
      })
      .map((record) => {
        const f = record.fields || {};
        const name = f["Yemek Adı"].toString().trim();
        const rawCategory = (f["Kategori"] || "diger").toString().trim();
        const categorySlug = rawCategory.toLowerCase().replace(/\s+/g, "-");

        const photoField = f.Fotoğraf || f["Başlık (Fotoğraf)"] || f.Görsel || f.Resim;
        let imageUrl: string | undefined = undefined;
        if (Array.isArray(photoField) && photoField.length > 0) {
          imageUrl = photoField[0].thumbnails?.large?.url || photoField[0].url;
        } else if (typeof photoField === "string" && photoField.startsWith("http")) {
          imageUrl = photoField;
        }

        let tags: ItemTag[] = [];
        if (Array.isArray(f.Etiketler)) {
          tags = f.Etiketler as ItemTag[];
        } else if (typeof f.Etiketler === "string" && f.Etiketler.trim()) {
          tags = f.Etiketler.split(",").map((t: string) => t.trim() as ItemTag);
        }

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

    // 4. Kategorileri Airtable verisinden dinamik olarak oluştur
    const categoryMap = new Map<string, string>();
    items.forEach((item: any) => {
      const slug = item.category;
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, item.rawCategoryName || slug);
      }
    });

    const categories: Category[] = Array.from(categoryMap.entries()).map(([slug, name], index) => ({
      id: slug,
      slug,
      name,
      order: index + 1,
    }));

    return {
      items,
      categories: categories.length > 0 ? categories : MENU_CATEGORIES,
      restaurantInfo,
    };
  } catch (err) {
    console.error("[Client Airtable Error]:", err);
    return null;
  }
}
