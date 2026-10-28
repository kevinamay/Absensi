import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../services/auth_service.dart';
import 'login_screen.dart';

class OtpScreen extends StatefulWidget {
  final String email;
  final String fullName;
  final String institution;
  final String nim;
  final String division;
  final String phone;
  final String presetOtp;

  const OtpScreen({
    super.key,
    required this.email,
    required this.fullName,
    required this.institution,
    required this.nim,
    required this.division,
    required this.phone,
    required this.presetOtp,
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _otpController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    // Auto-fill preset OTP for convenient testing
    _otpController.text = widget.presetOtp;
  }

  Future<void> _handleVerifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.length < 6) {
      setState(() {
        _errorMessage = 'Masukkan 6 digit kode OTP secara lengkap.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await AuthService().verifyOtpAndRegister(
        email: widget.email,
        otp: otp,
        fullName: widget.fullName,
        institution: widget.institution,
        nim: widget.nim,
        division: widget.division,
        phone: widget.phone,
      );

      if (!mounted) return;

      // Show success dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.check_circle_rounded,
                  color: AppTheme.statusGreen, size: 28),
              const SizedBox(width: 10),
              Text(
                'Pendaftaran Berhasil',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textMain,
                ),
              ),
            ],
          ),
          content: Text(
            'Data pendaftaran akun magang Anda telah diterima oleh sistem CV. Asia Plastik. Akun Anda saat ini masuk ke antrean persetujuan (ACC) personalia HRD.',
            style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textMuted),
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
              child: const Text('Kembali ke Halaman Masuk'),
            ),
          ],
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
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Verifikasi Email OTP'),
      ),
      body: Container(
        decoration: AppTheme.softSkyBackground,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 10),
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppTheme.softSkyLight,
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFBAE6FD), width: 2),
                  ),
                  child: const Icon(
                    Icons.mark_email_read_rounded,
                    color: AppTheme.primarySky,
                    size: 34,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  'Masukkan Kode OTP',
                  style: GoogleFonts.inter(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textMain,
                  ),
                ),
                const SizedBox(height: 6),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'Kode verifikasi telah dikirimkan ke email Anda:\n${widget.email}',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: AppTheme.textMuted,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // OTP Quick Info Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppTheme.statusGreenBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.statusGreen.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.vpn_key_rounded,
                          size: 16, color: AppTheme.statusGreen),
                      const SizedBox(width: 8),
                      Text(
                        'Kode OTP Anda: ${widget.presetOtp}',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.statusGreen,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(22),
                    child: Column(
                      children: [
                        if (_errorMessage != null) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.statusRedBg,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              _errorMessage!,
                              style: GoogleFonts.inter(
                                color: AppTheme.statusRed,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        Text(
                          '6-Digit Kode Verifikasi',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textMain,
                          ),
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          controller: _otpController,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          maxLength: 6,
                          style: GoogleFonts.inter(
                            fontSize: 24,
                            letterSpacing: 10,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.primarySky,
                          ),
                          decoration: const InputDecoration(
                            counterText: '',
                            hintText: '••••••',
                          ),
                        ),
                        const SizedBox(height: 24),

                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleVerifyOtp,
                            child: _isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.white),
                                    ),
                                  )
                                : const Text('Verifikasi & Selesaikan Pendaftaran'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
