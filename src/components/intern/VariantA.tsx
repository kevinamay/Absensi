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
  FileText,
  Send,
  Navigation,
  ExternalLink,
  ShieldAlert,
  X,
  Sparkles,
  Calendar,
  Building2,
} from "lucide-react";

interface VariantProps {
  user: UserProfile | null;
  currentTime: string;
  currentDate: string;
  records: AttendanceRecord[];
  onAttendanceSubmitted: () => void;
}

export function VariantA({
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

    if (!user) {
      setErrorMessage("Sesi pengguna tidak valid.");
      return;
    }

    if (!coordinates) {
      setErrorMessage("Koordinat GPS belum terdeteksi. Silakan aktifkan GPS atau klik Perbarui Lokasi.");
      return;
    }

    // Validation for Hadir: Geofence warning & acknowledgement
    if (mainStatus === "HADIR" && !isWithinGeofence) {
      // Allow submission with clear note or prompt, but show prominent notice
    }

    // Validation for Izin dengan Keterangan
    if (mainStatus === "IZIN_DENGAN_KETERANGAN") {
      if (!permissionReason.trim()) {
        setErrorMessage("Mohon cantumkan alasan / keterangan izin atau sakit.");
        return;
      }
      if (!proofPreview) {
        setErrorMessage("Mohon unggah foto surat izin dari atasan atau surat keterangan dokter.");
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
                ? "Izin tanpa keterangan tertulis"
                : undefined,
          permissionProofUrl: proofPreview || undefined,
          notes:
            mainStatus === "HADIR"
              ? `Masuk: ${checkInTime} WIB | Pulang: ${checkOutTime} WIB`
              : permissionReason,
        }
      );

      setSuccessMessage(
        mainStatus === "HADIR"
          ? "Presensi kehadiran berhasil dikirim! Selamat bekerja dan belajar."
          : mainStatus === "IZIN_DENGAN_KETERANGAN"
            ? `Permohonan ${permissionCategory === "SAKIT" ? "sakit" : "izin"} berhasil diserahkan ke HRD.`
            : "Presensi izin tanpa keterangan telah dicatat ke sistem."
      );

      // Reset form
      setPermissionReason("");
      removeFile();
      onAttendanceSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengirim data absensi. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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

      {/* Main Split Grid: Left Form, Right GPS Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Presensi Interaktif */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-xl">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="warning" className="gap-1.5 uppercase font-bold text-[10px] mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Portal Presensi Mandiri
                  </Badge>
                  <CardTitle className="text-xl font-black text-slate-900 dark:text-white">
                    Formulir Absensi Peserta Magang
                  </CardTitle>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 block">
                    {currentTime || "--:--:--"} WIB
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentDate}
                  </span>
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pilih status kehadiran Anda hari ini dan lengkapi rincian jam kerja atau berkas izin yang diperlukan.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Dropdown Status Utama */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Status Kehadiran Hari Ini <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={mainStatus}
                    onChange={(e) => setMainStatus(e.target.value as MainAttendanceStatus)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer shadow-xs"
                  >
                    <option value="HADIR">✅ Hadir di Kantor / Pabrik</option>
                    <option value="IZIN_DENGAN_KETERANGAN">
                      📝 Izin dengan Keterangan (Izin / Sakit)
                    </option>
                    <option value="IZIN_TANPA_KETERANGAN">
                      ⚠️ Izin tanpa Keterangan (Alpha / Tidak Hadir)
                    </option>
                  </select>
                </div>

                {/* 2. Kondisi HADIR: Input Jam Masuk & Jam Keluar */}
                {mainStatus === "HADIR" && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      Jadwal Jam Masuk & Keluar Kantor
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Jam Masuk Kantor
                        </label>
                        <input
                          type="time"
                          value={checkInTime}
                          onChange={(e) => setCheckInTime(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Jam Keluar Kantor
                        </label>
                        <input
                          type="time"
                          value={checkOutTime}
                          onChange={(e) => setCheckOutTime(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    {/* Geofence Warning for Hadir */}
                    {!isWithinGeofence && (
                      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold block">Peringatan Lokasi GPS:</strong>
                          <span>
                            Anda terdeteksi berada <strong>{distanceMeters}m</strong> dari{" "}
                            {closestOffice?.name || "area kantor"} (radius aman: {allowedRadiusMeters}m). Pastikan Anda telah tiba di lingkungan CV. Asia Plastik sebelum mengirim absensi hadir.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Kondisi IZIN DENGAN KETERANGAN: Dropdown Izin/Sakit, Isian & Upload Bukti */}
                {mainStatus === "IZIN_DENGAN_KETERANGAN" && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Kategori Izin Lanjutan <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={permissionCategory}
                        onChange={(e) =>
                          setPermissionCategory(e.target.value as PermissionSubCategory)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option value="IZIN">Izin (Keperluan Pribadi / Keluarga / Kampus)</option>
                        <option value="SAKIT">Sakit (Kondisi Medis / Istirahat)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Keterangan / Alasan Rinci <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={permissionReason}
                        onChange={(e) => setPermissionReason(e.target.value)}
                        placeholder={
                          permissionCategory === "SAKIT"
                            ? "Contoh: Demam tinggi dan radang tenggorokan, dianjurkan istirahat dokter selama 1 hari."
                            : "Contoh: Menghadiri yudisium kampus atau keperluan keluarga mendesak."
                        }
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Upload Bukti Izin (Foto Surat Izin Atasan / Dokter) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Upload Bukti Izin (Foto Surat Izin Atasan / Surat Dokter){" "}
                        <span className="text-rose-500">*</span>
                      </label>

                      {!proofPreview ? (
                        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-400 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-white/70 dark:bg-slate-800/50 hover:bg-blue-50/30 transition-all text-center">
                          <UploadCloud className="w-8 h-8 text-blue-600 dark:text-cyan-400 mb-2" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Pilih atau Ambil Foto Surat Izin
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            Format JPG, PNG, atau WEBP (Maksimal 5MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950/10 dark:bg-slate-900 p-2.5 flex items-center gap-3">
                          <img
                            src={proofPreview}
                            alt="Bukti Izin"
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {proofFile?.name || "foto-surat-izin.jpg"}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {proofFile ? `${(proofFile.size / 1024).toFixed(1)} KB` : "Lampiran siap kirim"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                              <CheckCircle className="w-3 h-3" /> Berkas terlampir
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all"
                            title="Hapus foto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Kondisi IZIN TANPA KETERANGAN */}
                {mainStatus === "IZIN_TANPA_KETERANGAN" && (
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 space-y-1 animate-in fade-in duration-200">
                    <strong className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      Pemberitahuan Izin Tanpa Keterangan:
                    </strong>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                      Anda memilih tidak hadir tanpa menyertakan surat izin resmi. Data absensi Anda akan otomatis tercatat sebagai <strong>Alpha / Tanpa Keterangan</strong> pada rekap evaluasi bulanan HRD.
                    </p>
                  </div>
                )}

                {/* Tombol Kirim Absensi */}
                <Button
                  type="submit"
                  disabled={submitting || gpsLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Memproses dan Mengirim..." : "Kirim Absensi Sekarang"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Visual Radar & Lokasi GPS Kantor */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-cyan-400">
                    <Navigation className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                      Radar Geofencing GPS
                    </CardTitle>
                    <CardDescription className="text-[11px] text-slate-500">
                      Radius Validasi Presensi: {allowedRadiusMeters}m
                    </CardDescription>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={refreshLocation}
                  disabled={gpsLoading}
                  className="h-8 px-2.5 text-[11px] gap-1 rounded-lg"
                >
                  <MapPin className="w-3 h-3 text-blue-600" />
                  {gpsLoading ? "..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Radar Status Badge */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Status Jangkauan Pabrik
                  </span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                    {isWithinGeofence ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Terhubung di Area Kantor
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Di Luar Jangkauan ({distanceMeters}m)
                      </>
                    )}
                  </span>
                </div>
                <Badge
                  variant={isWithinGeofence ? "success" : "warning"}
                  className="text-[11px] font-mono font-bold"
                >
                  {isWithinGeofence ? "Valid" : "Di Luar"}
                </Badge>
              </div>

              {/* Coordinates Ticker */}
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>LAT / LNG KOORDINAT</span>
                  <span>AKURASI: ±{coordinates ? Math.round(coordinates.accuracy) : 0}m</span>
                </div>
                <div className="truncate text-cyan-400 font-bold">
                  {coordinates ? `${coordinates.latitude}, ${coordinates.longitude}` : "Mencari GPS..."}
                </div>
              </div>

              {/* Office List Cards */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                  Pusat Kantor CV. Asia Plastik:
                </span>
                {allOffices.map((office) => (
                  <div
                    key={office.id}
                    className={`p-3 rounded-xl border transition-all ${office.isWithinGeofence
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                        <span className="text-xs font-bold truncate">{office.name}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold shrink-0">
                        {office.distanceMeters >= 1000
                          ? `${(office.distanceMeters / 1000).toFixed(1)} km`
                          : `${office.distanceMeters} m`}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-[10px] text-slate-500">Maksimal radius {office.radiusMeters}m</span>
                      <a
                        href={office.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1 text-[10px]"
                      >
                        Buka Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulation for local test */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => simulateOfficeLocation()}
                  className="w-full text-xs font-medium py-2 rounded-xl text-slate-600 dark:text-slate-300 border-dashed"
                >
                  📍 Simulasi: Masuk Radius Kantor 2 (Uji Coba Cepat)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
