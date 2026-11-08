"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Share2, Check, MapPin, Phone, Search, UtensilsCrossed } from "lucide-react";
import { RestaurantConfig } from "@/types/menu";

interface HeaderProps {
  restaurantInfo: RestaurantConfig;
  onSearchClick: () => void;
  isSearchOpen: boolean;
}

export function Header({
  restaurantInfo,
  onSearchClick,
  isSearchOpen,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: restaurantInfo.name,
          text: `${restaurantInfo.name} - Dijital Menü`,
          url: window.location.href,
        });
      } catch {
        // kullanıcı iptal ettiğinde
      }
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-white border-b border-[#E5DDCF] pt-6 pb-4 px-4 shadow-2xs">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Üst Satır: Restoran Kimliği & Paylaş */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {restaurantInfo.logoUrl ? (
              <div
                style={{ position: "relative" }}
                className="relative w-13 h-13 rounded-2xl overflow-hidden border border-[#E5DDCF] bg-black shadow-xs shrink-0"
              >
                <Image
                  src={restaurantInfo.logoUrl}
                  alt={restaurantInfo.name}
                  fill
                  sizes="52px"
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-[#B34827] text-white flex flex-col items-center justify-center shadow-xs shrink-0 select-none">
                <UtensilsCrossed className="w-5 h-5 text-white/90" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider mt-0.5">
                  {restaurantInfo.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1D1A16] leading-tight">
                {restaurantInfo.name}
              </h1>
              <p className="text-xs text-[#857E74] mt-0.5 font-medium">
                {restaurantInfo.tagline}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#3F5243] font-medium mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-[#3F5243] animate-pulse" />
                <span>Açık</span>
                <span className="text-[#857E74] font-normal">•</span>
                <span className="text-[#57524A] font-normal">{restaurantInfo.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Paylaş Butonu (WiFi ikonu tamamen kaldırıldı) */}
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-xl bg-[#F2ECE1] text-[#1D1A16] hover:bg-[#ECE4D6] flex items-center justify-center transition-colors shrink-0"
            title="Menüyü Paylaş"
            aria-label="Menüyü Paylaş"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#3F5243]" />
            ) : (
              <Share2 className="w-4 h-4 text-[#57524A]" />
            )}
          </button>
        </div>

        {/* 3 Hızlı ve Net Buton: Yol Tarifi | Ara | Menüde Ara */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={restaurantInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#F2ECE1] text-[#1D1A16] hover:bg-[#ECE4D6] text-xs font-semibold border border-[#E5DDCF] transition-all active:scale-98"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B34827]" />
            <span>Yol Tarifi</span>
          </a>

          <a
            href={`tel:${restaurantInfo.phone}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#F2ECE1] text-[#1D1A16] hover:bg-[#ECE4D6] text-xs font-semibold border border-[#E5DDCF] transition-all active:scale-98"
          >
            <Phone className="w-3.5 h-3.5 text-[#B34827]" />
            <span>Ara</span>
          </a>

          <button
            type="button"
            onClick={onSearchClick}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all active:scale-98 ${
              isSearchOpen
                ? "bg-[#1D1A16] text-white"
                : "bg-[#B34827] text-white hover:bg-[#983C1F]"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Menüde Ara</span>
          </button>
        </div>
      </div>
    </header>
  );
}
