"use client";

import { useState } from "react";
import {
  X,
  MapPin,
  GraduationCap,
  BadgeCheck,
  Droplets,
  Briefcase,
  Mail,
  Share2,
  Calendar,
  Building,
  Award,
  CheckCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { FaLinkedin, FaFacebook } from "react-icons/fa";

export default function MemberModal({ member, onClose }) {
  const [copied, setCopied] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  if (!member) return null;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowContactForm(false);
      setMessageText("");
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="h-32 bg-gradient-to-r from-sky-700 via-sky-500 to-sky-400 rounded-t-3xl relative p-4 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 sm:px-8 pb-8 -mt-14">
          {/* Avatar & Badges Header */}
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            <div className="relative">
              {member.profileImage || member.image || member.avatar ? (
                <img
                  src={member.profileImage || member.image || member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-xl"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-white font-black text-2xl shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${member.avatarColor || "#06A3EC"}dd, ${member.avatarColor || "#06A3EC"})`,
                  }}
                >
                  {member.initials}
                </div>
              )}
              {member.verified && (
                <div
                  className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-md"
                  title="Verified Alumni Member"
                >
                  <BadgeCheck className="w-6 h-6 text-sky-500 fill-sky-500 stroke-white" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs ${
                  member.membership === "Life Member"
                    ? "bg-amber-100/80 text-amber-900 border border-amber-300"
                    : "bg-sky-100 text-sky-700 border border-sky-200"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                {member.membership}
              </span>

              {member.bloodGroup && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold text-xs"
                  title={`Blood Donor: ${member.bloodGroup}`}
                >
                  <Droplets className="w-3 h-3 fill-red-500" />
                  {member.bloodGroup}
                </span>
              )}
            </div>
          </div>

          {/* Member Name & Details */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {member.name}
            </h2>
            <p className="text-sm sm:text-base font-bold text-sky-600 flex items-center gap-1.5 mt-1">
              <GraduationCap className="w-4 h-4" /> Batch: {member.batch}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
              <Briefcase className="w-4 h-4" /> {member.profession} · <MapPin className="w-4 h-4" /> {member.location}, {member.country}
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {member.education && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-500" /> Education
                </div>
                <div className="text-sm font-bold text-slate-800">{member.education}</div>
              </div>
            )}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" /> Verification Status
              </div>
              <div className="text-sm font-bold text-slate-800">
                {member.verified ? "Verified Alumnus" : "Active Member"}
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              About Alumni
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-sky-50/50 p-4 rounded-xl border border-sky-100">
              {member.bio || "Proud alumnus of Adarsha High School, Kaitola committed to community development, student welfare, and youth mentorship."}
            </p>
          </div>

          {/* Social Links & Interactive Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {member.social?.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-bold transition-colors"
                >
                  <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
              {member.social?.facebook && (
                <a
                  href={member.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1877f2] hover:bg-[#1464cc] text-white text-xs font-bold transition-colors"
                >
                  <FaFacebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Share"}
              </button>
            </div>

            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              {showContactForm ? "Cancel" : "Connect"}
            </button>
          </div>

          {/* Connect Form Drawer */}
          {showContactForm && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fadeIn">
              <h5 className="font-bold text-sm text-slate-800 mb-2">
                Send a direct message to {member.name}
              </h5>
              {messageSent ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm py-2">
                  <CheckCircle className="w-4 h-4" /> Message sent successfully!
                </div>
              ) : (
                <form onSubmit={handleSendMessage}>
                  <textarea
                    rows={3}
                    placeholder={`Hi ${member.name}, I am also an alumnus of Adarsha High School...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 mb-3"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
