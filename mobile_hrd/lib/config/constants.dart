class OfficeLocation {
  final String id;
  final String name;
  final double latitude;
  final double longitude;
  final double radiusMeters;
  final String mapsUrl;

  const OfficeLocation({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.radiusMeters,
    required this.mapsUrl,
  });
}

class AppConstants {
  static const String appName = 'CV. Asia Plastik';
  static const String appSubtitle = 'Sistem Presensi & MagangHub Industri';

  // Kantor Resmi Perusahaan
  // Kantor 1: PT. Asia Plastik (https://maps.app.goo.gl/nG8bbunWWTEA6SLGA)
  // Kantor 2: CV. Asia Plastik (https://maps.app.goo.gl/Qz84ix7g7NYtubgR6)
  static const List<OfficeLocation> offices = [
    OfficeLocation(
      id: 'kantor-1',
      name: 'Kantor 1 (PT. Asia Plastik)',
      latitude: -7.3361184,
      longitude: 112.7611569,
      radiusMeters: 150.0,
      mapsUrl: 'https://maps.app.goo.gl/nG8bbunWWTEA6SLGA',
    ),
    OfficeLocation(
      id: 'kantor-2',
      name: 'Kantor 2 (CV. Asia Plastik)',
      latitude: -7.3352907,
      longitude: 112.7565049,
      radiusMeters: 150.0,
      mapsUrl: 'https://maps.app.goo.gl/Qz84ix7g7NYtubgR6',
    ),
  ];

  static const List<String> divisions = [
    'Produksi & Mesin',
    'Quality Control (QC)',
    'Maintenance & Utility',
    'Gudang & Logistik',
    'Administrasi & HRD',
  ];
}
