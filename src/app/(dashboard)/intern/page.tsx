"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { attendanceService } from "@/services/attendanceService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord } from "@/types/attendance";
import { formatIndonesianDate, formatIndonesianTime } from "@/lib/utils";
import {
  Clock,
  History,
  FileText,
  Building,
  UserCheck,
} from "lucide-react";

import { VariantA } from "@/components/intern/VariantA";
import { VariantB } from "@/components/intern/VariantB";
import { VariantC } from "@/components/intern/VariantC";
import {
  PrototypeSwitcher,
  PrototypeVariantInfo,
} from "@/components/shared/PrototypeSwitcher";

const PROTOTYPE_VARIANTS: PrototypeVariantInfo[] = [
  {
    key: "A",
    name: "Command Center (Split Panel)",
    description: "Panel terpisah form cerdas dinamis & radar GPS satelit kantor.",
  },
  {
    key: "B",
    name: "Progressive Stepper (Wizard)",
    description: "Alur bertahap 3 langkah: Lokasi GPS -> Form & Bukti -> Konfirmasi.",
  },
  {
    key: "C",
    name: "Executive Glassmorphism (Mobile-First)",
    description: "Kartu visual modern dengan Segmented Cards dan drag-and-drop lampiran.",
  },
];

function InternDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Read current variant from URL search param (?variant=A | B | C)
  const variantParam = (searchParams.get("variant") || "A").toUpperCase();
  const validVariantKeys = ["A", "B", "C"];
  const activeVariantKey = validVariantKeys.includes(variantParam) ? variantParam : "A";

  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatIndonesianTime(now));
      setCurrentDate(formatIndonesianDate(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch today's attendance records
  const loadRecords = () => {
    if (user?.uid) {
      attendanceService
        .getTodayAttendance(user.uid)
        .then((data) => setRecords(data))
        .catch((e) => console.warn("Notice loading intern records:", e));
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Variant Rendering */}
      {activeVariantKey === "A" && (
        <VariantA
          user={user}
          currentTime={currentTime}
          currentDate={currentDate}
          records={records}
          onAttendanceSubmitted={loadRecords}
        />
      )}

      {activeVariantKey === "B" && (
        <VariantB
          user={user}
          currentTime={currentTime}
          currentDate={currentDate}
          records={records}
          onAttendanceSubmitted={loadRecords}
        />
      )}

      {activeVariantKey === "C" && (
        <VariantC
          user={user}
          currentTime={currentTime}
          currentDate={currentDate}
          records={records}
          onAttendanceSubmitted={loadRecords}
        />
      )}

      {/* Shared: Today's Attendance Log History */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Riwayat Presensi Hari Ini
              </CardTitle>
            </div>
            <Badge variant="neutral" className="text-xs font-mono font-semibold">
              {records.length} Catatan
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Daftar presensi kehadiran dan izin yang telah masuk ke database CV. Asia Plastik.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {records.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Belum ada catatan presensi hari ini. Silakan isi dan kirim formulir di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        item.mainStatus === "HADIR"
                          ? "bg-blue-500/10 text-blue-600 dark:text-cyan-400"
                          : item.mainStatus === "IZIN_DENGAN_KETERANGAN"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {item.mainStatus === "HADIR" ? (
                        <UserCheck className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.mainStatus === "HADIR"
                            ? "Hadir di Kantor"
                            : item.mainStatus === "IZIN_DENGAN_KETERANGAN"
                            ? `Izin (${item.permissionSubCategory || "Izin Tertulis"})`
                            : "Izin Tanpa Keterangan"}
                        </span>
                        <Badge
                          variant={
                            item.mainStatus === "HADIR"
                              ? "success"
                              : item.mainStatus === "IZIN_DENGAN_KETERANGAN"
                              ? "warning"
                              : "danger"
                          }
                          className="text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                        Pukul {item.formattedTime} WIB • Posisi: {item.distanceFromOfficeMeters}m dari{" "}
                        {item.officeName || "Kantor"}
                      </span>

                      {item.checkInTime && item.checkOutTime && (
                        <span className="text-[11px] font-mono text-blue-600 dark:text-cyan-400 block mt-0.5">
                          Jadwal Jam Kerja: {item.checkInTime} - {item.checkOutTime} WIB
                        </span>
                      )}

                      {item.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1.5 p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {item.permissionProofUrl && (
                    <div className="sm:self-center shrink-0">
                      <a
                        href={item.permissionProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        Lihat Foto Bukti ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Prototype Switcher */}
      <PrototypeSwitcher
        variants={PROTOTYPE_VARIANTS}
        currentVariant={activeVariantKey}
      />
    </div>
  );
}

export default function InternDashboard() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          Memuat Antarmuka Presensi Magang...
        </div>
      }
    >
      <InternDashboardContent />
    </Suspense>
  );
}
