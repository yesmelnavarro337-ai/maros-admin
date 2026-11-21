import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maros-admin2.vercel.app"),
  title: "Maro's Pijamas — Panel Administrativo",
  description: "Panel de control y gestión oficial de Maro's Pijamas",
  icons: {
    icon: [{ url: "/logo.png", sizes: "any" }],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
          <Toaster position="top-right" />
      </body>
    </html>
  );
}

