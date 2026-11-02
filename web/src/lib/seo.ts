import type { Metadata } from "next";
import { SITE_URL, site } from "@/data/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, keywords, noindex }: PageSeo): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
      locale: "en_IN",
      images: [{ url: "/images/logo.jpeg", width: 768, height: 400, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/images/logo.jpeg"],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: site.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.jpeg`,
  image: `${SITE_URL}/images/logo.jpeg`,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  priceRange: "₹1,000 - ₹25,000+",
  address: {
    "@type": "PostalAddress",
    streetAddress: "P NO 8, near VPM Classes, B yojna, Radha Kunj, Mansarovar",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: { "@type": "Country", name: "India" },
  sameAs: [site.socials.facebook, site.socials.instagram, site.socials.linkedin],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", reviewCount: "8" },
};

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});
