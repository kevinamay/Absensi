import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../models/attendance_model.dart';
import '../../services/auth_service.dart';
import '../../services/attendance_service.dart';
import '../../services/geofence_service.dart';
import '../auth/login_screen.dart';

class InternDashboardScreen extends StatefulWidget {
  const InternDashboardScreen({super.key});

  @override
  State<InternDashboardScreen> createState() => _InternDashboardScreenState();
}

class _InternDashboardScreenState extends State<InternDashboardScreen> {
  final _attendanceService = AttendanceService();
  final _authService = AuthService();

  late Timer _timer;
  String _currentTime = '';
  String _currentDate = '';

  // Geofence simulation state
  // Default to factory location: Kantor 2 CV. Asia Plastik (-7.3352907, 112.7565049)
  double _currentLat = -7.3352907;
  double _currentLng = 112.7565049;
  late GeofenceResult _geofence;

  // Form State
  String _mainStatus = 'HADIR'; // 'HADIR' | 'IZIN_DENGAN_KETERANGAN' | 'IZIN_TANPA_KETERANGAN'
  String _permissionCategory = 'IZIN'; // 'IZIN' | 'SAKIT'
  final String _checkInTime = '07:30';
  final String _checkOutTime = '16:30';
  final _reasonController = TextEditingController();
  bool _hasAttachment = false;
  bool _isSubmitting = false;

  List<AttendanceRecord> _todayRecords = [];

  @override
  void initState() {
    super.initState();
    _updateTime();
    _geofence = GeofenceService.checkGeofence(_currentLat, _currentLng);
    _loadRecords();

    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateTime();
    });
  }

  void _updateTime() {
    final now = DateTime.now();
    setState(() {
      _currentTime = _attendanceService.formatIndonesianTime(now);
      _currentDate = _attendanceService.formatIndonesianDate(now);
    });
  }

  void _loadRecords() {
    final user = _authService.currentUser;
    if (user != null) {
      setState(() {
        _todayRecords = _attendanceService.getTodayRecordsForIntern(user.uid);
      });
    }
  }

  void _setSimulatedLocation(bool insideFactory) {
    setState(() {
      if (insideFactory) {
        _currentLat = -7.3352907;
        _currentLng = 112.7565049;
      } else {
        // 2 km away from factory
        _currentLat = -7.3185000;
        _currentLng = 112.7420000;
      }
      _geofence = GeofenceService.checkGeofence(_currentLat, _currentLng);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          insideFactory
              ? 'GPS dialihkan: Di dalam area pabrik (${_geofence.distanceMeters.toStringAsFixed(1)}m)'
              : 'GPS dialihkan: Di luar area pabrik (${(_geofence.distanceMeters / 1000).toStringAsFixed(1)} km)',
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _handleSubmitAttendance() async {
    final user = _authService.currentUser;
    if (user == null) return;

    if (_mainStatus != 'HADIR' && _reasonController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan masukkan alasan izin atau sakit Anda.'),
          backgroundColor: AppTheme.statusAmber,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    await Future.delayed(const Duration(milliseconds: 600));

    try {
      await _attendanceService.submitAttendance(
        internId: user.uid,
        internName: user.displayName,
        internStudentId: user.studentId,
        institution: user.institution,
        division: user.division,
        mainStatus: _mainStatus,
        permissionSubCategory: _mainStatus != 'HADIR' ? _permissionCategory : null,
        checkInTime: _checkInTime,
        checkOutTime: _checkOutTime,
        permissionReason: _reasonController.text.trim(),
        permissionProofUrl: _hasAttachment ? 'simulated_proof_url.jpg' : null,
        latitude: _currentLat,
        longitude: _currentLng,
      );

      _loadRecords();

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Presensi berhasil dikirim dan tercatat di database!'),
          backgroundColor: AppTheme.statusGreen,
        ),
      );

      _reasonController.clear();
      setState(() {
        _hasAttachment = false;
      });
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  void _handleLogout() {
    _authService.logout();
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  void dispose() {
    _timer.cancel();
    _reasonController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = _authService.currentUser;

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
                  Icons.factory_rounded,
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
                  'CV. ASIA PLASTIK',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  'Portal Presensi Magang',
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
            icon: const Icon(Icons.logout_rounded, size: 20),
            tooltip: 'Keluar',
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: Container(
        decoration: AppTheme.softSkyBackground,
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: () async {
              _loadRecords();
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Realtime Clock Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0284C7), Color(0xFF0369A1)],
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primarySky.withValues(alpha: 0.25),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.access_time_rounded,
                                    color: Colors.white70, size: 14),
                                const SizedBox(width: 6),
                                Text(
                                  'WAKTU SISTEM (WIB)',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white70,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _currentTime,
                              style: GoogleFonts.inter(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              _currentDate,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Colors.white.withValues(alpha: 0.85),
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            'Jam Kerja\n07:30 - 16:30',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Intern Profile Card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              color: AppTheme.softSkyLight,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: const Color(0xFFBAE6FD)),
                            ),
                            child: const Icon(
                              Icons.person_rounded,
                              color: AppTheme.primarySky,
                              size: 28,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        user?.displayName ?? 'Peserta Magang',
                                        style: GoogleFonts.inter(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.textMain,
                                        ),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppTheme.statusGreenBg,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        'Aktif',
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.statusGreen,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  'NIM: ${user?.studentId ?? '-'} • ${user?.institution ?? '-'}',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    color: AppTheme.textMuted,
                                  ),
                                ),
                                Text(
                                  'Divisi: ${user?.division ?? 'Produksi & Mesin'}',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.primarySky,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // GPS & Geofence Validator Card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.location_on_rounded,
                                    color: _geofence.isWithinGeofence
                                        ? AppTheme.statusGreen
                                        : AppTheme.statusAmber,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Validasi Geofence Pabrik',
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.textMain,
                                    ),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: _geofence.isWithinGeofence
                                      ? AppTheme.statusGreenBg
                                      : AppTheme.statusAmberBg,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: _geofence.isWithinGeofence
                                        ? AppTheme.statusGreen.withValues(alpha: 0.3)
                                        : AppTheme.statusAmber.withValues(alpha: 0.3),
                                  ),
                                ),
                                child: Text(
                                  _geofence.isWithinGeofence
                                      ? 'Dalam Radius (< 150m)'
                                      : 'Di Luar Radius',
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: _geofence.isWithinGeofence
                                        ? AppTheme.statusGreen
                                        : AppTheme.statusAmber,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.softBlueTint,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Lokasi Terdekat: ${_geofence.closestOffice.name}',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.textMain,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  'Jarak Anda: ${_geofence.distanceMeters.toStringAsFixed(1)} meter dari gerbang pabrik.',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    color: AppTheme.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),
                          // Simulation GPS Toggle
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton.icon(
                                  icon: const Icon(Icons.check_circle_outline, size: 16),
                                  label: const Text('Simulasi Di Pabrik'),
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                  ),
                                  onPressed: () => _setSimulatedLocation(true),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: OutlinedButton.icon(
                                  icon: const Icon(Icons.location_off_outlined, size: 16),
                                  label: const Text('Simulasi Di Luar'),
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                    foregroundColor: AppTheme.textMuted,
                                  ),
                                  onPressed: () => _setSimulatedLocation(false),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Attendance Form Card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Formulir Presensi Harian',
                            style: GoogleFonts.inter(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textMain,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Pilih jenis status kehadiran dan konfirmasi data kehadiran Anda.',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              color: AppTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Status Selection Tabs
                          Row(
                            children: [
                              _buildStatusOption(
                                label: 'Hadir',
                                icon: Icons.check_circle_rounded,
                                isSelected: _mainStatus == 'HADIR',
                                onTap: () => setState(() => _mainStatus = 'HADIR'),
                              ),
                              const SizedBox(width: 8),
                              _buildStatusOption(
                                label: 'Izin',
                                icon: Icons.description_rounded,
                                isSelected: _mainStatus == 'IZIN_DENGAN_KETERANGAN',
                                onTap: () => setState(() {
                                  _mainStatus = 'IZIN_DENGAN_KETERANGAN';
                                  _permissionCategory = 'IZIN';
                                }),
                              ),
                              const SizedBox(width: 8),
                              _buildStatusOption(
                                label: 'Sakit',
                                icon: Icons.medical_services_rounded,
                                isSelected: _mainStatus == 'IZIN_TANPA_KETERANGAN' ||
                                    (_mainStatus == 'IZIN_DENGAN_KETERANGAN' &&
                                        _permissionCategory == 'SAKIT'),
                                onTap: () => setState(() {
                                  _mainStatus = 'IZIN_DENGAN_KETERANGAN';
                                  _permissionCategory = 'SAKIT';
                                }),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Conditional Reason Field
                          if (_mainStatus != 'HADIR') ...[
                            Text(
                              'Alasan / Keterangan Izin',
                              style: GoogleFonts.inter(
                                  fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 6),
                            TextField(
                              controller: _reasonController,
                              maxLines: 2,
                              decoration: InputDecoration(
                                hintText: _permissionCategory == 'SAKIT'
                                    ? 'Jelaskan keluhan sakit / istirahat dokter...'
                                    : 'Jelaskan keperluan izin magang...',
                              ),
                            ),
                            const SizedBox(height: 12),
                            // Attachment simulation
                            InkWell(
                              onTap: () {
                                setState(() {
                                  _hasAttachment = !_hasAttachment;
                                });
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 10),
                                decoration: BoxDecoration(
                                  color: _hasAttachment
                                      ? AppTheme.statusGreenBg
                                      : AppTheme.softBlueTint,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: _hasAttachment
                                        ? AppTheme.statusGreen
                                        : AppTheme.borderLight,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      _hasAttachment
                                          ? Icons.attach_file_rounded
                                          : Icons.add_photo_alternate_outlined,
                                      size: 18,
                                      color: _hasAttachment
                                          ? AppTheme.statusGreen
                                          : AppTheme.primarySky,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        _hasAttachment
                                            ? 'Foto Surat / Bukti Medis Terlampir'
                                            : 'Lampirkan Foto Surat Keterangan / Resep',
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                          color: _hasAttachment
                                              ? AppTheme.statusGreen
                                              : AppTheme.textMain,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                          ],

                          // Submit Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isSubmitting ? null : _handleSubmitAttendance,
                              child: _isSubmitting
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                            Colors.white),
                                      ),
                                    )
                                  : Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          _mainStatus == 'HADIR'
                                              ? Icons.send_rounded
                                              : Icons.note_add_rounded,
                                          size: 18,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(_mainStatus == 'HADIR'
                                            ? 'Kirim Presensi Masuk Sekarang'
                                            : 'Kirim Permohonan Izin'),
                                      ],
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Today's Attendance Log List
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  const Icon(Icons.history_rounded,
                                      color: AppTheme.primarySky, size: 20),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Riwayat Presensi Hari Ini',
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.textMain,
                                    ),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppTheme.softSkyLight,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${_todayRecords.length} Catatan',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.primarySky,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 24),

                          if (_todayRecords.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 24),
                              child: Center(
                                child: Column(
                                  children: [
                                    const Icon(Icons.event_busy_rounded,
                                        color: AppTheme.textMuted, size: 36),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Belum ada catatan presensi hari ini.\nSilakan isi form di atas.',
                                      textAlign: TextAlign.center,
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: AppTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          else
                            ListView.separated(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _todayRecords.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (context, index) {
                                final record = _todayRecords[index];
                                final isLate = record.status == 'LATE';
                                final isPresent = record.mainStatus == 'HADIR';

                                return Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: AppTheme.softBlueTint,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(color: AppTheme.borderLight),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: isPresent
                                              ? (isLate
                                                  ? AppTheme.statusAmberBg
                                                  : AppTheme.statusGreenBg)
                                              : AppTheme.statusBlueBg,
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Icon(
                                          isPresent
                                              ? (isLate
                                                  ? Icons.access_time_rounded
                                                  : Icons.check_circle_rounded)
                                              : Icons.medical_services_rounded,
                                          size: 20,
                                          color: isPresent
                                              ? (isLate
                                                  ? AppTheme.statusAmber
                                                  : AppTheme.statusGreen)
                                              : AppTheme.statusBlue,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              isPresent
                                                  ? (isLate
                                                      ? 'Hadir Terlambat'
                                                      : 'Hadir Tepat Waktu')
                                                  : 'Izin: ${record.permissionSubCategory ?? 'Keterangan'}',
                                              style: GoogleFonts.inter(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w700,
                                                color: AppTheme.textMain,
                                              ),
                                            ),
                                            Text(
                                              'Jam: ${record.formattedTime} • ${record.officeName ?? 'Pabrik'}',
                                              style: GoogleFonts.inter(
                                                fontSize: 11,
                                                color: AppTheme.textMuted,
                                              ),
                                            ),
                                          ],
                                        ),
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
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusOption({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.primarySky : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppTheme.primarySky : AppTheme.borderLight,
            ),
          ),
          child: Column(
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? Colors.white : AppTheme.textMuted,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white : AppTheme.textMain,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
