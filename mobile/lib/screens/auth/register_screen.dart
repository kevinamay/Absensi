import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_theme.dart';
import '../../config/constants.dart';
import '../../services/auth_service.dart';
import 'otp_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _nimController = TextEditingController();
  final _institutionController = TextEditingController();
  final _phoneController = TextEditingController();
  String _selectedDivision = AppConstants.divisions.first;

  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final otp = await AuthService().requestOtp(
        email: _emailController.text.trim(),
        fullName: _nameController.text.trim(),
        institution: _institutionController.text.trim(),
      );

      if (!mounted) return;

      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => OtpScreen(
            email: _emailController.text.trim(),
            fullName: _nameController.text.trim(),
            institution: _institutionController.text.trim(),
            nim: _nimController.text.trim(),
            division: _selectedDivision,
            phone: _phoneController.text.trim(),
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
    _nameController.dispose();
    _emailController.dispose();
    _nimController.dispose();
    _institutionController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pendaftaran Peserta Magang'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Container(
        decoration: AppTheme.softSkyBackground,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.softSkyLight,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.badge_rounded,
                                  color: AppTheme.primarySky,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Formulir Akun Magang',
                                      style: GoogleFonts.inter(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                        color: AppTheme.textMain,
                                      ),
                                    ),
                                    Text(
                                      'Isi data identitas magang industri Anda secara lengkap.',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: AppTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 28),

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

                          // Nama Lengkap
                          Text('Nama Lengkap Sesuai KTP / KTM',
                              style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              hintText: 'Contoh: Bima Satria Wicaksana',
                              prefixIcon: Icon(Icons.person_outline, size: 20),
                            ),
                            validator: (v) =>
                                (v == null || v.trim().isEmpty) ? 'Nama wajib diisi' : null,
                          ),
                          const SizedBox(height: 16),

                          // Email
                          Text('Alamat Email Aktif',
                              style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: const InputDecoration(
                              hintText: 'nama@instansi.ac.id',
                              prefixIcon: Icon(Icons.email_outlined, size: 20),
                            ),
                            validator: (v) =>
                                (v == null || !v.contains('@')) ? 'Email tidak valid' : null,
                          ),
                          const SizedBox(height: 16),

                          // NIM
                          Text('NIM / NISN',
                              style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _nimController,
                            decoration: const InputDecoration(
                              hintText: 'Contoh: 21051204012',
                              prefixIcon: Icon(Icons.pin_outlined, size: 20),
                            ),
                            validator: (v) =>
                                (v == null || v.trim().isEmpty) ? 'NIM wajib diisi' : null,
                          ),
                          const SizedBox(height: 16),

                          // Institusi
                          Text('Universitas / Politeknik / SMK Asal',
                              style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _institutionController,
                            decoration: const InputDecoration(
                              hintText: 'Contoh: Universitas Negeri Surabaya',
                              prefixIcon: Icon(Icons.school_outlined, size: 20),
                            ),
                            validator: (v) =>
                                (v == null || v.trim().isEmpty) ? 'Institusi wajib diisi' : null,
                          ),
                          const SizedBox(height: 16),

                          // Divisi Penempatan
                          Text('Divisi Penempatan di CV. Asia Plastik',
                              style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<String>(
                            value: _selectedDivision,
                            decoration: const InputDecoration(
                              prefixIcon: Icon(Icons.business_outlined, size: 20),
                            ),
                            items: AppConstants.divisions.map((d) {
                              return DropdownMenuItem(value: d, child: Text(d));
                            }).toList(),
                            onChanged: (val) {
                              if (val != null) {
                                setState(() {
                                  _selectedDivision = val;
                                });
                              }
                            },
                          ),
                          const SizedBox(height: 16),

                          // No. Telepon
                          Text('Nomor WhatsApp Aktif',
                              style: GoogleFonts.inter(
                                  fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            decoration: const InputDecoration(
                              hintText: '081234567890',
                              prefixIcon: Icon(Icons.phone_outlined, size: 20),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Submit Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _handleRegister,
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
                                  : const Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text('Kirim Kode OTP Verifikasi'),
                                        SizedBox(width: 8),
                                        Icon(Icons.arrow_forward_rounded, size: 18),
                                      ],
                                    ),
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
      ),
    );
  }
}
