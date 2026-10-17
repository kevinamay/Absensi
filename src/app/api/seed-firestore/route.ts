import { NextResponse } from "next/server";
import { whitelistService } from "@/services/whitelistService";

export async function GET() {
  try {
    const result = await whitelistService.seedAllowedInternsToFirestore();
    return NextResponse.json({
      project: "absensi-49a9e",
      collection: "allowed_interns",
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
