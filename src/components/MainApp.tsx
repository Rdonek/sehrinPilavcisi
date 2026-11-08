"use client";

import React, { useState, useEffect } from "react";
import { MenuItem, Category, RestaurantConfig } from "@/types/menu";
import { Header } from "./Header";
import { MenuSection } from "./MenuSection";
import { Footer } from "./Footer";
import { fetchLiveRestaurantData } from "@/lib/client-airtable";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

interface MainAppProps {
  categories: Category[];
  initialItems: MenuItem[];
  restaurantInfo: RestaurantConfig;
}

export function MainApp({
  categories: initialCategories,
  initialItems,
  restaurantInfo: initialRestaurantInfo,
}: MainAppProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantConfig>(initialRestaurantInfo);
  const [isLoading, setIsLoading] = useState(initialItems.length === 0);
  const [syncStatus, setSyncStatus] = useState<string>("Senkronize ediliyor...");
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // Airtable'dan doğrudan ve kesintisiz canlı veri senkronizasyonu
  async function syncData() {
    console.log("📡 [Airtable Canlı Sync] İstek başlatılıyor...");
    try {
      const live = await fetchLiveRestaurantData();
      const timeStr = new Date().toLocaleTimeString("tr-TR");
      setLastSyncTime(timeStr);

      if (!live) {
        console.warn("⚠️ [Airtable Canlı Sync] Yanıt alınamadı.");
        setSyncStatus("Airtable yanıt vermedi");
        return;
      }

      console.log(`✅ [Airtable Canlı Sync] Başarılı! Airtable'dan gelen yemek sayısı: ${live.items.length}`);
      setItems(live.items);
      setSyncStatus(`Canlı: ${live.items.length} ürün`);

      if (Array.isArray(live.categories) && live.categories.length > 0) {
        setCategories(live.categories);
      }
      if (live.restaurantInfo) {
        setRestaurantInfo(live.restaurantInfo);
      }
    } catch (err) {
      console.error("❌ [Airtable Canlı Sync] Hata:", err);
      setSyncStatus("Bağlantı hatası");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Sayfa açıldığında anında canlı çek
    syncData();

    // Sekmeye her tıklandığında / dönüldüğünde canlı çek
    const onFocus = () => syncData();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      {/* Sade, doğrudan içeriği gösteren tekil Header */}
      <Header
        restaurantInfo={restaurantInfo}
        isSearchOpen={isSearchOpen}
        onSearchClick={() => setIsSearchOpen((prev) => !prev)}
      />

      {/* Canlı Airtable Durum Çubuğu */}
      <div className="max-w-2xl mx-auto px-4 w-full pt-2">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#EFE9DF] border border-[#E0D7C8] text-[11px] text-[#5C554B]">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Airtable: {syncStatus}</span>
            {lastSyncTime && <span className="text-[#857E74]">({lastSyncTime})</span>}
          </div>
          <button
            type="button"
            onClick={() => syncData()}
            className="flex items-center gap-1 text-[#B34827] font-semibold hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* Doğrudan Menü ve Kategori Akışı */}
      <main className="flex-1">
        {isLoading && items.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 mx-auto text-[#B34827] animate-spin" />
            <p className="text-sm font-medium text-[#857E74]">
              Menü Airtable&apos;dan canlı yükleniyor...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center space-y-2 max-w-md mx-auto px-4">
            <p className="text-base font-bold text-[#1D1A16]">Airtable Menü Tablosu Boş</p>
            <p className="text-xs text-[#857E74]">
              Airtable&apos;daki &quot;menu&quot; tablonuza yemek eklediğinizde sayfayı yenileyerek anında burada görebilirsiniz.
            </p>
          </div>
        ) : (
          <MenuSection
            key={`${items.length}-${categories.length}`}
            categories={categories}
            initialItems={items}
            isSearchOpen={isSearchOpen}
            onCloseSearch={() => setIsSearchOpen(false)}
          />
        )}
      </main>

      {/* Sade, açık renkli ve Airtable'dan beslenen Footer */}
      <Footer restaurantInfo={restaurantInfo} />
    </div>
  );
}



