import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../services/auth_service.dart';
import '../../services/attendance_service.dart';
import '../auth/login_screen.dart';

class HrdDashboardScreen extends StatefulWidget {
  const HrdDashboardScreen({super.key});

  @override
  State<HrdDashboardScreen> createState() => _HrdDashboardScreenState();
}

class _HrdDashboardScreenState extends State<HrdDashboardScreen> {
  final _authService = AuthService();
  final _attendanceService = AttendanceService();

  int _selectedTabIndex = 0; // 0 = Riwayat Presensi, 1 = ACC Akun Magang
  String _searchQuery = '';
  String _selectedFilter = 'Semua'; // 'Semua' | 'Tepat Waktu' | 'Terlambat' | 'Izin'

  void _handleLogout() {
    _authService.logout();
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  void _exportReport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Laporan Rekap Presensi Magang berhasil diunduh (Format CSV / Excel)!'),
        backgroundColor: AppTheme.statusGreen,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final allRecords = _attendanceService.getAllRecords();
    final pendingList = _authService.pendingRegistrations;

    // Calculate metrics
    final totalPresensi = allRecords.length;
    final onTimeCount = allRecords.where((r) => r.status == 'PRESENT').length;
    final lateCount = allRecords.where((r) => r.status == 'LATE').length;
    final pendingCount = pendingList.where((p) => p.status == 'PENDING_APPROVAL').length;

    // Filter records
    final filteredRecords = allRecords.where((r) {
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final matchName = r.internName.toLowerCase().contains(query);
        final matchInst = (r.institution ?? '').toLowerCase().contains(query);
        final matchDiv = (r.division ?? '').toLowerCase().contains(query);
        if (!matchName && !matchInst && !matchDiv) return false;
      }

      if (_selectedFilter == 'Tepat Waktu') {
        return r.status == 'PRESENT';
      } else if (_selectedFilter == 'Terlambat') {
        return r.status == 'LATE';
      } else if (_selectedFilter == 'Izin') {
        return r.mainStatus != 'HADIR';
      }
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Image.asset(
                'assets/images/logo.webp',
                errorBuilder: (context, error, stackTrace) => const Icon(
                  Icons.shield_rounded,
                  size: 18,
                  color: AppTheme.primarySky,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Dasbor HRD & Supervisor',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  'CV. Asia Plastik Industri',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    color: AppTheme.textMuted,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.download_rounded, size: 20),
            tooltip: 'Ekspor Laporan Presensi',
            onPressed: _exportReport,
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, size: 20),
            tooltip: 'Keluar',
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: Container(
        decoration: AppTheme.softSkyBackground,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Navigation Segmented Pill
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => setState(() => _selectedTabIndex = 0),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: _selectedTabIndex == 0
                                  ? AppTheme.primarySky
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.history_rounded,
                                  size: 16,
                                  color: _selectedTabIndex == 0
                                      ? Colors.white
                                      : AppTheme.textMuted,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Riwayat Presensi',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: _selectedTabIndex == 0
                                        ? Colors.white
                                        : AppTheme.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: InkWell(
                          onTap: () => setState(() => _selectedTabIndex = 1),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: _selectedTabIndex == 1
                                  ? AppTheme.primarySky
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.how_to_reg_rounded,
                                  size: 16,
                                  color: _selectedTabIndex == 1
                                      ? Colors.white
                                      : AppTheme.textMuted,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Persetujuan Akun (ACC)',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: _selectedTabIndex == 1
                                        ? Colors.white
                                        : AppTheme.textMuted,
                                  ),
                                ),
                                if (pendingCount > 0) ...[
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: _selectedTabIndex == 1
                                          ? Colors.white.withValues(alpha: 0.25)
                                          : AppTheme.statusAmberBg,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      '$pendingCount',
                                      style: GoogleFonts.inter(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w800,
                                        color: _selectedTabIndex == 1
                                            ? Colors.white
                                            : AppTheme.statusAmber,
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Metrics Cards Row
                Row(
                  children: [
                    _buildMetricCard(
                      title: 'TOTAL HADIR',
                      count: '$totalPresensi',
                      subtitle: 'peserta tercatat',
                      icon: Icons.people_outline_rounded,
                      color: AppTheme.primarySky,
                      bg: AppTheme.softBlueTint,
                    ),
                    const SizedBox(width: 10),
                    _buildMetricCard(
                      title: 'TEPAT WAKTU',
                      count: '$onTimeCount',
                      subtitle: 'sebelum 08:15 WIB',
                      icon: Icons.check_circle_outline_rounded,
                      color: AppTheme.statusGreen,
                      bg: AppTheme.statusGreenBg,
                    ),
                    const SizedBox(width: 10),
                    _buildMetricCard(
                      title: 'TERLAMBAT',
                      count: '$lateCount',
                      subtitle: 'perlu konfirmasi',
                      icon: Icons.warning_amber_rounded,
                      color: AppTheme.statusAmber,
                      bg: AppTheme.statusAmberBg,
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // TAB 0: RIWAYAT PRESENSI MAGANG
                if (_selectedTabIndex == 0) ...[
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Daftar Log Kehadiran Pabrik',
                            style: GoogleFonts.inter(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textMain,
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Search Bar
                          TextField(
                            decoration: const InputDecoration(
                              hintText: 'Cari nama, kampus, divisi...',
                              prefixIcon: Icon(Icons.search_rounded, size: 20),
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 12),
                            ),
                            onChanged: (val) {
                              setState(() {
                                _searchQuery = val;
                              });
                            },
                          ),
                          const SizedBox(height: 12),

                          // Filter Chips
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: [
                                _buildFilterChip('Semua'),
                                const SizedBox(width: 8),
                                _buildFilterChip('Tepat Waktu'),
                                const SizedBox(width: 8),
                                _buildFilterChip('Terlambat'),
                                const SizedBox(width: 8),
                                _buildFilterChip('Izin'),
                              ],
                            ),
                          ),
                          const Divider(height: 24),

                          if (filteredRecords.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 24),
                              child: Center(
                                child: Text(
                                  'Tidak ditemukan data presensi yang sesuai.',
                                  style: GoogleFonts.inter(
                                      fontSize: 12, color: AppTheme.textMuted),
                                ),
                              ),
                            )
                          else
                            ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: filteredRecords.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final item = filteredRecords[index];
                                final isLate = item.status == 'LATE';
                                final isPresent = item.mainStatus == 'HADIR';

                                return Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(color: AppTheme.borderLight),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Text(
                                              item.internName,
                                              style: GoogleFonts.inter(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w700,
                                                color: AppTheme.textMain,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: isPresent
                                                  ? (isLate
                                                      ? AppTheme.statusAmberBg
                                                      : AppTheme.statusGreenBg)
                                                  : AppTheme.statusBlueBg,
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              isPresent
                                                  ? (isLate
                                                      ? 'Terlambat'
                                                      : 'Tepat Waktu')
                                                  : 'Izin',
                                              style: GoogleFonts.inter(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700,
                                                color: isPresent
                                                    ? (isLate
                                                        ? AppTheme.statusAmber
                                                        : AppTheme.statusGreen)
                                                    : AppTheme.statusBlue,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${item.institution ?? '-'} • Divisi: ${item.division ?? '-'}',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          color: AppTheme.textMuted,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          const Icon(Icons.access_time_rounded,
                                              size: 14, color: AppTheme.textMuted),
                                          const SizedBox(width: 4),
                                          Text(
                                            '${item.formattedTime} (${item.officeName ?? 'Pabrik'})',
                                            style: GoogleFonts.inter(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w500,
                                              color: AppTheme.textMain,
                                            ),
                                          ),
                                          const Spacer(),
                                          Icon(
                                            item.isWithinGeofence
                                                ? Icons.gps_fixed_rounded
                                                : Icons.gps_off_rounded,
                                            size: 14,
                                            color: item.isWithinGeofence
                                                ? AppTheme.statusGreen
                                                : AppTheme.statusAmber,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            item.isWithinGeofence
                                                ? 'Radius OK'
                                                : 'Luar Area',
                                            style: GoogleFonts.inter(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                              color: item.isWithinGeofence
                                                  ? AppTheme.statusGreen
                                                  : AppTheme.statusAmber,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                ],

                // TAB 1: PERSETUJUAN AKUN MAGANG (ACC)
                if (_selectedTabIndex == 1) ...[
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Antrean Verifikasi Pendaftar Magang',
                                style: GoogleFonts.inter(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: AppTheme.textMain,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppTheme.statusAmberBg,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '$pendingCount Menunggu',
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.statusAmber,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Verifikasi pendaftar baru sebelum mereka dapat mengisi presensi pabrik.',
                            style: GoogleFonts.inter(
                                fontSize: 11, color: AppTheme.textMuted),
                          ),
                          const Divider(height: 24),

                          if (pendingList.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 24),
                              child: Center(
                                child: Text(
                                  'Tidak ada antrean pendaftaran magang saat ini.',
                                  style: GoogleFonts.inter(
                                      fontSize: 12, color: AppTheme.textMuted),
                                ),
                              ),
                            )
                          else
                            ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: pendingList.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final reg = pendingList[index];
                                final isApproved = reg.status == 'APPROVED';
                                final isPending = reg.status == 'PENDING_APPROVAL';

                                return Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(color: AppTheme.borderLight),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Text(
                                              reg.fullName,
                                              style: GoogleFonts.inter(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w700,
                                                color: AppTheme.textMain,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: isApproved
                                                  ? AppTheme.statusGreenBg
                                                  : (isPending
                                                      ? AppTheme.statusAmberBg
                                                      : AppTheme.statusRedBg),
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              isApproved
                                                  ? 'Disetujui (ACC)'
                                                  : (isPending
                                                      ? 'Pending Review'
                                                      : 'Ditolak'),
                                              style: GoogleFonts.inter(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700,
                                                color: isApproved
                                                    ? AppTheme.statusGreen
                                                    : (isPending
                                                        ? AppTheme.statusAmber
                                                        : AppTheme.statusRed),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Email: ${reg.email}',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          color: AppTheme.textMuted,
                                        ),
                                      ),
                                      Text(
                                        'Instansi: ${reg.institution}',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                          color: AppTheme.textMain,
                                        ),
                                      ),
                                      if (isPending) ...[
                                        const SizedBox(height: 12),
                                        Row(
                                          children: [
                                            Expanded(
                                              child: ElevatedButton.icon(
                                                icon: const Icon(
                                                    Icons.check_rounded,
                                                    size: 16),
                                                label: const Text('Setujui (ACC)'),
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor:
                                                      AppTheme.statusGreen,
                                                  padding: const EdgeInsets
                                                      .symmetric(vertical: 8),
                                                  textStyle: GoogleFonts.inter(
                                                    fontSize: 12,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                                onPressed: () {
                                                  setState(() {
                                                    _authService.approveRegistration(
                                                        reg.id);
                                                  });
                                                  ScaffoldMessenger.of(context)
                                                      .showSnackBar(
                                                    SnackBar(
                                                      content: Text(
                                                          'Akun ${reg.fullName} berhasil disetujui (ACC)!'),
                                                      backgroundColor:
                                                          AppTheme.statusGreen,
                                                    ),
                                                  );
                                                },
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            OutlinedButton(
                                              style: OutlinedButton.styleFrom(
                                                foregroundColor:
                                                    AppTheme.statusRed,
                                                side: const BorderSide(
                                                    color: AppTheme.statusRed),
                                                padding: const EdgeInsets
                                                    .symmetric(
                                                    vertical: 8,
                                                    horizontal: 14),
                                              ),
                                              onPressed: () {
                                                setState(() {
                                                  _authService.rejectRegistration(
                                                      reg.id, 'Data tidak lengkap');
                                                });
                                              },
                                              child: const Text('Tolak'),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ],
                                  ),
                                );
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String count,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color bg,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.borderLight),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.06),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textMuted,
                    letterSpacing: 0.3,
                  ),
                ),
                Icon(icon, size: 16, color: color),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              count,
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppTheme.textMain,
              ),
            ),
            Text(
              subtitle,
              style: GoogleFonts.inter(
                fontSize: 9,
                color: AppTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    final isSelected = _selectedFilter == label;
    return InkWell(
      onTap: () => setState(() => _selectedFilter = label),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primarySky : AppTheme.softSkyLight,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : AppTheme.primarySky,
          ),
        ),
      ),
    );
  }
}
