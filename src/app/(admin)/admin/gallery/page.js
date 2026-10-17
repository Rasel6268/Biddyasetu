"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Camera,
  Plus,
  Search,
  Filter,
  Trash2,
  Heart,
  Eye,
  Calendar,
  Tag,
  UploadCloud,
  CheckCircle2,
  X,
  AlertCircle,
  ExternalLink,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import {
  useGallery,
  useCreateGalleryItem,
  useDeleteGalleryItem,
} from "@/hooks/useQueries";
import { useAuth } from "@/context/AuthContext";
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
  Reunion: "bg-sky-50 text-sky-700 border-sky-200",
  "Campus & Nostalgia": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Welfare & Charity": "bg-purple-50 text-purple-700 border-purple-200",
  "Sports & Tournaments": "bg-amber-50 text-amber-700 border-amber-200",
  "Cultural & Events": "bg-rose-50 text-rose-700 border-rose-200",
  "Academic & Career": "bg-blue-50 text-blue-700 border-blue-200",
  General: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function AdminGalleryPage() {
  const { user } = useAuth();

  // State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Reunion");
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // React Query Hooks
  const {
    data: galleryItems = [],
    isLoading,
    refetch,
  } = useGallery({
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    search: searchQuery || undefined,
    sortBy,
  });

  const createMutation = useCreateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  // Metrics
  const totalActivities = galleryItems.length;
  const totalLikes = useMemo(() => {
    return galleryItems.reduce((acc, item) => acc + (item.likeCount || 0), 0);
  }, [galleryItems]);

  // Handle Image File Selection & ImageKit Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("File size must not exceed 10MB.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) throw new Error("ImageKit auth failed.");
      const auth = await authRes.json();

      const { upload } = await import("@imagekit/next");
      setUploadProgress(50);

      const res = await upload({
        file,
        fileName: `admin-activity-${Date.now()}-${file.name.replace(/\s+/g, "_")}`,
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
        publicKey: auth.publicKey,
        urlEndpoint:
          auth.urlEndpoint || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        folder: "/biddyasetu/activities",
        onProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(
              Math.min(95, Math.round((evt.loaded / evt.total) * 100))
            );
          }
        },
      });

      if (!res?.url) throw new Error("Upload did not return image URL.");

      setUploadProgress(100);
      setNewImageUrl(res.url);
      showSuccess("Photo uploaded to CDN successfully!");
    } catch (err) {
      console.warn("Direct upload fallback:", err.message);
      // Local fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewImageUrl(reader.result);
          setUploadProgress(100);
          showSuccess("Photo attached successfully!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Activity Creation
  const handleCreateActivity = async (e) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      showError("Please enter an activity title.");
      return;
    }

    if (!newDescription.trim()) {
      showError("Please enter an activity description.");
      return;
    }

    if (!newImageUrl.trim()) {
      showError("Please upload a photo or provide an image link.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        activityDate: newDate,
        imageUrl: newImageUrl.trim(),
      });

      // Reset
      setShowUploadModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewCategory("Reunion");
      setNewDate(new Date().toISOString().slice(0, 10));
      setNewImageUrl("");
      setImagePreview("");
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
      if (previewItem?._id === id) setPreviewItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Header & Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Activity Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Alumni Activity Gallery
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and manage photos from reunions, welfare drives, tournaments, and campus events.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Upload New Activity Photo
        </button>
      </div>

      {/* ─── KPI Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Activities
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalActivities}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Active photos live in alumni gallery
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Community Likes
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalLikes}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Reactions received across all posts
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Public Feed Link
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View Member Gallery Feed <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Opens public-facing gallery in new tab
          </p>
        </div>
      </div>

      {/* ─── Search, Category & Sort Bar ─── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter activities by title or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="popular">Most Liked ❤️</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${isActive
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Summary & View Toggle Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div>
          Showing <strong className="text-slate-900">{galleryItems.length}</strong> activities
          {selectedCategory !== "All" && (
            <span> in <span className="text-sky-600 font-bold">{selectedCategory}</span></span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "table"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Tabular View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "grid"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid Cards</span>
          </button>
        </div>
      </div>

      {/* ─── Tabular View (Default) ─── */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] bg-slate-50/70">
                  <th className="px-5 py-4 w-12 text-center">#</th>
                  <th className="px-5 py-4 w-28">Photo</th>
                  <th className="px-5 py-4 min-w-[260px]">Activity Title & Description</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4 whitespace-nowrap">Activity Date</th>
                  <th className="px-5 py-4 text-center whitespace-nowrap">Likes</th>
                  <th className="px-5 py-4 whitespace-nowrap">Published By</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading gallery activities...</span>
                      </div>
                    </td>
                  </tr>
                ) : galleryItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Camera className="w-8 h-8 mx-auto text-slate-300" />
                        <div className="font-bold text-slate-700">No activities found</div>
                        <p className="text-[11px] text-slate-400">
                          {searchQuery || selectedCategory !== "All"
                            ? "Try adjusting your search query or category filters."
                            : "No gallery activities uploaded yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  galleryItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-sky-50/40 transition-colors group"
                    >
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px] text-center">
                        {index + 1}
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 block group/thumb cursor-pointer shrink-0 shadow-2xs"
                          title="Click to view full photo"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="text-left group/title block cursor-pointer max-w-md"
                        >
                          <div className="font-extrabold text-slate-900 text-xs group-hover/title:text-sky-600 transition-colors line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                            {item.description}
                          </div>
                        </button>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${categoryBadgeColors[item.category] || categoryBadgeColors.General
                            }`}
                        >
                          {item.category}
                        </span>
                      </td>

                      {/* Activity Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {new Date(item.activityDate || item.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Likes Counter */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-md text-[11px]">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                          {item.likeCount || 0}
                        </span>
                      </td>

                      {/* Publisher / Uploader */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {item.uploaderImage ? (
                            <img
                              src={item.uploaderImage}
                              alt={item.uploaderName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                              {(item.uploaderName || "A").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">
                              {item.uploaderName || "Administrator"}
                            </div>
                            {item.uploaderBatch && (
                              <div className="text-[10px] text-slate-400">
                                {item.uploaderBatch}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-sky-50 hover:text-sky-600 text-slate-600 transition-colors cursor-pointer"
                            title="Preview activity details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item._id)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                            title="Delete activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ─── Grid View ─── */
        isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse"
              >
                <div className="h-44 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              No Activities Found
            </h3>
            <p className="text-xs text-slate-500">
              {searchQuery || selectedCategory !== "All"
                ? "No activities matched your search criteria."
                : "No gallery activities uploaded yet. Start by uploading one."}
            </p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Upload First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Photo Area */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${categoryBadgeColors[item.category] ||
                        categoryBadgeColors.General
                        }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                    {item.likeCount || 0}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(
                        item.activityDate || item.createdAt
                      ).toLocaleDateString("en-GB")}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                        title="Preview full details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ─── Modal 1: Admin Upload Activity Modal ─── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Admin Activity Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Upload Gallery Photo & Activity
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Post an official alumni activity photo to the gallery. Members can browse and like this post.
              </p>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Activity Photo <span className="text-rose-500">*</span>
                </label>

                {imagePreview || newImageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border-2 border-sky-400 bg-slate-50">
                    <img
                      src={imagePreview || newImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setNewImageUrl("");
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                      Ready to Publish
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-sky-50/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800">
                        {isUploading
                          ? `Uploading (${uploadProgress}%)...`
                          : "Click to upload activity photo"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP up to 10MB
                      </p>
                    </div>
                  </label>
                )}

                {/* Direct URL Input */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    OR
                  </span>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => {
                      setNewImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Paste direct image URL (https://...)"
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
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Annual Merit Scholarship Ceremony 2026"
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
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
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
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Caption <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide activity context, participants, and event highlights..."
                  maxLength={2000}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
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
                  disabled={createMutation.isPending || isUploading}
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {createMutation.isPending ? (
                    <span className="animate-pulse">Publishing...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Publish Activity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Delete Confirmation Modal ─── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              Delete This Activity?
            </h3>
            <p className="text-xs text-slate-500">
              This photo and its community likes will be permanently removed from the alumni gallery.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 3: Activity Detail Preview Modal ─── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-md border ${categoryBadgeColors[previewItem.category] ||
                    categoryBadgeColors.General
                    }`}
                >
                  {previewItem.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  {previewItem.likeCount || 0} Likes
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {previewItem.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {previewItem.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Date:{" "}
                  {new Date(
                    previewItem.activityDate || previewItem.createdAt
                  ).toLocaleDateString("en-GB")}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
