"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { attendanceService } from "@/services/attendanceService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttendanceRecord } from "@/types/attendance";
import { PendingRegistration } from "@/types/approval";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  Shield,
  Search,
  UserCheck,
  UserX,
  Clock,
  Sparkles,
  Building2,
  Mail,
  Calendar,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<"attendance" | "approvals">("attendance");

  // Attendance Log State
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Registration & Approval State
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<
    "ALL" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
  >("ALL");
  const [approvalSearch, setApprovalSearch] = useState("");
  const [actionNotification, setActionNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load Attendance Records
  useEffect(() => {
    attendanceService
      .getAllRecentAttendance(100)
      .then((data) => {
        setRecords(data || []);
      })
      .catch((e) => {
        console.warn("Failed to load records for admin:", e);
        setRecords([]);
      });
  }, []);

  // Load Registrations for Approval Queue
  const fetchRegistrations = () => {
    setLoadingRegistrations(true);
    fetch("/api/admin/approval")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setRegistrations(json.data);
        }
      })
      .catch((err) => console.warn("Failed to fetch approvals:", err))
      .finally(() => setLoadingRegistrations(false));
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Handle HRD Approval Action (ACC or Tolak)
  const handleApprovalAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(id);
    setActionNotification(null);

    try {
      const res = await fetch("/api/admin/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action,
          approvedBy: user?.displayName || "HR Supervisor CV. Asia Plastik",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memproses permohonan.");
      }

      // Optimistic state update
      setRegistrations((prev) =>
        prev.map((item) =>
          item.id.toLowerCase() === id.toLowerCase()
            ? { ...item, status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
            : item
        )
      );

      setActionNotification({
        type: "success",
        text: json.message || "Tindakan berhasil diproses.",
      });
    } catch (err: any) {
      setActionNotification({
        type: "error",
        text: err.message || "Terjadi kesalahan saat memproses aksi.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered attendance records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.institution && r.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.division && r.division.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterType === "ALL") return matchesSearch;
    if (filterType === "PRESENT") return matchesSearch && r.status === "PRESENT";
    if (filterType === "LATE") return matchesSearch && r.status === "LATE";
    return matchesSearch;
  });

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;

  // Filtered registrations
  const pendingApprovalsCount = registrations.filter(
    (r) => r.status === "PENDING_APPROVAL"
  ).length;
  const approvedCount = registrations.filter((r) => r.status === "APPROVED").length;

  const filteredRegistrations = registrations.filter((r) => {
    const matches =
      r.fullName.toLowerCase().includes(approvalSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(approvalSearch.toLowerCase()) ||
      (r.institution && r.institution.toLowerCase().includes(approvalSearch.toLowerCase()));

    if (approvalFilter === "ALL") return matches;
    return matches && r.status === approvalFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="gap-1.5 uppercase font-bold text-[10px]">
              <Shield className="w-3.5 h-3.5" />
              Supervisor & HR Portal
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Dasbor HRD CV. Asia Plastik
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pusat manajemen presensi real-time dan verifikasi persetujuan akun magang industri.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "attendance" ? (
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Download className="w-3.5 h-3.5" />
              Ekspor Laporan Presensi
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRegistrations}
              disabled={loadingRegistrations}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRegistrations ? "animate-spin" : ""}`} />
              Segarkan Antrean
            </Button>
          )}
        </div>
      </div>

      {/* Modern High-Contrast Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("attendance")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "attendance"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <Users className="w-4 h-4" />
          Riwayat Presensi Magang
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("approvals")}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "approvals"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Persetujuan Akun Magang (ACC)
          {pendingApprovalsCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 animate-pulse">
              {pendingApprovalsCount}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ATTENDANCE MONITORING                                   */}
      {/* ============================================================== */}
      {activeTab === "attendance" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Kehadiran Hari Ini
                </span>
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {records.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  peserta tercatat
                </span>
              </div>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tepat Waktu (On Time)
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {presentCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  sebelum 08:15 WIB
                </span>
              </div>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Terlambat
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {lateCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  perlu konfirmasi
                </span>
              </div>
            </Card>
          </div>

          {/* Table Container */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Daftar Log Kehadiran Pabrik
                </CardTitle>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, kampus, divisi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setFilterType("ALL")}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        filterType === "ALL"
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("PRESENT")}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        filterType === "PRESENT"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      Tepat Waktu
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("LATE")}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        filterType === "LATE"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      Terlambat
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Nama Peserta / NIM</th>
                    <th className="py-3 px-4">Institusi / Kampus</th>
                    <th className="py-3 px-4">Divisi Penempatan</th>
                    <th className="py-3 px-4">Jam Absensi</th>
                    <th className="py-3 px-4">Validasi GPS</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500">
                        Tidak ditemukan data presensi yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {item.internName}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            NIM: {item.internStudentId || "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {item.institution || "-"}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {item.division || "Umum"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                          {item.formattedTime} WIB
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate max-w-[160px]" title={item.officeName || "CV. Asia Plastik"}>
                            {item.distanceFromOfficeMeters}m ({item.officeName || "Kantor"})
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                            ±{item.location.accuracy ? Math.round(item.location.accuracy) : 0}m GPS
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={item.status === "PRESENT" ? "success" : "warning"}
                            className="text-[10px]"
                          >
                            {item.status === "PRESENT" ? "Tepat Waktu" : "Terlambat"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: HRD APPROVAL QUEUE (ACC AKUN MAGANG)                    */}
      {/* ============================================================== */}
      {activeTab === "approvals" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Notification Alert */}
          {actionNotification && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold backdrop-blur-md animate-in fade-in ${
                actionNotification.type === "success"
                  ? "bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-500/15 border-2 border-rose-500/40 text-rose-800 dark:text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {actionNotification.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <span>{actionNotification.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionNotification(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* KPI Approvals Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Pendaftar
                </span>
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {registrations.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  orang tercatat
                </span>
              </div>
            </Card>

            <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  Menunggu Persetujuan (ACC)
                </span>
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {pendingApprovalsCount}
                </span>
                <span className="text-xs text-amber-700/80 dark:text-amber-400/80 font-medium">
                  perlu diverifikasi
                </span>
              </div>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Akun Telah Di-ACC
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {approvedCount}
                </span>
                <span className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-medium">
                  aktif presensi
                </span>
              </div>
            </Card>
          </div>

          {/* Table Container for HRD Approvals */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Antrean Permohonan Akun Magang Baru
                  </CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Peserta yang telah memverifikasi kode OTP email dan menunggu ACC HRD untuk mulai presensi.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, email, kampus..."
                      value={approvalSearch}
                      onChange={(e) => setApprovalSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setApprovalFilter("ALL")}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        approvalFilter === "ALL"
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => setApprovalFilter("PENDING_APPROVAL")}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        approvalFilter === "PENDING_APPROVAL"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      Menunggu ACC
                    </button>
                    <button
                      type="button"
                      onClick={() => setApprovalFilter("APPROVED")}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                        approvalFilter === "APPROVED"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      Disetujui
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Nama Lengkap & Email</th>
                    <th className="py-3 px-4">Asal Sekolah / Kampus</th>
                    <th className="py-3 px-4">Waktu Pendaftaran</th>
                    <th className="py-3 px-4">Status Akun</th>
                    <th className="py-3 px-4 text-right">Tindakan HRD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                        {loadingRegistrations
                          ? "Memuat data pendaftar..."
                          : "Tidak ada permohonan pendaftaran yang sesuai dengan filter."}
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((item) => {
                      const isPending = item.status === "PENDING_APPROVAL";
                      const isApproved = item.status === "APPROVED";
                      const isRejected = item.status === "REJECTED";
                      const isProcessing = processingId === item.id;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 dark:text-white block text-sm">
                              {item.fullName}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {item.email}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                              <span>{item.institution || "-"}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>
                                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                              {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              WIB
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {isPending && (
                              <Badge
                                variant="warning"
                                className="text-[10px] gap-1 bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold"
                              >
                                <Clock className="w-3 h-3" />
                                Menunggu ACC
                              </Badge>
                            )}
                            {isApproved && (
                              <Badge
                                variant="success"
                                className="text-[10px] gap-1 bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Disetujui (Aktif)
                              </Badge>
                            )}
                            {isRejected && (
                              <Badge
                                variant="danger"
                                className="text-[10px] gap-1 bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold"
                              >
                                <X className="w-3 h-3" />
                                Ditolak
                              </Badge>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprovalAction(item.id, "APPROVE")}
                                  disabled={isProcessing}
                                  className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-500/30 rounded-lg gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  ACC Akun
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprovalAction(item.id, "REJECT")}
                                  disabled={isProcessing}
                                  className="h-8 px-2.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-300 dark:border-rose-900/60 rounded-lg gap-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Tolak
                                </Button>
                              </div>
                            ) : isApproved ? (
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Sudah Di-ACC
                              </span>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                                  Ditolak
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprovalAction(item.id, "APPROVE")}
                                  disabled={isProcessing}
                                  className="h-7 px-2 text-[10px] font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md"
                                >
                                  ACC Ulang
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
