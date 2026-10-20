import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import {
  AttendanceRecord,
  CheckInPayload,
  AttendanceStatus,
} from "@/types/attendance";
import {
  calculateDistanceMeters,
  evaluateAttendanceStatus,
  formatIndonesianDate,
  formatIndonesianTime,
} from "@/lib/utils";

const ATTENDANCE_COLLECTION = "attendance";

export interface OfficeLocationConfig {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  mapsUrl: string;
}

// Kantor 1: PT. Asia Plastik (https://maps.app.goo.gl/nG8bbunWWTEA6SLGA)
// Kantor 2: CV. Asia Plastik (https://maps.app.goo.gl/Qz84ix7g7NYtubgR6)
export const OFFICIAL_OFFICES: OfficeLocationConfig[] = [
  {
    id: "kantor-1",
    name: process.env.NEXT_PUBLIC_OFFICE_1_NAME || "Kantor 1 (PT. Asia Plastik)",
    latitude: parseFloat(process.env.NEXT_PUBLIC_OFFICE_1_LATITUDE || "-7.3361184"),
    longitude: parseFloat(process.env.NEXT_PUBLIC_OFFICE_1_LONGITUDE || "112.7611569"),
    radiusMeters: parseInt(process.env.NEXT_PUBLIC_OFFICE_RADIUS_METERS || "150", 10),
    mapsUrl: "https://maps.app.goo.gl/nG8bbunWWTEA6SLGA",
  },
  {
    id: "kantor-2",
    name: process.env.NEXT_PUBLIC_OFFICE_2_NAME || "Kantor 2 (CV. Asia Plastik)",
    latitude: parseFloat(process.env.NEXT_PUBLIC_OFFICE_2_LATITUDE || "-7.3352907"),
    longitude: parseFloat(process.env.NEXT_PUBLIC_OFFICE_2_LONGITUDE || "112.7565049"),
    radiusMeters: parseInt(process.env.NEXT_PUBLIC_OFFICE_RADIUS_METERS || "150", 10),
    mapsUrl: "https://maps.app.goo.gl/Qz84ix7g7NYtubgR6",
  },
];

export const attendanceService = {
  /**
   * Evaluates geofence parameters for given GPS coordinates across all official company locations.
   * If an intern is within radius of EITHER Kantor 1 OR Kantor 2, geofence check passes.
   */
  checkGeofence(lat: number, lng: number) {
    let minDistance = Infinity;
    let closestOffice = OFFICIAL_OFFICES[0];
    let isWithinGeofence = false;

    const evaluatedOffices = OFFICIAL_OFFICES.map((office) => {
      const distance = calculateDistanceMeters(lat, lng, office.latitude, office.longitude);
      const within = distance <= office.radiusMeters;
      if (within) {
        isWithinGeofence = true;
      }
      if (distance < minDistance) {
        minDistance = distance;
        closestOffice = office;
      }
      return {
        ...office,
        distanceMeters: distance,
        isWithinGeofence: within,
      };
    });

    return {
      distanceMeters: minDistance,
      allowedRadiusMeters: closestOffice.radiusMeters,
      isWithinGeofence,
      closestOffice,
      allOffices: evaluatedOffices,
    };
  },

  /**
   * Submit check-in or check-out record
   */
  async submitAttendance(
    internProfile: {
      uid: string;
      displayName: string;
      studentId?: string;
      institution?: string;
      division?: string;
    },
    payload: CheckInPayload
  ): Promise<string> {
    const now = new Date();
    const todayFormatted = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeFormatted = formatIndonesianTime(now);

    let calculatedStatus: AttendanceStatus = "PRESENT";
    if (payload.mainStatus === "IZIN_DENGAN_KETERANGAN") {
      calculatedStatus = payload.permissionSubCategory === "SAKIT" ? "SICK" : "PERMISSION";
    } else if (payload.mainStatus === "IZIN_TANPA_KETERANGAN") {
      calculatedStatus = "ABSENT";
    } else if (payload.type === "CHECK_IN") {
      calculatedStatus = evaluateAttendanceStatus(now);
    }

    const docData = {
      internId: internProfile.uid,
      internName: internProfile.displayName,
      internStudentId: internProfile.studentId || "-",
      institution: internProfile.institution || "-",
      division: internProfile.division || "Umum",
      type: payload.type,
      status: calculatedStatus,
      mainStatus: payload.mainStatus || "HADIR",
      permissionSubCategory: payload.permissionSubCategory || null,
      checkInTime: payload.checkInTime || timeFormatted,
      checkOutTime: payload.checkOutTime || null,
      permissionReason: payload.permissionReason || "",
      permissionProofUrl: payload.permissionProofUrl || payload.photoUrl || "",
      timestamp: serverTimestamp(),
      formattedDate: todayFormatted,
      formattedTime: timeFormatted,
      location: {
        latitude: payload.coordinates.latitude,
        longitude: payload.coordinates.longitude,
        accuracy: payload.coordinates.accuracy,
      },
      distanceFromOfficeMeters: payload.distanceFromOfficeMeters,
      isWithinGeofence: payload.isWithinGeofence,
      officeName: payload.officeName || (payload.isWithinGeofence ? "CV. Asia Plastik" : "Di Luar Area"),
      officeId: payload.officeId || "",
      photoUrl: payload.permissionProofUrl || payload.photoUrl || "",
      notes: payload.notes || payload.permissionReason || "",
      createdAt: now.toISOString(),
    };

    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), docData);
    return docRef.id;
  },

  /**
   * Get today's attendance records for an intern
   */
  async getTodayAttendance(internId: string): Promise<AttendanceRecord[]> {
    try {
      const todayFormatted = new Date().toISOString().split("T")[0];
      const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where("internId", "==", internId),
        where("formattedDate", "==", todayFormatted),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AttendanceRecord[];
    } catch (error) {
      console.warn("Could not query sorted attendance, falling back to basic query:", error);
      // Fallback in case composite index is still building in Firestore
      const fallbackQuery = query(
        collection(db, ATTENDANCE_COLLECTION),
        where("internId", "==", internId)
      );
      const snapshot = await getDocs(fallbackQuery);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AttendanceRecord[];
    }
  },

  /**
   * Get all recent attendance records across all interns (for HR/Supervisors)
   */
  async getAllRecentAttendance(limitCount: number = 50): Promise<AttendanceRecord[]> {
    try {
      const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AttendanceRecord[];
    } catch (error) {
      console.warn("Could not query all attendance:", error);
      const q = query(collection(db, ATTENDANCE_COLLECTION), limit(limitCount));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AttendanceRecord[];
    }
  },
};
