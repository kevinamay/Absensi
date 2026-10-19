import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";
import { emailService } from "@/lib/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, institution } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Alamat email wajib diisi." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes validity

    await otpStore.saveOtp({
      email: cleanEmail,
      otp,
      fullName: (fullName || "").trim(),
      institution: (institution || "").trim(),
      createdAt: now,
      expiresAt,
      attempts: 0,
    });

    // Send email with OTP
    await emailService.sendOtpEmail(cleanEmail, otp, fullName || "Peserta Magang");

    return NextResponse.json({
      success: true,
      message: "Kode OTP 6-digit telah dikirim ke email Anda.",
      expiresInSeconds: 600,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/send-otp:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengirimkan kode OTP." },
      { status: 500 }
    );
  }
}
