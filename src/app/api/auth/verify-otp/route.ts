import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";
import { approvalService } from "@/services/approvalService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, fullName, institution } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email dan kode OTP wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const record = await otpStore.getOtp(cleanEmail);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "Kode OTP kadaluarsa atau tidak ditemukan. Silakan klik kirim ulang kode.",
        },
        { status: 400 }
      );
    }

    if (record.otp !== cleanOtp) {
      return NextResponse.json(
        {
          success: false,
          error: "Kode OTP yang Anda masukkan salah. Periksa kembali kotak masuk email Anda.",
        },
        { status: 400 }
      );
    }

    // OTP is valid! Remove OTP record
    await otpStore.removeOtp(cleanEmail);

    // Register into pending_registrations queue for HRD Approval
    const applicantName = fullName || record?.fullName || cleanEmail.split("@")[0];
    const applicantCampus = institution || record?.institution || "Universitas / SMK";

    const pendingRecord = await approvalService.registerPending({
      email: cleanEmail,
      fullName: applicantName,
      institution: applicantCampus,
    });

    return NextResponse.json({
      success: true,
      status: "PENDING_APPROVAL",
      data: pendingRecord,
      message:
        "Kode OTP berhasil diverifikasi. Akun Anda saat ini sedang menunggu persetujuan (ACC) dari HRD CV. Asia Plastik.",
    });
  } catch (error: any) {
    console.error("Error in /api/auth/verify-otp:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memverifikasi kode OTP." },
      { status: 500 }
    );
  }
}
