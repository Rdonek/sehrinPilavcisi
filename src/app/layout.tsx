import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RESTAURANT_INFO } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${RESTAURANT_INFO.name} | Dijital Menü & Karşılama`,
  description: RESTAURANT_INFO.description,
  keywords: [
    "lokanta",
    "cafe bistro",
    "qr menü",
    "kadıköy yemek",
    "ev yemekleri",
    "taş fırın",
  ],
  authors: [{ name: RESTAURANT_INFO.name }],
  openGraph: {
    title: `${RESTAURANT_INFO.name} | Dijital Menü`,
    description: RESTAURANT_INFO.description,
    type: "website",
    locale: "tr_TR",
  },
};

export const viewport: Viewport = {
  themeColor: "#1D1A16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F9F6F0] text-[#1D1A16] antialiased">
        {children}
      </body>
    </html>
  );
}
