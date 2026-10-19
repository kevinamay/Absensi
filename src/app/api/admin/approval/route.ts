import { NextResponse } from "next/server";
import { approvalService } from "@/services/approvalService";

export async function GET() {
  try {
    const list = await approvalService.getAllRegistrations();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error("Error in GET /api/admin/approval:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengambil daftar pendaftar." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action, approvedBy, reason } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "ID pendaftar dan tindakan (action) wajib disertakan." },
        { status: 400 }
      );
    }

    if (action === "APPROVE") {
      const updated = await approvalService.approveRegistration(
        id,
        approvedBy || "HR Supervisor CV. Asia Plastik"
      );
      return NextResponse.json({
        success: true,
        data: updated,
        message: `Akun ${updated.fullName} (${updated.email}) berhasil di-ACC. Akses masuk presensi telah aktif.`,
      });
    } else if (action === "REJECT") {
      const updated = await approvalService.rejectRegistration(
        id,
        reason || "Pendaftaran tidak memenuhi kualifikasi kuota magang."
      );
      return NextResponse.json({
        success: true,
        data: updated,
        message: `Pendaftaran ${updated.fullName} telah ditolak.`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Tindakan tidak valid. Harus APPROVE atau REJECT." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in POST /api/admin/approval:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses persetujuan akun." },
      { status: 500 }
    );
  }
}
