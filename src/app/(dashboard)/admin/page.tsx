"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { attendanceService } from "@/services/attendanceService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttendanceRecord } from "@/types/attendance";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  Shield,
  Search,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    attendanceService
      .getAllRecentAttendance(100)
      .then((data) => {
        if (data && data.length > 0) {
          setRecords(data);
        } else {
          // Provide sample mock data for demonstration if Firestore is empty
          const sampleMock: AttendanceRecord[] = [
            {
              id: "rec-1",
              internId: "intern-1",
              internName: "Ahmad Fauzi",
              internStudentId: "2141720189",
              institution: "Institut Teknologi Sepuluh Nopember (ITS)",
              division: "Quality Control (QC)",
              type: "CHECK_IN",
              status: "PRESENT",
              timestamp: new Date(),
              formattedDate: new Date().toISOString().split("T")[0],
              formattedTime: "07:48:12",
              location: { latitude: -7.42431, longitude: 112.72141, accuracy: 4 },
              distanceFromOfficeMeters: 18,
              isWithinGeofence: true,
              notes: "Inspeksi injection molding line 1",
              createdAt: new Date().toISOString(),
            },
            {
              id: "rec-2",
              internId: "intern-2",
              internName: "Siti Rahmawati",
              internStudentId: "2021081023",
              institution: "Politeknik Elektronika Negeri Surabaya (PENS)",
              division: "Maintenance & Otomasi",
              type: "CHECK_IN",
              status: "PRESENT",
              timestamp: new Date(),
              formattedDate: new Date().toISOString().split("T")[0],
              formattedTime: "07:55:30",
              location: { latitude: -7.42435, longitude: 112.72144, accuracy: 6 },
              distanceFromOfficeMeters: 25,
              isWithinGeofence: true,
              notes: "Pengecekan sensor suhu chiller pabrik",
              createdAt: new Date().toISOString(),
            },
            {
              id: "rec-3",
              internId: "intern-3",
              internName: "Dimas Wicaksono",
              internStudentId: "1951502011",
              institution: "Universitas Brawijaya",
              division: "Produksi Blow Molding",
              type: "CHECK_IN",
              status: "LATE",
              timestamp: new Date(),
              formattedDate: new Date().toISOString().split("T")[0],
              formattedTime: "08:24:10",
              location: { latitude: -7.42439, longitude: 112.72148, accuracy: 5 },
              distanceFromOfficeMeters: 40,
              isWithinGeofence: true,
              notes: "Kendala lalu lintas di bundaran Waru",
              createdAt: new Date().toISOString(),
            },
          ];
          setRecords(sampleMock);
        }
      })
      .catch((e) => console.warn("Failed to load records for admin:", e));
  }, []);

  const filtered = records.filter((r) => {
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
            Monitoring Presensi Magang CV. Asia Plastik
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rekapitulasi kehadiran peserta magang dari MagangHub / SIAPkerja secara real-time.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Download className="w-3.5 h-3.5" />
          Ekspor Laporan (Excel / CSV)
        </Button>
      </div>

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
            <span className="text-3xl font-black text-slate-900 dark:text-white">{records.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">peserta tercatat</span>
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
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{presentCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">sebelum 08:15 WIB</span>
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
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{lateCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">perlu konfirmasi</span>
          </div>
        </Card>
      </div>

      {/* Filter and Table */}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    Tidak ditemukan data presensi yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{item.internName}</span>
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
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        {item.distanceFromOfficeMeters}m dari kantor
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
  );
}
