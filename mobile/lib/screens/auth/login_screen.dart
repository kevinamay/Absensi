import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../config/app_theme.dart';
import '../../services/auth_service.dart';
import '../intern/intern_dashboard_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _errorMessage;

  // Real-time WIB Clock
  late Timer _clockTimer;
  String _timeStr = '';

  // Geolocation mock/live state
  bool _isGeoLoading = false;
  int _distanceMeters = 89;
  final int _allowedRadius = 150;

  @override
  void initState() {
    super.initState();
    _updateClock();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) => _updateClock());
  }

  void _updateClock() {
    final now = DateTime.now().toUtc().add(const Duration(hours: 7)); // WIB (UTC+7)
    final formatted = DateFormat('HH.mm.ss').format(now);
    if (mounted) {
      setState(() {
        _timeStr = '$formatted WIB';
      });
    }
  }

  void _refreshLocation() async {
    setState(() {
      _isGeoLoading = true;
    });
    await Future.delayed(const Duration(milliseconds: 700));
    if (mounted) {
      setState(() {
        _distanceMeters = 85 + (DateTime.now().second % 15);
        _isGeoLoading = false;
      });
    }
  }

  void _toggleTheme() {
    final current = themeModeNotifier.value;
    final next = current == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    themeModeNotifier.value = next;
    setState(() {});
  }

  Future<void> _handleLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(() {
        _errorMessage = 'Mohon masukkan email dan kata sandi Anda.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await AuthService().login(
        email: email,
        password: password,
        isAdmin: false,
      );

      if (!mounted) return;

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const InternDashboardScreen()),
      );
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _clockTimer.cancel();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = themeModeNotifier.value == ThemeMode.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF020617) : const Color(0xFFF8FBFF),
      body: Stack(
        children: [
          // 1. Base Silky-Smooth Pastel Sky Gradient (Matches Web #f8fbff with soft azure tint)
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? const [
                          Color(0xFF020617), // slate-950
                          Color(0xFF0B132B),
                          Color(0xFF020617),
                        ]
                      : const [
                          Color(0xFFE0F2FE), // Sky-100 (Lembut cerah di pojok kiri atas)
                          Color(0xFFF0F9FF), // Sky-50
                          Color(0xFFF8FBFF), // Soft white
                          Color(0xFFEBF5FF), // Azure tint
                          Color(0xFFE0F7FA), // Soft cyan tint di kanan bawah
                        ],
                ),
              ),
            ),
          ),

          // 2. Gaussian-Blurred Organic Floating Aurora Glows (Matches Tailwind blur-3xl with NO grey halos)
          Positioned.fill(
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 85, sigmaY: 85),
              child: Stack(
                children: [
                  // Top-Right Aurora Cloud (Sky-300 / Cyan-200)
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

                  // Bottom-Left Aurora Cloud (Blue-300 / Indigo-200)
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

                  // Center-Left Subtle Accent (Cyan-200)
                  Positioned(
                    top: 100,
                    left: 20,
                    child: Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDark
                            ? const Color(0xFF0E7490).withValues(alpha: 0.1)
                            : const Color(0xFFA5F3FC).withValues(alpha: 0.35),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Main Scrollable Area
          SafeArea(
            child: Column(
              children: [
                // Top Navigation Bar (Logo on left, Mode Terang/Gelap button on right)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Corporate Logo Brand (Matches Web filter: brightness-0 in light, brightness-100 in dark)
                      Image.asset(
                        'assets/images/logo.webp',
                        height: 40,
                        fit: BoxFit.contain,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                        colorBlendMode: BlendMode.srcIn,
                        errorBuilder: (_, __, ___) => Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.factory_rounded,
                              size: 28,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'ASIA PLASTIK',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Interactive Mode Terang / Gelap Pill Button
                      Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: _toggleTheme,
                          borderRadius: BorderRadius.circular(20),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF0F172A).withValues(alpha: 0.9)
                                  : Colors.white.withValues(alpha: 0.85),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isDark
                                    ? const Color(0xFF334155)
                                    : const Color(0xFFE2E8F0),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.03),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  isDark ? Icons.light_mode_rounded : Icons.dark_mode_outlined,
                                  size: 15,
                                  color: isDark ? const Color(0xFFFBBF24) : const Color(0xFF334155),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  isDark ? 'Mode Gelap' : 'Mode Terang',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: isDark ? const Color(0xFFF1F5F9) : const Color(0xFF334155),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Center Card Area
                Expanded(
                  child: Center(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 440),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Neo-Glassmorphism Card
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 28),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF0F172A).withValues(alpha: 0.85)
                                    : Colors.white.withValues(alpha: 0.88),
                                borderRadius: BorderRadius.circular(36),
                                border: Border.all(
                                  color: isDark
                                      ? Colors.white.withValues(alpha: 0.1)
                                      : Colors.white,
                                  width: 1.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: isDark
                                        ? Colors.black.withValues(alpha: 0.5)
                                        : const Color(0xFF38BDF8).withValues(alpha: 0.16),
                                    blurRadius: 40,
                                    offset: const Offset(0, 16),
                                  ),
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.04),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  // Badge: Portal Magang Kemnaker RI
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF3B82F6).withValues(alpha: 0.2)
                                          : const Color(0xFF3B82F6).withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: isDark
                                            ? const Color(0xFF3B82F6).withValues(alpha: 0.5)
                                            : const Color(0xFF3B82F6).withValues(alpha: 0.3),
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.school_rounded,
                                          size: 14,
                                          color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF1D4ED8),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          'Portal Magang Kemnaker RI',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF1D4ED8),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 12),

                                  // Heading
                                  Text(
                                    'Masuk ke Presensi',
                                    style: GoogleFonts.inter(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w900,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),

                                  // Subtitle
                                  Text(
                                    'Kantor 1 (PT. Asia Plastik) & Kantor 2 (CV. Asia Plastik)',
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                    ),
                                  ),
                                  const SizedBox(height: 20),

                                  // Real-time Stats Bar (2 Columns: Waktu & Radius Lokasi)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? Colors.white.withValues(alpha: 0.05)
                                          : const Color(0xFF0F172A).withValues(alpha: 0.04),
                                      borderRadius: BorderRadius.circular(18),
                                      border: Border.all(
                                        color: isDark
                                            ? Colors.white.withValues(alpha: 0.1)
                                            : const Color(0xFF0F172A).withValues(alpha: 0.08),
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        // Left: Waktu Operasional
                                        Expanded(
                                          child: Column(
                                            children: [
                                              Text(
                                                'Waktu Operasional',
                                                style: GoogleFonts.inter(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w600,
                                                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                                ),
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                _timeStr.isEmpty ? '09.03.05 WIB' : _timeStr,
                                                style: GoogleFonts.robotoMono(
                                                  fontSize: 13,
                                                  fontWeight: FontWeight.w900,
                                                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),

                                        // Divider Line
                                        Container(
                                          height: 32,
                                          width: 1,
                                          color: isDark
                                              ? Colors.white.withValues(alpha: 0.12)
                                              : const Color(0xFF0F172A).withValues(alpha: 0.12),
                                        ),

                                        // Right: Radius Lokasi (Clickable to refresh)
                                        Expanded(
                                          child: InkWell(
                                            onTap: _isGeoLoading ? null : _refreshLocation,
                                            borderRadius: BorderRadius.circular(12),
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(vertical: 2),
                                              child: Column(
                                                children: [
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.center,
                                                    children: [
                                                      Text(
                                                        'Radius Lokasi (${_allowedRadius}m)',
                                                        style: GoogleFonts.inter(
                                                          fontSize: 10,
                                                          fontWeight: FontWeight.w600,
                                                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                                        ),
                                                      ),
                                                      const SizedBox(width: 4),
                                                      _isGeoLoading
                                                          ? const SizedBox(
                                                              width: 10,
                                                              height: 10,
                                                              child: CircularProgressIndicator(
                                                                strokeWidth: 1.5,
                                                                color: Color(0xFF0284C7),
                                                              ),
                                                            )
                                                          : Icon(
                                                              Icons.refresh_rounded,
                                                              size: 11,
                                                              color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                                                            ),
                                                    ],
                                                  ),
                                                  const SizedBox(height: 2),
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.center,
                                                    children: [
                                                      Container(
                                                        width: 7,
                                                        height: 7,
                                                        decoration: BoxDecoration(
                                                          color: const Color(0xFF10B981),
                                                          shape: BoxShape.circle,
                                                          boxShadow: [
                                                            BoxShadow(
                                                              color: const Color(0xFF10B981).withValues(alpha: 0.4),
                                                              blurRadius: 4,
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                      const SizedBox(width: 5),
                                                      Text(
                                                        '${_distanceMeters}m OK',
                                                        style: GoogleFonts.robotoMono(
                                                          fontSize: 13,
                                                          fontWeight: FontWeight.w900,
                                                          color: isDark ? const Color(0xFF34D399) : const Color(0xFF059669),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 20),

                                  // Error Message Banner if any
                                  if (_errorMessage != null) ...[
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      margin: const EdgeInsets.only(bottom: 16),
                                      decoration: BoxDecoration(
                                        color: AppTheme.statusRedBg,
                                        borderRadius: BorderRadius.circular(14),
                                        border: Border.all(
                                          color: AppTheme.statusRed.withValues(alpha: 0.3),
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          const Icon(
                                            Icons.error_outline_rounded,
                                            size: 18,
                                            color: AppTheme.statusRed,
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Text(
                                              _errorMessage!,
                                              style: GoogleFonts.inter(
                                                fontSize: 12,
                                                color: AppTheme.statusRed,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],

                                  // Form: Email SIAPkerja / MagangHub
                                  Align(
                                    alignment: Alignment.centerLeft,
                                    child: Text(
                                      'Email SIAPkerja / MagangHub',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF020617).withValues(alpha: 0.8)
                                          : Colors.white.withValues(alpha: 0.9),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isDark
                                            ? Colors.white.withValues(alpha: 0.12)
                                            : const Color(0xFFE0F2FE),
                                      ),
                                    ),
                                    child: TextField(
                                      controller: _emailController,
                                      keyboardType: TextInputType.emailAddress,
                                      style: GoogleFonts.inter(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      ),
                                      decoration: InputDecoration(
                                        hintText: 'contoh: ahmad.fauzi@kemnaker.maganghub.id',
                                        hintStyle: GoogleFonts.inter(
                                          fontSize: 12,
                                          color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                                        ),
                                        prefixIcon: Icon(
                                          Icons.mail_outline_rounded,
                                          size: 18,
                                          color: isDark ? const Color(0xFF22D3EE) : const Color(0xFF0891B2),
                                        ),
                                        border: InputBorder.none,
                                        contentPadding: const EdgeInsets.symmetric(
                                          horizontal: 14,
                                          vertical: 14,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 16),

                                  // Form: Kata Sandi + Lupa Kata Sandi Row
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Kata Sandi',
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                                        ),
                                      ),
                                      InkWell(
                                        onTap: () {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                'Untuk reset sandi MagangHub, silakan hubungi tim HRD CV. Asia Plastik.',
                                              ),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          'Lupa kata sandi?',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                            color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF2563EB),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF020617).withValues(alpha: 0.8)
                                          : Colors.white.withValues(alpha: 0.9),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isDark
                                            ? Colors.white.withValues(alpha: 0.12)
                                            : const Color(0xFFE0F2FE),
                                      ),
                                    ),
                                    child: TextField(
                                      controller: _passwordController,
                                      obscureText: _obscurePassword,
                                      style: GoogleFonts.inter(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      ),
                                      decoration: InputDecoration(
                                        hintText: '••••••••••••',
                                        hintStyle: GoogleFonts.inter(
                                          fontSize: 12,
                                          color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                                        ),
                                        prefixIcon: Icon(
                                          Icons.lock_outline_rounded,
                                          size: 18,
                                          color: isDark ? const Color(0xFF22D3EE) : const Color(0xFF0891B2),
                                        ),
                                        suffixIcon: IconButton(
                                          icon: Icon(
                                            _obscurePassword
                                                ? Icons.visibility_off_outlined
                                                : Icons.visibility_outlined,
                                            size: 18,
                                            color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                                          ),
                                          onPressed: () {
                                            setState(() {
                                              _obscurePassword = !_obscurePassword;
                                            });
                                          },
                                        ),
                                        border: InputBorder.none,
                                        contentPadding: const EdgeInsets.symmetric(
                                          horizontal: 14,
                                          vertical: 14,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 22),

                                  // Big Gradient Action Button: Masuk ke Portal Presensi
                                  Container(
                                    width: double.infinity,
                                    height: 50,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(16),
                                      gradient: const LinearGradient(
                                        colors: [
                                          Color(0xFF0891B2), // cyan-600
                                          Color(0xFF2563EB), // blue-600
                                          Color(0xFF4F46E5), // indigo-600
                                        ],
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(0xFF0891B2).withValues(alpha: isDark ? 0.4 : 0.3),
                                          blurRadius: 18,
                                          offset: const Offset(0, 8),
                                        ),
                                      ],
                                      border: Border.all(
                                        color: const Color(0xFF22D3EE).withValues(alpha: 0.35),
                                        width: 1,
                                      ),
                                    ),
                                    child: Material(
                                      color: Colors.transparent,
                                      child: InkWell(
                                        onTap: _isLoading ? null : _handleLogin,
                                        borderRadius: BorderRadius.circular(16),
                                        child: Center(
                                          child: _isLoading
                                              ? const SizedBox(
                                                  width: 20,
                                                  height: 20,
                                                  child: CircularProgressIndicator(
                                                    strokeWidth: 2,
                                                    valueColor: AlwaysStoppedAnimation<Color>(
                                                      Colors.white,
                                                    ),
                                                  ),
                                                )
                                              : Row(
                                                  mainAxisAlignment: MainAxisAlignment.center,
                                                  children: [
                                                    const Icon(
                                                      Icons.lock_outline_rounded,
                                                      size: 16,
                                                      color: Colors.white,
                                                    ),
                                                    const SizedBox(width: 8),
                                                    Text(
                                                      'Masuk ke Portal Presensi',
                                                      style: GoogleFonts.inter(
                                                        fontSize: 14,
                                                        fontWeight: FontWeight.w800,
                                                        color: Colors.white,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 18),

                                  // Link: Peserta Baru? Buat & Aktivasi Sandi Akun Magang ->
                                  InkWell(
                                    onTap: () {
                                      Navigator.of(context).push(
                                        MaterialPageRoute(
                                          builder: (_) => const RegisterScreen(),
                                        ),
                                      );
                                    },
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          'Peserta Baru? Buat & Aktivasi Sandi Akun Magang',
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                            color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF2563EB),
                                          ),
                                        ),
                                        const SizedBox(width: 5),
                                        Icon(
                                          Icons.arrow_forward_rounded,
                                          size: 14,
                                          color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF2563EB),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),

                            // Footer Info
                            Text(
                              'CV. Asia Plastik • Gedung & Pabrik Injection Moulding Sidoarjo',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                              ),
                            ),
                            const SizedBox(height: 10),
                          ],
                        ),
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
}
