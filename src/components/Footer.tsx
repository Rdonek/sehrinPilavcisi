"use client";

import React, { useState } from "react";
import { MapPin, Phone, Clock, ArrowUpRight, Copy, Check } from "lucide-react";
import { RestaurantConfig } from "@/types/menu";

interface FooterProps {
  restaurantInfo: RestaurantConfig;
}

export function Footer({ restaurantInfo }: FooterProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(restaurantInfo.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <footer className="bg-white border-t border-[#E5DDCF] mt-auto py-8 px-4 text-[#57524A]">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Başlık ve Slogan */}
        <div className="border-b border-[#E5DDCF]/70 pb-4">
          <h3 className="font-serif font-bold text-lg text-[#1D1A16]">
            {restaurantInfo.name}
          </h3>
          <p className="text-xs text-[#857E74]">
            {restaurantInfo.tagline}
          </p>
        </div>

        {/* İletişim Bilgileri (Airtable'dan Yönetilebilir) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Adres */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#1D1A16]">
              <MapPin className="w-3.5 h-3.5 text-[#B34827]" />
              <span>Adres</span>
            </div>
            <p className="text-[#57524A] leading-relaxed">
              {restaurantInfo.address}
            </p>
            <div className="flex items-center gap-3 pt-0.5">
              <a
                href={restaurantInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#B34827] font-semibold hover:underline"
              >
                <span>Haritada Aç</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={copyAddress}
                className="text-[#857E74] hover:text-[#1D1A16] transition-colors"
              >
                {copiedAddress ? (
                  <span className="text-[#3F5243] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Kopyalandı
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Kopyala
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Çalışma Saatleri & Telefon */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#1D1A16]">
                <Clock className="w-3.5 h-3.5 text-[#B34827]" />
                <span>Çalışma Saatleri</span>
              </div>
              <p className="text-[#57524A]">
                {restaurantInfo.openingHours}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#1D1A16]">
                <Phone className="w-3.5 h-3.5 text-[#B34827]" />
                <span>Telefon</span>
              </div>
              <a
                href={`tel:${restaurantInfo.phone}`}
                className="text-[#B34827] font-bold text-sm hover:underline block"
              >
                {restaurantInfo.formattedPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Telif */}
        <div className="pt-4 border-t border-[#E5DDCF]/70 text-center text-[11px] text-[#857E74]">
          © {new Date().getFullYear()} {restaurantInfo.name} • Dijital QR Menü
        </div>
      </div>
    </footer>
  );
}
