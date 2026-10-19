import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";

interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);

  if (!user || !pass) {
    return null;
  }

  const cleanPass = pass.replace(/\s+/g, "");

  // Optimized for Gmail SMTP
  if (host.includes("gmail") || user.endsWith("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass: cleanPass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: cleanPass },
  });
}

export const emailService = {
  /**
   * Send 6-digit OTP email to applicant
   */
  async sendOtpEmail(email: string, otp: string, fullName: string): Promise<EmailResult> {
    const transporter = getTransporter();
    const fromAddress = process.env.SMTP_FROM || `"HRD CV. Asia Plastik" <no-reply@asiaplastik.com>`;

    const subject = `[CV. Asia Plastik] Kode Verifikasi OTP Pendaftaran: ${otp}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 32px 24px; text-align: center; color: #ffffff;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; font-weight: 900; font-size: 20px; margin-bottom: 12px;">ap</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">CV. ASIA PLASTIK</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #bfdbfe; font-weight: 500;">Sistem Presensi & Onboarding Magang Industri</p>
        </div>

        <div style="padding: 32px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700;">Halo, ${fullName || "Calon Peserta Magang"}!</h2>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
            Terima kasih telah mendaftar di sistem Presensi CV. Asia Plastik. Gunakan 6 digit kode OTP di bawah ini untuk memverifikasi alamat email Anda:
          </p>

          <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #f8fafc; border: 2px dashed #93c5fd; border-radius: 12px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1d4ed8; display: inline-block;">
              ${otp}
            </span>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b; font-weight: 600;">
              Kode ini berlaku selama 10 menit
            </p>
          </div>

          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #991b1b; line-height: 1.5; font-weight: 600;">
              ⚠️ PENTING: Jangan bagikan kode OTP ini kepada siapapun demi keamanan akun magang Anda.
            </p>
          </div>

          <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
            Setelah memasukkan kode OTP, formulir pendaftaran Anda akan diteruskan ke <strong>HRD CV. Asia Plastik</strong> untuk proses verifikasi dan persetujuan (ACC).
          </p>
        </div>

        <div style="padding: 20px 24px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">CV. Asia Plastik Sidoarjo • Jl. Industri No. 45, Sidoarjo, Jawa Timur</p>
          <p style="margin: 0;">Email otomatis sistem presensi. Mohon jangan membalas email ini.</p>
        </div>
      </div>
    `;

    console.log("=================================================");
    console.log(`[CV. ASIA PLASTIK - OTP EMAIL DISPATCH]`);
    console.log(`TO: ${email} (${fullName})`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`OTP CODE: ${otp}`);
    console.log("=================================================");

    // 1. Try Resend Delivery (if RESEND_API_KEY is configured)
    const resend = getResendClient();
    if (resend) {
      try {
        const from = process.env.EMAIL_FROM || "CV. Asia Plastik <onboarding@resend.dev>";
        const { data, error } = await resend.emails.send({
          from,
          to: email,
          subject,
          html,
        });

        if (error) {
          console.error("Resend delivery returned error:", error);
        } else {
          console.log("Resend email delivered successfully to", email, "ID:", data?.id);
          return { success: true, messageId: data?.id };
        }
      } catch (resendErr: any) {
        console.error("Exception during Resend delivery:", resendErr);
      }
    }

    // 2. Fallback to SMTP Nodemailer
    if (!transporter) {
      return { success: true, simulated: true };
    }

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error("Nodemailer failed to dispatch OTP email:", err);
      return { success: true, simulated: true, error: err?.message };
    }
  },

  /**
   * Send HRD Approval Status Email (ACC or Rejection)
   */
  async sendApprovalEmail(
    email: string,
    fullName: string,
    status: "APPROVED" | "REJECTED",
    reason?: string
  ): Promise<EmailResult> {
    const transporter = getTransporter();
    const fromAddress = process.env.SMTP_FROM || `"HRD CV. Asia Plastik" <hrd@asiaplastik.com>`;

    const isApproved = status === "APPROVED";
    const subject = isApproved
      ? `[ACC DITERIMA] Akun Presensi Magang CV. Asia Plastik Telah Disetujui`
      : `[PEMBERITAHUAN] Status Pendaftaran Akun Magang CV. Asia Plastik`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: ${isApproved ? "linear-gradient(135deg, #065f46, #059669)" : "linear-gradient(135deg, #991b1b, #dc2626)"}; padding: 32px 24px; text-align: center; color: #ffffff;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; font-weight: 900; font-size: 20px; margin-bottom: 12px;">ap</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800;">CV. ASIA PLASTIK</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500;">
            ${isApproved ? "Konfirmasi Persetujuan Akun Magang" : "Pemberitahuan Pendaftaran Magang"}
          </p>
        </div>

        <div style="padding: 32px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700;">Halo, ${fullName}!</h2>
          
          ${
            isApproved
              ? `
            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; margin: 18px 0;">
              <h3 style="margin: 0 0 6px 0; font-size: 16px; color: #065f46; font-weight: 700;">✓ Akun Anda Telah Di-ACC oleh HRD</h3>
              <p style="margin: 0; font-size: 13px; color: #047857; line-height: 1.5;">
                Pendaftaran akun Anda telah diverifikasi dan disetujui. Sekarang Anda dapat masuk ke aplikasi presensi menggunakan email dan kata sandi yang telah Anda daftarkan.
              </p>
            </div>
            <p style="margin: 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
              Silakan buka aplikasi dan lakukan absensi kehadiran harian sesuai jadwal shift kerja Anda di pabrik.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="https://absensi-49a9e.web.app/login" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
                Buka Halaman Masuk
              </a>
            </div>
          `
              : `
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 18px; margin: 18px 0;">
              <h3 style="margin: 0 0 6px 0; font-size: 16px; color: #991b1b; font-weight: 700;">Pendaftaran Tidak Disetujui</h3>
              <p style="margin: 0; font-size: 13px; color: #b91c1c; line-height: 1.5;">
                Mohon maaf, pendaftaran akun Anda belum dapat disetujui oleh HRD CV. Asia Plastik.
              </p>
              ${reason ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #7f1d1d; font-weight: 600;">Alasan: ${reason}</p>` : ""}
            </div>
            <p style="margin: 20px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
              Jika Anda merasa ini adalah kekeliruan, silakan hubungi koordinator magang atau bagian HRD CV. Asia Plastik.
            </p>
          `
          }
        </div>

        <div style="padding: 20px 24px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">CV. Asia Plastik Sidoarjo • Jl. Industri No. 45, Sidoarjo, Jawa Timur</p>
          <p style="margin: 0;">Divisi Sumber Daya Manusia (HRD) & Operasional Pabrik</p>
        </div>
      </div>
    `;

    console.log("=================================================");
    console.log(`[CV. ASIA PLASTIK - APPROVAL EMAIL DISPATCH]`);
    console.log(`TO: ${email} (${fullName})`);
    console.log(`STATUS: ${status}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("=================================================");

    // 1. Try Resend Delivery (if RESEND_API_KEY is configured)
    const resend = getResendClient();
    if (resend) {
      try {
        const from = process.env.EMAIL_FROM || "CV. Asia Plastik <onboarding@resend.dev>";
        const { data, error } = await resend.emails.send({
          from,
          to: email,
          subject,
          html,
        });

        if (error) {
          console.error("Resend delivery returned error:", error);
        } else {
          console.log("Resend approval email delivered successfully to", email, "ID:", data?.id);
          return { success: true, messageId: data?.id };
        }
      } catch (resendErr: any) {
        console.error("Exception during Resend delivery:", resendErr);
      }
    }

    // 2. Fallback to SMTP Nodemailer
    if (!transporter) {
      return { success: true, simulated: true };
    }

    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error("Nodemailer failed to dispatch approval email:", err);
      return { success: true, simulated: true, error: err?.message };
    }
  },
};
