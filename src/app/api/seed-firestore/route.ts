import { NextResponse } from "next/server";
import { whitelistService } from "@/services/whitelistService";

export async function GET() {
  try {
    const result = await whitelistService.seedAllowedInternsToFirestore();

    // Also register & ensure official HRD admin profile exists
    try {
      const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import("@/lib/firebase-admin");
      if (isFirebaseAdminConfigured) {
        const adminEmail = "admin123@gmail.com";
        const adminPass = "User_Admin123.";

        try {
          await adminAuth.createUser({
            email: adminEmail,
            password: adminPass,
            displayName: "Administrator HRD",
          });
        } catch (authErr: any) {
          // User already exists or in local mode
        }

        await adminDb.collection("users").doc("admin123_hrd").set(
          {
            uid: "admin123_hrd",
            email: adminEmail,
            displayName: "Administrator HRD",
            role: "admin",
            division: "Human Resources & General Affairs",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (e: any) {
      console.warn("Notice during admin user seeding:", e.message);
    }

    return NextResponse.json({
      project: "absensi-49a9e",
      collection: "allowed_interns",
      adminCreated: "admin123@gmail.com",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        project: "absensi-49a9e",
        success: false,
        error: error.message || "Gagal menghubungkan atau seeding Firestore",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
