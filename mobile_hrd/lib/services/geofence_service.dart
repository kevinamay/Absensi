import 'dart:math';
import '../config/constants.dart';

class OfficeEvaluation {
  final OfficeLocation office;
  final double distanceMeters;
  final bool isWithinGeofence;

  OfficeEvaluation({
    required this.office,
    required this.distanceMeters,
    required this.isWithinGeofence,
  });
}

class GeofenceResult {
  final double distanceMeters;
  final double allowedRadiusMeters;
  final bool isWithinGeofence;
  final OfficeLocation closestOffice;
  final List<OfficeEvaluation> allOffices;

  GeofenceResult({
    required this.distanceMeters,
    required this.allowedRadiusMeters,
    required this.isWithinGeofence,
    required this.closestOffice,
    required this.allOffices,
  });
}

class GeofenceService {
  /// Calculate distance in meters using Haversine formula (exact match to web calculateDistanceMeters)
  static double calculateDistanceMeters(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    const double earthRadius = 6371000; // in meters
    final double dLat = (lat2 - lat1) * (pi / 180.0);
    final double dLon = (lon2 - lon1) * (pi / 180.0);

    final double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(lat1 * (pi / 180.0)) *
            cos(lat2 * (pi / 180.0)) *
            sin(dLon / 2) *
            sin(dLon / 2);

    final double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return earthRadius * c;
  }

  /// Evaluates GPS coordinates across all registered official company offices
  static GeofenceResult checkGeofence(double lat, double lng) {
    double minDistance = double.infinity;
    OfficeLocation closest = AppConstants.offices.first;
    bool anyWithin = false;

    final List<OfficeEvaluation> evaluations = [];

    for (final office in AppConstants.offices) {
      final distance = calculateDistanceMeters(
        lat,
        lng,
        office.latitude,
        office.longitude,
      );
      final within = distance <= office.radiusMeters;
      if (within) anyWithin = true;

      if (distance < minDistance) {
        minDistance = distance;
        closest = office;
      }

      evaluations.add(
        OfficeEvaluation(
          office: office,
          distanceMeters: distance,
          isWithinGeofence: within,
        ),
      );
    }

    return GeofenceResult(
      distanceMeters: minDistance,
      allowedRadiusMeters: closest.radiusMeters,
      isWithinGeofence: anyWithin,
      closestOffice: closest,
      allOffices: evaluations,
    );
  }
}
