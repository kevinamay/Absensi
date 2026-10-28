# Portal HRD & Supervisor - CV. Asia Plastik

Portal manajemen khusus HRD, staf personalia, dan supervisor pembimbing industri CV. Asia Plastik.
Project ini berada di dalam satu repositori dengan sistem presensi magang, namun diatur dalam folder `hrd/` terpisah sehingga dapat di-deploy ke Vercel dengan **URL / domain khusus tersendiri**.

---

## ✨ Fitur Utama Portal HRD

1. **Antrean Verifikasi & Persetujuan Akun Magang (ACC):**
   - Menampilkan daftar pendaftar baru yang telah verifikasi email/OTP.
   - Tombol satu-klik untuk **ACC Akun** atau **Tolak** pendaftaran.
   - Pengiriman notifikasi email otomatis ke peserta magang.

2. **Monitoring Log Kehadiran Real-Time:**
   - Memantau presensi harian seluruh peserta magang dari pabrik/kantor.
   - Indikator status: *Tepat Waktu*, *Terlambat*, *Izin*, *Sakit*, dan validasi jarak GPS.
   - Pencarian cerdas berdasarkan Nama, Kampus/Sekolah, dan Divisi.

3. **Ekspor Laporan Presensi:**
   - Cetak atau unduh rekap kehadiran untuk arsip personalia.

---

## 🚀 Panduan Deploy ke Vercel (URL Terpisah)

Untuk mendeploy portal HRD ini dengan URL terpisah dari portal absensi magang:

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New... > Project**.
2. Pilih repository GitHub: `kevinamay/Absensi`.
3. Pada pengaturan konfigurasi project:
   - **Project Name:** Beri nama, misalnya `hrd-asiaplastik` atau `absensi-hrd`.
   - **Framework Preset:** Next.js (otomatis terdeteksi).
   - **Root Directory:** Klik tombol **Edit** lalu pilih/ketik folder **`hrd`** (WAJIB).
4. **Environment Variables:**
   Salin variabel dari file `hrd/.env.example` ke bagian Environment Variables di Vercel:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `NEXT_PUBLIC_INTERN_PORTAL_URL` (URL aplikasi anak magang)
5. Klik **Deploy**.

Vercel akan menghasilkan URL terpisah (misal: `https://hrd-asiaplastik.vercel.app`), sementara project absensi magang tetap berjalan di URL utamanya (`https://absensi-eta-seven.vercel.app`).

---

## 🔑 Kredensial Default Staf HRD

- **Email:** `staf.hrd@asiaplastik.com` atau `admin123@gmail.com`
- **Kata Sandi:** `User_Admin123.`
