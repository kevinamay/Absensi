import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../services/auth_service.dart';
import 'auth/login_screen.dart';
import 'hrd/hrd_dashboard_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _scaleAnimation = Tween<double>(begin: 0.88, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _controller.forward();

    _navigateToNext();
  }

  Future<void> _navigateToNext() async {
    await Future.delayed(const Duration(milliseconds: 1800));
    if (!mounted) return;

    final auth = AuthService();
    if (auth.isAuthenticated && auth.currentUser?.isAdmin == true) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HrdDashboardScreen()),
      );
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = themeModeNotifier.value == ThemeMode.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF020617) : const Color(0xFFF8FBFF),
      body: Container(
        decoration: isDark
            ? null
            : const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFE0F2FE), // Sky-100
                    Color(0xFFF0F9FF), // Sky-50
                    Color(0xFFF8FBFF), // Soft white
                    Color(0xFFEBF5FF), // Azure tint
                  ],
                  stops: [0.0, 0.35, 0.7, 1.0],
                ),
              ),
        child: Center(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Opacity(
                opacity: _fadeAnimation.value,
                child: Transform.scale(
                  scale: _scaleAnimation.value,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Direct Logo Only (No circular frame, no extra text)
                      Image.asset(
                        'assets/images/logo.webp',
                        width: 220,
                        fit: BoxFit.contain,
                        color: isDark ? Colors.white : const Color(0xFF0F172A),
                        colorBlendMode: BlendMode.srcIn,
                        errorBuilder: (context, error, stackTrace) => Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.factory_rounded,
                              size: 36,
                              color: isDark ? Colors.white : const Color(0xFF0F172A),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              'ASIA PLASTIK',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                color: isDark ? Colors.white : const Color(0xFF0F172A),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 36),

                      // Minimalist Spinner
                      const SizedBox(
                        width: 22,
                        height: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Color(0xFF0284C7),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
