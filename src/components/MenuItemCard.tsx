"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Leaf, Flame } from "lucide-react";
import { MenuItem, ItemTag } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const isAvailable = item.isAvailable;

  const renderTag = (tag: ItemTag) => {
    switch (tag) {
      case "Şefin Seçimi":
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F9F1E2] text-[#B87618] text-[10px] font-bold"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Şefin Seçimi</span>
          </span>
        );
      case "Vejetaryen":
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EBF0EC] text-[#3F5243] text-[10px] font-bold"
          >
            <Leaf className="w-2.5 h-2.5" />
            <span>Vejetaryen</span>
          </span>
        );
      case "Taş Fırın":
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F7EBE7] text-[#B34827] text-[10px] font-bold"
          >
            <Flame className="w-2.5 h-2.5" />
            <span>Taş Fırın</span>
          </span>
        );
      default:
        return (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F2ECE1] text-[#57524A] text-[10px] font-medium"
          >
            {tag}
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group bg-white rounded-2xl border border-[#E5DDCF] p-3.5 transition-all duration-150 cursor-pointer shadow-2xs hover:border-[#B34827]/40 flex gap-3.5 items-start ${
        !isAvailable ? "opacity-60 grayscale-50 bg-[#F9F6F0]" : ""
      }`}
    >
      {/* Sol Bilgiler */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="space-y-1">
          {/* Etiketler */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {item.tags.map((tag) => renderTag(tag))}
            </div>
          )}

          {/* Yemek Adı */}
          <h4 className="font-serif font-bold text-base text-[#1D1A16] group-hover:text-[#B34827] transition-colors leading-snug">
            {item.name}
          </h4>

          {/* Açıklama */}
          {item.description && (
            <p className="text-xs text-[#57524A] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Fiyat ve Durum */}
        <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
          <span className="font-bold text-base text-[#1D1A16] font-mono tracking-tight">
            ₺{item.price}
          </span>

          {!isAvailable && (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
              Tükendi
            </span>
          )}
        </div>
      </div>

      {/* Sağ Görsel */}
      {item.imageUrl && (
        <div
          style={{ position: "relative" }}
          className="relative shrink-0 w-22 h-22 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#E5DDCF]/80 bg-[#F2ECE1]"
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="100px"
            className="object-cover"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
              <span className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Bitti
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
