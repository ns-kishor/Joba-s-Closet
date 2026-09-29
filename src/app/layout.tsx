import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://jobascloset.com"),
  title: {
    default: "Joba's Closet — Affordable Beauty, Jewelry & Style for Women",
    template: "%s | Joba's Closet",
  },
  description:
    "Joba's Closet is a women's online boutique for affordable beauty essentials, artificial & fashion jewelry, press-on nails, accessories and everyday lifestyle picks — starting from ৳100. Cash on Delivery across Bangladesh.",
  keywords: [
    "Joba's Closet",
    "women fashion Bangladesh",
    "artificial jewelry",
    "fashion jewelry BD",
    "press on nails",
    "affordable cosmetics Bangladesh",
    "online beauty shop BD",
    "Cash on Delivery",
  ],
  applicationName: "Joba's Closet",
  openGraph: {
    title: "Joba's Closet — Your Little World of Beauty & Style",
    description:
      "Discover beautiful accessories, beauty essentials and everyday favorites — all in one place. Affordable picks starting from ৳100.",
    url: "https://jobascloset.com",
    siteName: "Joba's Closet",
    type: "website",
    locale: "en_BD",
    images: [
      {
        url: "/images/brand/hero.jpg",
        width: 864,
        height: 1152,
        alt: "Joba's Closet — feminine beauty and fashion boutique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joba's Closet — Your Little World of Beauty & Style",
    description:
      "Affordable beauty, jewelry, nails & lifestyle picks for women. Starting from ৳100.",
  },
  icons: {
    icon: "/icon.svg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
