export const metadata = {
  title: "Contact Us — Get In Touch | Biddyasetu Alumni Organization",
  description:
    "Contact Biddyasetu — the alumni organization of Adarsha High School, Kaitola. Send a message, find donation bank details, or connect via Facebook. We respond within 24–48 hours.",

  keywords: [
    "Contact Biddyasetu", "Biddyasetu email", "Biddyasetu phone",
    "Adarsha High School alumni contact", "donate Biddyasetu", "alumni organization contact Bangladesh",
    "Kaitola alumni contact", "Biddyasetu donation bank",
  ],

  alternates: {
    canonical: "https://biddyasetu.org/contact",
  },

  openGraph: {
    title: "Contact Biddyasetu — Alumni Organization of Adarsha High School",
    description:
      "Get in touch with Biddyasetu. Send a message, inquire about membership or scholarships, or find our official donation bank details.",
    url: "https://biddyasetu.org/contact",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Contact Biddyasetu" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Biddyasetu — Alumni Organization, Kaitola",
    description:
      "Reach out to Biddyasetu for membership, scholarships, donations, or general inquiries. We are here to help.",
    images: ["/logo.png"],
  },
};

export default function ContactLayout({ children }) {
  return children;
}
