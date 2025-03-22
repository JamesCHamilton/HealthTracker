import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

config({ export: true });

interface ClientObj {
  email: string;
  firstName: string;
  verificationToken: string;
}

export async function sendWelcomeEmail(user: ClientObj) {
  const verificationLink = `${Deno.env.get("APP_URL")}/verify-email?token=${
    user.verificationToken
  }`;

  try {
    // Connect with proper Gmail SMTP configuration
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USER")!,
          password: Deno.env.get("SMTP_PASSWORD")!,
        },
      },
    });

    await client.send({
      from: "Your Fitness Tracker <noreply@fitnesstracker.com>",
      to: user.email,
      subject: `Welcome to Fitness Tracker, ${user.firstName}!`,
      content: `Welcome to Fitness Tracker! Please verify your email by clicking the link below:
      
      ${verificationLink}
      
      If you didn't request this, please ignore this email.`,
      html: `<p>Welcome to Fitness Tracker! Please verify your email by clicking the link below:</p>
             <p><a href="${verificationLink}">Verify Email</a></p>
             <p>If you didn't request this, please ignore this email.</p>`
    });

    await client.close();

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send verification email");
  }
}