"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  Plus,
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  RefreshCw,
  Trash2,
  Tag,
  ShieldCheck,
  Receipt,
  User,
  Building,
} from "lucide-react";
import {
  useFinancialReport,
  useCreateFinancialRecord,
  useDeleteFinancialRecord,
} from "@/hooks/useQueries";
import api from "@/utility/config";
import { generateFinancialReportPDF } from "@/utility/pdfReportGenerator";
import { showSuccess, showError } from "@/utility/toast";

export default function FinancialReportsPage() {
  // Date-to-date filter states (Default to all time / current year)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // "all" | "income" | "expense"
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Export State
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportStart, setExportStart] = useState("");
  const [exportEnd, setExportEnd] = useState("");

  // Form states for manual Income (Donation)
  const [incomeForm, setIncomeForm] = useState({
    title: "",
    category: "donation",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    sourceOrPayee: "",
    paymentMethod: "Bank Transfer",
    referenceId: "",
    notes: "",
  });

  // Form states for manual Expense
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "scholarship_aid",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    sourceOrPayee: "",
    paymentMethod: "Cash",
    referenceId: "",
    notes: "",
  });

  // Queries & Mutations
  const {
    data: reportData,
    isLoading,
    isRefetching,
    refetch,
  } = useFinancialReport({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type: selectedType !== "all" ? selectedType : undefined,
  });

  const createRecordMutation = useCreateFinancialRecord();
  const deleteRecordMutation = useDeleteFinancialRecord();

  // Summary figures
  const summary = reportData?.summary || {
    totalIncome: 0,
    totalMembershipIncome: 0,
    totalManualIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    totalTransactions: 0,
    incomeTransactionCount: 0,
    expenseTransactionCount: 0,
  };

  const rawLedger = reportData?.ledger || [];
  const incomeBreakdown = reportData?.breakdown?.incomeByCategory || [];
  const expenseBreakdown = reportData?.breakdown?.expenseByCategory || [];

  // Client-side search on ledger rows
  const filteredLedger = useMemo(() => {
    if (!searchQuery.trim()) return rawLedger;
    const term = searchQuery.toLowerCase();
    return rawLedger.filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.sourceOrPayee?.toLowerCase().includes(term) ||
        item.referenceId?.toLowerCase().includes(term) ||
        item.categoryLabel?.toLowerCase().includes(term) ||
        item.paymentMethod?.toLowerCase().includes(term)
    );
  }, [rawLedger, searchQuery]);

  // Date Presets Handler
  const applyPreset = (preset) => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "this-month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === "last-month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .slice(0, 10);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .slice(0, 10);
      setStartDate(firstDay);
      setEndDate(lastDay);
    } else if (preset === "this-year") {
      const firstDay = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .slice(0, 10);
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (preset === "last-90-days") {
      const d = new Date(Date.now() - 90 * 86400000);
      setStartDate(d.toISOString().slice(0, 10));
      setEndDate(todayStr);
    }
  };

  // Submit Manual Income / Donation
  const handleCreateIncome = async (e) => {
    e.preventDefault();
    if (!incomeForm.title.trim()) {
      showError("Please enter a title for this income.");
      return;
    }
    if (!incomeForm.amount || Number(incomeForm.amount) <= 0) {
      showError("Please enter a valid positive amount.");
      return;
    }

    try {
      await createRecordMutation.mutateAsync({
        type: "income",
        category: incomeForm.category,
        title: incomeForm.title.trim(),
        amount: Number(incomeForm.amount),
        date: incomeForm.date,
        sourceOrPayee: incomeForm.sourceOrPayee.trim(),
        paymentMethod: incomeForm.paymentMethod,
        referenceId: incomeForm.referenceId.trim(),
        notes: incomeForm.notes.trim(),
      });

      setShowIncomeModal(false);
      setIncomeForm({
        title: "",
        category: "donation",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        sourceOrPayee: "",
        paymentMethod: "Bank Transfer",
        referenceId: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Manual Expense
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.title.trim()) {
      showError("Please enter a purpose / title for this expense.");
      return;
    }
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      showError("Please enter a valid positive expense amount.");
      return;
    }

    try {
      await createRecordMutation.mutateAsync({
        type: "expense",
        category: expenseForm.category,
        title: expenseForm.title.trim(),
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        sourceOrPayee: expenseForm.sourceOrPayee.trim(),
        paymentMethod: expenseForm.paymentMethod,
        referenceId: expenseForm.referenceId.trim(),
        notes: expenseForm.notes.trim(),
      });

      setShowExpenseModal(false);
      setExpenseForm({
        title: "",
        category: "scholarship_aid",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        sourceOrPayee: "",
        paymentMethod: "Cash",
        referenceId: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (id) => {
    try {
      await deleteRecordMutation.mutateAsync(id);
      setDeleteConfirmItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Print Statement
  const handlePrint = () => {
    window.print();
  };

  // Open Export Modal with current dates initialized
  const openExportModal = () => {
    setExportStart(startDate);
    setExportEnd(endDate);
    setShowExportModal(true);
  };

  // Download PDF Report (for active screen range or custom date-to-date)
  const handleDownloadPDF = async (customStart, customEnd) => {
    try {
      setIsExportingPDF(true);
      const effectiveStart = customStart !== undefined ? customStart : startDate;
      const effectiveEnd = customEnd !== undefined ? customEnd : endDate;

      // If dates match current reportData, generate directly without extra network call
      if (
        reportData &&
        effectiveStart === (reportData.dateRange?.startDate || "") &&
        effectiveEnd === (reportData.dateRange?.endDate || "")
      ) {
        const fileName = generateFinancialReportPDF(reportData, {
          startDate: effectiveStart,
          endDate: effectiveEnd,
        });
        showSuccess(`Downloaded official PDF report: ${fileName}`);
        setShowExportModal(false);
        return;
      }

      // If custom dates were requested in modal, fetch data dynamically
      const res = await api.get("/financial-reports", {
        params: {
          startDate: effectiveStart || undefined,
          endDate: effectiveEnd || undefined,
        },
      });

      if (res.data?.success && res.data?.data) {
        // Sync screen date filters so screen and PDF match
        setStartDate(effectiveStart);
        setEndDate(effectiveEnd);

        const fileName = generateFinancialReportPDF(res.data.data, {
          startDate: effectiveStart,
          endDate: effectiveEnd,
        });
        showSuccess(`Downloaded official PDF report: ${fileName}`);
        setShowExportModal(false);
      } else {
        showError("Failed to fetch report data for the selected date range.");
      }
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to generate PDF report.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* ─── Top Header & Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 print:border-b-2 print:pb-2">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Financial Intelligence & Treasury
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Financial Reports & Audit Statement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic date-to-date accounting statement covering online membership fees, manual donations, and organizational welfare expenditures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh financial data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin text-sky-600" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Print statement or save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Statement</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadPDF()}
            disabled={isExportingPDF || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Download official PDF report for current dates"
          >
            <Download
              className={`w-4 h-4 text-sky-600 ${isExportingPDF ? "animate-bounce" : ""}`}
            />
            <span>{isExportingPDF ? "Generating PDF..." : "Download PDF Report"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowIncomeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record Donation / Income</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExpenseModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm shadow-rose-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* ─── Date-to-Date Filter Toolbar (Print Hidden Controls) ─── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Custom Date Pickers & Range PDF Trigger */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-bold">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-bold">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={openExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Configure and download date-to-date PDF statement"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Date-to-Date PDF</span>
            </button>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => applyPreset("all")}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold underline px-2 py-1 cursor-pointer"
              >
                Clear Dates
              </button>
            )}
          </div>

          {/* Quick Date Range Preset Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => applyPreset("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                !startDate && !endDate
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => applyPreset("this-month")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => applyPreset("last-month")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => applyPreset("this-year")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              Year 2026
            </button>
            <button
              type="button"
              onClick={() => applyPreset("last-90-days")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              Last 90 Days
            </button>
          </div>
        </div>

        {/* Bottom Sub-filters: Type Tabs & Search */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Transactions ({summary.totalTransactions})
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("income")}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === "income"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              Income Only ({summary.incomeTransactionCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("expense")}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === "expense"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-rose-700"
              }`}
            >
              Expenses Only ({summary.expenseTransactionCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger by title, payee, ref..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* ─── Active Report Range Banner ─── */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <div>
          Reporting Period:{" "}
          <strong className="text-slate-900">
            {startDate
              ? new Date(startDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Inception"}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-900">
            {endDate
              ? new Date(endDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Present"}
          </strong>
        </div>
        <div className="text-[11px] text-slate-400">
          Showing {filteredLedger.length} ledger rows
        </div>
      </div>

      {/* ─── 4 Executive KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Revenue / Inflows
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-28 animate-pulse mb-1" />
          ) : (
            <div className="text-2xl font-black text-emerald-700">
              ৳{summary.totalIncome.toLocaleString()}
            </div>
          )}
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            ৳{summary.totalMembershipIncome.toLocaleString()} Member Fees + ৳
            {summary.totalManualIncome.toLocaleString()} Donations
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Expenditures
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-28 animate-pulse mb-1" />
          ) : (
            <div className="text-2xl font-black text-rose-600">
              ৳{summary.totalExpenses.toLocaleString()}
            </div>
          )}
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {summary.expenseTransactionCount} expense vouchers disbursed
          </div>
        </div>

        {/* Net Balance / Surplus */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Net Balance / Surplus
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                summary.netBalance >= 0
                  ? "bg-sky-50 text-sky-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-28 animate-pulse mb-1" />
          ) : (
            <div
              className={`text-2xl font-black ${
                summary.netBalance >= 0 ? "text-slate-900" : "text-amber-600"
              }`}
            >
              ৳{summary.netBalance.toLocaleString()}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-bold mt-1">
            {summary.netBalance >= 0 ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                ✓ Operating Surplus
              </span>
            ) : (
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                ⚠ Deficit
              </span>
            )}
          </div>
        </div>

        {/* Transactions Audit */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Entries
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Receipt className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-16 animate-pulse mb-1" />
          ) : (
            <div className="text-2xl font-black text-slate-900">
              {summary.totalTransactions}
            </div>
          )}
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {summary.incomeTransactionCount} Inflows · {summary.expenseTransactionCount} Outflows
          </div>
        </div>
      </div>

      {/* ─── Category Breakdowns (Income Streams vs. Expense Allocations) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Income Streams Breakdown
              </h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-700">
              Total: ৳{summary.totalIncome.toLocaleString()}
            </span>
          </div>

          {incomeBreakdown.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No income recorded in this period.
            </div>
          ) : (
            <div className="space-y-3">
              {incomeBreakdown.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">{c.name}</span>
                    <span className="font-extrabold text-slate-900">
                      ৳{c.amount.toLocaleString()}{" "}
                      <span className="text-slate-400 font-normal">
                        ({c.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(2, c.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Expenditures Allocation
              </h3>
            </div>
            <span className="text-xs font-extrabold text-rose-600">
              Total: ৳{summary.totalExpenses.toLocaleString()}
            </span>
          </div>

          {expenseBreakdown.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No expenses recorded in this period.
            </div>
          ) : (
            <div className="space-y-3">
              {expenseBreakdown.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">{c.name}</span>
                    <span className="font-extrabold text-slate-900">
                      ৳{c.amount.toLocaleString()}{" "}
                      <span className="text-slate-400 font-normal">
                        ({c.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(2, c.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Itemized Financial Ledger Table ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Itemized Financial Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological audit trail for membership fees, donations, and expense disbursements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDownloadPDF()}
            disabled={isExportingPDF || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer self-start sm:self-auto shrink-0 print:hidden disabled:opacity-50"
            title="Download PDF audit ledger for active date range"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Download PDF Ledger</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] bg-slate-50/70">
                <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
                <th className="px-5 py-3.5 min-w-[240px]">Transaction & Notes</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Source / Payee</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Method & Ref ID</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap">Amount (BDT)</th>
                <th className="px-5 py-3.5 text-right print:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                      <span>Generating dynamic report...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span className="font-bold text-slate-700 block">
                      No transactions recorded in this period.
                    </span>
                    <span className="text-[11px]">
                      Try adjusting the date filters or record a new donation/expense.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => {
                  const isIncome = item.type === "income";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Title & Notes */}
                      <td className="px-5 py-3.5">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {item.title}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {item.categoryLabel}
                        </span>
                      </td>

                      {/* Source / Payee */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                        {item.sourceOrPayee}
                      </td>

                      {/* Payment Method & Ref ID */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-800">
                          {item.paymentMethod}
                        </span>
                        {item.referenceId && item.referenceId !== "—" && (
                          <div className="font-mono text-[10px] text-slate-400">
                            {item.referenceId}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td
                        className={`px-5 py-3.5 text-right font-black whitespace-nowrap text-sm ${
                          isIncome ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"}৳{item.amount.toLocaleString()}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right print:hidden whitespace-nowrap">
                        {item.isAutomated ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded"
                            title="SSLCommerz Gateway Online Payment"
                          >
                            <ShieldCheck className="w-3 h-3" /> Auto Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete manual voucher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Official Audit Certification & Sign-off Block (Visible in Print & Statement Mode) ─── */}
      <div className="hidden print:block pt-8 space-y-6">
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-900 block mb-0.5">Audit & Reconciled Certification Statement</strong>
          This financial report and audit ledger has been dynamically computed from validated SSLCommerz online payment gateway receipts and authorized expenditure vouchers. All membership dues, voluntary donations, and disbursements reflect reconciled bank-cleared or physical records without any simulated or estimated figures.
        </div>

        <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs">
          <div className="space-y-1">
            <div className="border-t border-slate-400 w-44 mx-auto pt-1 font-bold text-slate-900">
              Prepared By
            </div>
            <div className="text-[10px] text-slate-500">Finance & Accounts Executive</div>
          </div>

          <div className="space-y-1">
            <div className="border-t border-slate-400 w-44 mx-auto pt-1 font-bold text-slate-900">
              Verified By
            </div>
            <div className="text-[10px] text-slate-500">Chairman, Audit & Scrutiny Panel</div>
          </div>

          <div className="space-y-1">
            <div className="border-t border-slate-400 w-44 mx-auto pt-1 font-bold text-slate-900">
              Approved By
            </div>
            <div className="text-[10px] text-slate-500">President / General Secretary</div>
          </div>
        </div>

        <div className="text-center text-[9px] text-slate-400 pt-4">
          Generated via Biddyasetu Alumni Financial ERP System on{" "}
          {new Date().toLocaleString("en-GB", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </div>
      </div>

      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setShowIncomeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Treasury Receipt
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Record Donation or Other Income
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manually record alumni welfare donations, sponsorship, or tournament income.
              </p>
            </div>

            <form onSubmit={handleCreateIncome} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Income Title *
                </label>
                <input
                  type="text"
                  required
                  value={incomeForm.title}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, title: e.target.value })
                  }
                  placeholder="e.g. Science Lab Aid Contribution by SSC 1998"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={incomeForm.category}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="donation">Alumni Donation</option>
                    <option value="sponsorship">Event Sponsorship</option>
                    <option value="grant">Institutional Grant</option>
                    <option value="event_ticket">Event / Tournament Fee</option>
                    <option value="other_income">Other General Income</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Amount (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={incomeForm.amount}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, amount: e.target.value })
                    }
                    placeholder="e.g. 50000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date Received *
                  </label>
                  <input
                    type="date"
                    required
                    value={incomeForm.date}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={incomeForm.paymentMethod}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Donor / Contributor Name
                  </label>
                  <input
                    type="text"
                    value={incomeForm.sourceOrPayee}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        sourceOrPayee: e.target.value,
                      })
                    }
                    placeholder="e.g. Engr. Tanvir Ahmed (Batch 2004)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Receipt / Trx Reference
                  </label>
                  <input
                    type="text"
                    value={incomeForm.referenceId}
                    onChange={(e) =>
                      setIncomeForm({
                        ...incomeForm,
                        referenceId: e.target.value,
                      })
                    }
                    placeholder="e.g. REC-98204 / Trx ID"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Notes / Earmarked Purpose
                </label>
                <textarea
                  rows={2}
                  value={incomeForm.notes}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, notes: e.target.value })
                  }
                  placeholder="Optional details or specific purpose of this contribution..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncomeModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRecordMutation.isPending}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {createRecordMutation.isPending
                    ? "Recording..."
                    : "Save Income Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Record Expense Voucher ─── */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                Expense Voucher
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Record Expenditure Voucher
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Log scholarship disbursements, welfare grants, reunion costs, or office operations.
              </p>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Expense Purpose / Title *
                </label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, title: e.target.value })
                  }
                  placeholder="e.g. Student Stipends for Class 10 Meritorious Students"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="scholarship_aid">Student Scholarship Aid</option>
                    <option value="welfare_relief">Alumni Welfare & Medical Aid</option>
                    <option value="reunion_event">Reunion & Event Logistics</option>
                    <option value="office_admin">Administration & Web Portal</option>
                    <option value="hospitality">Hospitality & Meetings</option>
                    <option value="other_expense">Other Expenses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Amount (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    placeholder="e.g. 24000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Disbursement Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Paid To / Vendor / Beneficiary
                  </label>
                  <input
                    type="text"
                    value={expenseForm.sourceOrPayee}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        sourceOrPayee: e.target.value,
                      })
                    }
                    placeholder="e.g. Adarsha High School Office / Dhaka Sounds"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Voucher / Invoice No.
                  </label>
                  <input
                    type="text"
                    value={expenseForm.referenceId}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        referenceId: e.target.value,
                      })
                    }
                    placeholder="e.g. VOUCHER-2026-042"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Disbursement Notes / Approval Ref
                </label>
                <textarea
                  rows={2}
                  value={expenseForm.notes}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, notes: e.target.value })
                  }
                  placeholder="e.g. Approved by Executive Committee resolution #14..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRecordMutation.isPending}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {createRecordMutation.isPending
                    ? "Recording..."
                    : "Save Expense Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Delete Confirmation Dialog ─── */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900">
                Delete Voucher Entry?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete &ldquo;{deleteConfirmItem.title}&rdquo; (৳
                {deleteConfirmItem.amount?.toLocaleString()}) from the audit ledger?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRecord(deleteConfirmItem._id)}
                disabled={deleteRecordMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {deleteRecordMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: Date-to-Date PDF Export Dialog ─── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                Audit Export Engine
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Download Date-to-Date PDF Report
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate a formal, publication-ready A4 PDF financial statement for any arbitrary period.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Preset buttons */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5 text-[11px]">
                  Quick Date Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setExportStart("");
                      setExportEnd("");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      !exportStart && !exportEnd
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setExportStart(
                        new Date(now.getFullYear(), now.getMonth(), 1)
                          .toISOString()
                          .slice(0, 10)
                      );
                      setExportEnd(now.toISOString().slice(0, 10));
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setExportStart(
                        new Date(now.getFullYear(), now.getMonth() - 1, 1)
                          .toISOString()
                          .slice(0, 10)
                      );
                      setExportEnd(
                        new Date(now.getFullYear(), now.getMonth(), 0)
                          .toISOString()
                          .slice(0, 10)
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    Last Month
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setExportStart(
                        new Date(now.getFullYear(), 0, 1)
                          .toISOString()
                          .slice(0, 10)
                      );
                      setExportEnd(now.toISOString().slice(0, 10));
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    Year 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const d = new Date(Date.now() - 90 * 86400000);
                      setExportStart(d.toISOString().slice(0, 10));
                      setExportEnd(now.toISOString().slice(0, 10));
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    Last 90 Days
                  </button>
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    From Date (Start)
                  </label>
                  <input
                    type="date"
                    value={exportStart}
                    onChange={(e) => setExportStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    To Date (End)
                  </label>
                  <input
                    type="date"
                    value={exportEnd}
                    onChange={(e) => setExportEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* What will be generated info box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Selected Period:</span>
                  <span className="font-extrabold text-sky-700">
                    {exportStart && exportEnd
                      ? `${exportStart} → ${exportEnd}`
                      : exportStart
                      ? `From ${exportStart} to Present`
                      : exportEnd
                      ? `Inception to ${exportEnd}`
                      : "Complete History (All Time)"}
                  </span>
                </div>
                <div className="space-y-1 text-[10.5px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Reconciled online SSLCommerz membership gateway payments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Itemized treasury vouchers (Donations & Disbursements)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Executive KPI summary & revenue/expenditure allocation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Statutory audit certification & three-party sign-off block</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isExportingPDF}
                  onClick={() => handleDownloadPDF(exportStart, exportEnd)}
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all shadow-md shadow-sky-600/20 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Download className={`w-4 h-4 ${isExportingPDF ? "animate-bounce" : ""}`} />
                  <span>
                    {isExportingPDF ? "Compiling PDF..." : "Download Official PDF"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
