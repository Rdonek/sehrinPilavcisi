"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Clock, AlertCircle, MessageCircle, Utensils, Phone } from "lucide-react";
import { MenuItem, RestaurantConfig } from "@/types/menu";
import { RESTAURANT_INFO } from "@/lib/constants";

interface ItemModalProps {
  item: MenuItem | null;
  restaurantInfo?: RestaurantConfig;
  onClose: () => void;
}

export function ItemModal({ item, restaurantInfo, onClose }: ItemModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const info = restaurantInfo || RESTAURANT_INFO;
  const whatsappMessage = encodeURIComponent(
    `Merhaba ${info.name}, menünüzdeki "${item.name}" (₺${item.price}) siparişi vermek istiyorum.`
  );
  const whatsappUrl = `https://wa.me/${info.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative z-10 bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#E5DDCF] max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-20 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors backdrop-blur-xs"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Büyük Görsel */}
        {item.imageUrl && (
          <div
            style={{ position: "relative" }}
            className="relative w-full h-56 sm:h-64 bg-[#F2ECE1] shrink-0"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 500px"
            />
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                  Şu Anda Tükendi
                </span>
              </div>
            )}
          </div>
        )}

        {/* İçerik */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Başlık ve Fiyat */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1D1A16] leading-snug">
                {item.name}
              </h3>
              {item.portionInfo && (
                <p className="text-xs text-[#857E74] mt-0.5">
                  Porsiyon: {item.portionInfo}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono font-bold text-2xl text-[#B34827]">
                ₺{item.price}
              </span>
            </div>
          </div>

          {/* Açıklama */}
          <p className="text-sm text-[#57524A] leading-relaxed">
            {item.description}
          </p>

          {/* Hazırlık ve Alerjen Bilgisi */}
          <div className="pt-2 space-y-2 border-t border-[#E5DDCF]/80">
            {item.prepTime && (
              <div className="flex items-center gap-2 text-xs text-[#57524A]">
                <Clock className="w-4 h-4 text-[#857E74]" />
                <span>Hazırlanma / Servis Süresi: <strong>{item.prepTime}</strong></span>
              </div>
            )}

            {item.allergens && item.allergens.length > 0 && (
              <div className="flex items-start gap-2 text-xs text-[#57524A]">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#857E74]">Alerjen Uyarısı: </span>
                  <span className="font-medium text-[#1D1A16]">{item.allergens.join(", ")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Aksiyon Butonları */}
          <div className="pt-4 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp ile Sipariş / Sor</span>
            </a>

            <div className="flex gap-2">
              <a
                href={`tel:${info.phone}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F2ECE1] text-[#1D1A16] hover:bg-[#ECE4D6] text-sm font-semibold border border-[#E5DDCF] transition-colors flex items-center justify-center gap-2 active:scale-98"
              >
                <Phone className="w-4 h-4 text-[#B34827]" />
                <span>Restoranı Ara</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-[#EFE9DF] text-[#57524A] text-sm font-medium hover:bg-[#E5DDCF] transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
