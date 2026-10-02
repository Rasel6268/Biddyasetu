import Link from "next/link";
import { orgInfo, coreValues, timeline } from "@/lib/data/demo";
import {
  Heart,
  Eye,
  Target,
  BookOpen,
  Users,
  Shield,
  CheckCircle,
  Handshake,
  Globe,
  Calendar,
  ArrowRight,
  Sparkles,
  Building,
  GraduationCap,
  Award,
  Clock,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "About Biddyasetu — Our Mission, Vision & History | Adarsha High School Alumni",
  description:
    "Learn the story of Biddyasetu (বিদ্যাসেতু) — a non-profit, non-political alumni organization of Adarsha High School, Kaitola, established on 17 February 2026. Discover our mission, vision, core values, and founding journey.",

  keywords: [
    "About Biddyasetu", "Biddyasetu history", "Adarsha High School alumni",
    "Kaitola alumni organization", "non-profit Bangladesh", "alumni mission vision",
    "school alumni values", "educational welfare Bangladesh",
  ],

  openGraph: {
    title: "About Biddyasetu — Our Mission, Vision & History",
    description:
      "Established 17 February 2026, Biddyasetu bridges education and community for alumni of Adarsha High School, Kaitola across Bangladesh and abroad.",
    url: "https://biddyasetu.org/about",
    type: "website",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "About Biddyasetu" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Biddyasetu — Our Mission, Vision & History",
    description: "Established 17 February 2026 — A non-profit alumni organization of Adarsha High School, Kaitola.",
    images: ["/logo.png"],
  },
};

const iconMap = {
  Heart,
  Eye,
  BookOpen,
  Users,
  Shield,
  CheckCircle,
  HandHeart: Handshake,
  Globe,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner with Enhanced Gradient */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#0284c7] via-[#06A3EC] to-[#38bdf8] py-20 px-6 text-center text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fde047]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(250,228,6,0.12) 0%, transparent 40%)",
            }}
          />
        </div>
        <div className="max-w-205 mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-[0.8125rem] font-semibold mb-4 backdrop-blur-sm">
            <Sparkles size={14} color="#fde047" /> Est. 17 February 2026 · Non-profit
          </span>
          <h1 className="text-[clamp(2.5rem,6vw,3.8rem)] font-black mb-4 tracking-tight leading-[1.1]">
            About Biddyasetu
          </h1>
          <p className="text-lg md:text-xl opacity-95 leading-relaxed max-w-150 mx-auto font-light">
            The official alumni and student welfare organization of <span className="font-semibold">Adarsha High School, Kaitola</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
              <Users size={16} /> 850+ Alumni
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
              <Globe size={16} /> 10+ Countries
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
              <GraduationCap size={16} /> 40+ Batches
            </span>
          </div>
        </div>
        {/* Animated Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30C240 60 480 60 720 30C960 0 1200 0 1440 30V60H0V30Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Story & Quick Facts */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider mb-4">
                <BookOpen size={12} /> Our Story & Heritage
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Who We Are
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-base">
                <strong className="text-slate-900">Biddyasetu (বিদ্যাসেতু)</strong> — meaning "Bridge of Education" — is a voluntary, non-political, non-profit alumni organization founded by former students of Adarsha High School, Kaitola.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4 text-base">
                Established on <strong className="text-slate-900">17 February 2026</strong>, Biddyasetu was born from the collective aspiration of alumni across generations to remain connected, mentor students, and give back to our beloved alma mater.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 text-base">
                Operating across <strong className="text-slate-900">Bangladesh and internationally</strong>, we empower students through scholarships, emergency aid, school development projects, and networking reunions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/membership" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  Join Biddyasetu <ArrowRight size={15} />
                </Link>
                <Link href="/structure" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-sky-400 text-slate-700 hover:text-sky-600 font-semibold text-sm transition-all hover:shadow-md">
                  View Structure
                </Link>
              </div>
            </div>

            {/* Quick facts card - Enhanced */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xl shadow-slate-900/5">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-lg bg-linear-to-br from-sky-50 to-sky-100">
                  <Building size={20} className="text-sky-600" />
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">
                  Organization Overview
                </h3>
              </div>

              <div className="space-y-0 divide-y divide-slate-100">
                {[
                  { label: "Organization Name", val: "Biddyasetu (বিদ্যাসেতু)", icon: Building },
                  { label: "Institution", val: orgInfo.school, icon: GraduationCap },
                  { label: "Established Date", val: orgInfo.established, icon: Calendar },
                  { label: "Operating Area", val: orgInfo.workingArea, icon: Globe },
                  { label: "Legal Entity", val: "Non-profit · Voluntary Organization", icon: Shield },
                  { label: "Official Contact", val: orgInfo.email, icon: Mail },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 py-3.5 first:pt-0"
                  >
                    <item.icon size={16} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-500 font-medium flex-1">{item.label}</span>
                    <span className="text-sm text-slate-900 font-bold text-right">{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-black text-sky-600">850+</div>
                  <div className="text-xs text-slate-500 font-medium">Alumni</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-sky-600">40+</div>
                  <div className="text-xs text-slate-500 font-medium">Batches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-sky-600">10</div>
                  <div className="text-xs text-slate-500 font-medium">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Enhanced */}
      <section id="mission" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Target size={12} /> Strategic Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mission & Vision
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-base">
              Our guiding compass for building an inclusive and impactful alumni community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 transition-all hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center mb-5">
                    <Target size={28} className="text-sky-600" />
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-sky-500 to-sky-400 rounded-full mb-4" />
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {orgInfo.mission}
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center mb-5">
                    <Eye size={28} className="text-amber-600" />
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full mb-4" />
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {orgInfo.vision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Enhanced */}
      <section id="values" className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Heart size={12} /> Pillars of Action
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-base">
              The foundational principles that guide every initiative and interaction at Biddyasetu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreValues.map((val, i) => {
              const Icon = iconMap[val.icon] || Heart;
              const colors = [
                { icon: "#0284c7", bg: "from-sky-50 to-sky-100", text: "text-sky-600" },
                { icon: "#7c3aed", bg: "from-violet-50 to-violet-100", text: "text-violet-600" },
                { icon: "#16a34a", bg: "from-emerald-50 to-emerald-100", text: "text-emerald-600" },
                { icon: "#d97706", bg: "from-amber-50 to-amber-100", text: "text-amber-600" },
                { icon: "#dc2626", bg: "from-rose-50 to-rose-100", text: "text-rose-600" },
                { icon: "#0891b2", bg: "from-cyan-50 to-cyan-100", text: "text-cyan-600" },
              ];
              const c = colors[i % colors.length];
              return (
                <div
                  key={val.title}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={c.text} />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline - Enhanced */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar size={12} /> Milestones
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Founding Journey
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto mt-3 text-base">
              Key moments that shaped Biddyasetu into what it is today
            </p>
          </div>

          <div className="relative pl-8 md:pl-10">
            {/* Vertical timeline line with gradient */}
            <div className="absolute left-2.5 md:left-3.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-sky-200 to-slate-200 rounded-full" />

            {timeline.map((item, i) => (
              <div key={i} className="relative pb-10 last:pb-0 group">
                {/* Dot with pulse */}
                <div className="absolute -left-8 md:-left-10 top-1">
                  <div className="w-5 h-5 rounded-full bg-sky-500 border-4 border-white shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 group-hover:scale-110 transition-all">
                    <div className="absolute inset-0 rounded-full bg-sky-400 animate-ping opacity-40" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 ml-2 group-hover:border-sky-200 group-hover:shadow-lg group-hover:shadow-sky-500/5 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-extrabold text-sky-600 bg-sky-50 px-3 py-0.5 rounded-full">
                      {item.year}
                    </span>
                    {i === 0 && (
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full">
                        Founded
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-sky-600 to-sky-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fde047]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to Join the Community?
          </h2>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Become part of the Biddyasetu alumni network and help build a brighter future for our alma mater.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-sky-600 font-extrabold text-sm shadow-lg shadow-sky-900/25 hover:shadow-xl hover:shadow-sky-900/40 hover:-translate-y-0.5 transition-all"
            >
              Join Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}