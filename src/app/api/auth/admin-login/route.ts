import { NextResponse } from "next/server";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

/**
 * Official HRD & Supervisor Credentials for CV. Asia Plastik
 * Registered through backend system ("lewat belakang")
 */
function checkAdminCredentials(email: string, pass: string) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPass = (pass || "").trim();

  const isEmailValid =
    cleanEmail === "admin123@gmail.com" ||
    cleanEmail === "staf.hrd@asiaplastik.com" ||
    cleanEmail === "admin@asiaplastik.com" ||
    cleanEmail === "admin@gmail.com";

  // Flexible check for User_Admin123. (with dot or without dot, case-insensitive)
  const normalizedInputPass = cleanPass.toLowerCase().replace(/[.\s]+$/, "");
  const isPassValid =
    cleanPass === "User_Admin123." ||
    cleanPass === "User_Admin123" ||
    normalizedInputPass === "user_admin123";

  if (isEmailValid && isPassValid) {
    return {
      email: cleanEmail,
      displayName: cleanEmail.includes("staf.hrd")
        ? "HR Supervisor CV. Asia Plastik"
        : "Administrator HRD",
      role: "admin" as const,
      division: "Human Resources & General Affairs",
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan kata sandi administrator wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Verify against official HRD administrator credentials
    const matchedAdmin = checkAdminCredentials(cleanEmail, cleanPassword);

    if (!matchedAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email atau kata sandi administrator salah. Pastikan akun email Anda sudah terdaftar di sistem HRD CV. Asia Plastik.",
        },
        { status: 401 }
      );
    }

    // Backend registration & synchronization with Firebase Admin (only if service account credentials are provided)
    let uid = `admin-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "")}`;
    if (isFirebaseAdminConfigured) {
      try {
        try {
          const existingFbUser = await adminAuth.getUserByEmail(cleanEmail);
          uid = existingFbUser.uid;
        } catch (getErr: any) {
          if (getErr.code === "auth/user-not-found" || getErr.code === "auth/invalid-credential") {
            const newFbUser = await adminAuth.createUser({
              email: cleanEmail,
              password: cleanPassword,
              displayName: matchedAdmin.displayName,
            });
            uid = newFbUser.uid;
          }
        }

        await adminDb
          .collection("users")
          .doc(uid)
          .set(
            {
              uid,
              email: cleanEmail,
              displayName: matchedAdmin.displayName,
              role: matchedAdmin.role,
              division: matchedAdmin.division,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          )
          .catch((dbErr) => {
            console.warn("Notice: Firestore adminDb sync:", dbErr.message);
          });
      } catch (adminErr: any) {
        console.warn("Notice: Backend Firebase Admin auth sync skipped:", adminErr.message);
      }
    }

    const sessionData = {
      uid,
      email: cleanEmail,
      displayName: matchedAdmin.displayName,
      role: matchedAdmin.role,
      division: matchedAdmin.division,
      whitelisted: true,
      expiresAt: Date.now() + 86400000 * 7,
    };

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: "Autentikasi HRD Berhasil. Selamat datang di Konsol Monitoring HR!",
    });

    // Set secure session cookie for Next.js proxy route protection
    response.cookies.set("cv_asia_session", JSON.stringify(sessionData), {
      path: "/",
      maxAge: 86400 * 7, // 7 days
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    console.error("Error in /api/auth/admin-login:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Terjadi kesalahan pada sistem otentikasi HRD." },
      { status: 500 }
    );
  }
}
