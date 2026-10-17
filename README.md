# Sistem Presensi Digital Magang - CV. Asia Plastik

Sistem Presensi Mandiri Terintegrasi MagangHub & SIAPkerja Kemnaker RI untuk mahasiswa dan siswa magang di pabrik **CV. Asia Plastik Sidoarjo**.

## Fitur Utama

- **Geofence Validation Presisi (150m)**:
  - Menggunakan rumus Haversine untuk kalkulasi jarak GPS real-time terhadap titik koordinat pabrik.
  - Tombol Check-In / Check-Out terkunci otomatis jika berada di luar radius izin.
- **Dukungan MagangHub & SIAPkerja**:
  - Format identitas peserta magang berbasis NIM, NIK, dan ID MagangHub.
- **Multi-Role Portal**:
  - **Portal Peserta Magang**: Jam WIB real-time, status geofence, catatan aktivitas harian, dan log riwayat presensi harian.
  - **Portal HRD / Supervisor**: Rekap status kehadiran on-time vs terlambat (toleransi 08:15 WIB), tabel kehadiran live, filter divisi/kampus, dan ekspor data.
- **Interactive UI Prototype**:
  - Dilengkapi 3 varian antarmuka login yang dapat diuji coba langsung (`?variant=A|B|C`) dengan floating switcher dan tombol demo instan.
- **Arsitektur Firebase Terisolasi**:
  - Client SDK untuk otentikasi cepat.
  - Server Admin SDK (`server-only`) untuk keamanan transaksi data sensitif.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Backend / Database**: Firebase Client SDK & Firebase Admin SDK
- **Validation**: Zod

## Menjalankan di Lokal

1. Salin file environment:
   ```bash
   cp .env.example .env.local
   ```
2. Isi kredensial Firebase Anda di `.env.local`.
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka di browser:
   - Aplikasi: [http://localhost:3000](http://localhost:3000)
   - Login Prototipe: [http://localhost:3000/login](http://localhost:3000/login)
