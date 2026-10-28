# Sistem Presensi & Portal HRD Magang Industri - CV. Asia Plastik

Sistem terpadu presensi dan manajemen magang industri CV. Asia Plastik dengan arsitektur multi-project (monorepo). Terdiri dari 2 aplikasi yang terpisah namun berada dalam 1 repositori dan terhubung ke database Firebase yang sama:

1. **Aplikasi Presensi Anak Magang (Root Project - Web):**
   - Pendaftaran peserta magang & verifikasi kode OTP email.
   - Presensi check-in harian dengan validasi radius geofence lokasi pabrik CV. Asia Plastik & PT. Asia Plastik.
   - Riwayat kehadiran dan rekap log harian peserta.
   - **Deploy Vercel:** Root Directory = `./` (misal: `https://absensi-eta-seven.vercel.app`)

2. **Portal HRD & Supervisor (`hrd/` - Web):**
   - Login khusus personalia & pembimbing industri.
   - Antrean persetujuan pendaftar baru (ACC Akun Magang).
   - Monitoring log kehadiran magang realtime & filter status.
   - Ekspor laporan presensi untuk arsip HR.
   - **Deploy Vercel:** Root Directory = `hrd` (misal: `https://hrd-asiaplastik.vercel.app`)

3. **Aplikasi Mobile Flutter (`mobile/` - Android / iOS / Desktop):**
   - Versi native mobile aplikasi presensi dan portal magang CV. Asia Plastik.
   - Desain UI Soft Azure Horizon (Varian A) dengan palet langit pastel.
   - Validasi radius geofence lokasi pabrik secara realtime via Haversine.
   - Simulator koordinat GPS untuk testing di dalam dan di luar area pabrik.
   - Mode ganda: Peserta Magang & Supervisor HRD dalam 1 aplikasi.

---

## 📁 Struktur Proyek (Monorepo)

```text
Absensi/
├── src/                     # Source code Aplikasi Presensi Anak Magang (Web)
│   ├── app/                 # Next.js App Router (Anak Magang)
│   ├── components/          # Komponen UI & Presensi Magang
│   └── services/            # Integrasi Firebase & Geolocation
├── hrd/                     # Source code PORTAL HRD & SUPERVISOR (Web)
│   ├── src/app/             # Next.js App Router (HRD: /login, /dashboard)
│   ├── package.json         # Dependensi independen HRD
│   ├── README.md            # Panduan deploy Vercel khusus HRD
│   └── .env.example         # Template konfigurasi environment HRD
├── mobile/                  # Source code APLIKASI FLUTTER (Android / iOS / Mobile)
│   ├── lib/
│   │   ├── config/          # AppTheme (Soft Azure), AppConstants & Offices
│   │   ├── models/          # UserModel, AttendanceRecord, PendingRegistration
│   │   ├── services/        # AuthService, AttendanceService, GeofenceService
│   │   ├── screens/         # Login, Register, OTP, Intern & HRD Dashboards
│   │   └── main.dart        # Entry point aplikasi Flutter
│   └── pubspec.yaml         # Dependensi Flutter (Google Fonts, Intl, dll)
├── public/                  # Logo dan aset visual CV. Asia Plastik
├── .env.example             # Template konfigurasi environment Magang
└── package.json             # Dependensi root
```

---

## ⚙️ Cara Menjalankan Secara Lokal

### 1. Menjalankan Portal Presensi Magang (Port 3000):
```bash
npm install
npm run dev
```
Akses di browser: `http://localhost:3000`

### 2. Menjalankan Portal HRD (Port 3001):
```bash
cd hrd
npm install
npm run dev -- -p 3001
```
Akses di browser: `http://localhost:3001`

### 3. Menjalankan Aplikasi Mobile Flutter:
```bash
cd mobile
flutter pub get
flutter run
```

---

## 🚀 Panduan Deploy ke Vercel dengan URL Terpisah

Untuk panduan lengkap deploy portal HRD ke Vercel dengan URL yang berbeda, silakan lihat [Panduan Deploy HRD](hrd/README.md).
