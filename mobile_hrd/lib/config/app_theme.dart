import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// Global ValueNotifier for reactive Light/Dark mode toggling
final ValueNotifier<ThemeMode> themeModeNotifier = ValueNotifier<ThemeMode>(ThemeMode.light);

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
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        Color(0xFFE0F2FE),
        Color(0xFFF0F9FF),
        Color(0xFFF8FBFF),
        Color(0xFFEBF5FF),
      ],
      stops: [0.0, 0.35, 0.7, 1.0],
    ),
  );

  static ThemeData get lightTheme {
    final textTheme = GoogleFonts.interTextTheme();

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primarySky,
        primary: primarySky,
        secondary: accentCyan,
        surface: Colors.white,
        brightness: Brightness.light,
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
    );
  }

  static ThemeData get darkTheme {
    final textTheme = GoogleFonts.interTextTheme();

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primarySky,
        primary: primarySky,
        secondary: accentCyan,
        surface: const Color(0xFF0F172A),
        brightness: Brightness.dark,
      ),
      scaffoldBackgroundColor: const Color(0xFF020617), // slate-950
      textTheme: textTheme.apply(
        bodyColor: Colors.white,
        displayColor: Colors.white,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFF0F172A).withValues(alpha: 0.9),
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: Colors.white),
        titleTextStyle: GoogleFonts.inter(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: CardThemeData(
        color: const Color(0xFF0F172A),
        elevation: 2,
        shadowColor: Colors.black.withValues(alpha: 0.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: Colors.white.withValues(alpha: 0.1), width: 1),
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
    );
  }
}
