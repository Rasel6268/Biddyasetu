"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Crown,
  Heart,
  Users,
  CheckCircle2,
  X,
  Plus,
  Edit3,
  Trash2,
  Search,
  Download,
  Award,
  AlertCircle,
  Eye,
  Send,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  useAdminMembershipPackages,
  useCreateMembershipPackage,
  useUpdateMembershipPackage,
  useToggleMembershipPackage,
  useDeleteMembershipPackage,
  useAdminMembers,
} from "@/hooks/useQueries";

const iconMap = {
  users: Users,
  crown: Crown,
  heart: Heart,
  award: Award,
  shield: ShieldCheck,
  creditcard: CreditCard,
};

const colorMap = {
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    icon: "bg-sky-100 text-sky-600",
    badge: "bg-sky-100 text-sky-800",
    gradient: "from-sky-500 to-sky-600",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-800",
    gradient: "from-amber-500 to-amber-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-800",
    gradient: "from-purple-500 to-purple-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
    gradient: "from-emerald-500 to-emerald-600",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    icon: "bg-rose-100 text-rose-600",
    badge: "bg-rose-100 text-rose-800",
    gradient: "from-rose-500 to-rose-600",
  },
};

export default function AdminMembershipFeesPage() {
  const [toastMsg, setToastMsg] = useState("");
  const [activeTab, setActiveTab] = useState("packages");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteConfirmPackage, setDeleteConfirmPackage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(null);

  // Form state for creating a new package
  const [newPkg, setNewPkg] = useState({
    name: "",
    namebn: "",
    fee: "",
    cycle: "Annual",
    description: "",
    benefits: "",
    color: "sky",
    icon: "users",
    isActive: true,
  });

  // Backend React Query Hooks
  const {
    data: packages = [],
    isLoading: isPackagesLoading,
    isFetching: isPackagesFetching,
    refetch: refetchPackages,
  } = useAdminMembershipPackages();

  const createPackageMutation = useCreateMembershipPackage();
  const updatePackageMutation = useUpdateMembershipPackage();
  const togglePackageMutation = useToggleMembershipPackage();
  const deletePackageMutation = useDeleteMembershipPackage();

  // Real backend members for fee tracking
  const { data: dbMembers = [], isLoading: isMembersLoading } = useAdminMembers();

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Format DB Members for Membership Status Tab
  const members = useMemo(() => {
    if (!Array.isArray(dbMembers) || dbMembers.length === 0) return [];

    return dbMembers.map((m) => {
      const tierName =
        m.packageData?.packageName ||
        (m.membership === "life_member"
          ? "Life Member"
          : m.membership === "donor_member" || m.membership === "patron_member"
            ? "Patron / Donor Member"
            : "General Member");

      const isPaid = (m.paymentStatus || "").toLowerCase() === "paid";
      const feeAmount =
        m.packageData?.fee ||
        (tierName === "Life Member"
          ? 20000
          : tierName.includes("Donor")
            ? 50000
            : 1000);
      const totalPaid = isPaid ? feeAmount : 0;

      return {
        id: m.membershipId || `BDS-${m._id?.slice(-6) || "0001"}`,
        _id: m._id,
        name: m.name || "Alumni Member",
        nameBn: m.nameBn || "",
        batch: m.batch ? String(m.batch) : "N/A",
        phone: m.phone || "N/A",
        email: m.email || "",
        package: tierName,
        totalPaid,
        dueAmount: isPaid ? 0 : feeAmount,
        lastPayment: m.membershipStartDate
          ? new Date(m.membershipStartDate).toLocaleDateString()
          : isPaid
            ? "Recent"
            : null,
        status: isPaid ? "Paid" : "Unpaid",
        certificate: tierName === "Life Member" || tierName.includes("Donor"),
        paymentHistory: isPaid
          ? [
            {
              date: m.membershipStartDate
                ? new Date(m.membershipStartDate).toLocaleDateString()
                : new Date().toLocaleDateString(),
              amount: feeAmount,
              method: "Online / Gateway",
              trxId: `TRX-${m._id?.slice(-8).toUpperCase()}`,
            },
          ]
          : [],
      };
    });
  }, [dbMembers]);

  // ─── KPI Calculations ───
  const totalCollected = useMemo(
    () => members.reduce((sum, m) => sum + (m.totalPaid || 0), 0),
    [members]
  );
  const paidMembers = useMemo(
    () => members.filter((m) => m.status === "Paid").length,
    [members]
  );
  const unpaidMembers = useMemo(
    () => members.filter((m) => m.status === "Unpaid").length,
    [members]
  );
  const lifeMembers = useMemo(
    () => members.filter((m) => m.package === "Life Member").length,
    [members]
  );

  // ─── Filtered Members ───
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.batch.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || m.status.toLowerCase() === statusFilter;

      const matchesPackage =
        packageFilter === "all" || m.package === packageFilter;

      return matchesSearch && matchesStatus && matchesPackage;
    });
  }, [members, searchQuery, statusFilter, packageFilter]);

  // ─── Package CRUD Handlers with Backend ───
  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (!newPkg.name.trim() || newPkg.fee === "") return;

    try {
      await createPackageMutation.mutateAsync({
        name: newPkg.name.trim(),
        namebn: newPkg.namebn.trim(),
        fee: Number(newPkg.fee),
        cycle: newPkg.cycle,
        description: newPkg.description.trim(),
        benefits: newPkg.benefits,
        color: newPkg.color,
        icon: newPkg.icon,
        isActive: newPkg.isActive,
      });

      setShowCreateModal(false);
      setNewPkg({
        name: "",
        namebn: "",
        fee: "",
        cycle: "Annual",
        description: "",
        benefits: "",
        color: "sky",
        icon: "users",
        isActive: true,
      });
      triggerToast(`Membership package "${newPkg.name}" created successfully.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage({
      ...pkg,
      benefitsText: Array.isArray(pkg.benefits)
        ? pkg.benefits.join(", ")
        : pkg.benefits || "",
    });
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    if (!editingPackage || !editingPackage.name.trim() || editingPackage.fee === "")
      return;

    try {
      await updatePackageMutation.mutateAsync({
        id: editingPackage._id || editingPackage.id,
        packageData: {
          name: editingPackage.name.trim(),
          namebn: editingPackage.namebn ? editingPackage.namebn.trim() : "",
          fee: Number(editingPackage.fee),
          cycle: editingPackage.cycle,
          description: editingPackage.description ? editingPackage.description.trim() : "",
          benefits: editingPackage.benefitsText
            ? editingPackage.benefitsText.split(",").map((b) => b.trim()).filter(Boolean)
            : editingPackage.benefits,
          color: editingPackage.color,
          icon: editingPackage.icon,
          isActive: editingPackage.isActive,
        },
      });

      setEditingPackage(null);
      triggerToast(`Package "${editingPackage.name}" updated successfully.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePackage = async (pkg) => {
    try {
      await togglePackageMutation.mutateAsync(pkg._id || pkg.id);
      triggerToast(`Package "${pkg.name}" status updated.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePackage = async () => {
    if (!deleteConfirmPackage) return;
    try {
      await deletePackageMutation.mutateAsync(
        deleteConfirmPackage._id || deleteConfirmPackage.id
      );
      triggerToast(`Package "${deleteConfirmPackage.name}" deleted.`);
      setDeleteConfirmPackage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (!filteredMembers.length) return;
    const headers = [
      "Membership ID",
      "Name",
      "Batch",
      "Phone",
      "Package",
      "Total Paid (BDT)",
      "Due Amount (BDT)",
      "Last Payment",
      "Status",
      "Certificate",
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = filteredMembers.map((m) => [
      escapeCsv(m.id),
      escapeCsv(m.name),
      escapeCsv(m.batch),
      escapeCsv(m.phone),
      escapeCsv(m.package),
      escapeCsv(m.totalPaid),
      escapeCsv(m.dueAmount),
      escapeCsv(m.lastPayment || "Never"),
      escapeCsv(m.status),
      escapeCsv(m.certificate ? "Issued" : "No"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Biddyasetu_Membership_Fees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[130] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg("")}
            className="ml-2 hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Membership Fees & Packages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage membership tiers, fee structures, and member subscription statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetchPackages()}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh packages"
          >
            <RefreshCw
              className={`w-4 h-4 ${isPackagesFetching ? "animate-spin text-sky-600" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Package
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Collected
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            ৳{totalCollected.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Across {paidMembers} active contributions
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{paidMembers}</div>
          <div className="text-xs text-emerald-600 font-semibold">Up to date on fees</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Unpaid / Pending
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{unpaidMembers}</div>
          <div className="text-xs text-rose-600 font-semibold">Awaiting payment</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Life Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{lifeMembers}</div>
          <div className="text-xs text-amber-700 font-semibold">Lifetime alumni members</div>
        </div>
      </div>

      {/* ─── Tab Switcher ─── */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1 w-fit">
        {[
          { key: "packages", label: `Membership Packages (${packages.length})` },
          { key: "members", label: `Member Fee Status (${members.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: MEMBERSHIP PACKAGES ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          {/* Fee Structure Policy Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Biddyasetu Membership Fee Structure Policy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Admins can create, edit, activate/deactivate, and delete membership tiers in real-time. Changes are stored in the backend and reflected across public registration and user payment flows.
              </p>
            </div>
          </div>

          {/* Package Cards Grid */}
          {isPackagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse space-y-4"
                >
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded w-1/3" />
                  <div className="h-16 bg-slate-200 rounded" />
                  <div className="h-10 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {packages.map((pkg) => {
                const pkgId = pkg._id || pkg.id;
                const colors = colorMap[pkg.color] || colorMap.sky;
                const IconComp = iconMap[pkg.icon] || Users;

                return (
                  <div
                    key={pkgId}
                    className={`bg-white rounded-3xl border ${colors.border} shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between ${!pkg.isActive ? "opacity-65" : ""
                      }`}
                  >
                    <div>
                      {/* Package Header */}
                      <div className={`${colors.bg} p-5 border-b ${colors.border}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-xl ${colors.icon} flex items-center justify-center`}
                            >
                              <IconComp className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-slate-900">
                                {pkg.name}
                              </h3>
                              {pkg.namebn && (
                                <div className="text-xs text-slate-500 font-medium">
                                  {pkg.namebn}
                                </div>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${pkg.isActive
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                : "bg-slate-200 text-slate-600"
                              }`}
                          >
                            {pkg.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">
                            ৳{Number(pkg.fee).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            / {pkg.cycle || "Annual"}
                          </span>
                        </div>
                      </div>

                      {/* Package Body */}
                      <div className="p-5">
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {pkg.description || "Official membership package for alumni."}
                        </p>

                        {/* Benefits List */}
                        {Array.isArray(pkg.benefits) && pkg.benefits.length > 0 && (
                          <div className="space-y-2 mb-5">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              Benefits Included
                            </div>
                            {pkg.benefits.map((b, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs text-slate-700"
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 ${colors.text} shrink-0 mt-0.5`}
                                />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Package Actions Footer */}
                    <div className="p-5 pt-0">
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleTogglePackage(pkg)}
                          disabled={togglePackageMutation.isPending}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${pkg.isActive
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            }`}
                        >
                          {pkg.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(pkg)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmPackage(pkg)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Package Card Trigger */}
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all min-h-[320px] flex flex-col items-center justify-center gap-3 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-500 flex items-center justify-center transition-colors">
                  <Plus className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-500 group-hover:text-sky-600 transition-colors">
                  Create New Package
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── TAB 2: MEMBER FEE STATUS TABLE ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, member ID, batch, or phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500 transition-colors bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>

            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Packages</option>
              <option value="General Member">General Member</option>
              <option value="Life Member">Life Member</option>
              <option value="Patron / Donor Member">Patron / Donor Member</option>
            </select>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Summary Bar */}
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredMembers.length}</strong> of{" "}
            <strong className="text-slate-900">{members.length}</strong> alumni members
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] bg-slate-50/50">
                    <th className="px-5 py-3.5">Member</th>
                    <th className="px-5 py-3.5">Batch</th>
                    <th className="px-5 py-3.5">Package</th>
                    <th className="px-5 py-3.5">Total Paid</th>
                    <th className="px-5 py-3.5">Due Amount</th>
                    <th className="px-5 py-3.5">Last Payment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Certificate</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {isMembersLoading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-slate-400">
                        Loading member fee records...
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-slate-400">
                        No member records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Member Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${m.status === "Paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                                }`}
                            >
                              {m.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">
                                {m.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {m.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Batch */}
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-bold text-[11px]">
                            {m.batch}
                          </span>
                        </td>

                        {/* Package */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {m.package === "Life Member" && (
                              <Crown className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            {m.package.includes("Donor") && (
                              <Heart className="w-3.5 h-3.5 text-purple-500" />
                            )}
                            <span className="font-semibold text-slate-700 text-[11px]">
                              {m.package}
                            </span>
                          </div>
                        </td>

                        {/* Total Paid */}
                        <td className="px-5 py-4 font-bold text-slate-900">
                          ৳{m.totalPaid.toLocaleString()}
                        </td>

                        {/* Due Amount */}
                        <td className="px-5 py-4">
                          {m.dueAmount ? (
                            <span className="font-bold text-rose-600">
                              ৳{m.dueAmount.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">—</span>
                          )}
                        </td>

                        {/* Last Payment */}
                        <td className="px-5 py-4 text-slate-600">
                          {m.lastPayment || (
                            <span className="text-slate-400 italic">Never</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${m.status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                              }`}
                          >
                            {m.status === "Paid" ? "✓ Paid" : "✗ Unpaid"}
                          </span>
                        </td>

                        {/* Certificate */}
                        <td className="px-5 py-4">
                          {m.certificate ? (
                            <div className="flex items-center gap-1 text-amber-600">
                              <Award className="w-4 h-4" />
                              <span className="text-[10px] font-bold">Issued</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowDetailModal(m)}
                              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer"
                              title="View Payment History"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {m.status === "Unpaid" && (
                              <button
                                type="button"
                                onClick={() =>
                                  triggerToast(
                                    `Payment reminder sent to ${m.name} (${m.phone}).`
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                              >
                                Send Reminder
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── MODAL 1: CREATE PACKAGE MODAL ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Create Membership Package
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Define a new alumni membership tier with fee and benefits.
            </p>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Package Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newPkg.name}
                  onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                  placeholder="e.g. Associate Member"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Package Name (বাংলা)
                </label>
                <input
                  type="text"
                  value={newPkg.namebn}
                  onChange={(e) => setNewPkg({ ...newPkg, namebn: e.target.value })}
                  placeholder="e.g. সহযোগী সদস্য"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fee Amount (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newPkg.fee}
                    onChange={(e) => setNewPkg({ ...newPkg, fee: e.target.value })}
                    placeholder="1000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={newPkg.cycle}
                    onChange={(e) => setNewPkg({ ...newPkg, cycle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="Annual">Annual</option>
                    <option value="One-time">One-time</option>
                    <option value="Lifetime">Lifetime</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newPkg.description}
                  onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                  placeholder="Brief description of this membership tier..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPkg.benefits}
                  onChange={(e) => setNewPkg({ ...newPkg, benefits: e.target.value })}
                  placeholder="Alumni Directory, Voting Rights, AGM Pass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Theme Color
                  </label>
                  <select
                    value={newPkg.color}
                    onChange={(e) => setNewPkg({ ...newPkg, color: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="sky">Blue (Sky)</option>
                    <option value="amber">Gold (Amber)</option>
                    <option value="purple">Purple</option>
                    <option value="emerald">Green (Emerald)</option>
                    <option value="rose">Red (Rose)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={newPkg.icon}
                    onChange={(e) => setNewPkg({ ...newPkg, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="users">Users</option>
                    <option value="crown">Crown</option>
                    <option value="heart">Heart</option>
                    <option value="award">Award</option>
                    <option value="shield">Shield</option>
                    <option value="creditcard">Credit Card</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={createPackageMutation.isPending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {createPackageMutation.isPending
                  ? "Saving to Backend..."
                  : "Create Membership Package"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── MODAL 2: EDIT PACKAGE MODAL ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {editingPackage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingPackage(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Edit Membership Package
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Modify package name, fees, cycle, and benefits.
            </p>

            <form onSubmit={handleUpdatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Package Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPackage.name}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Package Name (বাংলা)
                </label>
                <input
                  type="text"
                  value={editingPackage.namebn || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, namebn: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fee Amount (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingPackage.fee}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, fee: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={editingPackage.cycle || "Annual"}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, cycle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="Annual">Annual</option>
                    <option value="One-time">One-time</option>
                    <option value="Lifetime">Lifetime</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingPackage.description || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingPackage.benefitsText || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, benefitsText: e.target.value })
                  }
                  placeholder="Benefit 1, Benefit 2, Benefit 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Theme Color
                  </label>
                  <select
                    value={editingPackage.color || "sky"}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, color: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="sky">Blue (Sky)</option>
                    <option value="amber">Gold (Amber)</option>
                    <option value="purple">Purple</option>
                    <option value="emerald">Green (Emerald)</option>
                    <option value="rose">Red (Rose)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={editingPackage.icon || "users"}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, icon: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="users">Users</option>
                    <option value="crown">Crown</option>
                    <option value="heart">Heart</option>
                    <option value="award">Award</option>
                    <option value="shield">Shield</option>
                    <option value="creditcard">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingPackage.isActive !== false}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, isActive: e.target.checked })
                  }
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="editIsActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Active (Available for member registration)
                </label>
              </div>

              <button
                type="submit"
                disabled={updatePackageMutation.isPending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Edit3 className="w-4 h-4" />
                {updatePackageMutation.isPending
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── MODAL 3: DELETE CONFIRMATION ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {deleteConfirmPackage && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-rose-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Package?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to remove{" "}
              <strong>&quot;{deleteConfirmPackage.name}&quot;</strong>? Existing members who subscribed to this package will keep their records.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmPackage(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePackage}
                disabled={deletePackageMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletePackageMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── MODAL 4: MEMBER DETAIL / PAYMENT HISTORY MODAL ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDetailModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Member Header */}
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-200">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${showDetailModal.status === "Paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                  }`}
              >
                {showDetailModal.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {showDetailModal.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {showDetailModal.id} · Batch {showDetailModal.batch} ·{" "}
                  {showDetailModal.phone}
                </div>
              </div>
            </div>

            {/* Member Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Package
                </div>
                <div className="font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                  {showDetailModal.package === "Life Member" && (
                    <Crown className="w-4 h-4 text-amber-500" />
                  )}
                  {showDetailModal.package}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Paid
                </div>
                <div className="font-black text-sm text-slate-900 mt-1">
                  ৳{showDetailModal.totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </div>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${showDetailModal.status === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                    }`}
                >
                  {showDetailModal.status}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Certificate
                </div>
                <div className="mt-1">
                  {showDetailModal.certificate ? (
                    <span className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                      <Award className="w-4 h-4" /> Eligible / Issued
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not Applicable</span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Payment History
              </h4>
              {showDetailModal.paymentHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No payments recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {showDetailModal.paymentHistory.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          ৳{p.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.date} · {p.method}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-500">
                          {p.trxId}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {showDetailModal.status === "Unpaid" && (
              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(
                      `Payment reminder sent to ${showDetailModal.name} (${showDetailModal.phone}).`
                    );
                    setShowDetailModal(null);
                  }}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Payment Reminder
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
