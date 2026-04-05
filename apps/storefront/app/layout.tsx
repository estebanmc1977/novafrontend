import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { novapatchAppearance, esLocalization } from "@/lib/clerk-theme";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Novapatch — Bienestar que no interrumpe tu día",
  description:
    "La forma más limpia y práctica de tomar vitaminas. Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.",
  keywords: "parches vitamínicos, suplementos, bienestar, vitaminas transdérmicas, novapatch, México",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png" },
    other: [
      { rel: "manifest", url: "/favicon/site.webmanifest" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={novapatchAppearance}
      localization={esLocalization}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
    <html lang="es">
      <body className={`${montserrat.variable} min-h-screen`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>

        {/* Openpay SDK — carga después de que la página es interactiva */}
        <Script
          src="https://js.openpay.mx/openpay.v1.min.js"
          strategy="afterInteractive"
        />
        {/* openpay-data: fingerprinting anti-fraude (deviceSessionId) */}
        <Script
          src="https://openpay.s3.amazonaws.com/openpay-data.v1.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
    </ClerkProvider>
  );
}
