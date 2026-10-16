"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  GraduationCap,
  BadgeCheck,
  Filter,
  X,
  LayoutGrid,
  List,
  Droplets,
  ArrowUpDown,
  UserCheck,
  Globe,
  Award,
  ChevronRight,
  Sparkles,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  QrCode,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Star,
  Trophy,
} from "lucide-react";

import ScrollAnimation from "@/components/ui/ScrollAnimation";
import MemberModal from "@/components/members/MemberModal";
import { useMembers } from "@/hooks/useQueries";

const membershipTypes = ["Life Member", "General Member", "Donor Member"];

// Premium Member Card Component (Standardized Fixed Dimensions h-[230px] w-full)
const PremiumMemberCard = ({ member, index, isManaging = false, onSelect }) => {
  const membershipBadgeColor = {
    "Life Member": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
    "General Member": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
    "Donor Member": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
  }[member.membership] || "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700";

  return (
    <ScrollAnimation key={member.id} animation="fade-in-up" delay={(index % 12) * 40} className="w-full">
      <div
        onClick={onSelect}
        className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border cursor-pointer h-[230px] w-full flex flex-col ${isManaging
          ? "border-amber-300/80 dark:border-amber-700/80 ring-1 ring-amber-400/20"
          : "border-slate-200/80 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500"
          }`}
      >
        {/* Top accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 z-10 ${isManaging
            ? "bg-gradient-to-r from-amber-400 to-yellow-500"
            : "bg-gradient-to-r from-sky-500 to-teal-400"
            }`}
        />

        {/* Main horizontal row: LEFT image | RIGHT info */}
        <div className="flex flex-row items-stretch h-full w-full">
          {/* LEFT: Fixed Aspect Ratio Profile Photo (strict fixed width w-28 sm:w-36 and h-full with object-cover) */}
          <div className="relative shrink-0 w-28 sm:w-36 h-full overflow-hidden bg-slate-100 dark:bg-slate-700">
            {member.profileImage || member.image || member.avatar ? (
              <img
                src={member.profileImage || member.image || member.avatar}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl select-none group-hover:scale-105 transition-transform duration-500">
                {member.initials || (member.name || "A").slice(0, 2).toUpperCase()}
              </div>
            )}

            {member.verified && (
              <div
                className="absolute bottom-2 right-2 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-md z-10"
                title="Verified Member"
              >
                <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500 stroke-white" />
              </div>
            )}

            {isManaging && (
              <div className="absolute top-2 left-2 z-10">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  EC
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: Bounded Information Rows */}
          <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-w-0 h-full">
            {/* Header info */}
            <div className="min-w-0">
              {/* Row 1: Name, Badge, Blood Group */}
              <div className="flex items-center gap-1.5 min-w-0 mb-1">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate flex-1 leading-snug group-hover:text-sky-600 transition-colors">
                  {member.name}
                </h3>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${membershipBadgeColor}`}>
                  {member.membership}
                </span>
                {member.bloodGroup && (
                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                    <Droplets className="w-2.5 h-2.5 text-rose-500" />
                    {member.bloodGroup}
                  </span>
                )}
              </div>

              {/* Row 2: Profession */}
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate mb-1">
                {member.profession || "Alumni Member"}
              </p>

              {/* Row 3: ID & Batch */}
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mb-2">
                ID: {member.id || `AHS-${String(index + 1).padStart(4, "0")}`} • Batch {member.batch || "N/A"}
              </p>

              {/* 3 Uniform Info Slots (Location, Email, Phone/Organization) */}
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  <span className="truncate">
                    {[member.location, member.country].filter(Boolean).join(", ") || "Location not specified"}
                  </span>
                </div>

                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-500 transition-colors" />
                  <span className="truncate">{member.email || "Email not public"}</span>
                </div>

                <div className="flex items-center gap-2 truncate">
                  {member.company ? (
                    <>
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-500 transition-colors" />
                      <span className="truncate">{member.company}</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-500 transition-colors" />
                      <span className="truncate">{member.phone || "Phone not public"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Row: View Profile button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">
                {member.joinDate ? `Joined ${member.joinDate}` : "Alumni Member"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-lg transition-colors cursor-pointer"
              >
                View Profile
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterProfession, setFilterProfession] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterMembership, setFilterMembership] = useState("");
  const [activePill, setActivePill] = useState("all");
  const [sortBy, setSortBy] = useState("batch-desc");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const quickPills = [
    { id: "all", label: "All Members" },
    { id: "life", label: "Life Members" },
    { id: "verified", label: "Verified Only" },
    { id: "blood", label: "Blood Donors" },
    { id: "abroad", label: "Global / Abroad" },
    { id: "engineers", label: "Tech & Engineers" },
    { id: "doctors", label: "Medical & Health" },
  ];

  const { data: dbMembers = [], isLoading } = useMembers();

  const allMembers = useMemo(() => {
    if (!Array.isArray(dbMembers) || dbMembers.length === 0) return [];

    // Format DB members to match directory structure
    return dbMembers.map((m) => {
      const tierName =
        m.packageData?.packageName ||
        (m.membership === "life_member"
          ? "Life Member"
          : m.membership === "donor_member"
            ? "Donor Member"
            : "General Member");

      return {
        id: m.membershipId || `AHS-${m._id?.slice(-4) || "0001"}`,
        name: m.name || "Member",
        nameBn: m.nameBn || "",
        batch: m.batch ? String(m.batch) : "",
        profession: m.profession || "Alumni Member",
        company: m.organization || m.company || "",
        location: m.currentAddress?.city || m.permanentAddress?.city || "Bangladesh",
        country: m.currentAddress?.country || "Bangladesh",
        membership: tierName,
        bloodGroup: m.bloodGroup || null,
        profileImage: m.profileImage || null,
        initials: (m.name || "A").slice(0, 2).toUpperCase(),
        verified: (m.membershipStatus || m.status) === "active" || (m.membershipStatus || m.status) === "Verified",
        isManaging: Boolean(m.isExecutive || m.isManaging || m.role === "admin"),
        phone: m.phone || "",
        email: m.email || "",
        bio: m.bio || "",
        fatherName: m.fatherName || "",
        motherName: m.motherName || "",
        spouseName: m.spouseName || "",
        nidNumber: m.nidNumber || m.nid || "",
        maritalStatus: m.maritalStatus || "",
        religion: m.religion || "",
        joinDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "",
      };
    });
  }, [dbMembers]);

  // Dynamically derive filter options from real DB members
  const batches = useMemo(() => {
    return [...new Set(allMembers.map((m) => m.batch).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  }, [allMembers]);

  const professions = useMemo(() => {
    return [...new Set(allMembers.map((m) => m.profession).filter(Boolean))].sort();
  }, [allMembers]);

  const countries = useMemo(() => {
    return [...new Set(allMembers.map((m) => m.country).filter(Boolean))].sort();
  }, [allMembers]);

  const filtered = useMemo(() => {
    let list = allMembers.filter((m) => {
      const q = search.toLowerCase();
      if (
        q &&
        !m.name.toLowerCase().includes(q) &&
        !m.profession.toLowerCase().includes(q) &&
        !m.location?.toLowerCase().includes(q) &&
        !m.batch?.toLowerCase().includes(q)
      )
        return false;

      if (filterBatch && m.batch !== filterBatch) return false;
      if (filterProfession && m.profession !== filterProfession) return false;
      if (filterCountry && m.country !== filterCountry) return false;
      if (filterMembership && m.membership !== filterMembership) return false;

      if (activePill === "life" && m.membership !== "Life Member") return false;
      if (activePill === "verified" && !m.verified) return false;
      if (activePill === "blood" && !m.bloodGroup) return false;
      if (activePill === "abroad" && m.country === "Bangladesh") return false;
      if (activePill === "engineers" && !m.profession?.toLowerCase().includes("engineer")) return false;
      if (activePill === "doctors" && !m.profession?.toLowerCase().includes("doctor")) return false;

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "batch-desc") {
        const yearA = parseInt((a.batch || "").replace(/\D/g, ""), 10) || 0;
        const yearB = parseInt((b.batch || "").replace(/\D/g, ""), 10) || 0;
        return yearB - yearA;
      }
      if (sortBy === "batch-asc") {
        const yearA = parseInt((a.batch || "").replace(/\D/g, ""), 10) || 0;
        const yearB = parseInt((b.batch || "").replace(/\D/g, ""), 10) || 0;
        return yearA - yearB;
      }
      return 0;
    });

    return list;
  }, [allMembers, search, filterBatch, filterProfession, filterCountry, filterMembership, activePill, sortBy]);

  const hasFilters = filterBatch || filterProfession || filterCountry || filterMembership || activePill !== "all";

  const clearFilters = () => {
    setFilterBatch("");
    setFilterProfession("");
    setFilterCountry("");
    setFilterMembership("");
    setActivePill("all");
    setSearch("");
  };

  const totalVerified = allMembers.filter((m) => m.verified).length;
  const totalLife = allMembers.filter((m) => m.membership === "Life Member").length;
  const totalAbroad = allMembers.filter((m) => m.country !== "Bangladesh").length;
  const totalBloodDonors = allMembers.filter((m) => m.bloodGroup).length;

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-sky-700 via-sky-500 to-sky-400 text-white py-16 sm:py-20 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Official Alumni Network
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            Discover and connect with {allMembers.length}+ Adarsha High School graduates across Bangladesh and abroad.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {[
              { label: "Total Members", val: allMembers.length, icon: GraduationCap },
              { label: "Verified Alumni", val: totalVerified, icon: UserCheck },
              { label: "Life Members", val: totalLife, icon: Award },
              { label: "Global Network", val: totalAbroad, icon: Globe },
              { label: "Blood Donors", val: totalBloodDonors, icon: Droplets },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.label}
                  className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3.5 text-center shadow-sm"
                >
                  <div className="text-2xl sm:text-3xl font-black leading-none mb-1 text-white">
                    {st.val}
                  </div>
                  <div className="text-[11px] font-bold text-white/85 uppercase flex items-center justify-center gap-1">
                    <Icon className="w-3 h-3" /> {st.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Search & Filters */}
      <section className="sticky top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-4 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, profession, batch, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="batch-desc">Batch: Newest First</option>
                <option value="batch-asc">Batch: Oldest First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "list" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${showFilters
                ? "bg-sky-50 border-sky-500 text-sky-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPills.map((pill) => {
              const isActive = activePill === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActivePill(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                    }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Batch</label>
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-sky-500"
                >
                  <option value="">All Batches</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Profession</label>
                <select
                  value={filterProfession}
                  onChange={(e) => setFilterProfession(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-sky-500"
                >
                  <option value="">All Professions</option>
                  {professions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Country</label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-sky-500"
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Membership</label>
                <select
                  value={filterMembership}
                  onChange={(e) => setFilterMembership(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-sky-500"
                >
                  <option value="">All Memberships</option>
                  {membershipTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Directory Results */}
      <section className="py-12 bg-[#FDF9DF] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-sm text-slate-600 font-medium">
            <p>
              Showing <strong className="text-slate-900 font-extrabold">{filtered.length}</strong> of {allMembers.length} alumni members
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500">
              <BadgeCheck className="w-3.5 h-3.5 text-sky-500" /> Click on any profile to connect
            </span>
          </div>

          {isLoading ? (
            <div className="p-20 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Loading Alumni Directory...</h3>
              <p className="text-xs text-slate-500">Fetching verified members from database</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">Not Found any members</h3>
              <p className="text-sm text-slate-500 mb-4">
                {allMembers.length === 0
                  ? "No registered alumni members found in the database yet."
                  : "Try adjusting your filters or search keywords."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm shadow-md hover:bg-sky-600 transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            // GRID VIEW - Standardized card height & width (h-[230px] w-full)
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((member, index) => (
                <PremiumMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isManaging={member.isManaging}
                  onSelect={() => setSelectedMember(member)}
                />
              ))}
            </div>
          ) : (
            // LIST VIEW - Full width cards with standardized height (h-[230px] w-full)
            <div className="flex flex-col gap-4">
              {filtered.map((member, index) => (
                <PremiumMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isManaging={member.isManaging}
                  onSelect={() => setSelectedMember(member)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </>
  );
}