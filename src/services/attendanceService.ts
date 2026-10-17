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

// Default office coordinates (CV. Asia Plastik factory/office)
const OFFICE_LAT = parseFloat(process.env.NEXT_PUBLIC_OFFICE_LATITUDE || "-7.424312");
const OFFICE_LNG = parseFloat(process.env.NEXT_PUBLIC_OFFICE_LONGITUDE || "112.721415");
const OFFICE_RADIUS_METERS = parseInt(
  process.env.NEXT_PUBLIC_OFFICE_RADIUS_METERS || "150",
  10
);

export const attendanceService = {
  /**
   * Evaluates geofence parameters for given GPS coordinates
   */
  checkGeofence(lat: number, lng: number) {
    const distanceMeters = calculateDistanceMeters(lat, lng, OFFICE_LAT, OFFICE_LNG);
    const isWithinGeofence = distanceMeters <= OFFICE_RADIUS_METERS;
    return {
      distanceMeters,
      allowedRadiusMeters: OFFICE_RADIUS_METERS,
      isWithinGeofence,
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
    if (payload.type === "CHECK_IN") {
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
      photoUrl: payload.photoUrl || "",
      notes: payload.notes || "",
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
