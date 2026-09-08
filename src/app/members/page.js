"use client";

import { useState, useMemo } from "react";
import { alumniMembers, batches } from "@/lib/data/demo";
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
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import MemberModal from "@/components/members/MemberModal";

const professions = [...new Set(alumniMembers.map((m) => m.profession))];
const countries = [...new Set(alumniMembers.map((m) => m.country))];
const membershipTypes = ["Life Member", "General Member"];

function Avatar({ initials, color, size = 64 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-extrabold shrink-0 border-2 border-white shadow-md"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color || "#06A3EC"}cc, ${color || "#06A3EC"})`,
        fontSize: size * 0.32,
      }}
    >
      {initials}
    </div>
  );
}

// Premium Member Card Component (Horizontal Layout)
const PremiumMemberCard = ({ member, index, isManaging = false, expanded = false, onToggle }) => {
  const statusColor = {
    "Active": "text-emerald-700 bg-emerald-50 border-emerald-200",
    "Inactive": "text-slate-500 bg-slate-50 border-slate-200",
    "Expired": "text-rose-700 bg-rose-50 border-rose-200",
  }[member.status || "Active"] || "text-emerald-700 bg-emerald-50 border-emerald-200";

  const membershipBadgeColor = {
    "Life Member": "bg-amber-100 text-amber-800 border-amber-300",
    "General Member": "bg-blue-100 text-blue-800 border-blue-300",
    "Donor Member": "bg-purple-100 text-purple-800 border-purple-300",
  }[member.membership] || "bg-blue-100 text-blue-800 border-blue-300";

  return (
    <ScrollAnimation key={member.id} animation="fade-in-up" delay={(index % 12) * 40}>
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${isManaging
          ? "border-amber-300 dark:border-amber-700"
          : "border-gray-100 dark:border-gray-700"
          }`}
      >
        {/* Top accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${isManaging
            ? "bg-gradient-to-r from-amber-400 to-yellow-500"
            : "bg-gradient-to-r from-emerald-500 to-teal-400"
            }`}
        />

        {/* Main horizontal row: LEFT image | RIGHT info */}
        <div className="flex flex-row items-stretch">
          {/* LEFT: Member Image */}
          <div className="relative shrink-0 w-32 sm:w-40">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-sky-200 to-sky-400 flex items-center justify-center text-white font-black text-4xl">
              {member.initials}
            </div>
            {member.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                <BadgeCheck className="w-5 h-5 text-sky-500 fill-sky-500 stroke-white" />
              </div>
            )}
            {isManaging && (
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
                  <Star className="w-3 h-3" />
                  Managing
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: Member Information */}
          <div className="flex-1 p-5 pt-6 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {member.name}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${membershipBadgeColor}`}>
                  {member.membership}
                </span>
                {member.bloodGroup && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    <Droplets className="w-3 h-3 text-rose-500" />
                    {member.bloodGroup}
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate mb-1">
                {member.profession}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                ID: {member.id || `AHS-${String(index + 1).padStart(4, "0")}`} • Batch {member.batch}
              </p>

              {/* Contact info */}
              <div className="space-y-1.5">
                {member.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span className="truncate">{member.location}, {member.country}</span>
                </div>
                {member.company && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{member.company}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={onToggle}
              className="mt-4 self-start flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-full transition-all duration-200"
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {expanded ? "Show less" : "View details"}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="px-5 pb-5 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3 animate-slide-down">
            {member.bio && (
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {member.bio}
              </p>
            )}

            {member.joinDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Member since {member.joinDate}</span>
              </div>
            )}

            {member.expiryDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Expires: {member.expiryDate}</span>
              </div>
            )}

            {member.interests && member.interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
                  Interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.contributions && member.contributions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
                  Contributions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.contributions.map((contribution, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full font-medium"
                    >
                      {contribution}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.achievements && member.achievements.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
                  Achievements
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.achievements.map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium flex items-center gap-1"
                    >
                      <Trophy className="w-3 h-3" />
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(member.social?.linkedin || member.social?.facebook || member.social?.website) && (
              <div className="flex gap-3 pt-1">
                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <LiaLinkedin className="w-5 h-5" />
                  </a>
                )}
                {member.social?.facebook && (
                  <a
                    href={member.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <FaFacebook className="w-4 h-4" />
                  </a>
                )}
                {member.social?.website && (
                  <a
                    href={member.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* QR & Verification Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-semibold text-slate-400">Verify</span>
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="text-[10px] font-medium text-slate-400">
                  {member.verified ? "✓ Verified Member" : "Member"}
                </span>
              </div>
              <span className="text-[9px] font-medium text-slate-400/80">
                Property of Adarsha High School
              </span>
            </div>
          </div>
        )}
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
  const [expandedMembers, setExpandedMembers] = useState({});

  const toggleExpand = (memberId) => {
    setExpandedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const quickPills = [
    { id: "all", label: "All Members" },
    { id: "life", label: "Life Members" },
    { id: "verified", label: "Verified Only" },
    { id: "blood", label: "Blood Donors" },
    { id: "abroad", label: "Global / Abroad" },
    { id: "engineers", label: "Tech & Engineers" },
    { id: "doctors", label: "Medical & Health" },
  ];

  const filtered = useMemo(() => {
    let list = alumniMembers.filter((m) => {
      const q = search.toLowerCase();
      if (
        q &&
        !m.name.toLowerCase().includes(q) &&
        !m.profession.toLowerCase().includes(q) &&
        !m.location.toLowerCase().includes(q) &&
        !m.batch.toLowerCase().includes(q)
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
      if (activePill === "engineers" && !m.profession.toLowerCase().includes("engineer")) return false;
      if (activePill === "doctors" && !m.profession.toLowerCase().includes("doctor")) return false;

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "batch-desc") {
        const yearA = parseInt(a.batch.replace(/\D/g, ""), 10) || 0;
        const yearB = parseInt(b.batch.replace(/\D/g, ""), 10) || 0;
        return yearB - yearA;
      }
      if (sortBy === "batch-asc") {
        const yearA = parseInt(a.batch.replace(/\D/g, ""), 10) || 0;
        const yearB = parseInt(b.batch.replace(/\D/g, ""), 10) || 0;
        return yearA - yearB;
      }
      return 0;
    });

    return list;
  }, [search, filterBatch, filterProfession, filterCountry, filterMembership, activePill, sortBy]);

  const hasFilters = filterBatch || filterProfession || filterCountry || filterMembership || activePill !== "all";

  const clearFilters = () => {
    setFilterBatch("");
    setFilterProfession("");
    setFilterCountry("");
    setFilterMembership("");
    setActivePill("all");
    setSearch("");
  };

  const totalVerified = alumniMembers.filter((m) => m.verified).length;
  const totalLife = alumniMembers.filter((m) => m.membership === "Life Member").length;
  const totalAbroad = alumniMembers.filter((m) => m.country !== "Bangladesh").length;
  const totalBloodDonors = alumniMembers.filter((m) => m.bloodGroup).length;

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
            Discover and connect with {alumniMembers.length}+ Adarsha High School graduates across Bangladesh and abroad.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {[
              { label: "Total Members", val: alumniMembers.length, icon: GraduationCap },
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
              Showing <strong className="text-slate-900 font-extrabold">{filtered.length}</strong> of {alumniMembers.length} alumni members
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500">
              <BadgeCheck className="w-3.5 h-3.5 text-sky-500" /> Click on any profile to connect
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white border-2 border-dashed border-slate-200 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">No alumni members found</h3>
              <p className="text-sm text-slate-500 mb-4">Try adjusting your filters or search keywords.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm shadow-md hover:bg-sky-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            // GRID VIEW - 4 columns on large screens
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((member, index) => (
                <PremiumMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isManaging={index < 3}
                  expanded={expandedMembers[member.id] || false}
                  onToggle={() => toggleExpand(member.id)}
                />
              ))}
            </div>
          ) : (
            // LIST VIEW - Full width cards
            <div className="flex flex-col gap-4">
              {filtered.map((member, index) => (
                <PremiumMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isManaging={index < 3}
                  expanded={expandedMembers[member.id] || false}
                  onToggle={() => toggleExpand(member.id)}
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