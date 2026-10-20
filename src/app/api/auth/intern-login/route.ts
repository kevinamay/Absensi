import { NextResponse } from "next/server";
import { registrationsStore } from "@/lib/registrationsStore";
import { MOCK_WHITELIST_INTERNS } from "@/services/whitelistService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check persistent registrations store (direct registrants)
    const regRecord = registrationsStore.get(cleanEmail);

    if (regRecord) {
      if (regRecord.status === "PENDING_APPROVAL" || regRecord.status === "PENDING_OTP") {
        return NextResponse.json(
          {
            success: false,
            code: "PENDING_APPROVAL",
            error:
              "Akun Anda telah terdaftar dan sedang menunggu persetujuan (ACC) dari HRD CV. Asia Plastik. Anda belum dapat masuk sampai akun disetujui.",
          },
          { status: 403 }
        );
      }

      if (regRecord.status === "REJECTED") {
        return NextResponse.json(
          {
            success: false,
            code: "REJECTED",
            error: regRecord.rejectionReason
              ? `Pendaftaran akun Anda ditolak oleh HRD CV. Asia Plastik: ${regRecord.rejectionReason}`
              : "Pendaftaran akun Anda ditolak oleh HRD CV. Asia Plastik. Silakan hubungi bagian HRD.",
          },
          { status: 403 }
        );
      }

      if (regRecord.status === "APPROVED") {
        // Verify password if recorded
        if (regRecord.password) {
          const matchExact = regRecord.password === cleanPass;
          const matchTolerant =
            regRecord.password.trim().toLowerCase().replace(/[.\s]+$/, "") ===
            cleanPass.trim().toLowerCase().replace(/[.\s]+$/, "");

          if (!matchExact && !matchTolerant) {
            return NextResponse.json(
              {
                success: false,
                code: "INVALID_CREDENTIALS",
                error: "Kata sandi yang Anda masukkan salah. Pastikan penulisan kata sandi benar.",
              },
              { status: 401 }
            );
          }
        }

        const sessionData = {
          uid: `intern-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "")}`,
          email: cleanEmail,
          displayName: regRecord.fullName,
          studentId: "-",
          institution: regRecord.institution,
          division: "Umum",
          role: "intern" as const,
          whitelisted: true,
          expiresAt: Date.now() + 86400000 * 7,
        };

        const internData = {
          id: cleanEmail,
          email: cleanEmail,
          fullName: regRecord.fullName,
          studentId: "-",
          identityNumber: "-",
          institution: regRecord.institution,
          division: "Umum",
          magangHubId: `MH-${cleanEmail.slice(0, 4)}`,
          status: "ACTIVE" as const,
          companyName: "CV. Asia Plastik",
        };

        const response = NextResponse.json({
          success: true,
          user: sessionData,
          internData,
          message: "Login berhasil! Selamat datang di Portal Presensi CV. Asia Plastik.",
        });

        // Set session cookie for Next.js proxy route protection
        response.cookies.set("cv_asia_session", JSON.stringify(sessionData), {
          path: "/",
          maxAge: 86400 * 7,
          sameSite: "lax",
          httpOnly: false,
        });

        return response;
      }
    }

    // 2. Check legacy MagangHub whitelist
    const matchedWhitelist = MOCK_WHITELIST_INTERNS.find(
      (w) => w.email.toLowerCase() === cleanEmail
    );

    if (matchedWhitelist && matchedWhitelist.status === "ACTIVE") {
      const sessionData = {
        uid: matchedWhitelist.id,
        email: cleanEmail,
        displayName: matchedWhitelist.fullName,
        studentId: matchedWhitelist.studentId,
        institution: matchedWhitelist.institution,
        division: matchedWhitelist.division,
        role: "intern" as const,
        whitelisted: true,
        expiresAt: Date.now() + 86400000 * 7,
      };

      const response = NextResponse.json({
        success: true,
        user: sessionData,
        internData: matchedWhitelist,
        message: "Login berhasil! Selamat datang di Portal Presensi CV. Asia Plastik.",
      });

      response.cookies.set("cv_asia_session", JSON.stringify(sessionData), {
        path: "/",
        maxAge: 86400 * 7,
        sameSite: "lax",
        httpOnly: false,
      });

      return response;
    }

    // 3. Not found in registrations or whitelist
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        error:
          "Access Denied: Email Anda belum terdaftar atau disetujui dalam sistem CV. Asia Plastik. Silakan daftar akun baru.",
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Error in /api/auth/intern-login:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses autentikasi peserta." },
      { status: 500 }
    );
  }
}
