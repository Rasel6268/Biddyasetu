"use client";

import { useState } from "react";
import { UserCheck, CheckCircle2, Eye, X } from "lucide-react";

export default function AdminApprovalsPage() {
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const [pendingMembers, setPendingMembers] = useState([
    {
      id: "BDS-PN-1044",
      name: "S.M. Nahid Hasan",
      batch: "2015",
      phone: "+880 1911-778899",
      email: "nahid.hasan@example.com",
      profession: "Civil Engineer",
      company: "Roads & Highways Dept.",
      joinedDate: "Yesterday",
    },
    {
      id: "BDS-PN-1045",
      name: "Kazi Nusrat Jahan",
      batch: "2018",
      phone: "+880 1622-334455",
      email: "nusrat.jahan@example.com",
      profession: "Research Associate",
      company: "BRAC Institute",
      joinedDate: "Today",
    },
    {
      id: "BDS-PN-1046",
      name: "Tariqul Islam Rifat",
      batch: "2020",
      phone: "+880 1300-112233",
      email: "rifat.islam@example.com",
      profession: "Software Engineer",
      company: "Optimizely BD",
      joinedDate: "Today",
    },
  ]);

  const handleApprove = (id) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id));
    triggerToast(`Member ${id} verified & granted Digital ID.`);
  };

  const handleApproveAll = () => {
    setPendingMembers([]);
    triggerToast("All pending registrations have been verified!");
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[130] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Verification Queue
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pending Member Approvals
          </h1>
        </div>

        {pendingMembers.length > 0 && (
          <button
            type="button"
            onClick={handleApproveAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve All ({pendingMembers.length})</span>
          </button>
        )}
      </div>

      {pendingMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-900 mb-1">Queue is Clear!</h3>
          <p className="text-xs text-slate-500">
            All registered alumni have been verified and assigned Member IDs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingMembers.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{m.name}</h4>
                    <span className="text-xs font-mono font-bold text-sky-700">
                      {m.id}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Pending Validation
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">School Batch:</span>
                  <span className="font-bold text-slate-900">
                    Class of {m.batch} (Adarsha High School)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono font-bold text-slate-900">{m.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span>{m.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Profession:</span>
                  <span className="font-medium text-slate-800">
                    {m.profession} ({m.company})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleApprove(m.id)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Assign ID
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPendingMembers((prev) => prev.filter((x) => x.id !== m.id));
                    triggerToast(`Member ${m.id} rejected.`);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
