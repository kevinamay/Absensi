import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Soft pastel sky palette (Variant A - Soft Azure Horizon)
  static const Color primarySky = Color(0xFF0284C7); // Sky-600
  static const Color primarySkyHover = Color(0xFF0369A1); // Sky-700
  static const Color accentCyan = Color(0xFF0EA5E9); // Sky-500
  static const Color softSkyLight = Color(0xFFE0F2FE); // Sky-100
  static const Color softBlueTint = Color(0xFFEFF6FF); // Blue-50
  static const Color backgroundLight = Color(0xFFF8FAFC); // Slate-50

  static const Color textMain = Color(0xFF0F172A); // Slate-900
  static const Color textMuted = Color(0xFF64748B); // Slate-500
  static const Color borderLight = Color(0xFFE2E8F0); // Slate-200

  // Status Colors
  static const Color statusGreen = Color(0xFF10B981);
  static const Color statusGreenBg = Color(0xFFECFDF5);
  static const Color statusAmber = Color(0xFFF59E0B);
  static const Color statusAmberBg = Color(0xFFFFFBEB);
  static const Color statusBlue = Color(0xFF3B82F6);
  static const Color statusBlueBg = Color(0xFFEFF6FF);
  static const Color statusRed = Color(0xFFEF4444);
  static const Color statusRedBg = Color(0xFFFEF2F2);

  // Background Gradient matching Variant A
  static const BoxDecoration softSkyBackground = BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        Color(0xCCBAE6FD), // Sky-200/80
        Color(0x66E0F2FE), // Sky-100/40
        Color(0xFFF8FAFC), // Pure soft background
      ],
      stops: [0.0, 0.45, 1.0],
    ),
  );

  static ThemeData get lightTheme {
    final textTheme = GoogleFonts.interTextTheme();

    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primarySky,
        primary: primarySky,
        secondary: accentCyan,
        surface: Colors.white,
      ),
      scaffoldBackgroundColor: backgroundLight,
      textTheme: textTheme.apply(
        bodyColor: textMain,
        displayColor: textMain,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white.withValues(alpha: 0.9),
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: textMain),
        titleTextStyle: GoogleFonts.inter(
          color: textMain,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 1.5,
        shadowColor: primarySky.withValues(alpha: 0.08),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderLight, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primarySky,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primarySky,
          side: const BorderSide(color: Color(0xFFBAE6FD), width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: primarySky, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: statusRed),
        ),
        labelStyle: GoogleFonts.inter(color: textMuted, fontSize: 14),
        hintStyle: GoogleFonts.inter(color: textMuted.withValues(alpha: 0.6), fontSize: 14),
      ),
    );
  }
}
