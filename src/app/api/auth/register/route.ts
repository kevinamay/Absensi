import { NextResponse } from "next/server";
import { approvalService } from "@/services/approvalService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, institution } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap dan email wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanInst = (institution || "").trim();

    // Save directly into HRD Pending Approval queue (No OTP needed)
    const pendingRecord = await approvalService.registerPending({
      email: cleanEmail,
      fullName: cleanName,
      institution: cleanInst,
    });

    return NextResponse.json({
      success: true,
      status: "PENDING_APPROVAL",
      data: pendingRecord,
      message:
        "Pendaftaran berhasil! Akun Anda telah terdaftar dan saat ini sedang menunggu persetujuan (ACC) dari HRD CV. Asia Plastik.",
    });
  } catch (error: any) {
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses pendaftaran." },
      { status: 500 }
    );
  }
}
