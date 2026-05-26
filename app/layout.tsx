import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrintSpark - Print Fast. Look Amazing.",
  description: "Your vision, perfectly printed. Custom business cards, flyers, banners, t-shirts, and more. 2-3 day turnaround, premium quality, delivered nationwide.",
  keywords: ["printing", "custom printing", "business cards", "flyers", "banners", "t-shirts", "print on demand", "fast printing", "quality printing"],
  openGraph: {
    title: "PrintSpark - Print Fast. Look Amazing.",
    description: "Your vision, perfectly printed. Fast turnaround, premium quality.",
    url: "https://printspark.website",
    siteName: "PrintSpark",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintSpark - Print Fast. Look Amazing.",
    description: "Custom printing with 2-3 day turnaround",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
