// Cloudflare Pages Function: /api/data
// Airtable'dan CANLI veriyi her istekte veya kısa süreli edge cache ile çeker.

interface Env {
  AIRTABLE_API_KEY?: string;
  AIRTABLE_BASE_ID?: string;
  AIRTABLE_TABLE_NAME?: string;
}

const DEFAULT_INFO = {
  name: "Şehrin Pilavcısı",
  tagline: "Geleneksel Lezzet • Günlük Taze • Usta İşi",
  description: "Şehrin en iyi ve en taze tereyağlı pilavları, tencere lezzetleri ve fırın spesiyalleri.",
  phone: "905321234567",
  formattedPhone: "0 (532) 123 45 67",
  whatsapp: "905321234567",
  address: "Bağdat Caddesi No: 142/A, Kadıköy, İstanbul",
  openingHours: "Her gün 11:00 - 02:00",
  googleMapsUrl: "https://maps.google.com/?q=Sehrin+Pilavcisi+Kadikoy",
  instagramUrl: "https://instagram.com/sehrinpilavcisi",
};

export async function onRequest(context: { env: Env }) {
  const apiKey = context.env?.AIRTABLE_API_KEY;
  const baseId = context.env?.AIRTABLE_BASE_ID || "app808CAtVXo4HrF3";
  const tableName = context.env?.AIRTABLE_TABLE_NAME || "menu";

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "AIRTABLE_API_KEY environment variable is not set in Cloudflare Pages.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // 1. Menü kayıtlarını çek
    const menuUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const menuRes = await fetch(menuUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    let menuRecords: any[] = [];
    if (menuRes.ok) {
      const menuData: any = await menuRes.json();
      if (Array.isArray(menuData.records)) {
        menuRecords = menuData.records;
      }
    }

    // 2. Ayarlar tablosunu çek
    let restaurantInfo: any = { ...DEFAULT_INFO };
    const settingsCandidates = ["ayarlar", "Ayarlar", "İletişim", "Iletisim", "Settings"];

    for (const candidate of settingsCandidates) {
      try {
        const ayarlarUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(candidate)}`;
        const ayarlarRes = await fetch(ayarlarUrl, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });

        if (ayarlarRes.ok) {
          const ayarlarData: any = await ayarlarRes.json();
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
        // Sonraki adayı dene
      }
    }

    // 3. Menü kayıtlarını filtrele ve formatla
    const items = menuRecords
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

        let tags: string[] = [];
        if (Array.isArray(f.Etiketler)) {
          tags = f.Etiketler;
        } else if (typeof f.Etiketler === "string" && f.Etiketler.trim()) {
          tags = f.Etiketler.split(",").map((t: string) => t.trim());
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

    // 4. Kategorileri dinamik oluştur
    const categoryMap = new Map<string, string>();
    items.forEach((item: any) => {
      const slug = item.category;
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, item.rawCategoryName || slug);
      }
    });

    const categories = Array.from(categoryMap.entries()).map(([slug, name], index) => ({
      id: slug,
      slug,
      name,
      order: index + 1,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        items,
        categories,
        restaurantInfo,
        updatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // 10 saniye cache, 30 saniye arka planda güncelle (stale-while-revalidate)
          "Cache-Control": "public, max-age=10, s-maxage=10, stale-while-revalidate=30",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
