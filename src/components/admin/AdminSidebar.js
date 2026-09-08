"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  GraduationCap,
  Calendar,
  Megaphone,
  Settings,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function AdminSidebar({ mobileSidebarOpen, setMobileSidebarOpen }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview & KPI",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Alumni Directory",
      href: "/admin/members",
      icon: Users,
    },
    {
      label: "Pending Approvals",
      href: "/admin/approvals",
      icon: UserCheck,
      badge: "2",
      badgeColor: "bg-amber-500",
    },
    {
      label: "Membership fees",
      href: "/admin/membership-fees",
      icon: CreditCard,
    },
    {
      label: "Treasury & Payments",
      href: "/admin/payments",
      icon: CreditCard,
      badge: "2",
      badgeColor: "bg-rose-500",
    },
    {
      label: "Student Scholarships",
      href: "/admin/scholarships",
      icon: GraduationCap,
    },
    {
      label: "Events & Reunions",
      href: "/admin/events",
      icon: Calendar,
    },
    {
      label: "Broadcast & Notices",
      href: "/admin/broadcast",
      icon: Megaphone,
    },
    {
      label: "Portal Configuration",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* ─── SIDEBAR (Fixed below 68px Admin Navbar) ─── */}
      <aside
        className={`fixed top-[68px] bottom-0 left-0 z-40 w-72 shrink-0 bg-slate-900 text-white border-r border-slate-800 shadow-2xl lg:shadow-xs flex flex-col transition-transform duration-300 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Admin Quick Metrics Badge */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Alumni Status
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live DB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <div className="text-slate-400 text-[10px]">Verified Alumni</div>
              <div className="font-black text-emerald-400 text-base leading-tight">842</div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
              <div className="text-slate-400 text-[10px]">Pending Queue</div>
              <div className="font-black text-amber-400 text-base leading-tight">4</div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Administration Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/admin/dashboard" && pathname === "/admin");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${isActive
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/25 translate-x-0.5"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${item.badgeColor || "bg-sky-500"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer Links */}
        <div className="p-4 border-t border-slate-800 space-y-1.5 text-xs">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Switch to Member View</span>
          </Link>

          <Link
            href="/"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 top-[68px] bg-slate-950/60 backdrop-blur-xs z-35 lg:hidden"
        />
      )}
    </>
  );
}
