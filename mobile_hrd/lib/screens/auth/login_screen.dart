import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../services/auth_service.dart';
import '../hrd/hrd_dashboard_screen.dart';

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
        _errorMessage = 'Silakan lengkapi email dan kata sandi staf HR.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final user = await AuthService().login(
        email: email,
        password: password,
        isAdmin: true,
      );

      if (!mounted) return;

      if (user.isAdmin) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HrdDashboardScreen()),
        );
      } else {
        setState(() {
          _errorMessage = 'Akun ini bukan akun supervisor / HRD resmi.';
        });
      }
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
          // 1. Base Silky-Smooth Pastel Sky Gradient (Matches Web #f8fbff)
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

          // Main Scrollable Area
          SafeArea(
            child: Column(
              children: [
                // Top Navigation Bar (Logo on left, Mode Terang/Gelap on right)
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
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 460),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Neo-Glassmorphism Card
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
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
                                  // Gradient Squircle Shield Icon (Matches Web)
                                  Container(
                                    width: 64,
                                    height: 64,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(22),
                                      gradient: const LinearGradient(
                                        begin: Alignment.bottomLeft,
                                        end: Alignment.topRight,
                                        colors: [
                                          Color(0xFF06B6D4), // cyan-500
                                          Color(0xFF0284C7), // sky-600
                                          Color(0xFF4F46E5), // indigo-600
                                        ],
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(0xFF06B6D4).withValues(alpha: 0.35),
                                          blurRadius: 18,
                                          offset: const Offset(0, 8),
                                        ),
                                      ],
                                      border: Border.all(
                                        color: Colors.white.withValues(alpha: 0.35),
                                        width: 1.2,
                                      ),
                                    ),
                                    child: const Center(
                                      child: Icon(
                                        Icons.shield_rounded,
                                        size: 32,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 14),

                                  // Badge: Akses Khusus Pembimbing & HRD
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? const Color(0xFF1E1B4B).withValues(alpha: 0.7)
                                          : const Color(0xFFEEF2FF),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: isDark
                                            ? const Color(0xFF3730A3)
                                            : const Color(0xFFC7D2FE),
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.vpn_key_rounded,
                                          size: 13,
                                          color: isDark ? const Color(0xFFA5B4FC) : const Color(0xFF4F46E5),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          'Akses Khusus Pembimbing & HRD',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: isDark ? const Color(0xFFA5B4FC) : const Color(0xFF3730A3),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 12),

                                  // Heading
                                  Text(
                                    'Portal Supervisor Magang',
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.inter(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w900,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 6),

                                  // Subtitle
                                  Text(
                                    'Masuk untuk memantau kehadiran siswa/mahasiswa magang, memverifikasi izin, dan melakukan ACC akun baru.',
                                    textAlign: TextAlign.center,
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w400,
                                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                      height: 1.45,
                                    ),
                                  ),
                                  const SizedBox(height: 22),

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

                                  // Form: Email Resmi Supervisor / HRD
                                  Align(
                                    alignment: Alignment.centerLeft,
                                    child: Text(
                                      'Email Resmi Supervisor / HRD',
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
                                        hintText: 'staf.hrd@asiaplastik.com',
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

                                  // Form: Kata Sandi Administrator
                                  Align(
                                    alignment: Alignment.centerLeft,
                                    child: Text(
                                      'Kata Sandi Administrator',
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
                                  const SizedBox(height: 24),

                                  // Big Gradient Action Button: Buka Konsol Monitoring HR
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
                                                      'Buka Konsol Monitoring HR',
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
