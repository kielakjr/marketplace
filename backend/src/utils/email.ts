import nodemailer from "nodemailer";
import Transport from "nodemailer-brevo-transport";
import { env } from "../config/env";

const transporter = nodemailer.createTransport(
  new Transport({ apiKey: env.SMTP_PASS })
);

export async function sendPasswordResetEmail(to: string, rawToken: string) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await transporter.sendMail({
    from: `"Marketplace" <${env.SMTP_FROM}>`,
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
