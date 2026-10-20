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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Check,
  Send,
  Building,
  FileCheck2,
  ExternalLink,
  ShieldAlert,
  X,
  Sparkles,
} from "lucide-react";

interface VariantProps {
  user: UserProfile | null;
  currentTime: string;
  currentDate: string;
  records: AttendanceRecord[];
  onAttendanceSubmitted: () => void;
}

export function VariantB({
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

  // Wizard Step (1: Lokasi, 2: Form, 3: Konfirmasi)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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

  const handleNextToStep2 = () => {
    setErrorMessage(null);
    if (!coordinates) {
      setErrorMessage("Silakan aktifkan GPS atau tunggu sistem mendeteksi lokasi Anda.");
      return;
    }
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    setErrorMessage(null);
    if (mainStatus === "IZIN_DENGAN_KETERANGAN") {
      if (!permissionReason.trim()) {
        setErrorMessage("Harap isi alasan izin / sakit.");
        return;
      }
      if (!proofPreview) {
        setErrorMessage("Harap upload foto surat izin atasan atau surat keterangan dokter.");
        return;
      }
    }
    setCurrentStep(3);
  };

  const handleSubmitFinal = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!user || !coordinates) return;

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
              ? `Jadwal: ${checkInTime} - ${checkOutTime} WIB`
              : permissionReason,
        }
      );

      setSuccessMessage("Presensi magang berhasil dikirim dan tersimpan di sistem.");
      setCurrentStep(1);
      setPermissionReason("");
      removeFile();
      onAttendanceSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengirim data absensi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
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
        <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center justify-between">
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

      {/* Progressive Step Indicator */}
      <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${
              currentStep === 1
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : currentStep > 1
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 1
                  ? "bg-white text-blue-600"
                  : currentStep > 1
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[10px] uppercase font-bold block opacity-75">Tahap 1</span>
              <span className="text-xs font-bold truncate block">Lokasi GPS</span>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${
              currentStep === 2
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : currentStep > 2
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 2
                  ? "bg-white text-blue-600"
                  : currentStep > 2
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[10px] uppercase font-bold block opacity-75">Tahap 2</span>
              <span className="text-xs font-bold truncate block">Status & Bukti</span>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${
              currentStep === 3
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 3
                  ? "bg-white text-blue-600"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              3
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[10px] uppercase font-bold block opacity-75">Tahap 3</span>
              <span className="text-xs font-bold truncate block">Konfirmasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: VALIDASI LOKASI GPS */}
      {currentStep === 1 && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl p-6 space-y-6">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-3">
              <MapPin className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Langkah 1: Verifikasi Posisi GPS
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Sistem secara otomatis mendeteksi jarak Anda dengan Kantor 1 (PT. Asia Plastik) dan Kantor 2 (CV. Asia Plastik).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hasil Pemindaian Geofence
              </span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5 block">
                {isWithinGeofence
                  ? `✅ Berada di Area Kantor (${closestOffice?.name})`
                  : `⚠️ Di Luar Radius Kantor (${distanceMeters}m)`}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshLocation}
              disabled={gpsLoading}
              className="text-xs gap-1.5"
            >
              {gpsLoading ? "Mencari..." : "Segarkan GPS"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allOffices.map((office) => (
              <div
                key={office.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40"
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="truncate">{office.name}</span>
                  <span className="font-mono text-blue-600 dark:text-cyan-400">
                    {office.distanceMeters}m
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Maksimal radius {office.radiusMeters}m</span>
                  <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    Buka Peta ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => simulateOfficeLocation()}
              className="text-xs text-slate-500 border-dashed"
            >
              ⚡ Simulasi: Berada di Kantor
            </Button>
            <Button
              type="button"
              onClick={handleNextToStep2}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Lanjutkan ke Tahap Form Presensi <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: FORM ISIAN KEHADIRAN / IZIN */}
      {currentStep === 2 && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl p-6 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Langkah 2: Tentukan Status & Rincian
              </h2>
              <p className="text-xs text-slate-500">
                Pilih apakah Anda hadir di lokasi kerja atau mengajukan izin.
              </p>
            </div>
            <Badge variant="info" className="font-mono">
              {currentTime} WIB
            </Badge>
          </div>

          {/* Status Utama */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Status Presensi Anda
            </label>
            <select
              value={mainStatus}
              onChange={(e) => setMainStatus(e.target.value as MainAttendanceStatus)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="HADIR">✅ Hadir Bekerja di Kantor / Pabrik</option>
              <option value="IZIN_DENGAN_KETERANGAN">📝 Izin dengan Keterangan (Izin / Sakit)</option>
              <option value="IZIN_TANPA_KETERANGAN">⚠️ Izin tanpa Keterangan (Alpha)</option>
            </select>
          </div>

          {/* Conditional HADIR */}
          {mainStatus === "HADIR" && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-4">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                Input Jam Masuk & Jam Keluar Kantor
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Jam Masuk
                  </label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
                  />
                </div>
              </div>

              {!isWithinGeofence && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Peringatan: Posisi Anda berada <strong>{distanceMeters}m</strong> di luar area kantor.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Conditional IZIN DENGAN KETERANGAN */}
          {mainStatus === "IZIN_DENGAN_KETERANGAN" && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Pilih Alasan Izin
                </label>
                <select
                  value={permissionCategory}
                  onChange={(e) => setPermissionCategory(e.target.value as PermissionSubCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="IZIN">Izin Tertulis (Urusan Mendesak / Akademik)</option>
                  <option value="SAKIT">Sakit (Kondisi Kesehatan / Istirahat Medis)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Uraian Keterangan Alasan
                </label>
                <textarea
                  rows={3}
                  value={permissionReason}
                  onChange={(e) => setPermissionReason(e.target.value)}
                  placeholder="Jelaskan alasan izin / sakit secara sopan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Upload Foto Surat Izin Atasan / Dokter
                </label>
                {!proofPreview ? (
                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white/50 text-center">
                    <UploadCloud className="w-7 h-7 text-blue-600 mb-1.5" />
                    <span className="text-xs font-bold">Pilih Dokumen Foto Surat</span>
                    <span className="text-[10px] text-slate-500">Maks. 5MB</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <img src={proofPreview} alt="Bukti" className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-bold truncate block">{proofFile?.name}</span>
                      <span className="text-emerald-600 text-[11px] font-semibold">✓ Siap Dilampirkan</span>
                    </div>
                    <button type="button" onClick={removeFile} className="p-1.5 text-rose-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conditional IZIN TANPA KETERANGAN */}
          {mainStatus === "IZIN_TANPA_KETERANGAN" && (
            <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 text-xs text-rose-800 dark:text-rose-200">
              Absensi tanpa keterangan akan langsung diverifikasi sebagai catatan ketidakhadiran tanpa surat.
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
            <Button
              type="button"
              onClick={handleNextToStep3}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Cek Ringkasan <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: KONFIRMASI DAN KIRIM */}
      {currentStep === 3 && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl p-6 space-y-6">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Langkah 3: Konfirmasi & Kirim
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Periksa ringkasan data sebelum menyerahkan ke sistem presensi resmi.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Nama Peserta:</span>
              <span className="font-bold">{user?.displayName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Status Absensi:</span>
              <span className="font-bold">
                {mainStatus === "HADIR"
                  ? "Hadir di Kantor"
                  : mainStatus === "IZIN_DENGAN_KETERANGAN"
                  ? `Izin (${permissionCategory})`
                  : "Izin tanpa Keterangan"}
              </span>
            </div>
            {mainStatus === "HADIR" && (
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Jam Masuk / Keluar:</span>
                <span className="font-mono font-bold">
                  {checkInTime} - {checkOutTime} WIB
                </span>
              </div>
            )}
            {mainStatus === "IZIN_DENGAN_KETERANGAN" && (
              <>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Alasan:</span>
                  <span className="font-medium max-w-xs text-right truncate">{permissionReason}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Lampiran Bukti:</span>
                  <span className="font-bold text-emerald-600">✓ 1 Foto Terlampir</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Validasi Posisi:</span>
              <span className={`font-bold ${isWithinGeofence ? "text-emerald-600" : "text-amber-600"}`}>
                {isWithinGeofence ? "Di Dalam Radius Kantor" : `Di Luar Radius (${distanceMeters}m)`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(2)}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Ubah Data
            </Button>
            <Button
              type="button"
              onClick={handleSubmitFinal}
              disabled={submitting}
              className="px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Mengirim..." : "Kirim Absensi Sekarang"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
