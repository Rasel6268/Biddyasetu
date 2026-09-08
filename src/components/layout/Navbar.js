"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  Users,
  Sparkles,
  LogIn,
  UserCircle,
  Bell,
  Search,
  LayoutDashboard,
  User,
  CreditCard,
  QrCode,
  Calendar,
  Award,
  LogOut,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Alumni Directory", href: "/leadership" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(true); // Default to true as requested
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);

  // Do not render public Navbar on Admin console
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Mock authenticated user data (to be replaced with backend auth)
  const authUser = {
    name: "Engr. Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    batch: "2006",
    tier: "Life Member",
    memberId: "BDS-LM-0842",
    initials: "TA",
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-lg shadow-sky-900/5"
          : "bg-gradient-to-r from-[#FDF9DF]/95 via-[#FDF9DF]/90 to-[#FDF9DF]/95 backdrop-blur-sm border-b border-sky-100/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[76px] flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-4 no-underline group">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-xl group-hover:from-sky-400/40 group-hover:to-sky-600/40 transition-all duration-700 opacity-0 group-hover:opacity-100" />
              <div className="relative rounded-xl p-1 group-hover:shadow-sky-500/30 transition-all duration-500">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Biddyasetu Logo"
                    width={56}
                    height={56}
                    className="rounded-lg transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-slate-900 leading-tight tracking-tight transition-colors duration-300 group-hover:text-sky-700">
                  বিদ্যাসেতু
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold bg-gradient-to-r from-sky-500 to-sky-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm shadow-sky-500/20">
                  Alumni
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-semibold leading-none tracking-wide transition-colors duration-300 group-hover:text-slate-700">
                  Adarsha High School, Kaitola
                </span>
                <span className="w-1 h-1 rounded-full bg-sky-400/40" />
                <span className="text-[10px] text-sky-500 font-medium leading-none">
                  Est. 2026
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      openDropdown === link.label
                        ? "bg-sky-50 text-sky-600 shadow-sm"
                        : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/60"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-all duration-200 ${
                        openDropdown === link.label ? "rotate-180 text-sky-600 scale-110" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-sky-100 rounded-2xl p-2 shadow-2xl shadow-sky-900/15 animate-fadeIn">
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-sky-100 rotate-45" />
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50/60 transition-all relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-sky-500 rounded-full group-hover:w-4 transition-all duration-300" />
                </Link>
              )
            )}
          </nav>

          {/* Desktop Right Actions: Auth State Switch */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuth ? (
              /* AUTHENTICATED: Avatar with Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-3 p-1.5 pr-3.5 rounded-2xl border transition-all cursor-pointer ${
                    userDropdownOpen
                      ? "bg-white border-sky-400 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/20"
                      : "bg-white/80 hover:bg-white border-slate-200/90 hover:border-sky-300 shadow-xs"
                  }`}
                  aria-label="User Account Menu"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {authUser.initials}
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
                      title="Online"
                    />
                  </div>

                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-slate-900 truncate max-w-[120px]">
                        {authUser.name.split(" ")[0]}
                      </span>
                      <BadgeCheck className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <span className="text-[10px] font-bold text-sky-600">
                      Batch &apos;{authUser.batch.slice(2)}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180 text-sky-600" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white/98 backdrop-blur-md rounded-2xl border border-sky-100 shadow-2xl shadow-sky-900/15 p-2.5 z-[110] animate-fadeIn">
                    {/* User Summary Header */}
                    <div className="p-3 bg-gradient-to-br from-sky-50/80 to-blue-50/50 rounded-xl border border-sky-100/80 mb-2">
                      <div className="font-extrabold text-sm text-slate-900 truncate">
                        {authUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mb-2">
                        {authUser.email}
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Award className="w-3 h-3 text-amber-600" />
                          {authUser.tier}
                        </span>
                        <span className="font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                          {authUser.memberId}
                        </span>
                      </div>
                    </div>

                    {/* Dropdown Menu Items */}
                    <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 hover:from-rose-100 hover:to-orange-100 font-bold transition-colors border border-rose-100/80 mb-1"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        <span className="flex-1">Admin Portal</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 bg-rose-600 text-white rounded font-extrabold">
                          Root
                        </span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-sky-600" />
                        <span>Member Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors"
                      >
                        <QrCode className="w-4 h-4 text-slate-500" />
                        <span>Digital ID Card</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        <span>Payments & Dues</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>My Events</span>
                      </Link>
                    </div>

                    {/* Divider & Sign Out */}
                    <div className="pt-2 mt-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuth(false);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* UNAUTHENTICATED: Login & Join Buttons */
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-sky-400 text-slate-700 hover:text-sky-600 font-semibold text-sm transition-all hover:shadow-md hover:shadow-sky-500/10"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>

                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Users className="w-4 h-4" />
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuth ? (
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                title="Open Dashboard"
              >
                {authUser.initials}
              </Link>
            ) : (
              <Link
                href="/login"
                className="p-2.5 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all"
              >
                <UserCircle className="w-6 h-6" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700 transition-all"
              aria-label="Toggle menu"
              type="button"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-sky-100 px-4 py-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-4 mt-3 border-t border-slate-100 space-y-3">
              {isAuth ? (
                <div className="space-y-2">
                  <div className="p-3.5 bg-sky-50/80 rounded-2xl border border-sky-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{authUser.name}</div>
                      <div className="text-xs text-sky-700 font-medium">
                        {authUser.tier} · Batch {authUser.batch}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-white px-2 py-1 rounded border border-sky-200">
                      {authUser.memberId}
                    </span>
                  </div>

                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md transition-all border border-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Open Admin Console
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Open Member Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAuth(false);
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-sky-400 text-slate-700 font-semibold text-sm transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Log In
                  </Link>
                  <Link
                    href="/membership"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    Join Biddyasetu
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}