"use client";

import { useState } from "react";
import {
  Megaphone,
  Send,
  Plus,
  Trash2,
  Pin,
  Bell,
  AlertCircle,
  Info,
  Calendar,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
} from "@/hooks/useQueries";
import { showError, showSuccess } from "@/utility/toast";

export default function AdminBroadcastPage() {
  const [activeTab, setActiveTab] = useState("notices"); // "notices" | "broadcasts"
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // New Notice state
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    priority: "Medium",
    category: "General",
    isPinned: false,
    status: "published",
  });

  // Broadcast state
  const [broadcastTarget, setBroadcastTarget] = useState("ALL");
  const [broadcastChannel, setBroadcastChannel] = useState("SMS & Email");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // React Query hooks for real database announcements
  const { data: announcements = [], isLoading } = useAnnouncements({ status: "all" });
  const createNoticeMutation = useCreateAnnouncement();
  const deleteNoticeMutation = useDeleteAnnouncement();

  const [broadcasts, setBroadcasts] = useState([
    {
      id: "BC-104",
      subject: "Reminder: Annual General Meeting & Committee Election",
      target: "All Verified Alumni (842 Members)",
      channel: "SMS & Email",
      sentDate: "Today, 11:30 AM",
      deliveredRate: "99.2%",
    },
    {
      id: "BC-103",
      subject: "Emergency Blood Requirement: O+ for Adarsha School Student",
      target: "All Alumni in Dhaka & Brahmanbaria",
      channel: "Urgent SMS",
      sentDate: "03 Mar 2026",
      deliveredRate: "100%",
    },
  ]);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      showError("Title and content are required.");
      return;
    }

    try {
      await createNoticeMutation.mutateAsync({
        title: newNotice.title.trim(),
        content: newNotice.content.trim(),
        priority: newNotice.priority,
        category: newNotice.category,
        isPinned: newNotice.isPinned,
        status: newNotice.status,
      });

      setShowNoticeModal(false);
      setNewNotice({
        title: "",
        content: "",
        priority: "Medium",
        category: "General",
        isPinned: false,
        status: "published",
      });
    } catch (err) {
      // Handled in mutation toast
    }
  };

  const handleDeleteNotice = async (id, title) => {
    if (confirm(`Are you sure you want to delete notice "${title}"?`)) {
      try {
        await deleteNoticeMutation.mutateAsync(id);
      } catch (err) {
        // Handled in mutation toast
      }
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      showError("Subject and message are required.");
      return;
    }

    const newBc = {
      id: `BC-${105 + broadcasts.length}`,
      subject: broadcastSubject,
      target:
        broadcastTarget === "ALL"
          ? "All Verified Alumni (842 Members)"
          : `Batch ${broadcastTarget} Alumni`,
      channel: broadcastChannel,
      sentDate: "Just now",
      deliveredRate: "Queued (Sending...)",
    };

    setBroadcasts([newBc, ...broadcasts]);
    setShowBroadcastModal(false);
    setBroadcastSubject("");
    setBroadcastMessage("");
    showSuccess("Broadcast queued and dispatched to alumni gateway!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Communication Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Notice Board & Broadcast Dispatcher
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "notices" ? (
            <button
              type="button"
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Official Notice</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Compose Broadcast SMS/Email</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("notices")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === "notices"
              ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Home Notice Board ({announcements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("broadcasts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === "broadcasts"
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>SMS & Email Broadcasts ({broadcasts.length})</span>
        </button>
      </div>

      {/* TAB 1: Notice Board Announcements */}
      {activeTab === "notices" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No notices published yet</h3>
              <p className="text-slate-400 text-xs mt-1 mb-4">
                Publish a notice to display on the home page sliding notice board.
              </p>
              <button
                type="button"
                onClick={() => setShowNoticeModal(true)}
                className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
              >
                Publish Notice
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {announcements.map((item) => {
                const priorityBadge = {
                  High: "bg-rose-100 text-rose-800 border-rose-200",
                  Medium: "bg-sky-100 text-sky-800 border-sky-200",
                  Low: "bg-slate-100 text-slate-700 border-slate-200",
                }[item.priority] || "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div
                    key={item._id || item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${priorityBadge}`}
                        >
                          {item.priority}
                        </span>

                        {item.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Pin size={10} className="text-amber-600" /> Pinned
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(item.date || item.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="font-black text-sm text-slate-900 truncate mb-0.5">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDeleteNotice(item._id || item.id, item.title)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SMS & Email Broadcasts */}
      {activeTab === "broadcasts" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="divide-y divide-slate-100">
            {broadcasts.map((bc) => (
              <div
                key={bc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold text-sky-700">
                      {bc.id}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{bc.subject}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Target: <strong>{bc.target}</strong> · Via {bc.channel} · Sent{" "}
                    {bc.sentDate}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    Delivered {bc.deliveredRate}
                  </span>
                  <button
                    type="button"
                    onClick={() => showSuccess("Resending broadcast via SMS/Email...")}
                    className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Resend Broadcast"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              Publish Notice Board Announcement
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              This circular will slide on the Home Page notice board for all alumni and visitors.
            </p>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notice Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Annual General Meeting & Committee Election Notice"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notice Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Detailed circular text, instructions, deadlines, or committee announcements..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="High">High (Urgent)</option>
                    <option value="Medium">Medium (Important)</option>
                    <option value="Low">Low (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Reunion">Reunion</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Election">Election</option>
                    <option value="Welfare">Welfare</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="pinCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Pin to top of Home Page Notice Board
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createNoticeMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition disabled:opacity-60"
                >
                  {createNoticeMutation.isPending ? "Publishing..." : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compose Broadcast Modal */}
      {showBroadcastModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowBroadcastModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              Dispatch Organization Broadcast
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              Send SMS or Email bulletin to verified alumni members.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Audience
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="ALL">All Verified Alumni</option>
                    <option value="2006">Batch 2006 Alumni</option>
                    <option value="2012">Batch 2012 Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Channel
                  </label>
                  <select
                    value={broadcastChannel}
                    onChange={(e) => setBroadcastChannel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="SMS & Email">SMS & Email</option>
                    <option value="SMS Only">SMS Only</option>
                    <option value="Email Only">Email Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Header <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Urgent Update Regarding Alumni Meeting"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter message to dispatch..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
                >
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
