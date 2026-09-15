import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { SITE } from "@/lib/constants";
import { getSettings, numericSetting } from "@/lib/settings";
import { getSessionPayload } from "@/lib/auth";
import { CartProvider } from "@/components/providers/cart-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Nigerian Restaurant & Ordering`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Nigerian restaurant",
    "Nigerian food",
    "Nigerian cuisine",
    "Jollof rice",
    "Suya",
    "African restaurant",
    "Egusi soup",
    "pepper soup",
    "Lagos restaurant",
    SITE.name,
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — The Taste of Nigeria, Reimagined`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Nigerian Restaurant`,
    description: SITE.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1B1712",
  width: "device-width",
  initialScale: 1,
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, session] = await Promise.all([getSettings(), getSessionPayload()]);

  const meta = {
    deliveryFee: numericSetting(settings, "delivery_fee", 1200),
    deliveryMinOrder: numericSetting(settings, "delivery_min_order", 3000),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    address: { "@type": "PostalAddress", streetAddress: SITE.address },
    servesCuisine: ["Nigerian", "African"],
    priceRange: "₦₦",
    url: SITE.url,
  };

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider userId={session?.userId} meta={meta}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-burgundy focus:px-4 focus:py-2 focus:text-paper"
          >
            Skip to content
          </a>
          <Navbar
            user={session ? { name: session.name, email: session.email, role: session.role } : null}
            settings={settings}
          />
          <main id="main-content">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={settings} />
        </CartProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1B1712",
              color: "#F7F2E8",
              border: "1px solid rgba(184,137,43,.35)",
              borderRadius: "4px",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}