import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../models/approval_model.dart';

class AuthService extends ChangeNotifier {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;

  AuthService._internal() {
    _initSampleData();
  }

  UserModel? _currentUser;
  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;

  final List<PendingRegistration> _pendingRegistrations = [];
  List<PendingRegistration> get pendingRegistrations =>
      List.unmodifiable(_pendingRegistrations);

  String? _lastGeneratedOtp;
  String? get lastGeneratedOtp => _lastGeneratedOtp;

  void _initSampleData() {
    // Inisialisasi awal kosong tanpa data dummy
  }

  /// Login either as Intern or Admin HRD
  Future<UserModel> login({
    required String email,
    required String password,
    bool isAdmin = false,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));

    final normalizedEmail = email.trim().toLowerCase();

    // Check if HRD / Supervisor
    if (isAdmin ||
        normalizedEmail.contains('admin') ||
        normalizedEmail.contains('hrd') ||
        normalizedEmail == 'kevinamay23@gmail.com') {
      _currentUser = UserModel(
        uid: 'adm-001',
        email: email,
        displayName: 'Administrator HRD',
        role: 'admin',
        division: 'Human Resources & General Affairs',
        createdAt: DateTime.now().toIso8601String(),
      );
      notifyListeners();
      return _currentUser!;
    }

    // Default Intern Login
    _currentUser = UserModel(
      uid: 'usr-intern-01',
      email: email,
      displayName: normalizedEmail.startsWith('anisa')
          ? 'Anisa Rahmawati'
          : 'Bima Satria Wicaksana',
      role: 'intern',
      studentId: '21051204012',
      institution: 'Universitas Negeri Surabaya (UNESA)',
      division: 'Produksi & Mesin',
      phoneNumber: '081234567890',
      createdAt: DateTime.now().toIso8601String(),
    );

    notifyListeners();
    return _currentUser!;
  }

  /// Request OTP for new Intern Registration
  Future<String> requestOtp({
    required String email,
    required String fullName,
    required String institution,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _lastGeneratedOtp = '728391'; // Simulated 6-digit OTP code

    return _lastGeneratedOtp!;
  }

  /// Verify OTP and create pending approval registration
  Future<bool> verifyOtpAndRegister({
    required String email,
    required String otp,
    required String fullName,
    required String institution,
    required String nim,
    required String division,
    required String phone,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));

    if (otp.trim() != '728391' && otp.trim() != '123456') {
      throw Exception('Kode OTP tidak valid atau telah kedaluwarsa.');
    }

    final newReg = PendingRegistration(
      id: 'reg-${DateTime.now().millisecondsSinceEpoch}',
      email: email,
      fullName: fullName,
      institution: institution,
      status: 'PENDING_APPROVAL',
      createdAt: DateTime.now().toIso8601String(),
    );

    _pendingRegistrations.insert(0, newReg);
    notifyListeners();
    return true;
  }

  /// Process HRD approval action (APPROVE or REJECT)
  void processApproval(String id, String action, [String? reason]) {
    final index = _pendingRegistrations.indexWhere((r) => r.id == id);
    if (index != -1) {
      final item = _pendingRegistrations[index];
      _pendingRegistrations[index] = PendingRegistration(
        id: item.id,
        email: item.email,
        fullName: item.fullName,
        institution: item.institution,
        status: action == 'APPROVE' ? 'APPROVED' : 'REJECTED',
        createdAt: item.createdAt,
        approvedAt: action == 'APPROVE' ? DateTime.now().toIso8601String() : null,
        rejectionReason: action == 'REJECT' ? (reason ?? 'Ditolak oleh HRD') : null,
      );
      notifyListeners();
    }
  }

  /// Approve pending registration (HRD action)
  void approveRegistration(String id) {
    processApproval(id, 'APPROVE');
  }

  /// Reject pending registration (HRD action)
  void rejectRegistration(String id, String reason) {
    processApproval(id, 'REJECT', reason);
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }
}

extension ListExtensions<E> on List<E> {
  int indexIndexWhere(bool Function(E element) test) {
    for (int i = 0; i < length; i++) {
      if (test(this[i])) return i;
    }
    return -1;
  }
}
