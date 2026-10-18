import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { contact, site } from "@/lib/content";
import "./globals.css";

/** One family for the whole site: solid headings, highly readable text. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.metaDescription,
  keywords: [
    "Adedoyin Omolola",
    "Doyin Omolola",
    "Real Estate Paralegal",
    "Paralegal Manchester",
    "Commercial Property",
    "Property Acquisitions",
    "Commercial Contracts",
    "Due Diligence",
    "SQE1",
    "SQE2",
    "BPP Law School",
    "University of Sheffield",
  ],
  authors: [{ name: site.name, url: contact.linkedin }],
  creator: site.name,
  openGraph: {
    type: "profile",
    locale: "en_GB",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
    siteName: site.name,
    images: [
      {
        url: site.photo,
        width: 776,
        height: 768,
        alt: `${site.name}, ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
    images: [site.photo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Structured data so search engines understand who this page is about. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.roleLong,
  email: `mailto:${contact.email}`,
  image: `${site.url}${site.photo}`,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manchester",
    addressCountry: "GB",
  },
  sameAs: [contact.linkedin].filter(Boolean),
  knowsAbout: [
    "Real Estate Law",
    "Commercial Property Transactions",
    "Property Searches and Title Review",
    "Commercial Contracts",
    "Due Diligence",
    "Mergers and Acquisitions",
    "Legal Research",
    "Stakeholder Management",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "BPP University" },
    { "@type": "CollegeOrUniversity", name: "University of Sheffield" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={`${archivo.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded focus:bg-fg focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
