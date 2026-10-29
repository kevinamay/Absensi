import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../models/attendance_model.dart';
import '../../models/approval_model.dart';
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

  int _selectedTabIndex = 0; // 0 = Riwayat Presensi Magang, 1 = Persetujuan Akun Magang (ACC)
  String _searchTerm = '';
  String _filterType = 'ALL'; // 'ALL', 'PRESENT', 'LATE'
  String _approvalFilter = 'ALL'; // 'ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'

  void _toggleTheme() {
    final current = themeModeNotifier.value;
    final next = current == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    themeModeNotifier.value = next;
    setState(() {});
  }

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
        content: Text('Laporan Rekap Presensi Magang berhasil diekspor (Format CSV / Excel)!'),
        backgroundColor: Color(0xFF10B981),
      ),
    );
  }

  void _handleApprovalAction(String id, String action) {
    setState(() {
      _authService.processApproval(id, action);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          action == 'APPROVE'
              ? 'Akun magang berhasil disetujui (ACC). Peserta kini dapat login.'
              : 'Pendaftaran akun magang telah ditolak.',
        ),
        backgroundColor: action == 'APPROVE' ? const Color(0xFF10B981) : const Color(0xFFEF4444),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = themeModeNotifier.value == ThemeMode.dark;
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;

    final user = _authService.currentUser;
    final allRecords = _attendanceService.getAllRecords();
    final allRegistrations = _authService.pendingRegistrations;

    // Metrics
    final presentCount = allRecords.where((r) => r.status == 'PRESENT').length;
    final lateCount = allRecords.where((r) => r.status == 'LATE').length;
    final pendingApprovalsCount = allRegistrations.where((r) => r.status == 'PENDING_APPROVAL').length;

    // Filtered attendance records
    final filteredRecords = allRecords.where((r) {
      final matchesSearch = r.internName.toLowerCase().contains(_searchTerm.toLowerCase()) ||
          (r.institution ?? '').toLowerCase().contains(_searchTerm.toLowerCase()) ||
          (r.division ?? '').toLowerCase().contains(_searchTerm.toLowerCase());

      if (_filterType == 'ALL') return matchesSearch;
      if (_filterType == 'PRESENT') return matchesSearch && r.status == 'PRESENT';
      if (_filterType == 'LATE') return matchesSearch && r.status == 'LATE';
      return matchesSearch;
    }).toList();

    // Filtered registrations
    final filteredRegistrations = allRegistrations.where((r) {
      final matches = r.fullName.toLowerCase().contains(_searchTerm.toLowerCase()) ||
          r.email.toLowerCase().contains(_searchTerm.toLowerCase()) ||
          r.institution.toLowerCase().contains(_searchTerm.toLowerCase());

      if (_approvalFilter == 'ALL') return matches;
      return matches && r.status == _approvalFilter;
    }).toList();

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF020617) : const Color(0xFFF8FBFF),
      body: Stack(
        children: [
          // 1. Base Silky-Smooth Pastel Sky Gradient (Matches Web)
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? const [
                          Color(0xFF020617),
                          Color(0xFF0B132B),
                          Color(0xFF020617),
                        ]
                      : const [
                          Color(0xFFE0F2FE),
                          Color(0xFFF0F9FF),
                          Color(0xFFF8FBFF),
                          Color(0xFFEBF5FF),
                          Color(0xFFE0F7FA),
                        ],
                ),
              ),
            ),
          ),

          // 2. Gaussian-Blurred Organic Floating Aurora Glows
          Positioned.fill(
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 85, sigmaY: 85),
              child: Stack(
                children: [
                  Positioned(
                    top: -40,
                    right: -40,
                    child: Container(
                      width: 320,
                      height: 320,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDark
                            ? const Color(0xFF0284C7).withValues(alpha: 0.16)
                            : const Color(0xFF7DD3FC).withValues(alpha: 0.45),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: -60,
                    left: -60,
                    child: Container(
                      width: 360,
                      height: 360,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDark
                            ? const Color(0xFF1E1B4B).withValues(alpha: 0.3)
                            : const Color(0xFF93C5FD).withValues(alpha: 0.42),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Main Scrollable Area with Sticky Top Navbar
          SafeArea(
            child: Column(
              children: [
                // Top Navbar (Responsive Mobile & Desktop)
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: isMobile ? 12 : 20,
                    vertical: isMobile ? 10 : 12,
                  ),
                  decoration: BoxDecoration(
                    color: isDark
                        ? const Color(0xFF0F172A).withValues(alpha: 0.85)
                        : Colors.white.withValues(alpha: 0.85),
                    border: Border(
                      bottom: BorderSide(
                        color: isDark
                            ? Colors.white.withValues(alpha: 0.1)
                            : const Color(0xFFE2E8F0),
                      ),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Left: Logo + Company Name & Portal Tag
                      Flexible(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Image.asset(
                              'assets/images/logo.webp',
                              height: isMobile ? 26 : 34,
                              fit: BoxFit.contain,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                              colorBlendMode: BlendMode.srcIn,
                              errorBuilder: (_, __, ___) => Icon(
                                Icons.factory_rounded,
                                size: isMobile ? 22 : 26,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                            if (!isMobile) ...[
                              const SizedBox(width: 10),
                              Container(
                                height: 24,
                                width: 1,
                                color: isDark
                                    ? Colors.white.withValues(alpha: 0.2)
                                    : const Color(0xFFCBD5E1),
                              ),
                              const SizedBox(width: 10),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'CV. ASIA PLASTIK',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w900,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  Text(
                                    'PORTAL HRD & SUPERVISOR',
                                    style: GoogleFonts.inter(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w800,
                                      color: const Color(0xFFD97706),
                                      letterSpacing: 0.8,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),

                      // Right: User Identity Chip + Theme Toggle + Logout Button
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // User Chip (Only on wider screens)
                          if (!isMobile && screenWidth > 860) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              margin: const EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF59E0B).withValues(alpha: isDark ? 0.15 : 0.1),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: const Color(0xFFF59E0B).withValues(alpha: 0.3),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.shield_rounded,
                                    size: 14,
                                    color: Color(0xFFD97706),
                                  ),
                                  const SizedBox(width: 6),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        user?.displayName ?? 'Administrator HRD',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                                        ),
                                      ),
                                      Text(
                                        user?.division ?? 'Human Resources & General Affairs',
                                        style: GoogleFonts.inter(
                                          fontSize: 9,
                                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFD97706),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      'HR / SUPERVISOR',
                                      style: GoogleFonts.inter(
                                        fontSize: 8,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],

                          // Mode Terang / Gelap Pill
                          Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: _toggleTheme,
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: isMobile ? 8 : 10,
                                  vertical: isMobile ? 5 : 6,
                                ),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? const Color(0xFF0F172A).withValues(alpha: 0.9)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isDark
                                        ? const Color(0xFF334155)
                                        : const Color(0xFFE2E8F0),
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      isDark ? Icons.light_mode_rounded : Icons.dark_mode_outlined,
                                      size: 14,
                                      color: isDark ? const Color(0xFFFBBF24) : const Color(0xFF334155),
                                    ),
                                    if (!isMobile) ...[
                                      const SizedBox(width: 5),
                                      Text(
                                        isDark ? 'Mode Gelap' : 'Mode Terang',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF334155),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),

                          // Logout Button
                          Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: _handleLogout,
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: isMobile ? 8 : 10,
                                  vertical: isMobile ? 5 : 6,
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: const Color(0xFFFDA4AF),
                                  ),
                                  color: const Color(0xFFFFF1F2).withValues(alpha: isDark ? 0.1 : 0.8),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.logout_rounded,
                                      size: 13,
                                      color: Color(0xFFE11D48),
                                    ),
                                    if (!isMobile) ...[
                                      const SizedBox(width: 4),
                                      Text(
                                        'Keluar',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                          color: const Color(0xFFE11D48),
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
                    ],
                  ),
                ),

                // Main Dashboard Content
                Expanded(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.symmetric(
                      horizontal: isMobile ? 12 : 20,
                      vertical: 16,
                    ),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1200),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Page Header: Title + Subtitle + Action Button (Responsive Wrap / Column)
                          isMobile
                              ? Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildSupervisorBadge(isDark),
                                    const SizedBox(height: 6),
                                    Text(
                                      'Dasbor HRD CV. Asia Plastik',
                                      style: GoogleFonts.inter(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w900,
                                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                                        letterSpacing: -0.5,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Pusat manajemen presensi real-time dan verifikasi persetujuan akun magang industri.',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    _buildHeaderActionButton(isDark),
                                  ],
                                )
                              : Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          _buildSupervisorBadge(isDark),
                                          const SizedBox(height: 8),
                                          Text(
                                            'Dasbor HRD CV. Asia Plastik',
                                            style: GoogleFonts.inter(
                                              fontSize: 22,
                                              fontWeight: FontWeight.w900,
                                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                                              letterSpacing: -0.5,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            'Pusat manajemen presensi real-time dan verifikasi persetujuan akun magang industri.',
                                            style: GoogleFonts.inter(
                                              fontSize: 12,
                                              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    _buildHeaderActionButton(isDark),
                                  ],
                                ),
                          const SizedBox(height: 18),

                          // Tab Switcher (Horizontally scrollable on mobile so it NEVER overflows)
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            physics: const BouncingScrollPhysics(),
                            child: Row(
                              children: [
                                // Tab 1: Riwayat Presensi Magang
                                InkWell(
                                  onTap: () => setState(() => _selectedTabIndex = 0),
                                  borderRadius: BorderRadius.circular(12),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    padding: EdgeInsets.symmetric(
                                      horizontal: isMobile ? 12 : 14,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color: _selectedTabIndex == 0
                                          ? const Color(0xFF2563EB)
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: _selectedTabIndex == 0
                                          ? [
                                              BoxShadow(
                                                color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                                                blurRadius: 10,
                                                offset: const Offset(0, 4),
                                              ),
                                            ]
                                          : null,
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.people_alt_rounded,
                                          size: 14,
                                          color: _selectedTabIndex == 0
                                              ? Colors.white
                                              : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          isMobile ? 'Presensi Magang' : 'Riwayat Presensi Magang',
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: _selectedTabIndex == 0
                                                ? Colors.white
                                                : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),

                                // Tab 2: Persetujuan Akun Magang (ACC)
                                InkWell(
                                  onTap: () => setState(() => _selectedTabIndex = 1),
                                  borderRadius: BorderRadius.circular(12),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    padding: EdgeInsets.symmetric(
                                      horizontal: isMobile ? 12 : 14,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color: _selectedTabIndex == 1
                                          ? const Color(0xFF2563EB)
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: _selectedTabIndex == 1
                                          ? [
                                              BoxShadow(
                                                color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                                                blurRadius: 10,
                                                offset: const Offset(0, 4),
                                              ),
                                            ]
                                          : null,
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.person_add_alt_1_rounded,
                                          size: 14,
                                          color: _selectedTabIndex == 1
                                              ? Colors.white
                                              : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          isMobile ? 'Persetujuan (ACC)' : 'Persetujuan Akun Magang (ACC)',
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: _selectedTabIndex == 1
                                                ? Colors.white
                                                : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                                          ),
                                        ),
                                        if (pendingApprovalsCount > 0) ...[
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFF59E0B),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              '$pendingApprovalsCount',
                                              style: const TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w900,
                                                color: Color(0xFF0F172A),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 18),

                          // KPI Stats Cards (Responsive 3 Cards Row or Column)
                          LayoutBuilder(
                            builder: (context, constraints) {
                              final isCardRow = constraints.maxWidth > 700;
                              final cardWidgets = [
                                _buildKpiCard(
                                  title: 'TOTAL KEHADIRAN HARI INI',
                                  count: '${allRecords.length}',
                                  label: 'peserta tercatat',
                                  icon: Icons.people_alt_outlined,
                                  iconColor: const Color(0xFF2563EB),
                                  countColor: isDark ? Colors.white : const Color(0xFF0F172A),
                                  isDark: isDark,
                                ),
                                _buildKpiCard(
                                  title: 'TEPAT WAKTU (ON TIME)',
                                  count: '$presentCount',
                                  label: 'sebelum 08:15 WIB',
                                  icon: Icons.check_circle_outline_rounded,
                                  iconColor: const Color(0xFF10B981),
                                  countColor: const Color(0xFF059669),
                                  isDark: isDark,
                                ),
                                _buildKpiCard(
                                  title: 'TERLAMBAT',
                                  count: '$lateCount',
                                  label: 'perlu konfirmasi',
                                  icon: Icons.warning_amber_rounded,
                                  iconColor: const Color(0xFFF59E0B),
                                  countColor: const Color(0xFFD97706),
                                  isDark: isDark,
                                ),
                              ];

                              return isCardRow
                                  ? Row(
                                      children: cardWidgets
                                          .map((c) => Expanded(
                                                child: Padding(
                                                  padding: const EdgeInsets.symmetric(horizontal: 5),
                                                  child: c,
                                                ),
                                              ))
                                          .toList(),
                                    )
                                  : Column(
                                      children: cardWidgets
                                          .map((c) => Padding(
                                                padding: const EdgeInsets.only(bottom: 10),
                                                child: c,
                                              ))
                                          .toList(),
                                    );
                            },
                          ),
                          const SizedBox(height: 20),

                          // Content: Tab 1 Attendance or Tab 2 Approvals
                          _selectedTabIndex == 0
                              ? _buildAttendanceTableCard(isDark, isMobile, filteredRecords)
                              : _buildApprovalsCard(isDark, isMobile, filteredRegistrations),

                          const SizedBox(height: 24),

                          // Footer Info
                          Center(
                            child: Text(
                              'CV. Asia Plastik HR Management Console • Dedicated Portal',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Pill: SUPERVISOR & HR PORTAL
  Widget _buildSupervisorBadge(bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF59E0B).withValues(alpha: isDark ? 0.2 : 0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: const Color(0xFFF59E0B).withValues(alpha: 0.35),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.shield_rounded,
            size: 12,
            color: Color(0xFFD97706),
          ),
          const SizedBox(width: 5),
          Text(
            'SUPERVISOR & HR PORTAL',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.6,
              color: const Color(0xFFD97706),
            ),
          ),
        ],
      ),
    );
  }

  // Header Action Button
  Widget _buildHeaderActionButton(bool isDark) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: _selectedTabIndex == 0 ? _exportReport : () => setState(() {}),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF0F172A) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.15) : const Color(0xFFCBD5E1),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _selectedTabIndex == 0 ? Icons.download_rounded : Icons.refresh_rounded,
                size: 14,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
              const SizedBox(width: 6),
              Text(
                _selectedTabIndex == 0 ? 'Ekspor Laporan Presensi' : 'Segarkan Antrean',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // KPI STATS CARD WIDGET
  Widget _buildKpiCard({
    required String title,
    required String count,
    required String label,
    required IconData icon,
    required Color iconColor,
    required Color countColor,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A).withValues(alpha: 0.85) : Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.1) : const Color(0xFFE2E8F0),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
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
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
              Icon(icon, size: 16, color: iconColor),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                count,
                style: GoogleFonts.inter(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: countColor,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // TAB 1: ATTENDANCE TABLE CARD (Fully Responsive)
  Widget _buildAttendanceTableCard(bool isDark, bool isMobile, List<AttendanceRecord> records) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A).withValues(alpha: 0.85) : Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.1) : const Color(0xFFE2E8F0),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Search and Filter Pills (Responsive Wrap / Column on Mobile)
          Padding(
            padding: const EdgeInsets.all(16),
            child: isMobile
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Daftar Log Kehadiran Pabrik',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 10),
                      // Search box full width
                      _buildSearchBox(isDark, double.infinity),
                      const SizedBox(height: 8),
                      // Filter pills horizontal scroll
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        child: Row(
                          children: [
                            _buildFilterButton('ALL', 'Semua', isDark),
                            const SizedBox(width: 4),
                            _buildFilterButton('PRESENT', 'Tepat Waktu', isDark),
                            const SizedBox(width: 4),
                            _buildFilterButton('LATE', 'Terlambat', isDark),
                          ],
                        ),
                      ),
                    ],
                  )
                : Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Daftar Log Kehadiran Pabrik',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildSearchBox(isDark, 190),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.all(3),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF020617) : const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Row(
                              children: [
                                _buildFilterButton('ALL', 'Semua', isDark),
                                _buildFilterButton('PRESENT', 'Tepat Waktu', isDark),
                                _buildFilterButton('LATE', 'Terlambat', isDark),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
          ),
          const Divider(height: 1),

          // Scrollable Table container (Prevents any overflow on mobile)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 680),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Table Header
                  Container(
                    width: 680,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    color: isDark ? Colors.white.withValues(alpha: 0.02) : const Color(0xFFF8FAFC),
                    child: Row(
                      children: [
                        Expanded(flex: 3, child: _buildTableHeader('NAMA PESERTA / NIM', isDark)),
                        Expanded(flex: 3, child: _buildTableHeader('INSTITUSI / KAMPUS', isDark)),
                        Expanded(flex: 2, child: _buildTableHeader('DIVISI PENEMPATAN', isDark)),
                        Expanded(flex: 2, child: _buildTableHeader('JAM PRESENSI', isDark)),
                        Expanded(flex: 2, child: _buildTableHeader('VALIDASI GPS', isDark)),
                        Expanded(flex: 2, child: _buildTableHeader('STATUS', isDark)),
                      ],
                    ),
                  ),
                  const Divider(height: 1),

                  // Table Body or Empty State
                  if (records.isEmpty)
                    Container(
                      width: 680,
                      padding: const EdgeInsets.symmetric(vertical: 40),
                      child: Center(
                        child: Text(
                          'Tidak ditemukan data presensi yang sesuai.',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          ),
                        ),
                      ),
                    )
                  else
                    SizedBox(
                      width: 680,
                      child: ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: records.length,
                        separatorBuilder: (_, __) => const Divider(height: 1),
                        itemBuilder: (context, index) {
                          final r = records[index];
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                            child: Row(
                              children: [
                                // Name & Student ID
                                Expanded(
                                  flex: 3,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        r.internName,
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                                        ),
                                      ),
                                      Text(
                                        r.internStudentId ?? '-',
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Institution
                                Expanded(
                                  flex: 3,
                                  child: Text(
                                    r.institution ?? '-',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155),
                                    ),
                                  ),
                                ),

                                // Division
                                Expanded(
                                  flex: 2,
                                  child: Text(
                                    r.division ?? '-',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155),
                                    ),
                                  ),
                                ),

                                // Time
                                Expanded(
                                  flex: 2,
                                  child: Text(
                                    r.formattedTime,
                                    style: GoogleFonts.robotoMono(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                ),

                                // GPS
                                Expanded(
                                  flex: 2,
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        width: 6,
                                        height: 6,
                                        decoration: const BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: Color(0xFF10B981),
                                        ),
                                      ),
                                      const SizedBox(width: 5),
                                      Text(
                                        '${r.distanceFromOfficeMeters.round()}m OK',
                                        style: GoogleFonts.robotoMono(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: const Color(0xFF059669),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Status Badge
                                Expanded(
                                  flex: 2,
                                  child: Align(
                                    alignment: Alignment.centerLeft,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: r.status == 'PRESENT'
                                            ? const Color(0xFFECFDF5)
                                            : const Color(0xFFFFFBEB),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: r.status == 'PRESENT'
                                              ? const Color(0xFFA7F3D0)
                                              : const Color(0xFFFDE68A),
                                        ),
                                      ),
                                      child: Text(
                                        r.status == 'PRESENT' ? 'TEPAT WAKTU' : 'TERLAMBAT',
                                        style: GoogleFonts.inter(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          color: r.status == 'PRESENT'
                                              ? const Color(0xFF065F46)
                                              : const Color(0xFF92400E),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // TAB 2: APPROVALS CARD (Fully Responsive)
  Widget _buildApprovalsCard(bool isDark, bool isMobile, List<PendingRegistration> registrations) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A).withValues(alpha: 0.85) : Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.1) : const Color(0xFFE2E8F0),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Filters (Responsive Column on Mobile)
          Padding(
            padding: const EdgeInsets.all(16),
            child: isMobile
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Antrean Verifikasi Akun Magang Baru',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        child: Row(
                          children: [
                            _buildApprovalFilterButton('ALL', 'Semua', isDark),
                            const SizedBox(width: 4),
                            _buildApprovalFilterButton('PENDING_APPROVAL', 'Menunggu ACC', isDark),
                            const SizedBox(width: 4),
                            _buildApprovalFilterButton('APPROVED', 'Disetujui', isDark),
                            const SizedBox(width: 4),
                            _buildApprovalFilterButton('REJECTED', 'Ditolak', isDark),
                          ],
                        ),
                      ),
                    ],
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Antrean Verifikasi Akun Magang Baru',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF020617) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            _buildApprovalFilterButton('ALL', 'Semua', isDark),
                            _buildApprovalFilterButton('PENDING_APPROVAL', 'Menunggu ACC', isDark),
                            _buildApprovalFilterButton('APPROVED', 'Disetujui', isDark),
                            _buildApprovalFilterButton('REJECTED', 'Ditolak', isDark),
                          ],
                        ),
                      ),
                    ],
                  ),
          ),
          const Divider(height: 1),

          if (registrations.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 40),
              child: Center(
                child: Text(
                  'Tidak ada permohonan akun dalam antrean.',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                  ),
                ),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: registrations.length,
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final reg = registrations[index];
                return Padding(
                  padding: const EdgeInsets.all(14),
                  child: isMobile
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 34,
                                  height: 34,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                                  ),
                                  child: const Center(
                                    child: Icon(Icons.person_outline_rounded, color: Color(0xFF2563EB), size: 18),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        reg.fullName,
                                        style: GoogleFonts.inter(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w800,
                                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                                        ),
                                      ),
                                      Text(
                                        reg.institution,
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                _buildStatusBadge(reg.status),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              reg.email,
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF334155),
                              ),
                            ),
                            if (reg.status == 'PENDING_APPROVAL') ...[
                              const SizedBox(height: 10),
                              Row(
                                children: [
                                  Expanded(
                                    child: InkWell(
                                      onTap: () => _handleApprovalAction(reg.id, 'APPROVE'),
                                      borderRadius: BorderRadius.circular(8),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(vertical: 8),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF10B981),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            '✓ ACC Akun',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 11,
                                              fontWeight: FontWeight.w800,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: InkWell(
                                      onTap: () => _handleApprovalAction(reg.id, 'REJECT'),
                                      borderRadius: BorderRadius.circular(8),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(vertical: 8),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFEF4444),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            '✕ Tolak',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 11,
                                              fontWeight: FontWeight.w800,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        )
                      : Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                              ),
                              child: const Center(
                                child: Icon(Icons.person_outline_rounded, color: Color(0xFF2563EB), size: 20),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    reg.fullName,
                                    style: GoogleFonts.inter(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w800,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${reg.institution} • ${reg.email}',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            _buildStatusBadge(reg.status),
                            if (reg.status == 'PENDING_APPROVAL') ...[
                              InkWell(
                                onTap: () => _handleApprovalAction(reg.id, 'APPROVE'),
                                borderRadius: BorderRadius.circular(8),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Row(
                                    children: [
                                      Icon(Icons.check_rounded, color: Colors.white, size: 13),
                                      SizedBox(width: 4),
                                      Text(
                                        'ACC',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              InkWell(
                                onTap: () => _handleApprovalAction(reg.id, 'REJECT'),
                                borderRadius: BorderRadius.circular(8),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEF4444),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Row(
                                    children: [
                                      Icon(Icons.close_rounded, color: Colors.white, size: 13),
                                      SizedBox(width: 4),
                                      Text(
                                        'Tolak',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      margin: const EdgeInsets.only(right: 10),
      decoration: BoxDecoration(
        color: status == 'APPROVED'
            ? const Color(0xFFECFDF5)
            : status == 'REJECTED'
                ? const Color(0xFFFEF2F2)
                : const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: status == 'APPROVED'
              ? const Color(0xFFA7F3D0)
              : status == 'REJECTED'
                  ? const Color(0xFFFECDD3)
                  : const Color(0xFFFDE68A),
        ),
      ),
      child: Text(
        status == 'APPROVED'
            ? 'DISETUJUI (ACC)'
            : status == 'REJECTED'
                ? 'DITOLAK'
                : 'MENUNGGU ACC',
        style: GoogleFonts.inter(
          fontSize: 9,
          fontWeight: FontWeight.w800,
          color: status == 'APPROVED'
              ? const Color(0xFF065F46)
              : status == 'REJECTED'
                  ? const Color(0xFF9F1239)
                  : const Color(0xFF92400E),
        ),
      ),
    );
  }

  Widget _buildSearchBox(bool isDark, double width) {
    return Container(
      width: width,
      height: 36,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF020617) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.1) : const Color(0xFFCBD5E1),
        ),
      ),
      child: Row(
        children: [
          const Icon(Icons.search_rounded, size: 14, color: Color(0xFF94A3B8)),
          const SizedBox(width: 6),
          Expanded(
            child: TextField(
              onChanged: (val) => setState(() => _searchTerm = val),
              style: GoogleFonts.inter(
                fontSize: 11,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
              decoration: const InputDecoration(
                hintText: 'Cari nama, kampus, divisi...',
                hintStyle: TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTableHeader(String title, bool isDark) {
    return Text(
      title,
      style: GoogleFonts.inter(
        fontSize: 10,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.6,
        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
      ),
    );
  }

  Widget _buildFilterButton(String key, String title, bool isDark) {
    final isSelected = _filterType == key;
    return InkWell(
      onTap: () => setState(() => _filterType = key),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected
              ? (key == 'PRESENT'
                  ? const Color(0xFF10B981)
                  : key == 'LATE'
                      ? const Color(0xFFF59E0B)
                      : (isDark ? const Color(0xFF1E293B) : Colors.white))
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          boxShadow: isSelected && key == 'ALL'
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 4,
                  ),
                ]
              : null,
        ),
        child: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: isSelected
                ? (key == 'ALL' ? (isDark ? Colors.white : const Color(0xFF0F172A)) : Colors.white)
                : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
          ),
        ),
      ),
    );
  }

  Widget _buildApprovalFilterButton(String key, String title, bool isDark) {
    final isSelected = _approvalFilter == key;
    return InkWell(
      onTap: () => setState(() => _approvalFilter = key),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark ? const Color(0xFF1E293B) : Colors.white)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 4,
                  ),
                ]
              : null,
        ),
        child: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: isSelected
                ? (isDark ? Colors.white : const Color(0xFF0F172A))
                : (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
          ),
        ),
      ),
    );
  }
}
