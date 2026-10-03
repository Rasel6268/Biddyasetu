"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Bell,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Pin,
  ExternalLink,
  Sparkles,
  Pause,
  Play,
} from "lucide-react";
import { useAnnouncements } from "@/hooks/useQueries";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const priorityConfig = {
  High: {
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.1)",
    border: "#fca5a5",
    badgeBg: "bg-rose-100 text-rose-700 border-rose-200",
    label: "Urgent Notice",
    icon: AlertCircle,
  },
  Medium: {
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.1)",
    border: "#7dd3fc",
    badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
    label: "Important",
    icon: Bell,
  },
  Low: {
    color: "#475569",
    bg: "rgba(71, 85, 105, 0.1)",
    border: "#cbd5e1",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    label: "General Notice",
    icon: Info,
  },
};

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds per slide

export default function Announcements() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch real announcements from backend database
  const { data: rawAnnouncements, isLoading } = useAnnouncements({ status: "published" });

  const announcementsList = useMemo(() => {
    if (rawAnnouncements && Array.isArray(rawAnnouncements) && rawAnnouncements.length > 0) {
      return rawAnnouncements;
    }
    return [];
  }, [rawAnnouncements]);

  const totalSlides = announcementsList.length;

  // Ensure currentIndex stays within bounds if list shrinks
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect (pauses on hover or when modal is open)
  useEffect(() => {
    if (isPaused || selectedAnnouncement || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, selectedAnnouncement, nextSlide, totalSlides]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section className="section-padding bg-slate-50/70 relative overflow-hidden py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollAnimation animation="fade-in-up">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Bell size={13} className="text-sky-600 animate-bounce" /> Notice Board
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Official Announcements
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Stay informed with official circulars, reunion schedules, scholarship calls, and alumni updates.
            </p>
          </div>
        </ScrollAnimation>

        {/* Notice Board Slider Container */}
        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {isLoading ? (
            <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 animate-pulse space-y-4 shadow-sm">
              <div className="h-6 bg-slate-200 rounded-full w-1/4" />
              <div className="h-8 bg-slate-200 rounded-md w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ) : totalSlides === 0 ? (
            <div className="rounded-3xl bg-white border-2 border-dashed border-slate-200 p-10 text-center shadow-xs">
              <Bell size={32} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-base text-slate-800 mb-1">
                No active announcements right now
              </h3>
              <p className="text-xs text-slate-400">
                Official notices and circulars will be published here by the executive committee.
              </p>
            </div>
          ) : (
            <>
              {/* Main Slide Card Viewport */}
              <div
                className="overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-sky-900/5 relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Top Auto-Slide Countdown Bar */}
                {!isPaused && !selectedAnnouncement && totalSlides > 1 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-20 overflow-hidden">
                    <div
                      key={currentIndex}
                      className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-[5000ms] ease-linear w-full animate-timerProgress"
                    />
                  </div>
                )}

                {/* Slider Track (Slides one by one) */}
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {announcementsList.map((a, index) => {
                    const pc = priorityConfig[a.priority] || priorityConfig.Low;
                    const Icon = pc.icon;
                    const d = a.date ? new Date(a.date) : new Date();
                    const dateStr = d.toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={a._id || a.id || index}
                        className="w-full min-w-full flex-shrink-0 p-6 sm:p-10 flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Bar: Priority Badge, Date, Slide Index */}
                          <div className="flex items-center justify-between flex-wrap gap-2.5 pb-4 mb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${pc.badgeBg}`}
                              >
                                <Icon size={14} />
                                {pc.label}
                              </span>

                              {a.isPinned && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                  <Pin size={11} className="text-amber-600" /> Pinned
                                </span>
                              )}

                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
                                <Calendar size={13} className="text-slate-400" />
                                {dateStr}
                              </span>
                            </div>

                            {/* Slide Counter */}
                            {totalSlides > 1 && (
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-mono">
                                <span className="text-sky-600 text-sm">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span>/</span>
                                <span>{String(totalSlides).padStart(2, "0")}</span>
                              </div>
                            )}
                          </div>

                          {/* Announcement Title */}
                          <h3
                            onClick={() => setSelectedAnnouncement(a)}
                            className="text-lg sm:text-2xl font-black text-slate-900 mb-3 leading-snug hover:text-sky-600 transition-colors cursor-pointer"
                          >
                            {a.title}
                          </h3>

                          {/* Announcement Content Snippet */}
                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                            {a.content}
                          </p>
                        </div>

                        {/* Bottom Action Row */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedAnnouncement(a)}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-sky-600 hover:text-sky-700 transition cursor-pointer group"
                          >
                            <span>View Full Circular & Details</span>
                            <ChevronRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </button>

                          <span className="text-[11px] text-slate-400 font-medium italic">
                            Official Notice · Adarsha High School Alumni
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls: Arrows & Indicators */}
              {totalSlides > 1 && (
                <div className="flex items-center justify-between mt-5 px-2">
                  {/* Prev & Next Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous Notice"
                      className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next Notice"
                      className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Pause/Play Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setIsPaused(!isPaused)}
                      aria-label={isPaused ? "Resume Auto Slide" : "Pause Auto Slide"}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isPaused
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      title={isPaused ? "Click to play" : "Click to pause"}
                    >
                      {isPaused ? <Play size={13} /> : <Pause size={13} />}
                      <span className="text-[10px] hidden sm:inline">
                        {isPaused ? "Paused" : "Auto-playing"}
                      </span>
                    </button>
                  </div>

                  {/* Slide Pill / Dot Indicators */}
                  <div className="flex items-center gap-1.5">
                    {announcementsList.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentIndex === idx
                            ? "w-8 bg-sky-600 shadow-xs"
                            : "w-2.5 bg-slate-200 hover:bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Notice Selection Mini-List */}
              {totalSlides > 1 && (
                <div className="mt-6 pt-5 border-t border-slate-200/70 hidden sm:grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {announcementsList.map((a, idx) => {
                    const active = currentIndex === idx;
                    return (
                      <button
                        key={a._id || a.id || idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        className={`p-2.5 text-left rounded-2xl border transition-all cursor-pointer ${
                          active
                            ? "bg-white border-sky-400 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/20"
                            : "bg-white/60 hover:bg-white border-slate-200/80 hover:border-sky-200"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                          <span>Notice 0{idx + 1}</span>
                          <span className={active ? "text-sky-600 font-extrabold" : ""}>
                            {a.priority}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {a.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold uppercase tracking-wider">
                <Pin size={12} className="text-sky-600" />
                Official Circular
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Published:{" "}
                {new Date(selectedAnnouncement.date || Date.now()).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-tight">
              {selectedAnnouncement.title}
            </h3>

            {/* Content Body */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed mb-6">
              {selectedAnnouncement.content}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400 font-medium">
                Biddyasetu Alumni Organization
              </span>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
