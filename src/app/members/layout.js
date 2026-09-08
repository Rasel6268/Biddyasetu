export const metadata = {
  title: "Alumni Directory — Search & Connect with 850+ Members | Biddyasetu",
  description:
    "Browse the official Biddyasetu alumni directory. Search and connect with verified alumni from Adarsha High School, Kaitola. Filter by batch, profession, country, and membership type. Find blood donors and global network members.",

  keywords: [
    "Biddyasetu alumni directory", "Adarsha High School alumni list",
    "Bangladesh alumni search", "school alumni directory", "Kaitola alumni",
    "alumni search Bangladesh", "verified alumni", "life member alumni",
    "blood donor alumni Bangladesh",
  ],

  alternates: {
    canonical: "https://biddyasetu.org/members",
  },

  openGraph: {
    title: "Alumni Directory — Biddyasetu | Search 850+ Members",
    description:
      "Find and connect with alumni from Adarsha High School, Kaitola. Filter by batch, profession, and country. Join the Biddyasetu community today.",
    url: "https://biddyasetu.org/members",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Biddyasetu Alumni Directory" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Biddyasetu Alumni Directory — Search 850+ Members",
    description:
      "Browse and connect with verified alumni of Adarsha High School, Kaitola across Bangladesh and worldwide.",
    images: ["/logo.png"],
  },
};

export default function MembersLayout({ children }) {
  return children;
}
