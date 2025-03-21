import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { ClientObj } from "../interfaces/ClientObj.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
config({export: true})

export async function sendWelcomeEmail(client: ClientObj) {
  const Smtpclient = new SmtpClient();
  const verifycationLink = `${
    Deno.env.get("APP_URL")
  }/verify-email?token=${client.verificationToken}`;

  try {
    await Smtpclient.connect({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("SMTP_USER"),
      password: Deno.env.get("SMTP_PASSWORD"),
    });

    await Smtpclient.send({
      from: "noreplyFitnessTracker.com",
      to: client.email,
      subject: `Welcome to Fitness Tracker ${client.firstName}`,
      content:
        "Welcome to Fitness Tracker! Please verify your email by clicking the link below: \n\n" +
        `http://localhost:3000/verify/${verifycationLink}`,
    });
  } catch (error) {
    console.error("Failed to send email", error);
  } finally {
    await Smtpclient.close();
  }
}
