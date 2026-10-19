export type RegistrationStatus = "PENDING_OTP" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export interface PendingRegistration {
  id: string;
  email: string;
  fullName: string;
  institution: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface OtpVerificationRecord {
  email: string;
  otp: string;
  fullName: string;
  institution: string;
  expiresAt: number; // timestamp in ms
  createdAt: number; // timestamp in ms
  attempts: number;
}
