"use client";

import React, { useState, useEffect } from "react";
import { MenuItem, Category, RestaurantConfig } from "@/types/menu";
import { Header } from "./Header";
import { MenuSection } from "./MenuSection";
import { Footer } from "./Footer";

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

  // Airtable'dan CANLI veriyi arka planda otomatik senkronize et
  useEffect(() => {
    let isMounted = true;

    async function syncLiveData() {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data.success) return;

        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (data.restaurantInfo) {
          setRestaurantInfo((prev) => ({
            ...prev,
            ...data.restaurantInfo,
          }));
        }
      } catch (err) {
        console.warn("Canlı veri senkronizasyonu bekleniyor:", err);
      }
    }

    // İlk açılışta canlı veriyi çek
    syncLiveData();

    // Kullanıcı sekmeye her döndüğünde en güncel menüyü çek
    const onFocus = () => syncLiveData();
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
        <MenuSection
          key={items.length}
          categories={categories}
          initialItems={items}
          isSearchOpen={isSearchOpen}
          onCloseSearch={() => setIsSearchOpen(false)}
        />
      </main>

      {/* Sade, açık renkli ve Airtable'dan beslenen Footer */}
      <Footer restaurantInfo={restaurantInfo} />
    </div>
  );
}

