class PendingRegistration {
  final String id;
  final String email;
  final String fullName;
  final String institution;
  final String status; // 'PENDING_OTP' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'
  final String createdAt;
  final String? approvedAt;
  final String? rejectionReason;

  PendingRegistration({
    required this.id,
    required this.email,
    required this.fullName,
    required this.institution,
    required this.status,
    required this.createdAt,
    this.approvedAt,
    this.rejectionReason,
  });

  factory PendingRegistration.fromJson(Map<String, dynamic> json) {
    return PendingRegistration(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? json['name'] ?? '',
      institution: json['institution'] ?? json['campus'] ?? '',
      status: json['status'] ?? 'PENDING_APPROVAL',
      createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
      approvedAt: json['approvedAt'],
      rejectionReason: json['rejectionReason'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
      'institution': institution,
      'status': status,
      'createdAt': createdAt,
      'approvedAt': approvedAt,
      'rejectionReason': rejectionReason,
    };
  }
}
