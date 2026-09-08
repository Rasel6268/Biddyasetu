export const metadata = {
  title: "Become a Member — Alumni Registration | Biddyasetu",
  description:
    "Register as a Biddyasetu member today. Join as a Life Member or General Member of the official alumni community of Adarsha High School, Kaitola. Access the verified alumni directory, scholarship updates, and exclusive events.",

  keywords: [
    "Biddyasetu membership", "join Biddyasetu", "alumni registration Bangladesh",
    "Adarsha High School membership", "life member alumni Bangladesh",
    "alumni network registration", "Kaitola alumni join",
    "school alumni membership form", "alumni community Bangladesh",
  ],

  alternates: {
    canonical: "https://biddyasetu.org/membership",
  },

  openGraph: {
    title: "Join Biddyasetu — Alumni Membership Registration",
    description:
      "Register as a Life Member or General Member of Biddyasetu. Access the verified alumni directory, scholarship programs, reunions, and exclusive community benefits.",
    url: "https://biddyasetu.org/membership",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Join Biddyasetu — Alumni Registration" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Become a Biddyasetu Member — Alumni Registration",
    description:
      "Join 850+ alumni from Adarsha High School, Kaitola. Register for Life or General membership and access exclusive alumni benefits.",
    images: ["/logo.png"],
  },
};

export default function MembershipLayout({ children }) {
  return children;
}
