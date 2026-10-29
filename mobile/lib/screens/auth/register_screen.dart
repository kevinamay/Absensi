import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../services/auth_service.dart';
import 'otp_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _fullNameController = TextEditingController();
  final _institutionController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _isLoading = false;
  String? _errorMessage;

  // Real-time Password Strength meter calculation
  int _getPasswordStrength() {
    final pass = _passwordController.text;
    if (pass.isEmpty) return 0;
    int score = 0;
    if (pass.length >= 6) score += 33;
    if (RegExp(r'[A-Z0-9]').hasMatch(pass)) score += 34;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(pass) && pass.length >= 8) score += 33;
    return score;
  }

  void _toggleTheme() {
    final current = themeModeNotifier.value;
    final next = current == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    themeModeNotifier.value = next;
    setState(() {});
  }

  bool _validateForm() {
    setState(() {
      _errorMessage = null;
    });

    final name = _fullNameController.text.trim();
    if (name.length < 3) {
      setState(() {
        _errorMessage = 'Silakan masukkan nama lengkap Anda (minimal 3 karakter).';
      });
      return false;
    }

    final inst = _institutionController.text.trim();
    if (inst.length < 3) {
      setState(() {
        _errorMessage = 'Silakan masukkan asal sekolah / universitas Anda.';
      });
      return false;
    }

    final email = _emailController.text.trim().toLowerCase();
    final emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    if (!emailRegex.hasMatch(email)) {
      setState(() {
        _errorMessage = 'Format email tidak valid. Pastikan penulisan email Anda benar.';
      });
      return false;
    }

    final pass = _passwordController.text;
    if (pass.length < 6) {
      setState(() {
        _errorMessage = 'Kata sandi harus terdiri dari minimal 6 karakter.';
      });
      return false;
    }

    final confirm = _confirmPasswordController.text;
    if (pass != confirm) {
      setState(() {
        _errorMessage = 'Konfirmasi kata sandi tidak cocok. Pastikan kedua kolom sama.';
      });
      return false;
    }

    return true;
  }

  Future<void> _handleRegister() async {
    if (!_validateForm()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final email = _emailController.text.trim().toLowerCase();
      final name = _fullNameController.text.trim();
      final inst = _institutionController.text.trim();

      final otp = await AuthService().requestOtp(
        email: email,
        fullName: name,
        institution: inst,
      );

      if (!mounted) return;

      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => OtpScreen(
            email: email,
            fullName: name,
            institution: inst,
            nim: '-',
            division: 'Produksi & Mesin',
            phone: '-',
            presetOtp: otp,
          ),
        ),
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
    _fullNameController.dispose();
    _institutionController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = themeModeNotifier.value == ThemeMode.dark;
    final strength = _getPasswordStrength();

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
                  stops: const [0.0, 0.25, 0.55, 0.85, 1.0],
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
                      // Corporate Logo Brand (Clickable to go back)
                      InkWell(
                        onTap: () => Navigator.of(context).pop(),
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          'assets/images/logo.webp',
                          height: 40,
                          fit: BoxFit.contain,
                          color: isDark ? Colors.white : const Color(0xFF0F172A),
                          colorBlendMode: BlendMode.srcIn,
                          errorBuilder: (_, __, ___) => Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.arrow_back_rounded,
                                size: 20,
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

                // Center Dual-Pane Glassmorphic Card Container
                Expanded(
                  child: Center(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          final isWide = constraints.maxWidth >= 760;

                          return ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 960),
                            child: Column(
                              children: [
                                // Dual Pane Card
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 300),
                                  padding: EdgeInsets.all(isWide ? 34 : 24),
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
                                    ],
                                  ),
                                  child: isWide
                                      ? Row(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            // LEFT PANE: Information & Stepper Guide
                                            Expanded(
                                              flex: 5,
                                              child: _buildLeftInfoPane(isDark),
                                            ),

                                            // Divider
                                            Container(
                                              width: 1,
                                              height: 520,
                                              margin: const EdgeInsets.symmetric(horizontal: 28),
                                              color: isDark
                                                  ? Colors.white.withValues(alpha: 0.1)
                                                  : const Color(0xFFE2E8F0),
                                            ),

                                            // RIGHT PANE: Registration Form
                                            Expanded(
                                              flex: 7,
                                              child: _buildRightFormPane(isDark, strength),
                                            ),
                                          ],
                                        )
                                      : Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            _buildLeftInfoPane(isDark),
                                            const SizedBox(height: 24),
                                            Divider(
                                              color: isDark
                                                  ? Colors.white.withValues(alpha: 0.1)
                                                  : const Color(0xFFE2E8F0),
                                            ),
                                            const SizedBox(height: 20),
                                            _buildRightFormPane(isDark, strength),
                                          ],
                                        ),
                                ),
                                const SizedBox(height: 16),

                                // Footer
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
                          );
                        },
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

  // LEFT PANE WIDGET
  Widget _buildLeftInfoPane(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // H1 Title
        Text(
          'Pendaftaran Akun\nPresensi',
          style: GoogleFonts.inter(
            fontSize: 26,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
            height: 1.15,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 20),

        // Stepper Card
        Container(
          padding: const EdgeInsets.all(16),
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'TAHAPAN PENDAFTARAN & AKTIVASI:',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.8,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 14),

              // Step 1
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF2563EB).withValues(alpha: 0.4),
                          blurRadius: 6,
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Text(
                        '1',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '1. Isi Data Diri & Akun (Saat ini)',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF2563EB),
                          ),
                        ),
                        Text(
                          'Nama lengkap, asal sekolah/kampus, email & sandi',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Step 2
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '2',
                        style: TextStyle(
                          color: isDark ? Colors.white : const Color(0xFF475569),
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '2. Persetujuan (ACC) oleh HRD',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
                          ),
                        ),
                        Text(
                          'HRD meninjau permohonan di dashboard sebelum dapat login',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Trust badge
        Row(
          children: [
            const Icon(
              Icons.verified_user_rounded,
              size: 16,
              color: Color(0xFF10B981),
            ),
            const SizedBox(width: 8),
            Text(
              'Pendaftaran Langsung & Persetujuan HRD Terpadu',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // RIGHT PANE WIDGET
  Widget _buildRightFormPane(bool isDark, int strength) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Badge: Formulir Pendaftaran Magang
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: isDark
                ? const Color(0xFF1E3A8A).withValues(alpha: 0.3)
                : const Color(0xFFEFF6FF),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDark ? const Color(0xFF1E40AF) : const Color(0xFFBFDBFE),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.school_rounded,
                size: 13,
                color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF1D4ED8),
              ),
              const SizedBox(width: 6),
              Text(
                'Formulir Pendaftaran Magang',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF1D4ED8),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),

        // Heading
        Text(
          'Daftar Akun Baru',
          style: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : const Color(0xFF0F172A),
            letterSpacing: -0.4,
          ),
        ),
        const SizedBox(height: 18),

        // Error message if any
        if (_errorMessage != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.only(bottom: 14),
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

        // Input 1: Nama Lengkap
        _buildInputField(
          label: 'Nama Lengkap Sesuai KTP / KTM',
          hint: 'contoh: Kevin Christian Amay',
          icon: Icons.person_outline_rounded,
          controller: _fullNameController,
          isDark: isDark,
        ),
        const SizedBox(height: 14),

        // Input 2: Asal Sekolah / Universitas
        _buildInputField(
          label: 'Asal Sekolah / Universitas',
          hint: 'contoh: Universitas Negeri Surabaya / SMKN 1 Sidoarjo',
          icon: Icons.account_balance_outlined,
          controller: _institutionController,
          isDark: isDark,
        ),
        const SizedBox(height: 14),

        // Input 3: Alamat Email Magang
        _buildInputField(
          label: 'Alamat Email Magang (Untuk Menerima OTP)',
          hint: 'contoh: kevin.magang@gmail.com',
          icon: Icons.mail_outline_rounded,
          controller: _emailController,
          isDark: isDark,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 14),

        // Input 4: Kata Sandi Baru
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Kata Sandi Baru (New Password)',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
              ),
            ),
            const SizedBox(height: 6),
            Container(
              decoration: BoxDecoration(
                color: isDark
                    ? const Color(0xFF020617).withValues(alpha: 0.8)
                    : Colors.white.withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isDark
                      ? Colors.white.withValues(alpha: 0.15)
                      : const Color(0xFFCBD5E1),
                ),
              ),
              child: TextField(
                controller: _passwordController,
                obscureText: !_showPassword,
                onChanged: (_) => setState(() {}),
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
                decoration: InputDecoration(
                  hintText: 'Minimal 6 karakter',
                  hintStyle: GoogleFonts.inter(
                    fontSize: 12,
                    color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                  ),
                  prefixIcon: Icon(
                    Icons.lock_outline_rounded,
                    size: 18,
                    color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF2563EB),
                  ),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _showPassword
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      size: 18,
                      color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                    ),
                    onPressed: () => setState(() => _showPassword = !_showPassword),
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
            ),
            if (_passwordController.text.isNotEmpty) ...[
              const SizedBox(height: 5),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: strength / 100,
                  minHeight: 3.5,
                  backgroundColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    strength <= 33
                        ? const Color(0xFFEF4444)
                        : strength <= 67
                            ? const Color(0xFFF59E0B)
                            : const Color(0xFF10B981),
                  ),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 14),

        // Input 5: Konfirmasi Kata Sandi
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Konfirmasi Kata Sandi (Confirm Password)',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
              ),
            ),
            const SizedBox(height: 6),
            Container(
              decoration: BoxDecoration(
                color: isDark
                    ? const Color(0xFF020617).withValues(alpha: 0.8)
                    : Colors.white.withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isDark
                      ? Colors.white.withValues(alpha: 0.15)
                      : const Color(0xFFCBD5E1),
                ),
              ),
              child: TextField(
                controller: _confirmPasswordController,
                obscureText: !_showConfirmPassword,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: isDark ? Colors.white : const Color(0xFF0F172A),
                ),
                decoration: InputDecoration(
                  hintText: 'Ulangi kata sandi baru',
                  hintStyle: GoogleFonts.inter(
                    fontSize: 12,
                    color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                  ),
                  prefixIcon: Icon(
                    Icons.lock_outline_rounded,
                    size: 18,
                    color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF2563EB),
                  ),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _showConfirmPassword
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      size: 18,
                      color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
                    ),
                    onPressed: () =>
                        setState(() => _showConfirmPassword = !_showConfirmPassword),
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Security Warning Note Box
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF59E0B).withValues(alpha: isDark ? 0.15 : 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFFF59E0B).withValues(alpha: 0.35),
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(
                Icons.warning_amber_rounded,
                size: 16,
                color: Color(0xFFD97706),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'For your security, please create a new password for this application. DO NOT use your MagangHub/SIAPkerja password.',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? const Color(0xFFFDE68A) : const Color(0xFF92400E),
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Big Action Button: Daftar & Terima Kode OTP
        Container(
          width: double.infinity,
          height: 48,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            gradient: const LinearGradient(
              colors: [
                Color(0xFF1D4ED8), // blue-700
                Color(0xFF2563EB), // blue-600
                Color(0xFF4338CA), // indigo-700
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1D4ED8).withValues(alpha: 0.35),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
            border: Border.all(
              color: const Color(0xFF60A5FA).withValues(alpha: 0.35),
              width: 1,
            ),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: _isLoading ? null : _handleRegister,
              borderRadius: BorderRadius.circular(14),
              child: Center(
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.person_add_outlined,
                            size: 16,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Daftar & Terima Kode OTP',
                            style: GoogleFonts.inter(
                              fontSize: 13,
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
        const SizedBox(height: 16),

        // Bottom link back to login
        Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Sudah pernah mengaktifkan akun? ',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                ),
              ),
              InkWell(
                onTap: () => Navigator.of(context).pop(),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Masuk di sini',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF2563EB),
                      ),
                    ),
                    const SizedBox(width: 3),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 13,
                      color: isDark ? const Color(0xFF38BDF8) : const Color(0xFF2563EB),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInputField({
    required String label,
    required String hint,
    required IconData icon,
    required TextEditingController controller,
    required bool isDark,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: isDark ? const Color(0xFFE2E8F0) : const Color(0xFF334155),
          ),
        ),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: isDark
                ? const Color(0xFF020617).withValues(alpha: 0.8)
                : Colors.white.withValues(alpha: 0.9),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isDark
                  ? Colors.white.withValues(alpha: 0.15)
                  : const Color(0xFFCBD5E1),
            ),
          ),
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: GoogleFonts.inter(
                fontSize: 12,
                color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8),
              ),
              prefixIcon: Icon(
                icon,
                size: 18,
                color: isDark ? const Color(0xFF60A5FA) : const Color(0xFF2563EB),
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
        ),
      ],
    );
  }
}
