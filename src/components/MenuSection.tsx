"use client";

import React, { useState, useMemo } from "react";
import { Category, MenuItem } from "@/types/menu";
import { CategoryBar } from "./CategoryBar";
import { MenuItemCard } from "./MenuItemCard";
import { ItemModal } from "./ItemModal";
import { Search, X, Utensils } from "lucide-react";

interface MenuSectionProps {
  categories: Category[];
  initialItems: MenuItem[];
  isSearchOpen: boolean;
  onCloseSearch: () => void;
}

export function MenuSection({
  categories,
  initialItems,
  isSearchOpen,
  onCloseSearch,
}: MenuSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Kategori ürün sayıları
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [initialItems]);

  // Filtreleme
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      if (activeCategoryId !== "all" && item.category !== activeCategoryId) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [initialItems, activeCategoryId, searchQuery]);

  const isGrouping = activeCategoryId === "all" && !searchQuery;

  return (
    <section className="pb-12">
      {/* Yapışkan Kategori Barı */}
      <CategoryBar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        categoryCounts={categoryCounts}
      />

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Opsiyonel Arama Kutusu (Header'daki 'Menüde Ara' tıklandığında açılır) */}
        {isSearchOpen && (
          <div className="relative animate-in fade-in slide-in-from-top-2 duration-150">
            <Search className="w-4 h-4 text-[#857E74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yemek veya malzeme ara..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-white border border-[#E5DDCF] text-sm text-[#1D1A16] placeholder-[#857E74] focus:outline-hidden focus:ring-2 focus:ring-[#B34827]/30 shadow-2xs"
            />
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                onCloseSearch();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857E74] hover:text-[#1D1A16] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Yemek Listesi */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5DDCF] p-8 text-center space-y-2">
            <Utensils className="w-6 h-6 mx-auto text-[#857E74]" />
            <h4 className="font-serif font-bold text-base text-[#1D1A16]">
              Sonuç bulunamadı
            </h4>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategoryId("all");
              }}
              className="text-xs text-[#B34827] font-semibold hover:underline"
            >
              Tüm Menüyü Göster
            </button>
          </div>
        ) : isGrouping ? (
          <div className="space-y-6">
            {categories.map((category) => {
              const itemsInCategory = filteredItems.filter(
                (item) => item.category === category.id
              );
              if (itemsInCategory.length === 0) return null;

              return (
                <div key={category.id} className="space-y-2.5">
                  <div className="flex items-baseline gap-2 pt-2">
                    <h3 className="font-serif font-bold text-lg text-[#1D1A16]">
                      {category.name}
                    </h3>
                    <span className="text-xs text-[#857E74]">
                      ({itemsInCategory.length})
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {itemsInCategory.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onSelect={setSelectedItem}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5 pt-2">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tıklanan Yemek Detay Modalı */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
