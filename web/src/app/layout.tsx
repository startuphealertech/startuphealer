import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL, site } from "@/data/site";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StartupHealer — Startup India, MSME, GST, ISO & Funding Consultants | Jaipur",
    template: "%s | StartupHealer",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "StartupHealer",
    "Startup India registration",
    "DPIIT recognition",
    "MSME Udyam registration",
    "GST registration",
    "ISO 9001 certification",
    "Trademark registration",
    "Company registration",
    "Startup funding",
    "Startup consultant Jaipur",
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: site.name,
    title: "StartupHealer — We Don't Just Consult, We Care",
    description: site.description,
    images: [{ url: "/images/logo.jpeg", width: 768, height: 400, alt: "StartupHealer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StartupHealer — We Don't Just Consult, We Care",
    description: site.description,
    images: ["/images/logo.jpeg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06b6d4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
