import type { Timestamp } from "firebase/firestore";

export type AttendanceType = "CHECK_IN" | "CHECK_OUT";

export type AttendanceStatus = "PRESENT" | "LATE" | "PERMISSION" | "SICK" | "ABSENT";

export type AttendanceTimestamp =
  | Timestamp
  | Date
  | string
  | { seconds: number; nanoseconds: number };

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type MainAttendanceStatus =
  | "HADIR"
  | "IZIN_DENGAN_KETERANGAN"
  | "IZIN_TANPA_KETERANGAN";

export type PermissionSubCategory = "IZIN" | "SAKIT";

export interface AttendanceRecord {
  id: string;
  internId: string;
  internName: string;
  internStudentId?: string;
  institution?: string;
  division?: string;
  type: AttendanceType;
  status: AttendanceStatus;
  mainStatus?: MainAttendanceStatus;
  permissionSubCategory?: PermissionSubCategory;
  checkInTime?: string;
  checkOutTime?: string;
  permissionReason?: string;
  permissionProofUrl?: string;
  timestamp: AttendanceTimestamp;
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
  mainStatus?: MainAttendanceStatus;
  permissionSubCategory?: PermissionSubCategory;
  checkInTime?: string;
  checkOutTime?: string;
  permissionReason?: string;
  permissionProofUrl?: string;
  officeName?: string;
  officeId?: string;
  photoUrl?: string;
  notes?: string;
}
