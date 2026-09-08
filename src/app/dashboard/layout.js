export const metadata = {
  title: "Member Dashboard | Biddyasetu Alumni Portal",
  description:
    "Official member dashboard for Biddyasetu Alumni Organization. Access your digital alumni card, manage profile information, review payment history, and view event RSVPs.",

  keywords: [
    "Biddyasetu member dashboard",
    "alumni portal dashboard",
    "digital alumni card Bangladesh",
    "Adarsha High School member portal",
    "alumni profile management",
  ],

  openGraph: {
    title: "Member Dashboard — Biddyasetu Alumni Portal",
    description:
      "Manage your alumni profile, digital membership card, payment receipts, and event RSVPs.",
    url: "https://biddyasetu.org/dashboard",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Biddyasetu Member Dashboard" }],
  },
};

export default function DashboardLayout({ children }) {
  return children;
}
