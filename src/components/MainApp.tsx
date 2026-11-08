"use client";

import React, { useState, useEffect } from "react";
import { MenuItem, Category, RestaurantConfig } from "@/types/menu";
import { Header } from "./Header";
import { MenuSection } from "./MenuSection";
import { Footer } from "./Footer";
import { fetchLiveRestaurantData } from "@/lib/client-airtable";
import { Loader2 } from "lucide-react";

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

  // Airtable'dan doğrudan ve kesintisiz canlı veri senkronizasyonu
  useEffect(() => {
    let isMounted = true;

    async function syncData() {
      try {
        const live = await fetchLiveRestaurantData();
        if (!isMounted || !live) return;

        if (Array.isArray(live.items)) {
          setItems(live.items);
        }
        if (Array.isArray(live.categories) && live.categories.length > 0) {
          setCategories(live.categories);
        }
        if (live.restaurantInfo) {
          setRestaurantInfo(live.restaurantInfo);
        }
      } catch (err) {
        console.error("Airtable sync hatası:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    // Sayfa açıldığında anında canlı çek
    syncData();

    // Sekmeye her tıklandığında / dönüldüğünde canlı çek
    const onFocus = () => syncData();
    window.addEventListener("focus", onFocus);

    return () => {
      isMounted = false;
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

      {/* Doğrudan Menü ve Kategori Akışı */}
      <main className="flex-1">
        {isLoading && items.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 mx-auto text-[#B34827] animate-spin" />
            <p className="text-sm font-medium text-[#857E74]">
              Menü Airtable&apos;dan canlı yükleniyor...
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


