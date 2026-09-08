"use client";

import { useState } from "react";
import { GraduationCap, Plus, CheckCircle2, X } from "lucide-react";

export default function AdminScholarshipsPage() {
  const [toastMsg, setToastMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newForm, setNewForm] = useState({
    studentName: "",
    classGrade: "Class 10 (Science)",
    schoolRoll: "",
    guardian: "",
    monthlyAid: 2000,
    gpa: "5.00",
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const [scholarships, setScholarships] = useState([
    {
      id: "SCH-2026-001",
      studentName: "Mohammad Saiful Islam",
      classGrade: "Class 10 (Science)",
      schoolRoll: "03",
      guardian: "Abdur Rahim (Farmer)",
      monthlyAid: 2500,
      fundedBy: "Batch 2006 Welfare Pool",
      gpa: "5.00",
      status: "Active Disbursing",
    },
    {
      id: "SCH-2026-002",
      studentName: "Rifat Sultana Mim",
      classGrade: "Class 9 (General)",
      schoolRoll: "01",
      guardian: "Fatema Begum (Single Mother)",
      monthlyAid: 2000,
      fundedBy: "Life Member Trust Fund",
      gpa: "4.85",
      status: "Active Disbursing",
    },
    {
      id: "SCH-2026-003",
      studentName: "Shakil Hossain",
      classGrade: "Class 8",
      schoolRoll: "07",
      guardian: "Habibur Rahman (Day Laborer)",
      monthlyAid: 1500,
      fundedBy: "Batch 1998 Education Aid",
      gpa: "4.60",
      status: "Active Disbursing",
    },
  ]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newForm.studentName || !newForm.guardian) return;

    const newS = {
      id: `SCH-2026-00${scholarships.length + 1}`,
      studentName: newForm.studentName,
      classGrade: newForm.classGrade,
      schoolRoll: newForm.schoolRoll || "10",
      guardian: newForm.guardian,
      monthlyAid: parseInt(newForm.monthlyAid, 10) || 2000,
      fundedBy: "General Welfare Fund",
      gpa: newForm.gpa,
      status: "Active Disbursing",
    };

    setScholarships([newS, ...scholarships]);
    setShowModal(false);
    triggerToast(`Scholarship granted to ${newS.studentName}.`);
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
            Student Aid
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Scholarship Welfare
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Beneficiary Student</span>
        </button>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scholarships.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 font-black text-sm flex items-center justify-center">
                  {s.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">{s.studentName}</h4>
                  <span className="text-xs font-bold text-purple-700">
                    {s.classGrade} · Roll #{s.schoolRoll}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {s.status}
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Stipend:</span>
                <span className="font-black text-emerald-700">
                  ৳{s.monthlyAid.toLocaleString()} / month
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Guardian:</span>
                <span className="font-medium text-slate-900">{s.guardian}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Academic Standing:</span>
                <span className="font-bold text-purple-900">GPA {s.gpa}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Funded By:</span>
                <span className="font-semibold text-slate-700">{s.fundedBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 font-mono text-[11px]">{s.id}</span>
              <button
                type="button"
                onClick={() =>
                  triggerToast(`Disbursement voucher generated for ${s.studentName}.`)
                }
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Disburse Aid
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Enroll Scholarship Recipient
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Add a student of Adarsha High School to monthly welfare aid.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.studentName}
                  onChange={(e) => setNewForm({ ...newForm, studentName: e.target.value })}
                  placeholder="e.g. Nusrat Jahan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Class / Grade
                  </label>
                  <input
                    type="text"
                    value={newForm.classGrade}
                    onChange={(e) => setNewForm({ ...newForm, classGrade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Monthly Stipend (BDT)
                  </label>
                  <input
                    type="number"
                    value={newForm.monthlyAid}
                    onChange={(e) => setNewForm({ ...newForm, monthlyAid: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Guardian Name & Occupation *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.guardian}
                  onChange={(e) => setNewForm({ ...newForm, guardian: e.target.value })}
                  placeholder="e.g. Abdul Gafur (Rickshaw Puller)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Enroll & Approve Scholarship
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
