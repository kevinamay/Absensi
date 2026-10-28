import 'package:intl/intl.dart';
import '../models/attendance_model.dart';
import 'geofence_service.dart';

class AttendanceService {
  static final AttendanceService _instance = AttendanceService._internal();
  factory AttendanceService() => _instance;

  AttendanceService._internal() {
    _initSampleData();
  }

  final List<AttendanceRecord> _records = [];

  void _initSampleData() {
    final now = DateTime.now();
    final todayStr = DateFormat('yyyy-MM-dd').format(now);

    _records.addAll([
      AttendanceRecord(
        id: 'att-001',
        internId: 'usr-intern-01',
        internName: 'Bima Satria Wicaksana',
        internStudentId: '21051204012',
        institution: 'Universitas Negeri Surabaya',
        division: 'Produksi & Mesin',
        type: 'CHECK_IN',
        status: 'PRESENT',
        mainStatus: 'HADIR',
        checkInTime: '07:25',
        checkOutTime: '16:30',
        formattedDate: todayStr,
        formattedTime: '07:25:10 WIB',
        latitude: -7.3352907,
        longitude: 112.7565049,
        distanceFromOfficeMeters: 14.5,
        isWithinGeofence: true,
        officeName: 'Kantor 2 (CV. Asia Plastik)',
        createdAt: now.toIso8601String(),
      ),
      AttendanceRecord(
        id: 'att-002',
        internId: 'usr-intern-02',
        internName: 'Anisa Rahmawati',
        internStudentId: '202111005',
        institution: 'Politeknik Perkapalan Negeri Surabaya',
        division: 'Quality Control (QC)',
        type: 'CHECK_IN',
        status: 'LATE',
        mainStatus: 'HADIR',
        checkInTime: '08:24',
        checkOutTime: '16:30',
        formattedDate: todayStr,
        formattedTime: '08:24:32 WIB',
        latitude: -7.3361184,
        longitude: 112.7611569,
        distanceFromOfficeMeters: 28.0,
        isWithinGeofence: true,
        officeName: 'Kantor 1 (PT. Asia Plastik)',
        createdAt: now.toIso8601String(),
      ),
      AttendanceRecord(
        id: 'att-003',
        internId: 'usr-intern-03',
        internName: 'Rizky Firmansyah',
        internStudentId: '190411100088',
        institution: 'Universitas Trunojoyo Madura',
        division: 'Maintenance & Utility',
        type: 'CHECK_IN',
        status: 'PERMISSION',
        mainStatus: 'IZIN_DENGAN_KETERANGAN',
        permissionSubCategory: 'SAKIT',
        permissionReason: 'Demam tinggi dan istirahat dokter (surat menyusul via WhatsApp supervisor)',
        formattedDate: todayStr,
        formattedTime: '07:10:05 WIB',
        latitude: -7.3352907,
        longitude: 112.7565049,
        distanceFromOfficeMeters: 0.0,
        isWithinGeofence: false,
        officeName: 'Izin Online',
        createdAt: now.toIso8601String(),
      ),
    ]);
  }

  List<AttendanceRecord> getAllRecords() {
    return List.unmodifiable(_records);
  }

  List<AttendanceRecord> getTodayRecordsForIntern(String internId) {
    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    return _records.where((r) => r.internId == internId && r.formattedDate == todayStr).toList();
  }

  String formatIndonesianDate(DateTime dt) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const days = [
      'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];
    final dayName = days[dt.weekday % 7];
    final monthName = months[dt.month - 1];
    return '$dayName, ${dt.day} $monthName ${dt.year}';
  }

  String formatIndonesianTime(DateTime dt) {
    final f = DateFormat('HH:mm:ss');
    return '${f.format(dt)} WIB';
  }

  Future<AttendanceRecord> submitAttendance({
    required String internId,
    required String internName,
    String? internStudentId,
    String? institution,
    String? division,
    required String mainStatus,
    String? permissionSubCategory,
    String? checkInTime,
    String? checkOutTime,
    String? permissionReason,
    String? permissionProofUrl,
    required double latitude,
    required double longitude,
  }) async {
    final now = DateTime.now();
    final todayStr = DateFormat('yyyy-MM-dd').format(now);
    final timeStr = formatIndonesianTime(now);

    final geofence = GeofenceService.checkGeofence(latitude, longitude);

    // Evaluate on-time status: On time if before 08:15 WIB
    String attendanceStatus = 'PRESENT';
    if (mainStatus == 'HADIR') {
      final hour = now.hour;
      final minute = now.minute;
      if (hour > 8 || (hour == 8 && minute > 15)) {
        attendanceStatus = 'LATE';
      } else {
        attendanceStatus = 'PRESENT';
      }
    } else {
      attendanceStatus = permissionSubCategory == 'SAKIT' ? 'SICK' : 'PERMISSION';
    }

    final newRecord = AttendanceRecord(
      id: 'att-${DateTime.now().millisecondsSinceEpoch}',
      internId: internId,
      internName: internName,
      internStudentId: internStudentId,
      institution: institution,
      division: division,
      type: 'CHECK_IN',
      status: attendanceStatus,
      mainStatus: mainStatus,
      permissionSubCategory: permissionSubCategory,
      checkInTime: checkInTime,
      checkOutTime: checkOutTime,
      permissionReason: permissionReason,
      permissionProofUrl: permissionProofUrl,
      formattedDate: todayStr,
      formattedTime: timeStr,
      latitude: latitude,
      longitude: longitude,
      distanceFromOfficeMeters: geofence.distanceMeters,
      isWithinGeofence: geofence.isWithinGeofence,
      officeName: geofence.closestOffice.name,
      createdAt: now.toIso8601String(),
    );

    _records.insert(0, newRecord);
    return newRecord;
  }
}
