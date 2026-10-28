class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final String role; // 'intern' | 'admin' | 'supervisor'
  final String? phoneNumber;
  final String? studentId; // NIM
  final String? institution; // Universitas / Politeknik / SMK
  final String? division; // Divisi Penempatan
  final String? startDate;
  final String? endDate;
  final String createdAt;

  UserModel({
    required this.uid,
    required this.email,
    required this.displayName,
    required this.role,
    this.phoneNumber,
    this.studentId,
    this.institution,
    this.division,
    this.startDate,
    this.endDate,
    required this.createdAt,
  });

  bool get isAdmin => role == 'admin' || role == 'supervisor';
  bool get isIntern => role == 'intern';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      uid: json['uid'] ?? '',
      email: json['email'] ?? '',
      displayName: json['displayName'] ?? json['name'] ?? '',
      role: json['role'] ?? 'intern',
      phoneNumber: json['phoneNumber'],
      studentId: json['studentId'] ?? json['nim'],
      institution: json['institution'] ?? json['campus'],
      division: json['division'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'uid': uid,
      'email': email,
      'displayName': displayName,
      'role': role,
      'phoneNumber': phoneNumber,
      'studentId': studentId,
      'institution': institution,
      'division': division,
      'startDate': startDate,
      'endDate': endDate,
      'createdAt': createdAt,
    };
  }
}
