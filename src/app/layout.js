import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppProviders from "@/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://biddyasetu.org"),

  title: {
    default: "Biddyasetu — Adarsha High School Alumni Organization",
    template: "%s | Biddyasetu",
  },

  description:
    "Biddyasetu is a non-profit voluntary alumni organization of Adarsha High School, Kaitola — connecting alumni, supporting students, and building a better future through education and community.",

  keywords: [
    "Biddyasetu",
    "Adarsha High School",
    "Kaitola",
    "Alumni Association",
    "Bangladesh Alumni",
    "School Alumni",
    "Scholarship",
    "Education",
    "Bangladesh",
    "Community",
    "Non-profit Organization",
    "Alumni Network",
    "Student Welfare",
  ],

  authors: [
    { name: "Biddyasetu Alumni Organization" },
    { name: "Adarsha High School, Kaitola" },
  ],

  creator: "Biddyasetu Alumni Organization",
  publisher: "Biddyasetu Alumni Organization",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://biddyasetu.org",
  },

  openGraph: {
    title: "Biddyasetu — Adarsha High School Alumni Organization",
    description:
      "Connecting Alumni, Empowering Students, Building a Better Future. Join 850+ registered alumni from Adarsha High School, Kaitola.",
    url: "https://biddyasetu.org",
    siteName: "Biddyasetu",
    type: "website",
    locale: "en_BD",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Biddyasetu — Adarsha High School Alumni Organization",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 600,
        height: 600,
        alt: "Biddyasetu Logo",
        type: "image/jpeg",
      },
    ],
    emails: ["info@biddyasetu.org"],
    phoneNumbers: ["+8801700000000"],
    countryName: "Bangladesh",
  },

  twitter: {
    card: "summary_large_image",
    site: "@biddyasetu",
    creator: "@biddyasetu",
    title: "Biddyasetu — Adarsha High School Alumni Organization",
    description:
      "Connecting Alumni, Empowering Students, Building a Better Future. Join 850+ registered alumni from Adarsha High School, Kaitola.",
    images: [
      {
        url: "/og-image.jpg",
        alt: "Biddyasetu — Adarsha High School Alumni Organization",
      },
    ],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  category: "Education",
  classification: "Alumni Organization | Non-profit",

  applicationName: "Biddyasetu",
  appLinks: {
    web: {
      url: "https://biddyasetu.org",
      should_fallback: true,
    },
  },

  assets: ["https://biddyasetu.org/assets"],

  bookmarks: ["https://biddyasetu.org"],


  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  abstract:
    "Biddyasetu is a non-profit voluntary alumni organization established on 17 February 2026, connecting former students of Adarsha High School, Kaitola across Bangladesh and internationally.",

  appleWebApp: {
    title: "Biddyasetu",
    statusBarStyle: "default",
    capable: true,
  },

  itunes: {
    appId: "your-app-id",
    appStoreId: "your-app-store-id",
  },

  msapplication: {
    tileImage: "/mstile-144x144.png",
    tileColor: "#06A3EC",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#06A3EC",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} style={{ scrollBehavior: "smooth" }}>
      <head>
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon - Alternative formats */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* JSON-LD Schema Markup for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Biddyasetu",
              alternateName: "Biddyasetu Alumni Organization",
              description:
                "Biddyasetu is a non-profit voluntary alumni organization of Adarsha High School, Kaitola — connecting alumni, supporting students, and building a better future through education and community.",
              url: "https://biddyasetu.org",
              logo: "https://biddyasetu.org/logo.png",
              foundingDate: "2026-02-17",
              foundingLocation: {
                "@type": "Place",
                name: "Kaitola, Bangladesh",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressLocality: "Kaitola",
                addressRegion: "Bangladesh",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@biddyasetu.org",
                contactType: "General Inquiries",
                availableLanguage: ["English", "Bengali"],
              },
              sameAs: [
                "https://facebook.com/biddyasetu",
                "https://twitter.com/biddyasetu",
                "https://linkedin.com/company/biddyasetu",
                "https://youtube.com/biddyasetu",
                "https://instagram.com/biddyasetu",
              ],
              memberOf: {
                "@type": "Organization",
                name: "Adarsha High School, Kaitola",
              },
              parentOrganization: {
                "@type": "EducationalOrganization",
                name: "Adarsha High School, Kaitola",
                description: "A prestigious educational institution in Kaitola, Bangladesh",
              },
              numberOfEmployees: {
                "@type": "QuantitativeValue",
                value: 15,
              },
              foundingDate: "2026-02-17",
              founder: "Alumni Collective",
              funder: "Alumni Donations",
              purpose: "Connecting alumni, empowering students, and building community",
              mission: "To build a strong, inclusive alumni network that supports students, facilitates professional growth, and fosters lifelong connections.",
              vision: "A world where every alumni stays connected and contributes to the growth of their alma mater.",
            }),
          }}
        />

        {/* JSON-LD for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Biddyasetu",
              url: "https://biddyasetu.org",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://biddyasetu.org/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              about: {
                "@type": "Thing",
                name: "Alumni Organization",
                description: "Alumni organization of Adarsha High School, Kaitola",
              },
              author: {
                "@type": "Organization",
                name: "Biddyasetu Alumni Organization",
              },
            }),
          }}
        />

        {/* JSON-LD for BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://biddyasetu.org",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item: "https://biddyasetu.org/about",
                },
              ],
            }),
          }}
        />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AppProviders>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}