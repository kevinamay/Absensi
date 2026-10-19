export type AttendanceType = "CHECK_IN" | "CHECK_OUT";

export type AttendanceStatus = "PRESENT" | "LATE" | "PERMISSION" | "SICK" | "ABSENT";

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface AttendanceRecord {
  id: string;
  internId: string;
  internName: string;
  internStudentId?: string;
  institution?: string;
  division?: string;
  type: AttendanceType;
  status: AttendanceStatus;
  timestamp: any; // Firestore Timestamp
  formattedDate: string; // YYYY-MM-DD
  formattedTime: string; // HH:mm:ss WIB
  location: GeoLocationCoordinates;
  distanceFromOfficeMeters: number;
  isWithinGeofence: boolean;
  photoUrl?: string; // Captured selfie verification
  notes?: string;
  officeName?: string;
  officeId?: string;
  createdAt: string;
}

export interface CheckInPayload {
  type: AttendanceType;
  coordinates: GeoLocationCoordinates;
  distanceFromOfficeMeters: number;
  isWithinGeofence: boolean;
  officeName?: string;
  officeId?: string;
  photoUrl?: string;
  notes?: string;
}
