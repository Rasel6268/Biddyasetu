"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  ShieldCheck,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  Award,
  Users,
  CreditCard,
  Lock,
} from "lucide-react";

export default function AdminNavbar({ mobileSidebarOpen, setMobileSidebarOpen }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] h-[68px] bg-slate-900 border-b border-slate-800 text-white flex items-center px-4 sm:px-6 shadow-md">
      <div className="flex items-center justify-between w-full">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              BA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white group-hover:text-sky-400 transition-colors">
                  বিদ্যাসেতু Admin
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Root
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Adarsha High School Alumni Console
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Quick search alumni, batch, TrxID vouchers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Member View Switch */}
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
            <span>Member Portal</span>
          </Link>

          {/* Public Website Link */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Public Site</span>
          </Link>

          {/* Notifications Popover */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
              aria-label="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-[110] text-xs text-slate-300 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-xs">Urgent System Alerts</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    3 Pending
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/admin/approvals"
                    onClick={() => setNotificationOpen(false)}
                    className="block p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">
                      2 New Member Verification Requests
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Batch 2018 & 2020 registrations pending validation.
                    </div>
                  </Link>

                  <Link
                    href="/admin/payments"
                    onClick={() => setNotificationOpen(false)}
                    className="block p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
                  >
                    <div className="font-bold text-white text-[11px]">
                      ৳2,000 Unverified bKash Payment
                    </div>
                    <div className="text-[10px] text-slate-400">
                      TrxID: BK9A87X021 · Annual Dues
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Super Admin Profile */}
          <div className="relative" ref={userDropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                SA
              </div>
              <div className="text-left hidden xl:block leading-tight">
                <div className="font-bold text-xs text-white">Super Admin</div>
                <div className="text-[10px] text-rose-400 font-medium">Full Access</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-[110] text-xs font-semibold text-slate-300 animate-fadeIn">
                <div className="p-3 bg-slate-800/80 rounded-xl mb-2 border border-slate-700/60">
                  <div className="font-bold text-white text-sm">Md. Rafiqul Islam</div>
                  <div className="text-[11px] text-slate-400">President & Root Admin</div>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized Console
                  </span>
                </div>

                <Link
                  href="/admin/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Lock className="w-4 h-4 text-sky-400" />
                  <span>Security & Config</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>Switch to Member View</span>
                </Link>

                <div className="pt-2 mt-1 border-t border-slate-800">
                  <Link
                    href="/login"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out Admin</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
