"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  UploadCloud,
  Image as ImageIcon,
  Calendar,
  User,
  Tag,
  Sparkles,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Trash2,
  Plus,
  Camera,
  LogIn,
  Eye,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  useGallery,
  useCreateGalleryItem,
  useToggleGalleryLike,
  useDeleteGalleryItem,
} from "@/hooks/useQueries";
import { showSuccess, showError } from "@/utility/toast";

const categories = [
  "All",
  "Reunion",
  "Campus & Nostalgia",
  "Welfare & Charity",
  "Sports & Tournaments",
  "Cultural & Events",
  "Academic & Career",
  "General",
];

const categoryBadgeColors = {
  Reunion: "bg-sky-100 text-sky-800 border-sky-200",
  "Campus & Nostalgia": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Welfare & Charity": "bg-purple-100 text-purple-800 border-purple-200",
  "Sports & Tournaments": "bg-amber-100 text-amber-800 border-amber-200",
  "Cultural & Events": "bg-rose-100 text-rose-800 border-rose-200",
  "Academic & Career": "bg-blue-100 text-blue-800 border-blue-200",
  General: "bg-slate-100 text-slate-800 border-slate-200",
};

export default function GalleryPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "popular"
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Lightbox modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Reunion");
  const [uploadDate, setUploadDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [uploadImageUrl, setUploadImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Queries & Mutations
  const {
    data: galleryItems = [],
    isLoading,
    refetch,
  } = useGallery({
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    sortBy,
  });

  const createActivityMutation = useCreateGalleryItem();
  const toggleLikeMutation = useToggleGalleryLike();
  const deleteActivityMutation = useDeleteGalleryItem();

  // Local optimistic like tracker
  const [optimisticLikes, setOptimisticLikes] = useState({});

  // Handle Like Click
  const handleLike = async (item, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showError("Please sign in as a member to like activities!");
      return;
    }

    const currentOptimistic = optimisticLikes[item._id] || {
      isLiked: item.isLiked,
      count: item.likeCount || 0,
    };

    const nextIsLiked = !currentOptimistic.isLiked;
    const nextCount = nextIsLiked
      ? currentOptimistic.count + 1
      : Math.max(0, currentOptimistic.count - 1);

    // Instant optimistic update
    setOptimisticLikes((prev) => ({
      ...prev,
      [item._id]: {
        isLiked: nextIsLiked,
        count: nextCount,
      },
    }));

    try {
      await toggleLikeMutation.mutateAsync(item._id);
    } catch (err) {
      // Revert optimistic on error
      setOptimisticLikes((prev) => ({
        ...prev,
        [item._id]: currentOptimistic,
      }));
    }
  };

  // Handle Image File Selection & ImageKit Upload
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("Image size must be less than 10MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setIsUploadingImage(true);
    setUploadProgress(15);

    try {
      const authResponse = await fetch("/api/imagekit-auth");
      if (!authResponse.ok) {
        throw new Error("Failed to authenticate image service.");
      }

      const auth = await authResponse.json();
      const { upload } = await import("@imagekit/next");

      setUploadProgress(40);

      const uploadResponse = await upload({
        file,
        fileName: `activity-${Date.now()}-${file.name.replace(/\s+/g, "_")}`,
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
        publicKey: auth.publicKey,
        urlEndpoint:
          auth.urlEndpoint || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        folder: "/biddyasetu/activities",
        onProgress: (event) => {
          if (event.total) {
            setUploadProgress(
              Math.min(95, Math.round((event.loaded / event.total) * 100))
            );
          }
        },
      });

      if (!uploadResponse?.url) {
        throw new Error("Upload response did not contain image URL.");
      }

      setUploadProgress(100);
      setUploadImageUrl(uploadResponse.url);
      showSuccess("Photo uploaded successfully!");
    } catch (err) {
      console.warn("Direct upload fallback:", err.message);
      // Fallback: convert file to local object URL / base64 if cloud upload auth fails
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUploadImageUrl(reader.result);
          setUploadProgress(100);
          showSuccess("Photo attached successfully!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit Upload Activity Form
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadTitle.trim()) {
      showError("Please enter an activity title.");
      return;
    }

    if (!uploadDescription.trim()) {
      showError("Please enter a description for this activity.");
      return;
    }

    if (!uploadImageUrl.trim()) {
      showError("Please select an image or provide an image link.");
      return;
    }

    try {
      await createActivityMutation.mutateAsync({
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        category: uploadCategory,
        activityDate: uploadDate,
        imageUrl: uploadImageUrl.trim(),
      });

      // Reset form
      setUploadTitle("");
      setUploadDescription("");
      setUploadCategory("Reunion");
      setUploadDate(new Date().toISOString().slice(0, 10));
      setUploadImageUrl("");
      setImageFile(null);
      setImagePreview("");
      setUploadProgress(0);
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Activity
  const handleDeleteActivity = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteActivityMutation.mutateAsync(id);
      setDeleteConfirmId(null);
      if (selectedItem?._id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered and Sorted Items
  const displayedItems = useMemo(() => {
    return galleryItems;
  }, [galleryItems]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-20">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-linear-to-b from-sky-900 via-sky-800 to-slate-900 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            Alumni Activity Gallery
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Memories & Moments Across Generations
          </h1>

          <p className="text-base sm:text-lg text-sky-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Relive nostalgic school days, alumni reunions, welfare initiatives,
            sports tournaments, and cultural gatherings. Share your own photo
            stories with our alumni community.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Upload Activity Photo (Admin)
              </button>
            ) : !isAuthenticated ? (
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> Sign In to Like & React
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-sky-200 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                Tap the heart on any photo to like
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("gallery-feed");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Explore Photo Feed
            </button>
          </div>
        </div>
      </section>

      {/* ─── Control Bar: Categories, Search & Sort ─── */}
      <section
        id="gallery-feed"
        className="sticky top-[76px] z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-slate-200/80 py-4 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Top row: Search & Sort & Upload Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities by title, batch, or member..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Post Trigger */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 text-[11px] font-normal">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none cursor-pointer"
                >
                  <option value="newest">Latest Uploads</option>
                  <option value="popular">Most Liked ❤️</option>
                </select>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload Photo (Admin)
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-[1.02]"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  {cat === "All" && <Sparkles className="w-3 h-3" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Gallery Grid ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4 animate-pulse"
              >
                <div className="h-56 bg-slate-100 rounded-2xl w-full" />
                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 w-24 bg-slate-100 rounded-full" />
                  <div className="h-8 w-12 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayedItems.length === 0 && (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 my-12">
            <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No Activities Found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery || selectedCategory !== "All"
                ? "No photo activities match your current search or category filter. Try clearing your filters."
                : "Be the first alumni member to share a cherished memory or activity photo!"}
            </p>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Upload First Activity (Admin)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Clear Filters & Show All
              </button>
            )}
          </div>
        )}

        {/* ─── Gallery Grid: Pure Photo with Precision Hover Overlay ─── */}
        {!isLoading && displayedItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => {
              const currentLikeState = optimisticLikes[item._id] || {
                isLiked: item.isLiked,
                count: item.likeCount || 0,
              };

              const canDelete = isAdmin;

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200/80 hover:border-sky-400"
                >
                  {/* Photo (Edge-to-Edge, Clean, No static body text) */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />

                  {/* Discrete ambient like badge (visible when not hovered, fades out on hover) */}
                  <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    <span>{currentLikeState.count}</span>
                  </div>

                  {/* ─── Precision Hover Overlay (Reveals completely on cursor hover) ─── */}
                  <div className="absolute inset-0 z-20 bg-linear-to-t from-slate-950/95 via-slate-950/75 to-slate-950/35 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 p-5 flex flex-col justify-between">
                    {/* Top Row: Category badge, Like reaction button, Admin delete */}
                    <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${
                          categoryBadgeColors[item.category] ||
                          categoryBadgeColors.General
                        }`}
                      >
                        {item.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Interactive Like Button */}
                        <button
                          type="button"
                          onClick={(e) => handleLike(item, e)}
                          className={`px-3 py-1.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                            currentLikeState.isLiked
                              ? "bg-rose-500 text-white shadow-rose-500/40 scale-105"
                              : "bg-white/20 text-white hover:bg-white hover:text-rose-600 border border-white/20"
                          }`}
                          title={
                            currentLikeState.isLiked
                              ? "Unlike activity"
                              : "Like activity"
                          }
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              currentLikeState.isLiked ? "fill-current" : ""
                            }`}
                          />
                          <span>{currentLikeState.count}</span>
                        </button>

                        {/* Admin Delete Action */}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteActivity(item._id, e)}
                            className="p-1.5 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-rose-400/40 shadow-sm"
                            title="Delete this activity (Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Detailed Title, Description, Date & Publisher */}
                    <div className="space-y-2.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {/* Title */}
                      <h3 className="font-black text-white text-base sm:text-lg leading-snug line-clamp-2 drop-shadow-sm">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-200 text-xs line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-xs font-normal">
                        {item.description}
                      </p>

                      {/* Precise Metadata Footer */}
                      <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-slate-300 text-[11px]">
                        {/* Publisher Info */}
                        <div className="flex items-center gap-2 min-w-0">
                          {item.uploaderImage ? (
                            <img
                              src={item.uploaderImage}
                              alt={item.uploaderName}
                              className="w-6 h-6 rounded-full object-cover border border-white/30 shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-sky-500/80 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                              {(item.uploaderName || "A").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 truncate">
                            <span className="font-bold text-white truncate block">
                              {item.uploaderName || "Alumni"}
                            </span>
                            {item.uploaderBatch && (
                              <span className="text-[10px] text-sky-200 block truncate">
                                {item.uploaderBatch}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Activity Date & Click to View Indicator */}
                        <div className="flex items-center gap-2.5 shrink-0 text-slate-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-300" />
                            <span>
                              {new Date(
                                item.activityDate || item.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </span>

                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-white/15 px-2 py-0.5 rounded-md font-semibold text-white">
                            <Eye className="w-3 h-3" /> View
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Modal 1: Upload Activity Modal (Admin Only) ─── */}
      {showUploadModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Administrator Activity Upload
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Publish Official Activity Photo
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload a photo from alumni reunions, sports championships, campus
                nostalgia, or cultural events. Members will be able to view and like this activity.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Photo Upload Zone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Activity Photo <span className="text-rose-500">*</span>
                </label>

                {imagePreview || uploadImageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border-2 border-sky-400 bg-slate-50 group">
                    <img
                      src={imagePreview || uploadImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                        setUploadImageUrl("");
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                      title="Change photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                      Photo Ready
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-sky-50/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800">
                        {isUploadingImage
                          ? `Uploading (${uploadProgress}%)...`
                          : "Click to upload activity photo"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP up to 10MB
                      </p>
                    </div>
                  </label>
                )}

                {/* Optional Image URL Input */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    OR
                  </span>
                  <input
                    type="url"
                    value={uploadImageUrl}
                    onChange={(e) => {
                      setUploadImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Paste direct image link (https://...)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Activity Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Batch 2002 Reunion at Kaitola Campus"
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Activity Date
                  </label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Story / Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Tell us about this activity, who participated, and key highlights..."
                  maxLength={2000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              {/* Uploader Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700">
                    Posting as: {user?.name || "Alumni Member"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {user?.batch ? `SSC ${user.batch}` : "Verified Member"}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createActivityMutation.isPending || isUploadingImage}
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {createActivityMutation.isPending ? (
                    <span className="animate-pulse">Publishing...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Share Activity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Lightbox Detail Modal ─── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image */}
            <div className="relative aspect-16/10 w-full bg-slate-900">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm ${
                    categoryBadgeColors[selectedItem.category] ||
                    categoryBadgeColors.General
                  }`}
                >
                  {selectedItem.category}
                </span>
              </div>
            </div>

            {/* Details & Discussion */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedItem.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      {new Date(
                        selectedItem.activityDate || selectedItem.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-sky-500" />
                      {selectedItem.uploaderName}
                      {selectedItem.uploaderBatch
                        ? ` (${selectedItem.uploaderBatch})`
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(selectedItem, e)}
                  className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                    (optimisticLikes[selectedItem._id] || selectedItem).isLiked
                      ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20"
                      : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      (optimisticLikes[selectedItem._id] || selectedItem).isLiked
                        ? "fill-current"
                        : ""
                    }`}
                  />
                  <span>
                    {(optimisticLikes[selectedItem._id] || selectedItem).count}{" "}
                    Likes
                  </span>
                </button>
              </div>

              {/* Description Body */}
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                {selectedItem.description}
              </div>

              {/* Uploader Card */}
              <div className="flex items-center justify-between p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                <div className="flex items-center gap-3">
                  {selectedItem.uploaderImage ? (
                    <img
                      src={selectedItem.uploaderImage}
                      alt={selectedItem.uploaderName}
                      className="w-10 h-10 rounded-full object-cover border border-sky-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-black flex items-center justify-center text-sm">
                      {(selectedItem.uploaderName || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-black text-sm text-slate-900">
                      {selectedItem.uploaderName}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {selectedItem.uploaderBatch || "Verified Alumni Member"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">
                    Alumni Contributor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
