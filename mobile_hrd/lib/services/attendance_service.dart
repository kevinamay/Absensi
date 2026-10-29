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
    // Inisialisasi awal kosong tanpa data dummy
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
    required MainAttendanceStatus mainStatus,
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
    if (mainStatus == MainAttendanceStatus.hadir) {
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
