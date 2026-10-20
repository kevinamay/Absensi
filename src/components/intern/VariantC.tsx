"use client";

import React, { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { attendanceService } from "@/services/attendanceService";
import { UserProfile } from "@/types/auth";
import {
  AttendanceRecord,
  MainAttendanceStatus,
  PermissionSubCategory,
} from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  FileText,
  Send,
  Navigation,
  ExternalLink,
  ShieldAlert,
  X,
  UserCheck,
  FileQuestion,
  Sparkles,
  Camera,
  Activity,
} from "lucide-react";

interface VariantProps {
  user: UserProfile | null;
  currentTime: string;
  currentDate: string;
  records: AttendanceRecord[];
  onAttendanceSubmitted: () => void;
}

export function VariantC({
  user,
  currentTime,
  currentDate,
  records,
  onAttendanceSubmitted,
}: VariantProps) {
  const {
    coordinates,
    distanceMeters,
    allowedRadiusMeters,
    isWithinGeofence,
    closestOffice,
    allOffices,
    loading: gpsLoading,
    refreshLocation,
    simulateOfficeLocation,
  } = useGeolocation();

  // Form State
  const [mainStatus, setMainStatus] = useState<MainAttendanceStatus>("HADIR");
  const [permissionCategory, setPermissionCategory] =
    useState<PermissionSubCategory>("IZIN");
  const [checkInTime, setCheckInTime] = useState<string>("07:30");
  const [checkOutTime, setCheckOutTime] = useState<string>("16:30");
  const [permissionReason, setPermissionReason] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 5MB.");
        return;
      }
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!user || !coordinates) {
      setErrorMessage("Koordinat GPS belum siap. Harap tunggu sebentar.");
      return;
    }

    if (mainStatus === "IZIN_DENGAN_KETERANGAN") {
      if (!permissionReason.trim()) {
        setErrorMessage("Mohon lengkapi alasan izin.");
        return;
      }
      if (!proofPreview) {
        setErrorMessage("Mohon lampirkan foto surat izin atau surat keterangan dokter.");
        return;
      }
    }

    setSubmitting(true);
    try {
      await attendanceService.submitAttendance(
        {
          uid: user.uid,
          displayName: user.displayName,
          studentId: user.studentId,
          institution: user.institution,
          division: user.division,
        },
        {
          type: "CHECK_IN",
          coordinates,
          distanceFromOfficeMeters: distanceMeters || 0,
          isWithinGeofence,
          officeName: closestOffice?.name || "CV. Asia Plastik",
          officeId: closestOffice?.id || "kantor-2",
          mainStatus,
          permissionSubCategory:
            mainStatus === "IZIN_DENGAN_KETERANGAN" ? permissionCategory : undefined,
          checkInTime: mainStatus === "HADIR" ? checkInTime : undefined,
          checkOutTime: mainStatus === "HADIR" ? checkOutTime : undefined,
          permissionReason:
            mainStatus === "IZIN_DENGAN_KETERANGAN"
              ? permissionReason
              : mainStatus === "IZIN_TANPA_KETERANGAN"
              ? "Tanpa keterangan"
              : undefined,
          permissionProofUrl: proofPreview || undefined,
          notes:
            mainStatus === "HADIR"
              ? `Masuk: ${checkInTime} WIB | Pulang: ${checkOutTime} WIB`
              : permissionReason,
        }
      );

      setSuccessMessage("Absensi Anda telah terkirim dan tercatat di database HRD!");
      setPermissionReason("");
      removeFile();
      onAttendanceSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengirim absensi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Alert Notifications */}
      {successMessage && (
        <div className="p-4 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-3xl bg-rose-500/15 border-2 border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Terminal Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-gradient-to-b from-white/95 via-white/90 to-slate-50/90 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ticker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Konsol Kehadiran Mandiri
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Presensi Siswa Magang
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.displayName} • {user?.division || "Divisi Magang"}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between">
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {currentTime} <span className="text-xs font-normal text-slate-400">WIB</span>
            </div>
            <span className="text-[11px] text-slate-500">{currentDate}</span>
          </div>
        </div>

        {/* GPS Live Geofencing Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-spin-slow" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Posisi GPS Geofence:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isWithinGeofence ? "success" : "warning"}
                className="text-[10px] font-bold py-0.5"
              >
                {isWithinGeofence ? "Dalam Radius Kantor" : "Di Luar Kantor"}
              </Badge>
              <button
                type="button"
                onClick={refreshLocation}
                disabled={gpsLoading}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                {gpsLoading ? "..." : "Perbarui"}
              </button>
            </div>
          </div>

          {/* Warning Banner if outside geofence */}
          {!isWithinGeofence && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Peringatan: Posisi Anda berjarak <strong>{distanceMeters}m</strong> dari{" "}
                {closestOffice?.name || "kantor"}. Presensi hadir dianjurkan dilakukan di area kantor.
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
            <span>Kantor Terdekat: {closestOffice?.name || "CV. Asia Plastik"}</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              Jarak: {distanceMeters}m / {allowedRadiusMeters}m
            </span>
          </div>
        </div>

        {/* Presensi Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Segmented Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              Pilih Status Kehadiran Hari Ini:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Card Hadir */}
              <button
                type="button"
                onClick={() => setMainStatus("HADIR")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mainStatus === "HADIR"
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 scale-102 ring-2 ring-blue-400"
                    : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <UserCheck className="w-5 h-5" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                    Opsi 1
                  </span>
                </div>
                <div className="font-black text-sm">Hadir</div>
                <div className="text-[10px] opacity-80 mt-0.5">Bekerja di pabrik</div>
              </button>

              {/* Card Izin dengan Keterangan */}
              <button
                type="button"
                onClick={() => setMainStatus("IZIN_DENGAN_KETERANGAN")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mainStatus === "IZIN_DENGAN_KETERANGAN"
                    ? "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/30 scale-102 ring-2 ring-amber-400"
                    : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                    Opsi 2
                  </span>
                </div>
                <div className="font-black text-sm">Izin / Sakit</div>
                <div className="text-[10px] opacity-80 mt-0.5">Dengan bukti surat</div>
              </button>

              {/* Card Izin tanpa Keterangan */}
              <button
                type="button"
                onClick={() => setMainStatus("IZIN_TANPA_KETERANGAN")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  mainStatus === "IZIN_TANPA_KETERANGAN"
                    ? "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30 scale-102 ring-2 ring-rose-400"
                    : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <FileQuestion className="w-5 h-5" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                    Opsi 3
                  </span>
                </div>
                <div className="font-black text-sm">Tanpa Surat</div>
                <div className="text-[10px] opacity-80 mt-0.5">Izin tanpa berkas</div>
              </button>
            </div>
          </div>

          {/* Condition 1: HADIR */}
          {mainStatus === "HADIR" && (
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-4 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                Jam Kerja Hari Ini
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Jam Masuk
                  </label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Jam Keluar
                  </label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Condition 2: IZIN DENGAN KETERANGAN */}
          {mainStatus === "IZIN_DENGAN_KETERANGAN" && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Kategori Permohonan Izin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPermissionCategory("IZIN")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      permissionCategory === "IZIN"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Izin (Keperluan Khusus)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionCategory("SAKIT")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      permissionCategory === "SAKIT"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Sakit (Kesehatan)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Uraian Alasan / Diagnosa
                </label>
                <textarea
                  rows={3}
                  value={permissionReason}
                  onChange={(e) => setPermissionReason(e.target.value)}
                  placeholder="Ketik rincian alasan izin Anda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Bukti Foto Surat Izin Atasan / Dokter
                </label>
                {!proofPreview ? (
                  <label className="border-2 border-dashed border-amber-300 dark:border-amber-800 hover:border-amber-500 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-white/70 dark:bg-slate-800/50 text-center">
                    <Camera className="w-8 h-8 text-amber-600 mb-2" />
                    <span className="text-xs font-bold">Ambil Foto / Pilih Berkas</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Format JPG/PNG hingga 5MB</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800">
                    <img src={proofPreview} alt="Bukti" className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-bold truncate block">{proofFile?.name}</span>
                      <span className="text-emerald-600 text-[11px] font-semibold">✓ Dokumen Terpasang</span>
                    </div>
                    <button type="button" onClick={removeFile} className="p-2 text-rose-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Condition 3: IZIN TANPA KETERANGAN */}
          {mainStatus === "IZIN_TANPA_KETERANGAN" && (
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
              Permohonan akan langsung dikirim tanpa syarat dokumen lampiran.
            </div>
          )}

          {/* Simulation Helper */}
          <div className="flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => simulateOfficeLocation()}
              className="text-[11px] text-slate-500 hover:text-blue-600 underline cursor-pointer"
            >
              Uji Coba: Simulasi Masuk Radius Kantor
            </button>
          </div>

          {/* Submit Action Button */}
          <Button
            type="submit"
            disabled={submitting || gpsLoading}
            className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Mengirim Data Presensi..." : "Kirim Absensi Sekarang"}
          </Button>
        </form>
      </div>
    </div>
  );
}
