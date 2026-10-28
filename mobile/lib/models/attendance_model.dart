class AttendanceRecord {
  final String id;
  final String internId;
  final String internName;
  final String? internStudentId;
  final String? institution;
  final String? division;
  final String type; // 'CHECK_IN' | 'CHECK_OUT'
  final String status; // 'PRESENT' | 'LATE' | 'PERMISSION' | 'SICK' | 'ABSENT'
  final String mainStatus; // 'HADIR' | 'IZIN_DENGAN_KETERANGAN' | 'IZIN_TANPA_KETERANGAN'
  final String? permissionSubCategory; // 'IZIN' | 'SAKIT'
  final String? checkInTime;
  final String? checkOutTime;
  final String? permissionReason;
  final String? permissionProofUrl;
  final String formattedDate;
  final String formattedTime;
  final double latitude;
  final double longitude;
  final double distanceFromOfficeMeters;
  final bool isWithinGeofence;
  final String? officeName;
  final String createdAt;

  AttendanceRecord({
    required this.id,
    required this.internId,
    required this.internName,
    this.internStudentId,
    this.institution,
    this.division,
    required this.type,
    required this.status,
    required this.mainStatus,
    this.permissionSubCategory,
    this.checkInTime,
    this.checkOutTime,
    this.permissionReason,
    this.permissionProofUrl,
    required this.formattedDate,
    required this.formattedTime,
    required this.latitude,
    required this.longitude,
    required this.distanceFromOfficeMeters,
    required this.isWithinGeofence,
    this.officeName,
    required this.createdAt,
  });

  bool get isPresent => mainStatus == 'HADIR';
  bool get isLate => status == 'LATE';
  bool get isPermission => mainStatus.startsWith('IZIN');

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    final locationMap = json['location'] as Map<String, dynamic>? ?? {};
    return AttendanceRecord(
      id: json['id'] ?? '',
      internId: json['internId'] ?? '',
      internName: json['internName'] ?? '',
      internStudentId: json['internStudentId'],
      institution: json['institution'],
      division: json['division'],
      type: json['type'] ?? 'CHECK_IN',
      status: json['status'] ?? 'PRESENT',
      mainStatus: json['mainStatus'] ?? 'HADIR',
      permissionSubCategory: json['permissionSubCategory'],
      checkInTime: json['checkInTime'],
      checkOutTime: json['checkOutTime'],
      permissionReason: json['permissionReason'],
      permissionProofUrl: json['permissionProofUrl'],
      formattedDate: json['formattedDate'] ?? '',
      formattedTime: json['formattedTime'] ?? '',
      latitude: (locationMap['latitude'] ?? json['latitude'] ?? 0.0).toDouble(),
      longitude: (locationMap['longitude'] ?? json['longitude'] ?? 0.0).toDouble(),
      distanceFromOfficeMeters: (json['distanceFromOfficeMeters'] ?? 0.0).toDouble(),
      isWithinGeofence: json['isWithinGeofence'] ?? false,
      officeName: json['officeName'],
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'internId': internId,
      'internName': internName,
      'internStudentId': internStudentId,
      'institution': institution,
      'division': division,
      'type': type,
      'status': status,
      'mainStatus': mainStatus,
      'permissionSubCategory': permissionSubCategory,
      'checkInTime': checkInTime,
      'checkOutTime': checkOutTime,
      'permissionReason': permissionReason,
      'permissionProofUrl': permissionProofUrl,
      'formattedDate': formattedDate,
      'formattedTime': formattedTime,
      'location': {
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': 10.0,
      },
      'distanceFromOfficeMeters': distanceFromOfficeMeters,
      'isWithinGeofence': isWithinGeofence,
      'officeName': officeName,
      'createdAt': createdAt,
    };
  }
}
