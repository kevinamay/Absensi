export type UserRole = "admin" | "supervisor" | "intern";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  // Intern & MagangHub specific details
  studentId?: string; // NIM (Nomor Induk Mahasiswa)
  identityNumber?: string; // NIK
  institution?: string; // University / Vocational School
  magangHubId?: string; // ID from MagangHub / SIAPkerja
  division?: string; // Placement division in CV. Asia Plastik (e.g. Production, QC, Maintenance, Admin)
  startDate?: string;
  endDate?: string;
  supervisorId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: any | null;
  loading: boolean;
  error: string | null;
}
