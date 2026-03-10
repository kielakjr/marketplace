import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, rawToken: string) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Resetowanie hasła",
    html: `
      <h2>Resetowanie hasła</h2>
      <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p>
      <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Link wygasa za 30 minut.</p>
      <p>Jeśli nie prosiłeś o zmianę hasła, zignoruj tę wiadomość.</p>
    `,
  });
}
