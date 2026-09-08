"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* ─── Dedicated Admin Navbar (Top) ─── */}
      <AdminNavbar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* ─── Admin Layout Body ─── */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* ─── Dedicated Admin Sidebar (Left) ─── */}
        <AdminSidebar
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* ─── Main Admin Workspace Content Area ─── */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:pl-80 max-w-full">
          {children}

          {/* Clean Admin Console In-Page Footer */}
          <div className="pt-10 pb-6 text-center text-xs text-slate-500 border-t border-slate-200/80 mt-12">
            © 2026 Biddyasetu Alumni Organization · Admin Management Console · Adarsha High School, Kaitola
          </div>
        </main>
      </div>
    </div>
  );
}
