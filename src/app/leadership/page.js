"use client";
import { committeeRoles, executiveMembers, batchRepresentatives } from "@/lib/data/demo";
import {
  Users,
  Crown,
  Shield,
  Star,
  Award,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Sparkles,
  Building2,
  ChevronDown,
  ChevronUp,
  Trophy,
  Globe,
  QrCode,
} from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";

// Reusable Avatar component
function Avatar({ name, size = 56, className = "" }) {
  const colors = ["#06A3EC", "#0588C5", "#16A34A", "#7c3aed", "#dc2626", "#d97706", "#0891b2", "#be185d", "#059669"];
  const idx = name.charCodeAt(0) % colors.length;
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-extrabold shrink-0 border-2 border-white shadow-md ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors[idx]}cc, ${colors[idx]})`,
        fontSize: size * 0.32,
      }}
    >
      {initials}
    </div>
  );
}

// Premium Member Card Component - UNIFORM HEIGHT
const PremiumMemberCard = ({
  member,
  type = "leadership",
  isManaging = false,
  expanded = false,
  onToggle,
}) => {
  const typeConfig = {
    leadership: {
      accent: "from-sky-500 to-blue-400",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
      roleLabel: "Leadership",
      icon: Crown,
    },
    secretary: {
      accent: "from-emerald-500 to-teal-400",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
      roleLabel: "Secretary",
      icon: Shield,
    },
    executive: {
      accent: "from-amber-500 to-orange-400",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      roleLabel: "Executive",
      icon: Users,
    },
    representative: {
      accent: "from-purple-500 to-violet-400",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      roleLabel: "Representative",
      icon: Star,
    },
  };

  const config = typeConfig[type] || typeConfig.leadership;
  const Icon = config.icon;

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${isManaging
        ? "border-amber-300 dark:border-amber-700"
        : "border-gray-100 dark:border-gray-700"
        } h-[210px]`} // FIXED HEIGHT
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accent} z-10`}
      />

      {/* Main horizontal row: LEFT image | RIGHT info */}
      <div className="flex flex-row items-stretch h-full"> {/* h-full instead of min-h */}
        {/* LEFT: Fixed Width Image Section - UNIFORM SIZE */}
        <div className="relative shrink-0 w-24 sm:w-28 md:w-36 self-stretch overflow-hidden bg-gray-100 dark:bg-gray-700">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-blue-500">
                      <span class="text-3xl font-bold text-white">${member.name?.charAt(0) || '?'}</span>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-blue-500">
              <span className="text-3xl font-bold text-white">
                {member.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT: Member Information */}
        <div className="flex-1 p-4 pt-5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight truncate">
                {member.name}
              </h3>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.badgeColor} shrink-0`}
              >
                {member.role || member.position || config.roleLabel}
              </span>

              {member.batch && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800 shrink-0">
                  Batch {member.batch}
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate mb-1">
              {member.department || member.memberType || "Committee Member"}
            </p>

            {member.memberId && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                ID: {member.memberId}
              </p>
            )}

            {/* Contact Info - Limited to 2 lines for uniformity */}
            <div className="space-y-1">
              {member.email && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 group hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <a
                    href={`mailto:${member.email}`}
                    className="truncate hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 group hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <a
                    href={`tel:${member.phone}`}
                    className="hover:underline"
                  >
                    {member.phone}
                  </a>
                </div>
              )}

              {member.location && !member.phone && !member.email && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span className="truncate">{member.location}</span>
                </div>
              )}

              {member.company && !member.phone && !member.email && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span className="truncate">{member.company}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact card for grid view - UNIFORM SIZE
const CompactMemberCard = ({ member, type = "executive" }) => {
  const typeConfig = {
    executive: {
      accent: "from-amber-500 to-orange-400",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      roleLabel: "Executive",
    },
    representative: {
      accent: "from-purple-500 to-violet-400",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      roleLabel: "Representative",
    },
  };

  const config = typeConfig[type] || typeConfig.executive;

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 h-[90px]`} // FIXED HEIGHT
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.accent}`} />

      <div className="p-3 flex items-center gap-3 h-full">
        <Avatar name={member.name} size={48} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${config.badgeColor} shrink-0`}>
              {config.roleLabel}
            </span>
            {member.verified && (
              <BadgeCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-500 stroke-white shrink-0" />
            )}
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {member.name}
          </h3>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <GraduationCap className="w-3 h-3 shrink-0" /> Batch: {member.batch}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StructurePage() {
  const [expandedMembers, setExpandedMembers] = useState({});

  const toggleExpand = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const leadership = committeeRoles.slice(0, 6);
  const secretaries = committeeRoles.slice(6);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-sky-700 via-sky-500 to-sky-400 text-white py-16 sm:py-20 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md">
            <Crown className="w-4 h-4 text-yellow-300" /> Governing Body & Representatives
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 tracking-tight">
            Organization Structure
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-medium">
            Meet the leadership team, secretariat, executive members, and batch liaisons driving Biddyasetu.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-8">
            {[
              { label: "Leadership", val: leadership.length, icon: Crown },
              { label: "Secretaries", val: secretaries.length, icon: Shield },
              { label: "Executive Members", val: executiveMembers.length, icon: Users },
              { label: "Batch Reps", val: batchRepresentatives.length, icon: Star },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.label}
                  className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 text-center shadow-sm"
                >
                  <div className="text-xl sm:text-2xl font-black leading-none mb-0.5 text-white">
                    {st.val}
                  </div>
                  <div className="text-[10px] font-bold text-white/85 uppercase flex items-center justify-center gap-1">
                    <Icon className="w-3 h-3" /> {st.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1. Executive Leadership - 3 columns with Premium Cards */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-700 font-bold text-xs mb-3 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800">
              <Crown className="w-3.5 h-3.5" /> Key Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Executive Leadership
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              The core leadership team responsible for governance and strategic direction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadership.map((member, index) => (
              <PremiumMemberCard
                key={member.role}
                member={member}
                type="leadership"
                isManaging={index === 0}
                expanded={expandedMembers[`leadership-${member.role}`] || false}
                onToggle={() => toggleExpand(`leadership-${member.role}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Committee Secretaries - 3 columns with Premium Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs mb-3 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              <Shield className="w-3.5 h-3.5" /> Secretariat
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Secretaries & Department Leads
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Departmental secretaries executing education, social welfare, culture, and communication programs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {secretaries.map((member, index) => (
              <PremiumMemberCard
                key={member.role}
                member={member}
                type="secretary"
                expanded={expandedMembers[`secretary-${member.role}`] || false}
                onToggle={() => toggleExpand(`secretary-${member.role}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Executive Members - 4 columns with Compact Cards */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs mb-3 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
              <Users className="w-3.5 h-3.5" /> Executive Committee
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Executive Members
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Active committee members participating in community decisions and welfare initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {executiveMembers.map((member) => (
              <CompactMemberCard key={member.name} member={member} type="executive" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Batch Representatives - 4 columns with Compact Cards */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs mb-3 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
              <Star className="w-3.5 h-3.5 fill-purple-500 text-purple-500" /> Batch Liaisons
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Batch Representatives
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Dedicated alumni representatives coordinating communications and connecting batchmates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {batchRepresentatives.map((rep) => (
              <CompactMemberCard key={rep.batch} member={rep} type="representative" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}