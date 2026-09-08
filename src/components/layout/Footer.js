"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
} from "lucide-react";
import { orgInfo } from "@/lib/data/demo";

const footerLinks = {
  Organization: [
    { label: "About Biddyasetu", href: "/about" },
    { label: "Organization Structure", href: "/structure" },
    { label: "Core Values", href: "/about#values" },
    { label: "Founding Milestones", href: "/about#timeline" },
  ],
  Community: [
    { label: "Alumni Directory", href: "/members" },
    { label: "Upcoming Events", href: "/events" },
    { label: "Scholarship Program", href: "/#scholarships" },
    { label: "Inspiring Stories", href: "/#stories" },
  ],
  "Get Involved": [
    { label: "Become a Member", href: "/membership" },
    { label: "Alumni Portal Login", href: "/login" },
    { label: "Donate to Welfare Fund", href: "/contact#donate" },
    { label: "Contact Committee", href: "/contact" },
  ],
};

export default function Footer() {
  const pathname = usePathname();

  // Do not render marketing footer on application dashboard & admin console
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-white">

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md shadow-sky-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-black text-xl leading-tight">বিদ্যাসেতু</div>
              <div className="text-xs text-slate-400 font-medium">Adarsha High School, Kaitola</div>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            A non-political, non-profit voluntary alumni network committed to educational empowerment, student scholarships, and community welfare.
          </p>

          <div className="flex flex-col gap-2.5 text-sm text-slate-300">
            <a
              href={`mailto:${orgInfo.email}`}
              className="flex items-center gap-2.5 hover:text-sky-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              {orgInfo.email}
            </a>
            <a
              href={`tel:${orgInfo.phone}`}
              className="flex items-center gap-2.5 hover:text-sky-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              {orgInfo.phone}
            </a>
            <span className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              {orgInfo.address}
            </span>
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h3 className="font-bold text-xs uppercase tracking-wider text-sky-400 mb-4">
              {section}
            </h3>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500/70" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-800/80 px-6 py-6 text-center sm:flex sm:items-center sm:justify-between max-w-7xl mx-auto text-xs text-slate-500">
        <p className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Biddyasetu — Adarsha High School, Kaitola. All rights reserved.
        </p>
        <p>
          Established 17 February 2026 · {orgInfo.type}
        </p>
      </div>
    </footer>
  );
}
