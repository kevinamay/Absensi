import { Resend } from "resend";

import fs from "fs";
import path from "path";

// Read from process.env or parse .env.local safely
let apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  try {
    const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
    const match = envContent.match(/RESEND_API_KEY=["']?([^"'\r\n]+)["']?/);
    if (match) apiKey = match[1];
  } catch (e) {}
}

const resend = new Resend(apiKey);

async function testSend() {
  console.log("=== SENDING REAL TEST EMAIL VIA RESEND ===");
  const { data, error } = await resend.emails.send({
    from: "CV. Asia Plastik <onboarding@resend.dev>",
    to: "kevinamay23@gmail.com",
    subject: "[CV. Asia Plastik] Kode Verifikasi OTP Pendaftaran Magang",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">CV. ASIA PLASTIK</h2>
        <p>Halo Kevin Christian Amay,</p>
        <p>Gunakan kode OTP berikut untuk memverifikasi akun Anda:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #3b82f6;">
            847291
          </span>
        </div>
        <p style="font-size: 12px; color: #64748b;">Kode berlaku selama 10 menit. Jangan berikan kepada siapapun.</p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND ERROR:", error);
  } else {
    console.log("RESEND SUCCESS! Message ID:", data.id);
  }
}

testSend().catch(console.error);
