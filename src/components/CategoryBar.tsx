"use client";

import React, { useRef, useEffect } from "react";
import { Category } from "@/types/menu";

interface CategoryBarProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  categoryCounts?: Record<string, number>;
}

export function CategoryBar({
  categories,
  activeCategoryId,
  onSelectCategory,
  categoryCounts = {},
}: CategoryBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
        `[data-category="${activeCategoryId}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategoryId]);

  return (
    <div className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5DDCF] shadow-xs">
      <div className="max-w-2xl mx-auto px-4">
        <div
          ref={containerRef}
          className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {/* Tümü Butonu */}
          <button
            type="button"
            data-category="all"
            onClick={() => onSelectCategory("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategoryId === "all"
                ? "bg-[#B34827] text-white shadow-xs"
                : "bg-[#F2ECE1] text-[#57524A] hover:bg-[#ECE4D6]"
            }`}
          >
            Tüm Menü
          </button>

          {/* Kategoriler */}
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            const count = categoryCounts[cat.id];

            return (
              <button
                key={cat.id}
                type="button"
                data-category={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#B34827] text-white shadow-xs"
                    : "bg-[#F2ECE1] text-[#57524A] hover:bg-[#ECE4D6]"
                }`}
              >
                <span>{cat.name}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-black/5 text-[#857E74]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
