import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getCategories, getSaleProducts } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Base URL used to turn the generated share image into an absolute URL.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL("http://localhost:3000");

const title = "Amalina Market — Soins naturels";
const description =
  "Amalina Market — une sélection raffinée de soins : visage, cheveux, écrans solaires, shampoings, huiles et masques. Élégance et beauté naturelle.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Amalina Market",
    locale: "fr_FR",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, user, saleProducts] = await Promise.all([
    getCategories(),
    getCurrentUser(),
    getSaleProducts(),
  ]);

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <CartProvider>
          <Header
            categories={categories}
            userEmail={user?.email ?? null}
            isAdmin={user?.profile?.is_admin ?? false}
            hasSale={saleProducts.length > 0}
          />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </CartProvider>
      </body>
    </html>
  );
}
