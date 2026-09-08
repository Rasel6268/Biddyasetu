export const metadata = {
  title: "Log In — Alumni Portal | Biddyasetu",
  description:
    "Log in to your Biddyasetu alumni account with your phone number and password. Access the verified alumni directory, membership privileges, reunion RSVPs, and community updates.",

  keywords: [
    "Biddyasetu login",
    "alumni portal login",
    "Adarsha High School alumni login",
    "Biddyasetu member sign in",
    "Kaitola alumni login",
    "Bangladesh alumni network portal",
  ],

  alternates: {
    canonical: "https://biddyasetu.org/login",
  },

  openGraph: {
    title: "Log In — Biddyasetu Alumni Portal",
    description:
      "Sign in with your phone number and password to access the verified directory and member services of Biddyasetu Alumni Organization.",
    url: "https://biddyasetu.org/login",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Biddyasetu Alumni Portal Login" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Log In — Biddyasetu Alumni Portal",
    description:
      "Sign in with your phone number and password to access the verified directory and member services of Biddyasetu Alumni Organization.",
    images: ["/logo.png"],
  },
};

export default function LoginLayout({ children }) {
  return children;
}
