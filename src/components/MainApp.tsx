"use client";

import React, { useState } from "react";
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
  categories,
  initialItems,
  restaurantInfo,
}: MainAppProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
      {/* Sade, doğrudan içeriği gösteren tekil Header */}
      <Header
        restaurantInfo={restaurantInfo}
        isSearchOpen={isSearchOpen}
        onSearchClick={() => setIsSearchOpen((prev) => !prev)}
      />

      {/* Doğrudan Menü ve Kategori Akışı (Gereksiz hero kaldırıldı) */}
      <main className="flex-1">
        <MenuSection
          categories={categories}
          initialItems={initialItems}
          isSearchOpen={isSearchOpen}
          onCloseSearch={() => setIsSearchOpen(false)}
        />
      </main>

      {/* Sade, açık renkli ve Airtable'dan beslenen Footer */}
      <Footer restaurantInfo={restaurantInfo} />
    </div>
  );
}
